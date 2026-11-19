---
type: operations-handoff
updated: 2026-11-19
---
# Delivery and operations

## Delivery model

Only a verified `main` commit may be promoted. Pull requests do not receive deployment secrets. The release workflow creates a candidate for the exact commit, verifies project ownership/readiness, runs smoke and deployed-browser checks, then promotes that same candidate. Production and rollback are serialized.

The current production URL is `https://wepapp-socratescode.vercel.app/`. The existing pipeline is Vercel-based. Do not claim a Cloudflare deployment until a separate migration is validated.

## Required GitHub configuration

- Branch protection requires the aggregate `frontend-checks` status.
- Vercel credentials are scoped separately for Staging and Production environments.
- `VERCEL_DEPLOY_ENABLED` controls whether a verified main commit releases.
- `VERCEL_TOKEN` and preview bypass secrets never belong in the repository, docs, screenshots, or browser traces.
- Dependabot PR-triggered runner work is intentionally skipped to control GitHub Actions usage; human CI, scheduled scans, and main release checks remain enabled. A skipped bot run is not evidence to merge it.

## Operations rules

- Inspect the exact workflow run and exact commit SHA before calling a release successful.
- Use candidate evidence before promotion. An old green run or a scheduled run does not validate a later commit.
- For a bad release, use the repository rollback workflow with the known prior production deployment. Record cause, impact, recovery time, source/target commit, and follow-up work.
- Rotate project-scoped deployment tokens before expiry, test a candidate with the new token, then revoke the old token. Never replace a working credential merely because accounts need configuration.

## Cost control

GitHub-hosted CI can consume included Actions minutes. Avoid documentation-only deployment cycles, duplicated workflow runs, and automatic runner-heavy Dependabot builds. Do not disable audits or production checks to save minutes; use targeted PRs and check exact run status instead.

No live AI, remote judge, RabbitMQ, or Cloudflare account cost is currently part of the shipped guest product. Before enabling any paid or unbounded external service, add atomic budgets, quotas, timeout/retry limits, observability, and an explicit fail-closed rule.

## Current maintenance item

The November 16 scheduled scan failed the production dependency audit on Next.js 16.3.8 and DOMPurify 3.4.16. A follow-up pins Next.js/eslint-config-next 16.4.6 and DOMPurify 3.4.17; its local production audit is clean. Merge and verify that exact commit through normal CI and candidate promotion. Do not use `npm audit fix --force`: its proposed Monaco change is unrelated to the direct patched DOMPurify override and needs separate compatibility review.
