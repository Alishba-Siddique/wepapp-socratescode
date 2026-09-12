# socratescode web-app

A guest learning workspace built with Next.js 16.3.4, React, and the shared ivory/brown visual identity.

## Run
Install dependencies with npm install, then run npm run dev -- --port 3001. The separate landing page uses port 3000.

## Functional increment
- Dashboard with real local counts and a recommended next exercise.
- Searchable curriculum with three bounded Python-style guided labs.
- Five PRIMM activities: prediction, step-by-step trace, investigation, modification, and a new target with reflection.
- Validated browser progress, completion history, and keyboard-accessible navigation.
- Responsive layouts with self-hosted fonts.

These are deterministic guided traces, not arbitrary Python execution. Scripted guiding questions do not call an AI service. Authentication, account sync, Monaco, and service integration are deferred.

## Checks
- npm test: pure trace, input validation, and storage parsing checks (Node 22.18+ / 24 supports stripping TypeScript).
- npm run lint
- npm run typecheck
- npm run build

## Project knowledge
Open ../docs as an Obsidian vault, beginning with Home.md. Coding rules live in ../AGENTS.md and the framework-managed AGENTS.md in this directory.

Progress is stored under socratescode:lessons:v1. When browser storage is unavailable, the current session remains usable but changes do not survive a refresh.

Browser check: `npm run test:browser` with the app running on port 3001. The standalone app has its own Playwright dependency.
