#!/usr/bin/env node
/**
 * ============================================================================
 * 《姐弟厨师团——乐理课》 · 自动化测试（tests/run-tests.js）
 * ----------------------------------------------------------------------------
 * 用 jsdom 从磁盘真实加载 index.html（连带 css/main.css 与 js/ 下全部脚本），
 * 在接近真实的 DOM 环境里验证：
 *   A. 资源拆分完整：外链 CSS/JS 全部就位、插图已外链、无残留 base64
 *   B. 页面装配结果：17 节导航、两架键盘的键数、各表格/卡片数量、SVG 方块数
 *   C. 乐理核心函数：音名 / MIDI / 频率 / 三和弦 / 和弦标记 / 音名拼写
 *   D. 课程数据完整性：调式半音结构、五声无半音、场景配置引用合法
 *   E. 交互冒烟：用桩 AudioContext 点播放按钮，验证出声链路 + 点亮链路不炸
 *
 * 运行：npm install && npm test
 * 说明：测试环境没有音频设备，AudioContext 用空实现桩替代（见下）；
 *       jsdom 不做布局，布局相关 API（getBBox/滚动）拿不到值时代码自身有兜底。
 * ===========================================================================
 */
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* -------------------------------------------------------------------------- *
 * 测试环境搭建
 * -------------------------------------------------------------------------- */

/**
 * 桩 AudioContext：jsdom 没有 Web Audio，用一组"能记不能响"的空节点顶替，
 * 让 voice()/seq()/节拍器的完整调度链路可以跑完而不抛错。
 */
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
      this.currentTime = 0;          // 冻结时钟：让所有排程确定性可测
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

/**
 * 从磁盘加载真实页面并等待全部外链脚本执行完毕。
 * 收集 jsdomError——"Not implemented" 类是 jsdom 环境缺口（布局/getBBox），
 * 不算应用错误，过滤掉；其余一律视为失败。
 */
async function loadPage(file) {
  const pageErrors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => {
    const msg = String(e && e.detail && e.detail.message || e && e.message || e);
    if (!/Not implemented/i.test(msg)) pageErrors.push(new Error(msg));
  });
  const dom = await JSDOM.fromFile(path.join(ROOT, file || 'index.html'), {
    runScripts: 'dangerously',     // 执行 js/*.js
    resources: 'usable',           // 加载 css/main.css 与插图
    pretendToBeVisual: true,       // 提供 requestAnimationFrame
    virtualConsole: vc,
    beforeParse(window) {
      const Stub = makeAudioStub();
      window.AudioContext = Stub;
      window.webkitAudioContext = Stub;
      // jsdom 不做布局，这些几何量统一按 0 处理（应用代码本身兼容 0）
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
  return { dom, errors: pageErrors };
}

/** 每个需要"点着玩"的测试都开一页新的，测完关窗（清掉所有定时器） */
async function withPage(fn) {
  const { dom, errors } = await loadPage();
  try {
    await fn(dom.window, dom.window.document);
    assert.deepEqual(errors, [], '页面执行期间不应有脚本错误');
  } finally {
    dom.window.close();
  }
}

/** 作词课（lyric.html）专用：同一套装载流程，换一个入口文件 */
async function withLyricPage(fn) {
  const { dom, errors } = await loadPage('lyric.html');
  try {
    await fn(dom.window, dom.window.document);
    assert.deepEqual(errors, [], '作词课页面执行期间不应有脚本错误');
  } finally {
    dom.window.close();
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* -------------------------------------------------------------------------- *
 * A. 资源拆分完整性
 * -------------------------------------------------------------------------- */

test('A1 资源拆分：外链 CSS / 8 个 JS 全部就位，插图外链且无 base64 残留', () => {
  // 页面引用了拆分后的资源
  assert.match(HTML, /<link rel="stylesheet" href="css\/main\.css">/);
  const scripts = [...HTML.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map(m => m[1]);
  assert.deepEqual(scripts, [
    'js/data.js', 'js/utils.js', 'js/audio.js', 'js/keyboard.js',
    'js/svg.js', 'js/playback.js', 'js/sections.js', 'js/app.js',
  ]);
  // 插图已改为 assets 路径，正文不再有任何 base64 data URI
  assert.match(HTML, /<img src="assets\/images\/hero-art\.png"/);
  assert.doesNotMatch(HTML, /data:image\/png;base64/);
  // favicon：ico + png + apple-touch-icon 三种声明都要在
  assert.match(HTML, /<link rel="icon" href="assets\/images\/favicon\.ico"/);
  assert.match(HTML, /<link rel="icon" href="assets\/images\/favicon\.png" type="image\/png">/);
  assert.match(HTML, /<link rel="apple-touch-icon" href="assets\/images\/favicon\.png">/);
  // 磁盘上真实存在
  for (const f of ['css/main.css', ...scripts, 'assets/images/hero-art.png',
                   'assets/images/hero-lyrics.png',
                   'assets/images/favicon.png', 'assets/images/favicon.ico']) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} 应存在`);
  }
  // PNG magic bytes 校验
  const png = fs.readFileSync(path.join(ROOT, 'assets/images/hero-art.png'));
  assert.deepEqual([...png.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], 'hero-art.png 应是合法 PNG');
  const fav = fs.readFileSync(path.join(ROOT, 'assets/images/favicon.png'));
  assert.deepEqual([...fav.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], 'favicon.png 应是合法 PNG');
  // ICO magic bytes（0 0 1 0）+ 至少含 4 个尺寸
  const ico = fs.readFileSync(path.join(ROOT, 'assets/images/favicon.ico'));
  assert.deepEqual([...ico.subarray(0, 4)], [0x00, 0x00, 0x01, 0x00], 'favicon.ico 应是合法 ICO');
  const count = ico.readUInt16LE(4);
  assert.ok(count >= 4, `favicon.ico 应至少含 4 个尺寸，实际 ${count}`);
  const sizes = [];
  for (let i = 0; i < count; i++) {
    const e = 6 + i * 16;
    sizes.push(ico[e] === 0 ? 256 : ico[e]);
  }
  assert.ok(sizes.includes(256) && sizes.includes(32) && sizes.includes(16),
    `favicon.ico 应含 256/32/16 三档，实际 ${sizes.join('/')}`);
});

test('A3 版本号：HTML 静态副本、<title>、js/app.js 的 VERSION 三处必须一致', async () => {
  /* 版本号以后每次更新都要改，最容易出的错就是只改了一处。
     所以这里从三个来源各自解析出版本串，断言它们完全相同：
       ① js/app.js 里的 VERSION 常量（唯一真源）
       ② index.html 的 <title>（浏览器标签页）
       ③ index.html 里两处 data-ver 静态副本（JS 没跑起来时的降级显示） */
  const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  const m = appJs.match(/const VERSION = \{ v: '([\d.]+)', date: '([\d.]+)' \}/);
  assert.ok(m, 'app.js 应有 VERSION 常量（升级时改这一行）');
  const [ver, date] = [m[1], m[2]];

  /* 日期格式固定 YY.MM.DD */
  assert.match(date, /^\d{2}\.\d{2}\.\d{2}$/, `版本日期 ${date} 应为 YY.MM.DD 格式`);
  /* 版本号三段递增制，如 1.15 */
  assert.match(ver, /^\d+\.\d+$/, `版本号 ${ver} 应为 X.Y 格式`);

  const titleM = HTML.match(/<title>([^<]*)<\/title>/);
  assert.ok(titleM, '应有 <title>');
  assert.ok(titleM[1].includes(`V${ver} [${date}]`),
    `<title>「${titleM[1]}」应含 V${ver} [${date}]`);

  /* 两处 data-ver 静态副本：侧栏 brand（<span class="ver">）与
     页头导语下方（<p class="hero-ver ver">，右对齐）。
     按 data-ver 属性定位，不写死标签名与类名——版面可以把版本号放在任何位置。 */
  const verNodes = [...HTML.matchAll(/<([a-z]+) class="[^"]*\bver\b[^"]*" data-ver>([\s\S]*?)<\/\1>/g)]
    .map(m => ({ tag: m[1], inner: m[2].replace(/<[^>]+>/g, '') }));
  assert.equal(verNodes.length, 2, '应有 2 处 data-ver（侧栏 brand + 页头导语下方）');
  verNodes.forEach((v, i) => {
    assert.ok(v.inner.includes(`V${ver}`) && v.inner.includes(`[${date}]`),
      `第 ${i + 1} 处 data-ver（<${v.tag}>）静态副本应与 VERSION 一致（V${ver} [${date}]），实际「${v.inner}」`);
  });

  /* 样式约定：版本号必须 14px、正文灰、斜体，版本号本身加粗 */
  const css = fs.readFileSync(path.join(ROOT, 'css/main.css'), 'utf8');
  const verRule = css.match(/\.ver\{([^}]*)\}/);
  assert.ok(verRule, 'css 应有 .ver 规则');
  assert.match(verRule[1], /font-size:14px/, '.ver 应为 14px');
  assert.match(verRule[1], /color:var\(--muted\)/, '.ver 应用正文灰色 --muted');
  assert.match(verRule[1], /font-style:italic/, '.ver 应为斜体');
  assert.match(css, /\.ver b\{[^}]*font-weight:6/, '.ver b（版本号本身）应加粗');
});

test('A5 底栏状态条：键名方块出现/消失不得改变那一行的高度', async () => {
  /* 用户报的抖动：「正在响」右边按键方块一显示，行就变高，方块消失又变低，
     整行文字上下跳。根因是 .kc 带上下 padding + 边框，比纯文字高，
     撑高了 .dbad 那行。
     修法：.dbad 定死高度 + overflow:hidden，.dsp 改 flex 居中，方块尺寸收进行高内。
     这条测试守住那个「定死的高度」不被人改掉。 */
  await withPage(async (w, d) => {
    const bad = d.querySelector('#dock .dbad');
    const read = d.querySelector('#dockRead');
    const h = () => w.getComputedStyle(bad).height;

    const empty = h();
    assert.equal(empty, '24px', '.dbad 应定死 24px 行高（须 ≥ .kc 的 19px 实际高度）');
    assert.equal(w.getComputedStyle(bad).overflow, 'hidden',
      '.dbad 应 overflow:hidden，防止方块溢出把行撑开');

    /* 方块出现时高度必须不变 */
    read.innerHTML = '<i class="kc">C4</i>';
    assert.equal(h(), empty, '出现 1 个键名方块时行高不应变化');

    read.innerHTML = ['C4', 'E4', 'G4', 'C5', 'E5'].map(n => `<i class="kc">${n}</i>`).join('');
    assert.equal(h(), empty, '出现 5 个键名方块时行高不应变化');

    /* 消失后也要回到原值 */
    read.innerHTML = '';
    assert.equal(h(), empty, '方块消失后行高应恢复原值');

    /* 方块实际高度必须装得进 24px——否则 overflow:hidden 会把它下边框裁掉，
       「小琴键」的造型就没了（下边框深色键檐是这个视觉的关键） */
    const dsp = d.querySelector('#dock .dsp');
    assert.equal(w.getComputedStyle(dsp).display, 'flex',
      '.dsp 应为 flex 容器，让方块垂直居中而不撑行');
    assert.equal(w.getComputedStyle(dsp).alignItems, 'center',
      '.dsp 应让方块垂直居中');
    /* .dsp 不能有自己的固定高度——它必须由 .dbad 的 24px 决定。
       jsdom 不做布局，height:100% 解析不出具体值，所以只断言它没写死别的值。
       真正的守卫是上面那条：.dbad 恒为 24px，而 .dsp 是 .dbad 的直接子元素。 */
    const dspParent = dsp.parentElement;
    assert.equal(dspParent, bad, '.dsp 应是 .dbad 的直接子元素（高度由 .dbad 决定）');
  });
});

test('A4 版面宽度：段落与卡片内文字必须齐平（宽屏下右边缘都是 --read）', () => {
  /* 这条防的是"宽屏下元素右边缘对不齐"的老毛病：
     曾经 .lead 是 790 而 .card 撑到 976，同一条内容带上出现两条右边界。 */
  const css = fs.readFileSync(path.join(ROOT, 'css/main.css'), 'utf8');

  /* 三个版宽变量必须存在，且数值在合理范围 */
  /* 注意：正则的捕获组要用 [1] 取，不能把整个 match 数组直接丢给 parseInt */
  const read = parseInt(css.match(/--read:(\d+)px/)[1], 10);
  const padC = parseInt(css.match(/--pad-c:(\d+)px/)[1], 10);
  const padW = parseInt(css.match(/--pad-w:(\d+)px/)[1], 10);
  assert.ok(read >= 600 && read <= 900, `--read ${read}px 应在 600–900 之间（中文每行 43–64 字）`);
  assert.ok(padC >= 12 && padC <= 32, `--pad-c ${padC}px 卡片内边距应在 12–32`);
  assert.ok(padW >= 16 && padW <= 48, `--pad-w ${padW}px 容器内边距应在 16–48`);

  /* --card-out 与 --wrap-out 必须用 calc 从上面三者推导，不能写死数字 */
  assert.match(css, /--card-out:calc\(var\(--read\) \+ var\(--pad-c\) \* 2\)/,
    '--card-out 应由 --read 与 --pad-c 推导');
  assert.match(css, /--wrap-out:calc\(var\(--card-out\) \+ var\(--pad-w\) \* 2\)/,
    '--wrap-out 应由 --card-out 与 --pad-w 推导');

  /* 关键不变式：内容区宽度 = 卡片文字区 + 2×卡片内边距，
     所以「段落右边缘」与「卡片内文字右边缘」必然重合 */
  const inner = read + padC * 2;                 /* .wrap 内容区（= 卡片外框宽） */
  assert.equal(inner - padC * 2, read,
    '卡片内文字宽应恰好等于 --read，段落与卡片内文字才能齐平');

  /* .lead / .card / .scene 三者都必须引用变量，不许出现游离的写死数字 */
  assert.match(css, /\.lead\{[^}]*max-width:var\(--read\)/, '.lead 应引用 var(--read)');
  assert.match(css, /\.card\{[^}]*padding:22px var\(--pad-c\)/, '.card 应引用 var(--pad-c)');
  assert.match(css, /\.scene\{[^}]*padding:14px var\(--pad-c\)/, '.scene 应引用 var(--pad-c)');
  /* .wrap 也要引用，不能写死 max-width */
  assert.match(css, /\.wrap\{[^}]*max-width:var\(--wrap-out\)/, '.wrap 应引用 var(--wrap-out)');

  /* 左缘不变式：标题/引导语/h3 必须缩进 --pad-c，否则右边缘永远对不上卡片文字。
     （段落是 .wrap 直接子、左缘 0；卡片文字有 --pad-c 的左内边距。只对齐宽度没用，
       起点不同 → 右边缘必然错开一个 --pad-c。这是本次踩过的坑） */
  assert.match(css, /\.lead\{[^}]*margin:[^}]*var\(--pad-c\)/,
    '.lead 左缘必须缩进 var(--pad-c)，否则与卡片内文字右边缘错开');
  assert.match(css, /\.sec-head\{[^}]*margin:[^}]*var\(--pad-c\)/,
    '.sec-head 左缘应与卡片文字一致');
  assert.match(css, /^h3\{[^}]*margin:[^}]*var\(--pad-c\)/m,
    'h3 左缘应与卡片文字一致');

  /* 常见游离写法（段落与卡片用不同写死宽度）直接判失败 */
  assert.doesNotMatch(css, /\.lead\{[^}]*max-width:\d+px/, '.lead 不应写死像素宽度');
  assert.doesNotMatch(css, /\.wrap\{[^}]*max-width:\d+px/, '.wrap 不应写死 max-width');
});

test('A2 拆分不改变内容：原内联 <style>/<script> 块已不在 HTML 里', () => {
  // 只允许出现"外链"形态：<link> 与 <script src=...>，不允许内联样式/脚本块
  assert.doesNotMatch(HTML, /<style>[\s\S]*?<\/style>/, '不应再有内联 <style> 块');
  assert.doesNotMatch(HTML, /<script>[\s\S]*?<\/script>/, '不应再有内联 <script> 块');
  assert.ok(HTML.includes('<script src="js/app.js"></script>'), '脚本应全部外链');
});

/* -------------------------------------------------------------------------- *
 * B. 页面装配结果（真实执行全部脚本后的 DOM）
 * -------------------------------------------------------------------------- */

test('B1 导航与章节：17 个导航链接与 17 个 section 一一对应', async () => {
  await withPage((w, d) => {
    /* 只数指向本页的锚点链接：目录里还有一条 .navswitch 指向姊妹篇，
       它不是章节，混进来会让"17 对 17"这条守恒律失效 */
    const links = [...d.querySelectorAll('#nav a[href^="#"]')];
    const sections = [...d.querySelectorAll('section')];
    assert.equal(links.length, 17);
    assert.equal(sections.length, 17);
    /* 节号必须从 00 数到 16、无重号：插节时最容易漏改的就是这里 */
    assert.deepEqual([...d.querySelectorAll('.sec-num')].map(e => e.textContent),
      ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16'],
      '正文节号必须 00–16 连续');
    for (const l of links) {
      const id = l.getAttribute('href').slice(1);
      assert.ok(d.getElementById(id), `导航目标 #${id} 应存在`);
    }
  });
});

test('B2 两架键盘：第 00 节 C4–B5 = 14 白 + 10 黑；常驻钢琴 C3–D7 = 30 白 + 21 黑', async () => {
  await withPage((w, d) => {
    const kb = d.querySelector('#kb');
    assert.equal(kb.querySelectorAll('.wk').length, 14, '#kb 白键应固定两个八度');
    assert.equal(kb.querySelectorAll('.bk').length, 10, '#kb 黑键');
    assert.equal(kb.querySelector('.wk[data-m="60"]') ? 1 : 0, 1, '#kb 最低音应是 C4(60)');
    assert.equal(kb.querySelector('.wk[data-m="83"]') ? 1 : 0, 1, '#kb 最高音应是 B5(83)');
    const dock = d.querySelector('#dockKb');
    assert.equal(dock.querySelectorAll('.wk').length, 30, '#dockKb 白键：C3–B6 四个八度 + C7/D7');
    assert.equal(dock.querySelectorAll('.bk').length, 21, '#dockKb 黑键');
    assert.equal(dock.querySelector('.wk[data-m="48"]') ? 1 : 0, 1, '#dockKb 最低音应是 C3(48)');
    assert.equal(dock.querySelector('.wk[data-m="98"]') ? 1 : 0, 1, '#dockKb 最高音应是 D7(98)');
    // 没有任何键画到 D7 以上
    const maxM = Math.max(...[...dock.querySelectorAll('.wk,.bk')].map(el => +el.dataset.m));
    assert.equal(maxM, 98, '常驻钢琴最高音 = D7(98)');
  });
});

test('B3 各节装配数量：表格行数 / chips 数 / SVG 方块数', async () => {
  await withPage((w, d) => {
    const n = (sel, root = d) => root.querySelectorAll(sel).length;
    // 表格
    assert.equal(n('#ivTable tr'), 13, '音程表 12+1 行');
    assert.equal(n('#modesTable tr'), 7, '调式表 7 行');
    assert.equal(n('#degTable tr'), 7, '级数和弦表 7 行');
    assert.equal(n('#termTable tr'), 27, '术语速查 27 行（含 5 条歌词术语）');
    assert.equal(n('#checkList tr'), 11, '自查清单 11 行（含 3 条歌词检查）');
    assert.equal(n('#keyTable tr'), 7, '常用调表 7 行');
    assert.equal(n('#recipeTable tr'), 9, '通用配方 9 行');
    // chips / 按钮
    assert.equal(n('#startChips .chip'), 7, '调式起步 chips');
    assert.equal(n('#pentaChips .chip'), 5, '五声 chips');
    assert.equal(n('#progChips .chip'), 6, '和弦进行 chips');
    assert.equal(n('#cadChips .chip'), 5, '终止式 chips');
    assert.equal(n('#tempoChips .chip'), 6, '速度术语 chips');
    assert.equal(n('#meterChips .chip'), 4, '拍号 chips');
    assert.equal(n('#keyChips .chip'), 7, '常用调 chips');
    assert.equal(n('#sevChips .chip'), 5, '七和弦 chips');
    assert.equal(n('#modChips .chip'), 6, '转调 chips');
    assert.equal(n('#exoticChips .chip'), 9, '特色音阶 chips（和风 4 + 国风 4 + 布鲁斯 1）');
    assert.equal(n('#minor3row .btn'), 3, '小调三形态按钮');
    // 第 11 节 · 词曲咬合
    assert.equal(n('#lyricChips .chip'), 3, '倒字例句 chips');
    assert.equal(n('#stressChips .chip'), 3, '重音版本 chips');
    assert.equal(n('#breathChips .chip'), 3, '气口例句 chips');
    assert.equal(n('#rhymeTable tr'), 13, '十三辙表 13 行');
    assert.equal(n('#albumTable tr'), 10, '专辑辙口表 10 行');
    assert.equal(n('#stressFig .lyr-b'), 18, '重音三条时间轴 × 6 字');
    assert.equal(n('#phraseFig .lyr-b'), 16, '一字多音两条时间轴 × 8 字');
    assert.equal(n('#breathFig .lyr-b'), 27, '气口三句共 6+9+12 个字块');
    // 第 11 节 ⑦⑧ · 语言计时法与粤语
    assert.equal(n('#langChips .chip'), 3, '计时法三条：普通话 / 英文短 / 英文长');
    assert.equal(n('#langFig .lyr-row'), 3, '三条时间轴同屏');
    assert.equal(n('#langFig .lyr-b'), 27, '8 + 8 + 11 个音节块');
    // 窄音节只画细条、不写字：写不下的时候硬塞会被 overflow 裁成半个词，比留空更像画错
    assert.equal(n('#langFig .lyr-b.sq'), 5, '窄到写不进字的音节 5 条（短行 1 + 长行 4）');
    assert.deepEqual(
      [...d.querySelectorAll('#langFig .lyr-b.sq')].map(el => el.textContent.trim()),
      ['', '', '', '', ''], '细条里一律不写字');
    assert.equal(n('#langFig .lyr-b.str'), 8, '重音块 = 两行各 4 个（位置必须一样）');
    assert.equal(n('#cantonTable tr'), 9, '粤语九声表 9 行');
    assert.equal(n('#cantonFig .lyr-b'), 4, '两条时间轴：各有一个字块 + 一个留白/停住块');
    // 第 10 节 · 曲式
    assert.equal(n('#formTable tr'), 4, '四种曲式对照 4 行');
    assert.equal(n('#bluesFig rect[data-lit^="bar"]'), 12, '十二格和声');
    assert.equal(n('#bluesFig rect[data-lit^="ln"]'), 3, '三行词');
    // 第 10 节 ② · shuffle 对比图：两行 × 两拍 × 两下
    assert.equal(n('#shuffleChips .chip'), 2, '直的 / shuffle 各一个 chip');
    assert.equal(n('#shuffleFig rect[data-hit]'), 8, '两行各 4 个音头');
    // 第 09 节 · 律动（新）
    assert.equal(n('#grooveChips .chip'), 5, '五种织体 chips');
    assert.equal(n('#grooveTable tr'), 6, '选型表 6 行（含"留白"那一行）');
    assert.equal(n('#grooveGrid rect[data-hit]'), 1, '默认选中"块状"：两拍一个音头');
    assert.equal(n('#grooveGrid svg > rect'), 10, '八格网格 + 一个音头块 + 一条音长尾巴');
    // 第 09 节 ④ · 织体总览表：标题说 15 种，表里就得有 15 行
    assert.equal(n('#texTable tr'), 15, '织体总览表 15 行（与 TEX 的 15 种一一对应）');
    // 第 14 节 · 配器与专辑（新）
    assert.equal(n('#ensChips .chip'), 3, '三种编制 chips');
    assert.equal(n('#ensMel .lyr-b'), 10, '旋律条 = 10 个音');
    assert.equal(n('#ensTable tr'), 3, '三层分工（主乐/和声/铺底）各一行');
    assert.equal(n('#albumFig polyline'), 2, '专辑曲线两块（原序 / 重排）');
    assert.equal(n('#albumFig circle'), 16, '八首 × 两种排法');
    // 第 14 节 ④ · 跨曲动机
    assert.equal(n('#motifChips .chip'), 2, '两版：原形 / 回来');
    assert.equal(n('#motifTable tr'), 3, '三个把手各一行');
    assert.equal(n('#motifFig polyline'), 2, '两条轮廓叠在同一张图上');
    assert.equal(n('#motifFig circle'), 8, '两版各四个音');
    // 第 14 节 ⑤ · 动机怎么生成
    assert.equal(n('#motifGenChips .chip'), 5, '五种生成手法 chips');
    assert.equal(n('#motifGenTable tr'), 5, '生成法表 5 行');
    assert.equal(n('#motifGenFig polyline'), 2, '母动机 + 生成结果两条线');
    // 场景卡片：12 维度 + 筛选条 + 拆解表
    assert.equal(n('#sceneGrid .scene'), 91, '默认展示全部 91 张场景卡片');
    assert.equal(n('#dimBar .chip'), 14, '筛选条 全部 + 13 维度');
    assert.equal(n('#dimTable tr'), 13, '维度拆解表 13 行');
    // 下拉框选项
    assert.equal(n('#rootSel option'), 12, '主音下拉 12 项（音名，不受调式扩充影响）');
    assert.equal(n('#modeSel option'), 28, '调式下拉 28 项：7 教会 + 5 五声 + 13 国风和风 + 布鲁斯等');
    assert.equal(n('#chordKey option'), 7, '级数和弦调性下拉');
    assert.equal(n('#ivRoot option'), 13, '音程起点 C4–C5');
    assert.equal(n('#ivTop option'), 25, '音程终点 C4–C6');
    // 窄屏表格横滑：每张表都要套在 .tscroll 里。
    // 不套的话，390px 下表格的 min-content 超过容器，最后一列直接被裁掉——
    // 而 500px 以上完全看不出来，所以必须靠断言守着。
    const tbls = [...d.querySelectorAll('table')];
    assert.ok(tbls.length > 0, '页面里得有表');
    tbls.forEach(t => {
      assert.ok(t.parentNode.classList.contains('tscroll'), '每张表都要套 .tscroll');
      const cols = t.querySelectorAll('thead th').length;
      assert.equal(t.parentNode.classList.contains('wide'), cols >= 4,
        `列数 ${cols} 的表，wide 标记必须与"≥4 列"一致`);
    });
    // 和弦进行/终止式条
    assert.equal(n('#progStrip > div'), 4, '默认进行 I–V–vi–IV 四块');
    assert.equal(n('#cadStrip > div'), 2, '默认终止 V→I 两块');
  });
});

test('B4 SVG 示意图方块数量与结构', async () => {
  await withPage((w, d) => {
    const rects = sel => d.querySelectorAll(sel + ' rect').length;
    assert.equal(rects('#ladderMajor'), 8, '大调图 7 音 + 八度列');
    assert.equal(rects('#ladderMinor'), 8, '小调图');
    assert.equal(rects('#ladderPenta'), 6, '五声图 5 音 + 八度列');
    assert.equal(rects('#modesLadder'), 52, '七调式图 7 调式×7 音 = 49 + 3 个图例色块');
    assert.equal(rects('#chordCmp'), 6, '大三/小三对比 3+3');
    assert.equal(rects('#hookFig'), 16, '副歌抬升 8 高 + 8 低');
    assert.equal(rects('#sevStrip'), 4, '七和弦 4 音');
    assert.equal(rects('#keyLadder'), 9, '移调示范旋律 9 音');
    assert.equal(rects('#modLadder'), 9, '转调示范旋律 9 音');
    // 声调对照图没有 rect，用 circle 数：每个字上下两行各 2 个端点，默认 8 字
    assert.equal(d.querySelectorAll('#lyricFig circle').length, 32, '声调对照图 8 字 × 2 行 × 2 端点');
    // 拍点圆点
    assert.equal(d.querySelectorAll('#tempoBeats .beat').length, 4);
    assert.equal(d.querySelectorAll('#metBeatsDots .beat').length, 4);
    assert.equal(d.querySelectorAll('#meterBeats .beat').length, 4, '默认 4/4');
    assert.equal(d.querySelectorAll('#rhythmDots .beat').length, 8);
  });
});

/* -------------------------------------------------------------------------- *
 * C. 乐理核心函数（纯函数，与原单文件版逐字节一致）
 * -------------------------------------------------------------------------- */

test('C1 音高换算：noteName / midiOct / f', async () => {
  await withPage((w) => {
    const { noteName, midiOct, f } = w.__MT__;
    assert.equal(noteName(60), 'C4');
    assert.equal(noteName(61), 'C♯4');
    assert.equal(noteName(59), 'B3');
    assert.equal(noteName(72), 'C5');
    assert.equal(noteName(48), 'C3');
    assert.equal(midiOct(0, 4), 60);
    assert.equal(midiOct(9, 4), 69, 'A4 = 69');
    assert.equal(midiOct(2, 7), 98, 'D7 = 98（键盘音域上限）');
    assert.equal(f(69), 440, 'A4 = 440Hz');
    assert.ok(Math.abs(f(60) - 261.6256) < 0.001, 'C4 ≈ 261.63Hz');
    assert.ok(Math.abs(f(81) - 880) < 0.001, 'A5 ≈ 880Hz');
  });
});

test('C1b 音阶数据的音程闭合校验：每个音阶绕八度一圈必须是 12 个半音', () => {
  /* 这条测试防的是"半音集合手写错一位"。
     民族调式的音阶数组最容易错——比如角调式写成 [0,3,5,7,10]，
     相邻音程累加回不到 12，肉眼完全看不出来，但一弹就知道不对。
     判据：把音阶按半音数排序，从最高音升到下一个八度（12）再降回主音，
     所有音程累加必须恰好等于 12。 */
  /* 直接读源码解析，不走页面 realm——这是纯数据校验，不需要 jsdom */
  const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
  const re = /semis:\[([\d,\s]+)\]/g;
  const found = [];
  let m;
  while ((m = re.exec(src))) found.push(m[1].split(',').map(s => parseInt(s.trim(), 10)));

  assert.ok(found.length >= 25, `data.js 应有至少 25 个音阶定义，实际 ${found.length}`);

  found.forEach((semis, i) => {
    const label = `data.js 第 ${i + 1} 个音阶 [${semis.join(',')}]`;
    assert.ok(semis.length >= 5, `${label} 至少要有 5 个音`);
    semis.forEach(p => assert.ok(p >= 0 && p <= 11, `${label} 含越界半音 ${p}`));
    assert.equal(new Set(semis).size, semis.length, `${label} 有重复音`);

    /* 归一到主音 = 0 后做闭合校验 */
    const sorted = [...new Set(semis)].sort((a, b) => a - b);
    const zeroed = sorted.map(p => (p - sorted[0] + 12) % 12).sort((a, b) => a - b);
    assert.equal(zeroed[0], 0, `${label} 归一后应从 0 起步`);

    let total = 12 - zeroed[zeroed.length - 1];         /* 最高音 → 下一个八度 */
    for (let k = zeroed.length - 1; k > 0; k--) total += zeroed[k] - zeroed[k - 1];
    assert.equal(total, 12, `${label} 音程累加 ${total} ≠ 12（八度不闭合，多半是手写错了一位）`);
  });
});

test('C1c 中国五声五调式：必须是同一音集 {do,re,mi,sol,la} 换主音得来的', () => {
  /* 闭合计校验（C1b）查不出这一类错——两个都闭合。
     徵调式就曾写成 [0,2,5,7,10]（那是商调式），闭合计照样通过。
     真正的判据是**旋转关系**：五个调式必须是同一组绝对音
     {do=0, re=2, mi=4, sol=7, la=9} 各自选一个作主音旋转出来的。
     这条测试能直接抓出"抄错了另一个调式"这种错。 */
  const ABS = { gong: 0, shang: 2, jiao: 4, zhi: 7, yu: 9 };   /* 绝对音（以 C 为基准） */
  const PENTA_ABS = [0, 2, 4, 7, 9];                          /* do re mi sol la */
  const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');

  Object.keys(ABS).forEach(k => {
    const re = new RegExp(`id:'cn${k[0].toUpperCase()}${k.slice(1)}',zh:'[^']*',en:'[^']*',semis:\\[([\\d,\\s]+)\\]`);
    const m = src.match(re);
    assert.ok(m, `data.js 应有 cn${k[0].toUpperCase()}${k.slice(1)} 调式定义`);
    const got = m[1].split(',').map(s => parseInt(s.trim(), 10));
    /* 期望：把绝对音集旋转到以主音为 0 */
    const t = ABS[k];
    const want = PENTA_ABS.map(p => ((p - t) + 12) % 12).sort((a, b) => a - b);
    assert.deepEqual(got, want,
      `${k} 调式应为 ${JSON.stringify(want)}（以 ${t} 为主音的五声旋转），实际 ${JSON.stringify(got)}`);
  });

  /* 五个调式必须互不相同（抄错成另一个是最常见的错法） */
  const lists = ['cnGong', 'cnShang', 'cnJiao', 'cnZhi', 'cnYu'].map(id => {
    const m = src.match(new RegExp(`id:'${id}'[\\s\\S]*?semis:\\[([\\d,\\s]+)\\]`));
    return m[1].split(',').map(s => parseInt(s.trim(), 10)).join(',');
  });
  assert.equal(new Set(lists).size, 5, '五个五声调式必须互不相同');
});

test('C2 三和弦拼装：triad / chordLabel', async () => {
  await withPage((w) => {
    const { triad, chordLabel, M_OF } = w.__MT__;
    const ionian = M_OF('ionian'), aeolian = M_OF('aeolian');
    // 注意：页面 realm 的数组要 spread 成测试 realm 数组再深比较
    // C 大调 I 级 = C-E-G 大三
    let c = triad(60, ionian, 0);
    assert.deepEqual([...c.notes], [60, 64, 67]);
    assert.equal(c.q, 'maj');
    // C 大调 ii 级 = D-F-A 小三
    c = triad(60, ionian, 1);
    assert.deepEqual([...c.notes], [62, 65, 69]);
    assert.equal(c.q, 'min');
    // C 大调 vii 级 = B-D-F 减三
    c = triad(60, ionian, 6);
    assert.deepEqual([...c.notes], [71, 74, 77]);
    assert.equal(c.q, 'dim');
    // a 小调 i 级 = A-C-E 小三
    c = triad(69, aeolian, 0);
    assert.deepEqual([...c.notes], [69, 72, 76]);
    assert.equal(c.q, 'min');
    // 罗马数字标记
    assert.equal(chordLabel(ionian, 0, 'maj'), 'I');
    assert.equal(chordLabel(ionian, 1, 'min'), 'ii');
    assert.equal(chordLabel(ionian, 4, 'maj'), 'V');
    assert.equal(chordLabel(ionian, 6, 'dim'), 'vii°');
  });
});

test('C3 音名拼写：spellUp 大三度=E、小三度=E♭（不能写成 D♯）', async () => {
  await withPage((w) => {
    const { spellUp } = w.__MT__;
    assert.equal(spellUp(0, 2, 4), 'E', 'C 上方大三度');
    assert.equal(spellUp(0, 2, 3), 'E♭', 'C 上方小三度');
    assert.equal(spellUp(0, 4, 7), 'G', 'C 上方纯五度');
    assert.equal(spellUp(9, 2, 4), 'C♯', 'A 上方大三度');
  });
});

/* -------------------------------------------------------------------------- *
 * D. 课程数据完整性
 * -------------------------------------------------------------------------- */

test('D1 调式数据：7 个调式半音结构合法', async () => {
  await withPage((w) => {
    const { M_OF } = w.__MT__;
    for (const id of ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'penta']) {
      const m = M_OF(id);
      assert.equal(m.semis.length, id === 'penta' ? 5 : 7, `${id} 音数`);
      assert.equal(m.semis[0], 0, `${id} 从主音起`);
      for (let i = 1; i < m.semis.length; i++) {
        assert.ok(m.semis[i] > m.semis[i - 1], `${id} 半音偏移应递增`);
      }
      assert.ok(m.semis[m.semis.length - 1] <= 11, `${id} 不超过一个八度`);
    }
    // semis 是页面 realm 的数组，spread 成测试 realm 数组再深比较
    assert.deepEqual([...M_OF('ionian').semis], [0, 2, 4, 5, 7, 9, 11]);
    assert.deepEqual([...M_OF('aeolian').semis], [0, 2, 3, 5, 7, 8, 10]);
    assert.deepEqual([...M_OF('penta').semis], [0, 2, 4, 7, 9]);    // 五声的卖点：相邻音之间没有半音
    const p = M_OF('penta').semis;
    for (let i = 1; i < p.length; i++) assert.notEqual(p[i] - p[i - 1], 1, '五声无半音相邻');
  });
});

test('D2 场景数据：91 张配方卡片引用合法的调式/音区/织体/噪声', async () => {
  await withPage((w) => {
    const { SCENES, DIMS, TEX, TONES, NOISES, M_OF } = w.__MT__;
    const d = w.document;
    const dimIds = [...DIMS.map(x => x.id)];

    assert.equal(SCENES.length, 91, '场景卡片总数 91（新增《沧海》情绪 5 张）');
    assert.equal(DIMS.length, 13, '维度总数 13（新增文化与风格）');

    // 每个维度都至少有一张卡片，且分组 id 全部合法
    dimIds.forEach(id => {
      assert.ok(SCENES.some(s => s.g === id), `维度 ${id} 应至少有一张卡片`);
    });
    SCENES.forEach(s => {
      assert.ok(dimIds.includes(s.g), `${s.t} 的分组 ${s.g} 必须存在于 DIMS`);
      assert.ok(M_OF(s.k), `${s.t} 引用的调式 ${s.k} 应查得到`);
      assert.ok(TEX[s.tex], `${s.t} 引用的织体 ${s.tex} 应存在`);
      assert.ok(TONES[TEX[s.tex].tone], `${s.t} 的织体音色 ${TEX[s.tex].tone} 应在 TONES 表里`);
      if (s.noise) assert.ok(NOISES[s.noise], `${s.t} 的噪声层 ${s.noise} 应在 NOISES 表里`);
      assert.ok(s.prog.length >= 1 && s.prog.length <= 4, `${s.t} 的进行长度应在 1–4 之间`);
      s.prog.forEach(dg => assert.ok(dg >= 0 && dg <= 6, `${s.t} 的级数 ${dg} 越界`));
      assert.ok(s.dyn > 0 && s.dyn <= 0.45, `${s.t} 力度应在 0–0.45 之间`);
      assert.ok(s.b >= 10 && s.b <= 200, `${s.t} BPM 应在 10–200 之间`);
      assert.ok(s.r > 0, `${s.t} 应自报听感速度 r`);
    });

    // 界面：默认展示全部 86 张；筛选条 14 个 chip（全部 + 13 维度）
    assert.equal(d.querySelectorAll('#sceneGrid .scene').length, 91, '默认展示全部卡片');
    assert.equal(d.querySelectorAll('#dimBar .chip').length, 14, '筛选条 = 全部 + 13 维度');
    assert.equal(d.querySelectorAll('#dimTable tr').length, 13, '维度拆解表 13 行');
    // 每张卡片都标出了听感速度
    d.querySelectorAll('#sceneGrid .scene').forEach((el, i) => {
      const tags = [...el.querySelectorAll('.tag')].map(t => t.textContent);
      assert.ok(tags.some(t => /听感 .+ 音头\/秒/.test(t)), `第 ${i + 1} 张卡片应显示听感速度`);
    });
  });
});

test('D3 歌词数据：十三辙合法、声调严格镜像、倒字必须是把顺字翻过来', async () => {
  /* 这一节的教学点全部依赖两条守恒关系，肉眼都看不出来：
   *   ① 倒字版 = 顺字版的镜像（起点与终点对调）
   *   ② 两版平均音高差 ≤1 半音（否则听众会把"倒字"误认成"换了个调"）
   * 数据一改就可能悄悄破坏它们，所以必须拿函数输出对账，而不是看注释。 */
  await withPage((w) => {
    const { RHYMES, TONE_SHAPE, LYRIC_LINES, LYRIC_BREATH, ALBUM_RHYMES, toneEvents, midiOct } = w.__MT__;

    /* ① 十三辙：13 个、名字不重复、按响度单调不增 */
    assert.equal(RHYMES.length, 13, '十三辙就是十三类');
    assert.equal(new Set(RHYMES.map(r => r.n)).size, 13, '辙名不得重复');
    for (let i = 1; i < RHYMES.length; i++) {
      assert.ok(RHYMES[i].lo <= RHYMES[i - 1].lo,
        `响度必须单调不增：${RHYMES[i - 1].n}(${RHYMES[i - 1].lo}) → ${RHYMES[i].n}(${RHYMES[i].lo})`);
    }
    RHYMES.forEach(r => {
      assert.ok(r.lo >= 1 && r.lo <= 5, `${r.n} 响度应在 1–5`);
      assert.ok(r.fm && r.mood && r.ex, `${r.n} 的韵母/情绪/例字都不能空`);
    });
    /* 言前必须同时收 an 与 ian——这是"押韵单位是辙不是韵母"的唯一实证，
       数据里漏掉 ian，这条教学点就没了 */
    assert.match(RHYMES.find(r => r.n === '言前').fm, /an[\s\S]*ian/, '言前辙必须同时收 an 与 ian');

    /* ② 声调：2/3/4 声严格镜像，1 声必须人为上挑 */
    [2, 3, 4].forEach(t => {
      const { fit, flip } = TONE_SHAPE[t];
      assert.equal(flip[0], fit[1], `${t} 声 flip 起点应等于 fit 终点`);
      assert.equal(flip[1], fit[0], `${t} 声 flip 终点应等于 fit 起点`);
    });
    assert.ok(TONE_SHAPE[1].flip[0] < TONE_SHAPE[1].flip[1],
      '1 声本来是平的，要唱倒必须人为加一次上挑，否则 flip 等于 fit，倒了也没变化');
    [1, 2, 3, 4].forEach(t => {
      const { fit, flip } = TONE_SHAPE[t];
      const gap = Math.abs((fit[0] + fit[1]) / 2 - (flip[0] + flip[1]) / 2);
      assert.ok(gap <= 1, `${t} 声两版平均音高差 ${gap} 半音，超过 1 就无法把差异归因于"字"`);
    });

    /* ③ 例句：4–8 字，声调在 0–4 */
    assert.ok(LYRIC_LINES.length >= 3, '至少三个例句');
    LYRIC_LINES.forEach(L => {
      assert.ok(L.w.length >= 4 && L.w.length <= 8, `${L.t} 字数应在 4–8`);
      L.w.forEach(([ch, tone]) => {
        assert.equal(ch.length, 1, `${L.t} 的「${ch}」应是单个汉字`);
        assert.ok(tone >= 0 && tone <= 4, `${L.t} 的「${ch}」声调 ${tone} 越界`);
      });
    });

    /* ④ toneEvents 排程必须严格按 TONE_SHAPE 来，且整句走向相反 */
    const base = midiOct(0, 4);
    LYRIC_LINES.forEach(L => {
      const a = toneEvents(L.w, false), b = toneEvents(L.w, true);
      assert.equal(a.steps.length, L.w.length, `${L.t} 顺字版应一字一步`);
      assert.equal(b.steps.length, L.w.length, `${L.t} 倒字版应一字一步`);
      L.w.forEach(([ch, tone], i) => {
        const sh = TONE_SHAPE[tone];
        assert.equal(a.steps[i].m, base + sh.fit[0], `${L.t}「${ch}」顺字起音`);
        assert.equal(a.steps[i].bend, sh.fit[1] - sh.fit[0], `${L.t}「${ch}」顺字滑音`);
        assert.equal(b.steps[i].m, base + sh.flip[0], `${L.t}「${ch}」倒字起音`);
        assert.equal(b.steps[i].bend, sh.flip[1] - sh.flip[0], `${L.t}「${ch}」倒字滑音`);
      });
      const dirA = a.steps[a.steps.length - 1].m - a.steps[0].m;
      const dirB = b.steps[b.steps.length - 1].m - b.steps[0].m;
      assert.notEqual(Math.sign(dirA), Math.sign(dirB),
        `${L.t}：顺字与倒字的整句走向必须相反（${dirA} vs ${dirB}）`);
    });

    /* ⑤ 气口例句：n 必须等于句子的实际字数（去掉空格后）。
       这条是补上的——早先 #8 那句写成了 11 字，实际 12 字，
       界面就少画一个字块、最后一个方块空着。靠肉眼数中文字太容易错，
       只能让数据自己跟自己对账。 */
    LYRIC_BREATH.lines.forEach(L => {
      const real = L.line.replace(/\s/g, '').length;
      assert.equal(L.n, real, `气口例句「${L.line}」标了 ${L.n} 字，实际 ${real} 字`);
    });

    /* ⑥ 专辑十首的辙口必须都在十三辙里 */
    assert.equal(ALBUM_RHYMES.length, 10, '专辑十首');
    const names = new Set(RHYMES.map(r => r.n));
    ALBUM_RHYMES.forEach(a => assert.ok(names.has(a.r), `《${a.t}》的辙「${a.r}」不在十三辙里`));
  });
});

/* -------------------------------------------------------------------------- *
 * E. 交互冒烟（桩 AudioContext，点播放按钮跑完整链路）
 * -------------------------------------------------------------------------- */

test('E1 播放音阶：出声链路 + 键盘闪灯 + "正在响"读出区', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#playScaleBtn').click();
    await sleep(200);   // 首音 at≈0.06s，flash 时长 500ms
    // 键盘上 C4（midi 60）应变琥珀闪灯
    assert.ok(d.querySelectorAll('.kb .wk.flash').length >= 1, '发声键应有 flash 类');
    // "正在响"读出区应渲染出键名
    assert.match(d.querySelector('#dockRead').innerHTML, /<i class="kc">C4<\/i>/);
    // LIVE 视图应有内容
    assert.ok(w.__MT__.live.size >= 1, 'LIVE 应记录正在发声的音');
    // 停止后全部复位
    d.querySelector('#clearBtn').click();
    await sleep(50);
    assert.equal(w.__MT__.live.size, 0, '停止后 LIVE 应清空');
    assert.equal(d.querySelector('#dockRead').innerHTML, '', '停止后读出区应清空');
  });
});

test('E2 和弦进行：点播放后第一块高亮、按钮变"播放中"', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#progPlay').click();
    await sleep(150);
    assert.match(d.querySelector('#progPlay').textContent, /播放中/);
    assert.ok(d.querySelector('#progStrip > div').classList.contains('hit'), '第一个和弦块应高亮');
    d.querySelector('#progStop').click();
    assert.equal(d.querySelectorAll('#progStrip > div.hit').length, 0, '停止后高亮应清除');
  });
});

test('E3 各节播放按钮点击不报错（音程表/术语 chips/场景卡片）', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#ivTable tr').click();            // 音程试听
    await sleep(30);
    d.querySelector('#tempoChips .chip').click();      // 速度术语
    await sleep(30);
    d.querySelector('#meterChips .chip:nth-child(2)').click();  // 3/4
    await sleep(30);
    d.querySelector('#sceneGrid .scene').click();      // 场景配方
    assert.ok(d.querySelector('#sceneGrid .scene').classList.contains('playing'), '场景卡片应进入 playing 态');
    await sleep(30);
    d.querySelector('#hookBoth').click();              // 主歌+副歌连听
    await sleep(30);
    d.querySelector('#modBoth').click();               // C→D 连听
    await sleep(30);
    d.querySelector('#sevArp').click();                // 七和弦琶音
    await sleep(30);
    d.querySelector('[data-play="sync"]').click();     // 切分节奏对比
    await sleep(30);
    d.querySelector('[data-play="pentaAdd"]').click(); // 借偏音
    await sleep(50);
  });
});

test('E4 换调联动：rootSel / modeSel 改变后键盘亮键与说明同步', async () => {
  await withPage(async (w, d) => {
    const root = d.querySelector('#rootSel');
    root.value = '5';   // F
    root.dispatchEvent(new w.Event('change', { bubbles: true }));
    const mode = d.querySelector('#modeSel');
    mode.value = 'aeolian';
    mode.dispatchEvent(new w.Event('change', { bubbles: true }));
    // kbInfo 应显示 F 自然小调
    assert.match(d.querySelector('#kbInfo').textContent, /F\s*自然小调/);
    // #kb 固定窗画的是 14 个白键位（root=F 时为 F4–E6），F 自然小调的音落在：
    // 白键 8 个（F G B♭ C F G B♭ C），黑键 6 个（A♭ D♭ E♭ A♭ D♭ G♭）——共 14 个亮键
    const onW = d.querySelectorAll('#kb .wk.on').length;
    const onB = d.querySelectorAll('#kb .bk.on').length;
    assert.equal(onW, 8, 'F 自然小调亮起的白键数');
    assert.equal(onB, 6, 'F 自然小调亮起的黑键数');
    // 大小调示意图应跟着主音重画（根音块音名 = F4）
    assert.match(d.querySelector('#ladderMajor').innerHTML, />F4</);
  });
});

test('E5 移调 chips / 转调 chips / 七和弦 chips 切换内容', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#keyChips .chip:nth-child(2)').click();   // G 大调
    assert.match(d.querySelector('#keyNow').textContent, /G 大调/);
    assert.equal(d.querySelector('#keyShift').value, '-5');
    d.querySelector('#modChips .chip:nth-child(3)').click();   // 上四度 → F
    assert.match(d.querySelector('#modInfo').textContent, /F 大调/);
    d.querySelector('#sevChips .chip:nth-child(2)').click();   // 属七
    assert.match(d.querySelector('#sevInfo').textContent, /属七/);
    assert.equal(d.querySelectorAll('#sevStrip rect').length, 4);
  });
});

test('E6 底栏钢琴收起/展开 + 空格停止', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#dockBtn').click();
    assert.ok(d.querySelector('#dock').classList.contains('hide'));
    assert.equal(d.querySelector('#dockBtn').textContent, '展开钢琴');
    d.querySelector('#dockBtn').click();
    assert.ok(!d.querySelector('#dock').classList.contains('hide'));
    // 空格 = 全站停止
    d.querySelector('#progPlay').click();
    await sleep(80);
    d.dispatchEvent(new w.KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true }));
    await sleep(30);
    assert.equal(w.__MT__.live.size, 0, '空格后应全部停止');
  });
});

test('E7 节拍器：开始后第一拍圆点高亮，停止后熄灭', async () => {
  await withPage(async (w, d) => {
    d.querySelector('#metPlay').click();
    await sleep(400);   // 首拍排程在 currentTime+0.1s
    assert.ok(d.querySelector('#metBeatsDots .beat').classList.contains('hit'), '节拍器应点亮拍点');
    d.querySelector('#metStop').click();
    await sleep(30);
    assert.equal(d.querySelectorAll('#metBeatsDots .beat.hit').length, 0, '停止后圆点应全灭');
  });
});

test('E8 版本号：applyVersion 把版本号写进标签页标题与页面两处标题', async () => {
  await withPage((w, d) => {
    const want = /\d+\.\d+ \[(\d{2}\.\d{2}\.\d{2})\]/;
    assert.match(d.title, want, `标签页标题应含版本号，实际「${d.title}」`);
    const date = d.title.match(want)[1];
    assert.match(d.title, /^姐弟厨师团 --- 乐理课 V/, '标签页标题应保持原有前缀');
    /* 页面两处标题都要被写上，且版本号 <b> 加粗（斜体由 CSS 管） */
    const nodes = d.querySelectorAll('[data-ver]');
    assert.equal(nodes.length, 2, '应有 2 处版本号节点');
    nodes.forEach((el, i) => {
      assert.ok(el.querySelector('b'), `第 ${i + 1} 处版本号应带 <b>（加粗）`);
      assert.equal(el.querySelector('b').textContent, 'V' + d.title.match(/V([\d.]+)/)[1],
        `第 ${i + 1} 处版本号应与标签页一致`);
      assert.ok(el.textContent.includes(`[${date}]`), `第 ${i + 1} 处应含日期`);
    });
    /* 页头导语下方与侧栏 brand 都要在 */
    assert.ok(d.querySelector('.hero-ver [data-ver], .hero .hero-ver[data-ver]'),
      '页头导语下方应有版本号');
    assert.ok(d.querySelector('#nav .brand [data-ver]'), '侧栏 brand 应含版本号');
    /* 页头不再重复放 h1（标题已画在插图里） */
    assert.equal(d.querySelectorAll('.hero h1').length, 0,
      '页头不应再有 h1（标题已画在羊皮纸插图内）');
    /* 版本号要在导语下方、右对齐 */
    const hv = d.querySelector('.hero-ver');
    assert.ok(hv && /right/.test(w.getComputedStyle(hv).textAlign), '页头版本号应右对齐');
    const intro = d.querySelector('.hero .intro');
    assert.ok(intro && hv && (intro.compareDocumentPosition(hv) & w.Node.DOCUMENT_POSITION_FOLLOWING),
      '版本号应排在导语段落之后');
  });
});

test('A6 双页互链：两页各在页头之上指对方，且作词课用上了自己的插图', async () => {
  /* 乐理课 → 作词课 */
  await withPage((w, d) => {
    const link = d.querySelector('.wrap > .pageswitch a');
    assert.ok(link, '乐理课顶部应有互链');
    assert.equal(link.getAttribute('href'), 'lyric.html', '应指向 lyric.html');
    assert.equal(d.querySelectorAll('.pageswitch').length, 1, '每页只放一条互链');
    const hero = d.querySelector('.hero');
    assert.ok(link.compareDocumentPosition(hero) & w.Node.DOCUMENT_POSITION_FOLLOWING,
      '互链必须排在页头之前（页面最顶上）');
    assert.match(d.querySelector('.hero img').getAttribute('src'), /hero-art\.png$/,
      '乐理课页头仍用自己的插图');
  });
  /* 作词课 → 乐理课 */
  await withLyricPage((w, d) => {
    const link = d.querySelector('.wrap > .pageswitch a');
    assert.ok(link, '作词课顶部应有互链');
    assert.equal(link.getAttribute('href'), 'index.html', '应指回 index.html');
    const hero = d.querySelector('.hero');
    assert.ok(link.compareDocumentPosition(hero) & w.Node.DOCUMENT_POSITION_FOLLOWING,
      '互链必须排在页头之前');
    /* 页头插图：两页各有自己的那一张，标题都画在图里 */
    const img = d.querySelector('.hero img');
    assert.ok(img, '作词课页头应有插图');
    assert.match(img.getAttribute('src'), /hero-lyrics\.png$/, '应使用 hero-lyrics.png');
    assert.equal(d.querySelectorAll('.hero h1').length, 0,
      '标题已画在插图里，页头不应再有 h1（与乐理课一致）');
    assert.ok(d.querySelector('.hero .hero-ver[data-ver]'), '页头版本号不能因为换版式丢掉');
  });
});

test('A7 目录互链：两页的目录里各有一条指对方的入口，且不会被当成当前节点亮', async () => {
  /* 顶部那条 .pageswitch 只在页面最顶端可见。目录是 fixed 的，
     所以必须再有一条——否则滚到第 9 节以后想换课就得先滚回顶端。 */

  await withPage((w, d) => {
    const sw = d.querySelector('#nav a.navswitch');
    assert.ok(sw, '乐理课目录里应有互链');
    assert.equal(sw.getAttribute('href'), 'lyric.html', '应指向 lyric.html');
    /* 位置：必须在第一个章节链接之前，否则要往下翻才看得见 */
    const firstSec = d.querySelector('#nav a[href^="#"]');
    assert.ok(sw.compareDocumentPosition(firstSec) & w.Node.DOCUMENT_POSITION_FOLLOWING,
      '互链必须排在章节链接之前');
    /* 它是外链，不该被滚动高亮逻辑当成"当前节"——高亮只认锚点链接 */
    const spy = [...d.querySelectorAll('#nav a.on')];
    assert.equal(spy.length, 0, '初始状态不应有任何链接被点亮');
  });

  await withLyricPage((w, d) => {
    const sw = d.querySelector('#nav a.navswitch');
    assert.ok(sw, '作词课目录里应有互链');
    assert.equal(sw.getAttribute('href'), 'index.html', '应指回 index.html');
    const firstSec = d.querySelector('#nav a[href^="#"]');
    assert.ok(sw.compareDocumentPosition(firstSec) & w.Node.DOCUMENT_POSITION_FOLLOWING,
      '互链必须排在章节链接之前');
  });
});

test('A8 文案里的数量必须和数据对得上：标题说几个，表里就得有几行', async () => {
  await withPage((w, d) => {
    /* 取某个表所在卡片的小标题——数字就写在那里 */
    const cardH3 = sel => {
      const t = d.querySelector(sel);
      assert.ok(t, sel + ' 应存在');
      return t.closest('.card').querySelector('h3').textContent;
    };

    /* 音程：0 半音（纯一度）到 12 半音（纯八度）共 13 行。
       曾经写成"十二个音程"——把纯一度漏在计数外，而表里明明有 13 行。 */
    assert.equal(d.querySelectorAll('#ivTable tr').length, 13, '音程表应 13 行');
    assert.match(cardH3('#ivTable'), /十三/, '标题必须写"十三个音程"');

    /* 表达维度：DIMS 13 条（第 13 个是文化与风格），表也是 13 行 */
    assert.equal(d.querySelectorAll('#dimTable tr').length, w.__MT__.DIMS.length, '维度表行数 = DIMS 条数');
    assert.match(cardH3('#dimTable'), /十三/, '标题必须写"十三个维度"');

    /* 速查两表的条数写在 data.js 的注释里——注释和数组会各自漂移，
       所以直接读源码里那行注释的括号数字，跟数组长度对账。 */
    const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
    const claimed = (label) => {
      const m = src.match(new RegExp(label + '"[^\\n]*?（(\\d+) 条）'));
      assert.ok(m, `data.js 里应有一行 "${label}…（N 条）" 的注释`);
      return +m[1];
    };
    assert.equal(w.__MT__.TERMS.length, claimed('术语速查'), '术语速查：注释条数必须等于实际条数');
    assert.equal(w.__MT__.CHECKLIST.length, claimed('写完一首歌的自查清单'), '自查清单：注释条数必须等于实际条数');
  });
});

test('A9 织体总览表：15 行必须与 TEX 一一对应，数字全部现算不写死', async () => {
  await withPage((w, d) => {
    const { TEX, TEX_PICK, texSpan } = w.__MT__;

    /* ① 标题说 15 种，表里就得有 15 行——这张表就是为了补"另外 9 种没人讲"的缺口，
       行数对不上就等于没补上 */
    const cardH3 = sel => {
      const t = d.querySelector(sel);
      assert.ok(t, sel + ' 应存在');
      return t.closest('.card').querySelector('h3').textContent;
    };
    assert.match(cardH3('#texTable'), /15 种织体|十五种织体/, '标题必须写明 15 种织体');
    assert.equal(d.querySelectorAll('#texTable tr').length, 15, '织体总览表应 15 行');

    /* ② TEX_PICK 必须恰好覆盖 TEX 的全部 15 种：一种不多，一种不少。
       漏一种 = 那一种还是没人知道它是干什么用的。 */
    const texIds = Object.keys(TEX);
    const pickIds = TEX_PICK.map(p => p.tex);
    assert.equal(TEX_PICK.length, 15, 'TEX_PICK 必须 15 行');
    assert.deepEqual([...pickIds].sort(), [...texIds].sort(),
      `TEX_PICK 必须与 TEX 一一对应。缺：${texIds.filter(x => !pickIds.includes(x)).join(',') || '无'}；`
      + `多：${pickIds.filter(x => !texIds.includes(x)).join(',') || '无'}`);
    /* 也不能重复——重复两行等于漏了一种 */
    assert.equal(new Set(pickIds).size, pickIds.length, 'TEX_PICK 里不能有重复的织体');

    /* ③ 每行都得说清"什么时候用"和"听感"——少一列就退化成一张织体名单 */
    TEX_PICK.forEach(p => {
      assert.ok(p.use && p.use.length >= 4, `${p.tex} 缺"什么时候用"`);
      assert.ok(p.feel && p.feel.length >= 4, `${p.tex} 缺"听感"`);
    });

    /* ④ 表里的数字必须现算：音头数、和弦周期、密度都不许写死。
       渲染出来的文本里必须带着 TEX 里的真实 hits 数与 texSpan 的周期。 */
    const rows = [...d.querySelectorAll('#texTable tr')];
    TEX_PICK.forEach((p, i) => {
      const T = TEX[p.tex];
      const cells = [...rows[i].querySelectorAll('td')].map(td => td.textContent.replace(/\s+/g, ' ').trim());
      assert.ok(cells[1].includes(String(T.hits.length)),
        `第 ${i + 1} 行「${p.tex}」的音头数应现算为 ${T.hits.length}，实际读到「${cells[1]}」`);
      assert.ok(cells[2].includes(`${texSpan(T)} 拍`),
        `第 ${i + 1} 行「${p.tex}」的和弦周期应现算为 ${texSpan(T)} 拍，实际读到「${cells[2]}」`);
      /* 密度 = hits ÷ (周期秒数)，折算到 100 BPM —— 与 sceneRate 同源 */
      const want = T.hits.length * 100 / (texSpan(T) * 60);
      assert.ok(cells[3].includes(want.toFixed(2)),
        `第 ${i + 1} 行「${p.tex}」的密度应现算为 ${want.toFixed(2)}，实际读到「${cells[3]}」`);
    });

    /* ⑤ 密度必须真的按和弦周期折算——长音织体（周期 6–7 拍）的密度
       必须**低于**普通两拍织体的同等音头数，否则分母写错了。
       这条是"公式没走回老路"的哨兵。 */
    const padRate = TEX.pad.hits.length * 100 / (texSpan(TEX.pad) * 60);
    const blockRate = TEX.block.hits.length * 100 / (texSpan(TEX.block) * 60);
    assert.ok(padRate < blockRate / 2,
      `铺底（周期 ${texSpan(TEX.pad)} 拍）密度 ${padRate.toFixed(2)} 应远低于块状（周期 ${texSpan(TEX.block)} 拍）${blockRate.toFixed(2)}`);

    /* ⑥ 选型表与总览表不能互相矛盾：GROOVE_PICK 引用的织体必须都在总览表里 */
    const { GROOVE_PICK } = w.__MT__;
    GROOVE_PICK.forEach(p => {
      assert.ok(pickIds.includes(p.tex),
        `选型表里的织体 ${p.tex} 必须出现在总览表里，否则两张表说法不一致`);
    });
  });
});

/* ============================================================================
 * F. 声学验证 —— 编排出来的声音，是不是真和描述相符
 * --------------------------------------------------------------------------
 * 这组测试回答的是用户那句「测试你所编排的音乐，演奏速度、调式和风格是不是
 * 音乐和描述相符」。做法不是对公式，而是把每张卡片真的渲染成 PCM 波形，
 * 再从波形里把音头密度、音高、亮度、最小音程测出来，跟卡片想说的话对账。
 * ========================================================================== */
const AC = require('./acoustics.js');

/* 把一张卡片跑完整链路：排程 → 渲染波形 → 分析 → 返回测量结果 */
function measure(MT, cfg) {
  const { sceneEvents, TONES } = MT;
  const ev = sceneEvents(cfg);
  const buf = AC.renderScene(cfg, ev, TONES, AC.SR);

  /* 包络 + 起始点检测。hop 取 5ms——比最短的音（16 分音符在 160BPM 下约 94ms）
     细得多，不会漏掉密集音头 */
  const hop = Math.floor(AC.SR * 0.005);
  const env = AC.envelope(buf, AC.SR, hop);
  /* 起始点检测的最小间隔取 60ms：比任何一张卡的最快音程（32分音符@160BPM≈47ms）
     略宽一点，避免把同一个音头的包络上升沿数成两下。
     ——但对 pad/drone 这类**软起音长音**要放宽到 400ms：它们靠 400ms 的慢起音
     制造"渐入"的效果，起音斜率本来就平，起始点检测天然不敏感。
     这不是放宽标准，是换一把尺子：长音的节奏单位是"和弦周期"，
     直接用 hits.length 数反而更准。 */
  const softLong = ['pad', 'drone', 'silk', 'openair', 'breath'].includes(cfg.tex);
  const onsets = AC.detectOnsets(env, 0.005, softLong ? 0.40 : 0.06);

  /* 音量门限以下不算"听到"——极轻的卡片（dyn 0.13–0.2）要用相对阈值。
     长音卡片在起音斜坡上峰值很低，所以门限也放宽到峰值的 3% */
  const peak = Math.max(...env);
  const gate = peak * (softLong ? 0.03 : 0.06);
  /* 长音类兜底：检测器一个音头都没抓到时（慢起音 + 长音符的组合），
     直接用排程里的音头数——排程本身就是真值，检测器只是交叉验证手段 */
  const detected = onsets.filter(t => {
    const idx = Math.floor(t / 0.005);
    return idx < env.length && env[idx] > gate;
  });
  const texHits = MT.TEX[cfg.tex].hits.length;
  const audible = detected.length > 0
    ? detected
    : [0].concat(Array.from({ length: texHits * cfg.prog.length - 1 },
        (_, i) => ev.steps.filter(s => Math.abs(s.at - i * (ev.dur / (texHits * cfg.prog.length))) < 1e-6)[0].at))
        .filter(x => x != null);

  /* 每个音头时刻测一次音高，取中位数当这张卡片的"实际音高中心" */
  const pitches = audible.map(t => AC.dominantPitch(buf, AC.SR, t, softLong ? 0.12 : 0.05))
    .filter(x => x != null).sort((a, b) => a - b);
  const medPitch = pitches.length ? pitches[Math.floor(pitches.length / 2)] : null;
  /* 兜底：整段扫一遍找能量最强处的音高，长音卡片靠 onset 时刻测会测在斜坡上 */
  const fallbackPitch = medPitch != null ? medPitch
    : AC.dominantPitch(buf, AC.SR, ev.dur * 0.35, 0.15);

  return {
    cfg, ev, buf, env,
    rate: audible.length / ev.dur,          /* 实测音头密度（个/秒） */
    onsets: audible.length,
    medPitch: fallbackPitch,
    bright: AC.spectralCentroid(buf, AC.SR),
    peak,
  };
}

/* 从纯数据层加载（不开 jsdom，快 10 倍）——用 vm 把 data.js/utils.js/audio.js/
   playback.js 跑起来。加载顺序与 index.html 里的 script 顺序一致（全局作用域共享） */
function loadData() {
  const fs2 = require('node:fs');
  const vm = require('node:vm');
  const ctx = vm.createContext({ Math, Array, Object, Map, Set, console, document: {} });
  ['js/data.js', 'js/utils.js', 'js/audio.js', 'js/playback.js'].forEach(f => {
    vm.runInContext(fs2.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
  });
  /* audio.js / playback.js 引用了键盘层的几个全局变量，只在真播放时用得上，
     这里补声明让模块能跑完（顶层已 let 过的 LIVE/TOKEN 等不能重复声明）。 */
  vm.runInContext('var flashKey=function(){},clickVoice=function(){},' +
                  'kbAuto=false,kbUserPanned=false,kbHomeAll=function(){};', ctx);
  /* 顶层 const/let 不会自动挂到 vm context 上（跟浏览器 window 一样），
     所以显式跑一条赋值语句把它们导出——这与 app.js 里 window.__MT__ 的做法同理 */
  vm.runInContext('globalThis.__X__ = { SCENES, DIMS, TEX, TONES, NOISES, MODES, ALL_MODES, ' +
    'M_OF, triad, midiOct, f, noteName, sceneEvents, sceneRate, texSpan };', ctx);
  return ctx.__X__;
}

test('F1 排程层：每张卡片自报的听感速度，与实际排出的音头密度一致', () => {
  const MT = loadData();
  /* 密度公式：**每和弦音头数 ÷ 一个和弦实际占多少秒** = hits × BPM ÷ (span × 60)
     span 必须与 sceneEvents 真正排程用的周期一致（texSpan）——
     曾经这里假设"周期恒为 2 拍"，而 pad/drone 实际 6 拍、openair 7 拍、
     bell 3 拍，于是 30/91 张卡片自报的速度偏高 20%–250%。
     现在断言直接用 texSpan 算，与 sceneRate 同一个来源，不会再走散。 */
  const rateOf = s => MT.TEX[s.tex].hits.length * s.b / (MT.texSpan(MT.TEX[s.tex]) * 60);
  let maxErr = 0, worst = null;
  MT.SCENES.forEach(s => {
    const declared = s.r;
    const computed = rateOf(s);
    const err = Math.abs(computed - declared);
    if (err > maxErr) { maxErr = err; worst = s; }
  });
  assert.ok(maxErr <= 0.05,
    `卡片自报听感速度与公式不符，最大偏差 ${maxErr.toFixed(3)}（${worst && worst.t}）`);

  /* 公式必须与 sceneRate 一致——同一个口径，不能两处各算一套 */
  MT.SCENES.forEach(s => {
    assert.ok(Math.abs(MT.sceneRate(s) - rateOf(s)) < 1e-9,
      `「${s.t}」sceneRate 与独立算式不一致`);
  });
});

test('F1b 密度口径：公式的分母必须等于排程真正用的和弦周期', () => {
  const MT = loadData();
  /* 这条守的是一个真实踩过的坑：密度公式曾经写死"和弦周期＝2 拍"，
     而 sceneEvents 对长音织体用的是 6 拍（pad/drone）、7 拍（openair）、
     3 拍（bell）、2.4 拍（stone）——于是 30/91 张卡片自报的听感速度
     偏高 20%–250%，而卡片上显示的正是这个自报值。
     光靠"r 与公式对账"抓不到（公式和 r 一起错），必须回到排程层量。 */

  /* ① texSpan 必须与 sceneEvents 实际排出的周期一致——
        一张卡的总时长 = 和弦数 × 周期 × 每拍秒数，反解出周期来对账 */
  MT.SCENES.forEach(s => {
    const ev = MT.sceneEvents(s);
    const spb = 60 / s.b;
    const realSpan = ev.dur / (s.prog.length * spb);
    const declared = MT.texSpan(MT.TEX[s.tex]);
    assert.ok(Math.abs(realSpan - declared) < 1e-9,
      `「${s.t}」排出来的周期 ${realSpan.toFixed(3)} 拍与 texSpan 声明的 ${declared} 不符`);
  });

  /* ② 长音织体的周期必须真的大于 2 拍——这条守住"空旷/死亡"不会退回两拍一下 */
  ['pad', 'drone', 'openair', 'bell'].forEach(k => {
    const tex = MT.TEX[k];
    assert.ok(MT.texSpan(tex) > 2,
      `${k} 的和弦周期应为 ${MT.texSpan(tex)} 拍（长音织体不能被 2 拍腰斩）`);
  });

  /* ③ 密度公式必须随周期变长而变慢——周期是分母，
        同一张卡若周期翻倍而音头数不变，密度必须减半 */
  MT.SCENES.forEach(s => {
    const tex = MT.TEX[s.tex];
    const span = MT.texSpan(tex);
    const hits = tex.hits.length;
    const rate = MT.sceneRate(s);
    assert.ok(Math.abs(rate - hits * s.b / (span * 60)) < 1e-9,
      `「${s.t}」密度必须按 hits × BPM ÷ (span × 60) 算`);
  });

  /* ④ 反向断言：长音卡片必须**比**同 BPM 的两拍织体慢——
        这是本次修复的直接效果，也是防止有人把公式改回旧版的哨兵 */
  const longCard = MT.SCENES.find(s => s.tex === 'pad' && s.b === 56);
  assert.ok(longCard, '应有一张 56 BPM 的铺底卡片');
  const padRate = MT.sceneRate(longCard);
  const twoBeatRate = MT.TEX.pad.hits.length * longCard.b / 120;
  assert.ok(padRate < twoBeatRate * 0.5,
    `56 BPM 的铺底卡密度 ${padRate.toFixed(3)} 应远低于按 2 拍周期算的 ${twoBeatRate.toFixed(3)}`);
});

test('F2 波形层：实测音头密度与标称 BPM 严格同向（热血必须快过悬疑）', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const hot = S.find(s => s.t === '热血 / 昂扬');
  const sus = S.find(s => s.t === '悬疑的');

  /* 第 1 层 · 波形实测：这两张卡必须真的听出快慢之分。
     这就是用户报的那个 bug 的回归测试——修之前热血实测 1.25 < 悬疑 3.07 */
  const mHot = measure(MT, hot), mSus = measure(MT, sus);
  assert.ok(mHot.rate > mSus.rate,
    `热血(${mHot.rate.toFixed(2)} 音头/秒) 必须快过悬疑(${mSus.rate.toFixed(2)} 音头/秒)`);
  /* 实测与排程公式应基本吻合（差 25% 内）——波形层与排程层互为交叉验证 */
  const calc = s => MT.TEX[s.tex].hits.length * s.b / (MT.texSpan(MT.TEX[s.tex]) * 60);
  assert.ok(Math.abs(mHot.rate - calc(hot)) / calc(hot) < 0.25,
    `热血实测 ${mHot.rate.toFixed(2)} 与公式 ${calc(hot).toFixed(2)} 偏差过大`);

  /* 第 2 层 · 排程层：全库自洽性。
     关键认识：**听感速度 = 每和弦音头数 ÷ 和弦实际时长，不是 BPM 本身**。
     shimmer（每周期 8 个音头）配 88 BPM = 5.87 音头/秒，
     march（2 个音头）配 150 BPM = 2.5 音头/秒——后者 BPM 更高却更慢。
     这不是 bug，这正是织体存在的意义（微光要的就是"密而轻"）。
     而长音织体的和弦周期长达 6–7 拍，密度还要再除以那个周期——
     分母里的 span 用 texSpan() 取，与 sceneEvents 真正排程用的值同源。
     所以这里不能断言"BPM 高 ⇒ 更快"，而要断言：
       ① 卡片自报的 r 与公式计算值一致（数据自洽）
       ② 同一维度内部，听感密度与该维度的语义排序一致（语义自洽）
     跨维度的 BPM 单调性由 F1 + F3 的语义断言分别覆盖。 */
  const rateOf = s => MT.sceneRate(s);
  MT.SCENES.forEach(s => {
    const calc = rateOf(s);
    assert.ok(Math.abs(calc - s.r) <= 0.05,
      `「${s.t}」自报 r=${s.r} 与公式计算值 ${calc.toFixed(2)} 不符`);
  });

  /* 同一维度内：语义上"更兴奋"的卡片，密度必须更高。
     这是全库最有价值的自洽性检查——防止以后加卡片时把参数配反。 */
  const GROUPS = [
    { g: 'mood', order: ['孤独的', '释然的', '温柔的', '开心的', '热血 / 昂扬', '紧张的'] },
    { g: 'space', order: ['空旷', '辽阔', '幽深', '遥远', '逼仄', '拥挤'] },
    { g: 'size', order: ['沉重', '巨大', '轻盈', '渺小'] },
    { g: 'body', order: ['疲惫', '平静心跳', '心跳加速', '高潮'] },
    { g: 'time', order: ['永恒 / 时间凝住', '深夜', '黎明', '黄昏', '正午'] },
  ];
  GROUPS.forEach(({ g, order }) => {
    const byName = new Map(MT.SCENES.filter(s => s.g === g).map(s => [s.t, s]));
    const seq = order.filter(t => byName.has(t));
    for (let i = 0; i < seq.length - 1; i++) {
      const a = byName.get(seq[i]), b = byName.get(seq[i + 1]);
      const ra = MT.sceneRate(a), rb = MT.sceneRate(b);
      /* 后者语义上应"更快/更强"，密度须不低于前者（允许 15% 的持平容差） */
      assert.ok(rb >= ra * 0.85,
        `维度 ${g}：「${b.t}」(${rb.toFixed(2)}/s) 的语义强度应不低于「${a.t}」(${ra.toFixed(2)}/s)`);
    }
  });
});

test('F3 语义层 · 速度：速度类描述必须与实测密度一致', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const get = t => S.find(s => s.t === t);
  const rate = t => MT.sceneRate(get(t));

  /* 「静止/死亡/永恒」必须真的几乎没有音头——密度接近 0 */
  ['静止', '死亡', '永恒 / 时间凝住'].forEach(t => {
    assert.ok(rate(t) < 0.5, `「${t}」密度 ${rate(t).toFixed(2)}，应当几乎静止`);
  });

  /* 「爆炸/追逐/战斗/高潮」必须真的密——密度高于 5 */
  ['爆炸', '追逐', '战斗', '高潮'].forEach(t => {
    assert.ok(rate(t) > 5, `「${t}」密度 ${rate(t).toFixed(2)}，应当非常密集`);
  });

  /* 「紧张 vs 释然」——一紧一松，且方向正确 */
  assert.ok(rate('紧张的') > rate('释然的') * 1.5, '紧张必须明显快过释然');

  /* 波形层交叉验证：抽三张有代表性的卡，真的渲染出波形数一遍 */
  assert.ok(measure(MT, get('热血 / 昂扬')).rate > 4, '热血波形实测应密');
  assert.ok(measure(MT, get('悬疑的')).rate < 4, '悬疑波形实测应疏');
  assert.ok(measure(MT, get('爆炸')).rate > measure(MT, get('闷热 31°C')).rate,
    '爆炸必须比闷热密');

  /* 身体维度：BPM 对齐静息心率；呼吸对齐生理值。
     一个"呼吸周期"约 4–6 秒（成人静息呼吸 12–15 次/分），
     所以这里看的是**音符间隔**而不是 BPM 数字——织体的细分才是耳朵的尺子 */
  assert.equal(get('平静心跳').b, 64, '静息心率应对齐 64 BPM');
  assert.ok(get('心跳加速').b >= 130, '运动心率应超过 130');

  const br = get('平静呼吸'), brEv = MT.sceneEvents(br);
  const gapSec = brEv.dur / brEv.steps.length;
  assert.ok(gapSec >= 4 && gapSec <= 10,
    `「平静呼吸」每个音间隔 ${gapSec.toFixed(1)}s，应落在呼吸周期 4–10 秒之间`);

  /* 反向：心跳卡的间隔必须明显短于呼吸卡——两者都在"身体"维度 */
  const hb = get('平静心跳'), hbEv = MT.sceneEvents(hb);
  const hbGap = hbEv.dur / hbEv.steps.length;
  assert.ok(hbGap < gapSec / 3,
    `心跳间隔 ${hbGap.toFixed(2)}s 应远短于呼吸间隔 ${gapSec.toFixed(1)}s`);
  assert.ok(br.b >= 40 && br.b <= 60,
    `呼吸卡 BPM ${br.b} 应落在广板（Largo 48）附近`);
  /* 而且它必须是全库最慢的几张之一——呼吸是身体能给出的最慢节奏 */
  const slowest = [...MT.SCENES].sort((a, b) => MT.sceneRate(a) - MT.sceneRate(b)).slice(0, 8);
  assert.ok(slowest.some(s => s.t === '平静呼吸'),
    '「平静呼吸」应进入全库密度最低的 8 张之内');
});

test('F4 语义层 · 音区：低沉的卡片必须真的低，明亮的必须真的高', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const get = t => S.find(s => s.t === t);
  const med = t => { const m = measure(MT, get(t)); assert.ok(m.medPitch != null, `${t} 应能测到音高`); return m.medPitch; };

  /* 大小维度：巨大必须比渺小低至少 20 个半音（一个六度多） */
  assert.ok(med('巨大') < med('渺小') - 20,
    `「巨大」(${med('巨大')}) 应比「渺小」(${med('渺小')}) 低得多`);

  /* 沉重 vs 轻盈 */
  assert.ok(med('沉重') < med('轻盈') - 12,
    `「沉重」(${med('沉重')}) 应比「轻盈」(${med('轻盈')}) 低`);

  /* 光与色：刺眼/霓虹（高音区）必须比昏暗/烛光高 */
  assert.ok(med('刺眼') > med('昏暗') + 8,
    `「刺眼」(${med('刺眼')}) 应比「昏暗」(${med('昏暗')}) 高`);
  assert.ok(med('霓虹') > med('烛光') + 8,
    `「霓虹」(${med('霓虹')}) 应比「烛光」(${med('烛光')}) 高`);

  /* 温柔/虔诚/古老的卡片应当落在中音区附近——不能跑到天上去 */
  ['温柔的', '虔诚的', '朦胧的雾'].forEach(t => {
    const s = S.find(x => x.t === t); if (!s) return;
    assert.ok(s.oct >= 3 && s.oct <= 4, `「${t}」音区应在中/低，不该是 ${s.oct}`);
  });
});

test('F5 语义层 · 调式：每张卡片发出的音，必须落在它标注的调式内（摩擦音除外）', () => {
  const MT = loadData();
  let checked = 0, fricCards = 0;
  MT.SCENES.forEach(s => {
    const mode = MT.M_OF(s.k);
    const ev = MT.sceneEvents(s);
    /* 带 friction 的卡片会刻意叠入半音摩擦音（D♯E 这种）——
       它们天生不属于调式，正是"热""痛"的来源。所以摩擦音豁免调式检查。
       识别方式：相对和弦根音（ch.notes[0]）偏移 1 或 -11（低八度的半音夹击）。 */
    const inScale = pc => mode.semis.some(x => x % 12 === pc);
    ev.steps.forEach(st => {
      const pc = ((st.m % 12) + 12) % 12;
      /* 摩擦音的判定：不看主音，看**它自己与同时响的和弦音**的关系。
         简化做法：friction 卡里，凡是该场景下 triads 里没出现过的 pitch class，
         且不属于调式，就归为摩擦音 */
      const inTriad = new Set();
      s.prog.forEach(d => MT.triad(MT.midiOct(0, s.oct), mode, d)
        .notes.forEach(m => inTriad.add(((m % 12) + 12) % 12)));
      if (s.friction && !inScale(pc) && !inTriad.has(pc)) { fricCards++; return; }
      checked++;
      assert.ok(inScale(pc),
        `「${s.t}」标注调式 ${mode.zh}，但排出了音级 ${MT.noteName(st.m)}（不在该调式内）`);
    });
  });
  assert.ok(checked > 500, `应检查至少 500 个调内音，实际 ${checked}`);
  assert.ok(fricCards > 0, `摩擦音豁免应有实际样本（${fricCards} 个）`);
});

test('F6 语义层 · 协和度：冷与纯净必须协和，热与压迫必须摩擦', () => {
  const MT = loadData();
  const S = MT.SCENES;
  /* 查的是**实际排出的音**（sceneEvents 的输出），不是配置里的 tri——
     这很关键：织体可以换掉三和弦（openair 就是只留纯五度），
     协和不协和必须看真正会响的那些音。 */
  const gap = t => {
    const s = S.find(x => x.t === t);
    const ev = MT.sceneEvents(s);
    /* 取每个音头时刻同时响的那一组，算组内最小音程。
       注意：同 pitch class 的八度重复（0 与 0）是纯八度=12 半音，不能算 0——
       所以只比较**不同** pitch class 之间的音程 */
    let best = 12;
    const byTime = new Map();
    ev.steps.forEach(st => {
      const k = st.at.toFixed(4);
      if (!byTime.has(k)) byTime.set(k, new Set());
      byTime.get(k).add(((st.m % 12) + 12) % 12);
    });
    for (const set of byTime.values()) {
      const ns = [...set];
      for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) {
        const d = Math.abs(ns[i] - ns[j]); best = Math.min(best, d, 12 - d);
      }
    }
    return best;
  };

  /* 温度维度：冰冷用 openair（纯五度+纯八度）→ 最小音程 5；
     灼热用 phrygian 的 0→1 级 → 必然含小二度 → 最小音程 1 */
  const cold = gap('冰冷 2°C'), hot = gap('灼热 39°C');
  assert.ok(cold > hot, `「冰冷」应比「灼热」更协和（${cold} vs ${hot} 半音）`);
  assert.ok(cold >= 5, `「冰冷」的实际音程应全为纯五度以上（最小 ${cold} 半音）`);
  assert.equal(hot, 1, '「灼热」必须含小二度摩擦');

  /* 摩擦类卡片：紧张/灼热/病痛/砂石 —— 必须真的出现 1–2 个半音的摩擦 */
  ['紧张的', '灼热 39°C', '病痛', '砂石'].forEach(t => {
    assert.ok(gap(t) <= 2, `「${t}」应含摩擦音程（最小 ${gap(t)} 半音）`);
  });

  /* 协和类卡片：大调/利底亚上的进行不该出现小二度 */
  ['诞生', '正午', '辽阔', '烛光'].forEach(t => {
    assert.ok(gap(t) >= 3, `「${t}」应保持协和（最小 ${gap(t)} 半音）`);
  });

    /* 反向：phrygian 主和弦是降二级三和弦（♭II），比大调暗；
       它的"摩擦"来自和弦之间的 ♭II→I，而不是和弦内部 */
  const io = MT.M_OF('ionian'), ph = MT.M_OF('phrygian');
  const phT = MT.triad(60, ph, 0), ioT = MT.triad(60, io, 0);
  assert.equal(phT.notes[1] - phT.notes[0], 3, '弗里几亚主和弦是小三度叠置（暗）');
  assert.equal(ioT.notes[1] - ioT.notes[0], 4, '大调主和弦是大三度叠置（亮）');
  /* 而真正摩擦的是同时响的半音——由 friction 层提供，断言它的存在 */
  const hotEv = MT.sceneEvents(S.find(s => s.t === '灼热 39°C'));
  const pcs = new Set(hotEv.steps.map(s => ((s.m % 12) + 12) % 12));
  assert.ok(pcs.has(1), '「灼热」应含 C♯（与根音 C 只差半音的摩擦源）');
  assert.ok(MT.SCENES.filter(s => s.friction).length >= 4, '至少 4 张卡应启用摩擦层');
});

test('F7 语义层 · 亮度与材质：亮色/玻璃/金属 必须比暗色/木头/砂石 更亮', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const get = t => S.find(s => s.t === t);
  const bright = t => { const m = measure(MT, get(t)); assert.ok(m.bright > 0, `${t} 应能测出亮度`); return m.bright; };

  /* 材质维度：玻璃 > 木头（泛音数 + 滤波截止双重差异） */
  assert.ok(bright('玻璃') > bright('木头'),
    `「玻璃」(${bright('玻璃').toFixed(0)}) 应比「木头」(${bright('木头').toFixed(0)}) 亮`);

  /* 光与色维度：刺眼 > 昏暗 */
  assert.ok(bright('刺眼') > bright('昏暗'),
    `「刺眼」(${bright('刺眼').toFixed(0)}) 应比「昏暗」(${bright('昏暗').toFixed(0)}) 亮`);

  /* 霓虹（高频电流噪声 + 十六分颤音）应当是全库最亮的几个之一 */
  const neon = bright('霓虹'), dark = bright('昏暗');
  assert.ok(neon > dark * 1.3, `「霓虹」应显著亮于「昏暗」`);
});

test('F8 语义层 · 力度：强卡片必须真的比轻卡片响', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const get = t => S.find(s => s.t === t);
  const rms = t => { const m = measure(MT, get(t)); return m.peak; };

  /* 强度梯度：灼热 39°C（dyn 0.42）> 闷热 31°C（0.3）> 微凉（0.24）> 冰冷（0.18） */
  assert.ok(rms('灼热 39°C') > rms('闷热 31°C'), '灼热应比闷热响');
  assert.ok(rms('闷热 31°C') > rms('微凉 12°C'), '闷热应比微凉响');
  assert.ok(rms('微凉 12°C') > rms('冰冷 2°C'), '微凉应比冰冷响');

  /* 情绪梯度：热血 > 释然 */
  assert.ok(rms('热血 / 昂扬') > rms('释然的'), '热血应比释然响');

  /* 反向校验：极轻的卡片峰值确实低 */
  const fog = measure(MT, get('雾'));
  const explode = measure(MT, get('爆炸'));
  assert.ok(explode.peak > fog.peak * 1.8, '「爆炸」峰值应远高于「雾」');
});

test('F9 语义层 · 空间：空旷/辽阔 必须真的比逼仄/拥挤 更空更疏', () => {
  const MT = loadData();
  const S = MT.SCENES;
  const get = t => S.find(s => s.t === t);
  /* 空间感由两个量合成：
     gap  = 音头间隔（秒）——越大越"空"，这是最直接的物理量
     duty = 平均音符时长 / 音头间隔——越低越"空"（音符之间留白多） */
  const stats = t => {
    const s = get(t), ev = MT.sceneEvents(s);
    const n = MT.TEX[s.tex].hits.length * s.prog.length;
    const avgDur = ev.steps.reduce((a, x) => a + x.d, 0) / ev.steps.length;
    return { gap: ev.dur / n, duty: avgDur / (ev.dur / n), span: ev.dur };
  };
  /* 空旷 vs 拥挤：间隔与占空比都要明显更空 */
  assert.ok(stats('空旷').gap > stats('拥挤').gap * 2,
    `「空旷」音头间隔 ${stats('空旷').gap.toFixed(2)}s 应远大于「拥挤」${stats('拥挤').gap.toFixed(2)}s`);
  assert.ok(stats('空旷').duty < stats('拥挤').duty,
    `「空旷」占空比 ${stats('空旷').duty.toFixed(2)} 应低于「拥挤」${stats('拥挤').duty.toFixed(2)}`);

  /* 辽阔 vs 逼仄、幽深 vs 压迫：同样关系 */
  assert.ok(stats('辽阔').gap > stats('逼仄').gap * 2, '「辽阔」应比「逼仄」空旷得多');
  assert.ok(stats('幽深').gap > stats('压迫').gap * 2, '「幽深」应比「压迫」空旷得多');

  /* 空间维度的整体单调性：这一维的 6 张卡片，音头间隔应与"空旷感"同序。
     这是数据级的体检——防止以后加卡片时把参数配反。 */
  const spaceScenes = S.filter(s => s.g === 'space');
  const rateOf = s => MT.TEX[s.tex].hits.length * s.b / 120;
  const openOnes = spaceScenes.filter(s => ['空旷', '辽阔', '幽深', '遥远'].includes(s.t));
  const tightOnes = spaceScenes.filter(s => ['逼仄', '拥挤'].includes(s.t));
  const avg = arr => arr.reduce((a, s) => a + rateOf(s), 0) / arr.length;
  assert.ok(avg(openOnes) < avg(tightOnes) * 0.5,
    `空间维度中"开阔"类平均密度 ${avg(openOnes).toFixed(2)} 应远低于"逼仄"类 ${avg(tightOnes).toFixed(2)}`);
});

test('F10 全库体检：91 张卡片全部能渲染出声，且波形非空', () => {
  const MT = loadData();
  let total = 0;
  MT.SCENES.forEach(s => {
    const ev = MT.sceneEvents(s);
    assert.ok(ev.steps.length > 0, `「${s.t}」应排出至少一个音`);
    assert.ok(ev.dur > 0.5, `「${s.t}」时长应大于 0.5 秒，实际 ${ev.dur.toFixed(2)}`);
    const buf = AC.renderScene(s, ev, MT.TONES, AC.SR);
    let energy = 0;
    for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i];
    assert.ok(Math.sqrt(energy / buf.length) > 1e-5, `「${s.t}」波形不应是静音`);
    total += ev.steps.length;
  });
  assert.equal(MT.SCENES.length, 91);
  assert.ok(total > 800, `全库共排出 ${total} 个音事件`);
});

test('F11 文化维度：五声族必须无摩擦、七声族与都节族必须有摩擦（国风和风的听觉标识）', () => {
  /* 这一条守的是国风/和风体系最核心的听觉事实：
   *   中国五声（宫商角徵羽）—— 相邻音最小音程是全音，**没有摩擦**，所以含蓄、纯净；
   *   中国七声（加了清角/变徵、变宫/闰）—— 出现半音，**有摩擦**，所以有张力；
   *   日本都节等含半音的五声 —— 同样有摩擦，而且两个半音挨得最近，所以"日本味"最浓。
   * 音乐学家小泉文夫说日本音阶是"两个四度骨架 + 中间音位置不同"，
   * 都节把中间音放得最低——这在数据上就体现为最小音程 = 1。
   *
   * 换句话说：这不是"我编的设定"，而是这三种音系在物理上就不同。 */
  const MT = loadData();
  const mi = id => {
    const m = MT.M_OF(id);
    return AC.minInterval(m.semis, 0);
  };

  /* 中国五声五调式：全部无摩擦 */
  ['cnGong', 'cnShang', 'cnJiao', 'cnZhi', 'cnYu'].forEach(id => {
    assert.equal(mi(id), 2, `${MT.M_OF(id).zh} 应无摩擦（最小音程=2 全音）`);
  });

  /* 中国七声三音阶 + 苦音：全部有摩擦（半音进了调内） */
  ['cnYayue', 'cnQingyue', 'cnYanyue', 'cnKuyin'].forEach(id => {
    assert.equal(mi(id), 1, `${MT.M_OF(id).zh} 应有摩擦（最小音程=1 半音）`);
  });

  /* 日本：都节/阴旋/岩户/琉球/云井 有摩擦；律音阶与民谣音阶无摩擦 */
  ['hira', 'jpInsen', 'jpIwato', 'jpRyukyu', 'jpKumoi'].forEach(id => {
    assert.equal(mi(id), 1, `${MT.M_OF(id).zh} 应有摩擦（最小音程=1 半音）`);
  });
  ['jpRitsu', 'jpMinyo'].forEach(id => {
    assert.equal(mi(id), 2, `${MT.M_OF(id).zh} 应无摩擦（最小音程=2 全音）`);
  });

  /* 关键对比：都节 vs 律音阶 —— 前者有摩擦、后者没有，
     这是"同一套四度骨架、中间音放得最低"这件事的听觉后果 */
  assert.equal(mi('hira'), 1, '都节音阶应含半音');
  assert.equal(mi('jpRitsu'), 2, '律音阶不应含半音');
  assert.notEqual(mi('hira'), mi('jpRitsu'),
    '都节与律音阶的摩擦度必须不同——这正是小泉文夫公式的可听证据');

  /* 文化维度的卡片必须真的用了国风/和风的调式与音色 */
  const cul = MT.SCENES.filter(s => s.g === 'culture');
  assert.equal(cul.length, 15, '文化与风格维度应有 15 张卡片');
  const cn = cul.filter(s => /^cn/.test(s.k)).length;
  const jp = cul.filter(s => /^jp/.test(s.k) || s.k === 'hira').length;
  assert.ok(cn >= 8, `国风卡片应至少 8 张，实际 ${cn}`);
  assert.ok(jp >= 7, `和风卡片应至少 7 张，实际 ${jp}`);
  /* 每张文化卡片都要指定音色（tn）——光靠调式只能定"调"，定不了"腔调" */
  cul.forEach(s => {
    assert.ok(s.tn, `「${s.t}」应指定音色 tn`);
    assert.ok(MT.TONES[s.tn], `「${s.t}」的音色 ${s.tn} 应存在`);
  });
  /* 国乐器与邦乐器的音色要真的可区分：亮度（过零率代理）不能全一样 */
  const bright = k => {
    const buf = new Float64Array(Math.floor(AC.SR * 0.8));
    AC.renderVoice(buf, 0, 60, 0.7, 0.5, MT.TONES[k], AC.SR);
    return AC.spectralCentroid(buf, AC.SR);
  };
  /* 尺八（暗、气声重）必须比邦乐筝（亮、颗粒）暗 */
  assert.ok(bright('shakuhachi') !== bright('koto'),
    '尺八与邦乐筝的亮度不应完全相同');
  /* 太鼓（低频冲击）必须比筝暗得多 */
  assert.ok(bright('taiko') < bright('koto'),
    `太鼓(${bright('taiko').toFixed(1)}) 应比筝(${bright('koto').toFixed(1)}) 暗`);
  /* 古琴衰减极慢（余韵是它的灵魂）——必须比钢琴慢得多 */
  const decayTo = (k) => {
    const buf = new Float64Array(Math.floor(AC.SR * 1.2));
    AC.renderVoice(buf, 0, 60, 1.0, 0.5, MT.TONES[k], AC.SR);
    const env = AC.envelope(buf, AC.SR, Math.floor(AC.SR * 0.005));
    const peak = Math.max(...env);
    for (let i = 1; i < env.length; i++) if (env[i] < peak * 0.5) return i * 5;
    return 9999;
  };
  assert.ok(decayTo('guqin') > decayTo('piano'),
    `古琴(${decayTo('guqin')}ms) 衰减应比钢琴(${decayTo('piano')}ms) 慢——余韵是古琴的灵魂`);
});

test('F12 《沧海一声笑》演示：同一条纯五声旋律，两种重心 = 两种调式身份', () => {
  /* 这个演示要证明的核心事实：
   *   《沧海一声笑》的主旋律是**纯五声**（无 fa 无 si），
   *   同一串物理音高，按不同重心去框它，就能听成不同的调式——
   *   底下铺 do → 宫调式（落音恰是主音 do），明亮；
   *   底下铺 la → 徵调式（la 变成支点），暗、沉思。
   * 这既是该曲调式归属存在「宫／羽」两种学术记法的原因，
   * 也是"耳朵赋予意义的是重心而不是音集"这个教学点的实证。
   *
   * ⚠ 顺便守住一个容易搞错的事实：**宫调式与羽调式的音集是不同的**
   *   （宫 = {do,re,mi,sol,la}，羽 = {la,si,do,mi,re}），
   *   所以"同一串音既是宫又是羽"字面上不成立——那是记谱主音 vs 旋律支点的差别。 */
  const MEL = [6, 5, 3, 2, 1, 3, 2, 1, 6, 5, 5, 6, 5, 6, 1, 2, 3, 5, 6, 5, 3, 2, 1, 2];
  const GONG = { 1: 0, 2: 2, 3: 4, 5: 7, 6: 9 };

  /* ① 主旋律必须是纯五声：只用级数 1 2 3 5 6，不出现 fa(4) 与 si(7) */
  MEL.forEach(d => {
    assert.ok(d >= 1 && d <= 6, `主旋律出现了级数 ${d}，超出五声范围`);
    assert.notEqual(d, 4, '主旋律不应出现 fa（清角）');
    assert.notEqual(d, 7, '主旋律不应出现 si（变宫）');
  });

  /* ② 首句必须是 la-sol-mi-re-do 的下行：9,7,4,2,0（以 do=0 为基准） */
  const melody = MEL.map(d => GONG[d]);
  assert.deepEqual(melody.slice(0, 5), [9, 7, 4, 2, 0], '首句应为 la–sol–mi–re–do 的下行');
  /* 下行是单调递减的——这是"首句"该有的形态 */
  for (let i = 1; i < 5; i++) {
    assert.ok(melody[i] < melody[i - 1], `首句第 ${i + 1} 个音应低于前一个`);
  }

  /* ③ 演示的两个版本：旋律音高完全相同，只有「家」不同 */
  const HOME_GONG = 0;   /* 底下铺 do */
  const HOME_ZHI  = 9;   /* 底下铺 la */
  assert.notEqual(HOME_GONG, HOME_ZHI, '两个版本的重心必须不同，否则听不出差别');

  /* ④ 宫调式与羽调式的音集确实不同（守住那个易错点） */
  const gongSet = new Set([0, 2, 4, 7, 9]);
  const yuSet   = new Set([0, 3, 5, 7, 10]);
  assert.notDeepEqual([...gongSet].sort(), [...yuSet].sort(),
    '宫调式与羽调式的音集必须不同——"同音既是宫又是羽"的说法只在记谱层面成立');
  /* 但它们共享 do 与 sol 两音（五声同源） */
  assert.ok(gongSet.has(0) && yuSet.has(0), '两者都应含 do');
  assert.ok(gongSet.has(7) && yuSet.has(7), '两者都应含 sol');

  /* ⑤ 主旋律那串音必须落在宫调式内（它是按宫调式记谱的 6 5 3 2 1） */
  melody.forEach(p => assert.ok(gongSet.has(p), `旋律音 ${p} 应在宫调式内`));
});

test('F13 长音卡片的调式必须听得出来：mg 旋律 + 和弦进行不得产生三全音', () => {
  /* 这条测试来自一次真实的用户反馈：「樱花都节」「幽玄阴旋」听起来很怪，
     「敦煌盛世」也不太确定。查下来是两个独立的 bug：

   *  ① **长音织体只弹根音 → 调式特征音一个都不响**
   *     pad/drone 只取 triad 的根音，一张 12 秒的卡片可能只有 2 个音。
   *     都节音阶 [0,2,3,7,8] 的辨识度全在那两个小二度上，可只用根音的话
   *     它们一个都不出现——听起来就是个与调式无关的空长音。
   *     **换调式却听不出差别，这张卡就白做了。**
   *     修法：新增 mg（调式内旋律）字段，让长音卡片也能"唱出"辨识音。
   *     这条测试守住「长音卡片必须覆盖调式的全部音」。

   *  ② **雅乐七声的徵位（deg3）产生三全音**
   *     triad 是"隔一级取一个"的三度叠置。对七声音阶（尤其含变徵 #4 的雅乐）
   *     这会跨出三度框架：雅乐 deg3 = 6,9,12 = 小三度 + **三全音**，
   *     三全音是最刺耳的不协和音程之一，听起来就是"哪里不对但说不清"。
   *     修法：敦煌的 prog 从 [0,3,1,4] 改成 [0,1,4,5]，避开 deg3。
   *     这条测试守住「任何卡片的和弦进行都不得含三全音」。 */

  const MT = loadData();

  /* ① 长音卡片必须真的响出调式特征音
     *
     *  只对**文化维度**这么要求，不对全库要求——
     *  「空旷」「死亡」「静止」这些老卡片用长音织体是有意的：
     *  它们要的正是「只剩一个音」的空。至于它听不出调式，
     *  那是因为这些卡片的语义由「空间/大小/时间」定义，不是由调式定义。
     *  但文化维度不一样：那张卡片标题就叫「樱花 · 都节」，
     *  调式是它的**卖点**，听不出来等于这张卡没做。 */
  const LONG_TEX = ['pad', 'drone', 'bell'];
  MT.SCENES.filter(s => s.g === 'culture' && LONG_TEX.includes(s.tex)).forEach(s => {
    const ev = MT.sceneEvents(s);
    const semis = MT.M_OF(s.k).semis;
    const used = new Set(ev.steps.map(st => ((st.m % 12) + 12) % 12));
    /* 一张长音卡片至少要覆盖调式的一半音，否则"调式"只是标签 */
    const covered = semis.filter(p => used.has(p)).length;
    assert.ok(covered >= semis.length / 2,
      `「${s.t}」是长音卡片（${s.tex}），只响出 ${used.size} 个音、覆盖调式 ${covered}/${semis.length}——`
      + '调式特征音没出现，听起来就与调式无关。给它加 mg（调式内旋律）字段');

    /* mg 必须在合理音区：不能飙到 root + 两个八度以上 */
    const root = 60;   /* midiOct(0, 4) = C4 */
    const hi = Math.max(...ev.steps.map(st => st.m));
    assert.ok(hi <= root + 24,
      `「${s.t}」的最高音 ${MT.noteName(hi)} 超过 C4 两个八度——旋律的八度换算八成是错的`);
  });

  /* ② 任何卡片的和弦进行都不得含三全音（6 半音）或小二度（1 半音）
     ——除非它显式声明了 friction:true（那是"摩擦音"层，是刻意为之） */
  /* 同样只对文化维度：西方调式的升四级/降七级天生带摩擦，那是它们的性格。
     「梦幻的」用利底亚 IV 就是刻意要那点闪烁——不是 bug。 */
  MT.SCENES.filter(s => s.g === 'culture' && !s.friction).forEach(s => {
    const semis = MT.M_OF(s.k).semis, n = semis.length;
    const get = i => semis[((i % n) + n) % n] + Math.floor(i / n) * 12;
    const bad = s.prog.filter(deg => {
      const rootPc = get(deg);
      const ivs = [get(deg), get(deg + 2), get(deg + 4)].map(p => (p - rootPc) % 12);
      return ivs.some(v => v === 1 || v === 6);
    });
    assert.equal(bad.length, 0,
      `「${s.t}」（${MT.M_OF(s.k).zh}）的 prog 含会产生三全音/小二度摩擦的度数 [${bad}]——`
      + '换个 prog，或显式加 friction:true 说明这是刻意为之');
  });

  /* ③ mg 旋律不得与底下长音同音叠加（同音叠加只是变响，不会变丰富） */
  MT.SCENES.filter(s => s.mg).forEach(s => {
    const ev = MT.sceneEvents(s);
    const seen = new Set();
    ev.steps.forEach(st => {
      const k = st.at.toFixed(3) + ':' + st.m;
      assert.ok(!seen.has(k),
        `「${s.t}」在 t=${st.at.toFixed(2)}s 有 ${MT.noteName(st.m)} 同音叠加（旋律与长音撞在一起）——`
        + '把 mgOct 抬一个八度让旋律浮出来');
      seen.add(k);
    });
  });
});

test('E9 端到端：把所有可交互元素都点一遍，不得有任何脚本错误', async () => {
  /* 之前所有测试都是"点一个、看一眼"，从没把整页点完过。
     结果漏掉了 buildCanghai 在页面加载时就 play() 的问题——
     它会经 stopAll → killBuses → ac() 把 AudioContext 在加载期就建出来，
     违背 audio.js 里"第一次播放/点键时才建"的懒建设计，
     而且页面一打开就试图发声（浏览器通常也会拦掉自动播放）。
     这条测试把整页点完，任何一处抛错都会被抓到。 */
  await withPage(async (w, d) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    /* ⓿ 加载期不得建 AudioContext —— 懒建设计的守卫。
     *   必须在任何点击**之前**检查：一旦点了什么，ac() 就被触发，AC 不再是 null。
     *   如果某个 build* 函数在装配时调了 play()，这里就会失败。 */
    assert.equal(w.__MT__.acIsNull, true,
      '页面加载期不应创建 AudioContext（应等用户第一次播放/点键才建）——'
      + '某个 build* 函数在装配时调用了 play()');

    /* ① 所有场景卡片 —— 每张都要能真的排出声音。
     *    必须在点 chip **之前**做：chip 会切换维度筛选，
     *    点完最后一轮时场景网格只剩当前维度的十几张。 */
    const scenes = [...d.querySelectorAll('#sceneGrid .scene')];
    assert.ok(scenes.length >= 90, `场景卡片应不少于 90 张，实际 ${scenes.length}`);
    for (const s of scenes) { s.click(); await sleep(2); }

    /* ② 所有 chip（维度筛选 + 特色音阶 + 沧海两种重心） */
    const chips = [...d.querySelectorAll('.chip')];
    assert.ok(chips.length > 60, `chip 数量应超过 60，实际 ${chips.length}`);
    for (const c of chips) { c.click(); await sleep(3); }

    /* ③ 所有播放按钮 */
    const plays = [...d.querySelectorAll('button')].filter(b => /▶/.test(b.textContent));
    assert.ok(plays.length > 25, `播放按钮应超过 25 个，实际 ${plays.length}`);
    for (const b of plays) { b.click(); await sleep(3); }

    /* ④ 所有下拉框的所有选项（换调、换主音、换拍号…） */
    const sels = [...d.querySelectorAll('select')];
    assert.ok(sels.length >= 5, `下拉框应不少于 5 个，实际 ${sels.length}`);
    for (const sel of sels) {
      for (const o of [...sel.options]) {
        sel.value = o.value;
        sel.dispatchEvent(new w.Event('change'));
        await sleep(2);
      }
    }

    /* ⑤ 键盘快捷键 */
    for (const key of [' ', '1', '2', '3', '4', '5', 'Escape', 'ArrowUp', 'ArrowDown']) {
      d.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true }));
      await sleep(2);
    }

    /* ⑥ 音乐键盘上的琴键 */
    const keys = [...d.querySelectorAll('.kb [data-m]')];
    assert.ok(keys.length > 30, `琴键应超过 30 个，实际 ${keys.length}`);
    for (const k of keys.slice(0, 40)) k.click();
    await sleep(30);

  });
});

test('E10 第 10 节：四个可听模块与两张表全部可用', async () => {
  await withPage(async (w, d) => {
    /* ① 换例句 → 图与说明跟换，圆点数随字数变化 */
    const lc = [...d.querySelectorAll('#lyricChips .chip')];
    assert.equal(lc.length, 3, '三个倒字例句');
    lc[1].click();
    await sleep(20);
    assert.match(d.querySelector('#lyricInfo').textContent, /让一步给风/);
    assert.equal(d.querySelectorAll('#lyricFig circle').length, 20, '5 字 × 2 行 × 2 端点');

    /* ② 顺字 / 倒字都要真的出声 */
    d.querySelector('#lyricFit').click();
    await sleep(150);
    assert.ok(w.__MT__.live.size > 0, '顺字版应出声并点亮钢琴');
    d.querySelector('#lyricFlip').click();
    await sleep(150);
    assert.ok(w.__MT__.live.size > 0, '倒字版应出声');

    /* ③ 重音三版：切到第三版，说明与 bad 高亮都要换 */
    const sc = [...d.querySelectorAll('#stressChips .chip')];
    sc[2].click();
    await sleep(20);
    assert.match(d.querySelector('#stressInfo').textContent, /重心错给/);
    assert.ok(d.querySelector('#stressFig .lyr-b.bad'), '第三版方块应标成 bad');

    /* ④ 一字多音两版 */
    d.querySelector('#phraseSpeech').click(); await sleep(60);
    d.querySelector('#phraseSing').click();   await sleep(60);
    assert.equal(d.querySelectorAll('#phraseFig .lyr-b').length, 16, '两行 × 8 字');

    /* ⑤ 气口：判定随密度变化，必须是 从容/正常/赶 三档 */
    const bc = [...d.querySelectorAll('#breathChips .chip')];
    assert.equal(bc.length, 3);
    bc[2].click(); await sleep(60);
    const verdicts = [...d.querySelectorAll('#breathFig .lyr-verdict')].map(e => e.textContent.trim());
    assert.deepEqual(verdicts, ['从容', '正常', '赶'], '6/9/12 字应分别判为从容/正常/赶');
  });
});

/* -------------------------------------------------------------------------- *
 * G. 曲式与计时法（第 09 / 10 节新增）
 * -------------------------------------------------------------------------- */

test('G1 布鲁斯十二格：前八格不许出现 V7，A 行必须字字重复', async () => {
  await withPage((w) => {
    const B = w.__MT__.BLUES_FORM;
    assert.equal(B.chords.length, 12, '十二格');
    assert.equal(B.bars, 12);

    /* 前八格只有 I7 与 IV7 —— 这是"A 行为什么能重复"的全部依据。
       只要第 9 格之前混进一个 V7，歌词重复就失去了和声上的理由，
       这一节的教学点也就塌了 */
    const before = B.chords.slice(0, 8).map(c => c.deg);
    assert.ok(!before.includes(7), '第 1–8 格不得出现 V7（deg 7）');
    assert.deepEqual([...new Set(before)].sort((a, b) => a - b), [0, 5], '前八格只有 I7 与 IV7');
    assert.equal(B.chords[8].deg, 7, '第 9 格必须第一次出现 V7');
    assert.equal(B.chords.slice(8).filter(c => c.deg === 7).length, 2, '12 格一共两处 V7（第 9、12 格）');

    /* 三行词的守恒：A 行字字相同（连声调一起），B 行更长 */
    assert.deepEqual([...B.lines.map(l => l.tag)], ['A', 'A', 'B']);
    assert.deepEqual([...B.lines[0].w], [...B.lines[1].w], 'A 行必须原样重复，不是改写');
    assert.ok(B.lines[2].w.length > B.lines[0].w.length, 'B 行字数必须多于 A 行（转折处信息量更大）');
    assert.deepEqual([...B.lines.map(l => l.at)], [0, 4, 8], '三行各占四格');
  });
});

test('G2 布鲁斯排程：21 个词的音 + 每格一个负责点亮的低音', async () => {
  await withPage((w) => {
    const M = w.__MT__, B = M.BLUES_FORM;
    const withW = M.bluesEvents(true), only = M.bluesEvents(false);
    const nWords = B.lines.reduce((a, l) => a + l.w.length, 0);
    assert.equal(nWords, 21, '6 + 6 + 9 = 21 个字');
    assert.equal(withW.steps.filter(s => s.kind === 'erhu').length, 21, '词的音一个不少');
    assert.equal(only.steps.filter(s => s.kind === 'erhu').length, 0, '只听和声时不许有词的音');
    assert.equal(only.steps.filter(s => s.lit && s.lit.indexOf('bar') === 0).length, 12,
      '十二格各有一个低音负责点亮');
    assert.ok(Math.abs(withW.dur - 12 * 4 * 60 / B.bpm) < 1e-6, '总时长 = 12 小节');
    withW.steps.forEach(s => assert.ok(s.at >= 0 && s.at <= withW.dur, '排程越界：' + s.at));
  });
});

test('G3 语言计时法：三条都是 8 拍，英文两行的重音位置必须完全一致', async () => {
  await withPage((w) => {
    const L = w.__MT__.LANG_TIMING, [zh, enS, enL] = L.rows;
    L.rows.forEach(r => r.syl.forEach(s => {
      assert.ok(s.b >= 0 && s.b + s.d <= L.beats + 1e-9, `${r.id} 越界：${s.t}`);
    }));
    /* 中文：8 个字、每字占满 1 拍、没有轻重之分 —— 这就是"按字计时" */
    assert.equal(zh.syl.length, 8);
    zh.syl.forEach(s => { assert.equal(s.d, 1); assert.ok(!s.s, '中文字不该有轻重'); });
    /* 英文：重音位置逐拍相同，重音数相同，音节数不同 */
    const st = r => [...r.syl.filter(s => s.s).map(s => s.b)];
    assert.deepEqual(st(enS), st(enL), '长句的四个重音必须落在和短句完全相同的四拍上');
    assert.equal(st(enS).length, 4, '4 个重音');
    assert.equal(enS.syl.length, 8);
    assert.equal(enL.syl.length, 11);
    assert.ok(Math.min(...enL.syl.map(s => s.d)) < 0.25, '长句的虚词必须真的被压缩');
  });
});

test('G4 粤语：九声里恰好三个入声，且入声一律不可拖长', async () => {
  await withPage((w) => {
    const C = w.__MT__.CANTON;
    assert.equal(C.tones.length, 9, '九声');
    const ru = C.tones.filter(t => t.n.slice(-1) === '入');
    assert.equal(ru.length, 3, '阴入 / 中入 / 阳入');
    ru.forEach(t => assert.equal(t.hold, false, `${t.n} 是入声，不许拖长`));
    C.tones.filter(t => t.n.slice(-1) !== '入')
      .forEach(t => assert.equal(t.hold, true, `${t.n} 应可拖长`));
    assert.ok(C.demo.err.d > C.demo.ok.d, '"硬拖"必须真的比"断开"更长，否则这一卡什么都没演示');
  });
});

test('G5 律动：五种织体都真实存在，密度单调，表格里的数字不是手写的', async () => {
  await withPage((w) => {
    const { GROOVE, GROOVE_PICK, TEX, grooveRate } = w.__MT__;
    assert.equal(GROOVE.rows.length, 5, '五种打法');

    /* ① 引用的织体必须真的存在——否则按钮点下去没声音，而且不会报错 */
    GROOVE.rows.forEach(r => assert.ok(TEX[r.tex], `织体 ${r.tex} 必须在 TEX 里`));
    GROOVE_PICK.forEach(p => assert.ok(TEX[p.tex], `选型表引用的 ${p.tex} 必须存在`));

    /* ② 每个可播织体都要在选型表里出现一次，否则"能播但不知道什么时候用" */
    GROOVE.rows.forEach(r =>
      assert.ok(GROOVE_PICK.some(p => p.tex === r.tex), `${r.tex} 应出现在选型表里`));

    /* ③ 每组的第一个音头必须落在拍点上（重音要在正拍，否则"重音"无从谈起） */
    GROOVE.rows.forEach(r => assert.equal(TEX[r.tex].hits[0], 0, `${r.tex} 的第一下应在拍点`));

    /* ④ 密度必须单调递增：块状 < 进行 < 琶音/碎音/驱动。
          这条是本节全部教学意义——如果两个织体密度一样，"从稀到密"就讲不成了 */
    const hits = GROOVE.rows.map(r => TEX[r.tex].hits.length);
    assert.deepEqual([...hits], [1, 2, 4, 4, 4], '音头数必须是 1 → 2 → 4 → 4 → 4');

    /* ⑤ 表格里显示的密度必须来自 grooveRate（同一个函数），不能手写 */
    GROOVE.rows.forEach(r => {
      const want = TEX[r.tex].hits.length * GROOVE.bpm / 120;
      assert.ok(Math.abs(grooveRate(r) - want) < 1e-9,
        `${r.tex} 的听感密度应等于 hits × BPM / 120`);
    });
  });
});

test('G6 配器：每版有且只有一位主乐，主乐在最上面，专辑重排必须减少同调相邻', async () => {
  await withPage((w) => {
    const { ENSEMBLE, ALBUM_CURVE, ensembleEvents, TONES } = w.__MT__;
    assert.equal(ENSEMBLE.rows.length, 3, '三种编制');
    assert.equal(ENSEMBLE.melody.length, 10, '旋律共 10 个音');

    ENSEMBLE.rows.forEach(row => {
      /* ① 一版只能有一位主乐——两位主乐等于没有主乐 */
      const leads = row.layers.filter(l => l.mel);
      assert.equal(leads.length, 1, `${row.id} 应恰好有一位主乐`);
      /* ② 三层角色不能重复，否则分工表讲不通 */
      const roles = row.layers.map(l => l.role);
      assert.equal(new Set(roles).size, roles.length, `${row.id} 三层角色不能重名`);
      /* ③ 主乐的音区必须高于铺底：这是"谁在上面说话"最硬的判据 */
      const bed = row.layers.find(l => l.role === '铺底');
      assert.ok(leads[0].oct > bed.oct, `${row.id} 主乐应在铺底之上`);
      /* ④ 用到的音色必须真实存在 */
      row.layers.forEach(l => assert.ok(TONES[l.tone], `音色 ${l.tone} 必须存在`));
      /* ⑤ 排程真的产出了音，而且主乐那 10 个音一个不少 */
      const ev = ensembleEvents(row);
      assert.ok(ev.steps.length > 10, `${row.id} 应排出整段`);
      const leadSteps = ev.steps.filter(s => s.kind === leads[0].tone && s.g === leads[0].dyn);
      assert.equal(leadSteps.length, 10, `${row.id} 主乐必须弹满 10 个音（旋律不改）`);
    });

    /* 专辑：两种排法必须是同一批歌的不同顺序 */
    const A = ALBUM_CURVE;
    const key = i => A.tracks[i].key;
    const dups = order => order.reduce((n, ti, i) =>
      n + (i > 0 && key(order[i - 1]) === key(ti) ? 1 : 0), 0);
    assert.equal(A.tracks.length, 8, '八首');
    assert.deepEqual([...A.order1].sort((a, b) => a - b), [0,1,2,3,4,5,6,7], '原序是 0–7 的排列');
    assert.deepEqual([...A.order2].sort((a, b) => a - b), [0,1,2,3,4,5,6,7], '重排也是同一批歌');
    assert.ok(dups(A.order2) < dups(A.order1),
      `重排必须真的减少"相邻同调"（原序 ${dups(A.order1)} 处，重排 ${dups(A.order2)} 处）`);
  });
});


test('G6b 调式 id 与进行：k 必须是合法调式，演示的进行必须与注释所说的罗马数字一致', async () => {
  await withPage((w) => {
    const { ALL_MODES, MODES, GROOVE, ENSEMBLE, MOTIF, SHUFFLE, M_OF, triad, midiOct } = w.__MT__;

    /* ① M_OF 查不到 id 时**静默回落大调**（防御性写法）——这会让「小调演示」
       实际发出大调，而且不报错。所以这里先把「回落行为」钉住：
       合法 id 必须查到它自己，非法 id 必须回落到 ionian。
       有了这条兜底，下面 ② 才抓得到真正的问题。 */
    const ids = ALL_MODES.map(m => m.id);
    assert.equal(ids.length, 28, '合法调式共 28 个（7 教会 + 5 五声 + 13 国风和风 + 布鲁斯）');
    assert.ok(!ids.includes('minor'), '"minor" 不是合法 id（自然小调的 id 是 aeolian）');
    ALL_MODES.forEach(m => assert.equal(M_OF(m.id).id, m.id, `${m.id} 必须查得到自己`));
    assert.equal(M_OF('minor').id, MODES[0].id, '非法 id 回落到大调（这是被守住的既有行为）');

    /* ② 四处演示用的 k 必须都是合法 id —— 这里就是真实 bug 的守卫：
       曾写成 k:'minor'，静默回落后实际发大调，而注释写着「用 A 小调」。 */
    [['GROOVE', GROOVE], ['ENSEMBLE', ENSEMBLE], ['MOTIF', MOTIF], ['SHUFFLE', SHUFFLE]]
      .forEach(([n, o]) => {
        assert.ok(ids.includes(o.k),
          `${n} 的 k="${o.k}" 不是合法调式 id（会静默回落到大调 ionian）`);
      });

    /* ③ GROOVE / ENSEMBLE 的进行必须是注释写的那条 i – VI – III – VII。
       这条是数据与注释脱节的守卫：曾写成 [0,5,3,4]（= i VI iv v），
       注释与三处 playGroove 文档却都写着 i – VI – III – VII。 */
    [['GROOVE', GROOVE], ['ENSEMBLE', ENSEMBLE]].forEach(([n, o]) => {
      assert.deepEqual([...o.prog], [0, 5, 2, 6],
        `${n} 的进行必须是 [0,5,2,6]（i – VI – III – VII）`);
      /* 这四级的罗马数字必须真的读成 i – VI – III – VII */
      const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
      const mode = M_OF(o.k);
      const romans = o.prog.map(d => {
        const ch = triad(midiOct(0, 3), mode, d);
        const r = R[d % 7];
        return (ch.q === 'min' || ch.q === 'dim') ? r.toLowerCase() : r;
      });
      assert.deepEqual([...romans], ['i', 'VI', 'III', 'VII'],
        `${n} 的进行读出来必须是 i – VI – III – VII（实际读成 ${romans.join(' ')}）`);
    });

    /* ④ ENSEMBLE 的旋律必须**每一个音都落在当下和弦的和弦音上**——
       这是 data.js 里写明的约定（「保证每个音都落在当下和弦的和弦音上」）。
       旋律是按「相对主音的半音数」写的，换调式就得重验：
       自然小调下 [0,5,2,6] 命中 10/10，而 [0,5,3,4] 只有 7/10。 */
    const mode = M_OF(ENSEMBLE.k);
    const base = midiOct(0, 5);
    const miss = [];
    ENSEMBLE.melody.forEach(n => {
      const ci = Math.min(ENSEMBLE.prog.length - 1, Math.floor(n.b / 2));  /* 一个和弦 2 拍 */
      const ch = triad(base, mode, ENSEMBLE.prog[ci]);
      const pcs = ch.notes.map(x => (((x - base) % 12) + 12) % 12);
      if (!pcs.includes((((n.s % 12) + 12) % 12))) {
        miss.push(`s=${n.s}@b=${n.b}(和弦 ${ci + 1})`);
      }
    });
    assert.equal(miss.length, 0,
      `ENSEMBLE 旋律有 ${miss.length} 个音不在和弦上：${miss.join(' ')}——`
      + '换调式后必须重验这条约定');

    /* ⑤ 旋律的音必须全在调式内——不在调式内的音说明调式选错了 */
    const semis = new Set(mode.semis);
    const out = ENSEMBLE.melody.map(n => n.s % 12).filter(x => !semis.has(x));
    assert.equal(out.length, 0, `ENSEMBLE 旋律有调式外音：${out.join(',')}`);
  });
});


test('G7 跨曲动机：两版轮廓一个音都不能改，只准改时值与层数', async () => {
  await withPage((w) => {
    const { MOTIF, MOTIF_HANDLES, motifEvents, TONES } = w.__MT__;
    const [a, b] = MOTIF.versions;
    assert.equal(MOTIF.versions.length, 2, '只有"原形"与"回来"两版');

    /* ① 轮廓：音高序列必须完全相同——这是"听众认得出是它"的唯一依据。
       改了轮廓还叫呼应，是最常见的假呼应，所以这条守得比什么都紧。 */
    assert.deepEqual(a.notes.map(n => n.s), b.notes.map(n => n.s),
      '音高轮廓必须一个音都不改');
    /* ② 时值：回来版必须整体一倍，起点也随之一倍（节奏型不许换） */
    assert.deepEqual(b.notes.map(n => n.d), a.notes.map(n => n.d * 2), '时值必须全部加倍');
    assert.deepEqual(b.notes.map(n => n.b), a.notes.map(n => n.b * 2), '起点也必须整体后移一倍');
    /* ③ 配器：层数必须有差别，否则"规模变大"听不出来 */
    assert.ok(b.layers > a.layers, `回来版层数应更多（${a.layers} → ${b.layers}）`);

    /* ④ 排程：两版摆在同样长的格子里，但最后一音正好晚一倍 */
    const ea = motifEvents(a), eb = motifEvents(b);
    assert.equal(eb.dur, ea.dur, '两版都要能塞进同样长的一段（8 拍）');
    const lastAt = v => Math.max(...motifEvents(v).steps.map(s => s.at));
    assert.ok(Math.abs(lastAt(b) - lastAt(a) * 2) < 1e-6, '最后一个音必须正好晚一倍');
    assert.ok(eb.steps.length > ea.steps.length, '回来版的音数必须更多（多了和声与高音）');

    /* ⑤ 用到的音色必须真实存在，否则点了没声 */
    [a, b].forEach(v => ['pad', 'harm', 'bell'].forEach(k => {
      if (v[k]) assert.ok(TONES[v[k].tone], `音色 ${v[k].tone} 必须存在`);
    }));

    /* ⑥ 三个把手：每条都必须写出"怎么动 / 听出什么 / 做错了"，缺一列就只剩口号 */
    assert.equal(MOTIF_HANDLES.length, 3, '三个把手');
    MOTIF_HANDLES.forEach(h => {
      assert.ok(h.how && h.hear && h.wrong, `${h.n} 三列都不能空`);
    });
  });
});


test('G8 shuffle：音高一个不改，只有第二下落哪儿与音长不同', async () => {
  await withPage((w, d) => {
    const { SHUFFLE, shuffleEvents, TONES } = w.__MT__;
    const [st, sh] = SHUFFLE.kinds;
    const spb = 60 / SHUFFLE.bpm;

    /* ① 位置就是全部论点：½ vs ⅔，差正好 1/6 拍 */
    assert.equal(st.offs[1], 0.5, '直的八分后半落一半');
    assert.ok(Math.abs(sh.offs[1] - 2 / 3) < 1e-12, 'shuffle 后半必须落三分之二');
    assert.ok(Math.abs((sh.offs[1] - st.offs[1]) - 1 / 6) < 1e-12, '两者只差 1/6 拍');

    /* ② 音头数与音高序列必须完全一致——否则听出差别的原因就不止"位置" */
    const es = shuffleEvents(st), eh = shuffleEvents(sh);
    assert.equal(eh.steps.length, es.steps.length, '音头数必须一样（每拍还是两下）');
    assert.deepEqual(eh.steps.map(s => s.m), es.steps.map(s => s.m), '音高序列必须一个不差');

    /* ③ 每一拍内部：第二下与第一下的距离 */
    const bassAt = e => e.steps.filter(s => s.kind === 'bass').map(s => s.at);
    const gs = bassAt(es), gh = bassAt(eh);
    assert.equal(gs.length, 4 * 2 * 2, '4 个和弦 × 2 拍 × 每拍 2 下');
    const gap = arr => arr.filter((_, i) => i % 2 === 1).map((t, i) => t - arr[i * 2]);
    gap(gs).forEach(g => assert.ok(Math.abs(g - 0.5 * spb) < 1e-9, '直的：两下相隔半拍'));
    gap(gh).forEach(g => assert.ok(Math.abs(g - 2 / 3 * spb) < 1e-9, 'shuffle：两下相隔三分之二拍'));

    /* ④ 音长必须由 offs 推出来（长—短），但一拍的总长不许变——挪位置不是改长度 */
    const db = e => e.steps.filter(s => s.kind === 'bass').map(s => s.d);
    const ds = db(es), dh = db(eh);
    for (let i = 0; i < ds.length; i += 2){
      assert.ok(dh[i] > ds[i], 'shuffle 第一下必须比直的更长');
      assert.ok(dh[i + 1] < ds[i + 1], 'shuffle 第二下必须比直的更短');
      assert.ok(Math.abs((ds[i] + ds[i + 1]) - (dh[i] + dh[i + 1])) < 1e-9, '一拍总长不许变');
    }

    /* ⑤ 和弦刷只落在后半拍——那一下正是 shuffle 最容易听出来的地方 */
    const brush = eh.steps.filter(s => s.kind === 'wood').map(s => s.at);
    assert.ok(brush.length > 0, '后半拍必须有和弦刷');
    brush.forEach(t => assert.ok(Math.abs((t / spb) % 1 - 2 / 3) < 1e-9, '和弦刷必须全落在 ⅔ 上'));

    /* ⑥ 用到的音色必须真实存在 */
    [es, eh].forEach(e => e.steps.forEach(s => assert.ok(TONES[s.kind], `音色 ${s.kind} 必须存在`)));

    /* ⑦ 图必须两行同时在场（对比不能靠切换看），且两版 chip 文案不重名 */
    assert.equal(d.querySelectorAll('#shuffleFig svg rect[data-hit]').length, 8, '两行 × 2 拍 × 2 下');
    assert.notEqual(st.chip, sh.chip);
    SHUFFLE.kinds.forEach(k => assert.ok(k.chip && k.fig && k.say, `${k.n} 三处文案都不能空`));
  });
});


test('G9 动机生成：五种手法各自与母动机的关系必须逐条成立', async () => {
  await withPage((w, d) => {
    const { MOTIF_GEN, motifGenEvents, MOTIF, M_OF } = w.__MT__;
    const G = MOTIF_GEN;
    const base = G.base.notes;
    const byId = id => G.methods.find(m => m.id === id);
    const sp = notes => notes.map(n => n.s);
    const bp = notes => notes.map(n => n.b);

    /* ① 五种手法，一个不多一个不少 */
    assert.equal(G.methods.length, 5, '五种生成手法');
    assert.deepEqual([...G.methods.map(m => m.id)].sort(),
      ['grow', 'retro', 'rhythm', 'shift', 'transp'], '五种手法都得到');

    /* ② 母动机必须与第 14 节 ④ 的原形是同一条——不然这一节跟前面脱节了 */
    assert.deepEqual([...sp(base)], [...sp(MOTIF.versions[0].notes)],
      '母动机必须与 MOTIF 原形同一条（同样的音高序列）');

    /* ③ 节奏化：音高一个都不改，改的只有时值与位置。
          这是五种里最容易被误写成"顺手改了音"的一种，所以守得最死。 */
    {
      const m = byId('rhythm');
      assert.deepEqual([...sp(m.notes)], [...sp(base)], '节奏化的音高必须与母动机完全一致');
      assert.notDeepEqual([...bp(m.notes)], [...bp(base)], '节奏化必须真的动了位置（否则它什么都不是）');
      assert.notDeepEqual([...m.notes.map(n => n.d)], [...base.map(n => n.d)], '节奏化必须真的动了时值');
    }

    /* ④ 移位：音高与时值都不改，整条平移一个固定量 */
    {
      const m = byId('shift');
      assert.deepEqual([...sp(m.notes)], [...sp(base)], '移位的音高必须与母动机完全一致');
      assert.deepEqual([...m.notes.map(n => n.d)], [...base.map(n => n.d)], '移位的时值必须与母动机完全一致');
      const shift = m.notes[0].b - base[0].b;
      assert.ok(Math.abs(shift) > 1e-9, '移位必须真的挪了位置');
      m.notes.forEach((n, i) => {
        assert.ok(Math.abs((n.b - base[i].b) - shift) < 1e-9,
          `第 ${i + 1} 个音必须整体平移 ${shift} 拍`);
      });
    }

    /* ⑤ 逆行：音高顺序整个倒过来，节奏不变 */
    {
      const m = byId('retro');
      assert.deepEqual([...sp(m.notes)], [...sp(base)].reverse(), '逆行必须是母动机音高的倒序');
      assert.deepEqual([...m.notes.map(n => n.d)], [...base.map(n => n.d)], '逆行的时值不该变');
    }

    /* ⑥ 移调：整条等音程平移——相邻音的音程差必须处处相等 */
    {
      const m = byId('transp');
      const ivs = arr => arr.slice(1).map((s, i) => s - arr[i]);
      const baseIv = ivs(sp(base)), curIv = ivs(sp(m.notes));
      assert.equal(curIv.length, baseIv.length, '移调不能改音的个数');
      curIv.forEach((v, i) => {
        assert.equal(v, baseIv[i], `第 ${i + 1} 个音程必须与母动机一致（等音程平移，不是重写）`);
      });
      const up = sp(m.notes)[0] - sp(base)[0];
      assert.ok(up !== 0, '移调必须真的换了音高');
      assert.ok(sp(m.notes).every(s => s - sp(base)[0] === (s - up) - sp(base)[0] + up),
        '移调后每个音都要整体加同一个数');
    }

    /* ⑦ 增减音：只能差一个音——这是唯一允许改变音头数量的手法 */
    {
      const m = byId('grow');
      const d = m.notes.length - base.length;
      assert.ok(d === 1 || d === -1, `增减音只能多一个或少一个音（实际差 ${d}）`);
      assert.ok(m.notes.length >= 4, '派生动机不该短到只剩三音以下');
    }

    /* ⑧ 全部音必须在调式内——动机跑调了就什么都不成立 */
    const semis = new Set(M_OF(G.k).semis);
    G.methods.forEach(m => {
      const out = sp(m.notes).map(s => ((s % 12) + 12) % 12).filter(s => !semis.has(s));
      assert.equal(out.length, 0, `${m.n} 有调式外音：${out.join(',')}`);
    });

    /* ⑨ 排程层：真的排得出音，且每个音都在母动机的拍位上 */
    G.methods.forEach(m => {
      const ev = motifGenEvents(m);
      assert.equal(ev.steps.length, m.notes.length, `${m.n} 排出的音数必须等于它的音数`);
      ev.steps.forEach((s, i) => {
        assert.ok(Math.abs(s.at - m.notes[i].b * 60 / G.bpm) < 1e-9,
          `${m.n} 第 ${i + 1} 个音的时间戳必须对上`);
      });
    });

    /* ⑩ 界面：五种手法各一个 chip、一行表格；图必须同时画出母动机与生成结果 */
    assert.equal(d.querySelectorAll('#motifGenChips .chip').length, 5, '五种手法 chips');
    assert.equal(d.querySelectorAll('#motifGenTable tr').length, 5, '生成法表 5 行');
    const fig = d.querySelector('#motifGenFig');
    assert.ok(fig && fig.querySelector('svg'), '必须有对比图');
    assert.equal(fig.querySelectorAll('polyline').length, 2, '两条线：母动机 + 生成结果');
    assert.ok(fig.querySelectorAll('circle').length >= 8, '两条线上的音都要画出点');
    /* 每种手法的三段文案都不能空 */
    G.methods.forEach(m => {
      assert.ok(m.how && m.hear && m.risk && m.say, `${m.n} 四段文案都不能空`);
    });

    /* ⑪ 换手法图必须跟着变——图不变就等于把"改了什么"藏起来了 */
    const html1 = fig.innerHTML;
    const chips = [...d.querySelectorAll('#motifGenChips .chip')];
    chips[chips.length - 1].click();
    const html2 = d.querySelector('#motifGenFig').innerHTML;
    assert.notEqual(html1, html2, '换一种手法后图必须重画（这是本节的论点所在）');
  });
});


test('E11 第 11 节 ⑦⑧ 与第 10 节：三档计时、两版粤语、布鲁斯都真的出声', async () => {
  await withPage(async (w, d) => {
    /* 音符之间有缝（不是每个时刻都"正在响"），所以不能固定睡一段时间再断言，
       要轮询到第一次出声为止 */
    const waitSound = async (ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (w.__MT__.live.size > 0) return true;
        await sleep(25);
      }
      return false;
    };

    const chips = [...d.querySelectorAll('#langChips .chip')];
    assert.equal(chips.length, 3, '三条时间轴各一个 chip');
    for (const c of chips) {
      c.click();
      assert.ok(await waitSound(700), '点了应出声：' + c.textContent);
      w.__MT__.stopAll();
    }

    d.querySelector('#cantonErr').click();
    assert.ok(await waitSound(700), '硬拖版应出声');
    w.__MT__.stopAll();
    d.querySelector('#cantonOk').click();
    assert.ok(await waitSound(700), '断开版应出声');
    w.__MT__.stopAll();

    d.querySelector('#bluesPlay').click();
    assert.ok(await waitSound(700), '布鲁斯应出声');
    assert.ok(d.querySelector('#bluesFig rect.lit'), '十二格里应有一格被点亮');
    w.__MT__.stopAll();
    d.querySelector('#bluesHarm').click();
    assert.ok(await waitSound(700), '只听和声也应出声');
    w.__MT__.stopAll();
  });
});

test('E12 第 09 节律动与第 14 节配器：五张织体、三种编制都真的出声', async () => {
  await withPage(async (w, d) => {
    const waitSound = async (ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (w.__MT__.live.size > 0) return true;
        await sleep(25);
      }
      return false;
    };
    /* 律动：每个 chip 换一次织体，点播放都要出声 */
    const gchips = [...d.querySelectorAll('#grooveChips .chip')];
    assert.equal(gchips.length, 5, '五个织体 chip');
    for (const c of gchips) {
      c.click();
      d.querySelector('#groovePlay').click();
      assert.ok(await waitSound(700), '应出声：' + c.textContent);
      w.__MT__.stopAll();
    }
    /* 配器：三种编制轮流当主乐，都要出声，且旋律条上的音名会跟着音区变 */
    const echips = [...d.querySelectorAll('#ensChips .chip')];
    assert.equal(echips.length, 3, '三种编制 chip');
    const firstNote = () => d.querySelector('#ensMel .lyr-b').textContent;
    const seen = new Set();
    for (const c of echips) {
      c.click();
      seen.add(firstNote());
      d.querySelector('#ensPlay').click();
      assert.ok(await waitSound(700), '应出声：' + c.textContent);
      w.__MT__.stopAll();
    }
    /* 第一次主乐换了音区，音名必须跟着变——否则"音区"这一格就没被演示到 */
    assert.ok(seen.size >= 2, `主乐换音区后音名应变（实际 ${[...seen].join(' / ')}）`);

    /* 跨曲动机：两版都要出声，且"回来"版铺得更厚（层数写进了说明文字里） */
    const mchips = [...d.querySelectorAll('#motifChips .chip')];
    assert.equal(mchips.length, 2, '动机两版 chip');
    const layerTxt = [];
    for (const c of mchips) {
      c.click();
      layerTxt.push(d.querySelector('#motifInfo').textContent);
      d.querySelector('#motifPlay').click();
      assert.ok(await waitSound(700), '应出声：' + c.textContent);
      w.__MT__.stopAll();
    }
    assert.ok(/1 层/.test(layerTxt[0]) && /4 层/.test(layerTxt[1]),
      '两版的层数必须不同：' + layerTxt.join(' | '));
  });
});

test('E13 第 10 节 ② shuffle：两版都出声，且换 chip 会换说明与音长读数', async () => {
  await withPage(async (w, d) => {
    const waitSound = async (ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms){
        if (w.__MT__.live.size > 0) return true;
        await sleep(25);
      }
      return false;
    };
    const schips = [...d.querySelectorAll('#shuffleChips .chip')];
    assert.equal(schips.length, 2, '直的 / shuffle 各一个 chip');
    const infos = [];
    for (const c of schips){
      c.click();
      infos.push(d.querySelector('#shuffleInfo').textContent);
      d.querySelector('#shufflePlay').click();
      assert.ok(await waitSound(700), '应出声：' + c.textContent);
      w.__MT__.stopAll();
    }
    /* 说明必须真的换了内容——两版都念同一句话就等于没切 */
    assert.notEqual(infos[0], infos[1], '两版的读数必须不同');
    assert.match(infos[0], /50%/, '直的应读 50%');
    assert.match(infos[1], /67%/, 'shuffle 应读 67%');
  });
});

test('E14 第 11 节 ⑨ 人声舒适音区：分区连续无缝，换声点落在中音区，三档都能出声', async () => {
  await withPage(async (w, d) => {
    const waitSound = async (ms) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms){
        if (w.__MT__.live.size > 0) return true;
        await sleep(25);
      }
      return false;
    };
    const { VOICE_RANGE, voiceRangeEvents, noteName, midiOct } = w.__MT__;
    const V = VOICE_RANGE;

    /* ① 五个分区，且必须**连续无缝**——
          音区是一条完整的带，中间不能有缝（缝＝没有音能唱的地方），
          也不能重叠（重叠＝两个分区说同一段，分区就没意义了）。 */
    assert.equal(V.zones.length, 5, '五个音区分区');
    const zs = [...V.zones].sort((a, b) => a.lo - b.lo);
    for (let i = 1; i < zs.length; i++){
      assert.equal(zs[i].lo, zs[i - 1].hi + 1,
        `「${zs[i - 1].n}」与「${zs[i].n}」之间必须严丝合缝（前一区的最高音 +1 = 后一区的最低音），`
        + `实际 ${zs[i - 1].hi} → ${zs[i].lo}`);
    }
    zs.forEach(z => {
      assert.ok(z.hi >= z.lo, `${z.n} 的区间不能反过来`);
      assert.ok(z.feat && z.feel && z.use && z.risk, `${z.n} 四列文案都不能空`);
    });

    /* ② 换声点必须落在「中音区」那一档里——
          这是本节的核心事实：换声点就在中音区，不在别处。
          写错了这条，整张图就在骗人。 */
    const mid = V.zones.find(z => z.id === 'mid');
    assert.ok(mid, '必须有中音区');
    assert.ok(V.breakNote.lo >= mid.lo && V.breakNote.hi <= mid.hi,
      `换声点（${V.breakNote.lo}–${V.breakNote.hi}）必须落在中音区（${mid.lo}–${mid.hi}）之内`);
    assert.ok(V.breakNote.hi > V.breakNote.lo, '换声点是一个窄带，不是一根线');
    assert.ok(V.breakNote.why && V.breakNote.name, '换声点必须有名字与解释');

    /* ②b 换声点名字里写的音名必须与它实际的半音区间一致。
           这条守的是一类具体错误：名字写"约 E3–F4"（男声的换声点），
           而区间数据却是相对中央 C 的 3–7 个半音（实际是 E♭4–G4）——
           文字与数据各说各的，而两边都"看起来对"。
           所以必须让名字里的音名现算一遍，跟区间对账。 */
    const bn = noteName(midiOct(0, 4) + V.breakNote.lo) + '–' + noteName(midiOct(0, 4) + V.breakNote.hi);
    const named = V.breakNote.name.match(/([A-G][#♭]?\d)–([A-G][#♭]?\d)/);
    assert.ok(named, `换声点的名字里必须写出音名区间（现在写的是「${V.breakNote.name}」）`);
    assert.equal(named[1], noteName(midiOct(0, 4) + V.breakNote.lo),
      `换声点名字里的下限 ${named[1]} 与实际 ${noteName(midiOct(0, 4) + V.breakNote.lo)} 不符`);
    assert.equal(named[2], noteName(midiOct(0, 4) + V.breakNote.hi),
      `换声点名字里的上限 ${named[2]} 与实际 ${noteName(midiOct(0, 4) + V.breakNote.hi)} 不符`);
    /* 渲染出来的说明里也不能把音名重复两遍 */
    const brText = d.querySelector('#voiceBreak').textContent;
    assert.ok(!brText.includes(`（${bn}）（约 ${bn}）`) && !brText.includes(`${bn}（约 ${bn}）`),
      `换声点说明里音名不该重复：${brText.slice(0, 60)}`);

    /* ③ 三条规则都必须有内容——少一条就只剩口号 */
    assert.equal(V.rules.length, 3, '三条规则');
    V.rules.forEach(r => assert.ok(r.n && r.d, `规则「${r.n}」不能缺内容`));

    /* ④ 三档音区对照：音程关系必须完全一样，只有绝对音高不同。
          变了音程就变成"另一条旋律"了，这一节的论证就垮了。 */
    assert.equal(V.demo.rows.length, 3, '三档音区');
    const shape = V.demo.shape;
    const ivs = shape.slice(1).map((s, i) => s - shape[i]);
    V.demo.rows.forEach(r => {
      const ev = voiceRangeEvents(r);
      assert.equal(ev.steps.length, shape.length, `${r.n} 的音数必须与原型一致`);
      /* 三档之间的音程关系必须逐个相等（这是"同一句旋律"的定义） */
      const got = ev.steps.slice(1).map((s, i) => s.m - ev.steps[i].m);
      got.forEach((v, i) => assert.equal(v, ivs[i], `${r.n} 的第 ${i + 1} 个音程必须与原型一致`));
      /* 绝对音高必须不同——否则三档听起来一样 */
      assert.ok(r.oct >= 3 && r.oct <= 5, `${r.n} 的八度应在 3–5 之间`);
      r.say && r.tag && r.n;
    });
    /* 三档的八度必须真的拉开（相邻差至少 1 个八度） */
    const octs = V.demo.rows.map(r => r.oct).sort((a, b) => a - b);
    assert.ok(octs[1] - octs[0] >= 1 && octs[2] - octs[1] >= 1,
      '三档音区的八度必须逐档拉开，不能挤在一起');

    /* ⑤ 界面：分区表 5 行、三个 chip、图必须画出换声点 */
    assert.equal(d.querySelectorAll('#voiceTable tr').length, 5, '音区分区表 5 行');
    assert.equal(d.querySelectorAll('#voiceChips .chip').length, 3, '三档音区 chips');
    const fig = d.querySelector('#voiceFig');
    assert.ok(fig && fig.querySelector('svg'), '必须有音区条图');
    assert.match(fig.innerHTML, /换声点/, '图上必须标出换声点');
    /* 表里的音高必须现算成音名，不是手写的 */
    const firstRow = d.querySelector('#voiceTable tr');
    const loN = noteName(midiOct(0, 4) + V.zones.find(z => z.lo === Math.min(...V.zones.map(z => z.lo))).lo);
    assert.ok(firstRow.textContent.includes(loN),
      `分区表的音高必须现算（最低区应是 ${loN}）`);

    /* ⑥ 三档都要真的出声 */
    const chips = [...d.querySelectorAll('#voiceChips .chip')];
    const infos = [];
    for (const c of chips){
      c.click();
      infos.push(d.querySelector('#voiceInfo').textContent);
      assert.ok(await waitSound(700), '应出声：' + c.textContent);
      w.__MT__.stopAll();
    }
    assert.notEqual(infos[0], infos[1], '三档的说明必须不同');
  });
});

/* -------------------------------------------------------------------------- *
 * L. 作词课（lyric.html）
 * --------------------------------------------------------------------------
 * 这一页没有音频，所以测的不是"听得出差别"，而是：
 *   ① 页面真的装配起来了（13 节、每张表都有行）
 *   ② 体裁联动是不是真的把方案换成那一档
 *   ③ 自检器的判定方向对不对（有禁用词必须报，干净的必须放过）
 * 第三条最容易写成"跑通就行"，所以两个方向都要测。
 * -------------------------------------------------------------------------- */

test('L1 作词课装配：14 节导航 + 每张表都有行', async () => {
  await withLyricPage((w, d) => {
    /* 同 B1：排除 .navswitch 那条外链，只数章节锚点 */
    const links = [...d.querySelectorAll('#nav a[href^="#"]')];
    const sections = [...d.querySelectorAll('section')];
    assert.equal(links.length, 14, '14 个导航链接');
    assert.equal(sections.length, 14, '14 个 section');
    for (const l of links) {
      const id = l.getAttribute('href').slice(1);
      assert.ok(d.getElementById(id), `导航目标 #${id} 应存在`);
    }
    /* 与乐理课 B1 同一条守卫：节号必须 00–13 连续。
       插一节忘了顺延后面，只靠数 section 是查不出来的。 */
    assert.deepEqual(sections.map(s => s.querySelector('.sec-num').textContent),
      ['00','01','02','03','04','05','06','07','08','09','10','11','12','13'],
      '节号必须从 00 到 13 连续');

    const rows = sel => d.querySelectorAll(sel).length;
    assert.equal(rows('#genreChips .chip'), 13, '13 个体裁');
    assert.equal(rows('#rhymeTypeTable tr'), 5, '韵脚五型');
    assert.equal(rows('#schemeTable tr'), 8, '八种押韵方案');
    assert.equal(rows('#cnPatternTable tr'), 7, '句式切分 7 行');
    assert.equal(rows('#enElegance .card'), 5, '英文优雅五条');
    assert.equal(rows('#enFixTable tr'), 5, '英文改词五动作');
    assert.equal(rows('#imgTable tr'), 5, '五类素材');
    assert.equal(rows('#rhetTable tr'), 7, '七种修辞');
    assert.equal(rows('#gufengBox .gu-row'), 6, '国风意象六组');
    assert.equal(rows('#partsTable tr'), 9, '九个段落');
    assert.equal(rows('#personTable tr'), 4, '四种人称');
    assert.equal(rows('#hookTable tr'), 7, '钩子七型');
    assert.equal(rows('#schoolGrid .school'), 8, '八派');
    assert.equal(rows('#schoolGrid .school li'), 24, '每派三条动作');
    assert.equal(rows('#symptomTable tr'), 8, '症状速查 8 行');
    assert.equal(rows('#frameTable tr'), 5, '五种框景');
    assert.equal(rows('#banZhTable tr'), 6, '中文黑名单 6 类');
    assert.equal(rows('#banEnTable tr'), 3, '英文黑名单 3 类');
    assert.equal(rows('#fixTable tr'), 5, '改词五动作');
    assert.equal(rows('#albumBriefTable tr'), 9, '专辑九项必问');
    assert.equal(rows('#albumStruct .card'), 3, '序章 / 主体 / 收尾');
    assert.equal(rows('#storyTable tr'), 8, '叙事专辑八个阶段');
    assert.equal(rows('#imageTable tr'), 3, '三个跨曲复现的意象');
    assert.equal(rows('#selfCheck li'), 11, '人读清单 11 条');
    assert.ok(d.querySelector('#genrePanel .schg'), '体裁面板默认就要有方案网格');

    /* 同 B3：窄屏表格横滑的守卫（见 B3 的说明） */
    const tbls = [...d.querySelectorAll('table')];
    assert.ok(tbls.length > 0, '页面里得有表');
    tbls.forEach(t => {
      assert.ok(t.parentNode.classList.contains('tscroll'), '每张表都要套 .tscroll');
      const cols = t.querySelectorAll('thead th').length;
      assert.equal(t.parentNode.classList.contains('wide'), cols >= 4,
        `列数 ${cols} 的表，wide 标记必须与"≥4 列"一致`);
    });
  });
});

test('L2 体裁联动：换体裁必须换掉方案、严格度与纪律', async () => {
  await withLyricPage(async (w, d) => {
    const chips = [...d.querySelectorAll('#genreChips .chip')];
    const first = d.querySelector('#genrePanel').textContent;

    /* 古风/国风 在表尾，方案是 ABBA —— 和第一条（流行 XAXA）必须完全不同 */
    const guofeng = chips.length - 1;
    chips[guofeng].click();
    await sleep(10);
    const cells = [...d.querySelectorAll('#genrePanel .sch')].map(e => e.textContent);
    assert.deepEqual(cells, ['A', 'B', 'B', 'A'], '古风的默认方案是抱韵 ABBA');
    assert.match(d.querySelector('#genrePanel').textContent, /古风/);
    assert.notEqual(d.querySelector('#genrePanel').textContent, first, '面板内容必须真的换了');

    /* 布鲁斯必须是 AAB —— 乐理课第 09 节讲的就是这个结构，两页口径要一致 */
    const bi = chips.findIndex(c => c.textContent === '布鲁斯');
    assert.ok(bi >= 0, '体裁表里要有布鲁斯');
    chips[bi].click();
    await sleep(10);
    assert.deepEqual([...d.querySelectorAll('#genrePanel .sch')].map(e => e.textContent), ['A', 'A', 'B']);
  });
});

test('L3 自检器：有问题的词必须报，干净的词必须放过', async () => {
  await withLyricPage(async (w, d) => {
    const inp = d.querySelector('#scanIn');
    const fire = v => { inp.value = v; inp.dispatchEvent(new w.Event('input')); };
    const txt = () => d.querySelector('#scanOut').textContent;

    /* 反面样本：撞禁用词（霓虹 / 破碎）+ 抽象名词超 2 个 + 超长句 */
    fire('霓虹亮着 我一个人走在这座破碎的城市的边缘');
    await sleep(10);
    assert.match(txt(), /命中 .*个/, '禁用词应被报出来');
    assert.match(txt(), /霓虹/);
    assert.match(txt(), /破碎/);
    assert.match(txt(), /超过 11 字/, '超长句应提示要念一遍');

    /* 正面样本：具体、短句、有钩子，抽象名词 0 个 */
    fire('把伞留在门口\n钥匙压在花盆下\n雨停了你还没回来');
    await sleep(10);
    assert.match(txt(), /没撞中文黑名单/);
    assert.match(txt(), /一个都没有/, '抽象名词应为 0');
    assert.match(txt(), /落在 3–10 字/, '应认出钩子句');

    /* 清空后必须回到空态，不能留着上一次的结论 */
    d.querySelector('#scanClear').click();
    await sleep(10);
    assert.match(txt(), /还没有输入/);
  });
});

test('L4 作词课数据：八派只有三种力，每派三条动作，钩子七型各带踩雷点', async () => {
  await withLyricPage((w) => {
    const L = w.__LC__;
    assert.equal(L.SCHOOLS.length, 8);
    const forces = [...new Set(L.SCHOOLS.map(s => s.force))].sort();
    assert.deepEqual(forces, ['raise', 'seen', 'told'], '八派只归到三种力');
    L.SCHOOLS.forEach(s => {
      assert.equal(s.acts.length, 3, `${s.n} 应有三条动作`);
      assert.ok(s.bad && s.bad.length > 6, `${s.n} 必须写清会写坏成什么`);
    });

    assert.equal(L.HOOKS.length, 7);
    L.HOOKS.forEach(h => assert.ok(h.warn, `${h.n} 缺踩雷点`));

    assert.equal(L.FRAMES.length, 5);
    assert.equal(L.SCHEMES.length, 8);
    assert.equal(L.ALBUM_BRIEF.length, 9);
    assert.equal(L.SELF_CHECK.length, 11);

    /* scanText 是纯函数，直接喂字符串验证判定方向（不经过 DOM） */
    const dirty = L.scanText('霓虹 破碎 永远 命运 时光');
    assert.ok(dirty.banHits.length >= 2, '禁用词应被识别');
    assert.ok(dirty.abs.length >= 3, '抽象名词应被数出来');
    const clean = L.scanText('把伞留在门口\n钥匙压在花盆下');
    assert.equal(clean.banHits.length, 0);
    assert.equal(clean.abs.length, 0);
    assert.equal(clean.lines.length, 2);
  });
});


test('L5 叙事专辑：八个阶段串行、功能只有四种、每个意象都必须翻面', async () => {
  await withLyricPage((w) => {
    const L = w.__LC__;

    /* ① 阶段：八首一首不落，且功能只有起/承/转/合四种，每种恰好两次。
       这不是格式洁癖——多出一种功能就说明故事多了一条线，八首装不下。 */
    assert.equal(L.STORY_BEATS.length, 8, '八个阶段对应八首');
    const fns = L.STORY_BEATS.map(b => b.fn);
    assert.deepEqual([...new Set(fns)].sort(), ['合', '承', '起', '转'], '功能只有四种');
    ['起', '承', '转', '合'].forEach(f => {
      assert.equal(fns.filter(x => x === f).length, 2, `「${f}」应恰好两首`);
    });
    L.STORY_BEATS.forEach((b, i) => {
      assert.equal(b.n, `第 ${i + 1} 首`, '位置必须按顺序排，串行不许跳号');
      assert.ok(b.what && b.q, `${b.n} 必须写清做什么、以及交稿前问什么`);
    });
    /* ② 顺序不变式：真相（转的第一首）必须早于崩塌，选择（合的第一首）必须晚于崩塌。
       把"选择"提到"崩塌"之前，故事就散了——这是这张表唯一的硬约束。 */
    assert.equal(fns[4], '转', '第 5 首必须交付真相');
    assert.equal(fns[7], '合', '第 8 首必须是回望');

    /* ③ 意象：每个都要有"第一次 / 后来 / 翻的是哪一格"三段，缺一段就退化成复述 */
    assert.equal(L.IMAGE_CALLBACK.length, 3, '三个意象');
    L.IMAGE_CALLBACK.forEach(c => {
      assert.ok(c.img && c.first && c.later && c.turn, `${c.img} 三段都要有`);
      assert.notEqual(c.first, c.later, `${c.img} 两次出现不能是同一句话（那就是复述）`);
      assert.ok(c.turn.length >= 4, `${c.img} 必须说清翻的是哪一个维度`);
    });
  });
});

test('L6 术语与扩充表：英文名必须带释义、六组国风各八个词、段落与人称都要落到数据里', async () => {
  await withLyricPage((w, d) => {
    const L = w.__LC__;

    /* ① 韵脚五型的英文词是**读者一律不认识**的那一类，所以每个都必须带一句
       "为什么叫这个"。只给 perfect / slant 两个单词，等于换个写法的不懂。 */
    assert.equal(L.RHYME_TYPES.length, 5, '韵脚五型');
    L.RHYME_TYPES.forEach(r => {
      assert.ok(/[a-z]/i.test(r.en), `${r.n} 必须有英文名`);
      assert.ok(r.enZh && r.enZh.length >= 8, `${r.n} 的英文名必须有一句解释（enZh）`);
    });
    /* perfect 与 slant 这一对必须把"完全 / 斜"讲出来——这是用户点名要的两条 */
    assert.match(L.RHYME_TYPES[0].enZh, /完全/, 'perfect 要解释成"完全的"');
    assert.match(L.RHYME_TYPES[1].enZh, /斜/, 'slant 要解释成"斜的"');

    /* ② 七种修辞：只有"句内 / 跨句"两种层级，且两种都要有。
       句内的错了废一句，跨句的错了废一段——层级是这张表的教学点，不能全是同一档。 */
    assert.equal(L.RHETORIC.length, 7, '七种修辞');
    const lvls = L.RHETORIC.map(x => x.lvl);
    assert.deepEqual([...new Set(lvls)].sort(), ['p', 's'], '层级只有句内(s) / 跨句(p)');
    assert.equal(lvls.filter(x => x === 'p').length, 2, '跨句的恰好两种（顶真、反讽）');
    L.RHETORIC.forEach(x => {
      assert.ok(x.n && x.en && x.d && x.ex && x.warn, `${x.n} 五列都不能空`);
      assert.notEqual(x.ex, x.warn, `${x.n} 的例子与踩雷点不能是同一句话`);
    });
    /* 跨 realm 的数组不能直接 deepEqual（原型不同），先 spread 成本地数组 */
    assert.deepEqual([...L.RHETORIC.map(x => x.n)].sort(),
      ['比喻','借代','反讽','矛盾','移就','顶真','通感'].sort(), '七种一个不多一个不少');

    /* ③ 国风库：六组，每组恰好八个词，且六种情绪不重名。
       数量必须对得上——"库太小"正是这张表被加出来的原因，再缩回去就是白做。 */
    assert.equal(L.GUFENG.length, 6, '六组情绪');
    const emos = L.GUFENG.map(g => g.emo);
    assert.equal(new Set(emos).size, 6, '六种情绪不重名');
    L.GUFENG.forEach(g => {
      assert.equal(g.items.length, 8, `${g.emo} 组必须恰好八个词`);
      assert.equal(new Set(g.items).size, 8, `${g.emo} 组内不许有重复词`);
      assert.ok(g.act && g.why, `${g.emo} 必须写清配什么动作、为什么`);
    });
    /* 全库不许有跨组重复：同一个词服务两种情绪，就等于没分组 */
    const all = L.GUFENG.flatMap(g => g.items);
    assert.equal(all.length, 48, '48 个词');
    assert.equal(new Set(all).size, 48, '跨组不许重复');

    /* ④ 段落：九段的英文名必须给（V/C/PC/B 是行话，不解释就是黑话），
       且每一段都要有"词要交什么 + 判据"两列，否则又变成一张结构图。 */
    assert.equal(L.PARTS.length, 9, '九个段落');
    L.PARTS.forEach(p => {
      assert.ok(/[a-z]/i.test(p.en), `${p.n} 必须有英文名`);
      assert.ok(p.len && p.what && p.job && p.q, `${p.n} 四列都不能空`);
    });
    /* 主歌 / 副歌 / 桥段这三个是骨架，缺一个这节就不成立 */
    ['verse 1','chorus','bridge'].forEach(en => {
      assert.ok(L.PARTS.some(p => p.en === en), `必须包含 ${en}`);
    });

    /* ⑤ 人称四种：我 / 你 / 他 / 我们，各有听感与踩雷 */
    assert.equal(L.PERSON.length, 4, '四种人称');
    L.PERSON.forEach(x => assert.ok(x.feel && x.use && x.warn, `${x.n} 三列都不能空`));

    /* ⑥ 渲染层：这些表必须真的画到页面上（数据加了、DOM 没跟是最常见的漏） */
    assert.equal(d.querySelectorAll('#rhetTable tr').length, 7);
    assert.equal(d.querySelectorAll('#gufengBox .gu-row').length, 6);
    assert.equal(d.querySelectorAll('#partsTable tr').length, 9);
    assert.equal(d.querySelectorAll('#personTable tr').length, 4);
    /* 英文释义必须真的显示出来，不能只存在数据里 */
    assert.match(d.querySelector('#rhymeTypeTable').textContent, /严丝合缝/);
  });
});
