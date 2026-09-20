# Decisions
[[Home]] - [[Architecture]] - [[Design System]]

## 2026-09-14 - Better Auth replaces planned Clerk integration
**Choice:** use Better Auth's self-hosted, MIT-licensed core with PostgreSQL and Prisma in the planned application gateway. This supersedes Clerk in the original requirements; authentication was planned at this decision date; the September 20 implementation below supersedes that status.
**Why:** the user selected Better Auth after requesting Cloudflare and an open-source stack. We own authentication data and avoid a required hosted identity subscription.
**Boundary:** the browser calls Better Auth's HTTP authentication endpoints; application operations remain GraphQL. The gateway resolves the server session and enforces user ownership and organization membership. Do not wrap OAuth callbacks in GraphQL or trust client-supplied identity.
**Hosting:** Cloudflare frontend migration is a separate pending delivery change. Initially keep authentication with the Node gateway; PostgreSQL, email delivery and gateway hosting still require configuration. Any Workers-hosted auth alternative needs adapter, cookie, callback and CPU-budget verification, including password hashing, before selection.
**Acceptance:** see [[features/Accounts and Progress]]. No database migrations run per request. Apply reviewed Prisma migrations through the release process. Preserve historical release notes and original reference documents.
**Sources:** [Better Auth repository and license](https://github.com/better-auth/better-auth), [Prisma adapter](https://better-auth.com/docs/adapters/prisma), [security](https://better-auth.com/docs/reference/security), [organizations](https://better-auth.com/docs/plugins/organization).

## 2026-09-12 - Obsidian project vault
**Choice:** keep linked Markdown in web-app/docs and enforce key coding rules through web-app/AGENTS.md.
**Why:** readable in Obsidian, GitHub, and editors without a plugin dependency.
**Consequence:** notes are versioned alongside code; private workspace state is excluded.

## 2026-09-12 - Guest-first working increment
**Choice:** build a usable dashboard and bounded PRIMM exercises before auth and services.
**Why:** validates the core learning workflow without fake integrations or external credentials.
**Consequence:** progress is local to a browser; no cross-device sync or arbitrary code execution.
**Revisit when:** gateway identity and execution contracts are ready.

## 2026-09-12 - Brown editorial identity
**Choice:** use #754934, warm ivory, and readable type consistently across site and app.
**Why:** explicit user direction supersedes the earlier teal design document.

## 2026-09-12 - Native app scrolling
**Choice:** preserve native scroll and keyboard behavior in the learning workspace; retain Lenis on the landing page.
**Why:** readers and editors need predictable focus and scroll. Animation must support understanding.

## 2026-09-20 - Independent learning before answer generation
**Choice:** teach through predictions, state traces, targeted feedback, transfer questions and self-review. Add original product scenarios and design interviews. No live solution generator or automatic free-text grading.
**Why:** the primary learner starts without independent coding confidence and wants to build reasoning for interviews and engineering work.
**Consequence:** introductory learning is usable now; deeper projects and senior mock assessments remain future curriculum rather than an invented readiness score.

## 2026-09-20 - Browser Python practice
**Choice:** self-host Monaco and Pyodide; execute in a dedicated worker created by an opaque sandbox iframe. Use a classic worker bootstrap with dynamic ESM imports because module-worker startup in opaque frames is not uniformly supported.
**Boundary:** CSP restricts runtime downloads, private services are unavailable, parent deadlines stop stuck runs, public cases remain untrusted practice results. Browser memory is not hard-limited. A future server judge is separate.
**Dependency detail:** use Monaco's ESM editor with a patched DOMPurify alias rather than its prebundled sanitizer. Retain asset notices. Build verification checks the emitted sanitizer version.

## 2026-09-20 - Optional account gateway
**Choice:** implement Better Auth and revisioned progress in NestJS/Prisma/PostgreSQL. Keep guest browsing usable when no gateway is configured.
**Consequence:** manual saves and explicit guest import are real operations. PostgreSQL counters provide shared atomic admission for this increment. Private production ingress, SMTP, backups, hosting and Cloudflare migration remain deployment work.
