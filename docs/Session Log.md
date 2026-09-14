# Session Log
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
