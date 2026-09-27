# Debugging workshop
[[Home]] - [[Build Plan]] - [[Platform Guide]] - [[Testing]]

## Outcome
A beginner can reproduce a small product bug, identify its cause, change real Python, test the repair and explain why it works. This is authored Socratic guidance, not live AI or interview certification.

## Implemented scope
- `/debugging` teaches syntax/runtime/logic failures, minimal reproduction, breakpoints/stepping/watches through an explicitly authored state trace, and repair/regression/review/release habits.
- Four sequential checks have misconception-specific guidance. Progress resumes in the current browser; completed steps remain reviewable. Invalid progress cannot unlock later steps; blocked storage falls back to tab memory with a warning.
- `/practice` has a Debugging filter and three distinct exercises, also visible in the full searchable catalog.
- `/solve/debug-basket-total`: preserve accumulated prices, including a free final item and an empty basket.
- `/solve/debug-temperature-boundary`: distinguish strictly above zero from at least zero, with negative/zero/positive cases.
- `/solve/debug-inbox-return`: distinguish returning from advancing a loop, including an empty inbox and unread messages later in the input.
- The original broken code remains inspectable after editor changes. Existing browser drafts take precedence over starter code; reset restores the broken starter with confirmation.
- A wrong prediction offers specific guidance. A correct prediction reveals diagnosis; correct diagnosis directs the learner to the editor without generating a repair.
- Every public check must pass for the current editor text to show reflection. A custom run cannot qualify. Changed code invalidates that evidence.
- Reflection is explicitly self-reviewed, is not transmitted, and clears on leaving/reloading. It is not scored by keywords or minimum prose length.
- Each debugging exercise has a separate notebook for input, expected/observed behavior, hypothesis, experiment and outcome. Saving is explicit; drafts stay editable if storage fails. Markdown export works without browser storage and formats learner text as literal indented blocks for Obsidian.
- Notebook fields are limited to 1,000 characters each; saved records are versioned and validated. Notebook data is browser-local, shared by that browser's users, and not an account record. There is no multi-tab conflict resolution; the last explicit save wins. The separate post-check explanation remains tab-only.

## Reliability and security
Uses the existing opaque iframe/worker runner, deadlines, output limits and browser-local code drafts. No API, database schema, package, external source import or paid inference. The notebook is an explicit browser-local prose record with no remote transmission. Native controls, fieldsets, legends, live feedback and responsive layout preserve keyboard and mobile use.

## Verification
Browser coverage added for all three original failing programs, repaired programs, incorrect prediction feedback, diagnosis, real execution, current-code invalidation, draft reload and mobile overflow. Production smoke includes the basket route. Local npm/npx build and lint commands are reserved for the user at their request; CI must pass before this increment is marked released.

The original repair workshop passed PR CI run 36330949263 and production run 36331206590; all three public repair routes returned HTTP 200 after promotion. The teaching/notebook increment adds domain validation and browser coverage for sequential learning, wrong answers, trace navigation, reload/review, saved notes, Markdown content, blocked storage and mobile layout. New route smoke coverage includes `/debugging`. Its release evidence is recorded separately from the already-deployed workshop.
