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

## Chrome companion and personal tests
The existing quality job runs `node extension/build.mjs`, `node --test extension/tests/model.test.mjs` and `python3 extension/package.py --check`. The existing Chromium browser job runs `node extension/tests/browser.mjs` with the real unpacked MV3 extension. It covers real extension storage, URL rejection, stage guidance, note export, deletion, failed writes and narrow layout. Tab capture is mocked; manually verify the real toolbar gesture and activeTab grant on a LeetCode problem before wider distribution.

The learning browser suite covers personal test validation, failing/passing code, edits that clear old results, reload/removal, storage failure and no award of platform completion. Local npm/npx commands remain reserved for the owner; remote CI performs frontend lint/type/build and browser gates. No extra CI workflow or scheduled runs were added for these features.

## Product project journey
The learning browser suite exercises wrong identity reasoning, trace-gated editor access, retained progress when reviewing an earlier frame, failing and passing Python, six contract cases, review hiding after edits/reload, mobile width, note export, persistence and failed storage. Domain tests reject impossible/corrupt milestones and overlong notes. User-owned npm/npx commands remain reserved locally; CI runs frontend lint, types, build and all browsers.

## Engineering foundations
Domain tests exercise five complete lesson sequences, rejected commands, staged Git versions, SSH context, shop access/price/quantity rules and bounded storage parsing. The existing three-browser learning suite now covers wrong-answer gating, all five lessons, persistence, storage failure, reset, searchable references, mobile width and text-only rendering. It asserts frontend security headers and keeps existing opaque Python-runner execution coverage. No additional scheduled workflow or paid service was added.

Secure checkout browser coverage checks incorrect prediction, correct diagnosis, deliberately unsafe starter failure, all 18 contract cases under actual Python, review invalidation, code persistence and mobile width. It runs inside the existing three-browser learning suite; no extra workflow or schedule.

## Responsive workspace regression matrix
The existing three-browser suite now checks 17 routes at 320, 768, 1024 and 1440px. It also verifies independent sidebar scrolling at short desktop height, the final link at 390x480 and 568x320, Tab/Shift+Tab containment, Escape/overlay dismissal, inert content and scroll restoration on desktop resize. Existing editor/learning flow tests remain enabled. CSS preview inspected in Edge before CI.

## 2026-10-07 responsive audit reliability
The October 3 main run failed on a WebKit RSC-prefetch teardown error during rapid full-page navigations, after the PR had passed. The later scheduled run passed but could not deploy because scheduled events intentionally do not release. Each route in the viewport audit now gets its own page; it remains mounted for all widths, drains requests before closing, and captures its own failure screenshot. All page-error, HTTP status, viewport and navigation assertions remain enforced. Landscape evidence disables screenshot transitions to capture the settled drawer.
