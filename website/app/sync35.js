/* سعراتي — مزامنة الإصدارات 37 (برو + الأدمن): التحديث الإجباري وقفل النسخ القديمة.
   المصدر: سياسة الوكيل /v1/app/f37/policy (بتتحدث لوحدها مع كل إصدار، وبتتعدّل من تبويب «التحديث الإجباري» في الأدمن).
   الاحتياطي: pulse.json الموقّع ثم release.json (نفس منطق 35).
   - نسختك أقدم من الأحدث بس: شريط «حدّث دلوقتي».
   - نسختك أقدم من forceVc وفي مهلة: نافذة تحذير بعدّاد + إشعارات nagPerDay مرة في اليوم لحد ميعاد القفل.
   - بعد المهلة أو أقدم من minVc: شاشة قفل كاملة. بتتفتح بالتحديث، أو بكلمة سر من الأدمن لمدة محددة.
   - السياسة بتتحفظ على الجهاز، فالقفل شغال حتى من غير نت. */
(() => {
  "use strict";
  const W = window, D = document, SITE = "https://sorati-610ba.web.app", POL = "https://deputy.sorati-command.workers.dev/v1/app/f37";
  const B = W.BUILD || {}, APP = B.app === "admin" ? "admin" : "pro", VC = +B.vc || 0;
  const K = "s35_sync", KP = "s37_pol", KU = "s37_unlock", KN = "s37_nag", NAME = APP === "admin" ? "سعراتي أدمن" : "سعراتي برو";
  let lastCheck = 0, cur = null;
  const LS = { g: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, s: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const open = (u) => { try { if (W.Android && Android.openUrl) return Android.openUrl(u); } catch (e) {} W.open(u, "_blank"); };
  const hap = (k) => { try { W.Android && Android.haptic && Android.haptic(k || "light"); } catch (e) {} };
  const txt = (t) => String(t == null ? "" : t);
  const okUrl = (u) => /^https:\/\/sorati-610ba\.web\.app\//.test(u || "");
  const dl = () => (cur && okUrl(cur.url) ? cur.url : SITE + "/download/");
  const left = (ms) => { const h = Math.max(0, ms) / 36e5; return h >= 24 ? Math.ceil(h / 24) + " يوم" : h >= 1 ? Math.ceil(h) + " ساعة" : Math.max(1, Math.ceil(h * 60)) + " دقيقة"; };
  const mk = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  let did = localStorage.getItem("s36_did"); if (!did) { did = String(Math.random()); localStorage.setItem("s36_did", did); }

  function css() {
    if (D.getElementById("s37css")) return;
    const s = mk("style"); s.id = "s37css";
    s.textContent = `#s35bar{position:fixed;inset-inline:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:2147483000;display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(18,40,30,.96),rgba(6,18,13,.97));border:1px solid rgba(245,199,107,.45);box-shadow:0 20px 60px -10px rgba(0,0,0,.7);color:#eafff6;font-weight:600;font-size:14px;line-height:1.45;transform:translateY(140%);opacity:0;transition:transform .5s cubic-bezier(.2,.8,.2,1),opacity .4s}
#s35bar.on{transform:none;opacity:1}#s35bar .ic{flex:0 0 40px;height:40px;border-radius:12px;display:grid;place-items:center;background:radial-gradient(circle at 30% 30%,#fff1c1,#f5c76b 45%,#a8771f);color:#2a1a00;font-weight:900}
#s35bar .tx{flex:1;min-width:0}#s35bar .tx b{display:block;color:#fff1c1}#s35bar .tx span{display:block;font-size:12px;color:#a8c7ba;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s35bar .x{border:0;background:none;color:#7c9a8e;font-size:20px;padding:4px 6px}
.s37go{border:0;border-radius:99px;padding:12px 20px;font-weight:800;font-size:14px;color:#02140d;background:linear-gradient(135deg,#a7f3d0,#34d399 45%,#10b981);box-shadow:0 12px 40px -10px rgba(16,185,129,.8)}
.s37ghost{border:1px solid rgba(255,255,255,.18);background:none;color:#cfe9df;border-radius:99px;padding:10px 18px;font-weight:700;font-size:13px}
#s37nag{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:end center;background:rgba(0,0,0,.55);padding:16px}
#s37nag .c{width:min(440px,100%);background:linear-gradient(160deg,#10261d,#06120d);border:1px solid rgba(245,199,107,.5);border-radius:24px;padding:20px;color:#eafff6;text-align:center;font-weight:500;font-size:14px;line-height:1.6;box-shadow:0 30px 80px -10px #000}
#s37nag h3{margin:6px 0;color:#fff1c1;font-size:19px}#s37nag .cd{font-weight:900;font-size:30px;line-height:1.2;color:#fca5a5;margin:8px 0}#s37nag .row{display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap}
#s35blk{position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at 50% 30%,#0d2a1f,#020b08 70%);color:#eafff6;text-align:center;font-weight:500;font-size:15px;line-height:1.6;overflow:auto}
#s35blk .c{max-width:380px}#s35blk h2{margin:14px 0 6px;font-size:24px;color:#fff1c1}#s35blk ul{text-align:start;color:#a8c7ba;font-size:13px;padding-inline-start:18px}
#s35blk .lk{display:inline-grid;place-items:center;width:64px;height:64px;border-radius:20px;background:radial-gradient(circle at 30% 30%,#fff1c1,#f5c76b 45%,#a8771f);color:#2a1a00;font-size:30px}
#s35blk .pw{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)}#s35blk input{width:100%;box-sizing:border-box;margin:8px 0;padding:12px;border-radius:14px;border:1px solid rgba(245,199,107,.4);background:rgba(0,0,0,.35);color:#fff;font-weight:700;font-size:18px;line-height:1;text-align:center;letter-spacing:3px;direction:ltr}
#s35blk .er{color:#fca5a5;font-size:13px;min-height:20px}`;
    D.head.appendChild(s);
  }

  function bar(r) {
    css(); let e = D.getElementById("s35bar");
    if (!e) { e = mk("div"); e.id = "s35bar"; e.setAttribute("role", "status"); D.body.appendChild(e); }
    e.replaceChildren(); const tx = mk("div", "tx"); tx.append(mk("b", null, "نزل " + NAME + " " + txt(r.latestVn)), mk("span", null, r.note || "تحديث جديد جاهز من الموقع الرسمي"));
    const go = mk("button", "s37go", "حدّث"); go.onclick = () => open(dl());
    const x = mk("button", "x", "×"); x.setAttribute("aria-label", "بعدين"); x.onclick = () => { LS.s(K + "_later", { vc: r.latestVc, at: Date.now() }); e.classList.remove("on"); };
    e.append(mk("div", "ic", "↑"), tx, go, x); requestAnimationFrame(() => e.classList.add("on")); hap();
  }

  function nag(r, now) {
    css(); if (D.getElementById("s37nag") || D.getElementById("s35blk")) return;
    const e = mk("div"); e.id = "s37nag"; const c = mk("div", "c"); const cd = mk("div", "cd", left(r.forceAt - now));
    c.append(mk("div", null, "⏳"), mk("h3", null, "النسخة دي هتتقفل قريب"), mk("p", null, "إصدارك " + txt(B.vn) + " قديم. بعد المدة دي التطبيق مش هيفتح غير بالتحديث. بياناتك بتفضل زي ما هي."), cd);
    if (r.msg) c.append(mk("p", null, r.msg));
    const row = mk("div", "row"); const go = mk("button", "s37go", "حدّث دلوقتي"); go.onclick = () => open(dl());
    const later = mk("button", "s37ghost", "فكّرني بعدين"); later.onclick = () => { LS.s(KN, { vc: r.forceVc, at: Date.now() }); e.remove(); };
    row.append(go, later); c.append(row); e.append(c); D.body.appendChild(e); hap("medium");
    const t = setInterval(() => { if (!e.isConnected) return clearInterval(t); cd.textContent = left(r.forceAt - Date.now()); }, 30000);
  }

  function block(r, reason) {
    css(); D.getElementById("s37nag") && D.getElementById("s37nag").remove();
    if (D.getElementById("s35blk")) return;
    const e = mk("div"); e.id = "s35blk"; e.setAttribute("role", "dialog"); e.setAttribute("aria-modal", "true");
    const c = mk("div", "c");
    c.append(mk("div", "lk", "🔒"), mk("h2", null, "النسخة دي اتقفلت"), mk("p", null, "إصدارك " + txt(B.vn) + " مبقاش مدعوم. حمّل " + NAME + " " + txt(r.latestVn || "") + " وبياناتك بتفضل زي ما هي."));
    if (r.msg) c.append(mk("p", null, r.msg));
    if (Array.isArray(r.notes) && r.notes.length) { const ul = mk("ul"); r.notes.slice(0, 4).forEach((n) => ul.append(mk("li", null, txt(n)))); c.append(ul); }
    const go = mk("button", "s37go", "حمّل التحديث"); go.onclick = () => open(dl()); c.append(go);
    const pw = mk("div", "pw"); pw.append(mk("div", null, "معاك كلمة سر من الإدارة؟"));
    const inp = mk("input"); inp.placeholder = "XXXXX-XXXXX"; inp.maxLength = 13; inp.autocapitalize = "characters"; inp.autocomplete = "off"; inp.spellcheck = false;
    const er = mk("div", "er"); const ub = mk("button", "s37ghost", "افتح النسخة دي");
    ub.onclick = async () => {
      const code = inp.value.trim(); if (code.replace(/[^A-Za-z0-9]/g, "").length !== 10) { er.textContent = "كلمة السر 10 حروف وأرقام"; return; }
      ub.disabled = true; er.textContent = "بنتحقق…";
      try {
        const res = await fetch(POL + "/unlock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, app: APP, vc: VC, did }) });
        const j = await res.json().catch(() => ({}));
        if (j.ok && j.until) { LS.s(KU, { vc: VC, until: j.until }); e.remove(); hap("success"); try { toast("اتفتحت لحد " + new Date(j.until).toLocaleString("ar-EG")); } catch (x) {} }
        else er.textContent = ({ bad_code: "كلمة السر غلط", expired: "كلمة السر انتهت", used_up: "كلمة السر اتستخدمت قبل كده", wrong_app: "كلمة السر دي لتطبيق تاني", wrong_version: "كلمة السر دي لنسخة تانية", rate_limited: "محاولات كتير. استنى 10 دقايق" })[j.error] || "حصلت مشكلة، جرّب تاني";
      } catch (x) { er.textContent = "محتاج نت عشان تفتح بكلمة السر"; }
      ub.disabled = false;
    };
    pw.append(inp, ub, er); c.append(pw); e.append(c); D.body.appendChild(e); hap("heavy");
    void reason;
  }

  /* إشعارات على الموبايل (Android.remOnce) حتى لو التطبيق مقفول: nagPerDay مرة في اليوم لحد القفل، وبعده كمان */
  function schedule(r, now, locked) {
    const N = W.NOTIF37; if (!N || !N.available()) return;
    const per = Math.max(1, Math.min(24, +r.nagPerDay || 6)), step = (24 / per) * 36e5;
    const sig = [r.forceVc, r.forceAt, per, locked ? 1 : 0].join("|"); if (localStorage.getItem("s37_sched") === sig) return;
    const L = [], n = Math.min(24, per * 2), t0 = Date.now();
    for (let i = 1; i <= n; i++) {
      const at = t0 + i * step, toLock = r.forceAt ? r.forceAt - (now + i * step) : -1;
      L.push({ at, title: "🔔 لازم تحدّث " + NAME, text: locked || toLock <= 0 ? "النسخة دي اتقفلت. حمّل التحديث عشان تكمّل، وبياناتك محفوظة." : "النسخة دي هتتقفل بعد " + left(toLock) + ". حدّث دلوقتي من الموقع الرسمي." });
    }
    if (!locked && r.forceAt > now) L.push({ at: t0 + (r.forceAt - now), title: "🔒 " + NAME + " اتقفل", text: "النسخة القديمة اتقفلت. افتح التطبيق وحمّل التحديث." });
    if (N.group("force37", L)) localStorage.setItem("s37_sched", sig);
  }
  function unschedule() { try { if (W.NOTIF37 && localStorage.getItem("s37_sched")) { W.NOTIF37.clear("force37"); localStorage.removeItem("s37_sched"); } } catch (e) {} }

  /* احتياطي: pulse.json الموقّع ثم release.json → نفس شكل السياسة */
  const PUB = "MCowBQYDK2VwAyEAEEF6tsrr4VvcEuR0qndTCeewLttBDi+rnp5/GX+F4F0=", b64 = (x) => Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
  async function pulse() {
    const res = await fetch(SITE + "/pulse.json?t=" + Math.floor(Date.now() / 6e4), { cache: "no-store" }); if (!res.ok) return null;
    const j = await res.json(); if (j.pub !== PUB || !W.crypto || !crypto.subtle) return null;
    const key = await crypto.subtle.importKey("raw", b64(PUB).slice(-32), { name: "Ed25519" }, false, ["verify"]);
    if (!(await crypto.subtle.verify("Ed25519", key, b64(j.sig), new TextEncoder().encode(j.payload)))) return null;
    const p = JSON.parse(j.payload); if (!p.ts || Math.abs(Date.now() - p.ts) > 45 * 864e5) return null;
    return p;
  }
  async function relFallback() {
    let rel = null; try { rel = await pulse(); } catch (e) {}
    if (!rel) { const res = await fetch(SITE + "/release.json?t=" + Math.floor(Date.now() / 6e4), { cache: "no-store" }); if (!res.ok) return null; rel = await res.json(); }
    return rel;
  }

  async function check(force) {
    if (!force && Date.now() - lastCheck < 30 * 60e3) { apply(); return; } lastCheck = Date.now();
    let pol = null, rel = null;
    try { const res = await fetch(POL + "/policy?t=" + Math.floor(Date.now() / 6e4), { cache: "no-store" }); if (res.ok) pol = await res.json(); } catch (e) {}
    try { rel = await relFallback(); } catch (e) {}
    const r = rel && rel[APP], p = pol && pol.ok && pol[APP];
    if (!r && !p) { apply(); return; }
    const m = {
      latestVc: Math.max(+(p && p.latestVc) || 0, +(r && r.vc) || 0), latestVn: (p && p.latestVc >= ((r && r.vc) || 0) && p.latestVn) || (r && r.vn) || "",
      url: (p && okUrl(p.url) && p.url) || (r && okUrl(r.url) && r.url) || "", minVc: p ? +p.minVc || 0 : +(r && r.minVc) || 0, // release.json minVc للنسخ القديمة (35/36) بس؛ 37+ بتمشي على سياسة الوكيل (مهلة + كلمة سر)
      forceVc: +(p && p.forceVc) || 0, forceAt: +(p && p.forceAt) || 0, nagPerDay: +(p && p.nagPerDay) || 6, msg: (p && p.msg) || "",
      notes: (r && r.notes) || [], note: (r && Array.isArray(r.notes) && r.notes[0]) || "", skew: pol && pol.now ? pol.now - Date.now() : 0, at: Date.now(),
    };
    LS.s(KP, m);
    W.SYNC35 = { latest: { vn: m.latestVn, vc: m.latestVc, url: m.url, minVc: m.minVc, notes: m.notes }, site: rel && rel.site, mine: { vn: B.vn, vc: VC }, checkedAt: Date.now(), force: m };
    LS.s(K, W.SYNC35);
    apply();
  }

  function apply() {
    const r = LS.g(KP, null); if (!r || !VC) return; cur = r;
    const now = Date.now() + (+r.skew || 0); // وقت السيرفر، عشان تغيير ساعة الموبايل مايفتحش القفل
    const u = LS.g(KU, null), unlocked = u && u.vc === VC && u.until > now;
    const hard = r.minVc && VC < r.minVc, soon = r.forceVc && VC < r.forceVc, locked = hard || (soon && r.forceAt && now >= r.forceAt);
    if (locked && !unlocked) { schedule(r, now, true); return block(r, hard ? "min" : "force"); }
    const blk = D.getElementById("s35blk"); if (blk && (unlocked || !locked)) blk.remove();
    if (!soon || unlocked) unschedule();
    if (soon && !unlocked) {
      schedule(r, now, false);
      const per = Math.max(1, Math.min(24, +r.nagPerDay || 6)), n = LS.g(KN, null);
      if (!n || n.vc !== r.forceVc || Date.now() - n.at > (24 / per) * 36e5) return nag(r, now);
      return;
    }
    if (r.latestVc > VC) {
      const l = LS.g(K + "_later", null);
      if (l && l.vc === r.latestVc && Date.now() - l.at < 24 * 36e5) return;
      bar(r);
    }
  }

  W.SYNC35_check = () => check(true);
  W.SYNC37 = { check: () => check(true), state: () => LS.g(KP, null), unlocked: () => LS.g(KU, null) };
  const start = () => {
    apply(); // القفل من السياسة المحفوظة فورًا، حتى من غير نت
    setTimeout(() => check(true), 2500);
    setInterval(() => check(true), 3 * 3600e3);
    setInterval(apply, 60e3); // عشان القفل يحصل في ميعاده حتى لو التطبيق مفتوح
    D.addEventListener("visibilitychange", () => { if (!D.hidden) check(false); });
  };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
})();
