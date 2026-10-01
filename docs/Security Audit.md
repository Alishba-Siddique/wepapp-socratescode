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
