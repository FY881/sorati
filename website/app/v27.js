/* سعراتي v27 — تنفيذ أوامر مركز القيادة لحظيًا جوه التطبيق:
   وضع الصيانة · بانر الحملة/العرض المحدود بعدّاد وكود · رسالة ترحيب للجداد · العضويات الحية (الأسعار من اللوحة) · تجميد المحادثة
   إيقاف: localStorage sp27_off = "maint,promo,welcome,plans" */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.V27 || !(W.BUILD && BUILD.app !== "admin")) return;
  const OFF = new Set((localStorage.getItem("sp27_off") || "").split(","));
  const el = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ic = (n) => { const s = el("span", "i25"); if (typeof ICONS !== "undefined" && ICONS[n]) { const t = D.createElement("template"); t.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[n] + "</svg>"; s.append(t.content.firstChild); } return s; };
  const say = (m, i) => { try { toast(m, i || "info"); } catch (e) {} };
  const css = `
#maint27{position:fixed;inset:0;z-index:99990;background:radial-gradient(800px 500px at 50% 0%,rgba(16,185,129,.18),transparent 60%),#05070d;color:#e7fff5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;gap:14px}
#maint27 img{width:96px;height:96px;border-radius:26px;animation:br27 2.4s ease-in-out infinite}
#maint27 h2{margin:6px 0 0;font-size:24px}#maint27 p{opacity:.75;max-width:420px;line-height:1.8;margin:0}
#maint27 .cd{font-size:30px;font-weight:800;color:#6ee7b7;letter-spacing:1px}
#maint27 button{border:0;border-radius:16px;padding:12px 20px;font:inherit;font-weight:800;background:#10b981;color:#022c22}
@keyframes br27{50%{transform:scale(1.06)}}
.tab.on>.promo27{column-span:all;-webkit-column-span:all}
.promo27 .x26{position:absolute;top:10px;inset-inline-end:12px;border:0;background:none;color:inherit;opacity:.6;font-size:20px}
.promo27{background:linear-gradient(135deg,rgba(245,196,81,.2),rgba(16,185,129,.14));border:1px solid rgba(245,196,81,.4)}
.promo27 .cd27{display:flex;gap:8px;margin:10px 0;direction:ltr;justify-content:flex-end}
.promo27 .cd27 span{background:rgba(0,0,0,.35);border-radius:12px;padding:6px 10px;min-width:44px;text-align:center;font-weight:800;font-size:18px;color:#fde68a}
.promo27 .cd27 small{display:block;font-size:10px;opacity:.65;font-weight:600;color:#fff}
.promo27 img.hero27{width:100%;max-height:200px;object-fit:cover;border-radius:16px;margin-bottom:10px}
.promo27 .code27{display:inline-flex;align-items:center;gap:8px;border:1px dashed rgba(253,230,138,.6);border-radius:12px;padding:8px 12px;font-weight:800;letter-spacing:1px;color:#fde68a;background:none;font-family:inherit}
.plans27{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.plan27{border-radius:20px;padding:16px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);display:flex;flex-direction:column;gap:8px}
.plan27.t-elite{border-color:rgba(245,196,81,.55);background:linear-gradient(160deg,rgba(245,196,81,.14),rgba(255,255,255,.02))}
.plan27.t-pro{border-color:rgba(16,185,129,.5)}
.plan27 .pr{font-size:28px;font-weight:800}.plan27 .pr small{font-size:13px;opacity:.6;font-weight:600}
.plan27 ul{margin:0;padding:0 18px 0 0;line-height:1.9;font-size:13.5px;opacity:.85}
.yr27{display:flex;gap:6px;background:rgba(255,255,255,.06);border-radius:14px;padding:4px;margin:6px 0 12px}
.yr27 button{flex:1;border:0;border-radius:11px;padding:9px;font:inherit;font-weight:800;background:none;color:inherit}
.yr27 button.on{background:#10b981;color:#022c22}
@media (prefers-reduced-motion:reduce){#maint27 img{animation:none}}
`;
  const st = el("style"); st.textContent = css; (D.head || D.documentElement).append(st);

  // ===== الصيانة =====
  function maint(m) {
    D.getElementById("maint27")?.remove();
    if (!m || OFF.has("maint")) return;
    const o = el("div"); o.id = "maint27"; const lg = el("img"); lg.src = "logo.png"; lg.alt = "";
    const cd = el("div", "cd");
    const re = el("button", null, "جرّب تاني"); re.onclick = () => location.reload();
    o.append(lg, el("h2", null, "سعراتي بيتجدد"), el("p", null, m.text || "بنحسّن التطبيق — راجعين خلال دقايق. بياناتك في أمان."), cd, re); D.body.append(o);
    if (m.until) { const t = setInterval(() => { const s = Math.max(0, Math.round((m.until - Date.now()) / 1000)); cd.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); if (!s) { clearInterval(t); location.reload(); } }, 1000); }
  }
  // ===== الحملة / العرض المحدود =====
  function promo(p) {
    D.getElementById("promo27")?.remove();
    if (!p || OFF.has("promo")) return;
    const key = "sp27_px_" + (p.title || "") + (p.until || ""); if (localStorage.getItem(key)) return;
    const home = D.getElementById("t-home"); if (!home) return;
    const c = el("div", "card c26 promo27"); c.id = "promo27";
    if (p.img && /^https:\/\//.test(p.img)) { const im = el("img", "hero27"); im.src = p.img; im.alt = ""; im.referrerPolicy = "no-referrer"; im.onerror = () => im.remove(); c.append(im); }
    const h = el("h3"); h.append(ic("ticket"), el("span", null, p.title || "عرض من سعراتي")); c.append(h);
    if (p.text) c.append(el("div", "sub26", p.text));
    if (p.until) {
      const cd = el("div", "cd27"); const cells = ["يوم", "ساعة", "دقيقة", "ثانية"].map((l) => { const s = el("span"); const v = el("b", null, "0"); s.append(v, el("small", null, l)); cd.append(s); return v; });
      const tick = () => { let s = Math.max(0, Math.floor((p.until - Date.now()) / 1000)); if (!s) { c.remove(); return clearInterval(t); } [86400, 3600, 60, 1].forEach((u, i) => { cells[i].textContent = String(Math.floor(s / u)); s %= u; }); };
      const t = setInterval(tick, 1000); tick(); c.append(cd);
    }
    if (p.code) { const b = el("button", "code27 tap"); b.append(ic("copy"), el("span", null, p.code)); b.onclick = () => { try { W.Android && Android.copy ? Android.copy(p.code) : navigator.clipboard.writeText(p.code); } catch (e) {} say("اتنسخ الكود " + p.code, "check"); }; c.append(b); }
    const x = el("button", "x26", "×"); x.onclick = () => { localStorage.setItem(key, "1"); c.remove(); }; c.append(x);
    const top = home.querySelector(".top"); top ? top.after(c) : home.prepend(c);
  }
  // ===== الترحيب =====
  function welcome(w) {
    if (!w || OFF.has("welcome")) return;
    const k = "sp27_wel"; if (localStorage.getItem(k)) return;
    const fresh = !localStorage.getItem("sp26_news") || +(localStorage.getItem("sp27_first") || Date.now()) > Date.now() - 3 * 864e5;
    localStorage.setItem(k, "1"); if (!fresh) return;
    setTimeout(() => { try { openM(""); const sh = D.getElementById("sheet"); const b = el("div"); b.style.padding = "6px 2px 10px"; b.append(el("h2", null, w.title || "أهلا بيك في سعراتي"), el("p", "sub26", w.text || "")); const ok = el("button", "btn", "يلا نبدأ"); ok.style.width = "100%"; ok.onclick = () => closeM(); b.append(ok); sh.append(b); } catch (e) {} }, 3500);
  }
  // ===== العضويات الحية =====
  let PLANS = null;
  function plansSheet() {
    const P = PLANS || []; if (!P.length) return say("الباقات مش متاحة دلوقتي");
    try { openM(""); } catch (e) { return; }
    const sh = D.getElementById("sheet"); const b = el("div"); b.style.padding = "4px 2px 12px";
    b.append(el("h2", null, "عضويات سعراتي"));
    let yearly = true; const tg = el("div", "yr27"); const bm = el("button", null, "شهري"), by = el("button", "on", "سنوي — وفّر أكتر"); tg.append(bm, by);
    const grid = el("div", "plans27");
    const draw = () => {
      grid.replaceChildren();
      P.forEach((p) => {
        const c = el("div", "plan27 " + (p.id === "elite" ? "t-elite" : p.id === "pro" ? "t-pro" : ""));
        const price = yearly ? p.year : p.month; const pr = el("div", "pr", price ? String(price) : "مجانًا");
        if (price) pr.append(el("small", null, yearly ? " جنيه / سنة" : " جنيه / شهر"));
        c.append(el("b", null, p.name), pr);
        if (yearly && p.month && p.year) { const save = Math.round(100 - (p.year * 100) / (p.month * 12)); if (save > 0) c.append(el("span", "act", "وفّر " + save + "%")); }
        const ul = el("ul"); (p.features || []).slice(0, 8).forEach((f) => ul.append(el("li", null, f))); c.append(ul);
        grid.append(c);
      });
    };
    bm.onclick = () => { yearly = false; bm.classList.add("on"); by.classList.remove("on"); draw(); };
    by.onclick = () => { yearly = true; by.classList.add("on"); bm.classList.remove("on"); draw(); };
    draw(); b.append(tg, grid); sh.append(b);
  }
  function plansEntry() {
    if (OFF.has("plans") || !PLANS) return;
    const me = D.getElementById("t-me"); if (!me || D.getElementById("plans27e")) return;
    const c = el("div", "card glass c26"); c.id = "plans27e";
    const h = el("h3"); h.append(ic("crown"), el("span", null, "العضويات"));
    const top = PLANS.filter((p) => p.month).sort((a, b) => a.month - b.month)[0];
    const btn = el("button", "btn26 tap", "قارن الباقات"); btn.onclick = plansSheet;
    c.append(h, el("div", "sub26", top ? "تبدأ من " + top.month + " جنيه في الشهر — " + PLANS.length + " باقات" : ""), btn);
    const priv = D.getElementById("priv26"); priv ? priv.before(c) : me.append(c);
  }

  function apply(boot) {
    const c = boot && boot.cfg; if (!c) return;
    maint(c.maint); promo(c.promo); welcome(c.welcome);
    if (c.plans) { PLANS = c.plans; plansEntry(); }
    localStorage.setItem("sp_ff_chat_ro", c.chat_ro ? "1" : "0");
  }
  if (!localStorage.getItem("sp27_first")) localStorage.setItem("sp27_first", String(Date.now()));
  let n = 0; const w = setInterval(() => { if (W.V25 && V25.boot) { clearInterval(w); apply(V25.boot); } else if (++n > 40) clearInterval(w); }, 500);
  D.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("#nav")) setTimeout(plansEntry, 350); }, true);
  W.V27 = { apply, plansSheet, maint, promo };
})();
