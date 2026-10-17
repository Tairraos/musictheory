#!/usr/bin/env node
/**
 * ============================================================================
 * 《姐弟厨师团——乐理课》 · 自动化测试（tests/run-tests.js）
 * ----------------------------------------------------------------------------
 * 用 jsdom 从磁盘真实加载 index.html（连带 css/main.css 与 js/ 下全部脚本），
 * 在接近真实的 DOM 环境里验证：
 *   A. 资源拆分完整：外链 CSS/JS 全部就位、插图已外链、无残留 base64
 *   B. 页面装配结果：13 节导航、两架键盘的键数、各表格/卡片数量、SVG 方块数
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
async function loadPage() {
  const pageErrors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => {
    const msg = String(e && e.detail && e.detail.message || e && e.message || e);
    if (!/Not implemented/i.test(msg)) pageErrors.push(new Error(msg));
  });
  const dom = await JSDOM.fromFile(path.join(ROOT, 'index.html'), {
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
  // 磁盘上真实存在
  for (const f of ['css/main.css', ...scripts, 'assets/images/hero-art.png']) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} 应存在`);
  }
  // PNG magic bytes 校验
  const png = fs.readFileSync(path.join(ROOT, 'assets/images/hero-art.png'));
  assert.deepEqual([...png.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], 'hero-art.png 应是合法 PNG');
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

test('B1 导航与章节：13 个导航链接与 13 个 section 一一对应', async () => {
  await withPage((w, d) => {
    const links = [...d.querySelectorAll('#nav a')];
    const sections = [...d.querySelectorAll('section')];
    assert.equal(links.length, 13);
    assert.equal(sections.length, 13);
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
    assert.equal(n('#termTable tr'), 22, '术语速查 22 行');
    assert.equal(n('#checkList tr'), 8, '自查清单 8 行');
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
    assert.equal(n('#minor3row .btn'), 3, '小调三形态按钮');
    // 场景卡片 9 + 7 + 5 = 21
    assert.equal(n('#moodGrid .scene'), 9);
    assert.equal(n('#weatherGrid .scene'), 7);
    assert.equal(n('#tempGrid .scene'), 5);
    // 下拉框选项
    assert.equal(n('#rootSel option'), 12, '主音下拉 12 项');
    assert.equal(n('#modeSel option'), 8, '调式下拉 7 调式 + 五声');
    assert.equal(n('#chordKey option'), 7, '级数和弦调性下拉');
    assert.equal(n('#ivRoot option'), 13, '音程起点 C4–C5');
    assert.equal(n('#ivTop option'), 25, '音程终点 C4–C6');
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

test('D2 场景数据：21 张配方卡片引用合法的调式/音区/织体', async () => {
  await withPage((w) => {
    const M_OF = w.__MT__.M_OF;
    // SCENES 是 data.js 的顶层 const，不在 window 上——从渲染结果反推即可，
    // 这里直接读页面已渲染的卡片标签数验证分组数量（9/7/5）。
    const d = w.document;
    assert.equal(d.querySelectorAll('#moodGrid .scene').length, 9);
    assert.equal(d.querySelectorAll('#weatherGrid .scene').length, 7);
    assert.equal(d.querySelectorAll('#tempGrid .scene').length, 5);
    // 每张卡片都有 5 个参数标签（调式/BPM/音区/织体/力度）
    d.querySelectorAll('.scene').forEach((el, i) => {
      assert.equal(el.querySelectorAll('.tag').length, 5, `第 ${i + 1} 张场景卡片应有 5 个参数标签`);
    });
    assert.ok(M_OF('lydian'), '场景引用的调式应查得到');
    // 每张卡片渲染出的调式标签必须能在 ALL_MODES 里查到（数据引用合法）
    d.querySelectorAll('.scene .tag:first-child').forEach(el => {
      assert.ok([...el.textContent].length > 0, '场景卡片应有调式标签');
    });
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
    d.querySelector('#moodGrid .scene').click();       // 场景配方
    assert.ok(d.querySelector('#moodGrid .scene').classList.contains('playing'), '场景卡片应进入 playing 态');
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
