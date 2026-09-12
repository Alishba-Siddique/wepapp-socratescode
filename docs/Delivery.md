---
type: runbook
status: implemented-pending-remote-verification
updated: 2026-09-12
---
# Delivery and recovery
[[Home]] ? [[GitHub Setup]] ? [[Security Audit]]
Repository: [wepapp-socratescode](https://github.com/Alishba-Siddique/wepapp-socratescode).
Production: https://wepapp-socratescode.vercel.app/

## Checks
Pull requests run workflow syntax validation, release-policy tests, domain tests, ESLint, TypeScript, dependency audit/review, CodeQL, production build and Chromium/Firefox/WebKit learning journeys. The stable aggregate check is frontend-checks. Actions are commit-pinned; Dependabot proposes updates. Browser jobs verify the artifact checksum and commit before using the same build.

CodeQL uploads findings; a successful scanner job does not mean there are no findings. Review Security alerts and use code-scanning rules when available. Dependency review rejects high/critical additions. Deployment tooling has a separate lockfile and compatible patched overrides; audit it as well.

## Release
Only trusted main commits can deploy. PR jobs receive no deployment secrets. A green main run stages a production build without assigning public domains, checks project ID/commit/readiness, smoke-tests routes and runs the deployed learning journey. It then promotes that same candidate. Obsolete candidates whose commit is no longer main are rejected. Release and rollback serialize.

Repository variable VERCEL_DEPLOY_ENABLED must be true after credentials are configured. Staging and Production environments hold scoped VERCEL_TOKEN secrets. Staging also holds VERCEL_AUTOMATION_BYPASS_SECRET; send it only as a header to the verified candidate host, never in URLs, logs or browser trace artifacts. Native Vercel Git deployment is disabled by frontend/vercel.json when this workflow is configured.

Production environment review can be enabled for controlled approvals; solo maintainer self-review must remain possible. Record the actual configured rule in [[GitHub Setup]]. Workflow source alone does not establish environment protection.

## Recovery
1. Inspect failed job logs and candidate screenshots. A candidate failure does not promote it.
2. For a bad live release, open Actions -> Roll back production -> Run workflow on main.
3. Supply the known previous production deployment URL from Vercel/release evidence. Ownership and READY state are checked before rollback.
4. Complete any configured Production review, then verify production smoke tests and manually open a lab.
5. Record incident, source/target commits, user impact, recovery time and corrective PR in [[Session Log]].

Hobby plan rollback may be restricted to the previous production deployment. Do not upgrade plans automatically. This frontend rollback does not roll back a future database: schema changes require expand/contract and tested recovery.

## Credentials
Rotate the project-scoped CI token before expiry; update both environments, validate a candidate, then revoke the old token. Tokens and bypass values never belong in docs. Use existing account access for provisioning; do not store a broad personal CLI token in the repository.
