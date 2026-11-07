# ROADMAP — سعراتي / Sorati

> آخر تحديث: 2026-11-07 (التشغيل الأول · first run)

## Audit findings (run 1)

**What this repo is:** `FY881/sorati` is a *showcase-only* repository: `README.md` (483 lines, AR/EN), `assets/` (framed screenshots, GIFs, SVGs), `.gitignore`. It contains **no app source, no website source, no tests, no CI, no Firebase config/rules, no build scripts**. History: one commit.

**Consequences**
- The items in the mission (TDEE/nutrition math, food DB, sync, Firebase rules, APK SHA-256 on the site, /foods /calc /releases pages) live somewhere else (private repo / local machine). They **cannot be audited or fixed from here**.
- No secrets were found in the README (grepped for `AIza`, `apikey`, `secret`, `token`).
- README says "release: coming soon" and "Cloudflare Workers + Gemini free tier", while the brief mentions Firebase Hosting (`sorati-610ba.web.app`) and an APK. Messaging should be reconciled once the real release exists.
- `.gitignore` references `PUSH.md` and `_build/` — local tooling that is not versioned.

## Blocked on the owner (needed to continue)
1. Give the agent access to the repo(s) holding the Android app, the web app (`/app/`), the landing site and the Firebase config (or add them here).
2. Confirm where deployment happens (Firebase Hosting from which branch? APK built where?).

## Prioritized backlog (once source is available)
1. **Correctness/safety:** audit BMR/TDEE ("metabolic twin"), macro split, fasting/Ramadan timing; add unit tests with known reference values (Mifflin-St Jeor, Katch-McArdle).
2. **Security/privacy:** review `firestore.rules` / `storage.rules`, auth, admin-app access, health-data exposure; check API keys are restricted (Firebase web keys are public by design but must be restricted + rules-protected).
3. **APK integrity:** publish SHA-256 on `/releases/` generated automatically in CI.
4. **Tests + CI:** add a CI workflow running tests/build on every PR.
5. **Food data:** validate Egyptian/Arab food DB (kcal = 4P+4C+9F within tolerance, duplicates, units).
6. **UX/SEO/perf:** RTL polish, accessibility, Lighthouse, structured data, `hreflang` for `/en/`.
7. **Docs/DX:** README → real developer docs, contribution guide.

## Done
- [x] Run 1: audit + this roadmap (this PR).
