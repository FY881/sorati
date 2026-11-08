/* سعراتي — الوضع الخفيف v31 (perf31.js)
   بيتحمّل أول سكربت في <head> (متزامن) قبل أي حاجة تانية.
   sp31_lite = "auto" (افتراضي) | "on" | "off"
   تلقائي: جهاز ذاكرته ≤ 4GB أو أنويته ≤ 4 أو توفير البيانات، أو قياس فعلي للفريمات < 42fps.
   في الوضع الخفيف: مفيش 3D (three.js مابيتحمّلش أصلًا)، مفيش blur/ظلال/حركات طويلة، مفيش جسيمات/كونفيتي،
   والصفحات الطويلة بتترسم بس لما تظهر (content-visibility). */
(function () {
  "use strict";
  var W = window, D = document, LS = W.localStorage;
  var g = function (k, d) { try { var v = LS.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  var s = function (k, v) { try { LS.setItem(k, v); } catch (e) {} };
  var mode = g("sp31_lite", "auto");
  var nav = W.navigator || {};
  var mem = +nav.deviceMemory || 0, cores = +nav.hardwareConcurrency || 0;
  var saveData = !!(nav.connection && nav.connection.saveData);
  var weakHW = (mem && mem <= 4) || (cores && cores <= 4) || saveData;
  var autoFps = g("sp31_fps", "") === "slow";
  var on = mode === "on" || (mode === "auto" && (weakHW || autoFps || true)); /* F3: lite default */

  // مفاتيح الإيقاف في الإصدارات القديمة — بنضيف ونشيل بس اللي إحنا ضفناه
  var KEYS = { sp25_off: ["fx"], sp29_off: ["fx"] };
  function syncOff(enable) {
    var added = {}; try { added = JSON.parse(g("sp31_added", "{}")) || {}; } catch (e) { added = {}; }
    Object.keys(KEYS).forEach(function (k) {
      var cur = String(g(k, "")).split(",").map(function (x) { return x.trim(); }).filter(Boolean);
      var mine = added[k] || [];
      if (enable) { KEYS[k].forEach(function (t) { if (cur.indexOf(t) < 0) { cur.push(t); if (mine.indexOf(t) < 0) mine.push(t); } }); }
      else { cur = cur.filter(function (t) { return mine.indexOf(t) < 0; }); mine = []; }
      added[k] = mine; s(k, cur.join(","));
    });
    s("sp31_added", JSON.stringify(added));
  }
  syncOff(on);

  var CSS = "html.lite31 *,html.lite31 *::before,html.lite31 *::after{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;text-shadow:none!important;box-shadow:none!important;animation-duration:.001ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.06s!important;transition-delay:0s!important;scroll-behavior:auto!important}" +
    "html.lite31 [style*='blur(']{filter:none!important}" +
    "html.lite31 .w28-hero canvas,html.lite31 .cf25,html.lite31 .rip25,html.lite31 .cr29 i,html.lite31 #splash.fx29::before,html.lite31 #splash.fx29::after{display:none!important}" +
    "html.lite31 .card,html.lite31 .r29-item,html.lite31 .v30-li{content-visibility:auto;contain-intrinsic-size:auto 120px}" +
    "html.lite31 img{image-rendering:auto}" +
    // لايت: الشيتات والنوافذ بخلفية مصمتة (من غير blur الكلام اللي ورا كان بيبان)
    "html.lite31 body #sheet.sheet,html.lite31 body .sheet,html.lite31 .g29-ov>*,html.lite31 [class*='-sheet']{background:#0e1714!important;background-color:#0e1714!important}" +
    "#sheet .seg{overflow-x:auto;scrollbar-width:none;gap:4px}#sheet .seg::-webkit-scrollbar{display:none}#sheet .seg>button{flex:1 0 auto;white-space:nowrap;font-size:12.5px;padding-inline:10px;min-width:0}" +
    "html.lite31 .modal.on{background:rgba(0,0,0,.6)!important}html.lite31 .g29-ov{background:rgba(2,4,8,.92)!important}" +
    "html.lite31 .w28-hero{background:radial-gradient(120% 90% at 50% 0%,#3a2a08 0%,#120d03 60%,#07080a 100%)!important}" +
    // لكل الأوضاع: الأزرار العايمة ماتغطيش النوافذ المفتوحة + خط الإيموجي احتياطي
    "body:has(.modal.on) #v30fab,body:has(.modal.on) #r29fab,body:has(.modal.on) #c3fab{opacity:0!important;pointer-events:none!important;transform:scale(.6)!important}" +
    ":root{--f25:Plex,'IBM Plex Sans Arabic',system-ui,sans-serif,'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji'}" +
    ".w28-hero button,.w28-hero .w28-btn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#lite31card{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:12px 14px;margin:10px 0;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}" +
    "#lite31card b{display:block;font-size:14.5px}#lite31card small{opacity:.7;font-size:12px}#lite31card select{font:inherit;padding:6px 8px;border-radius:10px;background:transparent;color:inherit;border:1px solid rgba(255,255,255,.2)}";
  var st = D.createElement("style"); st.id = "lite31css"; st.textContent = CSS; (D.head || D.documentElement).appendChild(st);
  function apply(v) {
    D.documentElement.classList.toggle("lite31", !!v);
    var bd = function () { try { D.body.classList.toggle("lite", !!v); D.body.classList.toggle("fast21", !!v); } catch (e) {} };
    if (D.body) bd(); else D.addEventListener("DOMContentLoaded", bd);
  }
  apply(on);

  // في الوضع الخفيف: مانحمّلش three.js خالص — بنحط بدائل فاضية قبل v28
  if (on && !W.THREE) {
    W.THREE = { __lite31: 1 };
    var noop = function () { return function () {}; };
    W.W28S = (typeof Proxy === "function") ? new Proxy({}, { get: function (t, k) { return k === "palaceLegacy" ? noop : noop; } }) : { palace: noop, oasis: noop, lab: noop, obs: noop, home: noop, palaceLegacy: noop };
    s("sp_w28q", "lite");
  }

  // قياس فعلي للفريمات بعد الفتح (مرة كل 3 أيام على الأكتر)
  function probe() {
    if (mode !== "auto" || on) return;
    var last = +g("sp31_probeAt", "0") || 0; if (Date.now() - last < 3 * 864e5) return;
    var n = 0, t0 = 0, worst = 0, prev = 0;
    function f(t) {
      if (!t0) { t0 = prev = t; } else { worst = Math.max(worst, t - prev); prev = t; n++; }
      if (t - t0 < 2500) return requestAnimationFrame(f);
      var fps = n * 1000 / (t - t0);
      s("sp31_probeAt", String(Date.now()));
      if (D.visibilityState === "visible" && fps < 42) {
        s("sp31_fps", "slow"); on = true; apply(true); syncOff(true);
        try { typeof toast === "function" && toast("شغّلنا الوضع الخفيف عشان الجهاز يبقى أسرع ⚡", "info"); } catch (e) {}
      }
    }
    requestAnimationFrame(f);
  }
  W.addEventListener("load", function () { setTimeout(probe, 4000); });

  function set(v) {
    s("sp31_lite", v); if (v === "off") s("sp31_fps", "");
    var en = v === "on" || (v === "auto" && (weakHW || g("sp31_fps", "") === "slow"));
    syncOff(en); apply(en);
    // 3D والحركات المسجلة محتاجة إعادة تشغيل عشان تتغير بالكامل
    setTimeout(function () { try { location.reload(); } catch (e) {} }, 350);
  }

  /* إصلاح 31.1: عناصر بتبدأ opacity:0 وبتظهر بأنيميشن — لما الأنيميشن يتقفل (وضع خفيف/fast21/تقليل الحركة في الجهاز) كانت بتفضل مخفية
     (مركز القوة فاضي، كروت فاضية). بنلاقي القواعد دي من الـ CSS ونجبرها تظهر في الحالات دي بس. */
  var FADE_DONE = {};
  function fixFades() {
    var out = [], rm = [];
    var walk = function (rules) {
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.cssRules && !r.selectorText) { try { walk(r.cssRules); } catch (e) {} continue; }
        if (!r.selectorText || !r.style) continue;
        var op = r.style.getPropertyValue("opacity"), an = r.style.getPropertyValue("animation-name");
        if (String(op).trim() !== "0" || !an || an === "none") continue;
        r.selectorText.split(",").forEach(function (sel) {
          sel = sel.trim(); if (!sel || FADE_DONE[sel] || /::?(before|after|placeholder)/.test(sel) || /:hover|:focus|:active/.test(sel)) return; FADE_DONE[sel] = 1;
          rm.push(sel);
          if (/^(html|body|:root)\b/.test(sel)) return;
          out.push("body.lite " + sel, "body.fast21 " + sel, "html.lite31 " + sel);
        });
      }
    };
    for (var k = 0; k < D.styleSheets.length; k++) { try { walk(D.styleSheets[k].cssRules || []); } catch (e) {} }
    if (!rm.length) return;
    var st = D.createElement("style"); st.className = "fade31";
    st.textContent = (out.length ? out.join(",") + "{opacity:1!important}" : "") + "@media (prefers-reduced-motion:reduce){" + rm.join(",") + "{opacity:1!important}}";
    D.head.appendChild(st);
  }
  var fadeT = 0; var fadeRun = function () { clearTimeout(fadeT); fadeT = setTimeout(fixFades, 120); };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", fadeRun); else fadeRun();
  W.addEventListener("load", fadeRun);
  try { new MutationObserver(function (m) { for (var i = 0; i < m.length; i++) for (var j = 0; j < m[i].addedNodes.length; j++) { var n = m[i].addedNodes[j]; if (n.nodeName === "STYLE" && n.className !== "fade31" || n.nodeName === "LINK") { fadeRun(); return; } } }).observe(D.head || D.documentElement, { childList: true, subtree: true }); } catch (e) {}
  setTimeout(fadeRun, 3000); setTimeout(fadeRun, 9000);
  W.fade31 = fixFades;
  W.lite31 = { get on() { return on; }, mode: function () { return g("sp31_lite", "auto"); }, set: set, hw: { mem: mem, cores: cores, saveData: saveData } };

  // كارت الإعداد في «أنا»
  function card() {
    var me = D.getElementById("t-me"); if (!me || D.getElementById("lite31card")) return;
    var c = D.createElement("div"); c.id = "lite31card";
    var t = D.createElement("div"); var b = D.createElement("b"); b.textContent = "⚡ الوضع الخفيف";
    var sm = D.createElement("small"); sm.textContent = on ? "شغال — التطبيق أسرع وأخف على الجهاز" : "مقفول — كل التأثيرات شغالة";
    t.appendChild(b); t.appendChild(sm);
    var sel = D.createElement("select"); sel.setAttribute("aria-label", "الوضع الخفيف");
    [["auto", "تلقائي"], ["on", "شغال دايمًا"], ["off", "مقفول"]].forEach(function (o) { var op = D.createElement("option"); op.value = o[0]; op.textContent = o[1]; if (o[0] === g("sp31_lite", "auto")) op.selected = true; sel.appendChild(op); });
    sel.onchange = function () { set(sel.value); };
    c.appendChild(t); c.appendChild(sel);
    me.insertBefore(c, me.firstChild ? me.firstChild.nextSibling : null);
  }
  setInterval(function () { if (D.visibilityState === "visible") card(); }, 1500);
})();
