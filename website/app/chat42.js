/* واتساب سعراتي 4.2 — chat42.js (فوق chat4 عن طريق C4.X، من غير ما نلمس الموجود)
   زي واتساب وأحسن:
   1 الأرشيف (المحادثة بتفضل مؤرشفة حتى لو جت رسالة — زي إعداد واتساب "Keep chats archived") · 2 المفضلة · 3 تثبيت محادثات فوق
   4 علّمها مش مقروءة · 5 فلاتر سريعة: الكل/غير مقروء/المفضلة/الجروبات/المؤرشفة · 6 ضغطة طويلة على المحادثة = قايمة
   7 سرعة الفويس 1×/1.5×/2× + تكملة من مكان ما وقفت · 8 رسائل بتختفي (24س/7أيام/90يوم) — بتستخبى على جهازك
   9 خلفية لكل محادثة (8 خلفيات) · 10 شريط تنسيق: عريض/مائل/مشطوب/كود · 11 ردود سريعة "/" محفوظة
   12 ترتيب ذكي: المثبّت ثم غير المقروء · 13 عداد المؤرشفة فوق القايمة
   كل ده محفوظ على الجهاز (c42_*). مفتاح الإيقاف: localStorage sp_ff_chat42 = "0". */
(function () {
  "use strict";
  var W = window, D = document;
  function boot() {
    if (!W.C4 || W.C42) return !!W.C42;
    try { if (localStorage.getItem("sp_ff_chat42") === "0") return true; } catch (e) {}
    var C = W.C4, X = C.X, S = C.state, esc = C.esc, ld = C.ld, sv = C.sv;
    var P = ld("c42", { arc: {}, fav: {}, pin: {}, unr: {}, dis: {}, wp: {}, qr: [["/صباح", "صباح الخير! سجّلت فطارك؟ 🍳"], ["/مية", "متنساش المية 💧 كوباية دلوقتي"], ["/برافو", "برافو عليك 💪 كمّل كده"]] }), F = ld("c42_f", "all");
    var save = function () { sv("c42", P); };
    var hap = function () { try { C.hap && C.hap(); } catch (e) {} };
    var WP = [["", "من غير"], ["linear-gradient(160deg,#0b3d2e,#06140f)", "زمرد"], ["linear-gradient(160deg,#2b1d05,#0d0902)", "ذهبي"], ["linear-gradient(160deg,#0f1b3d,#05070f)", "ليل"], ["linear-gradient(160deg,#3a0d2a,#0c0309)", "ورد"], ["radial-gradient(circle at 20% 20%,#1d4ed8 0,transparent 40%),radial-gradient(circle at 80% 70%,#10b981 0,transparent 40%),#04060c", "شفق"], ["repeating-linear-gradient(45deg,#0d1117 0 14px,#101820 14px 28px)", "خطوط"], ["radial-gradient(#ffffff14 1px,transparent 1px) 0 0/18px 18px,#070a10", "نقط"]];
    var DIS = [[0, "مقفولة"], [864e5, "24 ساعة"], [6048e5, "7 أيام"], [7776e6, "90 يوم"]];
    var css = D.createElement("style");
    css.textContent = [
      "#c4 .f42c{display:flex;gap:6px;overflow-x:auto;padding:6px 12px 2px;scrollbar-width:none}#c4 .f42c::-webkit-scrollbar{display:none}",
      "#c4 .f42c button{flex:0 0 auto;border:0;border-radius:999px;padding:7px 14px;background:rgba(255,255,255,.08);color:inherit;font-weight:700;font-size:13px;font-family:inherit}",
      "#c4 .f42c button.on{background:#19c58e;color:#02140d}",
      "#c4 .f42a{display:flex;align-items:center;gap:10px;margin:4px 12px;padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.04);font-weight:700;font-size:14px}",
      "#c4 .row.c42h{display:none!important}#c4 .row .c42t{font-size:12px;margin-inline-start:4px}",
      "#c4 .c42sp{border:0;border-radius:10px;padding:3px 9px;margin:4px 2px 0;background:rgba(255,255,255,.14);color:inherit;font-weight:800;font-size:12px;font-family:inherit}",
      "#c4 .c42fmt{display:none;gap:4px;padding:4px 10px}#c4 .c42fmt.on{display:flex}#c4 .c42fmt button{border:0;border-radius:10px;min-width:38px;height:32px;background:rgba(255,255,255,.08);color:inherit;font-family:inherit;font-size:15px}",
      "#c4 .c42qr{position:absolute;bottom:100%;left:10px;right:10px;background:#111827;border-radius:14px;padding:6px;box-shadow:0 10px 30px #0008;z-index:5}#c4 .c42qr div{padding:9px 10px;border-radius:10px}#c4 .c42qr div:active{background:#ffffff14}",
      "#c4 .c42dis{display:block;text-align:center;font-size:12px;opacity:.7;margin:6px auto;padding:5px 12px;border-radius:10px;background:rgba(255,255,255,.06);width:max-content}",
      "#c42m{position:fixed;inset:0;z-index:2147483200;background:#0008;display:flex;align-items:flex-end;direction:rtl}#c42m .c42s{width:100%;max-width:560px;margin:0 auto;background:#0f141c;color:#fff;border-radius:22px 22px 0 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}",
      "#c42m h4{margin:4px 6px 10px;font-size:16px}#c42m .c42o{display:flex;align-items:center;gap:12px;width:100%;border:0;background:none;color:inherit;font-family:inherit;font-size:15px;padding:13px 8px;border-radius:12px;text-align:right}#c42m .c42o:active{background:#ffffff10}",
      "#c42m .c42g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}#c42m .c42g button{height:64px;border-radius:14px;border:2px solid transparent;color:#fff;font-family:inherit;font-size:12px}#c42m .c42g button.on{border-color:#19c58e}"
    ].join("\n");
    D.head.appendChild(css);

    function menu(title, opts) {
      var o = D.getElementById("c42m"); if (o) o.remove();
      o = D.createElement("div"); o.id = "c42m"; var s = D.createElement("div"); s.className = "c42s";
      var h = D.createElement("h4"); h.textContent = title; s.appendChild(h);
      opts.forEach(function (x) { if (x.node) { s.appendChild(x.node); return; } var b = D.createElement("button"); b.className = "c42o"; b.textContent = x[0]; b.onclick = function () { o.remove(); hap(); x[1](); }; s.appendChild(b); });
      o.appendChild(s); o.onclick = function (e) { if (e.target === o) o.remove(); }; D.body.appendChild(o);
    }
    function rerender() { try { C.render(); } catch (e) {} setTimeout(apply, 0); }
    function nm(r) { return r.name || (r.peer && r.peer.name) || "محادثة"; }

    // ---------- القايمة: فلاتر + أرشيف + تثبيت + مفضلة
    X.listTop.push(function () {
      var n = Object.keys(P.arc).length;
      var chips = [["all", "الكل"], ["unread", "غير مقروء"], ["fav", "⭐ المفضلة"], ["group", "الجروبات"], ["arc", "📦 المؤرشفة"]].map(function (c) { return '<button class="c42f' + (F === c[0] ? " on" : "") + '" data-f42="' + c[0] + '">' + c[1] + "</button>"; }).join("");
      return '<div class="f42c">' + chips + "</div>" + (n && F !== "arc" ? '<div class="f42a tap" data-f42="arc">📦 <span style="flex:1">المؤرشفة</span><span>' + n + "</span></div>" : "");
    });
    function apply() {
      var box = D.getElementById("c4rows"); if (!box) return;
      var rows = [].slice.call(box.querySelectorAll('.row[data-a="room"]'));
      rows.forEach(function (el) {
        var id = el.getAttribute("data-v"), r = C.roomById(id) || {}, hide = false;
        var unread = (r.unread || 0) > 0 || P.unr[id];
        if (F === "arc") hide = !P.arc[id]; else if (P.arc[id]) hide = true;
        if (F === "fav" && !P.fav[id]) hide = true;
        if (F === "unread" && !unread) hide = true;
        if (F === "group" && r.type !== "group" && r.type !== "community") hide = true;
        el.classList.toggle("c42h", hide);
        var rn = el.querySelector(".rn");
        if (rn && !rn.querySelector(".c42t")) { var t = (P.pin[id] ? "📌" : "") + (P.fav[id] ? "⭐" : "") + (P.dis[id] ? "⏳" : ""); if (t) { var sp = D.createElement("span"); sp.className = "c42t"; sp.textContent = t; rn.appendChild(sp); } }
        if (P.unr[id] && !el.querySelector(".ub")) { var rl = el.querySelector(".rl"); if (rl) { var u = D.createElement("span"); u.className = "ub"; u.textContent = " "; rl.appendChild(u); } }
      });
      // الترتيب: المثبّت ثم غير المقروء
      rows.sort(function (a, b) {
        var ia = a.getAttribute("data-v"), ib = b.getAttribute("data-v");
        var pa = P.pin[ia] || 0, pb = P.pin[ib] || 0; if (pa !== pb) return pb - pa; return 0;
      }).forEach(function (el) { if (P.pin[el.getAttribute("data-v")]) box.insertBefore(el, box.querySelector('.row[data-a="room"]:not([data-pinned])')); el.setAttribute("data-pinned", P.pin[el.getAttribute("data-v")] ? "1" : ""); });
      var empty = rows.length && rows.every(function (el) { return el.classList.contains("c42h"); });
      var em = box.querySelector(".c42e"); if (empty && !em) { em = D.createElement("div"); em.className = "empty c42e"; em.textContent = F === "arc" ? "مفيش محادثات مؤرشفة" : "مفيش حاجة هنا"; box.appendChild(em); } else if (!empty && em) em.remove();
    }
    function rowMenu(id) {
      var r = C.roomById(id) || { id: id }; hap();
      menu(nm(r), [
        [P.arc[id] ? "📤 شيل من الأرشيف" : "📦 أرشفة", function () { if (P.arc[id]) delete P.arc[id]; else { P.arc[id] = Date.now(); delete P.pin[id]; } save(); rerender(); C.say && C.say(P.arc[id] ? "اتأرشفت — هتفضل مؤرشفة حتى لو جت رسالة" : "رجعت للقايمة"); }],
        [P.pin[id] ? "📌 إلغاء التثبيت" : "📌 ثبّتها فوق", function () { if (P.pin[id]) delete P.pin[id]; else { if (Object.keys(P.pin).length >= 5) { C.say && C.say("أقصى حاجة 5 محادثات مثبّتة"); return; } P.pin[id] = Date.now(); } save(); rerender(); }],
        [P.fav[id] ? "⭐ شيل من المفضلة" : "⭐ أضف للمفضلة", function () { if (P.fav[id]) delete P.fav[id]; else P.fav[id] = 1; save(); rerender(); }],
        [P.unr[id] ? "✔ علّمها مقروءة" : "🔵 علّمها مش مقروءة", function () { if (P.unr[id]) delete P.unr[id]; else P.unr[id] = 1; save(); rerender(); }],
        ["⏳ رسائل بتختفي", function () { disMenu(id); }],
        ["🖼️ خلفية المحادثة", function () { wpMenu(id); }]
      ]);
    }
    D.addEventListener("click", function (e) {
      var f = e.target.closest && e.target.closest("[data-f42]"); if (f) { e.stopPropagation(); F = f.getAttribute("data-f42"); sv("c42_f", F); hap(); rerender(); return; }
      var row = e.target.closest && e.target.closest('#c4rows .row[data-a="room"]'); if (row) { var id = row.getAttribute("data-v"); if (P.unr[id]) { delete P.unr[id]; save(); } }
    }, true);
    var lp = null;
    D.addEventListener("touchstart", function (e) { var row = e.target.closest && e.target.closest('#c4rows .row[data-a="room"]'); if (!row) return; lp = setTimeout(function () { lp = "done"; rowMenu(row.getAttribute("data-v")); }, 520); }, { passive: true });
    ["touchend", "touchmove", "touchcancel"].forEach(function (ev) { D.addEventListener(ev, function (e) { if (lp === "done") { if (ev === "touchend") { e.preventDefault(); e.stopPropagation(); } lp = null; return; } clearTimeout(lp); lp = null; }, { capture: true, passive: false }); });
    D.addEventListener("contextmenu", function (e) { var row = e.target.closest && e.target.closest('#c4rows .row[data-a="room"]'); if (row) { e.preventDefault(); rowMenu(row.getAttribute("data-v")); } });

    // ---------- رسائل بتختفي + خلفية
    function disMenu(id) { menu("⏳ الرسائل بتختفي بعد", DIS.map(function (d) { return [(P.dis[id] === d[0] || (!P.dis[id] && !d[0]) ? "● " : "○ ") + d[1], function () { if (d[0]) P.dis[id] = d[0]; else delete P.dis[id]; save(); rerender(); applyChat(); C.say && C.say(d[0] ? "الرسائل الأقدم من " + d[1] + " هتستخبى على جهازك" : "اتقفلت"); }]; })); }
    function wpMenu(id) {
      var g = D.createElement("div"); g.className = "c42g";
      WP.forEach(function (w, i) { var b = D.createElement("button"); b.style.background = w[0] || "#1f2937"; b.textContent = w[1]; if ((P.wp[id] || 0) === i) b.className = "on"; b.onclick = function () { if (i) P.wp[id] = i; else delete P.wp[id]; save(); D.getElementById("c42m").remove(); applyChat(); hap(); }; g.appendChild(b); });
      menu("🖼️ خلفية المحادثة", [{ node: g }]);
    }
    function applyChat() {
      var r = S.room, box = D.getElementById("c4msgs"); if (!r || !box) return;
      var w = WP[P.wp[r.id] || 0]; box.style.background = w[0] || ""; box.style.backgroundAttachment = "local";
      var lim = P.dis[r.id], cut = lim ? Date.now() - lim : 0;
      [].slice.call(box.querySelectorAll(".b[data-id]")).forEach(function (el) { var m = S.msgs[el.getAttribute("data-id")]; var old = !!(cut && m && (m.at || m.ts || m.t || 0) && (m.at || m.ts || m.t) < cut); el.style.display = old ? "none" : ""; });
      var tag = box.querySelector(".c42dis"); if (lim && !tag) { tag = D.createElement("div"); tag.className = "c42dis"; box.insertBefore(tag, box.firstChild); } if (tag) { if (lim) tag.textContent = "⏳ الرسائل بتختفي بعد " + DIS.filter(function (d) { return d[0] === lim; })[0][1]; else tag.remove(); }
      voice(box);
    }
    // ---------- سرعة الفويس
    var RATES = [1, 1.5, 2];
    function voice(root) {
      [].slice.call(root.querySelectorAll("audio")).forEach(function (a) {
        if (a.c42) return; a.c42 = 1; var key = "c42_vp_" + (a.currentSrc || a.src || "").slice(-40);
        var rate = +ld("c42_rate", 1); a.playbackRate = rate;
        var b = D.createElement("button"); b.className = "c42sp"; b.textContent = rate + "×";
        b.onclick = function (e) { e.stopPropagation(); var i = (RATES.indexOf(+a.playbackRate) + 1) % 3; a.playbackRate = RATES[i]; sv("c42_rate", RATES[i]); b.textContent = RATES[i] + "×"; hap(); };
        a.addEventListener("loadedmetadata", function () { var t = +ld(key, 0); if (t > 1 && t < a.duration - 1) a.currentTime = t; });
        a.addEventListener("pause", function () { sv(key, a.currentTime || 0); });
        a.addEventListener("ended", function () { sv(key, 0); });
        a.addEventListener("play", function () { a.playbackRate = +ld("c42_rate", 1); b.textContent = a.playbackRate + "×"; });
        a.parentNode && a.parentNode.insertBefore(b, a.nextSibling);
      });
    }
    // ---------- شريط التنسيق + الردود السريعة
    function composer() {
      var inp = D.getElementById("c4in"); if (!inp || inp.c42) return; inp.c42 = 1;
      var bar = D.createElement("div"); bar.className = "c42fmt";
      [["*", "B", "عريض"], ["_", "I", "مائل"], ["~", "S", "مشطوب"], ["```", "</>", "كود"]].forEach(function (f) {
        var b = D.createElement("button"); b.textContent = f[1]; b.title = f[2]; if (f[1] === "B") b.style.fontWeight = "900"; if (f[1] === "I") b.style.fontStyle = "italic"; if (f[1] === "S") b.style.textDecoration = "line-through";
        b.onmousedown = function (e) { e.preventDefault(); }; b.onclick = function () { var s = inp.selectionStart, en = inp.selectionEnd, v = inp.value, sel = v.slice(s, en) || "نص"; inp.value = v.slice(0, s) + f[0] + sel + f[0] + v.slice(en); inp.focus(); inp.selectionStart = s + f[0].length; inp.selectionEnd = s + f[0].length + sel.length; inp.dispatchEvent(new Event("input", { bubbles: true })); hap(); };
        bar.appendChild(b);
      });
      var wrap = inp.parentNode; wrap.parentNode.insertBefore(bar, wrap); wrap.style.position = wrap.style.position || "relative";
      var qr = null;
      inp.addEventListener("select", function () { bar.classList.toggle("on", inp.selectionEnd > inp.selectionStart); });
      D.addEventListener("selectionchange", function () { if (D.activeElement === inp) bar.classList.toggle("on", inp.selectionEnd > inp.selectionStart); });
      inp.addEventListener("input", function () {
        var v = inp.value; if (qr) { qr.remove(); qr = null; }
        if (/^\/\S*$/.test(v)) {
          var list = P.qr.filter(function (q) { return q[0].indexOf(v) === 0; }); qr = D.createElement("div"); qr.className = "c42qr";
          list.forEach(function (q) { var d = D.createElement("div"); d.className = "tap"; d.innerHTML = "<b>" + esc(q[0]) + "</b> · " + esc(q[1]); d.onmousedown = function (e) { e.preventDefault(); }; d.onclick = function () { inp.value = q[1]; qr.remove(); qr = null; inp.dispatchEvent(new Event("input", { bubbles: true })); inp.focus(); }; qr.appendChild(d); });
          var add = D.createElement("div"); add.className = "tap"; add.textContent = "➕ رد سريع جديد"; add.onclick = function () { var k = prompt("الاختصار (يبدأ بـ /)", v.length > 1 ? v : "/"); if (!k) return; if (k[0] !== "/") k = "/" + k; var t = prompt("الرسالة"); if (!t) return; P.qr = P.qr.filter(function (q) { return q[0] !== k; }).concat([[k, t]]); save(); inp.value = t; inp.dispatchEvent(new Event("input", { bubbles: true })); };
          qr.appendChild(add); wrap.appendChild(qr);
        }
      });
    }
    // مراقبة الرسم
    var mo = new MutationObserver(function () { clearTimeout(mo.t); mo.t = setTimeout(function () { apply(); applyChat(); composer(); }, 40); });
    function watch() { var root = D.getElementById("c4"); if (root && !root.c42) { root.c42 = 1; mo.observe(root, { childList: true, subtree: true }); apply(); applyChat(); composer(); } }
    watch(); var iv = setInterval(watch, 1500);
    // في قايمة معلومات الجروب
    X.infoRows.push(function () { var r = S.room; if (!r) return ""; return ""; });
    // ترقيم الرسالة المؤرشفة: نشيل الرسايل الجديدة من العداد العام لو المحادثة مؤرشفة
    var _b = setInterval(function () { try { var n = S.rooms.reduce(function (a, r) { return a + (P.arc[r.id] || r.muteUntil > Date.now() ? 0 : r.unread || 0); }, 0); if (W.C4.unread !== n) { W.C4.unread = n; [].slice.call(D.querySelectorAll(".c4entry .ub")).forEach(function (b) { b.textContent = n > 99 ? "99+" : n; b.style.display = n ? "" : "none"; }); } } catch (e) {} }, 2000);
    W.C42 = { prefs: P, menu: rowMenu, apply: apply, off: function () { clearInterval(iv); clearInterval(_b); mo.disconnect(); } };
    return true;
  }
  if (!boot()) { var n = 0, t = setInterval(function () { if (boot() || ++n > 40) clearInterval(t); }, 500); }
})();
