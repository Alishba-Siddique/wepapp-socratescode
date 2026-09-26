# Debugging workshop
[[Home]] - [[Build Plan]] - [[Platform Guide]] - [[Testing]]

## Outcome
A beginner can reproduce a small product bug, identify its cause, change real Python, test the repair and explain why it works. This is authored Socratic guidance, not live AI or interview certification.

## Implemented scope
- `/practice` has a Debugging filter and three distinct exercises, also visible in the full searchable catalog.
- `/solve/debug-basket-total`: preserve accumulated prices, including a free final item and an empty basket.
- `/solve/debug-temperature-boundary`: distinguish strictly above zero from at least zero, with negative/zero/positive cases.
- `/solve/debug-inbox-return`: distinguish returning from advancing a loop, including an empty inbox and unread messages later in the input.
- The original broken code remains inspectable after editor changes. Existing browser drafts take precedence over starter code; reset restores the broken starter with confirmation.
- A wrong prediction offers specific guidance. A correct prediction reveals diagnosis; correct diagnosis directs the learner to the editor without generating a repair.
- Every public check must pass for the current editor text to show reflection. A custom run cannot qualify. Changed code invalidates that evidence.
- Reflection is explicitly self-reviewed, is not transmitted, and clears on leaving/reloading. It is not scored by keywords or minimum prose length.

## Reliability and security
Uses the existing opaque iframe/worker runner, deadlines, output limits and browser-local code drafts. No API, database schema, package, external source import or paid inference. No new persistent prose record. Native controls, fieldsets, legends, live feedback and responsive layout preserve keyboard and mobile use.

## Verification
Browser coverage added for all three original failing programs, repaired programs, incorrect prediction feedback, diagnosis, real execution, current-code invalidation, draft reload and mobile overflow. Production smoke includes the basket route. Local npm/npx build and lint commands are reserved for the user at their request; CI must pass before this increment is marked released.
