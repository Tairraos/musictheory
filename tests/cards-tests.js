#!/usr/bin/env node
/**
 * ============================================================================
 * 《姐弟厨师团》 · 卡片版自动化测试（tests/cards-tests.js）
 * ----------------------------------------------------------------------------
 * cards.html 与三个长网页是**同一份内容、两套版面**。长网页那套已经由
 * tests/run-tests.js 守住（72+ 项）；这里守的是"卡片版"自己的几件事：
 *
 *   K1 装配：cards.html 引用的样式与 11 个脚本就位、顺序正确，
 *            jsdom 跑完没有脚本错误，window.__CD__ 三个钩子都在
 *   K2 版本：cards.html 的 <title> / data-ver / cards-app.js 的 VERSION 一致
 *   K3 装订：每节恰好一个章节头；文字块不丢不重（item 流 → 卡片流 一一对应）
 *   K4 互动卡：PLAN 里点名的 widget 全都存在（id 拼错会变成一张"这张卡还在路上"）
 *   K5 场景卡：13 个维度都出卡；场景多的维度劈成两张（窄屏放不下 15 个 chip）
 *   K6 乐器卡：每族都有 range 卡、每件乐器都有 inst 卡，id 全部能在 INST_DATA 找到
 *   K7 进度：localStorage 往返、坏数据回落、三课各记一页
 *   K8 版面参数：分页用的可用高留了余量、内容块不被 flex 压缩（CSS 断言）
 *
 * 为什么不在这里测"每张卡都没溢出"：jsdom 不做布局，量不到高度。
 * 那条守卫只能靠真浏览器（见提交说明里的无头 Chrome 逐卡体检）。
 * ===========================================================================
 */
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'cards.html'), 'utf8');
const APP = fs.readFileSync(path.join(ROOT, 'js/cards-app.js'), 'utf8');
const CSS = fs.readFileSync(path.join(ROOT, 'css/cards.css'), 'utf8');

/* AudioContext 桩：与 tests/run-tests.js 同一套，卡片版也要跑播放调度 */
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

async function loadCards(url) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => {
    const msg = String(e && e.detail && e.detail.message || e && e.message || e);
    if (!/Not implemented/i.test(msg)) errors.push(new Error(msg));
  });
  const dom = await JSDOM.fromFile(path.join(ROOT, 'cards.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    url: url || undefined,
    beforeParse(window) {
      const Stub = makeAudioStub();
      window.AudioContext = Stub;
      window.webkitAudioContext = Stub;
      /* file:// 在 jsdom 里是"不透明源"，真 localStorage 会直接抛错。
         这里换成一个内存实现：app 只用到 getItem/setItem/removeItem，
         行为与浏览器一致，进度相关的断言才有意义。 */
      const mem = new Map();
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: k => (mem.has(String(k)) ? mem.get(String(k)) : null),
          setItem: (k, v) => { mem.set(String(k), String(v)); },
          removeItem: k => { mem.delete(String(k)); },
          clear: () => mem.clear(),
          key: i => [...mem.keys()][i] || null,
          get length() { return mem.size; },
        },
        configurable: true,
      });
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
  return { dom, errors };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 卡片版的几个模块是经典 script 的顶层 const（MT_DECK / MT_W / DIMS…），
   它们**不会**挂到 window 上。取它们只能走页面自己的 eval，用 window.MT_DECK 永远是 undefined
   ——旧版 cards-deck 里就因为同一个原因拿不到 DIMS，13 张场景卡一张都没出现。 */
const G = (window, name) => window.eval(name);

/** 每个测试开一页新的，用完关窗（关掉所有定时器与 AudioContext） */
async function withCards(fn, url) {
  const { dom, errors } = await loadCards(url);
  try {
    await fn(dom.window, dom.window.document);
    assert.deepEqual(errors, [], '卡片页执行期间不应有脚本错误');
  } finally {
    dom.window.close();
  }
}

/* 常用的"把 item 流摊平"与"把卡片流摊平"工具 */
const flatItems = items => items.filter(it => it.t === 'block').map(it => it.block);
const flatCards = cards => cards.reduce((acc, c) => acc.concat(c.blocks || []), []);
const keyOf = b => JSON.stringify(b);

/* -------------------------------------------------------------------------- *
 * K1 装配
 * -------------------------------------------------------------------------- */
test('K1 cards.html 的资源与脚本顺序正确，跑完无脚本错误', async () => {
  assert.match(HTML, /<link rel="stylesheet" href="css\/cards\.css">/);
  const scripts = [...HTML.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map(m => m[1]);
  assert.deepEqual(scripts, [
    'js/data.js', 'js/lyric-data.js', 'js/instrument-data.js',
    'js/utils.js', 'js/audio.js', 'js/keyboard.js', 'js/playback.js',
    'js/cards-data.js', 'js/cards-widgets.js', 'js/cards-deck.js', 'js/cards-app.js',
  ], '顺序 = 依赖顺序，经典 script 共享全局作用域');
  for (const f of ['css/cards.css', ...scripts]) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} 应存在`);
  }
  /* renderKB() 会往 #kbInfo 写字；卡片版不展示它，但节点必须在，否则乐理课一点就报错 */
  assert.match(HTML, /id="kbInfo"/);
  /* 常驻钢琴的三个热点：琴键容器、读出区、停止键 */
  for (const id of ['dockKb', 'dockRead', 'dockStop']) assert.match(HTML, new RegExp(`id="${id}"`));

  await withCards(async window => {
    assert.ok(window.__CD__, '应有测试钩子 window.__CD__');
    for (const k of ['course', 'page', 'cards', 'avail', 'goto', 'setCourse']) {
      assert.ok(k in window.__CD__, `__CD__.${k} 应存在`);
    }
    assert.ok(G(window, 'MT_DECK') && G(window, 'MT_W') && window.CARDS_DATA);
  });
});

/* -------------------------------------------------------------------------- *
 * K2 版本（三页 + 卡片页共用一个版本号，这里再守一次卡片页这一份）
 * -------------------------------------------------------------------------- */
test('K2 cards.html 的标题、两处 data-ver 与 cards-app.js 的 VERSION 一致', () => {
  const m = APP.match(/const VERSION = \{ v: '([\d.]+)', date: '([\d.]+)' \};/);
  assert.ok(m, 'cards-app.js 应有 VERSION 常量');
  const [, ver, date] = m;
  const title = HTML.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.includes(`V${ver} [${date}]`), `<title>「${title}」应含 V${ver} [${date}]`);
  /* 反向引用同一个标签名：内部的 </b> 不能当成外层标签的结束（否则只捕到 "V1.43" 丢掉日期） */
  const copies = [...HTML.matchAll(/<([a-z]+) class="[^"]*\bver\b[^"]*" data-ver>([\s\S]*?)<\/\1>/g)]
    .map(x => x[2].replace(/<[^>]+>/g, '').trim());
  assert.equal(copies.length, 2, '应有 2 处 data-ver 静态副本');
  copies.forEach((c, i) => {
    assert.ok(c.includes(`V${ver}`) && c.includes(`[${date}]`), `第 ${i + 1} 处 data-ver 应为 V${ver} [${date}]`);
  });
});

/* -------------------------------------------------------------------------- *
 * K3 装订：章节头不多不少，文字块不丢不重
 * -------------------------------------------------------------------------- */
test('K3 每节恰好一个章节头，文字块在装订与分页中各出现一次', async () => {
  await withCards(async window => {
    const CD = window.__CD__;
    const D = window.CARDS_DATA.courses;
    for (const course of G(window, 'MT_DECK').ORDER) {
      const items = CD.itemsOf(course);
      const src = D[course];

      /* 章节头：每节一个，且紧跟在该节第一个文字块位置 */
      const heads = items.filter(it => it.t === 'block' && it.block.t === 'sec');
      assert.equal(heads.length, src.sections.length, `${course} 章节头数应等于节数`);
      heads.forEach((h, i) => {
        assert.equal(h.block.sec.id, src.sections[i].id);
        assert.ok(h.block.sec.title, '章节头必须有标题');
      });

      /* 文字块：数据层的每一块都要进队列（导语被摘到章节头上，单独算） */
      const queued = flatItems(items);
      const fromData = [];
      src.sections.forEach(s => s.blocks.forEach(b => {
        if (b.t !== 'lead') fromData.push(b);
      }));
      assert.equal(queued.length, fromData.length + src.sections.length,
        `${course} 队列块数应 = 去导语的正文块 + 每节的章节头`);
      /* 同一个块不许被装订两次（曾因"章封面 + 正文"把同一段排过两遍）。
         这里比的是**对象身份**：原文里本来就重复的句子（同一张表出现两次）
         属于内容本身，不归这一层管。 */
      const seen = new Set(queued);
      assert.equal(seen.size, queued.length, `${course} 不应有重复排入的同一个块`);
      assert.equal(new Set(queued.map(keyOf)).size <= queued.length, true);

      /* 分页：切段会改变块的数量，但不该改变文字本身。
         把所有块的文字拼成一条长串，抽查若干段正文的前几个字是否还在——
         "整段丢失""整体错位"都能被这条抓出来。 */
      const fold = t => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, '');
      const textOf = b => b.t === 'table' ? b.rows.map(r => r.join('')).join('')
        : b.t === 'list' ? b.items.join('') : (b.h || '');
      const cards = CD.paginate(items);
      const joined = fold(flatCards(cards).map(textOf).join(''));
      assert.ok(joined.length > 0, `${course} 分页后应有文字`);

      const sample = flatItems(items).filter(b => b.t === 'p' && b.h)
        .slice(0, 6).map(b => fold(b.h).slice(0, 8)).filter(Boolean);
      sample.forEach(s => {
        assert.ok(joined.includes(s), `${course} 分页后应仍含「${s}…」（文字被切碎到丢失）`);
      });
    }
  });
});

test('K3b 分页结果每条都有内容：没有空卡、没有只装一条空表头的卡', async () => {
  await withCards(async window => {
    const CD = window.__CD__;
    for (const course of G(window, 'MT_DECK').ORDER) {
      const cards = CD.paginate(CD.itemsOf(course));
      assert.ok(cards.length > 0, `${course} 应有卡片`);
      cards.forEach((c, i) => {
        if (c.t === 'cover') return;
        assert.ok((c.blocks && c.blocks.length) || c.w, `${course} 第 ${i} 张是空卡`);
        (c.blocks || []).forEach(b => {
          if (b.t === 'table') assert.ok(b.rows.length > 0, `${course} 第 ${i} 张的表没有数据行`);
          if (b.t === 'list') assert.ok(b.items.length > 0, `${course} 第 ${i} 张的列表是空的`);
        });
      });
    }
  });
});

/* -------------------------------------------------------------------------- *
 * K4 互动卡：PLAN 点名的 id 必须真的存在
 * -------------------------------------------------------------------------- */
test('K4 装订层用到的每个 widget id 都有实现，且未知 id 走兜底不炸', async () => {
  await withCards(async window => {
    const W = G(window, 'MT_W').W;
    const used = new Set();
    for (const course of G(window, 'MT_DECK').ORDER) {
      window.CARDS_DATA.courses[course].sections.forEach(sec => {
        G(window, 'MT_DECK').widgetsOf({ ...sec, course }).forEach(w => used.add(w.w));
      });
    }
    assert.ok(used.size >= 20, `三课至少要用到 20 种互动卡，实际 ${used.size}`);
    [...used].forEach(id => assert.ok(W[id], `互动卡 ${id} 没有实现（卡片会显示"这张卡还在路上"）`));

    /* 未知 id：兜底文案而不是抛异常——生成器换了 id 也不至于整页白屏 */
    const host = window.document.createElement('div');
    G(window, 'MT_W').build('__nope__', host, {});
    assert.match(host.textContent, /这张卡还在路上/);
  });
});

/* -------------------------------------------------------------------------- *
 * K5 场景卡
 * -------------------------------------------------------------------------- */
test('K5 十三个维度都出场景卡；场景数超过 8 的维度劈成两张（横轴/实体都不许丢）', async () => {
  await withCards(async window => {
    const DIMS = G(window, 'DIMS');
    const SCENES = G(window, 'SCENES');
    const sec = window.CARDS_DATA.courses.theory.sections.find(s => s.id === 's-emotion');
    assert.ok(sec, '乐理课应有"音乐能表达什么"这一节');
    const ws = G(window, 'MT_DECK').widgetsOf({ ...sec, course: 'theory' }).filter(w => w.w === 'scenes');
    const big = DIMS.filter(d => SCENES.filter(s => s.g === d.id).length > 8);
    assert.equal(ws.length, DIMS.length + big.length, '场景卡数 = 维度数 + 拆分数');

    const covered = new Set();
    for (const w of ws) {
      assert.ok(w.opt && w.opt.dim, '每张场景卡都要指定维度');
      const total = SCENES.filter(s => s.g === w.opt.dim).length;
      const a = w.opt.a || 0, b = w.opt.b == null ? total : w.opt.b;
      assert.ok(b > a, `维度 ${w.opt.dim} 的分段区间非法`);
      assert.ok(b - a <= 8, `单张场景卡最多 8 个 chip，实际 ${b - a}（窄屏放不下）`);
      for (let i = a; i < b; i++) covered.add(w.opt.dim + '#' + i);
    }
    assert.equal(covered.size, SCENES.length, '每一条场景配方都要落进某一张卡');
  });
});

/* -------------------------------------------------------------------------- *
 * K6 乐器卡
 * -------------------------------------------------------------------------- */
test('K6 每族一张音域总览、每件乐器一张卡，且引用的 id 都能在数据里找到', async () => {
  await withCards(async window => {
    const INST = G(window, 'INST_DATA');
    const ids = new Set();
    INST.families.forEach(f => f.items.forEach(it => ids.add(it.id)));
    const famIds = new Set(INST.families.map(f => f.id));

    const all = [];
    window.CARDS_DATA.courses.instrument.sections.forEach(sec => {
      G(window, 'MT_DECK').widgetsOf({ ...sec, course: 'instrument' }).forEach(w => all.push({ sec, w }));
    });
    const insts = all.filter(x => x.w.w === 'inst');
    const ranges = all.filter(x => x.w.w === 'range');
    assert.equal(insts.length, ids.size, '每件乐器正好一张 inst 卡');
    insts.forEach(x => assert.ok(ids.has(x.w.opt.id), `inst 卡引用了不存在的乐器 ${x.w.opt.id}`));
    assert.equal(ranges.length, famIds.size, '每族正好一张 range 卡');
    ranges.forEach(x => assert.ok(famIds.has(x.w.opt.fam), `range 卡引用了不存在的族 ${x.w.opt.fam}`));

    /* 总览拆成上下两张，两半加起来必须是全部乐器，且横轴共用同一套刻度 */
    const alls = all.filter(x => x.w.w === 'rangeAll').map(x => x.w.opt);
    assert.equal(alls.length, 2, '全部乐器总览应拆成两张');
    const span = alls.reduce((n, o) => n + (o.b - o.a), 0);
    assert.equal(span, INST.families.length, '两半的族区间应刚好盖住全部族');
    assert.equal(alls[0].a, 0);
    assert.equal(alls[1].b, INST.families.length);
  });
});

/* -------------------------------------------------------------------------- *
 * K7 进度存储
 * -------------------------------------------------------------------------- */
test('K7 进度：三课各记一页，读写往返；坏数据与非法课程名回落', async () => {
  await withCards(async window => {
    const deck = G(window, 'MT_DECK');
    const KEY = deck.KEY;
    window.localStorage.clear();

    /* 跨 realm 的对象不共享原型，deepEqual 会挑"引用不同"；统一过一遍 JSON */
    const plain = v => JSON.parse(JSON.stringify(v));

    /* 空存储 → 默认从乐理课第 0 页开始 */
    assert.deepEqual(plain(deck.readStore(window.localStorage)), { last: 'theory', at: {} });

    const store = { last: 'lyric', at: { theory: { p: 12, sec: 's-modes' }, lyric: { p: 3, sec: 's-rhyme' } } };
    deck.writeStore(window.localStorage, store);
    assert.equal(JSON.parse(window.localStorage.getItem(KEY)).last, 'lyric');
    assert.deepEqual(plain(deck.readStore(window.localStorage)), store, '读回来的应与写进去的一致');

    /* 坏 JSON / 非法课程名 / 非对象 at 都不能把整页带崩 */
    window.localStorage.setItem(KEY, '{oops');
    assert.deepEqual(plain(deck.readStore(window.localStorage)), { last: 'theory', at: {} });
    window.localStorage.setItem(KEY, JSON.stringify({ last: 'nope', at: [1, 2] }));
    const fixed = plain(deck.readStore(window.localStorage));
    assert.equal(fixed.last, 'theory', '非法课程名应回落成 theory');
    assert.deepEqual(fixed.at, {}, '非对象的 at 应被丢弃');

    /* 存储写不进去（隐私模式）也不能抛 */
    const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
    assert.deepEqual(plain(deck.readStore(broken)), { last: 'theory', at: {} });
    deck.writeStore(broken, store);   /* 不抛即通过 */
  });
});

test('K7b 切课再切回来，停在同一页（真的写进了 localStorage）', async () => {
  await withCards(async (window, doc) => {
    const CD = window.__CD__;
    doc.querySelector('#tabs button[data-course="lyric"]').click();
    await sleep(60);
    const list = CD.cards;
    const target = Math.min(6, list.length - 1);
    CD.goto(target);
    await sleep(30);
    assert.equal(CD.page, target);
    const secId = (CD.cards[CD.page].sec || {}).id;

    doc.querySelector('#tabs button[data-course="theory"]').click();
    await sleep(60);
    doc.querySelector('#tabs button[data-course="lyric"]').click();
    await sleep(60);
    assert.equal(CD.page, target, '切回来应回到上次那一页');

    const stored = JSON.parse(JSON.stringify(G(window, 'MT_DECK').readStore(window.localStorage)));
    assert.equal(stored.last, 'lyric', '最后一门课也要记下来');
    if (secId) assert.equal(stored.at.lyric.sec, secId, '除了页码还要记下出自哪一节');
  });
});

/* -------------------------------------------------------------------------- *
 * K8 版面参数（CSS 级的硬约束，改坏了分页会全线失准）
 * -------------------------------------------------------------------------- */
test('K8 版面：正文块不被压缩、卡片不滚动、窄屏另有横屏提示', () => {
  /* flex 子项默认会被压缩，一压缩量到的高度就小于实际，分页判断全错 */
  assert.match(CSS, /\.dc-body > \*\{flex:0 0 auto\}/);
  /* 舞台与正文都 overflow:hidden —— "一屏一卡，不上下滚动"就靠这两条 */
  assert.match(CSS, /#stage\{[^}]*overflow:hidden/);
  assert.match(CSS, /\.dc-body\{[\s\S]{0,200}?overflow:hidden/);
  /* 横屏提示：只在又矮又横的时候出现 */
  assert.match(CSS, /@media\(orientation:landscape\) and \(max-height:520px\)/);
  assert.match(HTML, /id="rotate"/);
  /* 量可用高度时必须留余量（clientHeight 取整 vs 块高带小数） */
  assert.match(APP, /clientHeight \|\| 0\) - 3/, '可用高应留 3px 余量');
});

test('K8b 顶部三课标签与课程表一致：名字、颜色、节数都对得上', async () => {
  await withCards(async (window, doc) => {
    const tabs = [...doc.querySelectorAll('#tabs button')].map(b => b.dataset.course);
    assert.deepEqual(tabs, ['theory', 'lyric', 'instrument'], '标签顺序 = 课程顺序');
    const T = G(window, 'MT_DECK').TABS;
    tabs.forEach(c => {
      assert.ok(T[c] && T[c].name && /^#[0-9A-Fa-f]{6}$/.test(T[c].accent), `${c} 的主题色应是 6 位色值`);
      assert.ok(window.CARDS_DATA.courses[c].sections.length > 0, `${c} 应有节`);
    });
    /* 顶栏显示"第几页 / 共几页"，且页数与本课卡片流一致 */
    const CD = window.__CD__;
    const total = CD.cards.length;
    assert.match(doc.querySelector('#tbPos').textContent, new RegExp(`/ ${total}$`));
    /* 上一页/下一页在首页的状态 */
    assert.equal(doc.querySelector('#prevBtn').disabled, true);
    assert.equal(doc.querySelector('#nextBtn').disabled, total <= 1);
  });
});
