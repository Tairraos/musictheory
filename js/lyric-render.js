/* ==========================================================================
 * 《姐弟厨师团——作词课》 · 渲染层（js/lyric-render.js）
 * --------------------------------------------------------------------------
 * 职责：把 lyric-data.js 里的常量铺成页面，绑定两处交互
 *       ① 体裁 chip → 面板（方案字母网格 + 严格度 + 必守纪律）
 *       ② 自检器：粘一段词，数出禁用词 / 抽象名词 / 句长 / 钩子
 *
 * 依赖：lyric-data.js（全部表）、lyric-app.js 提供 $ / $$ / toast
 * 纪律：这一页没有音频。凡"能听出来的事"都在乐理课，别在这里假装能听。
 * ========================================================================== */

/* ---------- 通用小工具 ---------- */
const starN = n => '●'.repeat(n) + '<span style="color:#D6D2C6">' + '●'.repeat(3 - n) + '</span>';

/* 押韵方案的字母串 → 一排格子。同字母同色，一眼看出哪几行押在一起 */
function schemeCells(sch){
  return [...sch].map(c => `<div class="sch ${c.toLowerCase()}">${c}</div>`).join('');
}

/* ---------- 01 体裁 ---------- */
function renderGenre(i){
  const g = GENRES[i], p = $('#genrePanel');
  if (!p) return;
  p.innerHTML = `
    <div class="gname">${g.n} <span class="mini mono">${g.en}</span></div>
    <div class="grow">
      <div>
        <div class="mini" style="margin-bottom:6px">默认押韵方案</div>
        <div class="schg">${schemeCells(g.sch)}</div>
        <div class="mini" style="margin-top:6px">第 1–4 行（X ＝ 不押）</div>
      </div>
      <div class="gmeta">
        <div>严格度 <b>${g.strict}</b></div>
        <div>句式 <b>${g.sent}</b></div>
        <div style="margin-top:8px">${g.rule}</div>
      </div>
    </div>`;
}

function buildGenres(){
  const box = $('#genreChips');
  if (!box) return;
  GENRES.forEach((g, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    /* chip 上只留中文名（'流行 Pop' → '流行'），英文名在面板里给 */
    b.textContent = g.n.split(' ')[0];
    b.onclick = () => {
      $$('#genreChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      renderGenre(i);
    };
    box.appendChild(b);
  });
  renderGenre(0);
}

/* ---------- 02 韵脚与方案 ---------- */
function buildRhyme(){
  const t = $('#rhymeTypeTable');
  if (!t) return;
  t.innerHTML = RHYME_TYPES.map(r => `<tr>
    <td><b>${r.n}</b></td><td class="mini mono">${r.en}</td>
    <td class="mini">${r.d}</td><td class="mini">${r.ex}</td>
    <td class="mini">${r.use}</td></tr>`).join('');

  $('#schemeTable').innerHTML = SCHEMES.map(s => `<tr>
    <td><b class="mono">${s.s}</b></td><td class="mini">${s.n}</td>
    <td class="mini">${s.feel}</td><td class="mini">${s.risk}</td></tr>`).join('');
}

/* ---------- 03 中文句式 ---------- */
function buildCN(){
  const t = $('#cnPatternTable');
  if (!t) return;
  t.innerHTML = CN_PATTERNS.map(p => `<tr>
    <td><b>${p.p}</b></td><td class="mini mono">${p.cut}</td>
    <td class="mini">${p.use}</td><td class="mini">${p.ex}</td></tr>`).join('');
}

/* ---------- 04 英文 ---------- */
function buildEN(){
  const g = $('#enElegance');
  if (g){
    g.innerHTML = EN_ELEGANCE.map(e => `
      <div class="card tight" style="margin:0">
        <div style="font-weight:600;margin-bottom:4px">${e.n}</div>
        <div class="mini" style="line-height:1.65">${e.d}</div>
        <div class="mini" style="margin-top:8px;color:var(--red)">✗ ${e.bad}</div>
        <div class="mini" style="color:var(--teal)">✓ ${e.good}</div>
      </div>`).join('');
  }

  const t = $('#enTradTable');
  if (t){
    const row = (k, pick) => `<tr><td class="mini"><b>${k}</b></td>` +
      EN_TRADITIONS.map(x => `<td class="mini">${pick(x)}</td>`).join('') + '</tr>';
    t.innerHTML =
      row('来源', x => x.src) +
      row('优雅来自', x => x.from) +
      row('手法', x => x.how) +
      row('风险', x => x.risk) +
      row('中文对照', x => x.cn);
  }

  const f = $('#enFixTable');
  if (f){
    f.innerHTML = EN_FIX.map(x => `<tr><td class="mono">${x.i}</td>
      <td><b>${x.n}</b></td><td class="mini">${x.hit}</td></tr>`).join('');
  }
}

/* ---------- 05 意象 ---------- */
function buildImage(){
  const t = $('#imgTable');
  if (!t) return;
  t.innerHTML = IMG_MATERIALS.map(m => `<tr>
    <td><b>${m.c}</b></td><td class="mini">${m.ex}</td>
    <td class="mini">${starN(m.star)}</td><td class="mini">${m.note}</td></tr>`).join('');
}

/* ---------- 06 钩子 ---------- */
function buildHooks(){
  const t = $('#hookTable');
  if (!t) return;
  t.innerHTML = HOOKS.map(h => `<tr>
    <td><b>${h.n}</b></td><td class="mini">${h.how}</td>
    <td class="mini" style="color:var(--purple)">${h.ex}</td>
    <td class="mini" style="color:var(--faint)">${h.warn}</td></tr>`).join('');
}

/* ---------- 07 八派 ---------- */
const FORCE_LABEL = { seen:['被看见', 'seen'], told:['被说破', 'told'], raise:['被抬高', 'raise'] };

function buildSchools(){
  const g = $('#schoolGrid');
  if (!g) return;
  g.innerHTML = SCHOOLS.map(s => {
    const [lab, cls] = FORCE_LABEL[s.force];
    return `<div class="school">
      <h4>${s.n}<span class="force ${cls}">${lab}</span></h4>
      <div class="core">${s.core}</div>
      <ol>${s.acts.map(a => `<li>${a}</li>`).join('')}</ol>
      <div class="io">
        <span class="yes">适合</span> ${s.yes}<br>
        <span class="no">不适合</span> ${s.no}
      </div>
      <div class="bad">会写坏成：${s.bad}</div>
    </div>`;
  }).join('');

  const t = $('#symptomTable');
  if (t){
    t.innerHTML = SYMPTOM.map(x => `<tr>
      <td class="mini">「${x.s}」</td><td class="mini">${x.real}</td>
      <td><b>${x.to}</b></td></tr>`).join('');
  }
}

/* ---------- 08 框景 ---------- */
function buildFrames(){
  const t = $('#frameTable');
  if (!t) return;
  t.innerHTML = FRAMES.map((f, i) => `<tr>
    <td class="mono">${i + 1}</td><td><b>${f.n}</b></td>
    <td class="mini">${f.d}</td></tr>`).join('');
}

/* ---------- 09 黑名单 ---------- */
function buildBan(){
  const zh = $('#banZhTable'), en = $('#banEnTable');
  if (zh){
    zh.innerHTML = BAN_ZH.map(g => `<tr><td><b>${g.c}</b></td>
      <td class="mini">${g.w.join(' · ')}</td></tr>`).join('');
  }
  if (en){
    en.innerHTML = BAN_EN.map(g => `<tr><td><b>${g.c}</b></td>
      <td class="mini mono" style="font-size:12px">${g.w.join(' · ')}</td></tr>`).join('');
  }
}

/* ---------- 10 改词 ---------- */
function buildFix(){
  const t = $('#fixTable');
  if (!t) return;
  t.innerHTML = FIX_STEPS.map(s => `<tr>
    <td class="mono">${s.i}</td><td><b>${s.n}</b></td>
    <td class="mini">${s.d}</td><td class="mini" style="color:var(--purple)">${s.hit}</td></tr>`).join('');
}

/* ---------- 11 专辑规划 ---------- */
function buildAlbum(){
  const lay = $('#albumLayerTable');
  if (lay){
    lay.innerHTML = ALBUM_LAYERS.map(l => `<tr>
      <td><b>${l.n}</b></td><td class="mini">${l.what}</td>
      <td class="mini">${l.why}</td></tr>`).join('');
  }

  const brief = $('#albumBriefTable');
  if (brief){
    brief.innerHTML = ALBUM_BRIEF.map(b => `<tr>
      <td class="mono">${b.i}</td><td><b>${b.k}</b></td>
      <td class="mini">${b.ask}</td><td class="mini" style="color:var(--faint)">${b.def}</td></tr>`).join('');
  }

  const word = $('#albumWordTable');
  if (word){
    word.innerHTML = ALBUM_WORD_JOBS.map(w => `<tr>
      <td><b>${w.n}</b></td><td class="mini">${w.d}</td>
      <td class="mini" style="color:var(--faint)">${w.ex}</td></tr>`).join('');
  }

  const st = $('#albumStruct');
  if (st){
    st.innerHTML = ALBUM_STRUCT.map(s => `
      <div class="card tight" style="margin:0;background:var(--gray-bg);border:none">
        <div class="mini" style="color:var(--purple)">${s.tag}</div>
        <div style="font-weight:600;margin:3px 0">${s.n}</div>
        <div class="mini" style="line-height:1.6">${s.d}</div>
      </div>`).join('');
  }
}

/* ---------- 12 自检 ---------- */

/* 只去掉空白、标点与符号，留下"要唱的字"。
 * 用 Unicode 属性类而不是手写标点表——中文标点比想象中多（、。…—～《》）。 */
const countChars = s => s.replace(/[\s\p{P}\p{S}]/gu, '').length;

/* scanText()：纯函数，不碰 DOM —— 这样它可被单独验证，也方便以后接命令行。
 * 只做三件能字符串匹配的事，押韵与画面一律不碰（那靠人和耳朵）。 */
function scanText(text){
  const raw = (text || '').split('\n').map(s => s.trim()).filter(Boolean);
  const lines = raw.map(s => ({ s, n: countChars(s) }));
  const total = lines.reduce((a, l) => a + l.n, 0);
  const longest = lines.length ? lines.reduce((a, l) => (l.n > a.n ? l : a)) : { s:'', n:0 };
  const short = lines.filter(l => l.n > 0 && l.n <= 2).length;

  const banHits = SCAN_BAN.filter(w => (text || '').indexOf(w) >= 0);
  const abs = [];
  SCAN_ABSTRACT.forEach(w => {
    const c = ((text || '').match(new RegExp(w, 'g')) || []).length;
    if (c) abs.push(w + (c > 1 ? '×' + c : ''));
  });
  const hooks = lines.filter(l => l.n >= 3 && l.n <= 10);

  return { lines, total, longest, short, banHits, abs, hooks };
}

function renderScan(){
  const box = $('#scanOut');
  if (!box) return;
  const text = $('#scanIn').value;
  if (!text.trim()){
    box.innerHTML = '<div class="mini">还没有输入。粘一段词进来，能数的部分我替你数掉。</div>';
    return;
  }
  const r = scanText(text);
  const ok = v => `<span class="v-ok">${v}</span>`;
  const warn = v => `<span class="v-warn">${v}</span>`;
  const bad = v => `<span class="v-bad">${v}</span>`;
  const row = (k, v) => `<div class="scan-row"><div class="scan-key">${k}</div><div class="scan-val">${v}</div></div>`;
  const hl = arr => arr.map(w => `<em>${w}</em>`).join(' ');

  let html = '';
  html += row('规模', `${r.lines.length} 句，共 ${r.total} 字`
    + (r.short ? warn(`，其中 ${r.short} 句只有 1–2 字（是不是断句断了？）`) : ''));

  /* 句长：主歌 5–9、副歌 7–11。超过 11 就提示——不是错，是要念一遍确认会不会赶 */
  const L = r.longest;
  html += row('最长一句', L.n
    ? `${L.n} 字 <span class="scan-stat">「${L.s}」</span>`
      + (L.n > 11 ? bad('　超过 11 字：念一遍，赶就删字') : ok('　在安全区内'))
    : '—');

  const spread = r.lines.length ? r.longest.n - Math.min(...r.lines.map(l => l.n)) : 0;
  html += row('句长离散', spread === 0 ? (r.lines.length > 2 ? warn('每句一样长，会像念词谱') : '—')
    : spread <= 5 ? ok(`最长与最短差 ${spread} 字，有起伏但不散`)
    : warn(`差 ${spread} 字：破格句只有一句才算破格，多了就是没控制`));

  html += row('禁用词', r.banHits.length
    ? bad(`命中 ${r.banHits.length} 个：`) + ' ' + hl(r.banHits)
    : ok('没撞中文黑名单'));

  html += row('抽象名词', r.abs.length
    ? (r.abs.length > 2 ? bad(`整首 ${r.abs.length} 个，超过 2 个`) : warn(`${r.abs.length} 个，还在上限内`)) + '：' + hl(r.abs)
    : ok('一个都没有——具体度很高'));

  html += row('钩子', r.hooks.length
    ? ok(`${r.hooks.length} 句落在 3–10 字`) + ` <span class="scan-stat">「${r.hooks[0].s}」</span>`
    : warn('没有 3–10 字的独立句：副歌可能缺一句能记住的话'));

  html += row('不查的事', '<span class="mini">押韵（要拼音与韵母归并，人耳更快）· '
    + '画面是否成立 · 主歌二有没有真的发展 —— 这三条只能人读</span>');

  box.innerHTML = html;
}

function buildCheck(){
  const li = $('#selfCheck');
  if (li) li.innerHTML = SELF_CHECK.map(s => `<li>${s}</li>`).join('');

  const btn = $('#scanBtn'), clr = $('#scanClear'), inp = $('#scanIn');
  if (!btn || !inp) return;
  btn.onclick = () => { renderScan(); toast('已扫一遍——押韵和画面还得你自己读'); };
  clr.onclick = () => { inp.value = ''; renderScan(); inp.focus(); };
  /* 边打边算：这类检查没有成本，等到点按钮才更新反而不自然 */
  inp.addEventListener('input', renderScan);
  renderScan();
}
