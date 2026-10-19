/* ==========================================================================
 * 《姐弟厨师团——乐理课》 · 音色与环境层（js/audio.js）
 * --------------------------------------------------------------------------
 * 职责：Web Audio 实时合成。全站没有任何音频文件——每个音都是现场用振荡器
 *       拼出来的。另含节拍器 MET。
 *
 * 【本次重写的核心：把音色从"if/else 硬编码"改成"TONES 查表"】
 *   原版只有 piano / pad / pluck 三种音色，全部写死在 voice() 的 if 分支里，
 *   于是"材质"（玻璃/金属/丝绸/木头）这类维度根本无法表达——所有场景听起来
 *   都像同一台琴。现在每种音色是一行数据（起音时间、衰减、泛音配比、滤波
 *   亮度），voice() 读表工作，新增音色不用改引擎。
 *
 * 关键全局：
 *   AC / MASTER —— AudioContext 与主输出（带压缩器，多音齐响不爆音）
 *   TOKEN       —— 播放代号：每次 stopAll 自增，用于取消过期定时器
 *   BUSES       —— 每次播放开一条独立总线，方便整体静音
 *   NOISEBUF    —— 2 秒白噪声缓冲（雨/风/微光的原料），懒加载
 * ========================================================================== */

/* ============ 音频引擎 ============ */
let AC = null, MASTER = null, TOKEN = 0, NOISEBUF = null, BUSES = [];

/* TONES：音色表。每一行描述一种"怎么响"，对应到人耳的材质与触感联想：
 *   atk  起音时间（秒）—— 6ms 脆响＝玻璃/金属，400ms 慢起＝丝绸/木头
 *   dec  衰减方式 'exp' 指数（打击感）| 'lin' 线性（呼吸感）
 *   hold 是否在末段保持音量（pad 类需要，制造"还没结束"的错觉）
 *   o2   二次泛音（八度）配比 —— 泛音越多越亮
 *   o3   三次泛音（十二度）配比 —— 高频"毛刺"，金属/钟的关键
 *   lp0  低通起始频率 —— 高＝通透，<1000 ＝闷在棉被里
 *   lp1  低通结束频率 —— 与 lp0 的落差决定"变暗"的速度
 *   atkCurve 起音斜率 'exp' 快 | 'lin' 缓
 */
const TONES = {
  piano:  { atk:0.012, dec:'exp', hold:false, o2:0.32, o3:0.07, lp0:5200, lp1:900,  tag:'钢琴' },
  pad:    { atk:0.450, dec:'exp', hold:true,  o2:0.20, o3:0.07, lp0:1400, lp1:1400, tag:'铺底' },
  pluck:  { atk:0.006, dec:'exp', hold:false, o2:0.32, o3:0.07, lp0:5200, lp1:900,  tag:'拨弦' },
  glass:  { atk:0.002, dec:'exp', hold:false, o2:0.20, o3:0.26, lp0:9000, lp1:2400, tag:'玻璃' },
  metal:  { atk:0.001, dec:'exp', hold:false, o2:0.42, o3:0.34, lp0:11000, lp1:1800, tag:'金属' },
  wood:   { atk:0.009, dec:'exp', hold:false, o2:0.14, o3:0.03, lp0:2600, lp1:700,  tag:'木头' },
  silk:   { atk:0.180, dec:'exp', hold:false, o2:0.24, o3:0.05, lp0:3400, lp1:1500, tag:'丝绸' },
  bass:   { atk:0.020, dec:'exp', hold:false, o2:0.10, o3:0.02, lp0:1600, lp1:320,  tag:'低音' },
  bell:   { atk:0.002, dec:'exp', hold:false, o2:0.16, o3:0.44, lp0:12000, lp1:5200, tag:'钟' },
  breath: { atk:0.620, dec:'exp', hold:true,  o2:0.18, o3:0.04, lp0:1000, lp1:1000, tag:'气息' },
  stone:  { atk:0.030, dec:'exp', hold:false, o2:0.08, o3:0.02, lp0:900,  lp1:380,  tag:'石' },
  organ:  { atk:0.028, dec:'exp', hold:true,  o2:0.30, o3:0.18, lp0:4200, lp1:2000, tag:'管风琴' },
};

/* NOISES：环境噪声表。天气/材质/空间三类维度靠它。
 *   type  带通/低通/高通类型 —— 低通＝闷（风、雾、远处的雷），高通＝亮（雨点、电流）
 *   f0/f1 起止频率 —— 扫频方向决定"渐强"还是"渐弱"
 *   q     共振峰锐度 —— 大＝有音高（像人声/机器），小＝无差别嘶嘶
 *   amp   基础音量 —— 与旋律音量的比值决定"背景还是前景"
 */
const NOISES = {
  none:    null,
  rain:    { type:'bandpass', f0:2400, f1:1800, q:1.0, amp:0.055, tag:'雨' },
  downpour:{ type:'bandpass', f0:3400, f1:5200, q:0.7, amp:0.085, tag:'暴雨' },
  wind:    { type:'lowpass',  f0:420,  f1:700,  q:1.0, amp:0.060, tag:'风' },
  gale:    { type:'lowpass',  f0:260,  f1:980,  q:1.6, amp:0.090, tag:'狂风' },
  mist:    { type:'lowpass',  f0:300,  f1:220,  q:0.6, amp:0.018, tag:'雾' },
  sparkle: { type:'highpass', f0:5000, f1:5000, q:1.0, amp:0.022, tag:'微光' },
  fire:    { type:'bandpass', f0:1400, f1:900,  q:2.2, amp:0.048, tag:'火' },
  crowd:   { type:'bandpass', f0:760,  f1:900,  q:2.6, amp:0.055, tag:'人声' },
  machine: { type:'lowpass',  f0:180,  f1:260,  q:3.5, amp:0.070, tag:'机械' },
  water:   { type:'bandpass', f0:1100, f1:1900, q:1.4, amp:0.050, tag:'水' },
  static:  { type:'highpass', f0:6200, f1:6200, q:1.0, amp:0.030, tag:'电流' },
  thunder: { type:'lowpass',  f0:160,  f1:70,   q:1.2, amp:0.105, tag:'雷' },
};

/* ac()：懒加载 AudioContext。浏览器要求用户手势后才能发声，
 *   所以不在页面加载时创建，而是第一次播放/点键时才建；顺带处理 resume。 */
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

/* voice()：弹一个音。三个振荡器叠加（基频 + 八度 + 十二度），
 *   参数全部从 TONES 表读。三条调度路径对应三种包络手感：
 *     hold=true  → 慢起、保持、慢收（铺底/气息，制造"还在持续"的错觉）
 *     atk <0.01  → 瞬间起音后指数衰减（打击/拨弦/脆响）
 *     其余       → 线性起音 + 指数衰减（钢琴/一般）
 *   kind 不认识时回落 piano（配置写错也不炸）。
 *   bus 参数让整条播放挂在同一总线上，可被 killBuses 整体静音。
 *   bend：可选的滑音终点（半音数），用于"下坠""上冲"这类运动状态 */
function voice(midi, at, dur, gain, kind, bus, litKey, bend){
  flashKey(midi, at, (dur || 0.9) * 500, litKey);   /* 闪光保持音符时长的一半 */
  const A = ac(), t = at, out = bus || MASTER;
  const T = TONES[kind] || TONES.piano;
  const g = A.createGain(), lp = A.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(T.lp0, t);
  if (T.lp1 !== T.lp0) lp.frequency.exponentialRampToValueAtTime(Math.max(60, T.lp1), t + dur);

  const f0 = f(midi);
  const o1 = A.createOscillator(); o1.type = 'sine'; o1.frequency.value = f0;
  const o2 = A.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f0 * 2;
  const o3 = A.createOscillator(); o3.type = 'sine';     o3.frequency.value = f0 * 3.01;

  /* 滑音：把三个振荡器一起弯过去，endAt 之后再收 */
  if (bend){
    const bf = f(midi + bend);
    [o1, o2, o3].forEach(o => { o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(bf, t + dur); });
  }

  const g2 = A.createGain(); g2.gain.value = T.o2;
  const g3 = A.createGain(); g3.gain.value = T.o3;
  o1.connect(g); o2.connect(g2); g2.connect(g); o3.connect(g3); g3.connect(g);
  g.connect(lp); lp.connect(out);

  const d = Math.max(0.05, dur);
  if (T.hold){
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + T.atk);
    g.gain.setValueAtTime(gain, Math.max(t + T.atk + 0.02, t + d * 0.6));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  } else if (T.atk < 0.01){
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + T.atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  } else {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + T.atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  }
  [o1, o2, o3].forEach(o => { o.start(t); o.stop(t + d + 0.1); });
}

/* noiseVoice()：环境噪声层。type/f0/f1 全部来自 NOISES 表，
 *   f0→f1 的扫频是"渐强/渐弱"的关键（雨由亮慢慢闷下去就是靠这个） */
function noiseVoice(at, dur, gain, type, freq, swTo, bus){
  const A = ac(), t = at, out = bus || MASTER;
  const s = A.createBufferSource(); s.buffer = noiseBuf(); s.loop = true;
  const bp = A.createBiquadFilter(); bp.type = type; bp.frequency.setValueAtTime(freq, t); bp.Q.value = 1;
  if (swTo) bp.frequency.linearRampToValueAtTime(swTo, t + dur);
  const g = A.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.3);
  g.gain.setValueAtTime(gain, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(out);
  s.start(t); s.stop(t + dur + 0.05);
}

/* sceneNoise()：按 NOISES 表里的名字铺一层环境声。
 *   name 取不到（配置写错）时静默跳过，不影响播放 */
function sceneNoise(name, at, dur, bus){
  const N = NOISES[name];
  if (!N) return;
  noiseVoice(at, dur, N.amp, N.type, N.f0, N.f1, bus);
  /* 下大雨 / 狂风这类要"厚"的声音，第二层补一条低频把底噪垫起来 */
  if (N.amp > 0.07) noiseVoice(at, dur, N.amp * 0.45, 'lowpass', 220, 140, bus);
  /* 电流/金属这类高频信号补一层超高频，制造"刺" */
  if (N.f0 > 5000) noiseVoice(at, dur, N.amp * 0.5, 'highpass', 8000, 8000, bus);
}

/* clickVoice()：节拍器的"嗒"。无音高（方波短脉冲），不参与键盘/方块点亮，
 *   但会点亮拍点圆点（dot = 第几个圆点） */
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
