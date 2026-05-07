# Constraints Priority

> **Status:** Authored
> **Tier:** 2.5 Architecture
> **Audience:** Engineering
> **Module:** platform
> **Last updated:** 2026-05-06

## Purpose

These are the hard invariants of the boilerplate. They override all other decisions including velocity, convenience, and preference. Any change to these constraints requires a new ADR and explicit sign-off before implementation begins.

---

## Constraint 1 — API key never in the mobile client

**The FirstPromoter API key must never exist in the Expo/React Native app.**

All FirstPromoter API calls are proxied through the Node.js middleware. The mobile client authenticates to the middleware via JWT. The middleware authenticates to FirstPromoter with the API key stored as a server-side environment variable.

Violation of this constraint exposes the API key in the app bundle, which can be extracted. There are no exceptions.

---

## Constraint 2 — Industry-agnostic layer boundary

**No industry-specific logic, copy, branding, or configuration enters this repo.**

The boilerplate must be forkable for any affiliate program in any industry. The moment a vertical-specific assumption is baked in, the boilerplate loses its value.

Industry discovery and configuration are handled by the Industry Setup Guide, which runs after forking — not before.

---

## Constraint 3 — Layer discipline

**Layer 3 and Layer 4 features do not ship in this repo.**

- Layer 3 (field tools: time-limited offers, VIP display, asset library) → industry build
- Layer 4 (admin surface) → industry build

The boilerplate freezes after Layer 2 is stable. This is the extraction point.

---

## Constraint 4 — Approved stack only

**No dependency outside the approved stack in `docs/manual/TECH_STACK.md` is added without documentation.**

Adding a dependency requires an updated `TECH_STACK.md` entry and, if it touches the boilerplate boundary, an ADR.

---

## Constraint 5 — No code without a PLAN

**Every non-trivial code change must have a corresponding PLAN document.**

Following the compound engineering lifecycle:
- BRIEF answers *what and why*
- PLAN answers *how*
- Code executes against the PLAN

Hotfixes and copy changes (F1 fidelity) are exempt. Anything multi-file or architectural is minimum F2 and requires a PLAN.

---

## Override process

To override any constraint:

1. Write a BRIEF explaining why the constraint no longer applies
2. Write a PLAN showing the proposed change
3. Write an ADR locking the new decision
4. Get explicit sign-off before any code is written

No constraint is overridden in a PR without the above paper trail.
