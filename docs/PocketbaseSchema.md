# PocketBase Schema — Budgeting App
 
## `buckets`
Top-level, hard-limit categories. Fixed set: Need / Want / Want-Need.
 
| field | type | notes |
|---|---|---|
| name | text | "Need", "Want", "Want-Need" |
| color | text | hex, for pie chart |
 
---
 
## `sub_buckets`
Single-parent children of a bucket. This is where allocations actually live.
 
| field | type | notes |
|---|---|---|
| bucket | relation → buckets | single parent, required |
| name | text | e.g. "Groceries", "Games" |
| allocation | number | $ for current cycle |
| guideline_percent | number | optional soft target within parent bucket, for the visual marker |
| is_subscription_bucket | bool | not a hard rule, just lets you default new subs here |
| archived | bool | soft-delete instead of hard delete, since transactions reference it |
 
Derived (not stored, computed at query time): `spent`, `remaining` = allocation − sum(sub_purchases in current cycle).
 
---
 
## `budget_cycles`
Your 4-week periods, since you're not using calendar months.
 
| field | type | notes |
|---|---|---|
| start_date | date | |
| end_date | date | start + 28 days |
| status | select | active / closed |
| rollover_amount | number | leftover at close |
| rollover_destination | relation → savings_goals (nullable) | null = plain savings |
 
---
 
## `income`
| field | type | notes |
|---|---|---|
| type | select | base / bonus |
| amount | number | |
| date | date | |
| source | text | e.g. "Paycheck", "Birthday gift" |
| allocated | bool | for bonus income — have you assigned it a destination yet |
| allocation_note | text | where it's earmarked, if allocated |
 
---
 
## `accounts`
Plaid-linked accounts. Only checking and savings exist for you, but keep it general.
 
| field | type | notes |
|---|---|---|
| plaid_item_id | text | |
| plaid_access_token | text | **encrypt at rest** (Fernet or similar, key outside repo) |
| institution_name | text | |
| account_type | select | checking / savings |
| plaid_account_id | text | Plaid's sub-id within the Item |
 
---
 
## `transactions`
Raw synced data from Plaid, one row per real-world transaction.
 
| field | type | notes |
|---|---|---|
| account | relation → accounts | |
| plaid_transaction_id | text | unique, dedupe key on sync |
| date | date | |
| merchant | text | |
| amount | number | |
| plaid_category | text | raw Plaid category, for auto-categorization mapping |
| is_subscription | bool | |
| subscription_source | select | auto / manual / none |
| needs_split | bool | true until fully allocated to sub_purchases |
 
---
 
## `sub_purchases`
Splits of a transaction into bucket-assignable pieces. A non-split transaction still gets exactly one row here — keeps the query logic uniform.
 
| field | type | notes |
|---|---|---|
| transaction | relation → transactions | |
| sub_bucket | relation → sub_buckets | |
| amount | number | must sum to parent transaction.amount |
| note | text | optional |
 
---
 
## `transfers`
Bucket-to-bucket and sub-bucket-to-sub-bucket reallocations. This is where the friction rules live.
 
| field | type | notes |
|---|---|---|
| from_sub_bucket | relation → sub_buckets | |
| to_sub_bucket | relation → sub_buckets | |
| amount | number | |
| scope | select | same_bucket / cross_bucket | derived from whether the two sub-buckets share a parent |
| direction | select | need_to_want / want_to_need / other | only meaningful when cross_bucket |
| reason | text | required when cross_bucket |
| accountability_notified | bool | true once BlueBubbles send succeeds |
| accountability_message_id | text | for your own audit trail |
| created | date (auto) | |
 
Business logic (app layer, not schema): if `scope = same_bucket` → instant, no reason required. If `cross_bucket` → reason required; if `direction = want_to_need` (Need losing money) → fire BlueBubbles send before/alongside commit, set `accountability_notified`.
 
---
 
## `savings_goals`
Tracked-but-untouchable-for-budgeting savings targets, sitting physically in the savings account.
 
| field | type | notes |
|---|---|---|
| name | text | "New GPU" |
| type | select | emergency / large_purchase |
| target_amount | number | nullable for emergency fund |
| current_amount | number | |
| deadline | date | nullable |
| archived | bool | once purchased/closed |
 
---
 
## `accountability_partners`
| field | type | notes |
|---|---|---|
| name | text | |
| imessage_handle | text | phone or Apple ID BlueBubbles sends to |
| active | bool | |
 
---
 
## Key relations at a glance
 
```
buckets 1──n sub_buckets
sub_buckets 1──n sub_purchases
transactions 1──n sub_purchases
accounts 1──n transactions
sub_buckets n──n transfers (as from/to)
savings_goals ←── budget_cycles (rollover_destination)
```
 
## Strict sum constraints
 
Both of these are hard requirements, not suggestions — PocketBase doesn't enforce cross-record sums natively, so both need a server-side hook, not just client-side validation (a client check alone can be bypassed by hitting the API directly).
 
**1. `sub_purchases.amount` must sum exactly to `transaction.amount`**
- Enforce in a PocketBase `onRecordBeforeCreateRequest` / `onRecordBeforeUpdateRequest` hook (JS, in `pb_hooks/`) on `sub_purchases`: after any create/update/delete affecting a transaction's splits, recompute the sum and reject the write if it doesn't match exactly.
- Practical flow for the UI: when splitting a transaction, don't let the user submit until the running total equals the transaction amount — show the remaining-to-allocate delta live, same pattern Actual/YNAB use for splits. The hook is the backstop in case the UI is bypassed, not the primary UX.
- Edge case to decide later: rounding on 3-way splits ($10.00 ÷ 3) won't divide evenly in cents — you'll want the UI to auto-assign the leftover penny to one split rather than blocking the user on an impossible exact split.
 
**2. `sub_bucket.guideline_percent` must sum to 100% within a bucket**
- Enforce in a hook on `sub_buckets`: on create/update, sum `guideline_percent` across all non-archived sub-buckets sharing the same `bucket`, reject if ≠ 100.
- This means adding a new sub-bucket to a bucket now requires taking percentage from existing sub-buckets in the same action — the UI should probably support "add sub-bucket, redistribute remaining % proportionally across siblings" as a one-step action rather than making you manually edit every sibling first.
- Archiving a sub-bucket has the same problem in reverse — its % needs to be redistributed to the survivors, so archiving should trigger the same redistribution flow, not just a flag flip.
 
## Other things to double check once you're building
- PocketBase's relation fields are single-value by default for "single relation" — confirm `sub_bucket` on `sub_purchases` is set to single, not multiple.
- Cycle rollover (closing one `budget_cycle`, zeroing sub_bucket spend, opening the next) is a scheduled job, not a PocketBase-native feature — same cron mechanism you'll use for the Plaid sync.
 
