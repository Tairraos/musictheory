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
    <td><b>${r.n}</b></td>
    <td class="mini"><span class="mono">${r.en}</span><br><span style="color:var(--faint)">${r.enZh}</span></td>
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

/* ---------- 05 意象 / 修辞 / 国风 ---------- */
function buildImage(){
  const t = $('#imgTable');
  if (!t) return;
  t.innerHTML = IMG_MATERIALS.map(m => `<tr>
    <td><b>${m.c}</b></td><td class="mini">${m.ex}</td>
    <td class="mini">${starN(m.star)}</td><td class="mini">${m.note}</td></tr>`).join('');

  /* 七种修辞。第二列的「句内 / 跨句」不是分类癖：
     句内用错了废一句，跨句用错了废一段，责任范围根本不同。 */
  const r = $('#rhetTable');
  if (r) r.innerHTML = RHETORIC.map(x => `<tr>
    <td><b>${x.n}</b><br><span class="mono mini">${x.en}</span></td>
    <td class="mini">${x.lvl === 's' ? '<span class="pill">句内</span>' : '<span class="pill">跨句</span>'}</td>
    <td class="mini">${x.d}</td>
    <td class="mini" style="color:var(--purple)">${x.ex}</td>
    <td class="mini" style="color:var(--faint)">${x.warn}</td></tr>`).join('');

  /* 国风库按情绪分组——分组方式本身就是论点：
     不是"山水/人事/器物"（词性分类，帮不上忙），是"这一组只服务这一种情绪"。 */
  const g = $('#gufengBox');
  if (g) g.innerHTML = GUFENG.map(x => `
    <div class="gu-row">
      <div class="gu-emo">${x.emo}</div>
      <div class="gu-items">${x.items.join(' · ')}</div>
      <div class="gu-act"><b>配这些动作：</b>${x.act}<br><span style="color:var(--faint)">${x.why}</span></div>
    </div>`).join('');
}

/* ---------- 06 段落 / 人称 ---------- */
function buildParts(){
  const t = $('#partsTable');
  if (!t) return;
  t.innerHTML = PARTS.map(p => `<tr>
    <td><b>${p.n}</b><br><span class="mono mini">${p.en}</span><br><span class="mini" style="color:var(--faint)">${p.len}</span></td>
    <td class="mini">${p.what}</td>
    <td class="mini">${p.job}</td>
    <td class="mini" style="color:var(--purple)">${p.q}</td></tr>`).join('');

  const pt = $('#personTable');
  if (pt) pt.innerHTML = PERSON.map(x => `<tr>
    <td><b>${x.n}</b><br><span class="mono mini">${x.en}</span></td>
    <td class="mini">${x.feel}</td>
    <td class="mini">${x.use}</td>
    <td class="mini" style="color:var(--faint)">${x.warn}</td></tr>`).join('');
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
      ${s.img ? `<div class="img"><b>意象库</b>：${s.img}</div>` : ''}
      <div class="io">
        <span class="yes">适合</span> ${s.yes}<br>
        <span class="no">不适合</span> ${s.no}
      </div>
      <div class="judge">可量化判据：${s.judge}</div>
      <div class="bad">会写坏成：${s.bad}</div>
      ${s.extra ? `<div class="extra">${s.extra}</div>` : ''}
    </div>`;
  }).join('');

  const t = $('#symptomTable');
  if (t){
    t.innerHTML = SYMPTOM.map(x => `<tr>
      <td class="mini">「${x.s}」</td><td class="mini">${x.real}</td>
      <td><b>${x.to}</b></td></tr>`).join('');
  }
}

/* ---------- 09 古风三型与纪律 ---------- */

/* 三型选择器：点一下看这一型的语体、特征、适合谁。
 * 默认落在乙（文白间杂）——可唱性最好，也是"没说清楚"时的安全答案。 */
function renderGuofengType(i){
  const p = $('#guofengPanel');
  if (!p) return;
  const t = GUOFENG_TYPES[i];
  p.innerHTML = `
    <div class="gname">${t.k} · ${t.n}${t.def ? ' <span class="pill">默认</span>' : ''}</div>
    <div class="grow">
      <div style="flex:1;min-width:250px">
        <div class="mini" style="line-height:1.85">
          <b>语体</b>：${t.voice}<br>
          <b>特征</b>：${t.trait}<br>
          <b>适合谁</b>：${t.who}<br>
          <b>怎么认出这一型</b>：${t.pick}
        </div>
      </div>
      <div class="gmeta"><div style="margin-top:2px">${t.note}</div></div>
    </div>`;
}

function buildGuofeng(){
  const box = $('#guofengChips');
  if (!box) return;
  GUOFENG_TYPES.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (t.def ? ' on' : '');
    b.textContent = t.k + ' · ' + t.n;
    b.onclick = () => {
      $$('#guofengChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      renderGuofengType(i);
    };
    box.appendChild(b);
  });
  renderGuofengType(GUOFENG_TYPES.findIndex(t => t.def));

  /* 古风外套能套哪四派——星级与 01 节体裁表用的是同一套记法 */
  const outer = $('#outerTable');
  if (outer) outer.innerHTML = GUOFENG_OUTER.map(o => `<tr>
    <td><b>${o.p}</b></td>
    <td class="mini">${starN(o.star)}</td>
    <td class="mini">${o.look}</td>
    <td class="mini" style="color:var(--faint)">${o.note}</td></tr>`).join('');

  const clash = $('#clashTable');
  if (clash) clash.innerHTML = GUOFENG_CLASH.map(c => `<tr>
    <td class="mini"><b class="v-bad">${c.a}</b></td>
    <td class="mini">${c.d}</td></tr>`).join('');

  const rules = $('#gfRuleTable');
  if (rules) rules.innerHTML = GUOFENG_RULES.map(r => `<tr>
    <td><b>${r.n}</b></td>
    <td><b>${r.t}</b></td>
    <td class="mini">${r.d}</td>
    <td class="mini" style="color:var(--red)">✗ ${r.bad}</td></tr>`).join('');

  const cats = $('#gfCatTable');
  if (cats) cats.innerHTML = GUOFENG_CATS.map(c => `<tr>
    <td><b>${c.n}</b></td>
    <td class="mini">${c.ex}</td>
    <td class="mini" style="color:var(--faint)">${c.why}</td></tr>`).join('');

  const take = $('#gfTakeList');
  if (take) take.innerHTML = GUOFENG_TAKE.map((t, i) => `${i + 1}. ${t}`).join('<br>');
}

/* ---------- 10 古风手艺 ---------- */
function buildGuofengCraft(){
  const season = $('#gfSeasonTable');
  if (season) season.innerHTML = GUOFENG_SEASON.map(s => `<tr>
    <td><b>${s.s}</b></td>
    <td class="mini mono">${s.m}</td>
    <td class="mini">${s.plant}</td>
    <td class="mini">${s.sky}</td>
    <td class="mini">${s.fest}</td></tr>`).join('');

  const traps = $('#gfTrapTable');
  if (traps) traps.innerHTML = GUOFENG_TRAPS.map(t => `<tr>
    <td class="mini"><b>${t.n}</b></td>
    <td class="mini">${t.d}</td></tr>`).join('');

  const hours = $('#gfHourTable');
  if (hours) hours.innerHTML = GUOFENG_HOUR.map(h => `<tr>
    <td class="mini"><b>${h.n}</b></td>
    <td class="mini">${h.t}</td></tr>`).join('');

  const dens = $('#gfDentTable');
  if (dens) dens.innerHTML = GUOFENG_DENS.map(d => `<tr>
    <td><b>${d.p}</b></td>
    <td class="mini mono">${d.r}</td>
    <td class="mini">${d.why}</td></tr>`).join('');

  const cost = $('#gfCostTable');
  if (cost) cost.innerHTML = GUOFENG_COST.map(c => `<tr>
    <td><b>${c.n}</b></td>
    <td class="mini">${c.d}</td>
    <td class="mini">${c.fix}</td></tr>`).join('');

  const sent = $('#gfSentTable');
  if (sent) sent.innerHTML = GUOFENG_SENT.map(s => `<tr>
    <td><b>${s.n}</b></td>
    <td class="mini mono" style="font-size:12px">${s.s}</td>
    <td class="mini">${s.d}${s.ex ? `<br><span style="color:var(--purple)">${s.ex}</span>` : ''}</td>
    <td class="mini" style="color:var(--red)">✗ ${s.warn}</td></tr>`).join('');

  const filler = $('#gfFillerBox');
  if (filler) filler.innerHTML = GUOFENG_FILLER.map(w => `<span class="pill">${w}</span>`).join(' ');

  const formula = $('#gfFormulaTable');
  if (formula) formula.innerHTML = GUOFENG_FORMULA.map((f, i) => `<tr>
    <td class="mono">✗ ${i + 1}</td>
    <td class="mini mono" style="font-size:12px">${f.s}</td></tr>`).join('');

  const modern = $('#gfModernTable');
  if (modern) modern.innerHTML = `
    <tr><td><b>现代词</b></td>
      <td class="mini">${GUOFENG_MODERN.w.join(' · ')}</td>
      <td class="mini">${GUOFENG_MODERN.d}</td></tr>
    <tr><td><b>明喻词</b></td>
      <td class="mini">${GUOFENG_MODERN.sim.no.join(' · ')}</td>
      <td class="mini">${GUOFENG_MODERN.sim.d}<br>
        <span style="color:var(--red)">✗ ${GUOFENG_MODERN.sim.bad}</span><br>
        <span style="color:var(--teal)">✓ ${GUOFENG_MODERN.sim.good}</span></td></tr>`;

  const clinic = $('#gfClinicTable');
  if (clinic) clinic.innerHTML = GUOFENG_CLINIC.map(c => `<tr>
    <td><b>${c.s}</b></td>
    <td class="mini">${c.p}</td>
    <td class="mini">${c.fix}</td></tr>`).join('');
}

/* ---------- 11 框景 ---------- */
function buildFrames(){
  const t = $('#frameTable');
  if (!t) return;
  t.innerHTML = FRAMES.map((f, i) => `<tr>
    <td class="mono">${i + 1}</td><td><b>${f.n}</b></td>
    <td class="mini">${f.d}</td></tr>`).join('');

  /* 古风专用三框景：与上面五个并存，不是替换关系 */
  const gf = $('#gfFrameTable');
  if (gf) gf.innerHTML = GUOFENG_FRAME.map(f => `<tr>
    <td><b>${f.n}</b></td>
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

  /* 叙事功能表：八首串行，功能只有起/承/转/合四种（L5 有断言） */
  const story = $('#storyTable');
  if (story){
    story.innerHTML = STORY_BEATS.map(b => `<tr>
      <td class="mono">${b.n}</td>
      <td><b class="v-ok">${b.fn}</b></td>
      <td class="mini">${b.what}</td>
      <td class="mini" style="color:var(--faint)">${b.q}</td></tr>`).join('');
  }

  /* 意象复现表：同一个词、两个位置、含义翻面 */
  const call = $('#imageTable');
  if (call){
    call.innerHTML = IMAGE_CALLBACK.map(c => `<tr>
      <td><b>${c.img}</b></td>
      <td class="mini">${c.first}</td>
      <td class="mini">${c.later}</td>
      <td class="mini" style="color:var(--faint)">${c.turn}</td></tr>`).join('');
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

  /* ---- 古风三项机检 ----
   * ① 万能词超限与重复：整首最多 3 个，且每个只能用一次
   * ② 五套公式句指纹：查的是特征词，完整句式查不了
   * ③ 物候互斥：整首出现两个不同季的强标志物
   *
   * ⚠ 这三项**只负责把嫌疑摆出来，不负责判断对错**。
   *   古风判据里真正决定好坏的那几条（文言浓度、四字短语数、单句意象数、
   *   用典是否需注释、每个意象是否真在干活）脚本一律不查。 */
  const gfFiller = [];
  GUOFENG_FILLER.forEach(w => {
    const c = ((text || '').match(new RegExp(w, 'g')) || []).length;
    if (c) gfFiller.push({ w, c });
  });

  const gfFormula = [];
  GF_FORMULA_MARK.forEach(m => {
    if ((text || '').match(m.re)) gfFormula.push({ id: m.id, d: m.d });
  });

  const gfSeasons = [];
  Object.keys(GF_SEASON_MARK).forEach(s => {
    const ws = GF_SEASON_MARK[s].filter(w => (text || '').indexOf(w) >= 0);
    if (ws.length) gfSeasons.push({ s, ws });
  });

  /* ④ 韵脚被埋：韵只能落在**分句的末字**上，而文言虚词最爱占这个位置。
   * 这是「文言浓度高 → 难懂 → 韵词大量减少」那条链上唯一能数的一环，
   * 也是本课唯一能给出"你还有几个位置真能押韵"的地方。 */
  const clauses = (text || '').split(/[\s，。！？；、,.!?;]+/).filter(Boolean);
  const buried = [];
  clauses.forEach(c => {
    const last = c[c.length - 1];
    if (GF_CLASSIC_END.indexOf(last) >= 0) buried.push(last);
  });

  return { lines, total, longest, short, banHits, abs, hooks,
           gfFiller, gfFormula, gfSeasons, gfClauses: clauses.length, gfBuried: buried };
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

  /* 韵脚空间：这一栏是"文言浓度高 → 韵词大量减少"那条链上唯一能量的一环。
     韵只能落在分句末字上；文言虚词占了末字，那个位置就押不了韵。 */
  const bur = r.gfBuried.length;
  html += row('韵脚空间', r.gfClauses
    ? (bur
        ? warn(`${r.gfClauses} 个分句里只剩 <b>${r.gfClauses - bur} 个能押韵</b>——`
          + `${bur} 个末字是文言虚词（${r.gfBuried.join('、')}），那些位置押不了`)
        : ok(`${r.gfClauses} 个分句，末字都没被文言虚词占住，韵脚空间完整`))
    : '—');

  /* 古风三项：只报嫌疑，不判对错。
     万能词有两个阈值——种类 ≤3 个，且每个只能用一次。 */
  const gfBad = [];
  if (r.gfFiller.length > 3) gfBad.push(`万能词 ${r.gfFiller.length} 个（上限 3 个）`);
  const rep = r.gfFiller.filter(f => f.c > 1);
  if (rep.length) gfBad.push(`万能词重复：${rep.map(f => f.w + '×' + f.c).join('、')}`);
  if (r.gfFormula.length) gfBad.push(`公式句指纹：${r.gfFormula.map(f => f.d).join('；')}`);
  if (r.gfSeasons.length > 1)
    gfBad.push(`物候跨季：${r.gfSeasons.map(x => x.s + '（' + x.ws.join('·') + '）').join(' / ')}`);
  html += row('古风嫌疑', gfBad.length
    ? warn(gfBad.join('；'))
    : ok('没撞上这四类——但文言浓度、四字短语数、单句意象数、用典是否需注释，仍要人读'));

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
