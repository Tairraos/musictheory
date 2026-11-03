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
  /* chips 顺带捕获过的"整条播放"按钮 id：targets 循环再遇到时跳过，避免重复 */
  const wholePlayDone = new Set();
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

  /* 可点击元素全集（按文档序）：
   *   button            —— 大多数演示
   *   tbody tr.click    —— "点一行听一下"的表格行
   *   任何 onclick 函数 —— 和弦块（progStrip/cadStrip 的 div）这类非常规入口；
   *                        有可点击后代的容器跳过，避免父子重复捕获 */
  const isClickableRow = el => el.tagName === 'TR' && /(^|\s)click(\s|$)/.test(el.className);
  const targets = [...container.querySelectorAll('*')].filter(el => {
    if (el.tagName === 'BUTTON') return true;
    if (isClickableRow(el)) return true;
    if (typeof el.onclick !== 'function') return false;
    return !el.querySelector('button, [onclick]');
  });
  targets.forEach(el => {
    const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
    let label = raw.replace(/^[▶■✕]\s*/, '').trim();
    if (isClickableRow(el)) label = [...el.children].slice(0, 2).map(textOf).filter(Boolean).join(' ');
    /* 节拍器：MET 用 setInterval 前瞻排程、直调 AudioContext，不经 seq/voice
     * 根本捕不到，label 还是"开始"会被下面的过滤排除——单独读 MET 真值
     * （点击后 beats/bpm 已更新）合成两轮拍点，教程改默认值重跑即同步 */
    if (el.id === 'metPlay'){
      try {
        const M = win.MET || {}, beats = M.beats || 4, spb = 60 / (M.bpm || 90);
        const evs = [];
        for (let i = 0; i < beats * 2; i++) evs.push({ t: Math.round(i * spb * 1000) / 1000, click: true, strong: i % beats === 0 });
        blocks.push({ type: 'audio', label: '节拍器 · ' + (M.bpm || 90) + ' BPM', evs });
      } catch (e) {}
      stopIt();
      return;
    }
    if (!label || label === '开始' || /停止|播放中/.test(label)) return;   /* 停止键与节拍器长跑不捕获 */
    if (el.id && wholePlayDone.has(el.id)) return;                          /* 已随 chip 顺带捕获 */
    /* 点击会重画的共享容器（六个和弦进行 chips 共用一个 #progStrip）：先快照，
     * 点击后内容变了就补一份对应进度的 strip——否则五分之四的进行只有声音没有图 */
    let snapshots = [];
    try { snapshots = [...win.document.querySelectorAll('#progStrip,#cadStrip')].map(b => b.innerHTML); } catch (e) {}
    batch = [];
    try { el.click(); } catch (e) { /* 桩环境下个别演示点不动就跳过 */ }
    const evs = toEvs(batch); batch = null;
    /* 点击后内容变了的共享容器 → 一份对应进度的 strip（先图后听，紧跟配音）；
     * 该容器若挂着整条播放按钮（progPlay/cadPlay），顺带点一次把整条序列也存下来 */
    const redrawn = [];
    let playBtnId = null;
    try {
      [...win.document.querySelectorAll('#progStrip,#cadStrip')].forEach((box, i) => {
        if (box.innerHTML !== snapshots[i]){
          const items = chordStripItems(box);
          if (items.length) redrawn.push({ type: 'strip', chords: true, items });
          playBtnId = box.id === 'progStrip' ? 'progPlay' : 'cadPlay';
        }
      });
    } catch (e) {}
    if (redrawn.length) blocks.push(...redrawn);
    if (playBtnId){
      const play = win.document.getElementById(playBtnId);
      if (play){
        wholePlayDone.add(playBtnId);
        batch = [];
        try { play.click(); } catch (e) {}
        const pevs = toEvs(batch); batch = null;
        if (pevs) blocks.push({ type: 'audio', label: shrink(label + ' · 整条', 40), evs: pevs });
      }
    } else if (/(^|\s)on(\s|$)/.test(String(el.className))){
      /* 初始就选中的 chip：重画内容与快照相同、检不出"变"，但它的整条播放
       * 还没存——按所在卡补捕获（.chip.on 只在 chips 初始态出现，普通按钮不带） */
      const card = el.closest ? el.closest('.card') : null;
      const pid = card && card.querySelector('#progPlay') ? 'progPlay'
        : card && card.querySelector('#cadPlay') ? 'cadPlay' : null;
      if (pid && !wholePlayDone.has(pid)){
        const play = win.document.getElementById(pid);
        if (play){
          wholePlayDone.add(pid);
          batch = [];
          try { play.click(); } catch (e) {}
          const pevs = toEvs(batch); batch = null;
          if (pevs) blocks.push({ type: 'audio', label: shrink(label + ' · 整条', 40), evs: pevs });
        }
      }
    }
    if (evs){
      const a = { type: 'audio', label: shrink(label, 40), evs };
      /* 表格行捕获的演示打 fromRow 标记：组页时注入所属表格块的行上，
       * 互动课里恢复"点一行听一下"的教程体验 */
      if (isClickableRow(el)) a.fromRow = true;
      blocks.push(a);
    }
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
/* 行内元素不是块边界：它们的内容要并入当前文本流，
 * 否则 <b>块状</b>（织体 block）会被拆成"块状""（织体 block）"两块散字 */
const INLINE_TAGS = new Set([
  'B','STRONG','EM','I','U','S','SPAN','A','CODE','SMALL','MARK','Q','ABBR','CITE','KBD','VAR','DEL','INS'
]);
const NOTE_CLASSES = /(^|\s)(note|termnote)(\s|$)/;
/* 标题里的括号操作提示（"点一行听一下"等）说的是教程页的交互方式，
 * 互动课里播放入口不一样，留着只会显得标题啰嗦——页标题与 heading 块都清 */
const PAREN_HINT_RE = /（[^）]*点[^）]*）\s*$/;

/* 和弦块条（#progStrip / #cadStrip）→ strip items：
 * 每块三行（级数 / 音名 / 大小），blocksFrom 抽初始 DOM、
 * captureDemos 在点击重画后各抽一份（六个进行共用同一容器） */
function chordStripItems(box){
  return [...box.children].map(b => {
    const q = b.querySelector('span.q');
    return {
      sub: textOf(b.children[0]),
      main: textOf(b.children[1]),
      q: q ? (String(q.className).split(/\s+/)[1] || '') : '',
      t: q ? textOf(q) : '',
    };
  }).filter(x => x.main);
}

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
    const el = node;
    const tag = el.tagName.toLowerCase();

    /* 行内元素：内容并入当前文本流（不构成块边界），相邻之间留一个空格。
     * 必须放在 flush() 之前，否则 <b>块状</b>（织体 block）仍会被拆成两块。 */
    if (INLINE_TAGS.has(el.tagName)){
      [...el.childNodes].forEach(visit);
      pending += ' ';
      return;
    }
    flush();

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
    if (tag === 'div'){
      const id = el.id;
      /* 交互输出框（div.big#ivName 这类"点选择器后的大数字"）与它的标签：
       * 值是教程交互的动态输出，对互动课没有意义，整对不抽；
       * 静态 .big（如"5–9 字"）不带 id，正常保留 */
      if (hasClass(el, 'big') && id) return;
      if (hasClass(el, 'mini')){
        const nx = el.nextElementSibling;
        if (nx && hasClass(nx, 'big') && nx.id) return;
      }
      /* 表单控件容器（BPM 滑杆/循环开关这类教程交互件）整块不抽，
       * 否则"速度 88 循环"会变成三块莫名其妙的散字 */
      if (el.querySelector('input, select, textarea')) return;
      /* 拍点圆点条（tempoBeats/meterBeats/metBeatsDots/rhythmDots）：
       * 整体抽成 strip 块，否则"强 · ·"会被拆成散字 */
      if (el.children.length && [...el.children].every(c => hasClass(c, 'beat'))){
        out.push({ type:'strip', items: [...el.children].map(c => ({ main: textOf(c), strong: hasClass(c, 'strong') })) });
        return;
      }
      /* 押韵方案字母格（lyric 体裁面板的 .schg）：X A X A 一格一字母，
       * 不抽会散成四个单字块、再被组名吸附串成冒号链 */
      if (hasClass(el, 'schg') && el.children.length){
        out.push({ type:'strip', items: [...el.children].map(c => ({ main: textOf(c), strong: !/x/i.test(String(c.className)) })) });
        return;
      }
      /* 和弦块条（progStrip/cadStrip）：级数 + 音名 + 大小，块本身可点播 */
      if (id === 'progStrip' || id === 'cadStrip'){
        const items = chordStripItems(el);
        if (items.length){ out.push({ type:'strip', chords: true, items }); return; }
      }
      /* lyr 时间轴（stressFig/phraseFig/breathFig/langFig/ensMel/cantonFig）：
       * 字块按百分比定位，照抄位置存成结构化行，渲染层还原同款视觉 */
      if (el.querySelector(':scope > .lyr-row')){
        const rows = [...el.querySelectorAll(':scope > .lyr-row')].map(row => {
          const tl = row.querySelector('.lyr-tl');
          return {
            lab: textOf(row.querySelector('.lyr-lab')),
            boxes: tl ? [...tl.children].map(b => ({
              ch: textOf(b),
              at: parseFloat(b.style.left) || 0,
              w: parseFloat(b.style.width) || 0,
              cls: String(b.className).replace(/\blyr-b\b/g, '').trim(),
            })) : [],
          };
        });
        const m = (el.querySelector('.lyr-tl') || {}).getAttribute ?
          (el.querySelector('.lyr-tl').getAttribute('style') || '').match(/--beats:\s*(\d+)/) : null;
        const note = [...el.querySelectorAll(':scope > .mini')].map(textOf).filter(Boolean).join(' ');
        if (rows.length){ out.push({ type:'lyr', beats: m ? +m[1] : null, rows, note: note || undefined }); return; }
      }
    }
    if (tag === 'button') return;   /* 音频演示统一由 captureDemos 捕获生成，按钮本身不再抽取 */
    if (tag === 'table'){
      const headers = [...el.querySelectorAll('thead th')].map(textOf);
      const rows = [], clickRows = [];
      [...el.querySelectorAll('tbody tr')].forEach(tr => {
        const cells = [...tr.children].map(textOf);
        if (!cells.some(Boolean)) return;
        /* "点一行听一下"的行：记下行索引，captureDemos 捕到的行音频按序回填到这些行 */
        if (/(^|\s)click(\s|$)/.test(tr.className)) clickRows.push(rows.length);
        rows.push(cells);
      });
      if (rows.length) out.push({ type:'table', headers, rows, clickRows });
      return;
    }
    if (tag === 'ul' || tag === 'ol'){
      const items = [...el.querySelectorAll(':scope > li')].map(textOf).filter(Boolean);
      if (items.length) out.push({ type:'list', ordered: tag === 'ol', items });
      return;
    }
    if (tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6'){
      const text = textOf(el).replace(PAREN_HINT_RE, '').trim();
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

/* 组名吸附：b/strong 组名（"思念""BPM"）常独立成短块，把它吸进下一段开头。
 * 已带冒号/句读结尾的块是有意的独立行，不吸。 */
function absorbLabels(blocks){
  for (let i = blocks.length - 2; i >= 0; i--){
    const a = blocks[i], b = blocks[i + 1];
    if (a.type === 'text' && b.type === 'text' &&
        a.text.length <= 6 && !/[：:。！？；…]$/.test(a.text) && b.text.length > 6){
      b.text = a.text + '：' + b.text;
      blocks.splice(i, 1);
    }
  }
  return blocks;
}

/* 散字体检：一页里出现 ≥3 个 ≤4 字的孤立 text 块，多半是某个 JS 装配的图
 * 被拆散了（和弦条/拍点条/时间轴该走 strip/lyr，表格该走 table）。
 * 作为生成器的硬体检：教程内容改动后重跑，一散就红。 */
function scatteredPages(config){
  return config.pages.filter(p => {
    const shorts = p.blocks.filter(b => b.type === 'text' && b.text && b.text.length <= 4);
    return shorts.length >= 3;
  });
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
      const cardTitle = (textOf(h3) || `${secTitle} · ${ci + 1}`)
        .replace(PAREN_HINT_RE, '').trim() || (h3 ? textOf(h3) : `${secTitle} · ${ci + 1}`);
      /* 先抽结构化内容（含整块 SVG），再点播放按钮捕获演示事件——
       * 点击会重画部分示意图，顺序反了会存下最后一个变体的图。 */
      let blocks = absorbLabels(blocksFrom(card).concat(captureDemos(win, card)));
      /* chords strip 去重：点击初始就选中的 chip 会重画出与 blocksFrom 初始
       * DOM 相同的内容，若字符串比较没兜住，同页保留第一份即可 */
      const seenChords = new Set();
      blocks = blocks.filter(b => {
        if (b.type !== 'strip' || !b.chords) return true;
        const sig = JSON.stringify(b.items);
        if (seenChords.has(sig)) return false;
        seenChords.add(sig);
        return true;
      });
      /* "点一行听一下"回填：表格行捕获的 audio（fromRow，文档序与 clickRows 对齐）
       * 注入本卡唯一表格块的对应行——互动课表格行本身可点，与教程体验一致；
       * 多表或数目对不上时保守跳过，audio 保留为独立播放行。 */
      const tables = blocks.filter(b => b.type === 'table');
      const rowAudios = blocks.filter(b => b.type === 'audio' && b.fromRow);
      if (tables.length === 1 && rowAudios.length){
        const t = tables[0];
        const targets = (t.clickRows || []);
        if (targets.length === rowAudios.length){
          t.rowsAudio = targets.map((ri, i) => ({ label: rowAudios[i].label, evs: rowAudios[i].evs }));
          blocks = blocks.filter(b => !(b.type === 'audio' && b.fromRow));
        }
      }
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

  /* 体检 1：不允许"只剩标题"的空页再溜进配置 */
  const empty = config.pages.filter(p => !p.blocks.some(b => b.type !== 'heading'));
  if (empty.length){
    console.error(`警告：仍有 ${empty.length} 页只有标题没有内容：\n  ${empty.map(p => p.id).join('\n  ')}`);
    process.exitCode = 1;
  } else {
    console.log('体检通过：每一页都有标题之外的内容块。');
  }

  /* 体检 2：散字页——某个 JS 装配的图被拆成散字了 */
  const scattered = scatteredPages(config);
  if (scattered.length){
    console.error(`警告：${scattered.length} 页疑似有图被拆成散字（≥3 个 ≤4 字的孤立文本块）：`);
    scattered.forEach(p => {
      const s = p.blocks.filter(b => b.type === 'text' && b.text.length <= 4).map(b => '「' + b.text + '」');
      console.error(`  ${p.id} | ${p.title} | ${s.join('')}`);
    });
    process.exitCode = 1;
  } else {
    console.log('体检通过：没有散字页。');
  }
})().catch(err => { console.error(err); process.exit(1); });
