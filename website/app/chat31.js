/* سعراتي — شات 31 (chat31.js): طبقة فوق محادثات c23
   • تصميم جديد (فقاعات بذيل، خلفيات، رأس زجاجي، شريط كتابة بيضاوي)
   • أيقونات SVG بدل الإيموجي في أزرار الشات
   • إيموجي ثلاثية الأبعاد (Microsoft Fluent Emoji — رخصة MIT) في الرسايل + لوحة اختيار + الأخيرة
   • الوكيل بيراجع كل رسالة/صورة/صوت/ملف قبل ما يتبعت (/v1/app/mod/scan) — العقوبات السارية بتمنع الإرسال
   • سرعة تشغيل الصوت 1×/1.5×/2×، زر النزول لآخر الرسايل، ردود سريعة ذكية، 6 خلفيات
   مفاتيح: localStorage sp31_chat_off = "emoji,mod,design,icons,quick" */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.CHAT31) return;
  var OFF = {}; (function () { try { String(localStorage.getItem("sp31_chat_off") || "").split(",").forEach(function (k) { if (k.trim()) OFF[k.trim()] = 1; }); } catch (e) {} })();
  var DEP = "https://deputy.sorati-command.workers.dev";
  var LITE = function () { return D.documentElement.classList.contains("lite31"); };
  var ld = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  var sv = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var say = function (m, i) { try { toast(m, i || "info"); } catch (e) {} };

  // ================= أيقونات =================
  var P = {
    attach: '<path d="M21 11.5 12.6 19.9a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8"/>',
    mic: '<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7"/>',
    send: '<path d="M4 12 20 4l-4 16-4.5-6.5L4 12Z"/><path d="m11.5 13.5 3-3"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    back: '<path d="m9 5 7 7-7 7"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.6v.2M15 9.6v.2"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1-.8-1.4-.8-2.3 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
    more: '<circle cx="12" cy="5.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18.5" r="1.3"/>'
  };
  var svg = function (n) { return '<svg class="i31" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || "") + "</svg>"; };
  var ICON_BY_TEXT = { "📎": "attach", "🎤": "mic", "➤": "send", "■": "stop", "🔍": "search", "ℹ️": "info", "ℹ": "info", "→": "back", "←": "back", "⋮": "more" };

  // ================= تصميم =================
  var WALLS = {
    emerald: "radial-gradient(circle at 20% 10%,rgba(16,185,129,.10),transparent 40%),radial-gradient(circle at 85% 80%,rgba(245,197,81,.07),transparent 45%),#07110e",
    night: "radial-gradient(circle at 50% 0%,rgba(99,102,241,.14),transparent 55%),#070912",
    gold: "radial-gradient(circle at 80% 0%,rgba(245,197,81,.16),transparent 50%),radial-gradient(circle at 10% 100%,rgba(180,120,20,.12),transparent 50%),#0d0a04",
    rose: "radial-gradient(circle at 15% 15%,rgba(244,114,182,.13),transparent 45%),#100a0e",
    ocean: "radial-gradient(circle at 70% 20%,rgba(34,211,238,.12),transparent 50%),#061014",
    plain: "#0a0f0d"
  };
  var WALL_N = { emerald: "زمردي", night: "ليلي", gold: "ذهبي", rose: "وردي", ocean: "محيط", plain: "سادة" };
  function css() {
    if (D.getElementById("chat31css")) return;
    var c = "" +
      ".i31{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;display:block}" +
      "[dir=rtl] .c23back .i31,html[dir=rtl] .c23back .i31{transform:none}" +
      "img.e31{width:1.35em;height:1.35em;vertical-align:-.32em;margin:0 .04em;display:inline-block;object-fit:contain;-webkit-user-drag:none}" +
      "#c23 .c23m.jumbo31,#c23 .c23m.me.jumbo31,.c23m.jumbo31{background:transparent!important;border:0!important;box-shadow:none!important;padding:2px 2px!important}#c23 .c23m.me.jumbo31 .mt{color:inherit!important;opacity:.6}" + "body:has(#c23.on) #v30fab,body:has(#c23.on) #r29fab,body:has(#c23.on) #c3fab,body:has(#c23.on) .w28-fab,body:has(#e31pan) #v30fab{display:none!important}" + ".c23m.jumbo31 img.e31{width:64px;height:64px;vertical-align:middle;animation:pop31 .35s cubic-bezier(.2,1.6,.4,1)}" +
      "@keyframes pop31{from{transform:scale(.4);opacity:0}}" +
      "#e31btn{flex:0 0 auto}" +
      "#e31pan{position:absolute;bottom:calc(100% + 8px);inset-inline:0;z-index:30;background:#0f1a16;border:1px solid rgba(255,255,255,.1);border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.55);padding:8px;max-height:310px;display:flex;flex-direction:column}" +
      "#e31pan .tabs{display:flex;gap:4px;padding:2px 2px 6px;overflow-x:auto;scrollbar-width:none}#e31pan .tabs button{flex:0 0 auto;border:0;background:transparent;border-radius:12px;padding:5px 7px;opacity:.55}#e31pan .tabs button.on{background:rgba(255,255,255,.08);opacity:1}#e31pan .tabs img{width:24px;height:24px;display:block}" +
      "#e31pan .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:2px;overflow-y:auto;overscroll-behavior:contain;padding:2px}" +
      "#e31pan .grid button{border:0;background:transparent;border-radius:12px;padding:5px;aspect-ratio:1}#e31pan .grid button:active{background:rgba(255,255,255,.1);transform:scale(.9)}#e31pan .grid img{width:100%;height:100%;object-fit:contain;display:block}" +
      "#e31pan .walls{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px}#e31pan .walls button{border:2px solid transparent;border-radius:14px;height:58px;color:#fff;font:inherit;font-size:12.5px}#e31pan .walls button.on{border-color:#10b981}" +
      "#q31{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:0 10px 6px}#q31 button{flex:0 0 auto;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:inherit;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px}" +
      "#dn31{position:absolute;inset-inline-end:14px;bottom:86px;z-index:20;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:#14211c;color:#e7fff5;display:none;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(0,0,0,.4)}#dn31.on{display:flex}#dn31 b{position:absolute;top:-6px;inset-inline-start:-6px;background:#10b981;color:#04110b;border-radius:999px;font-size:11px;min-width:19px;height:19px;display:flex;align-items:center;justify-content:center;padding:0 5px}" +
      ".sp31{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;border-radius:999px;font:inherit;font-size:11.5px;padding:2px 8px;margin-inline-start:6px}" +
      ".mod31{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;opacity:.75;padding:2px 0 0}.mod31 .i31{width:14px;height:14px}";
    if (!OFF.design) c += "" +
      "#c23 .c23msgs{background:var(--w31," + WALLS.emerald + ")!important;padding-inline:10px}" +
      "#c23 .c23m{border-radius:20px;padding:8px 12px 6px;box-shadow:0 2px 6px rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.07);background:#15201c;font-size:15.5px;line-height:1.6}" +
      "#c23 .c23m.me{background:linear-gradient(160deg,#0f8f67,#0b6f52)!important;border-color:rgba(255,255,255,.08);color:#f2fff9}" +
      "#c23 .c23m.me .mt{color:rgba(240,255,248,.75)!important}" +
      "#c23 .c23m:not(.me):not(.jumbo31){border-start-start-radius:6px}#c23 .c23m.me:not(.jumbo31){border-start-end-radius:6px}" +
      "#c23 .c23h{background:rgba(10,18,15,.86);border-bottom:1px solid rgba(255,255,255,.06)}" +
      "#c23 .c23comp{background:#121c18;border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:4px 6px;margin:6px 8px calc(env(safe-area-inset-bottom) + 8px);align-items:flex-end;gap:2px}" +
      "#c23 .c23comp textarea{background:transparent!important;border:0!important;box-shadow:none!important;padding:9px 6px;font-size:15.5px}" +
      "#c23 .c23send{width:44px;height:44px;border-radius:50%;background:linear-gradient(145deg,#19c58e,#0c8e66)!important;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(16,185,129,.35);transition:transform .15s}#c23 .c23send:active{transform:scale(.9)}" +
      "#c23 .c23send.rec{background:linear-gradient(145deg,#f43f5e,#be123c)!important;animation:rec31 1.2s ease-in-out infinite}@keyframes rec31{50%{box-shadow:0 0 0 10px rgba(244,63,94,.18)}}" +
      "#c23 .c23ib{display:inline-flex;align-items:center;justify-content:center;color:#cfe9df}" +
      "#c23 .c23day{background:rgba(255,255,255,.07);border-radius:999px;padding:3px 12px}" +
      "#c23 .c23m img:not(.e31){border-radius:14px}" +
      "html.lite31 #c23 .c23m{box-shadow:none}html.lite31 #c23 .c23send.rec{animation:none}";
    var st = D.createElement("style"); st.id = "chat31css"; st.textContent = c; D.head.appendChild(st);
    applyWall();
  }
  function applyWall() { var w = ld("sp31_wall", "emerald"); D.documentElement.style.setProperty("--w31", WALLS[w] || WALLS.emerald); }

  // ================= إيموجي 3D =================
  var EMO = null, EMO_RE = null, BYCH = {};
  var CATS = [
    ["😀", "وشوش", ["1f600","1f602","1f923","1f60a","1f60d","1f618","1f970","1f929","1f609","1f60b","1f60e","1f914","1f917","1f92d","1f606","1f642","1f643","1f60c","1f614","1f622","1f62d","1f97a","1f620","1f621","1f631","1f633","1f634","1f924","1f971","1f922","1f975","1f976","1f973","1f92f","1f92a","1f644","1f610","1f62c","1fae0","1fae1","1f92b","1f480","1f47b","1f921","1f607","1f608","1f916","1f4a9"]],
    ["❤️", "قلوب وإيدين", ["2764","1f9e1","1f49b","1f49a","1f499","1f49c","1f5a4","1f90d","1f494","1f495","1f496","2764-200d-1f525","1f44d","1f44e","1f44f","1f64c","1f64f","1f44b","1f44c","270c","1f4aa","1f91d","261d","1f919","1f440","1f9e0"]],
    ["🍎", "أكل", ["1f34e","1f34f","1f34c","1f951","1f966","1f955","1f95a","1f35e","1f9c0","1f357","1f969","1f354","1f355","1f35f","1f32d","1f32e","1f957","1f35c","1f35d","1f35a","1f363","1f36a","1f382","1f369","1f36b","1f368","1f349","1f353","1f347","1f34b","2615","1f375","1f964","1f9cb","1f95b","1f4a7"]],
    ["🏆", "رياضة وطبيعة", ["1f525","2728","2b50","1f31f","1f4af","1f389","1f38a","1f381","1f3c6","1f947","1f451","1f48e","1f4b0","1f3c3","1f3cb","1f9d8","1f6b2","26bd","1f3c0","2600","1f319","1f308","2601","2744","1f331","1f340","1f339","1f33b","1f338","1f54c","1f54b","262a","1f54a","1f3ee","1f391","1f431","1f436","1f981","1f43c","1f984","1f98b"]],
    ["🚀", "حاجات", ["1f680","1f4a1","2705","274c","26a0","1f514","1f4e3","23f3","23f0","1f4c5","1f4f7","1f3a4","1f3a7","1f4f1","1f4ac","1f4ad","1f512","1f511","1f6e1"]]
  ];
  function cpOf(s) { var a = []; for (var ch of s) { var c = ch.codePointAt(0); if (c !== 0xfe0f) a.push(c.toString(16)); } return a.join("-"); }
  var src = function (cp) { return "emoji31/" + cp + ".webp"; };
  function loadEmo() {
    if (EMO) return Promise.resolve(EMO);
    return fetch("emoji31/index.json").then(function (r) { return r.json(); }).then(function (L) {
      EMO = {}; L.forEach(function (x) { EMO[x[1]] = x[0]; BYCH[x[0].replace(/\uFE0F/g, "")] = x[1]; });
      var keys = Object.keys(BYCH).sort(function (a, b) { return b.length - a.length; }).map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
      EMO_RE = new RegExp("(" + keys.join("|") + ")\\uFE0F?", "gu");
      return EMO;
    }).catch(function () { EMO = {}; return EMO; });
  }
  function emojify(bubble) {
    if (!EMO_RE || bubble.dataset.e31) return;
    bubble.dataset.e31 = "1";
    var tw = D.createTreeWalker(bubble, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var p = n.parentNode; return p && !/^(TEXTAREA|INPUT|SCRIPT|STYLE|CODE)$/.test(p.nodeName) && !(p.closest && p.closest(".mt,.who")) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    var nodes = [], n; while ((n = tw.nextNode())) { EMO_RE.lastIndex = 0; if (EMO_RE.test(n.nodeValue)) nodes.push(n); }
    var count = 0, otherText = false;
    nodes.forEach(function (t) {
      var s = t.nodeValue, frag = D.createDocumentFragment(), last = 0; EMO_RE.lastIndex = 0; var m;
      while ((m = EMO_RE.exec(s))) {
        if (m.index > last) frag.appendChild(D.createTextNode(s.slice(last, m.index)));
        var cp = BYCH[m[1].replace(/\uFE0F/g, "")]; var im = D.createElement("img"); im.className = "e31"; im.alt = m[0]; im.draggable = false; im.loading = "lazy"; im.decoding = "async"; im.src = src(cp);
        im.onerror = function () { this.replaceWith(D.createTextNode(this.alt)); };
        frag.appendChild(im); last = m.index + m[0].length; count++;
      }
      if (last < s.length) frag.appendChild(D.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
    // فقاعة إيموجي بس (1–3) = حجم كبير زي الآيفون
    var body = bubble.cloneNode(true); Array.prototype.forEach.call(body.querySelectorAll(".mt,.who,.rx,.q,.fw,img.e31"), function (x) { x.remove(); });
    otherText = /\S/.test(body.textContent.replace(/[\u200d\uFE0F]/g, ""));
    if (count >= 1 && count <= 3 && !otherText && !bubble.querySelector("img:not(.e31),audio,video,.doc,.c23meal")) bubble.classList.add("jumbo31");
  }
  var recent = function () { return ld("sp31_erec", ["1f602","2764","1f44d","1f525","1f60d","1f64f","1f62d","1f973"]); };
  function pushRecent(cp) { var r = recent().filter(function (x) { return x !== cp; }); r.unshift(cp); sv("sp31_erec", r.slice(0, 24)); }
  function insertText(ta, t) {
    var a = ta.selectionStart != null ? ta.selectionStart : ta.value.length, b = ta.selectionEnd != null ? ta.selectionEnd : a;
    ta.value = ta.value.slice(0, a) + t + ta.value.slice(b); var p = a + t.length; try { ta.setSelectionRange(p, p); } catch (e) {}
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function panel(comp) {
    var ex = D.getElementById("e31pan"); if (ex) { ex.remove(); return; }
    var pan = D.createElement("div"); pan.id = "e31pan";
    var tabs = D.createElement("div"); tabs.className = "tabs"; var grid = D.createElement("div"); grid.className = "grid";
    var sets = [["recent", "", "الأخيرة", "clock"]].concat(CATS.map(function (c, i) { return ["c" + i, c[0], c[1]]; })).concat([["wall", "", "الخلفية", "palette"]]);
    function show(id) {
      Array.prototype.forEach.call(tabs.children, function (b) { b.classList.toggle("on", b.dataset.id === id); });
      grid.replaceChildren(); grid.className = id === "wall" ? "walls" : "grid";
      if (id === "wall") {
        var cur = ld("sp31_wall", "emerald");
        Object.keys(WALLS).forEach(function (k) { var b = D.createElement("button"); b.style.background = WALLS[k]; b.textContent = WALL_N[k]; if (k === cur) b.className = "on"; b.onclick = function () { sv("sp31_wall", k); applyWall(); show("wall"); }; grid.appendChild(b); });
        return;
      }
      var L = id === "recent" ? recent() : CATS[+id.slice(1)][2];
      L.filter(function (cp) { return EMO[cp]; }).forEach(function (cp) {
        var b = D.createElement("button"); b.type = "button"; b.setAttribute("aria-label", EMO[cp]);
        var im = D.createElement("img"); im.src = src(cp); im.alt = EMO[cp]; im.loading = "lazy"; im.decoding = "async"; b.appendChild(im);
        b.onclick = function () { var ta = D.getElementById("c23in"); if (ta) { insertText(ta, EMO[cp]); pushRecent(cp); } try { W.Android && Android.haptic && Android.haptic(8); } catch (e) {} };
        grid.appendChild(b);
      });
    }
    sets.forEach(function (s) {
      var b = D.createElement("button"); b.type = "button"; b.dataset.id = s[0]; b.title = s[2]; b.setAttribute("aria-label", s[2]);
      var cp = s[1] ? cpOf(s[1]) : ""; if (s[3]) b.innerHTML = svg(s[3]); else if (EMO[cp]) { var im = D.createElement("img"); im.src = src(cp); im.alt = ""; b.appendChild(im); } else b.textContent = s[1];
      b.onclick = function () { show(s[0]); }; tabs.appendChild(b);
    });
    pan.appendChild(tabs); pan.appendChild(grid); comp.appendChild(pan); show("recent");
    setTimeout(function () { D.addEventListener("pointerdown", function off(e) { if (!pan.contains(e.target) && e.target.id !== "e31btn" && !(e.target.closest && e.target.closest("#e31btn"))) { pan.remove(); D.removeEventListener("pointerdown", off, true); } }, true); }, 0);
  }

  // ================= الأيقونات والإضافات على الشاشة =================
  function iconize(root) {
    if (OFF.icons) return;
    Array.prototype.forEach.call(root.querySelectorAll(".c23ib,.c23send"), function (b) {
      var t = (b.textContent || "").trim(); var n = ICON_BY_TEXT[t];
      if (n && b.dataset.i31 !== n) { b.dataset.i31 = n; if (!b.getAttribute("aria-label")) b.setAttribute("aria-label", b.title || n); b.innerHTML = svg(n); b.dataset.t31 = t; }
    });
  }
  function enhanceComposer() {
    var comp = D.querySelector("#c23 .c23comp"); if (!comp || comp.querySelector("#e31btn") || OFF.emoji) return;
    var b = D.createElement("button"); b.type = "button"; b.id = "e31btn"; b.className = "c23ib"; b.setAttribute("aria-label", "إيموجي"); b.innerHTML = svg("smile");
    b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); loadEmo().then(function () { panel(comp); }); };
    var ta = comp.querySelector("textarea"); comp.insertBefore(b, ta || null);
  }
  // زر الإرسال: الأصل بيغيّر textContent لـ 🎤/➤/■ — بنحوّلها لأيقونة كل مرة
  function watchSend() {
    var sb = D.getElementById("c23sb"); if (!sb || sb.__w31) return; sb.__w31 = 1;
    new MutationObserver(function () { var t = (sb.textContent || "").trim(); if (ICON_BY_TEXT[t]) { sb.dataset.i31 = ""; iconize(sb.parentNode); } }).observe(sb, { childList: true, characterData: true, subtree: true });
  }
  // سرعة الصوت
  function audioSpeed(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".c23m audio"), function (a) {
      if (a.__sp31) return; a.__sp31 = 1;
      var b = D.createElement("button"); b.type = "button"; b.className = "sp31"; var r = [1, 1.5, 2], i = 0; b.textContent = "1×";
      b.onclick = function (e) { e.stopPropagation(); i = (i + 1) % 3; a.playbackRate = r[i]; b.textContent = r[i] + "×"; };
      a.insertAdjacentElement("afterend", b);
    });
  }
  // زر النزول لآخر الرسايل
  var dnSeen = 0;
  function downBtn() {
    var ms = D.getElementById("c23ms"); if (!ms) return; var C = ms.parentNode; if (!C) return;
    var b = D.getElementById("dn31");
    if (!b || b.parentNode !== C) { if (b) b.remove(); b = D.createElement("button"); b.id = "dn31"; b.type = "button"; b.setAttribute("aria-label", "آخر الرسايل"); b.innerHTML = svg("down") + "<b hidden></b>"; b.onclick = function () { ms.scrollTo({ top: ms.scrollHeight, behavior: LITE() ? "auto" : "smooth" }); }; C.style.position = C.style.position || "relative"; C.appendChild(b); }
    if (!ms.__dn31) { ms.__dn31 = 1; ms.addEventListener("scroll", function () { upd(); }, { passive: true }); }
    function upd() { var far = ms.scrollHeight - ms.scrollTop - ms.clientHeight > 320; b.classList.toggle("on", far); var n = ms.querySelectorAll(".c23m").length; var badge = b.querySelector("b"); if (!far) { dnSeen = n; badge.hidden = true; } else if (n > dnSeen && dnSeen) { badge.hidden = false; badge.textContent = n - dnSeen; } }
    upd();
  }
  // ردود سريعة
  var QR = [
    [/(السلام عليكم|سلام عليكم)/, ["وعليكم السلام 👋", "وعليكم السلام ورحمة الله ❤️"]],
    [/(صباح الخير|صباحو)/, ["صباح النور ☀️", "صباح الفل 🌸"]],
    [/(مساء الخير)/, ["مساء النور 🌙", "مساء الفل 🌸"]],
    [/(شكرا|شكرًا|متشكر|ميرسي)/, ["العفو ❤️", "تحت أمرك 🙏"]],
    [/(عامل ايه|عامله ايه|اخبارك|أخبارك|ازيك|إزيك)/, ["الحمد لله تمام 😊", "كويس وانت؟ 👍"]],
    [/(مبروك|ألف مبروك)/, ["الله يبارك فيك ❤️", "شكرًا 🎉"]],
    [/(كلت|أكلت|اكلت|وجبة|سعرات|دايت|رجيم)/, ["بالهنا 😋", "عاش يا بطل 💪", "سجّلها في سعراتي 🔥"]],
    [/(تمرين|جيم|مشي|جري)/, ["عاش 💪", "كمّل يا وحش 🔥"]],
    [/[؟?]\s*$/, ["أيوه 👍", "لا", "مش عارف 🤔"]]
  ];
  function quick() {
    if (OFF.quick) return;
    var comp = D.querySelector("#c23 .c23comp"), ms = D.getElementById("c23ms"); if (!comp || !ms) return;
    var bub = ms.querySelectorAll(".c23m"); var last = bub[bub.length - 1];
    var q = D.getElementById("q31");
    var ta = D.getElementById("c23in");
    var key = last ? (last.textContent || "").slice(0, 200) : "";
    if (!last || last.classList.contains("me") || (ta && ta.value.trim())) { if (q) q.remove(); return; }
    if (q && q.dataset.k === key) return;
    var txt = ""; try { var c = last.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll(".mt,.who,.rx"), function (x) { x.remove(); }); Array.prototype.forEach.call(c.querySelectorAll("img.e31"), function (x) { x.replaceWith(x.alt); }); txt = c.textContent.trim(); } catch (e) {}
    var opts = []; QR.some(function (r) { if (r[0].test(txt)) { opts = r[1]; return true; } return false; });
    if (!opts.length) { if (q) q.remove(); return; }
    if (!q) { q = D.createElement("div"); q.id = "q31"; comp.parentNode.insertBefore(q, comp); }
    q.dataset.k = key; q.replaceChildren();
    opts.forEach(function (o) { var b = D.createElement("button"); b.type = "button"; b.textContent = o; b.onclick = function () { var t = D.getElementById("c23in"); if (t) { t.value = o; t.dispatchEvent(new Event("input", { bubbles: true })); t.focus(); } q.remove(); }; q.appendChild(b); });
  }

  var raf = 0;
  function sweep() {
    raf = 0; var L = D.getElementById("c23"); if (!L) return;
    css(); iconize(L); enhanceComposer(); watchSend();
    if (!OFF.emoji && EMO_RE) Array.prototype.forEach.call(L.querySelectorAll(".c23m:not([data-e31])"), emojify);
    audioSpeed(L); downBtn(); quick();
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(sweep); }
  function boot() {
    css(); if (!OFF.emoji) loadEmo().then(schedule);
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { var t = muts[i].target; if (t.id === "c23" || (t.closest && t.closest("#c23")) || Array.prototype.some.call(muts[i].addedNodes, function (n) { return n.id === "c23"; })) { schedule(); return; } }
    }).observe(D.body, { childList: true, subtree: true });
  }

  // ================= الوكيل بيراجع قبل الإرسال =================
  var modCache = {};
  async function scan(body) {
    try {
      var F = (typeof FB !== "undefined" ? FB : W.FB); if (!F || !F.signedIn || !F.signedIn()) return null;
      await F.token(); var tok = F.tok, uid = F.user && F.user.uid; if (!tok || !uid) return null;
      var ac = new AbortController(), to = setTimeout(function () { ac.abort(); }, body.kind === "file" ? 6000 : 9000);
      var r = await (W.__fetch31 || fetch)(DEP + "/v1/app/mod/scan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({ uid: uid, idToken: tok }, body)), signal: ac.signal });
      clearTimeout(to); var d = await r.json().catch(function () { return null; });
      return d && d.ok ? d : null;
    } catch (e) { return null; }
  }
  var hex = function (buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return x.toString(16).padStart(2, "0"); }).join(""); };
  function blocked(d) {
    var why = (d.reasons && d.reasons[0]) || "المحتوى مخالف لقوانين المجتمع";
    var lv = d.action && d.action.level, LV = { warn: "تحذير أول", chat_mute: "كتم الشات", chat_ban: "منع من الشات", suspend: "إيقاف الحساب", ban: "حظر" };
    if ((d.cats || []).indexOf("insult") >= 0 && !(d.reasons && d.reasons[0])) why = "فيها إهانة";
    var msg = (d.cats || []).indexOf("sanctioned") >= 0 ? "مش هتقدر تبعت دلوقتي — " + why : "🛡 الوكيل منع الرسالة: " + why + (lv ? " · " + (LV[lv] || lv) : "");
    try { toast(msg); W.Android && Android.haptic && Android.haptic(); } catch (e) {}
    return new Response(JSON.stringify({ error: msg }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (!OFF.mod && W.fetch && !W.__fetch31) {
    var of = W.fetch.bind(W); W.__fetch31 = of;
    W.fetch = async function (input, init) {
      try {
        var url = typeof input === "string" ? input : (input && input.url) || "";
        var m = init && String(init.method || "").toUpperCase() === "POST";
        if (m && /\/c(23)?(\?|$)/.test(url) && typeof init.body === "string") {
          // v32: كل نصوص المجتمع بتعدي على الوكيل — الشات (c23) + الغرف والرسايل الخاصة والبوستات والتعليقات والستوري والمجموعات (/c)
          var j = null; try { j = JSON.parse(init.body); } catch (e) {}
          var OPS = { say: "msg", edit: "msg", dm: "msg", cmt: "msg", "dm.say": "msg", post: "post", "v16.post": "post", "story.add": "post", "v13.story.add": "post", "v13.repost": "post", "sq.create": "msg", "sq.edit": "msg", profile: "msg" };
          var kind = j && OPS[j.op];
          if (kind && j.args) {
            var a = j.args, parts = [a.txt, a.text, a.msg, a.body, a.cap, a.bio, a.name, a.uname, a.title].filter(function (x) { return typeof x === "string" && x.trim(); });
            var t = parts.join("\n").trim();
            if (t) {
              var k = j.op + ":" + t.slice(0, 500);
              var d = modCache[k] || await scan({ kind: kind, text: t, room: String(a.r || a.room || a.to || a.id || j.op).slice(0, 80) });
              if (!d) { try { var lc = W.G29 && W.G29.scan && W.G29.scan(t); if (lc && lc.verdict === "block") return blocked({ cats: lc.cats, reasons: [lc.msg || "المحتوى مخالف"] }); } catch (e) {} }
              if (d && d.verdict !== "block") modCache[k] = d;
              if (d && d.verdict === "block") return blocked(d);
              if (d && d.verdict === "review") { try { toast("🛡 الوكيل خد باله من رسالتك وهتتراجع"); } catch (e) {} }
            }
          }
        } else if (m && /\/c23\/up(\?|$)/.test(url) && init.body && typeof init.body.arrayBuffer === "function") {
          var buf = await init.body.arrayBuffer();
          if (buf.byteLength > 25 * 1024 * 1024) return new Response(JSON.stringify({ error: "الملف أكبر من 25 ميجا" }), { headers: { "content-type": "application/json" } });
          var sha = hex(await crypto.subtle.digest("SHA-256", buf));
          var hdr = (init.headers || {}), mime = hdr["x-mime"] || init.body.type || "application/octet-stream";
          var nm = (url.match(/[?&]name=([^&]+)/) || [])[1]; nm = nm ? decodeURIComponent(nm) : (/^audio/.test(mime) ? "voice" : /^image/.test(mime) ? "image" : "file");
          var r2 = (url.match(/[?&]r=([^&]+)/) || [])[1];
          var d2 = await scan({ kind: "file", fileMeta: { name: nm.slice(0, 120), mime: String(mime).slice(0, 80), size: buf.byteLength, sha256: sha }, room: r2 ? decodeURIComponent(r2).slice(0, 80) : "" });
          if (d2 && d2.verdict === "block") return blocked(d2);
          init = Object.assign({}, init, { body: new Blob([buf], { type: init.body.type || mime }) });
        }
      } catch (e) {}
      return of(input, init);
    };
  }

  W.CHAT31 = { version: 31, sweep: schedule, walls: Object.keys(WALLS), setWall: function (k) { if (WALLS[k]) { sv("sp31_wall", k); applyWall(); } }, emoji: function () { return loadEmo(); } };
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", boot); else boot();
})();
