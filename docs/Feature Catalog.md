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
| Guest dashboard and curriculum | Find one of nine logic labs | Implemented | Search, navigation, empty states and mobile verified |
| Five PRIMM stages | Predict, trace, investigate, modify and explain | Implemented | Wrong answers do not unlock completion; full browser journey |
| Authored Socratic hints | Receive a question rather than a solution | Implemented | Clearly authored; no claim of live AI |
| Local progress | Resume on this browser | Implemented | Validate persisted shape; corrupted storage recovers; reload preserves completion |
| [[features/Accounts and Progress]] | Save PRIMM progress across devices | Implemented when configured | Real DB sessions, revisions, explicit import; production hosting/SMTP pending |
| [[features/Execution and Events]] | Execute real code safely | Planned | Contract, isolated runner, RabbitMQ outbox and bounded admission |
| [[features/Socratic Tutor]] | Contextual, bounded-cost questions | Planned | Model evaluation, shared limiter, budgets, 429 UX and deterministic fallback |
| Organizations and cohorts | Teach and review team reasoning | Planned | Permission matrix, tenant-isolation tests, privacy/retention requirements |
| Independence leaderboard | Reflect reasoning with genuine signals | Deferred | Anti-gaming assessment design; never trust local progress as score |
| [[Delivery]] | Ship verifiable releases and recover failures | Implemented workflow; remote verification recorded in Session Log | Green required checks, candidate smoke tests and explicit release evidence |

## Stack and cost policy
Use Next.js/React, NestJS, PostgreSQL/Prisma, Go, Python, RabbitMQ and Valkey (Redis-compatible) as open-source components. Prefer self-hostable local development; publish licenses and pin versions when introducing each dependency. Running open-source software still consumes compute/storage.

Better Auth's MIT-licensed, self-hosted core replaces the earlier Clerk choice; see [[Decisions]]. Authentication still requires database, compute, operational maintenance and email delivery. Cloudflare is the requested hosting direction; the current deployment remains on Vercel until migration is verified. Cloudflare, Vercel and GitHub are hosted services. No paid feature, provider billing or automatic plan upgrade is authorized. Live inference remains disabled until a provider and a hard budget are explicitly configured.

## Working rhythm
Choose one feature note -> define observable acceptance -> update contracts -> implement -> test failure paths -> update audit/decision notes -> PR with CI -> verify deployment -> record evidence. Keep tasks in Markdown checklists; no paid Obsidian plugin required.

## Interview pattern library
/patterns adds 17 searchable pattern notes, family filters, expandable authored questions and external practice links. It does not claim runtime execution, AI hints or lab completion. See [[features/Interview Patterns]].

## September 20 learning expansion
| Feature | Implemented scope | Limit |
| --- | --- | --- |
| Python editor | Monaco, 20 problems, custom input, visible tests, console, stop/deadline | Browser execution; no hidden judge or account draft sync |
| GitHub exercises | Eight MIT-licensed Exercism specs, 88 selected public cases | Pinned revision and reviewed adapters |
| Socratic pattern lessons | 17 prediction/trace/reflection sequences | Authored feedback; no automatic prose grading |
| DSA in products | Sourced use, mechanism and tradeoff for every pattern | Illustrative designs labeled explicitly |
| Design interviews | Six exercises across system, database and architecture | Introductory self-review, not a senior certification |
| Design notes | Browser drafts and Markdown export | No remote synchronization |
