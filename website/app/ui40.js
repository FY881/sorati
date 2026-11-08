/* واجهة 40 (برو + أدمن): تناسق التابلت + المعرّف الواحد.
   - v25 كان بيقسم كل صفحة على التابلت لعمودين (column-count) → كروت بتقع شمال وأماكن فاضية يمين. هنا: عمود واحد في النص، مسافات ثابتة.
   - المعرّف: في سعراتي معرّف واحد بس SR-XXXX-XXXC جاي من السيرفر (deputy /v1/boot). أي رقم قديم (#رقم الشات، رقمك القديم) بيتشال من العرض.
   مفتاح: localStorage sp40_ui = "off". */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.UI40) return;
  try { if (localStorage.getItem("sp40_ui") === "off") { W.UI40 = { off: true }; return; } } catch (e) {}
  var css = [
    "#t-me > #lite31card, #t-me > .l38entry{margin:14px 16px !important;border-radius:28px !important;padding:16px 18px !important}", "#lite31card select{max-width:48%}", "#lite31card b{white-space:nowrap}",
    "@media (min-width:900px){",
    "  .tab.on{column-count:1!important;-webkit-column-count:1!important;max-width:940px!important;margin:0 auto!important;padding:12px 28px 120px!important}",
    "  .tab.on>*{width:auto!important;max-width:none!important;margin-inline:0!important;margin-block:0 16px!important}",
    "  .tab.on>.top{margin-bottom:20px!important}",
    "  body{--rail40:110px} .tab.on{padding-inline-start:calc(28px + var(--rail40) - 40px)!important}",
    "}",
    "@media (min-width:1400px){.tab.on{column-count:1!important;max-width:1020px!important}}",
    ".card,.glass{border-radius:20px}",
    ".card+.card{margin-top:0}",
    ".sid40{display:inline-flex;align-items:center;gap:8px;direction:ltr;font:700 15px/1 ui-monospace,monospace;letter-spacing:1.5px;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}",
  ].join("\n");
  var st = D.createElement("style"); st.id = "ui40css"; st.textContent = css;
  (D.head || D.documentElement).append(st);

  var DEP = "https://deputy.sorati-command.workers.dev/v1";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem("sp40_sids") || "{}"); } catch (e) {}
  var SID40 = {
    mine: function () { return (W.V25 && W.V25.sid) || (function () { try { return localStorage.getItem("sp25_sid"); } catch (e) { return null; } })(); },
    of: function (uid) {
      if (!uid) return Promise.resolve(null);
      if (cache[uid]) return Promise.resolve(cache[uid]);
      return fetch(DEP + "/id/of?uid=" + encodeURIComponent(uid)).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.sid) { cache[uid] = j.sid; try { localStorage.setItem("sp40_sids", JSON.stringify(cache)); } catch (e) {} }
        return (j && j.sid) || null;
      }).catch(function () { return null; });
    },
    verify: function (sid) { return fetch(DEP + "/id/verify?sid=" + encodeURIComponent(sid)).then(function (r) { return r.json(); }).catch(function () { return null; }); },
  };
  W.SID40 = SID40;
  // تنضيف: مفاتيح معرّفات قديمة متخزنة محليًا (مش بتاعة الحساب)
  // مسح المعرّفات القديمة نهائيًا من الجهاز (بموافقة المالك 2026-11-06): يفضل SR بس
  try { ["sp_myid", "sp16_sid", "sp22_sid"].forEach(function (k) { localStorage.removeItem(k); }); var b16 = JSON.parse(localStorage.getItem("sp_b16") || "null"); if (b16 && b16.sid) { delete b16.sid; localStorage.setItem("sp_b16", JSON.stringify(b16)); } if (W.B16 && W.B16.sid) delete W.B16.sid; } catch (e) {}

  // شارة التوثيق + الإطار: جايين من السيرفر (boot.ctl) — مش بيتحطوا من الجهاز
  var VSVG = '<svg viewBox="0 0 24 24" width="20" height="20" aria-label="موثّق"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#fff" d="M10.54 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"/></svg>';
  var FR = { gold: "linear-gradient(135deg,#fde68a,#d97706,#fde68a)", emerald: "linear-gradient(135deg,#6ee7b7,#059669,#a7f3d0)", royal: "linear-gradient(135deg,#c4b5fd,#7c3aed,#f0abfc)", neon: "linear-gradient(135deg,#22d3ee,#a855f7,#f43f5e)" };
  var cs2 = D.createElement("style"); cs2.textContent = ".v40b{display:inline-flex;vertical-align:-4px;margin-inline-start:6px}.fr40{padding:3px;border-radius:50%;background:var(--fr40);box-shadow:0 0 22px rgba(253,230,138,.25)}.fr40>img{border-radius:50%;display:block}.sid25.fr40card{border:2px solid transparent;background:linear-gradient(#0b1020,#0b1020) padding-box,var(--fr40) border-box}"; (D.head || D.documentElement).append(cs2);
  function paintBadge() {
    var c = W.V25 && W.V25.boot && W.V25.boot.ctl; if (!c) return;
    D.querySelectorAll(".sid25 b").forEach(function (b) { if (c.verified && !b.parentNode.querySelector(".v40b")) { var s = D.createElement("span"); s.className = "v40b"; s.innerHTML = VSVG; b.after(s); } });
    var me = D.getElementById("t-me"); if (me && c.verified) { var h = me.querySelector(".top h1, .top h2"); if (h && !h.querySelector(".v40b")) { var s2 = D.createElement("span"); s2.className = "v40b"; s2.innerHTML = VSVG; h.append(s2); } }
    var cc = W.ST41 && W.ST41.colors && W.ST41.colors(c.frame); var f = cc ? "linear-gradient(135deg," + cc.join(",") + ")" : FR[c.frame]; if (f && me) { D.documentElement.style.setProperty("--fr40", f); me.querySelectorAll(".sid25").forEach(function (x) { x.classList.add("fr40card"); }); var av = me.querySelector(".top img, img.av, .avatar img"); if (av && !av.parentNode.classList.contains("fr40")) { var w = D.createElement("span"); w.className = "fr40"; av.parentNode.insertBefore(w, av); w.append(av); } }
  }
  setInterval(paintBadge, 2500);

  // عنوان الصفحة دايمًا أول حاجة (بعض الإضافات القديمة كانت بتحط كروت فوقه)
  function topFirst() { D.querySelectorAll(".tab").forEach(function (t) { var top = t.querySelector(":scope > .top"); if (top && t.firstElementChild !== top) t.prepend(top); }); }
  setInterval(topFirst, 1500); D.addEventListener("DOMContentLoaded", topFirst);
  W.UI40 = { v: 1, paintBadge: paintBadge };
})();
