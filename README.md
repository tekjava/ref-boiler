# ref-boiler

> FirstPromoter Affiliate — Mobile App Boilerplate Foundation

A React Native (Expo) mobile app boilerplate for building custom affiliate experiences on top of the FirstPromoter API. Industry-agnostic by design. The foundation is extracted and frozen at Layer 2 — before any business-specific logic enters the codebase.

## What this is

A production-grade starting point for any affiliate mobile app that needs:

- Field-ready affiliate dashboard (glanceable, mobile-first)
- QR code generation per affiliate referral link
- In-person promo code tooling
- VIP / tier status display
- Secure FirstPromoter API proxy (key never lives in the mobile client)
- Admin management surface

## What this is not

This repo is not a finished product. It is a governed boilerplate. Industry-specific features, branding, and business logic are added **after** forking into a separate repo using the Industry Setup Guide.

## Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo |
| Middleware | Node.js + Express |
| Affiliate Platform | FirstPromoter v2 API |
| Auth | JWT via middleware |
| QR | expo-qrcode / react-native-qrcode-svg |

## Read order

1. `docs/manual/PLATFORM_OVERVIEW.md` — what the system does and why
2. `docs/architecture/BASELINE.md` — what's built, what's protected, what's next
3. `docs/architecture/CONSTRAINTS_PRIORITY.md` — what cannot be changed without a decision record
4. `docs/manual/TECH_STACK.md` — approved tools and rationale
5. `docs/playbook/DEV_SETUP.md` — get running locally
6. `docs/briefs/BRIEF_001_ref-boiler-foundation.md` — the original PRD
7. `docs/plans/PLAN_001_ref-boiler-foundation.md` — the system design
8. `docs/ADR-001_tech-stack-decisions.md` — locked decisions

## Boilerplate boundary

The boilerplate is considered complete and ready to fork when:

- [ ] Layer 1 (Foundation) is stable and tested
- [ ] Layer 2 (Core affiliate experience) is working end-to-end
- [ ] Industry Setup Guide is complete
- [ ] All Priority 1 and Priority 2 docs are authored
- [ ] `BASELINE.md` reflects the frozen state

Do not add Layer 3 (field tools) or Layer 4 (admin) features to this repo. Those belong in the forked industry build.

## Forking into an industry build

See `docs/playbook/INDUSTRY_SETUP_GUIDE.md` when ready to break off into a custom build.
