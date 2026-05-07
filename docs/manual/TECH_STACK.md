# Tech Stack

> **Status:** Authored
> **Tier:** 1 Manual
> **Audience:** Engineering
> **Module:** platform
> **Last updated:** 2026-05-06

## Approved stack

| Concern | Technology | Rationale |
|---|---|---|
| Mobile framework | React Native + Expo | Single codebase for iOS and Android. Strong QR and camera library support. Expo Go enables fast iteration without native builds. Extractable as boilerplate without framework assumptions. |
| Middleware | Node.js + Express | Pure API proxy — no web pages, no SSR, no routing framework needed. Lightweight and portable. No Next.js assumptions baked into the boilerplate. If a web admin is needed later, that is a separate app. |
| Auth | JWT | Stateless, mobile-friendly, works across middleware and app. API key stays server-side only. |
| Affiliate platform | FirstPromoter v2 API | Full affiliate-facing and admin API surface. Tax, compliance, payout, fraud — all handled. QR and field tooling are the gap this app fills. |
| QR generation | react-native-qrcode-svg | Native SVG rendering, no canvas limitations, works offline. |
| Navigation | Expo Router | File-based routing. Consistent with Expo ecosystem. |
| State / data fetching | React Query (TanStack) | Server state, caching, background refresh. Avoids prop drilling for API data. |
| Language | TypeScript | Required across all layers. No plain JS files. |
| Linting | ESLint + Prettier | Enforced in CI. No merge without passing lint. |

## What is not approved

| Technology | Reason |
|---|---|
| Next.js (as middleware) | Web framework overhead with no benefit for a mobile-only API proxy |
| Flutter | Different language (Dart), different ecosystem, harder to extract as a JS boilerplate |
| Redux | Overhead not justified for this data surface. React Query handles server state. |
| Expo Go for production | Expo Go is for development only. Production builds use EAS Build. |
| Firebase Auth | Adds vendor dependency. JWT + middleware is sufficient and portable. |

## Adding to the approved stack

Any new dependency requires:

1. A rationale entry in this document
2. An ADR if it touches the boilerplate boundary (auth, middleware, mobile framework)
3. A PR that includes the updated `TECH_STACK.md`

No dependency is added without a documented reason.
