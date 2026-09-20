---
type: feature
status: planned
priority: next
---
# Accounts and durable progress
[[Feature Catalog]] ? [[System Design]]
Learners keep their completed work across devices without losing their guest work.
- [ ] Better Auth sign-in/sign-out with server-verified database sessions; guest mode remains usable without configuration.
- [ ] Gateway maps verified subject to internal user; browser IDs are never trusted.
- [ ] Versioned GraphQL progress contract, Prisma migration and ownership policy.
- [ ] Explicit guest import with idempotency and a documented conflict rule; no silent data overwrite.
- [ ] Cross-user/tenant denial, expired session, duplicated import, network outage and 429 countdown tests.
- [ ] No claim of sync until remote writes and reload recovery are verified.

Configuration: BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL and selected OAuth/email provider credentials belong in ignored local environment files and deployment secrets, never in Obsidian. Record names only. Better Auth replaces the earlier Clerk choice; gateway implementation and database/provider configuration are pending. See [[Decisions]].

- [ ] Mount Better Auth HTTP endpoints in the gateway with explicit trusted origins and production cookie settings; keep application operations behind GraphQL authorization.
- [ ] Verify session expiry, revocation/logout, CSRF and callback rejection, account linking and recovery. Apply reviewed Prisma migrations before release.
- [ ] Configure email verification/recovery and selected social providers before exposing their UI; never simulate delivered mail or successful sign-in.
- [ ] Test organization membership and permission changes on the server before adding team features. Organization plugins do not replace resource ownership checks.
- [ ] Validate the chosen domain/proxy arrangement in Chromium, Firefox and WebKit; production sessions must not depend on third-party cookies.

## Implemented contract
The gateway, migration, Better Auth integration, origin-checked frontend proxy, account UI, explicit guest import and revision-checked manual PRIMM saves are implemented. Seven integration tests cover real sessions, ownership, concurrency, import replay, bounded requests, admission and logout. Production email and hosting are not configured. See [[Local Development]], [[API and Data]], [[Testing]] and [[Security Audit]]. Coding/design drafts are intentionally outside account synchronization in this increment.
