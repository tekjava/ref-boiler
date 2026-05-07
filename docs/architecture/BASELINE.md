# Baseline

> **Status:** Authored
> **Tier:** 2.5 Architecture
> **Audience:** Engineering
> **Module:** platform
> **Last updated:** 2026-05-06

## What this document is

A live snapshot of the system. Updated at every milestone. Reflects what is built, what is protected, and what is next. This is the first document to read when re-entering the codebase after any absence.

---

## Current state

**Milestone:** Pre-build — documentation phase
**Last shipped:** Nothing yet. Docs are the first deliverable.

### What is built

Nothing in code. The following are authored and stable:

- `README.md`
- `CONTRIBUTING.md`
- `docs/archive/ARCHIVE_POLICY.md`
- `docs/manual/PLATFORM_OVERVIEW.md`
- `docs/manual/TECH_STACK.md`
- `docs/architecture/BASELINE.md` (this file)
- `docs/architecture/CONSTRAINTS_PRIORITY.md`
- `docs/briefs/BRIEF_001_ref-boiler-foundation.md`
- `docs/plans/PLAN_001_ref-boiler-foundation.md`
- `docs/ADR-001_tech-stack-decisions.md`

### What is protected

The following cannot be changed without a new ADR:

- React Native + Expo as the mobile framework
- Node.js + Express as the middleware
- JWT as the auth mechanism
- Layer boundary (Layer 1 + 2 only in this repo)
- Industry-agnostic constraint

### What is next

| Milestone | Scope |
|---|---|
| RB-M001 | Node.js middleware scaffold — Express server, FirstPromoter proxy, JWT auth |
| RB-M002 | Expo app scaffold — navigation shell, auth screens, session handling |
| RB-M003 | Affiliate dashboard — earnings, referral link, commissions |
| RB-M004 | QR code generation — per-affiliate referral link, shareable |
| RB-M005 | Payout history screen |
| RB-M006 | Industry Setup Guide — document and tooling for forking |
| RB-FREEZE | Boilerplate freeze — tag, document, ready to fork |

---

## Milestone history

| Milestone | Description | Shipped |
|---|---|---|
| RB-M000 | Core documentation authored | 2026-05-06 |

---

## Layer status

| Layer | Status |
|---|---|
| Layer 1 — Foundation | Not started |
| Layer 2 — Core affiliate experience | Not started |
| Layer 3 — Field tools | Out of scope for this repo |
| Layer 4 — Admin | Out of scope for this repo |
