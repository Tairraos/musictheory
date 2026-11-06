/* ==========================================================================
 * 《姐弟厨师团》 · 互动课纯内核（js/game-core.js）
 * --------------------------------------------------------------------------
 * 只放配置校验、判题、进度状态机。这里不碰 DOM、AudioContext、wx，
 * 也不直接读写 localStorage——存储介质由外层适配器注入。
 * 这部分是网页与未来微信小程序共用、可直接单元测试的核心。
 * ========================================================================== */
(function(root, factory){
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
'use strict';

const TASK_TYPES = ['choice', 'number', 'sequence', 'scan', 'action'];
const BLOCK_TYPES = ['text', 'tip', 'heading', 'list', 'table', 'svg', 'strip', 'lyr', 'audio'];
const PAGE_ID = /^[a-z][a-z0-9]*(?:\.[a-z0-9-]+)+$/;

function fail(list, message){ list.push(message); }

/* validateCourseConfig(config)：配置层的编译器。
 * 宁可让维护时立刻红，也不让坏配置到手机上才静默错页。 */
function validateCourseConfig(config){
  const errors = [];
  if (!config || typeof config !== 'object') return ['配置必须是对象'];
  if (!Number.isInteger(config.schemaVersion) || config.schemaVersion < 1)
    fail(errors, 'schemaVersion 必须是正整数');
  if (!config.contentVersion || typeof config.contentVersion !== 'string')
    fail(errors, 'contentVersion 必须是非空字符串');
  if (!Array.isArray(config.courses) || !config.courses.length) fail(errors, 'courses 必须是非空数组');
  if (!Array.isArray(config.pages) || !config.pages.length) fail(errors, 'pages 必须是非空数组');

  const courseIds = new Set();
  (config.courses || []).forEach((c, i) => {
    if (!/^[a-z][a-z0-9-]*$/.test(c.id || '')) fail(errors, `courses[${i}] id 非法`);
    if (courseIds.has(c.id)) fail(errors, `课程 id 重复：${c.id}`);
    courseIds.add(c.id);
    ['title', 'short', 'intro', 'accent'].forEach(k => {
      if (!c[k] || typeof c[k] !== 'string') fail(errors, `课程 ${c.id || i} 缺少 ${k}`);
    });
  });

  const pageIds = new Set();
  (config.pages || []).forEach((p, i) => {
    const label = p.id || `pages[${i}]`;
    if (!PAGE_ID.test(p.id || '')) fail(errors, `${label} 的页面 id 不符合 course.topic.name 形式`);
    if (pageIds.has(p.id)) fail(errors, `页面 id 重复：${p.id}`);
    pageIds.add(p.id);
    if (!courseIds.has(p.course)) fail(errors, `${label} 引用了不存在的课程 ${p.course}`);
    if (!p.chapter || typeof p.chapter !== 'string') fail(errors, `${label} 缺少 chapter`);
    if (!Number.isInteger(p.order) || p.order < 1) fail(errors, `${label} order 必须是正整数`);
    if (!p.title || !p.goal) fail(errors, `${label} 必须有 title 与 goal`);
    if (!Number.isFinite(p.estimatedSeconds) || p.estimatedSeconds < 10) fail(errors, `${label} estimatedSeconds 至少 10 秒`);
    if (p.skip !== true) fail(errors, `${label} 必须显式允许跳过`);
    if (!Array.isArray(p.blocks) || !p.blocks.length) fail(errors, `${label} 至少一个讲解块`);
    if (!p.task || typeof p.task !== 'object') fail(errors, `${label} 缺少 task`);
    if (p.html || (p.blocks || []).some(b => b.html)) fail(errors, `${label} 不允许 raw HTML，跨端配置必须使用结构化 blocks`);

    (p.blocks || []).forEach((b, bi) => {
      if (!BLOCK_TYPES.includes(b.type)) fail(errors, `${label} blocks[${bi}] 类型未知：${b.type}`);
      if (b.type === 'text' || b.type === 'tip'){
        if (!b.text || typeof b.text !== 'string') fail(errors, `${label} blocks[${bi}] 缺少文本`);
      }
      if (b.type === 'heading' && (!b.text || !/^[34]$/.test(String(b.level)))) fail(errors, `${label} blocks[${bi}] 标题非法`);
      if (b.type === 'list'){
        if (!Array.isArray(b.items) || !b.items.length) fail(errors, `${label} blocks[${bi}] 列表不能为空`);
        if (typeof b.ordered !== 'boolean') fail(errors, `${label} blocks[${bi}] 列表缺 ordered`);
      }
      if (b.type === 'table'){
        if (!Array.isArray(b.rows) || !b.rows.length) fail(errors, `${label} blocks[${bi}] 表格不能为空`);
        if (!Array.isArray(b.headers)) fail(errors, `${label} blocks[${bi}] 表头必须是数组`);
        /* rowsAudio：回填到行上的"点一行听一下"事件，行号必须落在表格内 */
        if (b.rowsAudio !== undefined){
          if (!Array.isArray(b.rowsAudio) || !b.rowsAudio.length)
            fail(errors, `${label} blocks[${bi}] rowsAudio 必须是非空数组`);
          else if (b.rowsAudio.length > b.rows.length)
            fail(errors, `${label} blocks[${bi}] rowsAudio 行号越界`);
          else if (b.rowsAudio.some(a => !a || !Array.isArray(a.evs) || !a.evs.length))
            fail(errors, `${label} blocks[${bi}] rowsAudio 行缺演示事件`);
        }
      }
      if (b.type === 'svg'){
        if (typeof b.svg !== 'string' || !/^<svg/.test(b.svg)) fail(errors, `${label} blocks[${bi}] svg 块必须是完整的 svg 标记`);
        if (/<script/i.test(b.svg || '')) fail(errors, `${label} blocks[${bi}] svg 块里不许夹带脚本`);
      }
      if (b.type === 'strip'){
        if (!Array.isArray(b.items) || !b.items.length) fail(errors, `${label} blocks[${bi}] 条块不能为空`);
        if (b.chords && (b.items || []).some(x => !x.main)) fail(errors, `${label} blocks[${bi}] 和弦条每格要有音名`);
      }
      if (b.type === 'lyr'){
        if (!Array.isArray(b.rows) || !b.rows.length) fail(errors, `${label} blocks[${bi}] 时间轴不能为空`);
        if ((b.rows || []).some(r => !Array.isArray(r.boxes))) fail(errors, `${label} blocks[${bi}] 时间轴行缺字块数组`);
      }
      if (b.type === 'audio'){
        /* evs：捕获来的演示事件序列，要么是拍点（click）要么带音高（m） */
        if (!Array.isArray(b.evs) || !b.evs.length) fail(errors, `${label} blocks[${bi}] 音频缺少演示事件 evs`);
        if ((b.evs || []).some(e => !e || (e.click ? e.t == null : !Number.isInteger(e.m) || e.m < 0 || e.m > 127)))
          fail(errors, `${label} blocks[${bi}] 存在非法演示事件`);
        /* hitStrip：联动点亮页内第几个条块（拍点圆点/和弦格子跟着播放动） */
        if (b.hitStrip !== undefined && (!Number.isInteger(b.hitStrip) || b.hitStrip < 0))
          fail(errors, `${label} blocks[${bi}] hitStrip 必须是条块索引`);
        if (b.hitStrip != null && b.hitStrip >= (p.blocks || []).filter(x => x.type === 'strip').length)
          fail(errors, `${label} blocks[${bi}] hitStrip 索引越界`);
      }
    });

    const t = p.task || {};
    if (!TASK_TYPES.includes(t.type)) fail(errors, `${label} task 类型未知：${t.type}`);
    if (!t.prompt && t.type !== 'action') fail(errors, `${label} task 缺少 prompt`);
    if (t.type === 'action' && !t.label) fail(errors, `${label} action 缺少 label`);
    if (t.type === 'choice'){
      if (!Array.isArray(t.options) || t.options.length < 2) fail(errors, `${label} choice 至少两个选项`);
      if (new Set(t.options || []).size !== (t.options || []).length) fail(errors, `${label} choice 选项重复`);
      if (!Number.isInteger(t.answer) || t.answer < 0 || t.answer >= (t.options || []).length) fail(errors, `${label} choice answer 越界`);
    }
    if (t.type === 'number'){
      if (!Number.isFinite(t.answer)) fail(errors, `${label} number 缺少数字答案`);
      if (t.min != null && t.answer < t.min) fail(errors, `${label} number 答案小于 min`);
      if (t.max != null && t.answer > t.max) fail(errors, `${label} number 答案大于 max`);
    }
    if (t.type === 'sequence'){
      if (!Array.isArray(t.items) || t.items.length < 2) fail(errors, `${label} sequence 至少两个项目`);
      if (new Set(t.items || []).size !== (t.items || []).length) fail(errors, `${label} sequence 项目重复`);
      const sorted = [...(t.answer || [])].sort((a, b) => a - b);
      const expect = Array.from({ length: (t.items || []).length }, (_, n) => n);
      if (JSON.stringify(sorted) !== JSON.stringify(expect)) fail(errors, `${label} sequence answer 必须是项目索引的一次完整排列`);
    }
    if (t.type === 'scan'){
      if (!Array.isArray(t.banned) || !t.banned.length) fail(errors, `${label} scan 至少一个检查词`);
      if (!t.text || typeof t.text !== 'string') fail(errors, `${label} scan 缺少待检查 text`);
    }
  });

  (config.courses || []).forEach(c => {
    const orders = (config.pages || []).filter(p => p.course === c.id).map(p => p.order);
    if (!orders.length) fail(errors, `课程 ${c.id} 没有页面`);
    if (new Set(orders).size !== orders.length) fail(errors, `课程 ${c.id} 的 order 重复`);
  });
  return errors;
}

function pagesForCourse(config, courseId){
  return config.pages.filter(p => p.course === courseId).slice()
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
function pageIndex(config, pageId){
  return config.pages.findIndex(p => p.id === pageId);
}
function adjacentPage(config, pageId, delta){
  const p = config.pages[pageIndex(config, pageId)];
  if (!p) return null;
  const list = pagesForCourse(config, p.course);
  const i = list.findIndex(x => x.id === pageId);
  return list[i + delta] || null;
}

function evaluateTask(task, value){
  if (!task) return { ok: true, message: '本页没有需要提交的操作。' };
  if (task.type === 'choice'){
    const ok = value === task.answer;
    return { ok, message: ok ? task.explain : '还差一点。再听/再看一次，注意题目问的是哪一个判据。' };
  }
  if (task.type === 'number'){
    const n = Number(value);
    const ok = Number.isFinite(n) && n === task.answer;
    return { ok, message: ok ? task.explain : '数量还不对。按规则逐项数一遍，不要把标点或提示语算进去。' };
  }
  if (task.type === 'sequence'){
    const got = Array.isArray(value) ? value : [];
    const ok = JSON.stringify(got) === JSON.stringify(task.answer);
    return { ok, message: ok ? task.explain : '顺序还不对。先找起点，再按层级一步一步往上搭。' };
  }
  if (task.type === 'scan'){
    const text = String(value || '');
    const hits = task.banned.filter(w => text.includes(w));
    return {
      ok: true,
      hits,
      message: hits.length ? `${task.explain}\n命中：${hits.join('、')}` : '没有命中黑名单词。可以进入下一页。'
    };
  }
  if (task.type === 'action') return { ok: true, message: task.explain || '操作已完成。' };
  return { ok: false, message: '未知题型。' };
}

function normalizeProgress(config, raw){
  const known = new Set(config.pages.map(p => p.id));
  const clean = { version: 1, pages: {}, lastByCourse: {} };
  if (!raw || typeof raw !== 'object') return clean;
  Object.entries(raw.pages || {}).forEach(([id, state]) => {
    /* 'seen' 是历史版本的状态（"学过"不再记录），清洗时丢弃 */
    if (known.has(id) && ['completed', 'skipped'].includes(state)) clean.pages[id] = state;
  });
  Object.entries(raw.lastByCourse || {}).forEach(([course, id]) => {
    if (known.has(id)) clean.lastByCourse[course] = id;
  });
  return clean;
}

function createProgressStore(storage, key){
  const load = () => {
    try { return JSON.parse(storage.getItem(key) || 'null'); }
    catch (e) { return null; }
  };
  return {
    load(config){ return normalizeProgress(config, load()); },
    save(config, progress){
      const clean = normalizeProgress(config, progress);
      storage.setItem(key, JSON.stringify(clean));
      return clean;
    }
  };
}

function markPage(config, progress, pageId, state){
  const next = normalizeProgress(config, progress);
  const p = config.pages[pageIndex(config, pageId)];
  if (!p) return next;
  next.pages[pageId] = state;
  next.lastByCourse[p.course] = pageId;
  return next;
}

function courseStats(config, progress, courseId){
  const pages = pagesForCourse(config, courseId);
  const clean = normalizeProgress(config, progress);
  const completed = pages.filter(p => clean.pages[p.id] === 'completed').length;
  const skipped = pages.filter(p => clean.pages[p.id] === 'skipped').length;
  return { total: pages.length, completed, skipped };
}

function firstUnfinishedPage(config, progress, courseId){
  const pages = pagesForCourse(config, courseId);
  const clean = normalizeProgress(config, progress);
  return pages.find(p => clean.pages[p.id] !== 'completed' && clean.pages[p.id] !== 'skipped') || pages[0] || null;
}

return {
  TASK_TYPES,
  BLOCK_TYPES,
  validateCourseConfig,
  pagesForCourse,
  pageIndex,
  adjacentPage,
  evaluateTask,
  normalizeProgress,
  createProgressStore,
  markPage,
  courseStats,
  firstUnfinishedPage
};
});
