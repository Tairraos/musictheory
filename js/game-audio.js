/* ==========================================================================
 * 《姐弟厨师团》 · 互动课音频适配（js/game-audio.js）
 * --------------------------------------------------------------------------
 * 复用教程页的实时 Web Audio 合成器；游戏页没有教程键盘，
 * 所以给 audio.js 依赖的 flashKey() 一个空实现。
 * ========================================================================== */

function flashKey(){}

let GAME_AUDIO_TOKEN = 0;

function stopGameAudio(){
  GAME_AUDIO_TOKEN++;
  if (typeof TOKEN !== 'undefined') TOKEN++;
  if (typeof killBuses === 'function') killBuses();
}

function playGameNotes(notes, gap, extra){
  if (typeof voice !== 'function' || typeof ac !== 'function' || typeof newBus !== 'function') return;
  const list = (notes || []).filter(n => Number.isInteger(n));
  if (!list.length) return;
  const lead = Math.max(0, (extra && extra.lead) || 0);
  const clicks = (extra && Array.isArray(extra.clicks)) ? extra.clicks : null;
  stopGameAudio();
  const A = ac();
  const start = A.currentTime + 0.08;
  const step = Math.max(0.05, gap || 0.5);
  const total = lead + list.length * step + (clicks ? (clicks[clicks.length - 1] + step) : 0) + 1;
  const bus = newBus(total * 1000);
  /* 节拍点：高音、极短、很轻——弱起/切分这类"相对拍点偏了"的演示，
   * 没有拍点对比就听不出差别。 */
  if (clicks) clicks.forEach(ct => voice(96, start + ct, 0.06, 0.14, 'piano', bus));
  list.forEach((m, i) => {
    voice(m, start + lead + i * step, Math.min(0.9, step * 0.9), 0.42, 'piano', bus);
  });
}

Object.assign(window, { stopGameAudio, playGameNotes });
