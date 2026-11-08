/* سعراتي برو — v36 «العصر الذهبي»: 7 أدوات جوه «مركز القوة» بنفس تصميم v30.
   1) عين سعراتي 2.0: الطبق كله من صورة + المنيو + التلاجة + قارئ التحاليل (من غير تشخيص).
   2) هدف بتاريخ   3) درجة التعافي   4) الأكل والمزاج   5) خزنة صور التقدّم (IndexedDB على الموبايل بس)
   6) ملخصك (Wrapped)   7) العيلة.
   كل البيانات محلية على الجهاز. مفيش أي جرعات أو تشخيص: القرار الطبي للدكتور. */
(function () {
  "use strict";
  var W = window, D = document;
  function boot() {
    if (!W.V30 || !W.V30.kit || !W.V33) return setTimeout(boot, 400);
    if (W.V36) return;
    var K = W.V30.kit, el = K.el, nf = K.nf, card = K.card, btn = K.btn, view = K.view;
    Object.assign(K.icons, {
      eye36: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
      flag36: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
      bat36: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
      mood36: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
      lock36: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
      star36: '<path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/>',
      fam36: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21c0-4 3-6 6-6s6 2 6 6M14 21c0-3 1.5-5 3-5s4 2 4 5"/>',
    });
    var row = function () { var r = el("div", "v36-row"); for (var i = 0; i < arguments.length; i++) arguments[i] && r.append(arguments[i]); return r; };
    var inp = function (ph, type, val) { var i = el("input", "v30-in"); i.placeholder = ph; if (type) { i.type = type; if (type === "number") i.inputMode = "decimal"; } if (val != null && val !== "") i.value = val; return i; };
    var gate = function (R, what) { if (K.premium()) return false; R.append(K.lockView(what)); return true; };
    var today = function () { return K.sumD(K.getD(K.dayKey(new Date()))); };
    var target = function () { try { return +W.V30.todayTarget() || 0; } catch (e) { return 0; } };
    var share = function (t) { try { if (W.Android && Android.share) return Android.share(t); if (navigator.share) return navigator.share({ text: t }); navigator.clipboard.writeText(t); K.say("اتنسخ"); } catch (e) {} };
    var st = el("style"); st.textContent = ".v36-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.v36-row>*{flex:1}.v36-it{display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.07)}.v36-it b{flex:1}.v36-it input{width:64px;flex:none}.v36-pre{white-space:pre-wrap;line-height:1.8;font-size:14px}.v36-ph{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.v36-ph img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:12px}.v36-big{font-size:44px;font-weight:700;color:#fde68a;text-align:center}.v36-note{font-size:12px;opacity:.7;margin-top:8px}";
    D.head.append(st);
    var NOTE_MED = "معلومة عامة مش تشخيص ولا علاج. أي قرار طبي أو جرعة قرار دكتورك.";

    /* ========== 1) عين سعراتي 2.0 ========== */
    var pick = function (cb) {
      var i = D.createElement("input"); i.type = "file"; i.accept = "image/*";
      i.onchange = function () { var f = i.files && i.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { AI.resize(r.result, 1280).then(cb).catch(function () { K.say("مقدرتش أقرا الصورة"); }); }; r.readAsDataURL(f); };
      i.click();
    };
    var aiOk = function () { if (typeof AI === "undefined" || !AI.call) { K.say("الذكاء مش متاح"); return false; } if (AI.ready && !AI.ready()) { K.say("سجّل دخولك الأول عشان الذكاء يشتغل"); return false; } if (AI.left && AI.left() <= 0) { K.say("خلصت محاولات الذكاء النهارده"); return false; } return true; };
    function viewEye(mode) {
      mode = mode || "plate";
      view("عين سعراتي 2.0", "eye36", "صوّر وأنا أفهم: الطبق كله، المنيو، التلاجة، أو ورقة التحليل.", function (R) {
        if (gate(R, "عين سعراتي 2.0 بتقرا الطبق كله والمنيو والتحاليل من صورة.")) return;
        R.append(K.chips([["plate", "🍽️ الطبق"], ["menu", "📋 المنيو"], ["fridge", "🧊 التلاجة"], ["lab", "🧪 التحليل"]], mode, function (v) { viewEye(v); }));
        var out = card(null, null, "gold"); var H = { plate: "صوّر الصينية أو الطبق من فوق. هقسّم كل صنف بحصته وسعراته، وتقدر تعدّل قبل التسجيل.", menu: "صوّر منيو المطعم، وهرشّحلك أحسن 3 اختيارات على قد سعراتك الباقية.", fridge: "صوّر التلاجة أو الرف، وهقترح 3 وجبات مصرية من اللي عندك.", lab: "صوّر ورقة التحليل، وهشرح كل رقم ببساطة وأقولك تسأل الدكتور في إيه." };
        out.append(el("div", "v30-mut", H[mode]), el("div", "v30-sp"), btn("صوّر أو اختار صورة", "gold wide", function () { if (aiOk()) pick(function (im) { run(mode, im, out); }); }, "eye36"));
        if (mode === "lab") out.append(el("div", "v36-note", NOTE_MED));
        R.append(out);
      });
    }
    function run(mode, im, out) {
      out.replaceChildren(el("div", "v30-mut", "بقرا الصورة… ثواني"));
      var left = Math.max(0, Math.round(target() - today().k));
      var P = {
        plate: 'حلل صورة الأكل. قسّم كل صنف ظاهر لوحده (مثلاً رز، ملوخية، فراخ، سلطة، عيش). قدّر الوزن بالجرام من مراجع الحجم في الصورة (الطبق، الرغيف، المعلقة) والحصص المصرية الحقيقية. رد JSON بس: {"items":[{"n":"اسم الصنف بالعربي","g":جرام,"k":سعرات,"p":بروتين,"c":كارب,"f":دهون}],"note":"ملاحظة قصيرة"}. لو مفيش أكل رجّع items فاضية.',
        menu: "اقرا المنيو من الصورة. قدّر سعرات كل صنف تقديرًا تقريبيًا. المستخدم فاضله " + left + " سعرة النهارده. رشّح أحسن 3 اختيارات تناسبه، ولكل واحد السعرات التقريبية وليه، وحاجة واحدة يتجنبها. عامية مصرية، مختصر.",
        fridge: "اتفرج على الصورة وحدد المكونات الظاهرة. اقترح 3 وجبات مصرية صحية سهلة منها، لكل وجبة: الاسم، المكونات، الخطوات في سطرين، والسعرات التقريبية للحصة. عامية مصرية، مختصر.",
        lab: "اقرا ورقة التحليل. لكل بند: الاسم، القيمة، والمدى الطبيعي المكتوب في الورقة نفسها فقط، وهل هي داخل المدى ولا برّه حسب الورقة. اشرح كل بند في سطر بلغة بسيطة. وفي الآخر 3 أسئلة يسألها للدكتور. ممنوع تمامًا: التشخيص، أسماء الأدوية، الجرعات. اختم بـ «راجع دكتورك».",
      };
      AI.call([{ text: P[mode] }, AI.img(im.b64)], { task: "vision", json: mode === "plate" }).then(function (r) {
        out.replaceChildren();
        if (mode !== "plate") { out.append(el("div", "v36-pre", String(r || "مفيش نتيجة"))); if (mode === "lab") out.append(el("div", "v36-note", NOTE_MED)); out.append(el("div", "v30-sp"), btn("صورة تانية", "sec wide", function () { pick(function (x) { run(mode, x, out); }); })); return; }
        var items = (r && r.items || []).filter(function (x) { return x && x.n; });
        if (!items.length) { out.append(el("div", "v30-mut", "مش لاقي أكل واضح في الصورة. جرّب صورة من فوق وفي نور.")); return; }
        var img = el("img"); img.src = im.url; img.style.cssText = "width:100%;border-radius:14px;max-height:220px;object-fit:cover"; out.append(img);
        var rows = items.map(function (x) {
          var g0 = +x.g || 100, it = el("div", "v36-it"), q = inp("جم", "number", Math.round(g0)), kc = el("span", "v30-mut");
          var ck = el("input"); ck.type = "checkbox"; ck.checked = true;
          var upd = function () { var f = (+q.value || 0) / g0; kc.textContent = nf(Math.round((+x.k || 0) * f)) + " سعرة"; };
          q.oninput = upd; upd(); it.append(ck, el("b", null, x.n), q, kc); out.append(it);
          return { x: x, g0: g0, q: q, ck: ck };
        });
        var tot = el("div", "v30-big"); var sumUp = function () { var t = 0; rows.forEach(function (r) { if (r.ck.checked) t += (+r.x.k || 0) * (+r.q.value || 0) / r.g0; }); tot.textContent = nf(Math.round(t)) + " سعرة"; };
        rows.forEach(function (r) { r.q.addEventListener("input", sumUp); r.ck.onchange = sumUp; }); sumUp(); out.append(tot);
        if (r.note) out.append(el("div", "v30-mut", r.note));
        out.append(el("div", "v30-sp"), btn("سجّل الطبق", "gold wide", function () {
          var n = 0; rows.forEach(function (r) { if (!r.ck.checked) return; var f = (+r.q.value || 0) / r.g0; if (f <= 0) return;
            if (K.logFood({ id: "eye36_" + Date.now() + "_" + n, n: r.x.n, sv: Math.round(+r.q.value) + " جم", cat: "عين سعراتي", k: Math.round((+r.x.k || 0) * f), p: +((+r.x.p || 0) * f).toFixed(1), c: +((+r.x.c || 0) * f).toFixed(1), f: +((+r.x.f || 0) * f).toFixed(1) }, 1)) n++; });
          K.hap(30); K.say(n ? "اتسجّل " + nf(n) + " صنف ✔" : "مفيش حاجة اتسجّلت");
        }, "check30"));
      }).catch(function (e) { out.replaceChildren(el("div", "v30-warn", (e && e.message) || "الخدمة مش متاحة دلوقتي")); });
    }

    /* ========== 2) هدف بتاريخ ========== */
    var GK = "sp36_goal";
    function viewGoal() {
      view("هدف بتاريخ", "flag36", "حدد وزن ويوم، وأنا أحسبلك المطلوب كل أسبوع.", function (R) {
        var g = K.ld(GK, null), wm = null; try { wm = W.V30.weight(); } catch (e) {}
        var nowW = (wm && wm.trend) || +((K.prof() || {}).weight) || 0;
        if (g && g.date) {
          var days = Math.ceil((new Date(g.date) - Date.now()) / 864e5), diff = g.target - nowW, wk = Math.max(days, 1) / 7, per = diff / wk;
          var c = card(g.title || "هدفك", "flag36", "gold"); c.style.textAlign = "center";
          c.append(el("div", "v36-big", days > 0 ? nf(days) + " يوم" : "وصلنا اليوم!"), el("div", "v30-mut", "لحد " + K.dateAr(new Date(g.date))));
          var ks = el("div", "v30-kpis"); ks.append(K.kpi(nf(nowW, 1), "وزنك دلوقتي"), K.kpi(nf(g.target, 1), "الهدف"), K.kpi((per > 0 ? "+" : "") + nf(per, 2), "كجم/أسبوع"));
          c.append(ks);
          var span = Math.abs(g.target - g.start) || 1, done = K.clamp(100 * Math.abs(nowW - g.start) / span, 0, 100); c.append(K.bar(done), el("div", "v30-mut", nf(Math.round(done)) + "٪ من المشوار"));
          if (Math.abs(per) > 1) c.append(el("div", "v30-warn", "المعدل ده أسرع من 1 كجم في الأسبوع. الأأمن تبعد التاريخ شوية أو تراجع دكتورك."));
          else if (wm && wm.ratePerWeek != null) c.append(el("div", "v30-mut", "معدلك الحقيقي آخر فترة: " + nf(wm.ratePerWeek, 2) + " كجم/أسبوع" + (Math.sign(wm.ratePerWeek) === Math.sign(per) && Math.abs(wm.ratePerWeek) >= Math.abs(per) * 0.9 ? ". ماشي في الطريق ✔" : ". محتاج تزوّد الالتزام شوية.")));
          R.append(c, btn("غيّر الهدف", "sec wide", function () { K.sv(GK, null); viewGoal(); }));
          return;
        }
        var c2 = card("هدف جديد", "flag36", "gold"), t = inp("المناسبة (فرح، سفر، صيف…)"), tw = inp("الوزن المستهدف (كجم)", "number"), dt = inp("", "date");
        dt.min = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
        c2.append(t, tw, dt, el("div", "v30-mut", "وزنك الحالي: " + (nowW ? nf(nowW, 1) + " كجم" : "سجّل وزنك الأول")), btn("ابدأ العدّاد", "gold wide", function () {
          var T = +tw.value; if (!(T >= 30 && T <= 250)) return K.say("اكتب وزن منطقي"); if (!dt.value || new Date(dt.value) < Date.now()) return K.say("اختار تاريخ جاي"); if (!nowW) return K.say("سجّل وزنك الأول");
          K.sv(GK, { title: t.value.trim().slice(0, 40), target: T, start: nowW, date: dt.value, at: Date.now() }); K.hap(30); viewGoal();
        }, "flag36"));
        R.append(c2);
      });
    }

    /* ========== 3) درجة التعافي ========== */
    function viewRecover() {
      view("درجة التعافي", "bat36", "رقم واحد الصبح يقولك النهارده يوم تمرين تقيل ولا راحة.", function (R) {
        if (gate(R, "درجة تعافي يومية من نومك ونبضك وأكلك ومياهك.")) return;
        var L = K.ld("sp36_rec", []), last = L[L.length - 1], d0 = K.getD(K.dayKey(new Date()));
        var c = card("صباح النهارده", "bat36", "gold"), sl = inp("ساعات النوم", "number", last && last.d === K.dayKey(new Date()) ? last.s : ""), hr = inp("النبض وانت صاحي (اختياري)", "number"), rpe = el("div");
        var effort = 0; rpe.append(el("div", "v30-mut", "تعب امبارح من التمرين؟"), K.chips([[0, "مفيش"], [3, "خفيف"], [6, "متوسط"], [9, "جامد"]], 0, function (v) { effort = +v; }));
        c.append(sl, hr, rpe, btn("احسب", "gold wide", function () {
          var s = +sl.value; if (!(s >= 0 && s <= 16)) return K.say("اكتب ساعات النوم");
          var base = L.filter(function (x) { return x.h; }).slice(-14).map(function (x) { return x.h; }), bh = base.length >= 3 ? K.mean(base) : null, h = +hr.value || 0;
          var sc = 62 + K.clamp((s - 7) * 9, -30, 12) - effort * 2.2 + K.clamp(((+d0.water || 0) - 6) * 1.5, -6, 5);
          if (h && bh) sc -= K.clamp((h - bh) * 2.2, -6, 22);
          sc = Math.round(K.clamp(sc, 0, 100));
          L.push({ d: K.dayKey(new Date()), s: s, h: h, e: effort, v: sc, t: Date.now() }); K.sv("sp36_rec", L.slice(-120)); K.hap(20); viewRecover();
        }, "bat36"));
        if (last && last.d === K.dayKey(new Date())) {
          var r = card(null, null); r.style.textAlign = "center";
          var lab = last.v >= 75 ? "جاهز لتمرين قوي 💪" : last.v >= 50 ? "تمرين خفيف أو متوسط" : "يومك للراحة والمشي";
          r.append(el("div", "v36-big", nf(last.v)), el("b", null, lab), K.bar(last.v));
          var tips = []; if (last.s < 6) tips.push("نومك قليل: حاول تنام بدري النهارده."); if ((+d0.water || 0) < 4) tips.push("اشرب مياه أكتر الصبح."); if (last.e >= 9) tips.push("امبارح كان جامد: مدد وإطالات.");
          tips.forEach(function (t) { r.append(el("div", "v30-mut", "• " + t)); }); R.append(r);
        }
        R.append(c);
        if (L.length > 2) { var hc = card("آخر أسبوعين", "trend30"); var pts = L.slice(-14);
          hc.append(K.canvas(120, function (x, w, h) { var n = pts.length; x.strokeStyle = "#34d399"; x.lineWidth = 2.5; x.beginPath(); pts.forEach(function (p, i) { var X = 10 + (w - 20) * i / Math.max(1, n - 1), Y = h - 10 - (h - 20) * p.v / 100; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.stroke(); }));
          R.append(hc); }
        R.append(el("div", "v36-note", "رقم إرشادي للتمرين، مش قياس طبي."));
      });
    }

    /* ========== 4) الأكل والمزاج ========== */
    var MOODS = [["calm", "😌 هادي"], ["happy", "😄 مبسوط"], ["stress", "😣 متوتر"], ["bored", "🥱 زهقان"], ["sad", "😔 زعلان"], ["tired", "😴 تعبان"]];
    function viewMood() {
      view("الأكل والمزاج", "mood36", "سجّل مزاجك، وأنا أوريك إمتى بتاكل أكتر من غير جوع.", function (R) {
        var L = K.ld("sp36_mood", []), c = card("حاسس بإيه دلوقتي؟", "mood36", "gold"), m = null, hungry = 1;
        c.append(K.chips(MOODS, null, function (v) { m = v; }), el("div", "v30-mut", "جعان فعلًا؟"), K.chips([[2, "جعان"], [1, "شوية"], [0, "لأ خالص"]], 1, function (v) { hungry = +v; }), btn("سجّل", "gold wide", function () {
          if (!m) return K.say("اختار مزاجك"); var h = new Date().getHours();
          L.push({ t: Date.now(), m: m, hu: hungry, h: h, k: Math.round(today().k) }); K.sv("sp36_mood", L.slice(-500)); K.hap(20); K.say(hungry === 0 ? "خد 10 دقايق: مياه ومشي قصير، ولو لسه عايز تاكل كُل حاجة خفيفة" : "اتسجّل ✔"); viewMood();
        }, "check30"));
        R.append(c);
        if (L.length >= 3) {
          var s = {}; L.forEach(function (x) { var o = s[x.m] || (s[x.m] = { n: 0, nh: 0, night: 0 }); o.n++; if (x.hu === 0) o.nh++; if (x.h >= 21 || x.h < 4) o.night++; });
          var rc = card("اللي لاحظته", "trend30"), name = {}; MOODS.forEach(function (x) { name[x[0]] = x[1]; });
          Object.keys(s).sort(function (a, b) { return s[b].nh - s[a].nh; }).forEach(function (k) { var o = s[k]; rc.append(row(el("b", null, name[k]), el("span", "v30-mut", nf(o.n) + " مرة · من غير جوع " + nf(Math.round(100 * o.nh / o.n)) + "٪"))); });
          var top = Object.keys(s).sort(function (a, b) { return s[b].nh - s[a].nh; })[0];
          if (top && s[top].nh >= 2) rc.append(el("div", "v30-warn", "أكتر وقت بتاكل فيه من غير جوع وانت " + name[top].replace(/^\S+\s/, "") + ". جهّز بديل: مياه، شاي من غير سكر، أو مشي 10 دقايق."));
          var nt = L.filter(function (x) { return (x.h >= 21 || x.h < 4) && x.hu === 0; }).length; if (nt >= 2) rc.append(el("div", "v30-mut", "• بالليل بتاكل من غير جوع " + nf(nt) + " مرات."));
          R.append(rc);
        }
        R.append(el("div", "v36-note", "أداة وعي ذاتي، مش علاج نفسي. لو الأكل بقى خارج عن السيطرة اتكلم مع متخصص."));
      });
    }

    /* ========== 5) خزنة صور التقدّم (IndexedDB) ========== */
    var DBN = "sorati36", db = function () { return new Promise(function (res, rej) { var r = indexedDB.open(DBN, 1); r.onupgradeneeded = function () { r.result.createObjectStore("ph", { keyPath: "t" }); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); };
    var tx = function (mode, fn) { return db().then(function (d) { return new Promise(function (res, rej) { var t = d.transaction("ph", mode), s = t.objectStore("ph"), out = fn(s); t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); }; t.onerror = function () { rej(t.error); }; }); }); };
    var phAll = function () { return tx("readonly", function (s) { return s.getAll(); }); };
    function viewVault() {
      view("خزنة صور التقدّم", "lock36", "صورك على موبايلك بس. مش بتترفع لأي سيرفر.", function (R) {
        if (gate(R, "خزنة صور قبل وبعد، محفوظة على موبايلك بس.")) return;
        try { if (W.Android && Android.secure) Android.secure(true); } catch (e) {}
        var c = card(null, null, "gold"), grid = el("div", "v36-ph"), cmp = el("div");
        c.append(btn("أضف صورة النهارده", "gold wide", function () { pick2(function (im) { var w = 0; try { w = (W.V30.weight() || {}).trend || 0; } catch (e) {} tx("readwrite", function (s) { return s.put({ t: Date.now(), d: im.url, w: w }); }).then(function () { K.hap(30); K.say("اتحفظت في الخزنة 🔒"); viewVault(); }).catch(function () { K.say("مفيش مساحة كفاية"); }); }); }, "lock36"));
        R.append(c, cmp, grid);
        phAll().then(function (L) {
          if (!L.length) { grid.append(el("div", "v30-mut", "لسه مفيش صور. صورة كل أسبوعين في نفس المكان والنور بتفرق جدًا.")); return; }
          if (L.length >= 2) { var a = L[0], b = L[L.length - 1], cc = card("قبل وبعد", "star36"), g2 = el("div", "v36-ph"); g2.style.gridTemplateColumns = "1fr 1fr";
            [a, b].forEach(function (p) { var w = el("div"), i = el("img"); i.src = p.d; w.append(i, el("div", "v30-mut", K.dateAr(new Date(p.t)) + (p.w ? " · " + nf(p.w, 1) + " كجم" : ""))); g2.append(w); });
            cc.append(g2); if (a.w && b.w) cc.append(el("b", null, "الفرق: " + nf(b.w - a.w, 1) + " كجم في " + nf(Math.round((b.t - a.t) / 864e5)) + " يوم")); cmp.append(cc); }
          L.slice().reverse().forEach(function (p) { var i = el("img"); i.src = p.d; i.alt = K.dateAr(new Date(p.t)); i.onclick = function () { if (confirm("أمسح الصورة دي؟")) tx("readwrite", function (s) { return s.delete(p.t); }).then(viewVault); }; grid.append(i); });
        }).catch(function () { grid.append(el("div", "v30-warn", "الخزنة مش متاحة على الجهاز ده")); });
      });
    }
    var pick2 = function (cb) { var i = D.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = function () { var f = i.files && i.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { AI.resize(r.result, 900).then(cb); }; r.readAsDataURL(f); }; i.click(); };

    /* ========== 6) ملخصك (Wrapped) ========== */
    function viewWrapped(span) {
      span = span || 30;
      view("ملخصك", "star36", "رحلتك بالأرقام، جاهزة تشاركها.", function (R) {
        R.append(K.chips([[7, "أسبوع"], [30, "شهر"], [90, "3 شهور"], [365, "سنة"]], span, function (v) { viewWrapped(+v); }));
        var S = K.intakeSeries(span), act = S.filter(function (d) { return d.n > 0; });
        if (!act.length) { R.append(card(null, null).appendChild(el("div", "v30-mut", "سجّل أكلك كام يوم وارجع هنا.")).parentNode); return; }
        var cnt = {}, best = 0, cur = 0; S.forEach(function (d) { if (d.n) { cur++; best = Math.max(best, cur); } else cur = 0; d.items.forEach(function (i) { cnt[i.n] = (cnt[i.n] || 0) + (+i.q || 1); }); });
        var top = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; }).slice(0, 3), avg = Math.round(K.mean(act.map(function (d) { return d.kcal; }))), avgP = Math.round(K.mean(act.map(function (d) { return d.p; }))), water = Math.round(K.mean(act.map(function (d) { return d.water; })));
        var wm = null; try { wm = W.V30.weight(); } catch (e) {}
        var c = card(null, null, "gold"); c.style.cssText = "text-align:center;background:linear-gradient(160deg,#0b3a2a,#06140f 60%,#2a1f06)";
        c.append(el("div", "v30-mut", "سعراتي · آخر " + nf(span) + " يوم"), el("div", "v36-big", nf(act.length) + " يوم"), el("div", "v30-mut", "سجّلت فيهم أكلك"));
        var ks = el("div", "v30-kpis"); ks.append(K.kpi(nf(best), "أطول ستريك"), K.kpi(nf(avg), "سعرة/يوم"), K.kpi(nf(avgP) + " جم", "بروتين/يوم")); c.append(ks);
        if (top.length) c.append(el("b", null, "أكتر أكلاتك: " + top.join("، ")));
        if (wm && wm.ratePerWeek != null) c.append(el("div", "v30-mut", "اتجاه وزنك: " + nf(wm.ratePerWeek * span / 7, 1) + " كجم في الفترة"));
        if (water) c.append(el("div", "v30-mut", "متوسط المياه: " + nf(water) + " كوباية"));
        R.append(c, btn("شارك ملخصك", "gold wide", function () {
          share("ملخصي في سعراتي (آخر " + span + " يوم): سجّلت " + act.length + " يوم، أطول ستريك " + best + " يوم، متوسط " + avg + " سعرة و" + avgP + " جم بروتين." + (top.length ? " أكتر أكلاتي: " + top.join("، ") + "." : "") + " 💚");
        }, "share30"));
      });
    }

    /* ========== 7) العيلة ========== */
    function viewFamily() {
      view("العيلة", "fam36", "احسب احتياج كل فرد في البيت وخطّط أكل البيت كله.", function (R) {
        if (gate(R, "حساب عيلة: احتياج كل فرد في البيت في مكان واحد.")) return;
        var L = K.ld("sp36_fam", []), c = card("فرد جديد", "fam36", "gold"), nm = inp("الاسم"), ag = inp("السن", "number"), wt = inp("الوزن (كجم)", "number"), ht = inp("الطول (سم)", "number"), sx = "m", ac = 1.4;
        c.append(nm, row(ag, wt, ht), K.chips([["m", "ذكر"], ["f", "أنثى"]], "m", function (v) { sx = v; }), K.chips([[1.2, "قاعد"], [1.4, "متوسط"], [1.6, "نشيط"]], 1.4, function (v) { ac = +v; }), btn("أضف", "gold wide", function () {
          var a = +ag.value, w = +wt.value, h = +ht.value; if (!nm.value.trim() || !(a > 0 && a < 110)) return K.say("اكتب الاسم والسن");
          L.push({ id: Date.now().toString(36), n: nm.value.trim().slice(0, 30), a: a, w: w, h: h, s: sx, ac: ac }); K.sv("sp36_fam", L.slice(-12)); K.hap(20); viewFamily();
        }, "check30"));
        var tot = 0, lc = card("أفراد البيت", "fam36");
        L.forEach(function (p) {
          var kc = null, lbl;
          if (p.a >= 18 && p.w && p.h) { kc = Math.round(((10 * p.w + 6.25 * p.h - 5 * p.a) + (p.s === "m" ? 5 : -161)) * p.ac); lbl = nf(kc) + " سعرة/يوم تقريبًا"; tot += kc; }
          else if (p.a < 18) lbl = "طفل/مراهق: الاحتياج حسب النمو، اسأل دكتور الأطفال. منغير رجيم للأطفال.";
          else lbl = "كمّل الوزن والطول";
          var r = row(el("b", null, p.n + " · " + nf(p.a) + " سنة"), el("span", "v30-mut", lbl)); var x = el("button", "v30-chip", "✕"); x.onclick = function () { K.sv("sp36_fam", L.filter(function (q) { return q.id !== p.id; })); viewFamily(); }; r.append(x); lc.append(r);
        });
        if (L.length) { if (tot) lc.append(el("b", null, "إجمالي الكبار: " + nf(tot) + " سعرة/يوم")); R.append(lc); }
        R.append(c, el("div", "v36-note", "أرقام تقديرية (معادلة Mifflin-St Jeor) للكبار بس."));
      });
    }

    W.V30_EXTRA = (W.V30_EXTRA || []).concat([
      ["eye36", "عين سعراتي 2.0", "الطبق · المنيو · التلاجة · التحليل", "eye36", true, viewEye],
      ["goal36", "هدف بتاريخ", "عدّاد + المطلوب كل أسبوع", "flag36", false, viewGoal],
      ["rec36", "درجة التعافي", "تمرين النهارده تقيل ولا راحة", "bat36", true, viewRecover],
      ["mood36", "الأكل والمزاج", "اعرف إمتى بتاكل من غير جوع", "mood36", false, viewMood],
      ["vault36", "خزنة صور التقدّم", "قبل وبعد · على موبايلك بس", "lock36", true, viewVault],
      ["wrap36", "ملخصك", "رحلتك بالأرقام وشاركها", "star36", false, function () { viewWrapped(30); }],
      ["fam36", "العيلة", "احتياج كل فرد في البيت", "fam36", true, viewFamily],
    ]);
    /* ما الجديد في 36: مرة واحدة بعد التحديث */
    try { if (localStorage.getItem("sp36_new") !== "1" && localStorage.getItem("sp_state")) setTimeout(function () {
      if (D.querySelector(".modal.on")) return; localStorage.setItem("sp36_new", "1");
      view("جديد في سعراتي 36", "star36", "7 أدوات جديدة في مركز القوة:", function (R) {
        W.V30_EXTRA.filter(function (t) { return /36$/.test(t[0]); }).forEach(function (t) { var c = card(t[1], t[3]); c.append(el("div", "v30-mut", t[2]), btn("جرّبها", "sec", function () { t[5](); })); R.append(c); });
      });
    }, 4000); } catch (e) {}
    W.V36 = { version: 36, open: function (k) { W.V30.open(k); }, eye: viewEye, goal: viewGoal, recover: viewRecover, mood: viewMood, vault: viewVault, wrapped: viewWrapped, family: viewFamily };
  }

  /* ===== طوارئ من الأدمن (config/app.emerg36) ===== */
  (function emerg() {
    var cur = null;
    function apply(E) {
      E = E || {}; var k = JSON.stringify(E); if (k === cur) return; cur = k;
      D.body.classList.toggle("e36-nochat", !!E.freeze_chat);
      var b = D.getElementById("e36ban"); var signedIn = false; try { signedIn = FB.signedIn(); } catch (e) {}
      var txt = E.banner ? (E.bannerText || "فيه صيانة بسيطة دلوقتي") : (E.freeze_signup && !signedIn ? "التسجيل الجديد متوقف مؤقتًا. جرّب كمان شوية." : "");
      if (txt) { if (!b) { b = D.createElement("div"); b.id = "e36ban"; b.setAttribute("role", "status"); D.body.append(b); } b.textContent = txt; } else if (b) b.remove();
      try { if (typeof AI !== "undefined" && AI.call) { if (!AI._c36) AI._c36 = AI.call; AI.call = E.freeze_ai ? function () { return Promise.reject(new Error("الذكاء في صيانة قصيرة، جرّب كمان شوية")); } : AI._c36; } } catch (e) {}
    }
    var s = D.createElement("style"); s.textContent = "#e36ban{position:fixed;top:0;left:0;right:0;z-index:99999;background:#b91c1c;color:#fff;text-align:center;padding:8px 12px calc(8px);padding-top:calc(8px + env(safe-area-inset-top));font:600 13px/1.5 Plex,system-ui;direction:rtl}body.e36-nochat #c23,body.e36-nochat #c23fab,body.e36-nochat #c23btn{display:none!important}";
    D.head.append(s);
    function read() { try { if (typeof CFG !== "undefined" && CFG) return CFG.emerg36; } catch (e) {} try { return (JSON.parse(localStorage.getItem("sp_cfg") || "{}") || {}).emerg36; } catch (e) { return null; } }
    function poll() { apply(read()); try { if (FB.signedIn && FB.signedIn()) FB.get("config/app", !1).then(function (c) { if (c) { try { CFG = c; } catch (e) {} localStorage.setItem("sp_cfg", JSON.stringify(c)); apply(c.emerg36); } }).catch(function () {}); } catch (e) {} }
    var go = function () { poll(); setInterval(poll, 180000); D.addEventListener("visibilitychange", function () { if (!D.hidden) poll(); }); };
    if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { setTimeout(go, 1500); }); else setTimeout(go, 1500);
    W.V36E = { apply: apply };
  })();
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 500); }); else setTimeout(boot, 500);
})();
