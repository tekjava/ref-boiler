# BRIEF_001 — ref-boiler Foundation

> **Status:** Authored
> **Fidelity:** F2
> **Tier:** PRD
> **Audience:** Engineering + Product
> **Last updated:** 2026-05-06

---

## Problem

Affiliate platforms — including FirstPromoter, the primary backend for this build — are designed for someone at a desk. Their affiliate portals are web-based, table-heavy, and built around the assumption that an affiliate logs in, checks their stats, and logs out.

Field-based affiliates don't work this way. They network in person, attend events, meet prospects face to face, and need to capture a referral or offer a discount in the moment — on their phone, in under ten seconds, without explaining what a "referral link" is.

No affiliate platform ships native mobile tooling for this workflow. The gap is real, underserved, and the same across industries.

---

## What we are building

A React Native (Expo) mobile app boilerplate — `ref-boiler` — that wraps the FirstPromoter API in a field-ready mobile experience. The boilerplate covers two layers:

**Layer 1 — Foundation**
- Node.js middleware that proxies all FirstPromoter API calls (API key never in the client)
- JWT auth for the mobile app
- Expo app scaffold with navigation shell and session handling

**Layer 2 — Core affiliate experience**
- Affiliate dashboard (glanceable: earnings, pending commissions, referral link)
- QR code generation per affiliate referral link
- Commission and payout history
- Referral link sharing

The boilerplate freezes here. Layer 3 (field tools) and Layer 4 (admin) are built in the forked industry repo after the Industry Setup Guide is completed.

---

## Who it is for

**Primary user: the affiliate.** Works in the field. Networking in person. Needs their referral link and QR code accessible in two taps. Wants to know what they've earned at a glance.

**Secondary user: the program operator (admin).** Manages affiliates, approves commissions, oversees campaigns. Admin tooling is out of scope for the boilerplate — it lives in the industry build.

---

## Why FirstPromoter as the backend

FirstPromoter handles the compliance and financial infrastructure that would otherwise require significant engineering:

- W-9 / W-8BEN collection during affiliate onboarding
- 1099-NEC and 1042-S generation at year-end
- Commission calculation, approval, fraud detection
- Payout processing via PayPal, Wise, bank transfer
- Full v2 API with separate affiliate-facing and admin API surfaces

The mobile app surfaces this data. It does not replicate it. Compliance stays with FirstPromoter.

---

## Success criteria

The boilerplate is considered successful when:

1. A developer can clone the repo, follow `DEV_SETUP.md`, and have the middleware and Expo app running locally in under 30 minutes
2. An affiliate can log in, see their dashboard, and pull up their QR code in under 3 taps
3. The codebase has no industry-specific logic anywhere
4. The Industry Setup Guide provides a clear path from boilerplate fork to first industry-specific feature
5. All Priority 1 and Priority 2 docs from `baseline-doc-structure` are authored

---

## Non-goals

- This repo does not ship Layer 3 or Layer 4 features
- This repo does not handle any compliance, tax, or payout logic — FirstPromoter owns that
- This repo does not build an admin web dashboard (separate app if needed)
- This repo does not target a specific industry

---

## Open questions resolved before planning

| Question | Resolution |
|---|---|
| Node.js vs Next.js for middleware | Node.js + Express. No web framework overhead needed for a mobile-only API proxy. |
| Flutter vs React Native | React Native + Expo. Single JS/TS codebase, strong ecosystem, extractable boilerplate. |
| Which affiliate platform | FirstPromoter. Best API surface, compliance infrastructure already built. |
| When to add industry features | After fork. Industry Setup Guide gates the transition. |
| Admin surface in boilerplate | No. Admin is Layer 4 and lives in the industry build. |

---

## Constraints carried into the PLAN

1. API key never in the mobile client
2. No industry-specific logic in this repo
3. Layer 1 + 2 only
4. Approved stack only (documented in `TECH_STACK.md`)
5. No code without a PLAN
