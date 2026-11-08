/* سعراتي برو — v33 «حزمة البريميوم الطبية»: 4 أدوات جديدة جوه «مركز القوة» (بريميوم):
   1) رفيق إبر التخسيس GLP-1 (أوزمبيك/ويجوفي/مونجارو/ساكسندا): مواعيد + تذكير + تدوير أماكن الحقن + أعراض + حماية العضل.
   2) ضغط الدم والنبض: تصنيف AHA + متوسطات صباح/مساء + رسم + تحذير الأزمة + ملخص للدكتور.
   3) قياسات الجسم: الوسط/الحوض/الرقبة… + نسبة الدهون (معادلة البحرية الأمريكية) + نسبة الوسط للطول.
   4) تحضير الوجبات: اطبخ مرة، قسّم لحصص، وسجّل الحصة بضغطة من أكل التطبيق نفسه.
   كله محفوظ على الموبايل بس. */
(function () {
  "use strict";
  var W = window, D = document;
  function boot() {
    if (!W.V30 || !W.V30.kit) return setTimeout(boot, 400);
    var K = W.V30.kit, el = K.el, ic = K.ic, nf = K.nf, card = K.card, btn = K.btn, chips = K.chips, view = K.view;
    Object.assign(K.icons, {
      syr33: '<path d="M18 2l4 4M20 4l-9 9M15 6l3 3M7 13l4 4M4 20l3-3M9 11l4 4-6 6-4-4z"/>',
      heart33: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/><path d="M3 12h4l2-3 3 6 2-3h7"/>',
      tape33: '<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M7 7v4M11 7v3M15 7v4M19 7v3"/>',
      box33: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    });
    var inp = function (ph, type, val) { var i = el("input", "v30-in"); i.placeholder = ph; if (type) { i.type = type; if (type === "number") i.inputMode = "decimal"; } if (val != null && val !== "") i.value = val; return i; };
    var lbl = function (t) { var d = el("div", "v30-mut", t); d.style.margin = "8px 0 4px"; return d; };
    var row = function () { var r = el("div", "v30-row"); for (var i = 0; i < arguments.length; i++) r.append(arguments[i]); return r; };
    var li = function (icon, html) { var l = el("div", "v30-li"); l.append(el("span", null, icon)); var n = el("div", "n"); if (typeof html === "string") n.textContent = html; else n.append(html); l.append(n); return l; };
    var share = function (t) { try { if (W.Android && Android.share) return Android.share(t); if (navigator.share) return navigator.share({ text: t }); navigator.clipboard.writeText(t); K.say("اتنسخ"); } catch (e) {} };
    var wkg = function () { var p = K.prof() || {}; return +p.weight || 0; };
    var fmtD = function (t) { return new Date(t).toLocaleDateString("ar-EG", { weekday: "short", day: "numeric", month: "short" }); };
    var fmtT = function (t) { return new Date(t).toLocaleString("ar-EG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); };
    function line(points, opt) {
      opt = opt || {};
      return K.canvas(opt.h || 150, function (x, w, h) {
        var ser = opt.series || [{ v: points, c: "#34d399" }];
        var all = []; ser.forEach(function (s) { s.v.forEach(function (p) { if (p != null) all.push(p); }); }); (opt.bands || []).forEach(function (b) { all.push(b); });
        if (all.length < 1) return;
        var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all); if (mx - mn < 1) { mx += 1; mn -= 1; } var pd = (mx - mn) * 0.12; mn -= pd; mx += pd;
        var n = Math.max.apply(null, ser.map(function (s) { return s.v.length; }));
        var X = function (i) { return n < 2 ? w / 2 : 14 + (w - 28) * (1 - i / (n - 1)); }, Y = function (v) { return h - 14 - (h - 28) * (v - mn) / (mx - mn); };
        (opt.bands || []).forEach(function (b) { x.strokeStyle = "rgba(245,199,107,.35)"; x.setLineDash([4, 4]); x.lineWidth = 1; x.beginPath(); x.moveTo(8, Y(b)); x.lineTo(w - 8, Y(b)); x.stroke(); x.setLineDash([]); x.fillStyle = "rgba(245,199,107,.7)"; x.font = "10px sans-serif"; x.fillText(String(b), w - 30, Y(b) - 3); });
        ser.forEach(function (s) {
          x.strokeStyle = s.c; x.lineWidth = 2.4; x.lineJoin = "round"; x.beginPath(); var st = false;
          s.v.forEach(function (v, i) { if (v == null) return; if (!st) { x.moveTo(X(i), Y(v)); st = true; } else x.lineTo(X(i), Y(v)); }); x.stroke();
          s.v.forEach(function (v, i) { if (v == null) return; x.fillStyle = s.c; x.beginPath(); x.arc(X(i), Y(v), 3, 0, 7); x.fill(); });
        });
      });
    }
    var gate = function (R, what) { if (K.premium()) return false; R.append(K.lockView(what)); return true; };

    /* ================= 1) رفيق GLP-1 ================= */
    var MEDS = {
      sema: { n: "سيماجلوتايد (أوزمبيك / ويجوفي / ريبلسس)", every: 7, doses: ["0.25 مجم", "0.5 مجم", "1 مجم", "1.7 مجم", "2 مجم", "2.4 مجم"] },
      tirz: { n: "تيرزيباتايد (مونجارو / زيبباوند)", every: 7, doses: ["2.5 مجم", "5 مجم", "7.5 مجم", "10 مجم", "12.5 مجم", "15 مجم"] },
      lira: { n: "ليراجلوتايد (ساكسندا / فيكتوزا)", every: 1, doses: ["0.6 مجم", "1.2 مجم", "1.8 مجم", "2.4 مجم", "3 مجم"] },
    };
    var SITES = ["البطن يمين", "البطن شمال", "الفخذ يمين", "الفخذ شمال", "الدراع يمين", "الدراع شمال"];
    var SIDE = ["غثيان", "قيء", "إمساك", "إسهال", "حموضة", "انتفاخ", "صداع", "دوخة", "تعب", "فقدان شهية شديد"];
    var G = function () { return Object.assign({ med: "", dose: "", hour: 20, inj: [], fx: [], startW: 0, startAt: 0 }, K.ld("sp33_glp", {})); };
    var Gs = function (g) { K.sv("sp33_glp", g); };
    function glpNext(g) {
      var m = MEDS[g.med]; if (!m) return null;
      var last = g.inj.length ? g.inj[g.inj.length - 1].t : 0;
      var d = new Date(last ? last + m.every * 864e5 : Date.now()); d.setHours(g.hour, 0, 0, 0);
      if (!last && d.getTime() < Date.now()) d = K.addDays(d, 1);
      return d.getTime();
    }
    function glpRemind(g) {
      var t = glpNext(g); if (!t) return;
      var sec = Math.round((t - Date.now()) / 1000); if (sec < 60) return;
      if (K.ld("sp33_glp_rem", 0) === t) return; K.sv("sp33_glp_rem", t);
      try { if (W.NOTIF37 && NOTIF37.available()) NOTIF37.once("glp33", sec, "💉 ميعاد الحقنة", (MEDS[g.med] ? MEDS[g.med].n.split(" (")[0] : "") + " " + g.dose + " — المكان المقترح: " + nextSite(g)); } catch (e) {}
    }
    var nextSite = function (g) { var l = g.inj.length ? g.inj[g.inj.length - 1].site : null; var i = SITES.indexOf(l); return SITES[(i + 1) % SITES.length]; };
    function viewGLP() {
      view("رفيق إبر التخسيس", "syr33", "مواعيدك، أماكن الحقن، الأعراض، وحماية عضلك وانت بتخس.", function (R) {
        if (gate(R, "رفيق أوزمبيك ومونجارو وساكسندا: تذكير الحقنة، تدوير الأماكن، الأعراض، وحماية العضل.")) return;
        var g = G();
        if (!g.med) return glpSetup(R, g);
        var m = MEDS[g.med], nx = glpNext(g), left = nx - Date.now();
        var c = card(null, null, "gold"); c.style.textAlign = "center";
        c.append(el("div", "v30-mut", m.n + " · " + g.dose));
        var big = el("div", "v30-big"); big.textContent = left <= 0 ? "دلوقتي" : left < 864e5 ? nf(left / 36e5, 0) + " ساعة" : nf(Math.ceil(left / 864e5)) + (Math.ceil(left / 864e5) <= 10 ? " أيام" : " يوم");
        c.append(el("div", "v30-mut", "الحقنة الجاية"), big, el("div", "v30-mut", fmtT(nx) + " · المكان المقترح: " + nextSite(g)));
        var site = nextSite(g);
        var sc = chips(SITES.map(function (s) { return [s, s]; }), site, function (v) { site = v; }); sc.style.margin = "10px 0";
        c.append(sc, btn("سجّلت الحقنة", "gold wide", function () {
          g.inj.push({ t: Date.now(), dose: g.dose, site: site }); g.inj = g.inj.slice(-200); Gs(g); glpRemind(g); K.hap(30); K.say("اتسجّلت ✔ وهفكّرك بالجاية"); viewGLP();
        }, "check30"));
        R.append(c);
        // حماية العضل: بروتين النهارده
        var day = K.sumD(K.getD(K.dayKey(new Date()))), w = wkg(), pf = w ? Math.round(w * 1.2) : 90;
        var pc = card("حماية العضل النهارده", "medal30");
        pc.append(row(el("b", null, nf(day.p) + " / " + nf(pf) + " جم بروتين"), el("div", "v30-sp"), el("span", "v30-mut", nf(day.k) + " سعرة")), K.bar(100 * day.p / pf));
        pc.append(el("div", "v30-mut", "مع الإبر الشهية بتقل جدًا، فالبروتين أول حاجة في كل وجبة علشان الوزن اللي ينزل يبقى دهون مش عضل" + (w ? " (١.٢ جم لكل كيلو من وزنك)." : ".")));
        var hr = new Date().getHours();
        if (hr >= 18 && day.k > 0 && day.k < 1000) pc.append(el("div", "v30-warn", "أكلك النهارده أقل من ١٠٠٠ سعرة. كُل وجبة فيها بروتين حتى لو صغيرة."));
        R.append(pc);
        // الوزن من أول الإبرة
        var wm = null; try { wm = W.V30.weight(); } catch (e) {}
        if (g.startW && wm && wm.trend) {
          var lost = g.startW - wm.trend, wk = Math.max(1, (Date.now() - g.startAt) / 6048e5);
          var wc = card("رحلتك مع الإبرة", "trend30"); var ks = el("div", "v30-kpis");
          ks.append(K.kpi(nf(lost, 1) + " كجم", "نزلت"), K.kpi(nf(100 * lost / g.startW, 1) + "٪", "من وزنك"), K.kpi(nf(lost / wk, 2), "كجم/أسبوع"));
          wc.append(ks); if (lost / wk > 1.5) wc.append(el("div", "v30-warn", "النزول أسرع من ١.٥ كجم في الأسبوع. اتكلم مع دكتورك وزوّد البروتين.")); R.append(wc);
        }
        // الأعراض
        var fc = card("الأعراض النهارده", "alert30"); var sel = {};
        var fw = el("div", "v30-chips"); SIDE.forEach(function (s) { var b = el("button", "v30-chip", s); b.onclick = function () { K.hap(); sel[s] = ((sel[s] || 0) % 3) + 1; b.classList.toggle("on", !!sel[s]); b.textContent = s + (sel[s] ? " " + "•".repeat(sel[s]) : ""); }; fw.append(b); });
        fc.append(el("div", "v30-mut", "دوس مرة = خفيف، مرتين = متوسط، ٣ = شديد."), fw, btn("احفظ الأعراض", "sec wide", function () {
          var ks = Object.keys(sel).filter(function (k) { return sel[k]; }); if (!ks.length) return K.say("اختار عرض الأول");
          g.fx.push({ t: Date.now(), s: ks.map(function (k) { return [k, sel[k]]; }) }); g.fx = g.fx.slice(-300); Gs(g); K.say("اتحفظت");
          if (ks.some(function (k) { return sel[k] === 3 && (k === "قيء" || k === "فقدان شهية شديد"); })) alert("قيء شديد أو عدم قدرة على الأكل والشرب محتاج دكتور النهارده. ولو في ألم شديد ومستمر في البطن أو الضهر، روح طوارئ.");
          viewGLP();
        }));
        var tip = { "غثيان": "وجبات صغيرة، بطّل الأكل أول ما تشبع، وابعد عن الدسم والمقلي.", "إمساك": "ميّه أكتر وخضار وشوفان، ومشي بعد الأكل.", "حموضة": "متناماش بعد الأكل بساعتين إلا ربع، وقلّل الحار.", "صداع": "غالبًا ميّه قليلة — اشرب كوبايتين دلوقتي.", "دوخة": "اشرب ميّه وكُل حاجة فيها ملح خفيف، ولو استمرت كلّم الدكتور." };
        var last = g.fx.filter(function (f) { return Date.now() - f.t < 864e5; }).pop();
        if (last) last.s.forEach(function (p) { if (tip[p[0]]) fc.append(li("💡", p[0] + ": " + tip[p[0]])); });
        // نمط الأعراض حسب يوم الحقنة
        if (g.fx.length >= 4 && g.inj.length >= 2) {
          var byD = {}; g.fx.forEach(function (f) { var prev = g.inj.filter(function (i) { return i.t <= f.t; }).pop(); if (!prev) return; var dd = Math.floor((f.t - prev.t) / 864e5); byD[dd] = (byD[dd] || 0) + f.s.reduce(function (a, p) { return a + p[1]; }, 0); });
          var top = Object.keys(byD).sort(function (a, b) { return byD[b] - byD[a]; })[0];
          if (top != null) fc.append(li("📊", "الأعراض عندك بتزيد في اليوم " + nf(+top + 1) + " بعد الحقنة — جهّز أكل خفيف اليوم ده."));
        }
        R.append(fc);
        var hc = card("سجل الحقن", "doc30");
        g.inj.slice(-8).reverse().forEach(function (i) { hc.append(li("💉", fmtD(i.t) + " · " + i.dose + " · " + i.site)); });
        if (!g.inj.length) hc.append(el("div", "v30-mut", "لسه مفيش حقن مسجلة."));
        hc.append(row(btn("شارك للدكتور", "sec", function () {
          share("ملخص إبر التخسيس — سعراتي\nالدواء: " + m.n + " " + g.dose + "\nآخر الحقن:\n" + g.inj.slice(-6).map(function (i) { return "• " + fmtD(i.t) + " " + i.dose + " (" + i.site + ")"; }).join("\n") + "\nالأعراض آخر أسبوعين:\n" + g.fx.filter(function (f) { return Date.now() - f.t < 14 * 864e5; }).map(function (f) { return "• " + fmtD(f.t) + ": " + f.s.map(function (p) { return p[0] + "(" + p[1] + ")"; }).join("، "); }).join("\n"));
        }, "share30"), btn("غيّر الدواء/الجرعة", "sec", function () { K.view("رفيق إبر التخسيس", "syr33", null, function (R2) { glpSetup(R2, G()); }); })));
        R.append(hc);
        R.append(el("div", "v30-note", "الجرعة وتغييرها قرار دكتورك بس. التطبيق بيفكّرك وبينظّم، ومش بيوصف علاج."));
      });
    }
    function glpSetup(R, g) {
      var c = card("إعداد الإبرة", "syr33", "gold"); var med = g.med || "sema", dose = g.dose;
      var dw = el("div");
      var drawD = function () { dw.replaceChildren(lbl("الجرعة الحالية (زي ما الدكتور كتب)"), chips(MEDS[med].doses.map(function (d) { return [d, d]; }), dose, function (v) { dose = v; })); };
      c.append(lbl("الدواء"), chips(Object.keys(MEDS).map(function (k) { return [k, MEDS[k].n]; }), med, function (v) { med = v; dose = ""; drawD(); }), dw);
      drawD();
      var hr = inp("الساعة (٠–٢٣)", "number", g.hour);
      c.append(lbl("ساعة التذكير"), hr, lbl("آخر حقنة أخدتها (لو فاكر)"));
      var lastIn = el("input", "v30-in"); lastIn.type = "date"; c.append(lastIn);
      c.append(el("div", "v30-sp"), btn("احفظ وابدأ", "gold wide", function () {
        if (!dose) return K.say("اختار الجرعة");
        g.med = med; g.dose = dose; g.hour = K.clamp(Math.round(+hr.value || 20), 0, 23);
        if (lastIn.value) { var d = new Date(lastIn.value); d.setHours(g.hour, 0, 0, 0); if (d.getTime() < Date.now()) g.inj.push({ t: d.getTime(), dose: dose, site: SITES[0] }); }
        if (!g.startAt) { g.startAt = Date.now(); try { var wm = W.V30.weight(); g.startW = (wm && wm.trend) || wkg(); } catch (e) { g.startW = wkg(); } }
        Gs(g); glpRemind(g); K.say("تمام ✔"); viewGLP();
      }, "check30"));
      R.append(c);
    }

    /* ================= 2) ضغط الدم ================= */
    var BP = function () { return K.ld("sp33_bp", []); };
    function bpCls(s, d) {
      if (s > 180 || d > 120) return ["أزمة ضغط", "#ef4444", 4];
      if (s >= 140 || d >= 90) return ["ضغط عالي — درجة تانية", "#f97316", 3];
      if (s >= 130 || d >= 80) return ["ضغط عالي — درجة أولى", "#f59e0b", 2];
      if (s >= 120) return ["مرتفع شوية", "#eab308", 1];
      if (s < 90 || d < 60) return ["واطي", "#60a5fa", 0];
      return ["طبيعي", "#10b981", 0];
    }
    function viewBP() {
      view("الضغط والنبض", "heart33", "سجّل قياسك، وشوف المتوسط الحقيقي مش قياس واحد.", function (R) {
        if (gate(R, "متابعة الضغط والنبض بتصنيف طبي ومتوسطات ورسم وملخص للدكتور.")) return;
        var L = BP();
        var c = card("قياس جديد", "heart33", "gold");
        var s = inp("الانقباضي (العالي) مثلاً 120", "number"), d = inp("الانبساطي (الواطي) مثلاً 80", "number"), p = inp("النبض (اختياري)", "number");
        var arm = "يسار"; c.append(row(s, d), p, chips([["يسار", "دراع شمال"], ["يمين", "دراع يمين"]], arm, function (v) { arm = v; }));
        c.append(btn("احفظ القياس", "gold wide", function () {
          var S = Math.round(+s.value), Dd = Math.round(+d.value), P = Math.round(+p.value) || null;
          if (!(S >= 60 && S <= 260 && Dd >= 30 && Dd <= 160 && S > Dd)) return K.say("الأرقام مش منطقية — راجعها");
          L.push({ t: Date.now(), s: S, d: Dd, p: P, arm: arm }); K.sv("sp33_bp", L.slice(-500)); K.hap(20);
          var k = bpCls(S, Dd); if (k[2] === 4) alert("القراءة دي (" + S + "/" + Dd + ") في نطاق أزمة الضغط. استريّح ٥ دقايق وقيس تاني. لو لسه عالية أو معاها ألم صدر أو ضيق نفس أو تنميل أو زغللة — روح طوارئ فورًا.");
          viewBP();
        }, "check30"));
        c.append(el("div", "v30-mut", "قيس وانت قاعد مرتاح ٥ دقايق، ضهرك مسنود ودراعك على مستوى القلب، ومن غير قهوة أو سجاير قبلها بنص ساعة."));
        R.append(c);
        if (!L.length) return;
        var last = L[L.length - 1], lk = bpCls(last.s, last.d);
        var a7 = L.filter(function (x) { return Date.now() - x.t < 7 * 864e5; });
        var av = function (A, f) { return A.length ? Math.round(K.mean(A.map(function (x) { return x[f]; }))) : null; };
        var sc = card(null, null); var top = row(el("div", "v30-big", last.s + "/" + last.d), el("div", "v30-sp"));
        var tag = el("span", "v30-chip on", lk[0]); tag.style.background = lk[1]; tag.style.color = "#fff"; top.append(tag); sc.append(top);
        sc.append(el("div", "v30-mut", "آخر قياس " + fmtT(last.t) + (last.p ? " · نبض " + last.p : "")));
        var ks = el("div", "v30-kpis");
        var am = a7.filter(function (x) { return new Date(x.t).getHours() < 12; }), pm = a7.filter(function (x) { return new Date(x.t).getHours() >= 12; });
        ks.append(K.kpi(a7.length ? av(a7, "s") + "/" + av(a7, "d") : "—", "متوسط ٧ أيام"), K.kpi(am.length ? av(am, "s") + "/" + av(am, "d") : "—", "الصبح"), K.kpi(pm.length ? av(pm, "s") + "/" + av(pm, "d") : "—", "بالليل"));
        sc.append(ks);
        if (a7.length >= 3) { var k7 = bpCls(av(a7, "s"), av(a7, "d")); sc.append(li(k7[2] >= 2 ? "⚠️" : "✅", "متوسط الأسبوع: " + k7[0] + (k7[2] >= 2 ? ". اعرض الأرقام دي على دكتورك." : "."))); }
        var lst = L.slice(-30).reverse();
        sc.append(line(null, { h: 170, bands: [120, 80, 140, 90].filter(function (v, i, a) { return a.indexOf(v) === i; }), series: [{ v: lst.map(function (x) { return x.s; }), c: "#f97316" }, { v: lst.map(function (x) { return x.d; }), c: "#60a5fa" }] }));
        sc.append(el("div", "v30-mut", "البرتقالي العالي · الأزرق الواطي · الخطوط المتقطعة حدود ١٢٠/٨٠ و١٤٠/٩٠ (الأحدث على اليمين)."));
        R.append(sc);
        // ربط بالأكل: أيام الأكل الكتير والمخلل/الفسيخ/الشيبسي
        var salty = /مخلل|فسيخ|رنجة|ملوحة|شيبس|جبنة رومي|جبنه رومي|بسطرمة|لانشون|سجق|اندومي|نودلز|شوربة جاهزة/;
        var sd = 0; K.intakeSeries(7).forEach(function (x) { if (x.items.some(function (i) { return salty.test(i.n || ""); })) sd++; });
        if (sd) R.append(card(null, null).appendChild(li("🧂", "أكلت أكل عالي الملح " + nf(sd) + " أيام من آخر ٧. الملح بيرفع الضغط عند ناس كتير — قلّله أسبوع وقارن المتوسط.")).parentNode);
        var hc = card("كل القياسات", "doc30");
        L.slice(-12).reverse().forEach(function (x, i) {
          var k = bpCls(x.s, x.d); var l = li("●", fmtT(x.t) + " — " + x.s + "/" + x.d + (x.p ? " · نبض " + x.p : "") + " · " + k[0]); l.firstChild.style.color = k[1];
          var del = el("button", "v30-chip", "مسح"); del.onclick = function () { if (!confirm("أمسح القياس ده؟")) return; var A = BP(); A.splice(A.length - 1 - i, 1); K.sv("sp33_bp", A); viewBP(); }; l.append(del); hc.append(l);
        });
        hc.append(btn("شارك للدكتور (آخر ٣٠ يوم)", "sec wide", function () {
          var A = L.filter(function (x) { return Date.now() - x.t < 30 * 864e5; });
          share("قياسات الضغط — سعراتي (آخر ٣٠ يوم، " + A.length + " قياس)\nالمتوسط: " + av(A, "s") + "/" + av(A, "d") + (av(A.filter(function (x) { return x.p; }), "p") ? " · نبض " + av(A.filter(function (x) { return x.p; }), "p") : "") + "\n" + A.slice(-20).map(function (x) { return "• " + fmtT(x.t) + ": " + x.s + "/" + x.d + (x.p ? " نبض " + x.p : ""); }).join("\n"));
        }, "share30"));
        R.append(hc);
        R.append(el("div", "v30-note", "تصنيف جمعية القلب الأمريكية (AHA). معلومات عامة ومش بديل عن الدكتور."));
      });
    }

    /* ================= 3) قياسات الجسم ================= */
    var MF = [["waist", "الوسط (عند السُّرة)"], ["hip", "الحوض (أعرض نقطة)"], ["neck", "الرقبة (تحت الحنجرة)"], ["chest", "الصدر"], ["arm", "الدراع"], ["thigh", "الفخد"]];
    var ME = function () { return K.ld("sp33_meas", []); };
    function bodyFat(m, p) {
      var h = +p.height, sex = String(p.sex || "").toLowerCase();
      if (!h || !m.waist || !m.neck) return null;
      var male = /^m|ذكر|راجل/.test(sex);
      if (male) { if (m.waist - m.neck <= 0) return null; return 495 / (1.0324 - 0.19077 * Math.log10(m.waist - m.neck) + 0.15456 * Math.log10(h)) - 450; }
      if (!m.hip || m.waist + m.hip - m.neck <= 0) return null;
      return 495 / (1.29579 - 0.35004 * Math.log10(m.waist + m.hip - m.neck) + 0.221 * Math.log10(h)) - 450;
    }
    function viewMeas() {
      view("قياسات الجسم", "tape33", "الشريط بيقول اللي الميزان مش بيقوله.", function (R) {
        if (gate(R, "قياسات الجسم + نسبة الدهون + نسبة الوسط للطول + تطور كل مقاس.")) return;
        var L = ME(), p = K.prof() || {}, last = L[L.length - 1] || {};
        var c = card("قياس جديد (سم)", "tape33", "gold"); var ins = {};
        MF.forEach(function (f) { ins[f[0]] = inp(f[1] + (last[f[0]] ? " · آخر مرة " + last[f[0]] : ""), "number"); c.append(ins[f[0]]); ins[f[0]].style.marginBottom = "6px"; });
        c.append(btn("احفظ", "gold wide", function () {
          var m = { t: Date.now() }, n = 0;
          MF.forEach(function (f) { var v = +ins[f[0]].value; if (v >= 15 && v <= 250) { m[f[0]] = Math.round(v * 10) / 10; n++; } });
          if (!n) return K.say("اكتب مقاس واحد على الأقل");
          L.push(m); K.sv("sp33_meas", L.slice(-300)); K.hap(20); K.say("اتحفظ ✔"); viewMeas();
        }, "check30"));
        c.append(el("div", "v30-mut", "قيس الصبح قبل الأكل، الشريط مفرود ومش مشدود، وكل مرة نفس المكان."));
        R.append(c);
        if (!L.length) return;
        var lv = {}; MF.forEach(function (f) { for (var i = L.length - 1; i >= 0; i--) if (L[i][f[0]]) { lv[f[0]] = L[i][f[0]]; break; } });
        var fv = {}; MF.forEach(function (f) { for (var i = 0; i < L.length; i++) if (L[i][f[0]]) { fv[f[0]] = L[i][f[0]]; break; } });
        var sc = card("صحتك من الشريط", "medal30"); var ks = el("div", "v30-kpis");
        var bf = bodyFat(lv, p), h = +p.height;
        var whtr = h && lv.waist ? lv.waist / h : null, whr = lv.waist && lv.hip ? lv.waist / lv.hip : null;
        ks.append(K.kpi(bf != null && bf > 2 && bf < 70 ? nf(bf, 1) + "٪" : "—", "نسبة الدهون"), K.kpi(whtr ? nf(whtr, 2) : "—", "الوسط ÷ الطول"), K.kpi(whr ? nf(whr, 2) : "—", "الوسط ÷ الحوض"));
        sc.append(ks);
        if (whtr) sc.append(li(whtr < 0.5 ? "✅" : whtr < 0.6 ? "⚠️" : "🔴", whtr < 0.5 ? "وسطك أقل من نص طولك — ده النطاق الصحي." : whtr < 0.6 ? "وسطك فوق نص طولك — خطر القلب والسكر بيزيد شوية. هدفك " + nf(h / 2) + " سم." : "دهون البطن عالية — ده أهم رقم تنزّله. هدفك الأول " + nf(h * 0.55) + " سم."));
        if (bf != null && bf > 2 && bf < 70 && wkg()) sc.append(li("💪", "تقريبًا " + nf(wkg() * bf / 100, 1) + " كجم دهون و" + nf(wkg() * (1 - bf / 100), 1) + " كجم كتلة عضل وعضم ومية."));
        if (!h || !p.sex) sc.append(el("div", "v30-mut", "علشان نسبة الدهون: لازم طولك ونوعك يكونوا في ملفك."));
        else if (!lv.neck) sc.append(el("div", "v30-mut", "قيس رقبتك علشان نحسب نسبة الدهون."));
        R.append(sc);
        var ch = card("التغيير من أول قياس", "trend30");
        MF.forEach(function (f) { if (lv[f[0]] && fv[f[0]]) { var dd = lv[f[0]] - fv[f[0]]; ch.append(li(dd < 0 ? "⬇️" : dd > 0 ? "⬆️" : "➖", f[1].split(" (")[0] + ": " + nf(lv[f[0]], 1) + " سم (" + (dd > 0 ? "+" : "") + nf(dd, 1) + ")")); } });
        var ws = L.filter(function (x) { return x.waist; }).slice(-20).reverse();
        if (ws.length >= 2) { ch.append(el("div", "v30-mut", "الوسط بمرور الوقت (الأحدث على اليمين)")); ch.append(line(ws.map(function (x) { return x.waist; }), { h: 140, bands: h ? [Math.round(h / 2)] : [] })); }
        R.append(ch);
        R.append(el("div", "v30-note", "نسبة الدهون بمعادلة البحرية الأمريكية — تقدير بدقة ±٣٪ تقريبًا، والأهم اتجاهها مش رقمها."));
      });
    }

    /* ================= 4) تحضير الوجبات ================= */
    var PR = function () { return K.ld("sp33_prep", []); };
    function viewPrep() {
      view("تحضير الوجبات", "box33", "اطبخ مرة للأسبوع، وكل علبة تتسجّل بضغطة بسعراتها الحقيقية.", function (R) {
        if (gate(R, "اطبخ مرة، قسّم لعلب، وسجّل كل علبة بضغطة بماكروزها الدقيقة.")) return;
        var L = PR();
        L.forEach(function (b, idx) {
          var c = card(null, null, b.left ? "gold" : ""); var pp = b.per;
          c.append(row(el("b", null, "📦 " + b.n), el("div", "v30-sp"), el("span", "v30-chip on", "باقي " + nf(b.left) + " من " + nf(b.N))));
          c.append(el("div", "v30-mut", "الحصة: " + nf(pp.k) + " سعرة · بروتين " + nf(pp.p) + " · كارب " + nf(pp.c) + " · دهون " + nf(pp.f) + " · اتعملت " + fmtD(b.t)));
          if (Date.now() - b.t > 4 * 864e5 && b.left) c.append(el("div", "v30-warn", "العلب دي بقالها أكتر من ٤ أيام — لو في التلاجة مش الفريزر، اتأكد إنها لسه سليمة."));
          var rr = row();
          if (b.left) rr.append(btn("كُلت علبة", "gold", function () {
            var ok = K.logFood({ id: "prep33_" + b.id, n: b.n + " (حصة محضّرة)", sv: "علبة", cat: "تحضير", k: pp.k, p: pp.p, c: pp.c, f: pp.f }, 1);
            if (!ok) return K.say("مقدرتش أسجّل");
            var A = PR(); A[idx].left--; K.sv("sp33_prep", A); K.hap(25); K.say("اتسجّلت ✔"); viewPrep();
          }, "check30"));
          rr.append(btn("مسح", "red", function () { if (!confirm("أمسح «" + b.n + "»؟")) return; var A = PR(); A.splice(idx, 1); K.sv("sp33_prep", A); viewPrep(); }));
          c.append(rr); R.append(c);
        });
        // طبخة جديدة
        var nc = card("طبخة جديدة", "plus30", L.length ? "" : "gold");
        var name = inp("اسم الطبخة (مثلاً: فراخ ورز وخضار)"); var q = inp("دوّر على مكوّن من أكل التطبيق…");
        var res = el("div"), ing = [], list = el("div"), tot = el("div", "v30-mut"), N = inp("عدد العلب", "number", 5);
        var redraw = function () {
          list.replaceChildren();
          ing.forEach(function (x, i) {
            var l = li("•", x.f.n + " × " + nf(x.q, 2) + " " + (x.f.sv || "حصة") + " = " + nf(x.f.k * x.q) + " سعرة");
            var m = el("button", "v30-chip", "−"); m.onclick = function () { x.q = Math.max(0.25, x.q - 0.5); redraw(); };
            var pl = el("button", "v30-chip", "+"); pl.onclick = function () { x.q += 0.5; redraw(); };
            var rm = el("button", "v30-chip", "×"); rm.onclick = function () { ing.splice(i, 1); redraw(); };
            l.append(m, pl, rm); list.append(l);
          });
          var T = ing.reduce(function (a, x) { a.k += x.f.k * x.q; a.p += x.f.p * x.q; a.c += x.f.c * x.q; a.f += x.f.f * x.q; return a; }, { k: 0, p: 0, c: 0, f: 0 });
          var n = Math.max(1, Math.round(+N.value || 1));
          tot.textContent = ing.length ? "الطبخة كلها " + nf(T.k) + " سعرة ← العلبة " + nf(T.k / n) + " سعرة و" + nf(T.p / n) + " جم بروتين" : "ضيف المكونات بالكميات اللي هتطبخها كلها.";
        };
        N.oninput = redraw;
        var tm = 0;
        q.oninput = function () {
          clearTimeout(tm); tm = setTimeout(function () {
            var s = K.norm(q.value); res.replaceChildren(); if (s.length < 2) return;
            var all = K.foodsAll(), hits = [];
            for (var i = 0; i < all.length && hits.length < 8; i++) { var f = all[i]; if (f && f.n && K.norm(f.n).indexOf(s) >= 0 && +f.k >= 0) hits.push(f); }
            if (!hits.length) res.append(el("div", "v30-mut", "مش لاقي — جرّب اسم تاني."));
            hits.forEach(function (f) { var b = el("button", "v30-chip", f.n + " · " + nf(f.k) + " (" + (f.sv || "حصة") + ")"); b.style.margin = "3px"; b.onclick = function () { K.hap(); ing.push({ f: { n: f.n, sv: f.sv, k: +f.k || 0, p: +f.p || 0, c: +f.c || 0, f: +f.f || 0 }, q: 1 }); q.value = ""; res.replaceChildren(); redraw(); }; res.append(b); });
          }, 180);
        };
        nc.append(name, el("div", "v30-sp"), q, res, list, lbl("عدد العلب"), N, tot, btn("احفظ الطبخة", "gold wide", function () {
          if (!ing.length) return K.say("ضيف مكوّن الأول");
          var n = K.clamp(Math.round(+N.value || 1), 1, 30);
          var T = ing.reduce(function (a, x) { a.k += x.f.k * x.q; a.p += x.f.p * x.q; a.c += x.f.c * x.q; a.f += x.f.f * x.q; return a; }, { k: 0, p: 0, c: 0, f: 0 });
          var r1 = function (v) { return Math.round(v / n * 10) / 10; };
          var A = PR(); A.unshift({ id: Date.now().toString(36), n: (name.value.trim() || "طبخة") .slice(0, 60), N: n, left: n, t: Date.now(), per: { k: Math.round(T.k / n), p: r1(T.p), c: r1(T.c), f: r1(T.f) }, ing: ing.map(function (x) { return [x.f.n, x.q]; }) });
          K.sv("sp33_prep", A.slice(0, 30)); K.hap(30); K.say("جاهزة ✔ " + n + " علب"); viewPrep();
        }, "check30"));
        redraw(); R.append(nc);
      });
    }

    W.V30_EXTRA = [
      ["glp1", "رفيق إبر التخسيس", "أوزمبيك · مونجارو · ساكسندا", "syr33", true, viewGLP],
      ["bp", "الضغط والنبض", "تصنيف طبي + متوسطات", "heart33", true, viewBP],
      ["meas", "قياسات الجسم", "نسبة الدهون والوسط", "tape33", true, viewMeas],
      ["prep", "تحضير الوجبات", "اطبخ مرة · سجّل بضغطة", "box33", true, viewPrep],
    ];
    W.V33 = { version: 33, glp: G, bp: BP, meas: ME, prep: PR, bodyFat: bodyFat, bpClass: bpCls, open: function (k) { W.V30.open(k); } };
    try { var g = G(); if (g.med) glpRemind(g); } catch (e) {}
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 300); }); else setTimeout(boot, 300);
})();
