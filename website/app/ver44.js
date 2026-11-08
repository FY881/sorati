/* Ver44 — بطاقة «نسخة سعراتي» في الإعدادات: الاسم، الرقم الحقيقي، ومحدّث/فيه تحديث.
   بتسأل نفس سيرفر القرار c39/boot (الحقيقي، مش محاكاة) وبتعرض الحالة بوضوح. flag: sp_ff_ver44 != "off". */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.VER44) return;
  try { if (localStorage.getItem("sp_ff_ver44") === "off") { W.VER44 = { off: true }; return; } } catch (e) {}
  var B = W.BUILD || {}, APP = B.app === "admin" ? "admin" : "pro", VC = +B.vc || 0, VN = B.vn || "", NAME = APP === "admin" ? "سعراتي أدمن" : "سعراتي برو";
  var API = "https://deputy.sorati-command.workers.dev/v1/app/c39/boot", SITE = "https://sorati-610ba.web.app";
  var mk = function (t, c, x) { var e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var did = (function () { try { var d = localStorage.getItem("s36_did"); if (!d) { d = String(Math.random()).slice(2); localStorage.setItem("s36_did", d); } return d; } catch (e) { return "v44"; } })();

  function css() {
    if (D.getElementById("v44css")) return; var s = mk("style"); s.id = "v44css";
    s.textContent = [
      ".v44{direction:rtl;margin:14px 0;border-radius:22px;padding:18px;position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(16,185,129,.1),rgba(245,196,81,.05));border:1px solid rgba(245,196,81,.25)}",
      ".v44:before{content:'';position:absolute;inset:-40% -20% auto;height:120%;background:radial-gradient(60% 60% at 80% 0,rgba(245,196,81,.18),transparent)}",
      ".v44 .v44t{display:flex;align-items:center;gap:10px;font-weight:800;font-size:15px}",
      ".v44 .v44b{margin-inline-start:auto;font-size:11px;font-weight:700;border-radius:999px;padding:3px 10px}",
      ".v44 .big{font-size:26px;font-weight:900;margin:10px 0 2px;letter-spacing:.3px}",
      ".v44 .sub{color:#9fb4a8;font-size:13px}",
      ".v44 .st{margin-top:14px;display:flex;align-items:center;gap:10px;border-radius:16px;padding:12px 14px;font-weight:700}",
      ".v44 .st.ok{background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.4);color:#86efac}",
      ".v44 .st.up{background:rgba(245,196,81,.14);border:1px solid rgba(245,196,81,.45);color:#fcd34d}",
      ".v44 .st.err{background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.3);color:#cbd5e1}",
      ".v44 .st .dot{width:10px;height:10px;border-radius:50%;flex:none;box-shadow:0 0 12px currentColor;background:currentColor}",
      ".v44 .row{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}",
      ".v44 .btn{flex:1;min-width:130px;border:none;border-radius:14px;padding:12px;font-weight:800;font-size:14px;cursor:pointer}",
      ".v44 .btn.p{background:linear-gradient(135deg,#f5c451,#e0a92e);color:#1a1205}",
      ".v44 .btn.g{background:rgba(255,255,255,.07);color:#e6efe9;border:1px solid rgba(255,255,255,.14)}",
      ".v44 .meta{margin-top:10px;font-size:12px;color:#8aa095;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}",
    ].join("");
    D.head.appendChild(s);
  }

  function render(d) {
    var el = D.getElementById("v44card"); if (!el) return;
    el.innerHTML = "";
    var armed = d && d.live, latest = d ? +d.latestVc || 0 : 0, latestVn = d ? (d.latestVn || "") : "";
    var updated = d && (latest <= VC);
    var act = d ? d.act : "";
    el.appendChild((function () { var h = mk("div", "v44t"); h.appendChild(mk("span", null, "🔒 نسخة " + NAME)); var b = mk("span", "v44b"); b.textContent = armed ? "قفل حقيقي شغّال" : "وضع آمن"; b.style.cssText = armed ? "background:rgba(248,113,113,.18);color:#fca5a5" : "background:rgba(16,185,129,.16);color:#86efac"; h.appendChild(b); return h; })());
    el.appendChild(mk("div", "big", VN ? VN : "—"));
    el.appendChild(mk("div", "sub", "الرقم الحقيقي للنسخة: " + (VC || "؟") + (latestVn ? "  ·  الأحدث: " + latestVn + " (" + latest + ")" : "")));

    var st = mk("div", "st " + (!d ? "err" : updated ? "ok" : "up"));
    st.appendChild(mk("span", "dot"));
    st.appendChild(mk("span", null, !d ? "مش قادر أتأكد من التحديث دلوقتي" : updated ? "نسختك محدّثة ✓ إنت على آخر إصدار" : "فيه تحديث جديد متاح — " + (latestVn || "")));
    el.appendChild(st);

    if (d && act === "force") { var w = mk("div", "st up"); w.style.cssText = "background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.4);color:#fca5a5"; w.appendChild(mk("span", "dot")); w.appendChild(mk("span", null, "النسخة دي اتقفلت رسميًا — لازم تحدّث")); el.appendChild(w); }

    var row = mk("div", "row");
    if (!updated) { var up = mk("button", "btn p", "حمّل التحديث"); up.onclick = function () { try { W.Android && Android.haptic && Android.haptic("medium"); } catch (e) {} open((d && d.url) || (SITE + "/#download"), "_blank"); }; row.appendChild(up); }
    var rc = mk("button", "btn g", "تأكّد تاني"); rc.onclick = function () { rc.textContent = "بنتأكد…"; load().then(function () { rc.textContent = "تأكّد تاني"; }); }; row.appendChild(rc);
    el.appendChild(row);
    el.appendChild((function () { var m = mk("div", "meta"); m.appendChild(mk("span", null, "التطبيق: " + (APP === "admin" ? "أدمن" : "برو"))); m.appendChild(mk("span", null, "آخر فحص: " + new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }))); return m; })());
  }

  async function load() {
    try {
      var r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ app: APP, vc: VC, did: did }) });
      var raw = await r.json(), d = raw && raw.payload ? JSON.parse(raw.payload) : raw;
      render(d);
    } catch (e) { render(null); }
  }

  function mount() {
    var host = D.getElementById(APP === "admin" ? "t-set" : "t-me"); if (!host) return false;
    if (D.getElementById("v44card")) return true;
    css();
    var card = mk("div", "v44"); card.id = "v44card";
    card.appendChild(mk("div", "sub", "جارٍ التحميل…"));
    // في الإعدادات: فوق أول عنصر
    if (host.firstChild) host.insertBefore(card, host.firstChild); else host.appendChild(card);
    load();
    return true;
  }

  W.VER44 = { reload: load, state: function () { return { VC: VC, VN: VN, APP: APP }; } };
  var start = function () { if (!mount()) setTimeout(start, 800); };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
})();
