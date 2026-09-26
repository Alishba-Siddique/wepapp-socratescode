# Production configuration
[[Home]] - [[Local Development]] - [[Security Audit]] - [[Delivery]]

## What works without keys
Guest lessons, the beginner journey, browser progress, the Python editor and authored Socratic questions need no external API keys. Python executes on the learner's device. Live AI is not implemented; adding an OpenAI key does not enable a tutor.

## Optional accounts
The gateway must be deployed as a Node service with access to sibling `contracts`, reachable from the frontend server, with the private ingress and body limits described in [[Security Audit]]. Database credentials alone do not deploy this service. Production needs a separate socratescode PostgreSQL database; do not reuse NexaERP production data or credentials. The user reports their existing Neon allocation is used by NexaERP; confirm available capacity before provisioning another project. No paid upgrade is authorized.

| Set on | Name | Secret? | Purpose |
| --- | --- | --- | --- |
| Gateway | `DATABASE_URL` | Yes | PostgreSQL connection string for this application; use provider TLS requirements |
| Gateway | `BETTER_AUTH_SECRET` | Yes | Unique random secret of at least 32 characters; not a vendor API key |
| Gateway | `BETTER_AUTH_URL` | No | Public frontend origin, currently `https://wepapp-socratescode.vercel.app` |
| Gateway and frontend | `APP_ORIGIN` | No | Same public origin, without trailing slash |
| Gateway | `NODE_ENV` | No | `production` |
| Gateway | `HOST`, `PORT` | No | Host-specific bind address and port; avoid directly exposing an unprotected listener |
| Gateway | `SMTP_HOST`, `SMTP_PORT` | No | Transactional mail server settings |
| Gateway | `SMTP_USER`, `SMTP_PASSWORD` | Yes | SMTP credentials from the chosen mail provider |
| Gateway | `SMTP_FROM` | No | Verified sender for signup verification and password reset |
| Gateway | `SMTP_SECURE` | No | `true` for implicit TLS, otherwise follow the provider's SMTP transport requirements |
| Frontend server | `GATEWAY_URL` | No* | Gateway address reachable from the frontend runtime; never prefix with `NEXT_PUBLIC_` |

*Do not embed credentials in the gateway URL. Secrets belong in the host's encrypted environment settings. For local development use ignored `.env` files. Never place values in this vault, README, issue, screenshot or chat.

Better Auth is self-hosted here: there is no Clerk key or Better Auth cloud API key. The runtime uses a database URL, not a Neon management API key. OAuth provider keys are not required because social sign-in is not connected.

Generate the auth secret locally and copy it directly into the gateway secret manager:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Before launch, run reviewed migrations against the new database and verify signup email delivery, email verification, login, logout, reset, cross-user denial, save/reload, backups and restore. Keep accounts unavailable in the public UI until the service is ready. Coding/design/first-steps drafts remain local even when PRIMM account saves are configured.

## Deployment automation
Existing Vercel CI uses project-scoped `VERCEL_TOKEN` secrets in Staging and Production, plus a staging `VERCEL_AUTOMATION_BYPASS_SECRET`. These are deployment credentials, not application API keys. Cloudflare migration and its credentials remain a separate verified change. Do not rotate working deployment credentials merely to configure accounts.

## Dependency automation and costs
The public web-app repository uses standard GitHub-hosted Linux runners. The September 20 production run reported zero billable milliseconds; no paid runner is configured. This is distinct from the account-wide included-minute alert, which may include other repositories or activities.

The owner's final choice on September 27 is to stop only Dependabot-triggered Actions jobs. CI root jobs and the aggregate check skip events whose `github.actor` is `dependabot[bot]`; dependent build, browser, accounts and release jobs consequently do not run. Human-triggered CI, scheduled security scans and verified main releases remain enabled. Dependabot can still create version and security-fix PRs; alerts remain enabled. The earlier proposed pause of version PRs was withdrawn to match this narrower choice. Disabling security-fix PRs was rejected by approval review and that setting was not changed.

This workflow change takes effect after merge; existing update branches may still contain the old workflow until refreshed. No active Dependabot runs were found when cancellation was checked. A skipped check is not validation: manually dispatch CI on an update branch before merging it, and require the full main checks before production promotion. Re-running a bot-originated run retains its original actor and will still skip; use **Run workflow** with the update branch selected. See [[Delivery]].

Dependabot does not invoke Codex in these workflows. Separately enabled automatic Codex GitHub reviews consume code-review allowance; their private integration settings have not been inspected. Codex development sessions consume their own plan allowance or API usage. The repository timing check does not identify the source of the account-wide minute usage.

Sources: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Dependabot configuration](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates), [Codex pricing](https://learn.chatgpt.com/docs/pricing).
