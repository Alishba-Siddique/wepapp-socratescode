# Decisions
[[Home]] - [[Architecture]] - [[Design System]]

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
