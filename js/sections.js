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
let sevIdx = 0;    /* 第 15 节：选中的七和弦 */
let modIdx = 0;    /* 第 15 节：选中的转调目标 */

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

/* 「国风 · 和风」音阶试听。
   它们不是七个教会调式里的任何一个，而是各有地域与流派身份的调式——
   第 13 节的"文化与风格"维度要靠它们。
   讲解要点：
     · 中国五声：同一组五个音，换起音就是不同调式（宫商角徵羽）
     · 中国七声：在五声上加两个偏音（清角/变徵、变宫/闰），请谁进屋决定气质
     · 日本音阶：小泉文夫的发现——两段四度骨架 + 中间音位置不同，
       都节音阶的中间音放得最低，所以半音挨得最近，"日本味"就从这里来 */
function buildExotic(){
  const box = $('#exoticChips'); if (!box) return;
  const list = [
    { id: 'hira',    use: '日本 · 都节',       d: '都节（平调子）= 1 2 ♭3 5 ♭6。小泉文夫发现：日本音阶都是「两个四度骨架 + 一个中间音」，都节把中间音放得最低，所以两个半音挨得最近——这就是一耳朵听出"日本"的原因。《樱花》就是它。' },
    { id: 'jpKumoi', use: '日本 · 云井',       d: '云井调子 = 1 2 ♭3 5 6。和都节只差一个音（♭6 换成自然 6），但那半个音一换，幽深就变成了清朗——琴曲里同一个旋律换个调子，情绪就整个翻转。' },
    { id: 'jpInsen', use: '日本 · 阴音阶',     d: '阴旋 = 1 ♭2 4 5 ♭7。低小二度在主音正下方，禅意、空灵、像风铃。和风的"静"多半是这个音阶给的。' },
    { id: 'jpRyukyu',use: '日本 · 琉球',       d: '琉球音阶 = 1 3 4 5 ♭7。中间音放得最高，所以最明亮——冲绳音乐（《岛唄》）的那种阳光感就是它。' },
    { id: 'cnZhi',   use: '中国 · 徵调',       d: '徵调 = 1 2 4 5 6。中国民歌里出现率最高的调式（徵调 > 宫调 > 羽调 > 商调 > 角调），质朴、厚道，一开口就是"我们村"的语气。' },
    { id: 'cnYu',    use: '中国 · 羽调',       d: '羽调 = 1 2 4 6 7。落在 la 上，听感沉思而含蓄——同样的五个音，起点一换，就从明亮变成了忧郁。' },
    { id: 'cnQingyue', use: '中国 · 清乐七声', d: '清乐七声 = 1 2 3 4 5 6 7。在五声上加了清角(fa) 和变宫(si)——请这两位偏音进屋，气氛就从"古雅"变成了"明快"，戏曲和江南丝竹多用它。' },
    { id: 'cnYanyue',use: '中国 · 燕乐/苦音', d: '燕乐七声 = 1 2 3 4 5 6 ♭7。用清角 + 闰（把 si 降成 ♭si），这就是秦腔"苦音"、粤剧"乙反"的核心——听起来悲、泣、说不出的委屈。' },
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

/* 《沧海一声笑》演示：同一串音，换个「家」就是另一个调式。
   主旋律级数（简谱）la-sol-mi-re-do = 6 5 3 2 1 …，纯五声，不出现 fa 与 si。
   黄霑自己说过是「宫商角徵羽反过来用」。

   ⚠ 这里有个容易搞错的地方，务必看清：
     **宫调式与羽调式的音集是不同的**（宫 = {do,re,mi,sol,la}，
     羽 = {la,si,do,mi,re}），所以"同一串音既是宫调式又是羽调式"字面上不成立。
     真正发生的是：这一串**物理音高** [9,7,4,2,0]（= la sol mi re do），
     听众可以把它听成
       · 以 do 为家 → 宫调式的下行（落音恰是主音 do）
       · 以 la 为家 → 徵调式的下行（la 是徵调的支撑音）
     而"以 la 为家"的听感（暗、沉思）恰恰接近羽调式的色彩——
     这就是该曲调式归属存在「宫／羽」两种学术记法的根源：
     一个从**记谱的主音**出发，一个从**旋律的支点**出发。

     所以这个演示做的是：同一条旋律，**用不同的和声重心去框它**——
     底下铺 do 就是宫调式的明亮，铺 la 就是徵调式的暗。
     音符一个没变，变的是「哪个音是家」。这正是耳朵赋予调式意义的方式。 */
function buildCanghai(){
  const box = $('#canghaiChips'); if (!box) return;
  /* 主旋律级数（简谱）：首句 6 5 3 2 1 | 3 2 1 6 5 | 5 6 5 6 1 2 3 5 6 5 3 2 1 2 */
  const MEL = [6, 5, 3, 2, 1, 3, 2, 1, 6, 5, 5, 6, 5, 6, 1, 2, 3, 5, 6, 5, 3, 2, 1, 2];
  /* 简谱级数 → 实际半音（以 do=0 的宫调式为基准） */
  const GONG = { 1: 0, 2: 2, 3: 4, 5: 7, 6: 9 };
  const melody = MEL.map(d => GONG[d]);

  /* 两种重心：同一条旋律，底下铺不同的音 */
  const play = (home, zh, note) => {
    stopAll();
    const base = midiOct(state.root, 4);
    const deg = [];
    for (let k = 0; k < 2; k++) for (let j = 0; j < melody.length; j++) deg.push(j);
    /* 旋律：两个版本一模一样 */
    deg.forEach((d2, j) => {
      seq([{ at: j * 0.26, m: base + melody[d2], d: 0.6, g: 0.3 }]);
    });
    /* 底音（「家」）：宫调式版铺 do，徵调式版铺 la（低八度） */
    seq([{ at: 0, m: base + home - 12, d: melody.length * 0.26 * 2, g: 0.22 }]);
    $('#canghaiInfo').innerHTML = `<b>${zh}</b>　${note}`;
  };

  const mk = (label, home, zh, note) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = label;
    b.onclick = () => {
      $$('#canghaiChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      play(home, zh, note);
    };
    box.appendChild(b);
    return b;
  };

  const NOTE_GONG = '同一条 la–sol–mi–re–do，下面铺 do。落音是主音 do，听感明亮、正、开阔——这是「宫」的说法。';
  const NOTE_ZHI  = '旋律一个音没改，只是底下换成 la。落音从「主音」变成了「徵音」，' +
                   '听感立刻暗下来、沉思起来——学界把这首曲子的另一种记法归到羽调式的色彩，' +
                   '正是因为这个「以 la 为支点」的感觉。';

  const b1 = mk('重心在 do · 宫调式', 0, '宫调式（重心在 do）', NOTE_GONG);
  const b2 = mk('重心在 la · 徵调式', 9, '徵调式（重心在 la）', NOTE_ZHI);
  b1.classList.add('on');
  /* 装配时**不自动播放**——与 buildExotic 保持一致。
     早先这里调了 play()，后果有二：
       ① 页面一打开就发声（浏览器通常也会拦掉自动播放，白白触发一次）；
       ② play() 开头会 stopAll() → killBuses() → ac()，
          把 AudioContext 在页面加载时就建了出来——
          这违背了 audio.js 里"第一次播放/点键时才建"的懒建设计。
     只填说明文字，等用户点 chip 再响。 */
  $('#canghaiInfo').innerHTML = `<b>宫调式（重心在 do）</b>　${NOTE_GONG}`;
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

/* ============ 第 10 节 · 曲式：12 小节布鲁斯 ============ */

/* buildForm()：一张图 + 两个播放键 + 一张对照表。
 * 图的全部说服力在于"和声的颜色"和"词的行"画在同一张图上（见 svg.js 的 bluesGridSVG），
 * 所以这里只负责把图挂上去，不重新组织版面。 */
function buildForm(){
  if (!$('#bluesFig')) return;
  $('#bluesFig').innerHTML = bluesGridSVG();
  $('#bluesPlay').onclick = () => playBlues(true);
  $('#bluesHarm').onclick = () => playBlues(false);
  $('#formTable').innerHTML = FORM_TABLE.map(f => `<tr>
    <td><b>${f.n}</b><br><span class="pill">${f.tag}</span></td>
    <td class="mini">${f.lines}</td>
    <td class="mini mono" style="font-size:11px">${f.h}</td>
    <td class="mini">${f.how}</td></tr>`).join('');
}

/* ============ 第 11 节 · 词曲咬合 ============ */

/* 本节两个"当前选中"的索引：倒字例句、重音版本（只用于高亮与播放） */
let lyrIdx = 0;
let stIdx = 0;

/* renderLyricFig()：重画声调对照图（换例句时调用） */
function renderLyricFig(){
  const L = LYRIC_LINES[lyrIdx];
  $('#lyricFig').innerHTML = toneLineSVG(L.w);
  const tones = L.w.map(w => TONE_SHAPE[w[1]] ? TONE_SHAPE[w[1]].qu.slice(0, 2) : '轻声');
  /* 声调序列是这一节最该被看见的一行字：4-3-4-4-1-2-1-2 念起来就是那句词 */
  $('#lyricInfo').innerHTML = `例句取自 <b>${L.src}</b>。` +
    `声调序列 <span class="mono">${L.w.map(w => w[1] === 0 ? '轻' : w[1]).join('-')}</span>（${tones.join('、')}）。` +
    `上半是顺字版——旋律的每一次滑动都和字的调值同向，唱出来就是这句话；` +
    `下半把每一根线翻过来，字就"倒"了，听到的很可能是别的字。`;
}

/* 时间轴的一格：一个字占 left% 到 (left+width)%，宽度即时值。
 * 全部用百分比，所以窄屏也不会错位（时间轴是等分的，不需要像素精度）。 */
function lyrBox(ch, at, dur, total, cls){
  const L = at / total * 100, W = dur / total * 100;
  return `<div class="lyr-b${cls ? ' ' + cls : ''}" style="left:${L}%;width:${W}%">${ch}</div>`;
}

/* renderStress()：重音对位的三条时间轴。
 * 三条的音高完全一样，只有方块的位置和宽度不同——差别一眼可见、一耳可听。 */
function renderStress(){
  const S = LYRIC_STRESS, TOT = 5;
  $('#stressFig').innerHTML = S.vers.map((v, i) => `
    <div class="lyr-row">
      <div class="lyr-lab">${v.n}</div>
      <div class="lyr-tl" style="--beats:${TOT}">${S.w.map((w, k) => lyrBox(w[0], v.at[k], v.dur[k], TOT, i === 2 ? 'bad' : (i === 0 ? 'good' : ''))).join('')}</div>
    </div>`).join('');
  $('#stressInfo').innerHTML = `<b>${S.vers[stIdx].n}</b> · ${S.src}<br>${S.vers[stIdx].note}`;
}

/* renderPhrase()：一字一音 / 拖腔 两条时间轴（同样 4 拍，同样的字） */
function renderPhrase(){
  const P = LYRIC_PHRASE, TOT = P.beats, n = P.w.length, head = 0.22;
  const a = P.w.map((w, i) => lyrBox(w[0], i * (TOT / n), TOT / n, TOT)).join('');
  const b = P.w.map((w, i) => i < n - 1
    ? lyrBox(w[0], i * head, head, TOT)
    : lyrBox(w[0], (n - 1) * head, TOT - (n - 1) * head, TOT, 'long')).join('');
  $('#phraseFig').innerHTML = `
    <div class="lyr-row"><div class="lyr-lab">说话版 · 一字一音</div><div class="lyr-tl" style="--beats:${TOT}">${a}</div></div>
    <div class="lyr-row"><div class="lyr-lab">抒情版 · 末字拖腔</div><div class="lyr-tl" style="--beats:${TOT}">${b}</div></div>`;
  $('#phraseInfo').innerHTML = `同样八个字、同样四拍。上面每字半拍，密度和说话一样，所以听着像念词；` +
    `下面把七个字挤进不到一拍半，"摇"字一个人吃掉两拍半，还拐了三个音——` +
    `<b>一个字配几个音符，本身就是一种表情</b>。`;
}

/* renderBreath()：气口。每句一行，方块数＝字数，宽度＝每个字分到的时间。
 * 判定只用一个数：每字几拍（8 拍 ÷ 字数）。 */
function renderBreath(){
  const B = LYRIC_BREATH, TOT = B.beats;
  $('#breathFig').innerHTML = B.lines.map(L => {
    const per = TOT / L.n;
    const cls = per < 0.75 ? 'bad' : per < 0.9 ? 'mid' : 'good';
    const word = per < 0.75 ? '赶' : per < 0.9 ? '正常' : '从容';
    const boxes = Array.from({ length: L.n }, (_, i) => lyrBox(L.line.replace(/\s/g, '')[i] || '·', i * per, per, TOT)).join('');
    return `<div class="lyr-row">
      <div class="lyr-lab">${L.t}　<span class="mini">${per.toFixed(2)} 拍/字</span></div>
      <div class="lyr-tl" style="--beats:${TOT}">${boxes}</div>
      <div class="lyr-verdict ${cls}">${word}</div>
    </div>
    <div class="mini" style="margin:-2px 0 8px 132px">${L.line}　<span style="color:var(--faint)">${L.src}</span></div>`;
  }).join('');
  $('#breathInfo').innerHTML = `同样一口气（8 拍，76 BPM ≈ 6.3 秒），字数越多每个字分到的时间越少。` +
    `<b>低于 0.75 拍/字</b>（约 0.6 秒/字）就开始赶，后半句换不上气——` +
    `这时删字永远比加气有效：把"城市里的屋顶"删成"城市屋顶"，一句话立刻顺了。`;
}

/* buildLyric()：四个可听模块 + 两张表。
 * 数据全部来自 data.js（RHYMES / TONE_SHAPE / LYRIC_LINES / LYRIC_STRESS /
 * LYRIC_PHRASE / LYRIC_BREATH / ALBUM_RHYMES），本函数只管装配与绑定。 */
function buildLyric(){
  if (!$('#lyricChips')) return;

  /* ① 倒字 —— 选例句 + 顺/倒两个播放键 */
  const box = $('#lyricChips');
  LYRIC_LINES.forEach((L, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = L.t;
    b.onclick = () => {
      stopAll();
      $$('#lyricChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); lyrIdx = i; renderLyricFig();
    };
    box.appendChild(b);
  });
  $('#lyricFit').onclick = () => lyricTone(LYRIC_LINES[lyrIdx].w, false);
  $('#lyricFlip').onclick = () => lyricTone(LYRIC_LINES[lyrIdx].w, true);
  renderLyricFig();

  /* ② 重音 —— 三个版本各一个 chip，点了就播，同时高亮时间轴那一行 */
  const sBox = $('#stressChips');
  LYRIC_STRESS.vers.forEach((v, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = v.n;
    b.onclick = () => {
      $$('#stressChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); stIdx = i; renderStress(); lyricStress(v);
    };
    sBox.appendChild(b);
  });
  renderStress();

  /* ③ 一字一音 / 拖腔 */
  $('#phraseSpeech').onclick = () => lyricPhrase('speech');
  $('#phraseSing').onclick = () => lyricPhrase('sing');
  renderPhrase();

  /* ④ 气口 —— 三句各一个 chip，播完看方块宽度 */
  const bBox = $('#breathChips');
  LYRIC_BREATH.lines.forEach((L, i) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = `${L.n} 字`;
    b.onclick = () => {
      $$('#breathChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); lyricBreath(L);
    };
    bBox.appendChild(b);
  });
  renderBreath();

  /* ⑤ 十三辙表：响度用五颗圆点表示，一眼看出哪几辙能唱高音 */
  $('#rhymeTable').innerHTML = RHYMES.map(r => `<tr>
    <td><b>${r.n}</b></td>
    <td class="mini mono">${r.fm}</td>
    <td class="dots-cell"><span class="ld">${'●'.repeat(r.lo)}</span><span class="ld off">${'●'.repeat(5 - r.lo)}</span></td>
    <td class="mini">${r.mood}</td>
    <td class="mini">${r.ex}</td></tr>`).join('');

  /* ⑥ 专辑辙口分布：把"辙"从知识点变成创作工具 */
  $('#albumTable').innerHTML = ALBUM_RHYMES.map(a => `<tr>
    <td><b>${a.t}</b></td><td><span class="pill">${a.r}</span></td>
    <td class="mini">${a.note}</td></tr>`).join('');

  /* ⑦ 语言计时法 —— 三条轴一直同屏显示，这是这一卡的全部说服力：
     光听会以为是"节奏不同"，并排看才知道是"每格多宽"不同 */
  buildLangTiming();

  /* ⑧ 粤语九声 + 入声 */
  buildCanton();

  /* ⑨ 人声舒适音区 */
  buildVoiceRange();
}

/* ============ 第 11 节 ⑨ · 人声舒适音区 ============ */

/* buildVoiceRange()：音区条 + 分区表 + 三档音区对照。
 *   分区表的音高区间现取现算（VOICE_RANGE 里存的是半音数），
 *   显示时才换成音名——这样区间与 MIDI 的对应关系永远只有一处定义。 */
function buildVoiceRange(){
  if (!$('#voiceFig')) return;
  const V = VOICE_RANGE;

  $('#voiceFig').innerHTML = voiceRangeSVG();

  /* 分区表：音高区间现算成音名 */
  const tb = $('#voiceTable');
  if (tb){
    tb.innerHTML = V.zones.map(z => {
      const loN = noteName(midiOct(0, 4) + z.lo), hiN = noteName(midiOct(0, 4) + z.hi);
      return `<tr>
        <td><b>${z.n}</b></td>
        <td class="mini mono">${loN} – ${hiN}</td>
        <td class="mini">${z.feat}</td>
        <td class="mini">${z.feel}</td>
        <td class="mini">${z.use}</td>
        <td class="mini">${z.risk}</td></tr>`;
    }).join('');
  }

  /* 换声点的说明：音名现算（不写死），名称里已经带了音高就不再重复加一遍 */
  const bi = $('#voiceBreak');
  if (bi){
    const bn = noteName(midiOct(0, 4) + V.breakNote.lo) + '–' + noteName(midiOct(0, 4) + V.breakNote.hi);
    const name = V.breakNote.name.includes('约') ? V.breakNote.name
      : `${V.breakNote.name}（约 ${bn}）`;
    bi.innerHTML = `<b>${name}</b>：${V.breakNote.why}`;
  }

  /* 三档音区对照：三个 chip，点了就播 */
  const cbox = $('#voiceChips');
  V.demo.rows.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = r.n;
    b.onclick = () => {
      $$('#voiceChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      $('#voiceInfo').innerHTML = `<b>${r.n}</b>（${r.tag}）<br><span class="mini">${r.say}</span>`;
      playVoiceRange(r);
    };
    cbox.appendChild(b);
  });
  $('#voiceInfo').innerHTML =
    `<b>${V.demo.rows[0].n}</b>（${V.demo.rows[0].tag}）<br><span class="mini">${V.demo.rows[0].say}</span>`;
}

/* ============ 第 11 节 ⑦ · 语言计时法 ============ */

/* 三条时间轴的说明文字：写在代码里而不是 data.js，
 * 因为它们是"解释"，不是"数据"——改阈值不需要动它们，改数据却必须重读一遍 */
const LANG_NOTE = {
  zh: '8 拍，8 个字，每个字正好一格。中文里<b>一个字就是时间的一个单位</b>——' +
      '字数定了，句子的长度基本就定了。所以写中文词的第一件事是数<b>字数</b>。',
  'en-s': '8 拍，8 个音节，可只有 4 个重音吃到大格，另外 4 个被压进缝里。' +
      '英文的时间单位是<b>重音</b>，不是音节——重音等距，中间的虚词能塞几个塞几个。',
  'en-l': '还是 8 拍、还是那 4 个重音、还是同样的四个位置，却塞进了 11 个音节。' +
      '多出来的 was / gon / na 几乎听不见，但整句立刻口语了。' +
      '<b>英文写得松不松，看的是重音数，不是字数</b>——照中文的字数直觉写，一定唱不动。',
};

/* 窄到写不进字的音节，框里就不写字，画成细条（class sq）——细条本身就是"被压缩"的样子。
 * 阈值 0.30 拍：桌面上时间轴约 92px/拍，0.30 拍 ≈ 27px，"the" 11px 字刚好放得下；
 * 再窄就只能露出半个词，比留空更像画错了。悬停有 title，能查到是哪个词。 */
const NARROW_BEAT = 0.30;
const countSq = id => (LANG_TIMING.rows.find(r => r.id === id) || { syl: [] })
  .syl.filter(s => !s.s && s.d < NARROW_BEAT).length;

function buildLangTiming(){
  const L = LANG_TIMING, TOT = L.beats;
  if (!$('#langFig')) return;

  $('#langFig').innerHTML = L.rows.map(r => {
    const boxes = r.syl.map(s => {
      const sq = !s.s && s.d < NARROW_BEAT;
      const cls = s.s ? 'str' : (r.id === 'zh' ? '' : 'wk') + (sq ? ' sq' : '');
      return `<div class="lyr-b ${cls}" style="left:${s.b / TOT * 100}%;width:${s.d / TOT * 100}%" title="${s.t}">${sq ? '' : s.t}</div>`;
    }).join('');
    return `<div class="lyr-row">
        <div class="lyr-lab">${r.n}</div>
        <div class="lyr-tl" style="--beats:${TOT}">${boxes}</div>
      </div>
      <div class="mini" style="margin:-4px 0 10px 140px;color:var(--faint)">${r.sub}</div>`;
  }).join('');

  /* 细条这件事必须解释一次，否则读者会以为是没画出来 */
  $('#langFig').innerHTML += `<div class="mini" style="margin:2px 0 10px 140px;color:var(--faint)">` +
    `↕ 窄到写不进字的音节画成细条，悬停可查是哪个词——` +
    `第二行 ${countSq('en-s')} 条，第三行 ${countSq('en-l')} 条，拍数完全一样。</div>`;

  const box = $('#langChips');
  L.rows.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = r.chip;
    b.onclick = () => {
      $$('#langChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      $('#langInfo').innerHTML = LANG_NOTE[r.id] || '';
      langTiming(r.id);
    };
    box.appendChild(b);
  });
  $('#langInfo').innerHTML = LANG_NOTE.zh;
}

/* ============ 第 11 节 ⑧ · 粤语 ============ */

function buildCanton(){
  const C = CANTON, TOT = C.beats;
  if (!$('#cantonFig')) return;

  /* 九声表："能不能拖长"只有两档，所以用文字而不是圆点——这不是程度问题，是能不能 */
  $('#cantonTable').innerHTML = C.tones.map(t => `<tr>
    <td><b>${t.n}</b></td>
    <td class="mini mono">${t.v}</td>
    <td>${t.ex}</td>
    <td>${t.hold
      ? '<span class="q maj">可以</span>'
      : '<span class="q dim">不可以</span>'}</td></tr>`).join('');

  /* 两条时间轴：同一个字、同一个音高，只有长度不同 */
  const row = (lab, d, cls) => `<div class="lyr-row">
      <div class="lyr-lab">${lab}</div>
      <div class="lyr-tl" style="--beats:${TOT}">
        <div class="lyr-b ${cls}" style="left:0;width:${d / TOT * 100}%">${C.demo.ch}</div>
        ${d < TOT ? `<div class="lyr-b wk" style="left:${d / TOT * 100}%;width:${(1 - d / TOT) * 100}%">停住</div>` : ''}
      </div>
    </div>`;
  $('#cantonFig').innerHTML = row(C.demo.err.label, C.demo.err.d, 'bad') +
                              row(C.demo.ok.label, C.demo.ok.d, 'good');

  $('#cantonErr').onclick = () => { toast(C.demo.err.note); cantonPlay(true); };
  $('#cantonOk').onclick = () => { toast(C.demo.ok.note); cantonPlay(false); };
}


/* ============ 第 12 节 · 移调与调号 ============ */

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

/* ============ 第 13 节 · 音乐的十三种表达维度 ============ */

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
  /* 维度筛选条：13 个维度一次铺开会有 91 张卡片，所以给一个可点选的过滤器，
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

/* ============ 第 15 节 · 七和弦与转调 ============ */

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

/* ============ 第 16 节 · 速查表 ============ */

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

/* ============ 第 09 节 · 律动：节奏型怎么设计 ============ */

/* 当前选中的律动行（只用于重画与播放） */
let groIdx = 0;

/* renderGroove()：换织体时重画网格 + 三行读数。
 * 读数的三个数字全部算出来，没有一个是手写的：
 *   每拍音头 = hits.length ÷ 和弦拍数（texSpan(T)，普通织体才是 2）
 *   听感密度 = grooveRate()——和场景卡片用的是同一个函数
 *   音长     = TEX.dur */
function renderGroove(){
  const G = GROOVE, row = G.rows[groIdx], T = TEX[row.tex] || TEX.block;
  const span = texSpan(T);
  $('#grooveGrid').innerHTML = grooveGridSVG(row);
  const perBeat = (T.hits.length / span).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  $('#grooveInfo').innerHTML =
    `<b>${row.n}</b>（织体 <span class="mono">${row.tex}</span>）· ` +
    `每拍 <b>${perBeat}</b> 个音头 · 听感 <b>${grooveRate(row).toFixed(2)}</b> 音头/秒 · ` +
    `每个音长 <b>${T.dur}</b> 拍<br>` +
    `<span class="mini">重音落在：${row.accent}</span><br>` +
    `<span class="mini">性格：${row.feel} · 什么时候用：${row.when}</span>`;
}

function buildGroove(){
  if (!$('#grooveGrid')) return;
  const box = $('#grooveChips');
  GROOVE.rows.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = r.n + ' · ' + r.tex;
    b.onclick = () => {
      $$('#grooveChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); groIdx = i; renderGroove();
    };
    box.appendChild(b);
  });
  renderGroove();
  $('#groovePlay').onclick = () => playGroove(GROOVE.rows[groIdx]);
  $('#grooveTable').innerHTML = GROOVE_PICK.map(p => {
    const T = TEX[p.tex] || TEX.block;
    return `<tr>
      <td class="mini">${p.need}</td>
      <td><b>${T.zh}</b><br><span class="pill mono">${p.tex}</span></td>
      <td class="mini mono">${T.hits.length} / ${texSpan(T)} 拍<br><span style="color:#6F6C62">${grooveRate({ tex:p.tex }).toFixed(2)} 音头/秒</span></td>
      <td class="mini">${p.why}</td></tr>`;
  }).join('');
}

/* texTableRate(tex)：总览表用的密度。
 *   总览表要让 15 行**横向可比**，所以统一折算到 REF_BPM，
 *   而不是各用各的 BPM（真实卡片的密度得按它自己的 BPM 算，那是 sceneRate）。
 *   公式与 sceneRate 同源：hits ÷ (和弦周期秒数)。 */
const TEX_REF_BPM = 100;
function texTableRate(tex){
  const T = TEX[tex] || TEX.block;
  return T.hits.length * TEX_REF_BPM / (texSpan(T) * 60);
}

/* buildTexTable()：第 09 节 ④ 的 15 行织体总览表。
 *   音头数与和弦周期**全部现取现算**，一个数字都不写死——
 *   写两遍就一定会走散（这已经发生过好几次）。
 *   密度用 texTableRate()，与 sceneRate() 同一个公式、同一个 texSpan()。 */
function buildTexTable(){
  const box = $('#texTable'); if (!box) return;
  box.innerHTML = TEX_PICK.map(p => {
    const T = TEX[p.tex] || TEX.block;
    const span = texSpan(T);
    return `<tr>
      <td><b>${T.zh}</b><br><span class="pill mono">${p.tex}</span></td>
      <td class="mini mono">${T.hits.length}</td>
      <td class="mini mono">${span} 拍</td>
      <td class="mini mono">${texTableRate(p.tex).toFixed(2)}<br><span style="color:#6F6C62">音头/秒</span></td>
      <td class="mini">${p.feel}</td>
      <td class="mini">${p.use}</td></tr>`;
  }).join('');
}

/* ============ 第 10 节 ② · shuffle ============ */

let shufIdx = 0;

/* renderShuffle()：图是两行同时画的（对比不能靠切换看），
 * chip 只决定"放哪一版"，info 里的两个音长是从 offs 现算的，不写死。 */
function renderShuffle(){
  const k = SHUFFLE.kinds[shufIdx];
  const a = k.offs[1].toFixed(2), b = (1 - k.offs[1]).toFixed(2);
  const pct = Math.round(k.offs[1] * 100);
  const late = k.offs[1] - 0.5;
  const tail = late < 1e-9 ? '正好均分' : `比均分晚 <b>${late.toFixed(2)}</b> 拍`;
  $('#shuffleInfo').innerHTML =
    `<b>${k.n}</b>：${k.say}<br>` +
    `<span class="mini">第 1 下 <b>${a}</b> 拍 · 第 2 下 <b>${b}</b> 拍 · ` +
    `第 2 下落在一拍的 <b>${pct}%</b> 处（${tail}）</span>`;
}

function buildShuffle(){
  if (!$('#shuffleFig')) return;
  $('#shuffleFig').innerHTML = shuffleFigSVG();
  const box = $('#shuffleChips');
  SHUFFLE.kinds.forEach((k, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = k.chip;
    b.onclick = () => {
      $$('#shuffleChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); shufIdx = i; renderShuffle();
    };
    box.appendChild(b);
  });
  renderShuffle();
  $('#shufflePlay').onclick = () => playShuffle(SHUFFLE.kinds[shufIdx]);
}

/* ============ 第 14 节 · 配器：谁唱主、谁铺底 ============ */

let ensIdx = 0;

/* renderEnsemble()：换编制时重画"旋律条"与三层分工表。
 * 旋律条刻意复用歌词那套百分比时间轴（.lyr-tl/.lyr-b）——
 * 它就是"谁占多少时间"的图，和这一节要说的"三层各占一格"是同一件事。 */
function renderEnsemble(){
  const E = ENSEMBLE, row = E.rows[ensIdx], TOT = E.beats;
  const lead = row.layers.find(l => l.mel) || row.layers[0];
  const base = midiOct(0, lead.oct);
  $('#ensMel').innerHTML = `<div class="lyr-row">
      <div class="lyr-lab">旋律 · ${TOT} 拍</div>
      <div class="lyr-tl" style="--beats:${TOT}">` +
    E.melody.map(n =>
      `<div class="lyr-b str" style="left:${n.b / TOT * 100}%;width:${n.d / TOT * 100}%">${noteName(base + n.s)}</div>`
    ).join('') + `</div></div>`;

  /* 三层分工表：音区 / 密度 / 起音——判断"会不会打架"就看这三列 */
  const perSec = L => (L.mel ? E.melody.length : (L.hit.length * E.prog.length))
                    / (E.beats * 60 / E.bpm);
  $('#ensTable').innerHTML = row.layers.map(L => {
    const t = TONES[L.tone] || TONES.piano;
    const lo = noteName(midiOct(0, L.oct));
    return `<tr>
      <td><b>${L.role}</b></td>
      <td>${t.tag} <span class="pill mono">${L.tone}</span></td>
      <td class="mini mono">${lo} 起</td>
      <td class="mini mono">${perSec(L).toFixed(1)} 音头/秒</td>
      <td class="mini mono">${Math.round(t.atk * 1000)} ms</td></tr>`;
  }).join('');

  $('#ensInfo').innerHTML = `<b>${row.n}</b>（${row.chip}）<br><span class="mini">${row.say}</span>`;
}

function buildEnsemble(){
  if (!$('#ensMel')) return;
  const box = $('#ensChips');
  ENSEMBLE.rows.forEach((r, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = r.chip;
    b.onclick = () => {
      $$('#ensChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); ensIdx = i; renderEnsemble();
    };
    box.appendChild(b);
  });
  renderEnsemble();
  $('#ensPlay').onclick = () => playEnsemble(ENSEMBLE.rows[ensIdx]);

  /* 专辑收尾：曲线 + 一句判据 */
  if ($('#albumFig')) $('#albumFig').innerHTML = albumCurveSVG();
  if ($('#albumWhy')) $('#albumWhy').innerHTML = ALBUM_CURVE.why;
}

/* ==================== 第 14 节 ⑤ 动机怎么生成 ==================== */
let genIdx = 0;

/* renderMotifGen()：换生成法 → 图重画 + 三行读数。
 * 图必须重画（这是本节的论点所在）：五种手法改的东西不一样，
 * 图不改的话等于把"改了什么"藏起来了。 */
function renderMotifGen(){
  const GEN = MOTIF_GEN, m = GEN.methods[genIdx];
  if ($('#motifGenFig')) $('#motifGenFig').innerHTML = motifGenSVG(m);
  if ($('#motifGenInfo')){
    $('#motifGenInfo').innerHTML =
      `<b>${m.n}</b>：${m.how}<br>` +
      `<span class="mini">听出来是：${m.hear}</span><br>` +
      `<span class="mini">${m.say}</span>`;
  }
}

function buildMotifGen(){
  if (!$('#motifGenChips')) return;
  const GEN = MOTIF_GEN;
  const box = $('#motifGenChips');
  GEN.methods.forEach((m, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = m.chip;
    b.onclick = () => {
      $$('#motifGenChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); genIdx = i; renderMotifGen();
    };
    box.appendChild(b);
  });
  renderMotifGen();

  /* 两个播放按钮：一个是母动机，一个是当前生成结果——
     先听母动机、再听结果，"改了什么"才听得出来。 */
  if ($('#motifGenPlayBase')) $('#motifGenPlayBase').onclick = () => playMotifGen(GEN.base);
  if ($('#motifGenPlay')) $('#motifGenPlay').onclick = () => playMotifGen(GEN.methods[genIdx]);

  const tb = $('#motifGenTable');
  if (tb){
    tb.innerHTML = GEN.methods.map(m => `<tr>
      <td><b>${m.n}</b></td>
      <td class="mini">${m.how}</td>
      <td class="mini">${m.hear}</td>
      <td class="mini">${m.risk}</td></tr>`).join('');
  }
}

/* ==================== 第 14 节 ④ 跨曲的那根线 ==================== */
let motIdx = 0;

/* renderMotif()：换版本只改两行文字——图不变，因为图说的就是"轮廓没变"。
 * 这一点很关键：如果换版本图也跟着变，就等于在图里承认"改了轮廓"。 */
function renderMotif(){
  const V = MOTIF.versions[motIdx];
  $('#motifInfo').innerHTML =
    `<b>${V.n}</b>（${V.chip}，${V.layers} 层）<br><span class="mini">${V.say}</span>`;
}

function buildMotif(){
  if (!$('#motifChips')) return;

  const box = $('#motifChips');
  MOTIF.versions.forEach((v, i) => {
    const b = document.createElement('button');
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = v.chip;
    b.onclick = () => {
      $$('#motifChips .chip').forEach(c => c.classList.remove('on'));
      b.classList.add('on'); motIdx = i; renderMotif();
    };
    box.appendChild(b);
  });
  renderMotif();

  if ($('#motifFig')) $('#motifFig').innerHTML = motifContourSVG();
  if ($('#motifPlay')) $('#motifPlay').onclick = () => playMotif(MOTIF.versions[motIdx]);

  const tb = $('#motifTable');
  if (tb){
    tb.innerHTML = MOTIF_HANDLES.map(h => `<tr>
      <td><b>${h.n}</b></td>
      <td class="mini">${h.how}</td>
      <td class="mini">${h.hear}</td>
      <td class="mini" style="color:var(--coral)">${h.wrong}</td></tr>`).join('');
  }
}

/* ============ 窄屏表格横滑（两页共用） ============
 * th 是 nowrap 的，多列表格的 min-content 在 390px 下会超过容器，
 * 表格被撑出去，**最后一列直接看不见**。
 * 做法：给每张表套一层 .tscroll，窄屏时表格拿到 min-width，
 * 在自己那一层里横滑。桌面端不生效，所以看不出差别。
 * 必须在所有 build* 之后再跑——表格是装配时才生成的。 */
function wrapTables(){
  $$('table').forEach(t => {
    if (t.parentNode && t.parentNode.classList.contains('tscroll')) return;
    const w = document.createElement('div');
    /* 四列以上才算"宽表"：两三列的表在窄屏本来就放得下，
       硬撑宽只会让整页到处都要横滑。 */
    w.className = 'tscroll' + (t.querySelectorAll('thead th').length >= 4 ? ' wide' : '');
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });
}
