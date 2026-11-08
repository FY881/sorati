/* برو 42 «مختبر سعراتي» — 5 صفحات، 50 أداة شغالة من بياناتك المحلية، مشهد 3D حي على كل صفحة
   مرسوم بدقة الشاشة لحد 4K، وشرح متحرك لكل صفحة، و«التوأم الأيضي»: نظام جديد بيتعلّم حرقك الحقيقي.
   كل الحساب على الجهاز، مفيش أي بيانات بتطلع. مفتاح الإيقاف: localStorage sp42_lab = "off". فتح: LAB42.open(page) */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.LAB42) return;
  try { if (localStorage.getItem("sp42_lab") === "off") { W.LAB42 = { off: true }; return; } } catch (e) {}

  /* ---------- بيانات ---------- */
  function ld(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function st() { return ld("sp_state", {}) || {}; }
  function dk(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function day(k) { var x = ld("sp_day_" + k, null) || {}; x.items = x.items || []; return x; }
  function sum(x) { return x.items.reduce(function (a, i) { var q = +i.q || 1; return { k: a.k + (+i.k || 0) * q, p: a.p + (+i.p || 0) * q, c: a.c + (+i.c || 0) * q, f: a.f + (+i.f || 0) * q }; }, { k: 0, p: 0, c: 0, f: 0 }); }
  function days(n) { var r = [], d = new Date(); for (var i = 0; i < n; i++) { var k = dk(d), x = day(k), s = sum(x); r.push({ k: k, date: new Date(d), x: x, s: s, n: x.items.length, w: +x.water || 0, sl: +x.sleep || 0 }); d.setDate(d.getDate() - 1); } return r; }
  function prof() { return st().profile || null; }
  function weights() { return (st().weights || []).filter(function (w) { return w && w.d && +w.kg > 0; }).sort(function (a, b) { return a.d < b.d ? -1 : 1; }); }
  function tdeeF(p) { if (!p) return 0; var bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161); return Math.round(bmr * (+p.act || 1.2)); }
  function bmrF(p) { return p ? Math.round(10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161)) : 0; }
  function goalK() { var p = prof(); if (!p) return 2000; var k = Math.round(tdeeF(p) + (+p.goal || 0)); return Math.max(k, p.sex === "m" ? 1500 : 1200); }
  function curW() { var w = weights(); return w.length ? +w[w.length - 1].kg : (prof() && +prof().weight) || 0; }
  var N = function (n, d) { n = +n || 0; return (d ? Math.round(n * Math.pow(10, d)) / Math.pow(10, d) : Math.round(n)).toLocaleString("ar-EG"); };
  var avg = function (a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var WD = ["الأحد", "الاتنين", "التلات", "الأربع", "الخميس", "الجمعة", "السبت"];
  var MEAL = { b: "الفطار", l: "الغدا", d: "العشا", s: "سناكس" };

  /* ---------- التوأم الأيضي (Kalman) ----------
     الفكرة: الوزن اليومي فيه ضوضاء مية وملح. بنفلتر الوزن بفلتر كالمان (حالة: الوزن الحقيقي)، وفي نفس الوقت
     بنقدّر الحرق الحقيقي (TDEE) كحالة تانية بتتعلّم من الفرق بين اللي أكلته وتغيّر الوزن الحقيقي (7700 سعر/كجم).
     الأيام اللي تسجيلها ناقص بنقلّل وزنها في التعلّم بدل ما تبوّظ التقدير. */
  function twin() {
    var p = prof(), ws = weights(), L = days(120).reverse(), F = tdeeF(p) || 2000;
    var wmap = {}; ws.forEach(function (w) { wmap[w.d] = +w.kg; });
    var first = null; for (var i = 0; i < L.length; i++) { if (wmap[L[i].k]) { first = i; break; } }
    var res = { formula: F, tdee: F, conf: 0, trend: curW(), series: [], logged: 0, used: 0, rateKgWk: 0, sigma: 2.5 };
    if (first == null) return res;
    // كالمان بحالتين: [الوزن الحقيقي x، الحرق الحقيقي T]
    var x = wmap[L[first].k], T = F, a = 1, bq = 0, c = 400 * 400, R = 0.35 * 0.35, n = 0, K7 = 1 / 7700;
    for (var j = first; j < L.length; j++) {
      var d = L[j], logged = d.n >= 2 && d.s.k > 600;
      if (logged) {
        res.logged++;
        x = x + (d.s.k - T) * K7;
        var a2 = a - 2 * K7 * bq + K7 * K7 * c, b2 = bq - K7 * c; a = a2 + 0.0025; bq = b2; c = c + 15 * 15;
      } else { a = a + 0.04; c = c + 15 * 15; }
      var z = wmap[d.k];
      if (z) {
        var Sx = a + R, kx = a / Sx, kt = bq / Sx, inn = z - x;
        x = x + kx * inn; T = T + kt * inn;
        var na = (1 - kx) * a, nb = (1 - kx) * bq, nc = c - kt * bq; a = na; bq = nb; c = Math.max(25, nc);
        if (logged) n++;
      }
      res.series.push({ k: d.k, t: x, z: z || null, kcal: logged ? d.s.k : null });
    }
    var PT = c;
    T = Math.max(1100, Math.min(4800, T));
    res.tdee = Math.round(T); res.trend = Math.round(x * 10) / 10; res.used = n;
    res.conf = Math.max(0, Math.min(97, Math.round(100 * (1 - Math.sqrt(PT) / 400) * Math.min(1, n / 10))));
    res.sigma = Math.sqrt(PT);
    var s = res.series, a = s[Math.max(0, s.length - 15)], b = s[s.length - 1]; if (a && b && s.length > 3) res.rateKgWk = Math.round((b.t - a.t) / (Math.min(14, s.length - 1) / 7) * 100) / 100;
    return res;
  }
  function forecast(tw, kcal, nd) { var kg = tw.trend, out = []; for (var i = 0; i <= nd; i++) { out.push(kg); kg += (kcal - tw.tdee) / 7700; } return out; }

  /* ---------- CSS ---------- */
  var css = [
    "#lab42{position:fixed;inset:0;z-index:2147482990;background:#04060c;color:#f4f6fb;direction:rtl;overflow:hidden;font-family:inherit;animation:l42in .35s ease both}",
    "#lab42 .l42-hero{position:relative;height:min(46vh,380px)}",
    "#lab42 canvas.l42-3d{position:absolute;inset:0;width:100%;height:100%;display:block}",
    "#lab42 .l42-top{position:absolute;inset:0 0 auto 0;display:flex;justify-content:space-between;align-items:center;padding:calc(12px + env(safe-area-inset-top)) 16px 0;z-index:2}",
    "#lab42 .l42-btn{border:0;border-radius:14px;height:42px;min-width:42px;padding:0 14px;background:rgba(255,255,255,.1);color:#fff;font-weight:700;font-size:15px;line-height:1;font-family:inherit;backdrop-filter:blur(8px)}",
    "#lab42 .l42-gold{background:linear-gradient(135deg,#fde68a,#d97706);color:#1a1000}",
    "#lab42 .l42-ttl{position:absolute;bottom:14px;right:18px;left:18px;z-index:2;text-shadow:0 4px 20px rgba(0,0,0,.8)}",
    "#lab42 .l42-ttl small{display:block;opacity:.75;font-size:13px;letter-spacing:.5px}#lab42 .l42-ttl h2{margin:4px 0 0;font-size:26px}",
    "#lab42 .l42-tabs{display:flex;gap:8px;overflow-x:auto;padding:10px 14px;scrollbar-width:none;border-bottom:1px solid rgba(255,255,255,.07)}",
    "#lab42 .l42-tab{flex:0 0 auto;border:0;border-radius:999px;padding:9px 15px;background:rgba(255,255,255,.07);color:#cfd6e6;font-weight:700;font-size:14px;line-height:1;font-family:inherit}",
    "#lab42 .l42-tab.on{background:var(--l42c,#10b981);color:#04130c}",
    "#lab42 .l42-body{position:absolute;top:calc(min(46vh,380px) + 58px);bottom:0;left:0;right:0;overflow:auto;padding:12px 14px 80px}",
    "#lab42 .l42-grid{display:grid;grid-template-columns:1fr;gap:12px;max-width:820px;margin:0 auto}",
    "#lab42 .l42-card{position:relative;border-radius:20px;padding:15px 16px;background:linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);animation:l42up .45s ease both;transform-style:preserve-3d}",
    "#lab42 .l42-card h4{margin:0 0 6px;font-size:15px;display:flex;gap:8px;align-items:center}#lab42 .l42-card h4 i{font-style:normal;opacity:.5;font-size:12px;margin-inline-start:auto}",
    "#lab42 .l42-big.l42-txt{font-size:19px;line-height:1.5}","#lab42 .l42-big{font-size:30px;font-weight:800;color:var(--l42c,#6ee7b7);line-height:1.15}",
    "#lab42 .l42-sub{opacity:.72;font-size:13.5px;line-height:1.6}",
    "#lab42 .l42-bar{height:9px;border-radius:9px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:8px}#lab42 .l42-bar b{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--l42c,#10b981),#fde68a);transition:width .8s ease}",
    "#lab42 .l42-row{display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:5px 0;border-bottom:1px dashed rgba(255,255,255,.07)}#lab42 .l42-row:last-child{border:0}",
    "#lab42 .l42-heat{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;margin-top:8px}#lab42 .l42-heat span{aspect-ratio:1;border-radius:5px;background:rgba(255,255,255,.06)}",
    "#lab42 canvas.l42-ch{width:100%;height:170px;display:block;margin-top:8px}",
    "#lab42 input[type=range]{width:100%;accent-color:#fbbf24}",
    "#lab42 .l42-act{border:0;border-radius:14px;height:44px;padding:0 16px;margin-top:10px;background:var(--l42c,#10b981);color:#04130c;font-weight:800;font-size:14px;line-height:1;font-family:inherit}",
    "#lab42 .l42-chip{display:inline-block;margin:3px 0 0 6px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.08);font-size:13px}",
    "#l42fab{position:fixed;left:14px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:2147482000;width:52px;height:52px;border-radius:18px;border:0;background:conic-gradient(from 210deg,#fde68a,#10b981,#60a5fa,#fde68a);box-shadow:0 10px 30px -6px rgba(16,185,129,.6);font-size:24px;animation:l42pulse 3s ease-in-out infinite}",
    "#l42fab span{display:grid;place-items:center;position:absolute;inset:3px;border-radius:15px;background:#071018}",
    "#l42ex{position:fixed;inset:0;z-index:2147483100;background:#000;display:grid;place-items:center}#l42ex canvas{width:100%;height:100%}",
    "#l42ex .l42-btn{position:absolute;top:calc(14px + env(safe-area-inset-top));left:14px;border:0;border-radius:14px;width:44px;height:44px;background:rgba(255,255,255,.12);color:#fff;font-weight:700;font-size:18px;line-height:1;font-family:inherit}",
    "@keyframes l42in{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:none}}",
    "@keyframes l42up{from{opacity:0;transform:translateY(18px) rotateX(12deg)}to{opacity:1;transform:none}}",
    "@keyframes l42pulse{50%{transform:translateY(-3px);box-shadow:0 16px 36px -6px rgba(251,191,36,.6)}}",
    "body.lite #lab42 .l42-card,body.lite #l42fab{animation:none}",
    "@media (prefers-reduced-motion:reduce){#lab42 .l42-card,#l42fab{animation:none}}",
    "@media (min-width:900px){#lab42 .l42-grid{max-width:860px}}"
  ].join("\n");

  /* ---------- مشهد 3D (كانفاس بدقة الشاشة لحد 4K) ---------- */
  var SCENES = {
    twin: { c: "#fbbf24", c2: "#10b981", shape: "dna" }, food: { c: "#34d399", c2: "#f472b6", shape: "torus" },
    habit: { c: "#60a5fa", c2: "#a78bfa", shape: "grid" }, body: { c: "#f472b6", c2: "#fbbf24", shape: "sphere" }, tools: { c: "#a78bfa", c2: "#34d399", shape: "cube" }
  };
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
  function pts(shape) {
    var P = [], i, j;
    if (shape === "dna") for (i = 0; i < 160; i++) { var t = i / 160 * Math.PI * 6, y = (i / 160 - .5) * 2.4; P.push([Math.cos(t), y, Math.sin(t), 0], [Math.cos(t + Math.PI), y, Math.sin(t + Math.PI), 1]); }
    else if (shape === "torus") for (i = 0; i < 40; i++) for (j = 0; j < 12; j++) { var u = i / 40 * 6.283, v = j / 12 * 6.283; P.push([(1 + .38 * Math.cos(v)) * Math.cos(u), .38 * Math.sin(v), (1 + .38 * Math.cos(v)) * Math.sin(u), j % 2]); }
    else if (shape === "grid") for (i = 0; i < 14; i++) for (j = 0; j < 14; j++) P.push([(i - 6.5) / 5, 0, (j - 6.5) / 5, (i + j) % 2, i, j]);
    else if (shape === "sphere") for (i = 0; i < 420; i++) { var ph = Math.acos(1 - 2 * (i + .5) / 420), th = Math.PI * (1 + Math.sqrt(5)) * i; P.push([Math.cos(th) * Math.sin(ph), Math.cos(ph), Math.sin(th) * Math.sin(ph), i % 3 ? 0 : 1]); }
    else for (i = 0; i < 9; i++) for (j = 0; j < 9; j++) { var a = (i - 4) / 4, b = (j - 4) / 4; P.push([a, b, 1, 0], [a, b, -1, 1], [1, a, b, 0], [-1, a, b, 1], [a, 1, b, 0], [a, -1, b, 1]); }
    return P;
  }
  function scene(cv, key, extra) {
    var sc = SCENES[key], P = pts(sc.shape), ctx = cv.getContext("2d"), rx = .35, ry = 0, tx = 0, ty = 0, raf = 0, t0 = performance.now(), alive = true;
    var lite = D.body.classList.contains("lite") || (W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    function size() { var r = cv.getBoundingClientRect(), dpr = Math.min(W.devicePixelRatio || 1, 3840 / Math.max(1, r.width), 4); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    var onR = function () { size(); }; W.addEventListener("resize", onR);
    var onM = function (e) { var r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; tx = ((p.clientX - r.left) / r.width - .5) * 1.2; ty = ((p.clientY - r.top) / r.height - .5) * .8; };
    cv.addEventListener("pointermove", onM); cv.addEventListener("touchmove", onM, { passive: true });
    var onO = function (e) { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 35)); ty = Math.max(-.6, Math.min(.6, ((e.beta || 40) - 40) / 50)); };
    W.addEventListener("deviceorientation", onO);
    function draw(now) {
      if (!alive) return;
      var t = Math.max(0, (now - t0) / 1000), w = cv.clientWidth, h = cv.clientHeight, cx = w / 2, cy = h * .46, R = Math.min(w, h) * .3;
      var Ry = tx * .8 + t * (lite ? 0 : .25), Rx = rx + ty;
      ctx.clearRect(0, 0, w, h);
      var g = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * .7); g.addColorStop(0, hexA(sc.c, .22)); g.addColorStop(.5, hexA(sc.c2, .08)); g.addColorStop(1, "rgba(4,6,12,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      var cs = Math.cos(Ry), sn = Math.sin(Ry), cX = Math.cos(Rx), sX = Math.sin(Rx), out = [];
      for (var i = 0; i < P.length; i++) {
        var p = P[i], x = p[0], y = p[1], z = p[2];
        if (sc.shape === "grid") { var hv = extra && extra.heat ? (extra.heat[p[4] * 14 + p[5]] || 0) : .3; y = -hv * .55 * (lite ? 1 : (.85 + .15 * Math.sin(t * 1.6 + p[4] * .4 + p[5] * .3))); }
        if (sc.shape === "sphere") { var br = 1 + Math.sin(t * 2 + i) * .03; x *= br; y *= br; z *= br; }
        var X = x * cs - z * sn, Z = x * sn + z * cs, Y = y * cX - Z * sX; Z = y * sX + Z * cX;
        var f = 3.2 / Math.max(.8, 3.2 + Z); out.push([cx + X * R * f, cy + Y * R * f, Z, f, p[3]]);
      }
      out.sort(function (a, b) { return b[2] - a[2]; });
      for (var k = 0; k < out.length; k++) { var o = out[k], al = Math.max(.12, Math.min(1, (1.6 - o[2]) / 2.2)); ctx.fillStyle = hexA(o[4] ? sc.c2 : sc.c, al); ctx.beginPath(); ctx.arc(o[0], o[1], Math.max(.8, 2.6 * o[3]), 0, 6.283); ctx.fill(); }
      if (sc.shape === "dna") { ctx.strokeStyle = hexA(sc.c, .18); ctx.lineWidth = 1; for (var m = 0; m + 1 < out.length; m += 16) { ctx.beginPath(); ctx.moveTo(out[m][0], out[m][1]); ctx.lineTo(out[m + 1][0], out[m + 1][1]); ctx.stroke(); } }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return function () { alive = false; cancelAnimationFrame(raf); W.removeEventListener("resize", onR); W.removeEventListener("deviceorientation", onO); };
  }

  /* ---------- رسم بياني صغير ---------- */
  function chart(cv, sets, opt) {
    opt = opt || {};
    var dpr = Math.min(W.devicePixelRatio || 1, 4), r = cv.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr;
    var c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); var w = r.width, h = r.height, all = [];
    sets.forEach(function (s) { s.v.forEach(function (v) { if (v != null && isFinite(v)) all.push(v); }); if (s.band) s.band.forEach(function (b) { all.push(b[0], b[1]); }); });
    if (!all.length) { c.fillStyle = "rgba(255,255,255,.4)"; c.font = "13px sans-serif"; c.textAlign = "center"; c.fillText("مفيش بيانات كفاية لسه", w / 2, h / 2); return; }
    var mn = Math.min.apply(0, all), mx = Math.max.apply(0, all); if (mx - mn < 1e-6) { mx += 1; mn -= 1; } var pad = (mx - mn) * .12; mn -= pad; mx += pad;
    var X = function (i, n) { return 8 + (w - 16) * (n < 2 ? .5 : i / (n - 1)); }, Y = function (v) { return h - 14 - (h - 26) * (v - mn) / (mx - mn); };
    c.fillStyle = "rgba(255,255,255,.45)"; c.font = "11px sans-serif"; c.textAlign = "left"; c.fillText(N(mx, 1), 4, 10); c.fillText(N(mn, 1), 4, h - 2);
    sets.forEach(function (s) {
      var n = s.v.length;
      if (s.band) { c.fillStyle = hexA(s.c, .14); c.beginPath(); s.band.forEach(function (b, i) { c[i ? "lineTo" : "moveTo"](X(i, n), Y(b[1])); }); for (var j = n - 1; j >= 0; j--) c.lineTo(X(j, n), Y(s.band[j][0])); c.closePath(); c.fill(); }
      if (s.dots) { c.fillStyle = hexA(s.c, .8); s.v.forEach(function (v, i) { if (v != null) { c.beginPath(); c.arc(X(i, n), Y(v), 2.4, 0, 6.283); c.fill(); } }); return; }
      if (s.bars) { var bw = Math.max(2, (w - 16) / n * .7); s.v.forEach(function (v, i) { if (v == null) return; c.fillStyle = hexA(s.c, .85); c.fillRect(X(i, n) - bw / 2, Y(v), bw, h - 14 - Y(v)); }); return; }
      c.strokeStyle = s.c; c.lineWidth = 2.4; c.lineJoin = "round"; c.beginPath(); var st0 = false; s.v.forEach(function (v, i) { if (v == null) return; c[st0 ? "lineTo" : "moveTo"](X(i, n), Y(v)); st0 = true; }); c.stroke();
    });
    if (opt.line != null) { c.setLineDash([5, 5]); c.strokeStyle = "rgba(253,230,138,.7)"; c.beginPath(); c.moveTo(8, Y(opt.line)); c.lineTo(w - 8, Y(opt.line)); c.stroke(); c.setLineDash([]); }
  }

  /* ---------- الأدوات الخمسين ---------- */
  function card(n, t, html) { return '<div class="l42-card" style="animation-delay:' + (n % 10) * 40 + 'ms"><h4>' + t + "<i>#" + N(n) + "</i></h4>" + html + "</div>"; }
  function big(v, s) { return '<div class="l42-big' + (String(v).length > 22 ? ' l42-txt' : '') + '">' + v + '</div><div class="l42-sub">' + s + "</div>"; }
  function bar(p) { return '<div class="l42-bar"><b style="width:' + Math.max(0, Math.min(100, p)) + '%"></b></div>'; }
  function row(a, b) { return '<div class="l42-row"><span>' + a + "</span><b>" + b + "</b></div>"; }
  function need(s) { return '<div class="l42-sub">' + s + "</div>"; }

  var PAGES = [
    { id: "twin", name: "التوأم الأيضي", sub: "نظام جديد من سعراتي · بيتعلّم حرقك الحقيقي", build: function () {
      var tw = twin(), p = prof(), g = goalK(), L = days(14), lk = L.filter(function (d) { return d.n >= 2; }), h = "";
      var gw = +(st().goalW || (p && p.goalW) || 0);
      h += card(1, "🧬 حرقك الحقيقي", tw.used ? big(N(tw.tdee) + " سعر", "ده اللي جسمك بيحرقه فعلًا حسب أكلك ووزنك. المعادلة كانت بتقول " + N(tw.formula) + ".") : need("سجّل وزنك مرتين على الأقل وأكلك كام يوم، والتوأم هيبدأ يتعلّم."));
      h += card(2, "🎯 ثقة التوأم", big(N(tw.conf) + "٪", "اتعلّم من " + N(tw.used) + " قياس وزن مع أيام أكل كاملة (" + N(tw.logged) + " يوم متسجّل).") + bar(tw.conf));
      h += card(3, "🔮 وزنك بعد ٣٠ يوم", '<canvas class="l42-ch" data-ch="fc"></canvas>' + need("لو فضلت على هدفك (" + N(g) + " سعر). المساحة الملوّنة هي هامش الخطأ."));
      h += card(4, "🎚️ ماذا لو؟", '<input type="range" min="1000" max="4000" step="50" value="' + g + '" data-wi><div class="l42-big" data-wiv></div><div class="l42-sub" data-wis></div>');
      var flat = tw.series.length > 20 && Math.abs(tw.rateKgWk) < .1 && lk.length > 7 && avg(lk.map(function (d) { return d.s.k; })) < tw.formula - 250;
      h += card(5, "⛰️ كاشف الثبات", flat ? big("ثبات حقيقي", "أكلك أقل من المعادلة بس الوزن الحقيقي واقف. غالبًا الحرق قلّ، جرّب أسبوع على حرقك الحقيقي.") : big(tw.series.length > 20 ? "مفيش ثبات" : "بيتعلّم", "بيقارن اتجاه الوزن المفلتر بأكلك، مش رقم الميزان اليومي."));
      h += card(6, "🌊 وزنك بعد فلترة المية", big(tw.trend ? N(tw.trend, 1) + " كجم" : "—", "آخر ميزان: " + (curW() ? N(curW(), 1) : "—") + ". الفرق ده مية وملح، مش دهون."));
      var gaps = L.filter(function (d) { return d.n < 2; }).length;
      h += card(7, "🕳️ أيام تسجيلها ناقص", big(N(gaps) + " من ١٤", gaps ? "التوأم بيقلّل ثقته في الأيام دي بدل ما تبوّظ الحساب." : "تسجيلك كامل، التوأم واثق."));
      var eta = ""; if (gw && tw.trend && g !== tw.tdee) { var dd = (gw - tw.trend) * 7700 / (g - tw.tdee); eta = dd > 0 && dd < 1500 ? "حوالي " + N(dd) + " يوم (" + new Date(Date.now() + dd * 864e5).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }) + ")" : "على أكلك الحالي مش هتوصل، عدّل الهدف."; }
      h += card(8, "🏁 هتوصل لهدفك إمتى", gw ? big(eta || "—", "الهدف " + N(gw, 1) + " كجم، بحرقك الحقيقي مش بالمعادلة.") : need("حط وزن الهدف في ملفك عشان أحسبلك."));
      var adapt = tw.used >= 6 ? Math.round((tw.tdee - tw.formula) / tw.formula * 100) : null;
      h += card(9, "⚙️ تكيّف الحرق", adapt == null ? need("محتاج ٦ قياسات على الأقل.") : big((adapt > 0 ? "+" : "") + N(adapt) + "٪", adapt < -8 ? "حرقك أقل من المتوقع بشكل واضح. النوم والبروتين والحركة بيرفعوه." : adapt > 8 ? "حرقك أعلى من المعادلة، جسمك نشيط." : "حرقك قريب من المتوقع."));
      var wk = days(7).filter(function (d) { return d.n; }), bank = wk.reduce(function (a, d) { return a + (g - d.s.k); }, 0);
      h += card(10, "🏦 بنك السعرات الأسبوعي", big((bank >= 0 ? "+" : "") + N(bank), bank >= 0 ? "رصيد متوفّر من آخر ٧ أيام، تقدر تصرفه على عزومة." : "عليك سحب، وزّعه على الأيام الجاية بهدوء."));
      return h;
    }, after: function (root) {
      var tw = twin(), g = goalK(), cv = root.querySelector('[data-ch="fc"]');
      var hist = tw.series.slice(-30).map(function (s) { return s.t; }), fc = forecast(tw, g, 30), band = fc.map(function (v, i) { var e = (tw.sigma * i) / 7700 + .3; return [v - e, v + e]; });
      if (cv) chart(cv, [{ v: hist.concat(fc.map(function () { return null; })), c: "#10b981" }, { v: hist.map(function () { return null; }).concat(fc), band: hist.map(function () { return [fc[0], fc[0]]; }).concat(band), c: "#fbbf24" }]);
      var r = root.querySelector("[data-wi]"), v = root.querySelector("[data-wiv]"), s = root.querySelector("[data-wis]");
      function up() { var k = +r.value, d30 = (k - tw.tdee) * 30 / 7700; v.textContent = N(k) + " سعر/يوم"; s.textContent = "في ٣٠ يوم: " + (d30 >= 0 ? "+" : "") + N(d30, 1) + " كجم" + (tw.trend ? " ← " + N(tw.trend + d30, 1) + " كجم" : "") + (Math.abs(d30) > 4.5 ? " · أسرع من الآمن" : ""); }
      if (r) { r.addEventListener("input", up); up(); }
    } },
    { id: "food", name: "الأكل الذكي", sub: "عشر قراءات لأكلك من آخر ٣٠ يوم", build: function () {
      var L = days(30), T = days(1)[0], s = T.s, all = []; L.forEach(function (d) { d.x.items.forEach(function (i) { all.push({ i: i, d: d }); }); });
      var h = "", kc = s.k || 1, pP = s.p * 4 / kc * 100, cP = s.c * 4 / kc * 100, fP = s.f * 9 / kc * 100;
      var score = s.k ? Math.max(0, Math.round(100 - Math.abs(pP - 25) * 1.6 - Math.abs(cP - 47) * .9 - Math.abs(fP - 28) * 1.1)) : 0;
      h += card(11, "⚖️ توازن الماكروز النهارده", s.k ? big(N(score) + "/١٠٠", "بروتين " + N(pP) + "٪ · كارب " + N(cP) + "٪ · دهون " + N(fP) + "٪") + bar(score) : need("سجّل أكل النهارده الأول."));
      var bm = { b: 0, l: 0, d: 0, s: 0 }; T.x.items.forEach(function (i) { bm[i.m || "s"] += (+i.p || 0) * (+i.q || 1); });
      h += card(12, "🥚 توزيع البروتين", Object.keys(bm).map(function (k) { return row(MEAL[k], N(bm[k]) + " جم"); }).join("") + need("أحسن امتصاص لما كل وجبة فيها ٢٥–٤٠ جم."));
      var byF = {}; all.forEach(function (a) { var n = a.i.n || "؟"; byF[n] = (byF[n] || 0) + (+a.i.k || 0) * (+a.i.q || 1); });
      var top = Object.keys(byF).sort(function (a, b) { return byF[b] - byF[a]; }).slice(0, 5);
      h += card(13, "🔥 أكتر أكلات بتديك سعرات", top.length ? top.map(function (n) { return row(esc(n), N(byF[n])); }).join("") : need("مفيش أكل متسجّل في آخر ٣٠ يوم."));
      var uniq = Object.keys(byF).length, div = all.length ? Math.round(uniq / all.length * 100) : 0;
      h += card(14, "🌈 مؤشر التنوّع", big(N(uniq) + " صنف", "من " + N(all.length) + " مرة أكل · التنوّع " + N(div) + "٪") + bar(div * 1.5));
      var late = all.filter(function (a) { return a.i.t && new Date(a.i.t).getHours() >= 22; }).reduce(function (x, a) { return x + (+a.i.k || 0) * (+a.i.q || 1); }, 0), tot = all.reduce(function (x, a) { return x + (+a.i.k || 0) * (+a.i.q || 1); }, 0);
      h += card(15, "🌙 أكل بعد ١٠ بالليل", big(N(tot ? late / tot * 100 : 0) + "٪", "من سعراتك بتتاكل متأخر."));
      h += card(16, "🗓️ خريطة مواعيد أكلك", '<canvas class="l42-ch" data-ch="hm" style="height:150px"></canvas>' + need("كل عمود ساعة من اليوم، الأطول = أكل أكتر."));
      var pm = { b: [], l: [], d: [], s: [] }; L.forEach(function (d) { var m = { b: 0, l: 0, d: 0, s: 0 }; d.x.items.forEach(function (i) { m[i.m || "s"] += (+i.k || 0) * (+i.q || 1); }); if (d.n) Object.keys(m).forEach(function (k) { pm[k].push(m[k]); }); });
      h += card(17, "🍽️ متوسط كل وجبة", Object.keys(pm).map(function (k) { return row(MEAL[k], N(avg(pm[k]))); }).join(""));
      var cw = [], i2; for (i2 = 3; i2 >= 0; i2--) { var seg = L.slice(i2 * 7, i2 * 7 + 7).filter(function (d) { return d.s.k; }), kk = seg.reduce(function (a, d) { return a + d.s.k; }, 0), cc = seg.reduce(function (a, d) { return a + d.s.c * 4; }, 0); cw.push(kk ? Math.round(cc / kk * 100) : null); }
      h += card(18, "🍞 نسبة الكارب أسبوعيًا", '<canvas class="l42-ch" data-ch="cw" data-v="' + cw.join(",") + '" style="height:120px"></canvas>');
      var eb = 0; for (var e = 0; e < L.length; e++) { var it = L[e].x.items.filter(function (i) { return i.m === "b" && i.t && new Date(i.t).getHours() < 10; }); if (it.length) eb++; else if (e) break; }
      h += card(19, "🌅 سلسلة الفطار بدري", big(N(eb) + " يوم", "فطار قبل ١٠ الصبح ورا بعض."));
      var co = {}; L.forEach(function (d) { var n = d.x.items.map(function (i) { return i.n; }).filter(Boolean), u = n.filter(function (v, i) { return n.indexOf(v) === i; }).slice(0, 12); for (var a = 0; a < u.length; a++) for (var b = a + 1; b < u.length; b++) { var key = [u[a], u[b]].sort().join(" + "); co[key] = (co[key] || 0) + 1; } });
      var tc = Object.keys(co).filter(function (k) { return co[k] > 1; }).sort(function (a, b) { return co[b] - co[a]; }).slice(0, 4);
      h += card(20, "🤝 أكلات بتيجي مع بعض", tc.length ? tc.map(function (k) { return row(esc(k), N(co[k]) + " مرة"); }).join("") : need("لسه مفيش أكلات متكررة مع بعض."));
      return h;
    }, after: function (root) {
      var hrs = new Array(24).fill(0); days(30).forEach(function (d) { d.x.items.forEach(function (i) { if (i.t) hrs[new Date(i.t).getHours()] += (+i.k || 0) * (+i.q || 1); }); });
      var a = root.querySelector('[data-ch="hm"]'); if (a) chart(a, [{ v: hrs, c: "#34d399", bars: 1 }]);
      var b = root.querySelector('[data-ch="cw"]'); if (b) chart(b, [{ v: b.dataset.v.split(",").map(function (x) { return x === "" ? null : +x; }), c: "#f472b6" }], { line: 50 });
    } },
    { id: "habit", name: "العادات", sub: "الاستمرار بالأرقام، والمشهد بيترسم من أيامك", build: function () {
      var L = days(84), g = goalK(), wg = +(st().waterGoal || 8), h = "";
      var s = 0; for (var i = L[0].n ? 0 : 1; i < L.length && L[i].n; i++) s++;
      var best = 0, run = 0; L.slice().reverse().forEach(function (d) { run = d.n ? run + 1 : 0; best = Math.max(best, run); });
      h += card(21, "🔥 السلسلة الحالية", big(N(s) + " يوم", "أيام ورا بعض فيها تسجيل."));
      h += card(22, "🏆 أطول سلسلة (١٢ أسبوع)", big(N(best) + " يوم", best > s ? "فاضلك " + N(best - s) + " يوم وتكسر رقمك." : "إنت دلوقتي في أحسن سلسلة ليك."));
      h += card(23, "🧱 تقويم الالتزام", '<div class="l42-heat">' + L.slice().reverse().map(function (d) { var r = d.s.k ? Math.min(1, d.s.k / g) : 0, ok = d.s.k && Math.abs(d.s.k - g) < g * .12; return '<span title="' + d.k + '" style="background:' + (d.n ? (ok ? "rgba(16,185,129," + (.35 + r * .6) + ")" : "rgba(251,191,36," + (.25 + r * .5) + ")") : "rgba(255,255,255,.06)") + '"></span>'; }).join("") + "</div>" + need("أخضر = قريب من هدفك، دهبي = متسجّل بس بعيد."));
      var w7 = L.slice(0, 7).map(function (d) { return d.w; });
      h += card(24, "💧 متوسط المية", big(N(avg(w7), 1) + " كوباية", "آخر ٧ أيام · هدفك " + N(wg)) + bar(avg(w7) / wg * 100));
      var hit = L.slice(0, 30).filter(function (d) { return d.w >= wg; }).length;
      h += card(25, "🎯 أيام تحقيق هدف المية", big(N(hit) + " من ٣٠", "") + bar(hit / 30 * 100));
      var sl = L.slice(0, 14).map(function (d) { return d.sl; }).filter(function (v) { return v > 0; });
      h += card(26, "😴 متوسط النوم", sl.length ? big(N(avg(sl), 1) + " ساعة", "من " + N(sl.length) + " ليلة متسجّلة.") : need("سجّل نومك عشان يظهر هنا."));
      var we = [], wd = []; L.slice(0, 28).forEach(function (d) { if (!d.s.k) return; var x = d.date.getDay(); (x === 5 || x === 6 ? we : wd).push(d.s.k); });
      h += card(27, "📆 الويك إند مقابل الأسبوع", we.length && wd.length ? big((avg(we) - avg(wd) >= 0 ? "+" : "") + N(avg(we) - avg(wd)) + " سعر", "الجمعة والسبت مقارنة بباقي الأيام.") : need("محتاج أسبوعين تسجيل."));
      var over = [0, 0, 0, 0, 0, 0, 0], cnt = [0, 0, 0, 0, 0, 0, 0]; L.forEach(function (d) { if (!d.s.k) return; var x = d.date.getDay(); cnt[x]++; if (d.s.k > g * 1.1) over[x]++; });
      var worst = over.indexOf(Math.max.apply(0, over));
      h += card(28, "⚠️ يوم الخطر", Math.max.apply(0, over) ? big(WD[worst], "أكتر يوم بتعدّي فيه هدفك (" + N(over[worst]) + " مرة من " + N(cnt[worst]) + ").") : need("مفيش يوم بيتكرر فيه التعدّي."));
      var hs = Math.round((Math.min(s, 14) / 14) * 30 + (hit / 30) * 25 + (L.slice(0, 14).filter(function (d) { return d.s.k && Math.abs(d.s.k - g) < g * .12; }).length / 14) * 45);
      h += card(29, "⭐ نقاط العادات", big(N(hs) + "/١٠٠", "تسجيل ٣٠٪ + مية ٢٥٪ + الالتزام بالهدف ٤٥٪.") + bar(hs));
      var c30 = L.slice(0, 30).filter(function (d) { return d.n; }).length;
      h += card(30, "🗓️ تحدّي الـ ٣٠ يوم", big(N(c30) + "/٣٠", c30 >= 30 ? "خلّصت التحدّي!" : "سجّل كل يوم لحد ما تكمّل.") + bar(c30 / 30 * 100));
      return h;
    } },
    { id: "body", name: "الجسم", sub: "أرقام جسمك وتغيّرها", build: function () {
      var p = prof(), ws = weights(), w = curW(), h = "";
      if (!p) return card(31, "👤 ملفك", need("كمّل بيانات ملفك (الطول والوزن والسن) عشان تشتغل الصفحة دي."));
      var hm = p.height / 100, bmi = w / (hm * hm), z = bmi < 18.5 ? "نحافة" : bmi < 25 ? "طبيعي" : bmi < 30 ? "وزن زيادة" : "سمنة";
      h += card(31, "📏 مؤشر كتلة الجسم", big(N(bmi, 1), z) + bar((bmi - 15) / 25 * 100));
      h += card(32, "🔋 الحرق حسب المعادلة", row("الحرق وإنت مرتاح", N(bmrF(p)) + " سعر") + row("مع نشاطك", N(tdeeF(p)) + " سعر"));
      h += card(33, "🎯 الوزن الصحي لطولك", big(N(18.5 * hm * hm, 1) + "–" + N(24.9 * hm * hm, 1) + " كجم", "حسب مؤشر كتلة الجسم ١٨٫٥–٢٤٫٩."));
      var bf = 1.2 * bmi + .23 * p.age - 10.8 * (p.sex === "m" ? 1 : 0) - 5.4;
      h += card(34, "🧈 نسبة الدهون التقديرية", big(N(bf, 1) + "٪", "تقدير تقريبي من الطول والوزن والسن (معادلة Deurenberg)، مش قياس."));
      function ago(n) { var t = dk(new Date(Date.now() - n * 864e5)), c = null; ws.forEach(function (x) { if (x.d <= t) c = +x.kg; }); return c; }
      h += card(35, "📉 التغيّر", [7, 30, 90].map(function (n) { var a = ago(n); return row("آخر " + N(n) + " يوم", a ? ((w - a >= 0 ? "+" : "") + N(w - a, 1) + " كجم") : "—"); }).join(""));
      var tw = twin(), pct = w ? Math.abs(tw.rateKgWk) / w * 100 : 0;
      h += card(36, "🛡️ سرعة آمنة؟", tw.series.length > 7 ? big(N(pct, 2) + "٪ أسبوعيًا", pct > 1 ? "أسرع من ١٪ من وزنك في الأسبوع، خفّف شوية." : "في المعدّل الآمن (أقل من ١٪ في الأسبوع).") : need("محتاج قياسات أكتر."));
      h += card(37, "🥩 احتياج البروتين", big(N(w * 1.6) + "–" + N(w * 2.2) + " جم", "يوميًا لو بتتمرّن (١٫٦–٢٫٢ جم لكل كيلو)."));
      h += card(38, "💧 احتياج المية", big(N(w * .033, 1) + " لتر", "تقريبًا ٣٣ مل لكل كيلو، وأكتر في الحر والتمرين."));
      h += card(39, "⚖️ سعرات التثبيت", big(N(tw.used ? tw.tdee : tdeeF(p)) + " سعر", tw.used ? "من التوأم الأيضي (حرقك الحقيقي)." : "من المعادلة لحد ما التوأم يتعلّم."));
      var dif = []; for (var i = 1; i < ws.length; i++) dif.push(Math.abs(ws[i].kg - ws[i - 1].kg));
      h += card(40, "📊 تذبذب الميزان", dif.length ? big("±" + N(avg(dif), 2) + " كجم", "متوسط الفرق بين قياس والتاني. الطبيعي لحد ١ كجم من المية.") : need("سجّل وزنك أكتر من مرة."));
      return h;
    } },
    { id: "tools", name: "الأدوات", sub: "عشر أدوات بتعمل حاجة فعلًا", build: function () {
      var T = days(1)[0], g = goalK(), p = prof(), h = "", left = g - T.s.k;
      var pg = p ? Math.round(p.weight * 1.6) : 100;
      h += card(41, "🧠 خطّة باقي اليوم", '<div data-plan></div>');
      h += card(42, "⏳ الباقي النهارده", row("سعرات", N(left)) + row("بروتين", N(pg - T.s.p) + " جم") + row("مية", N(Math.max(0, (+(st().waterGoal || 8)) - T.w)) + " كوباية"));
      var hi = days(14).reduce(function (a, d) { d.x.items.forEach(function (i) { var k = (+i.k || 0) * (+i.q || 1); if (!a || k > a.k) a = { n: i.n, k: k }; }); return a; }, null);
      h += card(43, "🔁 بديل أخف", hi ? big(esc(hi.n), "أتقل حاجة أكلتها في أسبوعين (" + N(hi.k) + " سعر). نص الكمية مع سلطة يوفّر حوالي " + N(hi.k / 2) + ".") : need("مفيش أكل متسجّل."));
      h += card(44, "🥄 حاسبة الكمية", '<div class="l42-sub">السعرات لكل ١٠٠ جم</div><input type="range" min="20" max="900" value="250" data-pk><div class="l42-sub">الكمية بالجرام</div><input type="range" min="10" max="600" value="150" data-pg><div class="l42-big" data-pv></div>');
      var kg = curW() || 70;
      h += card(45, "🚶 تمشي قد إيه؟", '<input type="range" min="50" max="1000" step="25" value="300" data-wk><div class="l42-big" data-wv></div><div class="l42-sub">مشي متوسط ٣٫٥ MET على وزنك ' + N(kg) + ' كجم.</div>');
      var fv = (st().favs || []).length, rc = {}; days(14).forEach(function (d) { d.x.items.forEach(function (i) { if (i.n) rc[i.n] = (rc[i.n] || 0) + 1; }); });
      var gl = Object.keys(rc).sort(function (a, b) { return rc[b] - rc[a]; }).slice(0, 10);
      h += card(46, "🛒 قايمة مشتريات", gl.length ? gl.map(function (n) { return '<span class="l42-chip">' + esc(n) + "</span>"; }).join("") + '<br><button class="l42-act" data-copy="' + esc(gl.join("\n")) + '">انسخ القايمة</button>' : need("سجّل أكل أسبوع وهتتعمل لوحدها." + (fv ? "" : "")));
      h += card(47, "📄 تصدير ٩٠ يوم", need("ملف CSV بكل يوم: سعرات، بروتين، كارب، دهون، مية.") + '<button class="l42-act" data-csv>نزّل الملف</button>');
      h += card(48, "💾 نسخة احتياطية", need("كل بياناتك المحلية في ملف واحد تحتفظ بيه.") + '<button class="l42-act" data-bak>نزّل النسخة</button>');
      h += card(49, "⏱️ نافذة الأكل", '<div class="l42-sub">عدد ساعات الصيام</div><input type="range" min="12" max="20" value="16" data-fw><div class="l42-big" data-fv></div>');
      h += card(50, "🖼️ تقرير أسبوعك بدقة 4K", need("صورة ٣٨٤٠×٢١٦٠ بأرقام أسبوعك تشاركها.") + '<button class="l42-act" data-4k>اعمل الصورة</button>');
      return h;
    }, after: function (root) {
      var T = days(1)[0], g = goalK(), left = g - T.s.k, p = prof(), pg = p ? Math.round(p.weight * 1.6) : 100, pl = root.querySelector("[data-plan]");
      var pool = {}; days(30).forEach(function (d) { d.x.items.forEach(function (i) { if (i.n && +i.k > 0) pool[i.n] = i; }); });
      var foods = Object.keys(pool).map(function (k) { return pool[k]; }), pLeft = pg - T.s.p, pick = [], kk = left;
      foods.sort(function (a, b) { return (b.p / b.k) - (a.p / a.k); });
      for (var i = 0; i < foods.length && pick.length < 3; i++) { if (+foods[i].k <= kk) { pick.push(foods[i]); kk -= +foods[i].k; } }
      if (pl) pl.innerHTML = left < 150 ? '<div class="l42-sub">خلصت سعرات النهارده تقريبًا. مية وخضار لو جعت.</div>' : pick.length ? pick.map(function (f) { return row(esc(f.n) + " · " + esc(f.sv || ""), N(f.k) + " سعر · " + N(f.p) + " بروتين"); }).join("") + '<div class="l42-sub">من أكلك المعتاد، مرتّبة بالأكتر بروتين لكل سعر. باقيلك ' + N(pLeft) + " جم بروتين.</div>" : '<div class="l42-sub">سجّل أكل أكتر عشان أقترح من أكلك.</div>';
      var pk = root.querySelector("[data-pk]"), pgm = root.querySelector("[data-pg]"), pv = root.querySelector("[data-pv]");
      function pu() { pv.textContent = N(pk.value * pgm.value / 100) + " سعر (" + N(pk.value) + " لكل ١٠٠ جم × " + N(pgm.value) + " جم)"; } if (pk) { pk.oninput = pgm.oninput = pu; pu(); }
      var wk = root.querySelector("[data-wk]"), wv = root.querySelector("[data-wv]"), kg = curW() || 70;
      function wu() { var m = wk.value / (3.5 * kg / 60); wv.textContent = N(m) + " دقيقة لـ " + N(wk.value) + " سعر"; } if (wk) { wk.oninput = wu; wu(); }
      var fw = root.querySelector("[data-fw]"), fv = root.querySelector("[data-fv]");
      function fu() { var lastT = 0; T.x.items.forEach(function (i) { lastT = Math.max(lastT, +i.t || 0); }); var base = lastT || Date.now(), e = new Date(base + fw.value * 36e5); fv.textContent = "تاكل تاني " + e.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" }) + (lastT ? " (من آخر أكلة)" : " (من دلوقتي)"); } if (fw) { fw.oninput = fu; fu(); }
      root.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.copy != null) { try { navigator.clipboard.writeText(b.dataset.copy); } catch (x) {} tst("القايمة اتنسخت"); }
        if (b.hasAttribute("data-csv")) { var rows = ["date,kcal,protein,carbs,fat,water"]; days(90).reverse().forEach(function (d) { if (d.n || d.w) rows.push([d.k, Math.round(d.s.k), Math.round(d.s.p), Math.round(d.s.c), Math.round(d.s.f), d.w].join(",")); }); dl("sorati-90d.csv", "\ufeff" + rows.join("\n"), "text/csv"); }
        if (b.hasAttribute("data-bak")) { var o = {}; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^sp_(state|day_|acct)/.test(k)) o[k] = localStorage.getItem(k); } dl("sorati-backup-" + dk(new Date()) + ".json", JSON.stringify(o), "application/json"); }
        if (b.hasAttribute("data-4k")) report4k();
      });
    } }
  ];

  function tst(m) { if (typeof W.toast === "function") try { return W.toast(m, "check"); } catch (e) {} var t = D.createElement("div"); t.textContent = m; t.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:12px;z-index:2147483200"; D.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200); }
  function dl(name, data, type) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: type });
    try { if (W.Android && Android.saveFile && typeof data === "string") { Android.saveFile(name, data); return tst("اتحفظ: " + name); } } catch (e) {}
    var a = D.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; D.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); tst("اتنزّل: " + name);
  }
  function report4k() {
    var c = D.createElement("canvas"); c.width = 3840; c.height = 2160; var x = c.getContext("2d"), L = days(7), g = goalK(), tw = twin();
    var bg = x.createLinearGradient(0, 0, 3840, 2160); bg.addColorStop(0, "#04120c"); bg.addColorStop(1, "#0b0a1a"); x.fillStyle = bg; x.fillRect(0, 0, 3840, 2160);
    var rg = x.createRadialGradient(3200, 300, 50, 3200, 300, 1600); rg.addColorStop(0, "rgba(251,191,36,.35)"); rg.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = rg; x.fillRect(0, 0, 3840, 2160);
    x.direction = "rtl"; x.textAlign = "right"; x.fillStyle = "#fde68a"; x.font = "800 150px sans-serif"; x.fillText("أسبوعي في سعراتي", 3600, 260);
    x.fillStyle = "rgba(255,255,255,.7)"; x.font = "500 70px sans-serif"; x.fillText(L[6].date.toLocaleDateString("ar-EG", { day: "numeric", month: "long" }) + " – " + L[0].date.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }), 3600, 380);
    var mx = Math.max(g * 1.3, Math.max.apply(0, L.map(function (d) { return d.s.k; }))), bx = 300, bw = 340;
    L.slice().reverse().forEach(function (d, i) { var hh = d.s.k / mx * 1100, X = 3500 - i * 460 - bw; var gr = x.createLinearGradient(0, 1800 - hh, 0, 1800); gr.addColorStop(0, "#fde68a"); gr.addColorStop(1, "#10b981"); x.fillStyle = d.s.k ? gr : "rgba(255,255,255,.08)"; x.fillRect(X, 1800 - Math.max(hh, 12), bw, Math.max(hh, 12)); x.fillStyle = "#fff"; x.textAlign = "center"; x.font = "700 64px sans-serif"; x.fillText(N(d.s.k), X + bw / 2, 1760 - hh - 20); x.fillStyle = "rgba(255,255,255,.65)"; x.font = "500 58px sans-serif"; x.fillText(WD[d.date.getDay()], X + bw / 2, 1900); });
    var gy = 1800 - g / mx * 1100; x.setLineDash([30, 24]); x.strokeStyle = "rgba(253,230,138,.8)"; x.lineWidth = 8; x.beginPath(); x.moveTo(bx, gy); x.lineTo(3540, gy); x.stroke(); x.setLineDash([]);
    x.textAlign = "left"; x.fillStyle = "#6ee7b7"; x.font = "800 90px sans-serif"; x.fillText("الهدف " + N(g), 260, 300); x.fillStyle = "rgba(255,255,255,.75)"; x.font = "600 70px sans-serif"; x.fillText(tw.used ? "حرقك الحقيقي " + N(tw.tdee) : "التوأم الأيضي بيتعلّم", 260, 400);
    x.fillStyle = "rgba(255,255,255,.4)"; x.font = "500 50px sans-serif"; x.fillText("sorati-610ba.web.app", 260, 2080);
    c.toBlob(function (b) { if (!b) return tst("الجهاز ماقدرش يعمل صورة بالحجم ده"); dl("sorati-week-4k.png", b, "image/png"); }, "image/png");
  }

  /* ---------- الشرح المتحرك (بدقة الشاشة لحد 4K) ---------- */
  var STORY = {
    twin: ["الميزان بيتهزّ كل يوم بسبب المية والملح", "التوأم بيفلتر الضوضاء ويطلّع وزنك الحقيقي", "وبيقارن أكلك بتغيّر الوزن الحقيقي", "فيتعلّم حرقك إنت، مش حرق المعادلة", "كل ما تسجّل أكتر، الثقة بتعلى"],
    food: ["كل أكلة بتسجّلها نقطة", "بنجمّع النقط على ٣٠ يوم", "فيبان التوازن والمواعيد والتنوّع", "واقتراحات من أكلك إنت"],
    habit: ["كل يوم مربّع", "المربّع بيعلى على قد التزامك", "السلسلة والنقاط بيتحسبوا لوحدهم", "ويوم الخطر بيبان عشان تستعد له"],
    body: ["طولك ووزنك وسنك", "بيطلّعوا مؤشرات جسمك", "والتغيّر بيتقاس على ٧ و٣٠ و٩٠ يوم", "وبنتأكد إن سرعتك آمنة"],
    tools: ["أدوات بتشتغل بلمسة", "خطة باقي يومك من أكلك", "تصدير ونسخة احتياطية", "وتقرير أسبوعك صورة بدقة 4K"]
  };
  function explain(key) {
    try { if (W.EXPLAIN42 && W.EXPLAIN42.show(key)) return; } catch (e) {}
    var ov = D.createElement("div"); ov.id = "l42ex"; ov.innerHTML = '<canvas></canvas><button class="l42-btn" aria-label="قفل">✕</button>'; D.body.appendChild(ov);
    var cv = ov.querySelector("canvas"), ctx = cv.getContext("2d"), sc = SCENES[key], lines = STORY[key], t0 = performance.now(), raf = 0, P = pts(sc.shape), dur = lines.length * 2.6 + 1;
    function size() { var dpr = Math.min(W.devicePixelRatio || 1, 3840 / Math.max(1, innerWidth), 4); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); } size(); W.addEventListener("resize", size);
    function close() { cancelAnimationFrame(raf); W.removeEventListener("resize", size); ov.remove(); }
    ov.querySelector("button").onclick = close;
    function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function fr(now) {
      var t = Math.max(0, (now - t0) / 1000), w = innerWidth, h = innerHeight, cx = w / 2, cy = h * .42, R = Math.min(w, h) * .26;
      ctx.fillStyle = "#03050a"; ctx.fillRect(0, 0, w, h);
      var step = Math.min(lines.length - 1, Math.floor(t / 2.6)), ph = (t % 2.6) / 2.6, mor = ease(Math.min(1, t / 2.2));
      var gg = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(w, h) * .6); gg.addColorStop(0, hexA(sc.c, .25 + .1 * Math.sin(t * 2))); gg.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = gg; ctx.fillRect(0, 0, w, h);
      var Ry = t * .6, cs = Math.cos(Ry), sn = Math.sin(Ry), cX = Math.cos(.4), sX = Math.sin(.4), O = [];
      for (var i = 0; i < P.length; i++) { var p = P[i], sp = 1 + (1 - mor) * 1.8 * Math.sin(i * 12.9898), x = p[0] * sp, y = p[1] * sp, z = p[2] * sp; if (key === "twin") y += Math.sin(t * 6 + i) * .08 * Math.max(0, 1 - step / 2); var X = x * cs - z * sn, Z = x * sn + z * cs, Y = y * cX - Z * sX; Z = y * sX + Z * cX; var f = 3 / Math.max(.8, 3 + Z); O.push([cx + X * R * f, cy + Y * R * f, Z, f, p[3]]); }
      O.sort(function (a, b) { return b[2] - a[2]; });
      O.forEach(function (o) { ctx.fillStyle = hexA(o[4] ? sc.c2 : sc.c, Math.max(.15, (1.5 - o[2]) / 2)); ctx.beginPath(); ctx.arc(o[0], o[1], Math.max(.5, Math.min(14, 3 * o[3])), 0, 6.283); ctx.fill(); });
      var a = ph < .15 ? ph / .15 : ph > .85 ? (1 - ph) / .15 : 1; if (step === lines.length - 1 && t > (lines.length - 1) * 2.6) a = Math.min(1, ph / .15);
      ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.direction = "rtl"; ctx.font = "800 " + Math.round(Math.min(w, 900) * .055) + "px sans-serif";
      wrap(lines[step], cx, h * .8 - (1 - a) * 20, w * .86, Math.round(Math.min(w, 900) * .07)); ctx.globalAlpha = 1;
      for (var d = 0; d < lines.length; d++) { ctx.fillStyle = d === step ? sc.c : "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.arc(cx + (d - (lines.length - 1) / 2) * 18, h * .92, d === step ? 5 : 3.5, 0, 6.283); ctx.fill(); }
      if (t < dur + 1.2) raf = requestAnimationFrame(fr); else close();
    }
    function wrap(s, x, y, mw, lh) { var ws = s.split(" "), ln = "", L = []; ws.forEach(function (w) { var tt = ln ? ln + " " + w : w; if (ctx.measureText(tt).width > mw && ln) { L.push(ln); ln = w; } else ln = tt; }); L.push(ln); L.forEach(function (l, i) { ctx.fillText(l, x, y + (i - (L.length - 1) / 2) * lh); }); }
    raf = requestAnimationFrame(fr);
  }

  /* ---------- الهيكل ---------- */
  var root = null, stop = null, curP = "twin";
  function open(pid) {
    if (!D.getElementById("l42css")) { var s = D.createElement("style"); s.id = "l42css"; s.textContent = css; D.head.appendChild(s); }
    close(); curP = PAGES.some(function (p) { return p.id === pid; }) ? pid : curP;
    root = D.createElement("div"); root.id = "lab42"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "مختبر سعراتي");
    root.innerHTML = '<div class="l42-hero"><canvas class="l42-3d"></canvas><div class="l42-top"><button class="l42-btn" data-x aria-label="قفل">✕</button><span style="display:flex;gap:8px"><button class="l42-btn" data-st aria-label="الاستوديو">⚙️</button><button class="l42-btn" data-in aria-label="المقدمة">🎬</button><button class="l42-btn l42-gold" data-ex>▶ الشرح بالصوت</button></span></div><div class="l42-ttl"><small></small><h2></h2></div></div><div class="l42-tabs">' + PAGES.map(function (p) { return '<button class="l42-tab" data-p="' + p.id + '">' + p.name + "</button>"; }).join("") + '</div><div class="l42-body"><div class="l42-grid"></div></div>';
    D.body.appendChild(root);
    root.querySelector("[data-x]").onclick = close;
    root.querySelector("[data-ex]").onclick = function () { explain(curP); };
    root.querySelector("[data-st]").onclick = function () { if (W.STUDIO42 && STUDIO42.open) STUDIO42.open(); };
    root.querySelector("[data-in]").onclick = function () { if (W.INTRO42) INTRO42.play(); };
    root.querySelector(".l42-tabs").onclick = function (e) { var b = e.target.closest("[data-p]"); if (b) show(b.dataset.p); };
    show(curP);
    try { history.pushState({ lab42: 1 }, ""); } catch (e) {}
  }
  function show(pid) {
    curP = pid; try { localStorage.setItem("sp42_lab_last", pid); } catch (e) {}
    var P = PAGES.filter(function (p) { return p.id === pid; })[0], sc = SCENES[pid];
    root.style.setProperty("--l42c", sc.c);
    root.querySelectorAll(".l42-tab").forEach(function (b) { b.classList.toggle("on", b.dataset.p === pid); });
    root.querySelector(".l42-ttl small").textContent = P.sub; root.querySelector(".l42-ttl h2").textContent = P.name;
    var grid = root.querySelector(".l42-grid"), html; try { html = P.build(); } catch (e) { html = card(0, "حصلت مشكلة", need(esc(e.message))); }
    grid.innerHTML = html; root.querySelector(".l42-body").scrollTop = 0;
    if (stop) stop(); var extra = null;
    if (pid === "habit") { var g = goalK(); extra = { heat: days(84).reverse().map(function (d) { return d.s.k ? Math.min(1.4, d.s.k / g) : 0; }) }; }
    stop = scene(root.querySelector(".l42-3d"), pid, extra);
    if (P.after) setTimeout(function () { try { P.after(grid); } catch (e) {} }, 30);
  }
  function close() { if (stop) { stop(); stop = null; } if (root) { root.remove(); root = null; } }
  W.addEventListener("popstate", function () { if (root) close(); });

  function fab() {
    if (D.getElementById("l42fab") || localStorage.getItem("sp42_fab") === "off") return;
    if (!D.getElementById("l42css")) { var s = D.createElement("style"); s.id = "l42css"; s.textContent = css; D.head.appendChild(s); }
    var b = D.createElement("button"); b.id = "l42fab"; b.setAttribute("aria-label", "مختبر سعراتي"); b.innerHTML = "<span>🧬</span>"; b.onclick = function () { open(localStorage.getItem("sp42_lab_last") || "twin"); }; D.body.appendChild(b);
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", fab); else fab();
  if (location.hash === "#lab42") setTimeout(function () { open("twin"); }, 400);

  W.LAB42 = { open: open, close: close, explain: explain, twin: twin, report4k: report4k, pages: PAGES.map(function (p) { return p.id; }), count: 50 };
})();
