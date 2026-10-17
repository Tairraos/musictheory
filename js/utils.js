/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 工具层（js/utils.js）
 * --------------------------------------------------------------------------
 * 职责：与界面无关的纯函数——DOM 快捷方式、MIDI/音名/频率换算、三和弦拼装、
 *       和弦标记、音名拼写（升/降/还原）。全部可单独测试（tests/ 里有覆盖）。
 *
 * 依赖：data.js（PC / MODES / ALL_MODES）
 * 被谁用：其余所有 js 模块
 * ========================================================================== */

/* ---- DOM 快捷方式（原单文件里的老朋友，行为不变） ---- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* toast：屏幕下方弹一条 1.8s 的轻提示（停止、换调等操作的反馈） */
function toast(m){
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---- 音高换算 ---- */

/* MIDI 号 → 频率（Hz）。基准：A4 = MIDI 69 = 440Hz，十二平均律 */
function f(midi){ return 440 * Math.pow(2, (midi - 69) / 12); }

/* 主音 + 八度 → MIDI 号。约定 midiOct(0,4) = 60 = C4（钢琴中央 C） */
function midiOct(root, oct){ return 12 * (oct + 1) + root; }

/* MIDI 号 → 音名（含八度），如 60 → "C4"、61 → "C♯4"。
   取模先 +12 再 %12，兼容负半音输入 */
function noteName(m){ return PC[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }

/* ---- 音名拼写（大三/小三对比图用）：按"隔几级、几个半音"推出带升降号的正确写法 ---- */

/* 自然音级字母表与它们的半音位置（C 大调白键） */
const LETN = ['C','D','E','F','G','A','B'], NATN = [0,2,4,5,7,9,11];
/* 降号系音名表：pitch class → 带降号的写法（和 PC 的升号系一一对应） */
const FLATPC = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

/* 从根音往上拼一个音：
 *   pc         = 根音的 pitch class（0–11）
 *   letterStep = 隔几个音级（2 = 三度，4 = 五度）
 *   semis      = 往上几个半音
 * 自动决定加 ♯ / ♭ / 不加。例：spellUp(0,2,4) = "E"（C 上方大三度），
 * spellUp(0,2,3) = "E♭"（C 上方小三度——不能写成 D♯，音级必须对得上） */
function spellUp(pc, letterStep, semis){
  const L0 = LETN.indexOf(FLATPC[pc][0]);          /* 根音的字母在音级表里的位置 */
  const li = (L0 + letterStep) % 7;                /* 目标字母 */
  const target = (pc + semis) % 12;                /* 目标 pitch class */
  const d = (target - NATN[li] + 12) % 12;         /* 与自然音级的差：1=升、11=降、0=还原 */
  return LETN[li] + (d === 11 ? '♭' : d === 1 ? '♯' : '');
}

/* ---- 和弦 ---- */

/* 在某个调式上取第 deg 级的三和弦（三度叠置：隔一级取一个音）。
 * 返回 { notes:[三个MIDI号], q:'maj'|'min'|'dim'|'aug' }。
 * deg 可以超过 6（会自动往高八度绕），拍号/进行里传 0–6 即可 */
function triad(rootMidi, mode, deg){
  const s = mode.semis, n = s.length;
  const get = i => rootMidi + s[i % n] + Math.floor(i / n) * 12;   /* 第 i 级的绝对音高 */
  /* 三度叠置：隔一级取一个 → 第 deg 级、第 deg+2 级、第 deg+4 级 */
  const notes = [get(deg), get(deg + 2), get(deg + 4)];
  const i1 = (notes[1] - notes[0]) % 12, i2 = (notes[2] - notes[0]) % 12;
  let q = '?';
  if (i1 === 4 && i2 === 7) q = 'maj';        /* 大三度 + 纯五度 */
  else if (i1 === 3 && i2 === 7) q = 'min';   /* 小三度 + 纯五度 */
  else if (i1 === 3 && i2 === 6) q = 'dim';   /* 小三度 + 减五度 */
  else if (i1 === 4 && i2 === 8) q = 'aug';   /* 大三度 + 增五度 */
  return { notes, q };
}

/* 级数 → 罗马数字和弦标记（按大小写 + ° 区分性质）：I / ii / vii° */
function chordLabel(mode, deg, q){
  const R = ['I','II','III','IV','V','VI','VII'];
  let r = R[deg % 7];
  if (q === 'min' || q === 'dim') r = r.toLowerCase();   /* 小三/减和弦用小写 */
  if (q === 'dim') r += '°';
  return r;
}
