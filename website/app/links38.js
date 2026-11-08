/* مركز الربط — links38.js (LINKS 1–25)
   شاشة واحدة لكل الروابط، حالة كل رابط، وسحب الإذن بضغطة. السيرفر: deputy /v1/app/l38/* (مجاني بس).
   الصدق: اللي محتاج موافقة شركة أو كود أصلي بيظهر «قريبًا» بالسبب، وFitbit «اتقفل». */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.L38) return;
  var API = "https://deputy.sorati-command.workers.dev/v1/app/l38";
  var ic = function (n, s) { return W.IC38 ? W.IC38.svg(n, s) : ""; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ld = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  var sv = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var say = function (m) { try { W.toast ? W.toast(m) : console.log(m); } catch (e) {} };
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var now = function () { return Date.now(); };
  var emo = function (s) { return W.C4 && W.C4.emoText ? W.C4.emoText(s) : esc(s); };
  function G(n) {
    try {
      switch (n) {
        case "FB": return typeof FB !== "undefined" ? FB : W.FB;
        case "AI": return typeof AI !== "undefined" ? AI : W.AI;
        case "dkey": return typeof dkey !== "undefined" ? dkey : W.dkey;
        case "cur": return typeof cur !== "undefined" ? cur : W.cur;
        case "getDay": return typeof getDay !== "undefined" ? getDay : W.getDay;
        case "putDay": return typeof putDay !== "undefined" ? putDay : W.putDay;
        case "addItems18": return typeof addItems18 !== "undefined" ? addItems18 : W.addItems18;
        case "renderMe": return typeof renderMe !== "undefined" ? renderMe : W.renderMe;
      }
    } catch (e) {}
    return W[n];
  }
  function open_(u) { try { W.Android && W.Android.openUrl ? W.Android.openUrl(u) : W.open(u, "_blank", "noopener"); } catch (e) {} }
  function api(op, body, to) {
    var FB = G("FB");
    var p = FB && FB.token ? Promise.resolve(FB.token()).catch(function () {}) : Promise.resolve();
    return p.then(function () {
      if (!FB || !FB.tok) { var e = new Error("سجّل دخول الأول"); e.code = "auth"; throw e; }
      var ac = W.AbortController ? new AbortController() : null, t = setTimeout(function () { try { ac && ac.abort(); } catch (x) {} }, to || 15000);
      return fetch(API + op, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({}, body || {}, { idToken: FB.tok })), signal: ac ? ac.signal : undefined })
        .then(function (r) { clearTimeout(t); return r.json(); }, function () { clearTimeout(t); var e = new Error("مفيش نت"); e.code = "net"; throw e; })
        .then(function (j) { if (!j || j.ok === false) { var e = new Error(MSG[j && j.error] || (j && j.error) || "حصلت مشكلة"); e.code = j && j.error; throw e; } return j; });
    });
  }
  var MSG = { bad_barcode: "الباركود مش صحيح", upstream_429: "الخدمة زحمة دلوقتي، جرّب كمان شوية", upstream_down: "الخدمة مش متاحة دلوقتي", bad_loc: "محتاج موقعك", bad_token: "التوكن مش صحيح", tg_rejected: "تليجرام رفض التوكن", bad_url: "اللينك لازم يبدأ بـ https", no_webhook: "مفيش Webhook متسجّل", busy: "استنى ثانية وجرّب تاني" };
  function geo() {
    var c = ld("l38_geo", null);
    if (c && now() - c.at < 6 * 3600e3) return Promise.resolve(c);
    return new Promise(function (res, rej) {
      if (!navigator.geolocation) return rej(new Error("الموقع مش متاح"));
      navigator.geolocation.getCurrentPosition(function (p) { var g = { lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4), at: now() }; sv("l38_geo", g); res(g); }, function () { rej(new Error("محتاج إذن الموقع")); }, { timeout: 12000, maximumAge: 3600e3 });
    });
  }
  function today() { try { var k = G("dkey")(G("cur")); return { k: k, D: G("getDay")(k) }; } catch (e) { return null; } }
  function daySum() { var t = today(), s = { kcal: 0, p: 0, c: 0, f: 0, n: 0 }; if (t && t.D) (t.D.items || []).forEach(function (x) { s.kcal += +x.k || 0; s.p += +x.p || 0; s.c += +x.c || 0; s.f += +x.f || 0; s.n++; }); return s; }

  // ------------------------------------------------------------ catalogue (honest status per link)
  var L = [
    { id: "google", n: "جوجل بضغطة", i: "drive", c: "#4285f4", g: "حساب", d: "دخول وحساب واحد على كل أجهزتك", st: function () { var FB = G("FB"); return FB && FB.user ? "on" : "off"; }, act: "google" },
    { id: "hc", n: "Health Connect", i: "fitness", c: "#16a34a", g: "صحة", d: "خطوات ونوم ووزن من أي ساعة أو موبايل (سامسونج هيلث بيكتب فيه)", st: function () { return hcSt(); }, act: "hc" },
    { id: "scale", n: "الموازين الذكية", i: "fitness", c: "#0d9488", g: "صحة", d: "وزن شاومي/Zepp/أي ميزان بيكتب في Health Connect", st: function () { return hcSt() === "on" ? "on" : hcSt(); }, act: "hc" },
    { id: "applehealth", n: "Apple Health (استيراد)", i: "heart", c: "#ef4444", g: "صحة", d: "ارفع ملف export.xml أو export.zip من الآيفون — بيتقرا على جهازك بس", act: "ah" },
    { id: "garmin", n: "Garmin", i: "watch", c: "#64748b", g: "صحة", soon: "جارمن بيدّي الـ API بالتقديم بس. لحد ما يتوافق: فعّل مزامنة Garmin Connect مع Health Connect وهتوصل هنا." },
    { id: "strava", n: "Strava", i: "walk", c: "#fc4c02", g: "صحة", soon: "محتاج تسجيل تطبيق سعراتي عند Strava (مجاني) وموافقة على الاستخدام — جاري." },
    { id: "fitbit", n: "Fitbit", i: "watch", c: "#334155", g: "صحة", dead: "جوجل قفلت Fitbit Web API (بيرجع 410 من 2 نوفمبر 2026). البديل: Health Connect." },
    { id: "off", n: "باركود المنتجات", i: "barcode", c: "#f59e0b", g: "أكل", d: "Open Food Facts — اكتب الباركود وخد السعرات فورًا", act: "off" },
    { id: "usda", n: "USDA FoodData", i: "food", c: "#2563eb", g: "أكل", d: "قيم دقيقة للخامات (لكل 100 جم)", act: "usda" },
    { id: "prayer", n: "مواقيت الصلاة", i: "moon", c: "#7c3aed", g: "يومك", d: "Aladhan — مواعيد الأكل والماية حسب الصلاة ورمضان", act: "prayer" },
    { id: "weather", n: "الطقس والمية", i: "sun", c: "#f97316", g: "يومك", d: "Open-Meteo — في الحر هدف المية بيزيد", act: "weather" },
    { id: "maps", n: "أماكن قريبة", i: "map", c: "#22c55e", g: "يومك", d: "أقرب جيم، سوبر ماركت، صيدلية، أكل صحي (OpenStreetMap)", act: "maps" },
    { id: "calendar", n: "التقويم", i: "cal", c: "#0ea5e9", g: "يومك", d: "مواعيد الوجبات والمية في تقويمك كملف تقويم (ics) — من غير صلاحيات", act: "ics" },
    { id: "youtube", n: "YouTube", i: "play2", c: "#ff0000", g: "محتوى", d: "فيديو الوصفة أو التمرين بضغطة", act: "yt" },
    { id: "spotify", n: "Spotify", i: "music", c: "#1db954", g: "محتوى", d: "بلايليست مشي وجيم", act: "spot" },
    { id: "whatsapp", n: "واتساب", i: "wa", c: "#25d366", g: "مشاركة", d: "شارك إنجازك أو ادعي صاحبك", act: "wa" },
    { id: "story", n: "ستوري إنستجرام وتيك توك", i: "ig", c: "#e1306c", g: "مشاركة", d: "صورة ستوري جاهزة بتصميم سعراتي لإنجاز يومك", act: "story" },
    { id: "telegram", n: "بوت تليجرام", i: "tg", c: "#229ed9", g: "مشاركة", d: "سجّل أكلك من تليجرام بكلام أو صورة (بوتك انت)", act: "tg" },
    { id: "webhook", n: "Discord وWebhooks", i: "discord", c: "#5865f2", g: "مشاركة", d: "أي حدث يتبعت لـ Discord أو Zapier أو Make (موقّع HMAC)", act: "hook" },
    { id: "sheets", n: "Sheets / Notion / Excel", i: "doc", c: "#0f9d58", g: "بياناتك", d: "صدّر يومياتك CSV — بيفتح في Google Sheets وNotion وExcel", act: "csv" },
    { id: "drive", n: "نسخة احتياطية", i: "cloud", c: "#1a73e8", g: "بياناتك", d: "نسخة كاملة من بياناتك في ملف تحفظه على Drive أو أي مكان", act: "backup", note: "الرفع التلقائي لمساحة Drive المخفية محتاج تحديث للتطبيق الأصلي — قريبًا." },
    { id: "delivery", n: "طلبات وelmenus", i: "bag", c: "#ff5a00", g: "أكل", d: "«اطلب البديل الصحي» يفتح المطعم (مفيش API للمستخدمين)", act: "deliv" },
    { id: "email", n: "ملخص بالإيميل", i: "bell", c: "#94a3b8", g: "بياناتك", soon: "الإرسال المجاني محتاج صلاحية Gmail حساسة أو خدمة بريد مدفوعة — لحد دلوقتي الملخص الأسبوعي بيوصل كإشعار ورسالة في الشات." },
  ];
  function hcSt() { try { if (!(W.Android23 && W.Android23.hcStatus)) return "na"; var s = W.Android23.hcStatus(); return s === "available" ? (ld("l38_hc", null) ? "on" : "off") : "na"; } catch (e) { return "na"; } }
  var LINKS = {};
  function state(x) {
    if (x.dead) return "dead"; if (x.soon) return "soon";
    if (x.st) return x.st();
    return LINKS[x.id] && LINKS[x.id].on ? "on" : "off";
  }
  var ST = { on: ["متوصل", "#19c58e"], off: ["مش متوصل", "#64748b"], soon: ["قريبًا", "#f59e0b"], dead: ["اتقفل", "#ef4444"], na: ["مش متاح على جهازك", "#64748b"] };

  // ------------------------------------------------------------ UI
  function css() {
    if ($("#l38css")) return;
    var s = D.createElement("style"); s.id = "l38css";
    s.textContent = [
      "#l38{position:fixed;inset:0;z-index:9400;background:radial-gradient(120% 70% at 50% -10%,#0d3a2a 0%,#06100c 60%);color:#eafff6;direction:rtl;display:none;flex-direction:column;font-family:inherit}#l38.on{display:flex}#l38 *{box-sizing:border-box}",
      "#l38 .hd{padding:calc(env(safe-area-inset-top) + 10px) 14px 6px;display:flex;align-items:center;gap:10px}#l38 .big{font-size:30px;font-weight:800;flex:1}",
      "#l38 .ib{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#d9fff0}",
      "#l38 .bd{flex:1;overflow-y:auto;padding:4px 12px 40px}#l38 .sub{color:#8fbfad;font-size:13px;margin:12px 4px 6px;font-weight:700}",
      "#l38 .card{display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);margin-bottom:8px;transition:transform .2s}#l38 .card:active{transform:scale(.98)}",
      "#l38 .ico{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:#fff;flex:none}#l38 .tx{flex:1;min-width:0}#l38 .tx b{display:block;font-size:15.5px}#l38 .tx small{display:block;color:#9cc8b7;font-size:12.5px;line-height:1.5}",
      "#l38 .pill{font-size:11.5px;font-weight:800;padding:3px 9px;border-radius:999px;white-space:nowrap}",
      "#l38 .sug{border:1px solid rgba(246,215,123,.35);background:rgba(246,215,123,.08)}",
      "#l38 .sh{position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;flex-direction:column;justify-content:flex-end;z-index:5}#l38 .shb{background:#10201a;border-radius:26px 26px 0 0;padding:12px 16px calc(env(safe-area-inset-bottom) + 18px);max-height:86%;overflow-y:auto;animation:l38up .38s cubic-bezier(.32,.72,0,1)}@keyframes l38up{from{transform:translateY(100%)}}",
      "#l38 .grab{width:40px;height:5px;border-radius:3px;background:rgba(255,255,255,.25);margin:0 auto 12px}#l38 h3{margin:0 0 10px;font-size:19px}",
      "#l38 .fld{width:100%;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.25);color:#eafff6;font:inherit;font-size:16px;margin:6px 0;outline:0}",
      "#l38 .btn{display:block;width:100%;padding:13px;border:0;border-radius:16px;font:inherit;font-size:16px;font-weight:800;color:#fff;background:linear-gradient(145deg,#1fd69b,#0c8e66);margin-top:10px}#l38 .btn.g{background:rgba(255,255,255,.08)}#l38 .btn.r{background:rgba(239,68,68,.18);color:#ffb4bc}",
      "#l38 .row{display:flex;justify-content:space-between;gap:10px;padding:9px 2px;border-bottom:1px solid rgba(255,255,255,.06);font-size:15px}#l38 .row:last-child{border:0}#l38 .row em{font-style:normal;color:#9cc8b7}",
      "#l38 .note{opacity:.7;font-size:12.5px;margin-top:8px;line-height:1.7}#l38 iframe{width:100%;border:0;border-radius:14px;margin-top:8px}",
      ".l38entry{display:flex;align-items:center;gap:12px;padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(59,130,246,.16),rgba(25,197,142,.08));border:1px solid rgba(96,165,250,.25);margin:10px 0;cursor:pointer}.l38entry .ico{width:46px;height:46px;border-radius:16px;background:linear-gradient(145deg,#3b82f6,#0c8e66);display:flex;align-items:center;justify-content:center;color:#fff;flex:none}.l38entry b{display:block;font-size:16px}.l38entry small{opacity:.75}",
    ].join("");
    D.head.appendChild(s);
  }
  function mount() {
    if ($("#l38")) return;
    css();
    var r = D.createElement("div"); r.id = "l38";
    r.innerHTML = '<div class="hd"><button class="ib" data-a="close" aria-label="رجوع">' + ic("back", 22) + '</button><div class="big">مركز الربط</div></div><div class="bd" id="l38bd"></div>';
    D.body.appendChild(r);
    r.addEventListener("click", click);
  }
  function open() { mount(); $("#l38").classList.add("on"); render(); api("/list", {}).then(function (j) { LINKS = {}; (j.links || []).forEach(function (l) { LINKS[l.id] = l; }); W.L38.inbox = j.inbox; render(); if (j.inbox) pullTg(); }).catch(function () {}); }
  function close() { var r = $("#l38"); if (r) r.classList.remove("on"); }
  function suggestions() {
    var s = [], st = hcSt();
    if (st === "off") s.push(["hc", "عندك Health Connect على الموبايل — اربطه وخطواتك ونومك يتسجلوا لوحدهم"]);
    var g = ld("l38_geo", null), w = ld("l38_wx", null);
    if (!LINKS.weather && !w) s.push(["weather", "شغّل الطقس عشان هدف المية يزيد لوحده في الحر"]);
    var hr = new Date().getHours(); if (!LINKS.prayer && (hr < 6 || hr > 16)) s.push(["prayer", "مواعيد الصلاة بتساعدك تظبط أكلك ومية رمضان"]);
    if (daySum().n > 5 && !LINKS.webhook && !LINKS.telegram) s.push(["telegram", "بتسجّل كتير؟ سجّل من تليجرام بصورة أو كلمة"]);
    return s.slice(0, 2);
  }
  function render() {
    var bd = $("#l38bd"); if (!bd) return;
    var h = "", sg = suggestions();
    if (sg.length) h += '<div class="sub">مقترح ليك</div>' + sg.map(function (x) { var c = L.filter(function (y) { return y.id === x[0]; })[0]; return '<div class="card sug" data-a="open" data-v="' + c.id + '"><div class="ico" style="background:' + c.c + '">' + ic(c.i, 24) + '</div><div class="tx"><b>' + esc(c.n) + "</b><small>" + esc(x[1]) + "</small></div>" + ic("fwd", 18) + "</div>"; }).join("");
    var groups = ["حساب", "صحة", "أكل", "يومك", "محتوى", "مشاركة", "بياناتك"];
    var on = L.filter(function (x) { return state(x) === "on"; }).length;
    h += '<div class="note" style="margin:6px 4px 0">' + on + " من " + L.length + " متوصلين · كل الروابط مجانية، وتقدر تفصل أي واحد بضغطة.</div>";
    groups.forEach(function (g) {
      var list = L.filter(function (x) { return x.g === g; }); if (!list.length) return;
      h += '<div class="sub">' + g + "</div>" + list.map(function (x) {
        var s = state(x), p = ST[s];
        return '<div class="card" data-a="open" data-v="' + x.id + '"><div class="ico" style="background:' + x.c + (s === "dead" ? ";opacity:.45" : "") + '">' + ic(x.i, 24) + '</div><div class="tx"><b>' + esc(x.n) + "</b><small>" + esc(x.d || x.soon || x.dead) + '</small></div><span class="pill" style="background:' + p[1] + "22;color:" + p[1] + '">' + p[0] + "</span></div>";
      }).join("");
    });
    bd.innerHTML = h;
  }
  function sheet(html) { closeSheet(); var s = D.createElement("div"); s.className = "sh"; s.id = "l38sh"; s.innerHTML = '<div class="shb"><div class="grab"></div>' + html + "</div>"; s.addEventListener("click", function (e) { if (e.target === s) closeSheet(); }); $("#l38").appendChild(s); return s; }
  function closeSheet() { var s = $("#l38sh"); if (s) s.remove(); }
  function mark(id, on, meta, secret) { var b = { id: id, on: on !== false }; if (meta) b.meta = meta; if (secret !== undefined) b.secret = secret; return api("/set", b).then(function () { LINKS[id] = { id: id, on: on !== false, meta: meta || (LINKS[id] && LINKS[id].meta) || {} }; render(); }); }
  function unlink(id) { return api("/del", { id: id }).then(function () { delete LINKS[id]; if (id === "hc") localStorage.removeItem("l38_hc"); render(); closeSheet(); say("اتفصل ✅"); }); }
  function footer(id) { return LINKS[id] ? '<button class="btn r" data-a="unlink" data-v="' + id + '">افصل الربط ده</button>' : ""; }

  // ------------------------------------------------------------ actions
  var ACT = {
    google: function () { var FB = G("FB"); sheet("<h3>جوجل</h3>" + (FB && FB.user ? '<div class="row"><span>الحساب</span><em dir="ltr">' + esc(FB.user.email || FB.user.uid) + "</em></div>" : '<div class="note">مش داخل بحساب. ادخل من «أنا» ← تسجيل الدخول.</div>')); },
    hc: function () {
      var s = hcSt();
      if (s === "na") { sheet('<h3>Health Connect</h3><div class="note">Health Connect مش موجود أو مش مدعوم على الجهاز ده. نزّله من Play (أندرويد 9+) وبعدين ارجع هنا.</div>'); return; }
      var d = ld("l38_hc", null);
      sheet("<h3>Health Connect</h3>" + (d ? '<div class="row"><span>آخر قراءة</span><em>' + new Date(d.at).toLocaleString("ar-EG") + "</em></div>" + (d.steps ? '<div class="row"><span>خطوات النهارده</span><em>' + d.steps + "</em></div>" : "") + (d.weight ? '<div class="row"><span>آخر وزن</span><em>' + d.weight + " كجم</em></div>" : "") + (d.nights ? '<div class="row"><span>ليالي نوم اتضافت</span><em>' + d.nights + "</em></div>" : "") : "") +
        '<button class="btn" data-a="hcgo">' + (d ? "حدّث دلوقتي" : "اربط واقرا آخر 14 يوم") + "</button>" + '<div class="note">بنقرا بس (خطوات/نوم/وزن) — مش بنكتب حاجة. تقدر تسحب الإذن من إعدادات Health Connect.</div>' + (d ? '<button class="btn r" data-a="unlink" data-v="hc">افصل</button>' : ""));
    },
    ah: function () { sheet('<h3>استيراد Apple Health</h3><div class="note">على الآيفون: Health ← صورتك ← Export All Health Data. ابعت الملف للموبايل ده واختاره هنا. الملف بيتقرا على جهازك بس.</div><button class="btn" data-a="ahpick">اختار export.zip أو export.xml</button>'); },
    off: function () { sheet('<h3>باركود</h3><input class="fld" id="l38bc" inputmode="numeric" placeholder="رقم الباركود (13 رقم)" dir="ltr"><button class="btn" data-a="offgo">دوّر</button><div id="l38res"></div><div class="note">البيانات من Open Food Facts (قاعدة مفتوحة) — راجع الملصق لو الأرقام غريبة.</div>'); },
    usda: function () { sheet('<h3>USDA FoodData</h3><input class="fld" id="l38q" placeholder="بالإنجليزي: lentils, rice, chicken breast" dir="ltr"><button class="btn" data-a="usdago">دوّر</button><div id="l38res"></div>'); },
    prayer: function () {
      sheet('<h3>مواقيت الصلاة</h3><div id="l38res" class="note">بجيب موقعك…</div>' + footer("prayer"));
      geo().then(function (g) { return api("/prayer", { lat: g.lat, lng: g.lng }); }).then(function (j) {
        var T = j.times, N = { imsak: "الإمساك", fajr: "الفجر", sunrise: "الشروق", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشا" };
        $("#l38res").outerHTML = '<div>' + (j.hijri ? '<div class="note">' + esc(j.hijri.day + " " + j.hijri.month + " " + j.hijri.year) + " هـ</div>" : "") + Object.keys(N).map(function (k) { return '<div class="row"><span>' + N[k] + "</span><em>" + esc(T[k]) + "</em></div>"; }).join("") +
          '<div class="note">نصيحة: كوباية مية بعد كل صلاة = 5 كوبايات من غير ما تفتكر 💧</div></div>';
        sv("l38_prayer", { at: now(), t: T }); if (!LINKS.prayer) mark("prayer", true);
      }).catch(function (e) { var r = $("#l38res"); if (r) r.textContent = e.message; });
    },
    weather: function () {
      sheet('<h3>الطقس والمية</h3><div id="l38res" class="note">بجيب موقعك…</div>' + footer("weather"));
      geo().then(function (g) { return api("/weather", { lat: g.lat, lng: g.lng }); }).then(function (j) {
        sv("l38_wx", { at: now(), j: j });
        $("#l38res").outerHTML = '<div><div class="row"><span>دلوقتي</span><em>' + Math.round(j.temp) + "° (إحساس " + Math.round(j.feels) + "°)</em></div>" + '<div class="row"><span>أعلى النهارده</span><em>' + Math.round(j.tmax) + "°</em></div>" + '<div class="row"><span>الرطوبة</span><em>' + j.hum + "%</em></div>" +
          '<div class="row"><span>مية زيادة النهارده</span><em>' + (j.waterExtraMl ? "+" + j.waterExtraMl + " مل" : "مفيش") + "</em></div><div class=\"note\">بيانات Open-Meteo.</div></div>";
        if (!LINKS.weather) mark("weather", true);
      }).catch(function (e) { var r = $("#l38res"); if (r) r.textContent = e.message; });
    },
    maps: function () {
      sheet("<h3>أماكن قريبة</h3>" + [["gym", "جيم"], ["market", "سوبر ماركت وخضار"], ["healthy", "أكل صحي"], ["pharmacy", "صيدلية"], ["park", "حديقة للمشي"]].map(function (x) { return '<button class="btn g" data-a="pl" data-v="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '<div id="l38res"></div>');
    },
    ics: function () { sheet('<h3>التقويم</h3><div class="note">هيتعمل ملف تقويم فيه فطار/غدا/عشا وتذكير مية كل ساعتين لمدة 30 يوم. افتحه بأي تطبيق تقويم (جوجل/سامسونج) وهيتضاف.</div><input class="fld" id="l38b" type="time" value="08:30"><input class="fld" id="l38l" type="time" value="14:30"><input class="fld" id="l38d" type="time" value="20:30"><button class="btn" data-a="icsgo">اعمل الملف</button>'); },
    yt: function () { sheet('<h3>YouTube</h3><input class="fld" id="l38q" placeholder="وصفة شوفان، تمرين 10 دقايق…"><button class="btn" data-a="ytgo">دوّر في يوتيوب</button><div class="note">بيفتح نتايج يوتيوب في التطبيق بتاعه.</div>'); },
    spot: function () { sheet('<h3>Spotify</h3><iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX70RN3TfWWJh?utm_source=generator&theme=0" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe><div class="note">بلايليست مشي من Spotify (المشغل الرسمي المدمج).</div>'); if (!LINKS.spotify) mark("spotify", true).catch(function () {}); },
    wa: function () { var s = daySum(); var t = "النهارده سجّلت " + Math.round(s.kcal) + " سعر في سعراتي 💪 تعالى نتحدى بعض: https://sorati-610ba.web.app/download/"; open_("https://wa.me/?text=" + encodeURIComponent(t)); },
    story: function () { story(); },
    tg: function () {
      var l = LINKS.telegram, m = l && l.meta || {};
      sheet("<h3>بوت تليجرام</h3>" + (m.bot ? '<div class="row"><span>البوت</span><em dir="ltr">@' + esc(m.bot) + "</em></div>" + '<div class="row"><span>الحالة</span><em>' + (m.linked ? "متربط ✅" : "مستني /start") + "</em></div>" + '<button class="btn" data-a="tgpull">هات الرسايل الجديدة</button>' : "") +
        '<div class="note">١) افتح @BotFather في تليجرام واكتب /newbot وخد التوكن. ٢) حطه هنا. ٣) اضغط اللينك اللي هيظهر عشان تربط شاتك. أي أكلة تبعتها كلام أو صورة هتتسجل لما تفتح سعراتي.</div>' +
        '<input class="fld" id="l38tok" dir="ltr" placeholder="123456789:AA…"><button class="btn' + (m.bot ? " g" : "") + '" data-a="tggo">' + (m.bot ? "غيّر البوت" : "اربط") + "</button>" + footer("telegram"));
    },
    hook: function () {
      var l = LINKS.webhook, ev = (l && l.meta && l.meta.events) || ["meal", "day", "challenge"];
      var E = [["meal", "كل وجبة بتتسجل"], ["day", "ملخص اليوم"], ["weight", "وزن جديد"], ["challenge", "التزام في تحدي"]];
      sheet("<h3>Discord / Webhooks</h3>" + '<input class="fld" id="l38url" dir="ltr" placeholder="' + (l ? "•••• متسجّل (اكتب جديد للتغيير)" : "https://discord.com/api/webhooks/…") + '">' +
        E.map(function (x) { return '<label class="row"><span>' + x[1] + '</span><input type="checkbox" data-ev="' + x[0] + '"' + (ev.indexOf(x[0]) >= 0 ? " checked" : "") + ' style="width:22px;height:22px"></label>'; }).join("") +
        '<button class="btn" data-a="hookgo">حفظ</button>' + (l ? '<button class="btn g" data-a="hooktest">ابعت تجربة</button>' : "") + '<div class="note">الطلبات عليها توقيع x-sorati-signature (HMAC-SHA256) — تقدر تتأكد إنها مننا. اللينك بيتحفظ مشفّر.</div>' + footer("webhook"));
    },
    csv: function () { exportCsv(); },
    backup: function () { sheet('<h3>نسخة احتياطية</h3><div class="note">ملف فيه كل بياناتك المحلية (أكل، وزن، نوم، إعدادات). احفظه على Drive أو ابعته لنفسك.</div><button class="btn" data-a="bkgo">اعمل النسخة</button><button class="btn g" data-a="bkin">استرجع من ملف</button><div class="note">الرفع التلقائي لمساحة Drive المخفية محتاج تحديث للتطبيق الأصلي — قريبًا.</div>'); },
    deliv: function () {
      sheet("<h3>اطلب البديل الصحي</h3>" + [["talabat", "طلبات — سلطات وجريل", "https://www.talabat.com/egypt/restaurants?search=salad"], ["talabat2", "طلبات — أكل صحي", "https://www.talabat.com/egypt/restaurants?search=healthy"], ["elmenus", "elmenus — صحي", "https://www.elmenus.com/cairo/search?q=healthy"]].map(function (x) { return '<button class="btn g" data-a="url" data-v="' + esc(x[2]) + '">' + x[1] + "</button>"; }).join("") + '<div class="note">بيفتح التطبيق أو الموقع. مفيش API للمستخدمين عندهم، فمش بنقرا طلباتك.</div>');
    },
  };

  // ------------------------------------------------------------ helpers per link
  function pullTg() {
    return api("/tg/pull", {}).then(function (j) {
      var items = j.items || []; if (!items.length) { say("مفيش رسايل جديدة"); return; }
      var texts = items.filter(function (x) { return x.text && !x.img; }).map(function (x) { return x.text; }).join("\n");
      var photos = items.filter(function (x) { return x.img; });
      if (texts) api0assist(texts);
      if (photos.length) say("📸 " + photos.length + " صورة وصلت من تليجرام — افتح «عين سعراتي» عشان نحللها");
      W.__l38photos = photos;
    }).catch(function (e) { say(e.message); });
  }
  function api0assist(text) {
    if (!(W.C4 && W.C4.api)) return;
    W.C4.api("/assist", { mode: "food", text: text }, 20000).then(function (j) {
      var it = j.items || []; if (!it.length) { say("ملقتش أكل في رسايل تليجرام"); return; }
      var add = G("addItems18"); if (typeof add !== "function") return;
      if (confirm("من تليجرام: " + it.map(function (x) { return x.n; }).join("، ") + " (" + Math.round(it.reduce(function (a, x) { return a + (x.k || 0); }, 0)) + " سعر). أسجّلهم؟")) { add(it.map(function (x) { return { n: x.n, sv: x.sv, k: x.k, p: x.p, c: x.c, f: x.f, ai: 1 }; })); say("اتسجلوا ✅"); }
    }).catch(function () {});
  }
  function story() {
    var s = daySum(), c = D.createElement("canvas"); c.width = 1080; c.height = 1920; var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 1080, 1920); g.addColorStop(0, "#0f8f67"); g.addColorStop(1, "#03140d"); x.fillStyle = g; x.fillRect(0, 0, 1080, 1920);
    x.fillStyle = "rgba(255,255,255,.08)"; x.beginPath(); x.arc(900, 300, 380, 0, 7); x.fill();
    x.fillStyle = "#fff"; x.textAlign = "center"; x.direction = "rtl";
    x.font = "800 70px sans-serif"; x.fillText("يومي في سعراتي", 540, 420);
    x.font = "900 260px sans-serif"; x.fillStyle = "#ffd166"; x.fillText(String(Math.round(s.kcal)), 540, 860);
    x.font = "700 64px sans-serif"; x.fillStyle = "#eafff6"; x.fillText("سعر", 540, 960);
    [["بروتين", s.p], ["كارب", s.c], ["دهون", s.f]].forEach(function (m, i) { var cx = 220 + i * 320; x.fillStyle = "rgba(0,0,0,.25)"; x.beginPath(); x.roundRect ? x.roundRect(cx - 130, 1080, 260, 220, 40) : x.rect(cx - 130, 1080, 260, 220); x.fill(); x.fillStyle = "#fff"; x.font = "900 80px sans-serif"; x.fillText(Math.round(m[1]) + "g", cx, 1200); x.font = "600 46px sans-serif"; x.fillText(m[0], cx, 1270); });
    x.font = "600 48px sans-serif"; x.fillStyle = "rgba(255,255,255,.85)"; x.fillText("حمّل سعراتي: sorati-610ba.web.app", 540, 1760);
    var url = c.toDataURL("image/png");
    sheet('<h3>ستوري جاهز</h3><img src="' + url + '" style="width:60%;display:block;margin:0 auto;border-radius:18px"><button class="btn" data-a="storyshare">شارك (إنستجرام/تيك توك/واتساب)</button>');
    W.__l38story = url;
  }
  function exportCsv() {
    var rows = [["date", "food", "portion", "kcal", "protein_g", "carbs_g", "fat_g", "meal"]];
    try {
      var getDay = G("getDay"), dkey = G("dkey");
      for (var i = 0; i < 90; i++) { var d = new Date(); d.setDate(d.getDate() - i); var k = dkey(d), Dd = getDay(k); (Dd && Dd.items || []).forEach(function (x) { rows.push([k, x.n, x.sv || "", Math.round(x.k || 0), x.p || 0, x.c || 0, x.f || 0, x.m || ""]); }); }
    } catch (e) {}
    if (rows.length < 2) { say("مفيش أكل متسجّل في آخر 90 يوم"); return; }
    var csv = "\ufeff" + rows.map(function (r) { return r.map(function (v) { v = String(v).replace(/"/g, '""'); return /[",\n]/.test(v) ? '"' + v + '"' : v; }).join(","); }).join("\n");
    save("sorati-diary.csv", csv, "text/csv");
    mark("sheets", true, { at: now(), rows: rows.length - 1 }).catch(function () {});
  }
  function save(name, text, mime) {
    try { if (W.Android && W.Android.saveFile) { W.Android.saveFile(name, text, mime); say("اتحفظ ✅ " + name); return; } } catch (e) {}
    try { if (W.Android && W.Android.saveText) { W.Android.saveText(name, text); say("اتحفظ ✅ " + name); return; } } catch (e) {}
    var a = D.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; D.body.appendChild(a); a.click(); a.remove(); say("اتحفظ ✅ " + name);
  }
  function makeIcs(b, l, dn) {
    var pad = function (n) { return ("0" + n).slice(-2); }, out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sorati//Meals//AR", "CALSCALE:GREGORIAN"];
    var start = new Date(); start.setHours(0, 0, 0, 0);
    var stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    var ymd = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); };
    var ev = function (title, hm, mins, rule) { var p = hm.split(":"); var d = new Date(start); d.setHours(+p[0], +p[1]); var e = new Date(d.getTime() + mins * 60e3);
      out.push("BEGIN:VEVENT", "UID:sorati-" + title.length + "-" + hm.replace(":", "") + "-" + ymd(start) + "@sorati", "DTSTAMP:" + stamp, "DTSTART;TZID=Africa/Cairo:" + ymd(d) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00", "DTEND;TZID=Africa/Cairo:" + ymd(e) + "T" + pad(e.getHours()) + pad(e.getMinutes()) + "00", "RRULE:" + rule, "SUMMARY:" + title, "BEGIN:VALARM", "TRIGGER:-PT5M", "ACTION:DISPLAY", "DESCRIPTION:" + title, "END:VALARM", "END:VEVENT"); };
    ev("🍳 فطار — سجّله في سعراتي", b, 20, "FREQ=DAILY;COUNT=30"); ev("🍲 غدا — سجّله في سعراتي", l, 30, "FREQ=DAILY;COUNT=30"); ev("🥗 عشا — سجّله في سعراتي", dn, 20, "FREQ=DAILY;COUNT=30");
    ["10:00", "12:00", "16:00", "18:00"].forEach(function (h) { ev("💧 كوباية مية", h, 5, "FREQ=DAILY;COUNT=30"); });
    out.push("END:VCALENDAR"); return out.join("\r\n");
  }
  function hcRead() {
    if (!(W.Android23 && W.Android23.hcAsk)) { say("Health Connect مش متاح هنا"); return; }
    W.__l38hc = 1;
    try { W.Android23.hcAsk(); say("بطلب الإذن…"); } catch (e) { say("مقدرتش أطلب الإذن"); }
  }
  // the APK answers on window.onAndroid23("hc", json) — same channel v23x uses for sleep
  try {
    var _oa = W.onAndroid23;
    W.onAndroid23 = function (kind, json) {
      try {
        if (kind === "hc" && W.__l38hc) {
          var o = typeof json === "string" ? JSON.parse(json) : json;
          if (o && o.type === "ask") { if (o.ok || (o.granted || []).length) { try { W.Android23.hcRead(14); } catch (e) {} } else { W.__l38hc = 0; say("مفيش إذن من Health Connect"); } }
          else if (o && o.type === "read") {
            W.__l38hc = 0;
            var rec = { at: now(), nights: (o.sleep || []).length };
            var steps = o.steps || o.stepsDaily || null, wt = o.weight || o.weights || null;
            if (Array.isArray(steps) && steps.length) rec.steps = Math.round(+(steps[steps.length - 1].n || steps[steps.length - 1].count || steps[steps.length - 1].v || 0)) || null; else if (typeof steps === "number") rec.steps = steps;
            if (Array.isArray(wt) && wt.length) rec.weight = +(wt[wt.length - 1].kg || wt[wt.length - 1].v || 0) || null; else if (typeof wt === "number") rec.weight = wt;
            sv("l38_hc", rec); mark("hc", true, { at: rec.at }).catch(function () {}); render(); ACT.hc(); say("⌚ اتقرت بيانات Health Connect");
          }
        }
      } catch (e) {}
      if (typeof _oa === "function") return _oa.apply(this, arguments);
    };
  } catch (e) {}
  function appleHealth(file) {
    var readXml = function (txt) {
      var since = now() - 120 * 864e5, steps = {}, weight = [], n = 0;
      var re = /<Record type="HK(QuantityTypeIdentifierStepCount|QuantityTypeIdentifierBodyMass)"[^>]*?startDate="([^"]+)"[^>]*?value="([^"]+)"/g, m;
      while ((m = re.exec(txt))) {
        var t = Date.parse(m[2].replace(" ", "T").replace(/ ([+-]\d{2})(\d{2})$/, "$1:$2")); if (!(t > since)) continue; n++;
        if (m[1] === "QuantityTypeIdentifierStepCount") { var k = new Date(t).toISOString().slice(0, 10); steps[k] = (steps[k] || 0) + (+m[3] || 0); }
        else weight.push({ t: t, kg: +m[3] });
      }
      var days = Object.keys(steps).length;
      sv("l38_ah", { at: now(), steps: steps, weight: weight.slice(-60) });
      mark("applehealth", true, { at: now(), days: days, weights: weight.length }).catch(function () {});
      sheet("<h3>Apple Health</h3>" + '<div class="row"><span>أيام خطوات</span><em>' + days + "</em></div>" + '<div class="row"><span>قراءات وزن</span><em>' + weight.length + "</em></div>" + (weight.length ? '<div class="row"><span>آخر وزن</span><em>' + weight[weight.length - 1].kg + " كجم</em></div>" : "") + '<div class="note">اتقرا على جهازك واتحفظ محليًا. (' + n + " قراءة في آخر 120 يوم)</div>");
    };
    if (/\.zip$/i.test(file.name)) {
      unzipXml(file).then(readXml).catch(function (e) { say(e.message || "مقدرتش أفتح الملف المضغوط — فكّه وارفع export.xml"); });
    } else { var fr = new FileReader(); fr.onload = function () { readXml(String(fr.result)); }; fr.readAsText(file); }
  }
  function unzipXml(file) {
    // minimal ZIP reader: find apple_health_export/export.xml (deflate) via DecompressionStream
    return file.arrayBuffer().then(function (buf) {
      var u = new Uint8Array(buf), dv = new DataView(buf), i = u.length - 22;
      while (i > 0 && dv.getUint32(i, true) !== 0x06054b50) i--;
      if (i <= 0) throw new Error("ملف zip مش سليم");
      var cd = dv.getUint32(i + 16, true), cnt = dv.getUint16(i + 10, true), p = cd;
      for (var k = 0; k < cnt; k++) {
        var meth = dv.getUint16(p + 10, true), csz = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
        var name = new TextDecoder().decode(u.subarray(p + 46, p + 46 + nl));
        if (/export\.xml$/.test(name) && !/cda/i.test(name)) {
          var lnl = dv.getUint16(lo + 26, true), lel = dv.getUint16(lo + 28, true), st = lo + 30 + lnl + lel, data = u.subarray(st, st + csz);
          if (meth === 0) return new TextDecoder().decode(data);
          if (!W.DecompressionStream) throw new Error("فكّ الملف وارفع export.xml");
          return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text();
        }
        p += 46 + nl + el + cl;
      }
      throw new Error("مش لاقي export.xml جوه الملف");
    });
  }

  // ------------------------------------------------------------ click router
  function click(e) {
    var el = e.target.closest("[data-a]"); if (!el) return;
    var a = el.getAttribute("data-a"), v = el.getAttribute("data-v");
    switch (a) {
      case "close": close(); break;
      case "open": { var x = L.filter(function (y) { return y.id === v; })[0]; if (!x) break; if (x.dead || x.soon) { sheet("<h3>" + esc(x.n) + '</h3><div class="note" style="font-size:15px">' + esc(x.dead || x.soon) + "</div>"); break; } if (ACT[x.act]) ACT[x.act](); break; }
      case "unlink": unlink(v).catch(function (x) { say(x.message); }); break;
      case "url": open_(v); break;
      case "hcgo": hcRead(); break;
      case "ahpick": { var i = D.createElement("input"); i.type = "file"; i.accept = ".zip,.xml,application/zip,text/xml"; i.onchange = function () { if (i.files[0]) appleHealth(i.files[0]); }; i.click(); break; }
      case "offgo": {
        var bc = ($("#l38bc") || {}).value; var res = $("#l38res"); res.innerHTML = '<div class="note">بدوّر…</div>';
        api("/off", { barcode: bc }).then(function (j) {
          if (!j.found) { res.innerHTML = '<div class="note">المنتج مش موجود في Open Food Facts. جرّب تصوير الملصق بعين سعراتي.</div>'; return; }
          W.__l38off = j; var p = j.per100;
          res.innerHTML = '<div class="row"><b>' + esc(j.name || "منتج") + "</b><em>" + esc(j.brand) + "</em></div>" + [["سعرات", p.kcal + " / 100جم"], ["بروتين", p.p + " جم"], ["كارب", p.c + " جم"], ["دهون", p.f + " جم"], ["سكر", p.sugar + " جم"]].map(function (r) { return '<div class="row"><span>' + r[0] + "</span><em>" + r[1] + "</em></div>"; }).join("") +
            '<input class="fld" id="l38g" type="number" value="100" placeholder="الكمية بالجرام"><button class="btn" data-a="offadd">سجّل في يومي</button>';
          if (!LINKS.off) mark("off", true).catch(function () {});
        }).catch(function (x) { res.innerHTML = '<div class="note">' + esc(x.message) + "</div>"; });
        break;
      }
      case "offadd": { var j = W.__l38off, g = +($("#l38g") || {}).value || 100, f = g / 100, add = G("addItems18"); if (!j || typeof add !== "function") break; add([{ n: (j.name || "منتج") + (j.brand ? " (" + j.brand + ")" : ""), sv: g + " جم", k: j.per100.kcal * f, p: j.per100.p * f, c: j.per100.c * f, f: j.per100.f * f }]); say("اتسجل ✅"); closeSheet(); break; }
      case "usdago": {
        var q = ($("#l38q") || {}).value, r2 = $("#l38res"); r2.innerHTML = '<div class="note">بدوّر…</div>';
        api("/usda", { q: q }).then(function (j) { W.__l38usda = j.items || []; r2.innerHTML = (j.items || []).map(function (x, i) { return '<div class="row" data-a="usdaadd" data-v="' + i + '"><span>' + esc(x.name) + "</span><em>" + x.per100.kcal + " سعر · " + x.per100.p + "g بروتين</em></div>"; }).join("") || '<div class="note">مفيش نتايج</div>'; if (!LINKS.usda) mark("usda", true).catch(function () {}); })
          .catch(function (x) { r2.innerHTML = '<div class="note">' + esc(x.message) + (x.code === "upstream_429" ? " (المفتاح المجاني العام زحمة — المالك يقدر يضيف مفتاح USDA مجاني)" : "") + "</div>"; });
        break;
      }
      case "usdaadd": { var it = (W.__l38usda || [])[+v]; var add2 = G("addItems18"); if (!it || typeof add2 !== "function") break; var gg = +prompt("الكمية بالجرام؟", "100") || 100, ff = gg / 100; add2([{ n: it.name, sv: gg + " جم", k: it.per100.kcal * ff, p: it.per100.p * ff, c: it.per100.c * ff, f: it.per100.f * ff }]); say("اتسجل ✅"); break; }
      case "pl": {
        var r3 = $("#l38res"); r3.innerHTML = '<div class="note">بدوّر جنبك…</div>';
        geo().then(function (g) { return api("/places", { lat: g.lat, lng: g.lng, kind: v }).then(function (j) { return { g: g, j: j }; }); }).then(function (o) {
          var items = o.j.items || [];
          r3.innerHTML = items.map(function (p) { return '<div class="row" data-a="url" data-v="' + esc("https://www.google.com/maps/search/?api=1&query=" + p.lat + "," + p.lng) + '"><span>' + esc(p.name) + "<br><small style=\"opacity:.7\">" + esc(p.addr || "") + "</small></span><em>" + p.km + " كم</em></div>"; }).join("") +
            '<button class="btn g" data-a="url" data-v="' + esc("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent({ gym: "gym", market: "supermarket", healthy: "healthy food", pharmacy: "pharmacy", park: "park" }[v] + " near " + o.g.lat + "," + o.g.lng)) + '">افتح في خرائط جوجل</button><div class="note">' + esc(o.j.attribution) + (items.length ? "" : " — مفيش أماكن متسجّلة قريب في الخريطة المفتوحة، خرائط جوجل فيها أكتر.") + "</div>";
          if (!LINKS.maps) mark("maps", true).catch(function () {});
        }).catch(function (x) { r3.innerHTML = '<div class="note">' + esc(x.message) + "</div>"; });
        break;
      }
      case "icsgo": { var ics = makeIcs($("#l38b").value || "08:30", $("#l38l").value || "14:30", $("#l38d").value || "20:30"); save("sorati-meals.ics", ics, "text/calendar"); mark("calendar", true, { at: now() }).catch(function () {}); closeSheet(); break; }
      case "ytgo": { var yq = ($("#l38q") || {}).value || "وصفات صحية"; open_("https://www.youtube.com/results?search_query=" + encodeURIComponent(yq)); mark("youtube", true).catch(function () {}); break; }
      case "storyshare": { var u = W.__l38story; try { if (W.Android && W.Android.shareImage) { W.Android.shareImage(u.split(",")[1], "sorati-story.png"); mark("story", true).catch(function () {}); break; } } catch (x) {} try { if (navigator.share) { fetch(u).then(function (r) { return r.blob(); }).then(function (b) { return navigator.share({ files: [new File([b], "sorati-story.png", { type: "image/png" })] }); }).catch(function () {}); break; } } catch (x) {} var aa = D.createElement("a"); aa.href = u; aa.download = "sorati-story.png"; aa.click(); break; }
      case "tggo": { var tok = ($("#l38tok") || {}).value; api("/tg/setup", { token: String(tok || "").trim() }, 20000).then(function (j) { LINKS.telegram = { id: "telegram", on: true, meta: { bot: j.bot, linked: false } }; render(); sheet('<h3>خطوة أخيرة</h3><div class="note">افتح اللينك ده واضغط Start عشان شاتك يتربط:</div><button class="btn" data-a="url" data-v="' + esc(j.link) + '">افتح @' + esc(j.bot) + "</button>"); }).catch(function (x) { say(x.message); }); break; }
      case "tgpull": pullTg(); break;
      case "hookgo": { var url = ($("#l38url") || {}).value.trim(), evs = []; D.querySelectorAll("#l38sh [data-ev]").forEach(function (c) { if (c.checked) evs.push(c.getAttribute("data-ev")); }); mark("webhook", true, { events: evs }, url ? url : undefined).then(function () { say("اتحفظ ✅"); ACT.hook(); }).catch(function (x) { say(x.message); }); break; }
      case "hooktest": api("/hook/fire", { event: "test", data: { hello: "من سعراتي" }, text: "✅ تجربة من سعراتي" }).then(function (j) { say(j.ok ? "وصلت ✅" : "الطرف التاني رد بـ " + j.status); }).catch(function (x) { say(x.message); }); break;
      case "bkgo": { var dump = {}; try { Object.keys(localStorage).forEach(function (k) { if (!/^(c4_m_|c4_out|l38_geo|fb_|firebase)/.test(k)) dump[k] = localStorage.getItem(k); }); } catch (x) {} save("sorati-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify({ v: 38, at: new Date().toISOString(), data: dump }), "application/json"); mark("drive", true, { at: now() }).catch(function () {}); break; }
      case "bkin": { var fi = D.createElement("input"); fi.type = "file"; fi.accept = ".json,application/json"; fi.onchange = function () { var f = fi.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(r.result); if (!o || !o.data) throw 0; if (!confirm("هترجّع " + Object.keys(o.data).length + " عنصر من نسخة " + (o.at || "") + ". البيانات الحالية اللي بنفس الاسم هتتبدل. تكمّل؟")) return; Object.keys(o.data).forEach(function (k) { localStorage.setItem(k, o.data[k]); }); say("اترجعت ✅ هيعاد التشغيل"); setTimeout(function () { location.reload(); }, 900); } catch (x) { say("الملف مش نسخة سعراتي"); } }; r.readAsText(f); }; fi.click(); break; }
    }
  }

  // ------------------------------------------------------------ hooks into the app
  function entry() {
    var me = D.getElementById("t-me"); if (!me || me.querySelector(".l38entry")) return;
    var e = D.createElement("div"); e.className = "l38entry";
    e.innerHTML = '<div class="ico">' + ic("plug", 24) + '</div><div><b>مركز الربط</b><small>Health Connect، الباركود، الصلاة، الطقس، تليجرام، Discord وأكتر</small></div>';
    e.addEventListener("click", open);
    var first = me.querySelector(".card,.box,section,div"); me.insertBefore(e, first ? first.nextSibling : null);
    css();
  }
  function hookMe() {
    var rm = G("renderMe");
    if (typeof rm === "function" && !rm.__l38) { var w = function () { var r = rm.apply(this, arguments); try { entry(); } catch (e) {} return r; }; w.__l38 = 1; try { W.renderMe = w; } catch (e) {} }
    try { entry(); } catch (e) {}
  }
  // fire outgoing webhook on every meal the app logs (if the user enabled the "meal" event)
  function hookMeals() {
    var add = G("addItems18"); if (typeof add !== "function" || add.__l38) return;
    var wrapped = function (Lst) { var r = add.apply(this, arguments); try { if (LINKS.webhook && LINKS.webhook.on) { var k = (Lst || []).reduce(function (a, x) { return a + (+x.k || +x.kcal || 0); }, 0); api("/hook/fire", { event: "meal", data: { items: (Lst || []).map(function (x) { return x.n || x.name; }), kcal: Math.round(k) }, text: "🍽️ " + (Lst || []).map(function (x) { return x.n || x.name; }).join("، ") + " — " + Math.round(k) + " سعر" }).catch(function () {}); } } catch (e) {} return r; };
    wrapped.__l38 = 1; try { W.addItems18 = wrapped; } catch (e) {}
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { hookMe(); hookMeals(); }); else setTimeout(function () { hookMe(); hookMeals(); }, 0);
  setTimeout(hookMe, 1500);
  W.L38 = { open: open, close: close, list: L, api: api, inbox: 0, _ics: makeIcs };
})();
