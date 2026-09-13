---
type: audit
status: current
updated: 2026-09-12
---
# Route and attack-surface audit
[[Home]] ? [[Engineering Standards]] ? [[Feature Catalog]]

Scope: tracked Next.js frontend and Python scaffold, plus the separate landing page. This is an application-code inventory, not a penetration-test certification.

| Route / Handler | Method | Auth | Cost Tier (1-4) | Protection | Vulnerability Risk |
| --- | --- | --- | --- | --- | --- |
| Web-app / | GET | Public guest | 4 | Static content; no outbound model calls | Low application cost; host volumetric protection remains a platform dependency |
| /patterns | GET | Public guest | 4 | Bounded local catalog, text-only search, authored hints, fixed external links | No code execution or account synchronization; external practice has its own terms |
| /curriculum | GET | Public guest | 4 | Local bounded catalog; client-side filtering | Low |
| /learn/[slug] | GET | Public guest | 4 | Known lab IDs; unknown IDs return 404 | Low; arbitrary path inputs cannot execute code |
| /progress | GET | Public guest | 4 | Validated browser storage; no database | User can edit their own local progress; never use as certification |
| PRIMM prediction, trace, hint, completion | Browser interaction, no HTTP handler | Guest | 4 | Bounded numeric inputs; pure functions; schema-checked local storage | No paid-call exposure; persistence is device-local |
| Marketing / and hash navigation | GET | Public | 4 | Static assets; no form or inference handler | Motion/readability assessed separately |
| Next.js assets and image routes | GET | Public | 4 | Framework validation; self-hosted fonts/assets | Keep Next.js patched; CDN bandwidth exposure |
| Python tutor main.py | No deployed HTTP entry point | Not exposed | Future 1 | Scaffold only; no provider enabled | Do not expose until auth, budgets, shared limiter and output evaluation pass |
| API routes / server actions / uploads / webhooks | None currently implemented | N/A | N/A | No surface to wrap yet | Re-audit in every feature PR |

## Findings and dispositions
- No current paid inference or arbitrary code execution endpoint: no live denial-of-wallet path was found in application code.
- No server-enforced auth or durable progress yet. Guest browser storage is intentionally untrusted.
- No distributed limiter or edge custom rule is live today. Do not claim these controls exist simply because the standard requires them.
- Deployment tooling initially included vulnerable transitive packages. The locked overrides remove all advisories in the verified install; CI must keep auditing them.
- Marketing motion stays enabled per the explicit September 14 request; the learning workspace still follows device reduced-motion preferences. The decorative cursor does not intercept input and is absent on touch devices.
- New Tier 1-3 handlers are blocked from release until their feature acceptance checks are implemented, including shared-store outage and concurrent request tests.

## Next route contracts (planned, not exposed)
| Route / Handler | Method | Auth | Cost Tier | Required protection | Risk before controls |
| --- | --- | --- | --- | --- | --- |
| GraphQL progress mutation | POST | Verified Clerk subject + ownership | 3 | CSRF/origin policy, body limits, shared limiter, idempotency | Cross-user writes |
| GraphQL hint request | POST | Subject + tenant | 1 | Fail-closed quota + spend reservation + concurrency + total deadline | Unbounded inference cost |
| GraphQL execution submission | POST | Subject + tenant | 2 | Admission limit, bounded queue, sandbox quotas | Compute exhaustion |
| Clerk webhook | POST | Verified signed provider event | 3 | Raw-body signature, replay dedupe, event allowlist | Identity corruption |
| Worker result RPC | Private gRPC | Service identity + scoped run | 3 | mTLS, schema, idempotency, no worker DB credentials | Forged completion |
