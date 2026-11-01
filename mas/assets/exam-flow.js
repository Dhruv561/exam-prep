/* Interactive exam flow map (reference/exam-flow.html). Content lives in exam-flow-data.js. */
(function () {
  'use strict';
  const F = window.FLOW;
  const MACROS = {
    '\\E': '\\mathrm{E}', '\\Var': '\\operatorname{Var}', '\\se': '\\operatorname{se}', '\\N': '\\mathrm{N}',
    '\\Ga': '\\mathrm{Gamma}', '\\IG': '\\mathrm{InvGamma}', '\\hb': '\\hat\\beta', '\\hphi': '\\hat\\phi',
    '\\hth': '\\hat\\theta', '\\hmu': '\\hat\\mu', '\\heta': '\\hat\\eta', '\\df': '\\mathrm{df}', '\\T': '^{\\mathsf T}',
  };
  const LESSONS = ['', '0001-mle-fisher-information', '0002-binomial-regression', '0003-deviance-lrt-aic', '0004-topic1-review',
    '0005-exponential-families', '0006-glm-likelihood-iwls', '0007-poisson-gamma-glms', '0008-glm-diagnostics', '0009-topic2-review',
    '0010-overdispersion', '0011-quasi-likelihood-theory', '0012-quasi-poisson-binomial-output', '0013-topic3-review',
    '0014-probability-toolkit', '0015-kernels-and-conjugacy', '0016-mixture-models-and-responsibilities', '0017-em-algorithm-q-function',
    '0018-m-step-derivations', '0019-em-exam-twists', '0020-reading-em-r-code', '0021-topic4-review', '0022-bayesian-inference',
    '0023-monte-carlo-rejection-sampling', '0024-metropolis-hastings', '0025-gibbs-sampling', '0026-mcmc-diagnostics',
    '0027-variational-inference-cavi', '0028-topic5-review', '0029-bivariate-normal-prior'];
  const NO_WORKED = new Set([14, 15]);
  const KIND = { start: 'You see', ask: 'Ask yourself', do: 'Do' };
  const CHIP = { start: 'You see', ask: 'Ask', do: 'Do' };
  const DRILL_SETS = [['all', 'All topics'], ['glm', 'MLE and GLMs'], ['over', 'Overdispersion, diagnostics'], ['em', 'Mixtures and EM'], ['bay', 'Bayes and computation']];
  const SET_OF = { mle: 'glm', ef: 'glm', glm: 'glm', test: 'glm', est: 'glm', over: 'over', diag: 'over', mix: 'em', em: 'em', bay: 'bay', mc: 'bay', out: 'bay', sim: 'bay', vi: 'bay' };

  /* Shallow, wide topics read left to right so they fit a laptop width at full size. */
  const SIDEWAYS = new Set(['tool', 'est']);

  const $ = id => document.getElementById(id);
  const chart = $('chart'), sizer = $('sizer'), world = $('world'), panel = $('panel'), trailEl = $('trail'), tabs = $('tabs');
  const node = id => nodeById.get(id);
  const reg = id => regById.get(id);
  const nodeById = new Map(F.nodes.map(n => [n.id, n]));
  const regById = new Map(F.regions.map(r => [r.id, r]));
  regById.set('map', { id: 'map', name: 'Overview', short: 'Overview', s: 'm' });
  const outOf = new Map(), intoOf = new Map(), relOf = new Map();
  const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v); };
  F.edges.forEach(e => { push(outOf, e.a, e); push(intoOf, e.b, e); });
  F.rels.forEach(x => { push(relOf, x.a, { to: x.b, why: x.why }); push(relOf, x.b, { to: x.a, why: x.why }); });
  const out = id => outOf.get(id) || [];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const st = { view: 'map', region: null, cur: null, trail: [], scale: 1, drill: null, w: 0, h: 0 };

  /* ---------- Text ---------- */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const tex = (s, d) => katex.renderToString(s, { displayMode: d, throwOnError: false, macros: MACROS, strict: false });
  const cache = new Map();
  function rich(s) {
    if (!s) return '';
    if (cache.has(s)) return cache.get(s);
    const re = /«([^»]*)»|\$\$([^$]+)\$\$|\$([^$]+)\$|\*\*([^*]+)\*\*/g;
    let html = '', i = 0, m;
    while ((m = re.exec(s))) {
      html += esc(s.slice(i, m.index));
      if (m[1] !== undefined) html += '<code>' + esc(m[1]) + '</code>';
      else if (m[2] !== undefined) html += tex(m[2], true);
      else if (m[3] !== undefined) html += tex(m[3], false);
      else html += '<b>' + rich(m[4]) + '</b>';
      i = re.lastIndex;
    }
    html += esc(s.slice(i));
    cache.set(s, html);
    return html;
  }
  const plain = s => (s || '').replace(/\\gg/g, ' >> ').replace(/[«»$\\{}^_*]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  /* ---------- Region chart ---------- */
  function nodeEl(n, ghost) {
    const r = reg(n.r);
    const el = document.createElement('button');
    el.className = `n k-${ghost ? 'do' : n.k} s-${r.s}${ghost ? ' ghost' : ''}`;
    el.dataset.id = n.id;
    const rels = (relOf.get(n.id) || []).length;
    el.innerHTML = `<span class="tag">${ghost ? '↗ ' + esc(r.short) : CHIP[n.k]}</span><span class="ti">${rich(n.title)}</span>`
      + (n.f && !ghost ? `<span class="fx">${rich(n.f)}</span>` : '')
      + (rels && !ghost ? `<span class="rb" title="${rels} link${rels > 1 ? 's' : ''} to other topics">⇄${rels}</span>` : '');
    return el;
  }
  function curve(pts) {
    let d = `M${pts[0].x},${pts[0].y}`;
    if (pts.length < 3) return d + `L${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1], last = i === pts.length - 2;
      d += `Q${p.x},${p.y} ${last ? q.x : (p.x + q.x) / 2},${last ? q.y : (p.y + q.y) / 2}`;
    }
    return d;
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  function lines() {
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('class', 'lines');
    s.innerHTML = `<defs>${[['ah', 'var(--edge)'], ['ahx', 'var(--accent)']].map(([id, c]) =>
      `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" style="fill:${c}"/></marker>`).join('')}</defs>`;
    return s;
  }
  function drawRegion(rid) {
    const ns = F.nodes.filter(n => n.r === rid);
    const inside = new Set(ns.map(n => n.id));
    const es = F.edges.filter(e => inside.has(e.a));
    const ghosts = [...new Set(es.map(e => e.b).filter(b => !inside.has(b)))];
    world.innerHTML = '';
    const svg = lines();
    world.appendChild(svg);
    const g = new dagre.graphlib.Graph();
    const wide = SIDEWAYS.has(rid);
    g.setGraph({ rankdir: wide ? 'LR' : 'TB', nodesep: wide ? 14 : 20, edgesep: 14, ranksep: wide ? 20 : 26, marginx: 22, marginy: 20 });
    g.setDefaultEdgeLabel(() => ({}));
    const els = new Map();
    ns.forEach(n => { const el = nodeEl(n, false); world.appendChild(el); els.set(n.id, el); });
    ghosts.forEach(id => { const el = nodeEl(node(id), true); world.appendChild(el); els.set(id, el); });
    els.forEach((el, id) => g.setNode(id, { width: el.offsetWidth, height: el.offsetHeight }));
    const labs = new Map();
    es.forEach(e => {
      const o = { minlen: 1 };
      if (e.label) {
        const l = document.createElement('div');
        l.className = 'el'; l.innerHTML = rich(e.label); world.appendChild(l); labs.set(e, l);
        o.width = l.offsetWidth + 6; o.height = l.offsetHeight + 4; o.labelpos = 'c';
      }
      g.setEdge(e.a, e.b, o);
    });
    dagre.layout(g);
    els.forEach((el, id) => { const p = g.node(id); el.style.left = p.x - p.width / 2 + 'px'; el.style.top = p.y - p.height / 2 + 'px'; });
    es.forEach(e => {
      const o = g.edge(e.a, e.b), p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', curve(o.points)); p.setAttribute('class', 'e'); p.setAttribute('marker-end', 'url(#ah)');
      p.dataset.a = e.a; p.dataset.b = e.b; svg.appendChild(p);
      const l = labs.get(e);
      if (l) { l.style.left = o.x - l.offsetWidth / 2 + 'px'; l.style.top = o.y - l.offsetHeight / 2 + 'px'; l.dataset.a = e.a; l.dataset.b = e.b; }
    });
    const gr = g.graph();
    setWorld(gr.width, gr.height, Math.min(1.08, Math.max(.78, (chart.clientWidth - 8) / gr.width)));
  }
  function setWorld(w, h, scale) {
    st.w = w; st.h = h; if (scale) st.scale = scale;
    world.style.width = w + 'px'; world.style.height = h + 'px';
    applyScale();
  }
  function applyScale() {
    world.style.transform = `scale(${st.scale})`;
    sizer.style.width = st.w * st.scale + 'px'; sizer.style.height = st.h * st.scale + 'px';
  }
  function paint() {
    const cur = st.cur, tr = st.trail, nextOf = new Set(out(cur).map(e => e.b));
    const walked = new Set(tr), steps = new Set();
    tr.forEach((id, i) => { if (i) steps.add(tr[i - 1] + '>' + id); });
    world.classList.toggle('focus', !!cur);
    world.querySelectorAll('.n').forEach(el => {
      const id = el.dataset.id;
      el.classList.toggle('sel', id === cur); el.classList.toggle('next', nextOf.has(id)); el.classList.toggle('walked', walked.has(id));
    });
    world.querySelectorAll('.e, .el').forEach(el => {
      const k = el.dataset.a + '>' + el.dataset.b, walk = steps.has(k), hot = el.dataset.a === cur;
      el.classList.toggle('walk', walk); el.classList.toggle('hot', hot && !walk);
      if (el.tagName === 'path') el.setAttribute('marker-end', walk || hot ? 'url(#ahx)' : 'url(#ah)');
    });
    [...tabs.children].forEach(b => b.classList.toggle('on', b.dataset.r === (st.view === 'map' ? '' : st.region)));
    drawTrail();
  }
  function focusNode(id) {
    const el = world.querySelector(`.n[data-id="${CSS.escape(id)}"]`);
    if (!el) return;
    const x = (el.offsetLeft + el.offsetWidth / 2) * st.scale, y = (el.offsetTop + el.offsetHeight / 2) * st.scale;
    chart.scrollTo({ left: x - chart.clientWidth / 2, top: y - chart.clientHeight * .36, behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- Overview ---------- */
  const PX = 224, PY = 190, TW = 150, TH = 104, MX = 14, MY = 66;
  function tileBox(r) { const x = MX + r.c * PX, y = MY + r.r * PY; return { x, y, cx: x + TW / 2, cy: y + TH / 2 }; }
  function clip(b, tx, ty) {
    const dx = tx - b.cx, dy = ty - b.cy, s = Math.min(dx ? (TW / 2 + 3) / Math.abs(dx) : 9e9, dy ? (TH / 2 + 3) / Math.abs(dy) : 9e9);
    return { x: b.cx + dx * s, y: b.cy + dy * s };
  }
  function drawMap() {
    world.innerHTML = '';
    const svg = lines();
    world.appendChild(svg);
    const W = MX * 2 + 4 * PX + TW, H = MY + 2 * PY + TH + 84;
    F.mapLinks.forEach(l => {
      const A = tileBox(reg(l.a)), B = tileBox(reg(l.b));
      const mx = (A.cx + B.cx) / 2, my = (A.cy + B.cy) / 2, dx = B.cx - A.cx, dy = B.cy - A.cy, len = Math.hypot(dx, dy) || 1;
      const b = l.bend || 0, cx = mx + (-dy / len) * b * 2, cy = my + (dx / len) * b * 2;
      const p = clip(A, b ? cx : B.cx, b ? cy : B.cy), q = clip(B, b ? cx : A.cx, b ? cy : A.cy);
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', b ? `M${p.x},${p.y}Q${cx},${cy} ${q.x},${q.y}` : `M${p.x},${p.y}L${q.x},${q.y}`);
      path.setAttribute('class', 'm'); path.setAttribute('marker-end', 'url(#ah)');
      if (l.both) path.setAttribute('marker-start', 'url(#ah)');
      path.dataset.a = l.a; path.dataset.b = l.b; svg.appendChild(path);
      const lab = document.createElement('div');
      lab.className = 'ml'; lab.innerHTML = rich(l.t); lab.dataset.a = l.a; lab.dataset.b = l.b; world.appendChild(lab);
      const lx = b ? (p.x + 2 * cx + q.x) / 4 : (p.x + q.x) / 2, ly = b ? (p.y + 2 * cy + q.y) / 4 : (p.y + q.y) / 2;
      lab.style.left = lx - lab.offsetWidth / 2 + 'px'; lab.style.top = ly - lab.offsetHeight / 2 + 'px';
    });
    F.regions.forEach(r => {
      const b = tileBox(r), t = document.createElement('button');
      t.className = `tile s-${r.s}`; t.dataset.r = r.id; t.style.left = b.x + 'px'; t.style.top = b.y + 'px';
      t.innerHTML = `<h3>${esc(r.name)}</h3><p>${rich(r.blurb)}</p><small>${esc(r.marks)}</small>`;
      t.onclick = () => openRegion(r.id);
      t.onmouseenter = () => hoverTile(r.id);
      t.onmouseleave = () => hoverTile(null);
      world.appendChild(t);
    });
    setWorld(W, H, Math.min(1.25, Math.max(.6, Math.min((chart.clientWidth - 12) / W, (chart.clientHeight - 8) / H))));
    chart.scrollTo(0, 0);
  }
  function hoverTile(id) {
    world.classList.toggle('hov', !!id);
    world.querySelectorAll('.m, .ml').forEach(el => {
      const on = el.dataset.a === id || el.dataset.b === id;
      el.classList.toggle('lit', on);
      if (on) {
        world.querySelector(`.tile[data-r="${el.dataset.a}"]`).classList.add('lit');
        world.querySelector(`.tile[data-r="${el.dataset.b}"]`).classList.add('lit');
      }
    });
    if (!id) world.querySelectorAll('.tile').forEach(t => t.classList.remove('lit'));
    else world.querySelector(`.tile[data-r="${id}"]`).classList.add('lit');
  }

  /* ---------- Navigation ---------- */
  function showMap(keepDrill) {
    if (!keepDrill) st.drill = null;
    st.view = 'map'; st.region = null; st.cur = null; if (!keepDrill) st.trail = [];
    drawMap(); paint(); legend();
    if (!st.drill) { panelMap(); hash('map'); }
  }
  function ensureRegion(rid) {
    if (st.view === 'chart' && st.region === rid) return;
    st.view = 'chart'; st.region = rid; drawRegion(rid); legend();
    chart.scrollTo(0, 0);
  }
  function openRegion(rid) { go(reg(rid).entry, 'fresh'); }
  /* mode: 'step' extends the chain, 'fresh' starts a new one, 'auto' works it out from the click. */
  function go(id, mode) {
    if (id === 'stem') return showMap();
    const n = node(id), t = st.trail, i = t.indexOf(id);
    if (mode === 'auto') mode = out(st.cur).some(e => e.b === id) ? 'step' : i >= 0 ? 'cut' : 'fresh';
    if (mode === 'step') { if (t[t.length - 1] !== id) t.push(id); }
    else if (mode === 'cut') t.length = i + 1;
    else if (mode !== 'keep') st.trail = [id];
    st.cur = id;
    ensureRegion(n.r);
    paint(); focusNode(id);
    if (!st.drill) { panelNode(id); hash(id); }
  }
  function back() {
    if (st.trail.length > 1) go(st.trail[st.trail.length - 2], 'cut');
    else showMap();
  }
  function hash(h) { try { history.replaceState(null, '', '#' + h); } catch (e) { /* file:// */ } }
  function drawTrail() {
    const t = st.trail;
    if (!t.length) { trailEl.innerHTML = '<span>Pick a topic, then follow the branches. The chain you take shows up here.</span>'; return; }
    trailEl.innerHTML = t.map((id, i) => `${i ? '<span class="ar">→</span>' : ''}<button class="cr${id === st.cur ? ' now' : ''}" data-i="${i}">${rich(node(id).title)}</button>`).join('');
    trailEl.scrollLeft = trailEl.scrollWidth;
  }
  function legend() {
    $('legend').innerHTML = st.view === 'map'
      ? '<span>Hover a topic to trace its links. Click to open it.</span>'
      : '<span><i class="a"></i>You see</span><span><i class="b"></i>Ask</span><span><i class="c"></i>Do</span><span><i class="d"></i>Jump to another topic</span><span>⇄ linked idea in panel</span>';
  }

  /* ---------- Panel ---------- */
  function section(title, html) { return html ? `<h4>${title}</h4>${html}` : ''; }
  function list(a) { return a && a.length ? '<ul>' + a.map(x => `<li>${rich(x)}</li>`).join('') + '</ul>' : ''; }
  function steps(a) { return a && a.length ? '<ol class="st">' + a.map(x => `<li>${rich(x)}</li>`).join('') + '</ol>' : ''; }
  function table(t) {
    if (!t) return '';
    return `<table><thead><tr>${t.h.map(c => `<th>${rich(c)}</th>`).join('')}</tr></thead><tbody>${t.r.map(r => `<tr>${r.map(c => `<td>${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function lessonLinks(n) {
    const r = reg(n.r), parts = (n.L || []).map(l => {
      const f = LESSONS[l], w = NO_WORKED.has(l) ? '' : ` <a href="../worked/${f.slice(0, 4)}-challenge-full-solution.html" target="_blank" rel="noopener">worked</a>`;
      return `<span style="white-space:nowrap"><a href="../lessons/${f}.html" target="_blank" rel="noopener">Lesson ${l}</a>${w}</span>`;
    });
    if (r.sheet) parts.push(`<a href="${r.sheet}" target="_blank" rel="noopener">Topic sheet</a>`);
    return parts.length ? `<div class="lk" style="margin-top:.9rem">${parts.join(' ')}</div>` : '';
  }
  function branchBtn(e, i, showTo) {
    const n = node(e.b), r = reg(n.r), jump = n.r !== node(e.a).r;
    const main = e.label ? rich(e.label) : rich(n.title);
    const to = showTo && e.label ? `<span class="to">→ ${rich(n.title)}${jump ? ' · ' + esc(r.short) : ''}</span>` : (jump && showTo ? `<span class="to">${esc(r.short)}</span>` : '');
    return `<button class="br" data-go="${e.b}"><kbd>${i + 1}</kbd><span>${main}${to}</span></button>`;
  }
  function panelNode(id) {
    const n = node(id), r = reg(n.r), rels = relOf.get(id) || [], inc = (intoOf.get(id) || []).filter(e => e.a !== 'stem');
    const showF = n.f && !(n.do || []).includes(n.f);
    panel.className = 's-' + r.s;
    panel.innerHTML = `<div class="kn">${esc(r.name)} · ${KIND[n.k]}</div><h2>${rich(n.title)}</h2>`
      + (n.goal ? `<p class="goal">${rich(n.goal)}</p>` : '')
      + (showF ? `<div style="margin-top:.5rem">${rich(n.f)}</div>` : '')
      + section('Triggers', list(n.see))
      + section('Do', steps(n.do))
      + table(n.tbl)
      + (n.trap ? `<div class="trap"><b>Trap</b>${n.trap.map(t => `<p>${rich(t)}</p>`).join('')}</div>` : '')
      + (n.say ? `<div class="say"><b>Write</b>${rich(n.say)}</div>` : '')
      + section(out(id).length > 1 ? 'Next: which is it?' : 'Next', out(id).map((e, i) => branchBtn(e, i, true)).join(''))
      + section('Linked ideas', rels.map(x => `<button class="lnk" data-go="${x.to}"><b>${rich(node(x.to).title)}</b> · ${esc(reg(node(x.to).r).short)}<br>${rich(x.why)}</button>`).join(''))
      + section('Arrive here from', inc.map(e => `<button class="lnk" data-go="${e.a}"><b>${rich(node(e.a).title)}</b>${e.label ? ': ' + rich(e.label) : ''}</button>`).join(''))
      + lessonLinks(n);
    panel.scrollTop = 0;
  }
  function panelMap() {
    panel.className = 's-m';
    panel.innerHTML = `<div class="kn">First thought, every question</div><h2>Read the stem. What am I handed?</h2>`
      + `<p class="goal">Match it to a trigger, then follow the branches. Each arrow in a topic is a condition: if you see this, go there.</p>`
      + out('stem').map((e, i) => {
        const r = reg(node(e.b).r);
        return `<button class="br s-${r.s}" data-go="${e.b}"><span style="flex:none;width:.5rem;height:.5rem;margin-top:.25rem;border-radius:50%;background:var(--c)"></span><span>${rich(e.label)}<span class="to">${esc(r.name)}</span></span></button>`;
      }).join('')
      + `<div class="keys">Keys: <b>1–9</b> take a branch · <b>⌫</b> back · <b>/</b> search · <b>d</b> drill · <b>esc</b> overview. In a topic, drag to pan and ⌘-scroll to zoom. <b>Drill</b> gives you a scenario and makes you pick each branch.</div>`;
    panel.scrollTop = 0;
  }

  /* ---------- Drill ---------- */
  function drillStart() {
    const set = st.drill ? st.drill.set : 'all';
    const pool = shuffle(F.drills.filter(d => set === 'all' || SET_OF[node(d.path[1]).r] === set));
    st.drill = { set, pool, i: 0, clean: 0, done: 0 };
    $('drill').classList.add('on');
    drillScenario();
  }
  function drillStop(toId) {
    st.drill = null; $('drill').classList.remove('on');
    if (toId) { st.trail = st.trail.slice(); panelNode(toId); hash(toId); }
    else showMap();
  }
  function drillScenario() {
    const d = st.drill, s = d.pool[d.i];
    Object.assign(d, { pos: 0, miss: 0, opts: null, tried: new Set(), phase: 'run', msg: '' });
    st.trail = []; st.cur = null;
    showMap(true);
    drillSettle(s);
  }
  /* Skip nodes with one way out: only forks test anything. */
  function drillSettle(s) {
    const d = st.drill;
    while (d.pos < s.path.length - 1 && out(s.path[d.pos]).length <= 1) d.pos++;
    const id = s.path[d.pos];
    st.trail = s.path.slice(1, d.pos + 1);
    if (id !== 'stem') { st.cur = id; ensureRegion(node(id).r); paint(); focusNode(id); }
    else paint();
    if (d.pos === s.path.length - 1) { d.phase = 'done'; d.done++; if (!d.miss) d.clean++; }
    d.opts = null; d.tried = new Set();
    drillPanel();
  }
  function drillPick(b) {
    const d = st.drill, s = d.pool[d.i], next = s.path[d.pos + 1];
    if (d.phase !== 'run' || d.tried.has(b)) return;
    if (b === next) { d.msg = ''; d.pos++; drillSettle(s); return; }
    d.tried.add(b); d.miss++;
    const t = node(b);
    d.msg = `Not here. That branch is for: ${t.goal || t.title}`;
    drillPanel();
  }
  function drillPanel() {
    const d = st.drill, s = d.pool[d.i], id = s.path[d.pos];
    panel.className = 's-m';
    const head = `<div class="kn">Drill · ${d.i + 1} of ${d.pool.length} · ${d.clean}/${d.done} clean</div>`
      + `<div class="row" style="margin-top:.25rem"><select id="dset" aria-label="Topic filter">${DRILL_SETS.map(([v, t]) => `<option value="${v}"${v === d.set ? ' selected' : ''}>${t}</option>`).join('')}</select></div>`
      + `<p class="scn">${rich(s.t)}</p>`;
    if (d.phase === 'done') {
      panel.innerHTML = head
        + `<h4>The chain${d.miss ? ` · ${d.miss} wrong turn${d.miss > 1 ? 's' : ''}` : ' · clean'}</h4>`
        + steps(s.path.slice(1).map(p => node(p).title))
        + `<div class="say"><b>Then write</b>${rich(s.ans)}</div>`
        + `<div class="row"><button class="btn on" id="dnext">Next scenario</button><button class="btn" id="dopen">Open this node</button><button class="btn" id="dexit">Exit</button></div>`;
      return;
    }
    if (!d.opts) d.opts = shuffle(out(id));
    panel.innerHTML = head
      + `<h4>${id === 'stem' ? 'What are you handed?' : 'At: ' + rich(node(id).title)}</h4>`
      + d.opts.map((e, i) => {
        const bad = d.tried.has(e.b);
        return `<button class="br${bad ? ' wrong' : ''}" data-pick="${e.b}"${bad ? ' disabled' : ''}><kbd>${i + 1}</kbd><span>${e.label ? rich(e.label) : rich(node(e.b).title)}</span></button>`;
      }).join('')
      + `<div class="fb">${d.msg ? rich(d.msg) : ''}</div>`
      + `<div class="row"><button class="btn" id="dshow">Show me</button><button class="btn" id="dskip">Skip</button><button class="btn" id="dexit">Exit</button></div>`;
    panel.scrollTop = 0;
  }
  function drillNext() {
    const d = st.drill;
    if (++d.i >= d.pool.length) { d.i = 0; d.pool = shuffle(d.pool); }
    drillScenario();
  }

  /* ---------- Search ---------- */
  const index = F.nodes.filter(n => n.id !== 'stem').map(n => ({
    id: n.id, text: plain([n.title, n.f, n.goal, ...(n.see || []), ...(n.do || []), ...(n.trap || []), n.say, reg(n.r).name].join(' ')), title: plain(n.title),
  }));
  let hits = [], hitAt = 0;
  function search(q) {
    const box = $('results'), toks = plain(q).split(' ').filter(Boolean);
    if (!toks.length) { box.classList.remove('open'); return; }
    hits = index.filter(x => toks.every(t => x.text.includes(t)))
      .sort((a, b) => (toks.every(t => b.title.includes(t)) - toks.every(t => a.title.includes(t))))
      .slice(0, 12);
    hitAt = 0;
    box.innerHTML = hits.length
      ? hits.map((h, i) => { const n = node(h.id); return `<button data-go="${h.id}" class="${i ? '' : 'on'}">${rich(n.title)}<small>${esc(reg(n.r).name)}${n.goal ? ' · ' + rich(n.goal) : ''}</small></button>`; }).join('')
      : '<div class="none">Nothing matches.</div>';
    box.classList.add('open');
  }
  function closeSearch() { $('results').classList.remove('open'); $('q').value = ''; $('q').blur(); }

  /* ---------- Events ---------- */
  F.regions.forEach(r => {
    const b = document.createElement('button');
    b.textContent = r.short; b.dataset.r = r.id; b.className = 's-' + r.s;
    b.onclick = () => { if (st.drill) drillStop(); openRegion(r.id); };
    tabs.appendChild(b);
  });
  $('home').onclick = () => { showMap(); $('drill').classList.remove('on'); };
  $('drill').onclick = () => { if (st.drill) drillStop(); else drillStart(); };
  world.addEventListener('click', ev => {
    const el = ev.target.closest('.n');
    if (el && !st.drill) go(el.dataset.id, 'auto');
  });
  panel.addEventListener('click', ev => {
    const pick = ev.target.closest('[data-pick]');
    if (pick) return drillPick(pick.dataset.pick);
    const g = ev.target.closest('[data-go]');
    if (g) return go(g.dataset.go, g.classList.contains('br') && st.cur ? 'step' : g.classList.contains('br') ? 'fresh' : 'auto');
    const id = ev.target.id;
    if (id === 'dnext') drillNext();
    else if (id === 'dexit') drillStop();
    else if (id === 'dskip') drillNext();
    else if (id === 'dopen') { const s = st.drill.pool[st.drill.i]; drillStop(s.path[s.path.length - 1]); }
    else if (id === 'dshow') { const d = st.drill, s = d.pool[d.i]; d.miss++; drillPick(s.path[d.pos + 1]); }
  });
  panel.addEventListener('change', ev => {
    if (ev.target.id === 'dset') { st.drill.set = ev.target.value; drillStart(); }
  });
  trailEl.addEventListener('click', ev => {
    const c = ev.target.closest('.cr');
    if (c && !st.drill) go(st.trail[+c.dataset.i], 'cut');
  });
  $('q').addEventListener('input', e => search(e.target.value));
  $('q').addEventListener('keydown', e => {
    const btns = [...$('results').querySelectorAll('button')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!btns.length) return;
      hitAt = (hitAt + (e.key === 'ArrowDown' ? 1 : btns.length - 1)) % btns.length;
      btns.forEach((b, i) => b.classList.toggle('on', i === hitAt)); btns[hitAt].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && hits[hitAt]) { const id = hits[hitAt].id; closeSearch(); if (st.drill) drillStop(); go(id, 'fresh'); }
    else if (e.key === 'Escape') closeSearch();
  });
  $('results').addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) { const id = b.dataset.go; closeSearch(); if (st.drill) drillStop(); go(id, 'fresh'); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.sb')) $('results').classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); $('q').focus(); return; }
    if (e.key === 'Escape') { if (st.drill) drillStop(); else showMap(); return; }
    if (e.key === 'd') { $('drill').click(); return; }
    if (e.key === 'Backspace') { e.preventDefault(); if (!st.drill) back(); return; }
    if (st.drill && st.drill.phase === 'done' && e.key === 'Enter') { drillNext(); return; }
    if (/^[1-9]$/.test(e.key)) {
      const b = panel.querySelectorAll('.br[data-go], .br[data-pick]')[+e.key - 1];
      if (b && !b.disabled) b.click();
    }
  });

  /* Zoom and pan */
  function zoomTo(s) { const cx = chart.scrollLeft + chart.clientWidth / 2, cy = chart.scrollTop + chart.clientHeight / 2, k = s / st.scale; st.scale = s; applyScale(); chart.scrollTo(cx * k - chart.clientWidth / 2, cy * k - chart.clientHeight / 2); }
  const clampZ = s => Math.min(1.6, Math.max(.4, s));
  $('zi').onclick = () => zoomTo(clampZ(st.scale * 1.15));
  $('zo').onclick = () => zoomTo(clampZ(st.scale / 1.15));
  $('zf').onclick = () => zoomTo(clampZ(Math.min(1.25, Math.min((chart.clientWidth - 8) / st.w, st.view === 'map' ? (chart.clientHeight - 8) / st.h : 9))));
  chart.addEventListener('wheel', e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomTo(clampZ(st.scale * (1 - e.deltaY * .003))); } }, { passive: false });
  let pan = null;
  chart.addEventListener('pointerdown', e => { if (e.target.closest('.n, .tile') || e.button) return; pan = { x: e.clientX, y: e.clientY, l: chart.scrollLeft, t: chart.scrollTop }; chart.classList.add('drag'); });
  addEventListener('pointermove', e => { if (pan) chart.scrollTo(pan.l - (e.clientX - pan.x), pan.t - (e.clientY - pan.y)); });
  addEventListener('pointerup', () => { pan = null; chart.classList.remove('drag'); });
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(redraw, 160); });
  function redraw() {
    if (st.view === 'map') drawMap(); else drawRegion(st.region);
    paint();
  }

  /* Start. KaTeX fonts change node sizes, so lay out again once they arrive. */
  function start() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === 'drill') { showMap(); drillStart(); }
    else if (nodeById.has(h) && h !== 'stem') go(h, 'fresh');
    else showMap();
  }
  start();
  document.fonts.ready.then(() => { redraw(); if (st.cur) focusNode(st.cur); });
})();
