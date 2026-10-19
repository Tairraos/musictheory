#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团——乐理课》 · 版本自检（tests/bump-version.js）
 * --------------------------------------------------------------------------
 * 用途：把「每次改动都要升版本号」从"靠记性"变成"靠工具"。
 *
 * 约定（用户 2026-10-19 定）：
 *   每次有实质改动 → 版本号递增（1.15 → 1.16 → …），日期同步改成当天。
 *   唯一真源 = js/app.js 的 VERSION 常量，另外三处（<title> 与两个 data-ver
 *   静态副本）必须与它一致，否则页面在不同状态下会显示不同版本。
 *
 * 这个脚本检查两件事：
 *   1. 四处版本号是否一致（不一致直接报错并列出该改哪几行）
 *   2. 相对上次提交，版本号是否递增了（漏升版本时提醒，不阻断——
 *      纯文档改动可以显式 SKIP_VERSION_BUMP=1 跳过）
 *
 * 用法：
 *   node tests/bump-version.js            # 自检（CI / 提交前跑）
 *   node tests/bump-version.js --write 1.17   # 一键把所有地方改成新版本号
 * ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'js/app.js');
const HTML = path.join(ROOT, 'index.html');

const read = p => fs.readFileSync(p, 'utf8');

/* --------------------------------------------------------------------------
 * 1. --write：把所有地方统一改成新版本号（日期默认今天，格式 YY.MM.DD）
 * ------------------------------------------------------------------------ */
const writeIdx = process.argv.indexOf('--write');
if (writeIdx > -1) {
  const target = process.argv[writeIdx + 1];
  if (!target || !/^\d+\.\d+$/.test(target)) {
    console.error('用法：node tests/bump-version.js --write 1.17');
    process.exit(1);
  }
  const d = new Date();
  const date = [String(d.getFullYear()).slice(2), String(d.getMonth() + 1).padStart(2, '0'),
                String(d.getDate()).padStart(2, '0')].join('.');
  const label = `V${target} [${date}]`;
  const labelHtml = `<b>V${target}</b> [${date}]`;

  /* 写 app.js：只替换常量本身（含尾分号），不留任何多余字符。
     替换串必须用函数形式返回，避免 $& / $1 等特殊替换模式被解释。 */
  let app = read(APP);
  const RE = /const VERSION = \{ v: '[\d.]+', date: '[\d.]+' \};/;
  if (!RE.test(app)) { console.error('✗ app.js 里找不到 VERSION 常量，未改动'); process.exit(1); }
  app = app.replace(RE, () => `const VERSION = { v: '${target}', date: '${date}' };`);
  fs.writeFileSync(APP, app);

  /* 写 index.html：<title> 与两处 data-ver 静态副本 */
  let html = read(HTML);
  html = html.replace(/<title>[^<]*<\/title>/, () => `<title>姐弟厨师团 --- 乐理课 ${label}</title>`);
  const RE_VER = /<span class="ver" data-ver><b>V[\d.]+<\/b> \[[\d.]+\]<\/span>/g;
  if (!RE_VER.test(html)) { console.error('✗ index.html 里找不到 data-ver 静态副本，未改动'); process.exit(1); }
  html = html.replace(RE_VER, () => `<span class="ver" data-ver>${labelHtml}</span>`);
  fs.writeFileSync(HTML, html);

  /* 写后自检：确认四处真的都改了。
     注意 <title> 里是 "V1.18 [26.10.19]" 连续文本，
     而 data-ver 静态副本是 "<b>V1.18</b> [26.10.19]"（中间有 </b>），
     所以不能简单地数 "V1.18 [date]" 的出现次数——要按两种形态分别数。 */
  const app2 = read(APP), html2 = read(HTML);
  const want = `const VERSION = { v: '${target}', date: '${date}' };`;
  if (!app2.includes(want)) { console.error(`✗ 写入后校验失败：app.js 未含 ${want}`); process.exit(1); }

  const esc = s => s.replace(/\./g, '\\.');
  const titleHits = (html2.match(new RegExp(`V${esc(target)} \\[${esc(date)}\\]`, 'g')) || []).length;
  const verHits = (html2.match(new RegExp(`<b>V${esc(target)}<\\/b> \\[${esc(date)}\\]`, 'g')) || []).length;
  if (titleHits !== 1) { console.error(`✗ 写入后校验失败：<title> 应有 1 处 V${target}，实际 ${titleHits} 处`); process.exit(1); }
  if (verHits !== 2) { console.error(`✗ 写入后校验失败：data-ver 应有 2 处 V${target}，实际 ${verHits} 处`); process.exit(1); }

  console.log(`版本号已统一改为 ${label}（js/app.js 1 处 + index.html 3 处，写后已校验）`);
  process.exit(0);
}

/* --------------------------------------------------------------------------
 * 2. 自检：四处一致性 + 是否相对上次提交递增
 * ------------------------------------------------------------------------ */
const app = read(APP);
const html = read(HTML);

const vm = app.match(/const VERSION = \{ v: '([\d.]+)', date: '([\d.]+)' \}/);
if (!vm) {
  console.error('✗ js/app.js 里找不到 VERSION 常量');
  process.exit(1);
}
const [ver, date] = [vm[1], vm[2]];
const problems = [];

/* <title> */
const title = html.match(/<title>([^<]*)<\/title>/);
if (!title) problems.push('index.html 缺少 <title>');
else if (!title[1].includes(`V${ver} [${date}]`))
  problems.push(`index.html:12 <title> 应含 V${ver} [${date}]，实际「${title[1]}」`);

/* 两处 data-ver 静态副本 */
const copies = [...html.matchAll(/<span class="ver" data-ver>([\s\S]*?)<\/span>/g)];
if (copies.length !== 2)
  problems.push(`index.html 应有 2 处 data-ver 静态副本，实际 ${copies.length} 处`);
copies.forEach((m, i) => {
  if (!m[1].includes(`V${ver}`) || !m[1].includes(`[${date}]`))
    problems.push(`index.html 第 ${i + 1} 处 data-ver 应为 V${ver} [${date}]，实际「${m[1]}」`);
});

/* 日期格式 */
if (!/^\d{2}\.\d{2}\.\d{2}$/.test(date))
  problems.push(`版本日期 ${date} 应为 YY.MM.DD 格式`);

/* 相对上次提交是否递增 */
let bumped = true, prevVer = null;
try {
  const prevApp = execSync(`git show HEAD:js/app.js`, { cwd: ROOT, encoding: 'utf8' });
  const pm = prevApp.match(/const VERSION = \{ v: '([\d.]+)'/);
  if (pm) {
    prevVer = pm[1];
    const cmp = (a, b) => {
      const [x, y] = [a.split('.').map(Number), b.split('.').map(Number)];
      return x[0] !== y[0] ? x[0] - y[0] : x[1] - y[1];
    };
    if (cmp(ver, prevVer) <= 0) bumped = false;
  }
} catch (e) { /* 没有 git 历史或首次提交，跳过递增检查 */ }

if (problems.length) {
  console.error('✗ 版本号自检未通过：');
  problems.forEach(p => console.error('  · ' + p));
  console.error('\n一键修复：node tests/bump-version.js --write <新版本号>');
  process.exit(1);
}

console.log(`✓ 版本号四处一致：V${ver} [${date}]`);
if (!bumped && prevVer === ver && process.env.SKIP_VERSION_BUMP !== '1') {
  console.warn(`⚠ 版本号仍是 V${prevVer}，与上次提交相同。`);
  console.warn('  本次有改动的话应递增（如 --write 1.17）。');
  console.warn('  纯文档改动可显式跳过：SKIP_VERSION_BUMP=1 npm test');
  process.exit(1);
}
console.log(prevVer ? `✓ 相对上次提交（V${prevVer}）已递增` : '✓ 首次提交，无递增要求');
