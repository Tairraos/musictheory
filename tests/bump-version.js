#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团》 · 版本自检（tests/bump-version.js）
 * --------------------------------------------------------------------------
 * 用途：把「每次改动都要升版本号」从"靠记性"变成"靠工具"。
 *
 * 约定（用户 2026-10-19 定，2026-10-30 扩到两页）：
 *   每次有实质改动 → 版本号递增（1.23 → 1.24 → …），日期同步改成当天。
 *   **两页共用同一个版本号**：它们是一次更新同时交付的；标签页上显示两个
 *   版本号只会让人怀疑"我是不是没刷新"。
 *   每页的真源是它自己的入口文件（app.js / lyric-app.js）里的 VERSION 常量，
 *   另外三处（<title> 与两个 data-ver 静态副本）必须与它一致，
 *   否则同一页在不同状态下会显示不同版本。
 *
 * 这个脚本检查三件事：
 *   1. 每页四处版本号是否一致（不一致直接报错并列出该改哪几行）
 *   2. 两页之间版本号是否相同
 *   3. 相对上次提交，版本号是否递增（漏升版本时提醒，不阻断——
 *      纯文档改动可以显式 SKIP_VERSION_BUMP=1 跳过）
 *
 * 用法：
 *   node tests/bump-version.js                 # 自检（CI / 提交前跑）
 *   node tests/bump-version.js --write 1.24    # 一键把两页所有地方改成新版本号
 * ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);

/* 页面表：新增一页只加一行，其余逻辑不用动。
 * title 是 <title> 里版本号之前的那一段（各页不同，不能从别处推） */
const PAGES = [
  { page: 'index.html', app: 'js/app.js',       title: '姐弟厨师团 --- 乐理课' },
  { page: 'lyric.html', app: 'js/lyric-app.js', title: '姐弟厨师团 --- 作词课' },
];

const RE_VERSION = /const VERSION = \{ v: '([\d.]+)', date: '([\d.]+)' \};/;
/* 只匹配到开标签为止（不含闭合标签），这样不关心外层是 <span> 还是 <p> */
const RE_VER_HTML = /(<[a-z]+ class="[^"]*\bver\b[^"]*" data-ver>)<b>V[\d.]+<\/b> \[[\d.]+\]/g;

/* --------------------------------------------------------------------------
 * 1. --write：把两页所有地方统一改成新版本号（日期默认今天，格式 YY.MM.DD）
 * ------------------------------------------------------------------------ */
const writeIdx = process.argv.indexOf('--write');
if (writeIdx > -1) {
  const target = process.argv[writeIdx + 1];
  if (!target || !/^\d+\.\d+$/.test(target)) {
    console.error('用法：node tests/bump-version.js --write 1.24');
    process.exit(1);
  }
  const d = new Date();
  const date = [String(d.getFullYear()).slice(2), String(d.getMonth() + 1).padStart(2, '0'),
                String(d.getDate()).padStart(2, '0')].join('.');
  const label = `V${target} [${date}]`;
  const labelHtml = `<b>V${target}</b> [${date}]`;

  for (const P of PAGES) {
    /* 写入口文件：只替换常量本身（含尾分号），不留任何多余字符。
       替换串用函数形式返回，避免 $& / $1 等特殊替换模式被解释。 */
    let app = read(P.app);
    if (!RE_VERSION.test(app)) {
      console.error(`✗ ${P.app} 里找不到 VERSION 常量，未改动`);
      process.exit(1);
    }
    app = app.replace(RE_VERSION, () => `const VERSION = { v: '${target}', date: '${date}' };`);
    write(P.app, app);

    /* 写 HTML：<title> 与两处 data-ver 静态副本。
       data-ver 的正则按**属性**定位，不写死标签名（<span>/<p>）与类名——
       那些只是各处的排版修饰，版本号该写在哪由版面决定，工具不该关心。 */
    let html = read(P.page);
    html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${P.title} ${label}</title>`);
    const found = html.match(RE_VER_HTML);
    if (!found || found.length !== 2) {
      console.error(`✗ ${P.page} 里应找到 2 处 data-ver 静态副本，实际 ${found ? found.length : 0} 处，未改动`);
      process.exit(1);
    }
    html = html.replace(RE_VER_HTML, m => m.replace(/<b>V[\d.]+<\/b> \[[\d.]+\]/, () => labelHtml));
    write(P.page, html);

    /* 写后自检：确认这一页真的都改了。
       注意 <title> 里是 "V1.24 [26.10.30]" 连续文本，
       而 data-ver 静态副本是 "<b>V1.24</b> [26.10.30]"（中间有 </b>），
       所以不能简单地数 "V1.24 [date]" 的出现次数——要按两种形态分别数。 */
    const esc = s => s.replace(/\./g, '\\.');
    const html2 = read(P.page);
    if (!read(P.app).includes(`const VERSION = { v: '${target}', date: '${date}' };`)) {
      console.error(`✗ 写入后校验失败：${P.app} 未含新版本号`); process.exit(1);
    }
    const titleHits = (html2.match(new RegExp(`V${esc(target)} \\[${esc(date)}\\]`, 'g')) || []).length;
    const verHits = (html2.match(new RegExp(`<b>V${esc(target)}<\\/b> \\[${esc(date)}\\]`, 'g')) || []).length;
    if (titleHits !== 1) { console.error(`✗ 写入后校验失败：${P.page} 的 <title> 应有 1 处，实际 ${titleHits} 处`); process.exit(1); }
    if (verHits !== 2) { console.error(`✗ 写入后校验失败：${P.page} 的 data-ver 应有 2 处，实际 ${verHits} 处`); process.exit(1); }
  }

  console.log(`版本号已统一改为 ${label}（${PAGES.length} 页 × 4 处，写后已校验）`);
  process.exit(0);
}

/* --------------------------------------------------------------------------
 * 2. 自检：每页四处一致 + 两页之间一致 + 是否相对上次提交递增
 * ------------------------------------------------------------------------ */
const problems = [];
let ver = null, date = null;

for (const P of PAGES) {
  const app = read(P.app), html = read(P.page);

  const vm = app.match(RE_VERSION);
  if (!vm) { problems.push(`${P.app} 里找不到 VERSION 常量`); continue; }
  const [v, dt] = [vm[1], vm[2]];
  if (ver === null) { ver = v; date = dt; }
  else if (v !== ver) problems.push(`两页版本号不一致：${P.page} 是 V${v}，另有页面是 V${ver}`);

  /* <title> */
  const title = html.match(/<title>([^<]*)<\/title>/);
  if (!title) problems.push(`${P.page} 缺少 <title>`);
  else if (!title[1].includes(`V${v} [${dt}]`))
    problems.push(`${P.page} 的 <title> 应含 V${v} [${dt}]，实际「${title[1]}」`);

  /* 两处 data-ver 静态副本 */
  const copies = [...html.matchAll(/<([a-z]+) class="[^"]*\bver\b[^"]*" data-ver>([\s\S]*?)<\/\1>/g)]
    .map(m => m[2].replace(/<[^>]+>/g, ''));
  if (copies.length !== 2)
    problems.push(`${P.page} 应有 2 处 data-ver 静态副本，实际 ${copies.length} 处`);
  copies.forEach((inner, i) => {
    if (!inner.includes(`V${v}`) || !inner.includes(`[${dt}]`))
      problems.push(`${P.page} 第 ${i + 1} 处 data-ver 应为 V${v} [${dt}]，实际「${inner}」`);
  });

  /* 日期格式 */
  if (!/^\d{2}\.\d{2}\.\d{2}$/.test(dt))
    problems.push(`${P.app} 的版本日期 ${dt} 应为 YY.MM.DD 格式`);
}

/* --------------------------------------------------------------------------
 * 「是否需要升版本」的判据
 * -------------------------------------------------------------------------
 * 只比工作区与 HEAD 是不够的：提交完成后再跑一次，版本号必然与 HEAD 相等，
 * 那样每次提交后都会误报。正确的问法是：
 *   「工作区有没有**未提交的改动**？」有的话才要求版本号比 HEAD 高。
 *   没有未提交改动（刚提交完 / 干净仓库）→ 无所谓递增，直接放行。 */
let dirty = false;
try {
  const out = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
  /* 只关心源码是否被改，所以过滤掉明显的非源码路径 */
  dirty = out.split('\n').filter(l => l && !/\.workbuddy|node_modules|dist\//.test(l)).length > 0;
} catch (e) { /* 无 git 仓库时不做要求 */ }

let bumped = true, prevVer = null;
try {
  const prevApp = execSync(`git show HEAD:${PAGES[0].app}`, { cwd: ROOT, encoding: 'utf8' });
  const pm = prevApp.match(/const VERSION = \{ v: '([\d.]+)'/);
  if (pm && ver) {
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

console.log(`✓ 版本号一致：${PAGES.map(p => p.page).join(' / ')} 都是 V${ver} [${date}]`);

/* 只有「有未提交改动」且「版本号没比 HEAD 高」时才算漏升 */
if (dirty && !bumped && process.env.SKIP_VERSION_BUMP !== '1') {
  console.warn(`⚠ 工作区有未提交改动，但版本号仍是 V${prevVer}（与上次提交相同）。`);
  console.warn('  按约定每次改动都要升版本，例如：npm run bump -- 1.' +
              (String(parseInt(prevVer.split('.')[1], 10) + 1)));
  console.warn('  若本次确为纯文档改动，可显式跳过：SKIP_VERSION_BUMP=1 npm test');
  process.exit(1);
}
if (!dirty) console.log('✓ 工作区干净，无升版本要求');
else if (prevVer) console.log(`✓ 相对上次提交（V${prevVer}）已递增`);
