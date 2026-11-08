/* سعراتي v29 — طبقة فوق v25..v28 (من غير حذف أي حاجة)
   1) «مركز البلاغات»: بلاغ احترافي بتصنيف وخطورة وتشخيص تلقائي وصورة، وبلاغاتي بخط زمني ومحادثة مع الإدارة وتقييم
   2) «ذكاء التنبيهات»: تنبيهات بتتبني من حالتك الحقيقية وبتتعلم من مواعيدك ومن اللي بتتجاهله
   3) الدخول: «بريد ذكي» (رابط سحري من غير كلمة سر) + زرار جوجل أشيك
   4) FX: سبلاش أورورا، جزيئات على الكارت الرئيسي، انتقال الصفحات، تموّج، كونفيتي
   5) تاج البريميوم المتحرك (للمشتركين بس) + إرسال الأعطال لوكيل الإصلاح التلقائي
   إيقاف أي جزء: localStorage sp29_off = "reports,notify,login,fx,crown" */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.V29 || !(W.BUILD && BUILD.app !== "admin")) return;
  const OFF = new Set((localStorage.getItem("sp29_off") || "").split(",").map((s) => s.trim()));
  const DEP = "https://deputy.sorati-command.workers.dev";
  const REDUCED = !!(W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ================= أدوات =================
  const EXTRA_ICONS = {
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8V5M4 13h3M17 13h3M5 19l2.5-2M19 19l-2.5-2M5 7l2.5 2M19 7l-2.5 2"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    dots: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    inbox: '<path d="M3 13h5l1 3h6l1-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    hand: '<path d="M7 11V6a2 2 0 0 1 4 0v5M11 10V4a2 2 0 0 1 4 0v6M15 10V6a2 2 0 0 1 4 0v8a7 7 0 0 1-12.5 4.3L3.6 14a2 2 0 0 1 3.2-2.4L7 12"/>',
  };
  try { if (typeof ICONS !== "undefined") for (const [k, v] of Object.entries(EXTRA_ICONS)) if (!ICONS[k]) ICONS[k] = v; } catch (e) {}
  const el = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ic = (n, s) => {
    const sp = el("span", "i25");
    let p = null; try { if (typeof ICONS !== "undefined" && ICONS[n]) p = ICONS[n]; } catch (e) {}
    if (!p) p = EXTRA_ICONS[n];
    if (p) { const t = D.createElement("template"); t.innerHTML = '<svg viewBox="0 0 24 24">' + p + "</svg>"; sp.append(t.content.firstChild); }
    if (s) sp.style.fontSize = s + "px"; return sp;
  };
  const say = (m, i) => { try { toast(m, i || "info"); } catch (e) {} };
  const ld = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const pj = (s, d) => { try { const v = JSON.parse(s); return v == null ? d : v; } catch (e) { return d; } };
  const now = () => Date.now();
  const fb = () => (typeof FB !== "undefined" ? FB : null);
  const signed = () => { try { return !!(fb() && FB.signedIn() && FB.user); } catch (e) { return false; } };
  const ver = () => { try { return typeof APP_VERSION !== "undefined" ? String(APP_VERSION) : (W.BUILD && BUILD.vn) || ""; } catch (e) { return ""; } };
  const A = () => W.Android || null;
  const bridge = (n, ...a) => { try { const x = A(); return x && typeof x[n] === "function" ? x[n](...a) : undefined; } catch (e) { return undefined; } };
  const vib = (ms) => { try { if (W.V25 && V25.vib) V25.vib(ms); else bridge("haptic", ms); } catch (e) {} };
  const pad = (n) => String(n).padStart(2, "0");
  const hm = (min) => pad(Math.floor(min / 60) % 24) + ":" + pad(Math.round(min) % 60);
  const minOf = (s) => { const [h, m] = String(s || "0:0").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
  const todayKey = () => new Date().toDateString();
  const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, "0")).join("");
  const b64u = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  // الوصول لمتغيرات التطبيق العامة (let/const على مستوى السكربت) من غير eval — الـ CSP مفيهاش unsafe-eval
  /* global S, tier, AUTH, dkey, getDay, sumDay, streak, targets, fmt */
  const GV = {
    S: () => (typeof S !== "undefined" ? S : undefined), tier: () => (typeof tier !== "undefined" ? tier : undefined),
    AUTH: () => (typeof AUTH !== "undefined" ? AUTH : undefined), dkey: () => (typeof dkey !== "undefined" ? dkey : undefined),
    getDay: () => (typeof getDay !== "undefined" ? getDay : undefined), sumDay: () => (typeof sumDay !== "undefined" ? sumDay : undefined),
    streak: () => (typeof streak !== "undefined" ? streak : undefined), targets: () => (typeof targets !== "undefined" ? targets : undefined),
    fmt: () => (typeof fmt !== "undefined" ? fmt : undefined),
  };
  const G = (n) => { try { return GV[n] ? GV[n]() : W[n]; } catch (e) { return undefined; } };
  const tierNow = () => { try { const f = G("tier"); return typeof f === "function" ? f() : "free"; } catch (e) { return "free"; } };
  const isElite = () => ["premium", "family", "black"].includes(tierNow());
  const screenName = () => {
    try {
      const m = D.getElementById("modal");
      const t = D.querySelector(".tab.on"); let s = t ? t.id.replace(/^t-/, "") : "?";
      if (m && m.classList.contains("on")) { const h = D.querySelector("#sheet h3, #sheet h2"); s += " > " + (h ? h.textContent.trim().slice(0, 40) : "sheet"); }
      return s;
    } catch (e) { return "?"; }
  };
  const device = () => {
    const ua = navigator.userAgent || ""; const m = ua.match(/Android [\d.]+;[^)]*/);
    return ((m ? m[0] : ua.slice(0, 80)) + " · " + screen.width + "x" + screen.height + "@" + (W.devicePixelRatio || 1) + " · " + (navigator.language || "")).slice(0, 200);
  };
  function sheet(title, sub) {
    try { openM(""); } catch (e) { return null; }
    const sh = D.getElementById("sheet"); if (!sh) return null;
    const h = el("h3"); const sp = el("span"); sp.append(title); const x = el("button", "icb tap"); x.append(ic("x", 18)); x.onclick = () => { try { closeM(); } catch (e) {} };
    h.append(sp, x); sh.append(h); if (sub) sh.append(el("p", "muted r29-sub", sub));
    const b = el("div", "r29-body"); sh.append(b); return b;
  }
  const ttl = (icon, text) => { const f = D.createDocumentFragment(); f.append(ic(icon, 20), D.createTextNode(" " + text)); return f; };
  const ago = (t) => { const s = Math.max(0, (now() - t) / 1000); if (s < 60) return "دلوقتي"; if (s < 3600) return "من " + Math.round(s / 60) + " دقيقة"; if (s < 86400) return "من " + Math.round(s / 3600) + " ساعة"; return "من " + Math.round(s / 86400) + " يوم"; };
  const dur = (ms) => { const neg = ms < 0; let s = Math.abs(Math.round(ms / 1000)); const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); const t = h ? h + "س " + pad(m) + "د" : m + " دقيقة"; return neg ? "متأخر " + t : "خلال " + t; };

  // ================= CSS =================
  const css = `
.r29-sub{margin:0 0 10px}
.r29-body{display:flex;flex-direction:column;gap:10px;padding-bottom:10px}
.r29-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.r29-cat{border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:12px 4px 10px;background:rgba(255,255,255,.04);color:inherit;font:inherit;font-size:12px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .18s,border-color .18s,background .18s}
.r29-cat .i25{font-size:22px;margin:0;color:#6ee7b7}
.r29-cat.on{border-color:#10b981;background:linear-gradient(160deg,rgba(16,185,129,.22),rgba(16,185,129,.05));transform:translateY(-2px)}
.r29-cat.on .i25{color:#f5c76b}
.r29-sev{display:flex;gap:6px;background:rgba(255,255,255,.05);border-radius:14px;padding:4px}
.r29-sev button{flex:1;border:0;border-radius:11px;padding:9px 2px;font:inherit;font-size:12px;font-weight:800;background:none;color:inherit;opacity:.75}
.r29-sev button.on{opacity:1;color:#022c22}
.r29-sev button.on.s1{background:#6ee7b7}.r29-sev button.on.s2{background:#fde68a}.r29-sev button.on.s3{background:#fdba74}.r29-sev button.on.s4{background:#fca5a5}
.r29-body input,.r29-body textarea{width:100%;box-sizing:border-box}
.r29-lbl{font-size:13px;font-weight:800;opacity:.8;margin-top:4px}
.r29-diag{border:1px dashed rgba(255,255,255,.15);border-radius:14px;padding:10px 12px;font-size:12px;opacity:.85;display:flex;gap:10px;align-items:flex-start}
.r29-diag pre{margin:6px 0 0;white-space:pre-wrap;direction:ltr;text-align:left;max-height:110px;overflow:auto;font-size:10.5px;opacity:.7}
.r29-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.r29-btn{border:0;border-radius:14px;padding:11px 14px;font:inherit;font-weight:800;background:rgba(16,185,129,.18);color:#6ee7b7;display:inline-flex;align-items:center;gap:6px;justify-content:center}
.r29-btn.sec{background:rgba(255,255,255,.07);color:inherit}.r29-btn.gold{background:linear-gradient(135deg,#f5c76b,#c8962e);color:#2a1a00}
.r29-btn.main{width:100%;background:linear-gradient(135deg,#10b981,#059669);color:#022c22;padding:14px}
.r29-btn[disabled]{opacity:.5}
.r29-shot{position:relative;width:84px;height:84px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.15)}
.r29-shot img{width:100%;height:100%;object-fit:cover}.r29-shot button{position:absolute;top:2px;inset-inline-end:2px;border:0;border-radius:50%;width:22px;height:22px;background:rgba(0,0,0,.6);color:#fff}
.r29-dup{border-radius:16px;padding:12px;background:linear-gradient(135deg,rgba(245,199,107,.16),rgba(245,199,107,.04));border:1px solid rgba(245,199,107,.35);font-size:13px;display:flex;flex-direction:column;gap:8px}
.r29-item{border-radius:18px;padding:12px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:6px;text-align:start;color:inherit;font:inherit;width:100%}
.r29-item b{font-size:14.5px}.r29-item small{opacity:.65}
.r29-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#f5c76b;box-shadow:0 0 8px #f5c76b;margin-inline-start:6px}
.r29-st{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;border-radius:999px;padding:3px 9px;background:rgba(255,255,255,.08)}
.r29-st.new{color:#93c5fd}.r29-st.triage{color:#c4b5fd}.r29-st.progress{color:#fde68a}.r29-st.waiting_user{color:#fdba74}.r29-st.resolved{color:#6ee7b7}.r29-st.closed{opacity:.6}
.r29-tl{display:flex;gap:4px;align-items:center;overflow-x:auto;padding:2px 0}
.r29-tl span{flex:1;min-width:58px;text-align:center;font-size:10.5px;font-weight:800;padding:6px 2px;border-radius:10px;background:rgba(255,255,255,.05);opacity:.5;position:relative}
.r29-tl span.done{opacity:1;background:rgba(16,185,129,.18);color:#6ee7b7}.r29-tl span.cur{opacity:1;background:linear-gradient(135deg,#10b981,#059669);color:#022c22}
.r29-tl span.wait{opacity:1;background:rgba(253,186,116,.2);color:#fdba74}
.r29-sla{font-size:12.5px;font-weight:800;display:flex;align-items:center;gap:6px}.r29-sla.late{color:#fca5a5}
.r29-thread{display:flex;flex-direction:column;gap:8px;max-height:46vh;overflow:auto;padding:4px 2px}
.r29-msg{max-width:84%;border-radius:16px;padding:9px 12px;font-size:13.5px;line-height:1.7;white-space:pre-wrap;word-break:break-word}
.r29-msg small{display:block;opacity:.55;font-size:10.5px;margin-top:3px}
.r29-msg.user{align-self:flex-start;background:rgba(16,185,129,.16);border-bottom-right-radius:4px}
.r29-msg.admin{align-self:flex-end;background:rgba(245,199,107,.14);border:1px solid rgba(245,199,107,.25);border-bottom-left-radius:4px}
.r29-msg.system{align-self:center;background:none;opacity:.6;font-size:12px;text-align:center}
.r29-stars{display:flex;gap:6px;justify-content:center;direction:ltr}
.r29-stars button{border:0;background:none;font-size:30px;color:rgba(255,255,255,.25);transition:transform .15s,color .15s}
.r29-stars button.on{color:#f5c76b;transform:scale(1.1)}
#r29fab{position:fixed;inset-inline-start:14px;bottom:calc(96px + env(safe-area-inset-bottom));z-index:9980;border:1px solid rgba(245,199,107,.45);border-radius:999px;padding:9px 14px;background:rgba(10,14,22,.92);color:#fde68a;font:inherit;font-weight:800;font-size:13px;display:flex;align-items:center;gap:6px;box-shadow:0 10px 30px rgba(0,0,0,.4);animation:in29 .4s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes in29{from{transform:translateY(20px);opacity:0}}
.n29-k{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.n29-k .i25{font-size:20px;color:#6ee7b7;margin:0}.n29-k div{flex:1}.n29-k small{display:block;opacity:.6;font-size:11.5px}
.n29-sw{width:46px;height:27px;border-radius:999px;background:rgba(255,255,255,.15);position:relative;border:0;transition:background .2s;flex:none}
.n29-sw::after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:inset-inline-start .2s}
.n29-sw.on{background:#10b981}.n29-sw.on::after{inset-inline-start:22px}
.n29-plan{border-radius:16px;padding:10px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:4px}
.n29-plan .t{font-weight:800;color:#f5c76b;direction:ltr;display:inline-block}
.n29-plan details{font-size:12px;opacity:.8}.n29-plan summary{cursor:pointer;color:#6ee7b7;font-weight:700}
.n29-bar{height:6px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}.n29-bar i{display:block;height:100%;background:linear-gradient(90deg,#10b981,#f5c76b)}
.l29-ml{display:flex;flex-direction:column;gap:10px;align-items:stretch}
.l29-env{width:86px;height:86px;margin:6px auto;border-radius:26px;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,rgba(245,199,107,.35),rgba(16,185,129,.18));position:relative}
.l29-env .i25{font-size:40px;margin:0;color:#fde68a}
.l29-env.fly{animation:fly29 1.6s ease-in-out infinite}.l29-env.spin::after{content:"";position:absolute;inset:-6px;border-radius:30px;border:2px solid transparent;border-top-color:#10b981;animation:spin29 .9s linear infinite}
.l29-env.ok{background:radial-gradient(circle,rgba(16,185,129,.45),rgba(16,185,129,.1))}
@keyframes fly29{50%{transform:translateY(-8px) rotate(-4deg)}}@keyframes spin29{to{transform:rotate(360deg)}}
.l29-c{text-align:center;font-size:13px;opacity:.75}
.l29-g{display:flex!important;align-items:center;justify-content:center;gap:10px;background:#fff!important;color:#1f1f1f!important;border:1px solid #dadce0!important;font-weight:800}
.l29-g svg{width:20px;height:20px}
#splash.fx29{background:#04060b;overflow:hidden}
#splash.fx29::before,#splash.fx29::after{content:"";position:absolute;inset:-40%;background:conic-gradient(from 0deg at 50% 50%,rgba(16,185,129,.0),rgba(16,185,129,.35),rgba(245,199,107,.25),rgba(56,189,248,.2),rgba(16,185,129,0));filter:blur(60px);animation:aur29 9s linear infinite;z-index:0}
#splash.fx29::after{animation-duration:14s;animation-direction:reverse;opacity:.6}
#splash.fx29>*{position:relative;z-index:1}
#splash.fx29 img{border-radius:28px;box-shadow:0 20px 60px rgba(16,185,129,.35);position:relative;-webkit-mask-image:linear-gradient(110deg,#000 40%,rgba(0,0,0,.75) 50%,#000 60%);-webkit-mask-size:300% 100%;animation:shim29 2.2s ease-in-out infinite}
#splash.fx29 h1{background:linear-gradient(90deg,#e7fff5,#f5c76b,#e7fff5);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shimt29 3s linear infinite}
@keyframes aur29{to{transform:rotate(360deg)}}@keyframes shim29{0%{-webkit-mask-position:100% 0}100%{-webkit-mask-position:0 0}}@keyframes shimt29{to{background-position:-200% 0}}
.pt29-c{position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.7}
.pg29{animation:pg29 .32s cubic-bezier(.2,.8,.2,1) both}@keyframes pg29{from{opacity:0;transform:translateX(-14px)}}
.rip29{position:absolute;border-radius:50%;background:rgba(255,255,255,.25);transform:scale(0);animation:rip29 .55s ease-out forwards;pointer-events:none}
@keyframes rip29{to{transform:scale(1);opacity:0}}
.cf29{position:fixed;top:-12px;width:8px;height:12px;border-radius:2px;z-index:99999;pointer-events:none;animation:cf29 2s cubic-bezier(.2,.6,.4,1) forwards}
@keyframes cf29{to{transform:translate(var(--dx),105vh) rotate(var(--rt));opacity:.9}}
/* تاج البريميوم */
.cr29{display:inline-flex;align-items:center;gap:4px;vertical-align:middle;position:relative;font-weight:800;color:#f5d08a;padding:1px 7px 1px 6px;border-radius:999px;background:linear-gradient(135deg,rgba(245,199,107,.18),rgba(200,150,46,.08));border:1px solid rgba(245,199,107,.4);overflow:hidden;animation:glow29 3.2s ease-in-out infinite;line-height:1.4}
.cr29 svg{width:1.05em;height:1.05em;flex:none;filter:drop-shadow(0 0 3px rgba(245,199,107,.6))}
.cr29::before{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:sw29 4.5s ease-in-out infinite}
.cr29 i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff6d6;box-shadow:0 0 4px #f5c76b;opacity:0;animation:spk29 2.6s ease-in-out infinite}
.cr29 i:nth-of-type(1){top:2px;left:20%}.cr29 i:nth-of-type(2){bottom:2px;left:60%;animation-delay:.9s}.cr29 i:nth-of-type(3){top:40%;left:88%;animation-delay:1.7s}
.cr29.blk{color:#e5e7eb;background:linear-gradient(135deg,#1b1b22,#050507);border-color:#c8962e}
.cr29.blk svg{filter:drop-shadow(0 0 3px rgba(200,150,46,.5))}
.cr29.solo{padding:2px;border-radius:50%;width:1.6em;height:1.6em;justify-content:center}
.tb8.cr29b{display:inline-flex;align-items:center;gap:3px;position:relative;overflow:hidden;animation:glow29 3.2s ease-in-out infinite}
.tb8.cr29b svg{width:11px;height:11px}
.tb8.cr29b::before{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.6),transparent);transform:skewX(-20deg);animation:sw29 4.5s ease-in-out infinite}
@keyframes glow29{50%{box-shadow:0 0 12px rgba(245,199,107,.45)}}@keyframes sw29{0%,55%{left:-60%}100%{left:130%}}@keyframes spk29{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1)}}
#hcr29{margin-inline-start:6px}
@media (prefers-reduced-motion:reduce){
 .cr29,.cr29::before,.cr29 i,.tb8.cr29b,.tb8.cr29b::before,#splash.fx29::before,#splash.fx29::after,#splash.fx29 img,#splash.fx29 h1,.pg29,.l29-env.fly,#r29fab,.r29-cat{animation:none!important;transition:none!important}
 .cr29 i{display:none}}
`;
  const st = el("style"); st.id = "v29css"; st.textContent = css; (D.head || D.documentElement).append(st);

  // ================= سجل الأعطال (ring buffer) + إرسال لوكيل الإصلاح =================
  const ERR = ld("sp29_err", []).slice(-20);
  let lastCrashPost = 0, uidh = "";
  const uidHash = async () => { if (uidh) return uidh; try { if (signed()) uidh = (await sha("sp29:" + FB.user.uid)).slice(0, 20); } catch (e) {} return uidh; };
  function logErr(msg, stack) {
    msg = String(msg || "").slice(0, 300); stack = String(stack || "").slice(0, 2000);
    if (!msg || /ResizeObserver loop|Script error\.?$/.test(msg)) return;
    const sc = screenName();
    ERR.push({ at: now(), msg, stack: stack.slice(0, 600), sc }); while (ERR.length > 20) ERR.shift(); sv("sp29_err", ERR);
    if (OFF.has("crash") || now() - lastCrashPost < 60000) return;
    lastCrashPost = now();
    uidHash().then((h) => {
      try {
        fetch(DEP + "/v1/app/crash", { method: "POST", headers: { "content-type": "application/json" }, keepalive: true,
          body: JSON.stringify({ v: ver(), screen: sc, msg, stack, ua: (navigator.userAgent || "").slice(0, 300), uidh: h }) }).catch(() => {});
      } catch (e) {}
    });
  }
  W.addEventListener("error", (e) => { try { logErr(e.message || (e.target && e.target.src ? "load fail " + e.target.src : ""), e.error && e.error.stack || (e.filename ? e.filename + ":" + e.lineno + ":" + e.colno : "")); } catch (x) {} }, true);
  W.addEventListener("unhandledrejection", (e) => { try { const r = e.reason; logErr("unhandled: " + (r && r.message || String(r)), r && r.stack); } catch (x) {} });
  const logsText = () => ERR.map((x) => new Date(x.at).toISOString().slice(5, 19) + " [" + x.sc + "] " + x.msg + (x.stack ? "\n  " + x.stack.split("\n").slice(0, 3).join("\n  ") : "")).join("\n").slice(-4000);

  // ===== Relay31: البلاغات والوارد عبر سيرفر النائب (Firestore احتياطي) =====
  const R31 = DEP + "/v1/app/r31";
  const BLOCKED31 = "المحتوى ده مش مسموح — عدّل الكلام وجرّب تاني 🙏";
  async function r31(path, body) {
    let tok = "", uid = "";
    try { await FB.token(); tok = FB.tok; uid = FB.user && FB.user.uid; } catch (e) {}
    if (!tok || !uid) { const e = new Error("not signed in"); e.status = 401; e.fallback = true; throw e; }
    const ac = typeof AbortController === "function" ? new AbortController() : null;
    const to = setTimeout(() => { try { ac && ac.abort(); } catch (e) {} }, 12000);
    let r, d;
    try { r = await fetch(R31 + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({}, body || {}, { uid, idToken: tok })), signal: ac ? ac.signal : undefined }); }
    catch (x) { clearTimeout(to); const e = new Error("network"); e.fallback = true; throw e; }
    clearTimeout(to);
    try { d = await r.json(); } catch (x) { const e = new Error("HTTP " + r.status); e.status = r.status; e.fallback = true; throw e; }
    if (!r.ok || !d || d.ok === false) {
      const code = (d && d.error) || "HTTP " + r.status;
      const e = new Error(code === "blocked" ? BLOCKED31 : code); e.code = code; e.status = r.status;
      e.fallback = r.status >= 500 || r.status === 404 && code !== "not_found" || r.status === 401;
      throw e;
    }
    return d;
  }
  async function r31me(force) {
    const c = W.__r31me; if (!force && c && c.d && now() - c.at < 60000) return c.d;
    const d = await r31("/me", {}); W.__r31me = { at: now(), d }; return d;
  }
  const isR31 = (rid) => /^r_[0-9a-f]+$/i.test(String(rid || ""));
  const CAT_OUT = (c) => c === "pay" ? "payment" : ["account", "bug", "payment", "other"].includes(c) ? c : "other";
  const PRIO_IN = { low: 25, normal: 45, high: 65, urgent: 85 };
  function fromItem(i) {
    if (!i) return null;
    const dg = (i.diag && typeof i.diag === "object") ? i.diag : {};
    let th = Array.isArray(i.thread) ? i.thread.map((m) => Object.assign({}, m, { by: m.by === "agent" ? "admin" : m.by })) : [];
    if (th.length && th[0].by === "user" && (th[0].text === i.body || th[0].text === i.title)) th = th.slice(1);
    const c = repCache()[i.id] || {};
    const cat = dg.cat29 || (i.cat === "payment" ? "pay" : i.cat) || "other";
    return { _r31: 1, id: i.id, uid: i.uid, cat: CATN[cat] ? cat : "other", title: i.title, text: i.body || "", sev: dg.sev29 || 0,
      prio: dg.prio29 != null ? dg.prio29 : (PRIO_IN[i.prio] || 45), status: i.status === "waiting" ? "waiting_user" : (i.status || "new"),
      at: i.created, updatedAt: i.updated, slaDue: i.sla_at, img: i.img || "", thread: th, rating: i.rating || 0,
      unreadUser: th.filter((m) => m.by === "admin").length > (c.seen || 0) };
  }
  const markSeen = (rid, d) => { const c = repCache(); c[rid] = Object.assign(c[rid] || {}, { seen: adminCount(d.thread || []), unread: false }); sv(KRC, c); };

  // ===== إشعار محلي فوري =====
  function localNotify(id, title, text, sec) {
    try { const x = A(); if (x && typeof x.remOnce === "function") { x.remOnce(String(id), Math.max(1, sec || 1), title, text); return true; } } catch (e) {}
    try {
      if ("Notification" in W && Notification.permission === "granted") { setTimeout(() => { try { new Notification(title, { body: text, icon: "logo.png", tag: String(id) }); } catch (e) {} }, (sec || 1) * 1000); return true; }
    } catch (e) {}
    return false;
  }

  // =====================================================================
  // 1) مركز البلاغات
  // =====================================================================
  const CATS = [
    ["bug", "bug", "عطل/مشكلة"], ["pay", "card", "دفع واشتراك"], ["account", "lock", "الحساب"], ["food", "bowl", "أكل وسعرات"],
    ["ai", "brain", "الذكاء والكوتش"], ["abuse", "alert", "إساءة/محتوى"], ["idea", "bulb", "اقتراح"], ["other", "dots", "حاجة تانية"],
  ];
  const CATN = Object.fromEntries(CATS.map((c) => [c[0], c[2]]));
  const CATW = { pay: 22, account: 18, bug: 14, abuse: 16, ai: 10, food: 8, idea: 0, other: 4 };
  const SEV = [[1, "بسيطة"], [2, "مضايقاني"], [3, "كبيرة"], [4, "واقفة خالص"]];
  const STN = { new: "اتبعت", triage: "بنراجعه", progress: "شغالين عليه", waiting_user: "مستنيين ردك", resolved: "اتحل", closed: "اتقفل" };
  const KREP = "sp29_rep", KRC = "sp29_repc";
  const mine = () => ld(KREP, []).filter((x) => x && x.rid);
  const repCache = () => ld(KRC, {});
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function calcPrio(sev, cat, hasLogs) {
    const paid = tierNow() !== "free";
    const rep = mine().some((x) => now() - x.at < 864e5);
    return clamp(sev * 18 + (CATW[cat] || 0) + (paid ? 10 : 0) + (rep ? 8 : 0) + (hasLogs ? 6 : 0), 0, 100);
  }
  const slaMin = (p) => (p >= 80 ? 60 : p >= 60 ? 240 : p >= 40 ? 720 : 2880);
  const isOpen = (s) => !["resolved", "closed"].includes(s);
  const adminCount = (th) => th.filter((m) => m.by === "admin").length;

  async function compress(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      let max = 1280, q = 0.82, out = "";
      for (let k = 0; k < 7; k++) {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = D.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        out = c.toDataURL("image/jpeg", q);
        if (out.length <= 350 * 1024) return out;
        q = Math.max(0.4, q - 0.12); max = Math.round(max * 0.8);
      }
      return out.length <= 350 * 1024 ? out : "";
    } finally { URL.revokeObjectURL(url); }
  }

  function reportSheet(preset) {
    if (!signed()) { say("سجّل دخول الأول عشان نقدر نرد عليك", "user"); try { loginSheet(); } catch (e) {} return; }
    const b = sheet(ttl("flag", "مركز البلاغات"), "قولنا إيه اللي حصل — بنرد على كل بلاغ، والمهم بيتحل الأول."); if (!b) return;
    const st8 = { cat: (preset && preset.cat) || "", sev: 2, img: "", diag: true, dupTo: "" };
    const top = el("div", "r29-row"); const mineB = el("button", "r29-btn sec tap"); mineB.append(ic("inbox", 18), el("span", null, "بلاغاتي"));
    const unread = mine().filter((x) => (repCache()[x.rid] || {}).unread).length; if (unread) mineB.append(el("span", "r29-dot"));
    mineB.onclick = () => myReports(); top.append(mineB); b.append(top);
    b.append(el("div", "r29-lbl", "نوع المشكلة"));
    const grid = el("div", "r29-cats"); const dupBox = el("div"); 
    CATS.forEach(([k, i, l]) => { const t = el("button", "r29-cat tap" + (st8.cat === k ? " on" : "")); t.append(ic(i), el("span", null, l)); t.onclick = () => { st8.cat = k; grid.querySelectorAll(".r29-cat").forEach((x) => x.classList.toggle("on", x === t)); vib(8); dupCheck(); }; grid.append(t); });
    b.append(grid, dupBox);
    b.append(el("div", "r29-lbl", "قد إيه مأثرة عليك؟"));
    const sv8 = el("div", "r29-sev");
    SEV.forEach(([n, l]) => { const x = el("button", "s" + n + (n === st8.sev ? " on" : ""), l); x.onclick = () => { st8.sev = n; sv8.querySelectorAll("button").forEach((y) => y.classList.toggle("on", y === x)); }; sv8.append(x); });
    b.append(sv8);
    const ti = el("input"); ti.placeholder = "عنوان قصير (مثلاً: الدفع اتخصم ومفيش اشتراك)"; ti.maxLength = 90;
    const tx = el("textarea"); tx.rows = 4; tx.placeholder = "احكي بالتفصيل: كنت بتعمل إيه وحصل إيه؟"; tx.maxLength = 3000;
    if (preset && preset.text) tx.value = String(preset.text);
    b.append(el("div", "r29-lbl", "التفاصيل"), ti, tx);
    // صورة
    const shotRow = el("div", "r29-row"); const fi = el("input"); fi.type = "file"; fi.accept = "image/*"; fi.style.display = "none";
    const pick = el("button", "r29-btn sec tap"); pick.append(ic("image", 18), el("span", null, "ضيف سكرين أو صورة"));
    pick.onclick = () => fi.click();
    fi.onchange = async () => {
      const f = fi.files && fi.files[0]; if (!f) return;
      pick.disabled = true;
      try { st8.img = await compress(f); } catch (e) { st8.img = ""; }
      pick.disabled = false; drawShot();
      if (!st8.img) say("الصورة كبيرة أوي، جرّب واحدة تانية");
    };
    const drawShot = () => {
      shotRow.querySelector(".r29-shot")?.remove();
      if (!st8.img) return;
      const w = el("div", "r29-shot"); const im = el("img"); im.src = st8.img; im.alt = ""; const x = el("button", null, "×"); x.onclick = () => { st8.img = ""; drawShot(); };
      w.append(im, x); shotRow.append(w);
    };
    shotRow.append(pick, fi); b.append(shotRow);
    // التشخيص
    const dg = el("div", "r29-diag"); const sw = el("button", "n29-sw on"); sw.setAttribute("aria-label", "إرفاق التشخيص");
    const dgt = el("div"); dgt.append(el("b", null, "إرفاق معلومات تشخيص تلقائيًا"), el("div", null, "الجهاز، الإصدار، الشاشة الحالية، وآخر الأخطاء — من غير أي بيانات أكل أو كلمات سر."));
    const pre = el("pre", null, "الجهاز: " + device() + "\nالإصدار: " + ver() + "\nالشاشة: " + ((preset && preset.screen) || screenName()) + "\nأخطاء: " + ERR.length + (ERR.length ? "\n" + logsText().slice(-600) : ""));
    dgt.append(pre); sw.onclick = () => { st8.diag = !st8.diag; sw.classList.toggle("on", st8.diag); pre.style.display = st8.diag ? "" : "none"; };
    dg.append(sw, dgt); b.append(dg);
    const go = el("button", "r29-btn main tap"); go.append(ic("send", 20), el("span", null, "ابعت البلاغ"));
    b.append(go);
    const scr = (preset && preset.screen) || screenName();
    function dupCheck() {
      dupBox.replaceChildren(); st8.dupTo = "";
      const c = repCache();
      const d = mine().filter((x) => x.cat === st8.cat && now() - x.at < 864e5 && isOpen((c[x.rid] || {}).status || "new")).sort((a, b2) => b2.at - a.at)[0];
      if (!d) return;
      const box = el("div", "r29-dup"); box.append(el("div", null, "عندك بلاغ مفتوح من نفس النوع " + ago(d.at) + ": «" + (d.title || CATN[d.cat]) + "». تحب تضيف الكلام ده عليه بدل بلاغ جديد؟ كده بيتحل أسرع."));
      const r = el("div", "r29-row"); const y = el("button", "r29-btn gold tap", "ضيفه على القديم"); const n = el("button", "r29-btn sec tap", "لا، بلاغ جديد");
      y.onclick = () => { st8.dupTo = d.rid; box.replaceChildren(el("b", null, "تمام — هيتضاف على بلاغك المفتوح.")); };
      n.onclick = () => box.remove(); r.append(y, n); box.append(r); dupBox.append(box);
    }
    if (st8.cat) dupCheck();
    go.onclick = async () => {
      const title = ti.value.trim(), text = tx.value.trim();
      if (!st8.cat) return say("اختار نوع المشكلة الأول");
      if (text.length < 5 && !title) return say("اكتب تفاصيل بسيطة عشان نفهم");
      go.disabled = true; go.lastChild.textContent = "بيتبعت...";
      try {
        if (st8.dupTo) { await appendThread(st8.dupTo, (title ? title + "\n" : "") + text, st8.img); done(st8.dupTo, true); return; }
        const u = FB.user, t0 = now(), rid = u.uid + "_" + t0.toString(36);
        const logs = st8.diag ? logsText() : "";
        const prio = calcPrio(st8.sev, st8.cat, !!logs);
        const doc = {
          uid: u.uid, email: u.email || "", name: u.name || "", cat: st8.cat, title: title || CATN[st8.cat], text, sev: st8.sev, prio, status: "new",
          device: st8.diag ? device() : "", appVersion: ver(), screen: st8.diag ? scr : "", logs, img: st8.img || "",
          at: t0, updatedAt: t0, slaDue: t0 + slaMin(prio) * 60000, assignee: "", tags: "", aiSummary: "",
          thread: JSON.stringify([{ by: "system", name: "سعراتي", text: "البلاغ وصل — هنرد عليك في أقرب وقت.", at: t0 }]),
          unreadUser: false, unreadAdmin: true, rating: 0, dupOf: "",
        };
        let fid = rid;
        try {
          const r = await r31("/report/new", { cat: CAT_OUT(st8.cat), title: doc.title, body: text || doc.title, img: st8.img || undefined,
            diag: { cat29: st8.cat, sev29: st8.sev, prio29: prio, device: doc.device, appVersion: doc.appVersion, screen: doc.screen, logs: logs.slice(-3000) } });
          fid = r.id; doc.slaDue = r.sla_at || doc.slaDue;
        } catch (e) { if (!e.fallback) throw e; await FB.set("reports/" + rid, doc); }
        const L = mine(); L.unshift({ rid: fid, cat: st8.cat, at: t0, title: doc.title }); sv(KREP, L.slice(0, 60));
        const c = repCache(); c[fid] = { status: "new", n: 0, seen: 0, unread: false, updatedAt: t0, slaDue: doc.slaDue }; sv(KRC, c);
        done(fid, false);
      } catch (e) {
        go.disabled = false; go.lastChild.textContent = "ابعت البلاغ";
        say(e && e.code === "blocked" ? BLOCKED31 : e && e.code === "rate_limited" ? "بعت كتير ورا بعض — استنى دقيقة" : e && e.status === 403 ? "السيرفر رافض دلوقتي، جرّب كمان شوية" : "مقدرناش نبعت: " + ((e && e.message) || "مفيش نت"));
      }
    };
    function done(rid, merged) {
      confetti(); vib([15, 40, 15]);
      b.replaceChildren();
      const w = el("div", "l29-ml"); const env = el("div", "l29-env ok"); env.append(ic("check"));
      w.append(env, el("h2", null, merged ? "اتضاف على بلاغك" : "البلاغ وصل"), el("p", "l29-c", "رقم البلاغ: " + rid.split("_").pop().toUpperCase() + " — هتلاقي الرد هنا وفي إشعار أول ما الإدارة ترد."));
      const v = el("button", "r29-btn main tap", "تابع البلاغ"); v.onclick = () => reportDetail(rid);
      w.append(v); b.append(w);
    }
  }

  async function fetchRep(rid) {
    if (isR31(rid)) { try { const r = await r31("/report/get", { id: rid }); return fromItem(r.item || r.report); } catch (e) { if (e.code === "not_found") return null; throw e; } }
    const d = await FB.get("reports/" + rid);
    if (!d) return null;
    d.thread = pj(d.thread, []); if (!Array.isArray(d.thread)) d.thread = [];
    return d;
  }
  async function appendThread(rid, text, img) {
    if (isR31(rid)) { await r31("/report/reply", { id: rid, text: String(text).slice(0, 2000), img: img || undefined }); return { _r31: 1 }; }
    const d = await fetchRep(rid); if (!d) throw new Error("البلاغ مش موجود");
    d.thread.push({ by: "user", name: (FB.user && FB.user.name) || "", text: String(text).slice(0, 2000) + (img ? "\n[📎 صورة مرفقة]" : ""), at: now() });
    const o = { thread: JSON.stringify(d.thread.slice(-80)), unreadAdmin: true, updatedAt: now() };
    if (d.status === "waiting_user") o.status = "progress";
    if (img && !d.img) o.img = img;
    await FB.update("reports/" + rid, o);
    return d;
  }

  async function myReports() {
    const b = sheet(ttl("inbox", "بلاغاتي")); if (!b) return;
    const L = mine();
    const nb = el("button", "r29-btn main tap"); nb.append(ic("plus", 18), el("span", null, "بلاغ جديد")); nb.onclick = () => reportSheet();
    b.append(nb);
    if (!L.length) { b.append(el("p", "l29-c", "مفيش بلاغات لسه. لو حاجة مضايقاك قولنا.")); return; }
    const list = el("div", "r29-body"); b.append(list);
    const c = repCache();
    const row = (x, d) => {
      const it = el("button", "r29-item tap"); const h = el("div", "r29-row");
      const s = (d && d.status) || (c[x.rid] || {}).status || "new";
      h.append(el("b", null, (d && d.title) || x.title || CATN[x.cat]), el("span", "r29-st " + s, STN[s] || s));
      if ((d && d.unreadUser) || (c[x.rid] || {}).unread) h.append(el("span", "r29-dot"));
      it.append(h, el("small", null, CATN[x.cat] + " · " + ago(x.at) + (d && isOpen(s) && d.slaDue ? " · الرد " + dur(d.slaDue - now()) : "")));
      it.onclick = () => reportDetail(x.rid); return it;
    };
    L.forEach((x) => list.append(row(x)));
    const res = await Promise.all(L.slice(0, 20).map((x) => fetchRep(x.rid).catch(() => null)));
    list.replaceChildren(); L.forEach((x, i) => { const d = res[i]; if (d) cacheRep(x.rid, d); list.append(row(x, d)); });
  }
  function cacheRep(rid, d) {
    const c = repCache(); c[rid] = { status: d.status, n: adminCount(d.thread || []), seen: (c[rid] || {}).seen || 0, unread: !!d.unreadUser, updatedAt: d.updatedAt || 0, slaDue: d.slaDue || 0 }; sv(KRC, c);
  }

  let detailTimer = 0;
  async function reportDetail(rid) {
    clearInterval(detailTimer);
    const b = sheet(ttl("flag", "تفاصيل البلاغ")); if (!b) return;
    b.append(el("p", "l29-c", "بحمّل..."));
    let d; try { d = await fetchRep(rid); } catch (e) { b.replaceChildren(el("p", "l29-c", "مقدرتش أحمّل البلاغ — اتأكد من النت.")); return; }
    if (!d) { b.replaceChildren(el("p", "l29-c", "البلاغ ده مش موجود.")); return; }
    cacheRep(rid, d); if (d._r31) markSeen(rid, d);
    if (d.unreadUser && !d._r31) { FB.update("reports/" + rid, { unreadUser: false }).catch(() => {}); const c = repCache(); if (c[rid]) { c[rid].unread = false; sv(KRC, c); } refreshFab(); }
    b.replaceChildren();
    const hd = el("div", "r29-row"); hd.append(el("b", null, d.title || CATN[d.cat]), el("span", "r29-st " + d.status, STN[d.status] || d.status));
    b.append(hd, el("small", "muted", CATN[d.cat] + " · " + (SEV.find((s) => s[0] === d.sev) || [0, ""])[1] + " · " + ago(d.at)));
    // الخط الزمني
    const steps = ["new", "triage", "progress", "resolved", "closed"]; const ci = d.status === "waiting_user" ? 2 : steps.indexOf(d.status);
    const tl = el("div", "r29-tl"); steps.forEach((s, i) => tl.append(el("span", i < ci ? "done" : i === ci ? (d.status === "waiting_user" ? "wait" : "cur") : "", d.status === "waiting_user" && i === 2 ? STN.waiting_user : STN[s])));
    b.append(tl);
    if (isOpen(d.status) && d.slaDue) {
      const sl = el("div", "r29-sla"); sl.append(ic("timer", 16)); const sp = el("span"); sl.append(sp); b.append(sl);
      const tick = () => { const ms = d.slaDue - now(); sp.textContent = "الرد المتوقع " + dur(ms); sl.classList.toggle("late", ms < 0); };
      tick(); detailTimer = setInterval(() => { if (!D.body.contains(sl)) return clearInterval(detailTimer); tick(); }, 30000);
    }
    if (d.img && /^data:image\/jpeg;base64,/.test(d.img)) { const im = el("img"); im.src = d.img; im.alt = ""; im.style.cssText = "max-width:100%;max-height:180px;border-radius:14px;object-fit:contain"; b.append(im); }
    // المحادثة
    const th = el("div", "r29-thread");
    const first = el("div", "r29-msg user"); first.append(D.createTextNode(d.text || "")); first.append(el("small", null, new Date(d.at).toLocaleString("ar-EG")));
    th.append(first);
    d.thread.forEach((m) => { const x = el("div", "r29-msg " + (["user", "admin", "system"].includes(m.by) ? m.by : "system")); x.append(D.createTextNode(String(m.text || ""))); x.append(el("small", null, (m.by === "admin" ? (m.name || "فريق سعراتي") + " · " : "") + (m.at ? new Date(m.at).toLocaleString("ar-EG") : ""))); th.append(x); });
    b.append(th); setTimeout(() => { th.scrollTop = th.scrollHeight; }, 50);
    if (d.status !== "closed" || now() - (d.updatedAt || 0) < 14 * 864e5) {
      const rt = el("textarea"); rt.rows = 2; rt.maxLength = 2000; rt.placeholder = d.status === "waiting_user" ? "الإدارة مستنية ردك هنا..." : "اكتب رد أو تفاصيل زيادة...";
      const r = el("div", "r29-row"); const snd = el("button", "r29-btn tap"); snd.append(ic("send", 18), el("span", null, "ابعت"));
      snd.onclick = async () => { const t = rt.value.trim(); if (!t) return; snd.disabled = true; try { await appendThread(rid, t, ""); say("اتبعت", "check"); reportDetail(rid); } catch (e) { snd.disabled = false; say(e.code === "blocked" ? BLOCKED31 : e.code === "closed" ? "البلاغ اتقفل — افتحه تاني الأول" : "ما اتبعتش: " + e.message); } };
      r.append(snd);
      if (!isOpen(d.status)) {
        const ro = el("button", "r29-btn sec tap"); ro.append(ic("refresh", 18), el("span", null, "المشكلة رجعت"));
        ro.onclick = async () => {
          ro.disabled = true;
          try { if (d._r31) { await r31("/report/reopen", { id: rid, text: rt.value.trim() || undefined }); say("اتفتح تاني", "check"); reportDetail(rid); return; } d.thread.push({ by: "system", name: "سعراتي", text: "المستخدم فتح البلاغ تاني" + (rt.value.trim() ? ": " + rt.value.trim() : ""), at: now() }); await FB.update("reports/" + rid, { status: "new", thread: JSON.stringify(d.thread.slice(-80)), unreadAdmin: true, updatedAt: now(), slaDue: now() + slaMin(d.prio || 0) * 60000 }); say("اتفتح تاني", "check"); reportDetail(rid); } catch (e) { ro.disabled = false; say("مقدرتش: " + e.message); }
        };
        r.append(ro);
      }
      b.append(rt, r);
    }
    if (d.status === "resolved" || d.status === "closed") {
      const rb = el("div", "r29-body"); rb.append(el("div", "r29-lbl", d.rating ? "تقييمك: " + d.rating + " من 5 — شكرًا" : "قيّم حل المشكلة"));
      const stars = el("div", "r29-stars");
      for (let i = 1; i <= 5; i++) { const s = el("button", i <= (d.rating || 0) ? "on" : "", "★"); s.onclick = async () => { if (d.rating) return; stars.querySelectorAll("button").forEach((x, j) => x.classList.toggle("on", j < i)); try { if (d._r31) await r31("/report/rate", { id: rid, rating: i }); else await FB.update("reports/" + rid, { rating: i, updatedAt: now() }); d.rating = i; say(i >= 4 ? "يسعدنا! شكرًا 💚" : "شكرًا، هنحسّن أكتر", "check"); if (i >= 4) confetti(30); } catch (e) { say("ما اتسجلش: " + e.message); } }; stars.append(s); }
      rb.append(stars); b.append(rb);
    }
  }

  // ===== متابعة الردود كل 3 دقايق =====
  let pollT = 0, polling = false;
  async function pollReports(force) {
    if (OFF.has("reports") || polling || !signed() || (!force && D.visibilityState !== "visible") || !navigator.onLine) return;
    const c = repCache();
    const L = mine().filter((x) => { const s = (c[x.rid] || {}).status || "new"; return isOpen(s) || now() - ((c[x.rid] || {}).updatedAt || x.at) < 3 * 864e5; }).slice(0, 12);
    if (!L.length) return;
    polling = true;
    try {
      const M = {};
      if (L.some((x) => isR31(x.rid))) { try { const r = await r31("/report/mine", {}); (r.items || []).forEach((i) => { M[i.id] = fromItem(i); }); } catch (e) {} }
      for (const x of L) {
        let d = M[x.rid]; if (!d) { if (isR31(x.rid)) continue; try { d = await fetchRep(x.rid); } catch (e) { continue; } } if (!d) continue;
        const old = c[x.rid] || { n: 0 }; const n = adminCount(d.thread);
        if (n > (old.n || 0)) {
          const last = d.thread.filter((m) => m.by === "admin").pop();
          const t = "رد جديد على بلاغك: " + (d.title || CATN[d.cat]);
          say(t, "chat"); vib([10, 30, 10]);
          if (D.visibilityState !== "visible") localNotify("r29" + now().toString(36), "💬 " + t, String((last && last.text) || "").slice(0, 140), 1);
        } else if (old.status && old.status !== d.status && d.status === "resolved") say("بلاغك «" + (d.title || "") + "» اتحل ✅ — قيّم الحل", "check");
        cacheRep(x.rid, d);
      }
      loadInbox31().catch(() => {});
    } finally { polling = false; refreshFab(); }
  }
  function refreshFab() {
    if (OFF.has("reports")) return;
    const c = repCache(); const n = mine().filter((x) => (c[x.rid] || {}).unread).length;
    let f = D.getElementById("r29fab");
    if (!n) { f && f.remove(); return; }
    if (!f) { f = el("button", "tap"); f.id = "r29fab"; f.onclick = () => { const r = mine().find((x) => (repCache()[x.rid] || {}).unread); r ? reportDetail(r.rid) : myReports(); }; D.body.append(f); }
    f.replaceChildren(ic("chat", 16), el("span", null, n === 1 ? "رد جديد على بلاغك" : n + " ردود جديدة"));
  }
  // ===== الدخول من التطبيق: كارت + القائمة السريعة + feedback() =====
  const oldFeedback = typeof W.feedback === "function" ? W.feedback : null;
  function initReports() {
    if (OFF.has("reports")) return;
    try { if (oldFeedback) W.feedback = function () { try { return reportSheet({ cat: "idea" }); } catch (e) { return oldFeedback.apply(this, arguments); } }; } catch (e) {}
    pollT = setInterval(() => pollReports(), 180000);
    setTimeout(() => pollReports(), 6000);
    D.addEventListener("visibilitychange", () => { if (D.visibilityState === "visible") pollReports(); });
    refreshFab();
  }
  function meCards() {
    const me = D.getElementById("t-me"); if (!me) return;
    if (!OFF.has("reports") && !D.getElementById("r29card")) {
      const c = el("div", "card glass c26"); c.id = "r29card";
      const h = el("h3"); h.append(ic("flag"), el("span", null, "مركز البلاغات")); c.append(h, el("div", "sub26", "مشكلة أو اقتراح؟ بلّغ وتابع الرد لحظة بلحظة."));
      const r = el("div", "r29-row"); r.style.marginTop = "10px";
      const a = el("button", "btn26 tap", "بلاغ جديد"); a.onclick = () => reportSheet();
      const m = el("button", "btn26 sec tap", "بلاغاتي"); m.onclick = () => myReports();
      r.append(a, m); c.append(r);
      const priv = D.getElementById("priv26"); priv ? priv.before(c) : me.append(c);
    }
    if (!OFF.has("notify") && !D.getElementById("n29card")) {
      const c = el("div", "card glass c26"); c.id = "n29card";
      const h = el("h3"); h.append(ic("bell"), el("span", null, "ذكاء التنبيهات"));
      const p = NE.plan || []; c.append(h, el("div", "sub26", p.length ? "النهارده مخطط " + p.length + " تنبيه على مقاسك — أول واحد " + hm(p[0].min) : "تنبيهات بتتعلم مواعيدك ومش بتزنّ."));
      const btn = el("button", "btn26 tap", "إعدادات وخطة النهارده"); btn.style.marginTop = "10px"; btn.onclick = () => notifySheet(); c.append(btn);
      const r29 = D.getElementById("r29card"); r29 ? r29.after(c) : me.append(c);
    }
  }
  // زرار في قائمة الضغطة المطولة (v26 #q26)
  function quickAdd(node) {
    if (OFF.has("reports") || !node || node.id !== "q26") return;
    const w = node.querySelector(".wrap"); if (!w || w.querySelector(".r29q")) return;
    const b = el("button", "tap r29q"); b.append(ic("flag"), el("span", null, "بلّغ عن مشكلة"));
    const sc = screenName();
    b.onclick = (e) => { e.stopPropagation(); node.remove(); reportSheet({ screen: sc }); }; w.append(b);
  }

  // =====================================================================
  // 2) ذكاء التنبيهات
  // =====================================================================
  const KINDS = [
    ["meal", "bowl", "الوجبات", "على مواعيدك اللي اتعلمتها"], ["water", "drop", "المية", "لما تبقى متأخر عن المعدل"], ["streak", "flame", "السلسلة", "لما تكون في خطر بالليل"],
    ["goal", "target", "الهدف", "لما تقرّب تخلص هدفك"], ["weight", "scale", "الوزن", "يوم الوزن الأسبوعي"], ["sleep", "moon", "النوم", "تهدية قبل ميعاد نومك"],
    ["report", "flag", "البلاغات", "ردود الإدارة على بلاغاتك"], ["promo", "mega", "رسايل الإدارة", "رسايل مهمة من فريق سعراتي"],
  ];
  const NSET = () => Object.assign({ off: [], qf: "", qt: "" }, ld("sp29_nset", {}));
  const NE = { plan: [], cfg: null, cap: 0, appList: ld("sp29_applist", []), ours: [] };
  const fn = (n) => { const f = G(n); return typeof f === "function" ? f : null; };
  function dayData(date) {
    try { const dk = fn("dkey"), gd = fn("getDay"); if (!dk || !gd) return null; return gd(dk(date)); } catch (e) { return null; }
  }
  function learn() {
    const prev = ld("sp29_learn", null);
    if (prev && prev.d === todayKey()) return prev;
    const M = { b: [], l: [], d: [] }, act = [];
    for (let i = 1; i <= 14; i++) {
      const dt = new Date(); dt.setDate(dt.getDate() - i); const d = dayData(dt); if (!d || !d.items) continue;
      const seen = {};
      d.items.forEach((it) => { if (!it.t) return; const t = new Date(it.t); const m = t.getHours() * 60 + t.getMinutes(); act.push(m); if (M[it.m] && !seen[it.m]) { seen[it.m] = 1; M[it.m].push(m); } });
    }
    const med = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    let rem = {}; try { rem = (G("S") || {}).rem || {}; } catch (e) {}
    const out = { d: todayKey(), b: med(M.b) ?? minOf(rem.b || "09:00"), l: med(M.l) ?? minOf(rem.l || "15:00"), dn: med(M.d) ?? minOf(rem.d || "21:00"), n: { b: M.b.length, l: M.l.length, d: M.d.length }, last: act.length ? Math.max(...act.filter((m) => m > 18 * 60).concat([0])) : 0 };
    sv("sp29_learn", out); return out;
  }
  // تعلم الإرهاق: إيه اللي اتجاهل وإيه اللي اتفتح
  function trackOpens() {
    const F = ld("sp29_fired", []), fat = ld("sp29_fat", {}); const t = now();
    const hash = (location.hash.match(/n29=([\w-]+)/) || [])[1];
    let ch = false;
    F.forEach((f) => {
      if (f.res || f.at > t) return;
      if ((hash && hash === f.id) || (t - f.at < 10 * 60000 && t >= f.at)) { f.res = "open"; fat[f.k] = clamp((fat[f.k] || 0) - 0.15, 0, 0.8); ch = true; }
      else if (t - f.at >= 10 * 60000) { f.res = "ign"; fat[f.k] = clamp((fat[f.k] || 0) + 0.1, 0, 0.8); ch = true; }
    });
    if (ch) { sv("sp29_fired", F.filter((f) => t - f.at < 14 * 864e5).slice(-120)); sv("sp29_fat", fat); }
    const O = ld("sp29_opens", {}); O[todayKey()] = (O[todayKey()] || 0) + 1; const ks = Object.keys(O).slice(-14); const O2 = {}; ks.forEach((k) => (O2[k] = O[k])); sv("sp29_opens", O2);
  }
  function autoCap() {
    const F = ld("sp29_fired", []).filter((f) => f.res); const O = ld("sp29_opens", {});
    const openR = F.length ? F.filter((f) => f.res === "open").length / F.length : 0.5;
    const days = Object.keys(O).length || 1, act = Math.min(1, Object.values(O).reduce((a, b) => a + b, 0) / days / 4);
    return clamp(Math.round(2 + 4 * (openR * 0.65 + act * 0.35)), 2, 6);
  }
  // تنويع النصوص: ممنوع نفس النص يتكرر 3 أيام ورا بعض
  function pickText(kind, arr) {
    const H = ld("sp29_txt", {}); const h = (H[kind] || []).filter((x) => now() - x.at < 3 * 864e5);
    const used = new Set(h.map((x) => x.i)); let opts = arr.map((_, i) => i).filter((i) => !used.has(i)); if (!opts.length) opts = arr.map((_, i) => i);
    const seed = new Date().getDate() + kind.length; const i = opts[seed % opts.length];
    return { i, v: arr[i] };
  }
  function markText(kind, i) { const H = ld("sp29_txt", {}); const h = (H[kind] || []).filter((x) => now() - x.at < 3 * 864e5 && x.d !== todayKey()); h.push({ i, at: now(), d: todayKey() }); H[kind] = h.slice(-10); sv("sp29_txt", H); }
  const fmtN = (n) => { try { const f = fn("fmt"); return f ? f(n) : String(n); } catch (e) { return String(n); } };

  function candidates() {
    const out = []; const nowD = new Date(); const nm = nowD.getHours() * 60 + nowD.getMinutes();
    const S0 = G("S") || {}; const D0 = dayData(nowD) || { items: [], water: 0 };
    const Lr = learn();
    let T = { kcal: 2000 }; try { const tg = fn("targets"); if (tg) T = tg(); } catch (e) {}
    let eaten = 0; try { const sd = fn("sumDay"); eaten = sd ? Math.round(sd(D0).k) : 0; } catch (e) {}
    const rem = Math.max(0, Math.round(T.kcal - eaten));
    let stk = 0; try { const sk = fn("streak"); stk = sk ? sk() : 0; } catch (e) {}
    const wg = +S0.waterGoal || 8, wc = +D0.water || 0;
    const name = (signed() && (FB.user.name || "").split(" ")[0]) || "";
    const hasMeal = (m) => (D0.items || []).some((i) => i.m === m);
    const add = (o) => { if (o.min > nm + 2 && o.min < 24 * 60) out.push(o); };
    // الوجبات
    [["b", Lr.b, "الفطار"], ["l", Lr.l, "الغدا"], ["d", Lr.dn, "العشا"]].forEach(([m, at, n]) => {
      if (hasMeal(m) || at == null) return;
      const conf = Math.min(1, (Lr.n[m] || 0) / 7);
      const tx = pickText("meal" + m, [
        "عادة بتاكل " + n + " دلوقتي تقريبًا — سجّله في ثانية وفاضلك " + fmtN(rem) + " سعرة.",
        (name ? name + "، " : "") + n + " لسه متسجلش. صوّره بالكاميرا ونحسبه لك.",
        "ميعاد " + n + " بتاعك. فاضلك " + fmtN(rem) + " سعرة النهارده — اختار حاجة فيها بروتين.",
        "متنساش تسجّل " + n + " — التسجيل في وقته بيخلّي الأرقام أدق.",
      ]);
      add({ kind: "meal", id: 2900 + "bld".indexOf(m), min: at + 25, title: "🍽️ " + n, text: tx.v, ti: tx.i, tk: "meal" + m, rel: 0.6 + 0.35 * conf, urg: 0.8,
        why: "بقالك أسبوعين بتسجّل " + n + " حوالين " + hm(at) + " (" + (Lr.n[m] || 0) + " مرة)، والنهارده لسه متسجلش. التنبيه بعد ميعادك بـ25 دقيقة." });
    });
    // المية
    const exp = (min) => wg * clamp((min - 8 * 60) / (14 * 60), 0, 1);
    const behind = exp(nm) - wc;
    if (wc < wg) {
      const at = Math.max(nm + 30, 11 * 60), ml = Math.round((Math.ceil(exp(at)) - wc) * 250);
      if (behind >= 1.5 || at >= 16 * 60) {
        const tx = pickText("water", [
          "متأخر " + fmtN(Math.max(250, ml)) + " مل عن معدلك — كوباية دلوقتي ترجّعك.",
          "شربت " + fmtN(wc) + " من " + fmtN(wg) + " أكواب. كوبايتين وتبقى في السليم 💧",
          "جسمك محتاج مية: فاضل " + fmtN((wg - wc) * 250) + " مل على هدف النهارده.",
          "كوباية مية قبل الأكل الجاي بتقلل الجوع وتقرّبك من هدفك.",
        ]);
        add({ kind: "water", id: 2903, min: Math.round(at / 15) * 15, title: "💧 المية", text: tx.v, ti: tx.i, tk: "water", rel: 0.75, urg: clamp(0.4 + behind / wg, 0.4, 1),
          why: "المفروض تكون شربت حوالي " + Math.round(exp(nm)) + " أكواب لحد دلوقتي، وانت شربت " + wc + "." });
      }
    }
    // السلسلة
    if (stk > 0 && !(D0.items || []).length) {
      const at = nm < 20 * 60 + 30 ? 20 * 60 + 30 : nm + 15;
      if (at < 23 * 60) {
        const tx = pickText("streak", ["🔥 " + fmtN(stk) + " يوم ورا بعض! سجّل أي حاجة النهارده عشان السلسلة متقعش.", "سلسلتك (" + fmtN(stk) + " يوم) في خطر — وجبة واحدة تكفي.", "متضيعش " + fmtN(stk) + " يوم شغل! سجّل عشاك وخلّيها تكمل."]);
        add({ kind: "streak", id: 2904, min: at, title: "🔥 سلسلتك", text: tx.v, ti: tx.i, tk: "streak", rel: 0.9, urg: clamp(0.5 + stk / 30, 0.5, 1), why: "عندك سلسلة " + stk + " يوم ولسه مسجّلتش حاجة النهارده." });
      }
    }
    // قرّبت من الهدف
    if (eaten > 0 && T.kcal && eaten >= T.kcal * 0.7 && eaten < T.kcal) {
      const at = Math.max(nm + 20, Lr.dn - 30);
      const tx = pickText("goal", ["فاضلك " + fmtN(rem) + " سعرة بس على هدفك — عشا خفيف ويومك مثالي 🎯", "انت قريب جدًا: " + fmtN(rem) + " سعرة. زبادي أو سلطة بفراخ هيقفلوها.", "يوم ممتاز لحد دلوقتي! خلي الباقي " + fmtN(rem) + " سعرة لعشا ذكي."]);
      add({ kind: "goal", id: 2905, min: at, title: "🎯 قربت من هدفك", text: tx.v, ti: tx.i, tk: "goal", rel: 0.7, urg: 0.6, why: "أكلت " + eaten + " من " + T.kcal + " سعرة (" + Math.round(eaten * 100 / T.kcal) + "%)." });
    } else if (wc >= wg - 2 && wc < wg && nm > 14 * 60) {
      add({ kind: "goal", id: 2905, min: nm + 45, title: "💧 فاضل " + (wg - wc) + " أكواب", text: "خلّص هدف المية النهارده وخد البادج 🏅", rel: 0.6, urg: 0.5, tk: "goalw", ti: 0, why: "شربت " + wc + " من " + wg + "." });
    }
    // الوزن
    try {
      const Wt = (S0.weights || []).slice(-8); const last = Wt[Wt.length - 1];
      if (S0.profile) {
        const lastAt = last ? new Date(last.d).getTime() : 0; const day = last ? new Date(last.d).getDay() : 5;
        if ((!last || now() - lastAt > 6.5 * 864e5) && (nowD.getDay() === day || now() - lastAt > 9 * 864e5)) {
          const tx = pickText("weight", ["صباح الخير! النهارده يوم الوزن ⚖️ — اتوزن قبل الفطار.", "آخر وزن من " + (last ? Math.round((now() - lastAt) / 864e5) : "فترة") + " يوم. سجّل وزنك عشان نظبط سعراتك.", "وزنة أسبوعية سريعة بتورينا هل الخطة ماشية صح."]);
          add({ kind: "weight", id: 2906, min: Math.max(nm + 10, (Lr.b || 540) - 20), title: "⚖️ يوم الوزن", text: tx.v, ti: tx.i, tk: "weight", rel: 0.6, urg: 0.5, why: last ? "آخر مرة سجّلت وزنك كانت " + last.d + "، وده نفس يوم وزنك الأسبوعي." : "لسه مسجّلتش وزن." });
        }
      }
    } catch (e) {}
    // النوم (لو التطبيق مش مفعّل تذكير النوم بتاعه)
    try {
      const sl = S0.sleepS || {};
      if (!sl.on && Lr.last && Lr.last > 21 * 60) {
        const at = Math.min(23 * 60 + 30, Lr.last + 60);
        add({ kind: "sleep", id: 2907, min: at, title: "🌙 وقت الهدوء", text: pickText("sleep", ["قلّل الشاشة وخد نفس عميق — نوم كويس = جوع أقل بكرة.", "يومك خلص؟ اقفل المطبخ وجهّز نفسك للنوم.", "النوم 7 ساعات بيظبط هرمونات الجوع. تصبح على خير 💚"]).v, tk: "sleep", ti: 0, rel: 0.45, urg: 0.4, why: "آخر نشاط ليك بالليل عادة حوالين " + hm(Lr.last) + "." });
      }
    } catch (e) {}
    // البلاغات
    const c = repCache(); const unr = mine().filter((x) => (c[x.rid] || {}).unread);
    if (unr.length) add({ kind: "report", id: 2908, min: nm + 5, once: true, title: "💬 رد على بلاغك", text: "الإدارة ردّت على «" + (unr[0].title || CATN[unr[0].cat]) + "» — افتح وشوف.", rel: 1, urg: 0.9, tk: "report", ti: 0, why: "فيه " + unr.length + " رد جديد لسه مقريتهوش." });
    // رسايل الإدارة (inbox)
    (NE.inbox || []).filter((m) => !m.read && !ld("sp29_inbn", []).includes(m.id)).slice(0, 1).forEach((m) =>
      add({ kind: "promo", id: 2909, min: nm + 3, once: true, inbox: m.id, title: "📩 " + String(m.title || "رسالة من سعراتي").slice(0, 60), text: String(m.text || "").slice(0, 150), rel: m.kind === "admin" ? 0.85 : 0.7, urg: 0.8, tk: "inbox", ti: 0, why: "رسالة جديدة من فريق سعراتي." }));
    return out;
  }

  function inQuiet(min, qf, qt) {
    const a = minOf(qf), b = minOf(qt); if (a === b) return false;
    return a < b ? min >= a && min < b : min >= a || min < b;
  }
  function buildPlan() {
    const set = NSET(), cfg = NE.cfg || {}, fat = ld("sp29_fat", {});
    const allowCfg = new Set(String(cfg.kinds || KINDS.map((k) => k[0]).join(",")).split(",").map((s) => s.trim()));
    const qf = set.qf || cfg.quietFrom || "23:00", qt = set.qt || cfg.quietTo || "07:00";
    const firedToday = ld("sp29_fired", []).filter((f) => new Date(f.at).toDateString() === todayKey() && f.at <= now()).length;
    const cap = Math.max(0, ((+cfg.maxPerDay || 0) > 0 ? +cfg.maxPerDay : autoCap()) - firedToday); NE.cap = cap;
    let C = candidates().filter((c) => allowCfg.has(c.kind) && !set.off.includes(c.kind) && !inQuiet(c.min, qf, qt));
    C.forEach((c) => { c.fat = fat[c.kind] || 0; c.score = Math.round(c.rel * c.urg * (1 - c.fat) * 100) / 100; });
    C = C.filter((c) => c.score >= 0.2).sort((a, b) => b.score - a.score);
    const pick = [];
    for (const c of C) { if (pick.length >= cap) break; if (pick.some((p) => Math.abs(p.min - c.min) < 75)) continue; pick.push(c); }
    pick.sort((a, b) => a.min - b.min); NE.plan = pick; NE.dropped = C.filter((c) => !pick.includes(c));
    return pick;
  }
  // دمج قائمة setSmart مع قائمة التطبيق
  const isOurs = (x) => x && +x.id >= 2900 && +x.id <= 2999;
  function hookSmart() {
    try {
      const a = W.Android; if (!a || typeof a.setSmart !== "function" || a.__v29) return;
      const inner = a;
      const px = new Proxy(inner, { get(t, k) {
        if (k === "__v29") return true;
        if (k === "__v29inner") return t;
        if (k === "setSmart") return function (json) {
          let L = pj(String(json), []); if (!Array.isArray(L)) L = [];
          NE.appList = L.filter((x) => !isOurs(x)); sv("sp29_applist", NE.appList);
          try { return t.setSmart(JSON.stringify(NE.appList.concat(NE.ours, ramList()))); } catch (e) { return t.setSmart(json); }
        };
        const v = t[k]; return typeof v === "function" ? v.bind(t) : v;
      } });
      W.Android = px;
    } catch (e) {}
  }
  // رمضان (v30): IDs 2980–2989 محجوزة له، وv29 مابيستخدمهاش
  function ramList() {
    try { const r = W.V30 && typeof W.V30.ramadan === "function" ? W.V30.ramadan() : null; if (!r || !r.active || !Array.isArray(r.notifs)) return [];
      return r.notifs.filter((n) => +n.id >= 2980 && +n.id <= 2989 && /^\d{1,2}:\d{2}$/.test(String(n.t))).map((n) => ({ id: +n.id, t: n.t, title: String(n.title || ""), text: String(n.text || "") })); } catch (e) { return []; }
  }
  W.addEventListener("v30:ramadan", () => { try { hookSmart(); sendSmart(); } catch (e) {} });
  function sendSmart() {
    try { const a = W.Android; if (!a || typeof a.setSmart !== "function") return false; const t = a.__v29inner || a; t.setSmart(JSON.stringify((NE.appList || []).concat(NE.ours || [], ramList()))); return true; } catch (e) { return false; }
  }
  let webT = [];
  async function schedule() {
    if (OFF.has("notify")) return;
    hookSmart();
    const plan = buildPlan();
    const daily = plan.filter((p) => !p.once);
    NE.ours = daily.filter((p) => +p.id < 2980).map((p) => ({ id: p.id, t: hm(p.min), title: p.title, text: p.text }));
    const sent = sendSmart();
    const F = ld("sp29_fired", []).filter((f) => !(f.at > now() && new Date(f.at).toDateString() === todayKey() && !f.once));
    const base = new Date(); base.setHours(0, 0, 0, 0);
    daily.forEach((p) => F.push({ id: p.kind + p.id + "_" + todayKey().replace(/\W/g, ""), k: p.kind, at: base.getTime() + p.min * 60000 }));
    // مرة واحدة
    const sentOnce = ld("sp29_once", {});
    plan.filter((p) => p.once).forEach((p) => {
      const key = p.inbox ? "inb_" + p.inbox : p.kind + "_" + todayKey();
      if (sentOnce[key]) return;
      const sec = Math.max(5, Math.round((base.getTime() + p.min * 60000 - now()) / 1000));
      if (localNotify("n29" + p.id + now().toString(36), p.title, p.text, sec)) { sentOnce[key] = now(); F.push({ id: key, k: p.kind, at: now() + sec * 1000, once: 1 }); if (p.inbox) { const s = ld("sp29_inbn", []); s.push(p.inbox); sv("sp29_inbn", s.slice(-80)); } }
    });
    const so2 = {}; Object.entries(sentOnce).forEach(([k, v]) => { if (now() - v < 7 * 864e5) so2[k] = v; }); sv("sp29_once", so2);
    sv("sp29_fired", F.slice(-120));
    plan.forEach((p) => p.ti != null && p.tk && markText(p.tk, p.ti));
    // بديل الويب
    if (!sent && "Notification" in W) {
      webT.forEach(clearTimeout); webT = [];
      if (Notification.permission === "granted") daily.forEach((p) => { const ms = base.getTime() + p.min * 60000 - now(); if (ms > 0 && ms < 6 * 3600000) webT.push(setTimeout(() => { try { new Notification(p.title, { body: p.text, icon: "logo.png", tag: "n29" + p.id }); } catch (e) {} }, ms)); });
    }
    try { const c = D.getElementById("n29card"); if (c) { c.remove(); meCards(); } } catch (e) {}
    return plan;
  }
  async function loadRemote() {
    if (!signed() || !navigator.onLine) return;
    const day = todayKey(); const cc = ld("sp29_cfg", null);
    if (cc && cc.d === day) NE.cfg = cc.v;
    else {
      let got = false; try { const me = await r31me(); if (me && me.notify29 && typeof me.notify29 === "object") { NE.cfg = me.notify29; got = true; } else if (me) { NE.cfg = {}; got = true; } if (got) sv("sp29_cfg", { d: day, v: NE.cfg }); } catch (e) {}
      if (!got) { try { const c = await FB.get("config/notify29"); NE.cfg = c || {}; sv("sp29_cfg", { d: day, v: NE.cfg }); } catch (e) { NE.cfg = (cc && cc.v) || {}; } }
    }
    if (await loadInbox31().catch(() => false)) return;
    try { const d = await FB.get("inbox/" + FB.user.uid); const m = pj(d && d.msgs, []); NE.inbox = Array.isArray(m) ? m : []; } catch (e) { NE.inbox = NE.inbox || []; }
  }
  let inb31 = false;
  async function loadInbox31() {
    if (!signed()) return false;
    const r = await r31("/inbox", {}); inb31 = true;
    const prev = new Set((NE.inbox || []).map((m) => m.id));
    NE.inbox = (r.items || []).map((m) => ({ id: m.id, title: m.title, text: m.text, at: m.at, read: !!m.read, kind: m.kind, rid: /^report/.test(m.kind || "") ? m.ref : "" }));
    if (prev.size) NE.inbox.filter((m) => !m.read && !prev.has(m.id) && !/^report/.test(m.kind || "")).slice(0, 2).forEach((m) => say(String(m.title || "رسالة جديدة"), "inbox"));
    return true;
  }
  async function inboxMarkRead(id) {
    if (inb31) { try { await r31("/inbox/read", id ? { ids: [id] } : { all: true }); (NE.inbox || []).forEach((m) => { if (!id || m.id === id) m.read = true; }); return; } catch (e) { if (!e.fallback) return; } }
    try { const d = await FB.get("inbox/" + FB.user.uid); let m = pj(d && d.msgs, []); if (!Array.isArray(m)) return; m = m.map((x) => (!id || x.id === id ? Object.assign({}, x, { read: true }) : x)); await FB.update("inbox/" + FB.user.uid, { msgs: JSON.stringify(m.slice(0, 50)) }); NE.inbox = m; } catch (e) {}
  }
  function inboxSheet() {
    const b = sheet(ttl("inbox", "رسايل سعراتي")); if (!b) return;
    const L = NE.inbox || []; if (!L.length) { b.append(el("p", "l29-c", "مفيش رسايل.")); return; }
    L.slice(0, 30).forEach((m) => {
      const it = el("div", "r29-item"); const h = el("div", "r29-row"); h.append(el("b", null, String(m.title || "")));
      if (!m.read) h.append(el("span", "r29-dot")); it.append(h, el("div", null, String(m.text || "")), el("small", null, m.at ? ago(+m.at) : ""));
      if (m.rid) { const go = el("button", "r29-btn sec tap", "افتح البلاغ"); go.onclick = () => reportDetail(String(m.rid)); it.append(go); }
      b.append(it);
    });
    inboxMarkRead("");
  }
  function notifySheet() {
    const b = sheet(ttl("bell", "ذكاء التنبيهات"), "بنبني تنبيهاتك كل مرة من يومك الحقيقي، وبنقلل اللي بتتجاهله لوحده."); if (!b) return;
    const set = NSET(); const cfg = NE.cfg || {};
    const allowCfg = new Set(String(cfg.kinds || KINDS.map((k) => k[0]).join(",")).split(","));
    const fat = ld("sp29_fat", {});
    KINDS.forEach(([k, i, l, d]) => {
      const r = el("div", "n29-k"); const t = el("div"); t.append(el("b", null, l), el("small", null, allowCfg.has(k) ? d + (fat[k] ? " · بنقلّلها " + Math.round(fat[k] * 100) + "% عشان بتتجاهلها" : "") : "متوقفة مؤقتًا من الإدارة"));
      const sw = el("button", "n29-sw" + (set.off.includes(k) ? "" : " on")); sw.setAttribute("aria-label", l);
      sw.onclick = () => { const s = NSET(); s.off = s.off.includes(k) ? s.off.filter((x) => x !== k) : s.off.concat(k); sv("sp29_nset", s); sw.classList.toggle("on"); schedule(); };
      r.append(ic(i), t, sw); b.append(r);
    });
    b.append(el("div", "r29-lbl", "ساعات الهدوء (مفيش تنبيهات)"));
    const q = el("div", "r29-row"); const qf = el("input"); qf.type = "time"; qf.value = set.qf || cfg.quietFrom || "23:00"; const qt = el("input"); qt.type = "time"; qt.value = set.qt || cfg.quietTo || "07:00";
    qf.style.flex = qt.style.flex = "1";
    const saveQ = () => { const s = NSET(); s.qf = qf.value; s.qt = qt.value; sv("sp29_nset", s); schedule().then(drawPlan); };
    qf.onchange = qt.onchange = saveQ; q.append(el("span", null, "من"), qf, el("span", null, "لـ"), qt); b.append(q);
    const pb = el("div", "r29-body"); b.append(el("div", "r29-lbl", "خطة النهارده"), pb);
    const tb = el("button", "r29-btn sec tap"); tb.append(ic("bell", 18), el("span", null, "جرّب تنبيه دلوقتي"));
    tb.onclick = async () => { try { if (!A() && "Notification" in W && Notification.permission === "default") await Notification.requestPermission(); } catch (e) {} localNotify("n29test" + now(), "✨ سعراتي", "كده التنبيهات شغالة تمام.", 3) ? say("هيوصلك تنبيه كمان 3 ثواني", "bell") : say("التنبيهات مقفولة على الجهاز ده"); };
    b.append(tb);
    if ((NE.inbox || []).length) { const ib = el("button", "r29-btn sec tap"); ib.append(ic("inbox", 18), el("span", null, "رسايل الإدارة (" + NE.inbox.filter((m) => !m.read).length + " جديدة)")); ib.onclick = inboxSheet; b.append(ib); }
    function drawPlan() {
      pb.replaceChildren();
      const P = NE.plan || []; pb.append(el("small", "muted", "الحد النهارده: " + ((+cfg.maxPerDay || 0) > 0 ? cfg.maxPerDay + " (من الإدارة)" : autoCap() + " (تلقائي حسب تفاعلك)") + " · فاضل " + NE.cap));
      if (!P.length) pb.append(el("p", "l29-c", "مفيش حاجة محتاجة تنبيه النهارده — يومك ماشي تمام 👌"));
      P.forEach((p) => {
        const c = el("div", "n29-plan"); const h = el("div", "r29-row"); h.append(el("span", "t", hm(p.min)), el("b", null, p.title)); c.append(h, el("div", null, p.text));
        const bar = el("div", "n29-bar"); const i = el("i"); i.style.width = Math.round(p.score * 100) + "%"; bar.append(i); c.append(bar);
        const dt = el("details"); dt.append(el("summary", null, "ليه هيوصلني ده؟"), el("div", null, p.why || ""), el("div", null, "الأهمية " + Math.round(p.rel * 100) + "% × الاستعجال " + Math.round(p.urg * 100) + "% × (1 − الإرهاق " + Math.round(p.fat * 100) + "%) = " + Math.round(p.score * 100)));
        c.append(dt); pb.append(c);
      });
      if ((NE.dropped || []).length) pb.append(el("small", "muted", "اتشال " + NE.dropped.length + " تنبيه أقل أهمية عشان منزنّش عليك."));
    }
    drawPlan();
  }
  let lastSched = 0;
  function maybeSchedule(force) { if (OFF.has("notify")) return; if (!force && now() - lastSched < 30000) return; lastSched = now(); try { schedule(); } catch (e) {} }
  async function initNotify() {
    if (OFF.has("notify")) return;
    hookSmart(); trackOpens();
    await loadRemote().catch(() => {});
    maybeSchedule(true);
    setInterval(async () => { await loadRemote().catch(() => {}); maybeSchedule(true); }, 3600000);
    D.addEventListener("visibilitychange", () => { if (D.visibilityState === "visible") { trackOpens(); maybeSchedule(); } });
  }

  // =====================================================================
  // 3) الدخول: بريد ذكي + جوجل
  // =====================================================================
  const GSVG = '<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const projId = () => { try { if (FB.proj) return FB.proj; const m = String(FB.base || "").match(/projects\/([^/]+)/); return m ? m[1] : "sorati-610ba"; } catch (e) { return "sorati-610ba"; } };
  const AUTHPAGE = (pid) => "https://" + (pid || "sorati-610ba") + ".web.app/auth.html";
  // جوجل عبر نفس الجسر: نفتح auth.html?app=pro&ch=... ونسحب التوكن من claim
  async function googleBridge() {
    try {
      const v = b64u(crypto.getRandomValues(new Uint8Array(48))); const ch = await sha(v);
      sv("sp29_ml", { email: "", v, at: now(), g: 1 });
      const u = AUTHPAGE(projId()) + "?app=pro&ch=" + ch;
      try { closeM(); } catch (e) {}
      say("هيتفتح المتصفح — اختار حسابك وارجع", "user");
      mlStartPoll();
      if (W.Android && typeof Android.openUrl === "function") Android.openUrl(u); else W.open(u, "_blank");
    } catch (e) { try { FB.googleLogin(); } catch (x) { say("مقدرناش نفتح جوجل دلوقتي"); } }
  }
  let mlPoll = 0;
  function mlState() { return ld("sp29_ml", null); }
  async function mlClaim() {
    const s = mlState(); if (!s || !s.v) return false;
    try {
      const r = await (await fetch(DEP + "/v1/app/bridge/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ v: s.v }) })).json();
      if (r && r.ok && r.rt) {
        localStorage.removeItem("sp29_ml"); clearInterval(mlPoll);
        try { localStorage.setItem("sp_lastAuth", JSON.stringify(s.g ? { m: "google", u: "" } : { m: "magic", u: s.email })); } catch (e) {}
        mlUI && mlUI("ok");
        try { closeM(); } catch (e) {}
        if (typeof W.onNativeAuth === "function") await W.onNativeAuth(r.rt); else { await FB.setRT(r.rt); location.reload(); }
        confetti(40); return true;
      }
    } catch (e) {}
    return false;
  }
  function mlStartPoll() {
    clearInterval(mlPoll); let n = 0;
    mlPoll = setInterval(async () => {
      const s = mlState();
      if (s && signed()) { clearInterval(mlPoll); if (s.g) localStorage.removeItem("sp29_ml"); return; }
      if (!s || ++n > 90 || now() - s.at > 180000) { clearInterval(mlPoll); if (s && now() - s.at > 180000) { if (s.g) localStorage.removeItem("sp29_ml"); else mlUI && mlUI("expired"); } return; }
      if (D.visibilityState === "visible") await mlClaim();
    }, 2000);
  }
  let mlUI = null;
  async function mlSend(email, btn) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say("اكتب إيميل صحيح"); return; }
    const pid = projId(); if (!pid || !FB.key) { say("الخدمة مش جاهزة دلوقتي"); return; }
    btn && (btn.disabled = true); mlUI && mlUI("sending");
    try {
      const v = b64u(crypto.getRandomValues(new Uint8Array(48))); const ch = await sha(v);
      const continueUrl = AUTHPAGE(pid) + "?ml=1&app=pro&ch=" + ch + "&e=" + encodeURIComponent(email);
      const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + FB.key, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestType: "EMAIL_SIGNIN", email, continueUrl, canHandleCodeInApp: true }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok && d.error && /OPERATION_NOT_ALLOWED|ADMIN_ONLY_OPERATION/.test(d.error.message || "")) { sv("sp31_noml", now()); const bx = D.getElementById("l29box"); if (bx) pwForm(bx, email); return; }
      if (!r.ok) throw new Error(d.error && d.error.message === "QUOTA_EXCEEDED" ? "اتبعت إيميلات كتير، جرّب بعد شوية" : (d.error && d.error.message) || "HTTP " + r.status);
      sv("sp29_ml", { email, v, at: now() }); try { localStorage.setItem("emailForSignIn", email); } catch (e) {}
      mlUI && mlUI("sent", email); mlStartPoll(); vib(15);
    } catch (e) { mlUI && mlUI("err", e.message); }
    finally { btn && (btn.disabled = false); }
  }
  // دخول ذكي بالإيميل وكلمة السر (لما رابط الإيميل يكون مقفول في Firebase)
  const PWERR = { INVALID_LOGIN_CREDENTIALS: "الإيميل أو كلمة السر مش صح", INVALID_PASSWORD: "كلمة السر مش صح", EMAIL_NOT_FOUND: "مفيش حساب بالإيميل ده — اعمل حساب جديد",
    WEAK_PASSWORD: "كلمة السر ضعيفة — خليها 6 حروف أو أكتر", EMAIL_EXISTS: "الإيميل ده عليه حساب بالفعل — ادخل بيه", TOO_MANY_ATTEMPTS_TRY_LATER: "محاولات كتير — استنى شوية وجرّب",
    INVALID_EMAIL: "الإيميل مكتوب غلط", USER_DISABLED: "الحساب ده متوقف", MISSING_PASSWORD: "اكتب كلمة السر" };
  const pwMsg = (m) => { m = String(m || ""); const k = Object.keys(PWERR).find((x) => m.indexOf(x) === 0); return k ? PWERR[k] : "حصلت مشكلة: " + m; };
  async function idt(op, body) {
    const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:" + op + "?key=" + FB.key, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error((d.error && d.error.message) || "HTTP " + r.status); return d;
  }
  function pwForm(box, email) {
    box.replaceChildren(); let mode = "in";
    const env = el("div", "l29-env"); env.append(ic("mail"));
    const h = el("b"); h.style.textAlign = "center";
    const p = el("p", "l29-c");
    const mk = (type, ph, ac) => { const i = el("input"); i.type = type; i.placeholder = ph; i.autocomplete = ac; i.style.cssText = "direction:ltr;text-align:right"; return i; };
    const em = mk("email", "name@gmail.com", "email"); em.inputMode = "email"; em.value = email || (ld("sp_lastAuth", {}).u || "");
    const pw = mk("password", "كلمة السر", "current-password"); const pw2 = mk("password", "أكّد كلمة السر", "new-password");
    const go = el("button", "btn tap"); const gs = el("span"); go.append(ic("spark", 20), gs);
    const st = el("div", "l29-c"); const row = el("div", "r29-row"); row.style.justifyContent = "center";
    const sw = el("button", "r29-btn sec tap"); const fg = el("button", "r29-btn sec tap", "نسيت كلمة السر");
    row.append(sw, fg);
    const draw = () => {
      const up = mode === "up";
      h.textContent = up ? "اعمل حساب جديد" : "ادخل بالإيميل وكلمة السر";
      p.textContent = up ? "هنبعتلك إيميل تأكيد بعد ما تعمل الحساب." : "لو مالكش حساب هنعملك واحد في خطوة واحدة.";
      pw.autocomplete = up ? "new-password" : "current-password"; pw2.style.display = up ? "" : "none";
      gs.textContent = up ? " اعمل الحساب" : " ادخل"; sw.textContent = up ? "عندي حساب" : "حساب جديد"; fg.style.display = up ? "none" : "";
    };
    sw.onclick = () => { mode = mode === "up" ? "in" : "up"; st.textContent = ""; draw(); };
    const ok = async (d, e) => {
      try { localStorage.setItem("sp_lastAuth", JSON.stringify({ m: "mail", u: e })); } catch (x) {}
      env.className = "l29-env ok"; env.replaceChildren(ic("check")); st.textContent = "تمام! بندخّلك...";
      try { closeM(); } catch (x) {}
      if (typeof W.onNativeAuth === "function") await W.onNativeAuth(d.refreshToken); else { await FB.setRT(d.refreshToken); location.reload(); }
      confetti(40); vib(15);
    };
    go.onclick = async () => {
      const e = em.value.trim(), a = pw.value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) { st.textContent = PWERR.INVALID_EMAIL; return; }
      if (!a) { st.textContent = PWERR.MISSING_PASSWORD; return; }
      if (mode === "up" && a !== pw2.value) { st.textContent = "كلمتين السر مش زي بعض"; return; }
      if (mode === "up" && a.length < 6) { st.textContent = PWERR.WEAK_PASSWORD; return; }
      go.disabled = true; env.className = "l29-env spin"; st.textContent = mode === "up" ? "بنعمل الحساب..." : "بندخّلك...";
      try {
        if (mode === "up") {
          const d = await idt("signUp", { email: e, password: a, returnSecureToken: true });
          idt("sendOobCode", { requestType: "VERIFY_EMAIL", idToken: d.idToken }).catch(() => {});
          say("بعتنالك إيميل تأكيد على " + e, "mail"); await ok(d, e);
        } else {
          try { await ok(await idt("signInWithPassword", { email: e, password: a, returnSecureToken: true }), e); }
          catch (x) {
            if (/EMAIL_NOT_FOUND|INVALID_LOGIN_CREDENTIALS/.test(x.message)) {
              let reg = null; try { reg = (await idt("createAuthUri", { identifier: e, continueUri: "http://localhost" })).registered; } catch (y) {}
              if (reg === false) { mode = "up"; draw(); pw2.focus(); throw new Error("EMAIL_NOT_FOUND"); }
            }
            throw x;
          }
        }
      } catch (x) { env.className = "l29-env"; st.textContent = pwMsg(x.message); }
      finally { go.disabled = false; }
    };
    fg.onclick = async () => {
      const e = em.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) { st.textContent = "اكتب إيميلك الأول"; return; }
      fg.disabled = true;
      try { await idt("sendOobCode", { requestType: "PASSWORD_RESET", email: e }); st.textContent = "لو الإيميل عليه حساب، هيوصلك رابط تغيير كلمة السر."; }
      catch (x) { st.textContent = pwMsg(x.message); } finally { fg.disabled = false; }
    };
    [em, pw, pw2].forEach((i) => { i.onkeydown = (k) => { if (k.key === "Enter") go.click(); }; });
    box.append(env, h, p, em, pw, pw2, go, st, row); draw();
    setTimeout(() => { try { (em.value ? pw : em).focus(); } catch (x) {} }, 250);
  }
  function magicBody(sh) {
    const box = el("div", "l29-ml"); box.id = "l29box";
    const env = el("div", "l29-env"); env.append(ic("mail"));
    const h = el("b", null, "ادخل برابط على إيميلك — من غير كلمة سر"); h.style.textAlign = "center";
    const p = el("p", "l29-c", "هنبعتلك رابط، تفتحه من الموبايل ده، وترجع داخل لوحدك.");
    const last = ld("sp_lastAuth", {});
    const inp = el("input"); inp.type = "email"; inp.inputMode = "email"; inp.autocomplete = "email"; inp.placeholder = "name@gmail.com"; inp.style.cssText = "direction:ltr;text-align:right";
    const s0 = mlState(); inp.value = (s0 && !s0.g && s0.email) || (last.m === "magic" || last.m === "mail" ? last.u || "" : "");
    const go = el("button", "btn tap"); go.append(ic("spark", 20), el("span", null, " ابعتلي الرابط"));
    const status = el("div", "l29-c"); const row2 = el("div", "r29-row"); row2.style.justifyContent = "center";
    go.onclick = () => mlSend(inp.value.trim(), go); inp.onkeydown = (e) => { if (e.key === "Enter") go.click(); };
    box.append(env, h, p, inp, go, status, row2);
    let cdT = 0;
    mlUI = (s, x) => {
      if (!D.body.contains(box)) return;
      env.className = "l29-env"; clearInterval(cdT); row2.replaceChildren();
      if (s === "sending") { env.classList.add("spin"); status.textContent = "بنبعت الرابط..."; }
      else if (s === "sent") {
        env.classList.add("fly"); env.replaceChildren(ic("mail")); go.style.display = "none"; inp.style.display = "none";
        p.textContent = "بعتنا الرابط على " + x + " — افتح الإيميل ودوس عليه. هنستناك هنا ⏳";
        const open = el("button", "r29-btn sec tap"); open.append(ic("mail", 16), el("span", null, "افتح الإيميل"));
        open.onclick = () => { const u = "https://mail.google.com/"; try { W.Android && Android.openUrl ? Android.openUrl(u) : W.open(u, "_blank"); } catch (e) {} };
        const re = el("button", "r29-btn sec tap", "ابعت تاني"); re.disabled = true;
        re.onclick = () => { go.style.display = ""; inp.style.display = ""; mlUI("idle"); };
        const ch = el("button", "r29-btn sec tap", "إيميل تاني"); ch.onclick = () => { localStorage.removeItem("sp29_ml"); clearInterval(mlPoll); go.style.display = ""; inp.style.display = ""; mlUI("idle"); };
        row2.append(open, re, ch);
        const t0 = (mlState() || {}).at || now();
        const tick = () => { const left = Math.max(0, 180 - Math.round((now() - t0) / 1000)); status.textContent = "مستنيين تفتح الرابط · " + Math.floor(left / 60) + ":" + pad(left % 60); if (now() - t0 > 30000) re.disabled = false; if (!left) clearInterval(cdT); };
        tick(); cdT = setInterval(tick, 1000);
      } else if (s === "ok") { env.classList.add("ok"); env.replaceChildren(ic("check")); status.textContent = "تمام! بندخّلك..."; }
      else if (s === "expired") { status.textContent = "الرابط عدّى عليه 3 دقايق. لو فتحته متأخر ابعت واحد جديد."; go.style.display = ""; inp.style.display = ""; }
      else if (s === "err") { status.textContent = "مقدرناش نبعت: " + (x || ""); }
      else { status.textContent = ""; p.textContent = "هنبعتلك رابط، تفتحه من الموبايل ده، وترجع داخل لوحدك."; }
    };
    if (now() - (+ld("sp31_noml", 0) || 0) < 864e5) { pwForm(box, inp.value); return box; }
    if (s0 && !s0.g && now() - s0.at < 180000) { mlUI("sent", s0.email); mlStartPoll(); }
    return box;
  }
  function decorateLogin(mode) {
    const sh = D.getElementById("sheet"); if (!sh) return;
    const seg = sh.querySelector(".seg"); if (!seg || seg.querySelector(".l29seg")) return;
    const mb = el("button", "l29seg", "بريد ذكي ✨"); mb.onclick = () => W.loginSheet("magic");
    seg.append(mb);
    if (mode === "magic") {
      seg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === mb));
      // شيل محتوى الإيميل/كلمة السر واحتفظ بالسطر الأخير بتاع التشفير
      const after = []; let n = seg.nextSibling; while (n) { after.push(n); n = n.nextSibling; }
      const keep = after.length && after[after.length - 1].nodeType === 1 && after[after.length - 1].matches("p.muted") ? after.pop() : null;
      after.forEach((x) => x.remove());
      const box = magicBody(sh); keep ? sh.insertBefore(box, keep) : sh.append(box);
      if (keep) keep.textContent = "🔒 الرابط صالح لمرة واحدة وبيخلص بسرعة — مفيش كلمة سر تتسرق.";
      setTimeout(() => { try { const i = box.querySelector("input"); i && !i.value && i.focus(); } catch (e) {} }, 300);
    }
    // جوجل أشيك
    sh.querySelectorAll("button").forEach((x) => {
      if (!/googleLogin/.test(x.getAttribute("onclick") || "") || x.classList.contains("l29-g")) return;
      x.classList.add("l29-g"); x.removeAttribute("onclick"); x.onclick = (e) => { e.preventDefault(); googleBridge(); }; x.replaceChildren(); const t = D.createElement("template"); t.innerHTML = GSVG; x.append(t.content.firstChild, el("span", null, "المتابعة بحساب جوجل"));
    });
  }
  function initLogin() {
    if (OFF.has("login")) return;
    const orig = W.loginSheet; if (typeof orig !== "function" || orig.__v29) return;
    const wrap = function (mode) {
      let m = mode; try { const AU = G("AUTH"); m = mode || (AU && AU.mode) || (ld("sp_lastAuth", {}).m) || "user"; } catch (e) {}
      if (m === "magic") {
        try { orig.call(this, "mail"); const AU = G("AUTH"); if (AU) AU.mode = "magic"; } catch (e) { return; }
        decorateLogin("magic"); return;
      }
      const r = orig.apply(this, [m]); try { decorateLogin(m); } catch (e) {} return r;
    };
    wrap.__v29 = 1;
    try { W.loginSheet = wrap; } catch (e) {}
    const s = mlState(); if (s && now() - s.at < 180000) { mlStartPoll(); setTimeout(mlClaim, 900); }
    D.addEventListener("visibilitychange", () => { if (D.visibilityState === "visible" && mlState()) mlClaim(); });
  }

  // =====================================================================
  // 4) FX
  // =====================================================================
  const fxOn = () => !OFF.has("fx") && !REDUCED;
  const batteryLow = () => { try { const x = A(); if (!x || typeof x.battery !== "function") return false; const b = JSON.parse(x.battery()); const lv = b && (b.level ?? b.pct ?? b.l); return b && !b.charging && lv != null && +lv <= 20; } catch (e) { return false; } };
  function confetti(n) {
    if (!fxOn()) return;
    try { if (W.V25 && typeof V25.confetti === "function") return V25.confetti(n || 60); } catch (e) {}
    const C = ["#10b981", "#34d399", "#f5c76b", "#fde68a", "#60a5fa"]; n = n || 60;
    for (let i = 0; i < n; i++) { const p = el("i", "cf29"); p.style.left = Math.random() * 100 + "vw"; p.style.background = C[i % C.length]; p.style.setProperty("--dx", (Math.random() * 200 - 100) + "px"); p.style.setProperty("--rt", (Math.random() * 900 - 450) + "deg"); p.style.animationDelay = Math.random() * 0.3 + "s"; D.body.append(p); setTimeout(() => p.remove(), 2400); }
  }
  let logoSrc = "logo.png";
  function probeLogo() {
    const i = new Image(); i.onload = () => { if (i.naturalWidth > 8) { logoSrc = "logo29.png"; D.querySelectorAll('#splash img, #maint27 img, #blk25 img').forEach((x) => { if (/logo\.png$/.test(x.getAttribute("src") || "")) x.src = "logo29.png"; }); } }; i.src = "logo29.png?" + (W.BUILD && BUILD.vc || "");
  }
  function splashFx() {
    const s = D.getElementById("splash"); if (!s || s.classList.contains("out")) return;
    if (!OFF.has("fx")) s.classList.add("fx29");
  }
  let pRAF = 0, pCan = null;
  function particles() {
    if (!fxOn() || batteryLow()) return;
    const home = D.getElementById("t-home"); if (!home) return;
    const hero = [...home.children].find((x) => x.classList && x.classList.contains("card") && x.offsetHeight > 120); if (!hero || hero.querySelector(".pt29-c")) return;
    if (getComputedStyle(hero).position === "static") hero.style.position = "relative";
    const c = el("canvas", "pt29-c"); hero.prepend(c); pCan = c;
    const ctx = c.getContext("2d"); const dpr = Math.min(2, W.devicePixelRatio || 1);
    let w = 0, h = 0; const P = [];
    const size = () => { w = hero.clientWidth; h = hero.clientHeight; c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); for (let i = 0; i < 18; i++) P.push({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.15, vy: -0.08 - Math.random() * 0.2, a: Math.random(), g: Math.random() < 0.35 });
    let last = 0;
    const step = (t) => {
      pRAF = requestAnimationFrame(step);
      if (t - last < 33) return; last = t;
      if (D.visibilityState !== "visible" || !home.classList.contains("on") || !D.body.contains(c)) return;
      if (hero.clientWidth !== w || hero.clientHeight !== h) size();
      ctx.clearRect(0, 0, w, h);
      P.forEach((p) => { p.x += p.vx; p.y += p.vy; p.a += 0.01; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4; const al = 0.25 + 0.35 * Math.abs(Math.sin(p.a)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = p.g ? "rgba(245,199,107," + al + ")" : "rgba(110,231,183," + al + ")"; ctx.fill(); });
    };
    cancelAnimationFrame(pRAF); pRAF = requestAnimationFrame(step);
  }
  function initFx() {
    probeLogo(); splashFx();
    if (OFF.has("fx")) return;
    // انتقال الصفحات
    const og = W.go;
    if (typeof og === "function" && !og.__v29) {
      const g2 = function (t) { const r = og.apply(this, arguments); try { if (fxOn()) { const s = D.getElementById("t-" + t); if (s) { s.classList.remove("pg29"); void s.offsetWidth; s.classList.add("pg29"); setTimeout(() => s.classList.remove("pg29"), 400); } } if (t === "home") setTimeout(particles, 200); if (t === "me") setTimeout(meCards, 250); } catch (e) {} return r; };
      g2.__v29 = 1; try { W.go = g2; } catch (e) {}
    }
    // تموّج (لو v25 مش عامله)
    if (!W.V25) D.addEventListener("pointerdown", (e) => {
      if (!fxOn()) return; const b = e.target.closest && e.target.closest("button,.btn,.tap"); if (!b) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, x = el("span", "rip29");
      x.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
      if (getComputedStyle(b).position === "static") b.style.position = "relative"; if (getComputedStyle(b).overflow !== "hidden") b.style.overflow = "hidden";
      b.append(x); setTimeout(() => x.remove(), 600);
    }, { passive: true, capture: true });
    setTimeout(particles, 1800);
  }

  // =====================================================================
  // 5) تاج البريميوم
  // =====================================================================
  let crSeq = 0;
  function crownSvg(black) {
    const id = "cg29_" + (++crSeq);
    const a = black ? ["#6b7280", "#1f2937", "#0b0b0f"] : ["#fff4c2", "#f5c76b", "#b7791f"];
    const t = D.createElement("template");
    t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a[0] + '"/><stop offset=".5" stop-color="' + a[1] + '"/><stop offset="1" stop-color="' + a[2] + '"/></linearGradient></defs><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="url(#' + id + ')" stroke="' + (black ? "#c8962e" : "#8a5a12") + '" stroke-width=".8" stroke-linejoin="round"/><rect x="5" y="19.5" width="14" height="2" rx="1" fill="url(#' + id + ')"/><circle cx="12" cy="5" r="1.2" fill="' + (black ? "#f5d08a" : "#fff") + '"/></svg>';
    return t.content.firstChild;
  }
  function crownBadge(label, black, solo) {
    const s = el("span", "cr29" + (black ? " blk" : "") + (solo ? " solo" : "")); s.setAttribute("data-cr29", "1");
    s.append(crownSvg(black)); if (label) s.append(el("span", null, label));
    if (!REDUCED) for (let i = 0; i < 3; i++) s.append(el("i"));
    return s;
  }
  const RX = /(💎|🖤|👨‍👩‍👧)\s*(بريميوم|بلاك|العيلة)/;
  function upgradeNode(root) {
    if (!root || !isElite()) return;
    // شارات tb8
    (root.querySelectorAll ? root.querySelectorAll(".tb8:not(.cr29b)") : []).forEach((b) => {
      if (!b.classList.contains("premium") && !b.classList.contains("black") && !b.classList.contains("family")) return;
      b.classList.add("cr29b"); b.prepend(crownSvg(b.classList.contains("black")));
    });
    // نصوص «💎 بريميوم»
    const tw = D.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => {
      const p = n.parentElement; if (!p || !RX.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (p.closest("input,textarea,select,option,script,style,[contenteditable],[data-cr29],svg")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT; } });
    const L = []; while (tw.nextNode()) L.push(tw.currentNode);
    L.slice(0, 40).forEach((n) => {
      const m = n.nodeValue.match(RX); if (!m) return;
      const before = n.nodeValue.slice(0, m.index), after = n.nodeValue.slice(m.index + m[0].length);
      const label = m[1] === "👨‍👩‍👧" ? m[1] + " " + m[2] : m[2];
      const frag = D.createDocumentFragment(); if (before) frag.append(D.createTextNode(before)); frag.append(crownBadge(label, m[2] === "بلاك")); if (after) frag.append(D.createTextNode(after));
      n.replaceWith(frag);
    });
  }
  function headerCrown() {
    const old = D.getElementById("hcr29");
    if (!isElite()) { old && old.remove(); return; }
    const h = D.getElementById("hello"); if (!h) return;
    if (old && old.parentNode === h.parentNode && old.previousSibling === h) return;
    old && old.remove();
    const c = crownBadge("", tierNow() === "black", true); c.id = "hcr29"; c.title = tierNow() === "black" ? "بلاك" : "بريميوم";
    h.after(c);
  }
  let crQ = new Set(), crT = 0;
  function initCrown() {
    if (OFF.has("crown")) return;
    const flush = () => { crT = 0; if (!isElite()) { crQ.clear(); return; } const q = [...crQ]; crQ.clear(); q.forEach((n) => { if (D.body.contains(n)) upgradeNode(n); }); headerCrown(); };
    const mo = new MutationObserver((ms) => {
      for (const m of ms) for (const n of m.addedNodes) { if (n.nodeType === 1) { crQ.add(n); quickAdd(n); } else if (n.nodeType === 3 && n.parentElement) crQ.add(n.parentElement); }
      if (crQ.size && !crT) crT = setTimeout(flush, 250);
    });
    mo.observe(D.body, { childList: true, subtree: true });
    setTimeout(() => { upgradeNode(D.body); headerCrown(); }, 1200);
    setInterval(headerCrown, 15000);
  }

  // ===== ربط بإعادة رسم الرئيسية (تخطيط التنبيهات بعد كل تسجيل) =====
  function hookHome() {
    const rh = W.renderHome; if (typeof rh !== "function" || rh.__v29) return;
    const w2 = function () { const r = rh.apply(this, arguments); try { if (!OFF.has("notify")) setTimeout(() => maybeSchedule(), 1500); if (!OFF.has("crown")) headerCrown(); } catch (e) {} return r; };
    Object.assign(w2, rh); w2.__v29 = 1; try { W.renderHome = w2; } catch (e) {}
  }

  // ================= تشغيل =================
  function start() {
    try { initReports(); } catch (e) { logErr("v29 reports " + e.message, e.stack); }
    try { initLogin(); } catch (e) { logErr("v29 login " + e.message, e.stack); }
    try { initFx(); } catch (e) { logErr("v29 fx " + e.message, e.stack); }
    try { initCrown(); } catch (e) { logErr("v29 crown " + e.message, e.stack); }
    try { hookHome(); } catch (e) {}
    // لو الـ crown مقفول، لسه محتاجين نراقب #q26 لزرار البلاغ
    if (OFF.has("crown") && !OFF.has("reports")) { try { new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && quickAdd(n)))).observe(D.body, { childList: true }); } catch (e) {} }
    setTimeout(() => { initNotify().catch(() => {}); }, 2500);
    D.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("#nav")) setTimeout(meCards, 350); }, true);
    setTimeout(meCards, 2000);
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();

  W.V29 = {
    report: reportSheet, myReports, reportDetail, pollReports,
    notify: { sheet: notifySheet, plan: () => NE.plan, schedule, candidates, inbox: inboxSheet },
    login: { magic: () => W.loginSheet && W.loginSheet("magic"), send: mlSend, claim: mlClaim, google: googleBridge },
    fx: { confetti, particles },
    crown: { badge: crownBadge, upgrade: upgradeNode, header: headerCrown },
    errors: () => ERR.slice(), logErr, oldFeedback,
  };
})();
