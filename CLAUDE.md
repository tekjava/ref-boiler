# CLAUDE.md — Agent Rules for ref-boiler

Rules the AI agent follows in this repo. Updated after every compound step.

---

## Non-negotiables

- The FirstPromoter API key never exists in the mobile app. All FP calls go through the middleware.
- No industry-specific logic, copy, branding, or vertical assumptions enter this repo.
- Layer 3 and Layer 4 features are not built here. They belong in the forked industry repo.
- No code is written without a corresponding PLAN document (F2 or higher).
- TypeScript is used everywhere. No `.js` files in `mobile/src/` or `middleware/src/`.

---

## Stack rules

- Mobile: React Native + Expo only. No bare workflow unless EAS requires it.
- Middleware: Express + TypeScript only. No Next.js, no Hono, no Fastify without an ADR.
- Auth: JWT via SecureStore. No AsyncStorage for tokens. No Firebase.
- State: React Query for server state. No Redux.
- Navigation: Expo Router. No React Navigation directly unless Expo Router cannot handle the case.

---

## File discipline

- New routes in the middleware go in `middleware/src/routes/`
- New screens in the app go in `mobile/app/(app)/` or `mobile/app/(auth)/`
- Shared types go in `middleware/src/types/` and `mobile/types/` respectively — not cross-imported
- No barrel exports unless the directory has 4+ exports

---

## When implementing

- Read the PLAN before writing any code
- Follow the implementation sequence in the PLAN — do not skip steps
- If something unexpected is discovered mid-implementation, stop and update the PLAN before continuing
- After implementation, ask: "What was the hardest decision here?" and capture the answer in `docs/solutions/`

---

## Learned rules (added after each compound step)

_Empty until RB-M001 ships._
