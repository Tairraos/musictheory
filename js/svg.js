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
