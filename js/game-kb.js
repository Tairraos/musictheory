/* ==========================================================================
 * 《姐弟厨师团》 · 互动课底部钢琴（js/game-kb.js）
 * --------------------------------------------------------------------------
 * 教程页底部有一架常驻钢琴（#dockKb，C3–D7 可拖），互动课保留这个核心体验：
 * 固定 C4–B5 两个八度（14 个白键，正好覆盖全部演示音频的音域），
 * 点键即响；音频演示播到哪个音，哪个键闪琥珀（flashKey 在 game-audio.js）。
 * 刻意不复用 keyboard.js：那套绑定教程的调式亮键 / 视口跟随 / 拖拽平移，
 * 互动课没有调式状态，固定两八度也不需要拖拽。
 * 依赖：utils.js（$）、audio.js（voice / ac）。不依赖 data.js——
 *       音名表在这里自带一份，互动课不拖乐理数据层。
 * ========================================================================== */

/* 音名表（升号系，与教程 PC 一致）；互动课不加载 data.js，这里自带 */
const GK_PC = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
function gkName(m){ return GK_PC[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }

/* 画一架固定键盘：C4–B5（midi 60–83）。白键宽 = 容器宽 / 14。
 * 键上 data-m 与教程键盘同口径，flashKey 靠它找键。 */
function renderGameKB(){
  const kb = document.getElementById('gameKb');
  if (!kb) return;
  const wW = (kb.clientWidth || 360) / 14;
  const whites = [], blacks = [];
  for (let oct = 4; oct <= 5; oct++){
    [0, 2, 4, 5, 7, 9, 11].forEach(p => whites.push({ p, o: oct, m: 12 * (oct + 1) + p }));
    [1, 3, 6, 8, 10].forEach(p => blacks.push({ p, o: oct, m: 12 * (oct + 1) + p }));
  }
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
  /* 黑键 left 带八度偏移（与教程 renderKB 同公式），否则第二八度会叠到第一八度上 */
  const bIdx = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };
  blacks.forEach(k => {
    const d = document.createElement('div');
    d.className = 'bk';
    d.style.cssText = `left:${((k.o - 4) * 7 + bIdx[k.p] + 1) * wW - wW * 0.31}px;width:${wW * 0.62}px`;
    d.dataset.m = k.m;
    inner.appendChild(d);
  });
}

/* 点键发声：与教程 kbTap 同参数（1.3s 长音）。固定键盘无拖拽，pointerdown 即响最跟手；
 * jsdom / 无音频设备下 ac() 会抛错，吃掉即可——出声是增强，不响不能让页面报错 */
function gameKbTap(el){
  if (!el || el.dataset.m == null) return;
  el.classList.add('press');
  setTimeout(() => el.classList.remove('press'), 140);
  if (typeof voice !== 'function') return;
  try { voice(+el.dataset.m, ac().currentTime + 0.02, 1.3, 0.42); } catch (e) {}
}

function gameKbBind(){
  const kb = document.getElementById('gameKb');
  if (!kb || kb._bound) return;
  kb._bound = true;
  kb.addEventListener('pointerdown', e => {
    gameKbTap(e.target.closest ? e.target.closest('.wk,.bk') : null);
  });
}

/* 播放器页显示、目录页隐藏；每次显示都重绘（顺带消化旋转/改屏宽后的键宽） */
function gameKbShow(v){
  const dock = document.getElementById('gameDock');
  if (!dock) return;
  dock.hidden = !v;
  if (v){ gameKbBind(); renderGameKB(); }
}

/* 播放中旋转/改屏宽：键宽按容器宽推导，变了就重绘一次 */
window.addEventListener('resize', () => {
  const dock = document.getElementById('gameDock');
  if (dock && !dock.hidden) renderGameKB();
});

Object.assign(window, { renderGameKB, gameKbShow, gameKbTap });
