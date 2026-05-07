# Industry Setup Guide

> **Status:** Stub
> **Tier:** 2.7 Playbook
> **Audience:** Engineering + Product
> **Module:** platform
> **Last updated:** 2026-05-06

---

> **Note:** This document is a stub. It is authored in full as part of milestone RB-M006, after Layer 2 is stable and the boilerplate is ready to freeze. The structure below represents the intended content.

---

## Purpose

This guide walks you through the transition from the `ref-boiler` boilerplate to a custom industry-specific affiliate mobile app. It is the gate between the boilerplate and the vertical build.

Do not begin the industry build without completing this guide. It exists to prevent industry assumptions from entering the boilerplate and to ensure the fork starts from a clear, intentional baseline.

---

## Step 1 — Fork the repo

```bash
# Clone ref-boiler as your new repo
git clone https://github.com/your-org/ref-boiler.git my-industry-affiliate-app
cd my-industry-affiliate-app

# Remove the remote and point to your new repo
git remote remove origin
git remote add origin https://github.com/your-org/my-industry-affiliate-app.git
git push -u origin main
```

---

## Step 2 — Industry discovery

Answer these questions before writing a single line of industry-specific code. Use them as the basis for your first BRIEF.

### About your affiliates

- Where do your affiliates spend most of their time? (events, offices, retail, outdoors, networking)
- How do they currently share your product or service with prospects?
- What is the single most common in-person scenario where a referral happens?
- What would make them look more credible or professional to a prospect in that moment?
- What information do they need at their fingertips most often?

### About your offers

- Do you run time-limited promotions? How often?
- Do you have different offer tiers for different affiliates?
- Do affiliates have any ability to customize offers, or are all offers set by you?
- Is there a VIP or top-performer status you want to visibly reward?

### About your admin workflow

- Who approves commissions — automated or manual review?
- How many campaigns do you run simultaneously?
- Do different affiliates belong to different campaigns?
- What does your team need to see to manage the program day-to-day?

### About your brand

- Logo, primary color, secondary color
- Any existing design system or component library?
- Tone: professional, casual, high-energy, trust-focused?

---

## Step 3 — Layer 3 planning (field tools)

Based on the discovery answers, plan your Layer 3 features. Write a BRIEF for each.

Common Layer 3 features:

| Feature | Triggers |
|---|---|
| Time-limited promo codes | Affiliates run time-sensitive in-person offers |
| VIP status display | Top-performer recognition, affiliate motivation |
| Asset library | Affiliates need branded materials in the field |
| In-person offer flow | Affiliate presents a live offer to a prospect |
| Leaderboard | Competitive programs with visible rankings |
| Push notifications | Commission approved, payout sent, new campaign live |

Write `docs/briefs/BRIEF_002_{first-layer3-feature}.md` before any Layer 3 code.

---

## Step 4 — Layer 4 planning (admin)

Determine what your admin surface needs. Common questions:

- Do you need admin on mobile, web, or both?
- What actions does admin take most frequently? (approve commissions, onboard affiliates, create campaigns)
- Is admin a single user or a team?

Write `docs/briefs/BRIEF_003_{admin-surface}.md` before any Layer 4 code.

---

## Step 5 — Update your BASELINE.md

Replace the boilerplate milestone history with your own. Your fork starts at:

```
| Milestone | Description | Shipped |
|---|---|---|
| {PROJECT}-M000 | Forked from ref-boiler v1.0.0-boilerplate | {date} |
```

Update `docs/architecture/BASELINE.md` to reflect your industry, your milestones, and your Layer 3 + 4 roadmap.

---

## Step 6 — Rename and rebrand

- Update `app.json` with your app name, bundle ID, and icon
- Update `README.md` with your project name and description
- Update `CONTRIBUTING.md` with your milestone ID prefix (e.g., `PROJ-M###`)
- Replace `RB-` milestone IDs in existing docs with your prefix

---

## You are now ready to build

Your first code milestone in the industry build should be Layer 3 Feature 1, executed against the BRIEF and PLAN you wrote in Step 3.

Follow the compound engineering loop: BRIEF → PLAN → ADR (if needed) → Work → Review → Compound.
