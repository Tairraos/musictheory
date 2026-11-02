/* ==========================================================================
 * 《姐弟厨师团》 · 互动课音频适配（js/game-audio.js）
 * --------------------------------------------------------------------------
 * 复用教程页的实时 Web Audio 合成器；底部钢琴（game-kb.js）画好键后，
 * audio.js 的 voice() 每发一个音都会回调 flashKey()——
 * 这里按 playback.js 的同款逻辑实现：延迟到发声时刻、琥珀闪键、
 * 播放被停止（TOKEN 递增）时在途闪光一并作废。
 * ========================================================================== */

let GAME_AUDIO_TOKEN = 0;

function stopGameAudio(){
  GAME_AUDIO_TOKEN++;
  if (typeof TOKEN !== 'undefined') TOKEN++;
  if (typeof killBuses === 'function') killBuses();
}

/* 点亮底部钢琴上对应 MIDI 的键（jsdom 无音频设备时 ac() 会抛错，静默返回） */
function flashKey(midi, at, ms){
  if (midi == null) return;
  const kb = document.getElementById('gameKb');
  if (!kb) return;
  let A;
  try { A = ac(); } catch (e) { return; }
  const tok = GAME_AUDIO_TOKEN;
  const delay = Math.max(0, (at - A.currentTime) * 1000);
  const t = ms || 220;
  setTimeout(() => {
    if (tok !== GAME_AUDIO_TOKEN) return;   /* 已被停止：不亮 */
    kb.querySelectorAll('[data-m="' + midi + '"]').forEach(el => {
      el.classList.add('flash');
      clearTimeout(el._ft);
      el._ft = setTimeout(() => el.classList.remove('flash'), t);
    });
  }, delay);
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
