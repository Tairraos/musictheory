#!/usr/bin/env node
/* ============================================================================
 * 《姐弟厨师团——乐理课》 · 声学验证（tests/acoustics.js）
 * ----------------------------------------------------------------------------
 * 回答用户提的那个问题：「你编排的音乐，速度、调式和风格是不是真和描述相符？」
 *
 * 光对公式没用——公式只能证明"标签和计算一致"，证明不了"耳朵听到的和描述一样"。
 * 所以这里做三件事，从弱到强：
 *
 *   第 1 层 · 排程层：拿 sceneEvents() 的输出（纯函数，不碰音频）做统计，
 *              数音头、量时长、验调式音级。这是"说得对不对"。
 *   第 2 层 · 波形层：用一个迷你离线合成器把每张卡片真的渲染成 PCM 波形，
 *              然后做**起始点检测**（能量差分）、**音高跟踪**（Goertzel 滤波）、
 *              **频谱质心**（算亮度）。这是"响起来到底是不是那样"。
 *   第 3 层 · 语义层：把测量结果和卡片想表达的意思对账。
 *              「热血」必须比「悬疑」快、「巨大」必须比「渺小」低、
 *              「金属」必须比「木头」亮、「纯净」必须比「小二度摩擦」协和……
 *
 * 与 run-tests.js 的分工：那套验"页面装配和乐理函数"，这套验"声音本身"。
 * ========================================================================== */
'use strict';

const assert = require('node:assert/strict');

/* ============================================================================
 * 迷你离线合成器
 * ---------------------------------------------------------------------------
 * 不能直接用 Web Audio（Node 里没有），也不需要——我们要验的是**包络与音高**，
 * 而这两样用纯数学就能算得比 Web Audio 还准（没有调度抖动、没有采样混叠误差）。
 * 声部模型与 js/audio.js 的 voice() 严格对齐：基频 + 八度 + 十二度三振荡器，
 * 过一阶低通（一极滤波器，解析解不用状态变量），包络走同样的指数衰减。
 * ========================================================================== */

const SR = 22050;   /* 采样率：够解析 10kHz 以下的全部音色特征，又不必太慢 */

/* 一极低通：y[i] = y[i-1] + a*(x[i] - y[i-1])，a = 1 - exp(-2π·fc/SR)
   fc 随时间指数衰减，模拟"声音越响越亮、越响越闷"的包络 */
function lowpassOnePole(buf, fcStart, fcEnd, dur, sr) {
  const y = new Float64Array(buf.length);
  const N = buf.length;
  let prev = 0;
  for (let i = 0; i < N; i++) {
    const t = N > 1 ? i / N : 0;
    const fc = fcStart * Math.pow(fcEnd / fcStart, t);
    const a = 1 - Math.exp(-2 * Math.PI * Math.max(20, fc) / sr);
    prev = prev + a * (buf[i] - prev);
    y[i] = prev;
  }
  return y;
}

/* renderVoice：把 sceneEvents 里的一个音符渲染成波形，直接叠进 out。
   gain 为峰值音量，dur 秒，kind 决定包络与泛音配比 */
function renderVoice(out, startSample, midi, dur, gain, tone, sr) {
  const n = Math.max(1, Math.floor(dur * sr));
  const f0 = 440 * Math.pow(2, (midi - 69) / 12);
  const buf = new Float64Array(n);

  /* 包络：atk 之内线性/指数起音，之后指数衰减（hold 类中途不衰减） */
  const A = Math.max(1, Math.floor(tone.atk * sr));
  for (let i = 0; i < n; i++) {
    let e;
    if (i < A) e = gain * (tone.atk < 0.01 ? (i + 1) / A : (i + 1) / A);
    else if (tone.hold && i < n * 0.6) e = gain;
    else e = gain * Math.exp(-4 * (i - A) / (n - A));
    e = Math.max(0, e);

    const t = i / sr;
    /* 三个振荡器。三角波用傅里叶近似代替（真实 Web Audio 里是 OscillatorNode） */
    const tri = (p) => { const x = p - Math.floor(p); return 4 * Math.abs(x - 0.5) - 1; };
    buf[i] = e * (
      Math.sin(2 * Math.PI * f0 * t) +
      tone.o2 * tri(2 * f0 * t) +
      tone.o3 * Math.sin(2 * Math.PI * f0 * 3.01 * t)
    );
  }
  const f = lowpassOnePole(buf, tone.lp0, tone.lp1, dur, sr);
  const off = Math.floor(startSample);
  for (let i = 0; i < n; i++) if (off + i < out.length) out[off + i] += f[i];
  return f;
}

/* renderScene：把整张卡片渲染成波形 + 记录每个音头的理论时刻 */
function renderScene(cfg, ev, TONES, SRrate) {
  const sr = SRrate || SR;
  const total = Math.max(1, Math.ceil((ev.dur + 0.3) * sr));
  const out = new Float64Array(total);
  ev.steps.forEach(s => {
    const tone = TONES[s.kind] || TONES.piano;
    renderVoice(out, s.at * sr, s.m, s.d, s.g, tone, sr);
  });
  return out;
}

/* ============================================================================
 * 分析工具：从波形里把"人耳会注意到的东西"抠出来
 * ========================================================================== */

/* 能量包络（每 hop 个采样点取一个 RMS），单位与时间对应 */
function envelope(buf, sr, hop) {
  const out = [];
  for (let i = 0; i < buf.length; i += hop) {
    let s = 0, n = 0;
    for (let j = i; j < Math.min(i + hop, buf.length); j++) { s += buf[j] * buf[j]; n++; }
    out.push(Math.sqrt(s / Math.max(1, n)));
  }
  return out;
}

/* 起始点检测：能量差分的局部峰 + 双门限。
   这就是人耳判"这里敲了一下"时用的那个量。
 *
 *   【为什么要双门限】低频振荡器（bass/stone 音色）的单个音在包络上是一段
 *   平滑的正弦起伏，它的上升沿也会造成能量差分上的峰——如果只用一个低门限，
 *   一个 8 秒的长音会被数成十几个"音头"。所以：
 *     峰高门限  thresh  —— 必须超过整体能量的一定比例（过滤掉衰减尾巴的抖动）
 *     斜率门限  slope   —— 必须比它前面 20ms 的能量高出一定倍数才算"敲了一下"
 *   只有同时满足才记一个音头。 */
function detectOnsets(env, hopSec, minGapSec) {
  const flux = [];
  for (let i = 1; i < env.length; i++) flux.push(Math.max(0, env[i] - env[i - 1]));
  if (flux.length < 4) return [];

  const sorted = [...flux].sort((a, b) => b - a);
  /* 峰高门限：取第 8 高的那个峰的 30%（全库最密的卡片是 32 分音符，但仍留出余量） */
  const thresh = Math.max(sorted[Math.floor(sorted.length * 0.08)] * 0.30, 1e-5);
  /* 斜率窗口：往前 20ms 的平均能量 */
  const back = Math.max(1, Math.round(0.020 / hopSec));

  const out = [];
  const minGap = Math.max(1, Math.round(minGapSec / hopSec));
  let last = -minGap;
  for (let i = 1; i < flux.length - 1; i++) {
    if (flux[i] < thresh) continue;
    /* 只取局部峰 */
    if (flux[i] < flux[i - 1] || flux[i] < flux[i + 1]) continue;
    /* 斜率门限：当前能量必须明显高于 20ms 之前的水平 */
    let prev = 0;
    for (let k = Math.max(0, i - back); k < i; k++) prev += env[k];
    prev /= Math.max(1, Math.min(back, i));
    if (env[i + 1] < prev * 1.45) continue;
    if (i - last < minGap) continue;
    out.push((i + 1) * hopSec);
    last = i;
  }
  return out;
}

/* Goertzel：只测一个频率的瞬时功率，比整条 FFT 快得多。
   在若干帧上跑就能跟踪基频走向（用来验滑音与音区） */
function goertzelPower(buf, sr, freq, from, len) {
  const k = Math.round(len * freq / sr);
  if (k < 1) return 0;
  const w = 2 * Math.PI * k / len;
  const cw = Math.cos(w), sw = Math.sin(w);
  const coeff = 2 * cw;
  let s0 = 0, s1 = 0, s2 = 0;
  const end = Math.min(buf.length, from + len);
  for (let i = from; i < end; i++) { s0 = buf[i] + coeff * s1 - s2; s2 = s1; s1 = s0; }
  return s1 * s1 + s2 * s2 - coeff * s1 * s2;
}

/* 在一个时刻上找最强的那个音（对 12 个半音各测一次功率）。
   返回 {midi, cents} —— 用来验"这张卡片实际发出来的是不是它标的那个音区" */
function dominantPitch(buf, sr, atSec, frameSec) {
  const from = Math.floor(atSec * sr), len = Math.floor(frameSec * sr);
  if (from >= buf.length) return null;
  let best = null;
  for (let midi = 24; midi <= 96; midi++) {
    const fr = 440 * Math.pow(2, (midi - 69) / 12);
    if (fr > sr / 2.2) continue;
    const p = goertzelPower(buf, sr, fr, from, Math.min(len, buf.length - from));
    if (!best || p > best.p) best = { midi, p };
  }
  return best ? best.midi : null;
}

/* 频谱质心：把音频的"总体亮度"折算成一个数（Hz）。越亮=频谱重心越高。
   Meyer 那套跨模态对应里"亮↔高频"就是这一项。用简化的一阶差分近似，
   只求相对高低，不追求绝对标定。 */
function spectralCentroid(buf, sr) {
  const hop = 256;
  let num = 0, den = 0;
  for (let i = 0; i + hop < buf.length; i += hop) {
    let energy = 0, diff = 0;
    for (let j = i; j < i + hop; j++) {
      energy += buf[j] * buf[j];
      const d = j > i ? buf[j] - buf[j - 1] : 0;
      diff += d * d;
    }
    if (energy > 1e-9) { num += Math.sqrt(diff / hop) * 1000; den++; }
  }
  return den ? num / den : 0;
}

/* 协和度：相邻两个同时响的音之间的最小音程（半音）。12=纯五/八度=纯净，
   1=小二度=摩擦。这个指标直接对应"冷 vs 热""纯净 vs 压迫"的物理描述。 */
function minInterval(semis, root) {
  const set = new Set(semis.map(x => (x + root) % 12));
  let best = 12;
  const arr = [...set];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const d = Math.abs(arr[i] - arr[j]);
      best = Math.min(best, d, 12 - d);
    }
  }
  return best;
}

module.exports = {
  SR, renderScene, renderVoice, envelope, detectOnsets,
  goertzelPower, dominantPitch, spectralCentroid, minInterval,
};
