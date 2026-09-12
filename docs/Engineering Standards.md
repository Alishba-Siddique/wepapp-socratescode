---
type: policy
status: accepted
updated: 2026-09-12
---
# Engineering standards
[[Home]] ? [[Security Audit]] ? [[System Design]] ? [[Delivery]]
The user's [[reference/Engineering Mandate]] is the baseline. Apply controls to real entry points and label future architecture clearly. Earlier requests for always-on animation are superseded by the mandate's reduced-motion requirement.

## Reliability and data
PostgreSQL is authoritative. The NestJS gateway owns transactions; never dual-write PostgreSQL and RabbitMQ or a search index. Persist an outbox row in the same transaction as the domain change, publish with confirms, and mark delivery afterward. Consumers deduplicate by event ID and acknowledge only after committing the effect. Delivery is at least once; there is no exactly-once claim.

Define versioned GraphQL, protobuf and event schemas before integration. Store immutable lab and prompt versions. Use expand/backfill/contract migrations; retain a compatible previous application version throughout rollout. Test duplicate events, delayed delivery, partial failure and restore procedures.

Vector search is a derived index, introduced only for a defined retrieval feature. Keep source IDs/version/deletion tombstones in PostgreSQL. Use hybrid full-text + dense retrieval with RRF and authorized tenant filters. Backfill a new immutable collection, verify results, then switch its pointer; retain the previous index for rollback.

## Inference and execution
LLMs are untrusted external dependencies. A launch requires bounded input/output, schema validation, cancellation, total deadline, at most two paid attempts within one shared budget, full-jitter retry only for transient errors, and a deterministic authored-hint fallback. Do not retry authorization failures or automatically multiply calls across providers. Cache keys include tenant, authorization scope, lab version, model, prompt version and normalized input. Cache hits do not bypass authorization.

Reserve per-user, organization and global cost/concurrency budgets atomically before a paid call; reconcile actual usage afterward. Disable paid inference when budget state is unavailable. Monitor p95/p99 TTFT, inter-token latency, timeout rate and cost per successful hint. No model provider is enabled today.

Execution is isolated, ephemeral, non-root, network-denied and resource-bounded. Neither runner nor model tools can write primary stores. Never use eval or present authored traces as arbitrary code execution.

## Security and error UX
[[Security Audit]] inventories routes, methods, identity and cost tier. All new handlers update it in the same PR.
- Edge: verify platform DDoS protection and configure IP throttling before launching expensive endpoints. Do not trust arbitrary forwarded headers.
- Application: atomic shared Valkey/Redis token buckets, authenticated subject + organization + endpoint keys; anonymous requests use a trusted ingress IP with a short-lived privacy-preserving hash. Avoid persistent device fingerprinting.
- Tier 1: fail closed on limiter/budget failure. Tier 2/3: conservative failure or queue admission policy. Tier 4 public reads: fail open with telemetry; authorization and input validation always remain enforced.
- True quota rejection: HTTP 429 with Retry-After (seconds), X-RateLimit-Limit and X-RateLimit-Remaining. Dependency outages: 503 with Retry-After, rather than pretending a quota was exceeded.
- Client: parse seconds and HTTP-date Retry-After, show a polite live status countdown, disable retry until the deadline, never automatically retry a mutation without an idempotency key.
- Webhooks: verify raw-body signatures, timestamps and replay IDs before processing.
- No raw secrets or private learner code in ordinary logs. Append-only audit events contain references, prompt versions and redacted metadata; separately authorized evaluation samples have retention/deletion controls.

## Motion
Lenis is for marketing; code editors and the learning workspace keep native scrolling. One RAF loop, ResizeObserver, cleanup of listeners/frames/instances, native touch pass-through, and live reduced-motion preference changes. No React state per scroll frame. Mobile drawers prevent background scrolling. Essential content is visible with motion disabled.

## Definition of done
A feature spec with acceptance criteria, changed route audit, contract and tests where relevant, green CI, operational configuration, accessible failure states, and updated verification evidence. "Implemented", "configured", "verified" and "planned" are distinct. A scaffold is not a deployed service.
