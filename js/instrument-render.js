/* ==========================================================================
 * 《姐弟厨师团——乐器课》 · 渲染层（js/instrument-render.js）
 * --------------------------------------------------------------------------
 * 只做三件事，全部从 INST_DATA 推出来，页面里不写死任何音域数字：
 *   1. 音域覆盖图（族内对比 / 全集总览）—— 横轴是音高，一条一根乐器
 *   2. 乐器卡（参数 + 八度占位格 + 织密条 + 四段话）
 *   3. 速查表
 *
 * 为什么用 SVG 而不是 div 条：横轴刻度、竖参考线、条内白字都要跟"音高"精确
 * 对齐，用百分比算 div 宽度会在换字号时错位；SVG 有 viewBox，缩放不错位。
 *
 * 所有频率都由 MIDI 现算（440 × 2^((m−69)/12)），数据层只写音名——
 * 手写频率是这类页面最常见的错源。
 * ========================================================================== */
(function () {
  'use strict';

  /* 版本号：与另两页共用同一个数（三页一次交付，标签页上显示不同版本
     只会让人怀疑"我是不是没刷新"）。真源就在这里，另外三处是静态副本，
     统一由 tests/bump-version.js 改；本文件负责把副本刷成同一个值。 */
  const VERSION = { v: '1.48', date: '26.11.05' };

  function applyVersion() {
    document.querySelectorAll('[data-ver]').forEach(el => {
      el.innerHTML = `<b>V${VERSION.v}</b> [${VERSION.date}]`;
    });
  }

  /* ---------------- 音高换算 ---------------- */
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  function midiOf(note) {
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(String(note).trim());
    if (!m) throw new Error('音名写法不对：' + note);
    let v = (parseInt(m[3], 10) + 1) * 12 + SEMI[m[1]];
    if (m[2] === '#') v += 1;
    if (m[2] === 'b') v -= 1;
    return v;
  }

  const hzOf = m => 440 * Math.pow(2, (m - 69) / 12);

  function hzText(m) {
    const f = hzOf(m);
    if (f < 1000) return (f < 100 ? f.toFixed(1) : Math.round(f)) + ' Hz';
    return (f / 1000).toFixed(f < 10000 ? 1 : 0) + ' kHz';
  }

  /* 音名显示：C#4 → C♯4，看着才像乐谱 */
  const pretty = n => String(n).replace('#', '♯').replace(/b(?=\d)/, '♭');

  /* ---------------- 八度占位格 ---------------- */
  /* 六格 = C1–C6 六个八度。深浅两级：
     浅＝音域扫过这一格，深＝常用区落在这一格。
     这一行比音域条更快地告诉你"这件乐器到底蹲在哪儿"。 */
  const OCT_FROM = 1, OCT_TO = 6;

  function octaveCells(item) {
    const lo = midiOf(item.lo), hi = midiOf(item.hi);
    const cLo = midiOf(item.comfort[0]), cHi = midiOf(item.comfort[1]);
    let out = '';
    for (let o = OCT_FROM; o <= OCT_TO; o++) {
      const a = (o + 1) * 12, b = a + 11;
      const touched = lo <= b && hi >= a;
      const hot = cLo <= b && cHi >= a;
      out += `<i class="${hot ? 'hot' : touched ? 'tch' : ''}" title="C${o}–B${o}">
        <u>C${o}</u></i>`;
    }
    return `<div class="octs"><span class="ok">重心</span>${out}</div>`;
  }

  /* ---------------- 织密条 ---------------- */
  /* 统一量程 0–16 音头/秒：这是全站"织密"的上限（合成器与电吉他的极限）。
     量程不一致的条形图比不画更糟——两件乐器看着一样长，其实差三倍。 */
  const DENS_MAX = 16;

  function densityBar(item) {
    const [a, b] = item.density;
    const l = Math.max(0, a) / DENS_MAX * 100;
    const w = Math.max(1.5, (b - a) / DENS_MAX * 100);
    return `<div class="dens">
      <span class="dens-k">织密</span>
      <span class="dens-track"><i style="left:${l.toFixed(1)}%;width:${w.toFixed(1)}%"></i></span>
      <b>${a}–${b}</b><span class="dens-u">音头/秒</span>
    </div>`;
  }

  /* ---------------- 音域覆盖图 ---------------- */
  /* 一张图 = 一组乐器。横轴不是"时间"而是音高，所以刻度必须落在 C 上：
     人对键盘的方位感就是按 C 建的。 */
  function rangeChart(items, opt) {
    opt = opt || {};
    const rowH = opt.rowH || 32;
    const barH = opt.barH || 15;
    const labelW = opt.labelW || 116;
    const showInBar = opt.showInBar !== false;

    let minM = Infinity, maxM = -Infinity;
    items.forEach(it => {
      minM = Math.min(minM, midiOf(it.lo));
      maxM = Math.max(maxM, midiOf(it.hi));
    });
    /* 横轴边界取到整八度：起点落在 minM 所在的那个 C 上，终点落在 maxM 所在的
       那个 C 上。早先两端各留一个半音余量，结果 C0 起头的乐器被退到 C-1，
       白白多出一整格——八度轴不需要"呼吸感"，对齐才重要。 */
    const loM = Math.floor(minM / 12) * 12;
    let hiM = Math.ceil(maxM / 12) * 12;
    if (hiM - loM < 24) hiM = loM + 24;

    const W = 760, padT = opt.highlight ? 34 : 14, padB = 28;
    const plotL = labelW + 6, plotR = W - 18;
    const H = padT + items.length * rowH + padB;
    const x = m => plotL + (m - loM) / (hiM - loM) * (plotR - plotL);

    let s = `<svg class="rchart" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="${opt.title || '乐器音域覆盖图'}">`;

    /* 主奏/人声最挤的一段：C3–C5。只在总览图上传，分族图传了也不画。 */
    if (opt.highlight) {
      const [h1, h2] = opt.highlight;
      s += `<rect x="${x(midiOf(h1))}" y="${padT - 6}"
        width="${x(midiOf(h2)) - x(midiOf(h1))}" height="${H - padT - padB + 6}"
        fill="#D85A30" opacity=".055"/>`;
      s += `<text x="${(x(midiOf(h1)) + x(midiOf(h2))) / 2}" y="${padT - 14}"
        text-anchor="middle" font-size="10.5" fill="#B4502C">主奏与人声最挤的一段</text>`;
    }

    /* 竖网格：每个 C 一条，跨整张图，比只画轴上的刻度更容易对齐 */
    for (let m = loM; m <= hiM; m += 12) {
      const px = x(m);
      s += `<line x1="${px}" y1="${padT - 4}" x2="${px}" y2="${H - padB + 2}"
        stroke="#E5E2D9" stroke-width="1"/>`;
    }

    items.forEach((it, i) => {
      const top = padT + i * rowH;
      const cy = top + rowH / 2;
      const bx = x(midiOf(it.lo)), bw = Math.max(4, x(midiOf(it.hi)) - bx);
      const cx = x(midiOf(it.comfort[0]));
      const cw = Math.max(4, x(midiOf(it.comfort[1])) - cx);
      const light = it._light || '#EEEDFE', dark = it._color || '#534AB7';

      s += `<text x="${labelW}" y="${cy + 4}" text-anchor="end" font-size="12.5"
        fill="#2C2C2A">${it.name}</text>`;

      /* 全音域：浅色底 + 同色描边（表示"够得着，但不常用"） */
      s += `<rect x="${bx.toFixed(1)}" y="${cy - barH / 2}" width="${bw.toFixed(1)}"
        height="${barH}" rx="${barH / 2}" fill="${light}" stroke="${dark}"
        stroke-opacity=".38" stroke-width="1"/>`;

      /* 常用区：实色。条比全音域短，所以它永远在中间那段 */
      s += `<rect x="${cx.toFixed(1)}" y="${cy - barH / 2}" width="${cw.toFixed(1)}"
        height="${barH}" rx="${barH / 2}" fill="${dark}"/>`;

      if (showInBar && cw >= 52) {
        s += `<text x="${(cx + cw / 2).toFixed(1)}" y="${cy + 3.5}" text-anchor="middle"
          font-size="9.5" fill="#fff" font-family="ui-monospace,monospace">${pretty(it.comfort[0])}–${pretty(it.comfort[1])}</text>`;
      }
    });

    /* 轴 */
    const axisY = H - padB + 6;
    s += `<line x1="${plotL}" y1="${axisY}" x2="${plotR}" y2="${axisY}" stroke="#D6D2C6"/>`;
    for (let m = loM; m <= hiM; m += 12) {
      s += `<text x="${x(m)}" y="${axisY + 16}" text-anchor="middle" font-size="10.5"
        fill="#6F6C62" font-family="ui-monospace,monospace">C${m / 12 - 1}</text>`;
    }
    s += '</svg>';

    return `<div class="rchart-wrap">${s}</div>`;
  }

  /* ---------------- 单件乐器卡 ---------------- */
  function instCard(it) {
    const lo = midiOf(it.lo), hi = midiOf(it.hi);
    const span = ((hi - lo) / 12).toFixed(1).replace('.0', '');
    const facts = it.params.map(p =>
      `<div><dt>${p[0]}</dt><dd>${p[1]}</dd></div>`).join('');

    return `<article class="inst" style="--c:${it._color};--cl:${it._light}">
      <header class="inst-h">
        <b>${it.name}</b><span class="en">${it.en}</span>
        <span class="pill mono">${pretty(it.lo)}–${pretty(it.hi)}</span>
        <span class="pill">${span} 个八度</span>
      </header>
      <div class="inst-body">
        <div class="inst-left">
          ${octaveCells(it)}
          ${densityBar(it)}
          <dl class="facts">${facts}</dl>
        </div>
        <div class="inst-right">
          <p><i>意象</i><span>${it.image}</span></p>
          <p><i>特点</i><span>${it.trait}</span></p>
          <p><i>用它</i><span>${it.use}</span></p>
          <p class="neg"><i>别用</i><span>${it.avoid}</span></p>
        </div>
      </div>
    </article>`;
  }

  /* ---------------- 速查表 ---------------- */
  function speedTable(items) {
    const rows = items.map(it => {
      const lo = midiOf(it.lo), hi = midiOf(it.hi);
      return `<tr>
        <td><b>${it.name}</b></td>
        <td>${it._fam}</td>
        <td class="mono">${pretty(it.lo)}–${pretty(it.hi)}</td>
        <td class="mono">${hzText(lo)} – ${hzText(hi)}</td>
        <td class="mono">${it.density[0]}–${it.density[1]}</td>
        <td class="mini">${it.image}</td>
      </tr>`;
    }).join('');
    return `<div class="tscroll wide"><table class="speed">
      <thead><tr><th>乐器</th><th>族</th><th>音域</th><th>频率</th><th>织密</th><th>它的意象</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function noiseTable(list) {
    return `<div class="tscroll wide"><table>
      <thead><tr><th>乐器</th><th>频段</th><th>它在编曲里干什么</th><th>一句话</th></tr></thead>
      <tbody>${list.map(n => `<tr><td><b>${n.name}</b> <span class="mini">${n.en}</span></td>
        <td class="mono">${n.band}</td><td>${n.role}</td><td class="mini">${n.note}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  /* ---------------- 装配 ---------------- */
  function all() {
    const out = [];
    INST_DATA.families.forEach(f => f.items.forEach(it => {
      it._fam = f.name;
      it._color = f.color;
      it._light = f.light;
      out.push(it);
    }));
    return out;
  }

  function init() {
    applyVersion();
    /* 先把族色挂到每件乐器上（all() 干这件事），再装配卡片——
       否则 instCard 读到的是 undefined，卡片的族色边、八度格、织密条会一起失效。 */
    all();
    const fams = INST_DATA.families;

    /* 每族：lead 文案 + 该族一张图 + 每件一张卡 */
    fams.forEach(f => {
      const lead = document.querySelector(`[data-fam-lead="${f.id}"]`);
      if (lead) lead.innerHTML = f.intro;

      const chartBox = document.querySelector(`[data-fam-chart="${f.id}"]`);
      if (chartBox) {
        /* 图例色块取本族颜色：写死紫色的话，弦乐那张图的图例就和条对不上了 */
        chartBox.style.setProperty('--c', f.color);
        chartBox.style.setProperty('--cl', f.light);
        /* 滑动手势提示放在图**上方**：图例在 39 行之后，等滑到那儿才知道
           "刚才右边被裁了"就太晚了。桌面端不显示。 */
        chartBox.innerHTML = `<div class="swipe-top">← 左右滑动看完整音域 →</div>`
          + rangeChart(f.items, { title: f.name + '音域覆盖' });
        const cap = document.createElement('div');
        cap.className = 'rchart-cap';
        cap.innerHTML = `<span><i class="sw-l"></i>够得着（全音域）</span>
          <span><i class="sw-d"></i>常用 / 舒适区</span>
          <span class="mini">横轴每格一个八度，刻度落在 C 上</span>`;
        chartBox.appendChild(cap);
      }

      const cardBox = document.querySelector(`[data-fam-cards="${f.id}"]`);
      if (cardBox) cardBox.innerHTML = f.items.map(instCard).join('');
    });

    /* 总览：全部乐器塞一张，行高压到 19px —— 它的用途是看"谁和谁撞"，
       不是读细节，所以不需要条内文字 */
    const ov = document.getElementById('chartAll');
    if (ov) {
      ov.innerHTML = `<div class="swipe-top">← 左右滑动看完整音域 →</div>`
        + rangeChart(all(), {
          rowH: 19, barH: 9, showInBar: false, labelW: 122,
          highlight: ['C3', 'C5'], title: '全部乐器音域总览',
        });
    }

    const sp = document.getElementById('speedTable');
    if (sp) sp.innerHTML = speedTable(all());

    const nz = document.getElementById('noiseTable');
    if (nz) nz.innerHTML = noiseTable(INST_NOISE);

    /* Hero 图缺失时不留破图：加一个类，CSS 用纸色兜底。
       注意要先查一次 complete —— 图在小文件/404 的情况下，脚本跑到这儿时
       error 事件往往已经发过了，只绑监听器是接不到的（实测会留下破图标）。 */
    const heroImg = document.querySelector('.hero-grid .art img');
    if (heroImg) {
      const mark = () => heroImg.closest('.art').classList.add('no-art');
      if (heroImg.complete && heroImg.naturalWidth === 0) mark();
      heroImg.addEventListener('error', mark);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* 测试钩子：run-tests 用它验证换算与数据完整性 */
  window.__IC__ = { midiOf, hzOf, hzText, all, rangeChart, INST_DATA, INST_NOISE };
})();
