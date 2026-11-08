/* واتساب سعراتي — chat32.js (فوق chat31.js وشات c23)
   شاشة تحميل فاخرة · أصوات موزّعة حسب العضوية · علامة توثيق حقيقية (الأدمن بيوثّق من السيرفر) · تاج العضوية
   تنسيق النص · رسايل بنجمة · حجم الخط · قفل محادثة برقم سري · ثيمات فقاعات · انفجار إيموجي · خلفيات حصرية
   كل ميزة ليها مستوى (free/premium/black) — الأدمن يقدر يغيّره من «واتساب سعراتي» في Admin ويتزامن عبر Relay31 (/feat) */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.WS32) return;
  var DEP = "https://deputy.sorati-command.workers.dev/v1/app/r31";
  var NAME = "واتساب سعراتي";
  var ld = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  var sv = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var say = function (m) { try { toast(m); } catch (e) {} };
  var LITE = function () { return D.documentElement.classList.contains("lite31"); };
  var RANK = { free: 0, premium: 1, black: 2, off: 9 };
  function myTier() { try { if (typeof tier === "function") return tier(); } catch (e) {} return "free"; }

  // ---------- خريطة المميزات (القيم الافتراضية — الأدمن يقدر يغيّرها) ----------
  var FEAT = {
    ws_splash: ["free", "شاشة تحميل واتساب سعراتي"], ws_sounds: ["free", "أصوات المحادثة"], ws_badge: ["free", "علامة التوثيق والتاج"],
    ws_format: ["free", "تنسيق النص *عريض* _مائل_ ~مشطوب~"], ws_star: ["free", "رسايل بنجمة"], ws_font: ["free", "حجم خط المحادثة"],
    ws_emoji3d: ["free", "إيموجي ثلاثية الأبعاد"], ws_quick: ["free", "ردود سريعة ذكية"], ws_wall_basic: ["free", "3 خلفيات أساسية"],
    ws_snd_crystal: ["premium", "حزمة أصوات كريستال"], ws_lock: ["premium", "قفل المحادثة برقم سري"], ws_theme_gold: ["premium", "فقاعات ذهبية"],
    ws_burst: ["premium", "انفجار الإيموجي"], ws_wall_all: ["premium", "كل الخلفيات"], ws_name_glow: ["premium", "اسمك بيلمع عند الناس"],
    ws_snd_obsidian: ["black", "حزمة أصوات أوبسيديان"], ws_theme_obsidian: ["black", "فقاعات أوبسيديان"], ws_wall_black: ["black", "خلفية بلاك الحصرية"],
    ws_splash_black: ["black", "شاشة تحميل بلاك"],
    c4_on: ["free", "واتساب سعراتي 4.0 (الشات الجديد)"], c4_calls: ["free", "مكالمات صوت وفيديو"], c4_room: ["free", "غرف صوت للجروب (تجريبي)"],
    c4_assist: ["free", "مساعد الكتابة"], c4_tx: ["free", "فويس بنص مكتوب"], c4_food: ["free", "فويس → تسجيل أكل"], c4_sticker: ["free", "صانع الستيكرات"],
    c4_eye: ["free", "كارت وجبة من صورة (عين سعراتي)"], c4_quiz: ["free", "تصويت ذكي وكويز"], c4_live: ["free", "مشيتي لايف"], c4_bots: ["free", "بوتات الجروب"],
    c4_status: ["free", "الحالات الصحية"], c4_buddy: ["free", "صاحب الالتزام"], c4_plan: ["free", "قايمة مشتركة"], c4_ask: ["free", "@سعراتي في الشات"]
  };
  var srv = ld("ws32_feat", {});
  function tierOf(k) { return srv[k] || (FEAT[k] && FEAT[k][0]) || "free"; }
  function can(k) { var t = tierOf(k); if (t === "off") return false; return RANK[myTier()] >= RANK[t]; }
  function upsell(k) { var t = tierOf(k); say((t === "black" ? "🖤 ميزة بلاك" : "👑 ميزة بريميوم") + " — " + (FEAT[k] ? FEAT[k][1] : "")); try { if (typeof tiersOpen === "function") setTimeout(tiersOpen, 700); } catch (e) {} }

  async function r31(path, body) {
    var F = (typeof FB !== "undefined" ? FB : W.FB); if (!F || !F.user) throw new Error("auth");
    await F.token(); var tok = F.tok, uid = F.user.uid; if (!tok) throw new Error("auth");
    var r = await (W.__fetch31 || fetch)(DEP + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({}, body || {}, { uid: uid, idToken: tok })) });
    var d = await r.json().catch(function () { return null; }); if (!d || d.ok === false) throw new Error((d && d.error) || "HTTP " + r.status); return d;
  }
  // مزامنة المستويات + نشر عضويتي (مرة كل 6 ساعات)
  async function sync() {
    try { var f = await r31("/feat", {}); srv = f.feat || {}; sv("ws32_feat", srv); } catch (e) {}
    try { var last = ld("ws32_pub", {}); var t = myTier(); if (last.t !== t || Date.now() - (last.at || 0) > 216e5) { var d = await r31("/badge/set", { tier: t }); sv("ws32_pub", { t: t, at: Date.now(), v: d.verified ? 1 : 0 }); } } catch (e) {}
  }

  // ---------- أصوات (WebAudio — من غير ملفات) ----------
  var AC = null;
  function ac() { try { AC = AC || new (W.AudioContext || W.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) {} return AC; }
  function tone(o) {
    var c = ac(); if (!c) return; var t0 = c.currentTime + (o.at || 0);
    var osc = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    osc.type = o.type || "sine"; osc.frequency.setValueAtTime(o.f, t0); if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + o.d);
    f.type = "lowpass"; f.frequency.value = o.lp || 6000;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(o.v || 0.12, t0 + (o.a || 0.008)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.d);
    osc.connect(f); f.connect(g); g.connect(c.destination); osc.start(t0); osc.stop(t0 + o.d + 0.05);
  }
  function pack() {
    var p = ld("ws32_pack", "auto");
    if (p === "auto") p = can("ws_snd_obsidian") ? "obsidian" : can("ws_snd_crystal") ? "crystal" : "classic";
    if (p === "obsidian" && !can("ws_snd_obsidian")) p = "classic"; if (p === "crystal" && !can("ws_snd_crystal")) p = "classic";
    return p;
  }
  var SND = {
    classic: {
      send: [{ f: 520, f2: 880, d: 0.12, type: "sine", v: 0.1 }], recv: [{ f: 880, d: 0.09, v: 0.1 }, { f: 1175, d: 0.14, at: 0.07, v: 0.08 }],
      open: [{ f: 660, d: 0.15, v: 0.07 }, { f: 990, d: 0.22, at: 0.1, v: 0.06 }], tap: [{ f: 1400, d: 0.04, v: 0.05, type: "triangle" }],
      rec: [{ f: 740, d: 0.08, v: 0.1 }, { f: 988, d: 0.1, at: 0.09, v: 0.1 }], stop: [{ f: 988, d: 0.08, v: 0.1 }, { f: 740, d: 0.1, at: 0.09, v: 0.1 }],
      star: [{ f: 1318, d: 0.1, v: 0.07, type: "triangle" }]
    },
    crystal: {
      send: [{ f: 1046, f2: 2093, d: 0.16, type: "sine", v: 0.08 }, { f: 3136, d: 0.25, at: 0.05, v: 0.03 }],
      recv: [{ f: 1568, d: 0.3, v: 0.08 }, { f: 2093, d: 0.35, at: 0.06, v: 0.06 }, { f: 2637, d: 0.4, at: 0.12, v: 0.04 }],
      open: [{ f: 784, d: 0.4, v: 0.06 }, { f: 1175, d: 0.45, at: 0.09, v: 0.05 }, { f: 1568, d: 0.6, at: 0.18, v: 0.05 }, { f: 2349, d: 0.7, at: 0.27, v: 0.03 }],
      tap: [{ f: 2637, d: 0.08, v: 0.04 }], rec: [{ f: 1175, d: 0.12, v: 0.08 }, { f: 1760, d: 0.18, at: 0.1, v: 0.07 }],
      stop: [{ f: 1760, d: 0.12, v: 0.08 }, { f: 1175, d: 0.18, at: 0.1, v: 0.07 }], star: [{ f: 2093, d: 0.25, v: 0.06 }, { f: 3136, d: 0.3, at: 0.06, v: 0.04 }]
    },
    obsidian: {
      send: [{ f: 196, f2: 392, d: 0.18, type: "triangle", v: 0.12, lp: 1800 }, { f: 784, d: 0.2, at: 0.08, v: 0.04 }],
      recv: [{ f: 294, d: 0.35, type: "triangle", v: 0.11, lp: 1500 }, { f: 587, d: 0.4, at: 0.08, v: 0.06 }],
      open: [{ f: 98, d: 0.7, type: "sawtooth", v: 0.05, lp: 700 }, { f: 392, d: 0.6, at: 0.15, v: 0.06 }, { f: 587, d: 0.8, at: 0.3, v: 0.05 }, { f: 880, d: 0.9, at: 0.45, v: 0.035 }],
      tap: [{ f: 523, d: 0.06, type: "triangle", v: 0.06, lp: 2500 }], rec: [{ f: 330, d: 0.14, type: "triangle", v: 0.1 }, { f: 494, d: 0.16, at: 0.12, v: 0.09 }],
      stop: [{ f: 494, d: 0.14, type: "triangle", v: 0.1 }, { f: 330, d: 0.16, at: 0.12, v: 0.09 }], star: [{ f: 659, d: 0.35, type: "triangle", v: 0.07, lp: 2500 }]
    }
  };
  function snd(k) { if (!can("ws_sounds") || ld("ws32_mute", false)) return; try { (SND[pack()][k] || []).forEach(tone); } catch (e) {} }

  // ---------- CSS ----------
  function css() {
    if (D.getElementById("ws32css")) return;
    var s = D.createElement("style"); s.id = "ws32css"; s.textContent = "" +
      "#ws32sp{position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 40%,#0f3a2c,#050b09 70%);transition:opacity .45s}" +
      "#ws32sp.black{background:radial-gradient(circle at 50% 40%,#2a2410,#030303 70%)}#ws32sp.out{opacity:0;pointer-events:none}" +
      "#ws32sp .ring{width:118px;height:118px;border-radius:50%;position:relative;display:grid;place-items:center}" +
      "#ws32sp .ring::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(#f5c551,#10b981,#f5c551 70%,transparent 72%);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));animation:ws32r 1.1s linear infinite}" +
      "#ws32sp img{width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 0 22px rgba(16,185,129,.55));animation:ws32p 1.6s ease-in-out infinite}" +
      "#ws32sp b{font-size:24px;letter-spacing:.3px;background:linear-gradient(90deg,#fff,#f5c551,#fff);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:200%;animation:ws32g 2.2s linear infinite}" +
      "#ws32sp small{opacity:.7;font-size:12.5px;display:flex;gap:6px;align-items:center}#ws32sp .bar{width:160px;height:3px;border-radius:3px;background:rgba(255,255,255,.1);overflow:hidden}#ws32sp .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#10b981,#f5c551);animation:ws32b var(--d,1.1s) ease-out forwards}" +
      "@keyframes ws32r{to{transform:rotate(1turn)}}@keyframes ws32p{50%{transform:scale(1.06)}}@keyframes ws32g{to{background-position:-200% 0}}@keyframes ws32b{to{width:100%}}" +
      ".vf32{display:inline-block;width:15px;height:15px;vertical-align:-2px;margin-inline-start:4px}.cr32{display:inline-block;width:14px;height:14px;vertical-align:-2px;margin-inline-start:3px}" +
      ".who.g32{background:linear-gradient(90deg,#f5c551,#fff3c4,#f5c551);background-size:200%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:ws32g 3s linear infinite}" +
      ".who.k32{background:linear-gradient(90deg,#cfcfcf,#fff,#8a8a8a);background-size:200%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:ws32g 3s linear infinite}" +
      "#c23 .c23m.st32::after{content:'★';position:absolute;bottom:5px;inset-inline-end:10px;color:#f5c551;font-size:12px}" +
      "html.wsf-s #c23 .c23m{font-size:14px}html.wsf-l #c23 .c23m{font-size:17.5px}html.wsf-xl #c23 .c23m{font-size:20px}" +
      "html.wst-gold #c23 .c23m.me:not(.jumbo31){background:linear-gradient(160deg,#c8962e,#8a6418)!important;color:#fffaf0}" +
      "html.wst-obsidian #c23 .c23m.me:not(.jumbo31){background:linear-gradient(160deg,#1c1c22,#060608)!important;border:1px solid rgba(245,197,81,.45)!important;color:#f7f2e4}" +
      "#ws32lock{position:absolute;inset:0;z-index:58;background:#06100c;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}#ws32lock input{font:inherit;font-size:26px;letter-spacing:12px;text-align:center;width:180px;border-radius:16px;border:1px solid rgba(255,255,255,.15);background:#0f1a16;color:#fff;padding:10px}#ws32lock button{font:inherit;border:0;border-radius:14px;padding:10px 26px;background:#10b981;color:#04110b;font-weight:700}" +
      ".bst32{position:fixed;z-index:9999;pointer-events:none;width:44px;height:44px;animation:ws32u 1.4s cubic-bezier(.2,.7,.3,1) forwards}@keyframes ws32u{to{transform:translate(var(--x),-60vh) rotate(var(--r)) scale(.6);opacity:0}}" +
      "#e31pan .set32{display:flex;flex-direction:column;gap:10px;padding:6px;overflow-y:auto}#e31pan .set32 .row{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13.5px}#e31pan .set32 .opts{display:flex;gap:5px;flex-wrap:wrap}#e31pan .set32 .opts button{font:inherit;font-size:12px;border:1px solid rgba(255,255,255,.14);background:transparent;color:inherit;border-radius:999px;padding:4px 10px}#e31pan .set32 .opts button.on{background:#10b981;color:#04110b;border-color:#10b981}#e31pan .set32 .opts button.lk{opacity:.55}" +
      "html.lite31 #ws32sp .ring::before,html.lite31 #ws32sp img,html.lite31 #ws32sp b,html.lite31 .who.g32,html.lite31 .who.k32{animation:none}";
    D.head.appendChild(s); applyLook();
  }
  var VF = '<svg class="vf32" viewBox="0 0 24 24" aria-label="موثّق"><path fill="#1d9bf0" d="M12 1.8l2.5 1.9 3.1-.3 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.1-.3L12 22.2l-2.5-1.9-3.1.3-1-3L2.8 15.8l1-3-1-3 2.6-1.8 1-3 3.1.3z"/><path d="m8 12.2 2.7 2.7L16.3 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var VF_GOLD = VF.replace("#1d9bf0", "#d4a32c");
  var CROWN = function (c) { return '<svg class="cr32" viewBox="0 0 24 24" aria-hidden="true"><path fill="' + c + '" d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z"/></svg>'; };

  function applyLook() {
    var h = D.documentElement;
    h.classList.remove("wsf-s", "wsf-l", "wsf-xl"); var f = ld("ws32_font", "m"); if (f !== "m") h.classList.add("wsf-" + f);
    h.classList.remove("wst-gold", "wst-obsidian"); var t = ld("ws32_theme", "emerald");
    if (t === "gold" && can("ws_theme_gold")) h.classList.add("wst-gold"); if (t === "obsidian" && can("ws_theme_obsidian")) h.classList.add("wst-obsidian");
  }

  // ---------- شاشة التحميل ----------
  var splashed = false;
  function splash(L) {
    if (splashed || !can("ws_splash")) return; splashed = true;
    var blk = can("ws_splash_black") && myTier() === "black";
    var d = LITE() ? 450 : 1150;
    var sp = D.createElement("div"); sp.id = "ws32sp"; if (blk) sp.className = "black"; sp.style.setProperty("--d", d + "ms");
    sp.innerHTML = '<div class="ring"><img src="logo29.png" alt=""></div><b>' + NAME + '</b><small>🛡 محمي بالوكيل · ' + (myTier() === "black" ? "عضوية بلاك" : myTier() === "premium" ? "عضوية بريميوم" : "مجاني") + '</small><div class="bar"><i></i></div>';
    L.appendChild(sp); snd("open");
    setTimeout(function () { sp.classList.add("out"); setTimeout(function () { sp.remove(); }, 480); }, d);
  }

  // ---------- الشارات ----------
  var BC = ld("ws32_bc", {}), pending = {}, bT = 0;
  function wantBadges(uids) {
    var need = uids.filter(function (u) { var c = BC[u]; return !c || Date.now() - c.at > 6e5; });
    need.forEach(function (u) { pending[u] = 1; });
    if (!need.length || bT) return;
    bT = setTimeout(async function () {
      bT = 0; var ids = Object.keys(pending).slice(0, 60); pending = {};
      try { var d = await r31("/badge/get", { uids: ids }); ids.forEach(function (u) { var m = d.map[u] || { t: "free", v: 0 }; BC[u] = { t: m.t, v: m.v, at: Date.now() }; }); sv("ws32_bc", BC); decorate(); } catch (e) {}
    }, 250);
  }
  function badgeHTML(b) {
    if (!b) return ""; var h = "";
    if (b.v) h += b.t === "black" || b.t === "premium" ? VF_GOLD : VF;
    if (b.t === "black") h += CROWN("#e5e5e5"); else if (b.t === "premium") h += CROWN("#f5c551");
    return h;
  }
  function decorate() {
    if (!can("ws_badge")) return;
    var L = D.getElementById("c23"); if (!L) return; var uids = [];
    Array.prototype.forEach.call(L.querySelectorAll(".c23m"), function (m) {
      var u = m.getAttribute("data-u") || (m.querySelector("[data-u]") || { getAttribute: function () { return ""; } }).getAttribute("data-u");
      if (!u) return; uids.push(u);
      var b = BC[u], who = m.querySelector(".who"); if (!who || !b || who.dataset.b32 === b.t + b.v) return;
      who.dataset.b32 = b.t + b.v; Array.prototype.forEach.call(who.querySelectorAll(".vf32,.cr32"), function (x) { x.remove(); });
      who.insertAdjacentHTML("beforeend", badgeHTML(b));
      who.classList.toggle("g32", b.t === "premium" && tierOk(b.t, "ws_name_glow")); who.classList.toggle("k32", b.t === "black" && tierOk(b.t, "ws_name_glow"));
    });
    if (uids.length) wantBadges(uids.filter(function (v, i, a) { return a.indexOf(v) === i; }));
  }
  function tierOk(t, k) { var need = tierOf(k); return need !== "off" && RANK[t] >= RANK[need]; }

  // ---------- تنسيق النص ----------
  function fmt(m) {
    if (!can("ws_format") || m.dataset.f32) return; m.dataset.f32 = 1;
    var tw = D.createTreeWalker(m, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest && n.parentNode.closest(".mt,.who,.q,a,code") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    var list = [], n; while ((n = tw.nextNode())) if (/[*_~`]/.test(n.nodeValue)) list.push(n);
    list.forEach(function (t) {
      var s = t.nodeValue, re = /(\*[^*\n]{1,300}\*|_[^_\n]{1,300}_|~[^~\n]{1,300}~|`[^`\n]{1,300}`)/g, last = 0, m2, fr = D.createDocumentFragment(), hit = false;
      while ((m2 = re.exec(s))) {
        var tok = m2[0], ch = tok[0], inner = tok.slice(1, -1); if (!inner.trim() || /^\s|\s$/.test(inner)) continue;
        hit = true; if (m2.index > last) fr.appendChild(D.createTextNode(s.slice(last, m2.index)));
        var e = D.createElement(ch === "*" ? "b" : ch === "_" ? "i" : ch === "~" ? "s" : "code"); e.textContent = inner; if (ch === "`") e.style.cssText = "background:rgba(255,255,255,.08);border-radius:6px;padding:0 4px;font-family:monospace";
        fr.appendChild(e); last = m2.index + tok.length;
      }
      if (!hit) return; if (last < s.length) fr.appendChild(D.createTextNode(s.slice(last))); t.parentNode.replaceChild(fr, t);
    });
  }

  // ---------- رسايل بنجمة (دبل تاب) ----------
  var STAR = ld("ws32_star", {});
  function msgKey(m) { var id = m.getAttribute("data-mid") || (m.querySelector("[data-mid]") || { getAttribute: function () { return ""; } }).getAttribute("data-mid"); return id ? curRoom() + ":" + id : ""; }
  function curRoom() { try { var t = D.querySelector("#c23 .c23h b, #c23 .c23h .tt"); return (t && t.textContent.trim().slice(0, 40)) || "r"; } catch (e) { return "r"; } }
  function starable(m) {
    if (m.__s32) return; m.__s32 = 1; var k = msgKey(m); if (k && STAR[k]) m.classList.add("st32");
    m.addEventListener("dblclick", function (e) {
      if (!can("ws_star")) return; var key = msgKey(m) || ("x:" + (m.textContent || "").slice(0, 40)); e.preventDefault();
      if (STAR[key]) { delete STAR[key]; m.classList.remove("st32"); say("اتشالت النجمة"); }
      else { var c = m.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll(".mt"), function (x) { x.remove(); }); Array.prototype.forEach.call(c.querySelectorAll("img.e31"), function (x) { x.replaceWith(x.alt); }); STAR[key] = { t: c.textContent.trim().slice(0, 400), r: curRoom(), at: Date.now() }; m.classList.add("st32"); snd("star"); say("⭐ اتحفظت في الرسايل المميزة"); }
      sv("ws32_star", STAR);
    });
  }
  function starSheet() {
    var ks = Object.keys(STAR).sort(function (a, b) { return STAR[b].at - STAR[a].at; });
    try { openM('<h3 style="margin:0 0 10px">⭐ الرسايل المميزة</h3><div id="st32l"></div>'); } catch (e) { say(ks.length + " رسالة مميزة"); return; }
    var box = D.getElementById("st32l"); if (!box) return;
    if (!ks.length) { var p = D.createElement("p"); p.style.opacity = ".7"; p.textContent = "دبل تاب على أي رسالة عشان تحفظها هنا."; box.appendChild(p); return; }
    ks.forEach(function (k) { var s = STAR[k], d = D.createElement("div"); d.style.cssText = "border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px;margin-bottom:8px";
      var sm = D.createElement("small"); sm.style.opacity = ".6"; sm.textContent = s.r + " · " + new Date(s.at).toLocaleDateString("ar-EG"); var t = D.createElement("div"); t.textContent = s.t; d.appendChild(sm); d.appendChild(t); box.appendChild(d); });
  }

  // ---------- قفل المحادثة ----------
  var LOCKS = ld("ws32_lock", {}), unlocked = {};
  async function h256(s) { var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ws32:" + s)); return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, "0"); }).join(""); }
  function lockGate(L) {
    var r = curRoom(); if (!LOCKS[r] || unlocked[r] || D.getElementById("ws32lock")) return;
    var g = D.createElement("div"); g.id = "ws32lock"; g.innerHTML = '<div style="font-size:42px">🔒</div><b>المحادثة مقفولة</b><input type="password" inputmode="numeric" maxlength="8" autocomplete="off"><button type="button">افتح</button>';
    var C = D.getElementById("c23C") || L; C.style.position = C.style.position || "relative"; C.appendChild(g);
    var inp = g.querySelector("input"), tries = 0; setTimeout(function () { inp.focus(); }, 50);
    var go = async function () { if ((await h256(inp.value)) === LOCKS[r]) { unlocked[r] = 1; g.remove(); snd("open"); } else { tries++; inp.value = ""; say(tries >= 5 ? "محاولات كتير — استنى شوية" : "الرقم غلط"); if (tries >= 5) { inp.disabled = true; setTimeout(function () { inp.disabled = false; tries = 0; }, 30000); } } };
    g.querySelector("button").onclick = go; inp.onkeydown = function (e) { if (e.key === "Enter") go(); };
  }

  // ---------- انفجار الإيموجي ----------
  function burst(src) {
    if (LITE() || !can("ws_burst")) return;
    for (var i = 0; i < 12; i++) { var im = D.createElement("img"); im.className = "bst32"; im.src = src; im.style.left = (20 + Math.random() * 60) + "vw"; im.style.top = (70 + Math.random() * 15) + "vh"; im.style.setProperty("--x", (Math.random() * 40 - 20) + "vw"); im.style.setProperty("--r", (Math.random() * 120 - 60) + "deg"); im.style.animationDelay = (i * 40) + "ms"; D.body.appendChild(im); (function (x) { setTimeout(function () { x.remove(); }, 1700); })(im); }
  }

  // ---------- إعدادات داخل لوحة الإيموجي (تبويب جديد) ----------
  function settingsTab() {
    var pan = D.getElementById("e31pan"); if (!pan || pan.querySelector("[data-id=ws32]")) return;
    var tabs = pan.querySelector(".tabs"); var b = D.createElement("button"); b.type = "button"; b.dataset.id = "ws32"; b.title = "الإعدادات"; b.innerHTML = '<svg class="i31" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>';
    tabs.appendChild(b);
    b.onclick = function () {
      Array.prototype.forEach.call(tabs.children, function (x) { x.classList.toggle("on", x === b); });
      var grid = pan.querySelector(".grid,.walls,.set32"); var box = D.createElement("div"); box.className = "set32"; grid.replaceWith(box);
      var row = function (label, key, opts, feats, def) {
        var r = D.createElement("div"); r.className = "row"; var l = D.createElement("span"); l.textContent = label; var o = D.createElement("div"); o.className = "opts";
        opts.forEach(function (op, i) { var bb = D.createElement("button"); bb.type = "button"; bb.textContent = op[1]; var f = feats && feats[i]; if (f && !can(f)) bb.className = "lk"; if (ld(key, def === undefined ? opts[0][0] : def) === op[0] && !(f && !can(f))) bb.classList.add("on");
          bb.onclick = function () { if (f && !can(f)) return upsell(f); sv(key, op[0]); applyLook(); snd("tap"); b.onclick(); }; o.appendChild(bb); });
        r.appendChild(l); r.appendChild(o); box.appendChild(r);
      };
      row("حجم الخط", "ws32_font", [["s", "صغير"], ["m", "عادي"], ["l", "كبير"], ["xl", "أكبر"]], [0, 0, 0, 0].map(function () { return "ws_font"; }), "m");
      row("الفقاعات", "ws32_theme", [["emerald", "زمردي"], ["gold", "👑 ذهبي"], ["obsidian", "🖤 أوبسيديان"]], [null, "ws_theme_gold", "ws_theme_obsidian"]);
      row("الأصوات", "ws32_pack", [["auto", "تلقائي"], ["classic", "كلاسيك"], ["crystal", "👑 كريستال"], ["obsidian", "🖤 أوبسيديان"]], [null, null, "ws_snd_crystal", "ws_snd_obsidian"]);
      row("الصوت", "ws32_mute", [[false, "شغّال"], [true, "صامت"]]);
      var lr = D.createElement("div"); lr.className = "row"; var r = curRoom(); lr.innerHTML = "<span>قفل المحادثة دي</span>"; var lo = D.createElement("div"); lo.className = "opts"; var lb = D.createElement("button"); lb.type = "button"; lb.textContent = LOCKS[r] ? "🔓 شيل القفل" : "🔒 اقفلها"; if (!can("ws_lock")) lb.className = "lk";
      lb.onclick = async function () { if (!can("ws_lock")) return upsell("ws_lock"); if (LOCKS[r]) { delete LOCKS[r]; sv("ws32_lock", LOCKS); say("اتشال القفل"); b.onclick(); return; } if (lr.querySelector("input")) return; var inp = D.createElement("input"); inp.type = "password"; inp.inputMode = "numeric"; inp.maxLength = 8; inp.placeholder = "4–8 أرقام"; inp.style.cssText = "width:110px;font:inherit;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:#0b1411;color:#fff;padding:4px 8px"; var ok = D.createElement("button"); ok.type = "button"; ok.textContent = "حفظ"; lo.insertBefore(ok, lo.firstChild); lo.insertBefore(inp, lo.firstChild); inp.focus();
        ok.onclick = async function () { var p = inp.value; if (!/^\d{4,8}$/.test(p)) { say("لازم 4 لـ 8 أرقام"); return; } LOCKS[r] = await h256(p); unlocked[r] = 1; sv("ws32_lock", LOCKS); say("🔒 المحادثة اتقفلت"); b.onclick(); }; };
      lo.appendChild(lb); var sb = D.createElement("button"); sb.type = "button"; sb.textContent = "⭐ المميزة"; sb.onclick = starSheet; lo.appendChild(sb); lr.appendChild(lo); box.appendChild(lr);
    };
  }

  // ---------- ربط الأحداث ----------
  var lastCount = -1, wasOn = false;
  function sweep() {
    var L = D.getElementById("c23"); if (!L) return; css();
    var on = L.classList.contains("on");
    if (on && !wasOn) { splash(L); unlocked = {}; } wasOn = on; if (!on) { lastCount = -1; return; }
    lockGate(L); settingsTab();
    var ms = L.querySelectorAll(".c23m");
    Array.prototype.forEach.call(ms, function (m) { fmt(m); starable(m); });
    if (lastCount >= 0 && ms.length > lastCount) { var nw = ms[ms.length - 1]; if (nw.classList.contains("me")) { snd("send"); var j = nw.classList.contains("jumbo31") && nw.querySelector("img.e31"); if (j) burst(j.src); } else snd("recv"); }
    lastCount = ms.length; decorate();
    var title = L.querySelector(".c23L h1, .c23L .c23bar b, .c23L h2"); if (title && !title.dataset.ws32 && /محادث|الشات|Chats|رسايل/.test(title.textContent)) { title.dataset.ws32 = 1; title.textContent = NAME; }
  }
  var raf = 0; var sch = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; sweep(); }); };
  D.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("#c23sb"); if (!t) { if (e.target.closest && e.target.closest("#e31pan .grid button")) snd("tap"); return; }
    var i = t.dataset.i31 || ""; if (i === "mic") snd("rec"); else if (i === "stop") snd("stop");
  }, true);
  function boot() {
    css(); new MutationObserver(function (mu) { for (var i = 0; i < mu.length; i++) { var x = mu[i].target; if (x.id === "c23" || (x.closest && x.closest("#c23"))) { sch(); return; } } }).observe(D.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    setTimeout(sync, 4000); setInterval(sync, 216e5);
  }
  W.WS32 = { name: NAME, feat: FEAT, tierOf: tierOf, can: can, sound: snd, star: starSheet, sync: sync };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", boot); else boot();
})();
