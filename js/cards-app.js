/* ==========================================================================
 * 《姐弟厨师团》 · 卡片版启动与版面（js/cards-app.js）
 * --------------------------------------------------------------------------
 * 职责：
 *   1. 把 cards-deck 装订好的卡片流，**按真实屏幕高度分页**（一屏一卡，不滚动）
 *   2. 翻页 / 左右滑动 / 键盘 / 目录跳转
 *   3. 每节课各记一页（localStorage），切回来接着上次
 *   4. 乐理课的常驻钢琴（复用 keyboard.js；按键亮、停止后自动回正）
 *
 * 分页为什么要靠测量而不是"每张卡固定几条"：
 *   同一段话在 375px 和 430px 上占的行数不同；手机横过来又全变了。
 *   所以先把每个文字块单独量一遍高度，再按可用高度装袋——
 *   "不出现上下滚动"这条要求只能这样落地。
 * ========================================================================== */

const VERSION = { v: '1.44', date: '26.11.13' };

/* 键盘层（keyboard.js / playback.js）读这个全局：当前主音与调式 */
let state = { root: 0, mode: 'ionian' };

(function () {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const GAP = 12;                    /* 卡片正文里块与块的间距，与 CSS 的 gap 一致 */
  /* 互动卡并进文字卡时要额外占的高度：间距 + 那条虚线（padding-top 12 + 1px 边框）。
     少算这 13px，混排卡就会溢出十来像素——量得出来，看不出来，所以要留一点余量。 */
  const INLINE_COST = GAP + 14;

  const stage = $('#stage');
  const deck = $('#deck');
  const dock = $('#dock');
  const tabs = $('#tabs');
  const barFill = $('#barFill');
  const tbCourse = $('#tbCourse');
  const tbPos = $('#tbPos');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const sheet = $('#sheet');

  const app = {
    course: 'theory',
    page: 0,
    decks: {},      /* courseId → { avail, cards } */
    store: null,
  };

  /* ==========================================================================
   * 0 · 版本
   * ======================================================================== */
  function applyVersion() {
    const label = `V${VERSION.v} [${VERSION.date}]`;
    document.title = `姐弟厨师团 · 卡片版 ${label}`;
    $$('[data-ver]').forEach(el => { el.innerHTML = `<b>V${VERSION.v}</b> [${VERSION.date}]`; });
  }

  /* ==========================================================================
   * 1 · 量高与分页
   * ======================================================================== */
  let measureCard = null, measureBody = null, availH = 0, cache = new Map();

  /* 一张卡的内容不到可用高度的三成、又不足 110px，就算"单薄卡"——
     一屏只有一两行字，翻过去等于白翻。装袋与收尾共用这一条线。 */
  const thinH = () => Math.max(110, availH * 0.3);

  function initMeasure() {
    measureCard = document.createElement('article');
    measureCard.className = 'dcard measure';
    measureCard.innerHTML = '<div class="dc-head"><span>00 · 量</span></div><div class="dc-body"></div>';
    deck.appendChild(measureCard);
    measureBody = measureCard.querySelector('.dc-body');
  }

  function refreshAvail() {
    if (!measureBody) return;
    /* clientHeight 是取整过的，而块高（getBoundingClientRect）带小数；
       装袋时按整数可用高去凑，偶尔会多挤进两三个像素。
       留 3px 余量：宁可这一张少一行字，也不要出现"最后一行被切掉一半"。 */
    availH = Math.max(0, (measureBody.clientHeight || 0) - 3);
    cache = new Map();
    wCache = new Map();
  }

  /* ---------------- 文字块 → DOM ---------------- */
  function tableRow(cells, isHead, head) {
    const row = document.createElement('div');
    row.className = 'cb-trow' + (isHead ? ' head' : '');
    if (head.length <= 2) {
      row.classList.add('two');
      cells.forEach((c, i) => {
        const cell = document.createElement('div');
        cell.className = 'cb-tcell' + (i === 0 ? ' k' : '');
        cell.innerHTML = c;
        row.appendChild(cell);
      });
      return row;
    }
    /* 三列以上：竖排——第一格当标题，其余「列名：值」。
       手机上表格横滑是"能滚"的伪装，这里干脆不横着放。 */
    cells.forEach((c, i) => {
      const cell = document.createElement('div');
      cell.className = 'cb-tcell' + (i === 0 ? ' k' : '');
      cell.innerHTML = i === 0 || !head[i] ? c : `<i>${head[i]}</i><span>${c}</span>`;
      row.appendChild(cell);
    });
    return row;
  }

  function blockEl(b) {
    if (b.t === 'sec') {
      const box = document.createElement('div');
      box.className = 'cb-sec';
      const total = MT_DECK.CONTENT[b.sec.course].sections.length;
      box.innerHTML = `
        <div class="cb-sec-num">${b.sec.num}</div>
        <h2>${b.sec.title}</h2>
        <div class="cb-sec-meta">第 ${b.sec.si + 1} / ${total} 节 · ${MT_DECK.TABS[b.sec.course].name}</div>
        ${b.lead ? `<p class="cb-sec-lead">${b.lead.h}</p>` : ''}`;
      return box;
    }
    if (b.t === 'table') {
      const box = document.createElement('div');
      box.className = 'cb-table';
      if (b.head && b.head.length) box.appendChild(tableRow(b.head, true, b.head));
      const body = document.createElement('div');
      body.className = 'cb-tbody';
      b.rows.forEach(r => body.appendChild(tableRow(r, false, b.head || [])));
      box.appendChild(body);
      return box;
    }
    if (b.t === 'list') {
      const list = document.createElement(b.ord ? 'ol' : 'ul');
      list.className = 'cb-ul';
      b.items.forEach(it => {
        const li = document.createElement('li');
        li.innerHTML = it;
        list.appendChild(li);
      });
      return list;
    }
    if (b.t === 'h3') {
      const h = document.createElement('h3');
      h.className = 'cb-h';
      h.innerHTML = b.h;
      return h;
    }
    if (b.t === 'note') {
      const n = document.createElement('div');
      n.className = 'cb-note';
      n.innerHTML = b.h;
      return n;
    }
    const p = document.createElement('p');
    p.className = b.t === 'lead' ? 'cb-lead' : 'cb-p';
    p.innerHTML = b.h;
    return p;
  }

  function blockHeight(b) {
    if (cache.has(b)) return cache.get(b);
    const node = blockEl(b);
    node.style.flex = '0 0 auto';          /* 别被压缩：量出来的就是它自己的高度 */
    measureBody.appendChild(node);
    const h = node.getBoundingClientRect().height || 0;
    node.remove();
    cache.set(b, h);
    return h;
  }

  /* 表格：表头与每一行单独量，才能"这页放几行、下一页接着放" */
  function measureTable(b) {
    const headH = b.head && b.head.length
      ? (() => { const n = tableRow(b.head, true, b.head); measureBody.appendChild(n);
                 const h = n.getBoundingClientRect().height || 0; n.remove(); return h; })()
      : 0;
    const rows = b.rows.map(r => {
      const n = tableRow(r, false, b.head || []);
      measureBody.appendChild(n);
      const h = n.getBoundingClientRect().height || 0;
      n.remove();
      return { row: r, h };
    });
    return { headH, rows };
  }

  /* 互动卡也量一次高度：量过之后才知道"这一张文字卡还能不能顺带放下它"。
     量的时候会真的把 widget 建一遍（事件绑上就丢掉，用户点不到），
     所以量完必须移除——别让它留在测量卡里影响下一次测量。 */
  let wCache = new Map();
  function widgetHeight(w, opt) {
    const key = w + '|' + JSON.stringify(opt || {});
    if (wCache.has(key)) return wCache.get(key);
    const box = document.createElement('div');
    box.className = 'w';
    box.style.flex = '0 0 auto';
    try { MT_W.build(w, box, opt || {}); } catch (e) { /* 未知 widget：按 0 处理 */ }
    measureBody.appendChild(box);
    const h = box.getBoundingClientRect().height || 0;
    box.remove();
    wCache.set(key, h);
    return h;
  }

  /* ---------------- 超长段落的断句拆分 ---------------- */
  function pathOf(root, node) {
    const p = [];
    let n = node;
    while (n && n !== root) {
      p.unshift(Array.prototype.indexOf.call(n.parentNode.childNodes, n));
      n = n.parentNode;
    }
    return p;
  }
  function nodeAt(root, path) {
    let n = root;
    for (const i of path) { n = n.childNodes[i]; if (!n) return null; }
    return n;
  }
  function cutAfter(root, node) {
    let n = node;
    while (n && n !== root) {
      let s = n.nextSibling;
      while (s) { const next = s.nextSibling; s.remove(); s = next; }
      n = n.parentNode;
    }
  }
  function cutBefore(root, node) {
    let n = node;
    while (n && n !== root) {
      let s = n.previousSibling;
      while (s) { const prev = s.previousSibling; s.remove(); s = prev; }
      n = n.parentNode;
    }
  }

  /* 在最近的一个句末标点处切成两段；没有可切点就返回 null（宁可让它略溢出，
     也不要把一个词劈开）。 */
  function splitHtml(html, ratio) {
    const tpl = document.createElement('div');
    tpl.innerHTML = html;
    const texts = [];
    const w = document.createTreeWalker(tpl, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) texts.push(w.currentNode);
    const total = texts.reduce((a, t) => a + t.nodeValue.length, 0);
    if (total < 40) return null;
    let target = Math.round(total * Math.max(0.15, Math.min(0.85, ratio)));
    let acc = 0, node = null;
    for (const t of texts) {
      if (acc + t.nodeValue.length >= target) { node = t; target -= acc; break; }
      acc += t.nodeValue.length;
    }
    if (!node) return null;
    const before = node.nodeValue.slice(0, target);
    const m = [...before.matchAll(/[。！？；：!?;]/g)].pop();
    if (!m) return null;
    const off = m.index + 1;
    if (off < 6 || node.nodeValue.length - off < 6) return null;

    const path = pathOf(tpl, node);
    const left = tpl.cloneNode(true), right = tpl.cloneNode(true);
    const ln = nodeAt(left, path), rn = nodeAt(right, path);
    ln.nodeValue = node.nodeValue.slice(0, off);
    cutAfter(left, ln);
    rn.nodeValue = node.nodeValue.slice(off);
    cutBefore(right, rn);
    if (left.textContent.trim().length < 4 || right.textContent.trim().length < 4) return null;
    return [left.innerHTML.trim(), right.innerHTML.trim()];
  }

  /* 列表：逐条量。整块放不下时按条拆到下一张——一条一条地读，比整块被裁掉强。
     （表和列表是唯一能"按行/按条"切的东西；段落按句切，见 splitHtml。） */
  function measureList(b) {
    const list = document.createElement(b.ord ? 'ol' : 'ul');
    list.className = 'cb-ul';
    b.items.forEach(it => {
      const li = document.createElement('li');
      li.innerHTML = it;
      list.appendChild(li);
    });
    measureBody.appendChild(list);
    const hs = Array.prototype.map.call(list.children, li => li.getBoundingClientRect().height || 0);
    list.remove();
    return hs;
  }

  function fitBlock(b, out, depth, budget) {
    const cap = budget || availH;
    const h = blockHeight(b);
    if (h <= cap || depth > 6) { out.push(b); return; }
    /* 章节头塞不下（矮屏 + 长导语）：先丢掉导语，把导语退回普通段落，
       版面上宁可少一句导语，也不能把它裁掉半行。 */
    if (b.t === 'sec' && b.lead) {
      out.push({ t: 'sec', sec: b.sec, lead: null });
      fitBlock({ t: 'lead', h: b.lead.h }, out, depth + 1, cap);
      return;
    }
    if (b.t === 'list' && b.items && b.items.length > 1) {
      const hs = measureList(b), gap = 7;      /* .cb-ul 的 gap */
      let start = 0;
      while (start < hs.length) {
        let hh = 0, k = start;
        while (k < hs.length) {
          const add = hs[k] + (k > start ? gap : 0);
          if (k > start && hh + add > cap) break;
          hh += add; k++;
        }
        out.push({ t: 'list', items: b.items.slice(start, k), ord: b.ord });
        start = k;
      }
      return;
    }
    const parts = splitHtml(b.h || '', cap / Math.max(1, h));
    if (!parts) { out.push(b); return; }
    fitBlock({ t: 'p', h: parts[0] }, out, depth + 1);
    fitBlock({ t: 'p', h: parts[1] }, out, depth + 1);
  }

  /* ---------------- 合并单薄卡 ----------------
   * 分页是按块装的，块的尾巴不听话：长段落拆到最后只剩一行、列表拆到最后剩一条、
   * 某一节末尾恰好挤进来半句话——翻过去，一整屏就只有那一行字。
   * 这种卡不能靠"量高时多留几像素"解决，只能在装完之后回头收拾，按优先级：
   *   1. 并进上一张（最顺：读者的视线本来就在上一张的末尾）
   *   2. 并不过去 → 从上一张末尾借块过来，把这张垫厚
   *   3. 上一张是互动卡/表格借不动 → 反过来塞进下一张的开头
   * 只在同一节内部搬（章节标签才不会张冠李戴），章节头不往前并，
   * 也不许有内容排到章节头上面去。
   */
  function rebalance(cards) {
    const floor = thinH();      /* 卡面不到三成就算"太单薄" */
    const isText = c => c.t === 'blocks' && !c.widget && c.blocks && c.blocks.length;
    const isWidget = c => c.t === 'widget' || !!c.widget;
    const bareWidget = x => isWidget(x) && !(x.blocks && x.blocks.length) && !x.after;
    const sameSec = (a, b) => (a && b) ? a.id === b.id : a === b;
    const opensSection = c => c.blocks[0] && c.blocks[0].t === 'sec';
    const drop = i => { cards.splice(i, 1); };

    /* ① 往前收：并进上一张，或者从上一张末尾借块 */
    const pullBack = (c, p, i) => {
      if (!sameSec(p.sec, c.sec) || opensSection(c)) return false;

      /* 同一张表被切成两半、这一半只剩一两行 → 把行搬回上一张，别让整页只印一行表 */
      const ct = c.blocks.length === 1 && c.blocks[0].t === 'table' ? c.blocks[0] : null;
      const pt = (p.blocks && p.blocks.length) ? p.blocks[p.blocks.length - 1] : null;
      if (ct && pt && pt.t === 'table' && p.bt && p.bt === c.bt && ct.rows.length <= 3) {
        const m = measureTable({ head: ct.head, rows: ct.rows });
        const add = m.rows.reduce((s, r) => s + r.h + 6, 0);
        if (p.h + add <= availH) {
          pt.rows = pt.rows.concat(ct.rows);
          p.h += add;
          drop(i);
          return true;
        }
      }

      /* 上一张是互动卡：并进去当图注（正文块排在 .w 后面）。
         "先弄响一架钢琴" / "当前：C 大调" 本来就该是一张卡，
         拆成两页等于让人翻一页只看一句话。 */
      if (isWidget(p)) {
        if (p.h + GAP + c.h > availH) return false;
        p.after = (p.after || []).concat(c.blocks);
        p.h += GAP + c.h;
        drop(i);
        return true;
      }
      if (!isText(p)) return false;

      /* 整张并进上一张 */
      if (p.h + GAP + c.h <= availH) {
        p.blocks = p.blocks.concat(c.blocks);
        p.h += GAP + c.h;
        drop(i);
        return true;
      }

      /* 借块：借到"上一张末尾不再是标题"为止。小标题要是被借空了留成孤儿标题，
         比单薄卡更难看，所以它得连着正文一起走。 */
      const taken = [];
      let sumBh = 0, k = 0;
      while (p.blocks.length > 1) {
        const last = p.blocks[p.blocks.length - 1];
        if (k > 0 && last.t !== 'h3' && last.t !== 'sec') break;
        const bh = blockHeight(last);
        if (c.h + (k + 1) * GAP + sumBh + bh > availH) break;
        p.blocks.pop();
        taken.unshift(last); sumBh += bh; k++;
        if (c.h + k * GAP + sumBh >= floor) break;
      }
      if (!k) return false;
      p.h -= k * GAP + sumBh;
      c.blocks = taken.concat(c.blocks);
      c.h += k * GAP + sumBh;
      return true;
    };

    /* ② 往后再试一次：塞进下一张的开头。
         位置更靠后的卡在前后都放不下时，只剩这一条路——
         一页只印一行字，比"内容挪到下一页开头"糟得多。 */
    const pushNext = (c, i) => {
      const n = cards[i + 1];
      if (!n || !isText(n) || opensSection(n) || !sameSec(c.sec, n.sec)) return false;
      if (n.h + c.h + GAP > availH) return false;
      if (c.blocks[0].t === 'sec') n.hideHead = true;
      n.blocks = c.blocks.concat(n.blocks);
      n.h += c.h + GAP;
      drop(i);
      return true;
    };

    for (let pass = 0; pass < 60; pass++) {
      let changed = false;
      for (let i = 1; i < cards.length; i++) {
        const c = cards[i], p = cards[i - 1];

        /* 两张都只有互动区、且叠起来还放得下：叠成一页。
           "十三个维度"那种一节连出好几张小卡，一页一张就是连翻几页空白。
           这里不看"单薄"阈值——放得下就叠，省下的是整整一页翻页动作。 */
        if (bareWidget(c) && bareWidget(p) && sameSec(p.sec, c.sec) &&
            p.h + c.h + GAP <= availH) {
          p.extra = (p.extra || []).concat([c.widget || { w: c.w, opt: c.opt }]);
          p.h += c.h + GAP;
          drop(i);
          changed = true; i--; continue;
        }

        if (!isText(c) || c.h >= floor) continue;

        if (pullBack(c, p, i) || pushNext(c, i)) { changed = true; i--; }
      }
      if (!changed) break;
    }
    return cards;
  }

  /* ---------------- 装袋 ---------------- */
  function paginate(items) {
    const queue = items.slice();
    const cards = [];
    let cur = null, curH = 0;
    const flush = () => { if (cur && cur.blocks.length) { cur.h = curH; cards.push(cur); } cur = null; curH = 0; };

    /* 卡片翻页时，最下面那个"小标题/章节头"不能留在上一张——
       "三种典型翻车"孤零零印在页脚、翻过去才看见表，比不排版还糟。
       装得下就把它一起带到下一张卡的开头；装不下就只好让它留在原地，
       别为了体面把下一张卡撑破。 */
    const peekHead = () => {
      if (!cur || !cur.blocks.length) return null;
      const last = cur.blocks[cur.blocks.length - 1];
      return last && (last.t === 'h3' || last.t === 'sec') ? last : null;
    };
    const takeHead = head => {
      cur.blocks.pop();
      curH -= GAP + blockHeight(head);
    };
    const startWith = (carry, item) => {
      cur = { t: 'blocks', ci: item.ci, sec: item.sec, blocks: [carry] };
      curH = blockHeight(carry);
      if (carry.t === 'sec') cur.hideHead = true;
    };

    for (let qi = 0; qi < queue.length; qi++) {
      const item = queue[qi];

      if (item.t === 'widget') {
        /* 剩下的空间够就并进当前这张卡：一段讲解 + 一个能点的东西，
           比"半页空白 + 一张互动卡"更像教材。 */
        const wh = widgetHeight(item.w, item.opt) + INLINE_COST;
        if (cur && wh > 0 && curH + wh <= availH) {
          cur.widget = { w: item.w, opt: item.opt || {} };
          curH += wh;                     /* 混排卡的真实高度要含这块，后面收尾要用 */
          flush();
          continue;
        }
        /* 互动卡自带标题，不接上一张卡甩下来的小标题/章节头——
           接过来就等于让一张已经排满的卡再多背一块，必溢出。 */
        flush();
        cards.push({ ...item, h: wh });
        continue;
      }
      if (item.t !== 'block') { flush(); cards.push({ ...item }); continue; }
      const b = item.block;

      /* 表格：独占一张（或连续几张）卡，按行装。
         行与行之间还有 6px 的 gap，量行高时量不到它（getBoundingClientRect
         只给节点本身），所以每行按 h+6 记账，否则行一多就会溢出几个像素。 */
      if (b.t === 'table') {
        const m = measureTable(b);
        const rowGap = 6;
        const hasHead = !!(b.head && b.head.length);
        const firstRowH = m.rows.length ? m.rows[0].h + rowGap : 0;
        const headH0 = hasHead ? m.headH : 0;
        const runH = run => run.reduce((s, x) => s + blockHeight(x), 0) + run.length * GAP;
        /* 标题要带走就整串带走：只剩"第 17 节"和它的副标题这一张，
           把副标题单独搬走、留下章节号独自一页，比不搬还难看。 */
        const tail = [];
        if (cur) {
          for (let k = cur.blocks.length - 1; k >= 0; k--) {
            const t = cur.blocks[k].t;
            if (t !== 'h3' && t !== 'sec') break;
            tail.unshift(cur.blocks[k]);
          }
        }
        const carryRun = tail.length && runH(tail) + headH0 + firstRowH <= availH ? tail : null;

        /* 上一张要是只剩个头（"萨克斯：铜管的身子" + 一句说明），表却在下一张——
           那两行本来就是这张表的引言，该跟着表走。
           只在它确实单薄、且带着表头第一行还装得下时才整张搬，不能为了体面撑破下一张。 */
        const whole = cur && cur.blocks.length && curH < thinH() &&
                      runH(cur.blocks) + headH0 + firstRowH <= availH ? cur.blocks.slice() : null;

        if (whole) { cur = null; curH = 0; }
        else if (carryRun) {
          carryRun.forEach(x => { cur.blocks.pop(); curH -= GAP + blockHeight(x); });
        }
        flush();
        let rows = m.rows.slice();
        let first = true;
        let lastH = 0;
        while (rows.length) {
          /* 第一张表卡要是有引言跟过来，先给它让出位置 */
          const leadIn = first ? (whole || carryRun || []) : [];
          const leadInH = leadIn.length ? runH(leadIn) : 0;
          /* 引言里带着章节头的话，卡片右上角的小字就别再重复一遍 */
          const hideHead = !!(leadIn[0] && leadIn[0].t === 'sec');
          const cap = Math.max(availH - leadInH, headH0 + rowGap + 24);
          let h = leadInH + headH0;
          const take = [];
          while (rows.length) {
            const rh = rows[0].h + (take.length || hasHead ? rowGap : 0);
            if (take.length && h + rh > cap) break;
            take.push(rows.shift());
            h += rh;
          }
          if (!take.length) take.push(rows.shift());
          cards.push({
            t: 'blocks', ci: item.ci, sec: item.sec, h,
            hideHead: hideHead || undefined, bt: b,     /* bt：出自哪一张表，收尾时认亲用 */
            blocks: leadIn.concat([{ t: 'table', head: b.head, rows: take.map(x => x.row) }]),
          });
          lastH = h;
          first = false;
        }
        /* 一张表往往填不满最后一张卡：把这张卡留在手上，后面的段落接着往里排。
           不这么做，"表格 + 紧跟的两段解释"会变成"半页空白的表"+"另起一页的字"。 */
        if (cards.length && lastH + 60 < availH) {
          cur = cards.pop();
          curH = lastH;
        }
        continue;
      }

      const pieces = [];
      /* 这一张要是只剩标题（章节号/小标题）还没等到正文，那正文必须挤进来一点：
         整块推走就成了"一整页只有一个标题"，比少排两行难看得多。
         所以按剩余空间切第一段，剩下的照常翻页。 */
      const headOnly = cur && cur.blocks.length && cur.blocks.every(x => x.t === 'h3' || x.t === 'sec');
      const room = headOnly ? availH - curH - GAP : 0;
      fitBlock(b, pieces, 0, room > 60 ? room : availH);
      for (const p of pieces) {
        const h = blockHeight(p);
        /* 章节头一律从新的一张卡开始：它要是被挤到上一张的卡底，
           读者会以为这一节到这儿就完了（而且翻页前看不见它下面的内容）。 */
        if (p.t === 'sec' && cur && cur.blocks.length) flush();
        if (cur && curH + GAP + h > availH) {
          /* 只有"标题 + 这一块"确实装得下，才把它带过去 */
          const head = peekHead();
          const carry = head && blockHeight(head) + GAP + h <= availH ? head : null;
          if (carry) takeHead(carry);
          flush();
          if (carry) startWith(carry, item);
        }
        if (!cur) { cur = { t: 'blocks', ci: item.ci, sec: item.sec, blocks: [] }; curH = 0; }
        if (!cur.blocks.length && p.t === 'sec') cur.hideHead = true;
        cur.blocks.push(p);
        curH += (cur.blocks.length > 1 ? GAP : 0) + h;
      }
    }
    flush();
    return rebalance(cards);
  }

  function deckFor(course) {
    const c = app.decks[course];
    if (c && c.avail === availH) return c.cards;
    const cards = paginate(MT_DECK.itemsOf(course));
    app.decks[course] = { avail: availH, cards };
    return cards;
  }

  /* ==========================================================================
   * 2 · 画卡
   * ======================================================================== */
  function secLabel(sec) {
    if (!sec || (!sec.num && !sec.title)) return '';
    return sec.num ? `${sec.num} · ${sec.title}` : sec.title;
  }

  function buildCard(card) {
    const el = document.createElement('article');
    el.className = 'dcard ' + card.t;

    if (card.t === 'cover') {
      const c = card.course;
      el.innerHTML = `
        <div class="cover-art"><img src="${c.hero}" alt="${c.name}插图"></div>
        <div class="cover-txt">
          <span class="cover-kick">${c.en}</span>
          <h1>${c.name}</h1>
          <p>${c.kicker}</p>
          <span class="cover-hint">向左滑开始 · 共 ${c.sections.length} 节</span>
        </div>`;
      return el;
    }

    if (card.t === 'widget' || card.widget) {
      el.classList.add('widget');
      if (!card.hideHead) {
        const head = document.createElement('div');
        head.className = 'dc-head';
        head.innerHTML = `<span>${secLabel(card.sec)}</span>`;
        el.appendChild(head);
      }
      const body = document.createElement('div');
      body.className = 'dc-body';
      (card.blocks || []).forEach(b => body.appendChild(blockEl(b)));
      if (card.blocks && card.blocks.length) el.classList.add('has-blocks');
      const w = document.createElement('div');
      w.className = 'w';
      MT_W.build(card.widget ? card.widget.w : card.w, w, card.widget ? card.widget.opt : (card.opt || {}));
      if (card.blocks && card.blocks.length) w.classList.add('w-inline');
      body.appendChild(w);
      /* 连着的互动卡叠在一页（各自都只有半个屏幕高时，一页一张等于连翻三页空白） */
      (card.extra || []).forEach(x => {
        const n = document.createElement('div');
        n.className = 'w w-stacked';
        MT_W.build(x.w, n, x.opt || {});
        body.appendChild(n);
      });
      /* 互动卡下挂的图注（分页时从"只剩一句话"的那张卡里并过来的） */
      (card.after || []).forEach(b => body.appendChild(blockEl(b)));
      el.appendChild(body);
      return el;
    }

    /* 文字卡 */
    if (!card.hideHead) {
      const head = document.createElement('div');
      head.className = 'dc-head';
      head.innerHTML = `<span>${secLabel(card.sec)}</span>`;
      el.appendChild(head);
    }
    const body = document.createElement('div');
    body.className = 'dc-body';
    (card.blocks || []).forEach(b => body.appendChild(blockEl(b)));
    el.appendChild(body);
    return el;
  }

  /* ==========================================================================
   * 3 · 翻页
   * ======================================================================== */
  function cards() { return deckFor(app.course); }

  function sectionOfPage(i) {
    const list = cards();
    for (let k = Math.min(i, list.length - 1); k >= 0; k--) {
      if (list[k].sec) return list[k].sec;
      if (list[k].t === 'cover') return null;
    }
    return null;
  }

  function save() {
    const sec = sectionOfPage(app.page);
    app.store.last = app.course;
    app.store.at[app.course] = { p: app.page, sec: sec ? sec.id : '' };
    MT_DECK.writeStore(safeStorage(), app.store);
  }

  function updateChrome() {
    const list = cards();
    const total = list.length;
    tbCourse.textContent = MT_DECK.TABS[app.course].name;
    tbPos.textContent = `${Math.min(app.page + 1, total)} / ${total}`;
    barFill.style.width = total ? ((app.page + 1) / total * 100).toFixed(1) + '%' : '0%';
    prevBtn.disabled = app.page <= 0;
    nextBtn.disabled = app.page >= total - 1;
    document.documentElement.style.setProperty('--accent', MT_DECK.TABS[app.course].accent);
    document.documentElement.style.setProperty('--accent-bg', MT_DECK.TABS[app.course].bg);
  }

  let animating = false;

  /* 极少数互动卡在矮屏上比一屏还高（例如 13 维场景卡在 667 高的手机上多 3px）。
     差得不多时按比例缩一点，比切掉最后一行体面；缩到 80% 还装不下就停手——
     把字压成 6px 换"没裁切"，等于换了个更糟的问题。
     用 zoom 而不是 transform：transform 只改画不改版面，滚动高度照旧算溢出，
     量"有没有被裁"时会一直报红；zoom 会把版面一起缩，量得准也就不必再补宽度。 */
  function fitWidgetHeight(el) {
    const body = el.querySelector('.dc-body');
    if (!body || el.classList.contains('has-blocks')) return;
    if (!body.clientHeight || body.scrollHeight <= body.clientHeight) return;
    const w = body.querySelector('.w');
    if (!w) return;
    /* 缩一次不一定是整数像素：zoom 之后重新量，最多修三轮 */
    for (let n = 0; n < 3; n++) {
      const avail = body.clientHeight, need = body.scrollHeight;
      if (!avail || need <= avail) return;
      const cur = parseFloat(w.style.zoom) || 1;
      const k = cur * (avail - 1) / need;
      if (k < 0.8) return;
      w.style.zoom = k.toFixed(4);
    }
  }

  function show(i, dir) {
    const list = cards();
    if (!list.length) return;
    i = Math.max(0, Math.min(list.length - 1, i));
    const same = i === app.page && deck.querySelector('.dcard.active');
    const old = deck.querySelector('.dcard.active');
    app.page = i;

    if (same && old) { updateChrome(); save(); return; }

    const neu = buildCard(list[i]);
    neu.classList.add('active');
    neu.style.setProperty('--from', dir < 0 ? '-26px' : '26px');
    deck.appendChild(neu);
    fitWidgetHeight(neu);
    /* 入场 */
    requestAnimationFrame(() => neu.classList.add('in'));
    if (old) {
      old.classList.remove('active');
      old.classList.add('out');
      old.style.setProperty('--to', dir < 0 ? '22px' : '-22px');
      setTimeout(() => old.remove(), 230);
    }
    updateChrome();
    save();
    stopAudio();
  }

  function go(delta) {
    if (animating) return;
    const list = cards();
    const i = app.page + delta;
    if (i < 0 || i >= list.length) return;
    show(i, delta);
  }

  /* ==========================================================================
   * 4 · 音频（含"停止后键盘回正"）
   * ======================================================================== */
  function stopAudio() {
    try { stopAll(); } catch (e) { /* 音频还没建过 */ }
    $$('.kb .flash').forEach(el => el.classList.remove('flash'));
    $$('.w-beat.hit').forEach(el => el.classList.remove('hit'));
  }

  /* ==========================================================================
   * 5 · 底栏钢琴
   * ======================================================================== */
  function syncDock() {
    const on = app.course === 'theory';
    dock.classList.toggle('off', !on);
    if (on) {
      /* 显示之后才有宽度：renderKB 按 clientWidth 算键宽。
         同样不等帧——上面的 class 已经改完，读 clientWidth 会把布局算出来。 */
      try { renderKB(); } catch (e) { /* 没有键盘层 */ }
    }
  }

  /* ==========================================================================
   * 6 · 顶部：标签 / 目录
   * ======================================================================== */
  function setCourse(course, page) {
    if (!MT_DECK.CONTENT[course]) return;
    app.course = course;
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.course === course));
    syncDock();
    /* 切课会改变可用高度（乐理课多一条钢琴），所以必须重新量、重新装袋。
       这里**同步**量，不等 requestAnimationFrame：读 clientHeight 本身就会
       强制结算布局，钢琴的显示/隐藏已经生效。早先版本等一帧再量，
       结果在"不产出帧"的环境里（后台标签页、无头浏览器）回调根本不执行，
       切到乐理课之后可用高度还是上一门课的，卡片会按多出来的 120px 排——
       看着排满了，下半截其实在屏幕外。 */
    refreshAvail();
    const list = cards();
    const saved = app.store.at[course];
    let p = page != null ? page : (saved && typeof saved.p === 'number' ? saved.p : 0);
    p = Math.max(0, Math.min(list.length - 1, p));
    app.page = -1;
    show(p, 0);
    renderSheet();
  }

  function openSheet() {
    sheet.classList.add('on');
    sheet.setAttribute('aria-hidden', 'false');
    renderSheet();
  }
  function closeSheet() {
    sheet.classList.remove('on');
    sheet.setAttribute('aria-hidden', 'true');
  }

  function renderSheet() {
    const list = cards();
    const box = $('#sheetList');
    if (!box) return;
    const cur = sectionOfPage(app.page);
    box.innerHTML = '';
    list.forEach((c, i) => {
      const first = c.blocks && c.blocks[0] && c.blocks[0].t === 'sec' ? c.blocks[0].sec : null;
      if (!first) return;
      const b = document.createElement('button');
      b.className = 'sheet-item' + (cur && first.id === cur.id ? ' on' : '');
      b.innerHTML = `<i>${first.num}</i><span>${first.title}</span><em>${i + 1}</em>`;
      b.onclick = () => { closeSheet(); show(i, i > app.page ? 1 : -1); };
      box.appendChild(b);
    });
  }

  /* ==========================================================================
   * 7 · 手势与键盘
   * ======================================================================== */
  function bindGestures() {
    let sx = 0, sy = 0, dragging = false, moved = false, pid = null, cardEl = null;

    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('input,textarea,select,.kb,.sheet,#tabs')) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY;
      dragging = true; moved = false;
      cardEl = deck.querySelector('.dcard.active');
    });

    stage.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== pid) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) moved = true;
      if (moved && cardEl) {
        cardEl.style.transition = 'none';
        cardEl.style.transform = `translateX(${dx * 0.35}px)`;
        e.preventDefault();
      }
    });

    const end = e => {
      if (!dragging || (e.pointerId !== undefined && e.pointerId !== pid)) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      dragging = false;
      if (cardEl) { cardEl.style.transition = ''; cardEl.style.transform = ''; }
      if (moved && Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
      cardEl = null; pid = null;
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', () => { dragging = false; if (cardEl) { cardEl.style.transform = ''; } cardEl = null; });

    prevBtn.onclick = () => go(-1);
    nextBtn.onclick = () => go(1);
    $('#titleBtn').onclick = openSheet;
    $('#sheetClose').onclick = closeSheet;
    sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

    $$('#tabs button').forEach(b => {
      b.onclick = () => { if (b.dataset.course !== app.course) setCourse(b.dataset.course); };
    });

    $('#dockStop').onclick = stopAudio;

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.code === 'Space' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault(); stopAudio();
      }
      else if (e.key === 'Escape') closeSheet();
    });

    /* 旋屏 / 改窗宽：重新量、重新装袋 */
    let t = null;
    const relayout = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const secBefore = sectionOfPage(app.page);
        refreshAvail();
        app.decks = {};
        const list = cards();
        let p = 0;
        if (secBefore) {
          const idx = list.findIndex(c => c.blocks && c.blocks[0] &&
            c.blocks[0].t === 'sec' && c.blocks[0].sec.id === secBefore.id);
          if (idx >= 0) p = idx;
        }
        app.page = -1;
        show(Math.min(p, list.length - 1), 0);
        renderSheet();
        if (app.course === 'theory') { try { renderKB(); } catch (err) {} }
      }, 180);
    };
    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', relayout);
  }

  /* ==========================================================================
   * 8 · 启动
   * ======================================================================== */
  function safeStorage() {
    try {
      const s = window.localStorage;
      const k = '__mt_probe__';
      s.setItem(k, '1'); s.removeItem(k);
      return s;
    } catch (e) {
      return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    }
  }

  /* 深链：#c=lyric&p=12 —— 分享某一页用；缺省照旧走 localStorage。
     带深链进来时**不写存储**，免得一次分享链接把对方自己的进度顶掉。 */
  function deepLink() {
    const h = String(location.hash || '').replace(/^#/, '');
    if (!h) return null;
    const q = new URLSearchParams(h);
    const c = q.get('c'), p = q.get('p');
    return {
      c: c && MT_DECK.CONTENT[c] ? c : null,
      p: p != null && p !== '' && isFinite(+p) ? Math.max(0, +p) : null,
    };
  }

  function boot() {
    applyVersion();
    initMeasure();
    app.store = MT_DECK.readStore(safeStorage());
    bindGestures();
    try { kbDragInit(); } catch (e) { /* 没有键盘层 */ }

    const link = deepLink();

    /* 先按当前课程建一次版面；字体加载完再量一次（行高会变） */
    setCourse((link && link.c) || app.store.last || 'theory', link && link.p != null ? link.p : null);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        refreshAvail();
        app.decks = {};
        const list = cards();
        app.page = -1;
        show(Math.min(app.store.at[app.course] ? app.store.at[app.course].p || 0 : 0, list.length - 1), 0);
      });
    }

    /* 测试钩子 */
    window.__CD__ = {
      VERSION,
      get course() { return app.course; },
      get page() { return app.page; },
      get cards() { return cards(); },
      get avail() { return availH; },
      goto: i => show(i, i > app.page ? 1 : -1),
      setCourse, itemsOf: MT_DECK.itemsOf, blockText: MT_DECK.blockText,
      readStore: MT_DECK.readStore, writeStore: MT_DECK.writeStore,
      splitHtml, paginate, buildCard,
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
