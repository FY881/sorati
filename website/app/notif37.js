/* سعراتي 37.1 — جدول إشعارات موحّد على Android23.remOnce (الدالة الحقيقية في التطبيق: قايمة JSON [{id 400-449, at بالمللي ثانية, title, text}] وبتستبدل القايمة كلها).
   كل ميزة بتسجّل إشعاراتها هنا باسم مجموعة، والجدول بيدمجهم كلهم ويبعتهم مرة واحدة، فمحدش بيمسح إشعارات التاني. */
(() => {
  "use strict";
  const W = window, K = "s37_notif", MAX = 50, BASE = 400;
  const ld = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { return {}; } };
  const sv = (o) => { try { localStorage.setItem(K, JSON.stringify(o)); } catch (e) {} };
  const nat = () => !!(W.Android23 && typeof Android23.remOnce === "function");
  function flush() {
    const o = ld(), now = Date.now(), all = [];
    for (const g in o) { o[g] = (o[g] || []).filter((x) => x && +x.at > now); if (!o[g].length) delete o[g]; else o[g].forEach((x) => all.push(x)); }
    sv(o);
    all.sort((a, b) => a.at - b.at);
    const L = all.slice(0, MAX).map((x, i) => ({ id: BASE + i, at: Math.round(x.at), title: String(x.title || "سعراتي").slice(0, 80), text: String(x.text || "").slice(0, 240) }));
    if (nat()) { try { Android23.remOnce(L.length ? JSON.stringify(L) : "[]"); return true; } catch (e) {} }
    return false;
  }
  const N = {
    available: nat,
    /** يستبدل مجموعة كاملة: items = [{at, title, text}] أو JSON زي الفورمات الأصلي */
    group(g, items) { const o = ld(); let L = items; if (typeof L === "string") { try { L = JSON.parse(L); } catch (e) { L = []; } } o[g] = (Array.isArray(L) ? L : []).map((x) => ({ at: +x.at, title: x.title, text: x.text })); sv(o); return flush(); },
    /** إشعار واحد بمفتاح: بعد sec ثانية */
    once(key, sec, title, text) { const o = ld(); o["k:" + key] = [{ at: Date.now() + Math.max(1, +sec || 0) * 1000, title, text }]; sv(o); return flush(); },
    clear(g) { const o = ld(); delete o[g]; delete o["k:" + g]; sv(o); return flush(); },
    /** بديل Android23.remOnce(json) بتاع الصيام */
    set23(json) { return N.group("fast23", json === "[]" ? [] : json); },
    list: () => ld(), flush,
  };
  W.NOTIF37 = N;
})();
