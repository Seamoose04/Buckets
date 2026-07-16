# Budgeting App — Project Overview
 
## Goals
 
Build a personal budgeting app that:
- Syncs transactions automatically from Bank of America (checking + savings) via Plaid
- Uses **spend caps per category**, not envelope/zero-based budgeting
- Tracks **base income** (guaranteed minimum) separately from **bonus income** (irregular)
- Enforces a hierarchy of **buckets → sub-buckets**, with deliberately asymmetric friction on reallocating money between them
- Never budgets money out of savings — only into it
- Supports saving toward specific large purchases, tracked in-app but physically sitting in the savings account
- Runs on infrastructure you already operate (aiserver, NPM, BlueBubbles) rather than a new managed service
 
Non-goals (explicitly decided against, don't re-litigate later without a reason):
- No envelope/zero-based budgeting
- No trend charts / historical graphing
- No calendar-month cycles — everything is 4-week periods
- No blocking-on-acknowledgment for accountability partner notifications (fire-and-log, not fire-and-wait)
 
---
 
## Stack
 
- **Frontend + API routes:** Next.js (App Router)
- **Data layer:** PocketBase (own container, owns the SQLite file underneath)
- **Bank sync:** Plaid (Development tier — free, covers a single personal Item indefinitely)
- **Accountability notifications:** BlueBubbles REST API, via the Mac mini relay already running at `bubbles.seamus-server.com`
- **Hosting:** containerized on `aiserver`, behind NPM, same pattern as existing services
- **Scheduling:** system cron on aiserver hitting protected Next.js API routes (no in-app cron needed)
 
See `pocketbase-schema.md` for the full data model.
 
---
 
## Core concepts
 
### Buckets & sub-buckets
- **Bucket** = top-level, hard limit. Fixed set: `Need`, `Want`, `Want-Need`.
- **Sub-bucket** = single-parent child of exactly one bucket (e.g. `Want` → "Games", "Fun Food"). This is where allocations, spend, and remaining-% actually live.
- Sub-buckets within a bucket have optional **guideline percentages** — soft visual targets, shown as a marker on the chart, not an enforced limit. These must sum to 100% within a bucket (see schema doc for the redistribution implications of that).
 
### Reallocation friction (deliberately asymmetric)
| Move | Friction |
|---|---|
| Sub-bucket → sub-bucket, same parent bucket | None — instant, one click |
| Bucket → bucket, **Want feeding Need** | Written reason required |
| Bucket → bucket, **Need feeding Want** | Written reason required **+ BlueBubbles notification to accountability partner** |
 
The idea: moving money *within* a bucket you already committed to is a normal budgeting adjustment. Moving money *between* buckets is you overriding your own top-level intent, and pulling from Need specifically is the direction most worth a speed bump.
 
### Income
- **Base income** — recurring, known minimum (e.g. "at least $300 every 2 weeks"). The **standard budget** is built from this and must cover Bills + Needs at minimum.
- **Bonus income** — irregular (gifts, overtime, etc). Doesn't need to be fully allocated by cycle end, but must have an eligible destination it *can* go to — the app prompts for this when bonus income is detected.
 
### Budget cycles
- 4 weeks, not calendar months.
- Resets sub-bucket spend to 0 at cycle end.
- Leftover money at cycle close triggers a prompt: send to plain savings, or top up a large-purchase goal.
 
### Accounts
- Only two: checking and savings.
- **Nothing is ever budgeted *from* savings — only *to* it.** This is a hard rule, not a default.
- Savings holds both the emergency fund and named large-purchase goals (tracked in-app, physically just sitting in the savings account).
 
### Subscriptions
- Not a bucket — a flag on transactions (`is_subscription`), independent of which bucket/sub-bucket the transaction lands in.
- Detected both **automatically** (via Plaid's recurring-transaction data / merchant+amount pattern matching) and **manually** (a toggle on any transaction).
 
### Splitting
- Any transaction can be split into multiple `sub_purchases`, each assigned its own sub-bucket.
- A non-split transaction still gets exactly one `sub_purchase` row — keeps every downstream query uniform.
- Split amounts must sum **exactly** to the transaction total (enforced server-side, not just in the UI — see schema doc).
 
### Visualization
- Custom pie + smoothed-blob chart (prototype already built, see `budget-sunburst.jsx`):
  - Background: hard-edged pie, wedge angle = sub-bucket allocation size, color = bucket identity
  - Foreground: single-color blob, radius = remaining %, smoothed via Gaussian-windowed Fourier truncation (not naive averaging — that caused Gibbs-ringing lumpiness)
  - Reading: more of the bucket's true color exposed at the rim = more spent; blob pulled toward center = less remaining
- Also want: percent bar + dollar-scale bar per bucket/sub-bucket (simpler supplementary view, not yet prototyped)
- Explicitly no trend charts
 
---
 
## Security notes to keep front of mind
- Plaid `access_token` stored encrypted at rest (Fernet or similar, key outside the repo/git history)
- PocketBase admin UI has access to all this financial data — same VLAN/auth treatment as everything else sensitive on your network, not casually exposed
- BlueBubbles sends as **you** (from your own iMessage), not a separate bot identity — acceptable here since it reads as a genuine check-in, but worth remembering when debugging why a message looks like it came from your own number
 
