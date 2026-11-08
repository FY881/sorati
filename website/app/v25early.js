/* سعراتي v25 — يتحمّل في <head> قبل كود التطبيق: توحيد نظام الأرقام في كل التنسيقات */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.__dig25) return; W.__dig25 = 1;
  const OFF = new Set((localStorage.getItem("sp25_off") || "").split(","));
  // ================= 1) الأرقام الموحّدة =================
  // المشكلة: أرقام عربية (٢٬٥١٨) جنب أرقام إنجليزي (15/0) في نفس الشاشة. الحل: كل التنسيقات تمشي بنظام واحد يختاره المستخدم.
  const DIG = localStorage.getItem("sp25_digits") || "latn"; // latn = 123 (الافتراضي)، arab = ١٢٣
  if (!OFF.has("digits")) {
    const fix = (loc) => {
      const l = loc == null ? "ar-EG" : String(loc);
      return /^ar/i.test(l) ? l.replace(/-u-nu-\w+/, "") + "-u-nu-" + DIG : l;
    };
    const NP = Number.prototype.toLocaleString;
    Number.prototype.toLocaleString = function (loc, o) { return NP.call(this, fix(loc), o); };
    const DP = Date.prototype, dl = DP.toLocaleString, dd = DP.toLocaleDateString, dt = DP.toLocaleTimeString;
    DP.toLocaleString = function (l, o) { return dl.call(this, fix(l), o); };
    DP.toLocaleDateString = function (l, o) { return dd.call(this, fix(l), o); };
    DP.toLocaleTimeString = function (l, o) { return dt.call(this, fix(l), o); };
    const NF = Intl.NumberFormat;
    Intl.NumberFormat = function (l, o) { return new NF(fix(l), o); };
    Intl.NumberFormat.prototype = NF.prototype; Intl.NumberFormat.supportedLocalesOf = NF.supportedLocalesOf;
    // نوحّد كمان الأرقام المكتوبة جاهزة في النصوص (مش في الحقول/الأكواد/الإيميلات/المعرّف)
    const AR = "٠١٢٣٤٥٦٧٨٩";
    const RX = DIG === "arab" ? /\d/g : /[٠-٩]/g, HAS = DIG === "arab" ? /\d/ : /[٠-٩]/;
    const map = DIG === "arab" ? (d) => AR[d] : (d) => String(AR.indexOf(d));
    const skip = (n) => !n.parentElement || n.parentElement.closest("input,textarea,code,pre,[data-raw],.sid25,.sidv,script,style,[contenteditable]");
    const conv = (root) => { if (!root) return; if (root.nodeType === 3) { if (HAS.test(root.data) && !skip(root) && !/@|https?:|SR-/.test(root.data)) root.data = root.data.replace(RX, map); return; } const it = D.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = it.nextNode())) if (HAS.test(n.data) && !skip(n) && !/@|https?:|SR-/.test(n.data)) n.data = n.data.replace(RX, map); };
    new MutationObserver((ms) => { for (const m of ms) { if (m.type === "characterData") conv(m.target); else m.addedNodes.forEach(conv); } }).observe(D.documentElement, { childList: true, subtree: true, characterData: true });
  }

})();
