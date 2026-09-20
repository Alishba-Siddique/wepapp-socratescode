# Testing
[[Home]] ? [[Delivery]] ? [[Local Development]]

## Commands
From `frontend`: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

From the repository root after the frontend build: `node scripts/run-browser.mjs`. Set `BROWSER=chromium`, `firefox` or `webkit`; `TEST_PORT` changes the default port 3001. Install browser engines with `npx playwright install --with-deps chromium firefox webkit` in frontend. Windows Chromium testing uses installed Edge. The runner uses the production build and captures failure screenshots under ignored `test-results`.

For account integration, set `DATABASE_URL` and `TEST_DATABASE_URL` to a dedicated migrated database whose name ends in `_test`. In gateway, run `npm run db:generate`, `npm run db:deploy`, `npm run build`, `npm test`. Then run `node scripts/run-accounts-browser.mjs` from root. It starts isolated gateway/frontend test ports, checks three browsers and removes its own generated users. Never point these tests at a production database.

## Coverage
- Guided traces, bounds, incorrect reasoning, corrupt storage and persistence.
- Complete lesson coverage and valid practice targets; licensed source attribution and essential imported rules.
- Socratic wrong-answer feedback, stepwise walkthrough and honest self-review.
- Design stage navigation, browser persistence, Markdown export and mobile layout.
- Real Python success/failure, infinite-loop cutoff and next-run recovery; opaque worker origin and blocked private network requests.
- Real account signup, guest import, save, reload, signout, second-context login and guest/account separation.
- Server-side ownership, optimistic conflicts, import idempotency, atomic admission and session revocation.

CI packages generated runtime assets alongside `.next`, checks the artifact digest, then tests Chromium, Firefox and WebKit. The account job uses PostgreSQL 17. Aggregate checks fail when any required job fails; tests are not skipped to mask browser failures.

See [[Session Log]] for the exact results of this change. Production SMTP, restore drills, provider delivery and Cloudflare compatibility remain separate deployment checks.

## Portable installation and release regression
The gateway commits `.npmrc` with `legacy-peer-deps=false`. Generate its lockfile with the same peer resolution used by `npm ci`; a local global legacy-peer setting previously hid missing React peers from Prisma tooling. Verify with an isolated clean install, not just an existing node_modules tree. CI continues to use `npm ci` and does not bypass peer checks.

Gateway integration coverage now includes ten checks, including actual auth route throttling, shared admission and sanitized store outages. Candidate releases run both browser journey scripts, including actual Python execution and design drafts. Smoke checks include practice, solver, pattern lesson and design routes.
