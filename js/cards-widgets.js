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
   * litSel 传 '' —— 没有示意图的卡不点亮任何方块，只让下方钢琴亮键。 */
  function play(steps) { seq(steps, ''); }

  /* ---------------- 图：把一段 SVG 放进卡片，并让它能跟着声音亮 ----------------
   * seq(steps, litSel) 的 litSel 是**元素 id**（playback.js 用 getElementById
   * 取范围，再在里面找 rect[data-note] / rect[data-lit]），所以每张图都得有
   * 自己的 id。卡片是翻到才建的，计数器给的 id 天生不重——同一时刻最多两张卡
   * 处在换页过渡里（旧卡 230ms 后就被移掉了）。 */
  let FIGN = 0;
  function figBox(host, svg, cls) {
    const box = el('div', 'w-chart w-fig' + (cls ? ' ' + cls : ''), svg);
    box.id = 'wfig' + (++FIGN);
    host.appendChild(box);
    return box;
  }
  function playFig(steps, box) { seq(steps, box.id); }

  /* 主音：跟 cards-app.js 里的 state.root 走（没人改过就是 C）。
   * 这些图都是"以某个音为 home"的，图与声音必须共用同一个 home，
   * 否则方块上的音名和听到的音高对不上。 */
  function rootPc() { return (typeof state !== 'undefined') ? state.root : 0; }

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

  /* ---------------- 乐理 · 音阶阶梯图（大调 / 小调 / 五声） ----------------
   * 长网页版有三张阶梯图（ladderMajor / ladderMinor / ladderPenta），
   * 都由 refreshAll() 在换调时重画。卡片版没有"全局换调"这个动作，
   * 所以一张卡只放一张图 + 一个 chip 换形态——图是本节的重点，不是附庸。 */
  const LADDER_FORMS = {
    maj: { n: '大调', semis: [0, 2, 4, 5, 7, 9, 11, 12], opt: { main: '#534AB7' },
           say: '全 全 半 全 全 全 半。第 3↔4、第 7↔8 之间是半音——这两处"挤"，才让大调听起来稳。' },
    min: { n: '自然小调', semis: [0, 2, 3, 5, 7, 8, 10, 12],
           opt: { main: '#185FA5', color: '#E6F1FB', txt: '#0C447C' },
           say: '第三级比大调低半格（4→3）。就这半格，敞亮变成了阴。' },
    penta: { n: '五声', semis: [0, 2, 4, 7, 9, 12],
             opt: { main: '#0F6E56', color: '#E1F5EE', txt: '#085041', step: 16, H: 286 },
             say: '把 fa 与 si 拿掉，剩下 do re mi sol la，再回到八度的 do。' },
  };

  function wLadder(host, opt) {
    opt = opt || {};
    const keys = opt.forms || ['maj', 'min'];
    head(host, opt.title || '音阶长什么样', '横轴是十二个半音，方块的高低就是音高；▶ 会一个一个亮过去');
    const box = figBox(host, '');
    const out = readout(host);
    let cur = keys[0];

    const steps = dir => {
      const f = LADDER_FORMS[cur], base = midiOct(rootPc(), 4);
      const list = f.semis.map((sv, i) => ({ at: i * 0.27, m: base + sv, d: 0.9, g: 0.4 }));
      return dir > 0 ? list : list.reverse().map((s, i) => ({ at: i * 0.27, m: s.m, d: s.d, g: s.g }));
    };
    const draw = () => {
      const f = LADDER_FORMS[cur];
      box.innerHTML = ladderSVG(f.semis, Object.assign({ root: rootPc() }, f.opt));
      out.innerHTML = `<b>${f.n}</b><br><span class="w-k">${f.say}</span>`;
    };
    if (keys.length > 1) {
      chipRow(host, keys.map(k => LADDER_FORMS[k].n), i => {
        cur = keys[i]; draw(); playFig(steps(1), box);
      }, 0);
    }
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 上行', () => playFig(steps(1), box));
    button(r, '▶ 下行', () => playFig(steps(-1), box));
    draw();
  }

  /* ---------------- 乐理 · 七个调式的对比图 ---------------- */
  /* modesLadderSVG 一张图放七个调式（每行一个、竖排对齐同一个十二音网格）。
     长网页点一行会按落音重画整张图，卡片版跟着同样的做法：图不重画，
     方块上的音名就和听到的音对不上，点亮也会错位。 */
  function wModesFig(host) {
    head(host, '同一串白键，七个起点', '紫块＝相对大调改动过的音；点一个调式，那一行会跟着声音亮');
    const box = figBox(host, modesLadderSVG(0));
    const out = readout(host);
    const WHITE = [0, 2, 4, 5, 7, 9, 11];
    const show = i => {
      const m = MODES[i], p = WHITE[i];
      box.innerHTML = modesLadderSVG(p);
      try { fixModesLegend(); } catch (e) { /* 拿不到 getBBox 就用初始占位 */ }
      out.innerHTML = `<b>${m.zh} ${m.en}</b> · ${m.tag}<br>
        <span class="w-k">从 ${PC[p]} 起步：${m.feat}</span>`;
      seq(m.semis.map((sv, j) => ({ at: j * 0.3, m: midiOct(p, 4) + sv, d: 0.95, g: 0.4 })), 'ml-' + m.id);
    };
    chipRow(host, MODES.map(m => m.zh), show, 0);
    out.innerHTML = `<b>${MODES[0].zh} ${MODES[0].en}</b> · ${MODES[0].tag}<br>
      <span class="w-k">从 C 起步：${MODES[0].feat}</span>`;
    try { fixModesLegend(); } catch (e) { /* 同上 */ }
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

  /* ---------------- 乐理 · 大三 vs 小三 对比图 ---------------- */
  /* chordCmpSVG() 直接读全局 state.root（长网页换调时会重画），
     卡片版跟着走：谁动过调，这张图就是那个调的两块和弦。 */
  function wChordCmp(host) {
    head(host, '大三 vs 小三：只差半格', '根音与五音一模一样，只有三音松了半格——虚线横贯的地方就是"没动"的');
    const box = figBox(host, '');
    const repaint = () => { box.innerHTML = chordCmpSVG(); };
    repaint();
    const r = row(host, 'w-btnrow w-act');
    const triadOn = ivs => ivs.map(sv => ({ at: 0, m: midiOct(rootPc(), 4) + sv, d: 1.8, g: 0.34 }));
    button(r, '▶ 大三', () => playFig(triadOn([0, 4, 7]), box));
    button(r, '▶ 小三', () => playFig(triadOn([0, 3, 7]), box));
    readout(host).innerHTML = '<span class="w-k">两块的三音上下差一格：4 个半音是"亮"，3 个半音是"暗"。</span>';
  }

  /* ---------------- 乐理 · 和弦进行（第 05 节的核心互动区） ----------------
   * 长网页版这一段是 buildProg()：六个 chips + 一排可点的和弦块 + 速度 + 循环 + 播放。
   * 卡片版必须自带全部元件——长网页那套满屏固定 id（#progStrip / #progBpm /
   * #progPlay），卡片一翻页就不在了，照搬会全线 null。 */
  function wProgression(host) {
    const mode = M_OF('ionian');
    head(host, '六个进行，覆盖流行乐大半', '点单个和弦块只听它；▶ 顺着听整条，每块亮一下就是走到哪了');
    const out = readout(host);
    const progBox = el('div', 'w-prog');
    progBox.id = 'wfig' + (++FIGN);        /* 块跟着声音亮，seq 要靠这个 id 找范围 */
    host.appendChild(progBox);
    const qzh = { maj: '大', min: '小', dim: '减', aug: '增' };
    let idx = 0, bpm = 84;

    const chordOf = d => triad(midiOct(0, 4), mode, d);
    const nameOf = c => noteName(c.notes[0]) + (c.q === 'min' ? 'm' : c.q === 'dim' ? 'dim' : '');

    const draw = () => {
      const p = PROGS[idx];
      progBox.innerHTML = '';
      p.d.forEach(d => {
        const c = chordOf(d);
        const b = el('button', 'w-pc',
          `<i>${chordLabel(mode, d, c.q)}</i><b>${nameOf(c)}</b><s>${qzh[c.q] || ''}</s>`);
        b.type = 'button';
        b.onclick = e => {
          e.preventDefault();
          play(c.notes.map((m, k) => ({ at: 0, m, d: 1.5, g: 0.34 * (k ? .72 : 1) })));
        };
        progBox.appendChild(b);
      });
      out.innerHTML = `<b>${p.n}</b> — ${p.t}<br><span class="w-k">`
        + p.d.map(d => chordLabel(mode, d, chordOf(d).q)).join(' → ') + '</span>';
    };

    const playAll = () => {
      const spb = 60 / bpm, chords = PROGS[idx].d.map(chordOf), steps = [];
      chords.forEach((c, i) => {
        c.notes.forEach((m, k) => steps.push({
          at: i * spb * 2, m, d: spb * 2.05, g: 0.34 * (k === 0 ? 1 : .72),
        }));
        /* 五音上方补一个 pluck：不加这一下，整条进行听着像一坨 */
        steps.push({ at: i * spb * 2 + spb * .5, m: c.notes[2] + 12, d: spb * .9, g: .15, kind: 'pluck' });
      });
      playFig(steps, progBox);
      /* 块跟着亮：这首"进行"最该看见的就是走到第几个和弦了 */
      const blocks = Array.from(progBox.children);
      blocks.forEach(b => b.classList.remove('hit'));
      blocks.forEach((b, i) => setTimeout(() => {
        if (!progBox.isConnected) return;
        blocks.forEach(x => x.classList.remove('hit'));
        b.classList.add('hit');
      }, 60 + i * spb * 2000));
      setTimeout(() => {
        if (progBox.isConnected) blocks.forEach(x => x.classList.remove('hit'));
      }, 60 + blocks.length * spb * 2000 + 150);
    };

    chipRow(host, PROGS.map(p => p.n), i => { idx = i; draw(); playAll(); }, 0);
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 播放这个进行', playAll);
    button(r, '速度 ' + bpm, b => {
      bpm = bpm >= 120 ? 68 : bpm + 16;
      b.textContent = '速度 ' + bpm;
    }, 'ghost');
    button(r, '✕ 停止', () => {
      stopAll();
      Array.from(progBox.children).forEach(x => x.classList.remove('hit'));
    }, 'ghost');
    draw();
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

  /* ---------------- 乐理 · 副歌为什么会"扬"起来 ----------------
   * hookSVG 画的是同一条旋律的上下两行：形状一模一样，只差一个八度。
   * 这张图本身就是论点，所以三颗按钮（主歌 / 副歌 / 连起来）一个都不能少——
   * 分开听才知道"变的是音区"，连起来听才知道"这就是副歌进副歌"。
   * lit 用 h{i}v / h{i}h 区分两行方块，点亮不会串行。 */
  function wHook(host) {
    head(host, '副歌为什么"扬"起来了', '同一条旋律，上下差一个八度；两行的形状一模一样');
    const box = figBox(host, hookSVG(HOOK));
    readout(host).innerHTML = '<span class="w-k">抬的是<b>整体音区</b>，不是把每个音都往上顶——'
      + '所以省力，也不会破音。</span>';
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 主歌（低）', () => playFig(HOOK.map((sv, i) => ({
      at: i * 0.32, m: midiOct(rootPc(), 3) + sv, d: 0.9, g: 0.4, lit: 'h' + i + 'v',
    })), box));
    button(r, '▶ 副歌（高）', () => playFig(HOOK.map((sv, i) => ({
      at: i * 0.32, m: midiOct(rootPc(), 5) + sv, d: 0.9, g: 0.4, lit: 'h' + i + 'h',
    })), box));
    button(r, '▶ 连起来', () => {
      const n = HOOK.length;
      playFig(HOOK.concat(HOOK).map((sv, i) => ({
        at: i * 0.32, m: midiOct(rootPc(), i < n ? 3 : 5) + sv,
        d: i === n - 1 ? 1.4 : 0.9, g: i < n ? 0.36 : 0.44,
        lit: 'h' + (i % n) + (i < n ? 'v' : 'h'),
      })), box);
    });
  }

  /* ---------------- 乐理 · 节拍器 ---------------- */
  /* 长网页第 07 节那个 metronome（#metBpm 滑杆 + 拍号 + 圆点）也是 JS 搭的，
     卡片版没有它，读者就永远只能"听 88 BPM"，不能自己拧到 88。
     拍号决定每小节几拍、第一拍重——这件事得自己走起来才算学过。 */
  function wMetro(host) {
    head(host, '调到自己能走路的那一档', '拍号决定每小节几拍，第一拍重；88 BPM 就是把"行板"走出来的速度');
    const r1 = row(host, 'w-selrow');
    r1.appendChild(el('label', 'w-cap', '拍号'));
    const ms = select(METERS.map(m => [m.t, m.t]), '4/4');
    r1.appendChild(ms);
    r1.appendChild(el('label', 'w-cap', 'BPM'));
    const sp = document.createElement('input');
    sp.type = 'range'; sp.min = '56'; sp.max = '168'; sp.step = '2'; sp.value = '88';
    sp.className = 'w-range';
    r1.appendChild(sp);
    const val = el('b', 'w-bpmv', '88');
    r1.appendChild(val);

    const dots = el('div', 'w-beats');
    host.appendChild(dots);
    const paint = n => {
      dots.innerHTML = '';
      for (let i = 0; i < n; i++) dots.appendChild(el('i', 'w-beat' + (i === 0 ? ' strong' : ''), String(i + 1)));
    };
    const meterOf = () => METERS.find(m => m.t === ms.value) || METERS[0];
    paint(meterOf().b.length);
    ms.onchange = () => paint(meterOf().b.length);
    sp.oninput = () => { val.textContent = sp.value; };

    /* 一拍一拍地排：seq 管发声，圆点用 setTimeout 跟（和 wMeter 同一套写法）。
       run 是这一轮的身份：停止 / 换页 / 再点一次都会换掉它，
       旧的定时器看到 run 变了就自己退场，不会两条节拍器叠在一起响。 */
    let run = null;
    const stop = () => {
      run = null;
      try { stopAll(); } catch (e) { /* 音频还没建过 */ }
      Array.from(dots.children).forEach(d => d.classList.remove('hit'));
    };
    const tick = me => {
      if (run !== me) return;
      const m = meterOf(), spb = 60 / (+sp.value), steps = [];
      m.b.forEach((w, k) => steps.push({ at: k * spb, c: 1, strong: w >= 1 }));
      play(steps);
      const beats = dots.children;
      m.b.forEach((w, k) => setTimeout(() => {
        if (run !== me || !dots.isConnected) return;
        Array.from(beats).forEach(d => d.classList.remove('hit'));
        if (beats[k]) beats[k].classList.add('hit');
      }, 40 + k * spb * 1000));
      setTimeout(() => { if (run === me) tick(me); }, m.b.length * spb * 1000);
    };
    const r2 = row(host, 'w-btnrow w-act');
    button(r2, '▶ 走起来', () => { stop(); const me = {}; run = me; tick(me); });
    button(r2, '■ 停', stop, 'ghost');
    readout(host).innerHTML = '<span class="w-k">把滑杆从 60 慢慢推到 120：'
      + '"慢"不是一个数字，是一个你能跟着走的速度。</span>';
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
  /* 五张卡是同一段和声换节奏型，光看文字读不出"格子空不空"——
     所以网格图（grooveGridSVG）是这一节的主图，不是装饰。 */
  function wGroove(host) {
    head(host, '同一段和声，五种打法', '只有节奏型不同——听到的差别全来自"怎么打"');
    const box = figBox(host, grooveGridSVG(GROOVE.rows[0]));
    const out = readout(host);
    const rows = GROOVE.rows;
    const show = i => {
      const r = rows[i];
      box.innerHTML = grooveGridSVG(r);
      out.innerHTML = `<b>${r.n}</b> · ${r.feel} · ${grooveRate(r).toFixed(2)} 音头/秒<br>
        <span class="w-k">${r.when}</span>`;
      playGroove(r);
    };
    chipRow(host, rows.map(r => r.n), show, 0);
    const r0 = rows[0];
    out.innerHTML = `<b>${r0.n}</b> · ${r0.feel} · ${grooveRate(r0).toFixed(2)} 音头/秒<br>
      <span class="w-k">${r0.when}</span>`;
  }

  /* ---------------- 乐理 · 十二小节布鲁斯 ---------------- */
  /* 图直接复用长网页那张十二格：格号、和弦、三行词的长度画在同一张图上，
     拆成两半（和弦一张、词一张）就看不出"第 9 格和声与词同时换"这件事了。
     逐格点亮靠 data-lit="bar{i}"，所以 seq 要传这张图的 id。 */
  function wBlues(host) {
    head(host, '十二格：第九格才离开家', '前八格原地打转，第 9 格第一次出现 V7');
    const box = figBox(host, bluesGridSVG());
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 只听和声', () => playFig(bluesEvents(false).steps, box));
    button(r, '▶ 带词（AAB）', () => playFig(bluesEvents(true).steps, box));
    readout(host).innerHTML = '<span class="w-k">下划线＝真正唱出来的长度（一字一拍），'
      + '剩下的空档留给乐器；格号亮到第 9 格时注意和弦变了。</span>';
  }

  function wShuffle(host) {
    head(host, '两个八分不是均分的', '速度、音高、音头数都不变，只把第二下往后挪');
    figBox(host, shuffleFigSVG());
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
  /* toneLineSVG 是这一节的主图：每个字内部那条竖线就是它的声调曲线，
     顺字行跟着走、倒字行拧着走。文字说一百遍"拧着"，不如看见两行斜率相反。 */
  function wTonefit(host) {
    head(host, '顺字还是倒字', '旋律拧着字调走，字就倒了——同一个字，听感完全不同');
    const box = figBox(host, toneLineSVG(LYRIC_LINES[0].w));
    const out = readout(host);
    let idx = 0;
    chipRow(host, LYRIC_LINES.map(l => l.t), i => {
      idx = i;
      box.innerHTML = toneLineSVG(LYRIC_LINES[i].w);
      out.innerHTML = `<b>${LYRIC_LINES[i].t}</b><br><span class="w-k">${LYRIC_LINES[i].src}</span>`;
    }, 0);
    const r = row(host, 'w-btnrow w-act');
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
  /* 长网页这边是 melodySVG(KEY_MEL) + 换调重画：旋律形状不变、整条平移。
     图必须跟着换调重画，否则方块上的音名还是老调的——那正好把这个知识点讲反。 */
  function wTranspose(host) {
    head(host, '同一段旋律，换个调', '音程关系一个都不改，只把整套音阶搬家');
    const keys = [['C', 0], ['D', 2], ['E', 4], ['F', 5], ['G', 7], ['A', 9]];
    const box = figBox(host, melodySVG(KEY_MEL, { root: 0, step: 14 }));
    const out = readout(host);
    const show = i => {
      const [k, s] = keys[i];
      const r = ((s % 12) + 12) % 12;
      const info = KEYINFO[s];
      box.innerHTML = melodySVG(KEY_MEL, { root: r, step: 14 });
      out.innerHTML = `<b>${k} 大调</b><br><span class="w-k">${info
        ? info.s + ' 个' + (info.t === '#' ? '升号' : '降号')
        : '6 升 6 降的尴尬位'}</span>`;
      playFig(KEY_MEL.map((n, j) => ({
        at: j * 0.28, m: midiOct(0, 4) + n + s, d: .9, g: .4, lit: 'mel' + j,
      })), box);
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
  /* sevSVG 把四个音按音高摆在同一个半音网格上，最后叠上去的七音用粉色标出——
     "多出来的是哪一个音"，文字说不清，图一格就说清了。 */
  function wSevenths(host) {
    head(host, '在三和弦上再叠一个三度', '多出来的那个音决定味道：梦幻、想回家、还是悬着');
    const box = figBox(host, sevSVG(SEVENTHS[0].s));
    const out = readout(host);
    const show = i => {
      const s = SEVENTHS[i];
      box.innerHTML = sevSVG(s.s);
      out.innerHTML = `<b>${s.n}</b> · ${s.role}<br><span class="w-k">${s.t}</span>`;
      playFig(s.s.map((sv, k) => ({
        at: 0, m: midiOct(rootPc(), 4) + sv, d: 2.0, g: 0.3 * (k ? .78 : 1), lit: 'sv' + k,
      })), box);
    };
    chipRow(host, SEVENTHS.map(s => s.n.split(' ')[0]), show, 0);
    out.innerHTML = `<b>${SEVENTHS[0].n}</b> · ${SEVENTHS[0].role}<br><span class="w-k">${SEVENTHS[0].t}</span>`;
  }

  /* 转调同样是"换调重画"：图里的音名必须跟着真正唱出来的调走 */
  function wModulation(host) {
    head(host, '副歌怎么"炸开"', '旋律一个音不改，整套音阶搬家');
    const box = figBox(host, melodySVG(MOD_MEL, { root: 0, step: 14 }));
    const out = readout(host);
    const show = i => {
      const m = MODS[i];
      const r = ((m.s % 12) + 12) % 12;
      box.innerHTML = melodySVG(MOD_MEL, { root: r, step: 14 });
      out.innerHTML = `<b>${m.n}</b><br><span class="w-k">${m.t}</span>`;
      playFig(MOD_MEL.map((n, j) => ({
        at: j * 0.28, m: midiOct(0, 4) + n + m.s, d: .9, g: .4, lit: 'mel' + j,
      })), box);
    };
    chipRow(host, MODS.map(m => m.n.replace(/（.*/, '').replace('大调', '')), show, 0);
    out.innerHTML = `<b>${MODS[0].n}</b><br><span class="w-k">${MODS[0].t}</span>`;
  }

  /* ---------------- 乐理 · 《沧海一声笑》两种重心 ----------------
   * 这一节最要紧的一句是"旋律一个音没改，只是底下换了家"。
   * 所以两个版本必须共用同一条旋律、只换底音——否则听到的差别里混进了旋律本身。
   * 长网页版那句 note（#canghaiInfo）卡片里本来就有，这里补的是**能点的那一半**。 */
  function wCanghai(host) {
    /* 首句简谱 6 5 3 2 1 | 3 2 1 6 5 | 5 6 5 6 1 2 3 5 6 5 3 2 1 2，以 do=0 换半音 */
    const MEL = [6, 5, 3, 2, 1, 3, 2, 1, 6, 5, 5, 6, 5, 6, 1, 2, 3, 5, 6, 5, 3, 2, 1, 2];
    const GONG = { 1: 0, 2: 2, 3: 4, 5: 7, 6: 9 };
    const mel = MEL.map(d => GONG[d]);
    head(host, '同一句旋律，换"家"', 'la–sol–mi–re–do 一个音不改，只换底下铺的那个音');
    const out = readout(host);

    /* ⚠ 这里不能叫 play：模块里已经有一个 play(steps) 的辅助函数，
       同名会把下面那句 "放这一段" 变成自己调自己（栈溢出，且只在真点时炸）。 */
    const run = (home, zh, note) => {
      const base = midiOct(rootPc(), 4), spb = 0.26, steps = [];
      mel.concat(mel).forEach((sv, j) => steps.push({
        at: j * spb, m: base + sv, d: 0.58, g: 0.3,
      }));
      /* 底音铺满两遍：它就是"家"，一直响着才听得出来家在哪儿 */
      steps.push({ at: 0, m: base + home - 12, d: mel.length * 2 * spb, g: 0.22, kind: 'bass' });
      play(steps);
      out.innerHTML = `<b>${zh}</b><br><span class="w-k">${note}</span>`;
    };

    const NOTE_GONG = '底下铺 do。落音是主音，听感明亮、正、开阔——这是「宫」的说法。';
    const NOTE_ZHI = '底下换成 la。落音从「主音」变成「徵音」，听感立刻暗下来、沉思起来——'
      + '学界把另一种记法归到羽调式的色彩，正是因为这种「以 la 为支点」的感觉。';
    chipRow(host, ['重心在 do · 宫调式', '重心在 la · 徵调式'],
      i => run(i ? 9 : 0, i ? '徵调式（重心在 la）' : '宫调式（重心在 do）', i ? NOTE_ZHI : NOTE_GONG), 0);
    out.innerHTML = `<b>宫调式（重心在 do）</b><br><span class="w-k">${NOTE_GONG}</span>`;
  }

  /* ---------------- 乐理 · 一张专辑就是一条能量曲线 ---------------- */
  function wAlbum(host) {
    head(host, '八首歌，只换顺序', '点的高度＝听感密度，点下面是调；珊瑚红的点＝和上一首同调');
    figBox(host, albumCurveSVG());
    readout(host).innerHTML = `<span class="w-k">${ALBUM_CURVE.why}</span>`;
  }

  /* ---------------- 乐理 · 动机：轮廓不动，时值翻倍 ----------------
   * 这张图只画两件事：横轴是拍、纵轴是音高。两条线纵向完全重合、横向差一倍——
   * 所以换版本时**图不许重画**：一重画就等于在图里承认"轮廓改了"。 */
  function wMotif(host) {
    head(host, '同一个形状，又响了一次', '两条线纵向完全重合、横向差一倍——改的是时值，不是轮廓');
    figBox(host, motifContourSVG());
    const out = readout(host);
    const vers = MOTIF.versions;
    const say = i => `<b>${vers[i].n}</b>（${vers[i].chip}，${vers[i].layers} 层）<br>
      <span class="w-k">${vers[i].say}</span>`;
    chipRow(host, vers.map(v => v.chip), i => { out.innerHTML = say(i); playMotif(vers[i]); }, 0);
    out.innerHTML = say(0);
  }

  /* 动机生成：图必须随手法重画——五种手法改的东西不一样，
     图不改等于把"改了什么"藏起来了。 */
  function wMotifGen(host) {
    const GEN = MOTIF_GEN;
    head(host, '五种生成法，改的不是同一样东西', '浅色虚线＝母动机，珊瑚红＝生成结果；换一种手法，图自己就变了');
    const box = figBox(host, motifGenSVG(GEN.methods[0]));
    const out = readout(host);
    let cur = 0;
    const say = i => `<b>${GEN.methods[i].n}</b>：${GEN.methods[i].how}<br>
      <span class="w-k">听出来是：${GEN.methods[i].hear}</span>`;
    chipRow(host, GEN.methods.map(m => m.chip), i => {
      cur = i;
      box.innerHTML = motifGenSVG(GEN.methods[i]);
      out.innerHTML = say(i);
    }, 0);
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 母动机', () => playMotifGen(GEN.base));
    button(r, '▶ 生成结果', () => playMotifGen(GEN.methods[cur]));
    out.innerHTML = say(0);
  }

  /* ---------------- 乐理 · 人声舒适音区（第 11 节 ⑨） ----------------
   * 这张图的意义全在"换声点在哪、它有多窄"，所以三档必须能听：
   * 同一条 do-re-mi-sol-mi-re，只换整体音区——差别只可能来自音区。 */
  function wVoice(host) {
    const V = VOICE_RANGE;
    head(host, '这个音你唱得上去吗', '以中央 C 为基准：换声点是一条窄带，不是一根线');
    figBox(host, voiceRangeSVG());
    const out = readout(host);
    const say = i => `<b>${V.demo.rows[i].n}</b>（${V.demo.rows[i].tag}）<br>
      <span class="w-k">${V.demo.rows[i].say}</span>`;
    chipRow(host, V.demo.rows.map(r => r.n.replace(/（.*/, '')), i => {
      out.innerHTML = say(i);
      playVoiceRange(V.demo.rows[i]);
    }, 0);
    out.innerHTML = say(0);
  }

  /* ---------------- 乐理 · 语言计时法（第 11 节 ⑦） ----------------
   * 长网页版这三条时间轴是 buildLangTiming() 用 CSS 排的（不是 svg.js），
   * 卡片版照同一套意思重排：一条 8 拍的轨，每格宽窄就是每个字/音节分到的时间。
   * **窄到写不进字的音节画成细条**——这一点必须保留，否则读者会以为漏画了。 */
  const NARROW_BEAT = 0.30;
  function wLang(host) {
    const L = LANG_TIMING;
    head(host, '三条时间轴，都是 8 拍', '时间一样、意思一样，只是切法不同——格子宽度就是答案');
    const tl = el('div', 'w-tl');
    host.appendChild(tl);
    const out = readout(host);

    const paint = () => {
      tl.innerHTML = '';
      L.rows.forEach(r => {
        const rowEl = el('div', 'w-tl-row');
        rowEl.appendChild(el('div', 'w-tl-lab', r.n.replace(/ · .*/, '')));
        const bar = el('div', 'w-tl-bar');
        r.syl.forEach(s => {
          const sq = !s.s && s.d < NARROW_BEAT;
          const b = el('i', 'w-tl-b' + (s.s ? ' str' : (r.id === 'zh' ? '' : ' wk')) + (sq ? ' sq' : ''),
            sq ? '' : s.t);
          b.style.left = (s.b / L.beats * 100).toFixed(3) + '%';
          b.style.width = (s.d / L.beats * 100).toFixed(3) + '%';
          b.title = s.t;
          bar.appendChild(b);
        });
        rowEl.appendChild(bar);
        tl.appendChild(rowEl);
        tl.appendChild(el('div', 'w-tl-sub', r.sub));
      });
      const sqN = id => (L.rows.find(r => r.id === id) || { syl: [] })
        .syl.filter(s => !s.s && s.d < NARROW_BEAT).length;
      tl.appendChild(el('div', 'w-tl-sub',
        `窄到写不进字的音节画成细条（英文长句里 ${sqN('en-l')} 条，短句里 ${sqN('en-s')} 条），`
        + '拍数完全一样。'));
    };

    const say = id => ({
      zh: '8 拍、8 个字，每字正好一格。<b>中文一个字就是时间的一个单位</b>——字数定了，句子长度基本就定了。',
      'en-s': '8 拍、8 个音节，可只有 4 个重音吃到大格，另外 4 个被挤进缝里。<b>英文的时间单位是重音</b>。',
      'en-l': '还是 8 拍、还是那 4 个重音，却塞进 11 个音节——多出来的 was / gon / na 几乎听不见，但整句立刻口语了。',
    })[id] || '';

    chipRow(host, L.rows.map(r => r.chip), i => {
      out.innerHTML = say(L.rows[i].id);
      langTiming(L.rows[i].id);
    }, 0);
    paint();
    out.innerHTML = say('zh');
  }

  /* ---------------- 乐理 · 粤语入声（第 11 节 ⑧） ----------------
   * 演示的不是发音，是**时值**：同一个字，drag 两拍就听不出字，
   * 一拍断开才听得出。合成器发不出 -p，所以两版只差"占几拍"。 */
  function wCanton(host) {
    const C = CANTON;
    head(host, '入声字不许落在长音上', '同一个字、同一个音高，只改它占几拍——两个都听一遍');
    const tl = el('div', 'w-tl');
    host.appendChild(tl);
    [['一拍就断开', C.demo.ok.d], ['硬拖满两拍', C.demo.err.d]].forEach(([lab, d]) => {
      const rowEl = el('div', 'w-tl-row');
      rowEl.appendChild(el('div', 'w-tl-lab', lab));
      const bar = el('div', 'w-tl-bar');
      const b = el('i', 'w-tl-b' + (d > 1 ? ' bad' : ' str'), C.demo.ch);
      b.style.left = '0%';
      b.style.width = (d / C.beats * 100) + '%';
      bar.appendChild(b);
      rowEl.appendChild(bar);
      tl.appendChild(rowEl);
    });
    const out = readout(host);
    const r = row(host, 'w-btnrow w-act');
    button(r, '▶ 一拍就断开', () => {
      out.innerHTML = `<b>${C.demo.ok.label}</b><br><span class="w-k">${C.demo.ok.note}</span>`;
      cantonPlay(false);
    });
    button(r, '▶ 硬拖满两拍', () => {
      out.innerHTML = `<b>${C.demo.err.label}</b><br><span class="w-k">${C.demo.err.note}</span>`;
      cantonPlay(true);
    });
    out.innerHTML = `<b>${C.demo.ch}</b>（${C.demo.yue}，${C.demo.tone}）<br>
      <span class="w-k">拍点一共 ${C.beats} 拍；方块的长度就是它占的拍数。</span>`;
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
    /* 补回的示意图与互动区（长网页有、卡片版曾经整块丢掉的那些） */
    ladder: wLadder, modesfig: wModesFig, chordcmp: wChordCmp, progression: wProgression,
    hook: wHook, metro: wMetro, canghai: wCanghai, album: wAlbum,
    motif: wMotif, motifgen: wMotifGen, voice: wVoice, lang: wLang, canton: wCanton,
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
