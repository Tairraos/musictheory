/* ==========================================================================
 * 《姐弟厨师团》 · 卡片版装订层（js/cards-deck.js）
 * --------------------------------------------------------------------------
 * 职责：把三节课的**文字块**（js/cards-data.js，由 tools/build-cards-data.js
 *       从三个长网页抽出来）装订成一条卡片流，并在规定的位置插进互动卡。
 *
 * 这一层不碰 DOM、不量高度——它只决定"顺序"：
 *   封面 → 每节【节封面 → 文字块（中间插互动卡）】
 * 分页（哪些文字块落在同一张卡上）由 cards-app.js 按真实屏幕高度来量。
 *
 * 互动卡（widget）的位置写在下面的 WIDGET_PLAN 里：
 *   at = 插在 section.blocks[at] 之前（0 = 该节第一个文字块之前）
 *   不写 at 时默认 1：紧跟在 lead 导语之后——先讲一句，再动手。
 * ========================================================================== */

const MT_DECK = (function () {
  'use strict';

  const CONTENT = window.CARDS_DATA.courses;

  /* 课程顺序 = 顶上三个标签的顺序。颜色沿用长网页的语义色：
     乐理紫、作词粉、乐器青。 */
  const ORDER = ['theory', 'lyric', 'instrument'];
  const TABS = {
    theory: { name: '乐理课', accent: '#534AB7', bg: '#EEEDFE' },
    lyric: { name: '作词课', accent: '#993556', bg: '#FBEAF0' },
    instrument: { name: '乐器课', accent: '#0F6E56', bg: '#E1F5EE' },
  };

  /* ------------------------------------------------------------------------
   * 互动卡位置表
   * ---------------------------------------------------------------------- */
  const PLAN = {
    theory: {
      's-start': [{ w: 'scale', at: 0 }],
      's-halfnote': [{ w: 'interval', at: 0 }],
      's-majmin': [{ w: 'minorforms', at: 1 }],
      's-modes': [{ w: 'modes', at: 0 }],
      's-penta': [{ w: 'penta', at: 1 }, { w: 'exotic', at: 5 }],
      's-chord': [{ w: 'chords', at: 1 }],
      's-cadence': [{ w: 'cadence', at: 1 }],
      's-tempo': [{ w: 'tempo', at: 1 }],
      's-meter': [{ w: 'meter', at: 1 }],
      's-groove': [{ w: 'groove', at: 11 }],
      's-form': [{ w: 'blues', at: 2 }, { w: 'shuffle', at: 5 }],
      's-lyric': [{ w: 'tonefit', at: 2 }, { w: 'stress', at: 5 },
                  { w: 'phrase', at: 8 }, { w: 'breath', at: 11 }],
      's-key': [{ w: 'transpose', at: 0 }],
      /* 's-emotion' 不在这里写：13 个维度各一张场景卡，由 sceneWidgets() 统一生成 */
      's-ensemble': [{ w: 'ensemble', at: 1 }],
      's-advance': [{ w: 'sevenths', at: 2 }, { w: 'modulation', at: 5 }],
    },
    lyric: {
      's-genre': [{ w: 'genres', at: 1 }],
      's-rhyme': [{ w: 'schemes', at: 1 }],
      's-cn': [{ w: 'cnpatterns', at: 1 }],
      's-image': [{ w: 'materials', at: 1 }],
      's-parts': [{ w: 'parts', at: 1 }],
      's-hook': [{ w: 'hooks', at: 1 }],
      's-school': [{ w: 'schools', at: 1 }],
      's-guofeng': [{ w: 'gftypes', at: 1 }],
      's-guofeng-craft': [{ w: 'gfwords', at: 1 }],
      's-frame': [{ w: 'frames', at: 1 }],
      's-ban': [{ w: 'banlist', at: 1 }],
      's-fix': [{ w: 'fixsteps', at: 1 }],
      's-check': [{ w: 'scan', at: 1 }],
    },
    instrument: {},
  };

  /* 乐器课：节 id → 乐器族 id。族内每件乐器各占一张卡（卡片版自己画音域条）。 */
  const FAM_SEC = {
    's-key': 'key', 's-strings': 'strings', 's-guitar': 'guitar',
    's-pluck': 'pluck', 's-wood': 'wood', 's-sax': 'sax', 's-brass': 'brass',
    's-perc': 'perc', 's-voice': 'voice', 's-folk': 'folk', 's-elec': 'elec',
  };

  /* 场景卡：按维度分卡，每张列该维度的全部配方。
     "心情"（14 张）和"文化与风格"（15 张）的 chip 在窄屏上要折四五排，
     一屏塞不下，所以超过 8 张的维度劈成两张（a/b 是下标区间）。
     注意：data.js 里的 DIMS 是**经典 script 的顶层 const**，它不会挂到 window 上，
     所以这里必须用裸标识符（用 window.DIMS 会永远拿到 undefined，
     结果就是 13 张场景卡一张都不出现——这个坑踩过一次）。 */
  function sceneWidgets() {
    const dims = (typeof DIMS !== 'undefined') ? DIMS : [];
    const scenes = (typeof SCENES !== 'undefined') ? SCENES : [];
    const out = [];
    dims.forEach(d => {
      const n = scenes.filter(s => s.g === d.id).length;
      if (n > 8) {
        const mid = Math.ceil(n / 2);
        out.push({ w: 'scenes', at: 999, opt: { dim: d.id, a: 0, b: mid } });
        out.push({ w: 'scenes', at: 999, opt: { dim: d.id, a: mid, b: n } });
      } else {
        out.push({ w: 'scenes', at: 999, opt: { dim: d.id } });
      }
    });
    return out;
  }

  function instrumentWidgets(sec) {
    const famId = FAM_SEC[sec.id];
    const data = (typeof INST_DATA !== 'undefined') ? INST_DATA : null;
    if (!famId || !data) return [];
    const fam = data.families.find(f => f.id === famId);
    if (!fam) return [];
    const out = [{ w: 'range', at: 1, opt: { fam: famId } }];
    fam.items.forEach(it => out.push({ w: 'inst', at: 1, opt: { id: it.id } }));
    return out;
  }

  /* 乐器课里几节单独安排的卡：读图示例 / 全局总览。
     全局总览一屏放不下 46 条音域条，按族劈成上下两张（a/b 是族的区间），
     横轴由 cards-widgets 用全集刻度对齐——两半才能互相比较。 */
  function instrumentSpecials(sec) {
    if (sec.id === 's-read') return [{ w: 'rangeOne', at: 1, opt: { id: 'piano' } }];
    if (sec.id === 's-all') {
      const total = (typeof INST_DATA !== 'undefined') ? INST_DATA.families.length : 11;
      const mid = Math.round(total / 2);
      return [
        { w: 'rangeAll', at: 1, opt: { a: 0, b: mid } },
        { w: 'rangeAll', at: 1, opt: { a: mid, b: total } },
      ];
    }
    return [];
  }

  function widgetsOf(sec) {
    const plan = (PLAN[sec.course] && PLAN[sec.course][sec.id]) || [];
    let list = plan.slice();
    if (sec.course === 'instrument') {
      list = list.concat(instrumentSpecials(sec), instrumentWidgets(sec));
    }
    if (sec.id === 's-emotion') list = list.concat(sceneWidgets());
    return list;
  }

  /* ------------------------------------------------------------------------
   * 装订
   * ---------------------------------------------------------------------- */
  let cache = {};

  function itemsOf(courseId) {
    if (cache[courseId]) return cache[courseId];
    const c = CONTENT[courseId];
    if (!c) return [];

    const items = [{ t: 'cover', ci: courseId, course: c }];

    c.sections.forEach((sec, si) => {
      const s = { ...sec, course: courseId, si };
      /* 导语（lead）不跟文字块一起排队，它挂到节封面上：
         节封面原本只有编号和标题，太空；导语正好把那块空白填上，
         读者一翻到这一节就先看见"这节要讲什么"。
         万一导语太长塞不进封面，cards-app 会把它退回文字流（见 paginate）。 */
      const leadIdx = sec.blocks.findIndex(b => b.t === 'lead');
      const lead = leadIdx >= 0 ? sec.blocks[leadIdx] : null;
      const rest = sec.blocks.filter((b, i) => i !== leadIdx);
      /* 节首不是一张空白封面，而是一块"章节头"（编号 + 标题 + 导语）。
         它跟正文一起排队：这一张卡通常还能装下后面一两段，
         于是既保留了章节感，又不浪费一整屏。 */
      items.push({ t: 'block', ci: courseId, sec: s, block: { t: 'sec', sec: s, lead } });

      const plan = widgetsOf(s);
      const atInRest = at => {
        let v = at == null ? 1 : at;
        if (leadIdx >= 0 && v > leadIdx) v -= 1;    /* 计划表按下标（含导语）写，这里换算到去掉导语后的位置 */
        return Math.max(0, Math.min(rest.length, v));
      };

      for (let i = 0; i <= rest.length; i++) {
        plan.forEach(p => {
          if (atInRest(p.at) === i) {
            items.push({ t: 'widget', ci: courseId, sec: s, w: p.w, opt: p.opt || {} });
          }
        });
        if (i < rest.length) items.push({ t: 'block', ci: courseId, sec: s, block: rest[i] });
      }
    });

    cache[courseId] = items;
    return items;
  }

  /* 每节的第一块（章节头）在 item 流里的下标——给测试与目录用 */
  function sectionStarts(courseId) {
    const out = {};
    itemsOf(courseId).forEach((it, i) => {
      if (it.t === 'block' && it.block && it.block.t === 'sec' && !(it.sec.id in out)) {
        out[it.sec.id] = i;
      }
    });
    return out;
  }

  /* 纯文本（表格行、列表也能取），给检索与测试用 */
  function blockText(b) {
    const strip = h => String(h || '').replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (b.t === 'table') return [b.head.map(strip).join(' ')]
      .concat(b.rows.map(r => r.map(strip).join(' '))).join(' ');
    if (b.t === 'list') return b.items.map(strip).join(' ');
    return strip(b.h);
  }

  /* ------------------------------------------------------------------------
   * 进度存储：每节课各记一页（第几页 / 出自哪一节）
   * 存两样东西的原因：页码在内容更新后会漂，节 id 不会——两者都存，
   * 恢复时优先信页码，但夹在有效范围内，并把所属节报给目录高亮。
   * ---------------------------------------------------------------------- */
  const KEY = 'mt.cards.v1';

  function readStore(storage) {
    try {
      const raw = storage && storage.getItem(KEY);
      if (!raw) return { last: 'theory', at: {} };
      const v = JSON.parse(raw);
      return {
        last: ORDER.includes(v.last) ? v.last : 'theory',
        /* Array 的 typeof 也是 'object'，得单独挡掉——否则坏数据会变成一张"页码表" */
        at: (v.at && typeof v.at === 'object' && !Array.isArray(v.at)) ? v.at : {},
      };
    } catch (e) {
      return { last: 'theory', at: {} };
    }
  }

  function writeStore(storage, store) {
    try { storage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* 隐私模式 / file:// 下忽略 */ }
  }

  return {
    ORDER, TABS, CONTENT,
    itemsOf, sectionStarts, blockText,
    readStore, writeStore, KEY,
    /* 测试钩子：不动 DOM 也能核对"每节都有卡、每块文字只用一次" */
    widgetsOf,
  };
})();
