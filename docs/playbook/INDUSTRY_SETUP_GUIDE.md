# Industry Setup Guide

> **Status:** Authored
> **Tier:** 2.7 Playbook
> **Audience:** Engineering + Product
> **Module:** platform
> **Last updated:** 2026-05-06

---

## Purpose

This guide walks you through the transition from the `ref-boiler` boilerplate to a custom industry-specific affiliate mobile app. It is the gate between the boilerplate and the vertical build.

Do not begin the industry build without completing this guide. It exists to prevent industry assumptions from entering the boilerplate and to ensure the fork starts from a clear, intentional baseline.

---

## What you are starting from

Before you fork, understand exactly what the boilerplate ships. This is Layer 1 + Layer 2, complete and frozen.

### Middleware (`middleware/`)

An Express + TypeScript server that proxies all FirstPromoter v2 API calls. The affiliate app never talks to FirstPromoter directly.

**Routes:**
| Method | Path | FP endpoint |
|---|---|---|
| `POST` | `/auth/login` | FP `/affiliate/auth/sign_in` |
| `GET` | `/affiliate/me` | FP `/affiliate/promoters/me` |
| `GET` | `/affiliate/referrals` | FP `/affiliate/referrals` |
| `GET` | `/affiliate/commissions` | FP `/affiliate/commissions` |
| `GET` | `/affiliate/payouts` | FP `/affiliate/payouts` |
| `GET` | `/affiliate/promo-codes` | FP `/affiliate/promo_codes` |
| `GET` | `/affiliate/referral-links` | FP `/affiliate/referral_links` |
| `GET` | `/affiliate/campaigns` | FP `/affiliate/campaigns` |
| `GET` | `/affiliate/reports` | FP `/affiliate/reports` |
| `GET` | `/health` | (local) |

**Middleware stack per request:**
1. `authenticate.ts` — validates JWT, extracts `affiliateId` and `affiliateToken`
2. `rateLimiter.ts` — 60 requests/minute per authenticated affiliate
3. Route handler — calls `firstPromoter.ts` service, returns data
4. `errorHandler.ts` — normalises FP errors to `{ code, message, status }`

**Environment variables (from `.env.example`):**
```
FIRSTPROMOTER_API_KEY=      ← never exposed to the client
FIRSTPROMOTER_ACCOUNT_ID=
JWT_SECRET=
PORT=3001
```

### Mobile app (`mobile/`)

An Expo Router + TypeScript app with three tab screens, a full auth flow, and React Query for all server state.

**Navigation structure:**
```
(auth)/
  login.tsx           ← email + password → JWT → SecureStore
  forgot-password.tsx ← delegates to FP email reset

(app)/
  (tabs)/
    index.tsx         ← Dashboard: balance, referrals, commissions, referral link
    qr.tsx            ← QR code: render, share link, share image, save to photos
    earnings.tsx      ← Commissions | Payouts segment, FlatList rows
```

**Key files:**
| File | Purpose |
|---|---|
| `store/authStore.tsx` | SecureStore primitives + `AuthProvider` + `useAuth()` |
| `services/api.ts` | Axios client, JWT injection, all middleware fetch functions |
| `constants/config.ts` | `EXPO_PUBLIC_MIDDLEWARE_URL` (defaults to `http://localhost:3001`) |
| `hooks/useAffiliate.ts` | `useAffiliate()`, `useReferralLinks()`, `useReports()` |
| `hooks/useCommissions.ts` | `useCommissions()` |
| `hooks/usePayouts.ts` | `usePayouts()` |
| `components/AffiliateCard.tsx` | Name + email header |
| `components/QRDisplay.tsx` | `react-native-qrcode-svg` wrapper |
| `components/CommissionRow.tsx` | Amount, status badge, date, referral email |
| `components/PayoutRow.tsx` | Amount, status badge, date |

---

## Step 1 — Fork the repo

```bash
# Clone ref-boiler as your new repo
git clone https://github.com/your-org/ref-boiler.git my-industry-app
cd my-industry-app

# Re-point to your new remote
git remote remove origin
git remote add origin https://github.com/your-org/my-industry-app.git
git push -u origin main
```

Tag the fork point so you always know your baseline:

```bash
git tag v1.0.0-boilerplate
git push origin v1.0.0-boilerplate
```

---

## Step 2 — Get it running

Complete this before writing a single line of industry code. You need a verified connection to FirstPromoter before you can make any meaningful product decisions.

### 2a — Middleware

```bash
cd middleware
cp .env.example .env
```

Fill in `.env`:
```
FIRSTPROMOTER_API_KEY=your_fp_api_key_here
FIRSTPROMOTER_ACCOUNT_ID=your_fp_account_id_here
JWT_SECRET=a_long_random_string_min_32_chars
PORT=3001
```

Your FP API key is in the FirstPromoter dashboard under **Settings → API**. Your Account ID is in the URL when logged in (`app.firstpromoter.com/accounts/ACCOUNT_ID/...`).

```bash
npm install
npm run dev
```

Verify it's up:
```bash
curl http://localhost:3001/health
# → {"status":"ok"}
```

### 2b — Mobile

```bash
cd mobile
```

Create `.env.local`:
```
EXPO_PUBLIC_MIDDLEWARE_URL=http://localhost:3001
```

On a physical device, `localhost` won't reach your Mac. Use your local IP instead:
```
EXPO_PUBLIC_MIDDLEWARE_URL=http://192.168.1.X:3001
```

```bash
npm install
npx expo start
```

### 2c — Dev build requirement (read this before testing on device)

**Some features in the boilerplate do not work in Expo Go.** They require a custom development build.

| Feature | Works in Expo Go | Requires dev build |
|---|---|---|
| Login, auth flow | ✅ | |
| Dashboard, earnings | ✅ | |
| QR code render | ✅ | |
| Share link (URL) | ✅ | |
| Share QR as image | ❌ | `react-native-view-shot` |
| Save to photos | ❌ | `expo-media-library` |

To run the full feature set, build a development client:

```bash
# iOS simulator
npx expo run:ios

# Android emulator
npx expo run:android

# Physical device via EAS Build (requires EAS account)
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

This is a one-time setup cost. Once you have a dev build installed on your test device, iterating is as fast as Expo Go — the Metro bundler hot-reloads through the dev build.

### 2d — Verify the connection

1. Open the app on your device/simulator
2. Log in with a real FirstPromoter affiliate account (not admin credentials — use an affiliate login)
3. Dashboard should populate with real earnings and referral data
4. Navigate to the QR tab — the affiliate's referral URL should render as a scannable QR code
5. Navigate to Earnings — commissions and payouts should appear

If the dashboard loads but shows empty data, the affiliate account may have no transactions yet. That's expected. Create a test referral in FirstPromoter to verify the data pipeline end-to-end.

---

## Step 3 — Industry discovery

Answer all of these before writing a BRIEF. The answers determine your Layer 3 feature list. Skip a question only if it genuinely does not apply — gaps here surface as scope creep mid-build.

### About your affiliates

- Where do your affiliates spend most of their time? (events, offices, retail, outdoors, field sales)
- How do they currently share your product or service with prospects?
- What is the single most common in-person scenario where a referral happens?
- How technically comfortable are your affiliates? (Will they understand "tap to copy referral link" or do you need to simplify further?)
- What would make them look more credible or professional to a prospect in that moment?
- What information do they most often not have when they need it?
- Do affiliates work alone or in teams? Is there any need for affiliate-to-affiliate visibility?

### About your offers

- Do you run time-limited promotions? How often and how many simultaneously?
- Do you have different offer tiers for different affiliates or campaigns?
- Do affiliates have any ability to customize offers, or does your team set everything?
- Is there a VIP or top-performer status you want to visibly reward in the app?
- Are promo codes used, or are referral links the primary mechanism?

### About your referral flow

- What happens immediately after a prospect clicks a referral link? (signup form, product page, demo booking)
- How long is the attribution window? (How long does a referral stay tracked after the click?)
- Are referrals tracked by email address, device fingerprint, or cookie?
- Do affiliates get real-time feedback when a referral converts, or only when commissions are approved?

### About your admin workflow

- Who approves commissions — automated rules or manual human review?
- How many campaigns do you run simultaneously?
- Do different affiliates belong to different campaigns?
- What does your team need to see day-to-day to manage the program?
- Does your team need mobile admin access, or is web-only acceptable?

### About your brand

- Logo file (SVG preferred, PNG acceptable)
- Primary color hex, secondary color hex
- Any existing design system or component library your team uses?
- Tone: professional, casual, high-energy, trust-focused?
- Are there any existing brand guidelines documents?

---

## Step 4 — Layer 3 planning (field tools)

Layer 3 features are the tools that make the app valuable *in the moment* — while your affiliate is standing in front of a prospect. Plan them from the discovery answers, not from a list of things that sound good.

### Decision framework

For each potential Layer 3 feature, answer:

1. **What specific field scenario does this solve?** (Name the situation — "affiliate at a trade show booth talking to a prospect")
2. **What does the affiliate need to do that they currently cannot?** (Be concrete — "show a time-limited discount code that expires tonight")
3. **What FP endpoint powers it?** (If no FP endpoint exists for the data, is it stored somewhere else?)
4. **What does failure look like?** (If the feature doesn't work in the field, what does the affiliate do instead?)

Only build a Layer 3 feature if you can clearly answer all four.

### Common Layer 3 features

| Feature | Field scenario | FP endpoint | Notes |
|---|---|---|---|
| Time-limited promo codes | Affiliate at an event offering a live discount | `/affiliate/promo_codes` | Boilerplate already fetches promo codes — surface them with countdown |
| VIP status display | Top-performer motivation, show status to prospects | `/affiliate/promoters/me` | Tier/level data in the promoter object if configured in FP |
| Asset library | Affiliate needs branded one-pagers or pitch decks in the field | (external storage) | FP does not store assets — you need a CDN or cloud storage layer |
| In-person offer flow | Affiliate walks a prospect through a timed offer step-by-step | `/affiliate/promo_codes` | Fullscreen UX — different from the dashboard widget |
| Leaderboard | Competitive program with visible rankings | `/affiliate/reports` (all affiliates) | Requires admin API key for cross-affiliate data — Layer 4 territory |
| Push notifications | Commission approved, new campaign, payout sent | (push service) | Requires push infrastructure — Expo Notifications + a server-side job |

### How to write the Layer 3 BRIEF

1. Copy the BRIEF template from Appendix A of this guide
2. Save it as `docs/briefs/BRIEF_002_{feature-slug}.md`
3. Answer every section — do not leave gaps
4. Review the FP endpoint list in the middleware to confirm the data you need is already proxied. If not, add the route to `middleware/src/routes/affiliate.ts` and the service method to `middleware/src/services/firstPromoter.ts` first
5. Share the BRIEF with anyone who has a stake in the feature before writing the PLAN

Do not write a PLAN until the BRIEF is reviewed and signed off.

---

## Step 5 — Layer 4 planning (admin)

The boilerplate ships no admin surface. Whether you need one, what form it takes, and when to build it are decisions to make deliberately — not assumptions to carry in.

### Decision questions

- **Do you need admin on mobile or web?** Most admin workflows (approving commissions, reviewing affiliates, managing campaigns) are desk-based. A web dashboard is usually sufficient. A mobile admin surface makes sense only if your admin is also in the field.
- **What actions does admin take most frequently?** Approve commissions, onboard new affiliates, create campaigns, review fraud flags. Rank these. Build the highest-frequency action first.
- **Is admin a single person or a team?** Single admin → simpler auth. Team → roles and permissions needed.
- **How much of this does FirstPromoter's own dashboard already cover?** The FP web dashboard is functional. Before building a custom admin surface, verify that FP's native dashboard cannot do the job. Only build admin tooling where FP's native UX is genuinely insufficient for your workflow.

### Common Layer 4 surfaces

| Surface | When you need it |
|---|---|
| Commission approval queue | Manual review workflow, FP auto-approve is off |
| Affiliate onboarding flow | Custom onboarding beyond FP's default affiliate portal |
| Campaign management | Frequent campaign changes, multiple concurrent campaigns |
| Payout override | Custom payout rules on top of FP's standard flow |
| Analytics dashboard | Custom reporting beyond FP's built-in reports |

### How to write the Layer 4 BRIEF

Same process as Layer 3. Save as `docs/briefs/BRIEF_003_{admin-surface}.md`. Additional questions to answer in the brief:

- What FP admin API endpoints are needed? (Admin endpoints use a different auth header than affiliate endpoints — your middleware will need a separate auth path for admin calls)
- Is the admin surface a new app or a new section of the existing mobile app?
- Does admin require its own deployment, or does it share the existing middleware?

---

## Step 6 — Update your BASELINE.md

Replace the boilerplate milestone history with your own. Your fork starts at:

```markdown
| Milestone | Description | Shipped |
|---|---|---|
| {PROJECT}-M000 | Forked from ref-boiler v1.0.0-boilerplate | {date} |
```

Update `docs/architecture/BASELINE.md` to reflect:
- Your industry and program operator name
- Your Layer 3 feature roadmap (from Step 4)
- Your Layer 4 admin plan (from Step 5)
- Your milestone ID prefix (e.g., `PROJ-M###`)

---

## Step 7 — Rename and rebrand

In this order:

1. **`mobile/app.json`** — update `name`, `slug`, `scheme`, `bundleIdentifier` (iOS), `package` (Android)
2. **`mobile/constants/config.ts`** — update `EXPO_PUBLIC_MIDDLEWARE_URL` to point at your deployed middleware (or keep localhost for development)
3. **`README.md`** — replace project name, description, and setup instructions
4. **`CONTRIBUTING.md`** — update milestone ID prefix, branch naming convention
5. **Replace `RB-` prefixes** in existing docs with your project prefix using a global find-and-replace

Do not rename internal code identifiers (function names, type names) unless they are visibly user-facing or a genuine source of confusion. The cost of a mass rename is higher than living with `ref-boiler` in a few internal strings.

---

## Step 8 — Known architectural decisions to carry forward

These decisions were made during the boilerplate build and are not arbitrary. Understand them before changing them.

### The API key boundary (RB-M001)

The `FIRSTPROMOTER_API_KEY` is read in exactly one place: `middleware/src/services/firstPromoter.ts`. It is never passed to a response, never logged, never included in a JWT claim. When you add new FP API calls, add them to `firstPromoter.ts` — do not create new files that import the key directly.

### The auth store (RB-M002)

`store/authStore.tsx` is `.tsx`, not `.ts`, because it returns JSX (`AuthProvider`). This is intentional — the store owns both the persistence layer (SecureStore) and the in-memory session state (React context). Do not split these into separate files.

When you add new protected screens, you do not need to change the auth logic. `AuthProvider` watches `useSegments()` and redirects automatically. Adding a route under `(app)/` makes it protected by default.

### Referral URLs (RB-M003)

`/affiliate/promoters/me` does not return a resolved referral URL. It returns a `uid` (the ref slug) but not the campaign domain. Always fetch referral URLs from `/affiliate/referral-links`. Do not construct referral URLs by concatenating `uid` with a domain string — that domain is industry-specific and would violate the boilerplate constraint if it appeared in this codebase.

### View capture and native modules (RB-M004)

`react-native-view-shot` and `expo-media-library` are native modules. They require a development build — they do not work in Expo Go. If you add any further native modules in your industry build, add them to this list and update your team's setup documentation accordingly.

The `collapsable={false}` prop on any `View` that you intend to capture with `captureRef` is not optional. On Android, React Native's view flattening optimization removes collapsable views from the native tree before capture can read them. Omitting this prop produces a blank image or a crash with no useful error message.

### Permissions (RB-M004)

Request permissions at the moment the user takes an action that requires them — not on mount, and not speculatively. Both App Store and Play Store review guidelines penalise apps that request permissions before the user has shown intent to use the feature that requires them. The boilerplate follows this pattern in `handleSaveToPhotos`. Follow the same pattern for any new permission-gated feature (camera, location, contacts, etc.).

### Segment control vs nested tabs (RB-M005)

The Earnings screen uses a segment control (`useState`) rather than Expo Router nested tabs. This is intentional at boilerplate level. If your industry feature requires deep-linking to a specific segment (e.g., linking from a push notification directly to the Payouts list), convert the segment to nested Expo Router tabs. The data layer (`useCommissions`, `usePayouts`) does not need to change — only the navigation structure.

---

## Step 9 — You are now ready to build

Your first code milestone in the industry build should be Layer 3 Feature 1, executed against the BRIEF you wrote in Step 4.

Follow the compound engineering loop:

```
BRIEF → PLAN → ADR (if architecture changes) → Code → Review → Compound
```

Do not write code before the BRIEF is written and reviewed. Do not write code before the PLAN is written. This discipline is what keeps the industry build navigable as complexity grows.

---

## Appendix A — BRIEF template for first industry feature

Copy this template and save it as `docs/briefs/BRIEF_002_{feature-slug}.md`. Replace every bracketed placeholder. Do not leave any section blank — if you cannot answer it, that is a gap to resolve before planning.

---

```markdown
# BRIEF_002 — [Feature Name]

> **Status:** Draft
> **Fidelity:** F2
> **Tier:** PRD
> **Audience:** Engineering + Product
> **Last updated:** [DATE]

---

## Problem

[What is the field scenario that this feature addresses? Be specific: where is the
affiliate, who are they talking to, and what do they need to do that they currently
cannot? One paragraph. No solution in this section.]

---

## What we are building

[Describe the feature in concrete terms. What does the affiliate see? What do they
tap? What happens? One or two paragraphs. Reference the specific screens it lives on
or introduces.]

---

## Who it is for

[Be specific. Not "affiliates" — "affiliates who attend trade shows and need to surface
a time-limited discount code during a booth conversation." Name the scenario.]

---

## Success criteria

1. [Specific, testable criterion]
2. [Specific, testable criterion]
3. [Specific, testable criterion]

---

## Non-goals

- [What this feature explicitly does not do]
- [What will be deferred to a later milestone]

---

## FirstPromoter API surface

List every FP v2 endpoint this feature will call. Confirm each is already proxied in
`middleware/src/routes/affiliate.ts`. If not, note the new route needed.

| FP endpoint | Middleware route | Status |
|---|---|---|
| `GET /api/v2/affiliate/...` | `GET /affiliate/...` | ✅ exists / ❌ needs adding |

---

## New middleware routes needed

[If any FP endpoints need to be added to the middleware, describe them here. Include
the method, path, and FP endpoint it maps to. Leave blank if all needed data is
already proxied.]

---

## New mobile screens or components

[List any new screens or components this feature requires. For each, note which tab or
navigation group it lives in.]

| File | Type | Location |
|---|---|---|
| `mobile/app/(app)/(tabs)/...` | Screen | Tabs |
| `mobile/components/...` | Component | Reusable |

---

## Native module requirements

[Does this feature require a native module that won't work in Expo Go? List them. Any
native module requires a dev build — flag it explicitly so the team's setup
documentation can be updated.]

| Module | Reason | Dev build required |
|---|---|---|
| [package] | [why needed] | ✅ / ❌ |

---

## Open questions

| Question | Proposed resolution | Owner |
|---|---|---|
| [Question] | [Answer or TBD] | [Name] |

---

## Constraints carried into the PLAN

1. API key never in the mobile client
2. No admin logic in the mobile app — admin is Layer 4
3. No industry-specific config in the boilerplate — this is a fork, so industry config is allowed here
4. Approved stack only — any new dependency requires a `TECH_STACK.md` entry
5. No code without a PLAN
```

---

## Appendix B — Boilerplate file reference

A quick map for engineers joining the project mid-build.

### Middleware

```
middleware/src/
├── index.ts                  Express app entry, mounts /auth and /affiliate routers
├── routes/
│   ├── auth.ts               POST /auth/login → signs JWT with affiliate's FP auth_token
│   └── affiliate.ts          All /affiliate/* routes, requires authenticate middleware
├── middleware/
│   ├── authenticate.ts       Validates JWT, sets req.affiliateId + req.affiliateToken
│   ├── rateLimiter.ts        60 req/min per affiliate
│   └── errorHandler.ts       Normalises thrown ApiError objects to JSON responses
├── services/
│   └── firstPromoter.ts      All FP v2 API calls — the only file that reads the API key
└── types/
    └── index.ts              AuthenticatedRequest, JwtPayload, FP response shapes
```

### Mobile

```
mobile/
├── app/
│   ├── _layout.tsx           Root layout: QueryClientProvider + AuthProvider + Slot
│   ├── (auth)/
│   │   ├── _layout.tsx       Stack navigator, headerShown: false
│   │   ├── login.tsx         Email + password → JWT → signIn() → redirect
│   │   └── forgot-password.tsx  Delegates reset to FirstPromoter email flow
│   └── (app)/
│       └── (tabs)/
│           ├── _layout.tsx   Tab navigator (Dashboard, QR Code, Earnings)
│           ├── index.tsx     Dashboard: AffiliateCard, stats, referral link + copy
│           ├── qr.tsx        QR render, share link, share image, save to photos
│           └── earnings.tsx  Segment control: CommissionRow list | PayoutRow list
├── components/
│   ├── AffiliateCard.tsx     Name + email
│   ├── QRDisplay.tsx         react-native-qrcode-svg wrapper, accepts url + size
│   ├── CommissionRow.tsx     Amount, status badge, date, lead.email
│   └── PayoutRow.tsx         Amount, status badge, date
├── hooks/
│   ├── useAffiliate.ts       useAffiliate(), useReferralLinks(), useReports()
│   ├── useCommissions.ts     useCommissions()
│   └── usePayouts.ts         usePayouts()
├── services/
│   └── api.ts                Axios client with JWT interceptor, all fetch functions
├── store/
│   └── authStore.tsx         SecureStore ops + AuthProvider + useAuth()
├── constants/
│   └── config.ts             MIDDLEWARE_BASE_URL from EXPO_PUBLIC_MIDDLEWARE_URL
└── types/
    └── index.ts              Promoter, Commission (+ CommissionLead), Payout, ReferralLink, etc.
```
