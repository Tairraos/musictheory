/* ==========================================================================
 * 《姐弟厨师团》 · 互动课入口（js/game-app.js）
 * --------------------------------------------------------------------------
 * 职责：路由、课程首页、逐页播放器、进度持久化。
 *       页面内容只从 COURSE_CONFIG 取；本文件不复制任何知识点文案。
 * ========================================================================== */

const VERSION = { v: '1.38', date: '26.11.02' };
const PROGRESS_KEY = 'jiedi-course-progress-v1';

const memoryStorage = (() => {
  const m = new Map();
  return { getItem: k => m.get(k) || null, setItem: (k, v) => m.set(k, v) };
})();
const storage = (() => {
  try {
    const k = '__mt_game_probe__';
    localStorage.setItem(k, '1'); localStorage.removeItem(k);
    return localStorage;
  } catch (e) { return memoryStorage; }
})();

const config = COURSE_CONFIG;
const configErrors = validateCourseConfig(config);
const progressStore = createProgressStore(storage, PROGRESS_KEY);
let progress = progressStore.load(config);
let currentCourse = config.courses[0].id;
let currentPageId = null;

function applyVersion(){
  const label = `V${VERSION.v} [${VERSION.date}]`;
  document.title = `姐弟厨师团 --- 互动课 ${label}`;
  $$('[data-ver]').forEach(n => { n.innerHTML = `<b>V${VERSION.v}</b> [${VERSION.date}]`; });
}

function saveProgress(){ progress = progressStore.save(config, progress); }
function pageState(id){ return progress.pages[id] || ''; }
function statusLabel(state){ return { completed: '已完成', skipped: '已跳过', seen: '看过' }[state] || '未开始'; }
function statusMark(state){ return { completed: '✓', skipped: '↷', seen: '•' }[state] || '·'; }

function setView(name){
  $('#homeView').hidden = name !== 'home';
  $('#playerView').hidden = name !== 'player';
}

function setHash(hash){
  try { history.replaceState(null, '', hash); }
  catch (e) { location.hash = hash; }
}

function courseOf(id){ return config.courses.find(c => c.id === id); }

function renderHome(){
  stopGameAudio();
  currentPageId = null;
  setView('home');
  setHash('#home');

  const statsRow = $('#courseStats');
  statsRow.innerHTML = '';
  config.courses.forEach(c => {
    const s = courseStats(config, progress, c.id);
    const card = el('article', 'course-stat accent-' + c.accent);
    card.append(
      el('span', 'eyebrow', c.short),
      el('h2', '', c.title),
      el('p', '', c.intro),
      el('div', 'progress-line', `${s.completed}/${s.total} 完成 · ${s.skipped} 跳过`)
    );
    const bar = el('div', 'progress-track');
    const fill = el('i');
    fill.style.width = (s.total ? Math.round(s.completed / s.total * 100) : 0) + '%';
    bar.append(fill);
    const btn = el('button', 'primary-action', s.seen ? '继续学习' : '开始学习');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      currentCourse = c.id;
      const next = firstUnfinishedPage(config, progress, c.id);
      if (next) openPage(next.id);
    });
    card.append(bar, btn);
    statsRow.append(card);
  });

  const lists = $('#courseLists');
  lists.innerHTML = '';
  config.courses.forEach(c => {
    const pages = pagesForCourse(config, c.id);
    const section = el('section', 'course-list');
    section.append(el('h2', '', `${c.title} · ${pages.length} 页`));

    const groups = [];
    pages.forEach(p => {
      const last = groups[groups.length - 1];
      if (!last || last.title !== p.chapter){
        groups.push({ title: p.chapter, pages: [] });
      }
      groups[groups.length - 1].pages.push(p);
    });

    groups.forEach((group, gi) => {
      const completed = group.pages.filter(p => pageState(p.id) === 'completed').length;
      const skipped = group.pages.filter(p => pageState(p.id) === 'skipped').length;
      const chapter = el('div', 'chapter-card');
      const head = el('button', 'chapter-head');
      head.type = 'button';
      head.append(
        el('span', 'chapter-title', group.title),
        el('span', 'chapter-meta', `${completed}/${group.pages.length} 完成${skipped ? ` · ${skipped} 跳过` : ''}`)
      );
      const body = el('div', 'chapter-body');
      body.hidden = gi !== 0;
      head.setAttribute('aria-expanded', String(!body.hidden));

      group.pages.forEach((p, i) => {
        const state = pageState(p.id);
        const row = el('button', 'page-row state-' + (state || 'new'));
        row.type = 'button';
        row.append(
          el('span', 'page-index', String(i + 1).padStart(2, '0')),
          el('span', 'page-title', p.title),
          el('span', 'page-status', statusMark(state) + ' ' + statusLabel(state))
        );
        row.addEventListener('click', () => {
          currentCourse = c.id;
          openPage(p.id);
        });
        body.append(row);
      });

      head.addEventListener('click', () => {
        body.hidden = !body.hidden;
        head.setAttribute('aria-expanded', String(!body.hidden));
      });

      chapter.append(head, body);
      section.append(chapter);
    });
    lists.append(section);
  });
}

function ensureSeen(id){
  if (!pageState(id)){
    progress = markPage(config, progress, id, 'seen');
    saveProgress();
  }
}

function renderPageHeader(page, index, total){
  $('#playerKicker').textContent = `${courseOf(page.course).title} · ${page.chapter}`;
  $('#playerTitle').textContent = page.title;
  $('#playerGoal').textContent = page.goal;
  $('#playerCount').textContent = `${index + 1} / ${total}`;
  $('#playerProgress').style.width = Math.round(((index + 1) / total) * 100) + '%';
  $('#pageState').textContent = statusLabel(pageState(page.id));
}

function openPage(id){
  const page = config.pages[pageIndex(config, id)];
  if (!page) return renderHome();
  stopGameAudio();
  currentCourse = page.course;
  currentPageId = id;
  ensureSeen(id);
  setView('player');
  setHash('#' + id);

  const pages = pagesForCourse(config, page.course);
  const idx = pages.findIndex(p => p.id === id);
  renderPageHeader(page, idx, pages.length);

  const body = $('#pageBlocks');
  body.innerHTML = '';
  page.blocks.forEach(b => body.append(renderGameBlock(b)));
  /* 卡片标题已经在页面顶部出现过；如果第一个 heading 同文，就不再重复占一屏 */
  const firstHeading = body.querySelector('.game-heading');
  if (firstHeading && firstHeading.textContent === page.title) firstHeading.remove();

  const taskBox = $('#taskBox');
  taskBox.innerHTML = '';
  const feedback = $('#feedback');
  feedback.textContent = '完成后会自动记录；卡住了也可以直接跳过。';
  feedback.className = 'feedback';
  taskBox.append(renderGameTask(page.task, result => {
    feedback.textContent = result.message;
    feedback.classList.toggle('ok', !!result.ok);
    feedback.classList.toggle('bad', !result.ok);
    if (result.ok){
      progress = markPage(config, progress, id, 'completed');
      saveProgress();
      $('#pageState').textContent = '已完成';
    }
  }));

  $('#prevBtn').disabled = !adjacentPage(config, id, -1);
  $('#nextBtn').textContent = adjacentPage(config, id, 1) ? '下一页' : '回到目录';
}

function goAdjacent(delta){
  if (!currentPageId) return;
  const next = adjacentPage(config, currentPageId, delta);
  if (next) openPage(next.id);
  else renderHome();
}

function skipCurrent(){
  if (!currentPageId) return;
  progress = markPage(config, progress, currentPageId, 'skipped');
  saveProgress();
  toast('已跳过本页');
  goAdjacent(1);
}

function resetCourse(){
  const pages = pagesForCourse(config, currentCourse);
  pages.forEach(p => { delete progress.pages[p.id]; });
  delete progress.lastByCourse[currentCourse];
  saveProgress();
  renderHome();
  toast('本课程进度已清空');
}

$('#prevBtn').addEventListener('click', () => goAdjacent(-1));
$('#nextBtn').addEventListener('click', () => goAdjacent(1));
$('#skipBtn').addEventListener('click', skipCurrent);
$('#backBtn').addEventListener('click', renderHome);
$('#resetBtn').addEventListener('click', resetCourse);

window.addEventListener('hashchange', () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && pageIndex(config, id) > -1) openPage(id);
  else renderHome();
});

applyVersion();
if (configErrors.length){
  $('#homeView').innerHTML = '';
  $('#homeView').append(el('div', 'config-error', '课程配置未通过校验：\n' + configErrors.join('\n')));
  setView('home');
} else {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && pageIndex(config, id) > -1) openPage(id);
  else renderHome();
}

window.__GAME__ = {
  get version(){ return VERSION; },
  get progress(){ return progress; },
  get currentPageId(){ return currentPageId; },
  config,
  openPage,
  renderHome,
  validateCourseConfig,
  evaluateTask,
  pagesForCourse,
  courseStats
};
