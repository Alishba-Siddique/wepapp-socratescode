# Architecture
[[Home]] ? [[API and Data]] ? [[Security Audit]] ? [[Local Development]]

## Implemented boundaries
| Component | Responsibility | Persistence |
| --- | --- | --- |
| Next.js 16 / React 19 frontend | Learning UI, public catalogs, same-origin account proxy | Guest storage and local drafts |
| Monaco editor | Editing Python; syntax highlighting; simple textarea fallback | Drafts in browser storage |
| Opaque sandbox iframe + Pyodide worker | Learner Python execution with public inputs | Ephemeral worker; no account capability |
| NestJS 12 / Express 5 gateway | Better Auth endpoints and bounded GraphQL progress operations | Sole application owner of PostgreSQL access |
| Better Auth | Email/password credentials, DB sessions, verification/reset via configured SMTP | Prisma-backed identity tables |
| PostgreSQL 17 / Prisma 7 | Users, sessions, revisioned progress, imports and atomic admission counters | Authoritative account state |

Account requests follow browser ? Next.js `/api/*` allowlisted proxy ? private gateway ? PostgreSQL. Gateway origin must match the browser origin; do not trust arbitrary forwarded-IP headers. Auth is Better Auth HTTP; domain operations use `contracts/progress.graphql`. Shared lab definitions live in `contracts/learning.ts`.

Code follows editor ? opaque sandboxed `/runner` iframe ? dedicated module worker ? Pyodide. It never goes to the gateway. CSP allows only runtime asset downloads, not app-service access. Parent accepts messages only from the frame with the matching run ID. The parent enforces a 60-second load deadline and 5-second execution deadline. This bounds elapsed time; it is not a hard browser memory quota or a server assessment sandbox.

## Deliberately separate state
Guest PRIMM progress remains local. Account progress is loaded into separate tab memory and saved explicitly using optimistic revisions. Guest import is explicit and idempotent; existing account rows win. Coding/design drafts remain browser-only and are not advertised as synchronized. Pattern reflections are page-local.

## Planned boundaries
A server judge, Go execution service, Python contextual tutor, RabbitMQ outbox, Valkey admission, organizations and live inference are not connected. Define contracts and operational budgets before adding them. PostgreSQL currently provides shared atomic admission for accounts; the earlier Valkey design remains a later scaling decision.

Cloudflare is the requested hosting direction, not the verified deployment. The existing Vercel delivery workflow remains in place. A Cloudflare migration needs a compatible Next adapter/runtime, private gateway hosting, database connectivity, SMTP, asset sizing and an end-to-end candidate test. Do not promise zero hosting cost from open-source licenses.
