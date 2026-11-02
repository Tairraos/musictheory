#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团》 · 互动课配置生成器（tools/build-game-config.js）
 * ---------------------------------------------------------------------------
 * 用法：node tools/build-game-config.js
 * 作用：从 index.html / lyric.html 读取当前课程内容，生成 js/game-data.js。
 *
 * 设计约束：
 *   1. 只生成结构化 blocks（text / list / table / audio / tip），不生成 raw HTML；
 *   2. 每个直接卡片是一页；有 lead 的章节再加一页章节导语；
 *   3. 页面 id 与章节 id + 页内序号绑定，发布后不要随意改；
 *   4. 输出文件可被浏览器、Node、小程序共用，本脚本只用于维护时重新生成。
 * ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js/game-data.js');

const SOURCES = [
  { file: 'index.html', course: 'music', title: '乐理课', short: '听出来', intro: '把乐理课的每一张卡片变成一页可玩、可跳过的知识点。', accent: 'purple' },
  { file: 'lyric.html', course: 'lyric', title: '作词课', short: '改出来', intro: '把作词课的每一张卡片变成一页可查、可练、可跳过的判据。', accent: 'amber' }
];

/* 教程页里 data-play 的演示动作，先映射成可直接排程的音。
 * 这里不追求复刻全部交互，先保证“讲到哪儿就能听到哪儿”。 */
const PLAY_DEMOS = {
  major: { label: '大调音阶', notes: [60, 62, 64, 65, 67, 69, 71, 72], gap: 0.3 },
  minor: { label: '小调音阶', notes: [60, 62, 63, 65, 67, 68, 70, 72], gap: 0.3 },
  majorChord: { label: '大三和弦', notes: [60, 64, 67], gap: 0.45 },
  minorChord: { label: '小三和弦', notes: [60, 63, 67], gap: 0.45 },
  triadMaj: { label: '大三和弦', notes: [60, 64, 67], gap: 0.45 },
  triadMin: { label: '小三和弦', notes: [60, 63, 67], gap: 0.45 },
  sameUp: { label: '大调旋律', notes: [60, 64, 67, 67, 64, 62, 64, 62, 60], gap: 0.36 },
  sameDown: { label: '小调旋律', notes: [60, 63, 67, 67, 63, 62, 63, 62, 60], gap: 0.36 },
  penta: { label: '五声音阶', notes: [60, 62, 64, 67, 69, 72], gap: 0.3 },
  pentaAdd: { label: '五声 + fa', notes: [60, 62, 64, 65, 67, 69, 72], gap: 0.3 },
  pentaAdd7: { label: '五声 + si', notes: [60, 62, 64, 67, 69, 71, 72], gap: 0.3 },
  thirdOnly: { label: '三音对比', notes: [60, 64, 63], gap: 0.6 }
};

function textOf(el){ return ((el && el.textContent) || '').replace(/\s+/g, ' ').trim(); }
function firstSentence(s){
  const t = String(s || '').trim();
  if (!t) return '';
  const m = t.match(/^.{6,80}?[。；;！!？?]/);
  return (m ? m[0] : t.slice(0, 80)).trim();
}
function shrink(s, n){ s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

function blocksFrom(container){
  const out = [];
  const visit = node => {
    if (node.nodeType !== 1) return;
    const el = node;
    const tag = el.tagName.toLowerCase();
    const cls = el.className || '';

    if (['SCRIPT','STYLE','SVG','SELECT','INPUT','TEXTAREA','NAV','ASIDE','FOOTER','BUTTON'].includes(tag) && tag !== 'BUTTON') return;
    if (tag === 'svg') return;
    if (el.closest && el.closest('.kb,#nav,#dock,.pageswitch,#toast')) return;

    if (tag === 'button'){
      const k = el.dataset.play;
      if (k && PLAY_DEMOS[k]){
        const d = PLAY_DEMOS[k];
        out.push({ type:'audio', label: textOf(el).replace(/^[▶\s]+/, '') || d.label, notes:d.notes, gap:d.gap });
      }
      return;
    }
    if (tag === 'table'){
      const headers = [...el.querySelectorAll('thead th')].map(textOf);
      const rows = [...el.querySelectorAll('tbody tr')].map(tr => [...tr.children].map(textOf)).filter(r => r.some(Boolean));
      if (rows.length) out.push({ type:'table', headers, rows });
      return;
    }
    if (tag === 'ul' || tag === 'ol'){
      const items = [...el.querySelectorAll(':scope > li')].map(textOf).filter(Boolean);
      if (items.length) out.push({ type:'list', ordered: tag === 'ol', items });
      return;
    }
    if (tag === 'p'){
      const text = textOf(el);
      if (!text) return;
      out.push({ type: /(^|\s)note(\s|$)/.test(cls) ? 'tip' : 'text', text });
      return;
    }
    if (tag === 'h3' || tag === 'h4'){
      const text = textOf(el);
      if (text) out.push({ type:'heading', level: tag === 'h3' ? 3 : 4, text });
      return;
    }
    /* 继续下钻容器；跳过明显只服务教程交互的容器 */
    if (/^(kb|grid2|grid3|row|termnote)$/.test(cls) && tag === 'div'){
      [...el.children].forEach(visit);
      return;
    }
    [...el.children].forEach(visit);
    /* 纯文本兜底：有些卡片把说明直接写在 div 里 */
    if (out.length === 0){
      const text = textOf(el);
      if (text) out.push({ type:'text', text });
    }
  };
  [...container.children].forEach(visit);
  return out;
}

function makeTask(page){
  const audio = page.blocks.some(b => b.type === 'audio');
  const table = page.blocks.some(b => b.type === 'table');
  const list = page.blocks.some(b => b.type === 'list');
  if (audio) return { type:'action', prompt:'听完演示后过页', label:'我听完了', explain:'听到比记住更重要；没听清可以回上一页再听。' };
  if (table) return { type:'action', prompt:'查完这张表后过页', label:'我查完了', explain:'表不是用来背的，是动笔/动耳前先查的工具。' };
  if (list) return { type:'action', prompt:'按顺序读完后过页', label:'我读完了', explain:'顺序本身就是知识的一部分；跳过也不会卡进度。' };
  return { type:'action', prompt:'读完这一页后过页', label:'我读完了', explain:'先看懂再往下走；卡住了就跳过，进度不会因此清零。' };
}

function buildCourse({ file, course, title, short, intro, accent }){
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const sections = [...doc.querySelectorAll('section')];
  const pages = [];
  let order = 0;
  const pushPage = p => { p.order = ++order; p.task = makeTask(p); pages.push(p); };

  sections.forEach(sec => {
    const secId = sec.id || `sec-${pages.length + 1}`;
    const secNum = textOf(sec.querySelector('.sec-num')) || String(pages.length).padStart(2, '0');
    const secTitle = textOf(sec.querySelector('h2')) || title;
    const chapter = `${secNum} ${secTitle}`;

    const lead = sec.querySelector(':scope > .lead');
    if (lead){
      const text = textOf(lead);
      if (text){
        pushPage({
          id: `${course}.${secId}.intro`,
          course, chapter,
          title: secTitle,
          goal: firstSentence(text) || secTitle,
          estimatedSeconds: 45,
          blocks: [{ type:'text', text }],
          skip: true
        });
      }
    }

    [...sec.querySelectorAll(':scope > .card')].forEach((card, ci) => {
      const h3 = card.querySelector('h3');
      const cardTitle = textOf(h3) || `${secTitle} · ${ci + 1}`;
      const blocks = blocksFrom(card);
      if (!blocks.length) return;
      const textSample = blocks.filter(b => b.text).map(b => b.text).join(' ');
      pushPage({
        id: `${course}.${secId}.c${ci + 1}`,
        course, chapter,
        title: shrink(cardTitle, 60),
        goal: firstSentence(textSample) || cardTitle,
        estimatedSeconds: Math.min(180, Math.max(45, Math.round((textSample.length / 6) + blocks.filter(b => b.type === 'audio').length * 25 + 30))),
        blocks,
        skip: true
      });
    });
  });

  return { id: course, title, short, intro, accent, pages };
}

function buildConfig(){
  const courses = SOURCES.map(buildCourse);
  const pages = courses.flatMap(c => c.pages);
  return {
    schemaVersion: 1,
    contentVersion: 'v1.38-derived',
    generatedAt: new Date().toISOString().slice(0, 10),
    courses: courses.map(({ id, title, short, intro, accent }) => ({ id, title, short, intro, accent })),
    pages
  };
}

function serialize(config){
  return `/* ==========================================================================
 * 《姐弟厨师团》 · 互动课内容配置（js/game-data.js）
 * --------------------------------------------------------------------------
 * 本文件由 tools/build-game-config.js 从当前 index.html / lyric.html 生成。
 * 请不要手改；教程内容更新后重新运行生成器。
 * ========================================================================== */
(function(root, factory){
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.COURSE_CONFIG = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
'use strict';
return ${JSON.stringify(config, null, 2)};
});
`;
}

const config = buildConfig();
fs.writeFileSync(OUT, serialize(config), 'utf8');
console.log(`已生成 ${path.relative(ROOT, OUT)}：${config.courses.length} 门课 / ${config.pages.length} 页`);
