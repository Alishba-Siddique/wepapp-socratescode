---
type: feature
status: planned
priority: next
---
# Accounts and durable progress
[[Feature Catalog]] ? [[System Design]]
Learners keep their completed work across devices without losing their guest work.
- [ ] Clerk sign-in/sign-out with verified server identity; guest mode remains usable without keys.
- [ ] Gateway maps verified subject to internal user; browser IDs are never trusted.
- [ ] Versioned GraphQL progress contract, Prisma migration and ownership policy.
- [ ] Explicit guest import with idempotency and a documented conflict rule; no silent data overwrite.
- [ ] Cross-user/tenant denial, expired session, duplicated import, network outage and 429 countdown tests.
- [ ] No claim of sync until remote writes and reload recovery are verified.

Configuration: Clerk publishable/secret keys belong in local ignored environment files and Vercel secrets, never in Obsidian. Record variable names only. Clerk project configuration and gateway implementation are pending.
