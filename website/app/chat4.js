/* واتساب سعراتي 4.0 — chat4.js
   شات خاص بسعراتي على سيرفرنا (deputy /v1/app/c4): محادثات خاصة، جروبات، قنوات، مجتمعات.
   لايف بـ WebSocket (Durable Object) + سحب احتياطي، طابور بدون نت، أيقونات iOS (icons38.js)، إيموجي 3D (emoji38).
   خلف علم sp_ff_chat4 (الافتراضي شغال، "0" يقفله). الشات القديم (c23) زي ما هو. */
/* global S */
// reads the app's lexical `S` (let S) from outside chat4's IIFE, where our own `S` shadows it
window.__c4appS = function () { try { return typeof S !== "undefined" ? S : undefined; } catch (e) { return undefined; } };
(function () {
  "use strict";
  var W = window, D = document;
  if (W.C4) return;
  var API = "https://deputy.sorati-command.workers.dev/v1/app/c4";
  var FLAG = function () { try { if (localStorage.getItem("sp_ff_chat4") === "0") return false; if (W.WS32 && W.WS32.tierOf && W.WS32.tierOf("c4_on") === "off") return false; return true; } catch (e) { return true; } };

  // ------------------------------------------------------------ helpers
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ld = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  var sv = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { try { pruneCache(); localStorage.setItem(k, JSON.stringify(v)); } catch (x) {} } };
  var now = function () { return Date.now(); };
  var ic = function (n, s, c) { return W.IC38 ? W.IC38.svg(n, s, c) : ""; };
  var say = function (m) { try { W.toast ? W.toast(m) : console.log(m); } catch (e) {} };
  var hap = function (n) { try { if (W.Android && W.Android.haptic) W.Android.haptic(); else if (navigator.vibrate) navigator.vibrate(n || 8); } catch (e) {} };
  var LITE = function () { return D.documentElement.classList.contains("lite31") || D.body.classList.contains("lite"); };
  var cidGen = function () { return "c" + now().toString(36) + Math.random().toString(36).slice(2, 8); };
  var fmtT = function (t) { var d = new Date(t); return d.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" }); };
  var fmtDay = function (t) {
    var d = new Date(t), n = new Date(); var y = new Date(); y.setDate(n.getDate() - 1);
    if (d.toDateString() === n.toDateString()) return "النهارده";
    if (d.toDateString() === y.toDateString()) return "امبارح";
    return d.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
  };
  var fmtList = function (t) { if (!t) return ""; var d = new Date(t), n = new Date(); return d.toDateString() === n.toDateString() ? fmtT(t) : (n - d < 6 * 864e5 ? d.toLocaleDateString("ar-EG", { weekday: "short" }) : d.toLocaleDateString("ar-EG", { day: "numeric", month: "numeric" })); };
  var shortId = function (u) { return String(u || "").slice(0, 10); };
  var hue = function (s) { var h = 0; s = String(s || ""); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };

  // ------------------------------------------------------------ emoji 3D
  var EMO = null;
  function loadEmo() {
    if (EMO) return Promise.resolve(EMO);
    var base = W.E38_BASE || "emoji38/";
    return fetch(base + "index.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      EMO = { base: base, img: W.E38_IMG || base, list: j, map: {} }; j.forEach(function (x) { EMO.map[x[0]] = x[1]; });
      fetch(base + "all.json").then(function (r) { return r.ok ? r.json() : {}; }).then(function (a) { Object.keys(a).forEach(function (k) { if (!EMO.map[k]) EMO.map[k] = a[k]; }); }).catch(function () {});
      return EMO; })
      .catch(function () { return fetch("emoji31/index.json").then(function (r) { return r.json(); }).then(function (j) { EMO = { base: "emoji31/", list: j.map(function (x) { return [x[0], x[1], "smileys"]; }), map: {} }; j.forEach(function (x) { EMO.map[x[0]] = x[1]; }); return EMO; }).catch(function () { EMO = { base: "", list: [], map: {} }; return EMO; }); });
  }
  var EMO_RE = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*|[\u{1F1E6}-\u{1F1FF}]{2})/gu;
  function emoImg(ch, cls) {
    var k = EMO && (EMO.map[ch] || EMO.map[ch.replace(/\uFE0F/g, "")]);
    return k ? '<img class="e38 ' + (cls || "") + '" src="' + (EMO.img || EMO.base) + k + '.webp" alt="' + esc(ch) + '" draggable="false" loading="lazy">' : esc(ch);
  }
  function emoText(s) {
    var h = esc(s);
    if (!EMO || !EMO.list.length) return h;
    return h.replace(EMO_RE, function (m) { return emoImg(m); });
  }
  function onlyEmoji(s) { var t = String(s || "").replace(/\s/g, ""); if (!t || t.length > 24) return 0; var m = t.match(EMO_RE); return m && m.join("") === t ? m.length : 0; }
  function fmtText(s) {
    // *عريض* _مائل_ ~مشطوب~ + روابط + @منشن + إيموجي 3D
    var h = emoText(s);
    h = h.replace(/(^|\s)\*([^*\n]{1,200})\*(?=\s|$)/g, "$1<b>$2</b>").replace(/(^|\s)_([^_\n]{1,200})_(?=\s|$)/g, "$1<i>$2</i>").replace(/(^|\s)~([^~\n]{1,200})~(?=\s|$)/g, "$1<s>$2</s>");
    h = h.replace(/(https?:\/\/[^\s<]{3,300})/g, function (u) { return '<a class="c4lnk" data-u="' + u + '">' + u.replace(/^https?:\/\//, "").slice(0, 40) + "</a>"; });
    h = h.replace(/(^|\s)@(سعراتي|sorati)/gi, '$1<span class="c4men">@$2</span>');
    return h.replace(/\n/g, "<br>");
  }

  // ------------------------------------------------------------ api
  // the app's globals are lexical (const FB, let S) — reach them by name, not via window
  // no eval (CSP has no unsafe-eval): classic scripts share the global lexical scope, so typeof works
  function G(n) {
    try {
      switch (n) {
        case "FB": return typeof FB !== "undefined" ? FB : W.FB;
        case "S": return W.__c4appS ? W.__c4appS() : undefined;
        case "tier": return typeof tier !== "undefined" ? tier : W.tier;
        case "dkey": return typeof dkey !== "undefined" ? dkey : W.dkey;
        case "cur": return typeof cur !== "undefined" ? cur : W.cur;
        case "getDay": return typeof getDay !== "undefined" ? getDay : W.getDay;
        case "addItems18": return typeof addItems18 !== "undefined" ? addItems18 : W.addItems18;
        case "renderClub": return typeof renderClub !== "undefined" ? renderClub : W.renderClub;
        case "AI": return typeof AI !== "undefined" ? AI : W.AI;
      }
    } catch (e) {}
    return W[n];
  }
  function token() {
    var FB = G("FB") || W.FB;
    if (!FB) return Promise.resolve(null);
    var p = FB.token ? Promise.resolve(FB.token()).catch(function () {}) : Promise.resolve();
    return p.then(function () { return FB.tok && FB.user && FB.user.uid ? { tok: FB.tok, uid: FB.user.uid, name: FB.user.displayName || FB.user.name || null } : null; });
  }
  function api(op, body, timeout) {
    return token().then(function (t) {
      if (!t) { var e = new Error("سجّل دخول الأول عشان الشات"); e.code = "auth"; throw e; }
      S.uid = t.uid;
      var ac = W.AbortController ? new AbortController() : null;
      var to = setTimeout(function () { try { ac && ac.abort(); } catch (x) {} }, timeout || 15000);
      return fetch(API + op, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({}, body || {}, { idToken: t.tok })), signal: ac ? ac.signal : undefined })
        .then(function (r) { clearTimeout(to); return r.json().catch(function () { return { ok: false, error: "HTTP " + r.status }; }); },
          function () { clearTimeout(to); var e = new Error("مفيش نت دلوقتي"); e.code = "net"; throw e; })
        .then(function (j) { if (!j || j.ok === false) { var e = new Error(ERR[j && j.error] || (j && j.error) || "حصلت مشكلة"); e.code = j && j.error; e.j = j; throw e; } return j; });
    });
  }
  var ERR = {
    blocked: "الكلام ده مش مسموح في الشات 🙏 عدّله وجرّب تاني", admins_only: "الأدمنز بس اللي بيكتبوا هنا", slow_mode: "الجروب في الوضع البطيء، استنى شوية",
    sanctioned: "الشات موقوف عندك مؤقتًا بسبب مخالفة", rate_limited: "بالراحة شوية 😅", edit_window: "التعديل متاح أول 15 دقيقة بس", del_window: "عدّى وقت المسح عند الكل",
    bad_code: "الكود ده مش صحيح", kicked: "اتشلت من المحادثة دي", full: "المحادثة مليانة", closed: "المحادثة دي اتقفلت", already_opened: "الرسالة دي اتفتحت قبل كدا",
    file_blocked: "الملف ده مش مسموح", bad_poll: "التصويت محتاج سؤال واختيارين على الأقل", empty: "اكتب حاجة الأول", not_member: "انت مش عضو هنا", auth: "سجّل دخول الأول",
  };

  // ------------------------------------------------------------ plugin registry (chat4plus.js and later layers)
  var X = { kinds: {}, actions: {}, plus: [], memberOps: [], infoRows: [], newRows: [], listTop: [], onSent: [], who: [], bubbleTail: [] };
  // ------------------------------------------------------------ state + cache
  var S = { uid: null, rooms: ld("c4_rooms", []), room: null, msgs: {}, order: [], cursor: 0, votes: {}, reads: {}, typing: {}, ws: null, wsRoom: null, reply: null, edit: null, once: false, tab: ld("c4_tab", "all"), q: "", info: null, poll: null };
  function pruneCache() { try { Object.keys(localStorage).filter(function (k) { return k.indexOf("c4_m_") === 0; }).slice(0, 10).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} }
  function cacheMsgs() { if (!S.room) return; var list = S.order.slice(-150).map(function (id) { return S.msgs[id]; }).filter(Boolean); sv("c4_m_" + S.room.id, { c: S.cursor, m: list, v: S.votes }); }
  function outbox() { return ld("c4_out", []); }
  function setOut(o) { sv("c4_out", o.slice(-80)); }

  // ------------------------------------------------------------ styles
  function css() {
    if ($("#c4css")) return;
    var st = D.createElement("style"); st.id = "c4css";
    st.textContent = [
      "#c4{position:fixed;inset:0;z-index:9500;background:#06100c;color:#eafff6;display:none;font-family:inherit;direction:rtl;overflow:hidden;-webkit-tap-highlight-color:transparent}",
      "#c4.on{display:block}#c4 *{box-sizing:border-box}",
      "#c4 .ic38{display:block;flex:none}#c4 .e38{width:1.3em;height:1.3em;vertical-align:-.28em;display:inline-block;object-fit:contain}",
      "#c4 .msgs>*{flex:none}#c4 .lst>*{flex:none}",
      "#c4 .v{position:absolute;inset:0;display:flex;flex-direction:column;transition:transform .42s cubic-bezier(.32,.72,0,1),opacity .3s;background:radial-gradient(120% 70% at 50% -10%,#0d3a2a 0%,#06100c 60%)}",
      "#c4 .v.off{transform:translateX(-100%);pointer-events:none}#c4 #c4list.off{transform:translateX(30%);opacity:.0}",
      "#c4 .hd{padding:calc(env(safe-area-inset-top) + 10px) 14px 8px;display:flex;align-items:center;gap:10px;position:relative;z-index:3}",
      "#c4 .glass{background:rgba(12,24,19,.72);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);border:1px solid rgba(255,255,255,.07)}",
      "html.lite31 #c4 .glass,body.lite #c4 .glass{-webkit-backdrop-filter:none;backdrop-filter:none;background:#0d1a15}",
      "#c4 .ib{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#d9fff0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);transition:transform .25s cubic-bezier(.2,1.6,.4,1),background .2s;flex:none}",
      "#c4 .ib:active,#c4 .tap:active{transform:scale(.88)}",
      "#c4 .big{font-size:32px;font-weight:800;letter-spacing:-.5px;flex:1}",
      "#c4 .seg{display:flex;gap:6px;padding:0 14px 8px;overflow-x:auto;scrollbar-width:none}#c4 .seg::-webkit-scrollbar{display:none}",
      "#c4 .seg button{flex:none;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:#bfe9d8;font:inherit;font-size:14px}",
      "#c4 .seg button.on{background:linear-gradient(145deg,#19c58e,#0c8e66);color:#fff;border-color:transparent;box-shadow:0 6px 16px rgba(16,185,129,.3)}",
      "#c4 .srch{margin:0 14px 8px;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:14px;background:rgba(255,255,255,.06);color:#9fcfbd}",
      "#c4 .srch input{flex:1;background:transparent;border:0;outline:0;color:#eafff6;font:inherit;font-size:15px}",
      "#c4 .lst{flex:1;overflow-y:auto;padding:0 8px 120px;overscroll-behavior:contain}",
      "#c4 .row{display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:18px;transition:background .2s}#c4 .row:active{background:rgba(255,255,255,.05)}",
      "#c4 .av{width:52px;height:52px;border-radius:18px;flex:none;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#fff;position:relative;overflow:hidden}",
      "#c4 .av.sm{width:40px;height:40px;border-radius:14px;font-size:16px}#c4 .av .ic38{opacity:.95}",
      "#c4 .av i.on{position:absolute;bottom:3px;left:3px;width:12px;height:12px;border-radius:50%;background:#22e39b;border:2px solid #06100c}",
      "#c4 .rb{flex:1;min-width:0}#c4 .rt{display:flex;align-items:center;gap:6px}#c4 .rn{font-weight:700;font-size:16px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      "#c4 .rtm{font-size:12px;color:#86b6a3}#c4 .rl{font-size:14px;color:#9cc8b7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:4px;margin-top:2px}",
      "#c4 .ub{min-width:22px;height:22px;border-radius:11px;background:#19c58e;color:#04120c;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 6px}#c4 .ub.mute{background:#3b5249;color:#cde}",
      "#c4 .fab{position:absolute;bottom:calc(env(safe-area-inset-bottom) + 22px);left:20px;width:60px;height:60px;border-radius:22px;background:linear-gradient(145deg,#1fd69b,#0c8e66);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(16,185,129,.42);z-index:5;transition:transform .3s cubic-bezier(.2,1.6,.4,1)}",
      "#c4 .empty{text-align:center;color:#8fbfad;padding:60px 24px;line-height:1.9}#c4 .empty .e38{width:84px;height:84px;margin:0 auto 12px;display:block}",
      // chat
      "#c4 .ch .hd{border-bottom:1px solid rgba(255,255,255,.05)}#c4 .ttl{flex:1;min-width:0;text-align:start}#c4 .ttl b{display:block;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#c4 .ttl small{font-size:12.5px;color:#8fc4b0;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      "#c4 .ttl small.typ{color:#3ff0b0}",
      "#c4 .msgs{flex:1;overflow-y:auto;padding:10px 10px 14px;overscroll-behavior:contain;display:flex;flex-direction:column;gap:3px}",
      "#c4 .day{align-self:center;margin:10px 0 6px;padding:4px 12px;border-radius:10px;font-size:12px;color:#bfe;background:rgba(255,255,255,.07)}",
      "#c4 .sys{align-self:center;font-size:12.5px;color:#9fc9b8;background:rgba(255,255,255,.05);padding:5px 12px;border-radius:12px;margin:4px 0;text-align:center;max-width:86%}",
      "#c4 .b{max-width:82%;padding:8px 12px 6px;border-radius:20px;background:#13221c;border:1px solid rgba(255,255,255,.06);align-self:flex-start;position:relative;font-size:15.5px;line-height:1.65;word-wrap:break-word;animation:c4in .32s cubic-bezier(.2,1.2,.4,1);box-shadow:0 2px 6px rgba(0,0,0,.18)}",
      "#c4 .b.me{align-self:flex-end;background:linear-gradient(160deg,#10956b,#0b6f52);border-color:rgba(255,255,255,.08);color:#f2fff9}",
      "#c4 .b.tail:not(.me){border-start-start-radius:6px}#c4 .b.tail.me{border-start-end-radius:6px}",
      "#c4 .b.jumbo{background:transparent!important;border:0;box-shadow:none;padding:2px}#c4 .b.jumbo .e38{width:72px;height:72px;animation:c4pop .45s cubic-bezier(.2,1.8,.4,1)}",
      "#c4 .b .e38{width:1.35em;height:1.35em;vertical-align:-.3em}",
      "#c4 .b .who{font-size:12.5px;font-weight:800;margin-bottom:2px}",
      "#c4 .b .mt{font-size:11px;opacity:.72;display:flex;gap:4px;align-items:center;justify-content:flex-end;margin-top:2px}#c4 .b .mt .ic38{width:15px;height:15px}#c4 .b .mt .rd{color:#7ff3ff}",
      "#c4 .b .q{border-inline-start:3px solid #3ff0b0;background:rgba(0,0,0,.18);border-radius:10px;padding:5px 8px;margin-bottom:5px;font-size:13px;opacity:.9;max-height:48px;overflow:hidden}",
      "#c4 .b.del{font-style:italic;opacity:.65}",
      "#c4 .b .img{display:block;max-width:240px;width:100%;border-radius:14px;margin:-2px -4px 4px;min-height:80px;background:rgba(255,255,255,.05);object-fit:cover}",
      "#c4 .rx{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}#c4 .rx span{background:rgba(0,0,0,.25);border-radius:12px;padding:1px 7px;font-size:12px;display:flex;align-items:center;gap:3px}#c4 .rx .e38{width:18px;height:18px}#c4 .rx span.mine{outline:1px solid #3ff0b0}",
      "#c4 .pl{min-width:240px}#c4 .pl h4{margin:0 0 8px;font-size:15.5px}#c4 .po{position:relative;border-radius:12px;background:rgba(0,0,0,.22);margin:5px 0;padding:8px 10px;display:flex;justify-content:space-between;overflow:hidden}#c4 .po i{position:absolute;inset:0;background:rgba(25,197,142,.28);transform-origin:right;transition:transform .6s cubic-bezier(.2,1,.3,1)}#c4 .po span{position:relative}#c4 .po.my{outline:1.5px solid #3ff0b0}",
      "#c4 .ml{min-width:250px}#c4 .ml .kc{font-size:22px;font-weight:900;color:#ffd166}#c4 .ml .mc{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}#c4 .ml .mc div{background:rgba(0,0,0,.22);border-radius:12px;padding:6px;text-align:center;font-size:12px}#c4 .ml .mc b{display:block;font-size:15px}",
      "#c4 .gold{display:block;width:100%;border:0;border-radius:14px;padding:10px;font:inherit;font-weight:800;background:linear-gradient(135deg,#f6d77b,#c9962e);color:#2a1c00}",
      "#c4 .vc{display:flex;align-items:center;gap:10px;min-width:220px}#c4 .vc .pb{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}#c4 .wv{flex:1;display:flex;gap:2px;align-items:center;height:28px}#c4 .wv i{flex:1;background:currentColor;opacity:.55;border-radius:2px;min-height:3px}#c4 .wv i.p{opacity:1}",
      "#c4 .once{display:flex;align-items:center;gap:8px;padding:6px 4px;font-weight:700}",
      "#c4 .pill{align-self:center;margin:6px 0 8px;padding:7px 14px;border-radius:14px;font-size:13.5px;color:#ffe9a8;background:rgba(246,215,123,.12);border:1px solid rgba(246,215,123,.3);display:flex;gap:6px;align-items:center}",
      "#c4 .cmp{padding:6px 8px calc(env(safe-area-inset-bottom) + 8px);display:flex;flex-direction:column;gap:6px;position:relative;z-index:3}",
      "#c4 .chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:0 2px}#c4 .chips::-webkit-scrollbar{display:none}#c4 .chips button{flex:none;border-radius:999px;padding:6px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#d6fbe9;font:inherit;font-size:13.5px;display:flex;gap:4px;align-items:center}#c4 .chips .e38{width:18px;height:18px}",
      "#c4 .bar{display:flex;align-items:flex-end;gap:6px}#c4 .in{flex:1;display:flex;align-items:flex-end;gap:2px;border-radius:24px;padding:4px 6px;min-height:48px}",
      "#c4 .in textarea{flex:1;resize:none;border:0;outline:0;background:transparent;color:#eafff6;font:inherit;font-size:16px;line-height:1.5;padding:9px 4px;max-height:130px}",
      "#c4 .in .ib{width:38px;height:38px;border:0;background:transparent}",
      "#c4 .snd{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#1fd69b,#0c8e66);color:#fff;box-shadow:0 8px 22px rgba(16,185,129,.38);transition:transform .25s cubic-bezier(.2,1.6,.4,1);touch-action:none}",
      "#c4 .snd.rec{background:linear-gradient(145deg,#ff5d6c,#d61f45);transform:scale(1.18);box-shadow:0 0 0 10px rgba(255,93,108,.18)}",
      "#c4 .ctx{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:14px;font-size:13.5px;background:rgba(255,255,255,.06)}#c4 .ctx div{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      "#c4 .recb{display:flex;align-items:center;gap:10px;color:#ffb3bb;font-weight:700;padding:6px 12px}#c4 .recb i{width:10px;height:10px;border-radius:50%;background:#ff4d63;animation:c4bl 1s infinite}",
      // sheets
      "#c4 .sh{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(0,0,0,.45);animation:c4fd .25s}",
      "#c4 .shb{border-radius:28px 28px 0 0;padding:10px 16px calc(env(safe-area-inset-bottom) + 18px);max-height:86%;overflow-y:auto;animation:c4up .42s cubic-bezier(.32,.72,0,1);background:rgba(16,30,24,.94)}",
      "#c4 .grab{width:40px;height:5px;border-radius:3px;background:rgba(255,255,255,.25);margin:0 auto 12px}",
      "#c4 .shb h3{margin:0 0 12px;font-size:19px}#c4 .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 8px}",
      "#c4 .gi{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12.5px;color:#d5f5e8;text-align:center}#c4 .gi span{width:58px;height:58px;border-radius:20px;display:flex;align-items:center;justify-content:center;color:#fff}",
      "#c4 .li{display:flex;align-items:center;gap:12px;padding:12px 6px;border-bottom:1px solid rgba(255,255,255,.06);font-size:15.5px}#c4 .li:last-child{border-bottom:0}#c4 .li .ic38{color:#7fe8c1}#c4 .li.red,#c4 .li.red .ic38{color:#ff7a88}#c4 .li em{margin-inline-start:auto;font-style:normal;color:#8fbfad;font-size:13px}",
      "#c4 .fld{width:100%;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.25);color:#eafff6;font:inherit;font-size:16px;margin:6px 0;outline:0}",
      "#c4 .btn{display:block;width:100%;padding:13px;border:0;border-radius:16px;font:inherit;font-size:16px;font-weight:800;color:#fff;background:linear-gradient(145deg,#1fd69b,#0c8e66);margin-top:10px}#c4 .btn.g{background:rgba(255,255,255,.08)}",
      "#c4 .rxbar{display:flex;justify-content:space-between;padding:8px 6px 14px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:6px}#c4 .rxbar button{background:transparent;border:0;padding:4px;transition:transform .2s cubic-bezier(.2,1.8,.4,1)}#c4 .rxbar button:active{transform:scale(1.35)}#c4 .rxbar .e38{width:36px;height:36px}",
      "#c4 .ep{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;max-height:280px;overflow-y:auto}#c4 .ep button{background:transparent;border:0;padding:4px;border-radius:10px}#c4 .ep button:active{background:rgba(255,255,255,.1)}#c4 .ep .e38{width:32px;height:32px}",
      "#c4 .epc{display:flex;gap:4px;overflow-x:auto;margin-bottom:8px}#c4 .epc button{flex:none;background:rgba(255,255,255,.06);border:0;border-radius:10px;padding:6px 10px;color:#cfe;font:inherit;font-size:12.5px}#c4 .epc button.on{background:#19c58e;color:#03140d}",
      "#c4 .mem{display:flex;align-items:center;gap:10px;padding:8px 2px}#c4 .mem b{flex:1}#c4 .mem small{color:#8fbfad}",
      "#c4 .tg{width:50px;height:30px;border-radius:15px;background:#2b3f37;position:relative;transition:background .25s;flex:none;margin-inline-start:auto}#c4 .tg::after{content:'';position:absolute;top:3px;right:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .3s cubic-bezier(.2,1.4,.4,1);box-shadow:0 2px 6px rgba(0,0,0,.3)}#c4 .tg.on{background:#19c58e}#c4 .tg.on::after{transform:translateX(-20px)}",
      "#c4 .hl{background:rgba(255,209,102,.35)!important}#c4 .b.flash{animation:c4fl 1.2s}",
      "#c4 .c4lnk{color:#8ff5ff;text-decoration:underline;cursor:pointer}#c4 .c4men{color:#ffd166;font-weight:700}",
      "@keyframes c4in{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}@keyframes c4pop{0%{transform:scale(.3)}70%{transform:scale(1.15)}100%{transform:scale(1)}}",
      "@keyframes c4up{from{transform:translateY(100%)}to{transform:none}}@keyframes c4fd{from{opacity:0}to{opacity:1}}@keyframes c4bl{50%{opacity:.2}}@keyframes c4fl{0%,60%{background:rgba(255,209,102,.35)}}",
      "html.lite31 #c4 .b,body.lite #c4 .b{animation:none}",
      ".c4entry{display:flex;align-items:center;gap:12px;padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(25,197,142,.18),rgba(12,142,102,.08));border:1px solid rgba(63,240,176,.25);margin:0 0 12px;cursor:pointer}",
      ".c4entry .ico{width:46px;height:46px;border-radius:16px;background:linear-gradient(145deg,#1fd69b,#0c8e66);display:flex;align-items:center;justify-content:center;color:#fff;flex:none}.c4entry b{display:block;font-size:16px}.c4entry small{opacity:.75}.c4entry .ub{margin-inline-start:auto;min-width:24px;height:24px;border-radius:12px;background:#19c58e;color:#04120c;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:12px;padding:0 6px}",
    ].join("");
    D.head.appendChild(st);
  }

  // ------------------------------------------------------------ shell
  function mount() {
    if ($("#c4")) return;
    css();
    var r = D.createElement("div"); r.id = "c4";
    r.innerHTML =
      '<section class="v" id="c4list">' +
        '<div class="hd"><button class="ib tap" data-a="close" aria-label="رجوع">' + ic("back", 22) + '</button><div class="big">الشات</div>' +
        '<button class="ib tap" data-a="newsheet" aria-label="جديد">' + ic("edit", 21) + '</button></div>' +
        '<label class="srch">' + ic("search", 18) + '<input id="c4q" placeholder="دوّر في المحادثات" autocomplete="off"></label>' +
        '<div class="seg" id="c4seg"></div><div class="lst" id="c4rows"></div>' +
        '<button class="fab tap" data-a="newsheet" aria-label="محادثة جديدة">' + ic("add", 30) + '</button>' +
      '</section>' +
      '<section class="v ch off" id="c4chat">' +
        '<div class="hd glass"><button class="ib tap" data-a="back" aria-label="رجوع">' + ic("back", 22) + '</button>' +
          '<div class="av sm" id="c4hav"></div><div class="ttl tap" data-a="info"><b id="c4hn"></b><small id="c4hs"></small></div>' +
          '<button class="ib tap" data-a="find" aria-label="بحث">' + ic("search", 20) + '</button>' +
          '<button class="ib tap" data-a="call" aria-label="مكالمة">' + ic("call", 20) + '</button></div>' +
        '<div class="msgs" id="c4msgs"></div>' +
        '<div class="cmp glass" id="c4cmp"><div id="c4ctx"></div><div class="chips" id="c4chips"></div>' +
          '<div class="bar"><div class="in glass"><button class="ib tap" data-a="emoji" aria-label="إيموجي">' + ic("happy", 24) + '</button>' +
          '<textarea id="c4in" rows="1" placeholder="اكتب أو قول أكلت إيه…"></textarea>' +
          '<button class="ib tap" data-a="assist" id="c4as" style="display:none" aria-label="مساعد الكتابة">' + ic("wand", 22) + '</button>' +
          '<button class="ib tap" data-a="plus" aria-label="إضافة">' + ic("addc", 26) + '</button></div>' +
          '<button class="snd" id="c4snd" aria-label="تسجيل">' + ic("mic", 24) + '</button></div></div>' +
      '</section>';
    D.body.appendChild(r);
    r.addEventListener("click", onClick);
    var q = $("#c4q"); q.addEventListener("input", function () { S.q = q.value.trim(); renderList(); });
    var inp = $("#c4in");
    inp.addEventListener("input", function () { autoGrow(); updSend(); typingPing(); draft(); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !("ontouchstart" in W)) { e.preventDefault(); send(); } });
    bindSend();
    bindLong($("#c4msgs"));
    W.addEventListener("online", flushOut);
    W.addEventListener("popstate", function () { if (r.classList.contains("on") && !location.hash.match(/c4/)) { if (S.room) back(true); else close(true); } });
  }
  function autoGrow() { var t = $("#c4in"); t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 130) + "px"; }
  function updSend() { var has = $("#c4in").value.trim().length > 0 || S.edit; var as = $("#c4as"); if (as) as.style.display = $("#c4in").value.trim().length > 3 ? "" : "none"; $("#c4snd").innerHTML = ic(has ? "send" : "mic", 24); $("#c4snd").setAttribute("aria-label", has ? "إرسال" : "تسجيل"); }
  function draft() { if (S.room) sv("c4_d_" + S.room.id, $("#c4in").value.slice(0, 2000)); }

  // ------------------------------------------------------------ open / close
  function open(roomId) {
    if (!FLAG()) { say("الشات الجديد مقفول حاليًا"); return; }
    mount();
    var r = $("#c4"); r.classList.add("on");
    try { history.pushState({ c4: 1 }, "", "#c4"); } catch (e) {}
    loadEmo().then(function () { renderList(); if (S.room) renderMsgs(); });
    renderList(); refreshRooms();
    clearInterval(S.lt); S.lt = setInterval(function () { if (!S.room) refreshRooms(); }, 20000);
    if (roomId) openRoom(roomId);
  }
  function close(fromPop) {
    var r = $("#c4"); if (!r) return;
    r.classList.remove("on"); wsClose(); clearInterval(S.lt); clearInterval(S.pt); S.room = null;
    $("#c4chat").classList.add("off"); $("#c4list").classList.remove("off");
    if (!fromPop) try { if (location.hash.indexOf("c4") >= 0) history.back(); } catch (e) {}
    badge();
  }

  // ------------------------------------------------------------ list
  var TABS = [["all", "الكل"], ["unread", "غير مقروء"], ["dm", "خاص"], ["group", "جروبات"], ["channel", "قنوات"], ["community", "مجتمعات"]];
  function refreshRooms() {
    return api("/me", { name: myName(), tier: myTier() }).then(function (j) { S.rooms = j.rooms || []; sv("c4_rooms", S.rooms); renderList(); badge(); flushOut(); return j; })
      .catch(function (e) { if (e.code === "auth") renderList(e.message); });
  }
  function myName() { try { var AS = G("S"), F = G("FB"); var p = AS && (AS.prof || AS.profile || AS.p); return (p && (p.name || p.n)) || (AS && AS.name) || (F && F.user && F.user.displayName) || null; } catch (e) { return null; } }
  function myTier() { try { var t = G("tier"); if (typeof t === "function") return t(); } catch (e) {} return "free"; }
  function avHtml(r, sm) {
    var n = r.name || (r.peer && r.peer.name) || "؟";
    var icn = r.type === "channel" ? "mega" : r.type === "community" ? "people" : null;
    var h = hue(r.id);
    var on = r.peer && r.peer.seen && now() - r.peer.seen < 3 * 60e3 ? '<i class="on"></i>' : "";
    return '<div class="av' + (sm ? " sm" : "") + '" style="background:linear-gradient(145deg,hsl(' + h + ',62%,42%),hsl(' + ((h + 40) % 360) + ',70%,28%))">' + (icn ? ic(icn, sm ? 20 : 26) : esc(n.trim().charAt(0) || "؟")) + on + "</div>";
  }
  function renderList(msg) {
    var seg = $("#c4seg"); if (!seg) return;
    seg.innerHTML = TABS.map(function (t) { return '<button class="tap' + (S.tab === t[0] ? " on" : "") + '" data-a="tab" data-v="' + t[0] + '">' + t[1] + "</button>"; }).join("");
    var rows = S.rooms.filter(function (r) {
      if (S.tab === "unread" && !r.unread) return false;
      if (["dm", "group", "channel", "community"].indexOf(S.tab) >= 0 && r.type !== S.tab) return false;
      if (S.q && (r.name || "").indexOf(S.q) < 0 && (r.lastTxt || "").indexOf(S.q) < 0) return false;
      return true;
    });
    var out = outbox();
    var box = $("#c4rows");
    if (msg) { box.innerHTML = '<div class="empty">' + emoImg("🔐") + esc(msg) + "</div>"; return; }
    if (!rows.length) {
      box.innerHTML = '<div class="empty">' + emoImg(S.q ? "🔍" : "💬") + (S.q ? "مفيش نتايج" : "لسه مفيش محادثات.<br>ابدأ محادثة مع صاحبك أو اعمل جروب تحدي 💪") +
        (S.q ? "" : '<button class="btn tap" data-a="newsheet">ابدأ محادثة</button>') + "</div>";
      return;
    }
    var top = X.listTop.map(function (f) { try { return f() || ""; } catch (e) { return ""; } }).join("");
    box.innerHTML = top + rows.map(function (r) {
      var pend = out.filter(function (o) { return o.room === r.id; }).length;
      var muted = r.muteUntil > now();
      var nm = r.name || (r.peer && r.peer.name) || "محادثة";
      return '<div class="row tap" data-a="room" data-v="' + esc(r.id) + '">' + avHtml(r) + '<div class="rb"><div class="rt"><span class="rn">' + emoText(nm) + "</span>" +
        (muted ? ic("belloff", 14) : "") + '<span class="rtm">' + fmtList(r.lastAt) + "</span></div>" +
        '<div class="rl">' + (pend ? ic("time", 14) : "") + '<span style="flex:1;overflow:hidden;text-overflow:ellipsis">' + emoText(r.lastTxt || (r.type === "channel" ? "قناة" : "")) + "</span>" +
        (r.unread ? '<span class="ub' + (muted ? " mute" : "") + '">' + (r.unread > 99 ? "99+" : r.unread) + "</span>" : "") + "</div></div></div>";
    }).join("");
  }
  function badge() {
    var n = S.rooms.reduce(function (a, r) { return a + (r.muteUntil > now() ? 0 : r.unread || 0); }, 0);
    W.C4.unread = n;
    $$(".c4entry .ub").forEach(function (b) { b.textContent = n > 99 ? "99+" : n; b.style.display = n ? "" : "none"; });
  }

  // ------------------------------------------------------------ room
  function roomById(id) { return S.rooms.filter(function (r) { return r.id === id; })[0]; }
  function openRoom(id) {
    var r = roomById(id) || { id: id, name: "محادثة", type: "group" };
    S.room = r; S.msgs = {}; S.order = []; S.cursor = 0; S.votes = {}; S.reads = {}; S.typing = {}; S.reply = null; S.edit = null; S.once = false;
    var c = ld("c4_m_" + id, null);
    if (c && c.m) { c.m.forEach(function (m) { S.msgs[m.id] = m; S.order.push(m.id); }); S.cursor = c.c || 0; S.votes = c.v || {}; }
    pendingInto();
    $("#c4list").classList.add("off"); $("#c4chat").classList.remove("off");
    head(); ctxBar(); chips();
    var d = ld("c4_d_" + id, ""); $("#c4in").value = d || ""; autoGrow(); updSend();
    renderMsgs(true);
    S.info = ld("c4_i_" + id, null);
    api("/room/info", { room: id }).then(function (j) { if (S.room && S.room.id === id) { S.info = j; sv("c4_i_" + id, { members: (j.members || []).slice(0, 300).map(function (m) { return { uid: m.uid, name: m.name, nick: m.nick, role: m.role }; }) }); renderMsgs(nearBottom()); } }).catch(function () {});
    sync(true).then(function () { markRead(); });
    wsOpen(id);
    clearInterval(S.pt); S.pt = setInterval(function () { if (!S.ws || S.ws.readyState !== 1) sync(); }, 4000);
    hap(6);
  }
  function back(fromPop) {
    wsClose(); clearInterval(S.pt); cacheMsgs(); S.room = null;
    $("#c4chat").classList.add("off"); $("#c4list").classList.remove("off");
    refreshRooms(); if (!fromPop) hap(5);
  }
  function head() {
    var r = S.room; if (!r) return;
    $("#c4hav").outerHTML = avHtml(r, true).replace('class="av sm"', 'class="av sm" id="c4hav"');
    $("#c4hn").innerHTML = emoText(r.name || (r.peer && r.peer.name) || "محادثة");
    sub();
  }
  function sub() {
    var r = S.room; if (!r) return; var s = $("#c4hs");
    var ty = Object.keys(S.typing).filter(function (u) { return now() - S.typing[u].at < 5000; });
    if (ty.length) { s.className = "typ"; s.textContent = (S.typing[ty[0]].rec ? "بيسجّل صوت…" : "بيكتب…"); return; }
    s.className = "";
    var bits = [];
    if (r.type === "dm") bits.push(r.peer && r.peer.seen ? (now() - r.peer.seen < 3 * 60e3 ? "متصل دلوقتي" : "آخر ظهور " + fmtList(r.peer.seen)) : "محادثة خاصة");
    else bits.push((r.n || 1) + (r.type === "channel" ? " متابع" : " عضو"));
    if (r.ttl) bits.push("⏱ رسايل مؤقتة");
    if (r.slow) bits.push("🐢 وضع بطيء");
    s.textContent = bits.join(" · ");
  }
  function pendingInto() {
    outbox().filter(function (o) { return S.room && o.room === S.room.id; }).forEach(function (o) {
      if (S.msgs["p_" + o.cid]) return;
      S.msgs["p_" + o.cid] = { id: "p_" + o.cid, cid: o.cid, uid: S.uid, kind: o.body.kind || "text", text: o.body.text, meta: o.body.meta || null, at: o.at, pending: 1, reacts: {} };
      S.order.push("p_" + o.cid);
    });
  }

  // ------------------------------------------------------------ sync + live
  function merge(list) {
    list.forEach(function (m) {
      if (m.cid && S.msgs["p_" + m.cid]) { delete S.msgs["p_" + m.cid]; S.order = S.order.filter(function (x) { return x !== "p_" + m.cid; }); }
      if (!S.msgs[m.id]) S.order.push(m.id);
      S.msgs[m.id] = m;
    });
    S.order.sort(function (a, b) { return (S.msgs[a].at || 0) - (S.msgs[b].at || 0); });
  }
  function sync(first) {
    if (!S.room) return Promise.resolve();
    var room = S.room.id;
    return api("/sync", { room: room, since: first ? 0 : S.cursor, limit: first ? 120 : 100 }).then(function (j) {
      if (!S.room || S.room.id !== room) return;
      var atBottom = nearBottom();
      merge(j.msgs || []);
      Object.keys(j.votes || {}).forEach(function (k) { S.votes[k] = j.votes[k]; });
      S.reads = j.reads || S.reads; S.cursor = Math.max(S.cursor, j.cursor || 0);
      if (j.room) { var me = S.room.peer; S.room = Object.assign({}, S.room, j.room); if (me) S.room.peer = me; head(); }
      if ((j.msgs || []).length || first) { renderMsgs(atBottom || first); cacheMsgs(); }
      if ((j.msgs || []).some(function (m) { return m.uid !== S.uid; }) && !first) { markRead(); ding(); }
    }).catch(function (e) { if (e.code === "not_member" || e.code === "no_room") { say(e.message); back(); } });
  }
  function nearBottom() { var b = $("#c4msgs"); return !b || b.scrollHeight - b.scrollTop - b.clientHeight < 160; }
  var readT = 0;
  function markRead() { if (!S.room || D.hidden) return; clearTimeout(readT); readT = setTimeout(function () { api("/read", { room: S.room.id }).catch(function () {}); var r = roomById(S.room.id); if (r) r.unread = 0; }, 600); }
  function wsOpen(room) {
    wsClose();
    if (!W.WebSocket) return;
    api("/ticket", { room: room }).then(function (j) {
      if (!S.room || S.room.id !== room) return;
      var ws = new WebSocket(API.replace(/^http/, "ws") + "/ws?room=" + encodeURIComponent(room) + "&t=" + encodeURIComponent(j.t));
      S.ws = ws; S.wsRoom = room;
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (x) { return; }
        if (m.t === "msg" || m.t === "upd") { clearTimeout(S.st); S.st = setTimeout(sync, 120); }
        else if (m.t === "read") { S.reads[m.uid] = m.at; renderTicks(); }
        else if (m.t === "typing" || m.t === "rec") { S.typing[m.uid] = { at: now(), rec: m.t === "rec" }; sub(); setTimeout(sub, 5200); }
        else if (m.t === "rtc" && W.C4RTC) W.C4RTC.signal(m);
      };
      ws.onclose = function () { if (S.ws === ws) { S.ws = null; setTimeout(function () { if (S.room && S.room.id === room && !S.ws) wsOpen(room); }, 5000); } };
      clearInterval(S.hb); S.hb = setInterval(function () { try { ws.readyState === 1 && ws.send('{"t":"ping"}'); } catch (x) {} }, 25000);
    }).catch(function () {});
  }
  function wsClose() { clearInterval(S.hb); var ws = S.ws; S.ws = null; try { ws && ws.close(); } catch (e) {} }
  var lastTyp = 0;
  function typingPing(rec) { if (!S.ws || S.ws.readyState !== 1 || now() - lastTyp < 2500) return; lastTyp = now(); try { S.ws.send(JSON.stringify({ t: rec ? "rec" : "typing" })); } catch (e) {} }
  function wsSend(o) { try { if (S.ws && S.ws.readyState === 1) { S.ws.send(JSON.stringify(o)); return true; } } catch (e) {} return false; }
  var AC = null;
  function ding() { try { if (LITE() || ld("c4_snd", 1) === 0) return; AC = AC || new (W.AudioContext || W.webkitAudioContext)(); var o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.setValueAtTime(880, AC.currentTime); o.frequency.exponentialRampToValueAtTime(1320, AC.currentTime + .08); g.gain.setValueAtTime(.0001, AC.currentTime); g.gain.exponentialRampToValueAtTime(.08, AC.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + .25); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + .26); } catch (e) {} }

  // ------------------------------------------------------------ render messages
  var mediaCache = {};
  function memberName(uid) { if (uid === "bot:sorati") return "🤖 سعراتي"; if (uid === S.uid) return "انت"; var m = S.info && S.info.members && S.info.members.filter(function (x) { return x.uid === uid; })[0]; return (m && (m.nick || m.name)) || "عضو " + shortId(uid).slice(-4); }
  function renderMsgs(scroll) {
    var box = $("#c4msgs"); if (!box || !S.room) return;
    var r = S.room, h = [], lastDay = "", prev = null;
    var unread = (roomById(r.id) || {}).unread || 0;
    if (unread >= 10) h.push('<button class="pill tap" data-a="summary">' + emoImg("✨") + " فاتك " + unread + " رسالة · اضغط للملخص</button>");
    if (!S.order.length) h.push('<div class="empty">' + emoImg("👋") + "ابدأ الكلام…<br><small>الرسايل محمية بحارس سعراتي ضد الإساءة</small></div>");
    S.order.forEach(function (id) {
      var m = S.msgs[id]; if (!m) return;
      if (m.thread) return; // threads show inside the root
      var day = new Date(m.at).toDateString();
      if (day !== lastDay) { h.push('<div class="day">' + fmtDay(m.at) + "</div>"); lastDay = day; prev = null; }
      if (m.kind === "sys") { h.push('<div class="sys">' + emoText(sysTxt(m)) + "</div>"); prev = null; return; }
      h.push(bubble(m, !prev || prev.uid !== m.uid || m.at - prev.at > 5 * 60e3));
      prev = m;
    });
    box.innerHTML = h.join("");
    hydrateMedia(box);
    if (scroll) box.scrollTop = box.scrollHeight;
  }
  function sysTxt(m) { var w = m.meta && m.meta.who ? memberName(m.meta.who) + " " : ""; return (m.text === "انضم للمحادثة" || m.text === "غادر المحادثة" ? w : "") + (m.text || ""); }
  function tick(m) {
    if (m.uid !== S.uid) return "";
    if (m.pending) return ic("time", 14);
    var others = Object.keys(S.reads || {}).filter(function (u) { return u !== S.uid; });
    var read = others.length && others.every(function (u) { return S.reads[u] >= m.at; });
    return '<span class="' + (read ? "rd" : "") + '">' + ic(others.length && others.some(function (u) { return S.reads[u] >= m.at; }) || read ? "checks" : "check", 15) + "</span>";
  }
  function renderTicks() { if (S.room) renderMsgs(nearBottom()); }
  function bubble(m, tail) {
    var me = m.uid === S.uid, cls = "b tap" + (me ? " me" : "") + (tail ? " tail" : "");
    var inner = "";
    if (m.deleted) return '<div class="' + cls + ' del" data-id="' + esc(m.id) + '">' + ic("trash", 14) + " الرسالة دي اتمسحت</div>";
    var jumbo = m.kind === "text" && onlyEmoji(m.text);
    if (jumbo && jumbo <= 3) cls += " jumbo";
    if (m.kind === "sticker") cls += " sticker";
    if (!me && tail && (S.room.type !== "dm" || /^bot:/.test(m.uid) || (m.meta && m.meta.via))) inner += '<div class="who" style="color:hsl(' + hue(m.uid) + ',75%,68%)">' + esc(memberName(m.uid)) + X.who.map(function (f) { try { return f(m) || ""; } catch (e) { return ""; } }).join("") + "</div>";
    if (m.reply && S.msgs[m.reply]) { var q = S.msgs[m.reply]; inner += '<div class="q" data-a="jump" data-v="' + esc(q.id) + '"><b>' + esc(memberName(q.uid)) + "</b><br>" + emoText(preview(q)) + "</div>"; }
    if (m.once && !me) {
      inner += m.opened ? '<div class="once">' + ic("eyeoff", 20) + " اتفتحت مرة واحدة</div>" : '<div class="once tap" data-a="openonce" data-v="' + esc(m.id) + '">' + ic("timer", 20) + " " + (m.kind === "voice" ? "رسالة صوتية" : "صورة") + " · تتشاف مرة واحدة</div>";
    } else if (m.kind === "img" || m.kind === "sticker") inner += '<img class="img" data-mid="' + esc(m.media || "") + '" alt="صورة">' + (m.text ? fmtText(m.text) : "") + (m.once ? '<div class="once">' + ic("timer", 16) + " مرة واحدة · اتفتحت " + (m.openedBy || 0) + "</div>" : "");
    else if (X.kinds[m.kind]) inner += X.kinds[m.kind](m, me);
    else if (m.kind === "voice") inner += voice(m);
    else if (m.kind === "poll") inner += poll(m);
    else if (m.kind === "meal") inner += meal(m);
    else if (m.kind === "challenge") inner += chal(m);
    else if (m.kind === "checkin") inner += '<div class="once">' + emoImg("💪") + " " + emoText(m.text || "+1 التزام") + "</div>";
    else if (m.kind === "loc") inner += '<div class="once tap" data-a="loc" data-v="' + esc(m.id) + '">' + ic("loc", 20) + " " + emoText(m.text || "موقعي") + "</div>";
    else if (m.kind === "file" || m.kind === "video") inner += '<div class="once tap" data-a="file" data-v="' + esc(m.id) + '">' + ic(m.kind === "video" ? "video" : "doc", 20) + " " + esc((m.meta && m.meta.name) || "ملف") + "</div>";
    else inner += fmtText(m.text || "");
    X.bubbleTail.forEach(function (f) { try { inner += f(m, me) || ""; } catch (e) {} });
    var th = threadCount(m.id);
    if (th) inner += '<div class="q tap" data-a="thread" data-v="' + esc(m.id) + '">' + ic("thread", 14) + " " + th + " رد في الخيط</div>";
    var rx = m.reacts || {}, rk = Object.keys(rx);
    if (rk.length) inner += '<div class="rx">' + rk.map(function (e) { return '<span class="tap' + (rx[e].indexOf(S.uid) >= 0 ? " mine" : "") + '" data-a="react" data-v="' + esc(e) + '" data-id="' + esc(m.id) + '">' + emoImg(e) + rx[e].length + "</span>"; }).join("") + "</div>";
    inner += '<div class="mt">' + (m.pinned ? ic("pin", 12) : "") + (m.edited ? "اتعدّلت · " : "") + (m.flag && m.flag !== "reported" ? ic("shield", 12) : "") + fmtT(m.at) + tick(m) + "</div>";
    return '<div class="' + cls + '" data-id="' + esc(m.id) + '">' + inner + "</div>";
  }
  function preview(m) {
    var L = { img: "📷 صورة", voice: "🎤 رسالة صوتية", poll: "📊 " + (m.text || "تصويت"), meal: "🍽️ " + (m.text || "وجبة"), challenge: "🏆 تحدي", loc: "📍 موقع", file: "📎 ملف", checkin: "💪 التزام", sticker: "ستيكر" };
    return m.deleted ? "رسالة اتمسحت" : L[m.kind] || String(m.text || "").slice(0, 90);
  }
  function threadCount(id) { var n = 0; for (var k in S.msgs) if (S.msgs[k].thread === id && !S.msgs[k].deleted) n++; return n; }
  function poll(m) {
    var opts = (m.meta && m.meta.opts) || [], v = S.votes[m.id] || {}, tot = 0, mine = -1;
    opts.forEach(function (_, i) { var l = v[i] || []; tot += l.length; if (l.indexOf(S.uid) >= 0) mine = i; });
    return '<div class="pl"><h4>' + emoImg("📊") + " " + emoText(m.text) + "</h4>" + opts.map(function (o, i) {
      var c = (v[i] || []).length, pct = tot ? Math.round(c * 100 / tot) : 0;
      return '<div class="po tap' + (mine === i || (v[i] || []).indexOf(S.uid) >= 0 ? " my" : "") + '" data-a="vote" data-id="' + esc(m.id) + '" data-v="' + i + '"><i style="transform:scaleX(' + pct / 100 + ')"></i><span>' + emoText(o) + "</span><span>" + pct + "%</span></div>";
    }).join("") + '<div class="mt" style="justify-content:flex-start">' + tot + " صوت" + (m.meta && m.meta.multi ? " · اختيار متعدد" : "") + "</div></div>";
  }
  function meal(m) {
    var x = m.meta || {};
    return '<div class="ml">' + (m.media ? '<img class="img" data-mid="' + esc(m.media) + '" alt="الوجبة">' : "") + '<div style="display:flex;justify-content:space-between;align-items:center"><b>' + emoText(m.text || "وجبة") + '</b><span class="kc">' + (Math.round(x.kcal) || 0) + ' <small style="font-size:13px">سعر</small></span></div>' +
      (x.items && x.items.length ? '<div style="font-size:13px;opacity:.8">' + emoText(x.items.slice(0, 6).join("، ")) + "</div>" : "") +
      '<div class="mc"><div><b>' + (Math.round(x.p) || 0) + "g</b>بروتين</div><div><b>" + (Math.round(x.c) || 0) + "g</b>كارب</div><div><b>" + (Math.round(x.f) || 0) + "g</b>دهون</div></div>" +
      (m.uid !== S.uid ? '<button class="gold tap" data-a="logmeal" data-v="' + esc(m.id) + '">سجّلها عندي بضغطة</button>' : "") + "</div>";
  }
  function chal(m) {
    var x = m.meta || {};
    return '<div class="ml"><b>' + emoImg("🏆") + " " + emoText(m.text || "تحدي") + '</b><div style="font-size:13px;opacity:.85;margin:6px 0">' + esc(x.goal || "") + (x.days ? " · " + x.days + " يوم" : "") + "</div>" +
      '<button class="gold tap" data-a="checkin">' + "سجّل التزامي النهارده" + "</button></div>";
  }
  function voice(m) {
    var w = (m.meta && m.meta.wave) || [], dur = (m.meta && m.meta.dur) || 0;
    var bars = (w.length ? w : Array.apply(null, Array(28)).map(function (_, i) { return 3 + ((i * 7) % 11); })).slice(0, 32).map(function (v) { return '<i style="height:' + Math.max(3, Math.min(28, v)) + 'px"></i>'; }).join("");
    return '<div class="vc"><span class="pb tap" data-a="play" data-v="' + esc(m.id) + '">' + ic("play", 18) + '</span><div class="wv">' + bars + "</div><small>" + fmtDur(dur) + "</small></div>" +
      (m.meta && m.meta.tx ? '<div class="q" style="margin-top:6px">«' + emoText(m.meta.tx) + "»</div>" : "");
  }
  var fmtDur = function (s) { s = Math.round(s || 0); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); };

  // ------------------------------------------------------------ media
  function b64ToBlob(parts, mime) { var bin = parts.map(function (p) { return atob(p); }).join(""); var u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: mime || "application/octet-stream" }); }
  function getMedia(mid) {
    if (mediaCache[mid]) return Promise.resolve(mediaCache[mid]);
    var room = S.room.id;
    return api("/media/get", { room: room, mid: mid, part: 0 }).then(function (j0) {
      var ps = [Promise.resolve(j0)];
      for (var i = 1; i < j0.total; i++) ps.push(api("/media/get", { room: room, mid: mid, part: i }));
      return Promise.all(ps).then(function (all) { var u = URL.createObjectURL(b64ToBlob(all.map(function (x) { return x.data; }), j0.mime)); mediaCache[mid] = u; return u; });
    });
  }
  function hydrateMedia(box) {
    $$("img.img[data-mid]", box).forEach(function (im) { var mid = im.getAttribute("data-mid"); if (!mid) return; getMedia(mid).then(function (u) { im.src = u; }).catch(function () { im.alt = "تعذّر تحميل الصورة"; }); });
  }
  function upload(blob, kind, name) {
    var room = S.room.id;
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(String(fr.result).split(",")[1] || ""); }; fr.onerror = rej; fr.readAsDataURL(blob); }).then(function (b64) {
      var CH = 600 * 1024 - 4, parts = [];
      for (var i = 0; i < b64.length; i += CH) parts.push(b64.slice(i, i + CH));
      if (parts.length > 16) throw new Error("الملف كبير أوي (الحد ~7 ميجا)");
      var mid = null, chain = Promise.resolve();
      parts.forEach(function (p, i) { chain = chain.then(function () { return api("/media/put", { room: room, part: i, total: parts.length, mid: mid, data: p, mime: blob.type, name: name || kind, size: blob.size }, 30000).then(function (j) { mid = j.mid; }); }); });
      return chain.then(function () { mediaCache[mid] = URL.createObjectURL(blob); return mid; });
    });
  }
  function compress(file) {
    return new Promise(function (res) {
      var im = new Image(); im.onload = function () {
        var s = Math.min(1, 1280 / Math.max(im.width, im.height)), c = D.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(function (b) { res(b || file); }, "image/webp", .82);
      }; im.onerror = function () { res(file); }; im.src = URL.createObjectURL(file);
    });
  }
  function pickFile(accept, cap) {
    return new Promise(function (res) { var i = D.createElement("input"); i.type = "file"; i.accept = accept; if (cap) i.capture = cap; i.onchange = function () { res(i.files && i.files[0]); }; i.click(); });
  }
  function sendImage(cap) {
    pickFile("image/*", cap).then(function (f) {
      if (!f) return;
      say("بيترفع…");
      compress(f).then(function (b) { return upload(b, "img", f.name); }).then(function (mid) { return post({ kind: "img", media: mid, once: S.once || undefined, text: $("#c4in").value.trim() || undefined }, true); })
        .then(function () { S.once = false; ctxBar(); $("#c4in").value = ""; updSend(); }).catch(function (e) { say(e.message); });
    });
  }

  // ------------------------------------------------------------ voice
  var REC = null;
  function bindSend() {
    var b = $("#c4snd"), t0 = 0, held = false;
    var start = function (e) {
      if ($("#c4in").value.trim() || S.edit) return;
      e.preventDefault(); t0 = now(); held = true;
      setTimeout(function () { if (held) recStart(); }, 180);
    };
    var end = function (e) {
      if ($("#c4in").value.trim() || S.edit) { if (e.type !== "pointercancel") send(); return; }
      held = false;
      if (REC) recStop(e.type === "pointercancel" || (e.clientX && Math.abs(e.clientX - (REC.x || e.clientX)) > 120)); else if (now() - t0 < 300) say("اضغط مطوّل عشان تسجّل صوت 🎙️");
    };
    b.addEventListener("pointerdown", start); b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end);
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }
  function recStart() {
    if (!navigator.mediaDevices || !W.MediaRecorder) { say("الجهاز مش بيدعم التسجيل هنا"); return; }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (st) {
      var mt = MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
      var mr = new MediaRecorder(st, mt ? { mimeType: mt, audioBitsPerSecond: 24000 } : undefined), ch = [], wave = [];
      var ac, an, buf, iv;
      try { ac = new (W.AudioContext || W.webkitAudioContext)(); an = ac.createAnalyser(); an.fftSize = 256; ac.createMediaStreamSource(st).connect(an); buf = new Uint8Array(an.frequencyBinCount);
        iv = setInterval(function () { an.getByteTimeDomainData(buf); var m = 0; for (var i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i] - 128)); wave.push(Math.round(m / 128 * 28)); }, 120); } catch (e) {}
      mr.ondataavailable = function (e) { if (e.data && e.data.size) ch.push(e.data); };
      REC = { mr: mr, st: st, ch: ch, wave: wave, t: now(), iv: iv, ac: ac };
      mr.start(250); hap(14);
      $("#c4snd").classList.add("rec");
      $("#c4ctx").innerHTML = '<div class="recb"><i></i><span id="c4rt">0:00</span><span style="opacity:.7;font-weight:400">· اسحب لبرّه للإلغاء</span></div>';
      REC.tick = setInterval(function () { var e = $("#c4rt"); if (e) e.textContent = fmtDur((now() - REC.t) / 1000); typingPing(true); if (now() - REC.t > 180000) recStop(false); }, 500);
    }).catch(function () { say("محتاج إذن المايك عشان التسجيل"); });
  }
  function recStop(cancel) {
    var R = REC; REC = null; if (!R) return;
    clearInterval(R.tick); clearInterval(R.iv); try { R.ac && R.ac.close(); } catch (e) {}
    $("#c4snd").classList.remove("rec"); ctxBar();
    R.mr.onstop = function () {
      R.st.getTracks().forEach(function (t) { t.stop(); });
      var dur = (now() - R.t) / 1000;
      if (cancel || dur < .8) { say(cancel ? "اتلغى التسجيل" : "التسجيل قصير أوي"); return; }
      var blob = new Blob(R.ch, { type: R.mr.mimeType || "audio/webm" });
      var w = R.wave, n = 32, step = Math.max(1, Math.floor(w.length / n)), wave = [];
      for (var i = 0; i < w.length && wave.length < n; i += step) wave.push(Math.max.apply(null, w.slice(i, i + step)));
      upload(blob, "voice", "voice.webm").then(function (mid) { return post({ kind: "voice", media: mid, once: S.once || undefined, meta: { dur: Math.round(dur), wave: wave } }, true); }).then(function () { S.once = false; ctxBar(); }).catch(function (e) { say(e.message); });
    };
    try { R.mr.stop(); } catch (e) {}
    hap(10);
  }
  var AUD = null;
  function play(id, el) {
    var m = S.msgs[id]; if (!m || !m.media) return;
    if (AUD && AUD.id === id) { if (AUD.a.paused) AUD.a.play(); else AUD.a.pause(); return; }
    if (AUD) { AUD.a.pause(); }
    getMedia(m.media).then(function (u) {
      var a = new Audio(u); var rate = ld("c4_rate", 1); a.playbackRate = rate; AUD = { id: id, a: a };
      var bars = el ? $$(".wv i", el.closest(".b")) : [];
      a.ontimeupdate = function () { var p = a.duration ? a.currentTime / a.duration : 0; bars.forEach(function (b, i) { b.classList.toggle("p", i / bars.length <= p); }); };
      a.onplay = function () { if (el) el.innerHTML = ic("pause", 18); }; a.onpause = a.onended = function () { if (el) el.innerHTML = ic("play", 18); };
      a.play().catch(function () {});
    }).catch(function (e) { say(e.message); });
  }

  // ------------------------------------------------------------ send
  function post(body, now_) {
    var room = S.room.id, cid = cidGen();
    body = Object.assign({ room: room, cid: cid }, body);
    if (S.reply) body.reply = S.reply;
    if (S.threadRoot) body.thread = S.threadRoot;
    var tmp = { id: "p_" + cid, cid: cid, uid: S.uid, kind: body.kind || "text", text: body.text, meta: body.meta || null, reply: body.reply, thread: body.thread, at: now(), pending: 1, reacts: {} };
    if (!body.sendAt && !body.media) { S.msgs[tmp.id] = tmp; S.order.push(tmp.id); renderMsgs(true); }
    S.reply = null; ctxBar();
    hap(6);
    return api("/send", body).then(function (j) {
      if (j.scheduled) { say("اتجدولت ✅ هتتبعت " + fmtDay(body.sendAt) + " " + fmtT(body.sendAt)); delete S.msgs[tmp.id]; S.order = S.order.filter(function (x) { return x !== tmp.id; }); renderMsgs(); return j; }
      merge([j.msg]); renderMsgs(true); cacheMsgs(); swoosh();
      X.onSent.forEach(function (f) { try { f(j.msg, body); } catch (e) {} });
      if (S.threadRoot) threadView(S.threadRoot);
      return j;
    }).catch(function (e) {
      if (e.code === "net" && !body.media) { var o = outbox(); o.push({ room: room, body: body, cid: cid, at: tmp.at }); setOut(o); say("هتتبعت أول ما النت يرجع"); return; }
      delete S.msgs[tmp.id]; S.order = S.order.filter(function (x) { return x !== tmp.id; }); renderMsgs();
      say(e.message); throw e;
    });
  }
  function swoosh() { try { if (LITE() || ld("c4_snd", 1) === 0) return; AC = AC || new (W.AudioContext || W.webkitAudioContext)(); var o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(520, AC.currentTime); o.frequency.exponentialRampToValueAtTime(980, AC.currentTime + .12); g.gain.setValueAtTime(.05, AC.currentTime); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + .16); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + .17); } catch (e) {} }
  function flushOut() {
    var o = outbox(); if (!o.length) return;
    var item = o[0];
    api("/send", item.body).then(function (j) { setOut(outbox().filter(function (x) { return x.cid !== item.cid; })); if (S.room && S.room.id === item.room) { merge([j.msg]); renderMsgs(true); } flushOut(); })
      .catch(function (e) { if (e.code !== "net") { setOut(outbox().filter(function (x) { return x.cid !== item.cid; })); say("رسالة متبعتتش: " + e.message); flushOut(); } });
  }
  function send() {
    var inp = $("#c4in"), t = inp.value.trim();
    if (S.edit) {
      var id = S.edit; S.edit = null; ctxBar();
      if (!t) return;
      api("/edit", { room: S.room.id, id: id, text: t }).then(function () { S.msgs[id].text = t; S.msgs[id].edited = true; renderMsgs(); inp.value = ""; updSend(); draft(); }).catch(function (e) { say(e.message); });
      return;
    }
    if (!t) return;
    inp.value = ""; autoGrow(); updSend(); draft();
    post({ kind: "text", text: t }).catch(function () { inp.value = t; updSend(); });
  }

  // ------------------------------------------------------------ composer context (reply / edit / once / thread)
  function ctxBar() {
    var c = $("#c4ctx"); if (!c) return;
    var h = "";
    if (S.reply && S.msgs[S.reply]) h += '<div class="ctx">' + ic("reply", 16) + "<div><b>رد على " + esc(memberName(S.msgs[S.reply].uid)) + ":</b> " + emoText(preview(S.msgs[S.reply])) + '</div><button class="ib tap" style="width:30px;height:30px" data-a="ctxx">' + ic("close", 16) + "</button></div>";
    if (S.edit) h += '<div class="ctx">' + ic("edit", 16) + '<div>بتعدّل الرسالة</div><button class="ib tap" style="width:30px;height:30px" data-a="ctxx">' + ic("close", 16) + "</button></div>";
    if (S.once) h += '<div class="ctx">' + ic("timer", 16) + '<div>الصورة/الصوت الجاي هيتشاف مرة واحدة</div><button class="ib tap" style="width:30px;height:30px" data-a="ctxx">' + ic("close", 16) + "</button></div>";
    if (S.threadRoot) h += '<div class="ctx">' + ic("thread", 16) + '<div>بترد جوه الخيط</div><button class="ib tap" style="width:30px;height:30px" data-a="ctxx">' + ic("close", 16) + "</button></div>";
    if (S.room && S.room.onlyAdmins && !(S.room.role === "owner" || S.room.role === "admin")) h += '<div class="ctx">' + ic("mega", 16) + "<div>الأدمنز بس اللي بيكتبوا هنا</div></div>";
    c.innerHTML = h;
  }
  function chips() {
    var c = $("#c4chips"); if (!c) return;
    var L = [["checkin", "💪", "+1 التزام"], ["cheer", "🔥", "شد حيلك"], ["mealcard", "📸", "كارت وجبة"], ["water", "💧", "شربت مية"]];
    if (S.room && S.room.type === "channel") L = [];
    c.innerHTML = L.map(function (x) { return '<button class="tap" data-a="chip" data-v="' + x[0] + '">' + emoImg(x[1]) + " " + x[2] + "</button>"; }).join("");
  }

  // ------------------------------------------------------------ long press menu
  function bindLong(box) {
    var t = null, sx = 0, sy = 0;
    box.addEventListener("pointerdown", function (e) {
      var b = e.target.closest(".b[data-id]"); if (!b) return;
      sx = e.clientX; sy = e.clientY;
      t = setTimeout(function () { t = null; hap(12); msgMenu(b.getAttribute("data-id")); }, 420);
    });
    var cancel = function (e) { if (t && (!e || e.type !== "pointermove" || Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 12)) { clearTimeout(t); t = null; } };
    box.addEventListener("pointerup", cancel); box.addEventListener("pointermove", cancel); box.addEventListener("pointercancel", cancel);
    box.addEventListener("contextmenu", function (e) { var b = e.target.closest(".b[data-id]"); if (b) { e.preventDefault(); msgMenu(b.getAttribute("data-id")); } });
    // swipe to reply (iOS style)
    var sw = null;
    box.addEventListener("touchstart", function (e) { var b = e.target.closest(".b[data-id]"); if (b) sw = { b: b, x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
    box.addEventListener("touchmove", function (e) { if (!sw) return; var dx = e.touches[0].clientX - sw.x, dy = Math.abs(e.touches[0].clientY - sw.y); if (dy > 30) { sw.b.style.transform = ""; sw = null; return; } if (dx < 0) sw.b.style.transform = "translateX(" + Math.max(dx, -70) + "px)"; sw.dx = dx; }, { passive: true });
    box.addEventListener("touchend", function () { if (!sw) return; sw.b.style.transition = "transform .3s cubic-bezier(.2,1.4,.4,1)"; sw.b.style.transform = ""; var b = sw.b, dx = sw.dx; setTimeout(function () { b.style.transition = ""; }, 320); if (dx < -55) { S.reply = b.getAttribute("data-id"); ctxBar(); $("#c4in").focus(); hap(8); } sw = null; });
  }
  var QUICK_RX = ["❤️", "🔥", "💪", "😂", "👏", "😮", "🙏"];
  function msgMenu(id) {
    var m = S.msgs[id]; if (!m || m.pending) return;
    var mine = m.uid === S.uid, adm = S.room.role === "owner" || S.room.role === "admin";
    var L = [];
    L.push(["reply", "reply", "رد"]);
    L.push(["thread", "thread", "رد في خيط"]);
    if (m.text && !m.deleted) L.push(["copy", "copy", "نسخ"]);
    if (mine && m.kind === "text" && !m.deleted && now() - m.at < 15 * 60e3) L.push(["edit", "edit", "تعديل"]);
    if ((adm || S.room.type === "dm") && !m.deleted) L.push(["pin", "pin", m.pinned ? "إلغاء التثبيت" : "تثبيت"]);
    if (m.kind === "voice" && !m.deleted) L.push(["speed", "speaker", "سرعة الصوت ×" + ld("c4_rate", 1)]);
    if (!mine) L.push(["report", "flag", "إبلاغ"]);
    if ((mine || adm) && !m.deleted) L.push(["del", "trash", mine ? "مسح عند الكل" : "مسح (أدمن)", "red"]);
    sheet('<div class="rxbar">' + QUICK_RX.map(function (e) { return '<button class="tap" data-a="react" data-id="' + esc(id) + '" data-v="' + e + '">' + emoImg(e) + "</button>"; }).join("") +
      '<button class="tap" data-a="rxmore" data-id="' + esc(id) + '">' + ic("add", 30) + "</button></div>" +
      L.map(function (x) { return '<div class="li tap ' + (x[3] || "") + '" data-a="m_' + x[0] + '" data-id="' + esc(id) + '">' + ic(x[1], 22) + x[2] + "</div>"; }).join(""));
  }

  // ------------------------------------------------------------ sheets
  function sheet(html, cls) {
    closeSheet();
    var s = D.createElement("div"); s.className = "sh"; s.id = "c4sh";
    s.innerHTML = '<div class="shb glass ' + (cls || "") + '"><div class="grab"></div>' + html + "</div>";
    s.addEventListener("click", function (e) { if (e.target === s) closeSheet(); });
    $("#c4").appendChild(s);
    return s;
  }
  function closeSheet() { var s = $("#c4sh"); if (s) s.remove(); }
  function plusSheet() {
    var G = [["img", "image", "صورة", "#2f8cff"], ["cam", "cam", "كاميرا", "#ff5d8f"], ["poll", "poll", "تصويت", "#f5a524"], ["mealcard", "food", "كارت وجبة", "#19c58e"],
      ["loc", "loc", "موقعي", "#ff6b3d"], ["sched", "time", "مجدولة", "#8b5cf6"], ["once", "timer", "مرة واحدة", "#0ea5e9"], ["chal", "trophy", "تحدي", "#eab308"],
      ["file", "doc", "ملف", "#64748b"], ["ask", "ai", "@سعراتي", "#10b981"]].concat(X.plus);
    sheet("<h3>إضافة</h3>" + '<div class="grid">' + G.map(function (g) { return '<div class="gi tap" data-a="' + (/^x_/.test(g[0]) ? "" : "p_") + g[0] + '"><span style="background:linear-gradient(145deg,' + g[3] + ',' + g[3] + 'aa)">' + ic(g[1], 26) + "</span>" + g[2] + "</div>"; }).join("") + "</div>");
  }
  function emojiSheet(target) {
    loadEmo().then(function () {
      var cats = {}; EMO.list.forEach(function (x) { var c = x[2] || "smileys"; (cats[c] = cats[c] || []).push(x); });
      var rec = ld("c4_erec", []);
      var CN = { recent: "الأخيرة", smileys: "وشوش", people: "ناس", animals: "طبيعة", food: "أكل", activities: "نشاط", travel: "أماكن", objects: "حاجات", symbols: "رموز", flags: "أعلام" };
      var keys = (rec.length ? ["recent"] : []).concat(Object.keys(cats));
      var cur = keys[0];
      var draw = function () {
        var list = cur === "recent" ? rec.map(function (c) { return [c, EMO.map[c]]; }).filter(function (x) { return x[1]; }) : cats[cur] || [];
        sheet('<div class="epc">' + keys.map(function (k) { return '<button class="tap' + (k === cur ? " on" : "") + '" data-a="ecat" data-v="' + k + '">' + (CN[k] || k) + "</button>"; }).join("") + "</div>" +
          '<div class="ep">' + list.map(function (x) { return '<button class="tap" data-a="' + (target ? "react" : "eput") + '" data-id="' + esc(target || "") + '" data-v="' + esc(x[0]) + '">' + emoImg(x[0]) + "</button>"; }).join("") + "</div>");
        $("#c4sh").__ecat = function (k) { cur = k; draw(); };
      };
      draw();
    });
  }
  function newSheet() {
    token().then(function (t) {
      var myId = t ? t.uid : "";
      sheet("<h3>محادثة جديدة</h3>" +
        '<div class="li tap" data-a="n_group">' + ic("people", 22) + "جروب جديد</div>" +
        '<div class="li tap" data-a="n_channel">' + ic("mega", 22) + "قناة (الأدمنز بس بيكتبوا)</div>" +
        '<div class="li tap" data-a="n_community">' + ic("grid", 22) + "مجتمع (جروبات تحته)</div>" +
        '<div class="li tap" data-a="n_join">' + ic("qr", 22) + "انضم بكود دعوة</div>" +
        '<div class="li tap" data-a="n_dm">' + ic("personadd", 22) + "محادثة خاصة بمعرّف صاحبك</div>" +
        X.newRows.map(function (f) { return f(); }).join("") +
        '<div class="li tap" data-a="myid" data-v="' + esc(myId) + '">' + ic("copy", 22) + 'معرّفي في الشات<em dir="ltr">' + esc(shortId(myId)) + "…</em></div>");
    });
  }
  function formSheet(title, fields, btn, cb) {
    sheet("<h3>" + title + "</h3>" + fields.map(function (f) {
      if (f.type === "select") return '<select class="fld" id="c4f_' + f.k + '">' + f.opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === f.v ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>";
      if (f.type === "area") return '<textarea class="fld" rows="3" id="c4f_' + f.k + '" placeholder="' + esc(f.ph || "") + '">' + esc(f.v || "") + "</textarea>";
      if (f.type === "check") return '<label class="li"><span>' + esc(f.ph) + '</span><input type="checkbox" id="c4f_' + f.k + '" style="margin-inline-start:auto;width:22px;height:22px"' + (f.v ? " checked" : "") + "></label>";
      return '<input class="fld" id="c4f_' + f.k + '" type="' + (f.type || "text") + '" placeholder="' + esc(f.ph || "") + '" value="' + esc(f.v || "") + '"' + (f.dir ? ' dir="' + f.dir + '"' : "") + ">";
    }).join("") + '<button class="btn tap" data-a="formok">' + btn + "</button>");
    $("#c4sh").__ok = function () { var o = {}; fields.forEach(function (f) { var e = $("#c4f_" + f.k); o[f.k] = f.type === "check" ? e.checked : e.value; }); cb(o); };
    var first = $("#c4sh .fld"); if (first) setTimeout(function () { try { first.focus(); } catch (e) {} }, 300);
  }
  var TTL_OPTS = [["0", "مقفولة"], ["3600000", "ساعة"], ["86400000", "24 ساعة"], ["604800000", "7 أيام"], ["7776000000", "90 يوم"]];
  function createRoom(type) {
    var T = { group: "جروب جديد", channel: "قناة جديدة", community: "مجتمع جديد" };
    formSheet(T[type], [{ k: "name", ph: "الاسم (مثلًا: تحدي نوفمبر 30 يوم)" }, { k: "descr", ph: "وصف قصير (اختياري)", type: "area" }, { k: "ttl", type: "select", opts: TTL_OPTS, v: "0" }].concat(type === "group" ? [{ k: "members", ph: "معرّفات أعضاء (اختياري، افصل بفاصلة)", dir: "ltr" }] : []), "إنشاء", function (o) {
      var mem = String(o.members || "").split(/[,،\s]+/).filter(Boolean);
      api("/room/create", { type: type, name: o.name, descr: o.descr, ttl: Number(o.ttl), members: mem }).then(function (j) { closeSheet(); S.rooms.unshift(j.room); renderList(); openRoom(j.room.id); shareCode(j.room); }).catch(function (e) { say(e.message); });
    });
  }
  function shareCode(r) {
    if (!r || !r.code) return;
    var txt = "انضم لـ «" + (r.name || "") + "» على واتساب سعراتي 💚\nالكود: " + r.code;
    sheet("<h3>كود الدعوة</h3>" + '<div style="font-size:34px;font-weight:900;letter-spacing:6px;text-align:center;padding:14px;border-radius:18px;background:rgba(0,0,0,.25)" dir="ltr">' + esc(r.code) + "</div>" +
      '<button class="btn tap" data-a="sharewa" data-v="' + esc(txt) + '">' + "ابعته على واتساب" + "</button>" +
      '<button class="btn g tap" data-a="copytxt" data-v="' + esc(r.code) + '">نسخ الكود</button>');
  }
  function infoSheet() {
    var r = S.room;
    api("/room/info", { room: r.id }).then(function (j) {
      S.info = j; var adm = j.room.role === "owner" || j.room.role === "admin";
      var mem = (j.members || []).slice(0, 80).map(function (m) {
        return '<div class="mem">' + avHtml({ id: m.uid, name: m.nick || m.name || "؟" }, true) + "<b>" + emoText(m.nick || m.name || shortId(m.uid)) + (m.uid === S.uid ? " (انت)" : "") + "</b><small>" + ({ owner: "المالك", admin: "أدمن" }[m.role] || "") + "</small>" +
          (adm && m.uid !== S.uid && m.role !== "owner" ? '<button class="ib tap" style="width:34px;height:34px" data-a="memop" data-v="' + esc(m.uid) + '" data-r="' + m.role + '">' + ic("more", 16) + "</button>" : "") + "</div>";
      }).join("");
      var muted = j.room.muteUntil > now();
      sheet('<div style="text-align:center">' + avHtml(j.room).replace('class="av"', 'class="av" style="margin:0 auto 8px;width:84px;height:84px;border-radius:28px;font-size:34px;background:linear-gradient(145deg,hsl(' + hue(r.id) + ',62%,42%),hsl(' + ((hue(r.id) + 40) % 360) + ',70%,28%))"') + "<h3>" + emoText(j.room.name || (r.peer && r.peer.name) || "محادثة") + "</h3>" +
        (j.room.descr ? '<div style="opacity:.8;margin:-6px 0 10px">' + emoText(j.room.descr) + "</div>" : "") + "</div>" +
        (j.pins && j.pins.length ? '<div class="li">' + ic("pin", 20) + "<div>" + emoText(preview(j.pins[0])) + "</div></div>" : "") +
        '<div class="li tap" data-a="i_mute">' + ic(muted ? "bell" : "belloff", 22) + (muted ? "إلغاء الكتم" : "كتم الإشعارات") + "</div>" +
        '<div class="li tap" data-a="i_sched">' + ic("time", 22) + "الرسايل المجدولة بتاعتي</div>" +
        '<div class="li tap" data-a="i_nick">' + ic("person", 22) + "لقبي هنا<em>" + esc(j.room.nick || "") + "</em></div>" +
        (j.room.type !== "dm" && adm ? '<div class="li tap" data-a="i_code">' + ic("qr", 22) + "كود الدعوة<em dir=\"ltr\">" + esc(j.room.code || "") + "</em></div>" +
          '<div class="li tap" data-a="i_edit">' + ic("edit", 22) + "تعديل الاسم والوصف</div>" +
          '<div class="li tap" data-a="i_ttl">' + ic("timer", 22) + "رسايل مؤقتة<em>" + ttlName(j.room.ttl) + "</em></div>" +
          '<div class="li tap" data-a="i_slow">' + ic("time", 22) + "الوضع البطيء<em>" + (j.room.slow ? j.room.slow + " ث" : "مقفول") + "</em></div>" +
          '<div class="li">' + ic("shield", 22) + 'حارس الجروب (فلتر إساءة)<span class="tg tap' + (j.room.guard ? " on" : "") + '" data-a="i_guard"></span></div>' +
          (j.room.type === "group" ? '<div class="li">' + ic("mega", 22) + 'الأدمنز بس يكتبوا<span class="tg tap' + (j.room.onlyAdmins ? " on" : "") + '" data-a="i_only"></span></div>' : "") +
          (j.room.type === "community" ? '<div class="li tap" data-a="i_sub">' + ic("add", 22) + "جروب جديد في المجتمع</div>" : "") : "") +
        X.infoRows.map(function (f) { try { return f(j, adm) || ""; } catch (e) { return ""; } }).join("") +
        (j.subs && j.subs.length ? "<h3 style=\"margin-top:14px\">جروبات المجتمع</h3>" + j.subs.map(function (x) { return '<div class="li tap" data-a="joinsub" data-v="' + esc(x.id) + '">' + ic("people", 20) + emoText(x.name) + "</div>"; }).join("") : "") +
        (j.room.type !== "channel" || adm ? '<h3 style="margin-top:14px">' + (j.members || []).length + " عضو</h3>" + mem : "") +
        '<div class="li tap red" data-a="i_leave">' + ic("exit", 22) + (j.room.type === "dm" ? "إخفاء المحادثة" : "مغادرة") + "</div>");
    }).catch(function (e) { say(e.message); });
  }
  var ttlName = function (t) { var o = TTL_OPTS.filter(function (x) { return Number(x[0]) === Number(t); })[0]; return o ? o[1] : "مقفولة"; };
  function setRoom(o) { return api("/room/set", Object.assign({ room: S.room.id }, o)).then(function (j) { S.room = Object.assign(S.room, j.room); head(); ctxBar(); say("اتحفظ ✅"); infoSheet(); }).catch(function (e) { say(e.message); }); }
  function threadView(rootId) {
    var root = S.msgs[rootId]; if (!root) return;
    S.threadRoot = rootId; ctxBar();
    var list = S.order.map(function (id) { return S.msgs[id]; }).filter(function (m) { return m && m.thread === rootId; });
    sheet("<h3>" + ic("thread", 18) + " الخيط</h3>" + '<div class="msgs" style="padding:0;max-height:52vh">' + bubble(root, true) + list.map(function (m) { return bubble(m, true); }).join("") + "</div>" +
      '<div class="in glass" style="margin-top:10px"><textarea id="c4tin" rows="1" placeholder="رد في الخيط…"></textarea><button class="ib tap" data-a="tsend">' + ic("send", 22) + "</button></div>");
    var s = $("#c4sh"); s.addEventListener("click", function (e) { if (e.target === s) { S.threadRoot = null; ctxBar(); } });
  }
  function pollSheet() {
    formSheet("تصويت جديد", [{ k: "q", ph: "السؤال (مثلًا: عشا النهارده؟)" }, { k: "o1", ph: "اختيار 1" }, { k: "o2", ph: "اختيار 2" }, { k: "o3", ph: "اختيار 3 (اختياري)" }, { k: "o4", ph: "اختيار 4 (اختياري)" }, { k: "multi", type: "check", ph: "يسمح بأكتر من اختيار" }], "ابعت التصويت", function (o) {
      var opts = [o.o1, o.o2, o.o3, o.o4].map(function (x) { return String(x || "").trim(); }).filter(Boolean);
      post({ kind: "poll", text: o.q, meta: { opts: opts, multi: !!o.multi } }).then(closeSheet).catch(function () {});
    });
  }
  function mealSheet() {
    var items = [];
    try { var k = G("dkey")(G("cur")), d = G("getDay")(k); items = (d && d.items || []).slice(-12).reverse(); } catch (e) {}
    if (!items.length) {
      formSheet("كارت وجبة", [{ k: "n", ph: "اسم الوجبة (كشري صغير + سلطة)" }, { k: "kcal", ph: "السعرات", type: "number" }, { k: "p", ph: "بروتين g", type: "number" }, { k: "c", ph: "كارب g", type: "number" }, { k: "f", ph: "دهون g", type: "number" }], "شارك", function (o) {
        post({ kind: "meal", text: o.n, meta: { kcal: +o.kcal || 0, p: +o.p || 0, c: +o.c || 0, f: +o.f || 0 } }).then(closeSheet).catch(function () {});
      });
      return;
    }
    W.__c4items = items;
    sheet("<h3>شارك وجبة من يومك</h3>" + items.map(function (it, i) { return '<div class="li tap" data-a="mealpick" data-v="' + i + '">' + emoImg("🍽️") + "<div>" + emoText(it.n) + "</div><em>" + Math.round(it.k || 0) + " سعر</em></div>"; }).join("") +
      '<div class="li tap" data-a="mealall">' + emoImg("🧾") + "<div>يومي كله لحد دلوقتي</div></div>");
  }
  function schedSheet() {
    var t = $("#c4in").value.trim();
    var d = new Date(now() + 3600e3); d.setMinutes(0, 0, 0);
    var loc = new Date(d.getTime() - d.getTimezoneOffset() * 60e3).toISOString().slice(0, 16);
    formSheet("رسالة مجدولة", [{ k: "t", type: "area", ph: "الرسالة", v: t }, { k: "at", type: "datetime-local", v: loc }], "جدولها", function (o) {
      var at = new Date(o.at).getTime();
      if (!(at > now() + 60e3)) { say("اختار وقت بعد دقيقة على الأقل"); return; }
      post({ kind: "text", text: o.t, sendAt: at }).then(function () { closeSheet(); $("#c4in").value = ""; updSend(); }).catch(function () {});
    });
  }
  function chalSheet() {
    formSheet("تحدي للجروب", [{ k: "n", ph: "اسم التحدي (10 آلاف خطوة)" }, { k: "goal", ph: "الهدف اليومي" }, { k: "days", ph: "عدد الأيام", type: "number", v: "30" }], "ابدأ التحدي", function (o) {
      post({ kind: "challenge", text: o.n, meta: { goal: o.goal, days: +o.days || 30, start: now() } }).then(closeSheet).catch(function () {});
    });
  }
  function askSorati() {
    var q = $("#c4in").value.trim();
    if (!q) { $("#c4in").value = "@سعراتي "; $("#c4in").focus(); updSend(); closeSheet(); return; }
    closeSheet();
  }

  // ------------------------------------------------------------ clicks
  function onClick(e) {
    var el = e.target.closest("[data-a]"); if (!el) {
      var ln = e.target.closest(".c4lnk"); if (ln) { var u = ln.getAttribute("data-u"); try { W.Android && W.Android.openUrl ? W.Android.openUrl(u) : W.open(u, "_blank", "noopener"); } catch (x) {} }
      return;
    }
    var a = el.getAttribute("data-a"), v = el.getAttribute("data-v"), id = el.getAttribute("data-id");
    var sh = $("#c4sh");
    switch (a) {
      case "close": close(); break;
      case "back": back(); break;
      case "tab": S.tab = v; sv("c4_tab", v); renderList(); hap(4); break;
      case "room": openRoom(v); break;
      case "newsheet": newSheet(); break;
      case "info": infoSheet(); break;
      case "plus": plusSheet(); break;
      case "emoji": emojiSheet(null); break;
      case "ecat": sh && sh.__ecat && sh.__ecat(v); break;
      case "eput": { var inp = $("#c4in"); inp.value += v; updSend(); var rc = ld("c4_erec", []).filter(function (x) { return x !== v; }); rc.unshift(v); sv("c4_erec", rc.slice(0, 32)); hap(4); break; }
      case "formok": sh && sh.__ok && sh.__ok(); break;
      case "ctxx": S.reply = null; S.edit = null; S.once = false; S.threadRoot = null; ctxBar(); updSend(); break;
      case "find": findInChat(); break;
      case "call": if (W.C4RTC) W.C4RTC.start(S.room); else say("المكالمات جاية في التحديث ده قريب 📞"); break;
      case "summary": summary(); break;
      case "jump": jump(v); break;
      case "thread": closeSheet(); threadView(v || id); break;
      case "tsend": { var ti = $("#c4tin"), tt = ti && ti.value.trim(); if (tt) { ti.value = ""; post({ kind: "text", text: tt }).catch(function () {}); } break; }
      case "react": doReact(id, v); closeSheet(); break;
      case "rxmore": emojiSheet(id); break;
      case "vote": doVote(id, Number(v)); break;
      case "openonce": openOnce(v); break;
      case "play": play(v, el); break;
      case "logmeal": logMeal(v); break;
      case "checkin": post({ kind: "checkin", text: "+1 التزام النهارده" }).catch(function () {}); break;
      case "chip":
        if (v === "checkin") post({ kind: "checkin", text: "+1 التزام النهارده" }).catch(function () {});
        else if (v === "cheer") post({ kind: "text", text: "شد حيلك 🔥💪" }).catch(function () {});
        else if (v === "water") post({ kind: "text", text: "شربت كوباية مية 💧" }).catch(function () {});
        else mealSheet();
        break;
      case "loc": { var lm = S.msgs[v]; if (lm && lm.meta) { var url = "https://www.google.com/maps/search/?api=1&query=" + lm.meta.lat + "," + lm.meta.lng; try { W.Android && W.Android.openUrl ? W.Android.openUrl(url) : W.open(url, "_blank"); } catch (x) {} } break; }
      case "file": { var fm = S.msgs[v]; if (fm && fm.media) getMedia(fm.media).then(function (u) { var l = D.createElement("a"); l.href = u; l.download = (fm.meta && fm.meta.name) || "file"; l.click(); }); break; }
      // plus sheet
      case "p_img": closeSheet(); sendImage(); break;
      case "p_cam": closeSheet(); sendImage("environment"); break;
      case "p_poll": pollSheet(); break;
      case "p_mealcard": mealSheet(); break;
      case "p_sched": schedSheet(); break;
      case "p_once": S.once = true; ctxBar(); closeSheet(); say("اختار صورة أو سجّل صوت — هيتشاف مرة واحدة"); break;
      case "p_chal": chalSheet(); break;
      case "p_ask": askSorati(); break;
      case "p_file": closeSheet(); pickFile("*/*").then(function (f) { if (!f) return; if (f.size > 7e6) { say("الحد 7 ميجا"); return; } say("بيترفع…"); upload(f, "file", f.name).then(function (mid) { return post({ kind: /^video\//.test(f.type) ? "video" : "file", media: mid, meta: { name: f.name.slice(0, 120), size: f.size } }, true); }).catch(function (x) { say(x.message); }); }); break;
      case "p_loc": closeSheet(); if (!navigator.geolocation) { say("الموقع مش متاح"); break; } navigator.geolocation.getCurrentPosition(function (p) { post({ kind: "loc", text: "موقعي الحالي", meta: { lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5) } }).catch(function () {}); }, function () { say("محتاج إذن الموقع"); }, { timeout: 10000 }); break;
      case "mealpick": { var it = (W.__c4items || [])[Number(v)]; if (it) post({ kind: "meal", text: it.n, meta: { kcal: it.k || 0, p: it.p || 0, c: it.c || 0, f: it.f || 0, items: [it.n] } }).then(closeSheet).catch(function () {}); break; }
      case "mealall": { var all = W.__c4items || [], s = { kcal: 0, p: 0, c: 0, f: 0 }; all.forEach(function (x) { s.kcal += +x.k || 0; s.p += +x.p || 0; s.c += +x.c || 0; s.f += +x.f || 0; }); post({ kind: "meal", text: "يومي لحد دلوقتي", meta: Object.assign(s, { items: all.map(function (x) { return x.n; }) }) }).then(closeSheet).catch(function () {}); break; }
      // new
      case "n_group": createRoom("group"); break;
      case "n_channel": createRoom("channel"); break;
      case "n_community": createRoom("community"); break;
      case "n_join": formSheet("انضم بكود", [{ k: "code", ph: "الكود (8 حروف)", dir: "ltr" }], "انضم", function (o) { api("/room/join", { code: o.code }).then(function (j) { closeSheet(); refreshRooms().then(function () { openRoom(j.room.id); }); }).catch(function (x) { say(x.message); }); }); break;
      case "n_dm": formSheet("محادثة خاصة", [{ k: "uid", ph: "معرّف صاحبك في الشات", dir: "ltr" }], "ابدأ", function (o) { api("/room/create", { type: "dm", members: [String(o.uid || "").trim()] }).then(function (j) { closeSheet(); refreshRooms().then(function () { openRoom(j.room.id); }); }).catch(function (x) { say(x.message); }); }); break;
      case "myid": copy(v); say("اتنسخ معرّفك — ابعته لصاحبك"); break;
      case "copytxt": copy(v); say("اتنسخ ✅"); break;
      case "sharewa": { var wl = "https://wa.me/?text=" + encodeURIComponent(v); try { W.Android && W.Android.openUrl ? W.Android.openUrl(wl) : W.open(wl, "_blank"); } catch (x) {} break; }
      // info
      case "i_mute": { var mu = S.room.muteUntil > now() ? 0 : now() + 8 * 3600e3; api("/mute", { room: S.room.id, until: mu }).then(function () { S.room.muteUntil = mu; var rr = roomById(S.room.id); if (rr) rr.muteUntil = mu; say(mu ? "اتكتمت 8 ساعات" : "الإشعارات رجعت"); infoSheet(); }); break; }
      case "i_code": shareCode(S.info && S.info.room); break;
      case "i_edit": formSheet("تعديل", [{ k: "name", ph: "الاسم", v: S.room.name }, { k: "descr", ph: "الوصف", type: "area", v: S.room.descr }], "حفظ", function (o) { setRoom({ name: o.name, descr: o.descr }); }); break;
      case "i_ttl": formSheet("رسايل مؤقتة", [{ k: "ttl", type: "select", opts: TTL_OPTS, v: String(S.room.ttl || 0) }], "حفظ", function (o) { setRoom({ ttl: Number(o.ttl) }); }); break;
      case "i_slow": formSheet("الوضع البطيء", [{ k: "s", type: "select", opts: [["0", "مقفول"], ["10", "10 ثواني"], ["30", "30 ثانية"], ["60", "دقيقة"], ["300", "5 دقايق"]], v: String(S.room.slow || 0) }], "حفظ", function (o) { setRoom({ slow: Number(o.s) }); }); break;
      case "i_guard": setRoom({ guard: !S.room.guard }); break;
      case "i_only": setRoom({ onlyAdmins: !S.room.onlyAdmins }); break;
      case "i_nick": formSheet("لقبك هنا", [{ k: "n", ph: "مثلًا: بطل المشي", v: S.room.nick || "" }], "حفظ", function (o) { api("/member/nick", { room: S.room.id, nick: o.n }).then(function () { S.room.nick = o.n; say("اتحفظ ✅"); infoSheet(); }); }); break;
      case "i_sub": formSheet("جروب في المجتمع", [{ k: "name", ph: "اسم الجروب" }], "إنشاء", function (o) { api("/room/create", { type: "group", name: o.name, parent: S.room.id }).then(function () { say("اتعمل ✅"); infoSheet(); }).catch(function (x) { say(x.message); }); }); break;
      case "joinsub": closeSheet(); refreshRooms().then(function () { if (roomById(v)) openRoom(v); else say("اطلب الكود من أدمن الجروب"); }); break;
      case "i_sched": api("/sync", { room: S.room.id, mine: true, limit: 1 }).then(function (j) { var L = j.scheduled || []; sheet("<h3>المجدولة</h3>" + (L.length ? L.map(function (m) { return '<div class="li">' + ic("time", 20) + "<div>" + emoText(m.text) + "</div><em>" + fmtDay(m.at) + " " + fmtT(m.at) + '</em><button class="ib tap" style="width:32px;height:32px" data-a="m_del" data-id="' + esc(m.id) + '">' + ic("trash", 16) + "</button></div>"; }).join("") : '<div class="empty">مفيش رسايل مجدولة</div>')); }); break;
      case "i_leave": if (!confirm(S.room.type === "dm" ? "تخفي المحادثة؟" : "تغادر؟")) break; api("/leave", { room: S.room.id }).then(function () { closeSheet(); S.rooms = S.rooms.filter(function (x) { return x.id !== S.room.id; }); sv("c4_rooms", S.rooms); back(); }); break;
      case "memop": { var tu = v, tr = el.getAttribute("data-r"); sheet("<h3>" + esc(memberName(tu)) + "</h3>" + '<div class="li tap" data-a="mo_role" data-v="' + esc(tu) + '" data-r="' + (tr === "admin" ? "member" : "admin") + '">' + ic("shield", 22) + (tr === "admin" ? "شيل الأدمن" : "خليه أدمن") + "</div>" + '<div class="li tap" data-a="mo_dm" data-v="' + esc(tu) + '">' + ic("chat", 22) + "رسالة خاصة</div>" + X.memberOps.map(function (f) { return f(tu, tr); }).join("") + '<div class="li tap red" data-a="mo_kick" data-v="' + esc(tu) + '">' + ic("exit", 22) + "إخراج من الجروب</div>"); break; }
      case "mo_role": api("/member/role", { room: S.room.id, uid: v, role: el.getAttribute("data-r") }).then(function () { say("اتحفظ ✅"); infoSheet(); }).catch(function (x) { say(x.message); }); break;
      case "mo_kick": if (confirm("تخرجه من الجروب؟")) api("/member/kick", { room: S.room.id, uid: v }).then(function () { say("اتشال"); infoSheet(); }).catch(function (x) { say(x.message); }); break;
      case "mo_dm": api("/room/create", { type: "dm", members: [v] }).then(function (j) { closeSheet(); refreshRooms().then(function () { openRoom(j.room.id); }); }); break;
      // message menu
      case "m_reply": S.reply = id; ctxBar(); closeSheet(); $("#c4in").focus(); break;
      case "m_thread": closeSheet(); threadView(id); break;
      case "m_copy": copy(S.msgs[id] && S.msgs[id].text || ""); closeSheet(); say("اتنسخ"); break;
      case "m_edit": S.edit = id; $("#c4in").value = S.msgs[id].text || ""; ctxBar(); updSend(); closeSheet(); $("#c4in").focus(); break;
      case "m_pin": api("/pin", { room: S.room.id, id: id, on: !S.msgs[id].pinned }).then(function () { S.msgs[id].pinned = !S.msgs[id].pinned; renderMsgs(); }).catch(function (x) { say(x.message); }); closeSheet(); break;
      case "m_speed": { var r = ld("c4_rate", 1); r = r === 1 ? 1.5 : r === 1.5 ? 2 : 1; sv("c4_rate", r); if (AUD) AUD.a.playbackRate = r; say("سرعة الصوت ×" + r); closeSheet(); break; }
      case "m_report": formSheet("إبلاغ عن رسالة", [{ k: "r", type: "select", opts: [["إساءة", "إساءة أو شتيمة"], ["سبام", "سبام / إعلانات"], ["معلومة طبية خطر", "معلومة طبية خطر"], ["تحرش", "تحرش"], ["تاني", "حاجة تانية"]] }], "إبلاغ", function (o) { api("/report", { room: S.room.id, id: id, reason: o.r }).then(function () { closeSheet(); say("وصلنا البلاغ، شكرًا 🙏"); }).catch(function (x) { say(x.message); }); }); break;
      default: if (X.actions[a]) X.actions[a](el, v, id, e); break;
      case "m_del": api("/del", { room: S.room.id, id: id }).then(function () { if (S.msgs[id]) { S.msgs[id].deleted = true; S.msgs[id].text = null; } renderMsgs(); closeSheet(); say("اتمسحت"); }).catch(function (x) { say(x.message); }); break;
    }
  }
  function copy(t) { try { navigator.clipboard.writeText(t); } catch (e) { var a = D.createElement("textarea"); a.value = t; D.body.appendChild(a); a.select(); try { D.execCommand("copy"); } catch (x) {} a.remove(); } }
  function doReact(id, e) {
    var m = S.msgs[id]; if (!m) return; hap(8);
    var rx = JSON.parse(JSON.stringify(m.reacts || {})), had = rx[e] && rx[e].indexOf(S.uid) >= 0;
    Object.keys(rx).forEach(function (k) { rx[k] = rx[k].filter(function (u) { return u !== S.uid; }); if (!rx[k].length) delete rx[k]; });
    if (!had) rx[e] = (rx[e] || []).concat(S.uid);
    m.reacts = rx; renderMsgs();
    api("/react", { room: S.room.id, id: id, emoji: e }).then(function (j) { m.reacts = j.reacts; renderMsgs(); }).catch(function (x) { say(x.message); sync(); });
  }
  function doVote(id, opt) {
    var m = S.msgs[id]; if (!m) return; hap(8);
    var v = S.votes[id] || {}, multi = m.meta && m.meta.multi, mine = Object.keys(v).filter(function (k) { return (v[k] || []).indexOf(S.uid) >= 0; }).map(Number);
    var picks = multi ? (mine.indexOf(opt) >= 0 ? mine.filter(function (x) { return x !== opt; }) : mine.concat(opt)) : (mine[0] === opt ? [] : [opt]);
    var nv = {}; Object.keys(v).forEach(function (k) { nv[k] = (v[k] || []).filter(function (u) { return u !== S.uid; }); }); picks.forEach(function (p) { nv[p] = (nv[p] || []).concat(S.uid); });
    S.votes[id] = nv; renderMsgs();
    api("/vote", { room: S.room.id, id: id, opts: picks }).catch(function (x) { say(x.message); sync(true); });
  }
  function openOnce(id) {
    api("/open", { room: S.room.id, id: id }).then(function (j) {
      var m = S.msgs[id]; m.opened = true;
      getMedia(j.media).then(function (u) {
        if (m.kind === "voice") { var a = new Audio(u); a.play().catch(function () {}); say("بيشتغل مرة واحدة 🎧"); renderMsgs(); return; }
        sheet('<img src="' + u + '" style="width:100%;border-radius:18px;display:block" alt="صورة مرة واحدة"><div style="text-align:center;opacity:.75;margin-top:8px">' + ic("timer", 16) + " الصورة دي مش هتتشاف تاني</div>");
        var s = $("#c4sh"); s.addEventListener("click", function () { delete mediaCache[j.media]; URL.revokeObjectURL(u); });
        renderMsgs();
      });
    }).catch(function (e) { say(e.message); });
  }
  function logMeal(id) {
    var m = S.msgs[id]; if (!m || !m.meta) return;
    try {
      var add = G("addItems18"); if (typeof add !== "function") throw 0;
      add([{ n: m.text || "وجبة من الشات", k: m.meta.kcal, p: m.meta.p, c: m.meta.c, f: m.meta.f }]);
      say("اتسجلت في يومك ✅ " + Math.round(m.meta.kcal || 0) + " سعر"); hap(14);
      post({ kind: "text", text: "سجّلتها عندي كمان ✅" }).catch(function () {});
    } catch (e) { say("افتح سعراتي الأساسي عشان التسجيل"); }
  }
  function summary() {
    say("بلخّص اللي فاتك…");
    var r = roomById(S.room.id) || S.room;
    api("/summary", { room: S.room.id, since: r.readAt || 0 }, 20000).then(function (j) {
      sheet("<h3>" + emoImg("✨") + " اللي فاتك (" + j.n + " رسالة)</h3>" + '<div style="line-height:2;font-size:15.5px">' + fmtText(j.summary) + "</div>" + '<div style="opacity:.6;font-size:12px;margin-top:10px">' + (j.by === "ai" ? "ملخص بالذكاء — ممكن يفوته تفاصيل" : "ملخص سريع على الجهاز") + "</div>");
      if (r) r.unread = 0; markRead(); renderMsgs();
    }).catch(function (e) { say(e.message); });
  }
  function jump(id) {
    var el = $('#c4msgs .b[data-id="' + id + '"]'); if (!el) { say("الرسالة قديمة ومش ظاهرة"); return; }
    el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  }
  function findInChat() {
    formSheet("دوّر في المحادثة", [{ k: "q", ph: "كلمة…" }], "دوّر", function (o) {
      var q = String(o.q || "").trim(); if (!q) return;
      var hits = S.order.map(function (id) { return S.msgs[id]; }).filter(function (m) { return m && !m.deleted && String(m.text || "").indexOf(q) >= 0; }).reverse();
      sheet("<h3>" + hits.length + " نتيجة</h3>" + hits.slice(0, 40).map(function (m) { return '<div class="li tap" data-a="jumpx" data-v="' + esc(m.id) + '"><div><b>' + esc(memberName(m.uid)) + "</b><br>" + emoText(String(m.text).slice(0, 120)) + "</div><em>" + fmtList(m.at) + "</em></div>"; }).join(""));
      $("#c4sh").addEventListener("click", function (e) { var x = e.target.closest('[data-a="jumpx"]'); if (x) { closeSheet(); jump(x.getAttribute("data-v")); } });
    });
  }

  // ------------------------------------------------------------ entry in the app
  function entry() {
    if (!FLAG()) return;
    var body = D.getElementById("clubBody");
    if (!body || body.querySelector(".c4entry")) return;
    var e = D.createElement("div"); e.className = "c4entry tap";
    e.innerHTML = '<div class="ico">' + ic("chats", 26) + '</div><div><b>واتساب سعراتي</b><small>محادثات، جروبات، قنوات ومجتمعات — لايف</small></div><span class="ub" style="display:none">0</span>';
    e.addEventListener("click", function () { open(); });
    body.insertBefore(e, body.firstChild);
    css(); badge();
  }
  function hookClub() {
    if (typeof W.renderClub !== "function" && typeof G("renderClub") === "function") W.renderClub = G("renderClub");
    if (typeof W.renderClub === "function" && !W.renderClub.__c4) {
      var o = W.renderClub; W.renderClub = function () { var r = o.apply(this, arguments); try { entry(); } catch (e) {} return r; }; W.renderClub.__c4 = 1;
    }
    try { entry(); } catch (e) {}
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", hookClub); else setTimeout(hookClub, 0);
  setTimeout(hookClub, 1500);
  // background unread badge every 60s while app visible and signed in
  setInterval(function () { if (!D.hidden && FLAG() && G("FB") && G("FB").user && !($("#c4") && $("#c4").classList.contains("on"))) api("/me", {}).then(function (j) { S.rooms = j.rooms || []; sv("c4_rooms", S.rooms); badge(); }).catch(function () {}); }, 60000);
  if (/#c4/.test(location.hash)) setTimeout(function () { open(); }, 800);

  W.C4 = { X: X, G: G, esc: esc, ld: ld, sv: sv, say: say, hap: hap, fmtT: fmtT, fmtDay: fmtDay, fmtList: fmtList, hue: hue, avHtml: avHtml, memberName: memberName, formSheet: formSheet, getMedia: getMedia, upload: upload, compress: compress, pickFile: pickFile, renderMsgs: renderMsgs, sync: sync, roomById: roomById, refreshRooms: refreshRooms, fmtText: fmtText, updSend: updSend, infoSheet: infoSheet, token: token, open: open, close: close, openRoom: function (id) { open(id); }, api: api, state: S, unread: 0, sheet: sheet, closeSheet: closeSheet, post: function (b) { return post(b); }, emoText: emoText, emoImg: emoImg, loadEmo: loadEmo, ic: ic, render: function () { renderList(); if (S.room) renderMsgs(); }, wsSend: wsSend };
})();
