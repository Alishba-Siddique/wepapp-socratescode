---
type: decision-handoff
updated: 2026-11-19
---
# Decisions, risks, and questions

## Decisions already made

| Decision | Rationale |
| --- | --- |
| Better Auth rather than Clerk | Self-hosted identity backed by the application database; no vendor auth API key is needed. |
| PostgreSQL is the source of truth | Transactions, migrations, admission counters, and durable progress have one owner. |
| Guest-first product | The learning experience works before account infrastructure is provisioned. |
| Native app scrolling | Editors, drawers, touch behavior, and keyboard focus remain predictable. |
| Authored Socratic guidance first | Avoid pretending a scripted response is live AI or providing full solutions. |
| Browser Python for practice only | Gives immediate feedback without a remote judge, while honestly limiting trust and resource control. |
| No arbitrary server URL fetch | Prevents an SSRF entry point until a purpose-built safe-fetch boundary exists. |
| Vercel remains current production path | Cloudflare is a planned migration that needs full compatibility and candidate validation. |

## Risks to manage

1. **Account launch risk:** The code exists but production account infrastructure, database, SMTP, backups, and restore proof are not complete. Keep the public account capability unavailable until then.
2. **Execution trust risk:** Browser sandboxing is suitable for learning but cannot establish a secure assessment/judging environment.
3. **Scope risk:** Enterprise services should be added only after the guest learning flow and account service are measurably useful.
4. **Security drift:** New uploads, webhooks, server actions, URL fetching, email, exports, AI calls, or queues each create a new trust boundary and need a security review.
5. **Content/license risk:** User-supplied PDFs and GitHub references guide topic coverage. Do not publish copied problem text or claim a license without checking it.
6. **Cost risk:** AI, execution, runner-heavy browser tests, and hosted services need budgets and explicit operational ownership.

## Questions for the product owner

- Which learner outcome is the next paid/business priority: interview practice, a beginner curriculum, a cohort product, or a business-skills academy?
- Is durable account progress needed now, and which database/email host is available without touching NexaERP?
- Which first external URL feature is actually required, if any? Prefer trusted provider/domain integrations over generic “fetch any link.”
- What is the Cloudflare target: Pages only for the frontend, Workers, or a complete frontend/gateway migration? This changes the technical design.
- What evidence will define a successful learner outcome: a completed project, mock interview rubric, job-search milestone, or something else?

## Definition of done for the next feature

An accepted feature has a written learner outcome, contract, threat/rate/cost review, accessible error states, tests for success and denial paths, updated docs, green CI, and deployment evidence. A scaffold, UI mock, or environment variable is not a completed production capability.
