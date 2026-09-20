# Web-app working rules

Read [docs/Home.md](docs/Home.md) first. The original Rules.md, PRD.md, and TRD.md are preserved in docs/reference/ as the architecture baseline. Current decisions and explicit user instructions take precedence over older version and palette details.

## Required behavior
- Use the brand name socratescode, warm ivory, and #754934. Keep copy readable and controls keyboard accessible.
- Teach with PRIMM: Predict, Run, Investigate, Modify, Make. Ask guiding questions rather than generating a learner's solution.
- Keep examples, execution, hints, progress, and assessment logic separate from visual components.
- Use strict TypeScript. No any, arbitrary eval, secrets in the browser, or direct frontend database access.
- Client requests go through the future NestJS GraphQL gateway. Gateway-to-service contracts are gRPC/protobuf. Define contracts before integrating services.
- Do not present local guided traces as arbitrary Python execution, scripted prompts as AI, or browser progress as account sync.
- Read frontend/AGENTS.md and the relevant installed Next.js docs before changing frontend behavior. Preserve framework-managed instruction blocks.
- Build complete, usable increments. No clickable placeholders, invented user statistics, fake leaderboards, or controls without behavior.
- Use native scrolling in the learning workspace so code, inputs, and keyboard focus behave predictably. Lenis remains in the marketing site.
- Test learning transitions, incorrect answers, local persistence, keyboard access, and mobile layouts. Run lint, type checks, and a production build for application changes.
- Record decisions and verified results in docs. Root Tracker.md checkboxes require both verification and a commit; do not mark them complete without both.
- Keep changes inside the authorized feature scope. Do not deploy, send messages, or enable external billing without existing user authorization.

## Current increment
Guest PRIMM labs, Socratic pattern/product lessons, Python browser practice, and design interviews. Better Auth + PostgreSQL progress is implemented behind an optional private gateway. Remote judging, live AI, organizations and Cloudflare migration remain later increments. See [docs/Build Plan.md](docs/Build%20Plan.md).

## Engineering mandate
Read docs/Engineering Standards.md and docs/Security Audit.md before implementation. The user-provided docs/reference/Engineering Mandate.md governs data reliability, cost controls, motion accessibility and error UX. Update the route inventory and feature acceptance criteria alongside code. Do not present planned services or safeguards as live.
