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

/* sceneEvents(cfg)：把一张卡片配置展开成一条音符时间线。**纯函数，不碰音频**。
 *   这是本次重写的关键——原来 scenePlay 既排程又发声，测试无法验证它到底排了什么，
 *   于是"方块上印的 BPM"和"实际听起来的速度"长期各说各话也没人发现。
 *   现在排程单独可测：tests/ 里直接拿这个函数的输出做统计。
 *
 *   返回 {steps:[{at,m,d,g,kind,bend}], beats, dur}
 *     at  = 相对起点的秒数    m = MIDI 号      d = 时值（秒）
 *     g   = 音量             kind = 音色 id   bend = 滑音半音数
 *
 *   排程规则：和弦周期固定 2 拍（TEX.hits 的坐标也是"拍"）。
 *     音头密度 = hits.length × b / 120（个/秒）——这是听感速度的唯一算法 */
function sceneEvents(cfg){
  const mode = M_OF(cfg.k), tex = TEX[cfg.tex] || TEX.block;
  const spb = 60 / cfg.b, beatLen = spb * 2;      /* 和声周期 = 2 拍 */
  /* 长音类织体（铺底/长音）一个和弦要拖好几拍，不能被 2 拍的和声周期腰斩——
     否则"空旷""死亡"这种卡片会变回两拍一下，听感全错。
     drone（长音）额外多给 2 拍空隙：音符只占周期的 2/3，剩下的静默
     就是"空旷""辽阔"这条规律的物理实现——声音之间留的空即空间。 */
  const span = tex.dur >= 4 ? tex.dur + 2 : Math.max(2, tex.dur);
  const period = spb * span;
  const steps = [];
  const root = midiOct(0, cfg.oct);
  cfg.prog.forEach((deg, ci) => {
    const at0 = ci * period;
    const ch = triad(root, mode, deg);
    tex.hits.forEach((hb, hi) => {
      const at = at0 + hb * spb;
      const dur = Math.min(tex.dur * spb, period);   /* 不许拖过本和弦的边界 */
      /* hit=1 的音加重——织体的重音位置就是它的"性格"所在 */
      const acc = (hi === 0) ? 1 : 0.72;
      if (tex.mode === 'chord'){
        /* 块状：三个音齐响，根音最响 */
        ch.notes.forEach((m, k) => steps.push({ at, m, d:dur, g:cfg.dyn * acc * (k === 0 ? 1 : 0.62), kind:tex.tone, bend:cfg.bend }));
        /* 块状也补一记高八度短音，否则节奏只剩"每两拍一下"，密度上不去 */
        if (tex.hits.length <= 2) steps.push({ at, m:ch.notes[2] + 12, d:Math.min(dur * 0.45, spb * 0.4), g:cfg.dyn * acc * 0.3, kind:'pluck' });
      } else if (tex.mode === 'open'){
        /* 空五度：只留和弦根音、它的纯五度、再加根音高八度。
           全是纯五/纯八——"纯净""冰冷""空旷"这类描述最直接的物理对应：
           纯五度听不出任何摩擦，而小二度/小三度一定听得出。
           注意两点：① 五度相对**和弦根**算（ch.notes[0]），不是相对主音；
                  ② 纯五度只有在调式第 4 级 = 7 个半音时才天然成立。
                     lydian 升了四级（#4），硬叠纯五会跑出调式——
                     那种情况退回"按调式取第 4 级"，让听感仍落在调内。 */
        const deg4 = mode.semis[4];
        const fifth = (deg4 === 7) ? ch.notes[0] + 7 : ch.notes[0] + (deg4 != null ? deg4 : 7);
        steps.push({ at, m:ch.notes[0], d:dur, g:cfg.dyn * acc, kind:tex.tone, bend:cfg.bend });
        steps.push({ at, m:fifth, d:dur, g:cfg.dyn * acc * 0.62, kind:tex.tone });
        steps.push({ at, m:ch.notes[0] + 12, d:dur * 0.7, g:cfg.dyn * acc * 0.34, kind:tex.tone });
      } else if (tex.mode === 'arp'){
        /* 琶音级进：把和弦音（含高八度根音）依次弹上去 */
        const seq = ch.notes.concat([ch.notes[0] + 12]);
        const m = seq[hi % seq.length];
        steps.push({ at, m, d:dur, g:cfg.dyn * acc, kind:tex.tone, bend:cfg.bend });
      } else if (tex.mode === 'grind'){
        /* 碾压：三十二分密集低音，音与音微微错开一点点相位。
           这是"闷""窒息""热浪"的织体——密度到极致时，人耳不再听音高，只听压力。 */
        const m = hi % 2 === 0 ? ch.notes[0] - 12 : ch.notes[0] - 12 + (hi % 4 === 1 ? 1 : 0);
        steps.push({ at, m, d:dur * 0.9, g:cfg.dyn * acc * (hi % 2 === 0 ? 1 : 0.72), kind:tex.tone });
        if (hi % 4 === 0) ch.notes.slice(1).forEach(n => steps.push({ at, m:n, d:dur * 0.7, g:cfg.dyn * acc * 0.34, kind:tex.tone }));
      } else if (tex.mode === 'drive'){
        /* 驱动：正拍弹完整和弦，反拍弹低八度根音，制造"踩着走"的推进感 */
        if (hi % 2 === 0) ch.notes.forEach((m, k) => steps.push({ at, m, d:dur, g:cfg.dyn * acc * (k === 0 ? 1 : 0.55), kind:tex.tone }));
        else steps.push({ at, m:ch.notes[0] - 12, d:dur * 0.8, g:cfg.dyn * acc * 0.7, kind:tex.tone });
      } else {
        /* bell：只在正拍敲钟，余音自己拖 */
        steps.push({ at, m:ch.notes[0] + (hi ? 12 : 0), d:dur, g:cfg.dyn * acc, kind:tex.tone });
      }
      /* 摩擦层：与和弦根音同时叠一个上方半音 + 它的低八度（C♯/C 那种夹击）。
         「灼热」「病痛」「紧张」「砂石」——热不是"快"，痛也不是"快"，
         它们是**空气在摩擦**：两个音必须真的同时只差 1 个半音地响，
         耳朵才会听到那种"嘶"。光靠调式里的降二级三和弦是不够的
         （那个三和弦内部最小音程仍有 3 个半音，听着只是"暗"不是"痛"）。
         摩擦音天生不属于调式——这正是它存在的意义，也是 F5 测试豁免它的原因。 */
      if (cfg.friction && hi === 0){
        steps.push({ at, m:ch.notes[0] + 1, d:dur * 1.15, g:cfg.dyn * acc * 0.3, kind:tex.tone });
        steps.push({ at, m:ch.notes[0] + 13, d:dur * 0.85, g:cfg.dyn * acc * 0.17, kind:tex.tone });
      }
    });
  });
  const beats = cfg.prog.length * span;
  return { steps, beats, dur:beats * spb, period };
}

/* sceneRate(cfg)：算出这张卡片的实际音头密度（个/秒）。
 *   卡片上"听感速度"那一栏显示的就是它，测试也拿它跟卡片自报的 r 对账 */
function sceneRate(cfg){
  const tex = TEX[cfg.tex] || TEX.block;
  return tex.hits.length * cfg.b / 120;
}

/* scenePlay(cfg)：播放一张"听感配方"卡片。排程全部交给 sceneEvents，
 *   这里只负责把 steps 变成声音 + 铺环境噪声 */
function scenePlay(cfg){
  stopAll();
  LIT_SEL = '';   /* 本节无示意图，不点亮任何方块（须在 stopAll 之后设，否则会被重置） */
  kbAuto = true;
  const A = ac(), t0 = A.currentTime + 0.08;
  const ev = sceneEvents(cfg);
  const bus = newBus((ev.dur + 3) * 1000);
  const tok = TOKEN;
  setTimeout(() => { if (tok === TOKEN){ kbAuto = false; kbHomeAll(500); } }, (ev.dur + 0.6) * 1000);
  ev.steps.forEach(s => voice(s.m, t0 + s.at, s.d, s.g, s.kind, bus, null, s.bend));
  sceneNoise(cfg.noise, t0, ev.dur, bus);
}
