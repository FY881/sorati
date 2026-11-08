/* سعراتي — وكيل الحماية (guard29) — طبقة حماية ومراقبة فوق v25..v29 من غير حذف أي حاجة
   1) بوابة القوانين (لازم تتقرا وتتوقّع قبل أي مساحة مجتمع أو شات) — بنسخة RULES_VERSION
   2) فحص مبدئي للمحتوى على الجهاز (عربي/إنجليزي مع تطبيع وتجاوز للتحايل) + فحص رسمي من السيرفر
   3) حماية الملفات: sha256 + نوع/حجم/امتداد + منع التنفيذيات + فحص السيرفر
   4) تنفيذ العقوبات: تحذير/كتم/حظر شات/إيقاف/حظر كامل + عدّاد + تظلّم
   5) «شات مفاجئ» من وكيل الحماية عند الاشتباه (probe29)
   6) كشف العبث: devtools / تغيير الدوال الأساسية / العبث بمفاتيح الاشتراك / طلبات متسارعة / محاكي-روت
   إيقاف أجزاء (للتطوير): localStorage sp29_goff = "gate,scan,files,sanction,probe,tamper"
   ملاحظة: القرار النهائي دايمًا من السيرفر — الكلاينت بيمنع ويبلّغ بس، وعمره ما بيحظر لوحده. */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.G29 || !(W.BUILD && BUILD.app !== "admin")) return;

  // ================= إعدادات عامة =================
  const DEP = "https://deputy.sorati-command.workers.dev";
  const MOD = DEP + "/v1/app/mod";
  const RULES_VERSION = 29;
  const LSK = {
    rules: "sp29_rules",        // {v, at, name}
    hits: "sp29_gatehits",      // [ts,...]
    probe: "sp29_probe",        // آخر probe اتعرض
    tamper: "sp29_tamper",      // آخر بلاغ عبث
    sanc: "sp29_sanc",          // آخر نسخة من العقوبات (عرض سريع قبل ما السيرفر يرد)
  };
  const OFF = (() => { try { return new Set(String(localStorage.getItem("sp29_goff") || "").split(",").map((s) => s.trim())); } catch (e) { return new Set(); } })();
  const on = (k) => !OFF.has(k);
  const REDUCED = !!(W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const _fetch = (W.fetch && W.fetch.bind(W)) || null;   // نسخة وقت التحميل (بعد توقيع SG24)
  const _now = () => Date.now();

  // ================= أدوات صغيرة =================
  const el = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const say = (m, i) => { try { if (typeof toast === "function") toast(m, i || "info"); } catch (e) {} };
  const hap = (ms) => { try { W.Android && Android.haptic && Android.haptic(ms || 12); } catch (e) {} };
  const FBx = () => { try { return typeof FB !== "undefined" ? FB : W.FB; } catch (e) { return W.FB; } };
  const uid = () => { try { const f = FBx(); return (f && f.user && f.user.uid) || ""; } catch (e) { return ""; } };
  const signedIn = () => { try { const f = FBx(); return !!(f && f.signedIn && f.signedIn()); } catch (e) { return false; } };
  const myName = () => { try { const f = FBx(); return (f && f.user && (f.user.name || f.user.email)) || ""; } catch (e) { return ""; } };
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const clamp = (s, n) => String(s == null ? "" : s).slice(0, n);
  const fmtN = (n) => { try { return Math.round(n || 0).toLocaleString("ar-EG"); } catch (e) { return String(Math.round(n || 0)); } };

  // sha256 hex
  const te = new TextEncoder();
  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  async function sha256(data) {
    try {
      const b = typeof data === "string" ? te.encode(data) : data;
      return hex(await crypto.subtle.digest("SHA-256", b));
    } catch (e) { return ""; }
  }
  let _uidh = "";
  async function uidh() {
    const u = uid(); if (!u) return "";
    if (_uidh && _uidh.u === u) return _uidh.h;
    const h = (await sha256(u)).slice(0, 16);
    _uidh = { u, h };
    return h;
  }

  // POST للسيرفر العام (من غير توقيع، أجسام صغيرة) — عمره ما يرمي استثناء للتطبيق
  async function post(path, body, ms) {
    if (!_fetch) return null;
    const ctl = ("AbortController" in W) ? new AbortController() : null;
    const t = setTimeout(() => { try { ctl && ctl.abort(); } catch (e) {} }, ms || 9000);
    try {
      body = Object.assign({}, body || {});
      // عقد السيرفر: uid + idToken موثّق، و action بدل type في /gate
      try { const F9 = FBx(); if (F9 && F9.token) { await F9.token(); } const tk = F9 && F9.tok; const u = uid(); if (tk && u) { body.uid = u; body.idToken = tk; } } catch (e) {}
      if (path === "/gate" && body.type && !body.action) { body.action = body.type === "abuse" ? "bounce" : body.type; }
      if (path === "/flag" && !body.reason) { body.reason = body.kind || "flag"; }
      const r = await _fetch(MOD + path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body || {}),
        signal: ctl ? ctl.signal : undefined,
        cache: "no-store",
      });
      const d = await r.json().catch(() => null);
      return d && typeof d === "object" ? d : null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  }

  // Relay31: POST {uid,idToken,...} → JSON — عمره ما يرمي استثناء
  const R31 = DEP + "/v1/app/r31";
  async function r31(path, body, ms) {
    if (!_fetch) return null;
    const ctl = ("AbortController" in W) ? new AbortController() : null;
    const t = setTimeout(() => { try { ctl && ctl.abort(); } catch (e) {} }, ms || 9000);
    try {
      body = Object.assign({}, body || {});
      const f = FBx();
      if (!f || !f.token) return null;
      await f.token();
      const tk = f.tok, u = uid();
      if (!tk || !u) return null;
      body.uid = u; body.idToken = tk;
      const r = await _fetch(R31 + path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: ctl ? ctl.signal : undefined,
        cache: "no-store",
      });
      const d = await r.json().catch(() => null);
      if (d && typeof d === "object") { if (!r.ok && d.ok == null) d.ok = false; d.status = d.status || r.status; return d; }
      return null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  }
  // /me مع كاش مشترك W.__r31me = {at, d} (صالح 60 ث)
  async function r31me(force) {
    try {
      const c = W.__r31me;
      if (!force && c && c.d && c.d.ok && _now() - (+c.at || 0) < 60000) return c.d;
      const d = await r31("/me", {});
      if (d && d.ok) { W.__r31me = { at: _now(), d }; return d; }
      return null;
    } catch (e) { return null; }
  }

  // ================= الستايل =================
  const CSS = `
.g29-ov{position:fixed;inset:0;z-index:100100;background:rgba(2,4,8,.72);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);display:flex;align-items:flex-end;justify-content:center;direction:rtl;font-family:inherit;animation:g29fade .25s ease both}
.g29-ov.g29-full{align-items:stretch}
.g29-card{width:100%;max-width:560px;max-height:94vh;display:flex;flex-direction:column;color:#eafff6;background:linear-gradient(170deg,#0b1016 0%,#070a0f 60%,#05070b 100%);border:1px solid rgba(245,199,107,.28);border-radius:28px 28px 0 0;box-shadow:0 -24px 80px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden;animation:g29up .4s cubic-bezier(.16,.84,.32,1) both}
.g29-ov.g29-full .g29-card{max-height:100vh;height:100%;border-radius:0;border-inline:0}
.g29-grab{width:46px;height:5px;border-radius:99px;background:rgba(255,255,255,.18);margin:10px auto 2px;flex:none}
.g29-hd{padding:12px 20px 10px;flex:none;display:flex;align-items:center;gap:12px}
.g29-logo{width:42px;height:42px;flex:none;border-radius:14px;display:grid;place-items:center;font-size:21px;background:linear-gradient(135deg,rgba(16,185,129,.28),rgba(245,199,107,.22));border:1px solid rgba(245,199,107,.4);box-shadow:0 0 22px rgba(16,185,129,.22)}
.g29-logo.g29-glow{animation:g29pulse 2.8s ease-in-out infinite}
.g29-hd h3{margin:0;font-size:18px;font-weight:800;letter-spacing:.2px;background:linear-gradient(90deg,#f5c76b,#10b981);-webkit-background-clip:text;background-clip:text;color:transparent}
.g29-hd small{display:block;opacity:.66;font-size:12px;font-weight:600;margin-top:2px;color:#cfe9dd}
.g29-red{margin:0 16px 10px;flex:none;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:18px;color:#ffe9e9;font-weight:700;line-height:1.75;font-size:13.5px;background:linear-gradient(135deg,rgba(220,38,38,.34),rgba(127,29,29,.22));border:1px solid rgba(248,113,113,.55);box-shadow:0 0 26px rgba(220,38,38,.22) inset;animation:g29warn 2.6s ease-in-out infinite}
.g29-red b{color:#fff}
.g29-body{flex:1 1 auto;overflow-y:auto;padding:4px 16px 14px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.g29-grp{margin:12px 0 0;border-radius:20px;padding:12px 14px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.08)}
.g29-grp>h4{margin:0 0 8px;font-size:14.5px;font-weight:800;color:#f5c76b;display:flex;align-items:center;gap:8px}
.g29-grp>h4 i{width:7px;height:7px;border-radius:99px;background:#10b981;box-shadow:0 0 10px #10b981;font-style:normal}
.g29-grp ol{margin:0;padding:0 18px 0 0;list-style:none;counter-reset:g29}
.g29-grp li{counter-increment:g29;position:relative;margin:7px 0;padding-inline-start:26px;font-size:13.5px;line-height:1.85;color:#dbeee6}
.g29-grp li::before{content:counter(g29);position:absolute;inset-inline-start:0;top:3px;width:19px;height:19px;border-radius:7px;display:grid;place-items:center;font-size:10.5px;font-weight:800;color:#06281e;background:linear-gradient(135deg,#10b981,#f5c76b)}
.g29-end{margin:16px 0 4px;padding:14px;border-radius:18px;text-align:center;font-weight:700;font-size:13px;color:#bff3dd;border:1px dashed rgba(16,185,129,.45);background:rgba(16,185,129,.07)}
.g29-sig{margin:12px 0 0;display:flex;flex-direction:column;gap:7px}
.g29-sig label{font-size:12.5px;font-weight:700;opacity:.85}
.g29-sig input{font:inherit;font-size:15px;color:#fff;padding:13px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);outline:0;transition:border-color .2s,box-shadow .2s}
.g29-sig input:focus{border-color:rgba(245,199,107,.6);box-shadow:0 0 0 3px rgba(245,199,107,.15)}
.g29-ft{flex:none;padding:12px 16px calc(14px + env(safe-area-inset-bottom,0px));display:flex;gap:10px;border-top:1px solid rgba(255,255,255,.07);background:linear-gradient(0deg,rgba(0,0,0,.45),transparent)}
.g29-b{flex:1;font:inherit;font-weight:800;font-size:14.5px;padding:14px 10px;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#e9fff7;cursor:pointer;transition:transform .15s,opacity .2s,box-shadow .25s}
.g29-b:active{transform:scale(.97)}
.g29-b.g29-pri{color:#03241a;border-color:transparent;background:linear-gradient(135deg,#10b981,#f5c76b);box-shadow:0 10px 30px rgba(16,185,129,.28)}
.g29-b.g29-dng{color:#ffdede;border-color:rgba(248,113,113,.5);background:rgba(220,38,38,.18)}
.g29-b[disabled]{opacity:.42;filter:grayscale(.5);cursor:not-allowed;box-shadow:none}
.g29-pill{display:inline-flex;align-items:center;gap:6px;margin:2px 0 0;padding:5px 11px;border-radius:99px;font-size:11.5px;font-weight:800;color:#f5c76b;border:1px solid rgba(245,199,107,.32);background:rgba(245,199,107,.08)}
.g29-cd{font-variant-numeric:tabular-nums;font-weight:800;font-size:26px;letter-spacing:1px;color:#fde68a;text-align:center;margin:10px 0 2px;direction:ltr}
.g29-note{font-size:12.5px;line-height:1.9;opacity:.82;margin:8px 0 0}
.g29-chat{display:flex;flex-direction:column;gap:10px;padding:6px 2px}
.g29-msg{max-width:88%;padding:12px 14px;border-radius:18px;font-size:14px;line-height:1.85;background:linear-gradient(135deg,rgba(16,185,129,.16),rgba(255,255,255,.04));border:1px solid rgba(16,185,129,.26);align-self:flex-start;animation:g29in .35s ease both}
.g29-msg.g29-me{align-self:flex-end;background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)}
.g29-toastw{position:fixed;inset-inline:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:100200;display:flex;justify-content:center;pointer-events:none}
.g29-toast{pointer-events:auto;max-width:460px;padding:13px 16px;border-radius:18px;font-size:13.5px;font-weight:700;line-height:1.8;color:#ffe9e9;direction:rtl;background:linear-gradient(135deg,rgba(127,29,29,.92),rgba(30,10,10,.94));border:1px solid rgba(248,113,113,.5);box-shadow:0 16px 44px rgba(0,0,0,.55);animation:g29up .3s ease both}
.g29-toast.g29-ok{color:#dcfce7;background:linear-gradient(135deg,rgba(6,78,59,.92),rgba(6,20,16,.94));border-color:rgba(16,185,129,.5)}
@keyframes g29up{from{transform:translateY(26px);opacity:0}to{transform:none;opacity:1}}
@keyframes g29in{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
@keyframes g29fade{from{opacity:0}to{opacity:1}}
@keyframes g29pulse{0%,100%{transform:scale(1);box-shadow:0 0 18px rgba(16,185,129,.2)}50%{transform:scale(1.07);box-shadow:0 0 30px rgba(16,185,129,.4)}}
@keyframes g29warn{0%,100%{box-shadow:0 0 26px rgba(220,38,38,.18) inset}50%{box-shadow:0 0 38px rgba(220,38,38,.34) inset}}
@media (prefers-reduced-motion: reduce){.g29-ov,.g29-card,.g29-msg,.g29-toast,.g29-red,.g29-logo.g29-glow{animation:none!important}}
`;
  function css() { try { if (D.getElementById("g29css")) return; const s = el("style"); s.id = "g29css"; s.textContent = CSS; (D.head || D.documentElement).append(s); } catch (e) {} }

  // لوحة سفلية خاصة بينا (مش بنلمس openM بتاع التطبيق)
  function sheet(opts) {
    css();
    const o = opts || {};
    const ov = el("div", "g29-ov" + (o.full ? " g29-full" : ""));
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    const card = el("div", "g29-card");
    if (!o.full) card.append(el("div", "g29-grab"));
    const hd = el("div", "g29-hd");
    const lg = el("div", "g29-logo" + (o.glow ? " g29-glow" : "")); lg.textContent = o.icon || "🛡";
    const tw = el("div");
    tw.append(el("h3", null, o.title || "وكيل الحماية"));
    if (o.sub) tw.append(el("small", null, o.sub));
    hd.append(lg, tw);
    card.append(hd);
    if (o.red) {
      const r = el("div", "g29-red");
      r.append(el("span", null, "⚠️"));
      const b = el("div"); b.append(el("b", null, o.red)); if (o.red2) { b.append(D.createElement("br")); b.append(D.createTextNode(o.red2)); }
      r.append(b);
      card.append(r);
    }
    const body = el("div", "g29-body");
    card.append(body);
    const ft = el("div", "g29-ft");
    card.append(ft);
    ov.append(card);
    const api = {
      ov, card, body, ft,
      btn(text, cls, fn) { const b = el("button", "g29-b" + (cls ? " " + cls : ""), text); b.onclick = () => { hap(); try { fn && fn(api); } catch (e) {} }; ft.append(b); return b; },
      close() { try { ov.remove(); } catch (e) {} if (o.onClose) try { o.onClose(); } catch (e) {} },
    };
    if (o.dismissable) ov.addEventListener("click", (e) => { if (e.target === ov) api.close(); });
    (D.body || D.documentElement).append(ov);
    return api;
  }

  function warn(msg, ok) {
    try {
      css();
      let w = D.querySelector(".g29-toastw");
      if (!w) { w = el("div", "g29-toastw"); D.body.append(w); }
      w.innerHTML = "";
      const t = el("div", "g29-toast" + (ok ? " g29-ok" : ""), msg);
      w.append(t);
      setTimeout(() => { try { t.remove(); } catch (e) {} }, 5200);
    } catch (e) { say(msg); }
  }

  const dur = (ms) => {
    ms = Math.max(0, ms | 0);
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    if (d) return d + " يوم و " + h + " ساعة";
    if (h) return h + " ساعة و " + m + " دقيقة";
    if (m) return m + " دقيقة و " + s + " ثانية";
    return s + " ثانية";
  };

  // ================= القوانين =================
  const DEFAULT_RULES = [
    { t: "الاحترام", icon: "🤝", r: [
      "اتعامل مع أي حد هنا باحترام، حتى لو مختلف معاه في الرأي أو في الأكل أو في طريقة الرجيم.",
      "ممنوع السخرية من شكل حد أو وزنه أو صوته أو صوره أو مستواه المادي.",
      "ممنوع التنمّر بأي شكل: لا تلميح، ولا ضحك على حد، ولا جروبات ضد حد.",
      "ممنوع مطاردة أي عضو برسايل أو تعليقات بعد ما يقولك خلاص أو يبلوكك.",
    ] },
    { t: "المحتوى الممنوع والإباحي", icon: "⛔", r: [
      "ممنوع نهائي أي محتوى جنسي أو إباحي: صور، فيديو، صوت، نصوص، أو لينكات.",
      "ممنوع الكلام الجنسي الصريح أو التلميحات الجنسية حتى لو بهزار أو بإيموجي.",
      "ممنوع عرض أو طلب خدمات جنسية أو حسابات إباحية أو مواقع تعارف مشبوهة.",
      "ممنوع المحتوى العنيف أو الدموي أو اللي بيحرّض على إيذاء النفس أو الانتحار.",
      "ممنوع أي محتوى بيروّج لمخدرات أو منشطات أو أدوية بدون وصفة.",
    ] },
    { t: "حماية الأطفال", icon: "🛡", r: [
      "أي محتوى جنسي فيه طفل أو قاصر = حظر فوري ودائم من غير أي تحذير، وبيتبلّغ عنه.",
      "ممنوع طلب صور خاصة أو بيانات أو مقابلة من أي حد تحت 18 سنة.",
      "لو شُفت أي حاجة بتأذي طفل، بلّغ فورًا — سكوتك مش حياد.",
    ] },
    { t: "الشتايم والألفاظ", icon: "🤬", r: [
      "ممنوع الشتايم والألفاظ الخارجة، وكتابتها بحروف ناقصة أو أرقام أو نقط برضه ممنوعة.",
      "ممنوع السب في الدين أو الأهل أو البلد أو أي إهانة شخصية.",
      "ممنوع الكلام العنصري أو الطائفي أو التمييز بسبب اللون أو الجنس أو الدين.",
      "ممنوع التهديد بأي شكل: «هجيلك»، «هفضحك»، «هنشر صورك» كلها مخالفات تقيلة.",
    ] },
    { t: "احترام وكيل الحماية والدعم", icon: "🤖", r: [
      "وكيل الحماية والدعم جزء من التطبيق — احترامه زي احترام أي عضو بالظبط.",
      "ممنوع إهانة الوكيل أو محاولة استفزازه أو خداعه عشان يتجاوز القوانين.",
      "لو الوكيل سألك سؤال، جاوب بصدق — الكذب عليه بيكبّر العقوبة مش بيصغّرها.",
      "لو شايف قرار غلط، قدّم تظلّم من جوه التطبيق بدل الخناقة.",
    ] },
    { t: "التلاعب والتهكير", icon: "🧨", r: [
      "ممنوع تهكير التطبيق أو تعديله أو استخدام نسخ مهكرة أو مودّات.",
      "ممنوع محاولة تخطّي الدفع أو فتح مميزات البريميوم بطرق غير رسمية.",
      "ممنوع استغلال أي ثغرة — لو لقيت ثغرة بلّغ عنها وهتتكافأ، استغلالها بيجيب حظر.",
      "ممنوع البوتات والسكربتات والتكرار الآلي للطلبات أو الرسايل.",
      "ممنوع التلاعب في أرقامك (سعرات، نقط، تحديات) عشان تطلع في الترتيب.",
    ] },
    { t: "البلاغات الكاذبة", icon: "🚩", r: [
      "البلاغ حق ليك، بس البلاغ الكاذب مخالفة في حد ذاتها وبتتعاقب.",
      "ممنوع الاتفاق مع حد تاني عشان تبلّغوا على عضو ظلم.",
      "بلّغ بالتفاصيل والدليل، ومتبلّغش بدافع خناقة شخصية.",
    ] },
    { t: "الملفات والصور", icon: "📎", r: [
      "كل ملف أو صورة بترفعها بتتفحص تلقائيًا وبيتسجّل لها بصمة (hash) باسمك.",
      "ممنوع رفع برامج أو ملفات تنفيذية (apk، exe، scripts) أو ملفات مضغوطة مشبوهة.",
      "ممنوع رفع صور لحد تاني من غير إذنه، خصوصًا صور شخصية أو طبية.",
      "لو الملف اتمنع، متحاولش ترفعه تاني بطريقة ملتفة — ده بيتحسب تحايل.",
    ] },
    { t: "الخصوصية", icon: "🔒", r: [
      "ممنوع نشر بيانات أي حد: رقم تليفون، عنوان، صور عيلة، تحاليل طبية، أو سكرين شوت لمحادثة خاصة.",
      "محادثاتك الخاصة مشفّرة طرف لطرف، ومع ذلك القوانين بتسري عليها لو اتبلّغ عنها.",
      "متطلبش من حد بياناته البنكية أو كلمة السر — الدعم الرسمي عمره ما بيطلبها.",
      "احترم إن اللي بيشارك رحلته هنا بيثق فينا — متنقلش كلامه بره التطبيق.",
    ] },
    { t: "الاحتيال والسبام", icon: "💸", r: [
      "ممنوع النصب أو طلب تحويلات مالية أو بيع برامج تخسيس وهمية.",
      "ممنوع إعلانات أو لينكات ترويجية أو دعوة الناس لقنوات ومجموعات بره التطبيق.",
      "ممنوع تكرار نفس الرسالة في أكتر من مكان أو إغراق الشات.",
      "ممنوع انتحال شخصية حد: دكتور، مدرب، إدارة سعراتي، أو عضو تاني.",
    ] },
    { t: "العقوبات", icon: "⚖️", r: [
      "العقوبات بتتطبّق تلقائيًا: تحذير ← كتم مؤقت ← حظر شات ← إيقاف الحساب ← حظر نهائي.",
      "المخالفات التقيلة (محتوى جنسي، أذى أطفال، تهكير) ممكن توصل لحظر نهائي من أول مرة.",
      "التكرار بيضاعف المدة، والالتزام الطويل من غير مخالفات بيخفف سجلك مع الوقت.",
      "كل قرار متسجّل ومعاه سبب، وتقدر تقدّم تظلّم وهيتراجع من بني آدم مش من الآلة بس.",
      "الدخول والخروج من البوابة دي كذا مرة عشان تتهرب = كتم مؤقت تلقائي.",
    ] },
  ];
  let RULES = { v: RULES_VERSION, groups: DEFAULT_RULES, intro: "القوانين دي بتحمي المجتمع وبتحميك إنت كمان. اقراها للآخر وبعدين وقّع باسمك." };

  async function loadRules() {
    try {
      const me = signedIn() ? await r31me(false) : null;
      if (me && me.rules29 && typeof me.rules29 === "object") { applyRules29(me.rules29); return; }
      // احتياطي: Firestore
      const f = FBx();
      if (!f || !f.get) return;
      const c = await f.get("config/rules29", true).catch(() => null);
      applyRules29(c);
    } catch (e) {}
  }
  function applyRules29(c) {
    try {
      if (!c || typeof c !== "object") return;
      let groups = c.groups;
      if (typeof groups === "string") { try { groups = JSON.parse(groups); } catch (e) { groups = null; } }
      if (Array.isArray(groups) && groups.length) {
        RULES.groups = groups.map((g) => ({ t: clamp(g.t || g.title || "", 60), icon: clamp(g.icon || "•", 4), r: (g.r || g.rules || []).map((x) => clamp(x, 400)).slice(0, 40) })).slice(0, 30);
      }
      if (c.v != null && +c.v) RULES.v = +c.v;
      if (c.intro) RULES.intro = clamp(c.intro, 400);
    } catch (e) {}
  }

  const ruleCount = () => RULES.groups.reduce((n, g) => n + (g.r ? g.r.length : 0), 0);

  // ================= حالة المستخدم والعقوبات =================
  const ST = {
    user: null,          // doc users/{uid}
    acceptedV: 0,
    gateOpen: false,
    gateDone: false,
    refused: false,
    lastFetch: 0,
    sends: [],           // توقيتات الإرسال (كشف التسارع)
    okText: null,        // آخر نص اتسمح بيه (عشان الغلاف و fetch ما يفحصوش مرتين)
    lastHit: 0,
    flags: 0,
  };
  function localRules() { const r = LS.get(LSK.rules, null); return r && +r.v ? r : null; }
  function accepted() {
    const need = RULES.v || RULES_VERSION;
    const l = localRules();
    if (l && +l.v >= need) return true;
    return ST.acceptedV >= need;
  }
  const until = (v) => { const n = typeof v === "number" ? v : (v && v.toMillis ? v.toMillis() : +new Date(v || 0)); return isFinite(n) ? n : 0; };

  function sanctions() {
    const u = ST.user || LS.get(LSK.sanc, {}) || {};
    const now = _now();
    const mute = until(u.chatMuted29), cban = until(u.chatBanned29);
    const susp = u.suspended29 === true ? Infinity : until(u.suspended29);
    return {
      warn: +u.warn29 || 0,
      muted: mute > now ? mute : 0,
      chatBanned: cban > now ? cban : 0,
      suspended: susp > now ? susp : 0,
      banned: !!u.banned29,
      reason: clamp(u.sanctionReason29 || "", 400),
    };
  }
  function sendBlockReason() {
    const s = sanctions();
    if (s.banned) return { k: "banned", t: "حسابك متحظر نهائيًا", until: 0, reason: s.reason };
    if (s.suspended) return { k: "suspended", t: "حسابك موقوف مؤقتًا", until: s.suspended, reason: s.reason };
    if (s.chatBanned) return { k: "chat_ban", t: "محظور من الشات والمجتمع مؤقتًا", until: s.chatBanned, reason: s.reason };
    if (s.muted) return { k: "chat_mute", t: "مكتوم مؤقتًا", until: s.muted, reason: s.reason };
    return null;
  }

  async function pullUser(force) {
    try {
      if (!signedIn()) return null;
      if (!force && _now() - ST.lastFetch < 60000) return ST.user;
      let u = null;
      const me = await r31me(!!force && _now() - ((W.__r31me && W.__r31me.at) || 0) >= 60000);
      if (me) {
        const sc = me.sanctions || {};
        const r = me.rules && +me.rules.v ? me.rules : null;
        u = {
          warn29: +sc.warn29 || 0, chatMuted29: +sc.chatMuted29 || 0, chatBanned29: +sc.chatBanned29 || 0,
          suspended29: sc.suspended29 === true ? true : (+sc.suspended29 || 0), banned29: !!sc.banned29,
          sanctionReason29: sc.sanctionReason29 || "", sanctionUntil29: +sc.until || 0,
          rules29: r, probe29: me.probe29 || null, notify29: me.notify29 || null, _src: "r31",
        };
        if (r) { const l = localRules(); if (!l || +l.v < +r.v) LS.set(LSK.rules, { v: +r.v, at: +r.at || 0, name: r.name || "" }); }
        if (me.rules29 && typeof me.rules29 === "object") applyRules29(me.rules29);
      } else {
        // احتياطي: Firestore
        const f = FBx(); if (!f || !f.get) return ST.user;
        u = await f.get("users/" + uid()).catch(() => null);
      }
      if (!u) return ST.user;
      ST.lastFetch = _now();
      ST.user = u;
      LS.set(LSK.sanc, {
        warn29: u.warn29 || 0, chatMuted29: until(u.chatMuted29), chatBanned29: until(u.chatBanned29),
        suspended29: u.suspended29 === true ? true : until(u.suspended29), banned29: !!u.banned29, sanctionReason29: u.sanctionReason29 || "",
      });
      const r = u.rules29;
      if (r && +r.v) ST.acceptedV = Math.max(ST.acceptedV, +r.v);
      checkProbe(u);
      enforce();
      return u;
    } catch (e) { return ST.user; }
  }

  // لوحة العقوبة + عدّاد + تظلّم
  let noticeOpen = false;
  function noticeSheet(b) {
    if (noticeOpen) return;
    noticeOpen = true;
    const sh = sheet({
      title: b.t, sub: "من وكيل الحماية", icon: b.k === "chat_mute" ? "🔇" : "🚫", glow: true,
      red: "القرار ده اتطبّق تلقائيًا بعد مراجعة المحتوى.",
      red2: b.reason ? "السبب: " + b.reason : "",
      onClose() { noticeOpen = false; },
    });
    const cd = el("div", "g29-cd", "—");
    if (b.until && isFinite(b.until)) {
      sh.body.append(el("p", "g29-note", "باقي على رفع العقوبة:"));
      sh.body.append(cd);
      const tick = () => {
        if (!sh.ov.isConnected) { clearInterval(iv); return; }
        const left = b.until - _now();
        if (left <= 0) { clearInterval(iv); cd.textContent = "خلصت ✓"; setTimeout(() => sh.close(), 900); pullUser(true); return; }
        cd.textContent = dur(left);
      };
      const iv = setInterval(tick, 1000); tick();
    }
    const s = sanctions();
    const p = el("div"); p.append(el("span", "g29-pill", "تحذيرات على حسابك: " + fmtN(s.warn)));
    sh.body.append(p);
    sh.body.append(el("p", "g29-note", "لو شايف إن في لبس، قدّم تظلّم وهيتراجع. ومتحاولش تلف حوالين المنع بحساب تاني — ده بيكبّر العقوبة."));
    sh.btn("قدّم تظلّم", null, () => { sh.close(); appealSheet(b); });
    sh.btn("تمام", "g29-pri", () => sh.close());
  }
  function enforce() {
    const b = sendBlockReason();
    if (!b) return;
    if (b.k === "banned" || b.k === "suspended") { kickOut(b.t + (b.reason ? " — " + b.reason : "")); noticeSheet(b); }
  }

  async function appealSheet(b) {
    const sh = sheet({ title: "تظلّم", sub: "هيتراجع من فريق بشري", icon: "⚖️" });
    const ta = el("textarea");
    ta.rows = 6; ta.maxLength = 1500;
    ta.placeholder = "اكتب وجهة نظرك بالتفصيل... إيه اللي حصل؟ وليه شايف إن القرار محتاج مراجعة؟";
    ta.style.cssText = "width:100%;font:inherit;font-size:14px;color:#fff;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:12px;outline:0";
    sh.body.append(ta);
    sh.body.append(el("p", "g29-note", "التظلّم بيتسجّل كبلاغ في «مركز البلاغات» وتقدر تتابعه من هناك."));
    sh.btn("إلغاء", null, () => sh.close());
    const go = sh.btn("ابعت التظلّم", "g29-pri", async () => {
      const t = ta.value.trim();
      if (t.length < 10) { warn("اكتب تفاصيل أكتر شوية عشان نقدر نراجع."); return; }
      go.disabled = true; go.textContent = "ببعت…";
      const ok = await sendAppeal(t, b);
      sh.close();
      warn(ok ? "التظلّم اتسجّل ✓ هيتراجع في أقرب وقت." : "مقدرناش نسجّل التظلّم دلوقتي، جرّب بعد شوية.", ok);
    });
  }

  async function sendAppeal(text, b) {
    let ok = false;
    try {
      const u = uid();
      if (u) {
        const d = await r31("/report/new", {
          cat: "account", title: "تظلّم", body: clamp(text, 4000),
          diag: { appeal: true, kind: (b && b.k) || "", until: (b && b.until && isFinite(b.until)) ? b.until : 0, reason: clamp((b && b.reason) || "", 400),
            device: devInfo(), appVersion: (typeof APP_VERSION !== "undefined" ? String(APP_VERSION) : ""), screen: "guard29" },
        });
        if (d && d.ok && d.id) {
          post("/appeal", { uidh: await uidh(), rid: String(d.id), kind: (b && b.k) || "", text: clamp(text, 1200) });
          return true;
        }
      }
    } catch (e) {}
    // احتياطي: Firestore
    try {
      const f = FBx(), u = uid();
      if (f && f.set && u) {
        const at = _now();
        const rid = u + "_" + at.toString(36);
        const body = {
          uid: u, email: (f.user && f.user.email) || "", name: myName(),
          cat: "account", title: "تظلّم", text: clamp(text, 4000),
          sev: 3, prio: 70, status: "new",
          device: devInfo(), appVersion: (typeof APP_VERSION !== "undefined" ? String(APP_VERSION) : ""), screen: "guard29",
          logs: clamp("sanction=" + (b && b.k || "") + " until=" + (b && b.until || 0) + " reason=" + (b && b.reason || ""), 1000),
          img: "", at, updatedAt: at, slaDue: at + 240 * 60000, assignee: "", tags: "appeal,mod29", aiSummary: "",
          thread: JSON.stringify([{ by: "user", name: myName(), text: clamp(text, 2000), at }]),
          unreadUser: false, unreadAdmin: true, rating: 0, dupOf: "",
        };
        await f.set("reports/" + rid, body);
        ok = true;
        post("/appeal", { uidh: await uidh(), rid, kind: (b && b.k) || "", text: clamp(text, 1200) });
      }
    } catch (e) { ok = false; }
    return ok;
  }

  function kickOut(why) {
    try {
      if (typeof closeM === "function") closeM();
      D.querySelectorAll("#c3,#c3fab").forEach((n) => { try { n.remove(); } catch (e) {} });
      if (W.CHAT23 && typeof CHAT23.close === "function") try { CHAT23.close(); } catch (e) {}
      if (typeof go === "function") try { go("home"); } catch (e) {}
    } catch (e) {}
    if (why) warn(why);
  }

  // ================= بوابة القوانين =================
  function gateHits() { const a = LS.get(LSK.hits, []); const now = _now(); return (Array.isArray(a) ? a : []).filter((t) => now - t < 600000); }
  function pushHit() {
    const a = gateHits(); a.push(_now()); LS.set(LSK.hits, a.slice(-20));
    if (a.length >= 5) autoTempBan(a.length);
    return a.length;
  }
  async function autoTempBan(n) {
    const r = await post("/gate", { uidh: await uidh(), type: "abuse", hits: n, v: RULES.v, at: _now() });
    const u = (r && (r.until || (r.sanction && r.sanction.until))) || (_now() + 3600000);
    LS.set(LSK.hits, []);
    const b = { k: "chat_ban", t: "اتمنعت مؤقتًا من المجتمع", until: u, reason: "دخول وخروج متكرر من بوابة القوانين من غير التزام" };
    kickOut("");
    noticeSheet(b);
    pullUser(true);
  }

  let gateSheet = null;
  function openGate(after) {
    if (gateSheet && gateSheet.ov && gateSheet.ov.isConnected) return;
    ST.gateOpen = true;
    const sh = sheet({
      full: true, glow: true, icon: "🛡",
      title: "قوانين مجتمع سعراتي",
      sub: "نسخة " + (RULES.v || RULES_VERSION) + " · " + fmtN(ruleCount()) + " قاعدة",
      red: "كل القوانين دي حقيقية وبتتطبّق تلقائيًا — اقراها كويس.",
      red2: "المخالفة بتترصد لحظيًا، والعقوبة بتنزل من غير وسيط.",
      onClose() { ST.gateOpen = false; },
    });
    gateSheet = sh;
    sh.body.append(el("p", "g29-note", RULES.intro));
    RULES.groups.forEach((g) => {
      const w = el("div", "g29-grp");
      const h = el("h4"); h.append(el("i")); h.append(D.createTextNode((g.icon ? g.icon + " " : "") + (g.t || "")));
      w.append(h);
      const ol = el("ol");
      (g.r || []).forEach((x) => ol.append(el("li", null, x)));
      w.append(ol);
      sh.body.append(w);
    });
    const end = el("div", "g29-end", "خلصت القوانين. وقّع باسمك تحت عشان تأكد إنك قريتها وملتزم بيها.");
    sh.body.append(end);
    const sig = el("div", "g29-sig");
    sig.append(el("label", null, "اكتب اسمك كتوقيع"));
    const inp = el("input");
    inp.type = "text"; inp.maxLength = 60; inp.placeholder = "اسمك بالكامل"; inp.value = clamp(myName(), 60);
    inp.setAttribute("autocomplete", "name");
    sig.append(inp);
    sh.body.append(sig);
    sh.body.append(el("p", "g29-note", "توقيعك بيتسجّل مع تاريخ ووقت الموافقة ونسخة القوانين."));

    const refuse = sh.btn("أرفض", "g29-dng", () => doRefuse());
    const agree = sh.btn("أوافق وألتزم", "g29-pri", () => doAgree());
    agree.disabled = true;

    let reachedEnd = false;
    const check = () => {
      const b = sh.body;
      const atEnd = b.scrollTop + b.clientHeight >= b.scrollHeight - 48;
      if (atEnd) reachedEnd = true;
      const nameOk = inp.value.trim().length >= 3;
      agree.disabled = !(reachedEnd && nameOk);
      agree.textContent = !reachedEnd ? "اقرا القوانين للآخر…" : (nameOk ? "أوافق وألتزم" : "اكتب اسمك الأول");
    };
    sh.body.addEventListener("scroll", check, { passive: true });
    inp.addEventListener("input", check);
    setTimeout(check, 60);

    async function doAgree() {
      const name = clamp(inp.value.trim(), 60);
      if (name.length < 3) { warn("اكتب اسمك كتوقيع الأول."); return; }
      const rec = { v: RULES.v || RULES_VERSION, at: _now(), name };
      LS.set(LSK.rules, rec);
      ST.acceptedV = rec.v;
      ST.gateDone = true; ST.refused = false;
      LS.set(LSK.hits, []);
      try { const f = FBx(); if (f && f.update && uid()) f.update("users/" + uid(), { rules29: rec }).catch(() => {}); } catch (e) {}
      post("/gate", { uidh: await uidh(), type: "accept", v: rec.v, name, at: rec.at });
      r31("/rules/accept", { v: rec.v, name }).then((d) => { try { if (d && d.ok) W.__r31me = null; } catch (e) {} });
      sh.close();
      warn("تمام، مرحب بيك في المجتمع 💚 التزامك هو اللي بيحافظ على المكان.", true);
      if (typeof after === "function") setTimeout(() => { try { after(); } catch (e) {} }, 200);
    }
    async function doRefuse() {
      ST.refused = true;
      const n = pushHit();
      post("/gate", { uidh: await uidh(), type: "refuse", v: RULES.v || RULES_VERSION, hits: n, at: _now() });
      sh.close();
      kickOut("");
      const w = sheet({ title: "مقدرش أدخلك المجتمع", sub: "من غير موافقة على القوانين", icon: "🚪", red: "رفضت القوانين، فالمجتمع والشات اتقفلوا عليك." });
      w.body.append(el("p", "g29-note", "باقي التطبيق شغال عادي: حساب السعرات، الوجبات، التقارير، والمدرّب. ساعة ما تحب، افتح المجتمع وهتلاقي البوابة مستنياك."));
      w.body.append(el("p", "g29-note", "ملاحظة: الدخول والخروج من البوابة كذا مرة ورا بعض بيتحسب تحايل وبيجيب كتم مؤقت تلقائي."));
      w.btn("فهمت", "g29-pri", () => w.close());
    }
  }

  // بوابة قبل أي مساحة مجتمع: بترجع true لو مسموح
  function requireGate(after) {
    if (!on("gate")) return true;
    if (!signedIn()) return true;
    const b = sendBlockReason();
    if (b && (b.k === "banned" || b.k === "suspended" || b.k === "chat_ban")) { noticeSheet(b); return false; }
    if (accepted()) return true;
    if (!(gateSheet && gateSheet.ov && gateSheet.ov.isConnected) && _now() - (ST.lastHit || 0) > 4000) { ST.lastHit = _now(); pushHit(); }
    openGate(after);
    return false;
  }

  // ================= التطبيع والمعجم =================
  const B64 = {
    sex: "2LPZg9izfNmG2YrZg3zZhtmK2KfZg9mHfNi52KfZh9ix2Yd82LTYsdmF2YjYt9mHfNi02LHYp9mF2YrYt3zZhdiq2YbYp9mD2Yd82YXYqtmG2KfZg3zYstiofNmD2LN82LfZitiyfNio2LLYp9iyfNit2YTZhdmHfNmF2LV82YTYrdizfNis2YbYs3zYp9io2KfYrdmKfNin2KjYp9it2YrZh3zYudin2LHZinzYudin2LHZitmHfNiq2LnYsdmKfNmF2LLZh3zYp9i62KrYtdin2Kh82YXYudin2LTYsdmHfNiz2K3Yp9mCfNmE2YjYp9i3fNi02LDZiNiwfNmC2K3YqNmHfNiv2LnYp9ix2Yd8eHh4fHBvcm58cG9ybmh1YnxzZXh8c2V4eXxudWRlfG51ZGVzfG5zZnd8aGVudGFpfGJsb3dqb2J8ZGlja3xwdXNzeXxib29ic3x0aXRzfGFuYWx8bWlsZnxvbmx5ZmFuc3xjYW1naXJsfGVzY29ydHxob3JueXxvcmdhc218ZnVja21l",
    minor: "2YLYp9i12LF82YLYp9i12LHZh3zYt9mB2YR82LfZgdmE2Yd82LfZgdmE2Kl82KjZhtmI2KrZh3zZiNmE2K8g2LXYutmK2LF82KjZhtiqINi12LrZitix2Yd82LnZhdix2YfYpyAxMnzYudmF2LHZh9inIDEzfNi52YXYsdmH2KcgMTR82LnZhdix2YcgMTJ82LnZhdix2YcgMTN82LnZhdix2YcgMTR8Y2hpbGR8bWlub3J8dGVlbnx0ZWVuc3x1bmRlcmFnZXxsb2xpfGxvbGljb258c2hvdGF8amFpbGJhaXR8cHJldGVlbg==",
    prof: "2YPYs9mF2YN82YPYs9mFfNmD2LPYrtiq2YN82YrZhNi52YZ82KfZhNi52YZ82K7ZiNmEfNiu2YjYp9mEfNin2KjZhiDYp9mE2YXYqtmG2KfZg9mHfNin2KjZhiDYp9mE2YPZhNiofNin2KjZhiDYp9mE2YjYs9iu2Yd82KfYqNmGINin2YTYrdix2KfZhXzZitinINit2YrZiNin2YZ82YrYpyDZg9mE2Kh82YrYpyDYrdmF2KfYsXzZitinINmF2KrYrtmE2YF82YrYpyDYutio2Yp82YrYpyDYrdmC2YrYsXzZitinINmC2LDYsXzZitinINiy2YHYqnzZitinINmI2LPYrnzZitinINiq2KfZgdmHfNmF2YbZitmEfNiy2KjYp9mE2Yd82K3Yq9in2YTZh3zZgtmE2YrZhCDYp9mE2KfYr9iofNmI2LPYrtmHfNmF2YLYsdmBfNin2KrZhtmK2YR8ZnVja3xmdWNraW5nfGJpdGNofGJhc3RhcmR8YXNzaG9sZXxtb3RoZXJmdWNrZXJ8aWRpb3R8bW9yb258cmV0YXJkfHN0dXBpZHxzaHV0IHVwfHNoaXR0eXxzaGl0fGN1bnR8d2hvcmV8c2x1dA==",
    threat: "2YfZgtiq2YTZg3zYp9mC2KrZhNmDfNmH2LDYqNit2YN82KfYsNio2K3Zg3zZh9i22LHYqNmDfNmH2YPYs9ixfNmH2YHYttit2YN82YfZhti02LEg2LXZiNix2YN82YfYrNmK2YTZg3zZh9i52LHZgSDYudmG2YjYp9mG2YN82YfYr9mF2LF82KrZh9iv2YrYr3zYp9mG2KrYrdin2LF82KfZgtiq2YQg2YbZgdiz2YN8a2lsbCB5b3V8a2lsbCB5b3Vyc2VsZnxreXN8aSB3aWxsIGZpbmQgeW91fGRveHh8ZG94",
    hate: "2YPYp9mB2LF82YPZgdix2Yd82YbYrNizfNi52YbYtdix2Yp82YrYpyDYp9iz2YjYr3zZhdiq2K7ZhNmB2YrZhnzYqNmE2K/Zg9mFfNiv2YrZhtmDfNit2YLZitixINin2YTYp9i12YR82YrZh9mI2K/ZiiDZgtiw2LF82YbYp9iy2Yp8aGl0bGVyfG5heml8dGVycm9yaXN0",
    hack: "2YfZg9ixfNmH2KfZg9ixfNin2K7Yqtix2KfZgnzYqtmH2YPZitixfNmD2LHYp9mDfNio2KfYqti0fNmF2YjYryDZhdmH2YPYsXzZhtiz2K7ZhyDZhdmH2YPYsdmHfNiq2LfYqNmK2YIg2YXZh9mD2LF82KjYsdmK2YXZitmI2YUg2YXYrNin2YbYp3zYqNix2YrZhdmK2YjZhSDYqNio2YTYp9i0fNiq2K7Yt9mKINin2YTYr9mB2Ll82KjYp9mK2KjYp9izfNiq2KzYp9mI2LIg2KfZhNin2LTYqtix2KfZg3zYs9mK2LHZgdixINmF2KzYp9mG2Yp82YTYudioINi52YTZiSDYp9mE2LPZitix2YHYsXzYq9i62LHZh3zYp9iz2KrYutmE2KfZhCDYq9i62LHZh3xzcWwgaW5qZWN0aW9ufHhzc3xwYXlsb2FkfGJ5cGFzc3xjcmFja3xjcmFja2VkfG1vZGFwa3xtb2QgYXBrfGtleWdlbnxyZXZlcnNlIGVuZ2luZWVyfGZyaWRhfHJvb3R8amFpbGJyZWFrfGluamVjdA==",
    scam: "2YHZiNiv2KfZgdmI2YYg2YPYp9i0fNit2YjZhCDZgdmE2YjYs3zYrdmI2YQg2LnZhNmJINin2YTYsdmC2YV82LHZgtmFINmB2YrYstinfNix2YLZhSDYp9mE2YHZitiy2Kd8Y3Z2fG90cHzZg9mI2K8g2KfZhNiq2YHYudmK2YR82KfYqNi52KrZhNmKINin2YTZg9mI2K982KfYs9iq2KvZhdin2LEg2YXYttmF2YjZhnzYsdio2K0g2LPYsdmK2Ll82KfYsdio2KfYrSDZhdi22YXZiNmG2Yd82KjZitiq2YPZiNmK2YZ82YPYsdmK2KjYqtmIfNmB2YjYsdmD2LN82YfYr9in2YrYpyDZhdis2KfZhtmK2Yd82KfYtNiq2LHZgyDZgdmKINin2YTZgtmG2KfZh3zYtNi62YQg2YXZhiDYp9mE2KjZitiqfNiq2YXZiNmK2YR82YLYsdi2fHRlbGVncmFtLm1lfHQubWUvfHdoYXRzYXBwLmNvbXx3YS5tZXxiaXQubHl8c2hvcnR1cmx8ZnJlZSBtb25leXxnaXZlYXdheXxpbnZlc3RtZW50fGJpbmFyeSBvcHRpb258dXNkdHxwYXlwYWwgbWU=",
    spam: "2KfYr9iu2YQg2KfZhNix2KfYqNi3fNi02YjZgSDYp9mE2KjYsdmI2YHYp9mK2YR82KrYp9io2LnZhtmKfGZvbGxvdyBtZXxzdWIgdG982KfYtNiq2LHZgyDZgdmKINmC2YbYp9iq2Yp82YTZitmG2YMg2YHZiiDYp9mE2KjYp9mK2Yh8cHJvbW8gY29kZXzYp9i52YTYp9mGINmF2YXZiNmE",
  };
  const td = new TextDecoder();
  const unb64 = (s) => { try { const bin = atob(s); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return td.decode(u8); } catch (e) { return ""; } };
  let LEX = null;
  function lex() {
    if (LEX) return LEX;
    LEX = {};
    // كلمات ليها معنى بريء في سياق تطبيق أكل/صحة (الجنس في البروفايل، حلمه، مزة، هكسر بيضتين، حقن الإنسولين…)
    const SAFE = new Set(["جنس", "حلمه", "مزه", "مقرف", "هكسر", "root", "inject", "teen", "child", "طفل", "طفله", "تمويل", "قرض"].map((w) => normalize(w)));
    for (const k in B64) LEX[k] = unb64(B64[k]).split("|").filter(Boolean).map((w) => normalize(w)).filter((w) => k === "minor" ? true : !SAFE.has(w));
    return LEX;
  }

  // تطبيع عربي/إنجليزي مقاوم للتحايل
  const DIAC = /[\u0610-\u061A\u064B-\u0652\u0653-\u0655\u0670\u06D6-\u06ED\u0640]/g;
  const LEET = { "3": "ع", "7": "ح", "2": "ء", "5": "خ", "6": "ط", "9": "ص", "8": "غ", "4": "ش", "$": "s", "@": "a", "0": "o", "1": "i", "!": "i", "|": "l" };
  const AR_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
  function normalize(s, squeeze) {
    let t = String(s == null ? "" : s);
    try { t = t.normalize("NFKC"); } catch (e) {}
    t = t.toLowerCase();
    t = t.replace(/[\u0660-\u0669]/g, (c) => AR_DIGITS[c] || c);
    t = t.replace(DIAC, "");
    t = t.replace(/[أإآٱ]/g, "ا").replace(/[ىئ]/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ـ/g, "");
    t = t.replace(/[0-9$@!|]/g, (c) => (LEET[c] != null ? LEET[c] : c));
    t = t.replace(/[\u200b-\u200f\u202a-\u202e\ufeff]/g, "");
    t = t.replace(/([\s\S])\1+/g, "$1");               // كسسسس -> كس (نفس التطبيع على المعجم)
    t = t.replace(/[^\p{L}\p{N}\s]/gu, " ");            // شيل النقط والرموز
    t = t.replace(/\s+/g, " ").trim();
    if (squeeze) t = t.replace(/\s+/g, "");
    return t;
  }
  const URL_RE = /((https?:\/\/|www\.)[^\s]+|[a-z0-9-]+\.(com|net|org|me|io|ly|link|xyz|info|site|app|ru|tk)(\/[^\s]*)?)/i;
  const PHONE_RE = /(^|[^\d])(\+?\d[\d\s-]{8,16}\d)([^\d]|$)/;
  const REPEAT_RE = /(.)\1{7,}/;

  // كلمة قصيرة (<=4 حروف) ممكن تبقى جزء من كلمة بريئة (مكسرات، كسل، حمار في حماره…)
  // فبنطابقها ككلمة كاملة بس. الكلمات الأطول بنطابقها جوه النص المضغوط عشان التحايل بالمسافات والنقط.
  function wordHit(words, w) {
    for (let i = 0; i < words.length; i++) {
      const t = words[i];
      if (t === w) return true;
      if (t.length <= w.length + 3 && (t === "ال" + w || t === "و" + w || t === "ف" + w || t === "ب" + w || t === "يا" + w || t === w + "ك" || t === w + "ه" || t === w + "ها" || t === w + "هم" || t === w + "ي")) return true;
    }
    return false;
  }
  function hits(normSpaced, normSqueezed, words, list) {
    let n = 0;
    for (const w of list) {
      if (!w) continue;
      if (w.indexOf(" ") >= 0) { if (normSpaced.indexOf(w) >= 0) n++; continue; }
      if (w.length <= 4) { if (wordHit(words, w)) n++; continue; }
      if (normSqueezed.indexOf(w.replace(/\s+/g, "")) >= 0) n++;
    }
    return n;
  }

  // الفحص المبدئي على الجهاز — المعجم نفسه ما بيتعرضش للمستخدم أبدًا
  function scan(text) {
    const raw = String(text == null ? "" : text);
    const a0 = normalize(raw), b = normalize(raw, true);
    // دمج الحروف المتفرقة: «ك ل ب» -> «كلب» ، «f u c k» -> «fuck»
    const toks = a0.split(" ").filter(Boolean), merged = [];
    for (let i = 0; i < toks.length;) {
      if (toks[i].length === 1) { let j = i, w = ""; while (j < toks.length && toks[j].length === 1) w += toks[j++]; if (j - i >= 2) { merged.push(w); i = j; continue; } }
      merged.push(toks[i++]);
    }
    const words = merged;
    const a = merged.join(" ");
    // النسخة «الملزوقة» بتتبني بس لما النص مكتوب متفرّق (ش.ر.م.و.ط.ه / ك س م) عشان ما نقعش في كلمات بريئة
    const spaced = /(^|\s)\S(\s\S){2,}(\s|$)/.test(a0) || /[.\-_*]{1}\s*\S\s*[.\-_*]/.test(raw);
    const bb = spaced ? b : a;
    const L = lex();
    const cats = [];
    let score = 0;
    const add = (c, w) => { cats.push(c); score += w; };
    const sex = hits(a, bb, words, L.sex), minor = hits(a, bb, words, L.minor);
    if (sex) add("sexual", 60 + sex * 10);
    if (minor && sex) add("minor_sexual", 100);
    else if (minor && score) add("minor", 40);
    const pf = hits(a, bb, words, L.prof); if (pf) add("profanity", 56 + pf * 6);
    const th = hits(a, bb, words, L.threat); if (th) add("threat", 70);
    const ht = hits(a, bb, words, L.hate); if (ht) add("hate", 65);
    const hk = hits(a, bb, words, L.hack); if (hk) add("hacking", 50 + hk * 8);
    const sc = hits(a, bb, words, L.scam); if (sc) add("scam", 40 + sc * 8);
    const sp = hits(a, bb, words, L.spam); if (sp) add("spam", 25 + sp * 5);
    if (URL_RE.test(raw)) add("link", 30);
    if (PHONE_RE.test(raw)) add("contact", 30);
    if (REPEAT_RE.test(raw) || raw.length > 1800) add("flood", 15);
    const verdict = score >= 55 ? "block" : score >= 25 ? "review" : "allow";
    return { verdict, score, cats, len: raw.length };
  }

  // رسايل بتتقال للمستخدم من غير ما نكشف المعجم
  const MSG = {
    sexual: "الرسالة دي فيها محتوى جنسي أو إباحي — ممنوع نهائي هنا.",
    minor_sexual: "المحتوى ده بيمس الأطفال. اتمنع واتسجّل، والقرار النهائي من وكيل الحماية.",
    minor: "المحتوى ده قريب من خط أحمر بيخص القاصرين. اتمنع.",
    profanity: "في ألفاظ خارجة في الرسالة — عدّلها وابعتها تاني.",
    threat: "الرسالة فيها تهديد أو تحريض على أذى — ممنوع.",
    hate: "في كلام عنصري أو مهين — ممنوع.",
    hacking: "الرسالة فيها كلام عن تهكير أو تخطّي الدفع — ممنوع.",
    scam: "الرسالة شكلها نصب أو طلب تحويلات — اتمنعت لحمايتك وحماية غيرك.",
    spam: "الرسالة دعائية أو مكررة — ممنوع السبام هنا.",
    link: "اللينكات الخارجية مش مسموحة في المساحة دي.",
    contact: "ممنوع مشاركة أرقام أو بيانات تواصل في المجتمع.",
    flood: "الرسالة طويلة أو مكررة أوي.",
  };
  const reason = (cats) => { for (const c of cats) if (MSG[c]) return MSG[c]; return "المحتوى ده مخالف لقوانين المجتمع."; };

  // ================= الاتصال بالسيرفر: flag / scan =================
  async function flag(kind, detail, extra) {
    try {
      return await post("/flag", Object.assign({ uidh: await uidh(), kind, detail: clamp(typeof detail === "string" ? detail : JSON.stringify(detail || {}), 1200), at: _now(), app: (W.BUILD && BUILD.vn) || "" }, extra || {}));
    } catch (e) { return null; }
  }
  async function serverScan(kind, payload) {
    const body = Object.assign({ uidh: await uidh(), kind, at: _now() }, payload || {});
    const r = await post("/scan", body);
    if (!r) return null;
    const v = r.verdict || (r.ok === false ? "review" : "allow");
    if (v === "block") {
      warn("وكيل الحماية منع المحتوى ده بعد المراجعة." + (Array.isArray(r.reasons) && r.reasons.length ? " السبب: " + clamp(r.reasons[0], 120) : ""));
      pullUser(true);
    } else if (r.action) {
      pullUser(true);
    }
    return r;
  }

  // عدّاد التسارع
  function rateTick() {
    const now = _now();
    ST.sends = ST.sends.filter((t) => now - t < 60000);
    ST.sends.push(now);
    if (ST.sends.length === 41 || ST.sends.length === 120) tamperFlag("rapid_fire", { perMin: ST.sends.length });
    return ST.sends.length;
  }

  // الحارس الموحّد لأي إرسال مستخدم-لمستخدم
  async function guardText(kind, text, ctx, opt) {
    if (!on("scan")) return { ok: true };
    const b = sendBlockReason();
    if (b) { noticeSheet(b); return { ok: false, why: "sanction" }; }
    if (!accepted() && signedIn()) { requireGate(); return { ok: false, why: "gate" }; }
    const t = String(text == null ? "" : text);
    if (!t.trim()) return { ok: true };
    const key = t.trim().slice(0, 300);
    if (ST.okText && ST.okText.k === key && _now() - ST.okText.at < 4000) return { ok: true, cached: true };
    rateTick();
    const v = scan(t);
    // v32: لما الفحص الرسمي (chat31 → السيرفر) شغّال، السيرفر هو اللي يقرر ويعاقب ويبلّغ الأدمن — المنع المحلي هنا بس لو السيرفر مش متاح
    if (v.verdict === "block" && opt && opt.noServer && (typeof navigator === "undefined" || navigator.onLine !== false)) { ST.okText = { k: key, at: _now() }; return { ok: true, scan: v, deferred: true }; }
    if (v.verdict === "block") {
      warn(reason(v.cats));
      hap(30);
      flag("precheck", { kind, cats: v.cats, score: v.score, len: v.len, ctx: clamp(ctx || "", 60), sample: clamp(t, 200) });
      return { ok: false, why: "content", scan: v };
    }
    // مسموح محليًا: الفحص الرسمي بيكمّل في الخلفية
    ST.okText = { k: key, at: _now() };
    if (!(opt && opt.noServer)) serverScan(kind, { text: clamp(t, 4000), room: clamp((ctx && ctx.room) || ctx || "", 80), pre: v.verdict, cats: v.cats });
    return { ok: true, scan: v };
  }

  // ================= ربط مسارات الإرسال =================
  const val = (id) => { const e = D.getElementById(id); if (!e) return ""; return String(e.value != null ? e.value : e.textContent || ""); };
  const HOOKED = [];
  function wrapGlobal(name, pick, kind, ctx) {
    try {
      const f = W[name];
      if (typeof f !== "function" || f.__g29) return false;
      const wrapped = async function () {
        let text = "";
        try { text = typeof pick === "function" ? pick.apply(this, arguments) : String(pick || ""); } catch (e) { text = ""; }
        const r = await guardText(kind, text, typeof ctx === "function" ? ctx() : ctx || name);
        if (!r.ok) return;
        return f.apply(this, arguments);
      };
      wrapped.__g29 = 1;
      try { Object.defineProperty(wrapped, "name", { value: name }); } catch (e) {}
      W[name] = wrapped;
      HOOKED.push(name);
      return true;
    } catch (e) { return false; }
  }

  function hookSends() {
    // شات الغرف والأندية (room8/say8)
    wrapGlobal("say8", () => val("rmIn"), "msg", () => (W.ROOM && ROOM.room) || "room");
    // تعليقات المنشورات
    wrapGlobal("cmtSend8", () => val("cmIn"), "msg", "comments");
    // نشر منشور في المجتمع/النادي
    wrapGlobal("cmpSend8", () => val("cmpT"), "post", "compose");
    // ستوري
    wrapGlobal("stSend13", () => val("stTx"), "post", "story");
    // إعادة نشر
    wrapGlobal("repostGo13", () => val("rpT"), "post", "repost");
    // تعديل منشور
    wrapGlobal("editGo15", () => val("ep15"), "post", "post_edit");
    // رسايل خاصة v15
    wrapGlobal("dmSay15", () => val("dmIn"), "msg", () => (W.DM15 && DM15.room) || "dm");
    // شات البث المباشر
    wrapGlobal("liveSay15", () => val("lvIn"), "msg", "live15");
    wrapGlobal("lvSay18", () => val("lvi18"), "msg", "live18");
    // شات الجروبات v18
    wrapGlobal("gcSay18", () => val("gc18i"), "msg", () => "gc:" + ((W.GC18 && GC18.id) || ""));
    // منشور قبل/بعد (صور + نص)
    wrapGlobal("baPost18", () => val("ba18t"), "post", "beforeafter");
    // بلاغات: بنفحصها كمان عشان البلاغ الكاذب/المسيء
    wrapGlobal("reportGo8", function () { return String(arguments[2] || ""); }, "post", "report");

    // بوابة القوانين قبل مساحات المجتمع
    ["feed8", "clubs8", "club8", "comm17", "hub15", "compose8", "dm8", "gc18", "live18", "live15", "stories13", "storyNew13", "renderClub"].forEach((n) => gateWrap(n));

    // Chat 3.0 — غلاف على Room.prototype.send (كل المسارات: نص/صوت/وجبة/تحدي)
    hookChat3();
    // شبكة أمان: أي مسار إرسال تاني (شات 2.3 وغيره) بيتفلتر على مستوى fetch
    hookFetch();
  }

  function gateWrap(name) {
    try {
      const f = W[name];
      if (typeof f !== "function" || f.__g29g) return false;
      const self = W;
      const wrapped = function () {
        const args = arguments, me = this;
        if (!requireGate(() => { try { f.apply(me, args); } catch (e) {} })) return;
        return f.apply(me, args);
      };
      wrapped.__g29g = 1;
      W[name] = wrapped;
      HOOKED.push(name + " (بوابة)");
      return !!self;
    } catch (e) { return false; }
  }

  let chat3Tries = 0;
  function hookChat3() {
    try {
      const C = W.Chat3;
      if (!C) { if (chat3Tries++ < 40) setTimeout(hookChat3, 1500); return; }
      const R = C._test && C._test.Room;
      if (R && R.prototype && !R.prototype.send.__g29) {
        const orig = R.prototype.send;
        const wrapped = async function (kind, body, extra) {
          const text = typeof body === "string" ? body : (body && (body.text || body.title)) || "";
          const r = await guardText(kind === "text" || kind === "voice" ? "msg" : "msg", text, "chat3:" + (this && this.id || ""));
          if (!r.ok) return;
          return orig.apply(this, arguments);
        };
        wrapped.__g29 = 1;
        R.prototype.send = wrapped;
        HOOKED.push("Chat3.Room.send");
      }
      if (R && R.prototype && R.prototype.edit && !R.prototype.edit.__g29) {
        const oe = R.prototype.edit;
        const we = async function (id, body) {
          const r = await guardText("msg", body, "chat3edit:" + (this && this.id || ""));
          if (!r.ok) return;
          return oe.apply(this, arguments);
        };
        we.__g29 = 1; R.prototype.edit = we; HOOKED.push("Chat3.Room.edit");
      }
      if (typeof C.open === "function" && !C.open.__g29g) {
        const oo = C.open;
        const wo = function () { const a = arguments, m = this; if (!requireGate(() => { try { oo.apply(m, a); } catch (e) {} })) return; return oo.apply(m, a); };
        wo.__g29g = 1; C.open = wo; HOOKED.push("Chat3.open (بوابة)");
      }
    } catch (e) {}
  }

  // غلاف fetch: آخر خط دفاع لأي مسار إرسال مش متغلف بالاسم (شات 2.3 /c23، وأي op فيه نص)
  const SEND_OPS = /^(say|post|cmt|edit|v13\.story\.add|v13\.repost|v15\.say|v15\.live\.say|v16\.post|v18\.gcSay|v18\.lvChat|v18\.ba|story\.add|ticket|report)$/;
  const C23_OPS = /^(say|edit|create|invite|report)$/;
  function pickText(a) {
    if (!a || typeof a !== "object") return "";
    for (const k of ["txt", "text", "body", "msg", "message", "caption", "title", "why", "note"]) if (typeof a[k] === "string" && a[k]) return a[k];
    if (a.post && typeof a.post === "object") for (const k of ["txt", "text", "caption"]) if (typeof a.post[k] === "string") return a.post[k];
    return "";
  }
  function hookFetch() {
    try {
      if (!W.fetch || W.fetch.__g29) return;
      const prev = W.fetch;
      const wrapped = async function (u, o) {
        try {
          if (on("scan") && o && typeof o.body === "string" && o.body.length < 60000 && (o.method || "GET").toUpperCase() === "POST") {
            const url = typeof u === "string" ? u : (u && u.url) || "";
            if (/\/(c|c23)(\/|\?|$)/.test(url) && !/\/c23\/up/.test(url)) {
              let j = null; try { j = JSON.parse(o.body); } catch (e) { j = null; }
              const op = j && typeof j.op === "string" ? j.op : "";
              const args = (j && j.args) || {};
              const text = pickText(args);
              const isSend = op && (SEND_OPS.test(op) || C23_OPS.test(op) || /say|post|cmt|chat|story/i.test(op));
              if (isSend && text && !args.__g29ok) {
                const r = await guardText(/post|story|ba/i.test(op) ? "post" : "msg", text, clamp(args.r || args.room || op, 80), { noServer: !!W.__fetch31 }); // chat31 بيعمل الفحص الرسمي متزامن — منع التكرار
                if (!r.ok) throw new Error("g29_blocked");
              }
            }
          }
        } catch (e) {
          if (e && e.message === "g29_blocked") return new Response('{"error":"المحتوى اتمنع من وكيل الحماية"}', { status: 403, headers: { "content-type": "application/json" } });
        }
        return prev.apply(this, arguments);
      };
      wrapped.__g29 = 1;
      W.fetch = wrapped;
      G29._fw = wrapped;
      HOOKED.push("fetch backstop (/c و /c23)");
    } catch (e) {}
  }

  // ================= حماية الملفات =================
  const BAD_EXT = /\.(apk|aab|exe|msi|bat|cmd|com|scr|pif|cpl|dll|so|jar|sh|bash|zsh|ps1|vbs|js|mjs|jse|wsf|hta|py|rb|pl|php|elf|bin|dex|ipa|deb|rpm|iso|img|lnk|reg|swf|xpi|crx)(\.|$)/i;
  const ARCHIVE_EXT = /\.(zip|rar|7z|tar|gz|bz2|xz|cab|arj)(\.|$)/i;
  const OK_MIME = /^(image\/(jpeg|png|webp|gif|heic|heif)|video\/(mp4|webm|quicktime)|audio\/(mpeg|mp4|webm|ogg|wav|aac)|application\/pdf|text\/plain)$/i;
  const BAD_MIME = /(application\/(x-msdownload|x-executable|vnd\.android\.package-archive|x-sh|x-shellscript|javascript|x-msdos-program|java-archive)|text\/(javascript|html))/i;
  const MAX = { image: 12e6, video: 120e6, audio: 30e6, other: 25e6 };

  function fileKind(f) {
    const m = String(f.type || "").toLowerCase();
    if (m.startsWith("image/")) return "image";
    if (m.startsWith("video/")) return "video";
    if (m.startsWith("audio/")) return "audio";
    return "other";
  }
  function quickFileCheck(f) {
    const name = String(f.name || "");
    const mime = String(f.type || "").toLowerCase();
    const k = fileKind(f);
    if (BAD_EXT.test(name)) return "الملفات التنفيذية والسكربتات ممنوعة خالص.";
    if (BAD_MIME.test(mime)) return "نوع الملف ده ممنوع هنا.";
    if (ARCHIVE_EXT.test(name)) return "الملفات المضغوطة ممنوعة في المجتمع والشات.";
    if (mime && !OK_MIME.test(mime) && k === "other") return "نوع الملف مش مسموح — صور، فيديو، صوت، PDF، أو نص بس.";
    if (f.size > (MAX[k] || MAX.other)) return "حجم الملف أكبر من المسموح.";
    if (f.size === 0) return "الملف فاضي.";
    return "";
  }
  function imageSanity(f) {
    return new Promise((res) => {
      try {
        if (fileKind(f) !== "image" || !W.createImageBitmap) return res({ ok: true });
        const to = setTimeout(() => res({ ok: true, slow: true }), 6000);
        createImageBitmap(f).then((b) => {
          clearTimeout(to);
          const w = b.width, h = b.height;
          try { b.close && b.close(); } catch (e) {}
          if (!w || !h) return res({ ok: false, why: "الصورة تالفة أو مش صورة فعلًا." });
          if (w * h > 60e6) return res({ ok: false, why: "أبعاد الصورة كبيرة جدًا." });
          const ar = w / h;
          if (ar > 25 || ar < 0.04) return res({ ok: false, why: "أبعاد الصورة غريبة." });
          res({ ok: true, w, h });
        }).catch(() => { clearTimeout(to); res({ ok: false, why: "مقدرناش نقرا الصورة دي." }); });
      } catch (e) { res({ ok: true }); }
    });
  }
  async function hashFile(f) {
    try {
      if (f.size > 40e6) return "";           // بلاش نعلّق الواجهة
      const ab = await f.arrayBuffer();
      return await sha256(ab);
    } catch (e) { return ""; }
  }
  async function checkFile(f, ctx) {
    const q = quickFileCheck(f);
    if (q) { flag("file_block", { name: clamp(f.name, 120), mime: f.type, size: f.size, why: q, ctx: clamp(ctx || "", 40) }); return { ok: false, why: q }; }
    const im = await imageSanity(f);
    if (!im.ok) { flag("file_block", { name: clamp(f.name, 120), mime: f.type, size: f.size, why: im.why, ctx: clamp(ctx || "", 40) }); return { ok: false, why: im.why }; }
    const sha = await hashFile(f);
    const meta = { name: clamp(f.name, 160), mime: String(f.type || ""), size: f.size | 0, sha256: sha };
    if (im.w) { meta.w = im.w; meta.h = im.h; }
    const r = await serverScan("file", { fileMeta: meta, room: clamp(ctx || "", 80) });
    if (r && r.verdict === "block") return { ok: false, why: "الملف اتمنع بعد الفحص.", meta, server: r };
    return { ok: true, meta, server: r };
  }

  const FILE_CTX = /(c3|sheet|cmp|club|comm|chat|dm|room|story|gc18|lv|post|ba18)/i;
  function inCommunityContext(inp) {
    try {
      if (D.getElementById("c3") || D.querySelector(".g29-ov")) return true;
      let n = inp;
      for (let i = 0; n && i < 8; i++, n = n.parentElement) {
        const id = String(n.id || ""), cl = String(n.className && n.className.baseVal != null ? n.className.baseVal : n.className || "");
        if (FILE_CTX.test(id) || FILE_CTX.test(cl)) return true;
      }
      const t = D.querySelector(".tab.on");
      if (t && FILE_CTX.test(String(t.id || ""))) return true;
    } catch (e) {}
    return false;
  }
  function hookFiles() {
    if (!on("files")) return;
    D.addEventListener("change", (e) => {
      try {
        const inp = e.target;
        if (!inp || inp.tagName !== "INPUT" || String(inp.type).toLowerCase() !== "file") return;
        const files = inp.files ? [...inp.files] : [];
        if (!files.length) return;
        const community = inCommunityContext(inp);
        // الفحص السريع متزامن: لو فيه ملف ممنوع نوقف الحدث قبل ما التطبيق يشوفه
        for (const f of files) {
          const q = quickFileCheck(f);
          if (q) {
            e.stopImmediatePropagation();
            e.preventDefault();
            try { inp.value = ""; } catch (x) {}
            warn(q);
            flag("file_block", { name: clamp(f.name, 120), mime: f.type, size: f.size, why: q, community });
            return;
          }
        }
        if (!community) return;                 // بره المجتمع: الفحص السريع يكفي
        const list = files.slice(0, 6);
        (async () => {
          for (const f of list) {
            const r = await checkFile(f, "file_input");
            if (!r.ok) { try { inp.value = ""; } catch (x) {} warn(r.why || "الملف اتمنع."); break; }
          }
        })();
      } catch (x) {}
    }, true);
    HOOKED.push("input[type=file] change (capture)");
  }

  // ================= probe29: شات مفاجئ من وكيل الحماية =================
  function checkProbe(u) {
    if (!on("probe")) return;
    try {
      const p = u && u.probe29;
      if (!p) return;
      const at = until(p.at) || +p.at || 0;
      const seen = LS.get(LSK.probe, 0);
      if (at && at <= seen) return;
      LS.set(LSK.probe, at || _now());
      setTimeout(() => probeSheet(clamp(p.reason || "", 400), at), 900);
    } catch (e) {}
  }
  function probeSheet(reasonTxt, at) {
    const sh = sheet({
      title: "وكيل الحماية", sub: "محادثة عاجلة", icon: "🤖", glow: true,
      red: "في شك إن في مخالفة من حسابك.",
    });
    const wrap = el("div", "g29-chat");
    const lines = [
      "أهلًا. أنا وكيل الحماية في سعراتي.",
      reasonTxt ? "رصدت الآتي: " + reasonTxt : "رصدت نشاط من حسابك قريب من خط القوانين.",
      "محتاج أعرف إنك فاهم القوانين وملتزم بيها من دلوقتي ورايح.",
      "«موافق» معناها إنك مستوعب وهتلتزم. «لا» معناها رفض التزام، ودي في حد ذاتها مخالفة وهتترفع للمراجعة فورًا.",
    ];
    lines.forEach((t, i) => { const m = el("div", "g29-msg", t); m.style.animationDelay = REDUCED ? "0s" : (i * 0.12) + "s"; wrap.append(m); });
    sh.body.append(wrap);
    sh.body.append(el("p", "g29-note", "كل الردود بتتسجّل مع وقتها."));
    let answered = false;
    const send = async (answer) => {
      if (answered) return; answered = true;
      sh.close();
      const r = await post("/gate", { uidh: await uidh(), type: "probe", answer, at: _now(), probeAt: at || 0, reason: clamp(reasonTxt, 200) });
      if (answer === "agree") warn("تمام، اتسجّل التزامك. خليك على القوانين وهتعدي الحكاية على خير.", true);
      else warn("اتسجّل رفضك، والموضوع اترفع لوكيل الحماية للمراجعة.");
      try { const f = FBx(); if (f && f.update && uid()) f.update("users/" + uid(), { probe29Ack: { at: _now(), answer } }).catch(() => {}); } catch (e) {}
      setTimeout(() => pullUser(true), 2500);
      if (r && r.action) setTimeout(() => pullUser(true), 6000);
    };
    sh.btn("لا", "g29-dng", () => send("refuse"));
    sh.btn("موافق", "g29-pri", () => send("agree"));
  }

  // ================= كشف العبث =================
  function devInfo() {
    try { if (W.Android && Android.device) return clamp(String(Android.device()), 200); } catch (e) {}
    try { return clamp(navigator.userAgent, 200); } catch (e) { return ""; }
  }
  const TAMPER_SENT = {};
  function tamperFlag(kind, detail) {
    if (!on("tamper")) return;
    const now = _now();
    if (TAMPER_SENT[kind] && now - TAMPER_SENT[kind] < 15 * 60000) return;   // مرة كل ربع ساعة لكل نوع
    TAMPER_SENT[kind] = now;
    LS.set(LSK.tamper, { k: kind, at: now });
    ST.flags++;
    flag("tamper", Object.assign({ sig: kind, dev: devInfo(), v: (W.BUILD && BUILD.vn) || "", vc: (W.BUILD && BUILD.vc) || 0 }, detail || {}));
    // الكلاينت عمره ما بيحظر لوحده — السيرفر هو اللي بيقرر
  }

  const BASE = { fbReq: null, fetch: null, acct: null };
  function snapshot() {
    try { const f = FBx(); BASE.fbReq = f && f.req; } catch (e) {}
    BASE.fetch = W.fetch;
    BASE.acct = LS.get("sp_acct", null);
  }
  function devtoolsProbe() {
    try {
      // 1) فرق أبعاد النافذة (لوحة مفتوحة جنب/تحت)
      const touch = ("ontouchstart" in W) || (navigator.maxTouchPoints || 0) > 0;
      const wGap = Math.abs((W.outerWidth || 0) - (W.innerWidth || 0));
      const hGap = Math.abs((W.outerHeight || 0) - (W.innerHeight || 0));
      if (!touch && W.outerWidth && (wGap > 220 || hGap > 260)) return "size";   // الكيبورد على الموبايل بيغيّر الارتفاع، فبنتجاهله
      // 2) زمن تنفيذ debugger (بيتجمّد لما اللوحة مفتوحة)
      const t0 = performance.now();
      try { (function () { /* eslint-disable no-debugger */ debugger; })(); } catch (e) {}
      if (performance.now() - t0 > 180) return "debugger";
      // 3) خدعة toString على كائن (بتتنده لما الكونسول بيطبع)
      let touched = false;
      const probe = {}; Object.defineProperty(probe, "id", { get() { touched = true; return ""; } });
      try { if (W.console && console.debug) console.debug("%c", probe); } catch (e) {}
      if (touched) return "console";
    } catch (e) {}
    return "";
  }
  function integrityScan() {
    try {
      const f = FBx();
      if (BASE.fbReq && f && f.req !== BASE.fbReq) tamperFlag("fb_req_replaced", {});
      if (W.fetch && !W.fetch.__g29 && G29._fw) {
        // حد لفّ fetch فوقنا: ممكن يكون طبقة شرعية، فبنبلّغ بهدوء ونرجع نربط تاني (السيرفر يقرر)
        let nat = false; try { nat = /\[native code\]/.test(Function.prototype.toString.call(W.fetch)); } catch (e) {}
        tamperFlag(nat ? "fetch_reset_native" : "fetch_chain_changed", {});
        hookFetch();
      }
      if (typeof crypto === "undefined" || !crypto.subtle) tamperFlag("crypto_missing", {});
      // العبث بمفاتيح الاشتراك محليًا مقابل السيرفر
      const acct = LS.get("sp_acct", null);
      if (acct && ST.user) {
        const srvPlan = String(ST.user.plan || "free");
        const locPlan = String(acct.plan || "free");
        const srvUntil = until(ST.user.premiumUntil), locUntil = until(acct.premiumUntil);
        if (locPlan !== srvPlan && locPlan !== "free") tamperFlag("plan_mismatch", { loc: locPlan, srv: srvPlan });
        else if (locUntil - srvUntil > 36e5 && locUntil > _now()) tamperFlag("premium_until_mismatch", { d: Math.round((locUntil - srvUntil) / 36e5) });
      }
      if (BASE.acct && acct && BASE.acct.plan !== acct.plan && acct.plan !== "free" && !signedIn()) tamperFlag("plan_edited_offline", { to: String(acct.plan) });
      // آثار محاكي/روت
      const d = devInfo().toLowerCase();
      if (/(generic|emulator|sdk_gphone|goldfish|ranchu|genymotion|bluestacks|nox|ldplayer|x86_64 build)/.test(d)) tamperFlag("emulator", { dev: clamp(d, 120) });
      if (/(magisk|supersu|rooted|xposed|frida|lsposed)/.test(d)) tamperFlag("root", { dev: clamp(d, 120) });
      try { if (W.Android && typeof Android.secure === "function" && Android.secure() === false) tamperFlag("insecure_device", {}); } catch (e) {}
      // أدوات المطور
      const dt = devtoolsProbe();
      if (dt) tamperFlag("devtools", { how: dt });
    } catch (e) {}
  }

  // ================= الدورة الزمنية =================
  let booted = false;
  async function boot() {
    if (booted) return; booted = true;
    css();
    snapshot();
    try { lex(); } catch (e) {}
    hookSends();
    hookFiles();
    await loadRules().catch(() => {});
    await pullUser(true).catch(() => {});
    // بوابة القوانين أول ما يفتح التطبيق وهو داخل بحساب
    setTimeout(() => {
      try {
        if (!on("gate") || !signedIn()) return;
        const b = sendBlockReason();
        if (b) { if (b.k === "banned" || b.k === "suspended") noticeSheet(b); return; }
        if (!accepted()) openGate();
      } catch (e) {}
    }, 2200);
    setInterval(() => { pullUser(true); }, 5 * 60000);
    setInterval(integrityScan, 90000);
    setTimeout(integrityScan, 12000);
    D.addEventListener("visibilitychange", () => { if (!D.hidden) { pullUser(false); hookChat3(); } });
    // لو التطبيق حمّل حتت متأخرة (lz22) نعيد الربط بهدوء
    let rehook = 0;
    const iv = setInterval(() => { hookSends(); if (++rehook > 12) clearInterval(iv); }, 5000);
  }

  // ================= الواجهة العامة =================
  const G29 = {
    v: RULES_VERSION,
    scan(text) { const r = scan(text); return { verdict: r.verdict, score: r.score, cats: r.cats.slice(), msg: r.verdict === "allow" ? "" : reason(r.cats) }; },
    rules() { return { v: RULES.v || RULES_VERSION, intro: RULES.intro, count: ruleCount(), groups: RULES.groups.map((g) => ({ t: g.t, icon: g.icon, r: (g.r || []).slice() })) }; },
    status() {
      const s = sanctions(), l = localRules();
      return {
        signedIn: signedIn(),
        rulesVersion: RULES.v || RULES_VERSION,
        accepted: accepted(),
        acceptedAt: (l && l.at) || 0,
        signature: (l && l.name) || "",
        gateHits: gateHits().length,
        sanctions: { warn: s.warn, muted: s.muted, chatBanned: s.chatBanned, suspended: s.suspended, banned: s.banned, reason: s.reason },
        canSend: !sendBlockReason(),
        hooks: HOOKED.slice(),
        flags: ST.flags,
      };
    },
    openRules(after) { openGate(typeof after === "function" ? after : null); },
    appeal() { const b = sendBlockReason(); appealSheet(b || { k: "other", until: 0, reason: "" }); },
    async checkFile(f) { return checkFile(f, "api"); },
    refresh() { return pullUser(true); },
    _fw: null,
  };
  W.G29 = G29;

  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", () => setTimeout(boot, 1200));
  else setTimeout(boot, 1200);
})();
