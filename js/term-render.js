/* ==========================================================================
 * 《姐弟厨师团——乐器课》 · 术语渲染层（js/term-render.js）
 * --------------------------------------------------------------------------
 * 只做三件事，全部从 TERM_DATA 推出来，页面里不写死任何条数：
 *   1. 通用表（跨乐器的发音法，带"会用到它的族"）
 *   2. 十一个族各一张小表（只放该族独有的技法）
 *   3. 往每件乐器的卡片底部挂 2–3 个术语锚点
 *
 * 为什么术语集中在这里、而不是散到各族：
 *   一种动作只定义一次。花舌、循环换气、弹舌同时属于木管、萨克斯、铜管、唢呐，
 *   散着写就是九份副本——改一处忘八处，几个月后没人知道哪份是对的。
 *
 * 为什么卡片上只挂 id 不挂正文：
 *   卡片是"入口"，不是"定义"。锚点跳过来看到的永远是术语表那一条。
 *
 * 依赖方向：本层读 INST_DATA（只为取族色），乐器层不反过来认术语层。
 * ========================================================================== */
(function () {
  'use strict';

  const D = TERM_DATA;

  /* id → { t: 词条, fam: 所属族（通用条为 null） } */
  const idx = new Map();
  D.general.forEach(t => idx.set(t.id, { t: t, fam: null }));
  D.families.forEach(f => f.terms.forEach(t => idx.set(t.id, { t: t, fam: f })));

  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const famName = id => {
    const f = D.families.find(x => x.id === id);
    return f ? f.zh : id;
  };

  /* 族色从 INST_DATA 取：术语表与音域图用同一套颜色，读者才能把两处对上 */
  function famColor(id) {
    if (typeof INST_DATA === 'undefined') return '#534AB7';
    const f = INST_DATA.families.find(x => x.id === id);
    return f ? f.color : '#534AB7';
  }

  function row(t, extra) {
    return `<tr id="t-${t.id}"><td class="tz">${esc(t.zh)}</td>`
      + `<td>${esc(t.form)}</td><td>${esc(t.use)}</td>`
      + `<td class="ten">${esc(t.en)}</td>${extra || ''}</tr>`;
  }

  function generalTable() {
    const rows = D.general.map(t =>
      row(t, `<td class="reuse">${t.reuse.map(famName).join('、')}</td>`)).join('');
    return `<div class="tscroll wide"><table class="terms gen">
      <thead><tr><th>术语</th><th>形式表现</th><th>作用</th>
        <th>英文提示词</th><th>会用到它的族</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function familyCard(f) {
    const rows = f.terms.map(t => row(t)).join('');
    return `<div class="card terms-card" style="--c:${famColor(f.id)}">
      <h3><span class="tmark"></span>${esc(f.zh)}
        <span class="terms-n">${f.terms.length} 条</span></h3>
      <p class="mini">${esc(f.items)}</p>
      <div class="tscroll wide"><table class="terms">
        <thead><tr><th>术语</th><th>形式表现</th><th>作用</th><th>英文提示词</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
    </div>`;
  }

  /* 卡片底部：术语只挂 id，跳回术语表那一条。
     找不到 id 就跳过（不写空壳），写错 id 由 T4 测试直接挂掉。 */
  function attachCardTerms() {
    document.querySelectorAll('.inst[data-inst]').forEach(card => {
      const ids = (D.card || {})[card.getAttribute('data-inst')] || [];
      const links = ids.map(id => {
        const hit = idx.get(id);
        return hit ? `<a href="#t-${id}">${esc(hit.t.zh)}</a>` : '';
      }).filter(Boolean).join('');
      if (!links) return;
      const p = document.createElement('p');
      p.className = 'inst-terms';
      p.innerHTML = `<i>术语</i>${links}`;
      card.appendChild(p);
    });
  }

  function init() {
    const g = document.getElementById('termGeneral');
    if (g) g.innerHTML = generalTable();

    const fam = document.getElementById('termFam');
    if (fam) fam.innerHTML = D.families.map(familyCard).join('');

    /* 卡片是乐器层画出来的，正常情况下此刻已经存在（两层的
       DOMContentLoaded 按脚本顺序触发）。取不到就等它一声——不要用定时器赌，
       赌输的结果是整页卡上都没有术语入口，而且完全不报错。 */
    if (document.querySelector('.inst[data-inst]')) attachCardTerms();
    else document.addEventListener('ic:ready', attachCardTerms);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* 测试钩子：run-tests 用它对账（条数、id 唯一、卡片引用是否有效） */
  window.__TC__ = {
    TERM_DATA: D, idx: idx, famName: famName,
    counts: {
      general: D.general.length,
      family: D.families.reduce((n, f) => n + f.terms.length, 0),
    },
  };
})();
