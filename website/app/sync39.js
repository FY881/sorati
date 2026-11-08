/* سعراتي 39 — «غرفة التحكم» على جهاز المستخدم (برو + الأدمن، نفس الملف).
   المصدر: قرار السيرفر لنسختك بالظبط /v1/app/c39/boot (موقّع Ed25519 — مايتزوّرش من الجهاز).
   - nudge: كارت لطيف «حدّث» (يتأجل 12 ساعة).
   - warn: عدّ تنازلي حقيقي بوقت السيرفر (مش ساعة الموبايل) — بيعلى مع القرب: >24س شارة، ≤24س نافذة، ≤1س أحمر، ≤10د إنذار.
   - force / kill / maint: شاشة كاملة. kill/force بتتفتح بالتحديث أو بكلمة سر الإدارة (نفس كلمات f37). الصيانة بتتفتح لوحدها في ميعادها.
   - إشعارات ذكية قبل القفل بـ 24س/1س/10د وفي ميعاده، بتحترم ساعات الهدوء ومن غير تكرار.
   - بيضيف _sv=app.vc لطلبات الوكيل، فالسيرفر نفسه بيرفض نسخة متوقفة (426) حتى لو حد شال الملف ده.
   - الطرح التدريجي: لو جهازك مش في النسبة، شريط التحديث القديم (sync35) بيستخبى.
   - السيرفر في وضع المحاكاة (live=false) مابيبعتش قفل أصلًا؛ المعاينة بس من الأدمن: C39.preview("kill"). */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.C39) return;
  const API = "https://deputy.sorati-command.workers.dev/v1/app/c39", HOST = "https://deputy.sorati-command.workers.dev/v1/app/";
  const PUB = "3h7vQxkgk4ixjOOOHIrQfQINaKobpgopePLbQ5zH3vI=", SITE = "https://sorati-610ba.web.app";
  const B = W.BUILD || {}, APP = B.app === "admin" ? "admin" : "pro", VC = +B.vc || 0, NAME = APP === "admin" ? "سعراتي أدمن" : "سعراتي برو";
  const KD = "s39_dec", KS = "s39_snz", KN = "s39_nsig";
  const LS = { g: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, s: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const mk = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const hap = (k) => { try { W.Android && Android.haptic && Android.haptic(k || "light"); } catch (e) {} };
  const open = (u) => { try { if (W.Android && Android.openUrl) return Android.openUrl(u); } catch (e) {} W.open(u, "_blank"); };
  const okUrl = (u) => /^https:\/\/sorati-610ba\.web\.app\//.test(u || "");
  const lite = () => D.documentElement.classList.contains("lite31") || (D.body && D.body.classList.contains("lite"));
  let did = localStorage.getItem("s36_did"); if (!did) { did = String(Math.random()).slice(2); localStorage.setItem("s36_did", did); }
  let cur = null, tick = 0, fxStop = null, lastCheck = 0, preview = false;

  /* ---------- وقت السيرفر ---------- */
  const now = () => Date.now() + ((cur && cur.skew) || 0);
  const pad = (n) => String(n).padStart(2, "0");
  function parts(ms) { ms = Math.max(0, ms); const s = Math.floor(ms / 1e3); return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }; }
  function human(ms) { const p = parts(ms); return p.d ? p.d + " يوم و" + p.h + " ساعة" : p.h ? p.h + " ساعة و" + p.m + " دقيقة" : p.m ? p.m + " دقيقة" : p.s + " ثانية"; }

  /* ---------- التحقق من التوقيع ---------- */
  const b64 = (x) => Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
  async function verify(payload, sig) {
    try { if (!sig || !W.crypto || !crypto.subtle) return false; const k = await crypto.subtle.importKey("raw", b64(PUB), { name: "Ed25519" }, false, ["verify"]); return await crypto.subtle.verify({ name: "Ed25519" }, k, b64(sig), new TextEncoder().encode(payload)); }
    catch (e) { return false; }
  }

  /* ---------- CSS ---------- */
  function css() {
    if (D.getElementById("c39css")) return;
    const s = mk("style"); s.id = "c39css";
    s.textContent = `
.c39o{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:22px;direction:rtl;font-family:var(--f25,system-ui);color:#f8f1dc;text-align:center;overflow:auto;background:radial-gradient(120% 80% at 50% 0%,#2a1d05 0%,#0b0905 55%,#030302 100%)}
.c39o.kill{background:radial-gradient(120% 80% at 50% 0%,#3a0b0b 0%,#120404 55%,#050101 100%)}
.c39o.maint{background:radial-gradient(120% 80% at 50% 0%,#06263a 0%,#04111a 55%,#020608 100%)}
.c39o canvas.fx,.c39w canvas.fx{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;opacity:.9}
.c39o .cd{position:relative;max-width:400px;width:100%}
.c39o h2{margin:14px 0 6px;font-size:24px;font-weight:900;line-height:1.3;background:linear-gradient(90deg,#fff1c1,#f5c451,#fff1c1);-webkit-background-clip:text;background-clip:text;color:transparent}
.c39o.kill h2{background:linear-gradient(90deg,#fecaca,#f87171,#fecaca);-webkit-background-clip:text;background-clip:text}
.c39o.maint h2{background:linear-gradient(90deg,#bae6fd,#38bdf8,#bae6fd);-webkit-background-clip:text;background-clip:text}
.c39o p{margin:6px 0;color:#d9cfb5;font-size:14.5px;line-height:1.7}.c39o .msg{background:rgba(255,255,255,.05);border:1px solid rgba(245,196,81,.2);border-radius:14px;padding:10px 12px;margin:10px 0}
.c39ring{position:relative;width:220px;height:220px;margin:6px auto}.c39ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.c39ring .tr{stroke:rgba(255,255,255,.08)}.c39ring .pr{stroke:url(#c39g);stroke-linecap:round;transition:stroke-dashoffset 1s linear;filter:drop-shadow(0 0 10px rgba(245,196,81,.6))}
.c39o.kill .c39ring .pr,.c39w.red .c39ring .pr{stroke:#f87171;filter:drop-shadow(0 0 12px rgba(248,113,113,.8))}.c39o.maint .c39ring .pr{stroke:#38bdf8;filter:drop-shadow(0 0 12px rgba(56,189,248,.7))}
.c39ring .in{position:absolute;inset:0;display:grid;place-content:center;gap:2px}.c39ring .t{font:900 34px/1.1 ui-monospace,monospace;direction:ltr;letter-spacing:1px;color:#fff6dc}.c39ring .l{font-size:12px;color:#bfae86}
.c39ring svg.ic{width:110px;height:110px;margin:55px auto;transform:none;display:block}
.c39b{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:99px;padding:14px 26px;font:900 15px/1 var(--f25,system-ui);color:#1a1205;background:linear-gradient(135deg,#fff1c1,#f5c451 45%,#d97706);box-shadow:0 16px 44px -12px rgba(217,119,6,.9);margin:12px 4px 0}
.c39o.kill .c39b{color:#fff;background:linear-gradient(135deg,#fca5a5,#ef4444 50%,#991b1b);box-shadow:0 16px 44px -12px rgba(239,68,68,.9)}
.c39g{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:#e9dfc4;border-radius:99px;padding:11px 18px;font:700 13px var(--f25,system-ui);margin:10px 4px 0}
.c39o .pw{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);font-size:13px;color:#bfae86}.c39o input{width:100%;box-sizing:border-box;margin:8px 0;padding:12px;border-radius:14px;border:1px solid rgba(245,196,81,.35);background:rgba(0,0,0,.35);color:#fff;font:800 18px/1 ui-monospace,monospace;text-align:center;letter-spacing:3px;direction:ltr}
.c39o .er{min-height:18px;color:#fca5a5;font-size:12.5px}
.c39pv{position:fixed;top:calc(10px + env(safe-area-inset-top));inset-inline:0;margin:auto;width:max-content;z-index:2147483601;background:#7c3aed;color:#fff;font:800 12px var(--f25,system-ui);border-radius:99px;padding:6px 14px;box-shadow:0 8px 24px rgba(124,58,237,.5)}
.c39pv button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:99px;margin-inline-start:8px;padding:2px 10px;font:inherit}
.c39w{position:fixed;inset:0;z-index:2147483500;display:grid;place-items:end center;background:rgba(0,0,0,.6);padding:14px;direction:rtl;font-family:var(--f25,system-ui)}
.c39w .cd{width:min(440px,100%);background:linear-gradient(165deg,#221806,#0b0905);border:1px solid rgba(245,196,81,.45);border-radius:26px;padding:18px 18px 20px;color:#f8f1dc;text-align:center;box-shadow:0 30px 90px -10px #000;animation:c39up .45s cubic-bezier(.2,.9,.2,1)}
.c39w.red .cd{background:linear-gradient(165deg,#2c0a0a,#0b0303);border-color:rgba(248,113,113,.6);animation:c39up .45s cubic-bezier(.2,.9,.2,1),c39pulse 1.6s ease-in-out infinite}
.c39w .c39ring{width:170px;height:170px}.c39w .c39ring .t{font-size:26px}.c39w h3{margin:4px 0;font-size:19px;color:#fff1c1}.c39w.red h3{color:#fecaca}
@keyframes c39up{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
@keyframes c39pulse{0%,100%{box-shadow:0 0 0 0 rgba(248,113,113,.0),0 30px 90px -10px #000}50%{box-shadow:0 0 0 10px rgba(248,113,113,.18),0 30px 90px -10px #000}}
#c39chip{position:fixed;top:calc(8px + env(safe-area-inset-top));inset-inline-start:10px;z-index:2147483400;display:flex;align-items:center;gap:6px;border:1px solid rgba(245,196,81,.45);background:rgba(20,14,4,.92);color:#fde68a;border-radius:99px;padding:6px 12px;font:800 12px var(--f25,system-ui);direction:rtl;box-shadow:0 8px 24px rgba(0,0,0,.4)}
#c39chip i{width:8px;height:8px;border-radius:50%;background:#f59e0b;box-shadow:0 0 0 0 rgba(245,158,11,.7);animation:c39dot 1.6s infinite}@keyframes c39dot{70%{box-shadow:0 0 0 8px rgba(245,158,11,0)}100%{box-shadow:0 0 0 0 rgba(245,158,11,0)}}
#c39nud{position:fixed;inset-inline:12px;top:calc(12px + env(safe-area-inset-top));z-index:2147483300;display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(34,24,6,.97),rgba(10,8,4,.97));border:1px solid rgba(245,196,81,.45);color:#f8f1dc;font:600 13.5px/1.5 var(--f25,system-ui);direction:rtl;box-shadow:0 20px 60px -10px rgba(0,0,0,.7);animation:c39dn .5s cubic-bezier(.2,.9,.2,1)}
#c39nud b{display:block;color:#fff1c1}#c39nud .tx{flex:1;min-width:0}#c39nud .c39b{margin:0;padding:10px 16px;font-size:13px}#c39nud .x{border:0;background:none;color:#a8977a;font-size:20px}
@keyframes c39dn{from{transform:translateY(-120%)}to{transform:none}}
html.lite31 .c39w .cd,html.lite31 #c39nud,html.lite31 #c39chip i{animation:none!important}html.lite31 .c39ring .pr{filter:none;transition:none}`;
    D.head.appendChild(s);
  }

  const SVG = "http://www.w3.org/2000/svg";
  const ICON = {
    lock: "M336 208v-95a80 80 0 00-160 0v95M144 208h224a48 48 0 0148 48v160a48 48 0 01-48 48H144a48 48 0 01-48-48V256a48 48 0 0148-48z",
    shield: "M463.1 112.37C373.68 96.33 336.71 84.45 256 48c-80.71 36.45-117.68 48.33-207.1 64.37C32.7 369.13 240.58 457.79 256 464c15.42-6.21 223.3-94.87 207.1-351.63zM208 208l96 96M304 208l-96 96",
    build: "M393.87 190a32.1 32.1 0 01-45.25 0l-26.57-26.57a32.09 32.09 0 010-45.26L382.19 58a1 1 0 00-.3-1.64c-38.82-16.64-89.15-8.16-121.11 23.57-30.58 30.35-32.32 76-21.12 115.84a31.93 31.93 0 01-9.06 32.08L64 380a48.17 48.17 0 1068 68l153.86-167a31.93 31.93 0 0131.6-9.13c39.54 10.59 84.54 8.6 114.72-21.19 32.49-32 39.5-88.56 23.75-120.93a1 1 0 00-1.6-.26z",
    down: "M176 262.62L256 342l80-79.38M256 330.97V170M256 64C141.31 64 48 157.31 48 272s93.31 208 208 208 208-93.31 208-208S370.69 64 256 64z",
  };
  function icon(name, color) {
    const s = D.createElementNS(SVG, "svg"); s.setAttribute("viewBox", "0 0 512 512"); s.setAttribute("class", "ic");
    const p = D.createElementNS(SVG, "path"); p.setAttribute("d", ICON[name]); p.setAttribute("fill", "none"); p.setAttribute("stroke", color || "#f5c451"); p.setAttribute("stroke-width", "28"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    s.append(p); return s;
  }
  /* حلقة العد التنازلي (SVG) */
  function ring(total, getLeft, label) {
    const w = mk("div", "c39ring"), s = D.createElementNS(SVG, "svg"); s.setAttribute("viewBox", "0 0 200 200");
    const defs = D.createElementNS(SVG, "defs"), g = D.createElementNS(SVG, "linearGradient"); g.id = "c39g"; g.setAttribute("x1", "0"); g.setAttribute("x2", "1");
    [["0", "#fff1c1"], ["0.5", "#f5c451"], ["1", "#d97706"]].forEach(([o, c]) => { const st = D.createElementNS(SVG, "stop"); st.setAttribute("offset", o); st.setAttribute("stop-color", c); g.append(st); });
    defs.append(g); s.append(defs);
    const C = 2 * Math.PI * 88;
    const mkc = (cls) => { const c = D.createElementNS(SVG, "circle"); c.setAttribute("cx", "100"); c.setAttribute("cy", "100"); c.setAttribute("r", "88"); c.setAttribute("fill", "none"); c.setAttribute("stroke-width", "10"); c.setAttribute("class", cls); return c; };
    const tr = mkc("tr"), pr = mkc("pr"); pr.setAttribute("stroke-dasharray", String(C)); s.append(tr, pr);
    const inn = mk("div", "in"), t = mk("div", "t"), l = mk("div", "l", label || "");
    inn.append(t, l); w.append(s, inn);
    w.upd = () => { const left = Math.max(0, getLeft()), p = parts(left), frac = total > 0 ? Math.min(1, left / total) : 0; pr.setAttribute("stroke-dashoffset", String(C * (1 - frac))); t.textContent = (p.d ? p.d + "d " : "") + pad(p.h) + ":" + pad(p.m) + ":" + pad(p.s); return left; };
    w.upd(); return w;
  }

  /* مؤثرات: غبار ذهبي / شرر إنذار (مقفولة في lite) */
  function fx(host, kind) {
    if (lite() || !(cur && cur.flags ? cur.flags.fx !== false : true)) return () => {};
    const cv = mk("canvas", "fx"); host.prepend(cv); const x = cv.getContext("2d"); if (!x) return () => {};
    const dpr = Math.min(2, W.devicePixelRatio || 1); let w = 0, h = 0, raf = 0, alive = true;
    const rs = () => { w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; }; rs(); W.addEventListener("resize", rs);
    const col = kind === "kill" ? [248, 113, 113] : kind === "maint" ? [56, 189, 248] : [245, 196, 81];
    const P = Array.from({ length: 70 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 2 + .6) * dpr, v: (Math.random() * .5 + .15) * dpr, a: Math.random() * Math.PI * 2 }));
    const step = () => {
      if (!alive) return; x.clearRect(0, 0, w, h);
      for (const p of P) { p.y -= p.v; p.a += .02; p.x += Math.sin(p.a) * .4 * dpr; if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        x.beginPath(); x.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${.25 + .35 * Math.abs(Math.sin(p.a))})`; x.arc(p.x, p.y, p.r, 0, 7); x.fill(); }
      raf = requestAnimationFrame(step);
    }; step();
    return () => { alive = false; cancelAnimationFrame(raf); W.removeEventListener("resize", rs); cv.remove(); };
  }

  /* ---------- الشاشات ---------- */
  function closeAll(keepChip) {
    ["c39o", "c39w", "c39nud", "c39pvb"].forEach((id) => { const e = D.getElementById(id); if (e) e.remove(); });
    if (!keepChip) { const c = D.getElementById("c39chip"); if (c) c.remove(); }
    if (fxStop) { fxStop(); fxStop = null; } clearInterval(tick); tick = 0;
  }
  function pvBadge() { if (!preview) return; const b = mk("div", "c39pv", "معاينة — مش بتأثر على حد"); b.id = "c39pvb"; const x = mk("button", null, "اقفل"); x.onclick = () => { preview = false; closeAll(); apply(); }; b.append(x); D.body.append(b); }
  const dlUrl = (d) => (okUrl(d.url) ? d.url : SITE + "/download/");

  function full(d) {
    css(); closeAll(); const kind = d.act === "kill" ? "kill" : d.act === "maint" ? "maint" : "force";
    const o = mk("div", "c39o " + kind); o.id = "c39o"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    const c = mk("div", "cd");
    if (kind === "maint") {
      const total = d.until ? Math.max(60e3, d.until - (d.set || now() - 3600e3)) : 0;
      if (d.until) { const r = ring(total, () => d.until - now(), "على ما نرجع"); c.append(r); tick = setInterval(() => { if (r.upd() <= 0) { clearInterval(tick); check(true); } }, 1000); }
      else { const r = mk("div", "c39ring"); r.append(icon("build", "#38bdf8")); c.append(r); }
      c.append(mk("h2", null, "صيانة سريعة"), mk("p", null, NAME + " " + (B.vn || "") + " بيتحسّن دلوقتي. بياناتك محفوظة ومش هتضيع."));
    } else if (kind === "kill") {
      const r = mk("div", "c39ring"); r.append(icon("shield", "#f87171")); c.append(r);
      c.append(mk("h2", null, "النسخة دي اتوقفت"), mk("p", null, "إصدار " + (B.vn || "") + " اتوقف للأمان. نزّل " + NAME + " " + (d.latestVn || "") + " من الموقع الرسمي، وبياناتك زي ما هي."));
    } else {
      const r = mk("div", "c39ring"); r.append(icon("lock")); c.append(r);
      c.append(mk("h2", null, "لازم تحدّث عشان تكمّل"), mk("p", null, "خلصت مهلة التحديث لإصدار " + (B.vn || "") + ". الإصدار " + (d.latestVn || "") + " جاهز ومستنيك."));
    }
    if (d.msg) c.append(mk("div", "msg", d.msg));
    if (kind !== "maint") { const go = mk("button", "c39b", "حمّل التحديث"); go.prepend(icon("down", kind === "kill" ? "#fff" : "#1a1205")); go.firstChild.style.cssText = "width:20px;height:20px"; go.onclick = () => { hap("medium"); open(dlUrl(d)); }; c.append(go); }
    const re = mk("button", "c39g", kind === "maint" ? "جرّب تاني" : "حدّثت خلاص؟ اتأكد"); re.onclick = () => { re.textContent = "بنتأكد…"; check(true).then(() => { re.textContent = "جرّب تاني"; }); }; c.append(re);
    if (kind !== "maint") { c.append(codeBox()); const sp = mk("button", "c39g", "اطلب كود من دعم سعراتي AI"); sp.onclick = () => open(SITE + "/support/?app=" + APP + "&vn=" + encodeURIComponent(B.vn || "")); c.append(sp); }
    o.append(c); D.body.append(o); fxStop = fx(o, kind); hap("heavy"); pvBadge();
  }
  function codeBox() {
    const pw = mk("div", "pw"); pw.append(mk("div", null, "معاك كلمة سر من الإدارة؟"));
    const inp = mk("input"); inp.placeholder = "XXXXX-XXXXX"; inp.maxLength = 13; inp.autocomplete = "off"; inp.spellcheck = false;
    const er = mk("div", "er"), ub = mk("button", "c39g", "افتح النسخة دي");
    ub.onclick = async () => {
      if (preview) { er.textContent = "ده في المعاينة بس"; return; }
      const code = inp.value.trim(); if (code.replace(/[^A-Za-z0-9]/g, "").length !== 10) { er.textContent = "كلمة السر 10 حروف وأرقام"; return; }
      ub.disabled = true; er.textContent = "بنتحقق…";
      try {
        const r = await fetch(HOST + "f37/unlock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, app: APP, vc: VC, did }) });
        const j = await r.json().catch(() => ({}));
        if (j.ok && j.until) { LS.s("s37_unlock", { vc: VC, until: j.until }); closeAll(); hap("success"); apply(); }
        else er.textContent = ({ bad_code: "كلمة السر غلط", expired: "كلمة السر انتهت", used_up: "اتستخدمت قبل كده", wrong_app: "لتطبيق تاني", wrong_version: "لنسخة تانية", rate_limited: "محاولات كتير، استنى 10 دقايق" })[j.error] || "حصلت مشكلة";
      } catch (e) { er.textContent = "محتاج نت"; }
      ub.disabled = false;
    };
    pw.append(inp, ub, er); return pw;
  }
  function warn(d) {
    css(); const left = d.at - now(); const red = left <= 3600e3;
    // الشارة دايمًا
    let chip = D.getElementById("c39chip");
    if (!chip) { chip = mk("button"); chip.id = "c39chip"; chip.onclick = () => warnModal(d, true); D.body.append(chip); }
    chip.replaceChildren(mk("i"), mk("span", null, "تحديث إجباري خلال " + human(left)));
    clearInterval(tick); tick = setInterval(() => { const l = d.at - now(); if (l <= 0) { clearInterval(tick); return apply(); } const sp = chip.querySelector("span"); if (sp) sp.textContent = "تحديث إجباري خلال " + human(l); const m = D.getElementById("c39w"); if (m && m.ring) m.ring.upd(); if (l <= 600e3 && !m) warnModal(d, true); }, 1000);
    // النافذة حسب القرب: ≤10د كل مرة، ≤1س كل فتح، ≤24س كل 6 ساعات، أبعد: الشارة بس
    const sn = LS.g(KS, {}), key = "w" + d.at, gap = left <= 600e3 ? 0 : red ? 15 * 60e3 : left <= 864e5 ? 6 * 3600e3 : Infinity;
    if (preview || (gap !== Infinity && (!sn[key] || Date.now() - sn[key] > gap))) warnModal(d, false);
  }
  function warnModal(d, force) {
    if (D.getElementById("c39w")) return; css();
    const left = d.at - now(), red = left <= 3600e3, alarm = left <= 600e3;
    const o = mk("div", "c39w" + (red ? " red" : "")); o.id = "c39w";
    const c = mk("div", "cd"); const total = Math.max(left, Math.min(72 * 3600e3, d.at - (d.set || now() - 864e5)));
    const r = ring(total, () => d.at - now(), "على القفل"); o.ring = r;
    c.append(r, mk("h3", null, alarm ? "⚠️ باقي دقايق على قفل النسخة دي" : red ? "النسخة دي هتتقفل خلال ساعة" : "تحديث مهم لـ " + NAME),
      mk("p", null, "إصدارك " + (B.vn || "") + " هيتقفل بعد " + human(left) + " (بتوقيت السيرفر). التحديث بياخد دقيقة وبياناتك محفوظة."));
    if (d.msg) c.append(mk("div", "msg", d.msg));
    const go = mk("button", "c39b", "حدّث دلوقتي"); go.onclick = () => { hap("medium"); open(dlUrl(d)); };
    const later = mk("button", "c39g", alarm ? "ماشي" : "فكّرني بعدين"); later.onclick = () => { const sn = LS.g(KS, {}); sn["w" + d.at] = Date.now(); LS.s(KS, sn); o.remove(); };
    c.append(go, later); o.append(c); o.onclick = (e) => { if (e.target === o && !alarm) later.click(); };
    D.body.append(o); hap(alarm ? "heavy" : "medium"); if (alarm && !lite()) { fxStop && fxStop(); fxStop = fx(o, "kill"); }
    void force;
  }
  function nudge(d) {
    css(); if (D.getElementById("c39nud")) return;
    const sn = LS.g(KS, {}), key = "n" + VC + (d.msg || "").length; if (!preview && sn[key] && Date.now() - sn[key] < 12 * 3600e3) return;
    const e = mk("div"); e.id = "c39nud"; e.setAttribute("role", "status");
    const tx = mk("div", "tx"); tx.append(mk("b", null, d.latestVn ? "نزل " + NAME + " " + d.latestVn : "فيه تحديث مهم"), mk("span", null, d.msg || "حدّث عشان تاخد أحسن نسخة وأأمنها."));
    const go = mk("button", "c39b", "حدّث"); go.onclick = () => open(dlUrl(d));
    const x = mk("button", "x", "×"); x.setAttribute("aria-label", "بعدين"); x.onclick = () => { const s2 = LS.g(KS, {}); s2[key] = Date.now(); LS.s(KS, s2); e.remove(); };
    const ic = mk("div"); ic.append(icon("down")); ic.firstChild.style.cssText = "width:34px;height:34px";
    e.append(ic, tx, go, x); D.body.append(e); hap(); pvBadge();
  }

  /* ---------- إشعارات ذكية ---------- */
  function quiet(t, f) { const h = new Date(t).getHours(), a = +f.quietFrom, b = +f.quietTo; return a === b ? false : a < b ? h >= a && h < b : h >= a || h < b; }
  function shiftOut(t, f) { // قبل ساعات الهدوء: نقدّمه لآخر نص ساعة قبلها
    if (!quiet(t, f)) return t; const d = new Date(t); if (d.getHours() < +f.quietTo) d.setDate(d.getDate() - 1); d.setHours(+f.quietFrom - 1, 30, 0, 0); return +d;
  }
  function wakeAt(t, f) { if (!quiet(t, f)) return t; const d = new Date(t); if (d.getHours() >= +f.quietFrom) d.setDate(d.getDate() + 1); d.setHours(+f.quietTo, 0, 0, 0); return +d; }
  function notify(d) {
    const N = W.NOTIF37; if (!N || !N.available || !N.available()) return;
    const f = d.flags || { quietFrom: 23, quietTo: 8 };
    if (!f.notify || !["warn", "maint", "force", "kill"].includes(d.act) || preview) { if (localStorage.getItem(KN)) { N.clear("c39"); localStorage.removeItem(KN); } return; }
    const sig = [d.act, d.at || 0, d.until || 0, VC, d.rev].join("|"); if (localStorage.getItem(KN) === JSON.stringify(sig)) return;
    const local = (t) => t - ((cur && cur.skew) || 0), T = Date.now() + 30e3, L = [];
    if (d.act === "warn") {
      const at = local(d.at);
      [[864e5, "بكرة النسخة دي هتتقفل", "حدّث " + NAME + " من الموقع الرسمي قبل بكرة. بياناتك محفوظة."], [3600e3, "ساعة واحدة على القفل", "النسخة القديمة هتتقفل خلال ساعة. التحديث بياخد دقيقة."]].forEach(([b, t, x]) => { const w = shiftOut(at - b, f); if (w > T && w < at - 9 * 60e3) L.push({ at: w, title: "⏳ " + t, text: x }); });
      if (at - 600e3 > T && !quiet(at - 600e3, f)) L.push({ at: at - 600e3, title: "⚠️ 10 دقايق على قفل " + NAME, text: "حدّث دلوقتي عشان ماتتقطعش." });
      L.push({ at: Math.max(T, wakeAt(at, f)), title: "🔒 " + NAME + " محتاج تحديث", text: "النسخة القديمة اتقفلت. افتح التطبيق وحمّل التحديث." });
    } else if (d.act === "maint" && d.until) L.push({ at: Math.max(T, wakeAt(local(d.until) + 60e3, f)), title: "✅ " + NAME + " رجع", text: "الصيانة خلصت. ادخل كمّل يومك." });
    else if (d.act === "force" || d.act === "kill") L.push({ at: Math.max(T, wakeAt(Date.now() + 6 * 3600e3, f)), title: "🔔 لازم تحدّث " + NAME, text: "النسخة دي متوقفة. التحديث من الموقع الرسمي وبياناتك محفوظة." });
    if (N.group("c39", L)) localStorage.setItem(KN, JSON.stringify(sig));
  }

  /* ---------- التطبيق ---------- */
  function apply() {
    if (preview) return;
    const d = cur; if (!d || !VC) return closeAll();
    const u = LS.g("s37_unlock", null), unlocked = u && u.vc === VC && u.until > now();
    // الطرح التدريجي: لو جهازك برّه النسبة، نخبي شريط sync35
    if (d.held && d.latestVc) LS.s("s35_sync_later", { vc: d.latestVc, at: Date.now() });
    const lockAct = ["kill", "force", "maint"].includes(d.act);
    if (lockAct && !d.verified && !d.fresh) return closeAll(); // قفل من كاش مش موقّع؟ لا.
    if (d.act === "maint" && d.until && d.until <= now()) { closeAll(); return check(true); }
    if ((d.act === "kill" || d.act === "force") && unlocked) { closeAll(); return; }
    notify(d);
    if (lockAct) { if (!D.getElementById("c39o")) full(d); return; }
    if (D.getElementById("c39o")) closeAll();
    if (d.act !== "warn") { ["c39w", "c39chip"].forEach((id) => { const e = D.getElementById(id); if (e) e.remove(); }); clearInterval(tick); tick = 0; }
    if (d.act !== "nudge") { const e = D.getElementById("c39nud"); if (e) e.remove(); }
    if (d.act === "warn") return warn(d);
    const ch = D.getElementById("c39chip"); if (ch) ch.remove();
    if (d.act === "nudge") return nudge(d);
  }
  async function check(force) {
    if (!force && Date.now() - lastCheck < 20 * 60e3) { apply(); return cur; } lastCheck = Date.now();
    try {
      const t0 = Date.now();
      const r = await fetch(API + "/boot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ app: APP, vc: VC, did, ch: localStorage.getItem("s39_ch") || "stable" }) });
      if (r.ok) {
        const j = await r.json(), t1 = Date.now(); const d = JSON.parse(j.payload || "{}");
        d.skew = (+j.now || +d.now || t1) - Math.round((t0 + t1) / 2); d.verified = await verify(j.payload, j.sig); d.fresh = true; d.recv = t1;
        if (d.app === APP && d.vc === VC) { cur = d; LS.s(KD, { payload: j.payload, sig: j.sig, skew: d.skew, recv: t1 }); }
      } else W.C39.err = "http " + r.status;
    } catch (e) { W.C39.err = String(e && e.message || e); }
    W.C39.last = cur; apply(); return cur;
  }
  async function loadCached() {
    const c = LS.g(KD, null); if (!c || !c.payload) return;
    try { const d = JSON.parse(c.payload); if (d.app !== APP || d.vc !== VC) return; d.skew = +c.skew || 0; d.verified = await verify(c.payload, c.sig); d.fresh = false; cur = d; } catch (e) {}
  }

  /* بوابة السيرفر: _sv على طلبات الوكيل + التعامل مع 426 */
  try {
    const _f = W.fetch && W.fetch.bind(W);
    if (_f) W.fetch = function (input, init) {
      try {
        if (typeof input === "string" && input.indexOf(HOST) === 0 && /\/v1\/app\/(c4|l38|r31)\//.test(input) && input.indexOf("_sv=") < 0)
          input += (input.indexOf("?") < 0 ? "?" : "&") + "_sv=" + APP + "." + VC;
      } catch (e) {}
      const p = _f(input, init);
      return p.then((res) => { try { if (res && res.status === 426 && typeof input === "string" && input.indexOf(HOST) === 0) setTimeout(() => check(true), 50); } catch (e) {} return res; });
    };
  } catch (e) {}

  W.C39 = {
    check: () => check(true), state: () => cur, close: () => { preview = false; closeAll(); apply(); },
    /** معاينة الشاشات من غير أي تأثير: act = nudge | warn | force | kill | maint */
    preview(act, o) {
      o = o || {}; preview = true; closeAll(); css();
      const base = { act, latestVn: o.latestVn || "39.1", url: SITE + "/download/", msg: o.msg || "", flags: { fx: true, notify: false }, at: now() + (o.left != null ? o.left : 3600e3 * 5), set: now() - 864e5, until: now() + (o.left != null ? o.left : 25 * 60e3) };
      if (act === "warn") { warnModal(base, true); pvBadge(); } else if (act === "nudge") nudge(base); else full(base);
      return true;
    },
  };
  const start = async () => { await loadCached(); apply(); setTimeout(() => check(true), 1800); setInterval(() => check(true), 30 * 60e3); setInterval(apply, 60e3); D.addEventListener("visibilitychange", () => { if (!D.hidden) check(false); }); };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
})();
