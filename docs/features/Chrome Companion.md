---
type: feature
status: implemented-awaiting-ci
updated: 2026-09-29
---
# Chrome companion
[[Home]] · [[Platform Guide]] · [[Security Audit]] · [[features/Personal Regression Tests]]

## Outcome
Practice independent reasoning beside a LeetCode problem. A Chrome MV3 side panel guides Understand → Predict → Reason → Investigate → Explain. Five topic choices supply bounded authored nudges. This is question-led self-review, not an AI solver or automatic assessment.

## Behavior and acceptance
- `/companion` explains installation and provides a reproducible developer-preview ZIP; no Web Store publication is claimed.
- Explicit toolbar capture reads only the granted active tab's title and URL. Manual URL entry is a fallback. No problem text, source code or submissions are accessed.
- Accept only canonical HTTPS LeetCode problem URLs. Reject other origins and credential-bearing URLs; remove queries/fragments.
- Each stage accepts up to 1,500 characters. Next requires a written thought but does not grade its correctness. Learners may revisit stages.
- Save a versioned record in `chrome.storage.local` per problem. Reconnect explicitly after changing tabs/problems. Confirm before discarding dirty notes.
- Export Markdown to Obsidian; delete one problem's notes with confirmation. Storage failure preserves open text and reports failure.
- Guidance and notes work without an API key. Notes are profile-local, not account-synced; last-save-wins across panels. No secrets should be entered.

## Architecture and checks
`extension/src/model.ts` owns validated state, prompts and exports; `panel.ts` owns interactions; `background.ts` configures toolbar behavior. Only activeTab, sidePanel and storage permissions are requested. No content script, host permission, server route or model is added. CI builds strict TypeScript, tests domain boundaries and checks the committed ZIP against its source. The existing Chromium job tests a real loaded extension and storage; tab capture is a deterministic API fixture. A real Chrome toolbar gesture still needs manual smoke verification.

Local build and three domain tests passed. CI and public deployment evidence will be recorded in [[Session Log]]. See [extension setup](../../extension/README.md).
