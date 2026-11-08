/* «الجديد» 40 — لوحة سينمائية مع كل تحديث (برو + أدمن)
   - فصول زي الستوريز: شريط تقدّم، تقليب بالسحب/الضغط، تشغيل تلقائي (بيقف لو لمست)، صوت هادي لكل فصل + اهتزاز خفيف، كونفيتي في الآخر.
   - كل فصل فيه أيقونة 3D حقيقية (Fluent) + شرح دقيق + زرار «جرّبها دلوقتي» بياخدك للميزة نفسها.
   - بتظهر مرة واحدة لكل versionCode. الأدمن يقدر يكتب فصول إضافية من السيرفر (cfg.whatsnew[vc]).
   - وضع lite / تقليل الحركة: من غير خلفية متحركة ولا كونفيتي. الصوت بيحترم ساعات الهدوء (11م–8ص) وكتم التطبيق.
   مفتاح: localStorage sp40_wn = "off". فتح يدوي: WN40.show() */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.WN40) return;
  var LS = { g: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, s: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var APP = (W.BUILD && BUILD.app) === "admin" ? "admin" : "pro", VC = String((W.BUILD && BUILD.vc) || 0), VN = (W.BUILD && BUILD.vn) || "";
  var E = function (cp) { return "emoji38/" + cp + ".webp"; };
  var nav = function (t) { return function () { try { go(t); } catch (e) {} }; };
  var DATA = {
    pro: [
      { em: "1f5bc-fe0f", c: "#fbbf24", t: "إطارات 3D لصورتك", d: "متجر إطارات جديد: زمرّد، شفق، ذهب، ياقوت، ملكي بتاج، ألماس بشرارات، هالة الموثّقين، والعنقاء النارية. بتميل مع موبايلك وفيها لمعة حقيقية — وكل باقة بتفتح إطارات وامتيازات أكتر.", a: "افتح المتجر", f: function () { W.ST41 && ST41.open(); } },
      { em: "1f194", c: "#34d399", t: "معرّف واحد ليك وبس", d: "دلوقتي ليك معرّف ثابت واحد شكله SR-XXXX-XXXX، مربوط بحسابك من السيرفر ومش بيتغيّر أبدًا. آخر حرف فيه حرف تحقق، فلو حد كتبه غلط بيتكشف على طول. الأرقام القديمة اتشالت عشان مايبقاش فيه لخبطة.", a: "شوف معرّفك", f: nav("me") },
      { em: "2705", c: "#60a5fa", t: "شارة توثيق حقيقية", d: "الشارة الزرقا بتتمنح من الإدارة وبتتسجّل على السيرفر، وأي حد يقدر يتأكد منها بالمعرّف. يعني محدش يقدر يرسمها لنفسه.", a: "", f: null },
      { em: "1f3a8", c: "#c084fc", t: "شكل أهدى على التابلت", d: "الصفحات بقت عمود واحد في النص بمسافات ثابتة بدل الكروت المتلخبطة يمين وشمال. نفس المحتوى، بس مريح للعين.", a: "", f: null },
      { em: "1f6e1-fe0f", c: "#fbbf24", t: "تحديثات أذكى وأأمن", d: "لو فيه تحديث مهم هتعرف بعدّاد بوقت السيرفر، والإشعارات بتحترم وقت نومك. ومحدش يقدر يتحايل على القرار من الجهاز.", a: "", f: null },
    ],
    admin: [
      { em: "1f451", c: "#fbbf24", t: "النائب الملكي", d: "أمر واحد منك بيتوزّع على مجلس 7 وكلاء في نفس اللحظة: الوزير للأرقام، الحارس للمجتمع، المهندس للأعطال، التاجر للإيراد، المنادي للرسائل، العرّاف للمخاطر، والقاضي بيراجع. كل إجراء بيستنى ضغطتك، ومعاه استوديو صور.", a: "افتح النائب الملكي", f: function () { W.ADM22 && ADM22.open("النائب الملكي"); } },
      { em: "1f5bc-fe0f", c: "#c084fc", t: "منح الإطارات والتوثيق", d: "من المستخدم 360 تقدر توثّق أي حساب أو تمنحه إطار نادر زي العنقاء وتاج المالك. والوضع الموسّع في التحكم بيوريك كل الأدوات حتى النسخ الأقدم.", a: "", f: null },
      { em: "1f451", c: "#fbbf24", t: "الأدمن الموحّد", d: "المركز الذهبي العائم اتشال. كل أقسامه بقت جوه صفحة «التحكم» في شبكة هادية متقسمة لمجموعات، وكل قسم بيتفتح مكانه بزرار رجوع.", a: "افتح التحكم", f: nav("hub") },
      { em: "1f680", c: "#34d399", t: "كل الأقسام شغالة بجد", d: "الأرقام، الطرح التدريجي، الرسائل المستهدفة، سجل التدقيق، الكوبونات، المستخدم 360 — كانت بتكلم سيرفر قديم مش موجود. دلوقتي على سيرفرنا، وكل تغيير بيوصل لبرو فعلًا.", a: "", f: null },
      { em: "1f194", c: "#60a5fa", t: "المستخدم 360 بالمعرّف الواحد", d: "دوّر على أي مستخدم بمعرّفه SR أو إيميله: إيقاف مؤقت، باقة، رسالة شخصية، خروج من كل الأجهزة، وتوثيق بالشارة — وكله بيتسجّل في سلسلة تدقيق مقفولة.", a: "", f: null },
      { em: "1f6e1-fe0f", c: "#f87171", t: "أمان قبل أي قفل", d: "إيقاف نسخة من القسم القديم بيمشي على نفس فحوصات غرفة التحكم. ولحد ما تسلّح الغرفة بنفسك، كل حاجة محاكاة ومفيش قفل حقيقي على حد.", a: "", f: null },
    ],
  };
  var css = [
    "#wn40{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;background:#04060d;color:#fff;font-family:inherit;direction:rtl;opacity:0;transition:opacity .35s}",
    "#wn40.on{opacity:1}",
    "#wn40 canvas{position:absolute;inset:0;width:100%;height:100%}",
    "#wn40 .bars{position:absolute;top:calc(14px + env(safe-area-inset-top));inset-inline:18px;display:flex;gap:6px;z-index:2}",
    "#wn40 .bars i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.18);overflow:hidden}",
    "#wn40 .bars i b{display:block;height:100%;width:0;background:#fff;border-radius:3px}",
    "#wn40 .hd{position:absolute;top:calc(28px + env(safe-area-inset-top));inset-inline:18px;display:flex;justify-content:space-between;align-items:center;z-index:2;font-size:13px;opacity:.75}",
    "#wn40 .hd button{background:rgba(255,255,255,.1);border:0;color:#fff;border-radius:12px;padding:8px 14px;font:inherit}",
    "#wn40 .card{position:relative;z-index:1;width:min(560px,90vw);text-align:center;padding:24px}",
    "#wn40 .em{width:min(190px,44vw);height:min(190px,44vw);margin:0 auto 22px;position:relative}",
    "#wn40 .em img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 24px 40px var(--wc));animation:wnf 4s ease-in-out infinite}",
    "#wn40 .em::after{content:'';position:absolute;inset:18%;border-radius:50%;background:var(--wc);filter:blur(50px);opacity:.45;z-index:-1}",
    "#wn40 h2{display:block!important;text-align:center!important;font-size:clamp(24px,5.4vw,34px);margin:0 0 12px;line-height:1.25}",
    "#wn40 p{text-align:center;font-size:clamp(15px,3.6vw,18px);line-height:1.75;opacity:.86;margin:0 auto;max-width:480px}",
    "#wn40 .cta{margin-top:24px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}",
    "#wn40 .cta button{border:0;border-radius:16px;height:50px;padding:0 22px;font:700 16px/1 inherit;color:#04130c;background:linear-gradient(135deg,#6ee7b7,#34d399)}",
    "#wn40 .cta button.gh{background:rgba(255,255,255,.1);color:#fff}",
    "#wn40 .in{animation:wni .55s cubic-bezier(.2,.8,.2,1) both}",
    "#wn40 .ver{display:inline-block;margin-bottom:14px;padding:6px 12px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.08);letter-spacing:.5px}",
    "@keyframes wni{from{opacity:0;transform:translateY(26px) scale(.96)}to{opacity:1;transform:none}}",
    "@keyframes wnf{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}",
    "body.lite #wn40 .em img,#wn40.rm .em img{animation:none}",
  ].join("\n");
  var lite = function () { return D.body.classList.contains("lite") || (W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); };
  var quiet = function () { var h = new Date().getHours(); return h >= 23 || h < 8 || LS.g("sp_mute") === "1" || LS.g("sp25_snd") === "off"; };
  var AC = null;
  function tone(i) {
    if (quiet()) return;
    try {
      AC = AC || new (W.AudioContext || W.webkitAudioContext)();
      var base = [523.25, 587.33, 659.25, 783.99, 880][i % 5], t = AC.currentTime;
      [1, 1.5].forEach(function (m, k) {
        var o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.value = base * m;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(k ? .025 : .06, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .9);
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 1);
      });
    } catch (e) {}
  }
  var vib = function (n) { try { W.Android && Android.haptic ? Android.haptic() : navigator.vibrate && navigator.vibrate(n || 12); } catch (e) {} };

  function aurora(cv, colorRef) {
    var x = cv.getContext("2d"), dpr = Math.min(2, W.devicePixelRatio || 1), run = true, t0 = performance.now(), parts = [];
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    size(); addEventListener("resize", size);
    for (var i = 0; i < 46; i++) parts.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.8, s: .02 + Math.random() * .05 });
    (function fr(now) {
      if (!run) return; var t = (now - t0) / 1000, w = cv.width, h = cv.height;
      x.fillStyle = "#04060d"; x.fillRect(0, 0, w, h);
      var c = colorRef();
      [[.25, .3, c], [.75, .7, "#6366f1"], [.5, .1, "#0ea5e9"]].forEach(function (b, k) {
        var gx = (b[0] + Math.sin(t * .25 + k) * .12) * w, gy = (b[1] + Math.cos(t * .2 + k * 2) * .1) * h, g = x.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * .55);
        g.addColorStop(0, b[2] + "55"); g.addColorStop(1, "transparent"); x.fillStyle = g; x.fillRect(0, 0, w, h);
      });
      x.fillStyle = "rgba(255,255,255,.55)";
      parts.forEach(function (p) { p.y -= p.s / 60; if (p.y < 0) p.y = 1; x.beginPath(); x.arc(p.x * w, p.y * h, p.r * dpr, 0, 6.29); x.fill(); });
      requestAnimationFrame(fr);
    })(t0);
    return function () { run = false; removeEventListener("resize", size); };
  }
  function confetti(root) {
    if (lite()) return; var cv = D.createElement("canvas"); cv.style.cssText = "position:absolute;inset:0;z-index:3;pointer-events:none"; root.append(cv);
    var x = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight; var P = [], C = ["#34d399", "#fbbf24", "#60a5fa", "#f472b6", "#fff"];
    for (var i = 0; i < 140; i++) P.push({ x: innerWidth / 2, y: innerHeight * .45, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 3, c: C[i % 5], r: Math.random() * 6.3, s: 4 + Math.random() * 5 });
    var n = 0; (function fr() { x.clearRect(0, 0, cv.width, cv.height); P.forEach(function (p) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); }); if (++n < 150) requestAnimationFrame(fr); else cv.remove(); })();
  }

  function show(extra) {
    if (D.getElementById("wn40")) return;
    var L = DATA[APP].slice(); if (extra && extra.length) L = L.concat(extra);
    if (!D.getElementById("wn40css")) { var st = D.createElement("style"); st.id = "wn40css"; st.textContent = css; D.head.append(st); }
    var root = D.createElement("div"); root.id = "wn40"; if (lite()) root.classList.add("rm");
    var cur = 0, stopBg = null, timer = null, startAt = 0, paused = false, DUR = 9000;
    var cv = D.createElement("canvas"); root.append(cv);
    if (!lite()) stopBg = aurora(cv, function () { return L[cur].c || "#34d399"; }); else root.style.background = "radial-gradient(900px 500px at 70% 10%,rgba(52,211,153,.25),transparent),#04060d";
    var bars = D.createElement("div"); bars.className = "bars"; L.forEach(function () { var i = D.createElement("i"); i.append(D.createElement("b")); bars.append(i); });
    var hd = D.createElement("div"); hd.className = "hd"; var lbl = D.createElement("span"); lbl.textContent = (APP === "admin" ? "لوحة سعراتي " : "سعراتي ") + VN;
    var skip = D.createElement("button"); skip.textContent = "تخطّي"; skip.onclick = close; hd.append(lbl, skip);
    var card = D.createElement("div"); card.className = "card";
    root.append(bars, hd, card); D.body.append(root);
    requestAnimationFrame(function () { root.classList.add("on"); });
    function paint() {
      var c = L[cur]; root.style.setProperty("--wc", c.c || "#34d399");
      card.innerHTML = ""; var w = D.createElement("div"); w.className = "in";
      var v = D.createElement("span"); v.className = "ver"; v.textContent = "الجديد · " + (cur + 1) + " من " + L.length;
      var em = D.createElement("div"); em.className = "em"; var im = D.createElement("img"); im.alt = ""; im.src = c.img || E(c.em || "2728"); im.onerror = function () { im.remove(); em.textContent = "✨"; em.style.fontSize = "120px"; }; em.append(im);
      var h = D.createElement("h2"); h.textContent = c.t; var p = D.createElement("p"); p.textContent = c.d;
      var cta = D.createElement("div"); cta.className = "cta";
      if (c.f) { var a = D.createElement("button"); a.textContent = c.a || "جرّبها دلوقتي"; a.onclick = function (e) { e.stopPropagation(); close(); setTimeout(c.f, 250); }; cta.append(a); }
      var nx = D.createElement("button"); nx.className = c.f ? "gh" : ""; nx.textContent = cur === L.length - 1 ? "يلا بينا" : "التالي"; nx.onclick = function (e) { e.stopPropagation(); next(); }; cta.append(nx);
      w.append(v, em, h, p, cta); card.append(w);
      [].forEach.call(bars.children, function (b, i) { b.firstChild.style.transition = "none"; b.firstChild.style.width = i < cur ? "100%" : "0"; });
      tone(cur); vib(10); startAt = performance.now(); tick();
    }
    function tick() {
      cancelAnimationFrame(timer);
      (function f(now) {
        if (!D.getElementById("wn40")) return;
        if (paused) { startAt += 16; timer = requestAnimationFrame(f); return; }
        var k = Math.min(1, (now - startAt) / DUR); bars.children[cur].firstChild.style.width = (k * 100) + "%";
        if (k >= 1) { if (cur < L.length - 1) next(); return; }
        timer = requestAnimationFrame(f);
      })(performance.now());
    }
    function next() { if (cur < L.length - 1) { cur++; paint(); } else { confetti(root); vib(30); setTimeout(close, 900); } }
    function prev() { if (cur > 0) { cur--; paint(); } }
    function close() { cancelAnimationFrame(timer); stopBg && stopBg(); root.classList.remove("on"); setTimeout(function () { root.remove(); }, 380); LS.s("sp40_wn_" + APP, VC); }
    var sx = 0;
    root.addEventListener("pointerdown", function (e) { sx = e.clientX; paused = true; });
    root.addEventListener("pointerup", function (e) {
      paused = false; var dx = e.clientX - sx;
      if (e.target.closest("button")) return;
      if (Math.abs(dx) > 50) { dx > 0 ? next() : prev(); return; } // RTL: سحب يمين = التالي
      e.clientX < innerWidth / 2 ? next() : prev();
    });
    D.addEventListener("keydown", function k(e) { if (!D.getElementById("wn40")) return D.removeEventListener("keydown", k); if (e.key === "Escape") close(); if (e.key === "ArrowLeft") next(); if (e.key === "ArrowRight") prev(); });
    paint();
  }
  function maybe() {
    if (LS.g("sp40_wn") === "off" || LS.g("sp40_wn_" + APP) === VC) return;
    LS.s("sp26_news", VC); // اللوحة القديمة (v26) ماتظهرش جنبها
    var srv = null; try { srv = W.V25 && V25.boot && V25.boot.cfg && V25.boot.cfg.whatsnew; } catch (e) {}
    var extra = srv && Array.isArray(srv.chapters) ? srv.chapters.slice(0, 6).map(function (c) { return { em: String(c.em || "2728").replace(/[^0-9a-f-]/gi, ""), c: /^#[0-9a-f]{6}$/i.test(c.c) ? c.c : "#34d399", t: String(c.t || "").slice(0, 60), d: String(c.d || "").slice(0, 400) }; }) : null;
    show(extra);
  }
  // بعد ما التطبيق يفتح ويستقر (ومش فوق شاشة دخول أو قفل)
  function wait(n) {
    var blocked = D.getElementById("blk25") || D.getElementById("c39lock") || (D.getElementById("gate") && D.getElementById("gate").innerHTML.trim()) || D.querySelector(".modal.on");
    if (blocked && n < 40) return setTimeout(function () { wait(n + 1); }, 1500);
    if (!blocked) maybe();
  }
  LS.s("sp26_news", VC); ["sp36_new", "sp_tour9"].forEach(function (k) { LS.s(k, "1"); }); // اللوحات القديمة اتشالت لصالح دي
  D.readyState === "loading" ? D.addEventListener("DOMContentLoaded", function () { setTimeout(function () { wait(0); }, 2600); }) : setTimeout(function () { wait(0); }, 2600);
  W.WN40 = { show: show, data: DATA };
})();
