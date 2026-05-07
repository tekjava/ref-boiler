# RB-M001 — Hardest Decision

**What was the hardest decision here?**

How to carry the affiliate's FirstPromoter auth token through the middleware without re-architecting Express's type system.

Two options:

1. **Extend `Request` globally** via `declare global { namespace Express { interface Request { affiliateId: string; affiliateToken: string; } } }` — cleaner call sites, but bleeds into every route handler signature and silently allows omitting the `authenticate` middleware.

2. **Extend `Request` as a local interface (`AuthenticatedRequest`) and cast inside route handlers** — explicit at the point of use, keeps the auth boundary visible, and fails loudly if you try to hit an affiliate endpoint without going through `authenticate` first.

Chose option 2. The cast (`req as AuthenticatedRequest`) is a local, deliberate claim that the middleware has already run. If `authenticate` is ever absent, `req.affiliateToken` is `undefined` at runtime and the FP call fails with a clear 401 from FirstPromoter — still a recoverable, observable failure rather than a silent type hole.

**Constraint preserved:** `FIRSTPROMOTER_API_KEY` is only read inside `src/services/firstPromoter.ts`, which runs server-side only. No token ever transits to the mobile client.
