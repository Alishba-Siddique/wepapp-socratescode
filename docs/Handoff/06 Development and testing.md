---
type: engineering-handoff
updated: 2026-11-19
---
# Development and testing

## Repository map

| Path | Purpose |
| --- | --- |
| `frontend/` | Next.js learning workspace, browser runner, UI, route proxy, browser/domain tests. |
| `gateway/` | NestJS, Better Auth, Prisma schema/migrations, GraphQL progress service, account tests. |
| `contracts/` | Shared learning definitions and GraphQL contract. |
| `extension/` | Chrome companion source, tests, build, and permission documentation. |
| `docs/` | Obsidian knowledge vault; this handoff lives in `docs/Handoff/`. |
| `.github/workflows/` | CI, verified deployment, and rollback workflow. |

## Local development

Guest learning needs no key or database. Use the Node version pinned in `.node-version`.

```sh
cd frontend
npm ci
npm run dev -- --port 3001
```

Open `http://localhost:3001/start`. The optional account service needs a dedicated test database and the configuration in [[../Production Configuration|Production Configuration]]. Never point account tests at a real user database.

## Change checklist

1. Read `AGENTS.md`, `frontend/AGENTS.md`, the relevant docs, and current code before modifying behavior.
2. State route, data-owner, input bounds, authorization, rate/cost tier, and failure behavior for every new server capability.
3. Keep content/data logic separate from visual components. Use strict TypeScript; never use `any`, browser database access, arbitrary `eval`, or secrets in the client.
4. Add focused domain tests plus browser checks for keyboard access, incorrect paths, persistence, and mobile layouts when relevant.
5. Update route/security/feature documentation and record verified evidence. “Implemented,” “configured,” and “verified” are different states.

## Required validation

CI is the release authority. It runs dependency review/audits, CodeQL, lint/type checks, build, real PostgreSQL account tests, and Chromium/Firefox/WebKit journeys. The responsive matrix checks 17 routes at 320, 768, 1024, and 1440 pixels, with short-screen sidebar keyboard behavior.

Avoid test shortcuts that ignore runtime errors, cache responses, browser engines, or security findings. Tests must fail for those conditions and then be corrected at the cause.
