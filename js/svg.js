/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 示意图层（js/svg.js）
 * --------------------------------------------------------------------------
 * 职责：所有 SVG 教学示意图的生成器。每个函数返回一段 SVG 字符串，
 *       由 sections.js 塞进对应容器（innerHTML）。
 *       方块上带 data-note / data-lit 属性——播放时 playback.js 靠这些属性
 *       找到对应方块点亮（珊瑚红 = 正在发声）。
 *
 * 依赖：data.js（MODES / PC / M_OF）、utils.js（midiOct / noteName / spellUp /
 *       LETN / NATN / FLATPC）、app.js（state.root，运行时读取）
 * 被谁用：sections.js / app.js（refreshAll）
 *
 * 约定：所有图 viewBox 宽 680；横轴含义分两种——
 *       ladder 系 = 十二个半音格（+ 1 个八度列），纵轴 = 音高
 *       melody 系 = 第几个音（出现顺序），纵轴 = 音高
 * ========================================================================== */

/* ============ SVG ============ */
/* X0 = 左侧留白（给半音刻度标签），TOTW = 图形区总宽 */
const X0 = 40, TOTW = 600;

/* 单条音阶图：13 列（含八度），横轴是半音格，块的高低就是音高。
 * opts: root(主音pc) / main(主色) / color / txt / step / H / top
 * 每个 rect 带 data-note="MIDI号"，供播放时定位点亮 */
function ladderSVG(semis, opts){
  opts = opts || {};
  const step = opts.step || 15, top = opts.top || 54, H = opts.H || 272;
  const LCELL = TOTW / 13, BW = 44;                 /* 13 列：0–11 半音 + 1 个八度列 */
  const cx = sv => X0 + LCELL * (sv % 12) + (sv >= 12 ? LCELL : 0) + LCELL / 2;
  const base = midiOct(opts.root || 0, 4);
  const main = opts.main || '#534AB7';
  let s = `<svg viewBox="0 0 680 ${H}" width="100%" class="ladder" role="img">`;
  /* 顶部半音刻度（12 个音名） */
  for (let p = 0; p < 12; p++){
    s += `<text x="${X0 + LCELL * p + LCELL / 2}" y="24" font-size="10" text-anchor="middle" fill="#6F6C62">${PC[p]}</text>`;
  }
  /* 底部基准线 */
  s += `<line x1="${X0}" y1="${top + (12 * step) + 8}" x2="${X0 + TOTW}" y2="${top + (12 * step) + 8}" stroke="#E5E2D9" stroke-width="1"/>`;
  semis.forEach((sv, i) => {
    const isOct = (sv >= 12);
    const y = top + (11 - sv) * step, x = cx(sv);
    const isRoot = (i === 0 || isOct);                       /* 主音（含八度）用主色实心 */
    const fill = isRoot ? main : (opts.color || '#EEEDFE');
    const stroke = isRoot ? main : '#534AB7';
    const txt = isRoot ? '#fff' : (opts.txt || '#3C3489');
    s += `<rect data-note="${base + sv}" x="${x - BW / 2}" y="${y - 11}" width="${BW}" height="22" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="0.7"/>`;
    s += `<text x="${x}" y="${y + 1}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="${txt}">${noteName(base + sv)}</text>`;
    /* 方块下方的级数（八度列显示 1） */
    s += `<text x="${x}" y="${top + 12 * step + 24}" font-size="10" text-anchor="middle" fill="${isRoot ? main : '#6F6C62'}">${isOct ? 1 : (i + 1)}</text>`;
  });
  s += '</svg>';
  return s;
}

/* 旋律图：横轴是"第几个音"（出现顺序），纵轴是音高，重复音也能画。
 * 每个方块带 data-lit="mel{i}"——按"第几个音"精确定位，同音的多个块不会一起亮 */
function melodySVG(mel, opts){
  opts = opts || {};
  const step = opts.step || 15, top = opts.top || 54, H = opts.H || 272;
  const n = mel.length, CW = TOTW / n, BW = Math.min(54, CW - 8);
  const base = midiOct(opts.root || 0, 4);
  const main = opts.main || '#534AB7';
  const DEG = [0,2,4,5,7,9,11];                            /* 大调级数 → 半音，用于反标级数 */
  let s = `<svg viewBox="0 0 680 ${H}" width="100%" class="ladder" role="img">`;
  mel.forEach((sv, i) => {
    s += `<text x="${X0 + CW * i + CW / 2}" y="24" font-size="10" text-anchor="middle" fill="#6F6C62">${i + 1}</text>`;
  });
  s += `<line x1="${X0}" y1="${top + (12 * step) + 8}" x2="${X0 + TOTW}" y2="${top + (12 * step) + 8}" stroke="#E5E2D9" stroke-width="1"/>`;
  mel.forEach((sv, i) => {
    const y = top + (11 - sv) * step, x = X0 + CW * i + CW / 2;
    const deg = DEG.indexOf(sv) + 1;
    s += `<rect data-note="${base + sv}" data-lit="mel${i}" x="${x - BW / 2}" y="${y - 11}" width="${BW}" height="22" rx="5" fill="${main}" stroke="${main}" stroke-width="0.7"/>`;
    s += `<text x="${x}" y="${y + 1}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#fff">${noteName(base + sv)}</text>`;
    s += `<text x="${x}" y="${top + 12 * step + 24}" font-size="10" text-anchor="middle" fill="${main}">${deg}</text>`;
  });
  s += '</svg>';
  return s;
}

/* 七调式图：左侧独立标签列 + 右侧音高网格；root 决定落音（播放时重画以对齐点亮）。
 * 每行一个调式：与大调相同的音 = 灰，改动过的音 = 紫（调式的性格就在这），
 * 正在发声由 CSS .lit 覆盖成珊瑚红 */
function modesLadderSVG(root){
  const S = 2.4, TOP = 88, ROW = 46, GX = 160, GC = 40, BW = 32;
  const yFor = p => 26 - p * S;
  const R = root || 0, base = midiOct(R, 4);
  let s = `<svg viewBox="0 0 680 442" width="100%" class="ladder" role="img">`;
  s += `<text x="40" y="26" font-size="14" font-weight="600" fill="#2C2C2A">同一串白键，七种起点（紫 = 相对大调改动过的音，红 = 正在发声）</text>`;
  s += `<text x="40" y="64" font-size="10" fill="#6F6C62">调式 ↓</text>`;
  for (let p = 0; p < 12; p++){
    s += `<text x="${GX + GC * p + GC / 2}" y="64" font-size="11" text-anchor="middle" fill="#6F6C62">${PC[p]}</text>`;
  }
  MODES.forEach((m, ri) => {
    const T = TOP + ri * ROW;
    s += `<text x="40" y="${T + 14}" font-size="12" font-weight="500" fill="#444441">${m.zh}</text>`;
    s += `<text x="40" y="${T + 30}" font-size="10" fill="#6F6C62">${m.en}</text>`;
    s += `<line x1="${GX}" y1="${T + 41}" x2="640" y2="${T + 41}" stroke="#EDEBE4" stroke-width="1"/>`;
    s += `<g id="ml-${m.id}">`;
    m.semis.forEach((sv, i) => {
      const y = T + yFor(sv), x = GX + GC * sv + GC / 2 - BW / 2;
      const diff = (sv !== MODES[0].semis[i]);
      /* 未改动=灰，改动=紫；正在发声由 .lit 覆盖成珊瑚红 */
      const fill = diff ? '#E4E1F7' : '#D3D1C7', stroke = diff ? '#7F77DD' : '#6F6C62', txt = diff ? '#3C3489' : '#444441';
      s += `<rect data-note="${base + sv}" x="${x}" y="${y}" width="${BW}" height="14" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${diff ? 1.1 : 0.7}"/>`;
      s += `<text x="${x + BW / 2}" y="${y + 7}" font-size="10" font-weight="${diff ? 500 : 400}" text-anchor="middle" dominant-baseline="central" fill="${txt}">${i + 1}</text>`;
    });
    s += `</g>`;
  });
  /* 图例三段：与大调相同（灰）/ 改动过的音（紫）/ 正在发声（红） */
  s += `<rect x="40" y="418" width="14" height="10" rx="2" fill="#D3D1C7" stroke="#6F6C62" stroke-width="0.6"/>`;
  s += `<text x="62" y="427" font-size="11" fill="#57554E">与大调相同</text>`;
  s += `<rect x="160" y="418" width="14" height="10" rx="2" fill="#E4E1F7" stroke="#7F77DD" stroke-width="0.9"/>`;
  s += `<text x="182" y="427" font-size="11" fill="#57554E" id="mlLegTxt">相对大调改动过的音（调式的性格就在这）　纵轴即音高</text>`;
  /* 红方块 + "正在发声" 打成一组的用意：文字末端只能用 getBBox() 实测（字宽估不准），
     渲染完再把整组平移到"文字末端 + 30px"，初始 x 只是占位 */
  s += `<g id="mlLegGrp" transform="translate(0,0)">`;
  s += `<rect x="452" y="418" width="14" height="10" rx="2" fill="#D85A30" stroke="#993C1D" stroke-width="0.6"/>`;
  s += `<text x="474" y="427" font-size="11" fill="#57554E">正在发声</text>`;
  s += `</g>`;
  s += '</svg>';
  return s;
}

/* 把图例里的红方块组推到"纵轴即音高"末端右侧 30px。
   依赖 getBBox() 实测文字宽度（估不准），拿不到就静默放弃（位置用初始占位值） */
function fixModesLegend(){
  const t = document.getElementById('mlLegTxt'), g = document.getElementById('mlLegGrp');
  if (!t || !g) return;
  let bb = null; try { bb = t.getBBox(); } catch (e) { return; }
  if (!bb || !bb.width) return;
  g.setAttribute('transform', 'translate(' + (bb.x + bb.width + 30 - 452) + ',0)');
}

/* 大三 vs 小三 对比图：左右同坐标系，根音与五音横向对齐，只有三音上下差一格。
 * 音名拼写由 utils.spellUp 完成（大三度=E，小三度=E♭，不能写成 D♯） */
function chordCmpSVG(){
  const R = state.root;
  const rName = FLATPC[R], tMaj = spellUp(R, 2, 4), tMin = spellUp(R, 2, 3), fName = spellUp(R, 4, 7);
  const P0 = 200, STEP = 17;
  const cy = sv => P0 - sv * STEP;
  const LX = 48, RX = 394, BW = 238;
  let s = `<svg viewBox="0 0 680 262" width="100%" class="ladder" role="img">`;
  s += `<text x="${LX}" y="30" font-size="14" font-weight="600" fill="#0F6E56">大三和弦（三音距根音 4 个半音）</text>`;
  s += `<text x="${RX}" y="30" font-size="14" font-weight="600" fill="#185FA5">小三和弦（三音距根音 3 个半音）</text>`;
  /* 对齐参考线：根音层与五音层跨两列打通，证明这两根"没动" */
  s += `<line x1="${LX}" y1="${cy(0)}" x2="${RX + BW}" y2="${cy(0)}" stroke="#E5E2D9" stroke-width="1" stroke-dasharray="4 4"/>`;
  s += `<line x1="${LX}" y1="${cy(7)}" x2="${RX + BW}" y2="${cy(7)}" stroke="#E5E2D9" stroke-width="1" stroke-dasharray="4 4"/>`;
  const cols = [
    { x: LX, id: 'cmp-maj', rows: [[0,'根音',rName],[4,'三音',tMaj],[7,'五音',fName]], bg: '#E1F5EE', st: '#0F6E56', tx: '#04342C' },
    { x: RX, id: 'cmp-min', rows: [[0,'根音',rName],[3,'三音',tMin],[7,'五音',fName]], bg: '#E6F1FB', st: '#185FA5', tx: '#042C53' },
  ];
  cols.forEach(c => {
    s += `<g id="${c.id}">`;
    c.rows.forEach(([sv, role, nm]) => {
      const y = cy(sv) - 13;
      const isThird = (role === '三音');
      s += `<rect data-note="${midiOct(R, 4) + sv}" x="${c.x}" y="${y}" width="${BW}" height="26" rx="8" fill="${c.bg}" stroke="${c.st}" stroke-width="${isThird ? 1.4 : 0.7}"/>`;
      s += `<text x="${c.x + 14}" y="${y + 13}" font-size="12" font-weight="500" dominant-baseline="central" fill="${c.tx}">${role}</text>`;
      s += `<text x="${c.x + BW / 2}" y="${y + 13}" font-size="11" text-anchor="middle" dominant-baseline="central" fill="${c.st}">距根音 ${sv} 个半音</text>`;
      s += `<text x="${c.x + BW - 14}" y="${y + 13}" font-size="12" font-weight="500" text-anchor="end" dominant-baseline="central" fill="${c.tx}">${nm}</text>`;
    });
    s += `</g>`;
  });
  /* 三音的位移：一条斜虚线 + 双向箭头，说明"同一个三音，往下挪了半格" */
  s += `<line x1="${LX + BW}" y1="${cy(4)}" x2="${RX}" y2="${cy(3)}" stroke="#BA7517" stroke-width="1" stroke-dasharray="4 3"/>`;
  s += `<line x1="341" y1="${cy(4) - 9}" x2="341" y2="${cy(3) + 9}" stroke="#BA7517" stroke-width="1.2"/>`;
  s += `<path d="M341 ${cy(4) - 11} l-4 6 h8 z" fill="#BA7517"/>`;
  s += `<path d="M341 ${cy(3) + 11} l-4 -6 h8 z" fill="#BA7517"/>`;
  s += `<text x="341" y="${cy(4) - 18}" font-size="11" text-anchor="middle" fill="#854F0B">只低 1 个半音</text>`;
  /* 半音刻度 */
  s += `<text x="40" y="${cy(0) + 4}" font-size="10" text-anchor="end" fill="#6F6C62">0</text>`;
  s += `<text x="40" y="${cy(4) + 4}" font-size="10" text-anchor="end" fill="#6F6C62">4</text>`;
  s += `<text x="40" y="${cy(3) + 4}" font-size="10" text-anchor="end" fill="#6F6C62">3</text>`;
  s += `<text x="40" y="${cy(7) + 4}" font-size="10" text-anchor="end" fill="#6F6C62">7</text>`;
  s += `<text x="40" y="${cy(0) - 10}" font-size="10" text-anchor="end" fill="#6F6C62">半音↓</text>`;
  s += `<text x="${LX}" y="248" font-size="11" fill="#57554E">虚线横贯两列的地方，就是"根音"和"五音"的位置——它们一模一样，只有三音那根条动了。</text>`;
  s += '</svg>';
  return s;
}

/* 副歌抬升对比图：同一句旋律，上下平移一个八度；标签独立左列，避免压到方块。
 * 高八度行 = midiOct(0,5)，低八度行 = midiOct(0,3)，行内 data-lit 区分 h{i}h / h{i}v */
function hookSVG(mel){
  const LX = 190, RX = 640, CW = (RX - LX) / mel.length, BW = 54, S = 9;
  const yV = sv => 250 - sv * S;             /* 主歌（低） */
  const yH = sv => yV(sv) - 12 * S;          /* 副歌（高一个八度） */
  let s = `<svg viewBox="0 0 680 300" width="100%" class="ladder" role="img">`;
  s += `<text x="40" y="26" font-size="12" font-weight="500" fill="#534AB7">副歌 · 高八度</text>`;
  s += `<text x="40" y="170" font-size="12" font-weight="500" fill="#185FA5">主歌 · 中低音区</text>`;
  mel.forEach((sv, i) => {
    const x = LX + CW * i + CW / 2;
    s += `<rect data-note="${midiOct(0, 5) + sv}" data-lit="h${i}h" x="${x - BW / 2}" y="${yH(sv) - 11}" width="${BW}" height="22" rx="5" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.7"/>`;
    s += `<text x="${x}" y="${yH(sv) + 1}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#3C3489">${noteName(midiOct(0, 5) + sv)}</text>`;
    s += `<rect data-note="${midiOct(0, 3) + sv}" data-lit="h${i}v" x="${x - BW / 2}" y="${yV(sv) - 11}" width="${BW}" height="22" rx="5" fill="#E6F1FB" stroke="#185FA5" stroke-width="0.7"/>`;
    s += `<text x="${x}" y="${yV(sv) + 1}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#0C447C">${noteName(midiOct(0, 3) + sv)}</text>`;
  });
  /* 第一列虚线连接：证明两行形状完全一致，只是平移 */
  const c0 = LX + CW / 2;
  s += `<line x1="${c0}" y1="${yV(0) - 11}" x2="${c0}" y2="${yH(0) + 11}" stroke="#BA7517" stroke-width="1" stroke-dasharray="4 3"/>`;
  s += `<path d="M${c0} ${yH(0) + 13} l-4 6 h8 z" fill="#BA7517"/>`;
  s += `<text x="${c0 + 10}" y="170" font-size="10" fill="#854F0B">↑八度</text>`;
  s += `<text x="40" y="288" font-size="11" fill="#57554E">两行形状一模一样——同一段旋律搬到高音区，情绪就"扬"起来了。</text>`;
  s += '</svg>';
  return s;
}

/* 声调 vs 旋律对照图（第 11 节）：同一句词，两行旋律——
 *   上行跟着字调走（顺字），下行拧着字调走（倒字）。
 * 每列一条**竖线段** = 一个字内部的音高滑动（这就是声调的物理形态）；
 * 段与段之间的虚线 = 整句的旋律轮廓。
 *
 * ⚠ 两行的平均音高被刻意做成相同（见 data.js 的 TONE_SHAPE），
 *   只有滑动方向相反。这样听到的差别全部来自"字"，而不是"换了个调"——
 *   否则听众会把倒字误认成"唱高了"，教学点就跑了。
 *
 * words = [[汉字, 声调], ...]；0 声（轻声）按 1 声的形状画，仅用于兜底。 */
function toneLineSVG(words){
  const n = words.length, W = TOTW / n;
  const cx = i => X0 + W * i + W / 2;
  const fitY = v => 110 - (v - 2) * 8;      /* 顺字行：v 越大越高 */
  const flipY = v => 256 - (v - 2) * 8;     /* 倒字行：同样的刻度，整体下移 146 */
  const shape = t => TONE_SHAPE[t] || TONE_SHAPE[1];

  let s = `<svg viewBox="0 0 680 292" width="100%" class="ladder" role="img">`;
  s += `<text x="${X0}" y="24" font-size="12" font-weight="600" fill="#534AB7">顺字 · 旋律跟着字调走</text>`;
  s += `<text x="${X0}" y="176" font-size="12" font-weight="600" fill="#D85A30">倒字 · 旋律拧着字调走</text>`;

  /* 画一行（flip=false 顺字 / true 倒字） */
  const row = (yOf, color, flip) => {
    let g = '';
    words.forEach((w, i) => {
      const [a, b] = shape(w[1])[flip ? 'flip' : 'fit'];
      const x = cx(i);
      if (a === b){
        /* 平声（阴平的顺字版）画成**横杠**——"平着走"就该是水平的。
           早先这里画的是起止两点重合的竖线，长度 0，渲染出来只剩一个点，
           看着像"这一列漏画了"。横杠既补上了这个视觉缺口，也正好是它的含义。 */
        g += `<line x1="${x - 9}" y1="${yOf(a)}" x2="${x + 9}" y2="${yOf(a)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
      } else {
        g += `<line x1="${x}" y1="${yOf(a)}" x2="${x}" y2="${yOf(b)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
      }
      g += `<circle cx="${x}" cy="${yOf(a)}" r="3.4" fill="${color}"/>`;
      g += `<circle cx="${x}" cy="${yOf(b)}" r="2.6" fill="${color}" opacity=".5"/>`;
      if (i < n - 1){
        const nx = cx(i + 1), na = shape(words[i + 1][1])[flip ? 'flip' : 'fit'][0];
        g += `<line x1="${x}" y1="${yOf(b)}" x2="${nx}" y2="${yOf(na)}" stroke="${color}" stroke-width="1" stroke-dasharray="3 3" opacity=".45"/>`;
      }
    });
    return g;
  };
  s += row(fitY, '#534AB7', false);
  s += row(flipY, '#D85A30', true);

  /* 两行之间：汉字 + 声调号 */
  words.forEach((w, i) => {
    const x = cx(i);
    s += `<text x="${x}" y="134" font-size="14" font-weight="600" text-anchor="middle" fill="#2C2C2A">${w[0]}</text>`;
    s += `<text x="${x}" y="150" font-size="10" text-anchor="middle" fill="#6F6C62">${w[1] === 0 ? '轻声' : w[1] + '声'}</text>`;
  });

  s += `<text x="${X0}" y="282" font-size="11" fill="#57554E">竖线＝一个字内部的音高滑动，虚线＝整句轮廓。两行平均音高相同，只有滑动方向相反——差别全部来自"字"，不是"调"。</text>`;
  s += '</svg>';
  return s;
}

/* 十二格布鲁斯（第 10 节）：上面一格一个和弦，下面三行词各占四格。
 *
 * 全部画在同一张图里，因为这张图要证明的是一件事：
 * **词的行数是被和声逼出来的**——前八格和声在原地打转，词也就重复；
 * 第九格第一次出现 V7，词也正好在那里换内容。分开画就看不出来了。
 *
 * 词块的下划线 = 这一句真正唱出来的长度（一字一拍，6 字 = 1.5 格），
 * 剩下的部分是"乐器接话"。B 行多三个字，所以要挤进第三格——
 * 转折处信息量更大，这件事在图上是有宽度的，不是形容词。 */
function bluesGridSVG(){
  const B = BLUES_FORM, col = TOTW / B.bars, fill = { 0:'#EEEDFE', 5:'#E1F5EE', 7:'#FAEEDA' },
        line = { 0:'#534AB7', 5:'#0F6E56', 7:'#BA7517' },
        ink  = { 0:'#3C3489', 5:'#04342C', 7:'#412402' };
  let s = `<svg viewBox="0 0 680 240" width="100%" class="ladder" role="img">`;
  s += `<text x="${X0}" y="14" font-size="11" fill="#57554E">十二格 · 三行词：前八格和声在原地打转，第九格才第一次离开家</text>`;

  /* 格号 + 和弦 */
  B.chords.forEach((c, i) => {
    const x = X0 + i * col;
    s += `<text x="${x + col / 2}" y="34" font-size="9.5" text-anchor="middle" fill="#6F6C62">${i + 1}</text>`;
    s += `<rect data-lit="bar${i}" x="${x + 1}" y="40" width="${col - 2}" height="26" rx="4" fill="${fill[c.deg]}" stroke="${line[c.deg]}" stroke-width="1"/>`;
    s += `<text x="${x + col / 2}" y="57" font-size="10.5" font-weight="600" text-anchor="middle" fill="${ink[c.deg]}">${c.iv}</text>`;
  });

  /* 三行词：每行占四格，标签 A / A / B 在左侧 */
  B.lines.forEach((L, li) => {
    const x = X0 + li * col * 4, y = 82 + li * 42;
    const sung = L.w.length * (col / B.beats);        /* 一字一拍 => 一格 = 4 字 */
    s += `<text x="${X0 - 14}" y="${y + 21}" font-size="12" font-weight="700" fill="#2C2C2A">${L.tag}</text>`;
    s += `<rect data-lit="ln${li}" x="${x + 1}" y="${y}" width="${col * 4 - 2}" height="32" rx="5" fill="#FBFAF6" stroke="#E5E2D9" stroke-width="1"/>`;
    s += `<rect x="${x + 7}" y="${y + 23}" width="${Math.max(4, sung)}" height="3" rx="1.5" fill="${li === 2 ? '#D85A30' : '#534AB7'}"/>`;
    s += `<text x="${x + 8}" y="${y + 16}" font-size="12" fill="#2C2C2A">${L.w.map(w => w[0]).join('')}</text>`;
    s += `<text x="${x + 12 + sung}" y="${y + 16}" font-size="9.5" fill="#6F6C62">乐器接话</text>`;
    s += `<text x="${x + col * 4 - 10}" y="${y + 16}" font-size="9" text-anchor="end" fill="#6F6C62">${L.w.length} 字</text>`;
  });

  s += `<text x="${X0}" y="232" font-size="10.5" fill="#57554E">下划线＝真正唱出来的长度（一字一拍）；剩下的空档是留给乐器的。B 行多三个字，所以会挤进第三格。</text>`;
  s += '</svg>';
  return s;
}

/* 七和弦图：方块按音高排列，最后一个（新叠上去的七音）用粉色高亮 */
function sevSVG(s){
  const step = 16, top = 54, H = 272, BW = Math.min(56, 600 / 4 - 14);
  const base = midiOct(state.root, 4), main = '#534AB7';
  let s2 = `<svg viewBox="0 0 680 ${H}" width="100%" class="ladder" role="img">`;
  for (let p = 0; p < 12; p++) s2 += `<text x="${40 + 600 / 13 * p + 23}" y="24" font-size="10" text-anchor="middle" fill="#6F6C62">${PC[p]}</text>`;
  s2 += `<line x1="40" y1="${top + 12 * step + 8}" x2="640" y2="${top + 12 * step + 8}" stroke="#E5E2D9" stroke-width="1"/>`;
  s.forEach((sv, i) => {
    const cell = sv % 12 + (sv >= 12 ? 1 : 0);
    const x = 40 + (600 / 13) * cell + (sv >= 12 ? 600 / 13 : 0) + 600 / 13 / 2;
    const y = top + (11 - sv) * step;
    const isNew = (i === s.length - 1);
    s2 += `<rect data-note="${base + sv}" data-lit="sv${i}" x="${x - BW / 2}" y="${y - 11}" width="${BW}" height="22" rx="5" fill="${isNew ? '#FBEAF0' : '#EEEDFE'}" stroke="${isNew ? '#993556' : '#534AB7'}" stroke-width="1"/>`;
    s2 += `<text x="${x}" y="${y + 1}" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="${isNew ? '#72243E' : '#3C3489'}">${noteName(base + sv)}</text>`;
    s2 += `<text x="${x}" y="${top + 12 * step + 24}" font-size="10" text-anchor="middle" fill="${isNew ? '#993556' : '#6F6C62'}">${s.length}</text>`;
  });
  s2 += '</svg>';
  return s2;
}

/* ============ 第 09 节 · 律动的十六分网格 ============
 * 一个和弦 = 2 拍 = 8 个十六分格。
 * ⚠ 这里画的是**两拍网格**，前提是律动那五种织体的和弦周期恰好都是 2 拍
 *   （texSpan 全为 2）。哪天往 GROOVE 里加一个长音织体（周期 6–7 拍），
 *   这张图就会画少一半——所以 G5 断言里有一条专门守着"五种织体周期都是 2 拍"。
 * 实心块＝重音（每组第一下，也是最容易听出来的那一下），
 * 浅色块＝弱拍音头，块右边那条尾巴＝音长（dur）。
 * 为什么不画成"音符"：读者要比较的是"格子空不空"，不是认记谱。 */
function grooveGridSVG(row){
  const T = TEX[row.tex] || TEX.block;
  const cell = TOTW / 8, y = 20, h = 32;
  let s = `<svg viewBox="0 0 680 104" width="100%" class="ladder" role="img">`;
  /* 八个格子：每四格（一拍）换一次底色的深浅，拍头那格再深一点 */
  for (let i = 0; i < 8; i++){
    const x = X0 + i * cell;
    const bg = (i % 4 === 0) ? '#F1EFE8' : '#FAF9F5';
    s += `<rect x="${x}" y="${y}" width="${cell - 1}" height="${h}" rx="4" fill="${bg}" stroke="#D6D2C6" stroke-width="1"/>`;
  }
  /* 两拍之间的分隔线：让人一眼看出"这是 2 拍" */
  s += `<line x1="${X0 + TOTW / 2}" y1="${y - 5}" x2="${X0 + TOTW / 2}" y2="${y + h + 5}" stroke="#B4B2A9" stroke-width="1"/>`;
  /* 音头在格子里，音长单独画在格子下面的一条轨道上——两者必须分开：
     画在一起时，块状（音长 2 拍）的尾巴会横穿整条网格，把八个格子全盖住，
     读者看到的就是一根长条，而不是"两拍一个音头"。 */
  const trackY = y + h + 6;
  T.hits.forEach((hb, hi) => {
    const slot = Math.round(hb * 4), x = X0 + slot * cell, w = 26, accent = hi === 0;
    s += `<rect data-hit="1" x="${x + 7}" y="${y + 8}" width="${w}" height="16" rx="4" fill="${accent ? '#534AB7' : '#CECBF6'}"/>`;
    const tailSlots = Math.min(8 - slot, Math.max(1, (T.dur || .5) * 4));
    const tail = tailSlots * cell - 16;
    if (tail > 3){
      s += `<rect x="${x + 7}" y="${trackY}" width="${tail}" height="4" rx="2" fill="${accent ? '#7F77DD' : '#CECBF6'}"/>`;
    }
  });
  s += `<text x="${X0 + TOTW / 4}" y="${trackY + 20}" font-size="10.5" text-anchor="middle" fill="#6F6C62">拍 1</text>`;
  s += `<text x="${X0 + TOTW * 3 / 4}" y="${trackY + 20}" font-size="10.5" text-anchor="middle" fill="#6F6C62">拍 2</text>`;
  s += `<text x="${X0}" y="${trackY + 36}" font-size="10" fill="#6F6C62">一格＝十六分 · 实心块＝音头（深色那下是重音）· 格下细条＝音长（${(T.dur).toFixed(2)} 拍）</text>`;
  s += '</svg>';
  return s;
}

/* ============ 第 10 节 ② · shuffle：第二下落在一半还是三分之二 ============
 * 两行画同一段两拍，网格按**三连音**分（每拍 3 格），于是：
 *   直的八分 → 第二下落在两根格线正中间（看着"悬空"）
 *   shuffle  → 第二下正好压在第三根格线上
 * 这张图的说服力全在"块与格线对没对齐"，所以格线一定要画出来，
 * 且拍线（实线）与三连音线（虚线）必须区分——否则读不出"三格一拍"。
 * 格下的细条＝这个音有多长：直的两条一样长，shuffle 一长一短。
 */
function shuffleFigSVG(){
  const S = SHUFFLE, cell = TOTW / 6, w = 30;
  const rows = [
    { k: S.kinds[0], y: 40, col:'#8A8880', line:'#C8C4B8' },
    { k: S.kinds[1], y: 118, col:'#534AB7', line:'#CECBF6' },
  ];
  let s = `<svg viewBox="0 0 680 202" width="100%" class="ladder" role="img">`;
  rows.forEach(R => {
    const h = 30, trackY = R.y + h + 6;
    s += `<text x="${X0}" y="${R.y - 9}" font-size="11.5" font-weight="600" fill="${R.col}">${R.k.n}</text>`;
    s += `<text x="${X0 + 88}" y="${R.y - 9}" font-size="10.5" fill="#8A8880">${R.k.fig}</text>`;
    /* 七根竖线：拍线实线、三连音格线虚线 */
    for (let u = 0; u <= 6; u++){
      const x = X0 + u * cell, isBeat = u % 3 === 0;
      s += `<line x1="${x}" y1="${R.y - 3}" x2="${x}" y2="${trackY + 4}" stroke="${isBeat ? '#B4B2A9' : '#E3E0D6'}" stroke-width="1"${isBeat ? '' : ' stroke-dasharray="3 3"'}/>`;
    }
    for (let b = 0; b < 2; b++){
      R.k.offs.forEach((off, i) => {
        const x = X0 + (b * 3 + off * 3) * cell;
        s += `<rect data-hit="1" x="${x - w / 2}" y="${R.y}" width="${w}" height="${h}" rx="5" fill="${i ? R.line : R.col}"/>`;
        /* 音长：从本音到下一个音（第二下走到拍尾），长度＝相邻 offs 之差 */
        const len = (i ? 1 - R.k.offs[1] : R.k.offs[1] - R.k.offs[0]) * 3 * cell;
        s += `<rect x="${x - w / 2}" y="${trackY}" width="${Math.max(6, len - 6)}" height="4" rx="2" fill="${i ? R.line : R.col}"/>`;
      });
    }
    s += `<text x="${X0 + 1.5 * cell}" y="${trackY + 18}" font-size="10.5" text-anchor="middle" fill="#6F6C62">拍 1</text>`;
    s += `<text x="${X0 + 4.5 * cell}" y="${trackY + 18}" font-size="10.5" text-anchor="middle" fill="#6F6C62">拍 2</text>`;
  });
  s += `<text x="${X0}" y="192" font-size="10" fill="#6F6C62">虚线＝三连音的格线（每拍三格）· 格下细条＝这个音多长 · 音高一模一样，只有位置和长短不同</text>`;
  s += '</svg>';
  return s;
}

/* ============ 第 14 节 · 专辑能量曲线 ============
 * 上下两块，同样的八首、同样的坐标，只有顺序不同。
 * 点的高度＝听感密度（音头/秒），点下面的字＝调；
 * 和上一个点同调时，那个点画成珊瑚红——"相邻同调"是听众疲劳的第一来源。 */
function albumCurveSVG(){
  const A = ALBUM_CURVE, W = TOTW / 8, PH = 76;
  /* 两块之间的间距必须留够：第一块下面有两行小字（调 / 密度），
     第二块的标题若贴着它，字会叠字。每块占 76 + 两行字 ≈ 100px，故取 142 的间距。 */
  const panels = [
    { order: A.order1, tag: '按写出来的顺序', col: '#888780', fill: '#F1EFE8', y: 34 },
    { order: A.order2, tag: '按能量曲线重排', col: '#534AB7', fill: '#EEEDFE', y: 176 },
  ];
  let s = `<svg viewBox="0 0 680 316" width="100%" class="ladder" role="img">`;
  panels.forEach(P => {
    const y0 = P.y, base = y0 + PH;
    s += `<text x="${X0}" y="${y0 - 8}" font-size="11" font-weight="600" fill="${P.col}">${P.tag}</text>`;
    /* 底板与基准线 */
    s += `<rect x="${X0}" y="${y0}" width="${TOTW}" height="${PH}" rx="8" fill="${P.fill}" stroke="#E5E2D9" stroke-width="1"/>`;
    const pts = P.order.map((ti, i) => {
      const t = A.tracks[ti];
      const x = X0 + i * W + W / 2;
      const y = base - (t.r / A.rMax) * (PH - 14) - 6;
      return { x, y, t, i };
    });
    s += `<polyline fill="none" stroke="${P.col}" stroke-width="1.6" points="${pts.map(p => `${p.x},${p.y}`).join(' ')}"/>`;
    pts.forEach(p => {
      const prev = p.i > 0 ? A.tracks[P.order[p.i - 1]] : null;
      const sameKey = prev && prev.key === p.t.key;
      s += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${sameKey ? '#D85A30' : P.col}"/>`;
      s += `<text x="${p.x}" y="${base + 12}" font-size="9.5" text-anchor="middle" fill="${sameKey ? '#D85A30' : '#6F6C62'}">${p.t.key}</text>`;
      s += `<text x="${p.x}" y="${base + 25}" font-size="9" text-anchor="middle" fill="#A8A59B">${p.t.r}</text>`;
    });
  });
  s += `<text x="${X0}" y="300" font-size="10" fill="#6F6C62">纵轴＝听感密度（音头/秒）· 珊瑚红的点＝与上一首同调（连续同调最容易疲）</text>`;
  s += '</svg>';
  return s;
}

/* ---- 人声舒适音区条（第 11 节 ⑨）------------------------------------------
 * 一条横贯的音高条，按五个分区染色，**换声点用虚线单独标出来**——
 * 这张图的全部意义就是让人看见"换声点在哪、它有多窄"。
 * 换声点不是一条线而是一段窄带（lo–hi），所以画成一条带而不是一根线。
 */
function voiceRangeSVG(){
  const V = VOICE_RANGE;
  const X0 = 150, X1 = 640, TOP = 60, HH = 34;
  const lo = -12, hi = 24;
  const X = s => X0 + (s - lo) / (hi - lo) * (X1 - X0);
  const COL = ['#185FA5', '#2E7D6F', '#534AB7', '#BA7517', '#D85A30'];

  let s = `<svg viewBox="0 0 680 190" width="100%" class="ladder" role="img">`;
  s += `<text x="40" y="${TOP - 16}" font-size="12" font-weight="600" fill="#2C2C2A">人声舒适音区（以中央 C 为基准）</text>`;

  /* 五个分区：一条横条，按音高从高到低排列 */
  const sorted = [...V.zones].sort((a, b) => b.lo - a.lo);
  sorted.forEach((z, i) => {
    const x1 = X(z.hi), x2 = X(z.lo);
    s += `<rect x="${x1}" y="${TOP}" width="${x2 - x1}" height="${HH}" fill="${COL[i]}" opacity="0.16"/>`;
    s += `<rect x="${x1}" y="${TOP}" width="${x2 - x1}" height="${HH}" fill="none" stroke="${COL[i]}" stroke-width="1.4"/>`;
    s += `<text x="${(x1 + x2) / 2}" y="${TOP + HH / 2 + 4}" font-size="11" text-anchor="middle" fill="${COL[i]}" font-weight="600">${z.n.replace(/（.*/, '')}</text>`;
  });

  /* 换声点：一条窄带 + 上下引出线 + 标注 */
  const bx1 = X(V.breakNote.hi), bx2 = X(V.breakNote.lo);
  s += `<rect x="${bx1}" y="${TOP - 12}" width="${bx2 - bx1}" height="${HH + 24}" fill="none" stroke="#D85A30" stroke-width="1.6" stroke-dasharray="5 3"/>`;
  s += `<line x1="${bx1}" y1="${TOP - 12}" x2="${bx1}" y2="${TOP + HH + 12}" stroke="#D85A30" stroke-width="1" stroke-dasharray="3 2"/>`;
  s += `<line x1="${bx2}" y1="${TOP - 12}" x2="${bx2}" y2="${TOP + HH + 12}" stroke="#D85A30" stroke-width="1" stroke-dasharray="3 2"/>`;
  s += `<text x="${(bx1 + bx2) / 2}" y="${TOP + HH + 28}" font-size="10.5" text-anchor="middle" fill="#D85A30" font-weight="600">换声点</text>`;

  /* 音名刻度：只标有意义的几个（C4 中央 C、几个八度点） */
  [[0, 'C4'],[12, 'C5'],[-12, 'C3'],[24, 'C6']].forEach(([semi, nm]) => {
    s += `<line x1="${X(semi)}" y1="${TOP + HH}" x2="${X(semi)}" y2="${TOP + HH + 6}" stroke="#C4C0B4" stroke-width="1"/>`;
    s += `<text x="${X(semi)}" y="${TOP + HH + 20}" font-size="10" text-anchor="middle" fill="#8B877C">${nm}</text>`;
  });
  s += `<text x="${X0}" y="${TOP + HH + 40}" font-size="10.5" fill="#6F6C62">低 ← 音高 → 高</text>`;
  s += `<text x="${X1}" y="${TOP + HH + 40}" font-size="10.5" text-anchor="end" fill="#6F6C62">（半音数为相对中央 C 的偏移）</text>`;

  /* 三条规则：每条一行，左侧序号 + 内容 */
  V.rules.forEach((r, i) => {
    const y = TOP + HH + 66 + i * 20;
    s += `<circle cx="46" cy="${y - 4}" r="9" fill="#534AB7"/>`;
    s += `<text x="46" y="${y}" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">${i + 1}</text>`;
    s += `<text x="62" y="${y}" font-size="11" fill="#4A4844">${r.n}</text>`;
  });
  s += '</svg>';
  return s;
}

/* ---- 动机生成法对比图（第 14 节 ⑤）---------------------------------------
 * 母动机（浅）与派生结果（深）叠在同一张图上，**图就是论证**：
 *   节奏化 → 两条线在音高上完全重合，只有横向的点错开了
 *   移位   → 两条线形状一样，整条平移了一段
 *   逆行   → 两条线左右翻转
 *   移调   → 两条线平行上移，间距处处相等
 *   增减音 → 深线多一个点（或少一个）
 * 所以这张图不需要文字解释——换一种手法，图自己就变了。
 */
function motifGenSVG(method){
  const GEN = MOTIF_GEN, X0 = 70, per = 62, Y0 = 150, K = 8;
  const X = b => X0 + b * per;
  const Y = s => Y0 - s * K;
  const base = GEN.base.notes, cur = (method && method.notes) || base;

  let s = `<svg viewBox="0 0 680 210" width="100%" class="ladder" role="img">`;
  /* 拍线 */
  for (let i = 0; i <= 5; i++){
    s += `<line x1="${X(i)}" y1="34" x2="${X(i)}" y2="160" stroke="#EAE7DC" stroke-width="1"/>`;
    s += `<text x="${X(i)}" y="176" font-size="11" text-anchor="middle" fill="#A8A59B">${i}</text>`;
  }
  s += `<text x="40" y="176" font-size="11" fill="#A8A59B">拍</text>`;
  /* 音高刻度：每 3 个半音一条横线，方便看出移调高了几个半音 */
  for (let p = 0; p <= 12; p += 3){
    s += `<line x1="${X0}" y1="${Y(p)}" x2="${X(5)}" y2="${Y(p)}" stroke="#F0EDE4" stroke-width="1"/>`;
    s += `<text x="${X0 - 10}" y="${Y(p) + 4}" font-size="9.5" text-anchor="end" fill="#A8A59B">${p}</text>`;
  }
  s += `<text x="${X0 - 34}" y="34" font-size="9.5" fill="#A8A59B">半音</text>`;

  /* 母动机：浅色、细线、空心点——它是"底稿" */
  s += `<polyline fill="none" stroke="#CFCABE" stroke-width="2" stroke-dasharray="4 3" points="${base.map(n => `${X(n.b)},${Y(n.s)}`).join(' ')}"/>`;
  base.forEach(n => {
    s += `<circle cx="${X(n.b)}" cy="${Y(n.s)}" r="4" fill="#fff" stroke="#CFCABE" stroke-width="2"/>`;
  });

  /* 派生结果：深色实线 + 实心点 */
  s += `<polyline fill="none" stroke="#D85A30" stroke-width="3" points="${cur.map(n => `${X(n.b)},${Y(n.s)}`).join(' ')}"/>`;
  cur.forEach(n => {
    s += `<circle cx="${X(n.b)}" cy="${Y(n.s)}" r="4.5" fill="#D85A30"/>`;
  });

  /* 图例 */
  s += `<rect x="${X0}" y="192" width="24" height="3" rx="1.5" fill="#CFCABE"/>`;
  s += `<text x="${X0 + 32}" y="197" font-size="11" fill="#6F6C62">母动机</text>`;
  s += `<rect x="${X0 + 110}" y="192" width="24" height="3" rx="1.5" fill="#D85A30"/>`;
  s += `<text x="${X0 + 142}" y="197" font-size="11" fill="#6F6C62">${method ? method.n : '母动机'}（生成结果）</text>`;
  s += '</svg>';
  return s;
}

/* ---- 动机轮廓图：同一形状被横向拉长（第 14 节收尾）-----------------------
 * 这张图只画两件事：横轴是拍、纵轴是音高（半音）。
 * 两条线**纵向完全重合、横向差一倍**——图本身就是论点：
 * 呼应靠的是"轮廓不动"，变形靠的是"时值变"，两件事必须分开看。
 */
function motifContourSVG(){
  const M = MOTIF, X0 = 70, per = 70, Y0 = 140, K = 8;
  const X = b => X0 + b * per;
  const Y = s => Y0 - s * K;
  const pts = arr => arr.map(n => `${X(n.b)},${Y(n.s)}`).join(' ');

  let s = `<svg viewBox="0 0 680 200" width="100%" class="ladder" role="img">`;
  for (let i = 0; i <= 8; i++){
    s += `<line x1="${X(i)}" y1="30" x2="${X(i)}" y2="150" stroke="#EAE7DC" stroke-width="1"/>`;
    if (i < 8) s += `<text x="${X(i) + per / 2}" y="166" font-size="11" text-anchor="middle" fill="#A8A59B">${i + 1}</text>`;
  }
  s += `<text x="40" y="166" font-size="11" fill="#A8A59B">拍</text>`;
  s += `<line x1="${X0}" y1="${Y0}" x2="${X(8)}" y2="${Y0}" stroke="#DDD9CD" stroke-width="1"/>`;

  /* 原形：细、浅；回来：粗、深。两者起点完全重合，之后一路分开 */
  s += `<polyline fill="none" stroke="#AFA9EC" stroke-width="3" points="${pts(M.versions[0].notes)}"/>`;
  s += `<polyline fill="none" stroke="#534AB7" stroke-width="3" points="${pts(M.versions[1].notes)}"/>`;
  M.versions.forEach((v, vi) => {
    v.notes.forEach(n => {
      s += `<circle cx="${X(n.b)}" cy="${Y(n.s)}" r="4.5" fill="${vi ? '#534AB7' : '#AFA9EC'}"/>`;
    });
  });

  s += `<rect x="${X0}" y="186" width="26" height="3" rx="1.5" fill="#AFA9EC"/>`;
  s += `<text x="${X0 + 34}" y="192" font-size="11" fill="#6F6C62">动机原形：4 拍走完，只有一层长垫</text>`;
  s += `<rect x="330" y="186" width="26" height="3" rx="1.5" fill="#534AB7"/>`;
  s += `<text x="364" y="192" font-size="11" fill="#6F6C62">第 8 首：同一个轮廓，8 拍才走完</text>`;
  s += '</svg>';
  return s;
}
