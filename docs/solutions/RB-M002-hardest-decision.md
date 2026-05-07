# RB-M002 — Hardest Decision

**What was the hardest decision here?**

Where to co-locate the `AuthProvider` React component relative to the SecureStore primitives in `store/authStore.tsx`.

Three options were considered:

1. **Separate `context/auth.tsx` file** — cleanest separation, but adds a directory not in the PLAN and requires updating imports everywhere.

2. **Inline in `app/_layout.tsx`** — keeps layout files self-contained, but `useAuth()` then has no clean home to be imported from in leaf screens (login.tsx, future screens).

3. **Co-locate in `store/authStore.tsx`** — the store IS the auth state. `useAuth()` exports from the same module as `getToken`, `persistToken`, `clearToken`. Call sites import from one place. The cost is that `authStore` must be `.tsx` (not `.ts`) because it returns JSX. This is a pragmatic TypeScript requirement, not a design violation — the PLAN said `.ts` but didn't anticipate JSX in the store module.

Chose option 3. The store owns both the persistence layer (SecureStore) and the in-memory session state (React context). They're two representations of the same fact, so they belong together. A future engineer looking for "where does the token live?" finds one file that answers completely.

**Routing note:** The redirect logic lives inside `AuthProvider` (using `useSegments` + `useRouter`) rather than in each layout's `useEffect`. This means auth redirects happen in one place — adding a new protected route requires zero changes to the auth logic.
