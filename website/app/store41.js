/* برو 41 «متجر الإطارات والامتيازات» — إطارات 3D حقيقية الحركة (ميلان بالإصبع، لمعة، شرارات، نار، تاج)،
   وبتتفتح بالباقة أو التوثيق أو منحة من الإدارة. مفيش فلوس هنا خالص. القرار كله من السيرفر (deputy /v1/store/*).
   مفتاح: localStorage sp41_store = "off". فتح: ST41.open() */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.ST41) return;
  try { if (localStorage.getItem("sp41_store") === "off") { W.ST41 = { off: true }; return; } } catch (e) {}
  var DEP = "https://deputy.sorati-command.workers.dev/v1";
  var mk = function (t, c, x) { var e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var NEED = { free: "مجاني", pro: "برو", plus: "برو بلس", family: "العيلة", elite: "النخبة الذهبية", verified: "للموثّقين", grant: "بمنحة من الإدارة" };
  var FALL = [{ id: "emerald", name: "زمرّد", need: "free", fx: "glow", colors: ["#6ee7b7", "#059669", "#a7f3d0"] }, { id: "gold", name: "ذهب", need: "pro", fx: "shine", colors: ["#fde68a", "#d97706", "#fef3c7"] }];
  var css = [
    "#st41{position:fixed;inset:0;z-index:2147483000;background:radial-gradient(900px 500px at 80% -10%,rgba(251,191,36,.18),transparent),radial-gradient(700px 500px at 0% 110%,rgba(52,211,153,.16),transparent),#05070e;color:#fff;overflow:auto;direction:rtl;font-family:inherit;animation:st41in .35s ease both}",
    "#st41 .wrap{max-width:820px;margin:0 auto;padding:calc(16px + env(safe-area-inset-top)) 18px 60px}",
    "#st41 .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}",
    "#st41 .hd h2{margin:0;font-size:22px}",
    "#st41 .x{width:42px;height:42px;border-radius:14px;border:0;background:rgba(255,255,255,.08);color:#fff;font-size:20px}",
    "#st41 .stage{height:300px;display:grid;place-items:center;perspective:900px;touch-action:pan-y}",
    ".f41{--s:180px;position:relative;width:var(--s);height:var(--s);transform-style:preserve-3d;transition:transform .2s ease-out}",
    ".f41 .ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from var(--a,0deg),var(--c1),var(--c2),var(--c3),var(--c1));animation:f41spin 6s linear infinite;box-shadow:0 18px 50px -10px var(--c2),inset 0 0 0 2px rgba(255,255,255,.25);transform:translateZ(0)}",
    ".f41 .ring::after{content:'';position:absolute;inset:0;border-radius:50%;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.75) 48%,transparent 60%);background-size:250% 100%;mix-blend-mode:overlay;animation:f41shine 3.2s ease-in-out infinite}",
    ".f41 .face{position:absolute;inset:7%;border-radius:50%;overflow:hidden;background:#0b1020;display:grid;place-items:center;font-weight:800;font-size:calc(var(--s)*.34);line-height:1;color:var(--c1);transform:translateZ(18px);box-shadow:inset 0 6px 18px rgba(0,0,0,.6)}",
    ".f41 .face img{width:100%;height:100%;object-fit:cover}",
    ".f41 .top{position:absolute;left:50%;top:-14%;transform:translate(-50%,0) translateZ(40px);font-size:calc(var(--s)*.26);filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}",
    ".f41.halo .ring{box-shadow:0 0 60px 10px var(--c2),inset 0 0 0 2px rgba(255,255,255,.3)}",
    ".f41.fire .ring{background:conic-gradient(from var(--a,0deg),#fde047,#fb923c,#dc2626,#fb923c,#fde047);filter:saturate(1.3);animation:f41spin 2.4s linear infinite,f41flick .18s steps(2) infinite}",
    ".f41.facets .ring{background:repeating-conic-gradient(from var(--a,0deg),var(--c1) 0 15deg,var(--c2) 15deg 30deg,var(--c3) 30deg 45deg)}",
    ".f41.wave .ring{animation:f41spin 9s linear infinite;filter:blur(.3px) saturate(1.4)}",
    ".f41 .sp{position:absolute;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff;animation:f41tw 1.8s ease-in-out infinite;transform:translateZ(30px)}",
    "@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}",
    "@keyframes f41spin{to{--a:360deg}}",
    "@keyframes f41shine{0%{background-position:150% 0}60%,100%{background-position:-60% 0}}",
    "@keyframes f41flick{50%{filter:saturate(1.6) brightness(1.15)}}",
    "@keyframes f41tw{0%,100%{opacity:0;transform:translateZ(30px) scale(.4)}50%{opacity:1;transform:translateZ(30px) scale(1)}}",
    "@keyframes st41in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}",
    "body.lite .f41 .ring,body.lite .f41 .ring::after,body.lite .f41 .sp{animation:none}",
    "#st41 .nm{text-align:center;margin-top:6px}#st41 .nm b{font-size:20px;display:block}#st41 .nm span{opacity:.7;font-size:14px}",
    "#st41 .eq{display:block;margin:14px auto 0;border:0;border-radius:16px;height:50px;padding:0 26px;font:700 16px/1 inherit;background:linear-gradient(135deg,#6ee7b7,#10b981);color:#04130c;min-width:220px}",
    "#st41 .eq.lock{background:rgba(255,255,255,.1);color:#fff}",
    "#st41 .eq.cur{background:rgba(16,185,129,.18);color:#6ee7b7}",
    "#st41 h3{margin:28px 4px 10px;font-size:15px;opacity:.75}",
    "#st41 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}",
    "#st41 .it{border-radius:20px;padding:14px 8px 12px;text-align:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:#fff;font:inherit;position:relative}",
    "#st41 .it.sel{border-color:#34d399;background:rgba(52,211,153,.08)}",
    "#st41 .it .f41{--s:74px;margin:6px auto 10px}",
    "#st41 .it b{display:block;font-size:14px}#st41 .it small{opacity:.6;font-size:11.5px}",
    "#st41 .it .lk{position:absolute;top:8px;inset-inline-start:10px;font-size:14px;opacity:.8}",
    "#st41 .perks{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}",
    "#st41 .pk{border-radius:18px;padding:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}",
    "#st41 .pk.me{border-color:#fbbf24;background:rgba(251,191,36,.07)}",
    "#st41 .pk b{display:block;margin-bottom:6px}#st41 .pk li{font-size:13px;opacity:.8;line-height:1.7}#st41 .pk ul{margin:0;padding-inline-start:18px}",
    "#st41 .note{opacity:.6;font-size:12.5px;text-align:center;margin-top:18px;line-height:1.7}",
    ".st41card{display:flex;align-items:center;gap:14px;padding:16px;border-radius:20px;border:1px solid rgba(251,191,36,.22);background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(124,58,237,.1));color:inherit;font:inherit;width:100%;text-align:start}",
    ".st41card .f41{--s:52px;flex:none}.st41card b{display:block;font-size:15.5px}.st41card small{opacity:.7}",
  ].join("\n");
  var st = mk("style"); st.id = "st41css"; st.textContent = css; (D.head || D.documentElement).append(st);

  var CAT = null; try { CAT = JSON.parse(localStorage.getItem("sp41_cat") || "null"); } catch (e) {}
  function tok() { try { var f = typeof FB !== "undefined" ? FB : null; return f && f.rt ? Promise.resolve(f.token()) : Promise.resolve(null); } catch (e) { return Promise.resolve(null); } }
  function req(path, body) {
    return tok().then(function (t) {
      return fetch(DEP + path, { method: body ? "POST" : "GET", headers: Object.assign({ "content-type": "application/json" }, t ? { authorization: "Bearer " + t } : {}), body: body ? JSON.stringify(body) : undefined });
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) { var e = new Error(j.error || r.status); e.code = j.error; throw e; } return j; }); });
  }
  function initial() { try { var n = (W.ACC && ACC.name) || (typeof FB !== "undefined" && FB.user && FB.user.name) || (W.S && S.name) || ""; return (n.trim()[0] || "س"); } catch (e) { return "س"; } }
  function photo() { try { var f = typeof FB !== "undefined" ? FB : null; return (f && f.user && (f.user.photo || f.user.photoUrl)) || ""; } catch (e) { return ""; } }
  function frameEl(f, size) {
    var e = mk("div", "f41 " + (f.fx || "")); if (size) e.style.setProperty("--s", size + "px");
    var c = f.colors || ["#6ee7b7", "#059669", "#a7f3d0"]; e.style.setProperty("--c1", c[0]); e.style.setProperty("--c2", c[1]); e.style.setProperty("--c3", c[2]);
    var r = mk("div", "ring"), face = mk("div", "face"), p = photo();
    if (p) { var im = mk("img"); im.src = p; im.alt = ""; im.referrerPolicy = "no-referrer"; im.onerror = function () { im.remove(); face.textContent = initial(); }; face.append(im); } else face.textContent = initial();
    e.append(r, face);
    if (f.fx === "crown") e.append(mk("div", "top", "👑"));
    if (f.fx === "sparkle" || f.fx === "halo") for (var i = 0; i < 6; i++) { var s = mk("div", "sp"), a = i / 6 * Math.PI * 2; s.style.left = (50 + Math.cos(a) * 50) + "%"; s.style.top = (50 + Math.sin(a) * 50) + "%"; s.style.animationDelay = (i * .3) + "s"; e.append(s); }
    return e;
  }
  function open() {
    if (D.getElementById("st41")) return;
    var root = mk("div"); root.id = "st41"; var w = mk("div", "wrap"); root.append(w); D.body.append(root);
    var hd = mk("div", "hd"), x = mk("button", "x", "✕"); x.onclick = function () { root.remove(); }; hd.append(mk("h2", null, "🖼️ الإطارات والامتيازات"), x); w.append(hd);
    var stage = mk("div", "stage"), nm = mk("div", "nm"), eq = mk("button", "eq"); w.append(stage, nm, eq);
    var g1h = mk("h3", null, "كل الإطارات"), grid = mk("div", "grid"), g2h = mk("h3", null, "امتيازات كل باقة"), perks = mk("div", "perks");
    var note = mk("div", "note", "الإطارات بتتفتح بالباقة أو بالتوثيق أو بمنحة من الإدارة في المسابقات. مفيش أي دفع هنا، والقرار من السيرفر فمحدش يقدر يفتح إطار لنفسه.");
    w.append(g1h, grid, g2h, perks, note);
    var data = null, sel = null;
    function tilt(el) {
      stage.onpointermove = function (e) { var r = stage.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; el.style.transform = "rotateY(" + (dx * 40) + "deg) rotateX(" + (-dy * 30) + "deg)"; };
      stage.onpointerleave = function () { el.style.transform = ""; };
      if (W.DeviceOrientationEvent) W.addEventListener("deviceorientation", function o(ev) { if (!D.getElementById("st41")) return W.removeEventListener("deviceorientation", o); if (ev.gamma == null) return; el.style.transform = "rotateY(" + Math.max(-30, Math.min(30, ev.gamma)) + "deg) rotateX(" + Math.max(-25, Math.min(25, (ev.beta || 40) - 40)) + "deg)"; });
    }
    function show(f) {
      sel = f; stage.replaceChildren(); var big = frameEl(f, Math.min(220, innerWidth * .5)); stage.append(big); tilt(big);
      nm.replaceChildren(mk("b", null, f.name), mk("span", null, f.desc || ""));
      var cur = data && data.frame === f.id;
      eq.className = "eq" + (cur ? " cur" : f.ok ? "" : " lock");
      eq.textContent = cur ? "✓ لابسه دلوقتي — اضغط تشيله" : f.ok ? "البسه" : "🔒 " + NEED[f.need];
      eq.onclick = function () {
        if (!data) return; if (!f.ok && !cur) { if (W.toast) toast(f.need === "grant" ? "الإطار ده بيتمنح من الإدارة بس" : "الإطار ده لـ " + NEED[f.need], "lock"); return; }
        eq.disabled = true; req("/store/equip", { frame: cur ? "" : f.id }).then(function (j) { data = j; if (W.V25 && V25.boot && V25.boot.ctl) V25.boot.ctl.frame = j.frame; paint(); show(f); try { navigator.vibrate && navigator.vibrate(18); } catch (e) {} if (W.toast) toast(j.frame ? "الإطار اتلبس" : "الإطار اتشال", "check"); })
          .catch(function (e) { if (W.toast) toast(e.code === "unauthenticated" ? "سجّل دخول الأول" : "ماقدرتش: " + e.message, "info"); }).finally(function () { eq.disabled = false; });
      };
      [].forEach.call(grid.children, function (c) { c.classList.toggle("sel", c.dataset.id === f.id); });
    }
    function paint() {
      grid.replaceChildren();
      (data.items || []).forEach(function (f) {
        var b = mk("button", "it"); b.dataset.id = f.id; b.append(frameEl(f), mk("b", null, f.name), mk("small", null, data.frame === f.id ? "لابسه" : f.ok ? "متاح ليك" : NEED[f.need]));
        if (!f.ok) b.append(mk("span", "lk", "🔒")); b.onclick = function () { show(f); }; grid.append(b);
      });
      perks.replaceChildren();
      ["free", "pro", "plus", "family", "elite"].forEach(function (t) {
        var L = (data.perks || {})[t]; if (!L) return; var c = mk("div", "pk" + (data.plan === t ? " me" : "")), ul = mk("ul");
        L.forEach(function (x) { ul.append(mk("li", null, x)); }); c.append(mk("b", null, NEED[t] + (data.plan === t ? " · باقتك" : "")), ul); perks.append(c);
      });
    }
    var base = { items: (CAT && CAT.items) || FALL, perks: (CAT && CAT.perks) || {}, plan: "free", frame: "" };
    data = { items: base.items.map(function (f) { return Object.assign({ ok: f.need === "free" }, f); }), perks: base.perks, plan: "free", frame: "" };
    paint(); show(data.items.filter(function (f) { return f.id === data.frame; })[0] || data.items[0]);
    req("/store/me").then(function (j) { data = j; paint(); show(j.items.filter(function (f) { return f.id === j.frame; })[0] || j.items[0]); })
      .catch(function () { req("/store/catalog").then(function (c) { localStorage.setItem("sp41_cat", JSON.stringify({ items: c.items, perks: c.perks })); data = { items: c.items.map(function (f) { return Object.assign({ ok: false }, f); }), perks: c.perks, plan: "free", frame: "" }; paint(); show(data.items[0]); note.textContent = "سجّل دخول عشان تلبس إطار. " + note.textContent; }).catch(function () {}); });
  }
  function colors(id) { var L = (CAT && CAT.items) || FALL; var f = L.filter(function (x) { return x.id === id; })[0]; return f ? f.colors : null; }
  // الكارت في «حسابي»
  function card() {
    var me = D.getElementById("t-me"); if (!me || me.querySelector(".st41card")) return;
    var top = me.querySelector(":scope > .top"); if (!top) return;
    var fid = (W.V25 && V25.boot && V25.boot.ctl && V25.boot.ctl.frame) || "emerald", L = (CAT && CAT.items) || FALL, f = L.filter(function (x) { return x.id === fid; })[0] || L[0];
    var b = mk("button", "st41card"), t = mk("div"); t.append(mk("b", null, "الإطارات والامتيازات"), mk("small", null, "إطارات 3D لصورتك + اللي بتفتحه كل باقة"));
    b.append(frameEl(f), t); b.onclick = open; var wrap = mk("div", "card glass"); wrap.style.padding = "0"; wrap.style.background = "none"; wrap.style.border = "0"; wrap.append(b); top.after(wrap);
  }
  setInterval(card, 2000);
  fetch(DEP + "/store/catalog").then(function (r) { return r.json(); }).then(function (c) { if (c && c.items) { CAT = { items: c.items, perks: c.perks }; localStorage.setItem("sp41_cat", JSON.stringify(CAT)); } }).catch(function () {});
  W.ST41 = { open: open, frameEl: frameEl, colors: colors };
})();
