---
type: audit
status: current
updated: 2026-09-20
---
# Route and attack-surface audit
[[Home]] ? [[Architecture]] ? [[Engineering Standards]] ? [[Testing]]

This inventories implemented application controls. It is not a security certification or evidence of configured production infrastructure.

| Entry point | Identity / cost | Implemented control | Remaining boundary |
| --- | --- | --- | --- |
| GET /, /start, /curriculum, /progress, /patterns, /patterns/[id], /practice, /design, /design/[id] | Public / tier 4 | Local catalogs; known dynamic IDs; text rendering; drafts validated before loading | Local progress is untrusted |
| GET /learn/[slug], /solve/[slug] | Public / tier 4 | Known IDs; unknown routes 404; visible inputs/checks | Completion is not certification |
| GET /runner | Public / tier 4 server cost | Opaque iframe, CSP, nonce, no-store, no forms/frames; worker origin isolation | Browser execution has no hard memory quota |
| Python worker execution | Local learner device | Separate worker, parent deadlines (60s load / 5s run), output display cap, source frame + run ID check, runtime-only network CSP | A malicious learner can alter their own results; no server judge |
| GET runtime assets | Public / tier 4 | CORS only for public Python assets; pinned dependencies and retained notices | Download bandwidth; keep versions patched |
| GET /api/account/status | Public / tier 4 | Fixed upstream proxy; unconfigured service reported explicitly | Does not imply DB health; use private gateway /health |
| /api/auth/* allowlist | Public/session / tier 3 | Better Auth; origin checks; same-origin proxy; secure production cookies; production verification; process-local burst limit before shared atomic admission | SMTP/HTTPS/private ingress must be configured |
| POST /api/graphql ? gateway /graphql | Session / tier 3 | Ownership from session; 64 KiB body; bounded AST; one root; no batching/introspection; shared per-user admission; validated state; revisions | Admission currently shares a conservative proxy-IP bucket |
| Gateway GET /health | Private operational / tier 4 | DB readiness probe; sanitized 503 | Keep gateway private; edge protection not configured here |
| Password reset and verification | Token / tier 3 | Better Auth tokens, configured mail transport, reset session revocation | Production mail delivery and abuse monitoring need deployment verification |

## Storage and privacy
Account progress is separate from guest browser progress. Import is explicit and idempotent; existing account records win. Coding/design drafts are device-local and visible to others using the same browser. Account work is tab memory until explicitly saved. No learner code or prose is sent to a model or remote judge.

The proxy bounds streamed request bodies and uses a fixed service URL with a 15-second timeout. Gateway auth preserves Better Auth's stream; direct gateway ingress must enforce a 64 KiB body limit too (including chunked requests) and remain private. The gateway does not trust forwarded client-IP headers. Its HMAC-keyed PostgreSQL admission counter is atomic and fails closed on store failure. Valkey-based distribution and trusted per-client ingress limits are future deployment work.

## Release gates still open
Production account launch requires verified HTTPS/origin/cookies, private gateway ingress/body limits, SMTP delivery/verification/reset checks, PostgreSQL backups and restore evidence, connection limits, monitoring and retention/deletion procedures. The browser runner is local practice only. A trusted remote judge needs a separately isolated resource-bounded execution service and admission contract. Live AI, organizations, RabbitMQ and webhooks are not exposed.

## 2026-09-20 PR security review
Auth now runs standard `express-rate-limit` middleware (60 requests per minute, socket IP with IPv6 grouping) before the existing HMAC-keyed PostgreSQL quota. The local store reduces database work during bursts; PostgreSQL remains authoritative across instances and process restarts. Neither layer trusts forwarded client IPs. A private proxy still shares its conservative ingress allowance; trusted client identity and edge throttling remain deployment work. Both layers return 429/retry headers. Store failures return a sanitized 503.

The account browser runner emits a fixed failure message instead of logging caught exception text, which may contain environment-derived configuration. No scanner suppression or alert dismissal was added. Tests cover blocked auth requests without further DB work, spoofed forwarded IPs, shared admission in a fresh gateway, and an unavailable database.

## Beginner journey boundary
`GET /start` is a public static route (tier 4). Its original authored content performs no server mutations or model requests. Browser state accepts only version 1, an integer lesson count within the catalog and a boolean practice marker; raw input is capped at 512 characters. The progress marker remains untrusted local practice evidence. Storage errors preserve a usable tab-only lesson with a visible warning; no secrets, submitted code or prose are stored in this record. Python continues through the existing opaque worker boundary.

## Debugging exercises
The three `/solve/debug-*` routes use the existing public known-slug route and isolated Python worker. Broken starters and all cases are original local content. The reflection is capped at 2,000 characters, held in React state, rendered as text and not transmitted or persisted. A passed marker is tied to an all-cases run of the current code; it remains untrusted practice evidence and grants no server authority. No new service, external request or dependency is introduced.

`GET /debugging` is a public static teaching route (tier 4), with no server mutation or interpreter. Lesson progress accepts a versioned integer from 0 to 4, capped at 128 serialized characters. New notebook records are separate from the temporary reflection: six known string fields, each capped at 1,000 characters, version 1, at most 40,000 serialized characters. Records are browser-local and never confer authority. Text is rendered through controlled React inputs; Markdown downloads place learner text in indented code blocks. Export uses a short-lived local Blob URL. Browser users share these notes; save is explicit and last-save-wins across tabs. No secrets or private customer data should be entered.

## September 29: personal tests and Chrome companion
`GET /companion` and `GET /downloads/socratescode-chrome.zip` are public static tier-4 resources. The committed six-file ZIP is rebuilt and compared in CI. No server mutation, model call or new service is exposed.

Personal regression tests use the existing `/solve/[slug]` worker boundary. Records accept version 1, at most six named cases, bounded finite JSON values, depth/node limits and a 50,000-character serialized cap. They are untrusted browser-local practice data. Personal runs do not award platform completion; their expectations are snapshotted before execution. Storage failures are visible and retain in-tab state.

The MV3 extension requests activeTab, sidePanel and storage only. An explicit action captures a title and canonical HTTPS LeetCode problem URL; no page DOM/code/submission is read. Exact origins and slug shape are checked, URL credentials/ports are rejected, and queries/fragments are stripped. No host permissions, content scripts or remote code are declared; CSP uses connect-src 'none'. Notes have five bounded fields and a versioned validated shape, render as text, and export as indented Markdown. Notes remain in the Chrome profile, not a secure vault or account sync. Save is explicit, delete is per-problem, concurrent panels are last-save-wins, and save failure preserves open text. Automated extension tests exercise real storage; a real toolbar permission-grant gesture remains a manual check.

## October 1: product project
`GET /projects` and the known `/solve/project-notification-inbox` slug are public tier-4 learning routes. No new server handler, service, model or dependency is introduced. The existing opaque Python worker executes the six public cases. Review visibility follows the current code and all-platform-checks result; it grants no authority or certification. Version-1 local project records require a boolean requirement marker, bounded integer trace milestone and two strings of at most 1,500 characters each; serialized input is capped at 20,000 characters. Corrupt records reset safely. Blocked writes preserve in-tab notes with a warning. Exports indent learner prose as literal Markdown. Data is shared by browser-profile users, last-save-wins, and is not account-synced.

October 1 dependency triage: GitHub reports a medium multer alert (patched in 2.4.0; gateway currently pins 2.3.0) and a low development esbuild alert (patched in 0.28.1). No multer/file-upload interceptor or upload handler is present in gateway/src, and the account gateway is not publicly deployed. This limits the currently observed attack surface; it does not dismiss the alerts. Patch and regenerate the gateway lockfile before account launch, then rerun account validation. No alert or security automation was disabled.

October 1 release audit: [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) covers the installed Next.js 16.3.4; the affected path is attacker-controlled values in Node ImageResponse SVG generation. No `next/og` or `ImageResponse` use was found in frontend source. The release still requires a patched version, rather than waiving the audit. Prepared Next.js and eslint-config-next 16.3.8 plus DOMPurify 3.4.16 for [GHSA-p98j-92pf-mc4p](https://github.com/advisories/GHSA-p98j-92pf-mc4p). Lockfile generation and full validation remain pending; these pins alone are not a verified patch release.

October 2: the frontend lockfile now matches the patched package pins. CI will verify the clean install and audit before release; no gate is bypassed.

October 2 CI follow-up: run 36918062277 passed the frontend production audit but failed the unused ops CLI audit on brace-expansion (high) and reported fast-uri (moderate). Release and rollback source inspection confirmed there are no CLI imports or invocations: the adapter uses Node built-ins and direct Vercel API requests. Removed the obsolete CLI manifests and only their install/audit/configuration references, eliminating that dependency tree. Active frontend/gateway audits, CodeQL, dependency review, release contract tests and deployment gates remain enabled. This change does not dismiss gateway alerts or weaken their launch requirements.

## 2026-10-03 frontend hardening
Added nosniff, same-origin framing, referrer policy, restricted unused browser permissions, production HSTS and disabled X-Powered-By. Application pages receive base/object/frame/form CSP directives; no full script-source policy is claimed. The Python runner retains its independent restrictive CSP. Three-browser execution is a required regression gate.

The foundations simulator does not execute shell commands or contact hosts. Inputs/outputs render as text, commands and transcript are bounded, progress is untrusted local data. Shop authorization/pricing rules are teaching fixtures, not new production endpoints.

Outstanding before optional gateway launch: resolve the documented multer and development esbuild dependency alerts, provision isolated database/hosting/email, and validate production ingress/rate limits. The gateway currently has no upload consumer. Security remains an ongoing review, not a guarantee against every attack.

October 3 dependency recheck: four open alerts remain: frontend development-only brace-expansion 1.1.18 and 5.0.9 (patches 1.1.21 and 5.0.12), gateway multer 2.3.0 (patch 2.4.0), and gateway development esbuild 0.27.7 (patch 0.28.1). Targeted package overrides are prepared locally, not released; the user reserves npm commands and has been asked to regenerate both lockfiles. Do not claim these alerts are resolved until the new locks, clean install and CI are verified.

`GET /solve/secure-checkout` is another static practice page under the existing page CSP/header policy. Its decision function processes fictional input inside the existing isolated browser runner. It adds no real auth/payment/inventory endpoint or privileged capability. Guard logic taught in the exercise must not be represented as new production checkout security.

Dependency patch follow-up: the user regenerated both lockfiles. Reviewed changes pin brace-expansion to 1.1.21/5.0.12, multer to 2.4.0 and esbuild to 0.28.1; removed gateway transitive packages belong to the old multer dependency tree. These patches are now included with the responsive-workspace increment for clean-install, audit and account regression validation. Earlier pending-lockfile notes are historical; resolution awaits verified CI/deployment.

Verified dependency closure: responsive PR #37 passed CI `37106283601`, including clean installs, dependency review, CodeQL and account regressions. Merged as `438076e`; GitHub Dependabot API returned zero open alerts afterward. Earlier four-alert/awaiting-lockfile entries are resolved historical findings. This is dependency-alert closure, not a general security certification.

## 2026-10-07 newly blocking advisories
CI `37526685427` failed its production audit on sharp <0.35.5 (GHSA-wq5f-xc86-pv6w) and source-map-js <1.2.2 (GHSA-68fv-2mgg-jv7q), whose reviewed advisories changed October 6/5. Existing four-alert closure remains historical. Prepared exact frontend overrides for sharp 0.35.5 and source-map-js 1.2.2, within the existing parent dependency ranges. The user owns local npm commands; lockfile regeneration and clean CI are pending. Do not bypass the audit to deploy the responsive change.

Sources: https://github.com/advisories/GHSA-wq5f-xc86-pv6w and https://github.com/advisories/GHSA-68fv-2mgg-jv7q.

October 7 patch follow-up: the owner explicitly authorized the single frontend lockfile command; it completed successfully. Reviewed lock changes update sharp and its matching image binaries, bundled libvips, and source-map-js only. Clean-install production audit verification remains a CI gate.

The install also reports five high-severity package findings from the remaining development-only braces advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). The lock marks braces 3.0.3 and its micromatch parent as dev dependencies. The advisory lists no patched version: nested untrusted glob patterns can exhaust the parser stack. Track upstream remediation and avoid processing untrusted glob patterns in development tooling; do not force an unrelated major upgrade or represent this as a resolved finding. Production dependency patches do not certify the development toolchain as advisory-free.

Gateway audit follow-up: CI 37527671514 found proxy-addr 2.0.7 ([GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), critical) and fast-uri 3.1.7 ([GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj), moderate). Added compatible exact overrides 2.0.8 and 3.1.8; the separately authorized gateway lockfile update reported zero vulnerabilities. Reviewed the diff: only these two packages changed. Current ingress limits use socket.remoteAddress rather than forwarded headers, and the gateway remains optional/undeployed; this limits observed exposure without excusing the patch. Clean CI still required.
