---
type: audit
status: current
updated: 2026-09-20
---
# Route and attack-surface audit
[[Home]] ? [[Architecture]] ? [[Engineering Standards]] ? [[Testing]]

This inventories implemented application controls. It is not a security certification or evidence of configured production infrastructure.

| Entry point | Identity / cost | Implemented control | Remaining boundary |
| --- | --- | --- | --- |
| GET /, /curriculum, /progress, /patterns, /patterns/[id], /practice, /design, /design/[id] | Public / tier 4 | Local catalogs; known dynamic IDs; text rendering; drafts validated before loading | Local progress is untrusted |
| GET /learn/[slug], /solve/[slug] | Public / tier 4 | Known IDs; unknown routes 404; visible inputs/checks | Completion is not certification |
| GET /runner | Public / tier 4 server cost | Opaque iframe, CSP, nonce, no-store, no forms/frames; worker origin isolation | Browser execution has no hard memory quota |
| Python worker execution | Local learner device | Separate worker, parent deadlines (60s load / 5s run), output display cap, source frame + run ID check, runtime-only network CSP | A malicious learner can alter their own results; no server judge |
| GET runtime assets | Public / tier 4 | CORS only for public Python assets; pinned dependencies and retained notices | Download bandwidth; keep versions patched |
| GET /api/account/status | Public / tier 4 | Fixed upstream proxy; unconfigured service reported explicitly | Does not imply DB health; use private gateway /health |
| /api/auth/* allowlist | Public/session / tier 3 | Better Auth; origin checks; same-origin proxy; secure production cookies; production verification; process-local burst limit before shared atomic admission | SMTP/HTTPS/private ingress must be configured |
| POST /api/graphql ? gateway /graphql | Session / tier 3 | Ownership from session; 64 KiB body; bounded AST; one root; no batching/introspection; shared per-user admission; validated state; revisions | Admission currently shares a conservative proxy-IP bucket |
| Gateway GET /health | Private operational / tier 4 | DB readiness probe; sanitized 503 | Keep gateway private; edge protection not configured here |
| Password reset and verification | Token / tier 3 | Better Auth tokens, configured mail transport, reset session revocation | Production mail delivery and abuse monitoring need deployment verification |

## Storage and privacy
Account progress is separate from guest browser progress. Import is explicit and idempotent; existing account records win. Coding/design drafts are device-local and visible to others using the same browser. Account work is tab memory until explicitly saved. No learner code or prose is sent to a model or remote judge.

The proxy bounds streamed request bodies and uses a fixed service URL with a 15-second timeout. Gateway auth preserves Better Auth's stream; direct gateway ingress must enforce a 64 KiB body limit too (including chunked requests) and remain private. The gateway does not trust forwarded client-IP headers. Its HMAC-keyed PostgreSQL admission counter is atomic and fails closed on store failure. Valkey-based distribution and trusted per-client ingress limits are future deployment work.

## Release gates still open
Production account launch requires verified HTTPS/origin/cookies, private gateway ingress/body limits, SMTP delivery/verification/reset checks, PostgreSQL backups and restore evidence, connection limits, monitoring and retention/deletion procedures. The browser runner is local practice only. A trusted remote judge needs a separately isolated resource-bounded execution service and admission contract. Live AI, organizations, RabbitMQ and webhooks are not exposed.

## 2026-09-20 PR security review
Auth now runs standard `express-rate-limit` middleware (60 requests per minute, socket IP with IPv6 grouping) before the existing HMAC-keyed PostgreSQL quota. The local store reduces database work during bursts; PostgreSQL remains authoritative across instances and process restarts. Neither layer trusts forwarded client IPs. A private proxy still shares its conservative ingress allowance; trusted client identity and edge throttling remain deployment work. Both layers return 429/retry headers. Store failures return a sanitized 503.

The account browser runner emits a fixed failure message instead of logging caught exception text, which may contain environment-derived configuration. No scanner suppression or alert dismissal was added. Tests cover blocked auth requests without further DB work, spoofed forwarded IPs, shared admission in a fresh gateway, and an unavailable database.
