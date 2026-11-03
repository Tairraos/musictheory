/* ==========================================================================
 * 《姐弟厨师团》 · 互动课渲染层（js/game-render.js）
 * --------------------------------------------------------------------------
 * 把结构化配置渲染成手机优先的 DOM。这里只做网页适配：
 * 配置与判题逻辑在 game-data.js / game-core.js，未来小程序不加载本文件。
 * ========================================================================== */

function el(tag, className, text){
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

function renderGameBlock(block){
  if (block.type === 'text') return el('p', 'game-text', block.text);
  if (block.type === 'tip'){
    const d = el('div', 'game-tip');
    d.append(el('b', '', '提示'), el('span', '', block.text));
    return d;
  }
  if (block.type === 'heading') return el(block.level === 3 ? 'h3' : 'h4', 'game-heading', block.text);

  if (block.type === 'list'){
    const list = el(block.ordered ? 'ol' : 'ul', 'game-list');
    block.items.forEach(item => list.append(el('li', '', item)));
    return list;
  }

  if (block.type === 'table'){
    const wrap = el('div', 'table-scroll');
    const table = el('table', 'game-table');
    if (block.headers.length){
      const thead = el('thead');
      const tr = el('tr');
      block.headers.forEach(h => tr.append(el('th', '', h)));
      thead.append(tr);
      table.append(thead);
    }
    const tbody = el('tbody');
    block.rows.forEach((row, ri) => {
      const tr = el('tr');
      row.forEach(cell => tr.append(el('td', '', cell)));
      /* "点一行听一下"：生成器把行音频回填到 rowsAudio，行本身可点（与教程一致） */
      const pa = block.rowsAudio && block.rowsAudio[ri];
      if (pa && pa.evs && pa.evs.length){
        tr.classList.add('play-row');
        tr.addEventListener('click', () => playGameEvs(pa.evs));
      }
      tbody.append(tr);
    });
    table.append(tbody);
    wrap.append(table);
    return wrap;
  }

  if (block.type === 'svg'){
    /* 教程装配好的自包含示意图（阶梯图/对比图/网格图），整块插入。
     * 大图在窄屏横向滑动查看；播放时方块跟随发声点亮（见 flashKey）。 */
    const w = el('div', 'svg-wrap');
    w.innerHTML = block.svg;
    return w;
  }

  if (block.type === 'strip'){
    /* 和弦进行条 / 终止式条（chords）与拍点强弱条（圆点） */
    const w = el('div', 'strip-wrap' + (block.chords ? ' chords' : ''));
    block.items.forEach(it => {
      const c = el('div', 'strip-cell' + (it.strong ? ' strong' : ''));
      if (block.chords){
        if (it.sub) c.append(el('span', 's', it.sub));
        c.append(el('b', '', it.main));
        if (it.t) c.append(el('i', 'q ' + (it.q || ''), it.t));
      } else {
        c.append(el('b', '', it.main || '·'));
      }
      w.append(c);
    });
    return w;
  }

  if (block.type === 'lyr'){
    /* 字块时间轴（重音对位/拖腔/气口/中英计时/粤语/合奏旋律），
     * 字块按百分比定位，与教程同款视觉 */
    const w = el('div', 'lyr-wrap');
    block.rows.forEach(r => {
      const row = el('div', 'lyr-row');
      row.append(el('span', 'lyr-lab', r.lab));
      const tl = el('div', 'lyr-tl');
      (r.boxes || []).forEach(b => {
        const d = el('div', 'lyr-b' + (b.cls ? ' ' + b.cls : ''), b.ch || '');
        d.style.left = b.at + '%';
        d.style.width = b.w + '%';
        tl.append(d);
      });
      row.append(tl);
      w.append(row);
    });
    if (block.note) w.append(el('p', 'lyr-note', block.note));
    return w;
  }

  if (block.type === 'audio'){
    const b = el('button', 'audio-card', '▶ ' + block.label);
    b.type = 'button';
    b.addEventListener('click', () => {
      /* hitStrip：该演示联动页内第几个条块（拍点圆点/和弦格子跟着播放点亮） */
      const strip = block.hitStrip != null
        ? document.querySelectorAll('#pageBlocks .strip-wrap')[block.hitStrip]
        : null;
      playGameEvs(block.evs, strip);
    });
    return b;
  }

  return el('p', 'game-text', '');
}

function renderGameTask(task, onResult){
  const box = el('section', 'task-card');
  box.append(el('h2', '', task.prompt || task.label || '完成这个操作'));

  if (task.type === 'choice'){
    const list = el('div', 'choice-list');
    task.options.forEach((label, i) => {
      const b = el('button', 'choice-option', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        const result = evaluateTask(task, i);
        list.querySelectorAll('button').forEach(x => x.classList.remove('ok', 'bad'));
        b.classList.add(result.ok ? 'ok' : 'bad');
        onResult(result);
      });
      list.append(b);
    });
    box.append(list);
  }

  if (task.type === 'number'){
    const row = el('div', 'answer-row');
    const input = el('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    if (task.min != null) input.min = task.min;
    if (task.max != null) input.max = task.max;
    input.placeholder = '输入数字';
    const btn = el('button', 'primary-action', '检查答案');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      const result = evaluateTask(task, input.value);
      input.classList.toggle('ok', result.ok);
      input.classList.toggle('bad', !result.ok);
      onResult(result);
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    row.append(input, btn);
    box.append(row);
  }

  if (task.type === 'sequence'){
    const picked = [];
    const status = el('div', 'sequence-status', '尚未选择');
    const list = el('div', 'choice-list');
    const reset = el('button', 'ghost-action', '重排');
    reset.type = 'button';
    task.items.forEach((label, i) => {
      const b = el('button', 'choice-option', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        if (picked.includes(i)) return;
        picked.push(i);
        b.classList.add('picked');
        b.disabled = true;
        status.textContent = picked.map(n => task.items[n]).join(' → ');
        if (picked.length === task.items.length){
          const result = evaluateTask(task, picked);
          list.querySelectorAll('button').forEach((x, n) => x.classList.add(task.answer.includes(n) && result.ok ? 'ok' : 'bad'));
          onResult(result);
        }
      });
      list.append(b);
    });
    reset.addEventListener('click', () => {
      picked.length = 0;
      status.textContent = '尚未选择';
      list.querySelectorAll('button').forEach(b => { b.disabled = false; b.classList.remove('picked', 'ok', 'bad'); });
    });
    box.append(status, list, reset);
  }

  if (task.type === 'scan'){
    const area = el('textarea', 'scan-input');
    area.value = task.text;
    area.rows = 4;
    const btn = el('button', 'primary-action', '扫描这段词');
    btn.type = 'button';
    const out = el('div', 'scan-result', '还没扫描');
    btn.addEventListener('click', () => {
      const result = evaluateTask(task, area.value);
      out.textContent = result.message;
      out.classList.add(result.hits && result.hits.length ? 'warn' : 'ok');
      onResult(result);
    });
    box.append(area, btn, out);
  }

  /* action 类任务（纯阅读页）不再渲染任何按钮或提示：
   * 停留满 40 秒由 game-app.js 自动记为已完成，避免多余的按钮和心智负担。 */

  return box;
}

Object.assign(window, { renderGameBlock, renderGameTask });
