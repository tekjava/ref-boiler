# RB-M003 — Hardest Decision

**What was the hardest decision here?**

Whether to fetch `/affiliate/referral-links` in the dashboard or derive the referral URL from the promoter object.

The PLAN's step 1 says "fetch `/affiliate/me` and `/affiliate/reports` on mount," but step 3 requires a referral link for the copy button. FirstPromoter's `/promoters/me` response does not include a resolved referral URL — it includes a `uid` (the ref slug) but not the full URL with the campaign domain. The full URL only exists on the `/affiliate/referral_links` endpoint.

Two options:

1. **Construct the URL from uid + a hardcoded domain** — fragile, would bake in a domain that doesn't belong in the boilerplate (constraint violation: no industry-specific config).

2. **Add a third query for `/affiliate/referral-links`** — costs one extra API call on mount, but keeps data accurate regardless of what campaign domains are configured in the affiliate's FirstPromoter account.

Chose option 2. The three queries (`useAffiliate`, `useReports`, `useReferralLinks`) fire in parallel via React Query — there is no waterfall. The dashboard shows a single spinner until all three resolve, which is the same UX as two queries. The extra call is worth the accuracy guarantee and the constraint preservation.

**Pull-to-refresh pattern:** used `useState(refreshing)` + `Promise.all([q.refetch(), ...])` rather than `invalidateQueries`. `refetch()` is synchronous to trigger and returns a promise that resolves when the data is back, making it straightforward to drive the `RefreshControl` loading indicator without a race condition.
