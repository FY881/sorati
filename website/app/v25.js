/* سعراتي v25 — طبقة التطوير المشتركة (برو + أدمن)
   1) نظام تصميم موحّد: خط واحد، مقياس أحجام، أرقام موحّدة، أيقونات موحّدة بدل الإيموجي
   2) توزيع ذكي للمساحة: أعمدة على التابلت/الوضع الأفقي، شريط تنقّل جانبي، مفيش كروت تحت الشريط
   3) مؤثرات بصرية وصوتية: أصوات مُولّدة (من غير ملفات)، اهتزاز متزامن، تموّج اللمس، احتفال
   4) بوابة الإصدارات (إيقاف أي إصدار من لوحة التحكم) + أوامر الأدمن على الحساب
   5) المعرّف الفريد SR-XXXX-XXXX
   6) جسر الدخول الذكي بجوجل (من غير توكن في الرابط، وبيكمّل حتى لو المتصفح ما رجعش للتطبيق)
   كل جزء قابل للإيقاف بمفتاح:  localStorage sp25_off = "fx,icons,layout,digits"  */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.V25) return;
  const OFF = new Set((localStorage.getItem("sp25_off") || "").split(","));
  const APP = (W.BUILD && BUILD.app === "admin") || /admin/.test(location.pathname + (D.title || "")) ? "admin" : "pro";
  const VC = (W.BUILD && BUILD.vc) || 0;
  const SRV = "https://deputy.sorati-command.workers.dev"; // v40: كان العامل الأصلي (404)
  const _FB = () => (typeof FB !== "undefined" ? FB : null);
  const _toast = (m, ic) => { try { typeof toast === "function" ? toast(m, ic || "info") : alert(m); } catch (e) {} };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ================= 2) نظام التصميم + توزيع المساحة =================
  const css = `
:root{--f25:Plex,"IBM Plex Sans Arabic",system-ui,sans-serif;--r25:22px;--g25:#10b981;--gold25:#f5c451;--s1:12px;--s2:13.5px;--s3:15px;--s4:17px;--s5:21px;--s6:28px}
html,body,button,input,select,textarea{font-family:var(--f25)!important;letter-spacing:0}
body{font-size:var(--s3);line-height:1.6;font-feature-settings:"tnum" 1}
h1{font-size:var(--s6)!important}h2,.card h2{font-size:var(--s4)!important;font-weight:700!important}h3{font-size:var(--s3)!important}
.muted,small{font-size:var(--s2)}
svg.i{width:1.15em;height:1.15em;vertical-align:-.2em;stroke-width:1.9}
.i25{display:inline-flex;width:1.2em;height:1.2em;align-items:center;justify-content:center;vertical-align:-.22em;margin-inline-end:.15em;color:var(--g25)}
.i25 svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
/* مساحة الأمان تحت الشريط السفلي: آخر كارت مايستخباش */
.tab.on{padding-bottom:calc(96px + env(safe-area-inset-bottom))}
/* كارت الهالة: الشرائح تملا العرض بدل ما تتكوّم يمين */
#aura8{gap:14px}#aura8>*:nth-child(2){flex:1;min-width:0}
/* ---------- تابلت / وضع أفقي ---------- */
@media (min-width:900px){
  body{padding-bottom:0!important;padding-inline-start:104px!important}
  #nav.tabbar{position:fixed!important;inset-inline-start:14px!important;inset-inline-end:auto!important;top:50%!important;bottom:auto!important;left:auto;transform:translateY(-50%)!important;width:78px!important;height:auto!important;max-width:none!important;flex-direction:column!important;gap:10px!important;padding:14px 8px!important;border-radius:28px!important;margin:0!important}
  #nav.tabbar>*{width:100%!important;flex:none!important;margin:0!important}
  .tab.on{max-width:1500px;margin:0 auto;padding:10px 22px 28px!important;column-count:2;column-gap:18px}
  .tab.on>*{max-width:none!important;width:auto!important;margin:0 0 16px!important;break-inside:avoid;-webkit-column-break-inside:avoid}
  .tab.on>.top,.tab.on>.wn21h,.tab.on>#annBox,.tab.on>.full25{column-span:all;-webkit-column-span:all}
  .tab.on>[style*="display: none"],.tab.on>:empty{display:none!important}
  .modal>*{max-width:720px!important;margin-inline:auto!important}
}
@media (min-width:1500px){.tab.on{column-count:3}}
/* ---------- تأثيرات ---------- */
.rip25{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.35),transparent 60%);transform:scale(0);animation:rip25 .55s ease-out forwards}
@keyframes rip25{to{transform:scale(1);opacity:0}}
.tap,.btn,button{position:relative;overflow:hidden}
.card.glass{transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}
.card.glass:active{transform:scale(.985)}
.cf25{position:fixed;top:-10px;width:8px;height:14px;border-radius:2px;z-index:99999;pointer-events:none;animation:cf25 1.6s cubic-bezier(.2,.6,.3,1) forwards}
@keyframes cf25{to{transform:translate(var(--dx),105vh) rotate(var(--rt));opacity:.2}}
/* ثيم الأعضاء الذهبي */
body.gold25 .card.glass{box-shadow:0 0 0 1px rgba(245,196,81,.18),0 12px 40px rgba(0,0,0,.35)}
body.gold25 .top h1{background:linear-gradient(90deg,#fde68a,#f59e0b,#fde68a);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sh25 6s linear infinite}
@keyframes sh25{to{background-position:-200% 0}}
/* المعرّف الفريد */
.sid25{display:flex;align-items:center;gap:10px;justify-content:space-between;direction:ltr}
.sid25 b{font:700 20px/1 ui-monospace,monospace;letter-spacing:2px;color:var(--gold25)}
/* شاشة إيقاف الإصدار */
#blk25{position:fixed;inset:0;z-index:2147483000;background:#060a17;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;gap:14px}
#blk25 img{width:96px;height:96px;border-radius:24px}#blk25 a{background:#10b981;color:#04130e;padding:14px 22px;border-radius:16px;font-weight:800;text-decoration:none}
@media (prefers-reduced-motion:reduce){.rip25,.cf25{display:none}body.gold25 .top h1{animation:none}}
`;
  const st = D.createElement("style"); st.id = "v25css"; st.textContent = OFF.has("layout") ? css.replace(/@media \(min-width:900px\)[\s\S]*?\n}\n/, "") : css;
  (D.head || D.documentElement).append(st);

  // ================= 3) أيقونات موحّدة بدل الإيموجي =================
  // الإيموجي بيترسم مختلف على كل موبايل وبيبوّظ التناسق مع أيقونات الخطوط. نبدّل الشائع منه بأيقونات التطبيق نفسها.
  const MAP = { "🍽": "bowl", "🍽️": "bowl", "💧": "drop", "🔥": "flame", "🚶": "run", "🏃": "run", "🌙": "moon", "😊": "heart", "🙂": "heart", "🥩": "bolt", "✨": "spark", "🎯": "target", "🎧": "speaker", "☀": "spark", "☀️": "spark", "🌤": "spark", "⛅": "cloud", "🏆": "trophy", "⭐": "star", "💪": "bolt", "🔔": "bell", "📊": "chart", "📷": "camera", "🧠": "brain", "👑": "crown", "🔒": "lock", "🛡": "shield", "⚙": "gear", "💬": "chat", "👥": "users", "🎉": "party", "⏰": "clock", "🔍": "search", "📈": "chart", "🍵": "tea", "🥗": "leaf", "❤️": "heart", "💚": "heart", "🚀": "bolt", "📣": "mega", "🎟": "ticket", "💰": "dollar", "⚡": "bolt" };
  const ER = new RegExp("(" + Object.keys(MAP).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\uFE0F?", "u");
  const SEL = "h1,h2,h3,button,.btn,.pill,.chip,[class*=pill],[class*=chip],.card b,.card strong,label,.tabbar span";
  function iconify(root) {
    if (OFF.has("icons") || typeof ICONS === "undefined") return;
    const els = root.matches && root.matches(SEL) ? [root, ...root.querySelectorAll(SEL)] : root.querySelectorAll ? root.querySelectorAll(SEL) : [];
    for (const el of els) {
      if (el.closest("input,textarea,#c3 .list,.chatmsg,[contenteditable],.i25")) continue;
      for (const n of [...el.childNodes]) {
        if (n.nodeType !== 3 || !ER.test(n.data)) continue;
        const m = n.data.match(ER); const name = MAP[m[1]] || MAP[m[1].replace(/\uFE0F/, "")];
        if (!name || !ICONS[name]) continue;
        const after = n.splitText(m.index); after.data = after.data.slice(m[0].length);
        const sp = D.createElement("span"); sp.className = "i25"; sp.setAttribute("aria-hidden", "true");
        const svg = D.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24");
        const tpl = D.createElement("template"); tpl.innerHTML = "<svg>" + ICONS[name] + "</svg>"; // ICONS ثابتة من كود التطبيق نفسه (مش بيانات مستخدم)
        svg.append(...tpl.content.firstChild.childNodes); sp.append(svg);
        el.insertBefore(sp, after);
      }
    }
  }
  let qd = new Set(), qt = 0;
  const flushI = () => { qt = 0; const s = qd; qd = new Set(); s.forEach((r) => r.isConnected && iconify(r)); };
  new MutationObserver((ms) => { for (const m of ms) for (const x of m.addedNodes) if (x.nodeType === 1) qd.add(x); else if (x.nodeType === 3 && x.parentElement) qd.add(x.parentElement); if (!qt) qt = requestAnimationFrame(flushI); })
    .observe(D.documentElement, { childList: true, subtree: true });

  // ================= 4) الصوت والاهتزاز والتأثيرات =================
  // أصوات مُولّدة بـ WebAudio: صفر ميجا حجم، متناسقة (نفس السلّم الموسيقي)، وبتحترم وضع الصامت في الإعدادات
  const SND = () => !OFF.has("fx") && localStorage.getItem("sp25_snd") !== "0";
  let ac = null;
  const ctx = () => (ac ||= new (W.AudioContext || W.webkitAudioContext)());
  function tone(f, t0, dur, type = "sine", g = 0.06) {
    const a = ctx(), o = a.createOscillator(), v = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, a.currentTime + t0);
    v.gain.setValueAtTime(0, a.currentTime + t0); v.gain.linearRampToValueAtTime(g, a.currentTime + t0 + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + dur);
    o.connect(v).connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur + 0.02);
  }
  const vib = (p) => { try { if (W.Android && Android.haptic) Android.haptic(); else navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  const SOUNDS = {
    tap: () => tone(880, 0, 0.05, "triangle", 0.025),
    success: () => { tone(659, 0, 0.12); tone(988, 0.08, 0.18); },
    coin: () => { tone(1319, 0, 0.08, "square", 0.025); tone(1760, 0.07, 0.16, "square", 0.025); },
    streak: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.16, "triangle", 0.05)),
    levelup: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.22, "sine", 0.06)); tone(262, 0, 0.6, "sine", 0.03); },
    error: () => { tone(220, 0, 0.14, "sawtooth", 0.03); tone(196, 0.1, 0.18, "sawtooth", 0.03); },
  };
  const play = (k) => { if (!SND()) return; try { SOUNDS[k] && SOUNDS[k](); } catch (e) {} };
  function confetti(n = 70) {
    if (reduced || OFF.has("fx")) return;
    const C = ["#10b981", "#34d399", "#f5c451", "#fde68a", "#60a5fa", "#f472b6"];
    for (let i = 0; i < n; i++) { const p = D.createElement("i"); p.className = "cf25"; p.style.left = Math.random() * 100 + "vw"; p.style.background = C[i % C.length]; p.style.setProperty("--dx", (Math.random() * 200 - 100) + "px"); p.style.setProperty("--rt", (Math.random() * 900 - 450) + "deg"); p.style.animationDelay = Math.random() * 0.3 + "s"; D.body.append(p); setTimeout(() => p.remove(), 2100); }
  }
  // تموّج + صوت خفيف مع كل لمسة على زرار
  D.addEventListener("pointerdown", (e) => {
    const b = e.target.closest && e.target.closest("button,.btn,.tap,.tabbar a,.tabbar button");
    if (!b || OFF.has("fx")) return;
    play("tap");
    if (reduced) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, x = D.createElement("span");
    x.className = "rip25"; x.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.append(x); setTimeout(() => x.remove(), 600);
  }, { passive: true, capture: true });
  // ربط الصوت بأحداث التطبيق الموجودة من غير ما نغيّرها: التوست بأيقونة check = نجاح، trophy/party = إنجاز
  const hookToast = () => {
    if (typeof toast !== "function" || toast.__v25) return false;
    const old = toast;
    // eslint-disable-next-line no-global-assign
    try { toast = function (m, ic) { const r = old.apply(this, arguments); if (ic === "check") { play("success"); vib(15); } else if (ic === "trophy" || ic === "party" || ic === "crown") { play("levelup"); vib([20, 40, 20]); confetti(); } else if (ic === "flame") { play("streak"); vib(20); } else if (ic === "coin" || ic === "dollar") play("coin"); return r; }; toast.__v25 = 1; } catch (e) { return false; }
    return true;
  };

  // ================= 5) جسر الدخول الذكي =================
  const b64u = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, "0")).join("");
  let polling = 0;
  async function claim() {
    const v = sessionStorage.getItem("br25") || localStorage.getItem("br25");
    if (!v) return false;
    try {
      const r = await (await fetch(SRV + "/v1/auth/bridge/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ v }) })).json();
      if (r && r.ok && r.rt) {
        localStorage.removeItem("br25"); sessionStorage.removeItem("br25"); localStorage.removeItem("br25at");
        if (typeof W.onNativeAuth === "function") await W.onNativeAuth(r.rt); else { await _FB().setRT(r.rt); location.reload(); }
        play("success"); return true;
      }
    } catch (e) {}
    return false;
  }
  function startPoll() {
    clearInterval(polling); let n = 0;
    polling = setInterval(async () => { if (++n > 90 || Date.now() - (+localStorage.getItem("br25at") || 0) > 180000) return clearInterval(polling); if (D.visibilityState === "visible" && (await claim())) clearInterval(polling); }, 2000);
  }
  const fb = _FB();
  if (fb && fb.login) {
    const oldLogin = fb.login;
    fb.login = async function (app) {
      try {
        const v = b64u(crypto.getRandomValues(new Uint8Array(48)));
        localStorage.setItem("br25", v); localStorage.setItem("br25at", Date.now());
        const ch = await sha(v);
        const u = fb.authUrl + "?app=" + (app || APP === "admin" ? (app || "admin") : "pro") + "&ch=" + ch;
        startPoll();
        W.Android && Android.openUrl ? Android.openUrl(u) : (location.href = u);
      } catch (e) { return oldLogin.apply(this, arguments); }
    };
    D.addEventListener("visibilitychange", () => { if (D.visibilityState === "visible" && localStorage.getItem("br25")) claim(); });
    // رجوع من intent://auth?bridge=1 — الغلاف الأصلي بيفتح التطبيق، وإحنا بنسحب التوكن فورًا
    setTimeout(() => localStorage.getItem("br25") && (claim(), startPoll()), 800);
  }

  // ================= 6) البوابة: إيقاف الإصدارات + أوامر الأدمن + المعرّف =================
  const V25 = { play, confetti, vib, iconify, sid: localStorage.getItem("sp25_sid") || null, boot: null };
  W.V25 = V25;
  function block(v) {
    const d = D.createElement("div"); d.id = "blk25";
    const img = D.createElement("img"); img.src = "logo.png"; img.alt = "";
    const h = D.createElement("h2"); h.textContent = v.why === "stopped" ? "الإصدار ده اتوقف" : "لازم تحدّث التطبيق";
    const p = D.createElement("p"); p.textContent = v.msg || ""; p.style.cssText = "max-width:420px;line-height:1.8;opacity:.85";
    d.append(img, h, p);
    if (/^https:\/\//.test(v.url || "")) { const a = D.createElement("a"); a.textContent = "نزّل آخر إصدار"; a.href = v.url; a.onclick = (e) => { if (W.Android && Android.openUrl) { e.preventDefault(); Android.openUrl(v.url); } }; d.append(a); }
    D.getElementById("blk25")?.remove(); D.body.append(d);
  }
  async function bootCheck() {
    // حظر محفوظ يشتغل حتى من غير نت (عشان محدّش يقفل النت ويهرب من الإيقاف)
    const cached = JSON.parse(localStorage.getItem("sp25_blk") || "null");
    if (cached && cached.vc === VC) block(cached);
    const day = new Date().toDateString(), ping = localStorage.getItem("sp25_ping") !== day;
    const h = {};
    try { const f = _FB(); if (f && f.rt) h.authorization = "Bearer " + (await f.token()); } catch (e) {}
    let r;
    try { r = await (await fetch(`${SRV}/v1/boot?app=${APP}&vc=${VC}&vn=${encodeURIComponent((W.BUILD && BUILD.vn) || "")}${ping ? "&ping=1" : ""}`, { headers: h, cache: "no-store" })).json(); } catch (e) { return; } // فشل الشبكة = نكمّل عادي (إلا لو فيه حظر محفوظ)
    if (!r || !r.ok) return;
    if (ping) localStorage.setItem("sp25_ping", day);
    V25.boot = r;
    if (r.ver && r.ver.block) { localStorage.setItem("sp25_blk", JSON.stringify({ ...r.ver, vc: VC })); block(r.ver); }
    else { localStorage.removeItem("sp25_blk"); D.getElementById("blk25")?.remove(); if (r.ver && r.ver.update && localStorage.getItem("sp25_upd") !== String(r.ver.update.vc)) { localStorage.setItem("sp25_upd", String(r.ver.update.vc)); _toast("فيه إصدار جديد " + r.ver.update.vn + " — من الإعدادات > التحديثات", "bell"); } }
    if (r.sid) { V25.sid = r.sid; localStorage.setItem("sp25_sid", r.sid); paintSid(); }
    const c = r.ctl || {};
    if (c.banned || (c.suspend && (!c.suspend.until || c.suspend.until > Date.now()))) block({ why: "stopped", msg: c.banned ? "الحساب ده موقوف. لو شايف إن ده غلط كلّم الدعم ومعاك المعرّف بتاعك " + (V25.sid || "") : "الحساب موقوف مؤقتًا" + (c.suspend.why ? ": " + c.suspend.why : "") + (c.suspend.until ? " لحد " + new Date(c.suspend.until).toLocaleString("ar-EG") : ""), url: "" });
    const lastLogin = +localStorage.getItem("sp25_loginAt") || 0;
    if (c.logoutAfter && c.logoutAfter > lastLogin && _FB() && _FB().rt) { try { _FB().logout(); } catch (e) {} localStorage.setItem("sp25_loginAt", Date.now()); _toast("اتسجّل خروجك من كل الأجهزة بأمان", "lock"); }
    if (c.msg && localStorage.getItem("sp25_msg") !== String(c.msg.at)) { localStorage.setItem("sp25_msg", String(c.msg.at)); setTimeout(() => _toast(c.msg.text, "mega"), 1200); }
    if (c.flags) W.FF25 = c.flags;
  }
  // كارت المعرّف الفريد في صفحة الحساب
  function paintSid() {
    const me = D.getElementById("t-me"); if (!me || !V25.sid) return;
    let c = D.getElementById("sid25");
    if (!c) {
      c = D.createElement("div"); c.id = "sid25"; c.className = "card glass";
      const t = D.createElement("h2"); t.textContent = "المعرّف الفريد بتاعك";
      const row = D.createElement("div"); row.className = "sid25";
      const b = D.createElement("b"); const cp = D.createElement("button"); cp.className = "btn"; cp.textContent = "نسخ";
      cp.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(V25.sid); _toast("اتنسخ " + V25.sid, "copy"); };
      row.append(b, cp);
      const p = D.createElement("p"); p.className = "muted"; p.textContent = "ابعته للدعم لو احتجت مساعدة. مش بيكشف إيميلك ولا بياناتك.";
      c.append(t, row, p);
      me.insertBefore(c, me.children[1] || null);
    }
    c.querySelector("b").textContent = V25.sid;
  }
  // الثيم الذهبي للأعضاء
  const gold = () => { try { const p = typeof isPro === "function" && isPro(); D.body.classList.toggle("gold25", !!p && localStorage.getItem("sp25_gold") !== "0"); } catch (e) {} };
  // تذكير: سجّل لحظة الدخول (عشان أمر "خروج من كل الأجهزة" مايطلّعش اللي دخل بعده)
  if (typeof W.onNativeAuth === "function" && !W.onNativeAuth.__v25) { const o = W.onNativeAuth; W.onNativeAuth = async function () { localStorage.setItem("sp25_loginAt", Date.now()); return o.apply(this, arguments); }; W.onNativeAuth.__v25 = 1; }

  const start = () => {
    hookToast() || setTimeout(hookToast, 2000);
    iconify(D.body); gold(); setInterval(gold, 30000);
    bootCheck(); setInterval(bootCheck, 30 * 60e3);
    D.addEventListener("click", (e) => { if (e.target.closest && e.target.closest('[data-t="me"],[onclick*="me"]')) setTimeout(paintSid, 300); }, true);
    setTimeout(paintSid, 1500);
  };
  D.readyState === "loading" ? D.addEventListener("DOMContentLoaded", start) : start();
})();
