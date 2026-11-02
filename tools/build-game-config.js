#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团》 · 互动课配置生成器（tools/build-game-config.js）
 * ---------------------------------------------------------------------------
 * 用法：node tools/build-game-config.js
 * 作用：从 index.html / lyric.html 读取当前课程内容，生成 js/game-data.js。
 *
 * 设计约束：
 *   1. 生成结构化 blocks（text / tip / heading / list / table / svg / audio），
 *      不携带脚本；svg 块是教程装配好的自包含示意图（纯标记，无 script）；
 *   2. 音频演示不手写映射：渲染教程页后逐个点播放按钮，hook voice/clickVoice
 *      捕获排程事件（t/m/d/g/kind/lit），教程改演示后重跑即自动同步；
 *   3. 每个卡片是一页；有 lead 的章节再加一页章节导语；
 *   4. 页面 id 与章节 id + 页内序号绑定，发布后不要随意改；
 *   5. 输出文件可被浏览器、Node、小程序共用，本脚本只用于维护时重新生成。
 * ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js/game-data.js');

const SOURCES = [
  { file: 'index.html', course: 'music', title: '乐理课', short: '听出来', intro: '把乐理课的每一张卡片变成一页可玩、可跳过的知识点。', accent: 'purple' },
  { file: 'lyric.html', course: 'lyric', title: '作词课', short: '改出来', intro: '把作词课的每一张卡片变成一页可查、可练、可跳过的判据。', accent: 'amber' }
];

function textOf(el){ return ((el && el.textContent) || '').replace(/\s+/g, ' ').trim(); }
function hasClass(el, name){ const cls = String(el.className || ''); return cls.split(/\s+/).includes(name); }
function firstSentence(s){
  const t = String(s || '').trim();
  if (!t) return '';
  const m = t.match(/^.{6,80}?[。；;！!？?]/);
  return (m ? m[0] : t.slice(0, 80)).trim();
}
function shrink(s, n){ s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

/* 教程页很多表格和卡片是 JS 装配出来的；配置必须等页面跑完再抽，
 * 否则就会抽出“只有标题”的空页。 */
async function loadRenderedDoc(file){
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => {
    const msg = String(e && e.detail && e.detail.message || e && e.message || e);
    if (!/Not implemented/i.test(msg)) console.warn(`[${file}]`, msg);
  });
  const dom = await JSDOM.fromFile(path.join(ROOT, file), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window){
      const param = () => ({
        value: 0,
        setValueAtTime(){}, linearRampToValueAtTime(){},
        exponentialRampToValueAtTime(){}, setTargetAtTime(){},
        cancelScheduledValues(){},
      });
      const node = () => ({ connect(){}, disconnect(){} });
      class StubAudioContext {
        constructor(){
          this.currentTime = 0; this.state = 'running'; this.sampleRate = 44100;
          this.destination = node();
        }
        resume(){ return Promise.resolve(); }
        createGain(){ return Object.assign(node(), { gain: param() }); }
        createBiquadFilter(){ return Object.assign(node(), { type:'', frequency:param(), Q:param() }); }
        createDynamicsCompressor(){ return Object.assign(node(), { threshold:param(), ratio:param(), knee:param(), attack:param(), release:param() }); }
        createOscillator(){ return Object.assign(node(), { type:'', frequency:param(), detune:param(), start(){}, stop(){} }); }
        createBufferSource(){ return Object.assign(node(), { buffer:null, loop:false, start(){}, stop(){} }); }
        createBuffer(ch, len){ return { getChannelData: () => new Float32Array(len) }; }
      }
      window.AudioContext = StubAudioContext;
      window.webkitAudioContext = StubAudioContext;
    },
  });
  await new Promise(resolve => {
    if (dom.window.document.readyState === 'complete') return resolve();
    dom.window.addEventListener('load', resolve, { once: true });
  });
  return { doc: dom.window.document, win: dom.window };
}

/* ---------------------------------------------------------------------------
 * 演示捕获：hook 教程的 seq / voice / clickVoice，然后逐个点卡里的播放按钮。
 *   seq(steps) —— 绝大多数演示走它，steps 同步到手（时刻/音高/时长/力度/音色/
 *                 点亮位/拍点），是最佳数据源；其内部 voice 是 setTimeout 异步
 *                 调的，同步窗口里根本收不到，所以必须 hook seq 本身。
 *   voice / clickVoice 直调 —— 和弦进行 playProg、节拍器 playMeter 这类
 *                 不经 seq 的演示走它们，同步窗口内就能收到。
 * 好处：演示内容与教程永远同源——教程改了演示，重跑生成器即自动同步，
 * 不再需要维护一份手工 PLAY_DEMOS 映射表（那种表教程一改就悄悄失真）。
 * ------------------------------------------------------------------------- */
function captureDemos(win, container){
  const blocks = [];
  const origSeq = win.seq, origVoice = win.voice, origClick = win.clickVoice;
  if (typeof origSeq !== 'function' && typeof origVoice !== 'function') return blocks;
  let batch = null;
  if (typeof origSeq === 'function'){
    win.seq = function(steps, litSel){
      if (batch && Array.isArray(steps)){
        steps.forEach(s => {
          if (s.c) batch.push({ at: s.at, click: true, strong: !!s.strong });
          else if (Number.isInteger(s.m)) batch.push({ at: s.at, m: s.m, d: s.d || 0.9, g: s.g || 0.4, kind: s.kind || 'piano', lit: s.lit });
        });
      }
      return origSeq.apply(this, arguments);
    };
  }
  if (typeof origVoice === 'function'){
    win.voice = function(m, at, d, g, kind, bus, litKey){
      if (batch && Number.isInteger(m)) batch.push({ at, m, d: d || 0.9, g: g || 0.4, kind: kind || 'piano', lit: litKey || undefined });
      return origVoice.apply(this, arguments);
    };
  }
  if (typeof origClick === 'function'){
    win.clickVoice = function(at, strong){
      if (batch) batch.push({ at, click: true, strong: !!strong });
      return origClick.apply(this, arguments);
    };
  }

  const stopIt = () => { try { if (win.MET && win.MET.timer) win.MET.stop(); } catch (e) {} };
  const toEvs = arr => {
    if (!arr.length) return null;
    const t0 = Math.min(...arr.map(e => e.at));
    const items = arr
      .map(e => {
        const t = Math.round((e.at - t0) * 1000) / 1000;
        return e.click
          ? { t, click: true, strong: e.strong }
          : { t, m: e.m, d: Math.round(e.d * 1000) / 1000, g: e.g, kind: e.kind, lit: e.lit };
      })
      .sort((a, b) => a.t - b.t);
    return items.length ? items : null;
  };

  [...container.querySelectorAll('button')].forEach(btn => {
    const raw = (btn.textContent || '').replace(/\s+/g, ' ').trim();
    const label = raw.replace(/^[▶■✕]\s*/, '').trim();
    if (!label || /停止|开始|播放中/.test(label)) return;   /* 停止键与节拍器长跑不捕获 */
    batch = [];
    try { btn.click(); } catch (e) { /* 桩环境下个别演示点不动就跳过 */ }
    const evs = toEvs(batch); batch = null;
    if (evs) blocks.push({ type: 'audio', label: shrink(label, 40), evs });
    stopIt();
  });

  if (typeof origSeq === 'function') win.seq = origSeq;
  if (typeof origVoice === 'function') win.voice = origVoice;
  if (typeof origClick === 'function') win.clickVoice = origClick;
  return blocks;
}

const SKIP_TAGS = new Set([
  'SCRIPT','STYLE','SELECT','INPUT','TEXTAREA','NAV','ASIDE','FOOTER',
  'LINK','META','IFRAME','CANVAS','AUDIO','VIDEO','HR','SUP','SUB'
]);
const NOTE_CLASSES = /(^|\s)(note|termnote)(\s|$)/;

/* 纯函数式抽取：遍历 childNodes，把散落的文本节点也收进来。
 * 教程卡片里大量说明文字直接写在 div / b / span 里，
 * 只看元素子节点会把它们整段丢掉——这正是"空内容页"的另一半根因。 */
function blocksFrom(container){
  const out = [];
  let pending = '';
  const flush = () => {
    const t = pending.replace(/\s+/g, ' ').trim();
    if (t) out.push({ type:'text', text:t });
    pending = '';
  };

  const visit = node => {
    if (node.nodeType === 3){ pending += node.textContent + ' '; return; }
    if (node.nodeType !== 1) return;
    flush();
    const el = node;
    const tag = el.tagName.toLowerCase();

    if (SKIP_TAGS.has(el.tagName)) return;
    if (el.closest && el.closest('.kb,#nav,#dock,.pageswitch,#toast')) return;

    if (tag === 'svg'){
      /* 教程的阶梯图 / 对比图 / 网格图都是 JS 装配好的自包含 SVG。
       * 整块序列化成 svg 块（无脚本、纯标记），互动课原样渲染；
       * 若整体下钻，SVG 里的键名 text 会被拆成一堆看不懂的单字块。 */
      const html = el.outerHTML || '';
      if (html.length > 60 && !/<script/i.test(html)) out.push({ type:'svg', svg: html });
      return;
    }
    if (tag === 'button') return;   /* 音频演示统一由 captureDemos 捕获生成，按钮本身不再抽取 */
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
    if (tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6'){
      const text = textOf(el);
      if (text) out.push({ type:'heading', level: tag === 'h3' ? 3 : 4, text });
      return;
    }
    /* 说明框整段收成 tip（p.note / div.note / div.termnote 都算） */
    if (tag === 'p' || NOTE_CLASSES.test(el.className || '')){
      const text = textOf(el);
      if (text) out.push({ type: NOTE_CLASSES.test(el.className || '') ? 'tip' : 'text', text });
      return;
    }
    /* 其余容器继续下钻；文本节点已由 visit 顶部接住 */
    [...el.childNodes].forEach(visit);
    flush();
  };

  [...container.childNodes].forEach(visit);
  flush();
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

async function buildCourse({ file, course, title, short, intro, accent }){
  const { doc, win } = await loadRenderedDoc(file);
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

    /* 卡片不一定是 section 的直接子级（有的包在排版 div 里），
     * 要收全部 .card，但只收最外层，避免嵌套卡片重复出页。 */
    [...sec.querySelectorAll('.card')].filter(card => !card.parentElement.closest('.card')).forEach((card, ci) => {
      const h3 = card.querySelector('h3');
      const cardTitle = textOf(h3) || `${secTitle} · ${ci + 1}`;
      /* 先抽结构化内容（含整块 SVG），再点播放按钮捕获演示事件——
       * 点击会重画部分示意图，顺序反了会存下最后一个变体的图。 */
      const blocks = blocksFrom(card).concat(captureDemos(win, card));
      if (!blocks.some(b => b.type !== 'heading')) return;
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

async function buildConfig(){
  const courses = [];
  for (const src of SOURCES) courses.push(await buildCourse(src));
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

(async () => {
  const config = await buildConfig();
  fs.writeFileSync(OUT, serialize(config), 'utf8');
  console.log(`已生成 ${path.relative(ROOT, OUT)}：${config.courses.length} 门课 / ${config.pages.length} 页`);

  /* 体检：不允许"只剩标题"的空页再溜进配置 */
  const empty = config.pages.filter(p => !p.blocks.some(b => b.type !== 'heading'));
  if (empty.length){
    console.error(`警告：仍有 ${empty.length} 页只有标题没有内容：\n  ${empty.map(p => p.id).join('\n  ')}`);
    process.exitCode = 1;
  } else {
    console.log('体检通过：每一页都有标题之外的内容块。');
  }
})().catch(err => { console.error(err); process.exit(1); });
