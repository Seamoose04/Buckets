# TODO / Build Roadmap
 
Status markers: `[ ]` not started · `[~]` in progress · `[x]` done
 
## Phase 0 — Foundation
- [x] Feature spec locked (buckets/sub-buckets, income types, cycles, transfers, subscriptions, splitting, savings goals)
- [x] Stack decided (Next.js + PocketBase + Plaid + BlueBubbles)
- [x] PocketBase schema designed (`pocketbase-schema.md`)
- [x] Chart concept prototyped (`budget-sunburst.jsx`)
- [x] Project scaffolding: Next.js app + PocketBase container, both on aiserver, both behind NPM (PocketBase not publicly exposed — only reachable from the Next.js container)
- [ ] PocketBase collections actually created from schema doc, including the `pb_hooks/` for the two strict-sum constraints
 
## Phase 1 — Data in, prove the pipe works
- [ ] Plaid developer account set up (Development tier)
- [ ] Plaid Link flow: link-token creation → client-side Link widget → public_token exchange → encrypted access_token stored in `accounts`
- [ ] Manual sync trigger (button, not cron yet) pulling transactions into `transactions` + auto-creating one `sub_purchases` row each
- [ ] Raw transaction list view — just confirm data lands correctly before building anything on top
 
## Phase 2 — Core budgeting loop
- [ ] Bucket + sub-bucket CRUD, including the guideline-% redistribution flow (add/archive a sub-bucket → redistribute % across siblings in one action)
- [ ] Auto-categorization: map Plaid's category taxonomy → your sub-buckets, with manual override per sub_purchase
- [ ] Dashboard: pie + blob chart wired to real data, per bucket/sub-bucket
- [ ] Percent bar + dollar bar supplementary view
- [ ] Budget cycle logic: 4-week period tracking, reset-to-0 at close, leftover prompt (→ savings or → goal)
- [ ] Standard budget builder from base income (must cover Bills + Needs)
 
## Phase 3 — Transfers & accountability
- [ ] Sub-bucket → sub-bucket instant transfer (same parent)
- [ ] Bucket → bucket transfer with required written reason
- [ ] Direction detection (Need-feeding-Want vs Want-feeding-Need)
- [ ] BlueBubbles integration: hit the Mac mini relay's REST API from the transfer route when direction = Need loses money
- [ ] Accountability partner record + config (single partner for v1)
- [ ] Confirm SMS/iMessage fallback still works for the specific partner (recipient is iOS, so should just work over iMessage)
 
## Phase 4 — Income handling
- [ ] Base income entry + recurring assumption tracking
- [ ] Bonus income detection + allocation prompt (doesn't need full allocation, just needs an eligible destination)
 
## Phase 5 — Automation
- [ ] Scheduled sync via system cron hitting a protected API route (replaces the manual button from Phase 1)
- [ ] `ITEM_LOGIN_REQUIRED` handling — BofA will eventually force Plaid re-auth, need a clear "reconnect" UI path
 
## Phase 6 — Subscriptions
- [ ] Auto-detection via Plaid recurring-transaction data / pattern matching
- [ ] Manual flag toggle on any transaction
- [ ] Subscriptions view (filtered list, total monthly recurring spend)
 
## Phase 7 — Savings goals
- [ ] `savings_goals` CRUD (emergency fund + named large-purchase goals)
- [ ] Rollover-to-goal flow at cycle close
- [ ] Enforce "never budget from savings" at the app layer, not just by convention
 
## Phase 8 — Quality of life (do only if still wanted once core works)
- [ ] Manual transaction entry (for cash purchases Plaid won't see)
- [ ] Payee rename/cleanup rules
- [ ] CSV export
- [ ] Search/filter transactions
- [ ] Multi-account support beyond the current checking/savings pair
 
---
 
## Open questions to resolve before/during the relevant phase
- Large-purchase goals: fixed target + deadline, or open-ended top-up bucket? *(needed by Phase 7)*
- Exact BlueBubbles message content for accountability notifications — bucket names + amount + reason, or a vaguer "check the app"? *(needed by Phase 3)*
- Rounding behavior on splits that don't divide evenly into cents *(needed by Phase 2, flagged in schema doc)*
 
