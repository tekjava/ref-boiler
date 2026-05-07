# RB-M005 — Hardest Decision

**What was the hardest decision here?**

Whether to use a segment control (two pressable pills) or Expo Router nested tabs for the Commissions / Payouts split.

Two options:

1. **Expo Router nested tabs inside the earnings route** — a `(tabs)` group inside `(app)/(tabs)/earnings/` with `commissions.tsx` and `payouts.tsx`. Structurally clean, deep-linkable, back-gesture aware. The cost: doubles the file count for this feature, requires moving the earnings screen to a directory, and adds navigation stack depth that the UX doesn't need — users don't need to deep-link to "payouts" specifically.

2. **Segment control in a single screen with `useState`** — two pill buttons manage which `FlatList` is visible. Same file, simpler mental model, no route change. The cost: not deep-linkable, back gesture doesn't "undo" a tab switch.

Chose option 2. Deep-linking to a specific segment is a Layer 3+ concern. At boilerplate level, the simplest surface that satisfies the spec is the right call. A fork that needs deep-linking can promote the segment to nested Expo Router tabs without touching the data layer.

**Both queries fire on mount, not lazily per segment.** The alternative was to only fetch the active segment's data and fetch the other on first switch. The eager approach costs one extra API call at startup but eliminates any loading flash when the user switches tabs. For a dashboard-style screen where both data sets are small and the user frequently toggles, the eager load is the right trade.

**`FlatList` over `ScrollView + map`.** Commissions and payouts can grow to hundreds of rows. `FlatList` virtualises the list and only renders visible rows, keeping memory flat regardless of list size. The stub used `ScrollView` — this is the first place real data lands, so upgrading now avoids a performance regression that would otherwise require discovering in production.
