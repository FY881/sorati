/* سعراتي 38 — beyond38.js: «الأفكار المجنونة» (BEYOND 1–10) كبلاطات في مركز القوة (W.V30_EXTRA)
   1 التوأم الرقمي · 2 الطباخ الحي (نسخة أولى) · 3 ذاكرة الأكل العائلية · 4 السوق الصحي · 5 وضع المناسبات
   6 مدرب المكالمة · 7 بصمة الجوع · 8 خريطة أكل مصر · 9 نسخة الساعة (تصميم + قريبًا بصدق) · 10 وضع بدون نت كامل
   كل الحسابات على الجهاز من بيانات المستخدم. الذكاء (AI.call) بس في الطباخ الحي والوصفات والمكالمة. */
(function () {
  "use strict";
  var W = window, D = document;
  function boot() {
    if (!W.V30 || !W.V30.kit) return setTimeout(boot, 400);
    if (W.B38) return;
    var K = W.V30.kit, el = K.el, nf = K.nf, card = K.card, btn = K.btn, view = K.view, kpi = K.kpi, chips = K.chips, say = K.say, hap = K.hap, ld = K.ld, sv = K.sv, canvas = K.canvas;
    var API = "https://deputy.sorati-command.workers.dev/v1/app/l38";
    Object.assign(K.icons, {
      twin38: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5"/>',
      pan38: '<path d="M3 12h13a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM16 12h5M7 8c0-1 1-1 1-2M11 8c0-1 1-1 1-2"/>',
      book38: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6"/>',
      cart38: '<path d="M3 4h2l2 11h11l2-8H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
      party38: '<path d="M4 20l5-14 9 9zM14 4l1 2M19 6l-2 1M20 11h-2"/>',
      phone38: '<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
      finger38: '<path d="M12 4a7 7 0 0 0-7 7v2M12 8a3 3 0 0 0-3 3v4a6 6 0 0 0 2 4M12 12v4a8 8 0 0 0 3 5M15 11a3 3 0 0 0-3-3M19 11v2a10 10 0 0 1-1 4"/>',
      map38: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
      watch38: '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3M12 10v2l1 1"/>',
      cloud38: '<path d="M7 18a4 4 0 1 1 1-7.9A6 6 0 0 1 19 12a3 3 0 0 1-1 6zM3 3l18 18"/>',
    });
    var G = function (n) { try { switch (n) { case "AI": return typeof AI !== "undefined" ? AI : W.AI; case "FB": return typeof FB !== "undefined" ? FB : W.FB; case "S": return typeof S !== "undefined" ? S : W.S; } } catch (e) {} return W[n]; };
    var st = function () { return G("S") || {}; };
    var aiOk = function () { var A = G("AI"); if (!A || !A.call) { say("الذكاء مش متاح"); return false; } if (A.ready && !A.ready()) { say("سجّل دخولك الأول"); return false; } return true; };
    var mean = K.mean, addDays = K.addDays, dayKey = K.dayKey, TG = K.TG, getD = K.getD, sumD = K.sumD, logFood = K.logFood;
    var series = function (n) { return K.intakeSeries(n); };
    var weights = function () { var s = st(); var w = (s.weights || []).filter(function (x) { return x && +x.kg; }); if (!w.length && s.profile && +s.profile.weight) w = [{ d: dayKey(new Date()), kg: +s.profile.weight }]; return w; };
    var api = function (op, body) {
      var FB = G("FB"); var p = FB && FB.token ? Promise.resolve(FB.token()).catch(function () {}) : Promise.resolve();
      return p.then(function () { if (!FB || !FB.tok) throw new Error("سجّل دخول الأول"); return fetch(API + op, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({}, body, { idToken: FB.tok })) }).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error || "مشكلة"); return j; }); });
    };
    var row = function (a, b) { var r = el("div", "v30-row"); r.append(el("span", null, a), el("b", null, b)); r.style.justifyContent = "space-between"; return r; };
    var note = function (t) { return el("div", "v30-note", t); };
    var input = function (ph, type, v) { var i = el("input", "v30-in"); i.placeholder = ph; i.type = type || "text"; if (v != null) i.value = v; i.style.cssText = "width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.25);color:inherit;font:inherit;margin:4px 0"; return i; };

    // ============================================================ 1. التوأم الرقمي
    function viewTwin() {
      view("توأمك الرقمي", "twin38", "نسخة منك بتتوقع وزنك لو كملت بنفس طريقتك", function (R) {
        var s28 = series(28).filter(function (x) { return x.n; }), w = weights(), tg = TG();
        var tdee = +tg.tdee || +tg.kcal || 2000, avg = s28.length ? mean(s28.map(function (x) { return x.kcal; })) : 0;
        var w0 = w.length ? +w[w.length - 1].kg : 0;
        if (!w0 || s28.length < 5) { var c0 = card("محتاج بيانات أكتر", "twin38"); c0.append(el("p", "v30-mut", "سجّل أكلك 5 أيام على الأقل ووزنك مرة عشان التوأم يتعلّم منك. لحد دلوقتي: " + s28.length + " يوم أكل" + (w0 ? "" : "، ومفيش وزن"))); R.append(c0); return; }
        // real trend from weigh-ins (kg/day) when there are 2+ readings ≥ 10 days apart, else energy balance (7700 kcal/kg)
        var trendDay = null;
        if (w.length >= 2) { var a = w[Math.max(0, w.length - 8)], b = w[w.length - 1], days = (new Date(b.d) - new Date(a.d)) / 864e5; if (days >= 10) trendDay = (b.kg - a.kg) / days; }
        var energyDay = (avg - tdee) / 7700;
        var perDay = trendDay != null ? trendDay * 0.6 + energyDay * 0.4 : energyDay;
        var goalK = +tg.kcal || tdee, goalDay = (goalK - tdee) / 7700;
        var at = function (d, r) { return Math.max(35, w0 + r * d); };
        var c = card("بعد 90 يوم", "twin38");
        var g = el("div", "v30-kpis"); g.append(kpi(nf(at(30, perDay), 1), "بعد شهر"), kpi(nf(at(60, perDay), 1), "بعد شهرين"), kpi(nf(at(90, perDay), 1), "بعد 3 شهور")); c.append(g);
        c.append(el("p", "v30-mut", "دلوقتي " + nf(w0, 1) + " كجم · متوسط أكلك " + nf(Math.round(avg)) + " سعرة · احتياجك حوالي " + nf(Math.round(tdee)) + (trendDay != null ? " · ميزانك بيقول " + (trendDay < 0 ? "نازل " : "طالع ") + nf(Math.abs(trendDay * 7), 2) + " كجم/أسبوع" : "")));
        R.append(c);
        var cv = canvas(190, function (x, wd, h) {
          var D90 = 90, lo = Math.min(at(D90, perDay), at(D90, goalDay), w0) - 1, hi = Math.max(at(D90, perDay), at(D90, goalDay), w0) + 1;
          var X = function (d) { return 16 + (wd - 32) * d / D90; }, Y = function (v) { return 12 + (h - 34) * (1 - (v - lo) / (hi - lo || 1)); };
          x.strokeStyle = "rgba(255,255,255,.08)"; x.lineWidth = 1; [0, 30, 60, 90].forEach(function (d) { x.beginPath(); x.moveTo(X(d), 10); x.lineTo(X(d), h - 22); x.stroke(); x.fillStyle = "rgba(233,255,246,.5)"; x.font = "11px sans-serif"; x.textAlign = "center"; x.fillText(d ? d + " يوم" : "النهارده", X(d), h - 6); });
          var line = function (r, col, dash) { x.setLineDash(dash || []); x.strokeStyle = col; x.lineWidth = 3; x.beginPath(); for (var d = 0; d <= D90; d += 3) { d ? x.lineTo(X(d), Y(at(d, r))) : x.moveTo(X(d), Y(at(d, r))); } x.stroke(); x.setLineDash([]); };
          line(goalDay, "#f5c76b", [6, 6]); line(perDay, "#34d399");
          x.fillStyle = "#34d399"; x.beginPath(); x.arc(X(0), Y(w0), 5, 0, 7); x.fill();
        });
        var c2 = card("مسارك ومسار هدفك", "flag36"); c2.append(cv, el("div", "v30-mut", "الأخضر: لو كملت زي آخر 4 أسابيع · الدهبي: لو التزمت بهدفك (" + nf(Math.round(goalK)) + " سعرة) ← " + nf(at(90, goalDay), 1) + " كجم")); R.append(c2);
        var diff = at(90, perDay) - at(90, goalDay);
        if (Math.abs(diff) > 0.5) R.append(el("div", "v30-warn", "الفرق بين المسارين " + nf(Math.abs(diff), 1) + " كجم في 3 شهور — يعني حوالي " + nf(Math.round(Math.abs(avg - goalK))) + " سعرة في اليوم."));
        R.append(note("توقّع تقريبي: الجسم مش آلة حاسبة (مية، هرمونات، تغيّر الحرق). بيتصحّح كل ما تسجّل وزن."));
      });
    }

    // ============================================================ 2. الطباخ الحي (نسخة أولى)
    function viewCook() {
      view("الطباخ الحي", "pan38", "وجّه الكاميرا على الطاسة — وسعراتي يعدّ الزيت والمكونات وانت بتطبخ", function (R) {
        var ck = ld("b38_cook", { items: [], at: 0 });
        if (ck.at && Date.now() - ck.at > 6 * 3600e3) ck = { items: [], at: 0 };
        var vid = el("video"); vid.autoplay = true; vid.playsInline = true; vid.muted = true; vid.style.cssText = "width:100%;border-radius:16px;background:#000;aspect-ratio:4/3;object-fit:cover";
        var list = el("div"), tot = el("div", "v30-big");
        var draw = function () { list.replaceChildren(); var s = 0; ck.items.forEach(function (x, i) { s += +x.k || 0; var r = row(x.n + (x.q ? " · " + x.q : ""), nf(Math.round(x.k)) + " سعرة"); r.onclick = function () { if (confirm("تشيل " + x.n + "؟")) { ck.items.splice(i, 1); sv("b38_cook", ck); draw(); } }; list.append(r); }); tot.textContent = nf(Math.round(s)) + " سعرة في الحلة"; };
        var stream = null;
        var start = btn("شغّل الكاميرا", "sec wide", function () {
          if (!navigator.mediaDevices) { say("الكاميرا مش متاحة"); return; }
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: 960 } }).then(function (s) { stream = s; vid.srcObject = s; start.style.display = "none"; snap.style.display = ""; }).catch(function () { say("محتاج إذن الكاميرا"); });
        }, "cam");
        var snap = btn("اقرا اللي في الطاسة دلوقتي", "gold wide", function () {
          if (!aiOk() || !vid.videoWidth) return;
          var c = D.createElement("canvas"), sc = Math.min(1, 900 / vid.videoWidth); c.width = vid.videoWidth * sc; c.height = vid.videoHeight * sc; c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
          var b64 = c.toDataURL("image/jpeg", .82).split(",")[1], A = G("AI");
          snap.disabled = true; say("بقرا الطاسة…");
          var known = ck.items.map(function (x) { return x.n; }).join("، ") || "لسه مفيش";
          A.call([{ text: 'انت مساعد طبخ. دي صورة حلة/طاسة وأنا بطبخ. المكونات اللي اتحسبت قبل كدا: ' + known + '. حدد المكونات الجديدة اللي اتضافت بس (زي زيت، سمنة، بصل، لحمة، رز) وقدّر كميتها من الصورة (الزيت بالمعالق). رد JSON بس: {"new":[{"n":"اسم المكون","q":"الكمية بالوصف","k":سعرات تقريبية}],"tip":"نصيحة صحية قصيرة جدًا أو فاضي"}' }, A.img(b64)], { task: "vision", json: true })
            .then(function (r) { snap.disabled = false; var nw = (r && r.new || []).filter(function (x) { return x && x.n; }); if (!nw.length) { say("مفيش حاجة جديدة ظاهرة"); return; } nw.forEach(function (x) { ck.items.push({ n: String(x.n).slice(0, 40), q: String(x.q || "").slice(0, 30), k: Math.max(0, +x.k || 0) }); }); ck.at = Date.now(); sv("b38_cook", ck); draw(); hap(); if (r.tip) say("💡 " + r.tip); })
            .catch(function () { snap.disabled = false; say("مقدرتش أقرا الصورة"); });
        }, "eye36");
        snap.style.display = "none";
        var serv = input("الحلة تكفي كام فرد؟", "number", "4");
        var done = btn("خلصت — سجّل نصيبي", "gold wide", function () {
          var s = ck.items.reduce(function (a, x) { return a + (+x.k || 0); }, 0), n = Math.max(1, +serv.value || 1);
          if (!s) { say("لسه مفيش مكونات"); return; }
          logFood({ n: "طبيخ البيت (" + ck.items.map(function (x) { return x.n; }).slice(0, 3).join("، ") + ")", sv: "حصة من " + n, k: s / n }, 1);
          say("اتسجلت حصتك ✅ " + nf(Math.round(s / n)) + " سعرة"); ck = { items: [], at: 0 }; sv("b38_cook", ck); if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); try { closeM(); } catch (e) {}
        }, "check");
        var c = card(null, null); c.append(vid, start, snap); R.append(c);
        var c2 = card("اللي في الحلة", "pan38"); c2.append(list, tot, serv, done); R.append(c2); draw();
        R.append(note("نسخة أولى: بتقرا لقطة لما تضغط (مش فيديو متواصل) عشان توفّر في الذكاء والبطارية. الكميات تقديرية من الصورة."));
      });
    }

    // ============================================================ 3. ذاكرة الأكل العائلية
    function viewFamilyBook() {
      view("ذاكرة الأكل العائلية", "book38", "وصفات البيت المتوارثة — بسعراتها ونسخة أخف منها", function (R) {
        var book = ld("b38_book", []);
        var list = card("وصفات العيلة (" + book.length + ")", "book38");
        if (!book.length) list.append(el("p", "v30-mut", "ضيف وصفة ستك أو ماما: المكونات والكمية، وسعراتي يحسب الحصة ويقترح نسخة صحية من غير ما تفقد طعمها."));
        book.forEach(function (r, i) {
          var c = el("div", "v30-card"); c.style.margin = "6px 0"; c.append(el("b", null, r.n + (r.who ? " — " + r.who : "")));
          if (r.kcal) c.append(el("div", "v30-mut", nf(Math.round(r.kcal)) + " سعرة للحصة · " + r.serv + " حصص" + (r.light ? " · الخفيفة " + nf(Math.round(r.light.kcal)) : "")));
          if (r.light && r.light.tips) c.append(el("div", "v30-mut", "✨ " + r.light.tips));
          var bb = el("div", "v30-row"); bb.append(btn("سجّل حصة", "sec", function () { logFood({ n: r.n + " (وصفة البيت)", sv: "حصة", k: r.kcal || 0, p: r.p || 0, c: r.c || 0, f: r.f || 0 }, 1); say("اتسجلت ✅"); }), r.light ? btn("سجّل الخفيفة", "sec", function () { logFood({ n: r.n + " (خفيفة)", sv: "حصة", k: r.light.kcal || 0 }, 1); say("اتسجلت ✅"); }) : el("span"), btn("امسح", "", function () { if (confirm("تمسح الوصفة؟")) { book.splice(i, 1); sv("b38_book", book); viewFamilyBook(); } }));
          c.append(bb); list.append(c);
        });
        R.append(list);
        var add = card("وصفة جديدة", "add"); var n = input("اسم الأكلة (محشي ورق عنب)"), who = input("وصفة مين؟ (تيتة، ماما…)"), ing = el("textarea"); ing.rows = 5; ing.placeholder = "المكونات بالكميات، كل واحد في سطر:\nرز مصري 2 كوباية\nسمنة 3 معالق\nورق عنب نص كيلو"; ing.style.cssText = "width:100%;border-radius:12px;padding:10px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.1);color:inherit;font:inherit"; var sv_ = input("بتكفي كام حصة؟", "number", "6");
        add.append(n, who, ing, sv_, btn("احسب واحفظ", "gold wide", function () {
          if (!n.value || !ing.value.trim()) { say("اكتب الاسم والمكونات"); return; }
          if (!aiOk()) return; say("بحسب…");
          G("AI").call([{ text: 'دي وصفة مصرية عائلية. المكونات:\n' + ing.value + '\nعدد الحصص: ' + (+sv_.value || 1) + '\nاحسب سعرات وماكروز الحصة الواحدة تقريبيًا، واقترح نسخة أخف بنفس الطعم (تبديلات محددة) وسعرات حصتها. رد JSON بس: {"kcal":0,"p":0,"c":0,"f":0,"light":{"kcal":0,"tips":"تبديلين أو تلاتة في سطر"}}' }], { task: "chat", json: true })
            .then(function (r) { book.unshift({ n: n.value.slice(0, 60), who: who.value.slice(0, 30), ing: ing.value.slice(0, 2000), serv: +sv_.value || 1, kcal: +r.kcal || 0, p: +r.p || 0, c: +r.c || 0, f: +r.f || 0, light: r.light ? { kcal: +r.light.kcal || 0, tips: String(r.light.tips || "").slice(0, 300) } : null, at: Date.now() }); sv("b38_book", book.slice(0, 80)); viewFamilyBook(); })
            .catch(function () { say("مقدرتش أحسب — جرّب تاني"); });
        }, "check"));
        R.append(add, note("الوصفات محفوظة على موبايلك بس. الأرقام تقديرية."));
      });
    }

    // ============================================================ 4. السوق الصحي
    var BASKET = [
      ["بيض (طبق 30)", "بروتين", 1], ["صدور فراخ 1 كجم", "بروتين", 1], ["تونة علبة", "بروتين", 3], ["فول مدمس كيس", "بروتين", 2], ["عدس 1 كجم", "بروتين", 1], ["زبادي لايت", "ألبان", 6], ["جبنة قريش", "ألبان", 1], ["لبن خالي الدسم 1 لتر", "ألبان", 2],
      ["شوفان 500 جم", "نشويات", 1], ["رز بني 1 كجم", "نشويات", 1], ["عيش بلدي", "نشويات", 10], ["بطاطا", "نشويات", 1], ["خيار وطماطم", "خضار", 1], ["خس وجرجير", "خضار", 1], ["كوسة وفاصوليا", "خضار", 1], ["موز وتفاح", "فاكهة", 1], ["زيت زيتون صغير", "دهون", 1], ["مكسرات 250 جم", "دهون", 1],
    ];
    function viewMarket() {
      view("السوق الصحي", "cart38", "قايمة مشتريات أسبوع على هدفك — وقارن أسعار المحلات اللي بتشتري منها", function (R) {
        var M = ld("b38_market", { stores: ["كارفور", "المحل اللي جنبي"], prices: {}, done: {} });
        var c = card("قايمة الأسبوع", "cart38"); var tot = {};
        M.stores.forEach(function (s) { tot[s] = 0; });
        var grp = {}; BASKET.forEach(function (b) { (grp[b[1]] = grp[b[1]] || []).push(b); });
        Object.keys(grp).forEach(function (g) {
          c.append(el("div", "v30-sub", g));
          grp[g].forEach(function (b) {
            var r = el("div", "v30-row"); r.style.cssText = "justify-content:space-between;gap:6px;flex-wrap:wrap";
            var ckb = el("input"); ckb.type = "checkbox"; ckb.checked = !!M.done[b[0]]; ckb.onchange = function () { M.done[b[0]] = ckb.checked; sv("b38_market", M); };
            var nm = el("span", null, b[0] + (b[2] > 1 ? " ×" + b[2] : "")); nm.style.flex = "1";
            r.append(ckb, nm);
            M.stores.forEach(function (s) {
              var i = input(s, "number", (M.prices[s] || {})[b[0]] || ""); i.style.width = "84px"; i.style.margin = "0"; i.placeholder = s.slice(0, 8);
              i.onchange = function () { M.prices[s] = M.prices[s] || {}; M.prices[s][b[0]] = +i.value || ""; sv("b38_market", M); };
              var p = +((M.prices[s] || {})[b[0]]) || 0; tot[s] += p * b[2];
              r.append(i);
            });
            c.append(r);
          });
        });
        R.append(c);
        var known = M.stores.filter(function (s) { return tot[s] > 0; });
        if (known.length) {
          var cc = card("مين أرخص؟", "wallet30"); known.sort(function (a, b) { return tot[a] - tot[b]; }).forEach(function (s, i) { cc.append(row((i ? "" : "🏆 ") + s, nf(Math.round(tot[s])) + " ج")); });
          if (known.length > 1) cc.append(el("div", "v30-mut", "توفيرك لو اشتريت من " + known[0] + ": " + nf(Math.round(tot[known[known.length - 1]] - tot[known[0]])) + " جنيه"));
          R.append(cc);
        }
        var sc = card("محلاتك", "store"); var si = input("ضيف محل (مثلًا: هايبر وان)");
        sc.append(si, btn("ضيف", "sec", function () { var v = si.value.trim(); if (!v || M.stores.indexOf(v) >= 0 || M.stores.length >= 4) return; M.stores.push(v); sv("b38_market", M); viewMarket(); }), btn("شيل آخر محل", "", function () { if (M.stores.length > 1) { M.stores.pop(); sv("b38_market", M); viewMarket(); } }));
        R.append(sc, note("مفيش API مجاني لأسعار السوبر ماركت في مصر، فالأسعار انت اللي بتكتبها لما تشوفها — وسعراتي يفتكرها ويقارن. القايمة مبنية على أكل صحي عام."));
      });
    }

    // ============================================================ 5. وضع المناسبات
    function viewEvent() {
      view("وضع المناسبات", "party38", "فرح أو عزومة؟ خطة يومين قبل وبعد عشان متخسرش تقدّمك", function (R) {
        var ev = ld("b38_event", null), tg = TG(), base = +tg.kcal || 2000;
        var c = card(ev ? "مناسبتك" : "مناسبة جاية", "party38");
        var date = input("", "date", ev ? ev.d : ""), kind = el("select"); [["wedding", "فرح"], ["iftar", "عزومة / فطار جماعي"], ["birthday", "عيد ميلاد"], ["eid", "عيد"], ["trip", "سفرية / خروجة"]].forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; if (ev && ev.k === o[0]) op.selected = true; kind.append(op); }); kind.style.cssText = "width:100%;padding:10px;border-radius:12px;background:rgba(0,0,0,.25);color:inherit;border:1px solid rgba(255,255,255,.1);font:inherit;margin:4px 0";
        c.append(date, kind, btn(ev ? "حدّث" : "اعمل الخطة", "gold wide", function () {
          if (!date.value) { say("اختار التاريخ"); return; }
          ev = { d: date.value, k: kind.value, at: Date.now() }; sv("b38_event", ev);
          try { var t = new Date(ev.d + "T09:00:00").getTime(); if (W.NOTIF37) W.NOTIF37.group("ev38", [{ at: t - 2 * 864e5, title: "🎉 بعد يومين مناسبتك", text: "النهارده وبكرة خليهم أخف بـ 15% واشرب مية أكتر — عشان تستمتع من غير قلق." }, { at: t, title: "🎉 يوم المناسبة", text: "اتغدّى خفيف وبروتين، واستمتع. مفيش يوم واحد بيبوّظ شهر." }, { at: t + 864e5, title: "↩️ رجوع هادي", text: "النهارده يوم عادي — مية كتير وخضار، ومن غير تعويض قاسي." }]); } catch (e) {}
          viewEvent();
        }, "check"));
        R.append(c);
        if (ev) {
          var d0 = new Date(ev.d + "T12:00:00"), days = Math.round((d0 - new Date()) / 864e5);
          var P = [[-2, 0.85, "أخف بـ 15% · مية + 500 مل · بروتين عالي"], [-1, 0.85, "نفس امبارح · قلّل الملح عشان الانتفاخ"], [0, 1.3, "يوم المناسبة: فطار بروتين، غدا خفيف، واستمتع بالعزومة"], [1, 0.9, "رجوع هادي: خضار ومية، مفيش صيام تعويض"], [2, 1, "رجعت لروتينك الطبيعي"]];
          var c2 = card(days > 0 ? "باقي " + days + " يوم" : days === 0 ? "النهارده!" : "عدّت من " + Math.abs(days) + " يوم", "cal");
          P.forEach(function (p) { var d = addDays(d0, p[0]); var r = row(K.dateAr(d, { weekday: "short", day: "numeric", month: "short" }) + " — " + p[2], nf(Math.round(base * p[1])) + " سعرة"); if (dayKey(d) === dayKey(new Date())) r.style.color = "#f5c76b"; c2.append(r); });
          c2.append(el("div", "v30-mut", "المجموع على الـ 5 أيام قريب من 5 أيام عادية — يعني المناسبة محسوبة من غير ما تخسر تقدّمك."));
          R.append(c2, btn("شيل المناسبة", "", function () { localStorage.removeItem("b38_event"); try { W.NOTIF37 && W.NOTIF37.clear("ev38"); } catch (e) {} viewEvent(); }));
        }
        R.append(note("الأرقام من هدفك اليومي (" + nf(Math.round(base)) + " سعرة). مش مناسب للحوامل أو أصحاب الأمراض المزمنة من غير دكتور."));
      });
    }

    // ============================================================ 6. مدرب المكالمة
    function speak(t) { try { if (W.Android && W.Android.speak) { W.Android.speak(String(t)); return; } } catch (e) {} try { var u = new SpeechSynthesisUtterance(t); u.lang = "ar-EG"; speechSynthesis.speak(u); } catch (e) {} }
    function listen(cb) { try { if (W.Android && W.Android.listen) { W._b38v = function (t) { cb(String(t || "")); }; W.Android.listen("_b38v"); return true; } } catch (e) {} try { var R = W.SpeechRecognition || W.webkitSpeechRecognition; if (!R) return false; var r = new R(); r.lang = "ar-EG"; r.onresult = function (e) { cb(e.results[0][0].transcript); }; r.start(); return true; } catch (e) { return false; } }
    function viewCall() {
      view("مدرب المكالمة", "phone38", "دقيقة كل يوم: سعراتي يسألك عملت إيه ويطلعلك بخطوة واحدة لبكرة", function (R) {
        var s = series(1)[0] || { kcal: 0, n: 0, water: 0 }, tg = TG(), hist = [];
        var box = el("div"); var c = card("المكالمة", "phone38"); c.append(box);
        var inp = input("ردّك…"); var send = function (t) {
          if (!t) return; hist.push({ r: "u", t: t }); draw(); inp.value = "";
          if (!aiOk()) return;
          var ctx = "بيانات النهارده: " + Math.round(s.kcal) + " من " + Math.round(+tg.kcal || 2000) + " سعرة، " + s.n + " صنف، مية " + (s.water || 0) + ". ";
          G("AI").call([{ text: "انت مدرب صحي مصري لطيف في مكالمة صوتية قصيرة (دقيقة). " + ctx + "المحادثة:\n" + hist.map(function (h) { return (h.r === "u" ? "المستخدم: " : "المدرب: ") + h.t; }).join("\n") + "\nرد بجملة أو اتنين بس بالعامية. لو دي تالت رسالة من المستخدم اقفل المكالمة بخطوة واحدة محددة لبكرة وابدأها بـ «خطوتك لبكرة:». ممنوع تشخيص أو أدوية." }], { task: "chat" })
            .then(function (r) { var a = String(r || "").trim().slice(0, 400); hist.push({ r: "a", t: a }); draw(); speak(a); if (/خطوتك لبكرة/.test(a)) { var L = ld("b38_calls", []); L.unshift({ at: Date.now(), step: a }); sv("b38_calls", L.slice(0, 30)); } })
            .catch(function () { say("الخط قطع — جرّب تاني"); });
        };
        var draw = function () { box.replaceChildren(); hist.forEach(function (h) { var b = el("div", "v30-card"); b.style.cssText = "margin:6px 0;padding:8px 12px;" + (h.r === "u" ? "background:rgba(16,185,129,.18)" : ""); b.textContent = (h.r === "u" ? "انت: " : "📞 ") + h.t; box.append(b); }); };
        var first = "أهلًا! النهارده أكلت " + Math.round(s.kcal) + " سعرة من هدفك. قولّي في جملة: إيه أصعب حاجة قابلتك النهارده في الأكل؟";
        hist.push({ r: "a", t: first }); draw();
        var bar2 = el("div", "v30-row");
        bar2.append(btn("ابدأ المكالمة 🔊", "gold", function () { speak(first); }, "phone38"), btn("رد بصوتك", "sec", function () { if (!listen(send)) say("الميكروفون مش متاح — اكتب ردّك"); }, "mic"));
        c.append(bar2, inp, btn("ابعت", "sec wide", function () { send(inp.value.trim()); }));
        R.append(c);
        var L = ld("b38_calls", []); if (L.length) { var c2 = card("خطواتك من المكالمات", "flag36"); L.slice(0, 5).forEach(function (x) { c2.append(el("div", "v30-mut", K.dateAr(new Date(x.at)) + ": " + x.step.replace(/^.*خطوتك لبكرة:\s*/, ""))); }); R.append(c2); }
        R.append(note("الصوت بيتحوّل لكلام على الموبايل، والكلام بس بيتبعت للذكاء. مش بديل عن أخصائي."));
        try { if (W.NOTIF37 && !ld("b38_callrem", 0)) { var t = new Date(); t.setHours(21, 0, 0, 0); if (t < new Date()) t.setDate(t.getDate() + 1); W.NOTIF37.group("call38", [0, 1, 2, 3, 4, 5, 6].map(function (i) { return { at: t.getTime() + i * 864e5, title: "📞 مكالمة الدقيقة", text: "سعراتي عايز يسمع منك: يومك كان عامل إزاي؟" }; })); sv("b38_callrem", 1); } } catch (e) {}
      });
    }

    // ============================================================ 7. بصمة الجوع
    function viewHunger() {
      view("بصمة الجوع", "finger38", "التطبيق بيتعلم ساعات الأكل اللي برّه الجوع عندك ويسبقها بتنبيه", function (R) {
        var S60 = series(60), H = new Array(24).fill(0), late = 0, close = 0, total = 0, snacks = new Array(24).fill(0);
        S60.forEach(function (d) {
          var ts = (d.items || []).map(function (x) { return +x.t || 0; }).filter(Boolean).sort();
          ts.forEach(function (t, i) { var h = new Date(t).getHours(); H[h]++; total++; if (h >= 22 || h < 4) late++; if (i && t - ts[i - 1] < 90 * 60e3 && t - ts[i - 1] > 10 * 60e3) { close++; snacks[h]++; } });
        });
        if (total < 15) { var c0 = card("لسه بتتعلم", "finger38"); c0.append(el("p", "v30-mut", "محتاج 15 تسجيل أكل على الأقل بمواعيدها (عندك " + total + "). كمّل تسجيل وارجع هنا.")); R.append(c0); return; }
        var cv = canvas(150, function (x, w, h) { var mx = Math.max.apply(null, H) || 1, bw = (w - 20) / 24; H.forEach(function (v, i) { var bh = (h - 26) * v / mx, X = w - 10 - (i + 1) * bw; x.fillStyle = (i >= 22 || i < 4) ? "#f87171" : snacks[i] ? "#f5c76b" : "#34d399"; x.fillRect(X + 1, h - 18 - bh, bw - 2, bh); if (i % 3 === 0) { x.fillStyle = "rgba(233,255,246,.55)"; x.font = "10px sans-serif"; x.textAlign = "center"; x.fillText(i, X + bw / 2, h - 4); } }); });
        var c = card("ساعات أكلك (آخر 60 يوم)", "finger38"); c.append(cv, el("div", "v30-mut", "الأحمر: بعد 10 بالليل · الدهبي: أكل خلال ساعة ونص من وجبة قبلها (غالبًا مش جوع)")); R.append(c);
        var peak = snacks.indexOf(Math.max.apply(null, snacks)); var latePct = Math.round(late * 100 / total);
        var c2 = card("بصمتك", "spark");
        c2.append(row("أكل متأخر", latePct + "%"), row("أكل قريب من وجبة", Math.round(close * 100 / total) + "%"));
        if (snacks[peak] >= 3) c2.append(el("div", "v30-warn", "أكتر ساعة بتاكل فيها من غير جوع: حوالي " + new Date(2026, 0, 1, peak).toLocaleTimeString("ar-EG", { hour: "numeric" }) + ". جرّب تشرب مية أو تتمشى 5 دقايق وقتها."));
        R.append(c2);
        if (snacks[peak] >= 3) R.append(btn("نبهني قبلها بربع ساعة كل يوم", "gold wide", function () {
          try { var t = new Date(); t.setHours(peak, 0, 0, 0); t = new Date(t.getTime() - 15 * 60e3); if (t < new Date()) t.setDate(t.getDate() + 1); W.NOTIF37.group("hunger38", [0, 1, 2, 3, 4, 5, 6].map(function (i) { return { at: t.getTime() + i * 864e5, title: "🤚 لحظة قبل ما تفتح التلاجة", text: "ده وقت الأكل اللي غالبًا مش جوع عندك. كوباية مية الأول وشوف." }; })); say("اتظبط ✅ (أسبوع)"); } catch (e) { say("الإشعارات مش متاحة"); }
        }, "bell"));
        R.append(note("بتتحسب على موبايلك من مواعيد تسجيلك. لو بتسجّل متأخر عن الأكل الحقيقي البصمة هتبقى أقل دقة."));
      });
    }

    // ============================================================ 8. خريطة أكل مصر
    var GOVS = ["القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية", "القليوبية", "الغربية", "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء"];
    function viewMap() {
      view("خريطة أكل مصر", "map38", "أكتر أكلات بتتاكل في كل محافظة — من مستخدمين سعراتي ومن غير أسماء", function (R) {
        var gov = ld("b38_gov", ""), sel = el("select"); sel.style.cssText = "width:100%;padding:10px;border-radius:12px;background:rgba(0,0,0,.25);color:inherit;border:1px solid rgba(255,255,255,.1);font:inherit";
        [""].concat(GOVS).forEach(function (g) { var o = el("option", null, g || "اختار محافظتك"); o.value = g; if (g === gov) o.selected = true; sel.append(o); });
        var share = ld("b38_mapon", false);
        var c = card("محافظتك", "loc"); c.append(sel);
        var tg = el("label", "v30-row"); var ch = el("input"); ch.type = "checkbox"; ch.checked = share; tg.append(ch, el("span", null, "شارك أسماء أكلاتي (من غير أي حاجة تانية) مرة في اليوم")); c.append(tg);
        sel.onchange = function () { sv("b38_gov", sel.value); }; ch.onchange = function () { sv("b38_mapon", ch.checked); if (ch.checked) submit(true); };
        R.append(c);
        var out = card("الأسبوع ده", "map38"); out.append(el("div", "v30-mut", "بحمّل…")); R.append(out);
        api("/map/get", { days: 7 }).then(function (j) {
          out.replaceChildren(el("h4", null, "الأسبوع ده"));
          var g = Object.keys(j.govs || {}); if (!g.length) { out.append(el("div", "v30-mut", "لسه البيانات قليلة — كن أول المشاركين من محافظتك.")); return; }
          g.sort(function (a, b) { return (a === gov ? -1 : 0) - (b === gov ? -1 : 0); }).forEach(function (x) { var r = el("div", "v30-card"); r.style.margin = "6px 0"; r.append(el("b", null, x), el("div", "v30-mut", j.govs[x].map(function (f, i) { return (i + 1) + ". " + f.food; }).join(" · "))); out.append(r); });
        }).catch(function (e) { out.replaceChildren(el("div", "v30-mut", e.message)); });
        R.append(note("الخصوصية: بيتبعت اسم المحافظة وأسماء الأكلات بس. المحافظة اللي فيها أقل من 3 مشاركات مش بتظهر."));
      });
    }
    function submit(force) {
      try {
        var gov = ld("b38_gov", ""), on = ld("b38_mapon", false), day = dayKey(new Date());
        if (!gov || !on || (!force && ld("b38_mapday", "") === day)) return;
        var items = (getD(day).items || []).map(function (x) { return String(x.n || "").replace(/\s*\(.*?\)\s*/g, "").trim(); }).filter(Boolean);
        if (items.length < 2) return;
        api("/map/put", { gov: gov, foods: items.slice(0, 8) }).then(function () { sv("b38_mapday", day); }).catch(function () {});
      } catch (e) {}
    }
    setTimeout(function () { submit(false); }, 15000);

    // ============================================================ 9. نسخة الساعة
    function viewWatch() {
      view("نسخة الساعة", "watch38", "تسجيل المية والأكل من الساعة بضغطة", function (R) {
        var c = card("قريبًا — وبصدق ليه", "watch38");
        c.append(el("p", null, "تطبيق Wear OS لازم يتبني كتطبيق منفصل بأدوات أندرويد الرسمية ويتنشر على Play — مينفعش يتعمل جوه التطبيق الحالي."));
        c.append(el("p", "v30-mut", "لحد ما ييجي: لو ساعتك Galaxy Watch أو أي ساعة بتكتب في Samsung Health / Health Connect، خطواتك ونومك بيوصلوا سعراتي من «مركز الربط ← Health Connect»."));
        var mock = el("div"); mock.style.cssText = "width:180px;height:180px;border-radius:50%;margin:12px auto;background:radial-gradient(circle at 50% 30%,#0f5a42,#03100b);border:6px solid #1f2a26;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#eafff6;font-weight:800";
        mock.innerHTML = '<div style="font-size:30px">💧 6/8</div><div style="font-size:13px;opacity:.8">1,420 من 2,000</div><div style="display:flex;gap:8px;margin-top:4px"><span style="background:#19c58e;border-radius:12px;padding:4px 10px;font-size:12px">+ مية</span><span style="background:#f5c76b;color:#2a1c00;border-radius:12px;padding:4px 10px;font-size:12px">+ أكلة</span></div>';
        c.append(mock, el("div", "v30-mut", "شكل الواجهة المخطط له (تصميم)."));
        R.append(c, btn("افتح مركز الربط", "sec wide", function () { try { closeM(); } catch (e) {} if (W.L38) W.L38.open(); }, "plug"));
      });
    }

    // ============================================================ 10. وضع بدون نت كامل
    function viewOffline() {
      view("وضع بدون نت", "cloud38", "كل اللي يشتغل من غير إنترنت، واللي مستني يتزامن", function (R) {
        var on = navigator.onLine;
        var c = card(on ? "انت متصل دلوقتي" : "انت أوفلاين", on ? "check" : "cloud38", on ? "" : "gold");
        var out = ld("c4_out", []), q31 = ld("sp31_q", []), q36 = ld("sp36_q", []);
        c.append(row("رسايل شات مستنية", nf(out.length)), row("عمليات مستنية للمزامنة", nf((q31.length || 0) + (q36.length || 0))));
        R.append(c);
        var w = card("شغال من غير نت", "check");
        ["تسجيل الأكل من قاعدة الأكلات المصرية (1200+ صنف)", "المية والوزن والنوم والمزاج", "الصيام ورمضان والإشعارات", "التقارير والرسوم والتوأم الرقمي وبصمة الجوع", "الشات: الرسايل بتتحفظ وتتبعت لوحدها أول ما النت يرجع", "النسخة الاحتياطية والتصدير CSV"].forEach(function (t) { w.append(el("div", "v30-mut", "✓ " + t)); });
        var n = card("محتاج نت", "cloud38"); ["الذكاء (عين سعراتي، المدرب، الملخصات)", "الباركود والطقس والصلاة والأماكن", "المكالمات والحالات"].forEach(function (t) { n.append(el("div", "v30-mut", "• " + t)); });
        R.append(w, n, btn("زامن دلوقتي", "gold wide", function () { try { W.dispatchEvent(new Event("online")); } catch (e) {} try { typeof sync === "function" && sync(); } catch (e) {} say(navigator.onLine ? "بيتزامن…" : "مفيش نت دلوقتي"); }, "sync"));
      });
    }

    W.V30_EXTRA = (W.V30_EXTRA || []).concat([
      ["twin38", "توأمك الرقمي", "وزنك بعد 90 يوم بالأرقام", "twin38", true, viewTwin],
      ["cook38", "الطباخ الحي", "الكاميرا على الطاسة", "pan38", true, viewCook],
      ["book38", "وصفات العيلة", "سعراتها + نسخة أخف", "book38", false, viewFamilyBook],
      ["market38", "السوق الصحي", "قايمة الأسبوع ومين أرخص", "cart38", false, viewMarket],
      ["event38", "وضع المناسبات", "فرح أو عزومة بكرة؟", "party38", false, viewEvent],
      ["call38", "مدرب المكالمة", "دقيقة كل يوم بالصوت", "phone38", true, viewCall],
      ["hunger38", "بصمة الجوع", "اعرف ساعات الأكل من غير جوع", "finger38", false, viewHunger],
      ["map38", "خريطة أكل مصر", "أكلات كل محافظة", "map38", false, viewMap],
      ["watch38", "نسخة الساعة", "قريبًا — وليه", "watch38", false, viewWatch],
      ["off38", "وضع بدون نت", "إيه اللي شغال أوفلاين", "cloud38", false, viewOffline],
    ]);
    W.B38 = { version: 38, twin: viewTwin, cook: viewCook, book: viewFamilyBook, market: viewMarket, event: viewEvent, call: viewCall, hunger: viewHunger, map: viewMap, watch: viewWatch, offline: viewOffline };
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 500); }); else setTimeout(boot, 500);
})();
