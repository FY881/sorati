/* سعراتي v30 — «مركز القوة»: عشر ترقيات كبيرة فوق التطبيق (من غير ما نلمس الكود الأصلي)
   1) حرقك الحقيقي (TDEE متكيّف) [بريميوم]   2) منحنى الوزن الذكي + توقّع الوصول
   3) وضع رمضان (مواقيت فلكية - الهيئة المصرية 19.5°/17.5°) + خطة المية + قوالب + W.V30.ramadan() لمحرك الإشعارات
   4) الصيام المتقطع (حلقة + مراحل الجسم + سجل وستريك)   5) دوّر على أكل غني بـ (لكل 100 سعرة)
   6) أهداف حسب يوم الأسبوع + ميزانية أسبوعية بترحيل [بريميوم]   7) وضع السكر   8) تقرير للدكتور
   9) خطة بميزانية (أسعار مصرية تقريبية 2026)   10) تقرير المدرب الأسبوعي
   إيقاف أي جزء: localStorage sp30_off = "tdee,trend,ramadan,fast,boost,week,sugar,report,budget,coach,fab,homecard"
   ملاحظة: كل ده معلومات عامة، مش نصيحة طبية. */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.V30 || !(W.BUILD && BUILD.app !== "admin")) return;
  const OFF = new Set((localStorage.getItem("sp30_off") || "").split(",").map((s) => s.trim()).filter(Boolean));
  const on = (k) => !OFF.has(k);
  const RM = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

  /* ================= أدوات عامة ================= */
  const EXTRA_ICONS = {
    gem30: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>',
    flame30: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7z"/>',
    trend30: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    moon30: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/><path d="M17 3l.6 1.4L19 5l-1.4.6L17 7l-.6-1.4L15 5l1.4-.6z"/>',
    clock30: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    leaf30: '<path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15z"/><path d="M5 19 13 11"/>',
    week30: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2"/>',
    drop30: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/><path d="M9 15h6M12 12v6"/>',
    doc30: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
    wallet30: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/><path d="M6 6l9-3 1 3"/>',
    medal30: '<circle cx="12" cy="15" r="6"/><path d="M8 3l4 6 4-6M12 12l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2L9 14h2z"/>',
    crown30: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    lock30: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    back30: '<path d="M9 6l6 6-6 6"/>',
    x30: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus30: '<path d="M12 5v14M5 12h14"/>',
    check30: '<path d="M5 12l5 5 9-10"/>',
    pin30: '<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    print30: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>',
    share30: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    cart30: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',
    alert30: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    search30: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
  };
  try { if (typeof ICONS !== "undefined") for (const [k, v] of Object.entries(EXTRA_ICONS)) if (!ICONS[k]) ICONS[k] = v; } catch (e) {}
  const el = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ic = (n, s) => {
    const sp = el("span", "v30-i");
    const path = (typeof ICONS !== "undefined" && ICONS[n]) || EXTRA_ICONS[n];
    if (path) { const t = D.createElement("template"); t.innerHTML = '<svg viewBox="0 0 24 24">' + path + "</svg>"; sp.append(t.content.firstChild); }
    if (s) sp.style.fontSize = s + "px";
    return sp;
  };
  const say = (m, i) => { try { toast(m, i || "info"); } catch (e) {} };
  const hap = (ms) => { try { W.Android && Android.haptic && Android.haptic(ms || 12); } catch (e) {} };
  const call = (n, ...a) => { try { const f = W[n] || (n === "needPro" && typeof needPro === "function" ? needPro : n === "refreshTab" && typeof refreshTab === "function" ? refreshTab : null); return typeof f === "function" ? f(...a) : undefined; } catch (e) {} };
  const nf = (n, d) => { const v = +n || 0; return v.toLocaleString("ar-EG", { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 }); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ld = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const pad = (n) => String(n).padStart(2, "0");
  const dk = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const dayKey = (d) => { try { return typeof dkey === "function" ? dkey(d) : dk(d); } catch (e) { return dk(d); } };
  const parseK = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const st = () => { try { return typeof S !== "undefined" && S ? S : {}; } catch (e) { return {}; } };
  const prof = () => st().profile || null;
  const getD = (k) => { try { return typeof getDay === "function" ? getDay(k) : ld("sp_day_" + k, { items: [], water: 0 }); } catch (e) { return { items: [], water: 0 }; } };
  const sumD = (d) => (d.items || []).reduce((a, i) => { const q = +i.q || 1; a.k += (+i.k || 0) * q; a.p += (+i.p || 0) * q; a.c += (+i.c || 0) * q; a.f += (+i.f || 0) * q; return a; }, { k: 0, p: 0, c: 0, f: 0 });
  const TG = () => { try { if (typeof targets === "function") return targets(); } catch (e) {} return { kcal: 2000, p: 100, c: 250, f: 65, bmr: 0, tdee: 0, none: true }; };
  const premium = () => { try { if (typeof tier === "function") return tier() !== "free"; } catch (e) {} try { return typeof isPro === "function" && !!isPro(); } catch (e) {} return false; };
  const saveS = () => { try { typeof save === "function" && save(); } catch (e) {} };
  const foodsAll = () => { try { if (typeof allFoods === "function") return allFoods(); } catch (e) {} try { return typeof FOODS !== "undefined" ? FOODS : []; } catch (e) { return []; } };
  const norm = (s) => String(s || "").replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim().toLowerCase();
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const sd = (a) => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  const hm = (h) => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { H = (H + 1) % 24; M = 0; } return pad(H) + ":" + pad(M); };
  const hmAr = (h) => { const [H, M] = hm(h).split(":").map(Number); const d = new Date(); d.setHours(H, M, 0, 0); return d.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" }); };
  const dateAr = (d, o) => d.toLocaleDateString("ar-EG", o || { weekday: "long", day: "numeric", month: "short" });
  function logFood(f, q, m) {
    try {
      const k = dayKey(new Date()), d = getD(k);
      d.items = d.items || [];
      d.items.push({ id: f.id || "v30" + Date.now(), n: f.n, sv: f.sv || "حصة", cat: f.cat || "", k: +f.k || 0, p: +f.p || 0, c: +f.c || 0, f: +f.f || 0, q: +q || 1, m: m || "s", t: Date.now() });
      if (typeof putDay === "function") putDay(k, d); else localStorage.setItem("sp_day_" + k, JSON.stringify(d));
      call("refreshTab"); return true;
    } catch (e) { return false; }
  }

  /* ================= الستايل ================= */
  const css = `
.v30{--em:#10b981;--em2:#34d399;--gd:#f5c76b;--gd2:#fde68a;--ink:#e9fff6;--mut:rgba(233,255,246,.62);--line:rgba(255,255,255,.08);
 direction:rtl;color:var(--ink);background:radial-gradient(700px 380px at 85% -10%,rgba(245,199,107,.14),transparent 60%),radial-gradient(600px 400px at 0% 0%,rgba(16,185,129,.16),transparent 60%),linear-gradient(180deg,#07130f,#04080a);
 border-radius:24px;padding:16px 14px 20px;margin:-4px -2px 0;min-height:60vh;font-size:14px;line-height:1.65}
.v30 *{box-sizing:border-box}
.v30 .v30-i{display:inline-flex;width:1.15em;height:1.15em;flex:none}.v30 .v30-i svg,.v30fab .v30-i svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.v30-hd{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.v30-hd h2{margin:0;font-size:20px;flex:1;display:flex;align-items:center;gap:8px;background:linear-gradient(90deg,var(--gd2),var(--gd),var(--em2));-webkit-background-clip:text;background-clip:text;color:transparent}
.v30-hd h2 .v30-i{color:var(--gd)}
.v30-ib{border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--ink);width:38px;height:38px;border-radius:13px;display:grid;place-items:center;font:inherit;font-size:18px;cursor:pointer}
.v30-sub{color:var(--mut);font-size:12.5px;margin:-6px 0 12px}
.v30-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:520px){.v30-grid{grid-template-columns:repeat(3,1fr)}}
.v30-tile{position:relative;border:1px solid var(--line);border-radius:20px;padding:14px 12px 12px;text-align:start;color:var(--ink);font:inherit;cursor:pointer;
 background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.015));min-height:112px;display:flex;flex-direction:column;gap:6px;overflow:hidden;
 opacity:0;transform:translateY(10px) scale(.98);animation:v30in .5s cubic-bezier(.2,.8,.2,1) forwards;transition:transform .2s,border-color .2s}
.v30-tile:active{transform:scale(.97)}
.v30-tile .v30-ti{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;font-size:21px;color:#04130d;background:linear-gradient(135deg,var(--em2),var(--em));box-shadow:0 6px 18px rgba(16,185,129,.28)}
.v30-tile.pm .v30-ti{background:linear-gradient(135deg,var(--gd2),var(--gd));box-shadow:0 6px 18px rgba(245,199,107,.3)}
.v30-tile b{font-size:14.5px}.v30-tile small{color:var(--mut);font-size:11.5px;line-height:1.5}
.v30-tile .v30-cr{position:absolute;top:10px;inset-inline-end:10px;color:var(--gd);font-size:16px;filter:drop-shadow(0 0 6px rgba(245,199,107,.6))}
.v30-tile .v30-badge{position:absolute;top:10px;inset-inline-end:34px;background:#ef4444;color:#fff;border-radius:10px;font-size:10px;padding:1px 6px;font-weight:800}
.v30-tile::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.07) 50%,transparent 70%);transform:translateX(120%);animation:v30sh 5s ease-in-out infinite}
.v30-card{border:1px solid var(--line);border-radius:20px;padding:14px;background:rgba(255,255,255,.035);margin-bottom:12px;animation:v30in .45s cubic-bezier(.2,.8,.2,1) both}
.v30-card.gold{border-color:rgba(245,199,107,.35);background:linear-gradient(150deg,rgba(245,199,107,.12),rgba(16,185,129,.05))}
.v30-card h4{margin:0 0 8px;font-size:15px;display:flex;align-items:center;gap:6px}
.v30-big{font-size:38px;font-weight:800;line-height:1.1;letter-spacing:-.5px}
.v30-big small{font-size:14px;font-weight:600;color:var(--mut)}
.v30-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.v30-sp{flex:1}
.v30-mut{color:var(--mut);font-size:12.5px}
.v30-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.v30-kpi{background:rgba(0,0,0,.25);border-radius:14px;padding:10px 8px;text-align:center}
.v30-kpi b{display:block;font-size:18px}.v30-kpi span{font-size:11px;color:var(--mut)}
.v30-btn{border:0;border-radius:15px;padding:12px 16px;font:inherit;font-weight:800;cursor:pointer;background:linear-gradient(135deg,var(--em2),var(--em));color:#03140d;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.v30-btn.gold{background:linear-gradient(135deg,var(--gd2),var(--gd));color:#2a1a00}
.v30-btn.sec{background:rgba(255,255,255,.07);color:var(--ink);border:1px solid var(--line)}
.v30-btn.red{background:rgba(239,68,68,.16);color:#fca5a5}
.v30-btn.wide{width:100%}
.v30-btn:disabled{opacity:.45}
.v30-chips{display:flex;gap:6px;flex-wrap:wrap}
.v30-chip{border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--ink);border-radius:999px;padding:7px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
.v30-chip.on{background:linear-gradient(135deg,var(--gd2),var(--gd));color:#2a1a00;border-color:transparent}
.v30-in{width:100%;border:1px solid var(--line);background:rgba(0,0,0,.3);color:var(--ink);border-radius:14px;padding:11px 12px;font:inherit;font-size:16px}
.v30-in:focus{outline:2px solid rgba(16,185,129,.5)}
.v30 select.v30-in{appearance:auto}
.v30 canvas{display:block;width:100%}
.v30-li{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}
.v30-li:last-child{border-bottom:0}
.v30-li .n{flex:1;min-width:0}.v30-li .n b{display:block;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v30-li .n small{color:var(--mut);font-size:11.5px}
.v30-bar{height:7px;border-radius:7px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:5px}
.v30-bar i{display:block;height:100%;border-radius:7px;background:linear-gradient(90deg,var(--em),var(--gd));width:0;transition:width .8s cubic-bezier(.2,.8,.2,1)}
.v30-note{font-size:11.5px;color:var(--mut);border-inline-start:3px solid rgba(245,199,107,.5);padding:4px 10px;margin:8px 0;line-height:1.7}
.v30-warn{border-radius:14px;padding:10px 12px;margin:8px 0;font-weight:700;display:flex;gap:8px;align-items:flex-start}
.v30-warn.lo{background:rgba(239,68,68,.15);color:#fecaca}.v30-warn.hi{background:rgba(251,146,60,.15);color:#fed7aa}.v30-warn.ok{background:rgba(16,185,129,.14);color:#a7f3d0}
.v30-tbl{width:100%;border-collapse:collapse;font-size:12.5px}.v30-tbl td,.v30-tbl th{padding:7px 4px;border-bottom:1px solid var(--line);text-align:start}.v30-tbl th{color:var(--mut);font-weight:600}
.v30-rng{width:100%;accent-color:#f5c76b}
.v30-lock{text-align:center;padding:26px 10px}
.v30-lock .v30-i{font-size:44px;color:var(--gd);filter:drop-shadow(0 0 14px rgba(245,199,107,.5))}
.v30-stage{display:flex;gap:10px;align-items:flex-start;padding:8px 0;opacity:.45;transition:opacity .4s}
.v30-stage.on{opacity:1}.v30-stage.now b{color:var(--gd)}
.v30-stage .dot{width:12px;height:12px;border-radius:50%;margin-top:5px;background:rgba(255,255,255,.2);flex:none}
.v30-stage.on .dot{background:var(--em);box-shadow:0 0 0 4px rgba(16,185,129,.18)}
.v30-stage.now .dot{background:var(--gd);box-shadow:0 0 0 5px rgba(245,199,107,.2);animation:v30pu 1.6s ease-in-out infinite}
.v30fab{position:fixed;inset-inline-end:14px;bottom:calc(var(--v30fb,104px) + env(safe-area-inset-bottom,0px));z-index:900;width:52px;height:52px;border-radius:18px;border:1px solid rgba(245,199,107,.55);
 background:radial-gradient(circle at 30% 25%,#fde68a,#f5c76b 40%,#b7832a);color:#2a1a00;display:grid;place-items:center;font-size:24px;cursor:pointer;touch-action:none;
 box-shadow:0 10px 26px rgba(0,0,0,.45),0 0 0 6px rgba(245,199,107,.12);animation:v30fl 4s ease-in-out infinite}
.v30fab .v30-i{display:inline-flex;width:1em;height:1em}
.v30fab .v30-dot{position:absolute;top:-3px;inset-inline-start:-3px;width:12px;height:12px;border-radius:50%;background:#10b981;border:2px solid #04080a}
.v30hc{border-radius:22px;margin:14px 16px;padding:14px 16px;color:#e9fff6;direction:rtl;background:linear-gradient(135deg,#052e22,#0b1d18 60%,#2a1f07);border:1px solid rgba(245,199,107,.35);display:flex;align-items:center;gap:12px;cursor:pointer}
.v30hc .v30-i{font-size:26px;color:#f5c76b;display:inline-flex;width:1em;height:1em}.v30hc .v30-i svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8}
.v30hc b{font-size:15px}.v30hc small{display:block;opacity:.7;font-size:12px}.v30hc .t{font-size:22px;font-weight:800;color:#fde68a;margin-inline-start:auto;direction:ltr}
@keyframes v30in{to{opacity:1;transform:none}}
@keyframes v30sh{0%,70%{transform:translateX(120%)}100%{transform:translateX(-120%)}}
@keyframes v30pu{50%{box-shadow:0 0 0 9px rgba(245,199,107,.05)}}
@keyframes v30fl{50%{transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){.v30-tile,.v30-card{animation:none;opacity:1;transform:none}.v30-tile::after,.v30fab{animation:none}.v30-bar i{transition:none}.v30-stage.now .dot{animation:none}}
`;
  const stl = el("style"); stl.id = "v30css"; stl.textContent = css; (D.head || D.documentElement).append(stl);

  /* ================= الشيت والتنقل ================= */
  let ROOT = null;
  function sheet() {
    try { openM(""); } catch (e) { return null; }
    const sh = D.getElementById("sheet"); if (!sh) return null;
    ROOT = el("div", "v30"); sh.append(ROOT); return ROOT;
  }
  function header(title, iconName, back) {
    const h = el("div", "v30-hd");
    if (back) { const b = el("button", "v30-ib"); b.setAttribute("aria-label", "رجوع"); b.append(ic("back30")); b.onclick = () => { hap(); hub(true); }; h.append(b); }
    const t = el("h2"); if (iconName) t.append(ic(iconName)); t.append(el("span", null, title)); h.append(t);
    const x = el("button", "v30-ib"); x.setAttribute("aria-label", "قفل"); x.append(ic("x30")); x.onclick = () => { try { closeM(); } catch (e) {} }; h.append(x);
    return h;
  }
  function view(title, iconName, sub, build) {
    if (!ROOT || !ROOT.isConnected) sheet(); if (!ROOT) return;
    ROOT.replaceChildren(header(title, iconName, true)); if (sub) ROOT.append(el("div", "v30-sub", sub));
    try { build(ROOT); } catch (e) { ROOT.append(el("div", "v30-warn hi", "حصلت مشكلة صغيرة في العرض. جرّب تاني.")); try { console.error(e); } catch (_) {} }
    try { const sh = D.getElementById("sheet"); sh && (sh.scrollTop = 0); } catch (e) {}
  }
  const card = (title, iconName, cls) => { const c = el("div", "v30-card" + (cls ? " " + cls : "")); if (title) { const h = el("h4"); if (iconName) h.append(ic(iconName)); h.append(el("span", null, title)); c.append(h); } return c; };
  const kpi = (v, l) => { const k = el("div", "v30-kpi"); k.append(el("b", null, v), el("span", null, l)); return k; };
  const btn = (txt, cls, fn, iconName) => { const b = el("button", "v30-btn" + (cls ? " " + cls : "")); if (iconName) b.append(ic(iconName)); b.append(el("span", null, txt)); b.onclick = (e) => { hap(); fn && fn(e); }; return b; };
  const chips = (opts, cur, fn) => { const w = el("div", "v30-chips"); opts.forEach(([v, l]) => { const c = el("button", "v30-chip" + (v === cur ? " on" : ""), l); c.onclick = () => { hap(); w.querySelectorAll(".v30-chip").forEach((x) => x.classList.remove("on")); c.classList.add("on"); fn(v); }; w.append(c); }); return w; };
  const bar = (pct) => { const b = el("div", "v30-bar"), i = el("i"); b.append(i); requestAnimationFrame(() => requestAnimationFrame(() => { i.style.width = clamp(pct, 0, 100) + "%"; })); return b; };
  function lockView(what) {
    const c = el("div", "v30-lock"); c.append(ic("crown30"), el("h3", null, "الميزة دي في بريميوم"), el("p", "v30-mut", what));
    c.append(btn("افتح بريميوم", "gold wide", () => { try { closeM(); } catch (e) {} setTimeout(() => call("needPro", what), 200); }, "crown30"));
    return c;
  }
  /* canvas بدقة الشاشة ويعيد الرسم مع تغيير المقاس */
  function canvas(h, draw) {
    const c = el("canvas"); c.style.height = h + "px"; c.setAttribute("role", "img");
    const paint = () => { if (!c.isConnected) return; const r = c.getBoundingClientRect(), dpr = Math.min(3, W.devicePixelRatio || 1); const w = Math.max(200, r.width || 320); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h); x.font = "11px system-ui, sans-serif"; try { draw(x, w, h); } catch (e) {} };
    c._paint = paint; requestAnimationFrame(paint);
    const ro = W.ResizeObserver ? new ResizeObserver(() => paint()) : null; ro && setTimeout(() => ro.observe(c), 0);
    return c;
  }

  /* ================= بيانات مشتركة: الأكل والوزن ================= */
  function intakeSeries(days) {
    const t = new Date(), out = [];
    for (let i = days - 1; i >= 0; i--) { const d = addDays(t, -i), k = dayKey(d), day = getD(k), s = sumD(day); out.push({ k, d, kcal: s.k, p: s.p, c: s.c, f: s.f, n: (day.items || []).length, water: +day.water || 0, steps: +day.steps || 0, items: day.items || [] }); }
    return out;
  }
  /* سلسلة يومية: الأوزان الخام + تعبئة الفجوات خطيًا + EWMA α=0.1 */
  function weightSeries() {
    const raw = (st().weights || []).filter((w) => w && w.d && +w.kg > 25).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
    if (!raw.length) return { days: [], raw: [] };
    const first = parseK(raw[0].d), last = new Date(); last.setHours(0, 0, 0, 0);
    const map = new Map(raw.map((w) => [w.d, +w.kg]));
    const days = []; let trend = mean(raw.slice(0, 3).map((w) => +w.kg)), idx = 0;
    const n = Math.round((last - first) / 864e5) + 1;
    const known = raw.map((w) => ({ i: Math.round((parseK(w.d) - first) / 864e5), kg: +w.kg }));
    for (let i = 0; i < n; i++) {
      const d = addDays(first, i), k = dk(d);
      let v = map.get(k), est = false;
      if (v == null) { while (idx < known.length - 1 && known[idx + 1].i < i) idx++; const a = known[idx], b = known[idx + 1]; if (b && b.i > i && a.i <= i && b.i - a.i <= 14) { v = a.kg + (b.kg - a.kg) * (i - a.i) / (b.i - a.i); est = true; } }
      if (v != null) trend = trend + 0.1 * (v - trend);
      days.push({ k, d, kg: map.has(k) ? map.get(k) : null, fill: v, est, trend });
    }
    return { days, raw };
  }
  function regress(ys) { const n = ys.length; if (n < 2) return { b: 0, a: ys[0] || 0, se: 0 }; const xs = range(n), mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; }); const b = sxy / sxx, a = my - b * mx; const res = ys.map((y, i) => y - (a + b * i)); const s2 = n > 2 ? res.reduce((s, r) => s + r * r, 0) / (n - 2) : 0; return { b, a, se: Math.sqrt(s2 / sxx) }; }

  /* ================= 1) حرقك الحقيقي ================= */
  function tdeeEstimate(endOffset) {
    endOffset = endOffset || 0;
    const p = prof(), tg = TG(); const formula = tg.tdee || tg.kcal || 2000;
    const ws = weightSeries(); const intake = intakeSeries(28 + endOffset).slice(0, 28);
    const minLogged = Math.max(600, (tg.kcal || 2000) * 0.4);
    const end = addDays(new Date(), -endOffset);
    // نستخدم الترند المنعّم (EWMA) بعد ما يسخن ١٤ يوم؛ قبل كده الوزن اليومي المملي عشان تأخير التنعيم ميقللش الميل
    const dayMap = new Map(ws.days.map((x, i) => [x.k, { t: x.trend, f: x.fill, i }]));
    const win = 28, pts = [];
    for (let i = win - 1; i >= 0; i--) { const z = dayMap.get(dayKey(addDays(end, -i))); if (z) pts.push(z); }
    const warm = pts.length && pts[0].i >= 14;
    const tr = warm ? pts.map((z) => z.t) : pts.filter((z) => z.f != null).map((z) => z.f);
    const logged = intake.filter((x) => x.kcal >= minLogged).map((x) => x.kcal);
    const res = { formula: Math.round(formula), n: logged.length, wdays: tr.length, weighins: (ws.raw || []).filter((w) => (end - parseK(w.d)) / 864e5 <= 28 && parseK(w.d) <= end).length, ready: false };
    if (logged.length < 7 || tr.length < 10 || res.weighins < 3) { res.est = Math.round(formula); res.lo = res.est - 250; res.hi = res.est + 250; res.conf = 0; return res; }
    const rg = regress(tr.slice(-Math.min(28, tr.length)));
    const mI = mean(logged), seI = sd(logged) / Math.sqrt(logged.length);
    const raw = mI - rg.b * 7700;
    const se = Math.sqrt((7700 * rg.se) ** 2 + seI ** 2);
    const w = clamp(logged.length / 21, 0.35, 1) * clamp(tr.length / 21, 0.5, 1);
    const est = w * raw + (1 - w) * formula;
    const half = Math.max(60, 1.96 * se * w + (1 - w) * 200);
    Object.assign(res, { ready: true, raw: Math.round(raw), est: Math.round(clamp(est, 1100, 5500)), lo: Math.round(est - half), hi: Math.round(est + half), slopeWk: rg.b * 7, meanIntake: Math.round(mI), conf: clamp(Math.round(100 - (half / Math.max(est, 1)) * 400), 10, 98) });
    return res;
  }
  function tdeeSuggest(e) {
    const p = prof() || {}; const goal = +p.goal || 0; const floor = p.sex === "m" ? 1500 : 1200;
    return Math.round(Math.max(floor, e.est + goal) / 10) * 10;
  }
  function applyTDEE(e) {
    const p = prof(), tg = TG(); if (!p || !tg.bmr) return say("كمّل بياناتك الأول من حسابي", "info");
    const act = clamp(e.est / tg.bmr, 1.1, 2.6); p.act = Math.round(act * 1000) / 1000; saveS();
    const h = ld("sp30_tdee_hist", []); h.push({ at: Date.now(), est: e.est, kcal: TG().kcal }); sv("sp30_tdee_hist", h.slice(-30));
    sv("sp30_tdee_seen", Date.now()); hap(30); say("اتظبط هدفك على " + nf(TG().kcal) + " سعرة", "check"); call("refreshTab");
  }
  function viewTDEE() {
    view("حرقك الحقيقي", "flame30", "بنحسب حرقك من أكلك الفعلي ومنحنى وزنك (زي MacroFactor) — مش من معادلة ثابتة.", (R) => {
      if (!premium()) { R.append(lockView("حساب حرقك الحقيقي من بياناتك واقتراح هدف جديد بضغطة.")); return; }
      const e = tdeeEstimate(), tg = TG(), sug = tdeeSuggest(e);
      const c1 = card(null, null, "gold");
      c1.append(el("div", "v30-mut", "حرقك اليومي المقدّر"));
      const big = el("div", "v30-big"); big.append(el("span", null, nf(e.est) + " "), el("small", null, "سعرة/يوم")); c1.append(big);
      c1.append(el("div", "v30-mut", "المدى المحتمل: " + nf(e.lo) + " – " + nf(e.hi) + (e.ready ? " · ثقة " + nf(e.conf) + "٪" : "")));
      c1.append(canvas(64, (x, w, h) => {
        const lo = Math.min(e.lo, e.formula, tg.kcal) - 150, hi = Math.max(e.hi, e.formula, tg.kcal) + 150, X = (v) => 10 + (v - lo) / (hi - lo) * (w - 20);
        x.fillStyle = "rgba(255,255,255,.07)"; x.fillRect(10, 26, w - 20, 10);
        const g = x.createLinearGradient(X(e.lo), 0, X(e.hi), 0); g.addColorStop(0, "rgba(16,185,129,.25)"); g.addColorStop(.5, "rgba(245,199,107,.7)"); g.addColorStop(1, "rgba(16,185,129,.25)");
        x.fillStyle = g; x.fillRect(X(e.lo), 24, X(e.hi) - X(e.lo), 14);
        const mark = (v, col, lab, up) => { x.fillStyle = col; x.fillRect(X(v) - 1.5, 18, 3, 26); x.textAlign = "center"; x.fillText(lab, clamp(X(v), 30, w - 30), up ? 12 : 58); };
        mark(e.est, "#fde68a", "الحقيقي " + nf(e.est), true); mark(e.formula, "rgba(233,255,246,.55)", "المعادلة " + nf(e.formula), false);
      }));
      if (!e.ready) {
        const need = card("لسه بنتعلّم جسمك", "trend30");
        need.append(el("div", "v30-mut", "محتاجين على الأقل ٧ أيام أكل متسجّل كامل و٣ مرات وزن خلال آخر ٤ أسابيع. الرقم فوق مؤقتًا من المعادلة."));
        const k = el("div", "v30-kpis"); k.append(kpi(nf(e.n) + "/٧", "أيام أكل"), kpi(nf(e.weighins) + "/٣", "مرات وزن"), kpi(nf(Math.min(e.wdays, 28)), "أيام منحنى")); need.append(k);
        need.append(bar(Math.min(100, (Math.min(e.n, 7) / 7 * 50) + (Math.min(e.weighins, 3) / 3 * 50)))); R.append(need);
      } else {
        const k = el("div", "v30-kpis");
        k.append(kpi(nf(e.meanIntake), "متوسط أكلك"), kpi((e.slopeWk > 0 ? "+" : "") + nf(e.slopeWk, 2) + " كجم", "اتجاه/أسبوع"), kpi(nf(e.n), "يوم محسوب")); R.append(k);
        /* تطوّر التقدير أسبوع بأسبوع */
        const hist = [21, 14, 7, 0].map((o) => ({ o, e: tdeeEstimate(o) })).filter((x) => x.e.ready);
        if (hist.length > 1) {
          const c2 = card("التقدير أسبوع بأسبوع", "trend30");
          c2.append(canvas(130, (x, w, h) => {
            const vs = hist.flatMap((z) => [z.e.lo, z.e.hi]), lo = Math.min(...vs) - 50, hi = Math.max(...vs) + 50, Y = (v) => h - 22 - (v - lo) / (hi - lo) * (h - 36), X = (i) => w - 24 - i * ((w - 48) / Math.max(1, hist.length - 1));
            x.strokeStyle = "rgba(255,255,255,.06)"; [0, .5, 1].forEach((f) => { const y = 14 + f * (h - 36); x.beginPath(); x.moveTo(10, y); x.lineTo(w - 10, y); x.stroke(); });
            x.fillStyle = "rgba(245,199,107,.16)"; x.beginPath(); hist.forEach((z, i) => { i ? x.lineTo(X(i), Y(z.e.hi)) : x.moveTo(X(i), Y(z.e.hi)); }); for (let i = hist.length - 1; i >= 0; i--) x.lineTo(X(i), Y(hist[i].e.lo)); x.closePath(); x.fill();
            x.strokeStyle = "#f5c76b"; x.lineWidth = 2.5; x.beginPath(); hist.forEach((z, i) => { i ? x.lineTo(X(i), Y(z.e.est)) : x.moveTo(X(i), Y(z.e.est)); }); x.stroke();
            x.textAlign = "center"; hist.forEach((z, i) => { x.fillStyle = "#fde68a"; x.beginPath(); x.arc(X(i), Y(z.e.est), 4, 0, 7); x.fill(); x.fillStyle = "rgba(233,255,246,.6)"; x.fillText(z.o ? "قبل " + nf(z.o / 7) + " أسبوع" : "دلوقتي", X(i), h - 6); x.fillText(nf(z.e.est), X(i), Y(z.e.est) - 9); });
          }));
          R.append(c2);
        }
      }
      const c3 = card("هدفك المقترح", "gem30", "gold");
      const p = prof() || {}; const gl = +p.goal || 0;
      c3.append(el("div", "v30-mut", gl < 0 ? "عشان تنزل بنفس العجز اللي اخترته (" + nf(-gl) + " سعرة)" : gl > 0 ? "عشان تزيد بنفس الفايض اللي اخترته (" + nf(gl) + " سعرة)" : "عشان تثبت وزنك"));
      const r = el("div", "v30-row"); const b1 = el("div", "v30-big"); b1.append(el("span", null, nf(sug) + " "), el("small", null, "سعرة")); r.append(b1, el("div", "v30-sp"));
      const diff = sug - tg.kcal; r.append(el("div", "v30-chip" + (Math.abs(diff) > 100 ? " on" : ""), (diff > 0 ? "+" : "") + nf(diff) + " عن هدفك الحالي")); c3.append(r);
      const ap = btn(e.ready ? "طبّق الهدف الجديد" : "استنى لما البيانات تكمل", "gold wide", () => { applyTDEE(e); viewTDEE(); }, "check30"); ap.disabled = !e.ready || Math.abs(diff) < 20; ap.style.marginTop = "10px"; c3.append(ap);
      c3.append(el("div", "v30-note", "بنعيد الحساب كل أسبوع تلقائيًا. الدقة بتزيد كل ما سجّلت أكلك كامل ووزنك ٣ مرات أو أكتر في الأسبوع (الصبح بعد الحمام وقبل الأكل)."));
      R.append(c3);
    });
  }
  function tdeeDue() { if (!premium() || !on("tdee")) return false; const seen = ld("sp30_tdee_seen", 0); if (Date.now() - seen < 6 * 864e5) return false; const e = tdeeEstimate(); return e.ready && Math.abs(tdeeSuggest(e) - TG().kcal) > 100; }

  /* ================= 2) منحنى الوزن الذكي ================= */
  function weightModel() {
    const ws = weightSeries(), p = prof() || {};
    if (!ws.days.length) return { ws, ok: false };
    const last = ws.days[ws.days.length - 1], tail = ws.days.slice(-21).map((x) => x.trend);
    const rg = regress(tail); let rate = rg.b; // كجم/يوم
    const goalW = +p.target || 0; const planned = (+p.goal || 0) / 7700;
    const dir = goalW ? Math.sign(goalW - last.trend) : 0;
    let src = "trend";
    if (goalW && (Math.sign(rate) !== dir || Math.abs(rate) < 0.005)) { rate = planned && Math.sign(planned) === dir ? planned : 0; src = "plan"; }
    let eta = null; if (goalW && rate && Math.sign(rate) === dir) { const days = (goalW - last.trend) / rate; if (days > 0 && days < 1500) eta = addDays(new Date(), Math.round(days)); }
    return { ws, ok: true, trend: last.trend, rate, goalW, eta, src, rawLast: ws.raw[ws.raw.length - 1] };
  }
  function drawWeight(x, w, h, m, span) {
    const days = m.ws.days.slice(-span);
    const extra = m.eta ? Math.min(180, Math.round((m.eta - new Date()) / 864e5)) : 0;
    const total = days.length + extra;
    const vals = days.flatMap((d) => [d.kg, d.trend].filter((v) => v != null)); if (m.goalW) vals.push(m.goalW);
    if (extra) vals.push(m.trend + m.rate * extra);
    const lo = Math.min(...vals) - .6, hi = Math.max(...vals) + .6;
    const L = 34, Rr = 10, T = 12, B = 22;
    const X = (i) => w - Rr - i / Math.max(1, total - 1) * (w - L - Rr); // RTL: الأحدث شمال؟ لا — نخلي الزمن من اليمين لليسار
    const Y = (v) => T + (hi - v) / (hi - lo) * (h - T - B);
    x.strokeStyle = "rgba(255,255,255,.06)"; x.fillStyle = "rgba(233,255,246,.5)"; x.textAlign = "left";
    for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4, y = Y(v); x.beginPath(); x.moveTo(L - 4, y); x.lineTo(w - Rr, y); x.stroke(); x.fillText(nf(v, 1), 2, y + 4); }
    if (m.goalW) { x.setLineDash([3, 4]); x.strokeStyle = "rgba(245,199,107,.55)"; x.beginPath(); x.moveTo(L, Y(m.goalW)); x.lineTo(w - Rr, Y(m.goalW)); x.stroke(); x.setLineDash([]); x.fillStyle = "#f5c76b"; x.textAlign = "right"; x.fillText("الهدف " + nf(m.goalW, 1), w - Rr, Y(m.goalW) - 5); }
    // مساحة تحت الترند
    const g = x.createLinearGradient(0, T, 0, h - B); g.addColorStop(0, "rgba(16,185,129,.28)"); g.addColorStop(1, "rgba(16,185,129,0)");
    x.beginPath(); days.forEach((d, i) => { i ? x.lineTo(X(i), Y(d.trend)) : x.moveTo(X(i), Y(d.trend)); }); x.lineTo(X(days.length - 1), h - B); x.lineTo(X(0), h - B); x.closePath(); x.fillStyle = g; x.fill();
    // النقط الخام
    days.forEach((d, i) => { if (d.kg == null) return; x.fillStyle = "rgba(233,255,246,.55)"; x.beginPath(); x.arc(X(i), Y(d.kg), 2.6, 0, 7); x.fill(); x.strokeStyle = "rgba(233,255,246,.12)"; x.beginPath(); x.moveTo(X(i), Y(d.kg)); x.lineTo(X(i), Y(d.trend)); x.stroke(); });
    // خط الترند
    x.strokeStyle = "#34d399"; x.lineWidth = 2.6; x.lineJoin = "round"; x.beginPath(); days.forEach((d, i) => { i ? x.lineTo(X(i), Y(d.trend)) : x.moveTo(X(i), Y(d.trend)); }); x.stroke();
    // التوقع
    if (extra) { const i0 = days.length - 1; x.setLineDash([6, 5]); x.strokeStyle = "#f5c76b"; x.lineWidth = 2; x.beginPath(); x.moveTo(X(i0), Y(m.trend)); x.lineTo(X(total - 1), Y(m.trend + m.rate * extra)); x.stroke(); x.setLineDash([]); x.fillStyle = "#fde68a"; x.beginPath(); x.arc(X(total - 1), Y(m.trend + m.rate * extra), 4.5, 0, 7); x.fill(); }
    x.fillStyle = "#e9fff6"; x.beginPath(); x.arc(X(days.length - 1), Y(m.trend), 4.5, 0, 7); x.fill();
    x.fillStyle = "rgba(233,255,246,.5)"; x.textAlign = "center"; x.fillText(dateAr(days[0].d, { day: "numeric", month: "short" }), X(0), h - 6); x.fillText("النهارده", X(days.length - 1), h - 6);
    if (extra && m.eta) x.fillText(dateAr(m.eta, { day: "numeric", month: "short" }), X(total - 1), h - 6);
  }
  function viewTrend() {
    view("منحنى الوزن الذكي", "trend30", "النقط = وزنك الخام، الخط = وزنك الحقيقي بعد تنعيم تقلبات المية والملح، والمتقطّع = توقّع وصولك.", (R) => {
      const m = weightModel();
      if (!m.ok || m.ws.raw.length < 2) { const c = card("سجّل وزنك أكتر", "trend30"); c.append(el("div", "v30-mut", "محتاجين وزنتين على الأقل. سجّل وزنك من «تقدّمي» أو من هنا:")); c.append(weighBox()); R.append(c); return; }
      let span = 60;
      const c = card(null, null, "gold"); const holder = el("div");
      const draw = () => { holder.replaceChildren(canvas(220, (x, w, h) => drawWeight(x, w, h, m, span))); };
      c.append(chips([[30, "شهر"], [60, "شهرين"], [120, "٤ شهور"], [365, "سنة"]], span, (v) => { span = v; draw(); }), holder); draw();
      R.append(c);
      const k = el("div", "v30-kpis");
      k.append(kpi(nf(m.trend, 1), "وزنك الحقيقي"), kpi((m.rate > 0 ? "+" : "") + nf(m.rate * 7, 2), "كجم/أسبوع"), kpi(m.eta ? dateAr(m.eta, { day: "numeric", month: "short" }) : "—", "الوصول المتوقع"));
      R.append(k);
      const n = card(null); n.append(el("div", "v30-mut", m.goalW ? (m.eta ? (m.src === "plan" ? "التوقع مبني على خطتك لأن المنحنى لسه مش واضح الاتجاه." : "لو كمّلت بنفس المعدل هتوصل " + nf(m.goalW, 1) + " كجم حوالين " + dateAr(m.eta, { day: "numeric", month: "long", year: "numeric" }) + ".") : "الاتجاه الحالي مش رايح ناحية هدفك — راجع «حرقك الحقيقي».") : "حط وزن مستهدف من حسابي عشان نحسبلك تاريخ الوصول."));
      n.append(el("div", "v30-note", "الوزن بيتهز ١–٢ كجم في اليوم بسبب المية والملح والأكل؛ اتابع الخط مش النقطة.")); n.append(weighBox()); R.append(n);
    });
  }
  function weighBox() {
    const r = el("div", "v30-row"); r.style.marginTop = "10px"; const inp = el("input", "v30-in"); inp.type = "number"; inp.inputMode = "decimal"; inp.step = "0.1"; inp.placeholder = "وزن النهارده (كجم)"; inp.style.flex = "1";
    r.append(inp, btn("سجّل", "", () => {
      const kg = +inp.value; if (!(kg > 25 && kg < 350)) return say("اكتب وزن صحيح", "info");
      const s = st(); s.weights = (s.weights || []).filter((x) => x.d !== dayKey(new Date())); s.weights.push({ d: dayKey(new Date()), kg }); s.weights.sort((a, b) => (a.d < b.d ? -1 : 1)); if (s.profile) s.profile.weight = kg; saveS(); say("اتسجل الوزن", "check"); viewTrend();
    }, "plus30")); return r;
  }

  /* ================= 3) رمضان: مواقيت فلكية ================= */
  const CITIES = { cairo: ["القاهرة", 30.0444, 31.2357], giza: ["الجيزة", 30.0131, 31.2089], alex: ["الإسكندرية", 31.2001, 29.9187], mansoura: ["المنصورة", 31.0409, 31.3785], tanta: ["طنطا", 30.7865, 31.0004], zagazig: ["الزقازيق", 30.5877, 31.502], portsaid: ["بورسعيد", 31.2653, 32.3019], suez: ["السويس", 29.9668, 32.5498], ismailia: ["الإسماعيلية", 30.5965, 32.2715], damanhur: ["دمنهور", 31.0341, 30.4682], kafr: ["كفر الشيخ", 31.1107, 30.9388], benha: ["بنها", 30.4591, 31.1786], fayoum: ["الفيوم", 29.3084, 30.8428], benisuef: ["بني سويف", 29.0661, 31.0994], minya: ["المنيا", 28.0871, 30.7618], asyut: ["أسيوط", 27.1783, 31.1859], sohag: ["سوهاج", 26.5591, 31.6948], qena: ["قنا", 26.1551, 32.716], luxor: ["الأقصر", 25.6872, 32.6396], aswan: ["أسوان", 24.0889, 32.8998], hurghada: ["الغردقة", 27.2579, 33.8116], sharm: ["شرم الشيخ", 27.9158, 34.33], matrouh: ["مرسى مطروح", 31.3543, 27.2373], arish: ["العريش", 31.1316, 33.7984] };
  const dtr = (d) => d * Math.PI / 180, rtd = (r) => r * 180 / Math.PI;
  const fixA = (a) => ((a % 360) + 360) % 360, fixH = (a) => ((a % 24) + 24) % 24;
  function julian(y, m, d) { if (m <= 2) { y -= 1; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
  function sunPos(jd) {
    const Dd = jd - 2451545, g = fixA(357.529 + .98560028 * Dd), q = fixA(280.459 + .98564736 * Dd), L = fixA(q + 1.915 * Math.sin(dtr(g)) + .02 * Math.sin(dtr(2 * g))), e = 23.439 - .00000036 * Dd;
    const RA = rtd(Math.atan2(Math.cos(dtr(e)) * Math.sin(dtr(L)), Math.cos(dtr(L)))) / 15, eqt = q / 15 - fixH(RA), decl = rtd(Math.asin(Math.sin(dtr(e)) * Math.sin(dtr(L))));
    return { decl, eqt };
  }
  /* طريقة الهيئة المصرية العامة للمساحة: فجر 19.5° · عشاء 17.5° · عصر شافعي */
  function prayerTimes(date, lat, lng, tz) {
    const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
    if (tz == null) tz = -new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12).getTimezoneOffset() / 60;
    const mid = (t) => fixH(12 - sunPos(jd + t).eqt);
    const angT = (ang, t, ccw) => { const s = sunPos(jd + t), noon = mid(t); const v = (-Math.sin(dtr(ang)) - Math.sin(dtr(s.decl)) * Math.sin(dtr(lat))) / (Math.cos(dtr(s.decl)) * Math.cos(dtr(lat))); const T = rtd(Math.acos(clamp(v, -1, 1))) / 15; return noon + (ccw ? -T : T); };
    const asrT = (f, t) => { const s = sunPos(jd + t); const ang = -rtd(Math.atan(1 / (f + Math.tan(dtr(Math.abs(lat - s.decl)))))); return angT(ang, t); };
    let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
    for (let it = 0; it < 2; it++) { const p = {}; for (const k in t) p[k] = t[k] / 24; t = { fajr: angT(19.5, p.fajr, true), sunrise: angT(.833, p.sunrise, true), dhuhr: mid(p.dhuhr), asr: asrT(1, p.asr), maghrib: angT(.833, p.maghrib), isha: angT(17.5, p.isha) }; }
    const adj = tz - lng / 15; const out = {}; for (const k in t) out[k] = fixH(t[k] + adj);
    out.dhuhr = fixH(out.dhuhr + 1 / 60); out.maghrib = fixH(out.maghrib + 1 / 60); // احتياط دقيقة زي النتائج الرسمية
    return out;
  }
  function hijri(d) {
    for (const cal of ["islamic-umalqura", "islamic", "islamic-civil"]) {
      try { const f = new Intl.DateTimeFormat("en-u-ca-" + cal + "-nu-latn", { year: "numeric", month: "numeric", day: "numeric" }); const parts = f.formatToParts(d); const g = (t) => +((parts.find((p) => p.type === t) || {}).value || 0); const m = g("month"), dd = g("day"), y = g("year") || g("relatedYear"); if (m && dd) return { y, m, d: dd, cal }; } catch (e) {}
    }
    return null;
  }
  const isRamadanDay = (d) => { const h = hijri(d || new Date()); return !!(h && h.m === 9); };
  function ramadanCfg() { return Object.assign({ mode: "auto", city: "cairo", lat: null, lng: null, imsak: 10, wake: 60 }, ld("sp30_ram", {})); }
  function ramadan(date) {
    const c = ramadanCfg(), d = date || new Date();
    const city = CITIES[c.city] || CITIES.cairo; const lat = c.lat != null ? +c.lat : city[1], lng = c.lng != null ? +c.lng : city[2];
    const pt = prayerTimes(d, lat, lng);
    const inR = isRamadanDay(d); const active = on("ramadan") && (c.mode === "on" || (c.mode === "auto" && inR));
    const imsak = fixH(pt.fajr - (+c.imsak || 10) / 60), suhoor = fixH(imsak - .75);
    const iftar = pt.maghrib;
    const s = st(); const cups = Math.max(8, +s.waterGoal || 8), ml = cups * 250;
    // المية بين الفطار والسحور
    const win = fixH(imsak - iftar); const slots = [[0, .2, "مع الفطار (على مهلك)"], [.15, .12, "بعد الفطار بساعة"], [.32, .15, "بعد التراويح"], [.5, .13, "قبل النوم"], [.82, .2, "مع السحور"], [.95, .2, "قبل الإمساك"]];
    const water = slots.map(([f, part, lab]) => ({ t: hm(iftar + win * f), at: fixH(iftar + win * f), ml: Math.round(ml * part / 50) * 50, label: lab }));
    const ids = 2980; const notifs = [
      { id: ids, t: hm(fixH(imsak - (+c.wake || 60) / 60)), title: "وقت السحور 🌙", text: "فاضل ساعة على الإمساك (" + hmAr(imsak) + "). سحور بروتين وألياف ومية." },
      { id: ids + 1, t: hm(fixH(imsak - .25)), title: "ربع ساعة على الإمساك", text: "آخر كوبايتين مية دلوقتي." },
      { id: ids + 2, t: hm(fixH(iftar - .25)), title: "قرّب المغرب", text: "ابدأ بتمرتين ومية، وسيب الحلو لبعد الأكل بساعتين." },
    ].concat(water.slice(1, 4).map((w, i) => ({ id: ids + 3 + i, t: w.t, title: "مية رمضان 💧", text: w.label + ": " + nf(w.ml) + " مل" })));
    const now = new Date(), nowH = now.getHours() + now.getMinutes() / 60;
    const fasting = active && nowH >= imsak && nowH < iftar;
    const next = fasting ? { what: "المغرب", at: iftar } : { what: "الإمساك", at: imsak };
    return { active, inRamadan: inR, mode: c.mode, city: c.city, cityName: c.lat != null ? "موقعي" : city[0], times: Object.fromEntries(Object.entries(pt).map(([k, v]) => [k, hm(v)])), imsak: hm(imsak), suhoorBy: hm(suhoor), iftar: hm(iftar), fajr: hm(pt.fajr), maghrib: hm(pt.maghrib), isha: hm(pt.isha), fasting, next: { what: next.what, at: hm(next.at), minutes: Math.round(fixH(next.at - nowH) * 60) }, waterPlan: water, waterMl: ml, notifs, hijri: hijri(d), method: "EGAS 19.5/17.5" };
  }
  const RAM_MEALS = {
    iftar: [["تمر ومية", ["تمر", "بلح"], 1], ["شوربة", ["شوربة عدس", "شوربة خضار", "شوربة"], 1], ["بروتين مشوي", ["فراخ مشوية", "صدور فراخ", "كفتة مشوية", "سمك مشوي"], 1], ["سلطة", ["سلطة خضرا", "سلطة"], 1], ["نشويات بالمعقول", ["رز ابيض", "رز", "عيش بلدي"], 1]],
    suhoor: [["فول بالزيت الخفيف", ["فول مدمس", "فول"], 1], ["بيض مسلوق", ["بيض مسلوق", "بيضة مسلوقة", "بيض"], 1], ["زبادي", ["زبادي"], 1], ["عيش بلدي", ["عيش بلدي", "رغيف"], 1], ["خيار", ["خيار"], 1]],
  };
  function findFood(keys) { const F = foodsAll(); for (const k of keys) { const nk = norm(k); const f = F.find((x) => norm(x.n).startsWith(nk)) || F.find((x) => norm(x.n).includes(nk)); if (f) return f; } return null; }
  function viewRamadan() {
    view("وضع رمضان", "moon30", "مواقيت محسوبة فلكيًا بطريقة الهيئة المصرية (فجر ١٩٫٥° · عشاء ١٧٫٥°) — تقريبية ±٢ دقيقة.", (R) => {
      const c = ramadanCfg(); const r = ramadan();
      const top = card(null, null, "gold");
      const hj = r.hijri; top.append(el("div", "v30-mut", (hj ? nf(hj.d) + " / " + nf(hj.m) + " / " + nf(hj.y) + " هـ · " : "") + r.cityName + (r.inRamadan ? " · رمضان كريم 🌙" : "")));
      const cd = el("div", "v30-big"); top.append(cd);
      const lab = el("div", "v30-mut"); top.append(lab);
      const tick = () => { if (!cd.isConnected) return clearInterval(tm); const now = new Date(), nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600; const rr = ramadan(); const [H, M] = rr.next.at.split(":").map(Number); let s = Math.round(fixH(H + M / 60 - nowH) * 3600); const t = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60)) + ":" + pad(s % 60); cd.textContent = t; cd.style.direction = "ltr"; cd.style.textAlign = "end"; lab.textContent = "فاضل على " + rr.next.what + " (" + hmAr(H + M / 60) + ")"; };
      R.append(top); const tm = setInterval(tick, 1000); tick();
      const tt = card("المواقيت النهارده", "clock30"); const tb = el("table", "v30-tbl");
      [["الإمساك", r.imsak], ["الفجر", r.times.fajr], ["الشروق", r.times.sunrise], ["الظهر", r.times.dhuhr], ["العصر", r.times.asr], ["المغرب (الفطار)", r.times.maghrib], ["العشاء", r.times.isha]].forEach(([a, b]) => { const tr = el("tr"); const [H, M] = b.split(":").map(Number); tr.append(el("td", null, a), el("td", null, hmAr(H + M / 60))); tb.append(tr); });
      tt.append(tb); R.append(tt);
      const st1 = card("الإعدادات", "pin30");
      st1.append(el("div", "v30-mut", "الوضع"), chips([["auto", "تلقائي في رمضان"], ["on", "شغّال دايمًا"], ["off", "مقفول"]], c.mode, (v) => { c.mode = v; sv("sp30_ram", c); fireRam(); viewRamadan(); }));
      const sel = el("select", "v30-in"); sel.style.marginTop = "10px"; Object.entries(CITIES).forEach(([k, v]) => { const o = el("option", null, v[0]); o.value = k; if (k === c.city && c.lat == null) o.selected = true; sel.append(o); });
      if (c.lat != null) { const o = el("option", null, "موقعي الحالي"); o.value = "_me"; o.selected = true; sel.prepend(o); }
      sel.onchange = () => { if (sel.value === "_me") return; c.city = sel.value; c.lat = c.lng = null; sv("sp30_ram", c); fireRam(); viewRamadan(); };
      st1.append(sel);
      const gp = btn("استخدم موقعي بالظبط", "sec wide", () => { try { navigator.geolocation.getCurrentPosition((p) => { c.lat = Math.round(p.coords.latitude * 1e4) / 1e4; c.lng = Math.round(p.coords.longitude * 1e4) / 1e4; sv("sp30_ram", c); fireRam(); viewRamadan(); say("اتحدد مكانك", "check"); }, () => say("مقدرناش نوصل لموقعك — اختار مدينتك", "info"), { timeout: 9000, maximumAge: 36e5 }); } catch (e) { say("الموقع مش متاح", "info"); } }, "pin30");
      gp.style.marginTop = "8px"; st1.append(gp);
      st1.append(el("div", "v30-mut", "الإمساك قبل الفجر بـ"), chips([[10, "١٠ دقايق"], [15, "١٥"], [20, "٢٠"]], +c.imsak, (v) => { c.imsak = v; sv("sp30_ram", c); fireRam(); viewRamadan(); }));
      R.append(st1);
      const wc = card("خطة المية من الفطار للسحور", "drop30"); wc.append(el("div", "v30-mut", "هدفك " + nf(r.waterMl) + " مل متقسّمين على الساعات اللي تقدر تشرب فيها:"));
      r.waterPlan.forEach((w) => { const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, w.label), el("small", null, hmAr(w.at))); li.append(ic("drop30"), n, el("b", null, nf(w.ml) + " مل")); wc.append(li); });
      wc.append(el("div", "v30-note", "قلّل المخللات والملح في السحور عشان العطش، والقهوة والشاي مش بيتحسبوا مية كاملة.")); R.append(wc);
      for (const [key, title] of [["iftar", "قالب فطار متوازن"], ["suhoor", "قالب سحور يشبّع"]]) {
        const mc = card(title, "leaf30"); const picked = RAM_MEALS[key].map(([lab, keys, q]) => ({ lab, f: findFood(keys), q }));
        let tot = 0, pr = 0; picked.forEach((x) => { const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, x.f ? x.f.n : x.lab), el("small", null, x.f ? (x.f.sv || "") + " · " + nf(x.f.k) + " سعرة" : "مش لاقيينه في القاعدة")); li.append(n); mc.append(li); if (x.f) { tot += x.f.k * x.q; pr += x.f.p * x.q; } });
        mc.append(el("div", "v30-mut", "الإجمالي ≈ " + nf(tot) + " سعرة · " + nf(pr) + " جم بروتين"));
        const b = btn("سجّلها كلها", "wide", () => { let n = 0; picked.forEach((x) => { if (x.f && logFood(x.f, x.q, key === "iftar" ? "d" : "b")) n++; }); say("اتسجّل " + nf(n) + " أصناف", "check"); }, "plus30"); b.style.marginTop = "8px"; mc.append(b); R.append(mc);
      }
      const nn = card("التنبيهات", "clock30"); nn.append(el("div", "v30-mut", r.active ? "محرك التنبيهات بياخد مواعيد السحور والمغرب والمية من هنا تلقائيًا." : "التنبيهات هتشتغل لما الوضع يكون شغّال."));
      r.notifs.forEach((n) => { const li = el("div", "v30-li"); const x = el("div", "n"); const [H, M] = n.t.split(":").map(Number); x.append(el("b", null, n.title), el("small", null, n.text)); li.append(x, el("b", null, hmAr(H + M / 60))); nn.append(li); });
      nn.append(el("div", "v30-note", "لو عندك سكر أو ضغط أو حامل/مرضعة اسأل دكتورك قبل الصيام.")); R.append(nn);
    });
  }
  function fireRam() { try { W.dispatchEvent(new CustomEvent("v30:ramadan", { detail: ramadan() })); } catch (e) {} homeCard(); }

  /* ================= 4) الصيام المتقطع ================= */
  const PRESETS = [[12, "١٢:١٢", "بداية سهلة"], [14, "١٤:١٠", "متوازن"], [16, "١٦:٨", "الأشهر"], [18, "١٨:٦", "متقدّم"], [20, "٢٠:٤", "المحارب"], [23, "OMAD", "وجبة واحدة"]];
  const STAGES = [[0, "السكر في الدم بيعلى", "جسمك بيهضم ويخزّن طاقة آخر وجبة"], [4, "السكر بيستقر", "الإنسولين بيبدأ ينزل تدريجيًا"], [8, "سحب المخزون", "الجسم بيعتمد على الجليكوجين المتخزّن"], [12, "حرق الدهون", "الاعتماد على الدهون كوقود بيزيد"], [16, "بداية الكيتوزيس", "الكيتونات بتبتدي تعلى في الدم"], [18, "كيتوزيس أعمق", "طاقة ثابتة وجوع أقل عند ناس كتير"], [24, "الالتهام الذاتي (Autophagy)", "بيزيد مع الصيام الأطول — الأبحاث على البشر لسه محدودة"]];
  const fastSt = () => Object.assign({ on: false, start: 0, hrs: 16, hist: [] }, ld("sp30_fast", {}));
  function fastStart(hrs, at) { const f = fastSt(); f.on = true; f.start = at || Date.now(); if (hrs) f.hrs = hrs; sv("sp30_fast", f); try { const s = st(); s.fast = Object.assign(s.fast || {}, { on: true, start: f.start, hrs: f.hrs }); saveS(); } catch (e) {} try { W.NOTIF37 && NOTIF37.available() && NOTIF37.once("v30fast", Math.round(f.hrs * 3600 - (Date.now() - f.start) / 1000), "خلّصت صيامك 🎉", "وصلت " + nf(f.hrs) + " ساعة. افطر بهدوء وبروتين."); } catch (e) {} hap(30); return f; }
  function fastStop() { const f = fastSt(); if (!f.on) return f; const e = Date.now(), dur = (e - f.start) / 36e5; if (dur > .25) f.hist.push({ s: f.start, e, goal: f.hrs }); f.hist = f.hist.slice(-120); f.on = false; f.start = 0; sv("sp30_fast", f); try { const s = st(); if (s.fast) { s.fast.on = false; saveS(); } } catch (e2) {} hap(30); return Object.assign(f, { lastDur: dur }); }
  function fastStreak(f) { f = f || fastSt(); const ok = new Set(f.hist.filter((h) => (h.e - h.s) / 36e5 >= h.goal * .95).map((h) => dk(new Date(h.e)))); let n = 0, d = new Date(); if (!ok.has(dk(d))) d = addDays(d, -1); while (ok.has(dk(d)) && n < 999) { n++; d = addDays(d, -1); } return n; }
  function viewFast() {
    view("الصيام المتقطع", "clock30", "اختار نظامك، ابدأ العداد، وشوف جسمك فين دلوقتي.", (R) => {
      const f = fastSt();
      const c = card(null, null, "gold"); c.style.textAlign = "center";
      const ringH = 250; let anim = 0;
      const cv = canvas(ringH, (x, w, h) => {
        const ff = fastSt(), el2 = ff.on ? (Date.now() - ff.start) / 36e5 : 0, pct = ff.on ? el2 / ff.hrs : 0, show = RM() ? pct : Math.min(pct, anim);
        const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 18;
        x.lineCap = "round"; x.lineWidth = 16; x.strokeStyle = "rgba(255,255,255,.07)"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
        const a0 = -Math.PI / 2, a1 = a0 + Math.PI * 2 * Math.min(show, 1);
        const g = x.createLinearGradient(cx - r, cy - r, cx + r, cy + r); g.addColorStop(0, "#34d399"); g.addColorStop(.6, "#10b981"); g.addColorStop(1, "#f5c76b");
        if (show > 0) { x.shadowColor = "rgba(16,185,129,.6)"; x.shadowBlur = 14; x.strokeStyle = g; x.beginPath(); x.arc(cx, cy, r, a0, a1); x.stroke(); x.shadowBlur = 0; }
        if (show > 1) { x.strokeStyle = "rgba(245,199,107,.9)"; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, r - 16, a0, a0 + Math.PI * 2 * Math.min(show - 1, 1)); x.stroke(); }
        STAGES.forEach(([hh]) => { if (!hh || hh > ff.hrs) return; const a = a0 + Math.PI * 2 * hh / ff.hrs; x.fillStyle = el2 >= hh ? "#fde68a" : "rgba(255,255,255,.35)"; x.beginPath(); x.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, 7); x.fill(); });
        x.textAlign = "center"; x.fillStyle = "#e9fff6"; x.font = "800 34px system-ui, sans-serif";
        const s = Math.floor(el2 * 3600); x.fillText(ff.on ? pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60)) + ":" + pad(s % 60) : "--:--", cx, cy + 6);
        x.font = "13px system-ui, sans-serif"; x.fillStyle = "rgba(233,255,246,.62)";
        x.fillText(ff.on ? (el2 >= ff.hrs ? "وصلت هدفك 🎉 +" + nf(el2 - ff.hrs, 1) + " س" : "فاضل " + nf(ff.hrs - el2, 1) + " ساعة من " + nf(ff.hrs)) : "مش صايم دلوقتي", cx, cy + 32);
      });
      c.append(cv);
      if (!RM() && f.on) { const t0 = performance.now(); const step = (t) => { anim = Math.min(1, (t - t0) / 900) * ((Date.now() - f.start) / 36e5 / f.hrs); cv._paint && cv._paint(); if (t - t0 < 900 && cv.isConnected) requestAnimationFrame(step); else anim = 9; }; requestAnimationFrame(step); } else anim = 9;
      const tm = setInterval(() => { if (!cv.isConnected) return clearInterval(tm); cv._paint && cv._paint(); }, 1000);
      const stg = el("div"); stg.style.textAlign = "start";
      const drawStages = () => { stg.replaceChildren(); const ff = fastSt(), e2 = ff.on ? (Date.now() - ff.start) / 36e5 : -1; STAGES.forEach(([hh, t, d], i) => { const nx = STAGES[i + 1]; const row = el("div", "v30-stage" + (e2 >= hh ? " on" : "") + (e2 >= hh && (!nx || e2 < nx[0]) ? " now" : "")); const n = el("div"); n.append(el("b", null, nf(hh) + "+ س · " + t), el("div", "v30-mut", d)); row.append(el("i", "dot"), n); stg.append(row); }); };
      drawStages(); const tm2 = setInterval(() => { if (!stg.isConnected) return clearInterval(tm2); drawStages(); }, 60000);
      if (!f.on) {
        c.append(el("div", "v30-mut", "اختار النظام:"));
        let pick = f.hrs; const pr = el("div", "v30-chips"); pr.style.justifyContent = "center";
        PRESETS.forEach(([h, l, d]) => { const b = el("button", "v30-chip" + (h === pick ? " on" : "")); b.append(el("b", null, l), el("small", null, " · " + d)); b.onclick = () => { hap(); pick = h; pr.querySelectorAll(".v30-chip").forEach((z) => z.classList.remove("on")); b.classList.add("on"); }; pr.append(b); });
        c.append(pr);
        const r = el("div", "v30-row"); r.style.marginTop = "12px";
        r.append(btn("ابدأ دلوقتي", "", () => { fastStart(pick); say("بدأ الصيام — بالتوفيق", "check"); viewFast(); }, "clock30"));
        const ago = el("select", "v30-in"); ago.style.flex = "1"; [[0, "بدأت من شوية؟"], [1, "من ساعة"], [2, "من ساعتين"], [3, "من ٣ ساعات"], [4, "من ٤ ساعات"]].forEach(([v, l]) => { const o = el("option", null, l); o.value = v; ago.append(o); });
        ago.onchange = () => { const v = +ago.value; if (v) { fastStart(pick, Date.now() - v * 36e5); viewFast(); } };
        r.append(ago); c.append(r);
      } else {
        const ends = new Date(f.start + f.hrs * 36e5);
        c.append(el("div", "v30-mut", "بدأت " + new Date(f.start).toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" }) + " · تخلص " + dateAr(ends, { weekday: "short" }) + " " + ends.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })));
        const b = btn("أنهي الصيام", "gold wide", () => { const r = fastStop(); const ok = r.lastDur >= f.hrs * .95; say(ok ? "برافو! " + nf(r.lastDur, 1) + " ساعة 🎉" : "اتسجّل " + nf(r.lastDur, 1) + " ساعة", "check"); viewFast(); }, "check30"); b.style.marginTop = "10px"; c.append(b);
      }
      R.append(c);
      const sc = card("مراحل جسمك (تقريبية)", "flame30"); sc.append(stg, el("div", "v30-note", "المراحل تقديرية وبتختلف حسب أكلك ونشاطك وجسمك. الصيام الطويل مش مناسب لو عندك سكر بعلاج، حامل/مرضعة، أقل من ١٨ سنة، أو تاريخ اضطرابات أكل — اسأل دكتورك.")); R.append(sc);
      const hc = card("السجل والستريك", "medal30"); const fs = fastSt(); const last7 = range(7).map((i) => { const d = addDays(new Date(), -6 + i), k = dk(d); const hs = fs.hist.filter((h) => dk(new Date(h.e)) === k); return { d, h: hs.reduce((m, h) => Math.max(m, (h.e - h.s) / 36e5), 0), g: hs.length ? hs[hs.length - 1].goal : fs.hrs }; });
      const k = el("div", "v30-kpis"); const done = fs.hist.filter((h) => (h.e - h.s) / 36e5 >= h.goal * .95); k.append(kpi(nf(fastStreak(fs)) + " 🔥", "ستريك أيام"), kpi(nf(done.length), "صيام مكتمل"), kpi(fs.hist.length ? nf(mean(fs.hist.slice(-14).map((h) => (h.e - h.s) / 36e5)), 1) : "—", "متوسط ساعات")); hc.append(k);
      hc.append(canvas(130, (x, w, h) => { const mx = Math.max(24, ...last7.map((z) => z.h)); const bw = (w - 20) / 7; last7.forEach((z, i) => { const X = w - 10 - (i + 1) * bw + bw * .2, bh = (h - 30) * z.h / mx, Y = h - 20 - bh; const g = x.createLinearGradient(0, Y, 0, h - 20); const ok = z.h >= z.g * .95; g.addColorStop(0, ok ? "#f5c76b" : "#34d399"); g.addColorStop(1, ok ? "rgba(245,199,107,.2)" : "rgba(16,185,129,.15)"); x.fillStyle = z.h ? g : "rgba(255,255,255,.06)"; const rr = 6; x.beginPath(); if (x.roundRect) x.roundRect(X, z.h ? Y : h - 24, bw * .6, z.h ? bh : 4, rr); else x.rect(X, z.h ? Y : h - 24, bw * .6, z.h ? bh : 4); x.fill(); x.fillStyle = "rgba(233,255,246,.6)"; x.textAlign = "center"; x.fillText(dateAr(z.d, { weekday: "narrow" }), X + bw * .3, h - 5); if (z.h) x.fillText(nf(z.h, 1), X + bw * .3, Y - 4); }); const gy = h - 20 - (h - 30) * fs.hrs / mx; x.setLineDash([4, 4]); x.strokeStyle = "rgba(245,199,107,.5)"; x.beginPath(); x.moveTo(10, gy); x.lineTo(w - 10, gy); x.stroke(); x.setLineDash([]); }));
      R.append(hc);
    });
  }

  /* ================= 5) دوّر على أكل غني بـ ================= */
  // لكل 100 جم تقريبًا (USDA FoodData Central، مطبوخ لما ينطبق): [ألياف جم, حديد مجم, كالسيوم مجم, فيتامين سي مجم, بوتاسيوم مجم]
  const MICRO = [
    ["فول سوداني", 8.5, 4.6, 92, 0, 705], ["سوداني", 8.5, 4.6, 92, 0, 705], ["فاصوليا بيضا", 6.3, 3.7, 90, 0, 561], ["فاصوليا خضرا", 2.7, 1, 37, 12, 211], ["لوبيا", 6.5, 2.5, 24, .4, 278], ["عدس", 7.9, 3.3, 19, 1.5, 369], ["حمص", 7.6, 2.9, 49, 1.3, 291], ["طعميه", 4.9, 3.4, 54, 1.6, 585], ["فلافل", 4.9, 3.4, 54, 1.6, 585], ["فول", 5.4, 1.5, 36, .3, 268],
    ["طحينه", 9.3, 8.9, 426, 0, 414], ["سمسم", 11.8, 14.6, 975, 0, 468], ["حلاوه", 4, 3, 130, 0, 250], ["عسل اسود", 0, 4.7, 205, 0, 1464], ["لوز", 12.5, 3.7, 269, 0, 733], ["عين جمل", 6.7, 2.9, 98, 1.3, 441], ["شوفان", 10.6, 4.7, 54, 0, 429], ["دارك", 11, 12, 73, 0, 715],
    ["ملوخيه", 1.7, 3.1, 184, 33, 551], ["سبانخ", 2.2, 2.7, 99, 28, 558], ["جرجير", 1.6, 1.5, 160, 15, 369], ["بقدونس", 3.3, 6.2, 138, 133, 554], ["بروكلي", 2.6, .7, 47, 89, 316], ["قرنبيط", 2, .4, 22, 48, 299], ["كرنب", 2.5, .5, 40, 36, 170], ["فلفل", 1.7, .3, 10, 80, 175], ["طماطم", 1.2, .3, 10, 14, 237], ["خيار", .5, .3, 16, 2.8, 147], ["جزر", 2.8, .3, 33, 5.9, 320], ["بطاطا", 3.3, .7, 38, 19.6, 475], ["بطاطس", 2.2, 1.1, 15, 9.6, 535], ["باميه", 2.5, .3, 77, 16, 135], ["كوسه", 1, .4, 13, 13, 264], ["بتنجان", 2.5, .3, 6, 1.3, 123], ["باذنجان", 2.5, .3, 6, 1.3, 123], ["بنجر", 2.8, .8, 16, 4.9, 325], ["بسله", 5.5, 1.5, 27, 14, 271], ["ذره", 2.4, .5, 3, 5.5, 218], ["مشروم", 2.2, 1.7, 6, 0, 356], ["سلطه", 1.5, .5, 20, 15, 200], ["محشي", 2, 1, 30, 8, 200], ["كشري", 3, 1.5, 25, 2, 200],
    ["جوافه", 5.4, .3, 18, 228, 417], ["كيوي", 3, .3, 34, 93, 312], ["فراوله", 2, .4, 16, 59, 153], ["برتقال", 2.4, .1, 40, 53, 181], ["يوسفي", 1.8, .2, 37, 27, 166], ["مانجو", 1.6, .2, 11, 36, 168], ["مانجا", 1.6, .2, 11, 36, 168], ["شمام", .9, .2, 9, 37, 267], ["كانتلوب", .9, .2, 9, 37, 267], ["موز", 2.6, .3, 5, 8.7, 358], ["تفاح", 2.4, .1, 6, 4.6, 107], ["رمان", 4, .3, 10, 10, 236], ["عنب", .9, .4, 10, 3.2, 191], ["بطيخ", .4, .2, 7, 8, 112], ["تين", 2.9, .4, 35, 2, 232], ["بلح", 6.7, .9, 64, .4, 696], ["تمر", 6.7, .9, 64, .4, 696], ["ليمون", 2.8, .6, 26, 53, 138],
    ["زبادي", 0, .1, 121, .5, 155], ["جبنه قريش", 0, .1, 83, 0, 104], ["قريش", 0, .1, 83, 0, 104], ["رومي", 0, .7, 700, 0, 90], ["شيدر", 0, .7, 710, 0, 76], ["جبنه", 0, .3, 400, 0, 100], ["لبن", 0, 0, 113, 0, 132], ["بيض", 0, 1.8, 56, 0, 138], ["كبده", 0, 8, 8, 10, 260], ["سردين", 0, 2.9, 382, 0, 397], ["تونه", 0, 1.3, 13, 0, 237], ["بلطي", 0, .7, 14, 0, 380], ["سمك", 0, .7, 14, 0, 380], ["جمبري", 0, .5, 70, 0, 170], ["لحم", 0, 2.6, 18, 0, 318], ["كفته", 0, 2.6, 18, 0, 318], ["فراخ", 0, 1, 15, 0, 256], ["عيش", 4, 2.5, 30, 0, 170], ["رغيف", 4, 2.5, 30, 0, 170], ["رز", .4, .2, 10, 0, 35], ["مكرونه", 1.8, .5, 7, 0, 44],
  ].map(([k, ...v]) => [norm(k), v]);
  const NUTS = [["p", "بروتين", "جم", -1], ["fib", "ألياف", "جم", 0], ["fe", "حديد", "مجم", 1], ["ca", "كالسيوم", "مجم", 2], ["vc", "فيتامين سي", "مجم", 3], ["k", "بوتاسيوم", "مجم", 4]];
  function gramsOf(f) { const m = String(f.sv || "").replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).match(/(\d+(?:\.\d+)?)\s*(جم|جرام|مل|g|ml)/i); return m ? +m[1] : null; }
  function microOf(f) { const n = norm(f.n); for (const [k, v] of MICRO) if (n.includes(k)) return v; return null; }
  function boostRank(nut) {
    const def = NUTS.find((x) => x[0] === nut); const out = [];
    for (const f of foodsAll()) {
      if (!f || !(+f.k >= 15)) continue; let amt = null;
      if (nut === "p") amt = +f.p || 0; else { const g = gramsOf(f), m = microOf(f); if (g && m) amt = m[def[3]] * g / 100; }
      if (amt == null || amt <= 0) continue;
      out.push({ f, amt, per100: amt / f.k * 100 });
    }
    return out;
  }
  function viewBoost() {
    view("دوّر على أكل غني بـ", "search30", "بنرتّب أكل القاعدة حسب كمية العنصر لكل ١٠٠ سعرة — عشان تاخد أكتر بأقل سعرات.", (R) => {
      let nut = ld("sp30_boost", "p"), mode = "kcal";
      const list = el("div");
      const draw = () => {
        const def = NUTS.find((x) => x[0] === nut); let arr = boostRank(nut);
        arr.sort((a, b) => (mode === "kcal" ? b.per100 - a.per100 : b.amt - a.amt)); const seen = new Set(); arr = arr.filter((x) => { const k = norm(x.f.n).slice(0, 14); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 25);
        list.replaceChildren(); if (!arr.length) { list.append(el("div", "v30-mut", "مفيش بيانات كفاية للعنصر ده.")); return; }
        const mx = mode === "kcal" ? arr[0].per100 : arr[0].amt;
        arr.forEach((x, i) => {
          const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, nf(i + 1) + ". " + x.f.n), el("small", null, (x.f.sv || "") + " · " + nf(x.f.k) + " سعرة · " + nf(x.amt, 1) + " " + def[2] + " في الحصة")); n.append(bar((mode === "kcal" ? x.per100 : x.amt) / mx * 100));
          const v = el("div"); v.style.textAlign = "center"; v.append(el("b", null, nf(mode === "kcal" ? x.per100 : x.amt, 1)), el("div", "v30-mut", mode === "kcal" ? def[2] + "/١٠٠ سعرة" : def[2] + "/حصة"));
          const add = el("button", "v30-ib"); add.setAttribute("aria-label", "سجّل"); add.append(ic("plus30")); add.onclick = () => { hap(); if (logFood(x.f, 1)) say("اتسجّل " + x.f.n, "check"); };
          li.append(n, v, add); list.append(li);
        });
      };
      const c = card(null, null, "gold");
      c.append(chips(NUTS.map((x) => [x[0], x[1]]), nut, (v) => { nut = v; sv("sp30_boost", v); draw(); }));
      const m2 = chips([["kcal", "لكل ١٠٠ سعرة"], ["serv", "لكل حصة"]], mode, (v) => { mode = v; draw(); }); m2.style.marginTop = "8px"; c.append(m2); R.append(c);
      const lc = card(null); lc.append(list); R.append(lc); draw();
      R.append(el("div", "v30-note", "البروتين من قاعدة التطبيق. باقي العناصر قيم تقريبية لكل ١٠٠ جم (مرجع USDA) ومحسوبة على وزن الحصة؛ الأصناف اللي من غير وزن واضح مش داخلة."));
    });
  }

  /* ================= 6) أهداف حسب اليوم + ميزانية أسبوعية ================= */
  const WD = ["الحد", "الاتنين", "التلات", "الأربع", "الخميس", "الجمعة", "السبت"];
  const weekCfg = () => Object.assign({ on: false, mult: [1, 1, 1, 1, 1, 1, 1], carbHi: [0, 0, 0, 0, 0, 0, 0], start: 6, roll: true }, ld("sp30_week", {}));
  function weekStart(d) { const c = weekCfg(); const x = new Date(d); x.setHours(0, 0, 0, 0); while (x.getDay() !== c.start) x.setDate(x.getDate() - 1); return x; }
  function weekPlan(ref) {
    const c = weekCfg(), tg = TG(), base = tg.kcal || 2000, p = prof() || {}; const floor = p.sex === "m" ? 1500 : 1200;
    const s = c.mult.reduce((a, b) => a + b, 0) || 7; const mult = c.mult.map((m) => m * 7 / s);
    const ws = weekStart(ref || new Date()), today = new Date(); today.setHours(0, 0, 0, 0);
    const days = range(7).map((i) => { const d = addDays(ws, i), k = dayKey(d), sm = sumD(getD(k)); return { d, k, wd: d.getDay(), planned: Math.round(base * mult[d.getDay()]), eaten: Math.round(sm.k), logged: sm.k > base * .3, past: d < today, today: +d === +today }; });
    const budget = base * 7; let carry = 0;
    days.forEach((x) => { if (x.past && x.logged) carry += x.planned - x.eaten; });
    const rest = days.filter((x) => !x.past); const restPlanned = rest.reduce((a, x) => a + x.planned, 0) || 1;
    rest.forEach((x) => { const adj = c.roll ? carry * x.planned / restPlanned : 0; x.adj = Math.round(clamp(x.planned + adj, Math.max(floor, x.planned * .85), x.planned * 1.15) / 10) * 10; });
    days.forEach((x) => { if (x.past) x.adj = x.planned; });
    const used = days.filter((x) => x.past || x.today).reduce((a, x) => a + (x.logged || x.today ? x.eaten : x.planned), 0);
    return { days, budget, carry: Math.round(carry), used, left: Math.round(budget - used), cfg: c };
  }
  function todayTarget() {
    const tg = TG(); const c = weekCfg();
    if (!c.on || !premium() || !on("week")) return { kcal: tg.kcal, p: tg.p, c: tg.c, f: tg.f, src: "base" };
    const wp = weekPlan(), t = wp.days.find((x) => x.today) || { adj: tg.kcal, wd: new Date().getDay() };
    const kcal = t.adj, prot = tg.p; const carbBias = c.carbHi[t.wd] ? .55 : c.carbHi.some(Boolean) ? .4 : .45;
    const carb = Math.max(0, Math.round((kcal - prot * 4) * carbBias / 4)), fat = Math.max(0, Math.round((kcal - prot * 4 - carb * 4) / 9));
    return { kcal, p: prot, c: carb, f: fat, src: "week" };
  }
  function viewWeek() {
    view("ميزانية الأسبوع", "week30", "زي WeightWatchers: سعرات أسبوعية، كل يوم ليه هدفه، واللي يفضل أو يزيد بيترحّل على باقي الأسبوع.", (R) => {
      if (!premium()) { R.append(lockView("أهداف حسب يوم الأسبوع + ميزانية أسبوعية بترحيل.")); return; }
      const c = weekCfg(); const wp = weekPlan(); const tt = todayTarget();
      const top = card(null, null, "gold");
      const r0 = el("div", "v30-row"); r0.append(el("b", null, "شغّل الميزانية الأسبوعية"), el("div", "v30-sp")); const tg = el("button", "v30-chip" + (c.on ? " on" : ""), c.on ? "شغّالة" : "مقفولة"); tg.onclick = () => { c.on = !c.on; sv("sp30_week", c); viewWeek(); }; r0.append(tg); top.append(r0);
      const big = el("div", "v30-big"); big.append(el("span", null, nf(wp.left) + " "), el("small", null, "سعرة فاضلة من " + nf(wp.budget))); top.append(big, bar(wp.used / wp.budget * 100));
      top.append(el("div", "v30-mut", wp.carry > 0 ? "موفّر " + nf(wp.carry) + " سعرة من الأيام اللي فاتت — اتوزّعوا على باقي الأسبوع." : wp.carry < 0 ? "زايد " + nf(-wp.carry) + " سعرة — بنسحبهم بهدوء من الأيام الجاية (بحد أقصى ١٥٪ في اليوم)." : "ماشي على الخطة بالظبط."));
      const k = el("div", "v30-kpis"); k.append(kpi(nf(tt.kcal), "هدف النهارده"), kpi(nf(tt.c) + " جم", "كارب"), kpi(nf(tt.p) + " / " + nf(tt.f), "بروتين/دهون")); top.append(k); R.append(top);
      const ch = card("الأسبوع", "week30");
      ch.append(canvas(170, (x, w, h) => {
        const mx = Math.max(...wp.days.map((d) => Math.max(d.adj, d.eaten))) * 1.1; const bw = (w - 16) / 7;
        wp.days.forEach((d, i) => { const X = w - 8 - (i + 1) * bw + bw * .18, Bw = bw * .64, Y = (v) => h - 22 - (h - 40) * v / mx;
          x.fillStyle = "rgba(255,255,255,.06)"; x.fillRect(X, Y(d.adj), Bw, h - 22 - Y(d.adj));
          if (d.eaten) { const over = d.eaten > d.adj * 1.05; const g = x.createLinearGradient(0, Y(d.eaten), 0, h - 22); g.addColorStop(0, over ? "#fb923c" : d.today ? "#f5c76b" : "#34d399"); g.addColorStop(1, "rgba(16,185,129,.15)"); x.fillStyle = g; x.fillRect(X, Y(d.eaten), Bw, h - 22 - Y(d.eaten)); }
          x.strokeStyle = "#fde68a"; x.lineWidth = 2; x.beginPath(); x.moveTo(X - 2, Y(d.adj)); x.lineTo(X + Bw + 2, Y(d.adj)); x.stroke();
          x.fillStyle = d.today ? "#fde68a" : "rgba(233,255,246,.6)"; x.textAlign = "center"; x.fillText(WD[d.wd].slice(0, 3), X + Bw / 2, h - 6); x.fillText(nf(d.adj / 1000, 1) + "k", X + Bw / 2, Y(Math.max(d.adj, d.eaten)) - 5); });
      }));
      ch.append(el("div", "v30-mut", "الخط الدهبي = هدف اليوم بعد الترحيل · العمود = اللي أكلته"));
      const rl = el("div", "v30-row"); rl.style.marginTop = "8px"; rl.append(el("span", null, "ترحيل الفايض/الزيادة"), el("div", "v30-sp")); const rb = el("button", "v30-chip" + (c.roll ? " on" : ""), c.roll ? "شغّال" : "مقفول"); rb.onclick = () => { c.roll = !c.roll; sv("sp30_week", c); viewWeek(); }; rl.append(rb); ch.append(rl); R.append(ch);
      const ed = card("هدف كل يوم", "gem30"); ed.append(el("div", "v30-mut", "زوّد أيام العزومات والتمرين وقلّل الباقي — الإجمالي الأسبوعي ثابت. علّم أيام التمرين عشان كاربها يعلى."));
      const tgb = TG().kcal || 2000; const order = range(7).map((i) => (c.start + i) % 7);
      order.forEach((wd) => {
        const row = el("div", "v30-li"); const n = el("div", "n"); const lab = el("small"); const sum = c.mult.reduce((a, b) => a + b, 0) || 7;
        const upd = () => { const s2 = c.mult.reduce((a, b) => a + b, 0) || 7; lab.textContent = "≈ " + nf(tgb * c.mult[wd] * 7 / s2) + " سعرة · " + (c.mult[wd] >= 1 ? "+" : "") + nf((c.mult[wd] - 1) * 100) + "٪"; };
        n.append(el("b", null, WD[wd]), lab); const rg = el("input", "v30-rng"); rg.type = "range"; rg.min = "0.75"; rg.max = "1.35"; rg.step = "0.05"; rg.value = String(c.mult[wd]); rg.oninput = () => { c.mult[wd] = +rg.value; upd(); }; rg.onchange = () => sv("sp30_week", c); n.append(rg); upd();
        const tr = el("button", "v30-chip" + (c.carbHi[wd] ? " on" : ""), "تمرين"); tr.onclick = () => { c.carbHi[wd] = c.carbHi[wd] ? 0 : 1; tr.classList.toggle("on"); sv("sp30_week", c); };
        row.append(n, tr); ed.append(row); void sum;
      });
      const rs = btn("رجّع كله متساوي", "sec wide", () => { c.mult = [1, 1, 1, 1, 1, 1, 1]; c.carbHi = [0, 0, 0, 0, 0, 0, 0]; sv("sp30_week", c); viewWeek(); }); rs.style.marginTop = "8px"; ed.append(rs);
      ed.append(el("div", "v30-mut", "بداية الأسبوع:"), chips([[6, "السبت"], [0, "الحد"], [1, "الاتنين"]], c.start, (v) => { c.start = v; sv("sp30_week", c); viewWeek(); }));
      R.append(ed);
    });
  }

  /* ================= 7) وضع السكر ================= */
  const GCTX = [["fast", "صايم"], ["pre", "قبل الأكل"], ["post", "بعد الأكل بساعتين"], ["bed", "قبل النوم"], ["rand", "عشوائي"]];
  const gluList = () => ld("sp30_glu", []);
  const gluRange = (ctx) => (ctx === "post" ? [70, 180] : ctx === "bed" ? [90, 150] : ctx === "rand" ? [70, 180] : [80, 130]);
  function gluAdd(v, ctx, note) { v = Math.round(+v); if (!(v >= 20 && v <= 600)) return null; const L = gluList(); const e = { t: Date.now(), v, ctx: ctx || "rand", note: String(note || "").slice(0, 80) }; L.push(e); sv("sp30_glu", L.slice(-1000)); return e; }
  function gluWarn(v, ctx) {
    if (v < 54) return ["lo", "هبوط شديد (" + nf(v) + "). خد ١٥–٢٠ جم سكر سريع فورًا (نص كوباية عصير أو ٣ معالق سكر في مية) وقيس بعد ١٥ دقيقة. لو مش قادر تبلع أو مش واعي: طوارئ فورًا (١٢٣)."];
    if (v < 70) return ["lo", "هبوط (" + nf(v) + "). قاعدة ١٥/١٥: ١٥ جم سكر سريع، استنى ١٥ دقيقة، وقيس تاني."];
    if (v > 300) return ["hi", "ارتفاع كبير (" + nf(v) + "). اشرب مية، ولو معاك شرايط كيتون اختبرها. لو فيه ترجيع أو نهجان أو دوخة كلّم دكتورك فورًا."];
    if (v > 250) return ["hi", "ارتفاع (" + nf(v) + "). راجع جرعاتك وأكلك مع دكتورك لو اتكرر."];
    const [lo, hi] = gluRange(ctx); if (v > hi) return ["hi", "أعلى من المدى المعتاد لـ«" + (GCTX.find((x) => x[0] === ctx) || [0, ""])[1] + "» (" + nf(lo) + "–" + nf(hi) + ")."];
    return ["ok", "في المدى 👌"];
  }
  function gluStats(days) { const since = Date.now() - days * 864e5; const L = gluList().filter((x) => x.t >= since); if (!L.length) return null; const vs = L.map((x) => x.v); const inR = L.filter((x) => x.v >= 70 && x.v <= 180).length; const spanDays = (Math.max(...L.map((x) => x.t)) - Math.min(...L.map((x) => x.t))) / 864e5; const avg = mean(vs); return { n: L.length, avg, tir: inR / L.length * 100, lo: L.filter((x) => x.v < 70).length, hi: L.filter((x) => x.v > 180).length, eA1c: L.length >= 14 && spanDays >= 7 ? (avg + 46.7) / 28.7 : null, list: L }; }
  function viewSugar() {
    view("وضع السكر", "drop30", "عدّ الكارب في كل وجبة + سجل قياساتك ومداك. معلومات عامة — مش بديل عن دكتورك.", (R) => {
      const cfg = Object.assign({ carbMeal: 45 }, ld("sp30_sugar", {}));
      const lg = card("سجّل قياس", "drop30", "gold");
      let ctx = (() => { const h = new Date().getHours(); return h < 9 ? "fast" : h >= 22 ? "bed" : "rand"; })();
      const inp = el("input", "v30-in"); inp.type = "number"; inp.inputMode = "numeric"; inp.placeholder = "القراءة mg/dL";
      const note = el("input", "v30-in"); note.placeholder = "ملاحظة (اختياري)"; note.maxLength = 80; note.style.marginTop = "8px";
      const out = el("div");
      const gap = el("div"); gap.style.height = "8px"; lg.append(chips(GCTX, ctx, (v) => { ctx = v; }), gap, inp, note);
      const sb = btn("سجّل القراءة", "gold wide", () => { const e = gluAdd(inp.value, ctx, note.value); if (!e) return say("اكتب قراءة بين ٢٠ و٦٠٠", "info"); hap(30); const [k, t] = gluWarn(e.v, e.ctx); out.replaceChildren(); const w = el("div", "v30-warn " + k); w.append(ic(k === "ok" ? "check30" : "alert30"), el("span", null, t)); out.append(w); inp.value = ""; note.value = ""; drawStats(); }, "plus30");
      sb.style.marginTop = "10px"; lg.append(sb, out); R.append(lg);
      const stc = el("div"); R.append(stc);
      const drawStats = () => {
        stc.replaceChildren(); const s14 = gluStats(14);
        const c = card("آخر ١٤ يوم", "trend30");
        if (!s14) { c.append(el("div", "v30-mut", "لسه مفيش قراءات.")); stc.append(c); return; }
        const k = el("div", "v30-kpis"); k.append(kpi(nf(s14.avg), "المتوسط mg/dL"), kpi(nf(s14.tir) + "٪", "في المدى ٧٠–١٨٠"), kpi(nf(s14.lo) + " / " + nf(s14.hi), "هبوط / ارتفاع")); c.append(k);
        c.append(canvas(190, (x, w, h) => {
          const L = s14.list, t0 = Date.now() - 14 * 864e5, lo = 40, hi = Math.max(260, ...L.map((z) => z.v)) + 10; const X = (t) => w - 10 - (t - t0) / (14 * 864e5) * (w - 40), Y = (v) => 10 + (hi - v) / (hi - lo) * (h - 30);
          x.fillStyle = "rgba(16,185,129,.12)"; x.fillRect(30, Y(180), w - 40, Y(70) - Y(180));
          x.strokeStyle = "rgba(255,255,255,.07)"; x.fillStyle = "rgba(233,255,246,.5)"; x.textAlign = "left"; [70, 180, 250].forEach((v) => { x.beginPath(); x.moveTo(30, Y(v)); x.lineTo(w - 10, Y(v)); x.stroke(); x.fillText(nf(v), 2, Y(v) + 4); });
          x.strokeStyle = "rgba(233,255,246,.25)"; x.lineWidth = 1; x.beginPath(); L.forEach((z, i) => { i ? x.lineTo(X(z.t), Y(z.v)) : x.moveTo(X(z.t), Y(z.v)); }); x.stroke();
          L.forEach((z) => { x.fillStyle = z.v < 70 ? "#ef4444" : z.v > 180 ? "#fb923c" : "#34d399"; x.beginPath(); x.arc(X(z.t), Y(z.v), 3.5, 0, 7); x.fill(); });
          x.fillStyle = "rgba(233,255,246,.5)"; x.textAlign = "center"; [0, 7, 14].forEach((dd) => x.fillText(dd ? "قبل " + nf(dd) + " يوم" : "النهارده", X(Date.now() - dd * 864e5), h - 5));
        }));
        // شريط الوقت في المدى
        const tirb = el("div", "v30-bar"); tirb.style.height = "12px"; tirb.style.display = "flex"; const n = s14.n; [["#ef4444", s14.lo], ["#34d399", n - s14.lo - s14.hi], ["#fb923c", s14.hi]].forEach(([col, v]) => { const i = el("i"); i.style.background = col; i.style.width = (v / n * 100) + "%"; i.style.borderRadius = "0"; tirb.append(i); }); c.append(tirb);
        if (s14.eA1c) c.append(el("div", "v30-note", "السكر التراكمي التقديري (eA1c) ≈ " + nf(s14.eA1c, 1) + "٪ — محسوب من متوسط قراءاتك بمعادلة ADAG، وده تقدير بس ومش بيغني عن تحليل HbA1c في المعمل."));
        else c.append(el("div", "v30-note", "التراكمي التقديري بيظهر بعد ١٤ قراءة على مدى أسبوع على الأقل."));
        const recent = s14.list.slice(-6).reverse(); recent.forEach((z) => { const li = el("div", "v30-li"); const nn = el("div", "n"); nn.append(el("b", null, nf(z.v) + " mg/dL · " + (GCTX.find((g) => g[0] === z.ctx) || [0, ""])[1]), el("small", null, new Date(z.t).toLocaleString("ar-EG", { weekday: "short", hour: "numeric", minute: "2-digit" }) + (z.note ? " · " + z.note : ""))); const dl = el("button", "v30-ib"); dl.setAttribute("aria-label", "امسح"); dl.append(ic("x30")); dl.onclick = () => { sv("sp30_glu", gluList().filter((q) => q.t !== z.t)); drawStats(); }; li.append(nn, dl); c.append(li); });
        stc.append(c);
      };
      drawStats();
      const cc = card("عدّ الكارب النهارده", "leaf30"); const day = getD(dayKey(new Date())); const MEALN = { b: "الفطار", l: "الغدا", d: "العشا", s: "سناكس" };
      cc.append(el("div", "v30-mut", "حصة الكارب = ١٥ جم. حد الوجبة اللي حاطه: " + nf(cfg.carbMeal) + " جم (غيّره مع دكتورك)."));
      ["b", "l", "d", "s"].forEach((m) => { const its = (day.items || []).filter((i) => (i.m || "s") === m); const cg = its.reduce((a, i) => a + (+i.c || 0) * (+i.q || 1), 0); const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, MEALN[m] + " · " + nf(cg) + " جم كارب"), el("small", null, nf(cg / 15, 1) + " حصة كارب" + (its.length ? " · " + its.map((i) => i.n).slice(0, 3).join("، ") : ""))); n.append(bar(cg / Math.max(1, cfg.carbMeal) * 100)); li.append(n); if (cg > cfg.carbMeal * 1.2 && m !== "s") li.append(ic("alert30")); cc.append(li); });
      cc.append(el("div", "v30-mut", "حد الكارب للوجبة:"), chips([[30, "٣٠"], [45, "٤٥"], [60, "٦٠"], [75, "٧٥"]], cfg.carbMeal, (v) => { cfg.carbMeal = v; sv("sp30_sugar", cfg); viewSugar(); }));
      R.append(cc);
      R.append(el("div", "v30-note", "المدى المستخدم هنا عام (صايم ٨٠–١٣٠، بعد الأكل بساعتين أقل من ١٨٠ — إرشادات ADA). مداك الشخصي وجرعاتك يحددهم دكتورك. التطبيق مش بيحسب جرعات إنسولين."));
    });
  }

  /* ================= 8) تقرير للدكتور ================= */
  function reportData() {
    const days = intakeSeries(30), logged = days.filter((d) => d.n > 0), tg = TG(), p = prof() || {};
    const ws = weightSeries(); const w30 = ws.days.filter((d) => (Date.now() - d.d) / 864e5 <= 30);
    const fs = fastSt(); const f30 = fs.hist.filter((h) => Date.now() - h.e <= 30 * 864e5);
    return { days, logged, tg, p, avg: { k: mean(logged.map((d) => d.kcal)), p: mean(logged.map((d) => d.p)), c: mean(logged.map((d) => d.c)), f: mean(logged.map((d) => d.f)), water: mean(days.filter((d) => d.water).map((d) => d.water)), steps: mean(days.filter((d) => d.steps).map((d) => d.steps)) }, w30, wStart: w30.length ? w30[0].trend : null, wEnd: w30.length ? w30[w30.length - 1].trend : null, glu: gluStats(30), fasts: f30 };
  }
  function buildReportDoc(doc) {
    const r = reportData(); const E = (t, c, x) => { const e = doc.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
    const st2 = E("style"); st2.textContent = "body{font-family:Plex,'IBM Plex Sans Arabic',system-ui,'Segoe UI',Tahoma,sans-serif;direction:rtl;color:#0b1f17;margin:28px;font-size:13px}h1{margin:0;font-size:22px;color:#065f46}h2{font-size:15px;color:#065f46;border-bottom:2px solid #f5c76b;padding-bottom:4px;margin-top:22px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #d1e7dd;padding:6px 8px;text-align:start}th{background:#ecfdf5}.m{color:#5b6b64;font-size:11px}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.b{border:1px solid #d1e7dd;border-radius:10px;padding:8px;text-align:center}.b b{display:block;font-size:17px}img{max-width:100%}@media print{body{margin:12mm}}";
    doc.head.append(st2); const B = doc.body; B.replaceChildren();
    let nm = ""; try { nm = (typeof FB !== "undefined" && FB.user && FB.user.name) || ""; } catch (e) {}
    B.append(E("h1", null, "تقرير متابعة التغذية — سعراتي"), E("div", "m", (nm ? nm + " · " : "") + "آخر ٣٠ يوم حتى " + new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })));
    B.append(E("h2", null, "البيانات الأساسية")); const g = E("div", "g"); const bx = (v, l) => { const d = E("div", "b"); d.append(E("b", null, v), E("span", null, l)); g.append(d); };
    bx(r.p.age ? nf(r.p.age) : "—", "السن"); bx(r.p.sex === "m" ? "ذكر" : r.p.sex ? "أنثى" : "—", "النوع"); bx(r.p.height ? nf(r.p.height) + " سم" : "—", "الطول"); bx(r.tg.bmi ? nf(r.tg.bmi, 1) : "—", "مؤشر كتلة الجسم"); B.append(g);
    B.append(E("h2", null, "الأكل (متوسط الأيام المسجّلة)")); const t = E("table"); const tr = (a, b, c) => { const x = E("tr"); x.append(E("td", null, a), E("td", null, b), E("td", null, c)); t.append(x); };
    const th = E("tr"); ["البند", "المتوسط", "الهدف"].forEach((h) => th.append(E("th", null, h))); t.append(th);
    tr("السعرات", nf(r.avg.k), nf(r.tg.kcal)); tr("بروتين (جم)", nf(r.avg.p), nf(r.tg.p)); tr("كربوهيدرات (جم)", nf(r.avg.c), nf(r.tg.c)); tr("دهون (جم)", nf(r.avg.f), nf(r.tg.f)); tr("مية (كوباية)", r.avg.water ? nf(r.avg.water, 1) : "—", nf(st().waterGoal || 8)); tr("خطوات", r.avg.steps ? nf(r.avg.steps) : "—", "—"); tr("أيام مسجّلة", nf(r.logged.length) + " / ٣٠", "—"); B.append(t);
    B.append(E("h2", null, "الوزن"));
    if (r.wStart != null) { B.append(E("div", null, "الوزن الاتجاهي (منعّم): من " + nf(r.wStart, 1) + " إلى " + nf(r.wEnd, 1) + " كجم (" + (r.wEnd - r.wStart >= 0 ? "+" : "") + nf(r.wEnd - r.wStart, 1) + " كجم)" + (r.p.target ? " · الوزن المستهدف " + nf(r.p.target, 1) : ""))); try { const m = weightModel(); if (m.ok && m.ws.raw.length > 1) { const cv = doc.createElement("canvas"); const w = 640, h = 220; cv.width = w * 2; cv.height = h * 2; const x = cv.getContext("2d"); x.scale(2, 2); x.fillStyle = "#06120e"; x.fillRect(0, 0, w, h); x.font = "11px sans-serif"; drawWeight(x, w, h, m, 30); const im = E("img"); im.src = cv.toDataURL("image/png"); im.alt = "منحنى الوزن"; B.append(im); } } catch (e) {} }
    else B.append(E("div", "m", "مفيش أوزان كفاية."));
    B.append(E("h2", null, "قياسات السكر"));
    if (r.glu) { const t2 = E("table"); const r2 = (a, b) => { const x = E("tr"); x.append(E("td", null, a), E("td", null, b)); t2.append(x); }; r2("عدد القراءات", nf(r.glu.n)); r2("المتوسط mg/dL", nf(r.glu.avg)); r2("الوقت في المدى ٧٠–١٨٠", nf(r.glu.tir) + "٪"); r2("قراءات أقل من ٧٠", nf(r.glu.lo)); r2("قراءات أعلى من ١٨٠", nf(r.glu.hi)); if (r.glu.eA1c) r2("eA1c تقديري (ADAG)", nf(r.glu.eA1c, 1) + "٪"); B.append(t2);
      const t3 = E("table"); const h3 = E("tr"); ["الوقت", "القراءة", "الحالة", "ملاحظة"].forEach((h) => h3.append(E("th", null, h))); t3.append(h3); r.glu.list.slice(-40).forEach((z) => { const x = E("tr"); x.append(E("td", null, new Date(z.t).toLocaleString("ar-EG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })), E("td", null, nf(z.v)), E("td", null, (GCTX.find((q) => q[0] === z.ctx) || [0, ""])[1]), E("td", null, z.note || "")); t3.append(x); }); B.append(E("div", "m", "آخر القراءات:"), t3); }
    else B.append(E("div", "m", "مفيش قراءات مسجّلة."));
    if (r.fasts.length) { B.append(E("h2", null, "الصيام المتقطع")); B.append(E("div", null, nf(r.fasts.length) + " مرة صيام · متوسط " + nf(mean(r.fasts.map((h) => (h.e - h.s) / 36e5)), 1) + " ساعة")); }
    B.append(E("h2", null, "آخر ١٤ يوم")); const t4 = E("table"); const h4 = E("tr"); ["اليوم", "سعرات", "بروتين", "كارب", "دهون"].forEach((h) => h4.append(E("th", null, h))); t4.append(h4);
    r.days.slice(-14).forEach((d) => { const x = E("tr"); x.append(E("td", null, dateAr(d.d, { weekday: "short", day: "numeric", month: "short" })), E("td", null, d.n ? nf(d.kcal) : "—"), E("td", null, d.n ? nf(d.p) : "—"), E("td", null, d.n ? nf(d.c) : "—"), E("td", null, d.n ? nf(d.f) : "—")); t4.append(x); }); B.append(t4);
    B.append(E("p", "m", "البيانات مسجّلة ذاتيًا من المستخدم في تطبيق سعراتي، والقيم الغذائية تقديرية. التقرير للمساعدة في المتابعة وليس تشخيصًا."));
    return r;
  }
  function reportHTML() { const doc = D.implementation.createHTMLDocument("تقرير سعراتي"); const mc = doc.createElement("meta"); mc.setAttribute("charset", "utf-8"); doc.head.prepend(mc); doc.documentElement.setAttribute("dir", "rtl"); doc.documentElement.setAttribute("lang", "ar"); buildReportDoc(doc); return "<!doctype html>" + doc.documentElement.outerHTML; }
  function printReport() {
    try {
      let fr = D.getElementById("v30print"); fr && fr.remove(); fr = el("iframe"); fr.id = "v30print"; fr.style.cssText = "position:fixed;width:0;height:0;border:0;inset-inline-start:-9999px"; D.body.append(fr);
      const doc = fr.contentDocument; doc.open(); doc.write('<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>تقرير سعراتي</title></head><body></body></html>'); doc.close();
      buildReportDoc(doc); setTimeout(() => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { saveReport(); } }, 350);
    } catch (e) { saveReport(); }
  }
  function saveReport() {
    const html = reportHTML(), name = "sorati-report-" + dayKey(new Date()) + ".html";
    try { if (W.Android && Android.saveB64) { Android.saveB64(name, btoa(unescape(encodeURIComponent(html))), "text/html"); say("اتحفظ التقرير", "check"); return; } if (W.Android && Android.saveFile) { Android.saveFile(name, html); say("اتحفظ التقرير", "check"); return; } } catch (e) {}
    try { const a = el("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = name; D.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); say("اتحفظ التقرير", "check"); } catch (e) { say("مقدرناش نحفظ الملف", "info"); }
  }
  function viewReport() {
    view("تقرير للدكتور", "doc30", "ملخص ٣٠ يوم جاهز للطباعة أو الحفظ PDF ووريه لدكتورك أو أخصائي التغذية.", (R) => {
      const r = reportData();
      const c = card(null, null, "gold"); const k = el("div", "v30-kpis"); k.append(kpi(nf(r.logged.length), "يوم مسجّل"), kpi(nf(r.avg.k), "متوسط سعرات"), kpi(r.wStart != null ? (r.wEnd - r.wStart >= 0 ? "+" : "") + nf(r.wEnd - r.wStart, 1) : "—", "تغيّر الوزن")); c.append(k);
      const k2 = el("div", "v30-kpis"); k2.style.marginTop = "8px"; k2.append(kpi(nf(r.avg.p), "بروتين جم"), kpi(nf(r.avg.c), "كارب جم"), kpi(r.glu ? nf(r.glu.avg) : "—", "متوسط السكر")); c.append(k2); R.append(c);
      const pv = card("معاينة", "doc30"); const fr = el("iframe"); fr.style.cssText = "width:100%;height:340px;border:0;border-radius:14px;background:#fff"; fr.setAttribute("sandbox", "allow-same-origin"); pv.append(fr); R.append(pv);
      setTimeout(() => { try { const d2 = fr.contentDocument; d2.open(); d2.write('<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"></head><body></body></html>'); d2.close(); buildReportDoc(d2); } catch (e) {} }, 60);
      const r1 = el("div", "v30-row"); r1.append(btn("اطبع / PDF", "gold", printReport, "print30"), btn("احفظ ملف", "sec", saveReport, "doc30"), btn("شارك ملخص", "sec", () => { const t = "ملخص سعراتي (٣٠ يوم): متوسط " + nf(r.avg.k) + " سعرة، بروتين " + nf(r.avg.p) + " جم، كارب " + nf(r.avg.c) + " جم" + (r.wStart != null ? "، الوزن " + nf(r.wStart, 1) + "←" + nf(r.wEnd, 1) + " كجم" : "") + (r.glu ? "، متوسط السكر " + nf(r.glu.avg) + " mg/dL ووقت في المدى " + nf(r.glu.tir) + "٪" : "") + "."; try { if (W.Android && Android.share) Android.share(t); else if (navigator.share) navigator.share({ text: t }); else navigator.clipboard.writeText(t).then(() => say("اتنسخ", "check")); } catch (e) {} }, "share30"));
      R.append(r1);
    });
  }

  /* ================= 9) خطة بميزانية ================= */
  // [id, الاسم, الحصة, سعرات, بروتين, السعر التقريبي للحصة ج.م (٢٠٢٦), وجبات, جرامات الحصة, وحدة الشرا]
  const STAPLES = [
    ["ful", "فول مدمس بزيت خفيف", "طبق ٢٠٠ جم", 230, 14, 14, "b,d", 200, "فول"], ["egg", "بيضة مسلوقة", "بيضة", 75, 6.3, 7, "b,d,l", 50, "بيض"], ["areesh", "جبنة قريش", "١٠٠ جم", 98, 12, 9, "b,d", 100, "جبنة قريش"], ["white", "جبنة بيضا", "٥٠ جم", 140, 8, 8, "b,d", 50, "جبنة بيضا"],
    ["taam", "طعمية", "٣ أقراص", 165, 6, 8, "b", 75, "طعمية"], ["bread", "عيش بلدي", "رغيف", 250, 9, 3, "b,l,d", 100, "عيش بلدي"], ["oats", "شوفان بلبن", "٤٠ جم + كوباية لبن", 270, 13, 16, "b,d", 40, "شوفان + لبن"], ["yog", "زبادي", "علبة ١٠٥ جم", 75, 4, 10, "b,d", 105, "زبادي"],
    ["milk", "لبن", "كوباية ٢٥٠ مل", 150, 8, 12, "b,d", 250, "لبن"], ["halawa", "حلاوة طحينية", "٣٠ جم", 160, 4, 6, "b", 30, "حلاوة"], ["tuna", "تونة مصفّاة", "نص علبة", 110, 22, 32, "d,l", 80, "تونة"], ["sard", "سردين", "علبة صغيرة", 190, 20, 30, "d", 90, "سردين"],
    ["rice", "رز أبيض مطبوخ", "كوباية", 205, 4, 4, "l", 160, "رز (ني)"], ["pasta", "مكرونة مسلوقة", "كوباية", 220, 8, 4, "l", 140, "مكرونة (ني)"], ["lent", "شوربة عدس", "طبق", 230, 15, 9, "l,d", 300, "عدس أصفر"], ["koshari", "كشري بيتي", "طبق متوسط", 450, 14, 18, "l", 350, "رز+عدس+مكرونة"],
    ["chick", "فراخ مشوية", "ربع فرخة بدون جلد", 260, 34, 38, "l", 150, "فراخ"], ["breast", "صدور فراخ", "١٢٠ جم مطبوخ", 200, 37, 42, "l", 120, "صدور فراخ"], ["liver", "كبدة فراخ", "١٢٠ جم", 200, 29, 22, "l,d", 120, "كبدة فراخ"], ["tilapia", "بلطي مشوي", "سمكة متوسطة", 220, 40, 35, "l", 200, "بلطي"],
    ["beef", "لحمة مفرومة قليلة الدهن", "١٠٠ جم مطبوخ", 250, 26, 45, "l", 100, "لحمة مفرومة"], ["fasolia", "فاصوليا بيضا", "طبق", 260, 15, 12, "l", 250, "فاصوليا بيضا"], ["lobia", "لوبيا", "طبق", 240, 14, 12, "l", 250, "لوبيا"], ["potato", "بطاطس مسلوقة", "حباية متوسطة", 160, 4, 4, "l", 180, "بطاطس"],
    ["sweetp", "بطاطا", "حباية متوسطة", 180, 4, 6, "b,d,l", 180, "بطاطا"], ["veg", "خضار سوتيه/صينية", "طبق", 140, 4, 10, "l", 250, "خضار مشكل"], ["molo", "ملوخية", "طبق", 110, 4, 9, "l", 250, "ملوخية"], ["salad", "سلطة خضرا", "طبق", 50, 2, 6, "l,d,b", 200, "طماطم+خيار+خس"],
    ["cucum", "خيار", "٢ حباية", 30, 1, 3, "b,d", 200, "خيار"], ["tomato", "طماطم", "٢ حباية", 35, 1.7, 3, "b,d", 200, "طماطم"], ["banana", "موز", "صباع", 105, 1.3, 5, "b,d", 120, "موز"], ["orange", "برتقال", "حباية", 70, 1.3, 3, "b,d", 180, "برتقال"],
    ["guava", "جوافة", "حباية", 70, 2.6, 5, "d,b", 120, "جوافة"], ["dates", "بلح", "٣ حبات", 70, .6, 4, "d,b", 25, "بلح"], ["peanut", "سوداني", "٣٠ جم", 170, 7, 6, "d", 30, "سوداني"], ["mesh", "جبنة رومي", "٣٠ جم", 115, 7, 10, "b", 30, "جبنة رومي"],
    ["tahini", "طحينة", "معلقة كبيرة", 90, 3, 4, "l,d", 15, "طحينة"], ["freekeh", "فريك مطبوخ", "كوباية", 210, 8, 7, "l", 160, "فريك"], ["peas", "بسلة بالجزر", "طبق", 170, 8, 9, "l", 250, "بسلة"], ["mackerel", "ماكريل مشوي", "سمكة صغيرة", 260, 24, 28, "l", 150, "ماكريل"],
  ].map(([id, n, u, k, p, price, meals, g, buy]) => ({ id, n, u, k, p, price, meals: meals.split(","), g, buy }));
  const S9 = (id) => STAPLES.find((x) => x.id === id);
  const MEAL_TPL = {
    b: [["ful", "egg", "areesh", "taam", "oats", "white", "mesh", "halawa", "yog"], ["bread", "sweetp", null], ["cucum", "tomato", "salad", "banana", "orange", null]],
    l: [["chick", "breast", "liver", "tilapia", "beef", "lent", "fasolia", "lobia", "koshari", "mackerel", "egg"], ["rice", "pasta", "bread", "potato", "freekeh", null], ["veg", "molo", "salad", "peas", null]],
    d: [["yog", "areesh", "egg", "tuna", "sard", "ful", "milk", "white", "lent"], ["bread", "oats", "sweetp", null], ["guava", "banana", "dates", "cucum", "tomato", "peanut", null]],
  };
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function planBudget(budget, kcalT, protT, mult, seed) {
    const R = rng(seed); const pick = (a) => a[Math.floor(R() * a.length)];
    let best = null;
    for (let it = 0; it < 4000; it++) {
      const meals = {}; let K = 0, P = 0, C = 0;
      for (const m of ["b", "l", "d"]) { const its = []; MEAL_TPL[m].forEach((slot, si) => { const id = pick(slot); if (!id) return; const s = S9(id); let q = 1; if (si === 1 && (id === "bread" || id === "rice") && R() < .35) q = id === "bread" ? .5 : 1.5; if (si === 0 && id === "egg" && R() < .7) q = 2; if (si === 0 && id === "egg" && R() < .2) q = 3; its.push({ s, q }); K += s.k * q; P += s.p * q; C += s.price * q * mult; }); meals[m] = its; }
      const share = { b: K ? meals.b.reduce((a, x) => a + x.s.k * x.q, 0) / K : 0 };
      const ids = ["b", "l", "d"].flatMap((m) => meals[m].map((x) => x.s.id)).filter((id) => id !== "bread"); const dup = ids.length - new Set(ids).size;
      let sc = Math.abs(K - kcalT) / kcalT * 3 + Math.max(0, protT - P) / protT * 2 + (C > budget ? (C - budget) / budget * 6 + .5 : -.15 * (1 - C / budget)) + (share.b < .15 || share.b > .4 ? .3 : 0) + dup * .25;
      if (!best || sc < best.sc) best = { sc, meals, K, P, C };
    }
    return best;
  }
  function viewBudget() {
    view("خطة بميزانية", "wallet30", "حدد ميزانيتك اليومية بالجنيه ونطلعلك ٣ وجبات مصرية تقرّبك من هدفك وبروتين كويس.", (R) => {
      const cfg = Object.assign({ budget: 120, mult: 1, seed: 1 }, ld("sp30_budget", {})); const tg = TG(); const tt = todayTarget();
      const c = card(null, null, "gold");
      const big = el("div", "v30-big"); const bv = el("span"); big.append(bv, el("small", null, " ج.م / يوم")); c.append(big);
      const rg = el("input", "v30-rng"); rg.type = "range"; rg.min = "40"; rg.max = "400"; rg.step = "5"; rg.value = String(cfg.budget); bv.textContent = nf(cfg.budget);
      rg.oninput = () => { bv.textContent = nf(+rg.value); }; rg.onchange = () => { cfg.budget = +rg.value; sv("sp30_budget", cfg); drawPlan(); };
      c.append(rg, el("div", "v30-mut", "الأسعار تقريبية لـ٢٠٢٦ وبتفرق من منطقة لمنطقة — ظبّطها بالمؤشر ده:"));
      c.append(chips([[.85, "أرخص ١٥٪"], [1, "عادي"], [1.2, "أغلى ٢٠٪"], [1.4, "أغلى ٤٠٪"]], cfg.mult, (v) => { cfg.mult = v; sv("sp30_budget", cfg); drawPlan(); }));
      R.append(c);
      const out = el("div"); R.append(out);
      const drawPlan = () => {
        const pl = planBudget(cfg.budget, tt.kcal || tg.kcal, tt.p || tg.p, cfg.mult, cfg.seed * 7919 + Math.floor(cfg.budget));
        out.replaceChildren();
        const sm = card(null); const k = el("div", "v30-kpis"); k.append(kpi(nf(pl.K), "سعرة (هدفك " + nf(tt.kcal || tg.kcal) + ")"), kpi(nf(pl.P) + " جم", "بروتين"), kpi(nf(pl.C) + " ج", pl.C <= cfg.budget ? "في الميزانية ✓" : "فوق الميزانية")); sm.append(k);
        if (pl.C > cfg.budget * 1.02) sm.append(el("div", "v30-warn hi", "الميزانية دي صعب تكفي هدفك كامل — زوّدها شوية أو هنقرّب على أد ما نقدر."));
        { const tgK = +(tt.kcal || tg.kcal) || 0, gap = Math.round(tgK - (+pl.K || 0)); if (tgK > 0 && (+pl.K || 0) < tgK * 0.85) { const w = el("div", "v30-warn lo"); w.append(ic("alert30"), el("span", null, "الخطة دي أقل من احتياجك بـ " + nf(gap) + " سعر — زوّد الميزانية أو كمّل بوجبة خفيفة")); sm.append(w); } }
        out.append(sm);
        const MN = { b: ["الفطار", "flame30"], l: ["الغدا", "leaf30"], d: ["العشا", "moon30"] };
        for (const m of ["b", "l", "d"]) { const mc = card(MN[m][0], MN[m][1]); let k2 = 0, p2 = 0, c2 = 0; pl.meals[m].forEach(({ s, q }) => { k2 += s.k * q; p2 += s.p * q; c2 += s.price * q * cfg.mult; const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, (q !== 1 ? nf(q, 1) + " × " : "") + s.n), el("small", null, s.u + " · " + nf(s.k * q) + " سعرة · " + nf(s.p * q, 1) + " جم بروتين")); li.append(n, el("b", null, nf(s.price * q * cfg.mult) + " ج")); mc.append(li); });
          mc.append(el("div", "v30-mut", "≈ " + nf(k2) + " سعرة · " + nf(p2) + " جم بروتين · " + nf(c2) + " ج.م"));
          const lb = btn("سجّل الوجبة دي", "sec wide", () => { let n = 0; pl.meals[m].forEach(({ s, q }) => { if (logFood({ id: "v30b_" + s.id, n: s.n, sv: s.u, k: s.k, p: s.p, c: 0, f: 0 }, q, m)) n++; }); say("اتسجّلت " + MN[m][0], "check"); }, "plus30"); lb.style.marginTop = "6px"; mc.append(lb); out.append(mc); }
        const gl = card("قائمة المشتريات", "cart30"); let days = 7; const lst = el("div");
        const drawG = () => { lst.replaceChildren(); const agg = new Map(); ["b", "l", "d"].forEach((m) => pl.meals[m].forEach(({ s, q }) => { const a = agg.get(s.buy) || { g: 0, price: 0, n: s.buy }; a.g += s.g * q * days; a.price += s.price * q * days * cfg.mult; agg.set(s.buy, a); })); let tot = 0; [...agg.values()].sort((a, b) => b.price - a.price).forEach((a) => { tot += a.price; const li = el("div", "v30-li"); const n = el("div", "n"); n.append(el("b", null, a.n), el("small", null, a.g >= 1000 ? "≈ " + nf(a.g / 1000, 1) + " كجم" : "≈ " + nf(a.g) + " جم")); li.append(n, el("b", null, nf(a.price) + " ج")); lst.append(li); }); lst.append(el("div", "v30-mut", "الإجمالي التقريبي: " + nf(tot) + " ج.م لـ" + nf(days) + (days === 1 ? " يوم" : " أيام") + " (الوزن مطبوخ/جاهز تقريبًا)")); };
        gl.append(chips([[1, "يوم"], [7, "أسبوع"]], days, (v) => { days = v; drawG(); }), lst); drawG();
        const sh = btn("شارك القايمة", "sec wide", () => { const t = "قايمة مشتريات سعراتي:\n" + [...lst.querySelectorAll(".v30-li")].map((li) => "• " + li.querySelector("b").textContent + " — " + li.querySelector("small").textContent).join("\n"); try { if (W.Android && Android.share) Android.share(t); else if (navigator.share) navigator.share({ text: t }); else navigator.clipboard.writeText(t).then(() => say("اتنسخت", "check")); } catch (e) {} }, "share30"); sh.style.marginTop = "6px"; gl.append(sh); out.append(gl);
        const again = btn("اقتراح تاني", "gold wide", () => { cfg.seed = (cfg.seed || 1) + 1; sv("sp30_budget", cfg); drawPlan(); }, "gem30"); out.append(again);
        out.append(el("div", "v30-note", "الأسعار والقيم الغذائية تقريبية (أسعار سوق مصرية تقديرية ٢٠٢٦)، والهدف إنها تساعدك تخطط مش فاتورة."));
      };
      drawPlan();
    });
  }

  /* ================= 10) تقرير المدرب الأسبوعي ================= */
  function coachReport() {
    const tg = TG(), wk = intakeSeries(14), cur = wk.slice(7), prev = wk.slice(0, 7);
    const s = st(), wg = +s.waterGoal || 8;
    const lg = (a) => a.filter((d) => d.n > 0);
    const L = lg(cur), Lp = lg(prev);
    const avgK = mean(L.map((d) => d.kcal)), avgKp = mean(Lp.map((d) => d.kcal));
    const adh = L.filter((d) => Math.abs(d.kcal - tg.kcal) <= tg.kcal * .1).length;
    const protDays = L.filter((d) => d.p >= tg.p * .9).length;
    const water = mean(cur.map((d) => d.water)), steps = mean(cur.filter((d) => d.steps).map((d) => d.steps));
    let late = 0, all = 0; cur.forEach((d) => d.items.forEach((i) => { if (!i.t) return; all++; const h = new Date(i.t).getHours(); if (h >= 23 || h < 4) late++; }));
    const wend = cur.filter((d) => [4, 5].includes(d.d.getDay()) && d.n), wday = cur.filter((d) => ![4, 5].includes(d.d.getDay()) && d.n);
    const wendJump = wend.length && wday.length ? mean(wend.map((d) => d.kcal)) - mean(wday.map((d) => d.kcal)) : 0;
    const m = weightModel(); const ws = m.ok ? m.ws.days : []; const wChg = ws.length > 7 ? ws[ws.length - 1].trend - ws[ws.length - 8].trend : null;
    const goal = +(prof() || {}).goal || 0; const wGood = wChg == null ? null : goal < 0 ? wChg < -0.05 : goal > 0 ? wChg > 0.05 : Math.abs(wChg) < 0.3;
    const fs = fastSt(); const fDone = fs.hist.filter((h) => Date.now() - h.e < 7 * 864e5 && (h.e - h.s) / 36e5 >= h.goal * .95).length;
    const glu = gluStats(7);
    const parts = [["التسجيل", L.length / 7, 25], ["الالتزام بالسعرات", L.length ? adh / L.length : 0, 25], ["البروتين", L.length ? protDays / L.length : 0, 20], ["المية", clamp(water / wg, 0, 1), 15], ["الحركة", steps ? clamp(steps / 8000, 0, 1) : .3, 15]];
    let score = Math.round(parts.reduce((a, [, v, w]) => a + v * w, 0)); if (wGood) score = Math.min(100, score + 5); if (late / Math.max(1, all) > .2) score -= 5; score = clamp(score, 0, 100);
    const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 45 ? "D" : "E";
    const wins = [], risks = [];
    if (L.length >= 6) wins.push("سجّلت " + nf(L.length) + " أيام من ٧ — ده أساس أي نتيجة."); else if (L.length <= 3) risks.push("سجّلت " + nf(L.length) + " أيام بس؛ الأيام اللي مش متسجّلة هي اللي بتخبّي الزيادة.");
    if (L.length && adh / L.length >= .6) wins.push(nf(adh) + " أيام كنت في حدود ١٠٪ من هدفك.");
    else if (L.length && avgK > tg.kcal * 1.12) risks.push("متوسطك " + nf(avgK) + " سعرة، أعلى من هدفك بـ" + nf(avgK - tg.kcal) + ".");
    else if (L.length && avgK < tg.kcal * .75) risks.push("متوسطك " + nf(avgK) + " — أقل بكتير من هدفك؛ الحرمان بيرجّع بأكل زيادة بعدين.");
    if (L.length && protDays / L.length >= .7) wins.push("البروتين كان كفاية في " + nf(protDays) + " أيام 💪"); else if (L.length) risks.push("البروتين وصل للهدف " + nf(protDays) + " أيام بس — زوّد بيض/زبادي/فول/فراخ.");
    if (water >= wg * .9) wins.push("المية ممتازة: متوسط " + nf(water, 1) + " كوباية."); else risks.push("المية متوسطها " + nf(water, 1) + " من " + nf(wg) + " — خلي زجاجة جنبك.");
    if (steps >= 8000) wins.push("متوسط خطواتك " + nf(steps) + " — حركة حلوة."); else if (steps) risks.push("الخطوات " + nf(steps) + " في اليوم؛ ١٥ دقيقة مشي بعد الغدا هتفرق.");
    if (wGood === true) wins.push("وزنك الحقيقي " + (wChg < 0 ? "نزل " : "زاد ") + nf(Math.abs(wChg), 2) + " كجم في أسبوع وماشي مع هدفك.");
    if (wGood === false && wChg != null) risks.push("وزنك الحقيقي اتحرك " + nf(wChg, 2) + " كجم — عكس هدفك أو ثابت. شوف «حرقك الحقيقي».");
    if (wendJump > 300) risks.push("الخميس والجمعة أعلى بـ" + nf(wendJump) + " سعرة في المتوسط — جرّب ميزانية الأسبوع.");
    if (late / Math.max(1, all) > .2) risks.push("أكتر من ٢٠٪ من أكلك بعد ١١ بالليل.");
    if (fDone >= 3) wins.push("كمّلت " + nf(fDone) + " صيام متقطع الأسبوع ده.");
    if (glu) { if (glu.tir >= 70) wins.push("السكر في المدى " + nf(glu.tir) + "٪ من الوقت."); else risks.push("السكر في المدى " + nf(glu.tir) + "٪ بس — راجع الكارب في الوجبات مع دكتورك."); if (glu.lo) risks.push(nf(glu.lo) + " قراءات هبوط — خلي معاك سكر سريع."); }
    const worst = parts.slice().sort((a, b) => a[1] - b[1])[0][0];
    const FOCUS = { "التسجيل": "سجّل كل وجبة أول ما تخلّصها — حتى لو تقريبي.", "الالتزام بالسعرات": "جهّز وجبتين من الأسبوع من دلوقتي وخلي العشا الأخف.", "البروتين": "ابدأ كل وجبة بمصدر بروتين: ٢ بيض، زبادي، فول، أو فراخ.", "المية": "كوباية مية قبل كل وجبة = ٣ كوبايات من غير مجهود.", "الحركة": "١٥ دقيقة مشي بعد الغدا كل يوم الأسبوع ده." };
    return { score, grade, parts, wins: wins.slice(0, 4), risks: risks.slice(0, 4), focus: FOCUS[worst], avgK, avgKp, logged: L.length, protDays, water, steps, wChg };
  }
  function viewCoach() {
    view("تقرير المدرب الأسبوعي", "medal30", "آخر ٧ أيام من بياناتك الحقيقية — من غير نت.", (R) => {
      const r = coachReport();
      const c = card(null, null, "gold"); const row = el("div", "v30-row");
      const ring = canvas(130, (x, w, h) => { const cx = Math.min(w, 130) / 2 + (w - Math.min(w, 130)), cy = h / 2, rr = 52; x.lineCap = "round"; x.lineWidth = 11; x.strokeStyle = "rgba(255,255,255,.07)"; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.stroke(); const g = x.createLinearGradient(cx - rr, 0, cx + rr, 0); g.addColorStop(0, "#34d399"); g.addColorStop(1, "#f5c76b"); x.strokeStyle = g; x.beginPath(); x.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * r.score / 100); x.stroke(); x.fillStyle = "#fde68a"; x.textAlign = "center"; x.font = "800 30px system-ui,sans-serif"; x.fillText(r.grade, cx, cy + 4); x.font = "12px system-ui,sans-serif"; x.fillStyle = "rgba(233,255,246,.6)"; x.fillText(nf(r.score) + "/١٠٠", cx, cy + 24); });
      ring.style.width = "130px"; ring.style.flex = "none";
      const info = el("div"); info.style.flex = "1"; info.append(el("b", null, r.score >= 80 ? "أسبوع قوي 👑" : r.score >= 60 ? "أسبوع كويس — فيه مساحة" : "أسبوع محتاج شدّة"), el("div", "v30-mut", "متوسط " + nf(r.avgK) + " سعرة" + (r.avgKp ? " (الأسبوع اللي قبله " + nf(r.avgKp) + ")" : "")));
      row.append(ring, info); c.append(row);
      r.parts.forEach(([n, v]) => { const li = el("div"); li.style.marginTop = "8px"; const t = el("div", "v30-row"); t.append(el("span", null, n), el("div", "v30-sp"), el("b", null, nf(v * 100) + "٪")); li.append(t, bar(v * 100)); c.append(li); });
      R.append(c);
      const w = card("اللي عملته صح", "check30"); (r.wins.length ? r.wins : ["لسه بنجمع بيانات — سجّل أكلك ووزنك والأسبوع الجاي هنقولك."]).forEach((t) => { const li = el("div", "v30-li"); li.append(el("span", null, "✅"), el("div", "n", t)); w.append(li); }); R.append(w);
      if (r.risks.length) { const k = card("خلّي بالك من", "alert30"); r.risks.forEach((t) => { const li = el("div", "v30-li"); li.append(el("span", null, "⚠️"), el("div", "n", t)); k.append(li); }); R.append(k); }
      const f = card("تركيز الأسبوع الجاي", "gem30", "gold"); f.append(el("b", null, r.focus)); R.append(f);
      const sh = btn("شارك تقريري", "sec wide", () => { const t = "تقريري في سعراتي: " + r.grade + " (" + nf(r.score) + "/١٠٠)\n" + r.wins.map((x) => "✅ " + x).join("\n") + "\nتركيز الأسبوع: " + r.focus; try { if (W.Android && Android.share) Android.share(t); else if (navigator.share) navigator.share({ text: t }); else navigator.clipboard.writeText(t).then(() => say("اتنسخ", "check")); } catch (e) {} }, "share30"); R.append(sh);
    });
  }

  /* ================= الهَب: مركز القوة ================= */
  const TILES = [
    ["tdee", "حرقك الحقيقي", "TDEE من أكلك ووزنك", "flame30", true, viewTDEE],
    ["trend", "منحنى الوزن", "الحقيقي + توقّع الوصول", "trend30", false, viewTrend],
    ["fast", "الصيام المتقطع", "١٦:٨ · OMAD · مراحل الجسم", "clock30", false, viewFast],
    ["ramadan", "وضع رمضان", "سحور وفطار ومية", "moon30", false, viewRamadan],
    ["boost", "أكل غني بـ", "بروتين · حديد · ألياف…", "search30", false, viewBoost],
    ["week", "ميزانية الأسبوع", "هدف لكل يوم + ترحيل", "week30", true, viewWeek],
    ["sugar", "وضع السكر", "كارب وقياسات", "drop30", false, viewSugar],
    ["report", "تقرير للدكتور", "PDF لآخر ٣٠ يوم", "doc30", false, viewReport],
    ["budget", "خطة بميزانية", "٣ وجبات بالجنيه", "wallet30", false, viewBudget],
    ["coach", "تقرير المدرب", "تقييم أسبوعك", "medal30", false, viewCoach],
  ];
  function hub(keep) {
    if (!keep || !ROOT || !ROOT.isConnected) sheet(); if (!ROOT) return;
    ROOT.replaceChildren();
    const h = el("div", "v30-hd"); const t = el("h2"); t.append(ic("gem30"), el("span", null, "مركز القوة")); const x = el("button", "v30-ib"); x.setAttribute("aria-label", "قفل"); x.append(ic("x30")); x.onclick = () => { try { closeM(); } catch (e) {} }; h.append(t, x); ROOT.append(h);
    const pm = premium(); ROOT.append(el("div", "v30-sub", pm ? "أدوات المحترفين كلها مفتوحة ليك 👑" : "أدوات متقدمة — اللي عليها تاج في بريميوم."));
    const r = (() => { try { return ramadan(); } catch (e) { return null; } })();
    const f = fastSt();
    if ((r && r.active) || f.on) { const s = card(null, null, "gold"); s.style.cursor = "pointer"; const row = el("div", "v30-row"); if (f.on) { const e2 = (Date.now() - f.start) / 36e5; row.append(ic("clock30"), el("b", null, "صايم " + nf(e2, 1) + " من " + nf(f.hrs) + " ساعة")); s.onclick = () => viewFast(); } else { row.append(ic("moon30"), el("b", null, (r.fasting ? "المغرب " : "الإمساك ") + hmAr(+r.next.at.split(":")[0] + r.next.at.split(":")[1] / 60))); s.onclick = () => viewRamadan(); } s.append(row); ROOT.append(s); }
    const g = el("div", "v30-grid");
    TILES.concat(W.V30_EXTRA || []).filter(([k]) => on(k)).forEach(([k, n, sub, icn, prem, fn], i) => {
      const b = el("button", "v30-tile" + (prem ? " pm" : "")); b.style.animationDelay = RM() ? "0s" : i * 45 + "ms";
      const ti = el("div", "v30-ti"); ti.append(ic(icn)); b.append(ti, el("b", null, n), el("small", null, sub));
      if (prem) { const cr = el("span", "v30-cr"); cr.append(ic(pm ? "crown30" : "lock30")); b.append(cr); }
      if (k === "tdee" && tdeeDue()) b.append(el("span", "v30-badge", "جديد"));
      b.onclick = () => { hap(); fn(); };
      g.append(b);
    });
    ROOT.append(g);
    ROOT.append(el("div", "v30-note", "كل الحسابات بتتعمل على موبايلك من بياناتك. معلومات عامة ومش بديل عن استشارة طبية."));
  }
  function open(which) { const t = TILES.concat(W.V30_EXTRA || []).find((x) => x[0] === which); if (t && on(t[0])) { sheet(); t[5](); } else hub(); }

  /* ================= الزرار العايم وكارت الرئيسية ================= */
  function fab() {
    if (!on("fab") || D.getElementById("v30fab")) return;
    const b = el("button", "v30fab"); b.id = "v30fab"; b.setAttribute("aria-label", "مركز القوة"); b.append(ic("gem30"));
    const y = ld("sp30_fab_y", 104); D.documentElement.style.setProperty("--v30fb", clamp(y, 70, innerHeight - 120) + "px");
    if (tdeeDue() || fastSt().on) b.append(el("i", "v30-dot"));
    let sy = 0, sb = 0, moved = false;
    b.addEventListener("pointerdown", (e) => { sy = e.clientY; sb = ld("sp30_fab_y", 104); moved = false; try { b.setPointerCapture(e.pointerId); } catch (_) {} });
    b.addEventListener("pointermove", (e) => { if (!sy) return; const dy = sy - e.clientY; if (Math.abs(dy) > 6) moved = true; if (moved) D.documentElement.style.setProperty("--v30fb", clamp(sb + dy, 70, innerHeight - 120) + "px"); });
    b.addEventListener("pointerup", (e) => { if (moved) sv("sp30_fab_y", clamp(sb + (sy - e.clientY), 70, innerHeight - 120)); sy = 0; });
    b.addEventListener("click", (e) => { if (moved) { moved = false; e.preventDefault(); return; } hap(); hub(); });
    D.body.append(b);
  }
  function homeCard() {
    D.getElementById("v30hc")?.remove(); if (!on("homecard") || !on("ramadan")) return;
    let r; try { r = ramadan(); } catch (e) { return; } if (!r.active) return;
    const home = D.getElementById("t-home"); if (!home) return;
    const c = el("div", "v30hc"); c.id = "v30hc"; c.setAttribute("role", "button");
    const tx = el("div"); const b = el("b"); const sm = el("small"); tx.append(b, sm); const t = el("div", "t");
    c.append(ic("moon30"), tx, t); c.onclick = () => { hap(); sheet(); viewRamadan(); };
    const upd = () => { if (!c.isConnected) return clearInterval(tm); const rr = ramadan(); const m = rr.next.minutes; b.textContent = rr.fasting ? "صايم — فاضل على المغرب" : "فاضل على الإمساك"; sm.textContent = "الإمساك " + hmAr(+rr.imsak.split(":")[0] + rr.imsak.split(":")[1] / 60) + " · المغرب " + hmAr(+rr.iftar.split(":")[0] + rr.iftar.split(":")[1] / 60) + " · " + rr.cityName; t.textContent = pad(Math.floor(m / 60)) + ":" + pad(m % 60); };
    const top = home.querySelector(".top"); top ? top.after(c) : home.prepend(c);
    const tm = setInterval(upd, 30000); upd();
  }

  /* ================= API ================= */
  W.V30 = {
    open, hub,
    ramadan: (d) => ramadan(d),
    prayerTimes: (d, lat, lng, tz) => { const p = prayerTimes(d || new Date(), lat, lng, tz); return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, hm(v)])); },
    isRamadan: (d) => isRamadanDay(d),
    tdee: () => tdeeEstimate(), applyTDEE: () => { const e = tdeeEstimate(); if (e.ready && premium()) applyTDEE(e); return e; },
    weight: () => { const m = weightModel(); return m.ok ? { trend: m.trend, ratePerWeek: m.rate * 7, goal: m.goalW, eta: m.eta ? dk(m.eta) : null } : null; },
    todayTarget,
    fast: { state: fastSt, start: (h) => fastStart(h), stop: () => fastStop(), streak: () => fastStreak() },
    glucose: { add: (v, ctx, note) => gluAdd(v, ctx, note), list: gluList, stats: (days) => gluStats(days || 14) },
    boost: (nut) => boostRank(nut || "p").sort((a, b) => b.per100 - a.per100).slice(0, 20).map((x) => ({ n: x.f.n, per100kcal: x.per100, perServing: x.amt })),
    budget: (egp) => { const tt = todayTarget(); const p = planBudget(+egp || 120, tt.kcal, tt.p, 1, 1); return { kcal: Math.round(p.K), protein: Math.round(p.P), cost: Math.round(p.C), meals: Object.fromEntries(Object.entries(p.meals).map(([m, a]) => [m, a.map(({ s, q }) => ({ n: s.n, q }))])) }; },
    coach: coachReport, reportHTML, printReport, saveReport,
    kit: { view, card, btn, chips, bar, canvas, lockView, premium, el, ic, nf, say, hap, ld, sv, dk, dayKey, dateAr, prof, TG, getD, sumD, intakeSeries, foodsAll, norm, logFood, clamp, mean, addDays, kpi, icons: EXTRA_ICONS },
    off: [...OFF], version: 30,
  };

  /* ================= تشغيل ================= */
  const boot = () => {
    try { fab(); } catch (e) {}
    try { homeCard(); } catch (e) {}
    try { const k = "sp30_ram_day"; const t = dk(new Date()); if (localStorage.getItem(k) !== t) { localStorage.setItem(k, t); fireRam(); } } catch (e) {}
    // إعادة رسم كارت رمضان لما الرئيسية تترسم من جديد
    try { const home = D.getElementById("t-home"); if (home && W.MutationObserver) { let q = 0; new MutationObserver(() => { if (q) return; q = setTimeout(() => { q = 0; if (!D.getElementById("v30hc")) homeCard(); }, 400); }).observe(home, { childList: true }); } } catch (e) {}
  };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", () => setTimeout(boot, 600)); else setTimeout(boot, 600);
})();
