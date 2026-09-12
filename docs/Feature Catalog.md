---
type: product
status: current
updated: 2026-09-12
---
# Feature catalog
[[Home]] ? [[Build Plan]] ? [[Engineering Standards]]
Derived from [[reference/PRD]] and [[reference/TRD]]. Build the learning loop before adding organizational complexity.

| Feature | User outcome | Status | Acceptance / next gate |
| --- | --- | --- | --- |
| Guest dashboard and curriculum | Find one of three logic labs | Implemented | Search, navigation, empty states and mobile verified |
| Five PRIMM stages | Predict, trace, investigate, modify and explain | Implemented | Wrong answers do not unlock completion; full browser journey |
| Authored Socratic hints | Receive a question rather than a solution | Implemented | Clearly authored; no claim of live AI |
| Local progress | Resume on this browser | Implemented | Validate persisted shape; corrupted storage recovers; reload preserves completion |
| [[features/Accounts and Progress]] | Carry progress between devices | Planned | Clerk + verified gateway identity + migration + ownership tests |
| [[features/Execution and Events]] | Execute real code safely | Planned | Contract, isolated runner, RabbitMQ outbox and bounded admission |
| [[features/Socratic Tutor]] | Contextual, bounded-cost questions | Planned | Model evaluation, shared limiter, budgets, 429 UX and deterministic fallback |
| Organizations and cohorts | Teach and review team reasoning | Planned | Permission matrix, tenant-isolation tests, privacy/retention requirements |
| Independence leaderboard | Reflect reasoning with genuine signals | Deferred | Anti-gaming assessment design; never trust local progress as score |
| [[Delivery]] | Ship verifiable releases and recover failures | Implemented workflow; remote verification recorded in Session Log | Green required checks, candidate smoke tests and explicit release evidence |

## Stack and cost policy
Use Next.js/React, NestJS, PostgreSQL/Prisma, Go, Python, RabbitMQ and Valkey (Redis-compatible) as open-source components. Prefer self-hostable local development; publish licenses and pin versions when introducing each dependency. Running open-source software still consumes compute/storage.

Clerk is the user's requested exception: open-source SDKs with a hosted proprietary authentication service. Its free plan is not a promise of unlimited or permanently free capacity. No paid feature, provider billing or automatic plan upgrade is authorized. Vercel and GitHub are also hosted services. Live inference remains disabled until a provider and a hard budget are explicitly configured.

## Working rhythm
Choose one feature note -> define observable acceptance -> update contracts -> implement -> test failure paths -> update audit/decision notes -> PR with CI -> verify deployment -> record evidence. Keep tasks in Markdown checklists; no paid Obsidian plugin required.
