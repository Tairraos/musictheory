/* ==========================================================================
 * 《姐弟厨师团——作词课》 · 应用入口（js/lyric-app.js）
 * --------------------------------------------------------------------------
 * 职责：DOM 快捷方式 + 版本号 + 启动装配 + 导航高亮。
 *       本文件必须最后加载——它一跑，整页就活起来。
 *
 * 为什么这里自带 $ / $$ / toast 而不用乐理课的 utils.js：
 * utils.js 依赖 data.js 的 PC / MODES（音名与调式），而作词课不加载 data.js。
 * 为一个 toast 把整个乐理数据层拖过来不划算，也不干净——
 * 两页共享的是**样式与纪律**，不是运行时。
 * ========================================================================== */

/* ---------- DOM 快捷方式（与 utils.js 同名同义，故意保持写法一致） ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function toast(m){
  const t = $('#toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- 版本号 ----------
 * 与乐理课共用同一个版本号（同一次更新同时改两页），真源仍各在自己文件里：
 *   js/app.js       → 乐理课
 *   js/lyric-app.js → 作词课
 * tests/bump-version.js 一次写两处，两页永远同版。 */
const VERSION = { v: '1.27', date: '26.10.31' };

function applyVersion(){
  const label = `V${VERSION.v} [${VERSION.date}]`;
  document.title = `姐弟厨师团 --- 作词课 ${label}`;
  $$('[data-ver]').forEach(el => { el.innerHTML = `<b>V${VERSION.v}</b> [${VERSION.date}]`; });
}

/* ---------- 启动装配 ---------- */
buildGenres(); buildRhyme(); buildCN(); buildEN(); buildImage();
buildHooks(); buildSchools(); buildFrames(); buildBan();
buildFix(); buildAlbum(); buildCheck();
applyVersion();

/* ---------- 导航高亮（与乐理课同一套逻辑：找最后一个越过 180px 线的 section） ---------- */
const navLinks = $$('#nav a');
window.addEventListener('scroll', () => {
  let cur = navLinks[0];
  $$('section').forEach(sec => {
    if (sec.getBoundingClientRect().top < 180)
      cur = navLinks.find(l => l.getAttribute('href') === '#' + sec.id) || cur;
  });
  navLinks.forEach(l => l.classList.toggle('on', l === cur));
}, { passive: true });

/* ---------- 测试钩子 ----------
 * 与乐理课的 window.__MT__ 同一用途：let/const 不挂 window，测试拿不到，
 * 这里转一份只读视图。scanText 是纯函数，测试要直接喂字符串验证判定。
 * 命名用 __LC__（LyriC）以免和乐理课那一页的钩子混淆。 */
window.__LC__ = {
  get version(){ return VERSION; },
  GENRES, RHYME_TYPES, SCHEMES, CN_PATTERNS, HOOKS, SCHOOLS, FRAMES,
  BAN_ZH, BAN_EN, FIX_STEPS, ALBUM_BRIEF, SELF_CHECK, scanText,
  ALBUM_LAYERS, ALBUM_WORD_JOBS, ALBUM_STRUCT, STORY_BEATS, IMAGE_CALLBACK,
};
