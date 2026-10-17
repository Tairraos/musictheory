/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 应用入口层（js/app.js）
 * --------------------------------------------------------------------------
 * 职责：全局状态定义 + 启动装配 + 全局事件（缩放/滚动高亮/空格停止）。
 *       本文件必须最后一个加载——它一跑，整站就活起来。
 *
 * 依赖：前面全部 js 模块
 * 被谁用：index.html 底部 <script src="js/app.js"></script>
 * ========================================================================== */

/* 全局状态：当前选中的主音（pitch class）与调式 id。
 * 页面多处读取它（键盘亮键、各节示意图、示范旋律），
 * 改它只有两个入口：rootSel / modeSel 的 onchange（见 sections.js） */
let state = { root: 0, mode: 'ionian' };

/* ============ 启动装配 ============ */
/* 顺序即依赖：先建下拉框和键盘，再逐节装配，最后统一重画依赖主音的图 */
buildSelects(); renderKB(); kbDragInit(); buildIV(); buildIVTable(); buildMinor3(); buildModes(); buildPenta();
buildChords(); buildCadence(); buildProg(); buildTempo(); buildMeter(); buildKey(); buildScenes();
buildSeventh(); buildMod(); buildCheat(); refreshAll();

/* ============ 全局事件 ============ */

/* 第 00 节的"停止"按钮 */
$('#clearBtn').onclick = () => { stopAll(); toast('已停止'); };

/* 底栏钢琴的收起/展开 */
$('#dockBtn').onclick = () => { const d = $('#dock'); d.classList.toggle('hide');
  $('#dockBtn').textContent = d.classList.contains('hide') ? '展开钢琴' : '收起钢琴'; };

/* 窗口尺寸变化：键盘键宽 = 容器宽 / 14，必须重绘 */
window.addEventListener('resize', () => renderKB());

/* 滚动时高亮当前节的导航链接（找最后一个越过 180px 线的 section） */
const links = $$('#nav a');
window.addEventListener('scroll', () => { let cur = links[0];
  $$('section').forEach(sec => { if (sec.getBoundingClientRect().top < 180) cur = links.find(l => l.getAttribute('href') === '#' + sec.id) || cur; });
  links.forEach(l => l.classList.toggle('on', l === cur)); }, { passive: true });

/* 空格键 = 全站停止（防止按键时页面跟着滚动，先 preventDefault） */
document.addEventListener('keydown', e => { if (e.code === 'Space'){ e.preventDefault(); stopAll(); } });

/* ============ 测试钩子 ============ */
/* 给自动化测试（tests/run-tests.js）开一个观察内部的窗口：
 * let/const 声明的全局变量不会挂到 window 上，测试拿不到 state / LIVE，
 * 这里用 getter 转发一份只读视图。不影响任何功能，可放心保留。 */
window.__MT__ = {
  get state(){ return state; },
  get live(){ return LIVE; },
  triad, chordLabel, noteName, midiOct, f, spellUp, M_OF,
  stopAll, seq
};
