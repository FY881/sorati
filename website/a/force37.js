/* سعراتي — تحديث إجباري للموقع: لو نزل إصدار أحدث من الموقع (release.json → site)، الصفحة بتتحدث لوحدها فورًا.
   بيمسح كاش المتصفح وأي Service Worker، ويفتح نفس الصفحة بنسخة جديدة. لو الكاش لسه قديم بعد المحاولة، بيظهر زرار. */
(() => {
  "use strict";
  const S = document.currentScript, ME = (S && S.dataset.site) || "", D = document;
  if (!ME) return;
  async function clear() {
    try { if (self.caches) for (const k of await caches.keys()) await caches.delete(k); } catch (e) {}
    try { if (navigator.serviceWorker) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); } catch (e) {}
  }
  function overlay(v, auto) {
    if (D.getElementById("f37s")) return;
    const e = D.createElement("div"); e.id = "f37s";
    e.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(2,11,8,.92);color:#eafff6;font-family:inherit;text-align:center;padding:24px";
    const c = D.createElement("div"); c.style.cssText = "max-width:360px";
    const h = D.createElement("h2"); h.textContent = "نسخة جديدة من سعراتي"; h.style.cssText = "color:#fff1c1;margin:0 0 8px";
    const p = D.createElement("p"); p.textContent = auto ? "بنحدّث الموقع للإصدار " + v + "…" : "الإصدار " + v + " جاهز. دوس تحديث.";
    c.append(h, p);
    if (!auto) { const b = D.createElement("button"); b.textContent = "تحديث"; b.style.cssText = "border:0;border-radius:99px;padding:12px 24px;font-weight:800;background:linear-gradient(135deg,#a7f3d0,#10b981);color:#02140d"; b.onclick = () => go(v, true); c.append(b); }
    e.append(c); D.body.append(e);
  }
  async function go(v, again) {
    await clear();
    const u = new URL(location.href); u.searchParams.set("v", v + (again ? "." + Date.now() % 1e5 : ""));
    location.replace(u.toString());
  }
  async function check() {
    try {
      const r = await fetch("/release.json?t=" + Date.now(), { cache: "no-store" }); if (!r.ok) return;
      const j = await r.json(), v = String(j.site || ""); if (!v || v === ME) return;
      if (+v < +ME) return;
      const k = "f37s_" + v;
      if (sessionStorage.getItem(k)) return overlay(v, false);
      sessionStorage.setItem(k, "1"); overlay(v, true); setTimeout(() => go(v), 900);
    } catch (e) {}
  }
  check(); setInterval(check, 5 * 60e3);
  D.addEventListener("visibilitychange", () => { if (!D.hidden) check(); });
})();
