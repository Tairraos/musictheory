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

function playGameNotes(notes, gap){
  if (typeof voice !== 'function' || typeof ac !== 'function' || typeof newBus !== 'function') return;
  const list = (notes || []).filter(n => Number.isInteger(n));
  if (!list.length) return;
  stopGameAudio();
  const A = ac();
  const start = A.currentTime + 0.08;
  const step = Math.max(0.05, gap || 0.5);
  const bus = newBus((list.length * step + 2) * 1000);
  list.forEach((m, i) => {
    voice(m, start + i * step, Math.min(0.9, step * 0.9), 0.42, 'piano', bus);
  });
}

Object.assign(window, { stopGameAudio, playGameNotes });
