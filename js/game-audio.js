/* ==========================================================================
 * 《姐弟厨师团》 · 互动课音频适配（js/game-audio.js）
 * --------------------------------------------------------------------------
 * 复用教程页的实时 Web Audio 合成器。演示事件（evs）由生成器从教程捕获：
 * 每条 {t, m, d, g, kind, lit} 或 {t, click, strong}，t 为相对秒。
 * 播放时逐条排程 voice()，audio.js 每发一音回调 flashKey()——
 * 这里按 playback.js 同款逻辑点亮底部钢琴键与示意图方块（rect.lit）。
 * ========================================================================== */

let GAME_AUDIO_TOKEN = 0;

function stopGameAudio(){
  GAME_AUDIO_TOKEN++;
  if (typeof TOKEN !== 'undefined') TOKEN++;
  if (typeof killBuses === 'function') killBuses();
}

/* 发声瞬间点亮：底部钢琴键（琥珀）+ 示意图方块（.lit，珊瑚色）。
 * litKey 是生成器捕获的精确点亮位（旋律里同音的多个方块不会一起亮）；
 * 没有就退化为按音高全亮（rect[data-note=midi]）。
 * jsdom 无音频设备时 ac() 会抛错，静默返回。 */
function flashKey(midi, at, ms, litKey){
  if (midi == null) return;
  let A;
  try { A = ac(); } catch (e) { return; }
  const tok = GAME_AUDIO_TOKEN;
  const delay = Math.max(0, (at - A.currentTime) * 1000);
  const t = ms || 220;
  setTimeout(() => {
    if (tok !== GAME_AUDIO_TOKEN) return;   /* 已被停止：不亮 */
    /* 画面外的键先滚进可视窗（用户拖过键盘 2 秒内则让位） */
    if (typeof gameKbFollow === 'function'){ try { gameKbFollow(midi); } catch (e) {} }
    const kb = document.getElementById('gameKb');
    if (kb) kb.querySelectorAll('[data-m="' + midi + '"]').forEach(el => {
      el.classList.add('flash');
      clearTimeout(el._ft);
      el._ft = setTimeout(() => el.classList.remove('flash'), t);
    });
    const fig = document.getElementById('pageBlocks');
    if (fig){
      const sel = litKey ? 'rect[data-lit="' + litKey + '"]' : 'rect[data-note="' + midi + '"]';
      fig.querySelectorAll('svg rect' + sel).forEach(r => {
        r.classList.add('lit');
        clearTimeout(r._ft);
        r._ft = setTimeout(() => r.classList.remove('lit'), t);
      });
    }
  }, delay);
}

/* 播放一组捕获来的演示事件。click 事件是教程的节拍器拍点（无音高），
 * 用高音短音模拟：重拍高一点亮一点，弱拍反之——
 * 弱起/切分这类"相对拍点偏了"的演示，没有拍点对比就听不出差别。
 *
 * strip：页内的条块 DOM（.strip-wrap）。教程里播放时拍点圆点/和弦格子
 * 会逐个点亮（.hit），互动课必须同样"会动"，mode 由条块类型决定：
 *   圆点条 —— click 按 dot（教程捕获的精确格位）或出现序号点亮；
 *             纯旋律演示（速度术语）按事件序号点亮（教程同款 i % 4）；
 *   和弦条 —— 事件按时间分组（间隔 >0.6s 为新和弦），逐组点亮格子。 */
function playGameEvs(evs, strip){
  if (typeof voice !== 'function' || typeof ac !== 'function' || typeof newBus !== 'function') return null;
  const list = (evs || []).filter(e => e && (e.click || Number.isInteger(e.m)));
  if (!list.length) return null;
  stopGameAudio();
  const A = ac();
  const start = A.currentTime + 0.08;
  const end = Math.max.apply(null, list.map(e => e.t + (e.click ? 0.1 : (e.d || 0.9))));
  const bus = newBus((end + 2) * 1000);
  const tok = GAME_AUDIO_TOKEN;

  /* 点亮 strip 的一格；tok 已变（用户点了别的）就不亮 */
  let cells = null, len = 0;
  if (strip && strip.children && strip.children.length){
    cells = [...strip.children];
    len = cells.length;
  }
  const hitCell = (idx, ms) => {
    if (!cells) return;
    const c = cells[((idx % len) + len) % len];
    if (!c) return;
    c.classList.add('hit');
    clearTimeout(c._gft);
    c._gft = setTimeout(() => c.classList.remove('hit'), ms);
  };
  const chordMode = !!(strip && strip.classList && strip.classList.contains('chords'));
  const dotsMode = !!cells && !chordMode && list.some(e => e.click);

  let clickN = 0, evN = 0, chordN = -1, prevT = -9;
  list.forEach(e => {
    if (e.click){
      voice(e.strong ? 96 : 91, start + e.t, 0.06, e.strong ? 0.18 : 0.1, 'piano', bus);
      if (dotsMode) setTimeout(() => { if (tok !== GAME_AUDIO_TOKEN) return; hitCell(Number.isInteger(e.dot) ? e.dot : clickN, 180); }, Math.max(0, e.t * 1000));
      clickN++;
    } else {
      voice(e.m, start + e.t, e.d, e.g, e.kind || 'piano', bus, e.lit);
      if (chordMode){
        if (e.t - prevT > 0.6){
          chordN++;
          const n = chordN;
          setTimeout(() => { if (tok !== GAME_AUDIO_TOKEN) return; cells.forEach(c => c.classList.remove('hit')); hitCell(n, 1400); }, Math.max(0, e.t * 1000));
        }
        prevT = e.t;
      } else if (cells && !dotsMode){
        /* 纯旋律 + 圆点条（速度术语演示）：教程按音序 i % 圆点数点亮 */
        const n = evN;
        setTimeout(() => { if (tok !== GAME_AUDIO_TOKEN) return; hitCell(n, 220); }, Math.max(0, e.t * 1000));
      }
    }
    evN++;
  });
  return end;
}

Object.assign(window, { stopGameAudio, flashKey, playGameEvs });
