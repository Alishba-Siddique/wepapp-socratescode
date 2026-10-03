# Session Log

## 2026-09-20 - Independent coding and engineering practice
Implemented nine PRIMM labs, twenty native Python problems (eight licensed Exercism imports / 88 public canonical cases), 54 external references, seventeen Socratic pattern lessons with researched product applications, and six system/database/architecture exercises with browser drafts and Markdown export. Added beginner vocabulary and explicit progression without claiming senior readiness.

Implemented the optional NestJS / Better Auth / Prisma / PostgreSQL gateway, same-origin frontend proxy, email-account UI, versioned account progress, explicit idempotent guest import, ownership validation, optimistic concurrency and atomic admission. Production gateway hosting, SMTP, backup/restore evidence and Cloudflare migration remain unconfigured.

Verified locally: frontend lint, TypeScript and production build (65 generated pages); nine domain checks; seven real PostgreSQL/gateway integration checks; four release-policy checks; actionlint; zero production vulnerabilities in frontend and gateway audits. Learning journeys and account journeys passed in Chromium/Edge, Firefox and WebKit. Browser coverage includes actual Python execution, wrong answers, infinite-loop cutoff and subsequent recovery, opaque origin, blocked private-API requests, design persistence/export, guest/account isolation, new-context sign-in and mobile layout.

Fixed during verification: opaque-frame module-worker startup, Firefox runtime import CSP, explicit worker termination before frame removal, account request cancellation on navigation, and assertions that previously read pre-hydration fields. Monaco uses its ESM build with patched DOMPurify 3.4.15; emitted chunks were checked for the patched version. CI carries generated runtime assets with the tested frontend artifact and runs a PostgreSQL account job.

Updated [[Platform Guide]], [[Learning Design]], [[Architecture]], [[Local Development]], [[API and Data]], [[Security Audit]], [[Content and Licensing]], [[DSA in Products]] and [[Testing]]. User-provided PDF and personal Obsidian settings are preserved separately from the implementation commit. Remote PR/CI evidence is recorded in GitHub; local passes are not a production deployment claim.


## 2026-09-14 - Authentication selection
The user selected Better Auth after discussing Cloudflare hosting. Updated the decision, architecture, build plan, feature catalog, account acceptance criteria and planned security route inventory to replace Clerk. Reviewed official license, Prisma, organization and security documentation. This is a documentation change only: auth, database sync and Cloudflare deployment are not live. Original reference requirements and historical release evidence remain preserved.
[[Home]] - [[Build Plan]]

## 2026-09-12
- Read root requirements and frontend framework instructions.
- Confirmed the web-app frontend was the Next.js starter.
- Created this Obsidian-compatible vault and web-app coding rules.
- Began the guest dashboard and guided PRIMM workspace.
- Completed the guest dashboard, three guided labs, all five PRIMM stages, local progress, and the searchable curriculum.
- Fixed a UTF-8 BOM that broke the CSS compiler and replaced corrupted UI symbols.
- Verified four domain tests, browser completion with wrong-answer handling, persistence after refresh, search, unknown routes, corrupted storage, and mobile widths 320/390/768.
- Lint and the production build (including TypeScript) pass.
- Added System Design, GitHub Setup, the standalone repository README and the frontend-checks workflow. The initial GitHub CI run passed on Ubuntu, including browser checks.
- Backend authentication, database persistence, runtime execution and tutoring remain planned.

- Published the working app to Alishba-Siddique/wepapp-socratescode on main.
- Verified the production server locally and the first remote CI run.
- Added mobile navigation focus, Escape handling and hidden-state keyboard checks.

## 2026-09-12 - Delivery and engineering mandate
Added pinned CI, dependency review, CodeQL, three-browser artifact verification, staged Vercel releases and rollback. Added the user engineering mandate, route/cost audit, linked feature acceptance notes and runbooks to the Obsidian vault. Fixed Vercel frontend root and provisioned project-scoped encrypted deployment credentials. Release-policy tests passed (2); deployment tooling audit reports zero vulnerabilities. New workflows await their first remote run; this note does not claim deployment completion.

Main commit 96f0bcd passed domain/lint/types/build, workflow validation, CodeQL and all three browser journeys on GitHub (run 34703681097). Dependency review passed on PR #1 after enabling the repository dependency graph. Main protection now requires PRs, resolved conversations, linear history and frontend-checks, and blocks force pushes/deletion. Release scheduling needed an explicit successful-gate condition because the PR-only dependency job is skipped on main.

## 2026-09-14 - Interview reference and marketing interaction
Implemented /patterns with 17 original Socratic notes, combined family/search filters, keyboard-expandable guidance, and 34 external practice links. Preserved the supplied cheat sheet in reference and documented editorial corrections. The guest PRIMM flow remains separate from this reference library. Browser regression checks now resize the mounted workspace instead of repeatedly navigating during responsive checks, matching the WebKit failure trace.

Marketing motion is always on with no settings button, as explicitly requested today. Its fine-pointer halo shares the Lenis RAF loop and keeps native pointer/input behavior. Both sites use the cocoa scrollbar. Validation and delivery evidence are recorded after checks complete.

The guest product was restored at https://wepapp-socratescode.vercel.app/ using a verified main build; production routes and the full learning journey passed. PR #7 passed all checks after one WebKit rerun and merged as 4c1475c. Its main CI browser checks passed, but the candidate job received an empty deployment credential. Scoped credentials were re-verified and re-encrypted; PR #8 repairs the reusable workflow secret context. Do not report automated delivery as verified until the candidate and promotion jobs pass.

Release follow-up: the reusable secret context fix exposed the credential correctly. CLI pull then failed its owning-team lookup. Implemented direct project-scoped API candidate creation, promotion and rollback with four passing release-policy/adapter tests and actionlint. No broader token was created. Remote delivery verification is pending.

## 2026-09-14 - Production verified
PR #9 merged as 6a336c4 with owner approval. CI run 34783631960 passed quality, build, security, Chromium, Firefox, WebKit, deployed candidate checks and production promotion. Deployment dpl_C7wg5iBSyvepDg8HF88LQQMRnVu9 is READY and is the project production target. The public six-route smoke check and complete PRIMM/pattern-library browser journey passed after promotion. See [[releases/2026-09-14]] and [[Development Workflow]].


## 2026-09-20 - PR 15 CI and security repair
Investigated GitHub run 35488756136: quality, build, dependency review, workflow validation and all three browser jobs passed. Accounts failed at npm ci because React/react-dom/scheduler peers were missing from the gateway lockfile; frontend-checks correctly propagated that failure. The local global legacy-peer-deps setting caused the mismatch. Added an explicit gateway setting, regenerated the lockfile with normal peer resolution and verified an isolated clean install.

Added a standard process-local auth burst limiter before the existing shared PostgreSQL quota; retained shared admission and failure-closed behavior. Removed raw caught-error logging in the account browser runner. Added three admission regression tests; all ten gateway integration tests pass, and the gateway TypeScript build passes. Expanded candidate verification to new learning features. Remote security scan, browser rerun and release status must be verified before declaring this deployed.

Local follow-up: account journeys passed in Chromium/Edge, Firefox and WebKit with the new limiter. Eleven route smoke checks, four release-policy tests and actionlint passed. The final gateway production audit reports zero vulnerabilities.

## 2026-09-27 - Beginner journey and repository presentation
Implemented a static `/start` route with original vocabulary, prediction/trace/transfer lessons, a real-editor handoff and a next-step recommendation. State is bounded and versioned, remains browser-local, and falls back to tab memory with a warning when browser storage is blocked. No database migration, live inference, dependency or server mutation was added.

Local verification: ten domain tests, lint and the production build with TypeScript passed (66 generated pages). Complete learning journeys passed in Chromium/Edge, Firefox and WebKit, including incorrect answers, reload resume, corrupt state, blocked storage, real Python execution and mobile layouts. Actionlint passed. Added `/start` to release smoke checks. Updated the route audit, roadmap and platform guide.

Reworked both GitHub READMEs with live links, feature boundaries, setup and visuals. The landing README uses existing original artwork and retains detailed notes in docs/implementation.md. The app README uses an actual local screenshot. Added [[Production Configuration]] with secret names only; production account hosting remains pending. The initial proposal to pause routine Dependabot version PRs was superseded by the owner's narrower choice below; security-fix settings were unchanged after approval review rejected disabling them.

The owner selected **Stop only Dependabot-triggered runs**. Added actor guards to CI roots and the aggregate so bot events do not allocate runners; restored the existing version-update limits so Dependabot PR creation remains enabled. No active bot runs needed cancellation. Documented manual validation of update branches, existing-branch limitations, and the distinction between skipped checks and successful tests. Human CI, scheduled scans and production gates remain enabled. PR #26's first revision passed all remote checks; the workflow follow-up still needs validation and merge before taking effect.

PR #26's final revision passed CI run 36267378056 and merged as 954dc2e78d5b628d80c4dc09546e08b5379f9f1b. The bot guard is now on main; production delivery is separately verified by the release workflow.

## 2026-09-27 - Practical debugging
Implemented [[features/Debugging Workshop]] with three product-motivated tasks and real editor repairs. Updated the practice catalog, first-steps handoff, README, browser journeys, smoke inventory and route audit. No new dependencies. The user will run local npm/npx commands; direct Node domain checks (10) and browser-script syntax checks passed. Build, lint and browser verification remain CI gates; do not label the feature released until they pass.

Workshop release verified: PR #27 passed all checks in 36330949263, merged as 573d25a39a929bff0f25ccef40a18cd69102deb5, and production run 36331206590 passed. All three public debugging exercise routes returned HTTP 200 with the expected content.

## Debugging instruction and investigation notes
The user asked to teach debugging explicitly and explain how an experienced engineer approaches it. Implemented a four-stage teaching route, authored state comparison, sequential local progress and an explicit-save evidence notebook with Markdown export. Connected the route from navigation, curriculum, practice and repair exercises. The notebook is independent of the temporary post-check reflection and has no account sync or model calls. Eleven direct Node domain checks and browser-script syntax checks passed locally; local npm/npx commands remain reserved for the user. CI must verify the new teaching and notebook journeys before release.

Debugging instruction release verified: PR #28 passed CI 36332318725, merged as b2f4205da4567b4e33327cc002a040614cb33097, and production run 36332676009 succeeded. Public `/debugging` and `/solve/debug-basket-total` returned HTTP 200 with the expected teaching/notebook content.

## 2026-09-29: personal tests and Chrome companion
Implemented [[features/Personal Regression Tests]] and [[features/Chrome Companion]], linked from the app and README. Added a static installation page and reproducible preview ZIP. Guidance remains authored, tests execute locally, and neither feature requires API keys or a backend. Updated route/privacy boundaries and the linked Obsidian feature notes.

Local verification: 12 frontend domain checks, three extension domain checks, strict extension TypeScript build, reproducible ZIP check, browser-script syntax and actionlint passed. Frontend lint/types/build and browser execution are deferred to CI under the owner's local npm/npx preference. Native extension toolbar permission granting is explicitly a remaining manual smoke check; the automated capture fixture is not proof of it. Remote CI and deployment have not yet been verified for this increment.

PR #29 passed all required checks in run 36504898801, with no open PR CodeQL findings, and merged as `2a8f8f7422d405d265c373ecfbcac96ce41f35c2`. Inspected real extension and mobile installation screenshots from the successful Chromium artifact. Production run 36505307048 passed its candidate and promotion jobs. Public `/companion`, `/solve/debug-basket-total` and `/debugging` returned HTTP 200 with the expected new content. The public extension ZIP matched the tested local package byte-for-byte. These post-merge evidence notes are saved locally for the next documentation commit, avoiding a separate docs-only production run.

## 2026-10-01: from patterns to a product
Implemented [[features/Product Projects]] with an original notification-inbox contract, six visible tests, a prerequisite identity question and delivery trace, embedded Python workspace, current-code review gating, local notes and Markdown export. Added sidebar/practice entry points, a standalone problem and smoke coverage. Updated the README, route audit and linked vault notes; included the previous extension release evidence in this documentation batch. Thirteen direct Node domain tests and browser-script syntax passed locally. Required frontend and browser checks remain CI gates before release.

PR #30 implements the project. Initial CI found a JSX quotation escaping error, corrected in e8b34cd; lint, TypeScript and CodeQL then passed. Run 36889319757 was blocked by the production dependency audit: Next.js 16.3.4 is covered by GHSA-vcvr-r3jv-pc5j (critical), and DOMPurify 3.4.15 by GHSA-p98j-92pf-mc4p (low). Prepared Next.js/eslint-config-next 16.3.8 and DOMPurify 3.4.16, verified their registry availability. Lockfile regeneration is pending the owner's choice because local npm/npx commands were reserved for the owner. No audit suppression or merge bypass was used.

## 2026-10-02: resume the product release
Found the regenerated frontend lockfile in the workspace. Reviewed the exact Next.js/eslint-config-next 16.3.8 and DOMPurify 3.4.16 pins and platform package changes. Thirteen domain tests and browser-script syntax pass. Pushing the package pair for clean-install, audit, build and browser validation; the feature is not yet released.

Run 36918062277 verified frontend lint/types and the patched production audit, then exposed advisories in the unused Vercel CLI tree. Verified all release modes use Node built-ins and the API adapter. Removed both ops manifests and their obsolete CI/Dependabot/CODEOWNERS references; retained all checks for active components. Updated the delivery runbook. This avoids maintaining an unused dependency tree solely to pass its own audit.

## 2026-10-03 ? foundations and business security
PR #30 merged as `00849ca`; main run `37082423151` passed all checks and release candidate/promotion. Built five Engineering Foundations lessons, a bounded simulated terminal and 27 command references; added frontend security headers. Direct Node domain tests: 19/19 passed. New browser flow and deployment are pending CI; no local npm/npx commands were run. Existing user-staged PDF and Obsidian settings are excluded.

PR #35 merged as `fa2e5f7` after run `37083884705` passed all required checks. No open PR CodeQL findings. Public `/projects` returned 200 with project content after prior promotion. Security dependency overrides are prepared locally awaiting user-run lockfile regeneration. Production verification for `/foundations` is pending.

Production run `37084250757` succeeded, including candidate and promotion. Public `/foundations` and `/runner` verified HTTP 200; new page headers and independent runner sandbox CSP confirmed. `/api/account/status` still reports `available: false`, accurately reflecting the optional gateway deployment boundary. Release evidence notes remain local for the next documentation/dependency batch, avoiding a documentation-only deployment.

## 2026-10-03 ? runnable business security
Added `/solve/secure-checkout`: the 25th Python problem, 18 authored contract cases, ordered identity/ownership/quantity/stock guards, misconception prompts, and links from security foundations. Existing editor, notebook and personal cases are reused. Local domain tests and browser-script syntax pass; browser CI and promotion pending. User-staged reference/settings and incomplete dependency manifests are excluded from the feature commit.
