// Reusable phase-portrait widget for 2x2 linear systems  y' = A y,  A = [[a, b], [c, d]].
//
// Markup:
//   <div class="phase" data-a="-2" data-b="1" data-c="1" data-d="-2"
//        data-controls="true" data-hide-info="false"></div>
//
// Draws: normalised direction field, real-eigenvector lines (straight-line orbits),
// nullclines (x'=0 dashed vertical-tangent line, y'=0 dotted horizontal-tangent line),
// and trajectories with arrows. Click the plot to add an orbit through that point.
// data-controls adds sliders for a, b, c, d. data-hide-info hides the classification
// readout (useful when the classification is the quiz answer).

(function () {
  const L = 3; // plot window is [-L, L]^2
  const EPS = 1e-9;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function fmt(x) {
    const r = Math.round(x * 100) / 100;
    return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−');
  }

  function analyse(a, b, c, d) {
    const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
    const out = { tr, det, disc, real: [], text: '', stab: '' };
    if (disc >= -EPS) {
      const s = Math.sqrt(Math.max(disc, 0));
      out.lams = [(tr + s) / 2, (tr - s) / 2];
      out.lamText = Math.abs(s) < EPS ? `λ = ${fmt(tr / 2)} (repeated)` : `λ = ${fmt(out.lams[0])}, ${fmt(out.lams[1])}`;
      const vecs = [];
      out.lams.forEach((lam) => {
        let v;
        if (Math.abs(b) > EPS) v = [b, lam - a];
        else if (Math.abs(c) > EPS) v = [lam - d, c];
        else v = null; // diagonal: axes
        if (v) vecs.push({ v, lam });
      });
      if (Math.abs(b) < EPS && Math.abs(c) < EPS) { vecs.push({ v: [1, 0], lam: a }, { v: [0, 1], lam: d }); }
      out.real = vecs;
    } else {
      const im = Math.sqrt(-disc) / 2;
      out.lamText = `λ = ${fmt(tr / 2)} ± ${fmt(im)}i`;
    }
    if (Math.abs(det) < EPS) { out.text = 'Degenerate: a zero eigenvalue (a whole line of critical points)'; out.stab = ''; }
    else if (det < 0) { out.text = 'Saddle'; out.stab = 'unstable'; }
    else if (disc > EPS) { out.text = 'Node'; out.stab = tr < 0 ? 'asymptotically stable' : 'unstable'; }
    else if (disc >= -EPS) { out.text = 'Degenerate (repeated-eigenvalue) node'; out.stab = tr < 0 ? 'asymptotically stable' : 'unstable'; }
    else if (Math.abs(tr) < EPS) { out.text = 'Centre'; out.stab = 'stable, not asymptotically'; }
    else { out.text = 'Spiral'; out.stab = tr < 0 ? 'asymptotically stable' : 'unstable'; }
    if (disc < -EPS) out.text += c > 0 ? ' (anticlockwise)' : ' (clockwise)';
    return out;
  }

  function setup(el) {
    const p = { a: +el.dataset.a, b: +el.dataset.b, c: +el.dataset.c, d: +el.dataset.d };
    const extra = []; // user-clicked seeds
    el.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Phase portrait');
    el.appendChild(canvas);
    const info = document.createElement('div');
    info.className = 'phase-info';
    if (el.dataset.hideInfo !== 'true') el.appendChild(info);

    if (el.dataset.controls === 'true') {
      const ctr = document.createElement('div');
      ctr.className = 'phase-controls';
      ['a', 'b', 'c', 'd'].forEach((k) => {
        const lab = document.createElement('label');
        const span = document.createElement('span');
        const inp = document.createElement('input');
        inp.type = 'range'; inp.min = -4; inp.max = 4; inp.step = 0.5; inp.value = p[k];
        span.textContent = `${k} = ${fmt(p[k])}`;
        inp.addEventListener('input', () => { p[k] = +inp.value; span.textContent = `${k} = ${fmt(p[k])}`; extra.length = 0; draw(); });
        lab.append(span, inp);
        ctr.appendChild(lab);
      });
      el.appendChild(ctr);
    }

    canvas.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 * L - L;
      const y = L - ((e.clientY - r.top) / r.height) * 2 * L;
      extra.push([x, y]);
      draw();
    });

    function draw() {
      const size = Math.min(el.clientWidth || 400, 440);
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      canvas.width = size * dpr; canvas.height = size * dpr;
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fg = cssVar('--fg', '#222'), muted = cssVar('--muted', '#888'), rule = cssVar('--rule', '#ddd');
      const acc = cssVar('--accent', '#a33'), ok = cssVar('--ok', '#285');
      const X = (x) => ((x + L) / (2 * L)) * size, Y = (y) => ((L - y) / (2 * L)) * size;
      const { a, b, c, d } = p;
      const F = (x, y) => [a * x + b * y, c * x + d * y];

      g.clearRect(0, 0, size, size);
      // axes
      g.strokeStyle = rule; g.lineWidth = 1;
      g.beginPath(); g.moveTo(X(-L), Y(0)); g.lineTo(X(L), Y(0)); g.moveTo(X(0), Y(-L)); g.lineTo(X(0), Y(L)); g.stroke();
      g.fillStyle = muted; g.font = '12px Inter, system-ui, sans-serif';
      g.fillText('x', X(L) - 12, Y(0) - 6); g.fillText('y', X(0) + 6, Y(L) + 14);

      // direction field
      g.strokeStyle = rule; g.lineWidth = 1;
      const n = 15, h = (2 * L) / n;
      for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
        const x = -L + i * h, y = -L + j * h;
        const [u, v] = F(x, y); const m = Math.hypot(u, v); if (m < EPS) continue;
        const s = 0.32 * h;
        const x2 = x + (u / m) * s, y2 = y + (v / m) * s;
        g.beginPath(); g.moveTo(X(x), Y(y)); g.lineTo(X(x2), Y(y2)); g.stroke();
        g.beginPath(); g.arc(X(x2), Y(y2), 1.3, 0, 2 * Math.PI); g.fillStyle = rule; g.fill();
      }

      const an = analyse(a, b, c, d);

      // nullclines: x' = 0 -> a x + b y = 0 ; y' = 0 -> c x + d y = 0
      function line(p1, p2, dash, col) {
        g.save(); g.setLineDash(dash); g.strokeStyle = col; g.lineWidth = 1.2;
        // line through origin with normal (p1, p2)
        if (Math.abs(p1) < EPS && Math.abs(p2) < EPS) { g.restore(); return; }
        const dir = [-p2, p1]; const m = Math.hypot(...dir); const k = 2 * L / m;
        g.beginPath(); g.moveTo(X(-dir[0] * k), Y(-dir[1] * k)); g.lineTo(X(dir[0] * k), Y(dir[1] * k)); g.stroke(); g.restore();
      }
      line(a, b, [6, 4], muted);
      line(c, d, [2, 3], muted);

      // eigenvector lines
      an.real.forEach(({ v }) => {
        const m = Math.hypot(...v); const k = 2 * L / m;
        g.strokeStyle = acc; g.lineWidth = 2;
        g.beginPath(); g.moveTo(X(-v[0] * k), Y(-v[1] * k)); g.lineTo(X(v[0] * k), Y(v[1] * k)); g.stroke();
      });

      // trajectories (RK4, step sized by arc length)
      function integrate(x0, y0, sign) {
        const pts = [[x0, y0]]; let x = x0, y = y0, len = 0;
        for (let k = 0; k < 4000; k++) {
          const [u, v] = F(x, y); const sp = Math.hypot(u, v);
          if (sp < 1e-6) break;
          const dt = sign * Math.min(0.02 / sp, 0.05);
          const k1 = F(x, y), k2 = F(x + dt / 2 * k1[0], y + dt / 2 * k1[1]);
          const k3 = F(x + dt / 2 * k2[0], y + dt / 2 * k2[1]), k4 = F(x + dt * k3[0], y + dt * k3[1]);
          const nx = x + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
          const ny = y + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
          len += Math.hypot(nx - x, ny - y); x = nx; y = ny; pts.push([x, y]);
          if (Math.abs(x) > 1.4 * L || Math.abs(y) > 1.4 * L || len > 60 || Math.hypot(x, y) < 0.01) break;
        }
        return pts;
      }
      function drawOrbit(x0, y0, col, width) {
        const fwd = integrate(x0, y0, 1), bwd = integrate(x0, y0, -1).reverse();
        const pts = bwd.concat(fwd.slice(1));
        g.strokeStyle = col; g.lineWidth = width; g.beginPath();
        pts.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))));
        g.stroke();
        // arrow at the seed, pointing forward in time
        const [u, v] = F(x0, y0); const m = Math.hypot(u, v); if (m < EPS) return;
        const ang = Math.atan2(-v, u), px = X(x0), py = Y(y0), s = 7;
        g.fillStyle = col; g.beginPath();
        g.moveTo(px + s * Math.cos(ang), py + s * Math.sin(ang));
        g.lineTo(px + s * Math.cos(ang + 2.5), py + s * Math.sin(ang + 2.5));
        g.lineTo(px + s * Math.cos(ang - 2.5), py + s * Math.sin(ang - 2.5));
        g.closePath(); g.fill();
      }
      const seeds = [];
      for (let k = 0; k < 12; k++) { const th = (2 * Math.PI * (k + 0.5)) / 12; seeds.push([2.2 * Math.cos(th), 2.2 * Math.sin(th)]); }
      if (an.disc < -EPS) { // spirals and centres: seed along the positive x-axis so nested orbits show
        seeds.length = 0; [0.5, 1, 1.5, 2, 2.5].forEach((r) => seeds.push([r, 0]));
      }
      seeds.forEach(([x, y]) => drawOrbit(x, y, fg, 1.1));
      // straight-line orbits get arrows too
      an.real.forEach(({ v }) => { const m = Math.hypot(...v); [1.6, -1.6].forEach((s) => drawOrbit((v[0] / m) * s, (v[1] / m) * s, acc, 2)); });
      extra.forEach(([x, y]) => drawOrbit(x, y, ok, 2));
      // critical point
      g.fillStyle = fg; g.beginPath(); g.arc(X(0), Y(0), 3.5, 0, 2 * Math.PI); g.fill();

      info.innerHTML = `<strong>${an.lamText}</strong> · ${an.text}${an.stab ? ', ' + an.stab : ''}` +
        `<br><span class="phase-key"><span style="color:${acc}">━</span> eigenvector orbits · <span>╌</span> x′=0 (vertical tangents) · <span>┈</span> y′=0 (horizontal tangents) · click to add an orbit</span>`;
    }

    draw();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 100); });
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', draw);
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.phase').forEach(setup));
})();
