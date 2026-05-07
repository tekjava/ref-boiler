# ADR-001 — Tech Stack Decisions

> **Status:** Accepted
> **Tier:** 2.5 Architecture
> **Audience:** Engineering
> **Derived from:** PLAN_001
> **Last updated:** 2026-05-06

---

## Context

These decisions were made during the planning phase of `ref-boiler`. They are locked. Any reversal requires a new ADR with explicit rationale and sign-off before implementation changes.

---

## Decision 1 — React Native + Expo over Flutter

**Decision:** React Native with Expo SDK is the mobile framework.

**Rationale:**
- Single TypeScript codebase across iOS and Android — consistent with the rest of the stack
- Expo Router provides file-based navigation with minimal configuration
- `react-native-qrcode-svg` and camera libraries are mature and well-maintained
- Expo Go enables fast development iteration without native builds
- EAS Build handles production iOS and Android builds from the same config
- The boilerplate is more portable for JS-native teams

**Rejected:** Flutter (Dart language, separate ecosystem, incompatible with JS boilerplate extraction)

---

## Decision 2 — Node.js + Express over Next.js for middleware

**Decision:** The API proxy layer is a standalone Node.js + Express server written in TypeScript.

**Rationale:**
- The middleware has exactly one job: proxy requests from the mobile app to FirstPromoter with server-side API key injection
- Next.js is a web framework — it provides SSR, page routing, and static generation, none of which are needed for a mobile API proxy
- Adding Next.js would introduce framework assumptions (pages directory, web routing conventions) that make the boilerplate harder to reason about and extract
- Express is lightweight, portable, and carries no web UI assumptions
- If a web admin dashboard is built later, it is a separate application — not served from the same Node.js process

**Rejected:** Next.js API routes (web framework overhead with no benefit for this use case)

---

## Decision 3 — JWT for mobile auth

**Decision:** The mobile app authenticates to the middleware via JWT stored in Expo SecureStore.

**Rationale:**
- Stateless — no session database needed in the boilerplate
- SecureStore provides hardware-backed key storage on both iOS and Android
- The middleware validates the JWT on every request before proxying to FirstPromoter
- Tokens are not stored in AsyncStorage or app state where they can be accessed by other processes

**Rejected:** Session cookies (not natural in React Native), Firebase Auth (vendor lock-in, unnecessary dependency)

---

## Decision 4 — FirstPromoter v2 API as the affiliate backend

**Decision:** FirstPromoter is the affiliate management platform. The v2 API is used exclusively (v1 is legacy).

**Rationale:**
- Provides separate affiliate-facing and admin API surfaces — the affiliate app only needs to call affiliate endpoints, reducing surface area
- Handles compliance infrastructure (W-9, 1099-NEC, 1042-S) that would otherwise require significant engineering
- Tax, payout, fraud detection, commission calculation — all handled
- v2 API uses Bearer token + Account-ID header auth, which is clean to proxy
- Business plan ($99/month) required for iframe embed; API access is available on all plans

**Rejected:** Refferq (no compliance infrastructure), building compliance from scratch (weeks of work, not a differentiator)

---

## Decision 5 — Layer boundary at Layer 2

**Decision:** The boilerplate freezes after Layer 2 (core affiliate experience) is stable. Layer 3 and Layer 4 features are built in the forked industry repo.

**Rationale:**
- Layer 1 + 2 are universal across any affiliate program in any industry
- Layer 3 (field tools: QR in-person flows, time-limited offers, VIP display, asset library) requires industry context to design well
- Layer 4 (admin) requires business-specific commission structures, campaign logic, and team workflows
- Freezing at Layer 2 maximizes boilerplate reuse and prevents industry-specific assumptions from polluting the foundation
- The Industry Setup Guide gates the transition, ensuring the fork starts from a clear baseline

**Rejected:** Building all four layers into the boilerplate (forces vertical assumptions; breaks reusability)

---

## Decision 6 — React Query for server state

**Decision:** TanStack React Query manages all server state in the mobile app.

**Rationale:**
- Handles caching, background refresh, loading and error states with minimal boilerplate
- Works naturally with the middleware API pattern (base URL configured once)
- Avoids Redux overhead for what is fundamentally a read-heavy, API-driven UI
- Standard across React and React Native ecosystems

**Rejected:** Redux (overhead not justified), SWR (weaker React Native support), raw useEffect fetching (no caching, no deduplication)
