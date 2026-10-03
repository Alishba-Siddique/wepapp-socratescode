---
type: feature
status: released
updated: 2026-09-29
---
# Personal regression tests
[[Home]] · [[features/Debugging Workshop]] · [[Platform Guide]] · [[Security Audit]]

## Outcome
Learn an engineer's testing habit: choose an input, predict its result independently, run the code, investigate a mismatch and keep the case that exposed it. This continues the debugging workshop in every Python workspace.

## Acceptance
- Add, edit and remove up to six named cases per problem using bounded JSON input and expected output.
- Reject malformed, overly deep, oversized and non-finite values; accept legitimate `null`, `false`, zero and empty lists.
- Persist versioned local cases; recover safely from corrupt data. Failed saves retain usable in-tab cases with a visible warning.
- Run saved cases through the existing isolated Python worker. Snapshot expectations for the run; show comparison results without awarding platform completion.
- Clear personal results when the suite changes. Disable mutation during execution and running during an unfinished edit. Unsubmitted new cases are not run.
- Explain that expectations can be wrong and inputs must follow the exercise's domain. These tests are not a trusted judge, account-synced assessment or substitute for platform checks.

## Implementation
`frontend/lib/personal-tests.ts` validates storage and JSON. `components/personal-tests.tsx` manages the teaching/form/persistence experience. `coding-workspace.tsx` owns execution and comparison. No new dependency, database table or server endpoint is introduced. Six cases each have a name up to 60 characters and input/expected JSON up to 1,500 characters, 12 nested levels and 500 nodes. Storage records are capped at 50,000 serialized characters.

Domain checks pass locally. Browser journeys cover invalid JSON, failing and repaired code, editing, reload, removal, blocked storage and separation from beginner completion. CI verifies those journeys in Chromium, Firefox and WebKit; evidence belongs in [[Session Log]].

PR #29 passed CI run 36504898801 (including Chromium, Firefox, WebKit, accounts and the installed extension) and merged as `2a8f8f7422d405d265c373ecfbcac96ce41f35c2`. See [[Session Log]] for production verification.

Production run 36505307048 passed candidate and promotion checks; the public coding workspace was verified on September 29, 2026.
