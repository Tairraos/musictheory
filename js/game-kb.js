/* ==========================================================================
 * 《姐弟厨师团》 · 互动课底部钢琴（js/game-kb.js）
 * --------------------------------------------------------------------------
 * 教程页底部有一架常驻钢琴（#dockKb，C3–D7 可拖、播完回位），互动课对齐这套体验：
 * 渲染 C2–C7 五个八度，可视窗固定 14 个白键，其余靠左右拖拽看；
 * 松手 2 秒没有新交互就动画滑回 C4 视口；演示音频播到画面外的键时自动滚过去。
 * 点键即响；音频演示播到哪个音，哪个键闪琥珀（flashKey 在 game-audio.js）。
 * 刻意不复用 keyboard.js：那套绑定教程的调式亮键（scaleDegrees/state），
 * 互动课没有调式状态；拖拽/回位/跟随在这里按同一套手势逻辑重写。
 * 依赖：utils.js（$）、audio.js（voice / ac）。不依赖 data.js——
 *       音名表在这里自带一份，互动课不拖乐理数据层。
 * ========================================================================== */

/* 音名表（升号系，与教程 PC 一致）；互动课不加载 data.js，这里自带 */
const GK_PC = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
function gkName(m){ return GK_PC[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }

/* 键盘音域：C2–C7（midi 36–96），可视窗 14 个白键，home 视口从 C4 起 */
const GK_LO = 36, GK_HI = 96, GK_VIS = 14;
const GK_WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
const GK_HOME = 60;   /* C4 */

/* midi → 键盘内白键序号（黑键无独立白键位，返回 -1；跟随定位用黑键所属白键位） */
function gkWhiteIndex(m){
  const pc = ((m % 12) + 12) % 12, oct = Math.floor(m / 12) - 2;   /* C2 = 0 */
  const w = GK_WHITE_PC.indexOf(pc);
  if (w < 0) return (oct * 7 + Math.max(0, GK_WHITE_PC.filter(p => p < pc).length - 1));
  return oct * 7 + w;
}

let gkKeyWidth = 0;   /* renderGameKB 时记下键宽，flashKey 跟随定位用 */

/* rAF 动画滚动：跟手时直接赋值（dur=0），回位/跟随用 500ms 缓动 */
function gkScrollTo(kb, x, dur){
  const max = Math.max(0, kb.scrollWidth - kb.clientWidth);
  const target = Math.max(0, Math.min(x, max));
  if (kb._gka){ cancelAnimationFrame(kb._gka); kb._gka = null; }
  if (!dur || !kb.clientWidth){ kb.scrollLeft = target; return; }
  const from = kb.scrollLeft, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    kb.scrollLeft = from + (target - from) * e;
    if (k < 1) kb._gka = requestAnimationFrame(step);
    else kb._gka = null;
  };
  kb._gka = requestAnimationFrame(step);
}

/* 画键盘：C2–C7 全音域。白键宽 = 容器宽 / 14（可视窗 14 键，其余溢出靠拖拽看）。
 * 键上 data-m 与教程键盘同口径，flashKey 靠它找键。重绘保留原视口（home 态回 home）。 */
function renderGameKB(){
  const kb = document.getElementById('gameKb');
  if (!kb) return;
  gkKeyWidth = (kb.clientWidth || 360) / GK_VIS;
  const wW = gkKeyWidth;
  const whites = [], blacks = [];
  for (let oct = 2; oct <= 7; oct++){
    [0, 2, 4, 5, 7, 9, 11].forEach(p => { const m = 12 * (oct + 1) + p; if (m >= GK_LO && m <= GK_HI) whites.push({ p, o: oct, m }); });
    [1, 3, 6, 8, 10].forEach(p => { const m = 12 * (oct + 1) + p; if (m >= GK_LO && m <= GK_HI) blacks.push({ p, o: oct, m }); });
  }
  const keep = kb.scrollLeft, wasHome = !kb._gkPanned;
  kb.innerHTML = '';
  const inner = document.createElement('div');
  inner.style.cssText = 'position:relative;height:100%;width:' + (whites.length * wW) + 'px';
  kb.appendChild(inner);
  whites.forEach((k, i) => {
    const d = document.createElement('div');
    d.className = 'wk';
    d.style.cssText = `left:${i * wW}px;width:${wW - 1}px`;
    d.dataset.m = k.m;
    d.innerHTML = `<span class="n">${gkName(k.m)}</span>`;
    inner.appendChild(d);
  });
  /* 黑键 left 带八度偏移（与教程 renderKB 同公式），否则相邻八度会叠到一起抢点击 */
  const bIdx = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };
  blacks.forEach(k => {
    const d = document.createElement('div');
    d.className = 'bk';
    d.style.cssText = `left:${((k.o - 2) * 7 + bIdx[k.p] + 1) * wW - wW * 0.31}px;width:${wW * 0.62}px`;
    d.dataset.m = k.m;
    inner.appendChild(d);
  });
  /* 重绘会清 scrollLeft：用户拖过保持原位，否则回 C4 视口 */
  gkScrollTo(kb, wasHome ? (gkWhiteIndex(GK_HOME) * wW) : keep, 0);
}

/* 点键发声：与教程 kbTap 同参数（1.3s 长音）。
 * jsdom / 无音频设备下 ac() 会抛错，吃掉即可——出声是增强，不响不能让页面报错 */
function gameKbTap(el){
  if (!el || el.dataset.m == null) return;
  el.classList.add('press');
  setTimeout(() => el.classList.remove('press'), 140);
  if (typeof voice !== 'function') return;
  try { voice(+el.dataset.m, ac().currentTime + 0.02, 1.3, 0.42); } catch (e) {}
}

/* 拖拽结束后 2 秒无新交互 → 动画滑回 C4 视口（教程是播完回位，互动课没有
 * 播放结束钩子，用"松手停 2 秒"达到同样效果：看完远处随时回来） */
let gkHomeTimer = null;
function gkScheduleHome(kb){
  if (gkHomeTimer) clearTimeout(gkHomeTimer);
  gkHomeTimer = setTimeout(() => {
    kb._gkPanned = false;
    gkScrollTo(kb, gkWhiteIndex(GK_HOME) * gkKeyWidth, 500);
  }, 2000);
}

/* 演示音频跟随：播到画面外的键时把视口滚过去（亮键居中）。
 * 用户 2 秒内手动拖过就全程让位（与教程 kbUserPanned 同语义）。 */
function gameKbFollow(midi){
  const kb = document.getElementById('gameKb');
  if (!kb || !kb.clientWidth || !gkKeyWidth || kb._gkPanned) return;
  const x = gkWhiteIndex(midi) * gkKeyWidth;
  const l = kb.scrollLeft, r = l + kb.clientWidth;
  if (x < l + gkKeyWidth || x > r - gkKeyWidth * 2){
    gkScrollTo(kb, x - kb.clientWidth / 2, 400);
  }
}

function gameKbBind(){
  const kb = document.getElementById('gameKb');
  if (!kb || kb._bound) return;
  kb._bound = true;
  /* 同一套 pointer 手势覆盖鼠标与触屏：单击（移动 ≤3px）弹奏；拖动平移视口。
   * 原生 click 在捕获阶段吃掉——pointer capture 会把它重定向到容器，避免二次发声 */
  let down = false, pid = null, sx = 0, sl = 0, tapEl = null;
  kb.addEventListener('pointerdown', e => {
    if (e.button !== 0 || pid !== null) return;
    pid = e.pointerId; down = true; sx = e.clientX; sl = kb.scrollLeft; kb._moved = false;
    tapEl = e.target.closest ? e.target.closest('.wk,.bk') : null;
    if (gkHomeTimer){ clearTimeout(gkHomeTimer); gkHomeTimer = null; }
    try { kb.setPointerCapture(e.pointerId); } catch (err) {}
  });
  kb.addEventListener('pointermove', e => {
    if (!down || e.pointerId !== pid) return;
    const dx = e.clientX - sx;
    if (!kb._moved && Math.abs(dx) > 3){ kb._moved = true; kb._gkPanned = true; }
    if (kb._moved){ gkScrollTo(kb, sl - dx, 0); e.preventDefault(); }
  });
  const end = e => {
    if (e.pointerId !== undefined && e.pointerId !== pid) return;
    if (down && !kb._moved) gameKbTap(tapEl);   /* 没拖动 = 单击：奏响按下的键 */
    if (down && kb._moved) gkScheduleHome(kb);
    down = false; pid = null; tapEl = null;
  };
  kb.addEventListener('pointerup', end);
  kb.addEventListener('pointercancel', e => { if (e.pointerId === pid){ down = false; pid = null; tapEl = null; } });
  kb.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, true);
}

/* 播放器页显示、目录页隐藏；只有乐理课显示钢琴（gameKbShow 由 game-app 按课传参）。
 * 隐藏时给 body 挂 .kb-off：底部导航不再给钢琴让位，沉到屏底。
 * 每次显示都重绘（顺带消化旋转/改屏宽后的键宽） */
function gameKbShow(v){
  const dock = document.getElementById('gameDock');
  if (!dock) return;
  dock.hidden = !v;
  document.body.classList.toggle('kb-off', !v);
  if (v){ gameKbBind(); renderGameKB(); }
  else if (gkHomeTimer){ clearTimeout(gkHomeTimer); gkHomeTimer = null; }
}

/* 播放中旋转/改屏宽：键宽按容器宽推导，变了就重绘一次（重绘保留原视口） */
window.addEventListener('resize', () => {
  const dock = document.getElementById('gameDock');
  if (dock && !dock.hidden) renderGameKB();
});

Object.assign(window, { renderGameKB, gameKbShow, gameKbTap, gameKbFollow, gkKeyWidth });
