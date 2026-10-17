/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 音频引擎层（js/audio.js）
 * --------------------------------------------------------------------------
 * 职责：Web Audio 实时合成。全站没有任何音频文件——每个音都是现场用振荡器
 *       拼出来的（钢琴音 = 基频 + 八度 + 十二度泛音，过低通包络），
 *       雨声/风声 = 噪声缓冲过带通/低通。另含节拍器 MET。
 *
 * 依赖：utils.js（f 频率换算）、playback.js（flashKey 的可视化延时报时由
 *       voice 调用；此处只负责"出声"）
 * 被谁用：playback.js / sections.js
 *
 * 关键全局：
 *   AC / MASTER —— AudioContext 与主输出（带压缩器，多音齐响不爆音）
 *   TOKEN       —— 播放代号：每次 stopAll 自增，用于取消过期定时器
 *   BUSES       —— 每次播放开一条独立总线，方便整体静音
 *   NOISEBUF    —— 2 秒白噪声缓冲（雨/风/微光的原料），懒加载
 * ========================================================================== */

/* ============ 音频引擎 ============ */
let AC = null, MASTER = null, TOKEN = 0, NOISEBUF = null, BUSES = [];

/* ac()：懒加载 AudioContext。浏览器要求用户手势后才能发声，
   所以不在页面加载时创建，而是第一次播放/点键时才建；顺带处理 resume。 */
function ac(){
  if (!AC){
    AC = new (window.AudioContext || window.webkitAudioContext)();
    MASTER = AC.createGain(); MASTER.gain.value = 0.75;
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    MASTER.connect(comp); comp.connect(AC.destination);
  }
  if (AC.state !== 'running') AC.resume();
  return AC;
}

/* noiseBuf()：2 秒白噪声缓冲（-1~1 随机采样），整个会话只建一次 */
function noiseBuf(){
  const A = ac();
  if (!NOISEBUF){
    NOISEBUF = A.createBuffer(1, A.sampleRate * 2, A.sampleRate);
    const d = NOISEBUF.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return NOISEBUF;
}

/* 每次播放开一条独立总线，方便整体静音 */
/* newBus(lifeMs)：新建一条挂在 MASTER 下的增益总线；lifeMs 后自动摘除，
   防止长时间使用后 BUSES 数组无限增长 */
function newBus(lifeMs){
  const A = ac();
  const b = A.createGain(); b.gain.value = 1; b.connect(MASTER);
  BUSES.push(b);
  if (lifeMs) setTimeout(() => { const i = BUSES.indexOf(b); if (i > -1) BUSES.splice(i, 1); }, lifeMs);
  return b;
}

/* killBuses()：把所有总线 40ms 淡出到 0 再断开——直接断会"啪"一声 */
function killBuses(){
  const A = ac(), now = A.currentTime;
  BUSES.forEach(b => { try {
    b.gain.cancelScheduledValues(now);
    b.gain.setValueAtTime(b.gain.value, now);
    b.gain.linearRampToValueAtTime(0, now + 0.04);
    setTimeout(() => { try { b.disconnect(); } catch (e) {} }, 200);
  } catch (e) {} });
  BUSES = [];
}

/* ============ 音色 ============ */
/* tone kinds: piano | pad | pluck */

/* voice()：弹一个音。三个振荡器叠加出"钢琴感"：
 *   o1 sine     基频
 *   o2 triangle 高八度（gain 0.32，pad 音色降到 0.2）
 *   o3 sine     高十二度（×3.01，略调开避免泛音过强），gain 0.07
 * 再过一只低通滤波器（piano 从 5200Hz 指数衰减到 900Hz——这就是"明亮转闷"的包络）。
 * kind='pad' 慢起慢收（氛围）；'pluck' 6ms 瞬间起音（琶音/碎音）。
 * bus 参数让整条播放挂在同一总线上，可被 killBuses 整体静音。 */
function voice(midi, at, dur, gain, kind, bus, litKey){
  flashKey(midi, at, (dur || 0.9) * 500, litKey);   /* 闪光保持音符时长的一半 */
  const A = ac(), t = at, out = bus || MASTER;
  const g = A.createGain(), lp = A.createBiquadFilter();
  lp.type = 'lowpass';
  kind = kind || 'piano';
  if (kind === 'pad'){ lp.frequency.setValueAtTime(1400, t); }
  else { lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(900, t + dur); }
  const o1 = A.createOscillator(); o1.type = 'sine'; o1.frequency.value = f(midi);
  const o2 = A.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f(midi) * 2;
  const g2 = A.createGain(); g2.gain.value = (kind === 'pad') ? 0.2 : 0.32;
  const o3 = A.createOscillator(); o3.type = 'sine'; o3.frequency.value = f(midi) * 3.01;
  const g3 = A.createGain(); g3.gain.value = 0.07;
  o1.connect(g); o2.connect(g2); g2.connect(g); o3.connect(g3); g3.connect(g);
  g.connect(lp); lp.connect(out);
  if (kind === 'pad'){
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.45);
    g.gain.setValueAtTime(gain, Math.max(t + 0.5, t + dur * 0.6));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  } else if (kind === 'pluck'){
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  } else {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  [o1, o2, o3].forEach(o => { o.start(t); o.stop(t + dur + 0.1); });
}

/* noiseVoice()：环境噪声层（雨/风/微光）。type = 滤波器类型，
   freq → swTo 可在播放中扫频（雨声由亮慢慢闷下去就是靠这个） */
function noiseVoice(at, dur, gain, type, freq, swTo, bus){
  const A = ac(), t = at, out = bus || MASTER;
  const s = A.createBufferSource(); s.buffer = noiseBuf(); s.loop = true;
  const bp = A.createBiquadFilter(); bp.type = type; bp.frequency.setValueAtTime(freq, t); bp.Q.value = 1;
  if (swTo) bp.frequency.linearRampToValueAtTime(swTo, t + dur);
  const g = A.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.3);
  g.gain.setValueAtTime(gain, t + dur * 0.7);
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(out);
  s.start(t); s.stop(t + dur + 0.05);
}

/* clickVoice()：节拍器的"嗒"。无音高（方波短脉冲），不参与键盘/方块点亮，
   但会点亮拍点圆点（dot = 第几个圆点） */
function clickVoice(at, strong, dot){
  const A = ac(), t = at;
  const o = A.createOscillator(), g = A.createGain();
  o.type = 'square'; o.frequency.value = strong ? 1500 : 1000;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(strong ? 0.3 : 0.16, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g); g.connect(MASTER); o.start(t); o.stop(t + 0.06);
  if (dot != null){
    const el = document.querySelectorAll('#rhythmDots .beat')[dot];
    if (el){ el.classList.add('hit'); clearTimeout(el._ft); el._ft = setTimeout(() => el.classList.remove('hit'), 180); }
  }
}

/* ============ 节拍器（第 07 节） ============ */
/* MET：一个会"自己往前排程"的节拍器。每 25ms 检查一次，把未来 0.2s 内的拍子
   全部预排到 AudioContext 时间轴上（currentTime 精度远高于 setTimeout），
   所以长跑不飘。圆点高亮仍走 setTimeout，只差几十毫秒无感。 */
const MET = {
  timer: null, bpm: 90, beats: 4, cur: 0, next: 0,
  start(){
    ac(); this.stop(); this.cur = 0; this.next = ac().currentTime + 0.1;
    const self = this;
    this.timer = setInterval(() => {
      const A = ac();
      while (self.next < A.currentTime + 0.2){ self.sched(self.next); self.next += 60 / self.bpm; }
    }, 25);
  },
  /* sched(t)：在绝对时刻 t 排一拍。第一拍重（1500Hz），其余轻（1000Hz） */
  sched(t){
    const beat = this.cur % this.beats, strong = (beat === 0), A = ac();
    const o = A.createOscillator(), g = A.createGain();
    o.type = 'square'; o.frequency.value = strong ? 1500 : 1000;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(strong ? 0.3 : 0.16, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g); g.connect(MASTER); o.start(t); o.stop(t + 0.06);
    const delay = Math.max(0, (t - A.currentTime) * 1000), dots = $$('#metBeatsDots .beat');
    setTimeout(() => { if (!this.timer) return; dots.forEach(d => d.classList.remove('hit')); dots[beat] && dots[beat].classList.add('hit'); }, delay);
    this.cur++;
  },
  /* stop()：停表并清掉圆点高亮，顺带把键盘视口复位 */
  stop(){
    if (this.timer){ clearInterval(this.timer); this.timer = null; }
    $$('#metBeatsDots .beat').forEach(d => d.classList.remove('hit'));
    kbUserPanned = false; kbAuto = false; kbHomeAll(500);
  }
};
