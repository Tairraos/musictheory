/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 交互装配层（js/sections.js）
 * --------------------------------------------------------------------------
 * 职责：把每一节课的 UI 装配起来——生成 chips / 表格 / 示意图容器，
 *       给每个按钮绑播放行为。按"第几节"分区，与页面 <section> 一一对应。
 *
 * 依赖：data.js / utils.js / svg.js / keyboard.js / playback.js / audio.js
 *       （都在运行时调用，加载顺序见 index.html 底部）
 * 被谁用：app.js（init 时逐个调用 build* 函数）
 *
 * 命名约定：buildXxx = 装配某一区界面并绑定事件；
 *           renderXxx = 只重画（不改绑定）；playXxx = 只发声。
 * ========================================================================== */

/* 各交互区"当前选中项"的索引（chip 高亮 + 播放时读取） */
let cadIdx = 0;    /* 第 06 节：选中的终止式 */
let sevIdx = 0;    /* 第 11 节：选中的七和弦 */
let modIdx = 0;    /* 第 11 节：选中的转调目标 */

/* ============ 第 00 节 · 先弄响一架钢琴 ============ */

/* buildSelects()：装配"调（主音）"和"调式"两个下拉框。
 * 改任一项 → 更新 state → 重绘两架键盘（亮键）→ refreshAll 重画依赖主音的图 */
function buildSelects(){
  const rs = $('#rootSel');
  PC.forEach((n, i) => { const o = document.createElement('option'); o.value = i; o.textContent = n; rs.appendChild(o); });
  rs.onchange = () => { state.root = +rs.value; renderKB(); refreshAll(); };
  const ms = $('#modeSel');
  ALL_MODES.forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.zh + ' · ' + m.en; ms.appendChild(o); });
  ms.onchange = () => { state.mode = ms.value; renderKB(); refreshAll(); };
}

/* 播放音阶（上行两个八度）/ 下行 */
$('#playScaleBtn').onclick = () => {
  const m = M_OF(state.mode), base = midiOct(state.root, 4), steps = [];
  for (let o = 0; o < 2; o++) m.semis.forEach((sv, i) => steps.push({ at: (o * m.semis.length + i) * 0.3, m: base + sv + o * 12, d: 1, g: 0.4 }));
  seq(steps);
};
$('#playScaleDownBtn').onclick = () => {
  const m = M_OF(state.mode), base = midiOct(state.root, 4), steps = [];
  for (let o = 1; o >= 0; o--) m.semis.slice().reverse().forEach((sv, i) => steps.push({ at: ((1 - o) * m.semis.length + i) * 0.28, m: base + sv + o * 12, d: 0.9, g: 0.4 }));
  seq(steps);
};

/* ============ 第 01 节 · 半音、全音与音程 ============ */

/* buildIV()：起点/终点两个下拉框（起点 C4–C5，终点到 C6）+ 试听按钮 */
function buildIV(){
  const r = $('#ivRoot'), t = $('#ivTop');
  for (let m = 60; m <= 72; m++){ const o = document.createElement('option'); o.value = m; o.textContent = noteName(m); r.appendChild(o); }
  for (let m = 60; m <= 84; m++){ const o = document.createElement('option'); o.value = m; o.textContent = noteName(m); t.appendChild(o); }
  r.value = 60; t.value = 64;
  r.onchange = t.onchange = showIV;
  /* 先后分开再同时发声——先听两个音各自什么样，再听它们叠在一起是什么颜色 */
  $('#ivPlay').onclick = () => { const a = +r.value, b = +t.value;
    seq([{ at: 0, m: a, d: 0.75, g: 0.4 }, { at: 0.7, m: b, d: 0.85, g: 0.4 }, { at: 1.5, m: a, d: 0.8, g: 0.3 }, { at: 1.5, m: b, d: 0.8, g: 0.3 }]); };
  showIV();
}

/* showIV()：显示当前选区的音程名称/半音数/听感。超过八度按八度内距离命名 */
function showIV(){
  const a = +$('#ivRoot').value, b = +$('#ivTop').value, d = Math.abs(b - a);
  const iv = INTERVALS.find(x => x.s === Math.min(12, d)) || INTERVALS[0];
  $('#ivName').textContent = iv.name;
  $('#ivSemi').textContent = iv.s + ' 个';
  $('#ivDesc').innerHTML = `<b>${noteName(a)} → ${noteName(b)}</b>：${iv.kw}。`;
}

/* buildIVTable()：十二个音程听感表，点一行从 C4 出发回听 */
function buildIVTable(){
  const tb = $('#ivTable');
  INTERVALS.forEach(iv => {
    const tr = document.createElement('tr'); tr.className = 'click';
    tr.innerHTML = `<td><b>${iv.name}</b></td><td class="mono">${iv.s}</td><td class="mini">${iv.kw}</td><td class="mini"><span class="tri">▶</span></td>`;
    tr.onclick = () => { const r = 60;
      seq([{ at: 0, m: r, d: 0.7, g: 0.38 }, { at: 0.65, m: r + iv.s, d: 0.9, g: 0.38 }, { at: 1.45, m: r, d: 0.8, g: 0.3 }, { at: 1.45, m: r + iv.s, d: 0.8, g: 0.3 }]); };
    tb.appendChild(tr);
  });
}

/* ============ 第 02–04、08 节 · data-play 播放按钮（大小调/五声/节奏对比） ============ */

/* 页面上所有 <button data-play="..."> 的统一入口。
 * 每个按钮只点亮自己那一节的示意图（LIT 映射），避免"弹大三却把小三的键也点亮"；
 * 带节拍器的对比（弱起/切分）在这里混入 c=1 的拍点步骤 */
document.querySelectorAll('[data-play]').forEach(b => {
  b.onclick = () => {
    const k = b.dataset.play, R = state.root;
    const LIT = {
      major: 'ladderMajor', majorChord: 'ladderMajor', sameUp: 'ladderMajor',
      minor: 'ladderMinor', minorChord: 'ladderMinor', sameDown: 'ladderMinor',
      penta: 'ladderPenta', pentaAdd: 'ladderPenta', pentaAdd7: 'ladderPenta',
      triadMaj: 'cmp-maj', triadMin: 'cmp-min', thirdOnly: 'chordCmp',
      anacrusis: '', anacrusisNo: '', straight: '', sync: '' };
    const sel = LIT[k];
    if (k === 'major'){ const s = []; [0,2,4,5,7,9,11].forEach((sv, i) => { s.push({ at: i * 0.3, m: midiOct(R, 4) + sv, d: 0.9, g: 0.4 }); }); seq(s, sel); }
    if (k === 'minor'){ const s = []; [0,2,3,5,7,8,10].forEach((sv, i) => { s.push({ at: i * 0.3, m: midiOct(R, 4) + sv, d: 0.9, g: 0.4 }); }); seq(s, sel); }
    if (k === 'triadMaj' || k === 'majorChord') seq([{ at: 0, m: midiOct(R, 4), d: 2.2, g: 0.4 }, { at: 0, m: midiOct(R, 4) + 4, d: 2.2, g: 0.32 }, { at: 0, m: midiOct(R, 4) + 7, d: 2.2, g: 0.32 }], sel);
    if (k === 'triadMin' || k === 'minorChord') seq([{ at: 0, m: midiOct(R, 4), d: 2.2, g: 0.4 }, { at: 0, m: midiOct(R, 4) + 3, d: 2.2, g: 0.32 }, { at: 0, m: midiOct(R, 4) + 7, d: 2.2, g: 0.32 }], sel);
    /* 同一条旋律两副面孔：级数完全一样（1 3 5 5 3 2 3 2 1），只换调式 */
    if (k === 'sameUp'){ seq([0,4,7,7,4,2,4,2,0].map((iv, i) => ({ at: i * 0.36, m: midiOct(R, 4) + iv, d: 0.85, g: 0.4 })), sel); }
    if (k === 'sameDown'){ seq([0,3,7,7,3,2,3,2,0].map((iv, i) => ({ at: i * 0.36, m: midiOct(R, 4) + iv, d: 0.9, g: 0.4 })), sel); }
    if (k === 'penta'){ seq([0,2,4,7,9,12].map((sv, i) => ({ at: i * 0.3, m: midiOct(R, 4) + sv, d: 0.95, g: 0.4 })), sel); }
    /* 借偏音 fa / si：在五声里塞回一个"会咬人"的音 */
    if (k === 'pentaAdd'){ seq([0,2,4,5,7,9,12].map((sv, i) => ({ at: i * 0.3, m: midiOct(R, 4) + sv, d: 0.95, g: 0.4 })), sel); }
    if (k === 'pentaAdd7'){ seq([0,2,4,7,9,11,12].map((sv, i) => ({ at: i * 0.3, m: midiOct(R, 4) + sv, d: 0.95, g: 0.4 })), sel); }
    /* 只弹那个三音：先大三后小三，1 个半音之差直接对比 */
    if (k === 'thirdOnly'){ const b = midiOct(R, 4);
      seq([{ at: 0, m: b, d: 0.5, g: 0.4 }, { at: 0.6, m: b + 4, d: 1.2, g: 0.42 }, { at: 2.0, m: b + 3, d: 1.2, g: 0.42 }], sel); }
    if (k === 'anacrusisNo' || k === 'anacrusis'){ /* 带节拍器对比：正拍进=踩在点上，弱起进=抢在点前 */
      const b = midiOct(R, 4), pre = (k === 'anacrusis');
      const st = [];
      for (let i = 0; i < 13; i++) st.push({ at: i * 0.4, c: 1, strong: (i % 2 === 0), dot: i % 8 });   /* 拍点一路陪到旋律结束 */
      [0,2,4,5,7,5,4,2].forEach((iv, i) => st.push({ at: 1.6 + (pre ? -0.2 : 0) + i * 0.4, m: b + iv, d: 0.4, g: 0.42 }));
      seq(st, sel); }
    if (k === 'straight' || k === 'sync'){ /* 带节拍器对比：正拍=和点重合，切分=落在两点之间 */
      const b = midiOct(R, 4), sy = (k === 'sync');
      const st = [];
      for (let i = 0; i < 9; i++) st.push({ at: i * 0.4, c: 1, strong: (i % 2 === 0), dot: i % 8 });
      [0,0,2,2,4,4,5,5].forEach((iv, i) => st.push({ at: i * 0.4 + (sy ? 0.2 : 0), m: b + iv, d: 0.3, g: 0.42 }));
      seq(st, sel); }
  };
});

/* 第 02 节 · 小调的三种形态 */
function buildMinor3(){
  const box = $('#minor3row');
  MINOR_FORMS.forEach(f => {
    const b = document.createElement('button'); b.className = 'btn sm'; b.innerHTML = '<span class="tri">▶</span> ' + f.name;
    b.onclick = () => { const base = midiOct(state.root, 4);
      seq(f.s.map((sv, i) => ({ at: i * 0.32, m: base + sv, d: 1, g: 0.4 })));
      $('#minor3note').innerHTML = `<b>${f.name}</b>：${f.d}`; };
    box.appendChild(b);
  });
}

/* ============ 第 03 节 · 七个调式 ============ */

function buildModes(){
  const box = $('#startChips');
  const white = [0,2,4,5,7,9,11];
  white.forEach((p, i) => {
    const b = document.createElement('button'); b.className = 'chip'; b.textContent = '从 ' + PC[p] + ' 开始';
    b.onclick = () => { stopAll(); $$('#startChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      const m = MODES[i];
      /* 图要跟着落音重画，否则方块上的音名和听到的对不上、点亮也会错位 */
      $('#modesLadder').innerHTML = modesLadderSVG(p); fixModesLegend();
      const base = midiOct(p, 4);
      seq(m.semis.map((sv, j) => ({ at: j * 0.32, m: base + sv, d: 1, g: 0.4 })), 'ml-' + m.id);
      $('#startInfo').innerHTML = `只用白键、从 <b>${PC[p]}</b> 起步 = <b>${m.zh}（${m.en}）</b>。${m.feat}。大概像：${m.ex}`;
    };
    box.appendChild(b);
  });
  $('#modesLadder').innerHTML = modesLadderSVG(0); fixModesLegend();
  /* 七个调式总览表，点一行播放并重画到对应落音 */
  const tb = $('#modesTable');
  MODES.forEach((m, i) => {
    const tr = document.createElement('tr'); tr.className = 'click';
    tr.innerHTML = `<td><b>${m.zh}</b><div class="mini">${m.en}</div></td><td class="mini">${m.feat}</td><td class="mini">${m.tag}</td><td class="mini">${m.ex}</td><td class="mini"><span class="tri">▶</span></td>`;
    tr.onclick = () => { const p = white[i];
      $('#modesLadder').innerHTML = modesLadderSVG(p); fixModesLegend();
      const base = midiOct(p, 4);
      seq(m.semis.map((sv, j) => ({ at: j * 0.3, m: base + sv, d: 0.95, g: 0.4 })), 'ml-' + m.id); };
    tb.appendChild(tr);
  });
}

/* ============ 第 04 节 · 五声音阶 ============ */

function buildPenta(){
  const box = $('#pentaChips');
  /* 宫商角徵羽：哪个音当主音，就叫什么调 */
  const g = [['宫', 0, 'do 主音 · 堂堂正正，国歌常用'], ['商', 2, 're 主音 · 清冷、叙事'], ['角', 4, 'mi 主音 · 柔、略暗'],
             ['徵', 7, 'sol 主音 · 明亮、欢快'], ['羽', 9, 'la 主音 · 含蓄软糯，民歌最多']];
  const nm2 = ['do', 're', 'mi', 'sol', 'la'];
  g.forEach((x, i) => {
    const b = document.createElement('button'); b.className = 'chip'; b.textContent = x[0] + '调（' + nm2[i] + ' 起）';
    b.onclick = () => { stopAll(); $$('#pentaChips .chip').forEach(c => c.classList.remove('on')); b.classList.add('on');
      const base = midiOct(x[1], 4);
      seq([0,2,4,7,9,12].map((sv, j) => ({ at: j * 0.32, m: base + sv, d: 1, g: 0.4 })));
      $('#pentaInfo').innerHTML = `<b>${x[0]}调</b>：${x[2]}`; };
    box.appendChild(b);
  });
}

/* 四个"特色音阶"的试听（都节 / 羽调 / 宫调 / 布鲁斯）。
   它们不是七个教会调式里的任何一个，而是各有地域与流派身份的调式——
   第 10 节的"文化与风格"维度要靠它们。 */
function buildExotic(){
  const box = $('#exoticChips'); if (!box) return;
  const list = [
    { id: 'hira',    use: '日本 · 动漫和风',   d: 'hirajoshi = 1 2 ♭3 5 ♭6。两个半音（小二、♭三）是它的辨识度——听起来"怪"，正是日本都节的关键。' },
    { id: 'pentaY',  use: '中国风 · 偏小调',   d: '羽调 = 1 2 4 6 7。同样是五声，但因为落在 la 上，听感含蓄偏暗，和徵调的明亮正好相反。' },
    { id: 'pentaG',  use: '中国风 · 明亮',     d: '宫调 = 1 2 3 5 6。江南、茉莉花、彩云追月都是它。中国风听起来"正"，是因为主音落在大调上。' },
    { id: 'blues',   use: '布鲁斯 · 摇滚',     d: '布鲁斯音阶 = 1 ♭3 4 ♭5 5 ♭7。那个 ♭5（降四级）是布鲁斯的灵魂——它天生想往上解决，撑起整首歌的张力。' },
  ];
  list.forEach((x, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = M_OF(x.id).zh;
    b.onclick = () => {
      stopAll();
      $$('#exoticChips .chip').forEach(c => c.classList.remove('on')); b.classList.add('on');
      const semis = M_OF(x.id).semis, base = midiOct(state.root, 4);
      /* 音阶上下行走两遍，听得出它和别的调式不是一回事 */
      const deg = [];
      for (let k = 0; k < 2; k++) for (let j = 0; j < semis.length; j++) deg.push(j);
      seq(deg.concat(deg.slice().reverse().slice(1, -1))
        .map((d2, j) => ({ at: j * 0.28, m: base + semis[d2], d: 0.66, g: 0.36 })));
      $('#exoticInfo').innerHTML = `<b>${M_OF(x.id).zh}</b>　${x.use}<br>${x.d}`;
    };
    box.appendChild(b);
  });
  const m0 = M_OF(list[0].id);
  $('#exoticInfo').innerHTML = `<b>${m0.zh}</b>　${list[0].use}<br>${list[0].d}`;
}

/* ============ 第 05 节 · 和弦与和声 ============ */

function buildChords(){
  $('#chordCmp').innerHTML = chordCmpSVG();
  const ck = $('#chordKey');
  MODES.forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.zh + '（' + m.en + '）'; ck.appendChild(o); });
  ck.value = 'ionian';
  ck.onchange = buildDeg;
  buildDeg();
}

/* buildDeg()：音级上的七和弦表（级数/和弦名/性质/功能角色），点一行弹 */
function buildDeg(){
  const mode = M_OF($('#chordKey').value), tb = $('#degTable'); tb.innerHTML = '';
  for (let d = 0; d < 7; d++){
    const c = triad(midiOct(0, 4), mode, d);
    const q = c.q === 'maj' ? '<span class="q maj">大三</span>' : c.q === 'min' ? '<span class="q min">小三</span>' : '<span class="q dim">减</span>';
    const nm3 = c.q === 'min' ? 'm' : c.q === 'dim' ? 'dim' : '';
    const tr = document.createElement('tr'); tr.className = 'click';
    tr.innerHTML = `<td class="mono"><b>${chordLabel(mode, d, c.q)}</b></td><td><b>${noteName(c.notes[0])}${nm3}</b></td>
      <td>${q}</td><td class="mini">${ROLE[d]}</td><td class="mini"><span class="tri">▶</span> 弹</td>`;
    tr.onclick = () => seq([{ at: 0, m: c.notes[0], d: 1.8, g: 0.4 }, { at: 0, m: c.notes[1], d: 1.8, g: 0.3 }, { at: 0, m: c.notes[2], d: 1.8, g: 0.3 }]);
    tb.appendChild(tr);
  }
}

/* renderStrip(p)：把一条和弦进行画成一排可点的和弦块（progStrip） */
function renderStrip(p){
  const mode = M_OF('ionian'), box = $('#progStrip'); box.innerHTML = '';
  p.d.forEach(d => {
    const c = triad(midiOct(0, 4), mode, d);
    const q = c.q === 'maj' ? 'maj' : c.q === 'min' ? 'min' : 'dim';
    const el = document.createElement('div');
    el.style.cssText = 'flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 4px;text-align:center;cursor:pointer';
    el.innerHTML = `<div class="mini mono">${chordLabel(mode, d, c.q)}</div>
      <div style="font-size:15px;font-weight:600;margin:2px 0">${noteName(c.notes[0])}${q === 'min' ? 'm' : q === 'dim' ? 'dim' : ''}</div>
      <span class="q ${q}">${q === 'maj' ? '大' : q === 'min' ? '小' : '减'}</span>`;
    el.onclick = () => seq([{ at: 0, m: c.notes[0], d: 1.6, g: 0.38 }, { at: 0, m: c.notes[1], d: 1.6, g: 0.3 }, { at: 0, m: c.notes[2], d: 1.6, g: 0.3 }]);
    box.appendChild(el);
  });
}

/* buildProg()：六个常用进行的 chips + 速度滑杆 + 循环开关 + 播放/停止 */
function buildProg(){
  const box = $('#progChips');
  PROGS.forEach((p, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on amber' : ''); b.textContent = p.n;
    b.onclick = () => { $$('#progChips .chip').forEach(c => c.classList.remove('on', 'amber')); b.classList.add('on', 'amber');
      progIdx = i; renderStrip(p); $('#progInfo').innerHTML = `<b>${p.n}</b> — ${p.t}`; };
    box.appendChild(b);
  });
  progIdx = 0; renderStrip(PROGS[0]);
  $('#progInfo').innerHTML = `<b>${PROGS[0].n}</b> — ${PROGS[0].t}`;
  $('#progBpm').oninput = e => { $('#progBpmVal').textContent = e.target.value; };
  $('#progLoop').onclick = e => { progLoop = !progLoop; e.target.classList.toggle('on'); };
  $('#progPlay').onclick = () => playProg(PROGS[progIdx]);
  $('#progStop').onclick = stopProg;
}

/* ============ 第 06 节 · 终止式与副歌抬升 ============ */

function buildCadence(){
  const box = $('#cadChips');
  CADENCES.forEach((c, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on amber' : ''); b.textContent = c.n;
    b.onclick = () => { $$('#cadChips .chip').forEach(x => x.classList.remove('on', 'amber')); b.classList.add('on', 'amber');
      cadIdx = i; renderCad(); };
    box.appendChild(b);
  });
  $('#cadPlay').onclick = () => playCadence(CADENCES[cadIdx]);
  $('#cadLoopStop').onclick = stopProg;
  /* 副歌抬升三连：主歌版（低八度）/ 副歌版（高八度）/ 连起来听。
     lit 用 h{i}v / h{i}h 区分两行方块，点亮不会错位 */
  $('#hookVerse').onclick = () => seq(HOOK.map((sv, i) => ({ at: i * 0.32, m: midiOct(state.root, 3) + sv, d: 0.9, g: 0.4, lit: 'h' + i + 'v' })), 'hookFig');
  $('#hookHigh').onclick = () => seq(HOOK.map((sv, i) => ({ at: i * 0.32, m: midiOct(state.root, 5) + sv, d: 0.9, g: 0.4, lit: 'h' + i + 'h' })), 'hookFig');
  $('#hookBoth').onclick = () => { stopProg(); const steps = [];
    HOOK.concat(HOOK).forEach((sv, i) => { const oct = i < HOOK.length ? 3 : 5;
      steps.push({ at: i * 0.32, m: midiOct(state.root, oct) + sv, d: i === HOOK.length - 1 ? 1.4 : 0.9, g: i < HOOK.length ? 0.36 : 0.44, lit: 'h' + (i % HOOK.length) + (i < HOOK.length ? 'v' : 'h') }); });
    seq(steps, 'hookFig'); };
  $('#hookFig').innerHTML = hookSVG(HOOK);
  renderCad();
}

/* renderCad()：当前终止式的和弦块（cadStrip） */
function renderCad(){
  const c = CADENCES[cadIdx], mode = M_OF('ionian'), box = $('#cadStrip'); box.innerHTML = '';
  c.d.forEach(d => {
    const ch = triad(midiOct(0, 4), mode, d);
    const q = ch.q === 'maj' ? 'maj' : ch.q === 'min' ? 'min' : 'dim';
    const el = document.createElement('div');
    el.style.cssText = 'flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 4px;text-align:center;cursor:pointer';
    el.innerHTML = `<div class="mini mono">${chordLabel(mode, d, ch.q)}</div>
      <div style="font-size:15px;font-weight:600;margin:2px 0">${noteName(ch.notes[0])}${q === 'min' ? 'm' : q === 'dim' ? 'dim' : ''}</div>
      <span class="q ${q}">${q === 'maj' ? '大' : q === 'min' ? '小' : '减'}</span>`;
    el.onclick = () => seq([{ at: 0, m: ch.notes[0], d: 1.6, g: 0.38 }, { at: 0, m: ch.notes[1], d: 1.6, g: 0.3 }, { at: 0, m: ch.notes[2], d: 1.6, g: 0.3 }]);
    box.appendChild(el);
  });
  $('#cadInfo').innerHTML = `<b>${c.n}</b> — ${c.t}`;
}

/* ============ 第 07 节 · 速度与节拍器 ============ */

/* playTempoMelody(t)：用速度术语的 BPM 播放同一段旋律 + 驱动 4 个拍点圆点 */
function playTempoMelody(t){
  const spb = 60 / t.b, mel = [0,2,4,5,7,5,4,2,0];
  seq(mel.map((iv, i) => ({ at: i * spb, m: midiOct(state.root, 4) + iv, d: spb * 0.9, g: 0.38 })), '');   /* 本节无示意图：不亮任何方块 */
  const dots = $$('#tempoBeats .beat');
  mel.forEach((_, i) => {
    setTimeout(() => { dots.forEach(d => d.classList.remove('hit')); dots[i % 4] && dots[i % 4].classList.add('hit'); }, 60 + i * spb * 1000);
  });
  setTimeout(() => dots.forEach(d => d.classList.remove('hit')), mel.length * spb * 1000 + 500);
}

/* setTempoInfo(t)：4 个拍点圆点 + 术语说明 */
function setTempoInfo(t){
  const box = $('#tempoBeats'); box.innerHTML = '';
  for (let i = 0; i < 4; i++){ const d = document.createElement('div'); d.className = 'beat' + (i === 0 ? ' strong' : ''); d.textContent = i + 1; box.appendChild(d); }
  $('#tempoInfo').innerHTML = `<b>${t.n}</b> · 约 ${t.b} BPM · ${t.k}`;
}

function buildTempo(){
  const box = $('#tempoChips');
  TEMPOS.forEach((t, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 2 ? ' on amber' : ''); b.textContent = t.n;
    b.onclick = () => { $$('#tempoChips .chip').forEach(c => c.classList.remove('on', 'amber')); b.classList.add('on', 'amber');
      setTempoInfo(t); playTempoMelody(t); };
    box.appendChild(b);
  });
  setTempoInfo(TEMPOS[2]);   /* 默认选中"行板"——本课重点 */
  buildMet();
}

/* renderMetDots()：节拍器的拍点圆点（4 拍时第 3 拍也标强） */
function renderMetDots(){
  const box = $('#metBeatsDots'), n = MET.beats; box.innerHTML = '';
  for (let i = 0; i < n; i++){ const d = document.createElement('div'); d.className = 'beat' + ((i === 0 || (n === 4 && i === 2)) ? ' strong' : ''); d.textContent = i + 1; box.appendChild(d); }
}

/* buildMet()：节拍器控制（每小节几拍 / BPM 滑杆 / 开始停止） */
function buildMet(){
  ['#metBeats', '#metBpm'].forEach(id => $(id).oninput = e => {
    MET.beats = +$('#metBeats').value; MET.bpm = +$('#metBpm').value;
    $('#metBpmVal').textContent = MET.bpm; renderMetDots(); });
  $('#metPlay').onclick = () => { MET.beats = +$('#metBeats').value; MET.bpm = +$('#metBpm').value; renderMetDots(); MET.start(); };
  $('#metStop').onclick = () => MET.stop();
  renderMetDots();
}

/* ============ 第 08 节 · 拍号与节奏 ============ */

function buildMeter(){
  const box = $('#meterChips');
  METERS.forEach((m, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on' : ''); b.textContent = m.t;
    b.onclick = () => { $$('#meterChips .chip').forEach(c => c.classList.remove('on')); b.classList.add('on');
      renderMeter(m); playMeter(m); };
    box.appendChild(b);
  });
  renderMeter(METERS[0]);
}

/* renderMeter(m)：按拍号画强弱拍点（1=强、0.5=次强、0=弱） */
function renderMeter(m){
  const box = $('#meterBeats'); box.innerHTML = '';
  m.b.forEach(v => {
    const d = document.createElement('div');
    d.className = 'beat' + (v >= 0.8 ? ' strong' : '');
    d.textContent = v >= 0.8 ? '强' : (v > 0 ? '·' : '');
    box.appendChild(d);
  });
  $('#meterInfo').innerHTML = `<b>${m.t}</b> · ${m.n}<br>${m.d}`;
}

/* playMeter(m)：用钢琴音把拍号的强弱"打"出来（强拍高、弱拍低） */
function playMeter(m){
  LIT_SEL = '';   /* 本节无示意图，不点亮任何方块 */
  kbUserPanned = false; kbAuto = true; kbHomeAll(500);
  const spb = 0.55, A = ac(), now = A.currentTime, dots = $$('#meterBeats .beat');
  m.b.forEach((v, i) => {
    if (v > 0){
      const strong = v >= 0.8;
      voice(strong ? 72 : 67, now + 0.05 + i * spb, strong ? 0.5 : 0.3, strong ? 0.4 : 0.26, 'piano');
    }
    setTimeout(() => { dots.forEach(d => d.classList.remove('hit')); dots[i] && dots[i].classList.add('hit'); }, 60 + i * spb * 1000);
  });
  setTimeout(() => { dots.forEach(d => d.classList.remove('hit')); kbAuto = false; kbHomeAll(500); }, m.b.length * spb * 1000 + 400);
}

/* ============ 第 09 节 · 移调与调号 ============ */

/* keyDesc(s)：按半音位移描述当前调号（F♯/G♭ 位单独处理——6 升 6 降最尴尬） */
function keyDesc(s){
  const pc = ((s % 12) + 12) % 12;
  let info = KEYINFO[pc];
  let body;
  if (pc === 6){ body = `<b>G♭/F♯ 大调</b>（相对 C 移了 ${s > 0 ? '+' : ''}${s} 半音） <span class="pill">6个升号 或 6个降号（最尴尬的位置）</span>`; }
  else { body = `<b>${info.k} 大调</b>（相对 C 移了 ${s > 0 ? '+' : ''}${s} 半音） <span class="pill">${info.s === 0 ? '无升降号' : info.s + '个' + info.t + '号'}</span>`; }
  return body;
}

function buildKey(){
  const lad = $('#keyLadder');
  function upd(v){ const s = +v;
    $('#keyNow').innerHTML = keyDesc(s);
    lad.innerHTML = melodySVG(KEY_MEL, { root: ((s % 12) + 12) % 12, step: 14 });
  }
  $('#keyShift').oninput = e => upd(e.target.value);
  upd(0);
  /* 按"第几个音"逐个点亮：同音的两个块（旋律首尾的 C）不会一起亮 */
  $('#keyPlay').onclick = () => { const s = (($('#keyShift').value % 12) + 12) % 12;
    seq(KEY_MEL.map((sv, i) => ({ at: i * 0.34, m: midiOct(s, 4) + sv, d: 0.9, g: 0.4, lit: 'mel' + i })), 'keyLadder'); };
  /* 常用调 chips：s = 相对 C 的半音位移（负号在这套数据里表示降号方向） */
  const KEYS = [{ n: 'C', s: 0, f: '', use: '最白、入门' }, { n: 'G', s: -5, f: 'F♯', use: '民谣吉他默认' },
    { n: 'D', s: 2, f: 'F♯ C♯', use: '小提琴、吉他常用' }, { n: 'A', s: -3, f: 'F♯ C♯ G♯', use: '古典、明亮' },
    { n: 'F', s: 5, f: 'B♭', use: '铜管、稍暗' }, { n: 'B♭', s: -2, f: 'B♭ E♭', use: '爵士乐队常见' }, { n: 'E♭', s: 3, f: 'B♭ E♭ A♭', use: '蓝调、爵士' }];
  const chips = $('#keyChips');
  KEYS.forEach(k => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = k.n + ' 大调';
    /* 换调时先停掉还在响的旋律，否则听起来像"自动播放" */
    b.onclick = () => { stopAll(); $('#keyShift').value = k.s; upd(k.s); }; chips.appendChild(b); });
  const tb = $('#keyTable');
  KEYS.forEach(k => { const tr = document.createElement('tr');
    const cnt = k.n === 'C' ? '0' : (k.f.split(' ').length);
    tr.innerHTML = `<td class="mono"><b>${k.n}</b></td><td class="mono">${k.f || '—'}</td><td class="mono">${cnt}</td><td class="mini">${k.use}</td>`;
    tb.appendChild(tr); });
}

/* ============ 第 10 节 · 音乐的十二种表达维度 ============ */

/* sceneCard(s)：造一张场景卡片。
 *   药丸标签里刻意把「听感速度」和「标称 BPM」分开摆——这正是本次修复的重点：
 *   之前只印 BPM，隐藏了真正决定快慢的音头密度，用户只能靠耳朵发现问题。 */
function sceneCard(s){
  const el = document.createElement('div'); el.className = 'scene';
  const m = M_OF(s.k), T = TEX[s.tex] || TEX.block;
  const rate = sceneRate(s);
  const octTxt = s.oct >= 5 ? '很高' : s.oct >= 4 ? '高' : s.oct >= 3 ? '中' : '低';
  el.innerHTML = `<h4><span class="dot" style="background:var(--${dimCol(s.g)})"></span>${s.t}</h4><p>${s.p}</p>
    <div class="pills"><span class="tag">${m.zh}</span>
    <span class="tag" title="每秒敲出多少个音头——这才是耳朵判断快慢的依据">听感 ${rate.toFixed(1)} 音头/秒</span>
    <span class="tag" title="和弦周期内的音头位置决定了密度">${T.zh}</span>
    <span class="tag">${s.b} BPM</span>
    <span class="tag">音区 ${octTxt}</span>
    ${s.noise && NOISES[s.noise] ? `<span class="tag">${NOISES[s.noise].tag}噪</span>` : ''}
    <span class="tag">${s.dyn < 0.2 ? '极轻' : s.dyn < 0.3 ? '轻' : s.dyn < 0.36 ? '中强' : '强'}</span></div>`;
  el.onclick = () => { scenePlay(s); el.classList.add('playing');
    setTimeout(() => el.classList.remove('playing'), sceneEvents(s).dur * 1000 + 300); };
  return el;
}

/* dimCol(g)：维度 id → 主题色变量名 */
function dimCol(g){ const d = DIMS.find(x => x.id === g); return (d ? d.col : 'gray'); }

function buildScenes(){
  /* 维度筛选条：12 个维度一次铺开会有 71 张卡片，所以给一个可点选的过滤器，
     默认显示「全部」，点某个维度只看它那一族 */
  const bar = $('#dimBar');
  const grid = $('#sceneGrid');
  const dimBox = $('#dimTable');
  let cur = 'all';
  const paint = () => {
    grid.innerHTML = '';
    SCENES.filter(s => cur === 'all' || s.g === cur).forEach(s => grid.appendChild(sceneCard(s)));
    $$('#dimBar .chip').forEach(c => c.classList.toggle('on', c.dataset.g === cur));
    $('#dimCount').textContent = cur === 'all'
      ? `${SCENES.length} 张卡片 · ${DIMS.length} 个维度`
      : `${SCENES.filter(s => s.g === cur).length} 张 · ${(DIMS.find(d => d.id === cur) || {}).zh || ''}`;
  };
  bar.innerHTML = `<button class="chip on" data-g="all">全部</button>` +
    DIMS.map(d => `<button class="chip" data-g="${d.id}">${d.zh}<span class="mini"> ${SCENES.filter(s => s.g === d.id).length}</span></button>`).join('');
  $$('#dimBar .chip').forEach(c => c.onclick = () => { stopAll(); cur = c.dataset.g; paint(); });
  paint();

  /* 维度拆解表：把"每个维度靠什么承载"明确写出来 */
  dimBox.innerHTML = DIMS.map(d => `<tr>
    <td class="mini"><span class="dot" style="background:var(--${d.col})"></span> <b>${d.zh}</b></td>
    <td class="mini">${d.q}</td>
    <td class="mini">${d.by}</td>
    <td class="mono">${SCENES.filter(s => s.g === d.id).length}</td></tr>`).join('');

  /* 通用配方表（数据在 data.js 的 RECIPES） */
  $('#recipeTable').innerHTML = RECIPES.map(r => '<tr>' + r.map(c => '<td class="mini">' + c + '</td>').join('') + '</tr>').join('');
}

/* ============ 第 11 节 · 七和弦与转调 ============ */

function buildSeventh(){
  const box = $('#sevChips');
  SEVENTHS.forEach((c, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on' : ''); b.textContent = c.n;
    b.onclick = () => { stopAll(); $$('#sevChips .chip').forEach(x => x.classList.remove('on')); b.classList.add('on');
      sevIdx = i; $('#sevStrip').innerHTML = sevSVG(c.s); $('#sevInfo').innerHTML = `<b>${c.n}</b>　拼：${c.role}　${c.t}`; };
    box.appendChild(b);
  });
  $('#sevStrip').innerHTML = sevSVG(SEVENTHS[0].s);
  $('#sevInfo').innerHTML = `<b>${SEVENTHS[0].n}</b>　拼：${SEVENTHS[0].role}　${SEVENTHS[0].t}`;
  $('#sevPlay').onclick = () => { const c = SEVENTHS[sevIdx], b = midiOct(state.root, 4);
    seq(c.s.map(sv => ({ at: 0, m: b + sv, d: 2.2, g: 0.36 })), 'sevStrip'); };
  $('#sevArp').onclick = () => { const c = SEVENTHS[sevIdx], b = midiOct(state.root, 4);
    /* 半音偏移要先加基准音高再播放，否则 0/4/7/11 会被当成 MIDI 0/4/7/11（低到听不见） */
    seq(c.s.map(sv => b + sv).concat([b + c.s[0] + 12]).map((sv, i) => ({ at: i * 0.24, m: sv, d: 1, g: 0.4, lit: 'sv' + (i < c.s.length ? i : 0) })), 'sevStrip'); };
}

function buildMod(){
  const box = $('#modChips');
  MODS.forEach((m, i) => {
    const b = document.createElement('button'); b.className = 'chip' + (i === 0 ? ' on amber' : ''); b.textContent = m.n;
    b.onclick = () => { stopAll(); $$('#modChips .chip').forEach(x => x.classList.remove('on', 'amber')); b.classList.add('on', 'amber');
      modIdx = i; $('#modLadder').innerHTML = melodySVG(MOD_MEL, { root: ((m.s % 12) + 12) % 12, step: 14 });
      $('#modInfo').innerHTML = `<b>${m.n}</b>　${m.t}`; };
    box.appendChild(b);
  });
  $('#modLadder').innerHTML = melodySVG(MOD_MEL, { root: 0, step: 14 });
  $('#modInfo').innerHTML = `<b>${MODS[0].n}</b>　${MODS[0].t}`;
  $('#modPlay').onclick = () => { const s = ((MODS[modIdx].s % 12) + 12) % 12;
    seq(MOD_MEL.map((sv, i) => ({ at: i * 0.34, m: midiOct(s, 4) + sv, d: 0.9, g: 0.4, lit: 'mel' + i })), 'modLadder'); };
  /* "连起来听"：先 C 后 D（副歌升全音），两段图共用 mel{i} 点亮位 */
  $('#modBoth').onclick = () => { stopAll();
    const st = [];
    [0,2].forEach((root, k) => { MOD_MEL.forEach((sv, i) => {
      st.push({ at: k * (MOD_MEL.length * 0.34 + 0.4) + i * 0.34, m: midiOct(root, 4) + sv, d: 0.9, g: 0.4, lit: 'mel' + i }); }); });
    seq(st, 'modLadder'); };
}

/* ============ 第 12 节 · 速查表 ============ */

/* buildCheat()：术语表 + 顺口溜 + 自查清单（数据在 data.js） */
function buildCheat(){
  $('#termTable').innerHTML = TERMS.map(t => `<tr><td style="width:172px"><b>${t[0]}</b></td><td class="mini">${t[1]}</td></tr>`).join('');
  $('#checkList').innerHTML = CHECKLIST.map(r => `<tr><td style="width:230px"><b>${r[0]}</b></td><td class="mini">${r[1]}</td></tr>`).join('');
}

/* ============ 换调联动 ============ */

/* refreshAll()：主音/调式变化后，重画所有依赖 state.root 的静态示意图。
 * 由 rootSel / modeSel 的 onchange 触发 */
function refreshAll(){
  $('#ladderMajor').innerHTML = ladderSVG([0,2,4,5,7,9,11,12], { root: state.root, main: '#534AB7' });
  $('#ladderMinor').innerHTML = ladderSVG([0,2,3,5,7,8,10,12], { root: state.root, main: '#185FA5', color: '#E6F1FB', txt: '#0C447C' });
  $('#ladderPenta').innerHTML = ladderSVG([0,2,4,7,9,12], { root: state.root, main: '#0F6E56', color: '#E1F5EE', txt: '#085041', step: 16, H: 286 });
  $('#chordCmp').innerHTML = chordCmpSVG();
  /* 节奏对比演示的拍点圆点：8 个，偶数号为重拍 */
  const rb = $('#rhythmDots'); rb.innerHTML = '';
  for (let i = 0; i < 8; i++){ const d = document.createElement('div'); d.className = 'beat' + (i % 2 === 0 ? ' strong' : ''); d.textContent = i + 1; rb.appendChild(d); }
}
