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

/* ============ 场景配方（第 13 节） ============ */

/* sceneEvents(cfg)：把一张卡片配置展开成一条音符时间线。**纯函数，不碰音频**。
 *   这是本次重写的关键——原来 scenePlay 既排程又发声，测试无法验证它到底排了什么，
 *   于是"方块上印的 BPM"和"实际听起来的速度"长期各说各话也没人发现。
 *   现在排程单独可测：tests/ 里直接拿这个函数的输出做统计。
 *
 *   返回 {steps:[{at,m,d,g,kind,bend}], beats, dur}
 *     at  = 相对起点的秒数    m = MIDI 号      d = 时值（秒）
 *     g   = 音量             kind = 音色 id   bend = 滑音半音数
 *
 *   排程规则：TEX.hits 的坐标是"拍"，一个和弦占几拍由 texSpan(tex) 决定
 *     （普通织体 2 拍，长音织体 6–7 拍——声音之间留的空即空间）。
 *     音头密度 = hits.length × BPM ÷ (texSpan × 60)（个/秒）——这是听感速度的唯一算法 */
/* texSpan(tex)：一个和弦占几拍。
 *   **这是密度公式的分母，必须与 sceneEvents 里真正用的那个 span 是同一个值。**
 *   长音类织体（铺底/长音）一个和弦要拖好几拍，不能被 2 拍的和声周期腰斩——
 *   否则"空旷""死亡"这种卡片会变回两拍一下，听感全错。
 *   drone（长音）额外多给 2 拍空隙：音符只占周期的 2/3，剩下的静默
 *   就是"空旷""辽阔"这条规律的物理实现——声音之间留的空即空间。
 *
 *   ⚠ 曾经 sceneEvents 里内联写着这条规则、而密度公式假设"周期恒为 2 拍"，
 *     于是 30/91 张卡片自报的听感速度偏高 20%–250%（pad/drone 高 200%）。
 *     现在抽成函数，两处共用，不会再走散。 */
function texSpan(tex){ return tex.dur >= 4 ? tex.dur + 2 : Math.max(2, tex.dur); }

function sceneEvents(cfg){
  const mode = M_OF(cfg.k), tex = TEX[cfg.tex] || TEX.block;
  /* 音色：默认跟着织体走（织体自带最合适的音色），
     但场景可以自己指定 tn 覆盖——国风/和风那批卡片要用竹笛、尺八这些乐器音色，
     光靠调式只能定「调」，定不了「腔调」。 */
  const tone = (cfg.tn && TONES[cfg.tn]) ? cfg.tn : tex.tone;
  const spb = 60 / cfg.b;
  const span = texSpan(tex);                 /* 一个和弦占几拍——与密度公式共用同一来源 */
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
        ch.notes.forEach((m, k) => steps.push({ at, m, d:dur, g:cfg.dyn * acc * (k === 0 ? 1 : 0.62), kind:tone, bend:cfg.bend }));
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
        steps.push({ at, m:ch.notes[0], d:dur, g:cfg.dyn * acc, kind:tone, bend:cfg.bend });
        steps.push({ at, m:fifth, d:dur, g:cfg.dyn * acc * 0.62, kind:tone });
        steps.push({ at, m:ch.notes[0] + 12, d:dur * 0.7, g:cfg.dyn * acc * 0.34, kind:tone });
      } else if (tex.mode === 'arp'){
        /* 琶音级进：把和弦音（含高八度根音）依次弹上去 */
        const seq = ch.notes.concat([ch.notes[0] + 12]);
        const m = seq[hi % seq.length];
        steps.push({ at, m, d:dur, g:cfg.dyn * acc, kind:tone, bend:cfg.bend });
      } else if (tex.mode === 'grind'){
        /* 碾压：三十二分密集低音，音与音微微错开一点点相位。
           这是"闷""窒息""热浪"的织体——密度到极致时，人耳不再听音高，只听压力。 */
        const m = hi % 2 === 0 ? ch.notes[0] - 12 : ch.notes[0] - 12 + (hi % 4 === 1 ? 1 : 0);
        steps.push({ at, m, d:dur * 0.9, g:cfg.dyn * acc * (hi % 2 === 0 ? 1 : 0.72), kind:tone });
        if (hi % 4 === 0) ch.notes.slice(1).forEach(n => steps.push({ at, m:n, d:dur * 0.7, g:cfg.dyn * acc * 0.34, kind:tone }));
      } else if (tex.mode === 'drive'){
        /* 驱动：正拍弹完整和弦，反拍弹低八度根音，制造"踩着走"的推进感 */
        if (hi % 2 === 0) ch.notes.forEach((m, k) => steps.push({ at, m, d:dur, g:cfg.dyn * acc * (k === 0 ? 1 : 0.55), kind:tone }));
        else steps.push({ at, m:ch.notes[0] - 12, d:dur * 0.8, g:cfg.dyn * acc * 0.7, kind:tone });
      } else {
        /* bell：只在正拍敲钟，余音自己拖 */
        steps.push({ at, m:ch.notes[0] + (hi ? 12 : 0), d:dur, g:cfg.dyn * acc, kind:tone });
      }
      /* 摩擦层：与和弦根音同时叠一个上方半音 + 它的低八度（C♯/C 那种夹击）。
         「灼热」「病痛」「紧张」「砂石」——热不是"快"，痛也不是"快"，
         它们是**空气在摩擦**：两个音必须真的同时只差 1 个半音地响，
         耳朵才会听到那种"嘶"。光靠调式里的降二级三和弦是不够的
         （那个三和弦内部最小音程仍有 3 个半音，听着只是"暗"不是"痛"）。
         摩擦音天生不属于调式——这正是它存在的意义，也是 F5 测试豁免它的原因。 */
      if (cfg.friction && hi === 0){
        steps.push({ at, m:ch.notes[0] + 1, d:dur * 1.15, g:cfg.dyn * acc * 0.3, kind:tone });
        steps.push({ at, m:ch.notes[0] + 13, d:dur * 0.85, g:cfg.dyn * acc * 0.17, kind:tone });
      }
    });
  });

  /* 调式内旋律（mg）：让长音卡片也能"唱出"调式。
   *
   *   为什么需要它：pad/drone/bell 这类织体只弹**根音**，一张 12 秒的卡片
   *   可能只有 2 个音在响。问题来了——都节音阶 [0,2,3,7,8] 的辨识度全在
   *   2 与 3（那两个小二度）上，可只用根音的话，这两个音一个都不会出现，
   *   听起来就是个与调式无关的空长音。**换调式却听不出差别，这张卡就白做了。**
   *
   *   mg 是一串**音级下标**（相对主音，用 mode.semis 取音），走的是
   *   调式内部的音，所以既保证不跑调，又能让辨识音真的响起来。
   *   写法：{ mg:[0,1,2,1,0], mgGain:0.6 } —— 每个音相隔一拍，力度是 dyn 的 mgGain 倍。
   *   不写 mg 的卡片行为完全不变（向后兼容）。 */
  if (cfg.mg && cfg.mg.length){
    const sem = mode.semis, n = sem.length;
    const mgGain = (cfg.mgGain == null ? 0.55 : cfg.mgGain);
    /* 音级下标 -> 半音偏移。超出 [0,n) 的部分按八度换算
       （与 triad 里 get() 是同一套规则：i>=n 就是高八度） */
    const off = i => sem[((i % n) + n) % n] + Math.floor(i / n) * 12;
    /* mgOct：旋律整体抬几个八度，默认 1。
       为什么默认抬一档：底下的 pad/drone 已经在 root 上响了，
       旋律若也在同一音高，两者同音叠加只是"更响"不会"更丰富"——
       抬一个八度后旋律才真正浮在长音之上，形成"低吟高唱"的层次。 */
    const mOct = (cfg.mgOct == null ? 1 : cfg.mgOct) * 12;
    cfg.mg.forEach((deg, gi) => {
      /* 一拍一个音；mgStep 可调（0.5 = 半拍一个，更密） */
      const at = gi * spb * (cfg.mgStep || 1);
      steps.push({ at, m: root + off(deg) + mOct,
                   d:Math.min(spb * 0.9, period * 0.5),
                   g:cfg.dyn * mgGain, kind:tone });
    });
  }

  const beats = cfg.prog.length * span;
  return { steps, beats, dur:beats * spb, period };
}

/* sceneRate(cfg)：算出这张卡片的实际音头密度（个/秒）。
 *   卡片上"听感速度"那一栏显示的就是它，测试也拿它跟卡片自报的 r 对账。
 *
 *   公式：**每和弦的音头数 ÷ 一个和弦实际占多少秒**
 *       = hits.length × BPM ÷ (span × 60)
 *   分母里的 span 必须与 sceneEvents 真正排程用的周期一致（见 texSpan）——
 *   早先这里写死"周期＝2 拍"，而 pad/drone 实际 6 拍、openair 7 拍、bell 3 拍，
 *   于是 30/91 张卡片自报的速度偏高 20%–250%（长音卡偏高 200%）。
 *   BPM 在这里只是名义值：真正决定快慢的是"每秒敲几下"。 */
function sceneRate(cfg){
  const tex = TEX[cfg.tex] || TEX.block;
  return tex.hits.length * cfg.b / (texSpan(tex) * 60);
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

/* ============ 词曲咬合（第 11 节） ============
 * 这一节的声音和前面所有节都不一样：前面是"乐器在响"，这里是"字在被念出来"。
 * 做法是**一个字配一个音 + 一条滑音（bend）**——人声念字的本质就是
 * 一个音节内部音高在动，所以滑音比两个离散音更像"说话"。
 * 音色统一用二胡：它起音慢、音区贴人声，是这套合成器里最接近人声的一档。
 * ========================================================================== */

/* toneEvents(words, flip, spb)：把一句词排成逐字滑音的时间线。**纯函数，不碰音频**。
 *
 *   words = [[汉字, 声调], ...]
 *   flip  = false 顺字（走向跟着字调走） / true 倒字（走向取反）
 *   spb   = 每个字占多少秒（默认 0.46，接近说话的字速）
 *
 * 返回 {steps, dur}。每个字一步：m = 起音，bend = 字内滑动量。
 * 测试 D3 会拿它验证"倒字必须是把顺字翻过来"——所以这里的算法不能随便改，
 * 也别把 TONE_SHAPE 的数值改成浮点（bend 会变成小数，滑音听起来反而糊）。 */
function toneEvents(words, flip, spb){
  spb = spb || 0.46;
  const base = midiOct(0, 4), steps = [];
  words.forEach((w, i) => {
    const [a, b] = (TONE_SHAPE[w[1]] || TONE_SHAPE[1])[flip ? 'flip' : 'fit'];
    steps.push({ at: i * spb, m: base + a, d: spb * 0.92, g: 0.44, kind: 'erhu', bend: b - a });
  });
  return { steps, dur: words.length * spb };
}

/* lyricTone(words, flip)：播放顺字版或倒字版。
 * 图里没有 rect，所以第 2 个参数传 'lyricFig' 只是把点亮范围收在本节——
 * 真正会亮的是底部钢琴的键（音高走得对不对，看键盘比看图更直接）。 */
function lyricTone(words, flip){
  const ev = toneEvents(words, flip);
  seq(ev.steps, 'lyricFig');
}

/* lyricStress(ver)：重音对位。三个版本的**音高完全相同**，只改拍位与时值——
 * 所以听出来的差别一定来自"重音给了谁"，不是"换了条旋律"。
 * 底下铺一层拍点（4/4，第 1、3 拍重），否则"落在第几拍"根本听不出来。 */
function lyricStress(ver){
  const base = midiOct(0, 4), spb = 60 / 72, st = [];
  for (let i = 0; i < 8; i++) st.push({ at: i * spb, c: 1, strong: i % 4 === 0, dot: i % 4 });
  LYRIC_STRESS.w.forEach((w, i) => {
    const a = (TONE_SHAPE[w[1]] || TONE_SHAPE[1]).fit[0];
    st.push({ at: ver.at[i] * spb, m: base + a, d: ver.dur[i] * spb * 0.95, g: 0.46, kind: 'erhu' });
  });
  seq(st, '');
}

/* lyricPhrase(mode)：一字一音 vs 拖腔。同一句词、同样 4 拍。
 *   'speech' 每字半拍平均分完（8 字 × 0.5 = 4 拍）→ 像说话
 *   'sing'   前七字挤在 0.22 拍内，末字拐三个音吃掉剩下的 2.46 拍 → 才像"唱"
 * 末字三个音走 2→4→2 半音（上挑再回来），这是中文歌最典型的拖腔拐法。 */
function lyricPhrase(mode){
  const P = LYRIC_PHRASE, base = midiOct(0, 4), spb = 60 / P.bpm;
  const n = P.w.length, st = [];
  const hi = w => base + (TONE_SHAPE[w[1]] || TONE_SHAPE[1]).fit[0];
  if (mode === 'speech'){
    const per = P.beats / n;
    P.w.forEach((w, i) => st.push({ at: i * per * spb, m: hi(w), d: per * spb * 0.9, g: 0.44, kind: 'erhu' }));
  } else {
    const head = 0.22;                       /* 前七字各占 0.22 拍 */
    P.w.forEach((w, i) => {
      if (i < n - 1) st.push({ at: i * head * spb, m: hi(w), d: head * spb * 0.85, g: 0.44, kind: 'erhu' });
      else {
        const t0 = (n - 1) * head, span = P.beats - t0;
        [2, 4, 2].forEach((iv, k) => st.push({ at: (t0 + k * span / 3) * spb, m: base + iv, d: span / 3 * spb * 0.98, g: 0.44, kind: 'erhu' }));
      }
    });
  }
  seq(st, '');
}

/* lyricBreath(line)：气口。把一句话均匀塞进 LYRIC_BREATH.beats 拍里，
 * 每字分到几拍就是"有没有地方喘气"。
 * 音高按字序在 3 个音之间循环——只为让句子可听，不承担任何表达。 */
function lyricBreath(line){
  const B = LYRIC_BREATH, spb = 60 / B.bpm, n = line.n;
  const per = B.beats / n, cyc = [5, 7, 8];
  const st = [];
  for (let i = 0; i < B.beats; i++) st.push({ at: i * spb, c: 1, strong: i % 4 === 0, dot: i % 4 });
  for (let i = 0; i < n; i++) st.push({ at: i * per * spb, m: midiOct(0, 4) + cyc[i % 3], d: per * spb * 0.88, g: 0.44, kind: 'erhu' });
  seq(st, '');
}

/* ============ 语言计时法（第 11 节 ⑦） ============
 * 三条时间轴都是 8 拍。**这里唯一要听出来的东西是"每格多宽"**：
 * 中文每字一样宽；英文只有重音宽，虚词被挤窄。
 * 音高只负责让字站得住（中文按字调走，英文重音高、虚词低），
 * 不承担表达——所以强弱只有 s（重音）这一个维度，没有渐强渐弱。 */
function langTiming(id){
  const L = LANG_TIMING, spb = 60 / L.bpm, base = midiOct(0, 4);
  const row = L.rows.find(r => r.id === id) || L.rows[0];
  const st = [];
  for (let i = 0; i < L.beats; i++) st.push({ at: i * spb, c: 1, strong: i % 4 === 0, dot: i % 4 });
  row.syl.forEach((s, i) => {
    const sh = s.tg != null ? (TONE_SHAPE[s.tg] || TONE_SHAPE[1]).fit : null;
    const m = sh ? sh[0] : s.m;
    /* 最短 0.08 秒：英文长句里 "gon / na" 只有 0.16 拍，再短就变成一个咔哒声了 */
    st.push({ at: s.b * spb, m: base + m, d: Math.max(0.08, s.d * spb * 0.92),
              g: s.s ? 0.5 : 0.34, kind: 'erhu', bend: sh ? sh[1] - sh[0] : 0, lit: 'lt' + id + '_' + i });
  });
  seq(st, 'langFig');
}

/* ============ 粤语入声（第 11 节 ⑧） ============
 * 演示的不是发音，是**时值**：一个 -p 收尾的入声字，
 *   hold=true  硬拖满两拍 —— 塞音被拉开，字听不出来
 *   hold=false 一拍就断开 —— 尾音收住，字还在
 * 合成器发不出 -p，所以第二版用"主音 1 拍 + 一个极短的木声收尾"示意"收住"。
 * 这是一个示意图，不是粤语示范——文案里也这么写。 */
function cantonPlay(hold){
  const C = CANTON, spb = 60 / C.bpm, base = midiOct(0, 4);
  const st = [];
  for (let i = 0; i < C.beats; i++) st.push({ at: i * spb, c: 1, strong: i % 4 === 0, dot: i % 4 });
  if (hold){
    st.push({ at: 0, m: base + 4, d: C.demo.err.d * spb * 0.96, g: 0.5, kind: 'erhu', lit: 'ctErr' });
  } else {
    st.push({ at: 0, m: base + 4, d: spb * 0.72, g: 0.5, kind: 'erhu', lit: 'ctOk' });
    st.push({ at: spb * 0.74, m: base + 4, d: spb * 0.1, g: 0.32, kind: 'wood', lit: 'ctOk' });
  }
  seq(st, 'cantonFig');
}

/* ============ 12 小节布鲁斯（第 10 节） ============
 * 这一节要听两件事：① 十二格的和声怎么走 ② 词的三行落在哪四格上。
 *
 * 律动是 shuffle：每拍的八分音符不是均分的，后半个往后挪到 2/3 处
 * （三连音里的"长—短"）。这就是布鲁斯听起来"拖"的原因，
 * 少这一下就变成了直的进行曲。
 *
 * 低音在每格的第 1、3 拍（根音 + 五度），和弦在三个后半拍上短促一戳。
 * 低音的每一步都带 lit:bar{n} —— 十二格里当前那一格随之亮起，
 * 于是"第 9 格第一次变成 V7"这件事是能看见的，不只是一句话。 */
function bluesEvents(withWords){
  const B = BLUES_FORM, spb = 60 / B.bpm, base = midiOct(0, 3), st = [];
  B.chords.forEach((c, bar) => {
    const t0 = bar * B.beats * spb;
    st.push({ at: t0, m: base + c.deg, d: spb * 1.5, g: 0.44, kind: 'bass', lit: 'bar' + bar });
    st.push({ at: t0 + 2 * spb, m: base + c.deg + 7, d: spb * 1.2, g: 0.34, kind: 'bass' });
    /* 三个后半拍：2/3、1+2/3、3（第 4 拍的后半留给下一格的低音） */
    [2 / 3, 1 + 2 / 3, 3].forEach(off => {
      [0, 4, 7, 10].forEach((iv, k) => {
        st.push({ at: t0 + off * spb, m: base + 12 + c.deg + iv, d: spb * 0.34,
                  g: k === 0 ? 0.19 : 0.15, kind: 'wood' });
      });
    });
  });
  if (withWords){
    B.lines.forEach((L, li) => {
      const t0 = L.at * B.beats * spb;
      L.w.forEach((w, i) => {
        const sh = (TONE_SHAPE[w[1]] || TONE_SHAPE[1]).fit;
        const last = i === L.w.length - 1;
        st.push({ at: t0 + i * spb, m: base + 24 + sh[0], d: spb * (last ? 1.9 : 0.92),
                  g: 0.46, kind: 'erhu', bend: sh[1] - sh[0] });
      });
    });
  }
  return { steps: st, dur: B.bars * B.beats * spb };
}

/* playBlues(withWords)：播放整段（或只播和声）。
 * 词的每一行由它自己的第一个音点亮 —— 一句亮一次，不是一字亮一次：
 * 这一卡讲的是"行与格"的关系，逐字高亮会把注意力拉到字上。 */
function playBlues(withWords){
  const ev = bluesEvents(withWords);
  seq(ev.steps, 'bluesFig');
}

/* ============ 第 09 节 · 律动 ============ */

/* grooveCfg(row)：把一行律动翻译成一张"场景配方"的配置。
 * 为什么能这样借：织体表 TEX 本来就是"音头落在第几拍"，
 * 而律动要问的正是这三件事（密度/重音/音长），所以不需要新的合成器。 */
function grooveCfg(row){
  const G = GROOVE;
  return { k:G.k, b:G.bpm, oct:G.oct, tex:row.tex, prog:G.prog, dyn:0.5 };
}

/* grooveEvents / grooveRate：排程与密度都直接复用场景那套纯函数。
 * 测试拿 grooveRate 和"hits 数 ÷ 每和弦拍数"对账，保证表格里的数字不是手写的。 */
function grooveEvents(row){ return sceneEvents(grooveCfg(row)); }
function grooveRate(row){ return sceneRate(grooveCfg(row)); }

/* playGroove(row)：同一段和声（i–VI–III–VII），只换织体。
 * 听感的差别全部来自节奏型本身——这是"节奏型决定性格"最干净的对照实验。 */
function playGroove(row){
  const ev = grooveEvents(row);
  seq(ev.steps, '');
}

/* ============ 第 14 节 · 配器 ============ */

/* ensembleEvents(row)：把三种"角色"叠在同一段时间上。
 *
 *   主乐层（mel:true）—— 永远弹 ENSEMBLE.melody 那一条，一音不改。
 *   和声层 / 铺底层   —— 按 hit（单位：拍）打和弦音，dur 是音长。
 *
 * 关键约定：**旋律写成"相对主音的半音数"而不是调式级数**。
 * 级数会跟着和声变形（同一个级数在不同和弦上是不同音），
 * 半音数不会——所以换编制、换音区，听到的都是同一条旋律。
 * 这条是本节全部说服力的来源：旋律不变，只有"谁在说"在变。 */
function ensembleEvents(row){
  const E = ENSEMBLE, spb = 60 / E.bpm, mode = M_OF(E.k), bar = spb * 2;
  const steps = [];
  row.layers.forEach(L => {
    /* 主乐 */
    if (L.mel){
      const base = midiOct(0, L.oct);
      E.melody.forEach(n => steps.push({
        at: n.b * spb, m: base + n.s, d: n.d * spb * 0.96,
        g: L.dyn, kind: L.tone,
      }));
      return;
    }
    /* 和声 / 铺底：一个和弦 2 拍 */
    E.prog.forEach((deg, ci) => {
      const ch = triad(midiOct(0, L.oct), mode, deg);
      L.hit.forEach(h => {
        const at = ci * bar + h * spb;
        const dur = Math.min((L.dur || 1) * spb, bar - h * spb);
        ch.notes.forEach((m, k) => steps.push({
          at, m, d:dur, g:L.dyn * (k === 0 ? 1 : 0.62), kind:L.tone,
        }));
      });
    });
  });
  /* 排程按时间排序：seq 内部逐条 setTimeout，顺序不影响发声，
     但保持有序能让测试和信息面板读起来更像"谱面" */
  steps.sort((a, b) => a.at - b.at || a.m - b.m);
  return { steps, beats:E.beats, dur:E.beats * spb };
}

function playEnsemble(row){
  const ev = ensembleEvents(row);
  seq(ev.steps, '');
}

/* ---- 跨曲动机：同一轮廓的两个版本（第 14 节收尾）------------------------
 * 与 ensembleEvents 同一套写法：纯函数，不碰音频，返回可被测试直接对账的
 * 事件表。旋律音只认 `s`（半音偏移），pad / harm / bell 是三个可选层，
 * 都是"主音和弦的第 0 级反复打点"。缺哪个层就跳过——这决定了"几个声音"。
 */
function motifEvents(ver){
  const M = MOTIF, spb = 60 / M.bpm, mode = M_OF(M.k), base = midiOct(0, M.oct);
  const steps = [];
  ver.notes.forEach(n => steps.push({
    at: n.b * spb, m: base + n.s, d: n.d * spb * 0.96, g: .70, kind: 'piano',
  }));
  ['pad', 'harm', 'bell'].forEach(key => {
    const L = ver[key];
    if (!L) return;
    const ch = triad(midiOct(0, L.oct), mode, 0);
    L.hit.forEach(h => {
      const at = h * spb;
      const dur = Math.min(L.dur * spb, M.beats * spb - at);
      ch.notes.forEach((m, k) => steps.push({
        at, m, d: dur, g: L.dyn * (k === 0 ? 1 : .62), kind: L.tone,
      }));
    });
  });
  steps.sort((a, b) => a.at - b.at || a.m - b.m);
  return { steps, beats: M.beats, dur: M.beats * spb };
}

function playMotif(ver){
  const ev = motifEvents(ver);
  seq(ev.steps, '');
}

/* ---- 人声舒适音区（第 11 节 ⑨）-------------------------------------------
 * 同一串相对音高（do-re-mi-sol-mi-re），只是整体落在不同音区。
 * 三个版本的**音程关系完全一样**，变的只有绝对音高——
 * 所以听出来的差别一定来自"音区"，不是"换了条旋律"。
 * 音色用二胡：这套合成器里起音最慢、音区贴人声，最接近人唱歌。 */
function voiceRangeEvents(row){
  const V = VOICE_RANGE.demo, spb = 60 / V.bpm, base = midiOct(0, row.oct);
  const steps = V.shape.map((s, i) => ({
    at: i * spb, m: base + s, d: spb * 0.92, g: 0.62, kind: 'erhu',
  }));
  return { steps, beats: V.shape.length, dur: V.shape.length * spb };
}

function playVoiceRange(row){
  const ev = voiceRangeEvents(row);
  seq(ev.steps, '');
}

/* ---- 动机生成法（第 14 节 ⑤）-------------------------------------------
 * 和 motifEvents 同一套写法：纯函数，返回事件表，测试直接对账。
 * 母动机与五种生成结果摆在一起听——耳朵一听就知道"每种手法改的是哪一样"。
 * 这里只排旋律层：这一节的论点全在音高与节奏上，垫音反而会挡住差别。 */
function motifGenEvents(m){
  const GEN = MOTIF_GEN, spb = 60 / GEN.bpm, base = midiOct(0, GEN.oct);
  const steps = (m.notes || GEN.base.notes).map(n => ({
    at: n.b * spb, m: base + n.s, d: n.d * spb * 0.96, g: .70, kind: 'piano',
  }));
  steps.sort((a, b) => a.at - b.at || a.m - b.m);
  return { steps, beats: 8, dur: 8 * spb };
}

function playMotifGen(m){
  const ev = motifGenEvents(m);
  seq(ev.steps, '');
}

/* ---- shuffle：同一段和声，只把第二下挪个位置（第 10 节 ②）-----------------
 * 两个版本的**音高、音头数、和弦进行完全一样**，唯一变量是 kind.offs：
 *   straight [0, ½]  —— 第二下在一半
 *   shuffle  [0, ⅔]  —— 第二下在三分之二
 * 所以两个事件表逐条对得上（条数相同、音高相同），只有 at 和音长不同。
 * 测试（G8）就靠这个对称性来证明"变的是位置，不是别的东西"。
 *
 * 编配上用 boogie 的老办法：第 1 下走低音（根音 / 五度交替），
 * 第 2 下给一个和弦短刷——后半拍那一下正是 shuffle 最容易听出来的地方。
 */
function shuffleEvents(kind){
  const S = SHUFFLE, spb = 60 / S.bpm, base = midiOct(0, S.oct), st = [];
  const mode = M_OF(S.k), per = S.beats / S.prog.length;   /* 一个和弦几拍 */
  const lens = [kind.offs[1] - kind.offs[0], 1 - kind.offs[1]];   /* 两下各多长 */
  S.prog.forEach((deg, ci) => {
    for (let b = 0; b < per; b++){
      const t0 = (ci * per + b) * spb;
      kind.offs.forEach((off, i) => {
        const at = t0 + off * spb, d = lens[i] * spb * 0.94;
        st.push({ at, m: base + deg + (i ? 7 : 0), d, g: i ? 0.34 : 0.46, kind: 'bass' });
        if (i === 1){
          const ch = triad(midiOct(0, S.oct + 1), mode, deg);
          ch.notes.forEach((m, k) => st.push({ at, m, d: Math.min(d, spb * 0.3),
                                               g: k === 0 ? 0.26 : 0.19, kind: 'wood' }));
        }
      });
    }
  });
  st.sort((a, b) => a.at - b.at || a.m - b.m);
  return { steps: st, beats: S.beats, dur: S.beats * spb };
}

function playShuffle(kind){
  const ev = shuffleEvents(kind);
  seq(ev.steps, '');
}
