/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 播放调度层（js/playback.js）
 * --------------------------------------------------------------------------
 * 职责：把"一串带时间戳的音"编排成完整的播放体验——
 *         定时出声（audio.js 的 voice / clickVoice）
 *         定时点亮（键盘闪键 + 示意图方块 + "正在响"读出区）
 *         中途可被一键停止（TOKEN 播放代号机制）
 *       包含：seq（通用序列）、和弦进行/终止式的循环播放、场景配方播放。
 *
 * 依赖：audio.js（ac / voice / clickVoice / newBus / killBuses / TOKEN / MET）、
 *       keyboard.js（kbAuto / kbUserPanned / kbFollow / kbHomeAll，运行时）、
 *       utils.js（noteName）、data.js（M_OF / triad / PROGS / CADENCES）
 * 被谁用：sections.js（所有"▶ 播放"按钮最终都走到这里）
 * ========================================================================== */

/* LIT_SEL：点亮范围。null=全部示意图，''=都不亮，字符串=只亮该 id 内。
 * 每个播放入口按需设置，避免"弹大三却把小三的键也点亮" */
let LIT_SEL = null;

/* LIVE：当前正在发声的音（Map: MIDI号 → 重叠个数）。
 * 同一个键可以被多个声部同时踩住（和弦），所以要计数而不是简单 Set */
const LIVE = new Map();

/* 和弦进行 / 场景播放的全局状态（循环开关、循环定时器、当前选中的进行索引） */
let progLoop = false, progTimer = null, progIdx = 0;

/* dockRender()：把 LIVE 里的音按音高排序，渲染成底栏的"正在响"小琴键 */
function dockRender(){
  const el = $('#dockRead'); if (!el) return;
  const names = Array.from(LIVE.keys()).sort((a, b) => a - b).map(m => noteName(m));
  /* "正在响"标签常驻（见 .dsp .lv）；右侧只放键名，没有键在响时就是空的 */
  el.innerHTML = names.map(n => '<i class="kc">' + n + '</i>').join('');
}

/* flashKey：点亮一个音——键盘上所有对应 MIDI 的键 + 示意图里的方块。
 * midi：要亮的音
 * at：  该音的绝对发声时刻（AudioContext 时间轴）。预排程的音（和弦进行/场景/
 *       终止式）必须靠它把可视化延到正确时间，否则会在第 0 秒就把整条进行的键
 *       全点亮，之后反而全黑
 * ms：  亮多久（灭灯时间）
 * litKey：精确到"第几个音"的方块定位（旋律里同音的多个方块不会一起亮）；
 *         不传则退化为按音高全亮（rect[data-note=midi]）
 * tok：  注册时的播放代号。预排程的音如果中途被"停止"（TOKEN 递增），闪光必须
 *       一并取消，否则会出现"已经没声音了，琴键还在闪"的僵尸效果 */
function flashKey(midi, at, ms, litKey){
  if (midi == null) return;
  const tok = TOKEN;
  const A = ac();
  const delay = Math.max(0, (at - A.currentTime) * 1000);
  const t = ms || 220;
  const on = () => {
    if (tok !== TOKEN) return;   /* 已被停止：不亮 */
    document.querySelectorAll('.kb [data-m="' + midi + '"]').forEach(el => {
      el.classList.add('flash');
      clearTimeout(el._ft);
      el._ft = setTimeout(() => el.classList.remove('flash'), t);
      /* 教程播放中：发声键若落在可视区外，瞬间把键盘移过去（用户手动拖过则让位）；
         自己点键弹奏时不跟随——用户在主动探索，不抢他的方向 */
      if (kbAuto && !kbUserPanned) kbFollow(el.closest('.kb'), el);
    });
    if (LIT_SEL !== ''){
      const root = LIT_SEL ? document.getElementById(LIT_SEL) : document;
      const sel = litKey ? ('rect[data-lit="' + litKey + '"]') : ('rect[data-note="' + midi + '"]');
      if (root) root.querySelectorAll(sel).forEach(r => {
        r.classList.add('lit');
        clearTimeout(r._ft);
        r._ft = setTimeout(() => r.classList.remove('lit'), t);
      });
    }
    LIVE.set(midi, (LIVE.get(midi) || 0) + 1); dockRender();
  };
  const off = () => { if (tok !== TOKEN) return; const n = (LIVE.get(midi) || 1) - 1; if (n <= 0) LIVE.delete(midi); else LIVE.set(midi, n); dockRender(); };
  setTimeout(on, delay);
  setTimeout(off, delay + t);
}

/* stopAll()：全站总停止。递增 TOKEN 让所有在途定时器作废，
   淡出并断开所有总线，清空"正在响"，停节拍器，复位进行/场景高亮和键盘视口 */
function stopAll(){
  TOKEN++; killBuses(); LIT_SEL = null; if (MET.timer) MET.stop();
  LIVE.clear(); dockRender();   /* 停止后"正在响"必须归零，否则残留幽灵条目 */
  $$('.scene.playing').forEach(e => e.classList.remove('playing'));
  ['#rhythmDots','#tempoBeats','#metBeatsDots','#meterBeats'].forEach(s => $$(s + ' .beat').forEach(d => d.classList.remove('hit')));
  if (progTimer){ clearInterval(progTimer); progTimer = null; $('#progPlay').innerHTML = '<span class="tri">▶</span> 播放这个进行'; }
  kbUserPanned = false; kbAuto = false; kbHomeAll(500);   /* 停止 = 播放结束：键盘回 C4–B5 视口 */
}

/* seq()：通用序列播放。steps = [{at, m(音), d(时长), g(音量), kind, lit, c(拍点), strong, dot}]
 *   at = 相对第几秒；m = MIDI 号；c=1 表示这是节拍器拍点（无音高）
 *   lit = 精确点亮的方块 id；litSel = 本次播放的示意图作用域（''=不亮任何图）
 * 内部：先 stopAll 清场，开一条新总线（整体可静音），按 at 逐个排程；
 *       播完自动复位键盘视口与点亮作用域。 */
function seq(steps, litSel){
  stopAll();
  kbAuto = true;   /* 这一次播放的亮键要自动跟随（stopAll 刚把它关掉） */
  const tok = TOKEN, A = ac(), now = A.currentTime + 0.06;
  const max = Math.max.apply(null, steps.map(s => s.at));
  const bus = newBus((max + 3) * 1000);
  LIT_SEL = (litSel === undefined ? null : litSel);
  const maxEnd = max + Math.max.apply(null, steps.map(s => s.d || 0.9));
  /* 复位必须按"播放代号"判断：同一行连点两次时，字符串身份分不清新旧两次播放，
     旧定时器会把新播放的 LIT_SEL 清成 null，之后的方块就在整幅图上乱亮 */
  setTimeout(() => { if (tok !== TOKEN) return;
    if (LIT_SEL === (litSel === undefined ? null : litSel)) LIT_SEL = null;
    kbAuto = false; kbHomeAll(500);   /* 播完回到 C4–B5 视口，0.5s 动画 */
  }, (maxEnd + 0.5) * 1000);
  steps.forEach(s => {
    setTimeout(() => { if (tok !== TOKEN) return;
      if (s.c){ clickVoice(now + s.at, s.strong, s.dot); return; }
      voice(s.m, now + s.at, s.d || 0.9, s.g || 0.4, s.kind || 'piano', bus, s.lit); }, (s.at + 0.06) * 1000);
  });
}

/* ============ 和弦进行（第 05 节） ============ */

/* stopProg()：停止进行/终止式播放（与 stopAll 的区别：不动场景卡片高亮） */
function stopProg(){
  TOKEN++; killBuses(); LIVE.clear(); dockRender();
  if (progTimer){ clearInterval(progTimer); progTimer = null; }
  $('#progPlay').innerHTML = '<span class="tri">▶</span> 播放这个进行';
  $$('#progStrip > div,#cadStrip > div').forEach(b => b.classList.remove('hit'));
  kbUserPanned = false; kbAuto = false; kbHomeAll(500);   /* 同 stopAll：键盘回 C4–B5 视口 */
}

/* playProg(p)：播放一条和弦进行。每个和弦占 2 拍（spb*2），
 * 块状三音齐响 + 五音上方补一个 pluck 泛音；循环开关由 progLoop 控制 */
function playProg(p){
  stopProg();
  kbAuto = true;
  const tok = TOKEN, bpm = +$('#progBpm').value, spb = 60 / bpm;
  const mode = M_OF('ionian');
  const chords = p.d.map(d => triad(midiOct(0, 4), mode, d));
  const bus = newBus((spb * chords.length * 2 + 3) * 1000);
  $('#progPlay').textContent = '■ 播放中…';
  const one = () => {
    if (tok !== TOKEN){ if (progTimer){ clearInterval(progTimer); progTimer = null; } $('#progPlay').innerHTML = '<span class="tri">▶</span> 播放这个进行'; return; }
    const A = ac(), t0 = A.currentTime + 0.06;
    const blocks = $$('#progStrip > div');
    blocks.forEach(b => b.classList.remove('hit'));
    chords.forEach((c, i) => {
      const at = t0 + i * spb * 2;
      c.notes.forEach((m, k) => voice(m, at, spb * 2.1, 0.34 * (k === 0 ? 1 : 0.72), 'piano', bus));
      voice(c.notes[2] + 12, at + spb * 0.5, spb * 0.9, 0.16, 'pluck', bus);
      setTimeout(() => { if (tok !== TOKEN) return; blocks.forEach(b => b.classList.remove('hit')); blocks[i] && blocks[i].classList.add('hit'); }, (at - t0) * 1000);
    });
    setTimeout(() => { if (tok === TOKEN) blocks.forEach(b => b.classList.remove('hit')); }, chords.length * spb * 2 * 1000 + 300);
  };
  one();
  if (progLoop){ progTimer = setInterval(one, spb * chords.length * 2 * 1000); }
  else { setTimeout(() => { if (tok === TOKEN){ $('#progPlay').innerHTML = '<span class="tri">▶</span> 播放这个进行';
    kbAuto = false; kbHomeAll(500); } }, spb * chords.length * 2 * 1000 + 200); }
}

/* ============ 终止式（第 06 节） ============ */

/* playCadence(c)：播放一个终止式。固定 72 BPM，最后一个和弦时值拉长（落得更稳），
 * 并补一个高八度 pluck 让"回家"更明确 */
function playCadence(c){
  LIT_SEL = '';   /* 本节无示意图，不点亮任何方块 */
  stopProg();
  kbAuto = true;
  const tok = TOKEN, spb = 60 / 72, mode = M_OF('ionian');
  const chords = c.d.map(d => triad(midiOct(0, 4), mode, d));
  const bus = newBus((spb * chords.length * 2 + 3) * 1000);
  const one = () => {
    if (tok !== TOKEN){ $('#cadPlay').innerHTML = '<span class="tri">▶</span> 播放这个终止'; return; }
    const A = ac(), t0 = A.currentTime + 0.06;
    const blocks = $$('#cadStrip > div');
    blocks.forEach(b => b.classList.remove('hit'));
    chords.forEach((ch, i) => {
      const at = t0 + i * spb * 2, last = (i === chords.length - 1);
      ch.notes.forEach((m, k) => voice(m, at, last ? spb * 3.2 : spb * 2.1, last ? 0.38 * (k === 0 ? 1 : 0.7) : 0.32 * (k === 0 ? 1 : 0.7), 'piano', bus));
      if (last) voice(ch.notes[0] + 12, at, spb * 2.6, 0.14, 'pluck', bus);
      setTimeout(() => { if (tok !== TOKEN) return; blocks.forEach(b => b.classList.remove('hit')); blocks[i] && blocks[i].classList.add('hit'); }, (at - t0) * 1000);
    });
    setTimeout(() => { if (tok === TOKEN) blocks.forEach(b => b.classList.remove('hit')); }, chords.length * spb * 2 * 1000 + 300);
  };
  one();
  setTimeout(() => { if (tok === TOKEN){ kbAuto = false; kbHomeAll(500); } }, spb * chords.length * 2 * 1000 + 300);
}

/* ============ 场景配方（第 10 节） ============ */

/* scenePlay(cfg)：播放一张"听感配方"卡片。按 cfg.tex 织体类型组织音符：
 *   block    块状：三音齐响
 *   arpeggio 琶音：根三五 + 高八度根音，依次 pluck
 *   pulse    碎音：三个音各敲两下
 *   shimmer  微光：高八度四个碎音
 * 雨/风/微光环境声按 cfg.noise 叠一条噪声总线 */
function scenePlay(cfg){
  stopAll();
  LIT_SEL = '';   /* 本节无示意图，不点亮任何方块（须在 stopAll 之后设，否则会被重置） */
  kbAuto = true;
  const mode = M_OF(cfg.k), A = ac(), t0 = A.currentTime + 0.08;
  const spb = 60 / cfg.b, durPer = 2 * spb, total = durPer * cfg.prog.length;
  const bus = newBus((total + 3) * 1000);
  const tok = TOKEN;
  setTimeout(() => { if (tok === TOKEN){ kbAuto = false; kbHomeAll(500); } }, (total + 0.6) * 1000);
  /* 第一参必须是 root（0=C），oct 只决定八度。
     曾误写成 midiOct(cfg.oct,4)——把 oct 当成了 root：oct:3→基准 D♯3、oct:5→基准 F4，
     21 个场景全挤在两个半音内，"低音区/高音区"的描写完全没体现 */
  const chords = cfg.prog.map(d => triad(midiOct(0, cfg.oct), mode, d));
  chords.forEach((c, i) => {
    const at = t0 + i * durPer;
    if (cfg.tex === 'block'){ c.notes.forEach((m, k) => voice(m, at, durPer * 1.05, cfg.dyn * (k === 0 ? 1 : 0.7), 'piano', bus)); }
    else if (cfg.tex === 'arpeggio'){ c.notes.concat([c.notes[0] + 12]).forEach((m, k) => voice(m, at + k * spb / 2, spb * 0.85, cfg.dyn, 'pluck', bus)); }
    else if (cfg.tex === 'pulse'){ [0,1,2].forEach(k => { voice(c.notes[k], at, spb * 0.35, cfg.dyn * 0.9, 'pluck', bus); voice(c.notes[k], at + spb, spb * 0.35, cfg.dyn * 0.9, 'pluck', bus); }); }
    else { [0,1,2,3].forEach(k => voice(c.notes[k % 3] + 12, at + k * spb / 4, spb * 0.6, cfg.dyn * 0.8, 'pluck', bus)); }
  });
  if (cfg.noise === 'rain'){ noiseVoice(t0, total, 0.055, 'bandpass', 2400, 1800, bus); noiseVoice(t0, total, 0.03, 'highpass', 6000, null, bus); }
  else if (cfg.noise === 'wind'){ noiseVoice(t0, total, 0.06, 'lowpass', 420, 700, bus); }
  else if (cfg.noise === 'shimmer'){ noiseVoice(t0, total, 0.022, 'highpass', 5000, null, bus); }
}
