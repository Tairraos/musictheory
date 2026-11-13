/* ==========================================================================
 * 《姐弟厨师团》 · 卡片版互动卡（js/cards-widgets.js）
 * --------------------------------------------------------------------------
 * 每张互动卡都是**自包含**的：自带 DOM、自绑事件，不依赖页面里任何固定 id。
 * 这是卡片版与长网页版最大的结构差别——长网页版（sections.js）满屏都是
 * `$('#playProg').onclick`，卡片一翻页那些 id 就不在了。
 *
 * 复用：音频与播放调度直接用 audio.js / playback.js 的真源（voice/seq/
 * sceneEvents…），数据直接用 data.js / lyric-data.js / instrument-data.js。
 * 这里只做"摆盘"：把已有能力摆成一张能在一屏里读完、点得动的卡。
 *
 * 约束：一张卡不许上下滚动。所以每个 widget 的元件数都刻意压到
 * 一行 chips + 一行按钮 + 两三行读出；长内容拆成多张卡（见 cards-deck.js）。
 * ========================================================================== */

const MT_W = (function () {
  'use strict';

  /* ---------------- 小工具 ---------------- */
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function head(host, title, sub) {
    const h = el('div', 'w-head', `<b>${title}</b>${sub ? `<span>${sub}</span>` : ''}`);
    host.appendChild(h);
    return h;
  }
  function row(host, cls) {
    const r = el('div', 'w-row' + (cls ? ' ' + cls : ''));
    host.appendChild(r);
    return r;
  }
  function button(host, label, fn, cls) {
    const b = el('button', 'w-btn' + (cls ? ' ' + cls : ''), label);
    b.type = 'button';
    b.onclick = e => { e.preventDefault(); fn(b); };
    host.appendChild(b);
    return b;
  }
  function readout(host) {
    const r = el('div', 'w-read');
    host.appendChild(r);
    return r;
  }
  /* 一排 chips，单选。返回 setActive(i) 与容器 */
  function chipRow(host, labels, onPick, active) {
    const box = el('div', 'w-chips');
    const btns = labels.map((lab, i) => {
      const b = el('button', 'w-chip' + (i === active ? ' on' : ''), lab);
      b.type = 'button';
      b.onclick = e => {
        e.preventDefault();
        btns.forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        onPick(i, b);
      };
      box.appendChild(b);
      return b;
    });
    host.appendChild(box);
    return { box, btns, setActive: i => btns.forEach((b, k) => b.classList.toggle('on', k === i)) };
  }
  function select(pairs, value) {
    const s = el('select', 'w-sel');
    pairs.forEach(([v, t]) => {
      const o = document.createElement('option');
      o.value = v; o.textContent = t;
      s.appendChild(o);
    });
    s.value = value;
    return s;
  }
  const nname = m => noteName(m);
  const strip = h => String(h || '').replace(/<[^>]+>/g, '');
  const NOTE_KINDS = { piano: '钢琴', pluck: '拨弦' };

  /* 播放：一律走 seq（它自带"先停上一段、亮键、播完回正"）。
   * litSel 传 '' —— 卡片里没有示意图方块，只让下方钢琴亮键。 */
  function play(steps) { seq(steps, ''); }

  function scaleSteps(rootPc, mode, dir) {
    const base = midiOct(rootPc, 4), out = [];
    let i = 0;
    for (let o = 0; o < 2; o++) {
      const semis = dir > 0 ? mode.semis : mode.semis.slice().reverse();
      semis.forEach(sv => {
        const oct = dir > 0 ? o : (1 - o);
        out.push({ at: i * 0.27, m: base + sv + oct * 12, d: 0.9, g: 0.4, kind: 'piano' });
        i++;
      });
    }
    return out;
  }

  /* 改 state 后重画下方钢琴的亮键（卡片版只有一架琴：底栏那架） */
  function litKeys(rootPc, modeId) {
    try {
      state.root = rootPc;
      state.mode = modeId;
      renderKB();
    } catch (e) { /* 底栏被收起时忽略 */ }
  }

  /* ---------------- 乐理 · 调与调式 ---------------- */
  function wScale(host) {
    head(host, '先弄响它', '选调与调式，下方琴键会亮起属于它的音');
    const r = row(host, 'w-selrow');
    r.appendChild(el('label', 'w-cap', '调'));
    const rs = select(PC.map((n, i) => [i, n]), 0);
    r.appendChild(rs);
    r.appendChild(el('label', 'w-cap', '调式'));
    const ms = select(ALL_MODES.map(m => [m.id, m.zh + ' · ' + m.en]), 'ionian');
    r.appendChild(ms);

    const out = readout(host);
    const upd = () => {
      const m = M_OF(ms.value);
      litKeys(+rs.value, ms.value);
      const steps = m.semis.slice(1).map((v, i) => v - m.semis[i]).join(' ');
      out.innerHTML = `<b>${PC[+rs.value]} ${m.zh}</b> · ${m.tag}<br>
        <span class="w-k">全半音规则 ${steps}</span>`;
    };
    rs.onchange = ms.onchange = upd;

    const b = row(host, 'w-btnrow');
    button(b, '▶ 上行', () => play(scaleSteps(+rs.value, M_OF(ms.value), 1)));
    button(b, '▶ 下行', () => play(scaleSteps(+rs.value, M_OF(ms.value), -1)));
    button(b, '✕ 停止', () => stopAll(), 'ghost');
    upd();
  }

  /* ---------------- 乐理 · 音程 ---------------- */
  function wInterval(host) {
    head(host, '量一量两个音有多远', '半音数决定听感；点 ▶ 先听上行、再听叠在一起');
    const r = row(host, 'w-selrow');
    r.appendChild(el('label', 'w-cap', '起点'));
    const a = select(Array.from({ length: 13 }, (_, i) => [60 + i, nname(60 + i)]), 60);
    r.appendChild(a);
    r.appendChild(el('label', 'w-cap', '终点'));
    const b = select(Array.from({ length: 25 }, (_, i) => [60 + i, nname(60 + i)]), 64);
    r.appendChild(b);

    const out = readout(host);
    const upd = () => {
      const x = +a.value, y = +b.value, d = Math.abs(y - x);
      const iv = INTERVALS.find(z => z.s === Math.min(12, d)) || INTERVALS[0];
      out.innerHTML = `<b>${iv.name}</b> · ${iv.s} 个半音<br><span class="w-k">${iv.kw}</span>`;
    };
    a.onchange = b.onchange = upd;
    upd();

    const br = row(host, 'w-btnrow');
    button(br, '▶ 听听这个音程', () => {
      const x = +a.value, y = +b.value;
      play([{ at: 0, m: x, d: .7, g: .38 }, { at: .62, m: y, d: .85, g: .38 },
            { at: 1.5, m: x, d: .8, g: .3 }, { at: 1.5, m: y, d: .8, g: .3 }]);
    });
  }

  /* ---------------- 乐理 · 大调 / 小调三种形态 ---------------- */
  function wMinorForms(host) {
    const items = [{ n: '大调', s: MODES[0].semis, d: '基准。第三级是大三度（4 个半音）→ 敞亮' }]
      .concat(MINOR_FORMS.map(f => ({ n: f.name, s: f.s, d: f.d })));
    head(host, '差的就是第三级那半格', '同一串级数，换个调式就换一副脸色');
    const out = readout(host);
    let cur = 0;
    const chips = chipRow(host, items.map(x => x.n), i => {
      cur = i;
      out.innerHTML = `<b>${items[i].n}</b><br><span class="w-k">${items[i].d}</span>`;
      play(items[i].s.map((sv, k) => ({ at: k * 0.28, m: midiOct(0, 4) + sv, d: .9, g: .4 })));
      if (items[i].n !== '大调') { state.mode = 'aeolian'; renderKB(); }
      else { state.mode = 'ionian'; renderKB(); }
    }, 0);
    out.innerHTML = `<b>${items[0].n}</b><br><span class="w-k">${items[0].d}</span>`;
    void chips;
  }

  /* ---------------- 乐理 · 七个调式 ---------------- */
  function wModes(host) {
    head(host, '七个调式逐个听', '点一个：琴键亮出它的音，同时放一整条音阶');
    const out = readout(host);
    const pick = i => {
      const m = MODES[i];
      litKeys(0, m.id);
      out.innerHTML = `<b>${m.zh} ${m.en}</b> · ${m.tag}<br>
        <span class="w-k">${m.feat}　${m.ex}</span>`;
      play(scaleSteps(0, m, 1));
    };
    chipRow(host, MODES.map(m => m.zh), pick, 0);
    out.innerHTML = `<b>${MODES[0].zh} ${MODES[0].en}</b> · ${MODES[0].tag}<br>
      <span class="w-k">${MODES[0].feat}　${MODES[0].ex}</span>`;
  }

  /* ---------------- 乐理 · 五声五调 / 国风与和风 ---------------- */
  function modeWidget(host, title, sub, list) {
    head(host, title, sub);
    const out = readout(host);
    const show = i => {
      const m = list[i];
      litKeys(0, m.id);
      out.innerHTML = `<b>${m.zh}</b> · ${m.tag}<br><span class="w-k">${m.feat}　${m.ex}</span>`;
      play(scaleSteps(0, m, 1));
    };
    chipRow(host, list.map(m => m.zh), show, 0);
    const m0 = list[0];
    out.innerHTML = `<b>${m0.zh}</b> · ${m0.tag}<br><span class="w-k">${m0.feat}　${m0.ex}</span>`;
  }

  function wPenta(host) {
    modeWidget(host, '五个音，五种调', '同一组音换主音：哪个音当主音，就叫什么调',
      [CN_GONG, CN_SHANG, CN_JIAO, CN_ZHI, CN_YU]);
  }
  function wExotic(host) {
    modeWidget(host, '国风与和风的家规', '偏音与中间音——调式选择几乎就是风格选择',
      [CN_YAYUE, CN_QINGYUE, CN_YANYUE, CN_KUYIN, CN_HUANYIN,
       JP_RITSU, HIRAJOSHI, JP_MINYO, JP_RYUKYU, JP_INSEN]);
  }

  /* ---------------- 乐理 · 和弦 ---------------- */
  function wChords(host) {
    head(host, '在 C 大调上叠七个和弦', '隔一个音取一个；大三＝亮，小三＝暗，减＝卡住');
    const qzh = { maj: '大三', min: '小三', dim: '减', aug: '增' };
    const list = Array.from({ length: 7 }, (_, deg) => {
      const ch = triad(midiOct(0, 4), MODES[0], deg);
      return { deg, ch, lab: chordLabel(MODES[0], deg, ch.q) };
    });
    const out = readout(host);
    const show = i => {
      const c = list[i];
      out.innerHTML = `<b>${c.lab}</b> · ${qzh[c.ch.q] || c.ch.q}<br>
        <span class="w-k">${c.ch.notes.map(nname).join(' — ')}</span>`;
      play(c.ch.notes.map((m, k) => ({ at: 0, m, d: 1.6, g: 0.34 * (k ? .72 : 1) })));
    };
    chipRow(host, list.map(c => c.lab), show, 0);
    const c0 = list[0];
    out.innerHTML = `<b>${c0.lab}</b> · ${qzh[c0.ch.q]}<br><span class="w-k">${c0.ch.notes.map(nname).join(' — ')}</span>`;
  }

  /* ---------------- 乐理 · 终止式 ---------------- */
  function wCadence(host) {
    head(host, '五种落点，五种心情', '同样的和弦，停在哪一级，就是哪种结局');
    const out = readout(host);
    const show = i => {
      const c = CADENCES[i];
      out.innerHTML = `<b>${c.n}</b><br><span class="w-k">${c.t}</span>`;
      const chords = c.d.map(d => triad(midiOct(0, 4), MODES[0], d));
      const steps = [];
      chords.forEach((ch, k) => ch.notes.forEach((m, j) => steps.push({
        at: k * 1.15, m, d: k === chords.length - 1 ? 1.9 : 1.1, g: 0.34 * (j ? .7 : 1),
      })));
      play(steps);
    };
    chipRow(host, CADENCES.map(c => c.n.replace(/（.*/, '')), show, 0);
    out.innerHTML = `<b>${CADENCES[0].n}</b><br><span class="w-k">${CADENCES[0].t}</span>`;
  }

  /* ---------------- 乐理 · 速度 ---------------- */
  function wTempo(host) {
    head(host, '同一段旋律，六种速度', '行板 88 BPM 不是慢——它只是"像散步"');
    const out = readout(host);
    const show = i => {
      const t = TEMPOS[i];
      out.innerHTML = `<b>${t.n}</b> · ${t.b} BPM<br><span class="w-k">${t.k}</span>`;
      const spb = 60 / t.b, steps = [];
      HOOK.forEach((sv, k) => steps.push({ at: k * spb, m: midiOct(0, 4) + sv, d: spb * .92, g: .42 }));
      for (let k = 0; k < HOOK.length; k++) steps.push({ at: k * spb, c: 1, strong: k % 4 === 0 });
      play(steps);
    };
    chipRow(host, TEMPOS.map(t => t.n.split(' ')[0]), show, 2);
    out.innerHTML = `<b>${TEMPOS[2].n}</b> · ${TEMPOS[2].b} BPM<br><span class="w-k">${TEMPOS[2].k}</span>`;
  }

  /* ---------------- 乐理 · 拍号 ---------------- */
  function wMeter(host) {
    head(host, '拍号决定"怎么摆"', '每一拍的轻重不同，身体跟着动的方向就不同');
    const out = readout(host);
    const dots = el('div', 'w-beats');
    host.appendChild(dots);
    const paint = n => {
      dots.innerHTML = '';
      for (let i = 0; i < n; i++) dots.appendChild(el('i', 'w-beat' + (i === 0 ? ' strong' : ''), String(i + 1)));
    };
    const show = i => {
      const m = METERS[i];
      paint(m.b.length);
      out.innerHTML = `<b>${m.t}</b> · ${m.n}<br><span class="w-k">${m.d}</span>`;
      const spb = 60 / 84, steps = [];
      m.b.forEach((w, k) => {
        steps.push({ at: k * spb, c: 1, strong: w >= 1, dot: k });
        steps.push({ at: (k + m.b.length) * spb, c: 1, strong: w >= 1, dot: k });
      });
      play(steps);
      /* 圆点跟着响：两小节 */
      const beats = dots.children;
      m.b.concat(m.b).forEach((w, k) => {
        setTimeout(() => {
          if (!dots.isConnected) return;
          Array.from(beats).forEach(d => d.classList.remove('hit'));
          beats[k % m.b.length] && beats[k % m.b.length].classList.add('hit');
        }, 60 + k * spb * 1000);
      });
    };
    chipRow(host, METERS.map(m => m.t), show, 0);
    const m0 = METERS[0];
    paint(m0.b.length);
    out.innerHTML = `<b>${m0.t}</b> · ${m0.n}<br><span class="w-k">${m0.d}</span>`;
  }

  /* ---------------- 乐理 · 律动 ---------------- */
  function wGroove(host) {
    head(host, '同一段和声，五种打法', '只有节奏型不同——听到的差别全来自"怎么打"');
    const out = readout(host);
    const rows = GROOVE.rows;
    const show = i => {
      const r = rows[i];
      out.innerHTML = `<b>${r.n}</b> · ${r.feel}<br><span class="w-k">${r.when}</span>`;
      playGroove(r);
    };
    chipRow(host, rows.map(r => r.n), show, 0);
    out.innerHTML = `<b>${rows[0].n}</b> · ${rows[0].feel}<br><span class="w-k">${rows[0].when}</span>`;
  }

  /* ---------------- 乐理 · 十二小节布鲁斯 ---------------- */
  function wBlues(host) {
    head(host, '十二格：第九格才离开家', '前八格原地打转，第 9 格第一次出现 V7');
    const strip = el('div', 'w-bars');
    BLUES_FORM.chords.forEach((c, i) => {
      const deg = ['I', 'IV', 'V'][c.deg === 0 ? 0 : c.deg === 5 ? 2 : 1] || 'I';
      strip.appendChild(el('i', 'w-bar' + (i === 8 ? ' mark' : ''), deg + (c.v7 ? '7' : '')));
    });
    host.appendChild(strip);
    const r = row(host, 'w-btnrow');
    button(r, '▶ 只听和声', () => playBlues(false));
    button(r, '▶ 带词（AAB）', () => playBlues(true));
    const out = readout(host);
    out.innerHTML = '<span class="w-k">三行词各占四格：A 行、A 行再来一次、B 行必须给新东西。</span>';
  }

  function wShuffle(host) {
    head(host, '两个八分不是均分的', '速度、音高、音头数都不变，只把第二下往后挪');
    const out = readout(host);
    const show = i => {
      const k = SHUFFLE.kinds[i];
      out.innerHTML = `<b>${k.n}</b> · 后半落在 ${i ? '⅔' : '½'}<br><span class="w-k">${k.say}</span>`;
      playShuffle(k);
    };
    chipRow(host, SHUFFLE.kinds.map(k => k.chip), show, 0);
    out.innerHTML = `<b>${SHUFFLE.kinds[0].n}</b> · 后半落在 ½<br><span class="w-k">${SHUFFLE.kinds[0].say}</span>`;
  }

  /* ---------------- 乐理 · 词曲咬合 ---------------- */
  function wTonefit(host) {
    head(host, '顺字还是倒字', '旋律拧着字调走，字就倒了——同一个字，听感完全不同');
    const out = readout(host);
    let idx = 0;
    chipRow(host, LYRIC_LINES.map(l => l.t), i => {
      idx = i;
      out.innerHTML = `<b>${LYRIC_LINES[i].t}</b><br><span class="w-k">${LYRIC_LINES[i].src}</span>`;
    }, 0);
    const r = row(host, 'w-btnrow');
    button(r, '▶ 顺字', () => lyricTone(LYRIC_LINES[idx].w, false));
    button(r, '▶ 倒字', () => lyricTone(LYRIC_LINES[idx].w, true));
    out.innerHTML = `<b>${LYRIC_LINES[0].t}</b><br><span class="w-k">${LYRIC_LINES[0].src}</span>`;
  }

  function wStress(host) {
    head(host, '重音给了谁', '音高一个都不改，只改字占多长、落在第几拍');
    const out = readout(host);
    const vers = LYRIC_STRESS.vers;
    const show = i => {
      out.innerHTML = `<b>${vers[i].n}</b><br><span class="w-k">${vers[i].note}</span>`;
      lyricStress(vers[i]);
    };
    chipRow(host, vers.map(v => v.n), show, 0);
    out.innerHTML = `<b>${vers[0].n}</b><br><span class="w-k">${vers[0].note}</span>`;
  }

  function wPhrase(host) {
    head(host, '一字一音，还是一字多音', '同样八个字、同样四拍：这是"说话"与"唱"的分界');
    const out = readout(host);
    const r = row(host, 'w-btnrow');
    button(r, '▶ 像说话', () => { out.innerHTML = '<b>一字半拍</b><br><span class="w-k">密度和说话一样，像念词、像 rap。</span>'; lyricPhrase('speech'); });
    button(r, '▶ 像唱', () => { out.innerHTML = '<b>末字拖三个音</b><br><span class="w-k">前七字挤进去，最后一个字拐 2→4→2，这才是唱。</span>'; lyricPhrase('sing'); });
    out.innerHTML = '<span class="w-k">按一下，听同一个字被"说"出来和被"唱"出来的差别。</span>';
  }

  function wBreath(host) {
    head(host, '一口气能唱几个字', '同样 8 拍：字数越多，每个字分到的时间越少');
    const out = readout(host);
    const list = LYRIC_BREATH.lines;
    const show = i => {
      const L = list[i], per = LYRIC_BREATH.beats / L.n;
      const v = per < 0.75 ? '赶' : per < 0.9 ? '正常' : '从容';
      out.innerHTML = `<b>${L.line}</b><br><span class="w-k">${per.toFixed(2)} 拍/字 · ${v}　${L.src}</span>`;
      lyricBreath(L);
    };
    chipRow(host, list.map(l => l.t), show, 0);
    const L0 = list[0];
    out.innerHTML = `<b>${L0.line}</b><br><span class="w-k">${(LYRIC_BREATH.beats / L0.n).toFixed(2)} 拍/字 · 从容　${L0.src}</span>`;
  }

  /* ---------------- 乐理 · 移调 ---------------- */
  function wTranspose(host) {
    head(host, '同一段旋律，换个调', '音程关系一个都不改，只把整套音阶搬家');
    const keys = [['C', 0], ['D', 2], ['E', 4], ['F', 5], ['G', 7], ['A', 9]];
    const out = readout(host);
    const show = i => {
      const [k, s] = keys[i];
      const info = KEYINFO[s];
      out.innerHTML = `<b>${k} 大调</b><br><span class="w-k">${info ? info.s + ' 个' + (info.t === '#' ? '升号' : '降号') : '6 升 6 降的尴尬位'}</span>`;
      play(KEY_MEL.map((n, j) => ({ at: j * 0.28, m: midiOct(0, 4) + n + s, d: .9, g: .4 })));
    };
    chipRow(host, keys.map(k => k[0]), show, 0);
    out.innerHTML = '<b>C 大调</b><br><span class="w-k">没有升降号。点别的调，听到的旋律形状完全一样。</span>';
  }

  /* ---------------- 乐理 · 91 张听感配方（按维度） ---------------- */
  function wScenes(host, opt) {
    const dim = (DIMS.find(d => d.id === opt.dim)) || DIMS[0];
    const all = SCENES.filter(s => s.g === dim.id);
    /* opt.a/opt.b：同一个维度分成两张卡时，各自只放自己那一段 */
    const from = opt.a || 0, to = opt.b == null ? all.length : opt.b;
    const list = all.slice(from, to);
    const part = (opt.b != null) ? `（${from ? '下' : '上'}半）` : '';
    head(host, dim.zh + part, dim.q + '　共 ' + list.length + ' 张');
    const out = readout(host);
    const show = i => {
      const cfg = list[i];
      const m = M_OF(cfg.k);
      out.innerHTML = `<b>${cfg.t}</b>　<span class="w-k">${m.zh} · ${cfg.b} BPM · 音区 ${cfg.oct} · ${sceneRate(cfg).toFixed(1)} 音头/秒</span>
        <br><span class="w-k">${cfg.p}</span>`;
      scenePlay(cfg);
    };
    chipRow(host, list.map(s => s.t), show, 0);
    const c0 = list[0];
    out.innerHTML = `<b>${c0.t}</b>　<span class="w-k">${M_OF(c0.k).zh} · ${c0.b} BPM · 音区 ${c0.oct} · ${sceneRate(c0).toFixed(1)} 音头/秒</span>
      <br><span class="w-k">${c0.p}</span>`;
  }

  /* ---------------- 乐理 · 配器 ---------------- */
  function wEnsemble(host) {
    head(host, '同一条旋律，换三次主乐', '旋律一音不改——差别全来自"谁在说话"');
    const out = readout(host);
    const rows = ENSEMBLE.rows;
    const show = i => {
      const r = rows[i];
      out.innerHTML = `<b>${r.n}</b><br><span class="w-k">${r.say}</span>`;
      playEnsemble(r);
    };
    chipRow(host, rows.map(r => r.chip), show, 0);
    out.innerHTML = `<b>${rows[0].n}</b><br><span class="w-k">${rows[0].say}</span>`;
  }

  /* ---------------- 乐理 · 七和弦 / 转调 ---------------- */
  function wSevenths(host) {
    head(host, '在三和弦上再叠一个三度', '多出来的那个音决定味道：梦幻、想回家、还是悬着');
    const out = readout(host);
    const show = i => {
      const s = SEVENTHS[i];
      out.innerHTML = `<b>${s.n}</b> · ${s.role}<br><span class="w-k">${s.t}</span>`;
      play(s.s.map((sv, k) => ({ at: 0, m: midiOct(0, 4) + sv, d: 2.0, g: 0.3 * (k ? .78 : 1) })));
    };
    chipRow(host, SEVENTHS.map(s => s.n.split(' ')[0]), show, 0);
    out.innerHTML = `<b>${SEVENTHS[0].n}</b> · ${SEVENTHS[0].role}<br><span class="w-k">${SEVENTHS[0].t}</span>`;
  }

  function wModulation(host) {
    head(host, '副歌怎么"炸开"', '旋律一个音不改，整套音阶搬家');
    const out = readout(host);
    const show = i => {
      const m = MODS[i];
      out.innerHTML = `<b>${m.n}</b><br><span class="w-k">${m.t}</span>`;
      play(MOD_MEL.map((n, j) => ({ at: j * 0.28, m: midiOct(0, 4) + n + m.s, d: .9, g: .4 })));
    };
    chipRow(host, MODS.map(m => m.n.replace(/（.*/, '').replace('大调', '')), show, 0);
    out.innerHTML = `<b>${MODS[0].n}</b><br><span class="w-k">${MODS[0].t}</span>`;
  }

  /* ---------------- 作词 · 通用选择卡 ---------------- */
  /* cfg: {title, sub, items:[{l, rows:[[k,v]], html, play}]} */
  function chooser(host, cfg) {
    head(host, cfg.title, cfg.sub);
    const out = readout(host);
    const show = i => {
      const it = cfg.items[i];
      out.innerHTML = (it.rows || []).map(r =>
        `<div class="w-line"><i>${r[0]}</i><span>${r[1]}</span></div>`).join('')
        + (it.html ? `<div class="w-extra">${it.html}</div>` : '');
      if (it.play) it.play();
    };
    chipRow(host, cfg.items.map(it => it.l), show, 0);
    const it0 = cfg.items[0];
    out.innerHTML = (it0.rows || []).map(r =>
      `<div class="w-line"><i>${r[0]}</i><span>${r[1]}</span></div>`).join('')
      + (it0.html ? `<div class="w-extra">${it0.html}</div>` : '');
  }

  /* ---------------- 作词 · 各节选择卡 ---------------- */
  function wGenres(host) {
    chooser(host, {
      title: '先查表，再动笔', sub: '十三种体裁各有一套押韵约定，没有普适默认',
      items: GENRES.map(g => ({
        l: g.n.replace(/\s.*/, ''),
        rows: [['方案', `<b class="mono">${g.sch}</b>`], ['严格度', g.strict], ['句式', g.sent], ['纪律', g.rule]],
      })),
    });
  }

  function wSchemes(host) {
    chooser(host, {
      title: '押韵方案字母表', sub: '同一个字母＝同一组韵，X＝不押',
      items: SCHEMES.map(s => ({
        l: s.s,
        rows: [['叫法', s.n], ['感觉', s.feel], ['风险', s.risk]],
      })),
    });
  }

  function wCnPatterns(host) {
    chooser(host, {
      title: '中文按字计时，先数再写', sub: '切分（顿点）比字数更重要',
      items: CN_PATTERNS.map(p => ({
        l: p.p + ' ' + p.cut,
        rows: [['用法', p.use], ['例句', `<span class="mono">${p.ex}</span>`]],
      })),
    });
  }

  function wMaterials(host) {
    chooser(host, {
      title: '五类素材，按不撞车排序', sub: '越靠前越不容易和别人撞；大词最空',
      items: IMG_MATERIALS.map(m => ({
        l: m.c,
        rows: [['例', m.ex], ['一句话', m.note]],
      })),
    });
  }

  function wParts(host) {
    chooser(host, {
      title: '九个段落，九种职责', sub: '点一段：它该干什么、以及一句自检',
      items: PARTS.map(p => ({
        l: p.n,
        rows: [['长度', p.len], ['干嘛', p.what], ['不写什么', p.job], ['自检', p.q]],
      })),
    });
  }

  function wHooks(host) {
    chooser(host, {
      title: '钩子七型', sub: '先定钩子，再写副歌；硬指标：3–10 字、落长音或强拍',
      items: HOOKS.map(h => ({
        l: h.n.replace(/^[①②③④⑤⑥⑦]\s*/, ''),
        rows: [['怎么做', h.how], ['例', h.ex], ['别犯', h.warn]],
      })),
    });
  }

  function wSchools(host) {
    chooser(host, {
      title: '八派：这一句靠什么成立', sub: '先定主派，最多再加一个辅派——三派必打架',
      items: SCHOOLS.map(s => ({
        l: s.n,
        rows: [['核心', s.core], ['适合', s.yes], ['判据', s.judge]],
      })),
    });
  }

  function wGfTypes(host) {
    chooser(host, {
      title: '古风是三种写法，不是一种', sub: '动笔前先选一种：它决定文言浓度、句长与人称',
      items: GUOFENG_TYPES.map(t => ({
        l: t.k + ' · ' + t.n,
        rows: [['语体', t.voice], ['适合', t.who], ['代价', t.note]],
        html: t.def ? '<b>默认选这一型</b>：可唱性最好，配比最不容易翻车。' : '',
      })),
    });
  }

  function wGfWords(host) {
    chooser(host, {
      title: '六组意象，各自的动作', sub: '意象不是装饰，它得替一种情绪干活',
      items: GUFENG.map(g => ({
        l: g.emo,
        rows: [['可用', g.items.join(' · ')], ['动作', g.act], ['为什么', g.why]],
      })),
    });
  }

  function wFrames(host) {
    chooser(host, {
      title: '五种框景', sub: '不要直接写词：先定从哪儿切进去',
      items: FRAMES.map(f => ({ l: f.n, rows: [['怎么写', f.d]] })),
    });
  }

  function wBanList(host) {
    const items = BAN_ZH.map(g => ({ l: g.c, rows: [['词', `<span class="w-ban">${g.w.join('、')}</span>`]] }))
      .concat(BAN_EN.map(g => ({ l: 'EN ' + g.c, rows: [['words', `<span class="w-ban">${g.w.join(' · ')}</span>`]] })));
    chooser(host, {
      title: '这些词一出现，就像机器写的', sub: '黑名单不是禁止，是逼出具体',
      items,
    });
  }

  function wFixSteps(host) {
    chooser(host, {
      title: '改词五个动作，按顺序做', sub: '改词不是重写：先换框景，最后才动韵脚',
      items: FIX_STEPS.map(s => ({
        l: s.i + ' ' + s.n,
        rows: [['怎么做', s.d], ['例子', s.hit]],
      })),
    });
  }

  /* ---------------- 作词 · 自检扫描 ---------------- */
  function wScan(host) {
    head(host, '把能数的先数掉', '粘一段词进来：禁用词、抽象名词、句长与钩子');
    const ta = el('textarea', 'w-ta');
    ta.rows = 3;
    ta.placeholder = '把一段词粘进来…';
    host.appendChild(ta);
    const out = readout(host);
    const go = () => {
      const text = ta.value;
      if (!text.trim()) { out.innerHTML = '<span class="w-k">还没有输入。</span>'; return; }
      const r = scanText(text);
      const lines = [];
      lines.push(`<div class="w-line"><i>句数</i><span>${r.lines.length} 行 · 共 ${r.total} 字</span></div>`);
      lines.push(`<div class="w-line"><i>最长句</i><span>${r.longest.n} 字 ${r.short ? '· 有 ' + r.short + ' 行过短' : ''}</span></div>`);
      lines.push(`<div class="w-line"><i>禁用词</i><span class="${r.banHits.length ? 'w-bad' : 'w-ok'}">${r.banHits.length ? r.banHits.join('、') : '没撞'}</span></div>`);
      lines.push(`<div class="w-line"><i>抽象词</i><span class="${r.abs.length ? 'w-warn' : 'w-ok'}">${r.abs.length ? r.abs.join('、') : '没撞'}</span></div>`);
      lines.push(`<div class="w-line"><i>钩子候选</i><span>${r.hooks.length} 行落在 3–10 字</span></div>`);
      if (r.gfFiller.length || r.gfSeasons.length || r.gfBuried.length) {
        const gf = [];
        if (r.gfFiller.length) gf.push('万能词 ' + r.gfFiller.map(x => x.w + '×' + x.c).join('、'));
        if (r.gfSeasons.length) gf.push('物候 ' + r.gfSeasons.map(x => x.s).join('/'));
        if (r.gfBuried.length) gf.push(`韵脚被虚词占位 ${r.gfBuried.length} 处`);
        lines.push(`<div class="w-line"><i>古风嫌疑</i><span class="w-warn">${gf.join('；')}</span></div>`);
      }
      out.innerHTML = lines.join('');
    };
    const r = row(host, 'w-btnrow');
    button(r, '数一数', go);
    button(r, '清空', () => { ta.value = ''; out.innerHTML = '<span class="w-k">已清空。</span>'; }, 'ghost');
    out.innerHTML = '<span class="w-k">只做字符串能做的事；押韵与画面仍然交给耳朵和眼睛。</span>';
  }

  /* ---------------- 乐器 · 音域条 ---------------- */
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midiOf(note) {
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(String(note).trim());
    if (!m) return 60;
    let v = (parseInt(m[3], 10) + 1) * 12 + SEMI[m[1]];
    if (m[2] === '#') v += 1;
    if (m[2] === 'b') v -= 1;
    return v;
  }
  const pretty = n => String(n).replace('#', '♯').replace(/b(?=\d)/, '♭');

  function rangeSVG(items, opt) {
    opt = opt || {};
    const rowH = opt.rowH || 26, barH = opt.barH || 11, labelW = opt.labelW || 66;
    /* 横轴范围默认由这批乐器自己决定；分成两屏看同一张图时必须共用一套刻度
       （opt.axisItems 传全集），否则上下两半各算各的横轴，没法互相比较。 */
    const axis = opt.axisItems || items;
    let minM = Infinity, maxM = -Infinity;
    axis.forEach(it => { minM = Math.min(minM, midiOf(it.lo)); maxM = Math.max(maxM, midiOf(it.hi)); });
    const loM = Math.floor(minM / 12) * 12;
    let hiM = Math.ceil(maxM / 12) * 12;
    if (hiM - loM < 24) hiM = loM + 24;
    const W = 320, padT = 10, padB = 20, plotL = labelW + 6, plotR = W - 8;
    const H = padT + items.length * rowH + padB;
    const x = m => plotL + (m - loM) / (hiM - loM) * (plotR - plotL);
    let s = `<svg class="w-rchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="音域覆盖图">`;
    /* C3–C5 那条"人声舒适带"：先画在底层，后面的条压上去。
       图注里提到它，就一定要真画出来——否则读者在图上是找不到的。 */
    if (opt.band) {
      const [b0, b1] = opt.band;
      s += `<rect x="${x(b0).toFixed(1)}" y="${padT - 4}" width="${(x(b1) - x(b0)).toFixed(1)}" `
         + `height="${H - padT - padB + 8}" fill="#D85A30" fill-opacity=".07"/>`;
    }
    for (let m = loM; m <= hiM; m += 12) {
      s += `<line x1="${x(m).toFixed(1)}" y1="${padT - 3}" x2="${x(m).toFixed(1)}" y2="${H - padB + 3}" stroke="#E5E2D9"/>`;
    }
    items.forEach((it, i) => {
      const cy = padT + i * rowH + rowH / 2;
      const bx = x(midiOf(it.lo)), bw = Math.max(3, x(midiOf(it.hi)) - bx);
      const cx = x(midiOf(it.comfort[0])), cw = Math.max(3, x(midiOf(it.comfort[1])) - cx);
      s += `<text x="${labelW}" y="${cy + 4}" text-anchor="end" font-size="10.5" fill="#2C2C2A">${it.name}</text>`;
      s += `<rect x="${bx.toFixed(1)}" y="${cy - barH / 2}" width="${bw.toFixed(1)}" height="${barH}" rx="${barH / 2}" fill="${it._light}" stroke="${it._color}" stroke-opacity=".4"/>`;
      s += `<rect x="${cx.toFixed(1)}" y="${cy - barH / 2}" width="${cw.toFixed(1)}" height="${barH}" rx="${barH / 2}" fill="${it._color}"/>`;
    });
    const axisY = H - padB + 5;
    for (let m = loM; m <= hiM; m += 12) {
      s += `<text x="${x(m).toFixed(1)}" y="${axisY + 12}" text-anchor="middle" font-size="9" fill="#6F6C62" font-family="ui-monospace,monospace">C${m / 12 - 1}</text>`;
    }
    s += '</svg>';
    return s;
  }

  function allInstruments() {
    const out = [];
    INST_DATA.families.forEach(f => f.items.forEach(it => {
      it._fam = f.name; it._color = f.color; it._light = f.light;
      out.push(it);
    }));
    return out;
  }

  function wRange(host, opt) {
    const fam = INST_DATA.families.find(f => f.id === opt.fam);
    if (!fam) return wRangeAll(host);
    host.style.setProperty('--c', fam.color);
    head(host, fam.name, '浅色＝够得着，深色＝常用区；横轴每格一个八度');
    const box = el('div', 'w-chart', rangeSVG(fam.items, { rowH: 24, barH: 10 }));
    host.appendChild(box);
  }

  /* 全部乐器一张图：46 条塞不进一屏（量出来要高出一屏 170px 左右），
     所以按族劈成上下两张，横轴共用全集的刻度。件数与统计都从数据现算，
     文案里的数字不许手写——数据一改，字就跟不上了。 */
  function wRangeAll(host, opt) {
    opt = opt || {};
    const fams = INST_DATA.families.slice(opt.a || 0, opt.b == null ? undefined : opt.b);
    const items = [];
    fams.forEach(f => f.items.forEach(it => {
      it._fam = f.name; it._color = f.color; it._light = f.light;
      items.push(it);
    }));
    const all = allInstruments();
    const two = opt.b != null;
    head(host,
      two ? `全部乐器叠在一张图（${opt.a ? '下' : '上'}半）` : '全部乐器叠在一张图上',
      fams.map(f => f.name).join(' · '));
    host.appendChild(el('div', 'w-chart',
      rangeSVG(items, { rowH: 15, barH: 8, labelW: 62, axisItems: all, band: [48, 72] })));

    /* 只在下半张（或整张）收尾：一句结论，讲的是全集，不是这半张 */
    const last = !two || opt.b >= INST_DATA.families.length;
    if (!last) return;
    const lowN = all.filter(i => midiOf(i.lo) < 36).length;      /* 低到 C2 以下才算"够得着低音区" */
    const midN = all.filter(i => midiOf(i.comfort[0]) <= 72 && midiOf(i.comfort[1]) >= 48).length;
    readout(host).innerHTML =
      `<span class="w-k">${all.length} 件里只有 ${lowN} 件够得着 C1–C2，`
      + `却有 ${midN} 件的常用区压在 C3–C5 那条淡红带里。</span>`;
  }

  function wRangeOne(host, opt) {
    const it = allInstruments().find(x => x.id === opt.id) || allInstruments()[0];
    head(host, '怎么读一条音域条', '以钢琴为例：条有多长＝能到多高多低');
    host.appendChild(el('div', 'w-chart', rangeSVG([it], { rowH: 34, barH: 16, labelW: 54 })));
    const out = readout(host);
    out.innerHTML = `<div class="w-line"><i>全音域</i><span>${pretty(it.lo)} – ${pretty(it.hi)}（浅色）</span></div>
      <div class="w-line"><i>常用区</i><span>${pretty(it.comfort[0])} – ${pretty(it.comfort[1])}（深色）</span></div>
      <div class="w-line"><i>织密</i><span>${it.density[0]}–${it.density[1]} 音头/秒</span></div>`;
  }

  function wInst(host, opt) {
    const it = allInstruments().find(x => x.id === opt.id);
    if (!it) return;
    const lo = midiOf(it.lo), hi = midiOf(it.hi);
    const span = ((hi - lo) / 12).toFixed(1).replace('.0', '');
    const facts = it.params.map(p => `<div><i>${p[0]}</i><span>${p[1]}</span></div>`).join('');
    host.classList.add('w-instcard');
    host.style.setProperty('--c', it._color);
    host.style.setProperty('--cl', it._light);
    host.innerHTML = `<div class="ic-head"><b>${it.name}</b><span>${it.en}</span>
        <em>${pretty(it.lo)}–${pretty(it.hi)} · ${span} 个八度</em></div>
      <div class="w-chart">${rangeSVG([it], { rowH: 22, barH: 9, labelW: 44 })}</div>
      <div class="ic-rows">
        <p><i>意象</i><span>${it.image}</span></p>
        <p><i>用它</i><span>${it.use}</span></p>
        <p class="neg"><i>别用</i><span>${it.avoid}</span></p>
      </div>
      <div class="ic-facts">${facts}</div>`;
  }

  /* ---------------- 注册表 ---------------- */
  const W = {
    scale: wScale, interval: wInterval, minorforms: wMinorForms, modes: wModes,
    penta: wPenta, exotic: wExotic, chords: wChords, cadence: wCadence,
    tempo: wTempo, meter: wMeter, groove: wGroove, blues: wBlues, shuffle: wShuffle,
    tonefit: wTonefit, stress: wStress, phrase: wPhrase, breath: wBreath,
    transpose: wTranspose, scenes: wScenes, ensemble: wEnsemble,
    sevenths: wSevenths, modulation: wModulation,
    genres: wGenres, schemes: wSchemes, cnpatterns: wCnPatterns, materials: wMaterials,
    parts: wParts, hooks: wHooks, schools: wSchools, gftypes: wGfTypes,
    gfwords: wGfWords, frames: wFrames, banlist: wBanList, fixsteps: wFixSteps,
    scan: wScan,
    range: wRange, rangeAll: wRangeAll, rangeOne: wRangeOne, inst: wInst,
  };

  /* build(id, host, opt)：把一张互动卡画进 host。未知 id 给一句兜底，不炸整页。 */
  function build(id, host, opt) {
    const fn = W[id];
    if (!fn) {
      head(host, '这张卡还在路上', '（' + id + '）');
      return;
    }
    fn(host, opt || {});
  }

  return { build, W, rangeSVG };
})();
