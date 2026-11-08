/* سعراتي 37.1 — الدخول بجوجل بضغطة (زي بلاي).
   Android.googlePick(webClientId) بيفتح منتقي حسابات النظام، والتطبيق بياخد توكن هوية من جوجل للحساب المختار،
   وبعدين Firebase signInWithIdp → refreshToken → نفس onNativeAuth بتاع التطبيق.
   لو أي حاجة فشلت (أو التطبيق قديم مفيهوش googlePick): بيرجع لطريقة المتصفح القديمة تلقائي. الإلغاء = ولا حاجة. */
(() => {
  "use strict";
  const W = window, D = document;
  const CID = "15955288059-mn0p6k68bjme6ko4bpm6fletgpga3f2g.apps.googleusercontent.com";
  const has = () => !!(W.Android && typeof Android.googlePick === "function") && CID.indexOf("apps.googleusercontent.com") > 0;
  const say = (m, i) => { try { toast(m, i || "user"); } catch (e) {} };
  let busy = 0, fallback = null, guard = 0;

  async function idp(tok) {
    const F = getFB(), key = (F && F.key) || "";
    const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=" + encodeURIComponent(key), {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ postBody: "id_token=" + encodeURIComponent(tok) + "&providerId=google.com", requestUri: "http://localhost", returnSecureToken: true, returnIdpCredential: true }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.refreshToken) throw new Error((j.error && j.error.message) || "HTTP " + r.status);
    return j;
  }
  function fail(e, f) {
    try { localStorage.setItem("s37_gsi_err", JSON.stringify({ e: String(e).slice(0, 200), at: Date.now() })); } catch (x) {}
    if (f) { say("هنكمّل من المتصفح"); setTimeout(f, 300); }
  }
  W.__gsi37 = async (res) => {
    busy = 0; clearTimeout(guard); const f = fallback; fallback = null;
    if (!res || !res.ok) { if (res && res.e === "cancel") return; return fail(res && res.e, f); }
    try {
      say("بسجّل دخولك…");
      const j = await idp(res.t);
      try { localStorage.setItem("sp_lastAuth", JSON.stringify({ m: "google", u: "" })); localStorage.removeItem("s37_gsi_err"); } catch (e) {}
      try { W.Android && Android.haptic && Android.haptic("success"); } catch (e) {}
      try { closeM(); } catch (e) {}
      if (typeof W.onNativeAuth === "function") await W.onNativeAuth(j.refreshToken);
      else { const F = getFB(); await F.setRT(j.refreshToken); location.reload(); }
    } catch (e) { fail("idp:" + (e && e.message), f); }
  };
  function go(f) {
    if (!has()) return f();
    if (busy) return;
    busy = 1; fallback = f;
    guard = setTimeout(() => { if (busy) { busy = 0; fallback = null; } }, 120000);
    try { Android.googlePick(CID); } catch (e) { busy = 0; fallback = null; fail("bridge:" + e, f); }
  }
  W.GSI37 = { available: has, login: (f) => go(f || (() => {})), lastError: () => { try { return JSON.parse(localStorage.getItem("s37_gsi_err")); } catch (e) { return null; } } };

  // برو: زرار «المتابعة بحساب جوجل» (v29 بيحط عليه l29-g)
  D.addEventListener("click", (e) => {
    const b = e.target && e.target.closest && e.target.closest(".l29-g");
    if (!b || b.__g37pass || !has()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    go(() => { b.__g37pass = 1; try { b.click(); } finally { b.__g37pass = 0; } });
  }, true);

  // الأدمن: FB.login('admin') · برو: FB.googleLogin (الطريقة القديمة بالمتصفح) → الأول بنجرّب الدخول بضغطة
  const getFB = () => { try { return W.FB || (0, eval)("typeof FB !== 'undefined' ? FB : null"); } catch (e) { return null; } };
  function wrap() {
    const FB = getFB(); if (!FB) return false;
    const isAdm = W.BUILD && BUILD.app === "admin", k = isAdm ? "login" : "googleLogin";
    const o = FB[k]; if (typeof o !== "function" || o.__g37) return !!o;
    const w = function () { const self = this, a = arguments; return go(() => o.apply(self, a)); };
    w.__g37 = 1; FB[k] = w; return true;
  }
  let n = 0; const t = setInterval(() => { wrap(); if (++n > 120) clearInterval(t); }, 250); // بيعيد اللف لو حد غيّر FB.login بعدنا
})();
