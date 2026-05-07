# Platform Overview

> **Status:** Authored
> **Tier:** 1 Manual
> **Audience:** Engineering + Product
> **Module:** platform
> **Last updated:** 2026-05-06

## What ref-boiler is

`ref-boiler` is a mobile-first affiliate app boilerplate built on React Native (Expo) with FirstPromoter as the affiliate management backend. It provides a production-grade foundation for building custom affiliate experiences — specifically for affiliates who work in the field, network in person, and need tools that work the way they do.

It is explicitly **not** a finished product. It is a governed, frozen foundation that gets forked into industry-specific builds.

## The problem it solves

Every major affiliate platform — FirstPromoter, Rewardful, Refferq — ships a web portal designed for someone sitting at a desk. Field-based affiliates networking at events, showing up at client sites, and building relationships in person have no native mobile tooling built for how they actually work.

The specific gaps:

- No QR code generation for in-person referral capture
- No on-the-spot promo code surfacing for live offers
- No glanceable dashboard optimized for a phone screen
- No VIP / tier status that affiliates can show in the moment
- No field-ready asset access (branded materials, campaign content)

`ref-boiler` solves the mobile experience layer. FirstPromoter handles everything underneath it: compliance, tax, W-9 collection, 1099 generation, payout processing, fraud protection.

## System shape

```
[Affiliate Mobile App]  ←→  [Node.js Middleware]  ←→  [FirstPromoter API]
[Admin Mobile/Web App]  ←→  [Node.js Middleware]  ←→  [FirstPromoter API]
```

The middleware is the security boundary. The FirstPromoter API key lives only on the server. The mobile client authenticates via JWT and all FirstPromoter calls are proxied through the middleware.

## Build layers

| Layer | Scope | Boilerplate |
|---|---|---|
| Layer 1 — Foundation | Auth, middleware, navigation shell, session handling | ✅ In this repo |
| Layer 2 — Core affiliate experience | Dashboard, referral links, QR, commissions, payouts | ✅ In this repo |
| Layer 3 — Field tools | In-person offers, time-limited codes, VIP display, asset library | ❌ Industry build |
| Layer 4 — Admin | Promoter management, campaign oversight, approvals, reports | ❌ Industry build |

## Boilerplate boundary

The boilerplate is frozen after Layer 2 is stable and tested. At that point an Industry Setup Guide walks you through forking the repo and beginning the vertical-specific build. No Layer 3 or Layer 4 work enters this repo.

## What FirstPromoter handles (not us)

- Affiliate onboarding and W-9 / W-8BEN collection
- 1099-NEC and 1042-S generation
- Commission calculation, approval, and denial
- Payout processing (PayPal, Wise, bank transfer)
- Fraud detection
- Campaign and promo code management

Our mobile layer surfaces this data. It does not replicate it.

## Audiences

**Affiliates** — the primary mobile user. Field-based, networking in person, needs fast access to their link, their QR code, their earnings, and their active offers.

**Admins** — the program operator. Manages affiliates, campaigns, commission approvals, and payouts. Admin surface is Layer 4 and lives in the industry build, not the boilerplate.
