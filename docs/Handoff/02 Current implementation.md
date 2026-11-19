---
type: implementation-handoff
updated: 2026-11-19
---
# Current implementation

## What is working

The web-app is a Next.js 16 / React 19 learning workspace with a responsive navigation drawer and an independently scrollable sidebar. The desktop logo/profile remain fixed while navigation can scroll on short screens. On mobile, the drawer locks background scrolling, keeps focus inside, supports Escape/backdrop closing, and restores focus to the menu control.

| Surface | Current capability |
| --- | --- |
| `/start`, `/curriculum`, `/progress`, `/learn/*` | Guided PRIMM logic learning with validated browser-local progress. |
| `/practice`, `/solve/*` | Monaco/simple editing surface, authored public Python cases, custom local cases, and browser-side execution. |
| `/debugging` | Debugging method, notebooks, Markdown export, and repair exercises. |
| `/patterns` | Searchable DSA pattern library with Socratic questions and external practice references. |
| `/projects` | Notification-inbox product exercise with requirement and delivery-trace reasoning. |
| `/foundations` | Five safe simulated terminal/Git/SSH/business-security lessons and command reference. |
| `/design/*` | Design and data-model exercises. |
| `/companion` | Chrome extension installation and permission guide. |
| `/account/*` | Optional account UI; truthfully reports unavailable when no gateway is configured. |

## Account and persistence boundary

An optional NestJS gateway, Better Auth, Prisma, and PostgreSQL implementation exists. It supports credentials, sessions, bounded GraphQL progress saves, revision conflicts, idempotent guest import, and shared PostgreSQL admission limits. It is not a public production service until separate hosting, database, SMTP, backups, and ingress validation are configured.

## Current release context

The local branch includes the responsive sidebar delivery, route-audit stabilization, and dependency patches. The verified change set requires clean installs, audits, CodeQL, account tests, and browser tests in Chromium, Firefox, and WebKit before production promotion. Check the exact GitHub workflow run for the commit you intend to release; a passing historical or scheduled run is not release evidence.

## Intentional exclusions

Do not add a fake dashboard metric, fake AI, fake organization/leaderboard controls, or buttons without behavior. Do not store user code, reflections, or secrets as ordinary analytics/log output. Do not make browser-local completion evidence an authorization or certification signal.
