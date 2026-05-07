# Contributing

> **Status:** Authored
> **Tier:** Playbook
> **Audience:** Engineering
> **Last updated:** 2026-05-06

## Branch strategy

All work happens on a branch. Nothing merges directly to `main`.

**Branch naming:** `{type}/{MILESTONE-ID}-{short-description}`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`

Example: `feat/RB-M001-expo-auth-foundation`

## Milestone IDs

Format: `RB-M###` — zero-padded to three digits. Sequential. Never reused.

## Commit conventions

```
{type}(scope): short description

feat(auth): add JWT middleware for FirstPromoter proxy
fix(qr): correct referral link encoding
docs(baseline): update shipped milestone list
chore(deps): bump expo sdk to 53
```

## PR requirements

- Title must reference the milestone ID: `[RB-M001] Expo auth foundation`
- Must link to the PLAN doc the work was executed against
- Must pass lint and type checks before review
- No PR merges without a reviewer sign-off

## Compound engineering loop

Every feature follows: BRIEF → PLAN → ADR (if needed) → Work → Review → Compound

- No code without a PLAN
- No PLAN without a BRIEF
- Learnings from review go into `docs/solutions/` and rules go into `CLAUDE.md`

## Boilerplate protection

This repo is a boilerplate foundation. The following are **protected** and require an ADR to change:

- Middleware architecture (Node.js proxy pattern)
- Auth approach (JWT, server-side key storage)
- Mobile framework (React Native + Expo)
- Layer boundary (Layer 1 + 2 only)
- Industry-agnostic constraint (no vertical-specific logic)

Any PR that touches these areas without a corresponding ADR will be rejected.

## Layer discipline

Work in this repo must stay within Layer 1 and Layer 2 scope:

- **Layer 1:** Auth, middleware, navigation shell, session handling
- **Layer 2:** Affiliate dashboard, referral links, QR codes, commissions, payouts

Layer 3 (field tools) and Layer 4 (admin) belong in the forked industry build, not here.
