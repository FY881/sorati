/* سعراتي v26 / لوحة الإدارة v23 — طبقة فوق v25 (من غير حذف أي حاجة)
   - كارت «الحر والمية» على الرئيسية (بيستخدم قراءة الطقس الموجودة weather13 / S.wx)
   - المواسم التلقائية: رمضان / العيد / الصيف
   - «إيه الجديد» التفاعلي مرة بعد كل تحديث
   - مركز الخصوصية: تصدير كل بياناتك + مسح الجهاز + خروج من كل الأجهزة
   - مراقبة الأعطال الحقيقية لكل إصدار
   - بانر التحديث داخل التطبيق
   - الطرح التدريجي للميزات + الرسائل المستهدفة (من /v1/boot)
   - أزرار سريعة بإيد واحدة: ضغطة مطوّلة على زرار +
   إيقاف أي جزء: localStorage sp26_off = "heat,season,news,privacy,crash,quick" */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.V26) return;
  const OFF = new Set((localStorage.getItem("sp26_off") || "").split(","));
  const SRV = "https://deputy.sorati-command.workers.dev"; // v40: كان العامل الأصلي (404)
  const APP = W.BUILD && BUILD.app === "admin" ? "admin" : "pro";
  const VC = (W.BUILD && BUILD.vc) || 0, VN = (W.BUILD && BUILD.vn) || "";

  // أيقونات خطية إضافية لـ v26/v27 (نفس أسلوب ICONS بتاع التطبيق)
  const EXTRA_ICONS = {
    power: '<path d="M12 3v9"/><path d="M6.3 7.5a8 8 0 1 0 11.4 0"/>', alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/>', download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8V5M4 13h3M17 13h3M5 19l2.5-2M19 19l-2.5-2M5 7l2.5 2M19 7l-2.5 2"/>',
    pie: '<path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>', tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>', brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>', pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    hand: '<path d="M7 11V6a2 2 0 0 1 4 0v5M11 10V4a2 2 0 0 1 4 0v6M15 10V6a2 2 0 0 1 4 0v8a7 7 0 0 1-12.5 4.3L3.6 14a2 2 0 0 1 3.2-2.4L7 12"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>', undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>', gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  };
  try { if (typeof ICONS !== "undefined") for (const [k, v] of Object.entries(EXTRA_ICONS)) if (!ICONS[k]) ICONS[k] = v; } catch (e) {}
  const el = (t, c, x) => { const e = D.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ic = (n, s) => { const sp = el("span", "i25"); if (typeof ICONS !== "undefined" && ICONS[n]) { const t = D.createElement("template"); t.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[n] + "</svg>"; sp.append(t.content.firstChild); } if (s) sp.style.fontSize = s + "px"; return sp; };
  const say = (m, i) => { try { toast(m, i || "info"); } catch (e) {} };
  const fx = (k) => { try { W.V25 && V25.play(k); } catch (e) {} };
  const call = (n, ...a) => { try { return typeof W[n] === "function" ? W[n](...a) : undefined; } catch (e) {} };

  const css = `
.c26{border-radius:24px;padding:16px 18px;margin:14px 16px;position:relative;overflow:hidden}
.c26 h3{margin:0 0 6px;font-size:var(--s4,17px);display:flex;align-items:center;gap:8px}
.c26 .row26{display:flex;align-items:center;gap:12px}
.c26 .big26{font-size:34px;font-weight:800;line-height:1}
.c26 .sub26{opacity:.75;font-size:var(--s2,13.5px)}
.c26 .btn26{border:0;border-radius:14px;padding:10px 14px;font:inherit;font-weight:800;background:rgba(16,185,129,.18);color:#6ee7b7}
.c26 .btn26.sec{background:rgba(255,255,255,.07);color:inherit}
.c26 .btn26.red{background:rgba(239,68,68,.16);color:#fca5a5}
.heat26{background:linear-gradient(135deg,rgba(251,146,60,.16),rgba(56,189,248,.12));border:1px solid rgba(251,146,60,.25)}
.heat26 .bar26{height:8px;border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:10px}
.heat26 .bar26 i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#10b981);border-radius:8px;transition:width .6s cubic-bezier(.2,.8,.2,1)}
.bc26{background:linear-gradient(135deg,rgba(245,196,81,.14),rgba(16,185,129,.1));border:1px solid rgba(245,196,81,.25)}
.bc26 .x26{position:absolute;top:10px;inset-inline-end:12px;border:0;background:none;color:inherit;opacity:.6;font-size:18px}
.upd26{background:linear-gradient(135deg,#065f46,#0f766e);color:#ecfdf5;border:1px solid rgba(110,231,183,.35)}
.upd26 .btn26{background:#ecfdf5;color:#064e3b}
.priv26 .grid26{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:10px}
/* المواسم */
body.ramadan26 .top{position:relative}
body.ramadan26 .top::after{content:"";position:absolute;inset-inline-start:46%;top:-6px;width:150px;height:62px;pointer-events:none;opacity:.9;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 62'%3E%3Cg fill='none' stroke='%23f5c451' stroke-width='1.4'%3E%3Cpath d='M20 0v14M75 0v8M130 0v18'/%3E%3Cpath d='M14 14h12l3 6-3 14H14l-3-14z' fill='%23f5c45133'/%3E%3Cpath d='M69 8h12l3 6-3 14H69l-3-14z' fill='%23f5c45133'/%3E%3Cpath d='M124 18h12l3 6-3 14h-12l-3-14z' fill='%23f5c45133'/%3E%3C/g%3E%3Cpath d='M104 30a10 10 0 1 0 9 14 8 8 0 1 1-9-14z' fill='%23f5c451'/%3E%3C/svg%3E") no-repeat center/contain;
 animation:sway26 5s ease-in-out infinite;transform-origin:top center}
@keyframes sway26{50%{transform:rotate(2.5deg)}}
body.ramadan26{--g25:#f5c451}
body.eid26 .top h1::after{content:" · عيد سعيد";font-size:.5em;color:#f5c451}
body.summer26 .heat26{border-color:rgba(251,146,60,.5)}
/* أزرار بإيد واحدة */
#q26{position:fixed;inset:0;z-index:9990;background:rgba(3,6,15,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;padding-bottom:calc(110px + env(safe-area-inset-bottom))}
#q26 .wrap{display:grid;grid-template-columns:repeat(2,minmax(120px,160px));gap:12px}
#q26 button{border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:16px 10px;background:rgba(15,23,42,.92);color:#fff;font:inherit;font-weight:800;display:flex;flex-direction:column;align-items:center;gap:8px;animation:pop26 .28s cubic-bezier(.2,.9,.3,1.3) both}
#q26 button .i25{font-size:26px;margin:0}
#q26 button:nth-child(2){animation-delay:.04s}#q26 button:nth-child(3){animation-delay:.08s}#q26 button:nth-child(4){animation-delay:.12s}
@keyframes pop26{from{transform:translateY(20px) scale(.8);opacity:0}}
@media (min-width:900px){#q26{align-items:center;padding:0}}
@media (prefers-reduced-motion:reduce){body.ramadan26 .top::after,#q26 button{animation:none}}
`;
  const st = el("style"); st.textContent = css; (D.head || D.documentElement).append(st);

  // ================= المواسم =================
  // تواريخ تقريبية (حسب الحسابات الفلكية) — بتتعدّل من الخادم لو اتبعت seasons في /v1/boot
  const SEASONS = [
    ["ramadan", "2026-02-18", "2026-03-19"], ["eid", "2026-03-20", "2026-03-22"], ["eid", "2026-05-26", "2026-05-29"],
    ["ramadan", "2027-02-08", "2027-03-09"], ["eid", "2027-03-10", "2027-03-12"], ["eid", "2027-05-16", "2027-05-19"],
    ["ramadan", "2028-01-28", "2028-02-26"], ["eid", "2028-02-27", "2028-02-29"],
  ];
  function season(list) {
    if (OFF.has("season") || localStorage.getItem("sp26_season") === "0") return;
    const d = new Date().toISOString().slice(0, 10), m = new Date().getMonth();
    const hit = (list || SEASONS).find(([, a, b]) => d >= a && d <= b);
    const s = hit ? hit[0] : m >= 5 && m <= 7 ? "summer" : "";
    ["ramadan26", "eid26", "summer26"].forEach((c) => D.body.classList.remove(c));
    if (s) D.body.classList.add(s + "26");
    W.SEASON26 = s;
  }

  // ================= كارت الحر والمية =================
  function heatCard() {
    if (OFF.has("heat")) return;
    const home = D.getElementById("t-home"); if (!home) return;
    let wx = null; try { wx = (W.S && S.wx) || JSON.parse(localStorage.getItem("sp_wx") || "null"); } catch (e) {}
    let water = 0, goal = 8;
    try { const k = dkey(cur), Dd = getDay(k); water = Dd.water || 0; goal = S.waterGoal || 8; } catch (e) {}
    let c = D.getElementById("heat26");
    if (!c) {
      c = el("div", "card glass c26 heat26"); c.id = "heat26";
      const h = el("h3"); h.append(ic("drop"), el("span", null, "الحر والمية"));
      const row = el("div", "row26"); const big = el("div", "big26"); big.id = "heat26t";
      const info = el("div"); info.style.flex = "1"; const a = el("div", null, ""); a.id = "heat26a"; a.style.fontWeight = "700"; const b = el("div", "sub26"); b.id = "heat26b"; info.append(a, b);
      const add = el("button", "btn26 tap"); add.append(ic("plus"), el("span", null, "كوباية")); add.onclick = () => { call("setWater", 1); fx("success"); setTimeout(heatCard, 50); };
      row.append(big, info, add);
      const bar = el("div", "bar26"); bar.append(el("i")); c.append(h, row, bar);
    }
    // مكانه دايمًا بعد كارت «صباح الخير» (أو كارت السعرات)، ومايتحطش أبدًا قبل البانرات اللي واخدة العرض كله
    const anchor = [D.getElementById("h20t"), D.getElementById("hero")].find((a) => a && a.parentNode === home);
    if (anchor) { if (anchor.nextElementSibling !== c) anchor.after(c); }
    else if (!c.isConnected) home.append(c);
    const max = wx && wx.max != null ? Math.round(wx.max) : null;
    c.querySelector("#heat26t").textContent = max != null ? max + "°" : "—";
    c.querySelector("#heat26a").textContent = max == null ? "فعّل الموقع عشان أظبط مَيتك على حر النهارده" : max >= 38 ? "حر شديد النهارده — زوّدنا هدفك " + (wx.extra || 3) + " كوبايات" : max >= 33 ? "حر — زوّدنا هدفك " + (wx.extra || 2) + " كوبايات" : max >= 29 ? "دافي — كوباية زيادة" : "الجو معتدل";
    c.querySelector("#heat26b").textContent = "شربت " + water + " من " + goal + " كوبايات";
    c.querySelector(".bar26 i").style.width = Math.min(100, Math.round((water / Math.max(1, goal)) * 100)) + "%";
  }

  // ================= إيه الجديد =================
  const NEWS = [
    ["bolt", "تحديثات أذكى وأأمن", "لو فيه تحديث مهم هتعرف بعدّاد واضح بوقت السيرفر وإشعارات قليلة في أوقات مناسبة (مش وقت نومك)، والتحديث بيوصل للأجهزة بالتدريج عشان يبقى آمن."],
    ["spark", "واتساب سعراتي 4.0", "شات جديد بالكامل: جروبات وقنوات ومجتمعات، فويس بنص مكتوب، مكالمات، ستيكرات، وكارت وجبة بـ «سجّلها عندي». من تبويب المجتمع."],
    ["bolt", "مساعد في كل محادثة", "@سعراتي يرد بالأرقام، ملخص اللي فاتك، مساعد كتابة، وفويس «فطرت فول» يتسجل لوحده."],
    ["key", "مركز الربط", "Health Connect، الباركود، الصلاة، الطقس والمية، تليجرام، Discord وأكتر — من حسابي."],
    ["moon", "أفكار جديدة في مركز القوة", "توأمك الرقمي، الطباخ الحي، بصمة الجوع، وضع المناسبات، خريطة أكل مصر، ومدرب المكالمة."],
    ["drop", "إيموجي ثلاثية الأبعاد", "أكتر من 1800 إيموجي Fluent 3D وأيقونات أنضف بطابع iOS."],
    ["shield", "خصوصيتك الأول", "المحادثات الخاصة محدش يقدر يفتحها حتى الإدارة، وكل رابط تقدر تفصله بضغطة."],
  ];
  function news() {
    if (OFF.has("news") || APP !== "pro") return;
    const k = "sp26_news"; if (localStorage.getItem(k) === String(VC)) return;
    if (!localStorage.getItem("sp_onb")) { localStorage.setItem(k, String(VC)); return; } // مستخدم جديد: مايحتاجش «الجديد»
    localStorage.setItem(k, String(VC));
    const box = el("div"); box.style.padding = "4px 2px 8px";
    const h = el("h2", null, "الجديد في سعراتي " + VN); h.style.marginTop = "0"; box.append(h);
    NEWS.forEach(([i, t, d], n) => { const r = el("div", "row26"); r.style.cssText = "display:flex;gap:12px;align-items:flex-start;margin:12px 0;animation:pop26 .35s both;animation-delay:" + n * 0.06 + "s"; const x = ic(i, 22); x.style.cssText += ";flex:none;width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,.14)"; const tx = el("div"); tx.append(el("b", null, t), el("div", "sub26", d)); r.append(x, tx); box.append(r); });
    const ok = el("button", "btn26"); ok.className = "btn"; ok.style.width = "100%"; ok.textContent = "يلا بينا"; ok.onclick = () => call("closeM");
    box.append(ok);
    setTimeout(() => { try { openM(""); const sh = D.getElementById("sheet"); sh.append(box); fx("levelup"); } catch (e) {} }, 2500);
  }

  // ================= مركز الخصوصية + خروج من كل الأجهزة =================
  const SECRET = /^(fb_rt|fb_|br25|sp25_sid|.*token.*|.*key.*)$/i;
  function exportData() {
    const out = { app: "سعراتي", vn: VN, at: new Date().toISOString(), sid: localStorage.getItem("sp25_sid") || null, data: {} };
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (SECRET.test(k)) continue; out.data[k] = localStorage.getItem(k); }
    const txt = JSON.stringify(out, null, 1), name = "sorati-data-" + new Date().toISOString().slice(0, 10) + ".json";
    try { if (W.Android && Android.saveText) { Android.saveText(name, txt); say("اتحفظ " + name, "check"); return; } } catch (e) {}
    try { const a = el("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "application/json" })); a.download = name; a.click(); say("اتحفظ " + name, "check"); } catch (e) { say("ماقدرتش أحفظ الملف"); }
  }
  async function logoutAll() {
    if (!confirm("هتخرج من كل الأجهزة اللي داخل منها بحسابك، ومنها الجهاز ده. تكمل؟")) return;
    try { const t = await FB.token(); const r = await fetch(SRV + "/v1/me/logout-all", { method: "POST", headers: { authorization: "Bearer " + t } }); if (!r.ok) throw 0; } catch (e) { return say("محتاج نت وتكون داخل بحسابك"); }
    try { FB.logout(); } catch (e) {}
    say("اتسجّل خروجك من كل الأجهزة", "lock");
  }
  function wipe() {
    if (!confirm("هيتمسح كل اللي على الجهاز ده (اللي متزامن على حسابك هيرجع لما تدخل تاني). متأكد؟")) return;
    if (!confirm("آخر تأكيد: مسح كل البيانات المحلية؟")) return;
    localStorage.clear(); try { indexedDB.databases && indexedDB.databases().then((l) => l.forEach((d) => indexedDB.deleteDatabase(d.name))); } catch (e) {}
    location.reload();
  }
  function privacyCard() {
    if (OFF.has("privacy") || APP !== "pro") return;
    const me = D.getElementById("t-me"); if (!me || D.getElementById("priv26")) return;
    const c = el("div", "card glass c26 priv26"); c.id = "priv26";
    const h = el("h3"); h.append(ic("shield"), el("span", null, "مركز الخصوصية"));
    const p = el("div", "sub26", "بياناتك بتاعتك: خدها معاك أو امسحها في أي وقت.");
    const g = el("div", "grid26");
    const B = (t, i, cls, f) => { const b = el("button", "btn26 tap " + cls); b.append(ic(i), el("span", null, t)); b.onclick = f; g.append(b); };
    B("تصدير كل بياناتي", "share", "", exportData);
    B("خروج من كل الأجهزة", "logout", "sec", logoutAll);
    B("مسح بيانات الجهاز", "trash", "red", wipe);
    c.append(h, p, g);
    const sid = D.getElementById("sid25"); sid ? sid.after(c) : me.append(c);
  }

  // ================= مراقبة الأعطال =================
  const Q = []; let sent = 0;
  function crash(msg, src, line) {
    if (OFF.has("crash") || sent > 20) return;
    msg = String(msg || "").slice(0, 180); if (!msg || /Script error|ResizeObserver/.test(msg)) return;
    const key = msg + "|" + String(src || "").split("/").pop() + ":" + (line || 0);
    if (Q.some((x) => x.k === key)) return;
    Q.push({ k: key, t: Date.now() });
  }
  W.addEventListener("error", (e) => crash(e.message, e.filename, e.lineno));
  W.addEventListener("unhandledrejection", (e) => crash("promise: " + ((e.reason && e.reason.message) || e.reason)));
  setInterval(() => {
    if (!Q.length || !navigator.onLine) return;
    const batch = Q.splice(0, 10); sent += batch.length;
    fetch(SRV + "/v1/telemetry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ app: APP, vc: VC, e: batch.map((x) => x.k) }), keepalive: true }).catch(() => {});
  }, 20000);

  // ================= بانر التحديث + الرسائل المستهدفة + الطرح التدريجي =================
  function bannerCard(id, cls, title, text, btn, onBtn, closable) {
    const home = D.getElementById("t-home"); if (!home || D.getElementById(id)) return;
    const c = el("div", "card c26 " + cls); c.id = id;
    const h = el("h3"); h.append(ic(cls === "upd26" ? "refresh" : "mega"), el("span", null, title));
    c.append(h, el("div", "sub26", text));
    if (btn) { const b = el("button", "btn26 tap", btn); b.style.marginTop = "10px"; b.onclick = onBtn; c.append(b); }
    if (closable) { const x = el("button", "x26", "×"); x.onclick = () => { c.remove(); closable(); }; c.append(x); }
    const top = home.querySelector(".top"); top ? top.after(c) : home.prepend(c);
  }
  function applyBoot(r) {
    if (!r) return;
    const u = r.ver && r.ver.update;
    if (u && /^https:\/\//.test(u.url || "") && localStorage.getItem("sp26_updx") !== String(u.vc))
      bannerCard("upd26", "upd26", "سعراتي " + u.vn + " متاح", "تحديث جديد فيه تحسينات. التنزيل بياخد أقل من دقيقة.", "نزّل التحديث", () => { W.Android && Android.openUrl ? Android.openUrl(u.url) : open(u.url); }, () => localStorage.setItem("sp26_updx", String(u.vc)));
    (r.bc || []).forEach((m) => { const k = "sp26_bc_" + m.id; if (localStorage.getItem(k)) return; bannerCard("bc26_" + m.id, "bc26", m.title || "رسالة من سعراتي", m.text, null, null, () => localStorage.setItem(k, "1")); });
    if (r.ff) for (const [k, v] of Object.entries(r.ff)) localStorage.setItem("sp_ff_" + k, v ? "1" : "0");
    if (r.seasons) season(r.seasons);
  }
  let tries = 0; const wait = setInterval(() => { if (W.V25 && V25.boot) { clearInterval(wait); applyBoot(V25.boot); } else if (++tries > 40) clearInterval(wait); }, 500);

  // ================= أزرار بإيد واحدة =================
  function quick() {
    D.getElementById("q26")?.remove();
    const o = el("div"); o.id = "q26"; const w = el("div", "wrap");
    const A = [["camera", "صوّر أكلك", () => call("scanFood", "food")], ["mic", "قول أكلت إيه", () => call("voiceAdd")], ["drop", "كوباية مية", () => { call("setWater", 1); fx("success"); }], ["scale", "سجّل وزنك", () => call("addWeight")]];
    A.forEach(([i, t, f]) => { const b = el("button", "tap"); b.append(ic(i), el("span", null, t)); b.onclick = (e) => { e.stopPropagation(); o.remove(); f(); }; w.append(b); });
    o.append(w); o.onclick = () => o.remove(); D.body.append(o); fx("tap"); try { W.V25 && V25.vib(12); } catch (e) {}
  }
  function bindQuick() {
    if (OFF.has("quick")) return;
    const fab = D.querySelector("#nav .fab"); if (!fab || fab.__q26) return; fab.__q26 = 1;
    let t = 0, long = false;
    fab.addEventListener("pointerdown", () => { long = false; t = setTimeout(() => { long = true; quick(); }, 450); });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => fab.addEventListener(ev, () => clearTimeout(t)));
    fab.addEventListener("click", (e) => { if (long) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    fab.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // ربط بإعادة رسم الرئيسية الموجودة
  function hookRender() {
    if (typeof W.renderHome !== "function" || W.renderHome.__v26) return false;
    const o = W.renderHome;
    try { W.renderHome = function () { const r = o.apply(this, arguments); try { heatCard(); } catch (e) {} return r; }; W.renderHome.__v26 = 1; renderHome = W.renderHome; } catch (e) {}
    return true;
  }
  W.V26 = { heatCard, season, exportData, logoutAll, quick, crash };
  const start = () => {
    if (APP === "pro") { season(); hookRender(); setTimeout(heatCard, 800); setTimeout(heatCard, 7000); bindQuick(); setTimeout(bindQuick, 2000); news(); }
    setTimeout(privacyCard, 1600);
    D.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("#nav")) setTimeout(privacyCard, 300); }, true);
  };
  D.readyState === "loading" ? D.addEventListener("DOMContentLoaded", start) : start();
})();
