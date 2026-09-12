# socratescode web-app

A programming-logic learning workspace built around Predict, Run, Investigate, Modify and Make.

The current frontend includes a guest dashboard, three guided labs, step-by-step traces, question-based hints and local browser progress. Authentication, remote code execution, live AI and organization accounts are not connected yet.

## Run locally
```sh
cd frontend
npm ci
npm run dev -- --port 3001
```

Open http://localhost:3001. Run `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` in frontend. With the app running on port 3001, run `npm run test:browser`. Install Playwright Chromium on Linux with `npx playwright install --with-deps chromium`; the local Windows check uses Edge.

## Project vault
Open `docs/` as a vault in Obsidian. Start with [Home](docs/Home.md), [System Design](docs/System%20Design.md), [Build Plan](docs/Build%20Plan.md) and [GitHub Setup](docs/GitHub%20Setup.md).

For `wepapp-socratescode`, use this folder's contents as the repository root. The CI workflow is in `.github/workflows/frontend.yml`; Vercel's frontend root is `frontend`. The web-app is maintained in its own Git repository; the parent landing-page checkout keeps its own configuration.
