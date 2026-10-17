/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 钢琴键盘层（js/keyboard.js）
 * --------------------------------------------------------------------------
 * 职责：页面上两架键盘的共同组件——
 *         第 00 节的 #kb   ：固定只画 C4–B5（data-fixed，不可拖）
 *         底部常驻的 #dockKb：完整音域 C3–D7（可拖拽平移）
 *       包含：键盘绘制、调式亮键、发声闪键、视口管理（复位/边缘跟随/拖拽）。
 *
 * 依赖：data.js（M_OF）、utils.js（midiOct / noteName / $ / $$）、
 *       playback.js（flashKey → kbFollow / kbHomeAll，运行时互相调用）
 * 被谁用：sections.js（buildSelects 改调时重绘）、app.js（init 时首次渲染）
 * ========================================================================== */

/* ============ 交互 ============ */

/* 钢琴音域：常驻钢琴（#dockKb）画 C3 – D7。
   下限 C3 是实测出来的：主歌示范句（#hookVerse）与低音区场景（孤独的/暴雨/闷热）都落在 C3。
   上限 D7 也是实测出来的：修掉场景 oct bug 后，"梦幻的"的微光琶音（利底亚五级大三和弦
   抬高八度）顶到 D7；C7 之前的音（雪 C♯7、冰冷 2°C C7）都在内。
   —— 曾按"C4–E6""C3–G6"收窄，都因实测漏音而作废；一律以实测音域为准。
   第 00 节那架（#kb）用 data-lo/hi/top 只画 C4–B5，且 data-fixed 不可拖动。 */
const KB_LO = 3, KB_HI = 7, KB_TOP_PC = 2;   /* 顶部八度只画到 D7 */

/* 可视窗固定两个八度（C4–B5 = 14 个白键）：键宽 = 容器宽 / 14，
   超出的键溢出左右两侧，不显示滚动条；pointer 拖拽可平移；
   教程播放时自动复位到 C4–B5 / 亮键边缘跟随 / 播完滑回（见 kbHomeAll / kbFollow）。 */
const KB_VIS_W = 14;

/* 每架键盘可以有自己的音域：data-lo/hi/top 缺省用全局常量。
   返回 {lo,hi,top}：从 C{lo} 画到 {top===11?'B':'D'}{hi}（top 只约束最后一个八度）。 */
function kbRange(kb){
  return { lo: +(kb.dataset.lo || KB_LO), hi: +(kb.dataset.hi || KB_HI),
           top: +(kb.dataset.top != null ? kb.dataset.top : KB_TOP_PC) };
}

/* HOME 视口 = C4 贴在视口左缘：C{lo} 到 C4 之间有 (4-lo)*7 个白键（lo=3 → 第 7 个） */
function kbHomeLeft(kb){ return (4 - kbRange(kb).lo) * 7 * kb.clientWidth / KB_VIS_W; }

/* 三个视口状态标志（都在本文件维护）：
   kbUserPanned —— 用户手动拖过键盘：自动跟随让位给用户
   kbAuto       —— 教程播放中：亮键时键盘自动把键移进可视区
   kbResetUntil —— 复位滑行的免打扰截止时刻：glide 做完之前不跟随 */
let kbUserPanned = false;
let kbAuto = false;
let kbResetUntil = 0;

/* 0.5 秒缓动滑动；ms=0 时瞬间移动（播放中亮键用） */
function kbAnimTo(kb, left, ms){
  if (kb._ka){ cancelAnimationFrame(kb._ka); kb._ka = null; }
  left = Math.max(0, Math.min(left, kb.scrollWidth - kb.clientWidth));
  const from = kb.scrollLeft, dist = left - from;
  if (!ms || Math.abs(dist) < 0.5){ kb.scrollLeft = left; return; }
  const d0 = performance.now();
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   /* easeInOutQuad */
  const step = now => {
    /* 每帧都按"当前"宽度钳制：视图切换（改屏宽/旋转）时旧动画不能把键盘甩到越界位置 */
    const max = kb.scrollWidth - kb.clientWidth;
    const t = Math.min(1, (now - d0) / ms);
    kb.scrollLeft = Math.max(0, Math.min(from + dist * ease(t), max));
    kb._ka = (t < 1) ? requestAnimationFrame(step) : null;
  };
  kb._ka = requestAnimationFrame(step);
}

/* 单架键盘回 HOME 视口 */
function kbHome(kb, ms){ kbAnimTo(kb, kbHomeLeft(kb), ms); }

/* 免打扰窗（kbResetUntil）只在"真的需要滑行"时开：
   键盘本来就在 C4–B5 视口时也开窗，会把开头几个音的边缘跟随白吞掉——
   实测「主歌版（低）」C3(0.06s)/D3(0.38s) 都落在 0.5s 窗内闪完，
   用户看到键盘从 E3 才跳进来（2026-10-17 用户报）。 */
function kbHomeAll(ms){
  $$('.kb').forEach(kb => {
    if (ms && Math.abs(kbHomeLeft(kb) - kb.scrollLeft) > 2) kbResetUntil = performance.now() + ms;
    kbHome(kb, ms);
  });
}

/* 播放中把发声的键移进可视区——只做"最小移动"：键完整可见时视口纹丝不动（稳定停在
   C4–B5）；只有键在屏幕外才动，且刚刚进入视口、贴在边缘亮起，绝不移到正中。
   用户手动拖过键盘（kbUserPanned）则全程让位；复位滑行中（kbResetUntil）也不打扰。 */
function kbFollow(kb, el){
  if (kb.dataset.fixed != null) return;    /* 固定键盘（hero）不参与视口管理 */
  if (kbUserPanned) return;
  if (performance.now() < kbResetUntil) return;
  const sl = kb.scrollLeft, cw = kb.clientWidth, l = el.offsetLeft, w = el.offsetWidth;
  if (sl <= l + 4 && l + w <= sl + cw + 4) return;              /* 完整可见：不动 */
  kbAnimTo(kb, sl > l + 4 ? l : l + w - cw, 0);                /* 视口左外→贴左缘进入；右外→贴右缘进入 */
}

/* 教程播放起点：复位到 C4–B5 视口（0.5s 动画），恢复自动跟随 */
function kbPlayStart(){ kbUserPanned = false; kbAuto = true; kbHomeAll(500); }

/* 单击奏响一个键（与旧版键上 onclick 的行为一致：清 SVG 高亮作用域 + 按压动效 + 发声） */
function kbTap(kb, el){
  if (!el) return;
  LIT_SEL = '';
  el.classList.add('press'); setTimeout(() => el.classList.remove('press'), 140);
  voice(+el.dataset.m, ac().currentTime + 0.02, 1.3, 0.42);
}

/* 键盘交互：pointer 一套事件同时覆盖鼠标和触屏，"单击弹奏"与"拖动平移"并存。
   —— 单击：pointerdown 记住按到的键，pointerup 时若没拖动就奏响它。
      不能依赖原生 click——setPointerCapture 会把兼容鼠标事件重定向到 .kb 容器，
      键上的 onclick 永远收不到（2026-10-17 实测：mousedown 目标还是键，click 目标已是 .kb）。
   —— 拖动：移动超过 3px 算拖动，置 kbUserPanned；原生 click 一律在捕获阶段吃掉，
      避免"拖动完松手又蹭响一个音"。data-fixed 的键盘只响应单击、不拖动（也无键可拖）。 */
function kbDragInit(){
  $$('.kb').forEach(kb => {
    const fixed = kb.dataset.fixed != null;
    let down = false, pid = null, sx = 0, sl = 0, tapEl = null;
    kb.addEventListener('pointerdown', e => {
      if (e.button !== 0 || pid !== null) return;
      pid = e.pointerId; down = true; sx = e.clientX; sl = kb.scrollLeft; kb._moved = false;
      tapEl = e.target.closest ? e.target.closest('.wk,.bk') : null;
      if (!fixed){ try { kb.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    kb.addEventListener('pointermove', e => {
      if (fixed || !down || e.pointerId !== pid) return;
      const dx = e.clientX - sx;
      if (!kb._moved && Math.abs(dx) > 3){ kb._moved = true; kbUserPanned = true; }
      if (kb._moved){ kbAnimTo(kb, sl - dx, 0); e.preventDefault(); }
    });
    const end = e => {
      if (e.pointerId !== undefined && e.pointerId !== pid) return;
      if (down && !kb._moved) kbTap(kb, tapEl);   /* 没拖动 = 单击：奏响按下的那个键 */
      down = false; pid = null; tapEl = null;
    };
    kb.addEventListener('pointerup', end);
    kb.addEventListener('pointercancel', e => { if (e.pointerId === pid){ down = false; pid = null; tapEl = null; } });
    /* 演奏已由 pointerup 处理，原生 click 一律吃掉，防止同一击重复发声 */
    kb.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, true);
  });
}

/* ============ 键盘绘制 ============ */

/* scaleDegrees()：当前"调 + 调式"下，每个音是第几级。
   返回 Map: MIDI 号 → 级数(1–7)。跨整个音域（C3–D7）逐八度铺开 */
function scaleDegrees(){
  const m = M_OF(state.mode), map = new Map();
  for (let oct = KB_LO; oct <= KB_HI; oct++){
    const top = (oct === KB_HI) ? KB_TOP_PC : 11;
    m.semis.forEach((sv, i) => { if (sv <= top) map.set(midiOct(state.root, oct) + sv, i + 1); });
  }
  return map;
}

/* renderKB()：重绘页面上所有 .kb 键盘。
   白键按 C 大调白键位排（p ∈ [0,2,4,5,7,9,11]），音高 = 白键位 + 当前主音；
   黑键按真实钢琴位置插缝（bIdx 映射）。属于当前音阶的键加 .on（紫线）。
   重绘会丢 scrollLeft：先记住原位，用户拖过就保持，否则回 C4 视口。 */
function renderKB(){
  /* 重绘会清空 scrollLeft：先记住每架键盘的原位置，用户拖过就保持原位，否则回到 C4 视口 */
  const kbs = $$('.kb').map(kb => ({ kb, sl: kb.scrollLeft }));
  kbs.forEach(({ kb }) => {
    kb.innerHTML = '';
    const { lo, hi, top } = kbRange(kb);
    const W = kb.clientWidth || 900;
    const deg = scaleDegrees();
    const whites = [], blacks = [];
    for (let oct = lo; oct <= hi; oct++){
      const tp = (oct === hi) ? top : 11;
      [0,2,4,5,7,9,11].forEach(p => { if (p <= tp) whites.push({ p, o: oct, m: midiOct(0, oct) + p + state.root }); });
      [1,3,6,8,10].forEach(p => { if (p <= tp) blacks.push({ p, o: oct, m: midiOct(0, oct) + p + state.root }); });
    }
    /* 可视窗固定 14 个白键：键宽 = 容器宽 / 14；超出的键溢出左右，靠拖拽/自动跟随看 */
    const wW = W / KB_VIS_W;
    const inner = document.createElement('div');
    inner.style.cssText = 'position:relative;height:100%;width:' + (whites.length * wW) + 'px';
    kb.appendChild(inner);
    whites.forEach((k, i) => {
      const d = document.createElement('div');
      d.className = 'wk' + (deg.has(k.m) ? ' on' : '');
      d.style.cssText = `left:${i * wW}px;width:${wW - 1}px`;
      d.dataset.m = k.m;
      const n = deg.get(k.m);
      d.innerHTML = (n ? `<span class="s">${n}</span>` : '') + `<span class="n">${noteName(k.m)}</span>`;
      /* 发声不绑 click：pointer capture 会把 click 重定向到 .kb 容器（见 kbDragInit），
         单击与拖动统一由 kbDragInit 的 pointer 事件处理 */
      inner.appendChild(d);
    });
    /* 黑键 left 必须带八度偏移，否则第二八度会叠在第一八度上、抢走点击 */
    const bIdx = { 1:0, 3:1, 6:3, 8:4, 10:5 };
    blacks.forEach(k => {
      const d = document.createElement('div');
      d.className = 'bk' + (deg.has(k.m) ? ' on' : '');
      d.style.cssText = `left:${((k.o - lo) * 7 + bIdx[k.p] + 1) * wW - wW * 0.31}px;width:${wW * 0.62}px`;
      d.dataset.m = k.m;
      /* 黑键名拆成音名/八度两个 span：窄屏键宽只有 ~13px，"C♯4" 整串会溢出，
         隐藏八度只留 "C♯"（见 CSS 700px 断点） */
      const nm = noteName(k.m);
      d.innerHTML = `<span class="n"><span class="p">${nm.slice(0, -1)}</span><span class="o">${nm.slice(-1)}</span></span>`;
      inner.appendChild(d);
    });
  });
  kbs.forEach(({ kb, sl }) => {
    if (kb._ka){ cancelAnimationFrame(kb._ka); kb._ka = null; }   /* 取消在途动画，否则它会抢回位置 */
    const max = kb.scrollWidth - kb.clientWidth;
    kb.scrollLeft = kbUserPanned ? Math.min(sl, max) : Math.min(kbHomeLeft(kb), max);
  });
  /* 第 00 节标题下的一行"当前调式"说明：调名 + 全半音规则 + 性格标签 */
  const m = M_OF(state.mode);
  const steps = m.semis.slice(1).map((v, i) => v - m.semis[i]).join(' ');
  $('#kbInfo').innerHTML = `当前：<b>${PC[state.root]} ${m.zh}</b>（${m.en}）　规则：<b>${steps}</b>　${m.tag}`;
}
