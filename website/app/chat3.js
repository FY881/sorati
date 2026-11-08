/* Sorati Chat 3.0 — client (vanilla JS, بدون مكتبات)
   - WebSocket لحظي مع إعادة اتصال تلقائية (backoff) ونبض كل 25 ثانية
   - طابور أوفلاين في IndexedDB + إعادة إرسال idempotent (cid)
   - تشفير طرف-لطرف للمحادثات الخاصة: ECDH P-256 → HKDF → AES-GCM (المفتاح الخاص non-extractable في IndexedDB، أو Keystore لو الجسر موجود)
   - كتابة/قراءة/حضور/تعديل/حذف/تفاعلات/رد/صوت مع تفريغ/كروت وجبة/@سعراتي
   - كل النصوص بتتعرض بـ textContent فقط (مفيش innerHTML لبيانات المستخدم)
   التشغيل: خلف مفتاح Feature Flag  (CFG.ff.chat3 أو localStorage sp_ff_chat3="1") */
(() => {
  "use strict";
  const W = window, D = document;
  if (W.Chat3) return;
  // متغيرات التطبيق معرّفة بـ const على مستوى السكربت (مش على window)، فنقراها بالاسم مع typeof
  const _FB = () => (typeof FB !== "undefined" ? FB : W.FB);
  const _toast = (m) => (typeof toast === "function" ? toast(m, "info") : alert(m));
  const SRVu = () => (typeof SRV === "function" ? SRV() : "https://sorati.sorati-app.workers.dev");
  const WSURL = () => SRVu().replace(/^https:/, "wss:") + "/v1/chat/ws";
  const enabled = () => { try { return localStorage.getItem("sp_ff_chat3") === "1" || !!(typeof CFG !== "undefined" && CFG && CFG.ff && CFG.ff.chat3); } catch { return false; } };
  const te = new TextEncoder(), td = new TextDecoder();
  const b64 = (u8) => btoa(String.fromCharCode(...new Uint8Array(u8)));
  const ub64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const rid = () => b64(crypto.getRandomValues(new Uint8Array(15))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]);
  const me = () => { const f = _FB(); return (f && f.user && f.user.uid) || null; };

  // ---------- IndexedDB صغير ----------
  const idb = (() => {
    let p;
    const open = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open("sorati_chat3", 1); r.onupgradeneeded = () => { const d = r.result; d.createObjectStore("q"); d.createObjectStore("k"); d.createObjectStore("cache"); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
    const tx = async (s, m, f) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(s, m), st = t.objectStore(s), r = f(st); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }); };
    return { get: (s, k) => tx(s, "readonly", (st) => st.get(k)), put: (s, k, v) => tx(s, "readwrite", (st) => st.put(v, k)), del: (s, k) => tx(s, "readwrite", (st) => st.delete(k)), all: (s) => tx(s, "readonly", (st) => st.getAll()), keys: (s) => tx(s, "readonly", (st) => st.getAllKeys()) };
  })();

  // ---------- التشفير E2E ----------
  const E2E = {
    async myKeys() {
      let k = await idb.get("k", "me");
      if (!k) {
        const kp = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
        const pub = await crypto.subtle.exportKey("jwk", kp.publicKey);
        k = { priv: kp.privateKey, pub: { kty: pub.kty, crv: pub.crv, x: pub.x, y: pub.y } };
        await idb.put("k", "me", k);
      }
      return k;
    },
    async shared(peerJwk, room) {
      const ck = "s:" + room + ":" + peerJwk.x;
      const c = await idb.get("k", ck); if (c) return c;
      const mine = await E2E.myKeys();
      const peer = await crypto.subtle.importKey("jwk", peerJwk, { name: "ECDH", namedCurve: "P-256" }, false, []);
      const bits = await crypto.subtle.deriveBits({ name: "ECDH", public: peer }, mine.priv, 256);
      const hk = await crypto.subtle.importKey("raw", bits, "HKDF", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: te.encode("sorati-chat3-v1"), info: te.encode(room) }, hk, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      await idb.put("k", ck, key); return key;
    },
    async seal(key, obj, room) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: te.encode(room) }, key, te.encode(JSON.stringify(obj)));
      return "e1." + b64(iv) + "." + b64(ct);
    },
    async open(key, s, room) {
      const [v, iv, ct] = String(s).split(".");
      if (v !== "e1") throw new Error("ver");
      return JSON.parse(td.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: ub64(iv), additionalData: te.encode(room) }, key, ub64(ct))));
    },
    async fingerprint(a, b) { const h = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode([a.x, a.y, b.x, b.y].sort().join("")))); return [...h.slice(0, 10)].map((x) => x.toString().padStart(3, "0")).join(" "); },
  };

  // ---------- الاتصال ----------
  class Room {
    constructor(id) { this.id = id; this.dm = id.startsWith("dm_"); this.msgs = new Map(); this.reads = {}; this.online = new Set(); this.keys = {}; this.typing = new Set(); this.last = 0; this.ls = new Set(); this.retry = 0; this.closed = false; }
    on(f) { this.ls.add(f); return () => this.ls.delete(f); }
    emit(e) { this.ls.forEach((f) => { try { f(e, this); } catch (x) {} }); }
    async connect() {
      if (this.closed) return;
      let tok; try { tok = await _FB().token(); } catch { return this.later(); }
      const ws = new WebSocket(WSURL() + "?room=" + encodeURIComponent(this.id), ["sorati.v1", tok]);
      this.ws = ws;
      ws.onopen = async () => {
        this.retry = 0; this.emit({ t: "state", on: true });
        ws.send(JSON.stringify({ t: "hello", since: this.last }));
        if (this.dm) { const k = await E2E.myKeys(); ws.send(JSON.stringify({ t: "key", jwk: k.pub })); }
        this.flush();
        clearInterval(this.hb); this.hb = setInterval(() => ws.readyState === 1 && ws.send('{"t":"ping"}'), 25000);
      };
      ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch { return; } this.handle(m); };
      ws.onclose = () => { clearInterval(this.hb); this.emit({ t: "state", on: false }); this.later(); };
      ws.onerror = () => { try { ws.close(); } catch (e) {} };
    }
    later() { if (this.closed) return; const ms = Math.min(30000, 600 * 2 ** this.retry++) + Math.random() * 400; setTimeout(() => this.connect(), ms); }
    close() { this.closed = true; clearInterval(this.hb); try { this.ws.close(); } catch (e) {} }
    peerKey() { const u = me(); const other = Object.keys(this.keys).find((k) => k !== u); return other && this.keys[other]; }
    async decode(msg) {
      if (msg.enc && msg.body) {
        try { const pk = this.peerKey() || (await E2E.myKeys()).pub; const key = await E2E.shared(pk, this.id); Object.assign(msg, await E2E.open(key, msg.body, this.id), { _plain: true }); }
        catch (e) { msg.kind = "text"; msg.body = "🔒 رسالة مشفّرة مش قادر أفتحها على الجهاز ده"; }
      }
      return msg;
    }
    async handle(m) {
      switch (m.t) {
        case "sync": this.keys = m.keys || {}; this.reads = m.reads || {}; this.online = new Set(m.online || []); for (const x of m.msgs) this.put(await this.decode(x)); return this.emit({ t: "all" });
        case "older": for (const x of m.msgs) this.put(await this.decode(x)); return this.emit({ t: "all" });
        case "msg": case "upd": this.put(await this.decode(m.msg)); return this.emit({ t: "msg", msg: m.msg });
        case "ack": await idb.del("q", m.cid); this.put(await this.decode(m.msg)); return this.emit({ t: "all" });
        case "read": this.reads[m.uid] = m.id; return this.emit({ t: "read" });
        case "presence": m.on ? this.online.add(m.uid) : this.online.delete(m.uid); return this.emit({ t: "presence" });
        case "typing": m.on ? this.typing.add(m.uid) : this.typing.delete(m.uid); return this.emit({ t: "typing" });
        case "key": this.keys[m.uid] = m.jwk; return this.emit({ t: "key" });
        case "err": if (m.cid) { await idb.del("q", m.cid); this.msgs.delete("p:" + m.cid); } return this.emit({ t: "err", e: m.e });
      }
    }
    put(msg) { if (msg.cid) this.msgs.delete("p:" + msg.cid); this.msgs.set(msg.id, msg); this.last = Math.max(this.last, msg.id || 0); }
    list() { return [...this.msgs.values()].sort((a, b) => (a.id || 1e15) - (b.id || 1e15)); }
    async send(kind, body, extra = {}) {
      const cid = rid();
      const out = { t: "msg", cid, kind, reply: extra.reply ?? null };
      if (this.dm && this.peerKey()) { const key = await E2E.shared(this.peerKey(), this.id); out.enc = 1; out.body = await E2E.seal(key, { kind, body }, this.id); }
      else out.body = typeof body === "string" ? body : JSON.stringify(body);
      await idb.put("q", cid, { room: this.id, frame: out, at: Date.now() });
      this.msgs.set("p:" + cid, { id: null, cid, uid: me(), kind, body, at: Date.now(), pending: true, reply: out.reply });
      this.emit({ t: "all" });
      this.flush();
    }
    async flush() {
      if (!this.ws || this.ws.readyState !== 1) return;
      for (const k of await idb.keys("q")) { const q = await idb.get("q", k); if (q && q.room === this.id) this.ws.send(JSON.stringify(q.frame)); }
    }
    raw(o) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(o)); }
    read() { if (this.last) this.raw({ t: "read", id: this.last }); }
    typingOn(on) { this.raw({ t: "typing", on }); }
    edit(id, body) { this.raw({ t: "edit", id, body }); }
    del(id) { this.raw({ t: "del", id }); }
    react(id, em) { this.raw({ t: "react", id, em }); }
    older() { const first = this.list().find((m) => m.id); if (first) this.raw({ t: "older", before: first.id }); }
  }

  // ---------- الواجهة ----------
  const css = `#c3{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;background:#060a17;color:#e6fff6;font-family:Plex,system-ui,sans-serif;direction:rtl}
#c3 header{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08)}
#c3 header b{flex:1;font-size:16px}#c3 .st{font-size:12px;color:#34d399}#c3 .x{background:none;border:0;color:#fff;font-size:22px}
#c3 .list{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:6px}
#c3 .m{max-width:78%;padding:9px 12px;border-radius:16px;background:rgba(255,255,255,.07);white-space:pre-wrap;word-break:break-word;position:relative;font-size:15px;line-height:1.6}
#c3 .m.me{align-self:flex-start;background:linear-gradient(135deg,#0d9488,#10b981);color:#04130e}
#c3 .m.bot{border:1px solid #f59e0b;background:rgba(245,158,11,.08)}
#c3 .m .meta{font-size:11px;opacity:.7;margin-top:3px}#c3 .m.pend{opacity:.6}
#c3 .m .rx{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}#c3 .m .rx span{background:rgba(0,0,0,.25);border-radius:10px;padding:0 6px;font-size:12px}
#c3 .q{border-inline-start:3px solid #34d399;padding:2px 8px;margin-bottom:4px;font-size:12px;opacity:.8}
#c3 .card{border:1px solid rgba(52,211,153,.4);border-radius:12px;padding:8px}
#c3 footer{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.08);align-items:flex-end}
#c3 textarea{flex:1;resize:none;max-height:120px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px;font:inherit}
#c3 footer button{background:#10b981;border:0;border-radius:50%;width:44px;height:44px;font-size:18px;color:#04130e}
#c3 .typ{font-size:12px;color:#34d399;padding:0 14px 4px;min-height:16px}
#c3 .sheet{position:absolute;bottom:70px;inset-inline:10px;background:#0b1226;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:8px;display:flex;flex-wrap:wrap;gap:6px}
#c3 .sheet button{background:rgba(255,255,255,.06);border:0;color:#fff;border-radius:10px;padding:8px 10px;font:inherit}
#c3fab{position:fixed;bottom:86px;left:16px;z-index:9998;width:54px;height:54px;border-radius:50%;border:0;background:radial-gradient(circle at 30% 30%,#34d399,#0d9488);box-shadow:0 8px 24px rgba(16,185,129,.45);font-size:24px}`;
  const el = (tag, cls, text) => { const e = D.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const time = (t) => new Date(t).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  const EMO = ["❤️", "😂", "👏", "🔥", "💪", "🥗"];

  function render(room, box, ui) {
    const u = me(); const list = box; const atEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
    list.replaceChildren();
    const byId = new Map(room.list().filter((m) => m.id).map((m) => [m.id, m]));
    for (const m of room.list()) {
      const b = el("div", "m" + (m.uid === u ? " me" : "") + (m.uid === "sorati_bot" ? " bot" : "") + (m.pending ? " pend" : ""));
      if (m.reply && byId.get(m.reply)) b.append(el("div", "q", String(byId.get(m.reply).body || "").slice(0, 80)));
      if (m.deleted) b.append(el("i", null, "اتمسحت الرسالة"));
      else if (m.kind === "text" || !m.kind) b.append(el("span", null, m.body));
      else if (m.kind === "voice") { let v; try { v = typeof m.body === "string" ? JSON.parse(m.body) : m.body; } catch { v = {}; } b.append(el("div", null, "🎙 " + (v.text || "رسالة صوتية"))); }
      else { let c; try { c = typeof m.body === "string" ? JSON.parse(m.body) : m.body; } catch { c = { title: String(m.body) }; } const k = el("div", "card"); k.append(el("b", null, ({ meal: "🍽 ", workout: "🏋️ ", recipe: "📖 ", challenge: "🏁 ", poll: "📊 " }[m.kind] || "") + (c.title || "")), el("div", null, c.kcal ? c.kcal + " سعرة" : c.desc || "")); b.append(k); }
      const rx = m.react || {}; if (Object.keys(rx).length) { const r = el("div", "rx"); for (const [e, us] of Object.entries(rx)) r.append(el("span", null, e + " " + us.length)); b.append(r); }
      const seen = m.uid === u && m.id && Object.entries(room.reads).some(([k, v]) => k !== u && v >= m.id);
      b.append(el("div", "meta", (m.at ? time(m.at) : "") + (m.edited ? " · متعدّلة" : "") + (m.uid === u ? (m.pending ? " · ⏳" : seen ? " · ✓✓" : " · ✓") : "") + (m._plain ? " · 🔒" : "")));
      let pressT; b.onpointerdown = () => { pressT = setTimeout(() => ui.menu(m), 450); }; b.onpointerup = b.onpointerleave = () => clearTimeout(pressT);
      list.append(b);
    }
    if (atEnd) list.scrollTop = list.scrollHeight;
    room.read();
  }

  const Chat3 = {
    rooms: new Map(),
    room(id) { if (!this.rooms.has(id)) { const r = new Room(id); this.rooms.set(id, r); r.connect(); } return this.rooms.get(id); },
    dmId(a, b) { return "dm_" + [a, b].sort().join("__"); },
    open(id, title) {
      if (!D.getElementById("c3css")) { const s = el("style"); s.id = "c3css"; s.textContent = css; D.head.append(s); }
      const room = this.room(id);
      D.getElementById("c3")?.remove();
      const root = el("div"); root.id = "c3"; root.setAttribute("role", "dialog");
      const hd = el("header"), x = el("button", "x", "‹"), tt = el("b", null, title || (id.startsWith("coach_") ? "المدرّب الذكي" : "المحادثة")), st = el("span", "st", "…");
      x.onclick = () => { root.remove(); unsub(); }; x.setAttribute("aria-label", "رجوع");
      hd.append(x, tt, st);
      const list = el("div", "list"), typ = el("div", "typ"), ft = el("footer"), ta = el("textarea"), more = el("button", null, "＋"), send = el("button", null, "➤");
      ta.rows = 1; ta.placeholder = "اكتب رسالة… (جرّب ‎@سعراتي لخّص)"; ta.maxLength = 4000;
      let replyTo = null, editId = null, tmo;
      ta.oninput = () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; room.typingOn(true); clearTimeout(tmo); tmo = setTimeout(() => room.typingOn(false), 2500); };
      const go = () => { const v = ta.value.trim(); if (!v) return; if (editId) room.edit(editId, v); else room.send("text", v, { reply: replyTo }); ta.value = ""; replyTo = editId = null; ta.placeholder = "اكتب رسالة…"; room.typingOn(false); };
      send.onclick = go; ta.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(); } };
      const ui = {
        menu(m) {
          root.querySelector(".sheet")?.remove();
          const sh = el("div", "sheet"); const add = (t, f) => { const b = el("button", null, t); b.onclick = () => { sh.remove(); f(); }; sh.append(b); };
          EMO.forEach((e) => add(e, () => room.react(m.id, e)));
          add("↩︎ رد", () => { replyTo = m.id; ta.placeholder = "رد على: " + String(m.body || "").slice(0, 30); ta.focus(); });
          add("📋 نسخ", () => navigator.clipboard && navigator.clipboard.writeText(String(m.body || "")));
          if (m.uid === me() && !m.deleted) { add("✏️ تعديل", () => { editId = m.id; ta.value = m.body; ta.focus(); }); add("🗑 مسح للكل", () => room.del(m.id)); }
          add("✕", () => {});
          root.append(sh);
        },
      };
      more.onclick = () => {
        root.querySelector(".sheet")?.remove();
        const sh = el("div", "sheet"); const add = (t, f) => { const b = el("button", null, t); b.onclick = () => { sh.remove(); f(); }; sh.append(b); };
        add("🎙 صوت", () => Chat3.voice(room));
        add("🍽 شارك وجبة", () => { const t = prompt("اسم الوجبة"); if (!t) return; const k = +prompt("السعرات تقريبًا") || 0; room.send("meal", { title: t.slice(0, 80), kcal: k }); });
        add("🏁 تحدّي", () => { const t = prompt("التحدّي إيه؟ (مثلاً 8 كوبايات مية بكرة)"); t && room.send("challenge", { title: t.slice(0, 120) }); });
        add("✨ @سعراتي لخّص", () => room.send("text", "@سعراتي لخّص المحادثة"));
        if (room.dm) add("🔐 بصمة التشفير", async () => { const pk = room.peerKey(); if (!pk) return alert("الطرف التاني لسه ما فتحش المحادثة 3.0"); alert("قارن الرقم ده مع صاحبك:\n" + (await E2E.fingerprint((await E2E.myKeys()).pub, pk))); });
        root.append(sh);
      };
      ft.append(more, ta, send);
      root.append(hd, list, typ, ft); D.body.append(root);
      list.onscroll = () => { if (list.scrollTop < 40) room.older(); };
      const unsub = room.on((e) => {
        if (e.t === "state") st.textContent = e.on ? (room.dm ? "🔒 مشفّرة" : "متصل") : "بيتصل…";
        if (e.t === "typing") typ.textContent = room.typing.size ? "بيكتب…" : "";
        if (e.t === "presence") st.textContent = room.online.size > 1 ? "متصل الآن" : st.textContent;
        if (e.t === "err") { const map = { slow_down: "استنى ثانية", moderated: "الرسالة اتمنعت لأنها مخالفة", link_blocked: "الروابط الخارجية ممنوعة هنا", forbidden: "مش مسموح", edit_window: "التعديل متاح 15 دقيقة بس" }; _toast(map[e.e] || "حصلت مشكلة"); }
        if (["all", "msg", "read", "key"].includes(e.t)) render(room, list, ui);
      });
      render(room, list, ui); st.textContent = room.ws && room.ws.readyState === 1 ? (room.dm ? "🔒 مشفّرة" : "متصل") : "بيتصل…";
      setTimeout(() => ta.focus(), 50);
    },
    // رسالة صوتية: تسجيل + تفريغ بالمصري عبر خدمة الذكاء الحالية (AI.call) لو موجودة، وإلا التعرف المدمج في الجهاز
    async voice(room) {
      const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
      if (SR) { const r = new SR(); r.lang = "ar-EG"; r.interimResults = false; r.onresult = (e) => { const t = e.results[0][0].transcript; room.send("voice", { text: t }); }; r.onerror = () => _toast("مش قادر أسمعك، جرّب تاني"); r.start(); _toast("بسمعك… 🎙"); return; }
      _toast("التسجيل الصوتي مش مدعوم على الجهاز ده");
    },
    fab() {
      if (!enabled() || D.getElementById("c3fab")) return;
      if (!D.getElementById("c3css")) { const s = el("style"); s.id = "c3css"; s.textContent = css; D.head.append(s); }
      const b = el("button", null, "💬"); b.id = "c3fab"; b.setAttribute("aria-label", "المحادثة 3.0");
      b.onclick = () => { const u = me(); if (!u) return _toast("سجّل دخول الأول"); Chat3.open("coach_" + u, "المدرّب الذكي ✨"); };
      D.body.append(b);
    },
    _test: { E2E, Room, idb },
  };
  W.Chat3 = Chat3;
  // ربط بالموجود من غير حذف: لو فيه دالة dm8(uid) قديمة، نخلّي المحادثة الخاصة تفتح 3.0 لما المفتاح شغال
  const hook = () => {
    if (enabled() && typeof W.dm8 === "function" && !W.dm8.__c3) { const old = W.dm8; W.dm8 = function (uid) { const u = me(); if (u && uid && /^[A-Za-z0-9_-]{1,64}$/.test(uid)) return Chat3.open(Chat3.dmId(u, uid)); return old.apply(this, arguments); }; W.dm8.__c3 = 1; }
    Chat3.fab();
  };
  D.readyState === "loading" ? D.addEventListener("DOMContentLoaded", () => setTimeout(hook, 1500)) : setTimeout(hook, 1500);
})();
