---
type: roadmap-handoff
updated: 2026-11-19
---
# Build roadmap

## Guiding rule

Build the next learner outcome, then add only the infrastructure that outcome requires. Do not build microservices because they sound enterprise-grade.

## Now: strengthen the working guest journey

1. Ship and verify the responsive sidebar release on production, including short desktop and phone landscape checks.
2. Expand practical curriculum deliberately: testing, terminal fluency, Git collaboration, HTTP/networking, SQL/database design, business invariants, concurrency, and system design cases.
3. Add more authored product projects where the learner traces real-world constraints before coding. Each project needs a contract, edge cases, a runnable exercise, and an explanation prompt.
4. Improve misconception-specific feedback and progressively remove scaffolding. Completion should show the learner why a decision was wrong, not just mark it incorrect.

## Next: turn accounts into a real service

1. Provision a separate PostgreSQL database, gateway host, and transactional email provider. Do not reuse NexaERP data or credentials.
2. Set required secrets in the host, run reviewed migrations, and validate signup, verification, reset, logout, save/reload, idempotent import, cross-user denial, throttling, backup, and restore.
3. Keep account-dependent UI unavailable until the complete environment is proven. Browser drafts remain local unless a separate sync contract is designed.

## Then: trusted remote execution

1. Define the runner API and idempotency/run-state contract.
2. Select a real isolation mechanism. A process, container, or Go service alone is not enough.
3. Enforce network denial, CPU/memory/time/process/output limits, read-only base image, ephemeral disk, cancellation, and audit-safe logs.
4. Add a transactional outbox and queue only when long-running runs require asynchronous scheduling.

## Later: live Socratic tutoring and organizations

Live tutoring needs a question-only contract, output validation, prompt-injection evaluation, budgets, rate limits, cancellation, provider timeouts, and authored fallback. Organizations need a written membership lifecycle, role matrix, tenant isolation tests, retention/export/deletion policy, audit events, and support/incident ownership.

## Hosting direction

Cloudflare is a desired direction, not a completed migration. Validate Next.js compatibility, private gateway connectivity, database/SMTP access, encrypted secrets, headers, observability, candidate deployment, and rollback before changing production hosting. Open-source dependencies do not guarantee zero hosting cost.
