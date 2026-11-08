/* واتساب سعراتي 4.0 — chat4plus.js (فوق chat4.js عن طريق C4.X)
   CHAT 1.4 تصويت ذكي/كويز · 1.10 مساعد الكتابة · 1.11 فويس بنص · 1.12 صانع ستيكرات · 1.13/1.14 مكالمات وغرف صوت (WebRTC)
   1.15 موقع مباشر · 1.16 بوتات · 1.17 ألقاب · 1.18 رسالة ترحيب · 1.19 بحث في كل الشاتات · 1.21 كارت وجبة من صورة
   1.22 ترتيب التحدي · 1.23 شارك يومي مع الكوتش · 1.24 خطة/قايمة مشتركة · 1.25 صاحب الالتزام · 1.26 @سعراتي
   1.27 فويس → تسجيل · 1.28 حالات صحية · 1.29 💪 نقاط */
(function () {
  "use strict";
  var W = window, D = document;
  if (!W.C4 || W.C4P) return;
  var C = W.C4, X = C.X, S = C.state, esc = C.esc, ic = C.ic, emo = C.emoText, emi = C.emoImg, say = C.say, hap = C.hap, api = C.api;
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var now = function () { return Date.now(); };
  var room = function () { return S.room; };
  var isAdm = function () { return S.room && (S.room.role === "owner" || S.room.role === "admin"); };
  var css = D.createElement("style");
  css.textContent = [
    "#c4 .tg38{display:inline-block;margin-inline-start:6px;padding:0 7px;border-radius:8px;font-size:11px;font-weight:800;vertical-align:1px}",
    "#c4 .tg38.gold{background:#f6d77b;color:#3a2800}#c4 .tg38.green{background:#19c58e;color:#02140d}#c4 .tg38.blue{background:#60a5fa;color:#061a33}#c4 .tg38.pink{background:#f472b6;color:#3b0420}#c4 .tg38.purple{background:#a78bfa;color:#1b0b3b}#c4 .tg38.orange{background:#fb923c;color:#3a1500}",
    "#c4 .txb{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}#c4 .txb button{border:0;border-radius:10px;padding:4px 10px;font:inherit;font-size:12.5px;background:rgba(0,0,0,.22);color:inherit;display:flex;gap:4px;align-items:center}#c4 .txb .ic38{width:14px;height:14px}",
    "#c4 .pn{min-width:240px}#c4 .pn .it{display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid rgba(255,255,255,.06)}#c4 .pn .it i{width:22px;height:22px;border-radius:7px;border:2px solid #3ff0b0;display:flex;align-items:center;justify-content:center;flex:none}#c4 .pn .it.d i{background:#19c58e}#c4 .pn .it.d span{text-decoration:line-through;opacity:.6}",
    "#c4 .st38{display:flex;gap:12px;overflow-x:auto;padding:4px 8px 12px;scrollbar-width:none}#c4 .st38::-webkit-scrollbar{display:none}#c4 .st38 .s{flex:none;width:68px;text-align:center;font-size:12px;color:#cfe}",
    "#c4 .st38 .ring{width:62px;height:62px;border-radius:50%;padding:3px;background:conic-gradient(#19c58e,#f6d77b,#19c58e);margin:0 auto 4px}#c4 .st38 .ring.seen{background:#3b5249}#c4 .st38 .ring>div{width:100%;height:100%;border-radius:50%;background:#0b1712;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #06100c}#c4 .st38 .ring .e38{width:30px;height:30px}",
    "#c4 .stv{position:absolute;inset:0;z-index:30;background:linear-gradient(160deg,#0f8f67,#063b2b);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:30px;text-align:center;font-size:26px;font-weight:800;line-height:1.6}#c4 .stv .bar{position:absolute;top:calc(env(safe-area-inset-top) + 10px);left:12px;right:12px;height:3px;background:rgba(255,255,255,.3);border-radius:2px;overflow:hidden}#c4 .stv .bar i{display:block;height:100%;background:#fff;animation:c4st 5s linear forwards}#c4 .stv small{font-size:14px;opacity:.8;font-weight:400;margin-top:18px}#c4 .stv .e38{width:1.4em;height:1.4em}",
    "@keyframes c4st{from{width:0}to{width:100%}}",
    "#c4 .bd .r{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid rgba(255,255,255,.06)}#c4 .bd .r b{flex:1}#c4 .bd .r .n{width:28px;text-align:center;font-weight:900}",
    "#c4 .call{position:absolute;inset:0;z-index:40;background:radial-gradient(100% 70% at 50% 0%,#0f5a42,#03100b);display:flex;flex-direction:column;align-items:center}#c4 .call .vids{flex:1;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:calc(env(safe-area-inset-top) + 60px) 10px 10px;align-content:start}#c4 .call video{width:100%;border-radius:18px;background:#000;aspect-ratio:3/4;object-fit:cover}#c4 .call .ttl2{position:absolute;top:calc(env(safe-area-inset-top) + 14px);font-size:18px;font-weight:800}#c4 .call .ctl{display:flex;gap:18px;padding:18px 0 calc(env(safe-area-inset-bottom) + 28px)}#c4 .call .ctl button{width:64px;height:64px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;display:flex;align-items:center;justify-content:center}#c4 .call .ctl .end{background:#e5384f}#c4 .call .ctl .off{background:#fff;color:#000}#c4 .call .peer{display:flex;flex-direction:column;align-items:center;gap:8px;color:#cfe;font-size:14px}",
    "#c4 .live38{display:inline-flex;align-items:center;gap:4px;background:#e5384f;color:#fff;border-radius:8px;padding:0 6px;font-size:11px;font-weight:800;margin-inline-start:6px}#c4 .live38 i{width:6px;height:6px;border-radius:50%;background:#fff;animation:c4bl 1s infinite}",
    "#c4 .sticker{background:transparent!important;border:0!important;box-shadow:none!important;padding:0}#c4 .sticker .img{max-width:170px;background:transparent;min-height:0}",
    "#c4 .via{font-size:11.5px;opacity:.75;margin-inline-start:4px;font-weight:400}",
  ].join("");
  D.head.appendChild(css);

  function AIc() { return C.G("AI"); }
  function aiOk() { var A = AIc(); return A && A.call && (!A.ready || A.ready()); }

  // ------------------------------------------------------------ 1.17 tags + bot/via labels in names
  X.who.push(function (m) {
    var mem = S.info && S.info.members && S.info.members.filter(function (x) { return x.uid === m.uid; })[0];
    var h = mem && mem.tag ? '<span class="tg38 ' + esc(mem.tag.color || "gold") + '">' + esc(mem.tag.tag) + "</span>" : "";
    if (m.meta && m.meta.via === "sorati") h += '<span class="via">🤖 رد @سعراتي</span>';
    return h;
  });
  X.memberOps.push(function (uid) { return '<div class="li tap" data-a="x_tag" data-v="' + esc(uid) + '">' + ic("star", 22) + "لقب ملوّن</div>"; });
  X.actions.x_tag = function (el, uid) {
    C.formSheet("لقب العضو", [{ k: "tag", ph: "كوتش · بطل التحدي · جديد (فاضي = شيل اللقب)" }, { k: "color", type: "select", opts: [["gold", "ذهبي"], ["green", "أخضر"], ["blue", "أزرق"], ["pink", "وردي"], ["purple", "بنفسجي"], ["orange", "برتقالي"]], v: "gold" }], "حفظ", function (o) {
      api("/tag", { room: room().id, uid: uid, tag: o.tag, color: o.color }).then(function () { say("اتحفظ ✅"); C.infoSheet(); }).catch(function (e) { say(e.message); });
    });
  };

  // ------------------------------------------------------------ 1.10 writing assistant
  X.actions.assist = function () {
    var t = $("#c4in").value.trim(); if (!t) return;
    C.sheet("<h3>" + emi("✨") + " مساعد الكتابة</h3>" +
      [["fix", "check", "صحّح الإملاء"], ["kind", "heart", "خلّيها ألطف"], ["short", "sum", "قصّرها"], ["en", "globe", "ترجم للإنجليزي"]].map(function (x) { return '<div class="li tap" data-a="x_as" data-v="' + x[0] + '">' + ic(x[1], 22) + x[2] + "</div>"; }).join("") +
      '<div style="opacity:.6;font-size:12px;margin-top:8px">النص بيتبعت للذكاء عشان يتعدّل بس، ومش بيتحفظ.</div>');
  };
  X.actions.x_as = function (el, mode) {
    var inp = $("#c4in"), t = inp.value.trim();
    say("لحظة…");
    api("/assist", { mode: mode, text: t }, 20000).then(function (j) {
      C.sheet("<h3>الاقتراح</h3>" + '<div style="background:rgba(0,0,0,.25);border-radius:14px;padding:12px;line-height:1.8">' + emo(j.text) + "</div>" +
        '<button class="btn tap" data-a="x_asok">استخدمه</button><button class="btn g tap" data-a="x_close">سيبه</button>');
      X.__as = j.text;
    }).catch(function (e) { say(e.message); });
  };
  X.actions.x_asok = function () { $("#c4in").value = X.__as || $("#c4in").value; C.updSend(); C.closeSheet(); };
  X.actions.x_close = function () { C.closeSheet(); };

  // ------------------------------------------------------------ 1.11 voice → text, 1.27 voice → food log
  X.bubbleTail.push(function (m, me) {
    if (m.kind !== "voice" || m.deleted || (m.once && !me)) return "";
    var tx = m.meta && m.meta.tx;
    return '<div class="txb">' + (tx ? "" : '<button class="tap" data-a="x_tx" data-v="' + esc(m.id) + '">' + ic("doc", 14) + "اكتب النص</button>") +
      (tx && me ? '<button class="tap" data-a="x_food" data-v="' + esc(m.id) + '">' + ic("food", 14) + "سجّل الأكل ده</button>" : "") + "</div>";
  });
  X.actions.x_tx = function (el, id) {
    el.textContent = "بيكتب…";
    api("/transcribe", { room: room().id, id: id }, 40000).then(function (j) { var m = S.msgs[id]; m.meta = Object.assign({}, m.meta, { tx: j.text }); C.renderMsgs(); })
      .catch(function (e) { say(e.code === "asr_empty" ? "مفيش كلام واضح في التسجيل" : e.message); C.renderMsgs(); });
  };
  X.onSent.push(function (m) {
    if (m.kind === "voice" && !m.once) setTimeout(function () { api("/transcribe", { room: m.room, id: m.id }, 40000).then(function (j) { var x = S.msgs[m.id]; if (x) { x.meta = Object.assign({}, x.meta, { tx: j.text }); C.renderMsgs(); if (/(فطرت|اتغديت|اتعشيت|أكلت|اكلت|كلت|شربت)/.test(j.text)) foodFrom(j.text); } }).catch(function () {}); }, 400);
  });
  X.actions.x_food = function (el, id) { var m = S.msgs[id]; if (m && m.meta && m.meta.tx) foodFrom(m.meta.tx); };
  function foodFrom(text) {
    api("/assist", { mode: "food", text: text }, 20000).then(function (j) {
      var items = j.items || []; if (!items.length) { say("ملقتش أكل في الكلام"); return; }
      X.__food = items;
      var tot = items.reduce(function (a, x) { return a + (x.k || 0); }, 0);
      C.sheet("<h3>" + emi("🍽️") + " أسجّل ده في يومك؟</h3>" + items.map(function (x, i) { return '<label class="li"><input type="checkbox" checked data-i="' + i + '" style="width:20px;height:20px"><div>' + emo(x.n) + (x.q > 1 ? " ×" + x.q : "") + "</div><em>" + Math.round(x.k) + " سعر</em></label>"; }).join("") +
        '<div style="text-align:center;font-weight:900;font-size:20px;margin:10px 0">' + Math.round(tot) + " سعر تقريبًا</div>" +
        '<button class="btn tap" data-a="x_foodok">سجّل</button><div style="opacity:.6;font-size:12px;margin-top:6px">تقدير تقريبي — عدّل الكميات من يومك لو محتاج.</div>');
    }).catch(function (e) { say(e.message); });
  }
  X.actions.x_foodok = function () {
    var add = C.G("addItems18"), picks = [];
    D.querySelectorAll('#c4sh input[data-i]').forEach(function (c) { if (c.checked) picks.push(X.__food[+c.getAttribute("data-i")]); });
    if (!picks.length) return C.closeSheet();
    try { add(picks.map(function (x) { return { n: x.n, sv: x.sv, k: x.k, p: x.p, c: x.c, f: x.f, ai: 1 }; })); say("اتسجل ✅"); hap(14); C.closeSheet(); } catch (e) { say("التسجيل متاح من التطبيق الأساسي"); }
  };

  // ------------------------------------------------------------ 1.26 @سعراتي in chats
  X.onSent.push(function (m, body) {
    var t = String((body && body.text) || "");
    if (m.kind !== "text" || !/(^|\s)@(سعراتي|sorati)/i.test(t)) return;
    var q = t.replace(/@(سعراتي|sorati)/gi, "").trim(); if (!q) return;
    var done = function (ans) { C.post({ kind: "text", text: "🤖 " + ans, meta: { via: "sorati", q: m.id }, reply: m.id }).catch(function () {}); };
    var A = AIc();
    if (aiOk()) {
      A.call([{ text: "انت «@سعراتي» بوت التغذية جوه جروب شات مصري. جاوب في سطرين أو تلاتة بالأرقام (سعرات وبروتين للحصة المصرية المعتادة) وبالعامية. لو السؤال طبي أو عن دوا قول يسأل دكتور. السؤال: " + q }], { task: "chat" })
        .then(function (r) { done(String(r || "").slice(0, 600)); }).catch(function () { api("/assist", { mode: "ask", text: q }, 20000).then(function (j) { done(j.text); }).catch(function () {}); });
    } else api("/assist", { mode: "ask", text: q }, 20000).then(function (j) { done(j.text); }).catch(function (e) { say(e.message); });
  });

  // ------------------------------------------------------------ 1.4 smart poll: AI options + quiz + duration
  X.plus.push(["x_quiz", "spark", "كويز أكل", "#ec4899"]);
  X.actions.x_quiz = function () {
    C.formSheet("تصويت ذكي / كويز", [{ k: "q", ph: "السؤال (مثلًا: أنهي فيه بروتين أكتر؟)" }, { k: "o1", ph: "اختيار 1" }, { k: "o2", ph: "اختيار 2" }, { k: "o3", ph: "اختيار 3" }, { k: "o4", ph: "اختيار 4" },
      { k: "ans", type: "select", opts: [["", "تصويت عادي (مفيش إجابة صح)"], ["0", "الإجابة الصح: 1"], ["1", "الإجابة الصح: 2"], ["2", "الإجابة الصح: 3"], ["3", "الإجابة الصح: 4"]], v: "" },
      { k: "dur", type: "select", opts: [["0", "من غير مدة"], ["3600000", "ساعة"], ["86400000", "يوم"], ["604800000", "أسبوع"]], v: "0" }], "ابعت", function (o) {
      var opts = [o.o1, o.o2, o.o3, o.o4].map(function (x) { return String(x || "").trim(); }).filter(Boolean);
      var meta = { opts: opts }; if (o.ans !== "" && +o.ans < opts.length) meta.quiz = +o.ans; if (+o.dur) meta.closes = now() + +o.dur;
      C.post({ kind: "poll", text: o.q, meta: meta }).then(C.closeSheet).catch(function () {});
    });
    var sh = $("#c4sh .shb"); var b = D.createElement("button"); b.className = "btn g tap"; b.textContent = "✨ اقترح اختيارات بالذكاء"; b.setAttribute("data-a", "x_sugg"); sh.insertBefore(b, sh.querySelector('[data-a="formok"]'));
  };
  X.actions.x_sugg = function () {
    var q = ($("#c4f_q") || {}).value; if (!q) { say("اكتب السؤال الأول"); return; }
    api("/assist", { mode: "poll", text: q }, 20000).then(function (j) { (j.opts || []).slice(0, 4).forEach(function (o, i) { var f = $("#c4f_o" + (i + 1)); if (f) f.value = o; }); }).catch(function (e) { say(e.message); });
  };
  X.bubbleTail.push(function (m) {
    if (m.kind !== "poll" || !m.meta) return "";
    var h = "", v = S.votes[m.id] || {}, voted = Object.keys(v).some(function (k) { return (v[k] || []).indexOf(S.uid) >= 0; });
    if (typeof m.meta.quiz === "number" && (voted || m.uid === S.uid)) h += '<div class="once">' + emi("✅") + " الإجابة الصح: " + emo((m.meta.opts || [])[m.meta.quiz] || "") + "</div>";
    if (m.meta.closes) h += '<div class="mt" style="justify-content:flex-start">' + ic("time", 12) + (now() > m.meta.closes ? " التصويت قفل" : " بيقفل " + C.fmtDay(m.meta.closes) + " " + C.fmtT(m.meta.closes)) + "</div>";
    return h;
  });

  // ------------------------------------------------------------ 1.12 sticker maker (on-device: corner-colour background removal + white outline)
  X.plus.push(["x_sticker", "sticker", "ستيكر", "#f97316"]);
  X.actions.x_sticker = function () {
    C.closeSheet();
    C.pickFile("image/*").then(function (f) {
      if (!f) return;
      makeSticker(f).then(function (b) { say("بيترفع الستيكر…"); return C.upload(b, "sticker", "sticker.webp"); }).then(function (mid) { return C.post({ kind: "sticker", media: mid }); }).catch(function (e) { say(e.message || "مقدرتش أعمل الستيكر"); });
    });
  };
  function makeSticker(file) {
    return new Promise(function (res, rej) {
      var im = new Image(); im.onload = function () {
        var N = 384, c = D.createElement("canvas"); c.width = c.height = N; var x = c.getContext("2d");
        var s = Math.min(im.width, im.height), sx = (im.width - s) / 2, sy = (im.height - s) / 2;
        x.drawImage(im, sx, sy, s, s, 24, 24, N - 48, N - 48);
        var d = x.getImageData(0, 0, N, N), p = d.data;
        // background = average of the 4 inner corners; remove pixels close to it with a flood fill from the edges
        var pts = [[30, 30], [N - 31, 30], [30, N - 31], [N - 31, N - 31]], bg = [0, 0, 0];
        pts.forEach(function (q) { var i = (q[1] * N + q[0]) * 4; bg[0] += p[i] / 4; bg[1] += p[i + 1] / 4; bg[2] += p[i + 2] / 4; });
        var tol = 46 * 46 * 3, seen = new Uint8Array(N * N), st = [];
        for (var k = 24; k < N - 24; k++) st.push(24 * N + k, (N - 25) * N + k, k * N + 24, k * N + N - 25);
        var removed = 0;
        while (st.length) {
          var q = st.pop(); if (seen[q]) continue; seen[q] = 1; var i = q * 4;
          if (p[i + 3] === 0) continue;
          var dr = p[i] - bg[0], dg = p[i + 1] - bg[1], db = p[i + 2] - bg[2];
          if (dr * dr + dg * dg + db * db > tol) continue;
          p[i + 3] = 0; removed++;
          var xx = q % N, yy = (q / N) | 0;
          if (xx > 0) st.push(q - 1); if (xx < N - 1) st.push(q + 1); if (yy > 0) st.push(q - N); if (yy < N - 1) st.push(q + N);
        }
        if (removed < N * N * 0.05) { // busy background: keep a rounded square instead
          x.clearRect(0, 0, N, N); x.save(); x.beginPath(); var r = 70; x.moveTo(24 + r, 24); x.arcTo(N - 24, 24, N - 24, N - 24, r); x.arcTo(N - 24, N - 24, 24, N - 24, r); x.arcTo(24, N - 24, 24, 24, r); x.arcTo(24, 24, N - 24, 24, r); x.clip(); x.drawImage(im, sx, sy, s, s, 24, 24, N - 48, N - 48); x.restore();
        } else x.putImageData(d, 0, 0);
        // white outline + soft shadow (iMessage style)
        var o = D.createElement("canvas"); o.width = o.height = N; var y = o.getContext("2d");
        for (var a = 0; a < 16; a++) { var ang = a / 16 * Math.PI * 2; y.drawImage(c, Math.cos(ang) * 9, Math.sin(ang) * 9); }
        y.globalCompositeOperation = "source-in"; y.fillStyle = "#fff"; y.fillRect(0, 0, N, N); y.globalCompositeOperation = "source-over";
        y.shadowColor = "rgba(0,0,0,.25)"; y.shadowBlur = 8; y.drawImage(c, 0, 0);
        o.toBlob(function (b) { b ? res(b) : rej(new Error("مقدرتش أعمل الستيكر")); }, "image/webp", .9);
      }; im.onerror = function () { rej(new Error("الصورة مش مقروءة")); }; im.src = URL.createObjectURL(file);
    });
  }
  X.kinds.sticker = function (m) { return '<img class="img" data-mid="' + esc(m.media || "") + '" alt="ستيكر">'; };

  // ------------------------------------------------------------ 1.21 meal card from a photo (عين سعراتي)
  X.plus.push(["x_eye", "cam", "صوّر وجبتك", "#22c55e"]);
  X.actions.x_eye = function () {
    C.closeSheet();
    var A = AIc(); if (!aiOk() || !A.resize || !A.img) { say("الذكاء مش متاح دلوقتي — استخدم كارت وجبة يدوي"); return; }
    C.pickFile("image/*", "environment").then(function (f) {
      if (!f) return;
      var fr = new FileReader(); fr.onload = function () {
        say("عين سعراتي بتقرا الطبق…");
        A.resize(fr.result, 900).then(function (im) {
          return A.call([{ text: 'حلل صورة الأكل (مصري غالبًا). رد JSON بس: {"name":"اسم الوجبة المختصر","items":[{"n":"الصنف","k":سعرات,"p":بروتين,"c":كارب,"f":دهون}]}. القيم للكمية الظاهرة كلها.' }, A.img(im.b64)], { task: "vision", json: true })
            .then(function (r) {
              var it = (r && r.items || []).filter(function (x) { return x && x.n; }); if (!it.length) throw new Error("مش لاقي أكل واضح في الصورة");
              var s = { kcal: 0, p: 0, c: 0, f: 0 }; it.forEach(function (x) { s.kcal += +x.k || 0; s.p += +x.p || 0; s.c += +x.c || 0; s.f += +x.f || 0; });
              return C.compress(f).then(function (b) { return C.upload(b, "img", "meal.webp"); }).then(function (mid) {
                return C.post({ kind: "meal", text: (r.name || it.map(function (x) { return x.n; }).join(" + ")).slice(0, 80), media: mid, meta: Object.assign(s, { items: it.map(function (x) { return x.n; }), eye: 1, img: mid }) });
              });
            });
        }).catch(function (e) { say(e.message || "مقدرتش أقرا الصورة"); });
      }; fr.readAsDataURL(f);
    });
  };
  X.bubbleTail.push(function (m) { return m.kind === "meal" && m.meta && m.meta.eye ? '<div class="mt" style="justify-content:flex-start">' + ic("eye", 12) + " عين سعراتي · تقدير تقريبي</div>" : ""; });

  // ------------------------------------------------------------ 1.22 / 1.29 challenge leaderboard
  X.bubbleTail.push(function (m) { return m.kind === "challenge" ? '<div class="txb"><button class="tap" data-a="x_board">' + ic("trophy", 14) + "الترتيب</button></div>" : ""; });
  X.actions.x_board = function () {
    api("/board", { room: room().id, days: 30 }).then(function (j) {
      var md = ["🥇", "🥈", "🥉"];
      C.sheet("<h3>" + emi("🏆") + " ترتيب التحدي (30 يوم)</h3>" + '<div class="bd">' + (j.board.length ? j.board.map(function (x) {
        return '<div class="r"><span class="n">' + (md[x.rank - 1] ? emi(md[x.rank - 1]) : x.rank) + "</span><b>" + esc(x.uid === S.uid ? "انت" : x.name || C.memberName(x.uid)) + (j.today.indexOf(x.uid) >= 0 ? " " + emi("✅") : "") + "</b><em>" + x.pts + " نقطة · " + x.days + " يوم</em></div>";
      }).join("") : '<div class="empty">لسه محدش سجّل — ابدأ بـ «+1 التزام» 💪</div>') + "</div>" +
        '<div style="opacity:.65;font-size:12px;margin-top:8px">+3 لكل التزام · +1 لكل كارت وجبة · +1 لما حد يديلك 💪 على التزامك</div>');
    }).catch(function (e) { say(e.message); });
  };

  // ------------------------------------------------------------ 1.23 share my day with the coach (opt-in card)
  X.plus.push(["x_day", "fitness", "شارك يومي", "#0ea5e9"]);
  X.actions.x_day = function () {
    C.closeSheet();
    var s = { kcal: 0, p: 0, c: 0, f: 0, n: 0 };
    try { var k = C.G("dkey")(C.G("cur")), d = C.G("getDay")(k); (d && d.items || []).forEach(function (x) { s.kcal += +x.k || 0; s.p += +x.p || 0; s.c += +x.c || 0; s.f += +x.f || 0; s.n++; }); s.water = d && (d.water || d.w) || 0; } catch (e) {}
    if (!s.n) { say("لسه مسجّلتش أكل النهارده"); return; }
    if (!confirm("هتشارك ملخص يومك (السعرات والماكروز) في المحادثة دي؟")) return;
    C.post({ kind: "checkin", text: "ملخص يومي", meta: { day: 1, kcal: Math.round(s.kcal), p: Math.round(s.p), c: Math.round(s.c), f: Math.round(s.f), items: s.n, water: s.water } }).catch(function () {});
  };
  X.bubbleTail.push(function (m) {
    if (m.kind !== "checkin" || !m.meta || !m.meta.day) return "";
    var x = m.meta;
    return '<div class="ml"><div class="mc"><div><b>' + x.kcal + "</b>سعر</div><div><b>" + x.p + "g</b>بروتين</div><div><b>" + x.items + "</b>صنف</div></div></div>";
  });

  // ------------------------------------------------------------ 1.24 shared plan / shopping list
  X.plus.push(["x_plan", "cal", "قايمة مشتركة", "#14b8a6"]);
  X.actions.x_plan = function () {
    C.formSheet("خطة أكل / قايمة مشتريات مشتركة", [{ k: "t", ph: "العنوان (مشتريات الأسبوع)" }, { k: "items", type: "area", ph: "كل بند في سطر:\nفراخ 1 كيلو\nخضار سلطة\nزبادي لايت" }], "شارك", function (o) {
      var items = String(o.items || "").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 60).map(function (t) { return { t: t, d: 0 }; });
      if (!items.length) { say("اكتب بند واحد على الأقل"); return; }
      C.post({ kind: "plan", text: o.t || "قايمة مشتركة", meta: { items: items } }).then(C.closeSheet).catch(function () {});
    });
  };
  X.kinds.plan = function (m) {
    var it = (m.meta && m.meta.items) || [], dn = it.filter(function (x) { return x.d; }).length;
    return '<div class="pn"><b>' + emi("🛒") + " " + emo(m.text) + '</b><div class="mt" style="justify-content:flex-start">' + dn + " من " + it.length + "</div>" +
      it.map(function (x, i) { return '<div class="it tap' + (x.d ? " d" : "") + '" data-a="x_pt" data-id="' + esc(m.id) + '" data-v="' + i + '"><i>' + (x.d ? ic("check", 14) : "") + "</i><span>" + emo(x.t) + "</span></div>"; }).join("") +
      '<div class="txb"><button class="tap" data-a="x_padd" data-id="' + esc(m.id) + '">' + ic("add", 14) + "بند جديد</button></div></div>";
  };
  X.actions.x_pt = function (el, i, id) {
    var m = S.msgs[id]; if (!m) return; m.meta.items[+i].d = m.meta.items[+i].d ? 0 : 1; C.renderMsgs(); hap(6);
    api("/plan/toggle", { room: room().id, id: id, idx: +i }).then(function (j) { m.meta.items = j.items; C.renderMsgs(); }).catch(function (e) { say(e.message); C.sync(true); });
  };
  X.actions.x_padd = function (el, v, id) {
    C.formSheet("بند جديد", [{ k: "t", ph: "مثلًا: شوفان" }], "إضافة", function (o) { if (!o.t) return; api("/plan/toggle", { room: room().id, id: id, add: o.t }).then(function (j) { S.msgs[id].meta.items = j.items; C.closeSheet(); C.renderMsgs(); }).catch(function (e) { say(e.message); }); });
  };

  // ------------------------------------------------------------ 1.15 live location (walk sharing)
  X.plus.push(["x_live", "walk", "مشيتي لايف", "#ef4444"]);
  var LIVE = null;
  X.actions.x_live = function () {
    C.formSheet("شارك مشيتك لايف", [{ k: "m", type: "select", opts: [["15", "15 دقيقة"], ["30", "30 دقيقة"], ["60", "ساعة"]], v: "30" }], "ابدأ", function (o) {
      if (!navigator.geolocation) { say("الموقع مش متاح"); return; }
      C.closeSheet();
      navigator.geolocation.getCurrentPosition(function (p) {
        var until = now() + +o.m * 60e3;
        C.post({ kind: "loc", text: "بمشي دلوقتي 🚶", meta: { lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5), live: true, until: until } }).then(function (j) {
          if (!j || !j.msg) return;
          var id = j.msg.id, rm = room().id;
          if (LIVE) navigator.geolocation.clearWatch(LIVE.w);
          var last = 0;
          LIVE = { id: id, w: navigator.geolocation.watchPosition(function (q) {
            if (now() > until) { navigator.geolocation.clearWatch(LIVE.w); LIVE = null; return; }
            if (now() - last < 15000) return; last = now();
            api("/live/upd", { room: rm, id: id, lat: q.coords.latitude, lng: q.coords.longitude }).catch(function (e) { if (e.code === "live_ended") { navigator.geolocation.clearWatch(LIVE.w); LIVE = null; } });
          }, function () {}, { enableHighAccuracy: true, maximumAge: 10000 }) };
        }).catch(function () {});
      }, function () { say("محتاج إذن الموقع"); }, { timeout: 10000 });
    });
  };
  X.bubbleTail.push(function (m, me) {
    if (m.kind !== "loc" || !m.meta || !m.meta.live) return "";
    var on = now() < m.meta.until;
    return '<div class="mt" style="justify-content:flex-start">' + (on ? '<span class="live38"><i></i>لايف</span> لحد ' + C.fmtT(m.meta.until) : "المشاركة خلصت") + (m.meta.at ? " · آخر تحديث " + C.fmtT(m.meta.at) : "") + "</div>" +
      (on && me ? '<div class="txb"><button class="tap" data-a="x_lstop" data-id="' + esc(m.id) + '">' + ic("stop", 14) + "وقّف المشاركة</button></div>" : "");
  });
  X.actions.x_lstop = function (el, v, id) { api("/live/upd", { room: room().id, id: id, stop: true }).then(function () { if (LIVE) { navigator.geolocation.clearWatch(LIVE.w); LIVE = null; } C.sync(true); }).catch(function () {}); };

  // ------------------------------------------------------------ 1.16 bots + 1.18 welcome (room admins)
  X.infoRows.push(function (j, adm) {
    if (!adm || j.room.type === "dm") return "";
    return '<div class="li tap" data-a="x_bots">' + ic("bot", 22) + "البوتات</div>" + '<div class="li tap" data-a="x_wel">' + ic("people", 22) + "رسالة ترحيب للجداد<em>" + (j.welcome ? "شغالة" : "مقفولة") + "</em></div>";
  });
  X.actions.x_wel = function () {
    C.formSheet("رسالة الترحيب", [{ k: "t", type: "area", ph: "أهلًا بيك! القواعد: احترام · ممنوع إعلانات مكملات · شارك أكلك بالكارت", v: (S.info && S.info.welcome) || "" }], "حفظ", function (o) {
      api("/welcome", { room: room().id, text: o.t }).then(function () { say("اتحفظ ✅"); C.infoSheet(); }).catch(function (e) { say(e.message); });
    });
  };
  X.actions.x_bots = function () {
    api("/bot/list", { room: room().id }).then(function (j) {
      C.sheet("<h3>" + ic("bot", 20) + " البوتات</h3>" + (j.bots.length ? j.bots.map(function (b) { return '<div class="li">' + ic("bot", 20) + "<div>" + esc(b.name) + '</div><button class="ib tap" style="width:32px;height:32px" data-a="x_botdel" data-v="' + esc(b.id) + '">' + ic("trash", 16) + "</button></div>"; }).join("") : '<div class="empty">مفيش بوتات. اعمل بوت وابعت من أي سيرفر أو Zapier.</div>') +
        '<button class="btn tap" data-a="x_botnew">بوت جديد</button>');
    }).catch(function (e) { say(e.message); });
  };
  X.actions.x_botnew = function () {
    C.formSheet("بوت جديد", [{ k: "n", ph: "اسم البوت (بوت المية)" }], "إنشاء", function (o) {
      api("/bot/create", { room: room().id, name: o.n }).then(function (j) {
        C.sheet("<h3>التوكن (بيظهر مرة واحدة)</h3>" + '<div dir="ltr" style="word-break:break-all;background:rgba(0,0,0,.3);border-radius:12px;padding:10px;font-family:monospace;font-size:12px">' + esc(j.token) + "</div>" +
          '<div dir="ltr" style="font-size:11.5px;opacity:.8;margin-top:8px;font-family:monospace">POST https://deputy.sorati-command.workers.dev/v1/app/c4/bot/send<br>{"botToken":"…","text":"💧 اشربوا مية"}</div>' +
          '<button class="btn tap" data-a="copytxt" data-v="' + esc(j.token) + '">نسخ التوكن</button>');
      }).catch(function (e) { say(e.message); });
    });
  };
  X.actions.x_botdel = function (el, id) { if (confirm("تمسح البوت؟")) api("/bot/del", { room: room().id, id: id }).then(function () { X.actions.x_bots(); }); };

  // ------------------------------------------------------------ 1.25 accountability buddy
  X.newRows.push(function () { return '<div class="li tap" data-a="x_buddy">' + ic("heart", 22) + "صاحب الالتزام (يقرنك بحد بنفس هدفك)</div>"; });
  X.actions.x_buddy = function () {
    var w = ""; try { var AS = C.G("S"); w = AS && (AS.w || AS.weight || (AS.prof && AS.prof.w)) || ""; } catch (e) {}
    C.formSheet("صاحب الالتزام", [{ k: "goal", type: "select", opts: [["lose", "نزول وزن"], ["gain", "زيادة وزن"], ["keep", "ثبات"], ["fit", "لياقة"]], v: "lose" }, { k: "w", type: "number", ph: "وزنك التقريبي (كجم)", v: String(w || "") }], "دوّرلي", function (o) {
      api("/buddy", { goal: o.goal, weight: +o.w || 80 }).then(function (j) {
        C.closeSheet();
        if (j.room) { say("لقينالك صاحب 🤝"); C.refreshRooms().then(function () { C.openRoom(j.room); }); } else say("سجّلناك — أول ما حد بنفس هدفك يدخل هنقرنكم 🤝");
      }).catch(function (e) { say(e.message); });
    });
  };

  // ------------------------------------------------------------ 1.28 health statuses (24 h)
  var STAT = { items: [], at: 0 };
  function loadStatus() { if (now() - STAT.at < 60000) return; STAT.at = now(); api("/status/feed", {}).then(function (j) { STAT.items = j.items || []; C.render(); }).catch(function () {}); }
  X.listTop.push(function () {
    loadStatus();
    var by = {}; STAT.items.forEach(function (s) { (by[s.uid] = by[s.uid] || []).push(s); });
    var seenSet = C.ld("c4_stseen", {});
    var cells = '<div class="s tap" data-a="x_stadd"><div class="ring seen"><div>' + ic("add", 26) + "</div></div>حالتي</div>";
    Object.keys(by).forEach(function (u) {
      var L = by[u], all = L.every(function (s) { return seenSet[s.id]; });
      cells += '<div class="s tap" data-a="x_stv" data-v="' + esc(u) + '"><div class="ring' + (all ? " seen" : "") + '"><div>' + emo(firstEmoji(L[0].text) || "💚") + "</div></div>" + esc(u === S.uid ? "انت" : (L[0].name || "عضو")) + "</div>";
    });
    return '<div class="st38">' + cells + "</div>";
  });
  function firstEmoji(t) { var m = String(t || "").match(/\p{Extended_Pictographic}/u); return m ? m[0] : null; }
  X.actions.x_stadd = function () {
    var sug = ["قفلت 10 آلاف خطوة 🔥", "شربت 8 كوبايات مية 💧", "يوم كامل في هدفي ✅", "خلّصت تمرين النهارده 💪", "نزلت كيلو 🎉"];
    try { var k = C.G("dkey")(C.G("cur")), d = C.G("getDay")(k), kc = 0; (d && d.items || []).forEach(function (x) { kc += +x.k || 0; }); if (kc) sug.unshift("سجّلت " + Math.round(kc) + " سعر النهارده 🍽️"); } catch (e) {}
    C.sheet("<h3>حالة صحية (بتختفي بعد 24 ساعة)</h3>" + sug.map(function (s) { return '<div class="li tap" data-a="x_stset" data-v="' + esc(s) + '">' + emo(s) + "</div>"; }).join("") + '<div class="li tap" data-a="x_stcustom">' + ic("edit", 20) + "اكتب حالة</div>" +
      '<div style="opacity:.6;font-size:12px;margin-top:8px">بتظهر بس للناس اللي معاك في محادثة أو جروب.</div>');
  };
  X.actions.x_stset = function (el, t) { api("/status/set", { text: t }).then(function () { C.closeSheet(); STAT.at = 0; loadStatus(); say("اتنشرت ✅"); }).catch(function (e) { say(e.message); }); };
  X.actions.x_stcustom = function () { C.formSheet("حالتك", [{ k: "t", ph: "قفلت 10 آلاف خطوة 🔥" }], "انشر", function (o) { X.actions.x_stset(null, o.t); }); };
  X.actions.x_stv = function (el, u) {
    var L = STAT.items.filter(function (s) { return s.uid === u; }).reverse(), i = 0, seenSet = C.ld("c4_stseen", {});
    var show = function () {
      var old = $("#c4 .stv"); if (old) old.remove();
      if (i >= L.length) { C.render(); return; }
      var s = L[i]; seenSet[s.id] = 1; C.sv("c4_stseen", seenSet); if (!s.mine) api("/status/seen", { id: s.id }).catch(function () {});
      var v = D.createElement("div"); v.className = "stv";
      v.innerHTML = '<div class="bar"><i></i></div><div>' + emo(s.text) + "</div><small>" + esc(s.mine ? "انت" : s.name || "") + " · " + C.fmtT(s.at) + (s.mine ? " · شافها " + s.seen : "") + "</small>" + (s.mine ? '<button class="btn g tap" style="width:auto;padding:8px 20px;margin-top:20px" data-a="x_stdel" data-v="' + esc(s.id) + '">امسحها</button>' : "");
      $("#c4").appendChild(v);
      var t = setTimeout(function () { i++; show(); }, 5000);
      v.addEventListener("click", function (e) { if (e.target.closest("[data-a]")) return; clearTimeout(t); i++; show(); });
    };
    show();
  };
  X.actions.x_stdel = function (el, id) { api("/status/del", { id: id }).then(function () { var v = $("#c4 .stv"); if (v) v.remove(); STAT.at = 0; loadStatus(); }); };

  // ------------------------------------------------------------ 1.19 instant local search across every cached chat
  X.listTop.push(function () {
    var q = S.q; if (!q || q.length < 2) return "";
    var hits = [];
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf("c4_m_") !== 0) return; var c = C.ld(k, null); if (!c || !c.m) return; var rid = k.slice(5);
        c.m.forEach(function (m) { if (m && !m.deleted && m.text && String(m.text).indexOf(q) >= 0) hits.push({ r: rid, m: m }); });
      });
    } catch (e) {}
    if (!hits.length) return "";
    hits.sort(function (a, b) { return b.m.at - a.m.at; });
    return '<div style="padding:4px 10px;color:#8fbfad;font-size:13px">رسايل (' + hits.length + ")</div>" + hits.slice(0, 20).map(function (h) {
      var r = C.roomById(h.r) || { name: "محادثة" };
      return '<div class="row tap" data-a="x_hit" data-v="' + esc(h.r) + '" data-id="' + esc(h.m.id) + '"><div class="rb"><div class="rt"><span class="rn">' + emo(r.name || (r.peer && r.peer.name) || "محادثة") + '</span><span class="rtm">' + C.fmtList(h.m.at) + '</span></div><div class="rl">' + emo(String(h.m.text).slice(0, 90)) + "</div></div></div>";
    }).join("") + '<div style="padding:4px 10px;color:#8fbfad;font-size:13px">محادثات</div>';
  });
  X.actions.x_hit = function (el, r, id) { C.openRoom(r); setTimeout(function () { var b = $('#c4msgs .b[data-id="' + id + '"]'); if (b) { b.scrollIntoView({ block: "center" }); b.classList.add("flash"); } }, 900); };

  // ------------------------------------------------------------ 1.13 / 1.14 calls + voice rooms (WebRTC mesh over the room WebSocket)
  var ICE = [{ urls: ["stun:stun.cloudflare.com:3478", "stun:stun.l.google.com:19302"] }];
  var RTC = null;
  function rtcSend(to, d) { return C.wsSend({ t: "rtc", to: to, d: d }); }
  function peer(uid) {
    if (RTC.peers[uid]) return RTC.peers[uid];
    var pc = new RTCPeerConnection({ iceServers: ICE });
    RTC.local.getTracks().forEach(function (t) { pc.addTrack(t, RTC.local); });
    pc.onicecandidate = function (e) { if (e.candidate) rtcSend(uid, { call: RTC.id, ice: e.candidate }); };
    pc.ontrack = function (e) { var v = $("#c4v_" + CSS.escape(uid)); if (!v) { v = D.createElement("video"); v.id = "c4v_" + uid; v.autoplay = true; v.playsInline = true; $("#c4call .vids").appendChild(v); } v.srcObject = e.streams[0]; status(); };
    pc.onconnectionstatechange = function () { if (["failed", "closed"].indexOf(pc.connectionState) >= 0) { drop(uid); } status(); };
    RTC.peers[uid] = pc; return pc;
  }
  function drop(uid) { var pc = RTC && RTC.peers[uid]; if (!pc) return; try { pc.close(); } catch (e) {} delete RTC.peers[uid]; var v = $("#c4v_" + CSS.escape(uid)); if (v) v.remove(); status(); }
  function status() { var e = $("#c4call .ttl2"); if (!e || !RTC) return; var n = Object.keys(RTC.peers).filter(function (u) { return RTC.peers[u].connectionState === "connected"; }).length; e.textContent = (RTC.video ? "مكالمة فيديو" : "مكالمة صوت") + " · " + (n ? n + 1 + " في المكالمة" : "بيرن…"); }
  function ui() {
    var o = D.createElement("div"); o.className = "call"; o.id = "c4call";
    o.innerHTML = '<div class="ttl2">بيرن…</div><div class="vids"><video id="c4vme" autoplay playsinline muted></video></div>' +
      '<div class="ctl"><button class="tap" data-a="x_mute">' + ic("mic", 26) + '</button><button class="tap" data-a="x_cam">' + ic("video", 26) + '</button><button class="end tap" data-a="x_end">' + ic("call", 28) + "</button></div>";
    $("#c4").appendChild(o); $("#c4vme").srcObject = RTC.local; if (!RTC.video) $("#c4vme").style.display = "none";
  }
  function start(video, callId) {
    if (!W.RTCPeerConnection || !navigator.mediaDevices) { say("المكالمات مش مدعومة على الجهاز ده"); return Promise.reject(); }
    if (RTC) return Promise.resolve();
    return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: video ? { facingMode: "user", width: 640, height: 480 } : false }).then(function (st) {
      RTC = { id: callId || "k" + now().toString(36), local: st, peers: {}, video: !!video, room: room().id };
      ui(); hap(12);
      rtcSend(null, { call: RTC.id, hello: 1, video: !!video });
      clearInterval(RTC.hb); RTC.hb = setInterval(function () { if (!Object.keys(RTC.peers).length) rtcSend(null, { call: RTC.id, hello: 1, video: RTC.video }); }, 4000);
      setTimeout(function () { if (RTC && !Object.keys(RTC.peers).length) say("لسه محدش دخل — اللي فاتح المحادثة هيشوف المكالمة"); }, 25000);
    }).catch(function () { say("محتاج إذن المايك" + (video ? " والكاميرا" : "")); });
  }
  function end() {
    if (!RTC) return; clearInterval(RTC.hb);
    Object.keys(RTC.peers).forEach(function (u) { rtcSend(u, { call: RTC.id, bye: 1 }); drop(u); });
    RTC.local.getTracks().forEach(function (t) { t.stop(); }); var o = $("#c4call"); if (o) o.remove(); RTC = null;
  }
  W.C4RTC = {
    start: function (r) {
      C.sheet("<h3>مكالمة</h3>" + '<div class="li tap" data-a="x_call" data-v="0">' + ic("call", 22) + (r.type === "dm" ? "صوت" : "غرفة صوت للجروب (تجريبي، لحد 6)") + "</div>" + '<div class="li tap" data-a="x_call" data-v="1">' + ic("video", 22) + "فيديو</div>" +
        '<div style="opacity:.6;font-size:12px;margin-top:8px">مكالمة مباشرة بين الأجهزة (WebRTC مشفّرة). على بعض الشبكات المقفولة ممكن ماتوصلش.</div>');
    },
    signal: function (m) {
      var d = m.d || {}; if (!d.call) return;
      if (!RTC) {
        if (d.hello && !W.__c4ring) {
          W.__c4ring = 1; hap(30);
          C.sheet('<div style="text-align:center"><h3>' + emi("📞") + " " + esc(C.memberName(m.uid)) + " بيتصل" + (d.video ? " فيديو" : "") + "</h3></div>" + '<button class="btn tap" data-a="x_join" data-v="' + esc(d.call) + '" data-id="' + (d.video ? 1 : 0) + '">رد</button><button class="btn g tap" data-a="x_close">تجاهل</button>');
          setTimeout(function () { W.__c4ring = 0; }, 30000);
        }
        return;
      }
      if (d.call !== RTC.id) return;
      var from = m.uid;
      if (d.hello) { if (!RTC.peers[from] && Object.keys(RTC.peers).length < 5 && S.uid < from) { var pc = peer(from); pc.createOffer().then(function (o) { return pc.setLocalDescription(o); }).then(function () { rtcSend(from, { call: RTC.id, sdp: pc.localDescription }); }); } else if (!RTC.peers[from] && S.uid > from) rtcSend(from, { call: RTC.id, hello: 1, video: RTC.video }); return; }
      if (d.bye) { drop(from); return; }
      var p = peer(from);
      if (d.sdp) {
        p.setRemoteDescription(d.sdp).then(function () { if (d.sdp.type === "offer") return p.createAnswer().then(function (a) { return p.setLocalDescription(a); }).then(function () { rtcSend(from, { call: RTC.id, sdp: p.localDescription }); }); }).catch(function () {});
      } else if (d.ice) p.addIceCandidate(d.ice).catch(function () {});
    },
  };
  X.actions.x_call = function (el, v) { C.closeSheet(); start(v === "1").then(function () { if (RTC) C.post({ kind: "call", text: v === "1" ? "مكالمة فيديو" : "مكالمة صوت", meta: { call: RTC.id, video: v === "1" } }).catch(function () {}); }); };
  X.actions.x_join = function (el, callId, vid) { C.closeSheet(); W.__c4ring = 0; start(vid === "1" || vid === 1, callId); };
  X.actions.x_end = end;
  X.actions.x_mute = function (el) { if (!RTC) return; var t = RTC.local.getAudioTracks()[0]; t.enabled = !t.enabled; el.classList.toggle("off", !t.enabled); };
  X.actions.x_cam = function (el) { if (!RTC) return; var t = RTC.local.getVideoTracks()[0]; if (!t) { say("المكالمة صوت بس"); return; } t.enabled = !t.enabled; el.classList.toggle("off", !t.enabled); };
  X.kinds.call = function (m, me) {
    var x = m.meta || {}, fresh = now() - m.at < 30 * 60e3;
    return '<div class="once">' + ic(x.video ? "video" : "call", 20) + " " + esc(m.text || "مكالمة") + "</div>" + (fresh && !me ? '<button class="gold tap" data-a="x_join" data-v="' + esc(x.call || "") + '" data-id="' + (x.video ? 1 : 0) + '">انضم</button>' : "");
  };

  // admin-controlled tiers (Admin → «واتساب سعراتي» → مستوى كل ميزة), via chat32's W.WS32.can
  var GATE = { assist: "c4_assist", x_as: "c4_assist", x_tx: "c4_tx", x_food: "c4_tx", x_sticker: "c4_sticker", x_eye: "c4_eye", x_quiz: "c4_quiz", x_live: "c4_live", x_bots: "c4_bots", x_botnew: "c4_bots", x_stadd: "c4_status", x_buddy: "c4_buddy", x_plan: "c4_plan", x_call: "c4_calls", x_join: "c4_calls" };
  function can(k) { try { return !W.WS32 || !W.WS32.can || W.WS32.can(k); } catch (e) { return true; } }
  function gateAll() {
    Object.keys(GATE).forEach(function (a) {
      var f = X.actions[a]; if (!f || f.__g) return;
      var g = function () { var k = GATE[a]; if (!can(k)) { var t = W.WS32 && W.WS32.tierOf ? W.WS32.tierOf(k) : "premium"; say(t === "off" ? "الميزة دي مقفولة مؤقتًا" : (t === "black" ? "🖤 ميزة بلاك" : "👑 ميزة بريميوم")); return; } return f.apply(this, arguments); };
      g.__g = 1; X.actions[a] = g;
    });
  }
  W.C4P = { version: 1 };
  gateAll();
})();
