# PLAN_001 — ref-boiler Foundation

> **Status:** Authored
> **Fidelity:** F2
> **Tier:** SDD
> **Derived from:** BRIEF_001
> **Audience:** Engineering
> **Last updated:** 2026-05-06

---

## System shape

```
┌─────────────────────────────┐
│     Expo Mobile App         │
│  (React Native / TypeScript)│
│                             │
│  - Auth screens             │
│  - Navigation shell         │
│  - Affiliate dashboard      │
│  - QR code display          │
│  - Commission / payout views│
└────────────┬────────────────┘
             │ HTTPS + JWT
             ▼
┌─────────────────────────────┐
│   Node.js Middleware        │
│   (Express / TypeScript)    │
│                             │
│  - JWT validation           │
│  - FirstPromoter proxy      │
│  - Rate limiting            │
│  - Error normalization      │
└────────────┬────────────────┘
             │ Bearer API Key (server-only)
             ▼
┌─────────────────────────────┐
│   FirstPromoter v2 API      │
│                             │
│  - Affiliate data           │
│  - Commissions              │
│  - Payouts                  │
│  - Referral links           │
│  - Promo codes              │
│  - Reports                  │
└─────────────────────────────┘
```

---

## Component breakdown

### Middleware (Node.js + Express)

**Responsibilities:**
- Hold the FirstPromoter API key as an env variable — never exposed to the client
- Validate incoming JWTs from the mobile app
- Proxy requests to FirstPromoter v2 API with appropriate headers
- Normalize FirstPromoter error responses into consistent mobile-friendly shapes
- Rate limit per authenticated affiliate to prevent abuse

**Key routes:**
```
POST   /auth/login          → authenticate affiliate → return JWT
GET    /affiliate/me        → proxy → FP GET /api/v2/affiliate/promoters/me
GET    /affiliate/referrals → proxy → FP GET /api/v2/affiliate/referrals
GET    /affiliate/commissions → proxy → FP GET /api/v2/affiliate/commissions
GET    /affiliate/payouts   → proxy → FP GET /api/v2/affiliate/payouts
GET    /affiliate/promo-codes → proxy → FP GET /api/v2/affiliate/promo_codes
GET    /affiliate/referral-links → proxy → FP GET /api/v2/affiliate/referral_links
GET    /affiliate/campaigns → proxy → FP GET /api/v2/affiliate/campaigns
GET    /affiliate/reports   → proxy → FP GET /api/v2/affiliate/reports
```

**Environment variables:**
```
FIRSTPROMOTER_API_KEY=
FIRSTPROMOTER_ACCOUNT_ID=
JWT_SECRET=
PORT=3001
```

**Directory structure:**
```
middleware/
├── src/
│   ├── index.ts              ← Express app entry
│   ├── routes/
│   │   ├── auth.ts
│   │   └── affiliate.ts
│   ├── middleware/
│   │   ├── authenticate.ts   ← JWT validation
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   └── firstPromoter.ts  ← FP API client wrapper
│   └── types/
│       └── index.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

### Mobile App (Expo + React Native)

**Responsibilities:**
- Authenticate the affiliate and store JWT securely (SecureStore)
- Display glanceable dashboard: earnings, pending commissions, referral link
- Render QR code from affiliate referral link
- Show commission and payout history
- Allow referral link sharing (native share sheet)

**Navigation structure:**
```
(auth)/
  login.tsx
  forgot-password.tsx

(app)/
  (tabs)/
    index.tsx        ← Dashboard
    qr.tsx           ← QR code screen
    earnings.tsx     ← Commissions + payouts
  _layout.tsx        ← Tab navigator
```

**Key screens:**

| Screen | Data source | Primary action |
|---|---|---|
| Dashboard | `/affiliate/me`, `/affiliate/reports` | Pull up QR code |
| QR Code | `/affiliate/referral-links` | Share / save |
| Earnings | `/affiliate/commissions`, `/affiliate/payouts` | View history |

**Directory structure:**
```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│   ├── (app)/
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       ├── qr.tsx
│   │       └── earnings.tsx
│   └── _layout.tsx
├── components/
│   ├── AffiliateCard.tsx
│   ├── QRDisplay.tsx
│   ├── CommissionRow.tsx
│   └── PayoutRow.tsx
├── hooks/
│   ├── useAffiliate.ts
│   ├── useCommissions.ts
│   └── usePayouts.ts
├── services/
│   └── api.ts              ← Middleware client
├── store/
│   └── authStore.ts        ← JWT + session state
├── types/
│   └── index.ts
├── constants/
│   └── config.ts           ← Middleware base URL
├── app.json
├── package.json
└── tsconfig.json
```

---

## Implementation sequence

### RB-M001 — Middleware scaffold
1. Initialize Express + TypeScript project
2. Add JWT middleware
3. Add FirstPromoter client wrapper (v2 API, Bearer auth, Account-ID header)
4. Stub all affiliate proxy routes
5. Add error normalization and rate limiter
6. `.env.example` with all required variables
7. Local test: hit `/affiliate/me` with a valid JWT and real FP credentials

### RB-M002 — Expo app scaffold
1. Initialize Expo project with Expo Router
2. Set up auth flow (login screen, JWT storage via SecureStore)
3. Set up tab navigation shell
4. Wire middleware base URL via `constants/config.ts`
5. Add React Query setup
6. Stub all three tab screens
7. Local test: login, session persists across app restart

### RB-M003 — Affiliate dashboard
1. Fetch `/affiliate/me` and `/affiliate/reports` on mount
2. Display: name, current balance, pending commissions, total referrals
3. Referral link displayed with copy button
4. Pull-to-refresh
5. Loading and error states

### RB-M004 — QR code screen
1. Fetch referral link from `/affiliate/referral-links`
2. Render QR code via `react-native-qrcode-svg`
3. Native share sheet integration (share link as URL or QR image)
4. Save-to-photos option

### RB-M005 — Earnings screen
1. Fetch commissions from `/affiliate/commissions`
2. Fetch payouts from `/affiliate/payouts`
3. Tab or segment between pending commissions and payout history
4. Per-row: amount, status, date, referral name

### RB-M006 — Industry Setup Guide
1. Author `docs/playbook/INDUSTRY_SETUP_GUIDE.md`
2. Cover: forking the repo, industry discovery questions, Layer 3 feature planning, Layer 4 admin planning
3. Provide a BRIEF template for the first industry-specific feature

### RB-FREEZE — Boilerplate freeze
1. Update `BASELINE.md` to reflect all shipped milestones
2. Tag release as `v1.0.0-boilerplate`
3. Announce fork-ready

---

## Acceptance criteria (full boilerplate)

- [ ] Middleware runs locally with a real FirstPromoter account
- [ ] Expo app authenticates and persists session
- [ ] Dashboard loads real affiliate data
- [ ] QR code renders and shares correctly
- [ ] Earnings screen shows real commission and payout data
- [ ] No hardcoded industry references anywhere in the codebase
- [ ] `DEV_SETUP.md` gets a developer running in under 30 minutes
- [ ] Industry Setup Guide is authored and reviewed
- [ ] All Priority 1 and 2 docs from `baseline-doc-structure` are authored

---

## What this PLAN does not cover

- Layer 3 features (time-limited offers, VIP display, asset library) — industry build
- Layer 4 admin surface — industry build
- Push notifications — post-boilerplate
- Analytics / crash reporting — post-boilerplate
- Multi-platform admin web dashboard — separate app, not this repo
