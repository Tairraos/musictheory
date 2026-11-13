#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团》 · 卡片版数据生成器（tools/build-cards-data.js）
 * ----------------------------------------------------------------------------
 * 卡片版（cards.html）不重写课程内容：它把三个长网页里的**文字**抽出来，
 * 再按卡片的尺寸切页。这个脚本负责"抽"这一步，产出 js/cards-data.js。
 *
 * 为什么要在 jsdom 里**真的跑一遍页面脚本**再抽：
 *   三页里大量文字是 JS 装配的（乐器家族导语、各张速查表、古风节的三型说明）。
 *   静态读 HTML 只能抽到"只剩标题"的空壳——游戏版生成器踩过这个坑
 *   （38 页只剩标题），这里必须用同一套办法：load → 等脚本跑完 → 再抽。
 *
 * 抽取规则：
 *   · 只取"文字块"：h3/h4、p、ul/ol、table、.note/.termnote、.mini
 *   · 跳过交互件（button/select/svg/示意图容器）与整块乐器卡（卡片版自己画）
 *   · 段落里的行内 <b>/<i>/<code> 保留，其余标签与全部属性剥掉
 *   · 空白折叠成单个空格（源码里的换行缩进不该变成页面里的空洞）
 *
 * 用法：node tools/build-cards-data.js
 * ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');

/* -------------------------------------------------------------------------- *
 * jsdom 装载（与 tests/run-tests.js 同一套桩：没有音频设备，也没有布局）
 * -------------------------------------------------------------------------- */
function makeAudioStub() {
  const param = () => ({
    value: 0,
    setValueAtTime() {}, linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {}, setTargetAtTime() {},
    cancelScheduledValues() {},
  });
  const node = () => ({ connect() {}, disconnect() {} });
  return class StubAudioContext {
    constructor() {
      this.currentTime = 0;
      this.state = 'running';
      this.sampleRate = 44100;
      this.destination = node();
    }
    resume() { return Promise.resolve(); }
    createGain() { return Object.assign(node(), { gain: param() }); }
    createBiquadFilter() { return Object.assign(node(), { type: '', frequency: param(), Q: param() }); }
    createDynamicsCompressor() {
      return Object.assign(node(), { threshold: param(), ratio: param(), knee: param(), attack: param(), release: param() });
    }
    createOscillator() { return Object.assign(node(), { type: '', frequency: param(), detune: param(), start() {}, stop() {} }); }
    createBufferSource() { return Object.assign(node(), { buffer: null, loop: false, start() {}, stop() {} }); }
    createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
  };
}

async function load(file) {
  const vc = new VirtualConsole();          /* 布局缺口类的 jsdomError 一律吞掉 */
  vc.on('jsdomError', () => {});
  const dom = await JSDOM.fromFile(path.join(ROOT, file), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      const Stub = makeAudioStub();
      window.AudioContext = Stub;
      window.webkitAudioContext = Stub;
      for (const prop of ['offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight']) {
        if (!Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, prop)) {
          Object.defineProperty(window.HTMLElement.prototype, prop, { get() { return 0; }, configurable: true });
        }
      }
    },
  });
  await new Promise(res => {
    if (dom.window.document.readyState === 'complete') return res();
    dom.window.addEventListener('load', res);
  });
  return dom;
}

/* -------------------------------------------------------------------------- *
 * 清洗：留下"能读的字"，剥掉一切表现层
 * -------------------------------------------------------------------------- */
const KEEP = ['B', 'STRONG', 'I', 'EM', 'CODE', 'BR', 'SMALL', 'SUP', 'SUB'];

/* 这些子树整块不要：交互件、示意图、乐器卡、导航 */
const DROP_SEL = [
  'button', 'select', 'input', 'textarea', 'svg', '.tri',
  '.sec-head', '.pageswitch', '.hero', '#nav', '#dock', '#toast', '.footer',
  '.inst', '[data-fam-cards]', '[data-fam-chart]', '#chartAll',
  '.rchart-wrap', '.rchart-cap', '.swipe-top', '.octs', '.dens', '.facts',
  /* 91 张"听感配方"场景卡由卡片版按维度重画（带播放），
     这里若按文字块抽出来，会把 91 个标题 + 91 段描述全变成纯文字卡 */
  '.scene',
  '.ladder', '.beats', '.row', '.stretch',
  /* 作词课 01 节那个"体裁面板"是控件的**输出**：面板里的每一条（方案字母、
     严格度、句式、纪律）都由卡片版的 genres 互动卡重新给出。原样搬文字，
     只会剩下"Pop / 默认押韵方案 / 第 1–4 行"三个失去指代的标签。 */
  '#genrePanel',
  /* 和弦进行 / 终止式的那两排和弦块同样是**控件的输出**（renderStrip /
     renderCad 现画的 div），卡片版由 progression / cadence 互动卡重画。
     不剔除的话，块里那个 `<div class="mini mono">` 会被当成 .mini 段落抓走，
     于是每一节都多出几张只印着「I」「V」「vi」「IV」的卡片——
     读者看到的是四个孤零零的罗马数字，没有任何指代。 */
  '#progStrip', '#progChips', '#cadStrip', '#cadChips',
].join(',');

function cleanHtml(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(DROP_SEL).forEach(n => n.remove());
  /* 反向遍历：先把深层的不认识标签摊平，再处理外层 */
  [...clone.querySelectorAll('*')].reverse().forEach(n => {
    if (!KEEP.includes(n.tagName)) {
      n.replaceWith(...Array.from(n.childNodes));
    } else {
      [...n.attributes].forEach(a => n.removeAttribute(a.name));
    }
  });
  const w = clone.ownerDocument.createTreeWalker(clone, 4 /* SHOW_TEXT */);
  const texts = [];
  while (w.nextNode()) texts.push(w.currentNode);
  texts.forEach(t => { t.nodeValue = t.nodeValue.replace(/\s+/g, ' '); });
  return clone.innerHTML.replace(/\s+/g, ' ').trim();
}

const textOf = html => String(html).replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const BLOCK_SEL = 'h3,h4,p,ul,ol,table,blockquote,.note,.termnote,.mini';

/* 交互卡（.card 里有按钮/下拉/示意图）里的"说明性小标题"与"占位提示"
   在卡片版是噪音：卡片版给同一件事画的是真能点的互动卡，标题由互动卡自己写。
   判据只认两样——h3，以及 24 字以内的 note——长的 note 往往是有用的讲解，留着。 */
function inInteractiveCard(el) {
  const card = el.closest('.card');
  if (!card) return false;
  return !!card.querySelector('button,select,input,.ladder');
}

/* 有示意图的卡：示意图本身（svg）卡片版不搬，所以"橙色块往上移"这类
   指着图说话的 note 也不能留——图不在，话就悬空了。 */
function inDiagramCard(el) {
  const card = el.closest('.card');
  return !!(card && card.querySelector('.ladder'));
}

function tableBlock(el) {
  const head = [...el.querySelectorAll('thead th')].map(th => cleanHtml(th)).filter(Boolean);
  const rows = [];
  [...el.querySelectorAll('tbody tr, tr')].forEach(tr => {
    if (tr.closest('thead')) return;
    const cells = [...tr.children].map(td => cleanHtml(td));
    if (cells.some(c => textOf(c))) rows.push(cells);
  });
  if (!head.length && !rows.length) return null;
  return { t: 'table', head, rows };
}

function blockOf(el) {
  const tag = el.tagName;
  if (tag === 'TABLE') return tableBlock(el);
  if (tag === 'UL' || tag === 'OL') {
    const items = [...el.querySelectorAll(':scope > li')].map(li => cleanHtml(li)).filter(h => textOf(h));
    return items.length ? { t: 'list', ord: tag === 'OL', items } : null;
  }
  const html = cleanHtml(el);
  const txt = textOf(html);
  if (!txt || /^[—–-]+$/.test(txt)) return null;
  if (/^(点一个听|点一行听|点一下听)/.test(txt) && txt.length < 10) return null;  /* 空交互提示 */
  if (tag === 'H3' || tag === 'H4') {
    if (inInteractiveCard(el)) return null;      /* 交互卡自带标题，不再留一条孤立小标题 */
    return { t: 'h3', h: html };
  }
  if (el.classList.contains('note') || el.classList.contains('termnote') || tag === 'BLOCKQUOTE') {
    if (inDiagramCard(el)) return null;                          /* 指着示意图说话的说明 */
    if (inInteractiveCard(el) && txt.length < 24) return null;   /* "点一个音开始。" 这类占位 */
    return { t: 'note', h: html };
  }
  /* 注意：不要按"在交互卡里就丢掉 .mini"一刀切——乐理课的 .mini 多数是
     "重音落在：每个和弦的第一下"这类正经文图注，一刀切会丢五十来个文字块。
     交互面板的标签用 #genrePanel 这种"容器级"剔除（见 DROP_SEL）。 */
  /* 但 .mini 紧跟 .big 是个例外：那是"标签 + 当前值"的实时读数
     （音程名称 — / 包含几个半音 —），值由旁边那个下拉算出来。
     卡片版没有那个下拉，标签留下来就成了两句没主的话。 */
  if (el.classList.contains('mini') && el.nextElementSibling &&
      el.nextElementSibling.classList.contains('big')) return null;
  if (el.classList.contains('lead')) return { t: 'lead', h: html };
  return { t: 'p', h: html };
}

/* 递归按文档顺序取块；命中一个块就不再往里走（避免 p 套 li 之类的重复） */
function collectBlocks(root, out) {
  for (const child of Array.from(root.children)) {
    if (child.matches(DROP_SEL)) continue;
    if (child.matches(BLOCK_SEL)) {
      const b = blockOf(child);
      if (b) out.push(b);
      continue;
    }
    collectBlocks(child, out);
  }
}

/* 相邻同一段落去重（装配层常把同一句同时塞进 note 与小字） */
function dedupe(blocks) {
  const out = [];
  for (const b of blocks) {
    const key = textOf(b.h || (b.items || []).join(' ') || (b.rows || []).map(r => r.join('')).join(' '));
    if (!key) continue;
    const prev = out[out.length - 1];
    const prevKey = prev ? textOf(prev.h || (prev.items || []).join(' ') ||
      (prev.rows || []).map(r => r.join('')).join(' ')) : '';
    if (prev && key === prevKey && prev.t === b.t) continue;
    out.push(b);
  }
  return out;
}

/* -------------------------------------------------------------------------- *
 * 逐课抽取
 * -------------------------------------------------------------------------- */
const COURSES = [
  { id: 'theory', page: 'index.html', name: '乐理课', en: 'Theory', accent: 'purple',
    hero: 'assets/images/hero-art.png',
    kicker: '能点、能听、能自己试' },
  { id: 'lyric', page: 'lyric.html', name: '作词课', en: 'Lyric', accent: 'pink',
    hero: 'assets/images/hero-lyrics.png',
    kicker: '词怎么才站得住' },
  { id: 'instrument', page: 'instrument.html', name: '乐器课', en: 'Instrument', accent: 'teal',
    hero: 'assets/images/hero-instrument.png',
    kicker: '这句旋律该给谁' },
];

function sectionsOf(doc) {
  return [...doc.querySelectorAll('section')].map(sec => {
    const numEl = sec.querySelector('.sec-head .sec-num');
    const titleEl = sec.querySelector('.sec-head h2');
    const blocks = [];
    collectBlocks(sec, blocks);
    const title = titleEl ? textOf(cleanHtml(titleEl)) : '';
    return {
      id: sec.id,
      num: numEl ? textOf(numEl.textContent) : '',
      title,
      blocks: dedupe(blocks),
    };
  }).filter(s => s.title && s.blocks.length);
}

async function extract(course) {
  const dom = await load(course.page);
  const doc = dom.window.document;
  const introEl = doc.querySelector('.hero .intro');
  const intro = introEl ? cleanHtml(introEl) : '';
  const sections = sectionsOf(doc);
  dom.window.close();
  return { ...course, intro, sections };
}

(async () => {
  const out = { courses: {} };
  for (const course of COURSES) {
    const c = await extract(course);
    out.courses[c.id] = {
      id: c.id, name: c.name, en: c.en, accent: c.accent,
      hero: c.hero, kicker: c.kicker, intro: c.intro,
      sections: c.sections,
    };
    const blocks = c.sections.reduce((n, s) => n + s.blocks.length, 0);
    console.log(`  ${c.name}: ${c.sections.length} 节 / ${blocks} 个文字块`);
  }

  const today = new Date();
  const stamp = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')].join('-');

  const js = `/* ==========================================================================
 * 《姐弟厨师团》 · 卡片版课程内容（js/cards-data.js）
 * --------------------------------------------------------------------------
 * **本文件由 tools/build-cards-data.js 生成，不要手改。**
 * 内容来自 index.html / lyric.html / instrument.html 的文字层：
 * 长网页改了文案，重跑 \`node tools/build-cards-data.js\` 即可同步。
 *
 * 每块 = 卡片切页的最小单位：
 *   {t:'lead'|'p'|'note'}   h = 行内 HTML（只留 b/i/em/code/br）
 *   {t:'h3'}                h = 小标题
 *   {t:'list', ord, items}  列表
 *   {t:'table', head, rows} 表格（卡片里按行分页，不横滑）
 * 生成于 ${stamp}
 * ========================================================================== */
window.CARDS_DATA = ${JSON.stringify(out, null, 1)};
`;

  fs.writeFileSync(path.join(ROOT, 'js/cards-data.js'), js);
  const kb = (Buffer.byteLength(js) / 1024).toFixed(0);
  console.log(`✓ js/cards-data.js（${kb} KB）`);
})();
