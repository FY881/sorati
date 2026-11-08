/* v28 — عوالم سعراتي (Worlds) — feature flag: localStorage.sp_ff_worlds28 = "0" disables */
(function () {
  var W = window, D = document, LS = W.localStorage;
  try { if (LS.getItem("sp_ff_worlds28") === "0") return; } catch (e) {}
  if (W.__w28) return; W.__w28 = 1;

  function g(k, d) { try { var v = LS.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function s(k, v) { try { LS.setItem(k, v); } catch (e) {} }
  function el(t, cls, txt) { var n = D.createElement(t); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  var WORLDS = {
    oasis:  { name: "الواحة",          palette: { acc: "#E9B949", acc2: "#2F9E6E", bg: "#1a140b", gl: "rgba(255,236,190,.10)", gb: "rgba(233,185,73,.35)" }, tone: "warm" },
    lab:    { name: "المعمل الزمردي",  palette: { acc: "#2EE6A8", acc2: "#0E8F6A", bg: "#061612", gl: "rgba(46,230,168,.08)",  gb: "rgba(46,230,168,.35)" }, tone: "glass" },
    obs:    { name: "المرصد",          palette: { acc: "#8FA8FF", acc2: "#C38BFF", bg: "#070a1c", gl: "rgba(143,168,255,.08)", gb: "rgba(143,168,255,.35)" }, tone: "cosmic" },
    home:   { name: "البيت الدافئ",    palette: { acc: "#F29E6B", acc2: "#C9644A", bg: "#1b110c", gl: "rgba(242,158,107,.09)", gb: "rgba(242,158,107,.35)" }, tone: "cozy" },
    palace: { name: "القصر",           palette: { acc: "#D4AF37", acc2: "#F5E7A1", bg: "#0a0806", gl: "rgba(212,175,55,.08)",  gb: "rgba(212,175,55,.45)" }, tone: "metal" }
  };
  var ORDER = ["palace", "oasis", "lab", "obs", "home"];
  function cur() { var w = g("sp_w28", "palace"); return WORLDS[w] ? w : "palace"; }

  /* ---------- CSS ---------- */
  function css() {
    if (D.getElementById("w28-css")) return;
    var st = el("style"); st.id = "w28-css";
    st.textContent = [
      ".w28-hero{position:relative;margin:12px 0;padding:16px;border-radius:24px;direction:rtl;font:inherit;color:#fff;",
      "background:linear-gradient(var(--w28-bg),var(--w28-bg)) padding-box,linear-gradient(135deg,var(--w28-acc),var(--w28-acc2),var(--w28-acc)) border-box;",
      "border:1.5px solid transparent;box-shadow:0 10px 40px rgba(0,0,0,.45),inset 0 0 0 999px var(--w28-gl);overflow:hidden}",
      ".w28-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,var(--w28-gb),transparent 60%);opacity:.35;pointer-events:none}",
      ".w28-top{display:flex;justify-content:space-between;align-items:center;gap:8px;position:relative}",
      ".w28-title{font-weight:700;font-size:17px;background:linear-gradient(90deg,var(--w28-acc2),var(--w28-acc));-webkit-background-clip:text;background-clip:text;color:transparent}",
      ".w28-pct{font-weight:700;font-size:15px;color:var(--w28-acc);padding:4px 10px;border-radius:999px;border:1px solid var(--w28-gb);background:var(--w28-gl)}",
      ".w28-cv{display:block;width:100%;height:220px;margin:10px 0;border-radius:18px;background:radial-gradient(80% 70% at 50% 40%,rgba(255,255,255,.04),transparent)}",
      ".w28-bar{height:6px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;position:relative}",
      ".w28-bar>i{display:block;height:100%;background:linear-gradient(90deg,var(--w28-acc),var(--w28-acc2));border-radius:6px;transition:width .6s}",
      ".w28-row{display:flex;gap:8px;margin-top:12px;position:relative}",
      ".w28-btn{flex:1;font:inherit;font-size:13px;font-weight:600;color:var(--w28-acc2);padding:10px 6px;border-radius:14px;cursor:pointer;",
      "border:1px solid var(--w28-gb);background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform .15s}",
      ".w28-btn:active{transform:scale(.96)}",
      ".w28-btn.w28-pri{color:#1a1203;background:linear-gradient(135deg,var(--w28-acc2),var(--w28-acc));border-color:transparent}",
      ".w28-back{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}",
      ".w28-back.w28-on{opacity:1}",
      ".w28-sheet{position:fixed;left:0;right:0;bottom:0;z-index:9999;direction:rtl;font:inherit;color:#fff;max-height:85vh;overflow:auto;padding:18px 16px calc(18px + env(safe-area-inset-bottom));",
      "border-radius:24px 24px 0 0;background:linear-gradient(180deg,rgba(30,24,14,.92),rgba(10,8,6,.97));border-top:1.5px solid var(--w28-gb);",
      "-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);transform:translateY(100%);transition:transform .3s cubic-bezier(.2,.8,.2,1)}",
      ".w28-sheet.w28-on{transform:none}",
      ".w28-grip{width:44px;height:5px;border-radius:5px;background:rgba(255,255,255,.25);margin:0 auto 12px}",
      ".w28-h{font-size:18px;font-weight:700;margin:0 0 12px;color:var(--w28-acc2)}",
      ".w28-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".w28-card{border-radius:18px;padding:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04)}",
      ".w28-card.w28-sel{border-color:var(--w28-acc);box-shadow:0 0 0 1px var(--w28-acc) inset}",
      ".w28-sw{height:70px;border-radius:12px;margin-bottom:8px}",
      ".w28-cn{font-weight:700;font-size:14px;margin-bottom:8px}",
      ".w28-card .w28-btn{width:100%}",
      ".w28-sheet>.w28-btn{display:block;width:100%;margin-top:14px}",
      ".w28-hero{-webkit-column-span:all;column-span:all}",
      ".w28-fld{margin:14px 0}.w28-fld label{display:block;font-size:13px;opacity:.8;margin-bottom:6px}",
      ".w28-seg{display:flex;gap:6px}.w28-seg .w28-btn.w28-sel{color:#1a1203;background:var(--w28-acc)}",
      ".w28-rng{width:100%;accent-color:var(--w28-acc)}",
      ".w28-tg{display:flex;justify-content:space-between;align-items:center}",
      ".w28-tg input{width:22px;height:22px;accent-color:var(--w28-acc)}",
      ".w28-fx{position:fixed;inset:0;z-index:10000;pointer-events:none;width:100vw;height:100vh}",
      /* ---- palace (القصر) hero: black-gold glass ---- */
      "@property --w28a{syntax:'<angle>';inherits:false;initial-value:0deg}",
      "@keyframes w28spin{to{--w28a:360deg}}",
      "@keyframes w28sheen{0%,62%{transform:translateX(-130%) skewX(-18deg)}100%{transform:translateX(230%) skewX(-18deg)}}",
      ".w28-hero.w28-ph{border:0;padding:16px 16px 14px;isolation:isolate;color:#f6ead0;",
      "background:radial-gradient(120% 70% at 50% 0%,rgba(212,175,55,.13),transparent 58%),linear-gradient(170deg,rgba(30,22,10,.94) 0%,rgba(12,9,5,.97) 45%,rgba(6,4,2,.98) 100%);",
      "-webkit-backdrop-filter:blur(16px) saturate(1.25);backdrop-filter:blur(16px) saturate(1.25);",
      "box-shadow:0 22px 60px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,236,180,.14),inset 0 -1px 0 rgba(0,0,0,.6)}",
      ".w28-hero.w28-ph::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1.5px;opacity:1;z-index:3;pointer-events:none;",
      "background:conic-gradient(from var(--w28a),#4a360c 0deg,#b88a22 30deg,#ffe9a8 52deg,#fffbe8 58deg,#ffe9a8 64deg,#b88a22 90deg,#4a360c 150deg,#2c2006 200deg,#a87c1c 250deg,#ffe29a 280deg,#a87c1c 310deg,#4a360c 360deg);",
      "-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:w28spin 9s linear infinite}",
      ".w28-hero.w28-ph::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;",
      "background:linear-gradient(180deg,rgba(255,240,205,.07),transparent 22%,transparent 80%,rgba(212,175,55,.06))}",
      ".w28-ph .w28-top{align-items:center;z-index:4}",
      ".w28-ttl{display:flex;flex-direction:column;line-height:1.45;padding:2px 2px 0;min-width:0}",
      ".w28-ttl small{font-size:12px;font-weight:500;color:rgba(245,226,170,.62)}",
      ".w28-ttl b{display:block;font-size:28px;font-weight:700;line-height:1.5;padding:0 3px 4px;margin-top:-4px;white-space:nowrap;",
      "background:linear-gradient(180deg,#fff7d6 0%,#f4d98a 30%,#c9972e 52%,#8a5f14 60%,#e9c46a 78%,#fff0b8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;",
      "filter:drop-shadow(0 1.5px 0 rgba(0,0,0,.95)) drop-shadow(0 -1px 0 rgba(255,244,210,.22)) drop-shadow(0 0 14px rgba(212,175,55,.28))}",
      ".w28-ring{position:relative;width:60px;height:60px;flex:none}",
      ".w28-ring svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);overflow:visible}",
      ".w28-ring .w28-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:0;background:none;padding:0;font-size:14px;color:#f7e4a6;direction:ltr;",
      "text-shadow:0 1px 0 rgba(0,0,0,.9)}",
      ".w28-ring .w28-arc{transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 0 3px rgba(255,205,110,.75))}",
      ".w28-ph .w28-stage{position:relative;margin:10px -6px 8px;z-index:1}",
      ".w28-ph .w28-cv{height:clamp(236px,30vw,380px);margin:0;border-radius:20px;",
      "-webkit-mask-image:radial-gradient(150% 115% at 50% 46%,#000 58%,transparent 100%);mask-image:radial-gradient(150% 115% at 50% 46%,#000 58%,transparent 100%)}",
      ".w28-ph .w28-cv.w28-alpha{background:radial-gradient(70% 80% at 50% 52%,#2b1e0e,#0b0805 80%)}",
      ".w28-ph .w28-cv:not(.w28-alpha):not(.w28-opaque){background:radial-gradient(70% 80% at 50% 52%,#2b1e0e,#0b0805 80%)}",
      ".w28-ph .w28-bar{display:none}",
      ".w28-ph .w28-row{z-index:4;margin-top:6px}",
      ".w28-ph .w28-btn{color:#f1d98e;border:1px solid rgba(212,175,55,.32);background:linear-gradient(180deg,rgba(255,236,180,.07),rgba(0,0,0,.25));",
      "box-shadow:inset 0 1px 0 rgba(255,240,200,.08)}",
      ".w28-ph .w28-btn.w28-pri{position:relative;overflow:hidden;color:#241703;border:0;",
      "background:linear-gradient(180deg,#fff1bd 0%,#e9c565 38%,#c6942c 70%,#e2b955 100%);box-shadow:0 4px 16px rgba(212,175,55,.28),inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(120,80,10,.5)}",
      ".w28-ph .w28-btn.w28-pri::after{content:'';position:absolute;top:0;bottom:0;width:40%;left:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:w28sheen 5.5s ease-in-out infinite}",
      "@media (prefers-reduced-motion:reduce){.w28-hero.w28-ph::before,.w28-ph .w28-btn.w28-pri::after{animation:none}}",
      "@media (prefers-reduced-motion:reduce){.w28-sheet,.w28-back,.w28-bar>i,.w28-btn{transition:none!important}}"
    ].join("");
    (D.head || D.documentElement).appendChild(st);
  }

  function apply(id) {
    if (!WORLDS[id]) id = "palace";
    s("sp_w28", id);
    var p = WORLDS[id].palette, r = D.documentElement.style;
    r.setProperty("--w28-acc", p.acc); r.setProperty("--w28-acc2", p.acc2);
    r.setProperty("--w28-bg", p.bg); r.setProperty("--w28-gl", p.gl); r.setProperty("--w28-gb", p.gb);
    if (D.body) {
      ORDER.forEach(function (k) { D.body.classList.remove("w28-" + k); });
      D.body.classList.add("w28-" + id);
    }
  }

  /* ---------- Audio ---------- */
  var AC = null;
  function ac() {
    if (!AC) { var C = W.AudioContext || W.webkitAudioContext; if (!C) return null; try { AC = new C(); } catch (e) { return null; } }
    if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function vol() { var v = parseFloat(g("sp_w28v", "0.6")); return isNaN(v) ? 0.6 : Math.max(0, Math.min(1, v)); }
  function tone(c, type, f, t0, dur, gain, out) {
    var o = c.createOscillator(), gn = c.createGain();
    o.type = type; o.frequency.value = f;
    gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(gn); gn.connect(out || c.destination); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  /* palace SFX: Mixkit free-license samples (see w28/palace/CREDITS.txt), synth fallback */
  var SFX = {}, sfxP = null;
  function sfxLoad(c) {
    if (sfxP || !c || !W.fetch) return; sfxP = 1;
    ["tap", "coins", "win"].forEach(function (k) {
      fetch("./w28/palace/sfx/" + k + ".mp3").then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (ab) {
        try { c.decodeAudioData(ab, function (b) { SFX[k] = b; }, function () {}); } catch (e) {}
      }).catch(function () {});
    });
  }
  function sfx(k, gain, delay) {
    var c = AC, b = SFX[k]; if (!c || !b) return false;
    var src = c.createBufferSource(), gn = c.createGain(); src.buffer = b; gn.gain.value = gain;
    src.connect(gn); gn.connect(c.destination); src.start(c.currentTime + (delay || 0)); return true;
  }
  var W28A = {
    tap: function () {
      var v = vol(), c; if (!v || !(c = ac())) return; var t = c.currentTime;
      if (cur() === "palace") { sfxLoad(c); if (sfx("tap", 0.55 * v)) return;
        tone(c, "sine", 1318, t, 0.35, 0.25 * v); tone(c, "sine", 1975, t + 0.01, 0.25, 0.15 * v);
        var len = Math.floor(c.sampleRate * 0.03), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        var n = c.createBufferSource(), ng = c.createGain(), hp = c.createBiquadFilter();
        hp.type = "highpass"; hp.frequency.value = 4000; ng.gain.value = 0.05 * v;
        n.buffer = b; n.connect(hp); hp.connect(ng); ng.connect(c.destination); n.start(t);
      } else tone(c, "sine", 880, t, 0.15, 0.18 * v);
    },
    coins: function (delay) {
      var v = vol(), c; if (!v || !(c = ac())) return; var t = c.currentTime + (delay || 0);
      if (cur() === "palace") { sfxLoad(c); if (sfx("coins", 0.6 * v, delay)) return; }
      for (var i = 0; i < 7; i++) { var st = t + i * 0.06 + Math.random() * 0.03, f = 2400 + Math.random() * 1800; tone(c, "triangle", f, st, 0.18, 0.06 * v); tone(c, "sine", f * 1.5, st, 0.12, 0.03 * v); }
    },
    win: function () {
      var v = vol(), c; if (!v || !(c = ac())) return; var t = c.currentTime;
      if (cur() === "palace") { sfxLoad(c); if (sfx("win", 0.7 * v)) { W28A.coins(0.35); return; } }
      var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(900, t);
      lp.frequency.linearRampToValueAtTime(2600, t + 0.6); lp.Q.value = 0.8; lp.connect(c.destination);
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var st = t + i * 0.14, dur = 1.2 - i * 0.14;
        tone(c, "sawtooth", f, st, dur, 0.09 * v, lp); tone(c, "sawtooth", f * 1.004, st, dur, 0.05 * v, lp);
      });
    }
  };
  W.W28A = W28A;
  function buzz(p) { if (g("sp_w28h", "1") !== "1") return; try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
  W.W28H = { tap: function () { buzz([8]); }, win: function () { buzz([20, 40, 20, 40, 60]); } };
  function tapFx() { W28A.tap(); W.W28H.tap(); }

  /* ---------- Sheets ---------- */
  function sheet(title, build) {
    closeSheet();
    var bk = el("div", "w28-back"), sh = el("div", "w28-sheet");
    sh.setAttribute("role", "dialog"); sh.setAttribute("aria-label", title);
    sh.appendChild(el("div", "w28-grip")); sh.appendChild(el("h3", "w28-h", title));
    build(sh);
    bk.addEventListener("click", closeSheet);
    D.body.appendChild(bk); D.body.appendChild(sh);
    requestAnimationFrame(function () { bk.classList.add("w28-on"); sh.classList.add("w28-on"); });
  }
  function closeSheet() {
    var a = D.querySelectorAll(".w28-back,.w28-sheet");
    for (var i = 0; i < a.length; i++) { (function (n) { n.classList.remove("w28-on"); setTimeout(function () { n.remove(); }, 300); })(a[i]); }
  }
  function btn(txt, cls, fn) { var b = el("button", "w28-btn" + (cls ? " " + cls : ""), txt); b.type = "button"; b.addEventListener("click", function (e) { tapFx(); fn(e); }); return b; }

  function showcase() {
    sheet("عوالم سعراتي", function (sh) {
      var grid = el("div", "w28-cards"), c = cur();
      ORDER.forEach(function (id) {
        var w = WORLDS[id], card = el("div", "w28-card" + (id === c ? " w28-sel" : ""));
        var sw = el("div", "w28-sw");
        sw.style.background = "linear-gradient(135deg," + w.palette.acc + "," + w.palette.acc2 + " 60%," + w.palette.bg + ")";
        card.appendChild(sw); card.appendChild(el("div", "w28-cn", w.name));
        card.appendChild(btn("جرّب العالم", id === c ? "w28-pri" : "", function () { apply(id); closeSheet(); rebuildHero(); }));
        grid.appendChild(card);
      });
      sh.appendChild(grid);
    });
  }

  function settings() {
    sheet("الإعدادات", function (sh) {
      var f1 = el("div", "w28-fld"); f1.appendChild(el("label", null, "جودة العرض"));
      var seg = el("div", "w28-seg"), q = g("sp_w28q", "balanced");
      [["luxury", "فاخرة"], ["balanced", "متوازنة"], ["lite", "خفيفة"]].forEach(function (o) {
        var b = btn(o[1], q === o[0] ? "w28-sel" : "", function () {
          s("sp_w28q", o[0]); var all = seg.children; for (var i = 0; i < all.length; i++) all[i].classList.remove("w28-sel"); b.classList.add("w28-sel");
        }); seg.appendChild(b);
      });
      f1.appendChild(seg); sh.appendChild(f1);
      var f2 = el("div", "w28-fld"); f2.appendChild(el("label", null, "مستوى المؤثرات الصوتية"));
      var r = el("input", "w28-rng"); r.type = "range"; r.min = "0"; r.max = "1"; r.step = "0.05"; r.value = String(vol());
      r.addEventListener("change", function () { s("sp_w28v", r.value); W28A.tap(); });
      f2.appendChild(r); sh.appendChild(f2);
      var f3 = el("div", "w28-fld w28-tg"); f3.appendChild(el("span", null, "الاهتزاز"));
      var cb = el("input"); cb.type = "checkbox"; cb.checked = g("sp_w28h", "1") === "1";
      cb.addEventListener("change", function () { s("sp_w28h", cb.checked ? "1" : "0"); W.W28H.tap(); });
      f3.appendChild(cb); sh.appendChild(f3);
      sh.appendChild(btn("تم", "w28-pri", closeSheet));
    });
  }

  /* ---------- Coin shower ---------- */
  /* palace coin: warm metal shading, raised rim, embossed 8-point star, glint */
  function palCoin(x, c, sx, el2) {
    var r = c.r, face = Math.cos(c.a) > 0, edge = Math.max(1.2, r * 0.18 * Math.abs(Math.sin(c.a)));
    x.save(); x.translate(c.x, c.y);
    x.fillStyle = "#6b4308"; x.beginPath(); x.ellipse(edge * (face ? 1 : -1), 0, sx, r, 0, 0, 6.283); x.fill(); // thickness
    var g = x.createRadialGradient(-sx * 0.35, -r * 0.45, r * 0.1, 0, 0, r * 1.15);
    g.addColorStop(0, "#fff6d2"); g.addColorStop(0.35, "#f6cf62"); g.addColorStop(0.75, "#c28a1f"); g.addColorStop(1, "#7a4c09");
    x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, sx, r, 0, 0, 6.283); x.fill();
    x.strokeStyle = "rgba(255,236,170,.85)"; x.lineWidth = Math.max(0.8, r * 0.1); x.beginPath(); x.ellipse(0, 0, sx * 0.8, r * 0.8, 0, 0, 6.283); x.stroke();
    x.strokeStyle = "rgba(110,66,6,.55)"; x.lineWidth = 0.8; x.beginPath(); x.ellipse(0.6, 0.8, sx * 0.8, r * 0.8, 0, 0, 6.283); x.stroke();
    if (sx > r * 0.35) { // embossed 8-point star
      x.scale(sx / r, 1); x.fillStyle = "rgba(122,76,9,.55)";
      for (var i = 0; i < 2; i++) { x.save(); x.rotate(i * Math.PI / 4); x.fillRect(-r * 0.3, -r * 0.3, r * 0.6, r * 0.6); x.restore(); }
      x.fillStyle = "rgba(255,240,190,.55)";
      for (var j = 0; j < 2; j++) { x.save(); x.translate(-0.7, -0.7); x.rotate(j * Math.PI / 4); x.fillRect(-r * 0.26, -r * 0.26, r * 0.52, r * 0.52); x.restore(); }
      x.setTransform(x.getTransform()); x.scale(r / sx, 1);
    }
    var gl = 0.5 + 0.5 * Math.sin(c.a * 2 + el2 * 0.004);
    if (gl > 0.82) { // star glint
      var L = r * 1.6 * (gl - 0.82) / 0.18; x.globalCompositeOperation = "lighter"; x.strokeStyle = "rgba(255,248,220,.9)"; x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(-sx * 0.3 - L, -r * 0.4); x.lineTo(-sx * 0.3 + L, -r * 0.4); x.moveTo(-sx * 0.3, -r * 0.4 - L); x.lineTo(-sx * 0.3, -r * 0.4 + L); x.stroke();
      x.globalCompositeOperation = "source-over";
    }
    x.restore();
  }
  function luxMoment() {
    W28A.win(); W.W28H.win();
    var pal = cur() === "palace"; // palace: 3D yields the frame budget to the shower; time-based physics
    if (pal && W.W28S && W.W28S.__palacePause) W.W28S.__palacePause(2600);
    var reduce = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = el("canvas", "w28-fx"), dpr = Math.min(W.devicePixelRatio || 1, 2), w = W.innerWidth, h = W.innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; D.body.appendChild(cv);
    var x = cv.getContext("2d"); x.scale(dpr, dpr);
    var N = reduce ? 30 : (g("sp_w28q", "balanced") === "lite" ? 60 : 120), coins = [];
    for (var i = 0; i < N; i++) coins.push({ x: Math.random() * w, y: -Math.random() * h * 0.8 - 20, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2,
      r: 7 + Math.random() * 7, a: Math.random() * 6.28, va: 0.1 + Math.random() * 0.2, b: 0 });
    var t0 = performance.now(), floor = h - 10, tl = t0;
    W.__w28coins = coins;
    function frame(t) {
      var el2 = t - t0, k = pal ? Math.min(6, Math.max(0.25, (t - tl) / 16.67)) : 1; tl = t; x.clearRect(0, 0, w, h);
      var fade = el2 > 2000 ? Math.max(0, 1 - (el2 - 2000) / 500) : 1; x.globalAlpha = fade;
      coins.forEach(function (c) {
        c.vy += 0.35 * k; c.x += c.vx * k; c.y += c.vy * k; c.a += c.va * k;
        if (c.y + c.r > floor && c.vy > 0) { c.y = floor - c.r; c.vy *= -(0.45 - c.b * 0.1); c.vx *= 0.8; c.b++; }
        var sx = Math.abs(Math.cos(c.a)) * c.r + 1;
        if (pal) { palCoin(x, c, sx, el2); return; }
        var gr = x.createLinearGradient(c.x - sx, c.y - c.r, c.x + sx, c.y + c.r);
        gr.addColorStop(0, "#FFF3B0"); gr.addColorStop(0.5, "#D4AF37"); gr.addColorStop(1, "#8A6A12");
        x.fillStyle = gr; x.beginPath(); x.ellipse(c.x, c.y, sx, c.r, 0, 0, 6.283); x.fill();
        x.strokeStyle = "rgba(120,85,10,.8)"; x.lineWidth = 1; x.stroke();
        if (sx > c.r * 0.6) { x.fillStyle = "rgba(255,255,255,.55)"; x.beginPath(); x.ellipse(c.x - sx * 0.3, c.y - c.r * 0.35, sx * 0.25, c.r * 0.18, -0.5, 0, 6.283); x.fill(); }
      });
      if (el2 < 2500) requestAnimationFrame(frame); else cv.remove();
    }
    requestAnimationFrame(frame);
  }
  W.w28Lux = luxMoment;

  /* ---------- Hero ---------- */
  function progress() {
    try {
      var T = W.targets(), c = null;
      try { c = (0, eval)("typeof cur!=='undefined'?cur:null"); } catch (e) {}
      if (!c) c = new Date();
      var k = W.sumDay(W.getDay(W.dkey(c))).k || 0, tgt = T.cal || T.kcal || 2000;
      return Math.max(0, Math.min(1, k / tgt));
    } catch (e) { return 0; }
  }
  var libP = null, sceneStop = null, ARC = 2 * Math.PI * 25;
  function loadScript(src) { return new Promise(function (ok, no) { var sc = D.createElement("script"); sc.src = src; sc.onload = ok; sc.onerror = no; D.head.appendChild(sc); }); }
  function libs() {
    if (!libP) libP = (W.THREE ? Promise.resolve() : loadScript("./w28/three.min.js")).then(function () { return W.W28S ? 0 : loadScript("./w28/scenes.js"); });
    if (cur() === "palace") return libP.then(function () { return (W.W28S && W.W28S.palaceLegacy) ? 0 : loadScript("./w28/palace/scene.js").catch(function (e) { console.warn("w28 palace module", e); }); });
    return libP;
  }
  function startScene(cv, p) {
    if (g("sp_w28q", "balanced") === "lite" && !W.W28S) { /* still load: lite only lowers pixel ratio */ }
    libs().then(function () {
      if (!cv.isConnected || !W.W28S) return;
      if (sceneStop) { try { sceneStop(); } catch (e) {} sceneStop = null; }
      var fn = W.W28S[cur()] || W.W28S.palace;
      try { sceneStop = fn(cv, p, { quality: g("sp_w28q", "balanced") }) || null; } catch (e) { console.warn("w28 scene", e); }
    }).catch(function (e) { console.warn("w28 libs", e); });
  }

  function rebuildHero() { var h = D.querySelector(".w28-hero"), par = h && h.parentNode, nx = h && h.nextSibling; if (sceneStop) { try { sceneStop(); } catch (e) {} sceneStop = null; } if (h) h.remove(); w28Hero(); var n = D.querySelector(".w28-hero"); if (n && par && nx && nx.parentNode === par && n.nextSibling !== nx) par.insertBefore(n, nx); }

  function w28Hero() {
    if (!D.getElementById("t-home")) return;
    css(); apply(cur());
    var p = progress(), pc = Math.round(p * 100), ex = D.querySelector(".w28-hero");
    if (ex) { // update only
      var e1 = ex.querySelector(".w28-pct"), e2 = ex.querySelector(".w28-bar>i"), e3 = ex.querySelector(".w28-arc");
      if (e1) e1.textContent = pc + "%"; if (e2) e2.style.width = pc + "%"; if (e3) { e3.style.strokeDashoffset = String(ARC * (1 - p)); e3.style.opacity = p > 0.005 ? "1" : "0"; }
      if (W.W28S && W.W28S.__setProgress) try { W.W28S.__setProgress(p); } catch (e) {}
      return;
    }
    var anchor = D.getElementById("hero"); if (!anchor || !anchor.parentNode) return;
    var isP = cur() === "palace";
    var hero = el("div", "w28-hero" + (isP ? " w28-ph" : "")), top = el("div", "w28-top"), cv = el("canvas", "w28-cv");
    if (isP) {
      var tt = el("div", "w28-ttl"); tt.appendChild(el("small", null, "عالمك")); tt.appendChild(el("b", null, WORLDS.palace.name)); top.appendChild(tt);
      var ring = el("div", "w28-ring"), NS = "http://www.w3.org/2000/svg";
      ring.innerHTML = '<svg viewBox="0 0 60 60" aria-hidden="true"><defs><linearGradient id="w28g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c0"/><stop offset=".5" stop-color="#e2b24a"/><stop offset="1" stop-color="#a8761c"/></linearGradient></defs>' +
        '<circle cx="30" cy="30" r="25" fill="rgba(0,0,0,.35)" stroke="rgba(212,175,55,.18)" stroke-width="2"/>' +
        '<circle class="w28-arc" cx="30" cy="30" r="25" fill="none" stroke="url(#w28g)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="' + ARC.toFixed(2) + '" stroke-dashoffset="' + (ARC * (1 - p)).toFixed(2) + '" style="opacity:' + (p > 0.005 ? 1 : 0) + '"/></svg>';
      ring.appendChild(el("div", "w28-pct", pc + "%")); ring.setAttribute("role", "img"); ring.setAttribute("aria-label", "التقدّم " + pc + "%");
      top.appendChild(ring); hero.appendChild(top);
      var stg = el("div", "w28-stage"); stg.appendChild(cv); hero.appendChild(stg);
    } else {
      top.appendChild(el("div", "w28-title", "عالمك: " + WORLDS[cur()].name));
      top.appendChild(el("div", "w28-pct", pc + "%"));
      hero.appendChild(top); hero.appendChild(cv);
    }
    var bar = el("div", "w28-bar"), bi = el("i"); bi.style.width = pc + "%"; bar.appendChild(bi); hero.appendChild(bar);
    var row = el("div", "w28-row");
    row.appendChild(btn("العوالم", "", showcase));
    row.appendChild(btn("الإعدادات", "", settings));
    row.appendChild(btn("لحظة فخامة", "w28-pri", luxMoment));
    hero.appendChild(row);
    anchor.parentNode.insertBefore(hero, anchor);
    if ("IntersectionObserver" in W) {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); startScene(cv, p); }
      }); io.observe(cv);
    } else startScene(cv, p);
  }
  W.w28Hero = w28Hero;
  W.w28 = { worlds: WORLDS, apply: function (id) { apply(id); if (D.querySelector(".w28-hero")) rebuildHero(); }, showcase: showcase, settings: settings, lux: luxMoment, hero: w28Hero, close: closeSheet };

  function wrap() {
    if (W.renderHome && !W.renderHome.__v28) {
      var o = W.renderHome;
      W.renderHome = function () { var r = o.apply(this, arguments); try { w28Hero(); } catch (e) {} return r; };
      W.renderHome.__v28 = 1;
    }
  }
  function boot() { try { css(); apply(cur()); wrap(); w28Hero(); } catch (e) { console.warn("w28", e); } }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", boot); else boot();
  setTimeout(boot, 800);
})();
