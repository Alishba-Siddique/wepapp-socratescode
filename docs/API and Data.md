# API and data contracts
[[Home]] ? [[Architecture]] ? [[Security Audit]]

The versioned domain contract is `contracts/progress.graphql`. The gateway derives the user ID from the Better Auth session, never from a client-supplied owner field.

## Public frontend proxy
- `GET /api/account/status`: whether an account gateway and email recovery are available.
- `/api/auth/*`: fixed allowlist for session, email signup/signin, signout, verification and reset. Auth semantics remain Better Auth's.
- `POST /api/graphql`: one bounded operation and one root field. Body limit 64 KiB, query limit 8,000 characters, parser limit 1,000 tokens, at most 40 fields; fragments/introspection/batching are rejected.
- Proxy deadline: 15 seconds. The gateway is a fixed server-only URL, not an arbitrary forwarding target.

## Progress operations
`myProgress` returns the authenticated learner's rows. `saveProgress(input)` requires lab slug, immutable lab version, expected revision and a JSON-encoded state. The service validates known labs and legitimate guided-stage state. A stale revision is a conflict; refresh deliberately rather than overwriting blindly.

`importGuestProgress(key, entries)` is a transaction with a stable idempotency key and payload hash. Reusing a key for a different payload is rejected. Existing account rows win. A retry does not create duplicate progress.

Authentication failures use 401, origin failures 403, oversized bodies 413, genuine admission rejection 429 plus Retry-After, and dependency outages 503 plus Retry-After. GraphQL domain errors have an extensions.code. Clients inspect both transport errors and GraphQL errors, and mutations are not automatically retried.

## Data ownership
| Table | Purpose / rule |
| --- | --- |
| User, Account, Session, Verification | Better Auth identity and revocable sessions; credentials are hashed |
| Progress | Unique `(userId, labSlug)`, lab version, revision and validated state |
| ProgressImport | Owner-scoped import key and payload hash for replay protection |
| AdmissionBucket | Atomic shared counter with expiry; keys are HMAC-derived |

No code draft, design answer or live AI conversation is stored in the account database in this increment. PRIMM completion and public browser execution results are self-reported learning signals, never trusted certification. Migration history is in `gateway/prisma/migrations`; apply with `db:deploy`, not schema push in production.
