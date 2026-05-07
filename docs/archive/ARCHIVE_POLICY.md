# Archive Policy

> **Status:** Authored
> **Tier:** 1 Manual
> **Audience:** Engineering
> **Module:** platform
> **Last updated:** 2026-05-06

## Principle

Archive ≠ delete. Nothing is ever deleted from this repo. Archive is the final resting state of any document that has been superseded, completed, or expired.

## Archive header

Every archived document gains this front-matter block at the top:

```
archived_date: YYYY-MM-DD
archived_by: {milestone-id or PR number}
reason: superseded | completed | historical | policy-change
superseded_by: {path to replacement doc, if any}
```

## Archive mirrors active structure

A document's archive home matches the directory it belonged to when active:

- `docs/manual/` → `docs/archive/platform/`
- `docs/briefs/` → `docs/archive/briefs/`
- `docs/plans/` → `docs/archive/plans/`
- `docs/release/{MILESTONE}/` → `docs/archive/releases/{MILESTONE}/`

## Archive in the same PR

When a new document supersedes an old one, both the creation and the archival happen in the same PR. No two active documents should cover the same ground simultaneously.

## Triggers

| Trigger | Reason code |
|---|---|
| A new document fully supersedes it | `superseded` |
| A feature shipped and build notes are complete | `completed` |
| An incident investigation is signed off | `completed` |
| A release QA checklist is older than 2 milestones | `superseded` |
| A time-bounded policy has expired | `historical` |

## Retention classes

| Class | Duration | Applies to |
|---|---|---|
| Permanent | Forever | Incident reports, security findings, ADRs, architecture approvals |
| 2 years | 2 years | Release checklists, QA artifacts, policy-change docs |
| 1 year | 1 year | Pilot scripts, internal build notes, exploration docs |

## What is never archived

- `ARCHIVE_POLICY.md` itself
- `CONTRIBUTING.md`
- `README.md`
- `docs/architecture/CONSTRAINTS_PRIORITY.md`
- `docs/architecture/BASELINE.md`

These are living documents. They are updated in place, never archived.
