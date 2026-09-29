# Build Plan
[[Home]] - [[Architecture]] - [[Product Rules]]

## Increment 1 - Guest learning workspace
Status: implemented and locally verified. The initial GitHub CI run passed.

- [x] Replace starter with the branded dashboard and navigation.
- [x] Offer a small curriculum of runnable guided exercises.
- [x] Implement all five PRIMM activities and meaningful completion checks.
- [x] Persist validated progress in the current browser.
- [x] Add a progress view with honest empty states.
- [x] Verify behavior, accessibility basics, responsive layout, lint, and build.

## Increment 2 - Accounts and durable progress
Better Auth sign-in, gateway session validation, GraphQL progress contract, PostgreSQL/Prisma migrations, guest-to-account migration. See [[Decisions]] for the replacement of Clerk. Do not invent team features before their requirements are defined.

## Increment 3 - Code editing and execution
Monaco editor, protobuf execution contract, isolated Go service, timeout/resource limits, trace format, and failure UX.

## Increment 4 - Socratic tutoring
Tutor contract, question-only output constraints, safe error handling, hint accounting, and evaluation cases. Keep hints useful without producing a complete solution.

## Increment 5 - Cohorts
Define invitations, roles, privacy, team progress views, and genuine scoring before building a leaderboard.

The independent root Tracker.md requires commits for completed checkboxes; this vault tracks working increment status separately.

## September 20 implementation update
The current branch implements nine PRIMM labs, twenty browser Python problems, seventeen Socratic product-pattern lessons, six design exercises, and optional Better Auth/PostgreSQL progress. See [[Platform Guide]], [[Testing]] and [[Security Audit]]. Earlier planned account and editor entries are superseded by this implementation; production configuration remains separate.

Next curriculum work: richer misconception-specific prompts, graded scaffolding removal, implementation projects, debugging/testing/networking fundamentals, database exercises with actual SQL execution, deeper distributed-systems cases and evaluated mock interviews. Do not label this backlog complete or equate it with senior readiness.

## September 27 beginner increment
Implemented `/start`: three progressively scaffolded lessons on assignment, loops and debugging; prediction and transfer questions; explicit guided traces; a fourth independent Python challenge. Dashboard/curriculum and sidebar provide an entry point. Each completed lesson can be reviewed; current progress resumes locally. This increment adds no service or database schema. Validation and deployment evidence belong in [[Session Log]]. Next: durable account deployment, more targeted misconceptions and practical engineering tasks.

## Debugging workshop
Implemented three original repair exercises within `/practice` and `/solve/[slug]`: accumulation, strict boundaries and early return. Deliberately broken starter programs, misconception feedback, an existing real Python editor, regression cases and an ungraded explanation review make the full learning loop usable. No new dependency or hosted service. Acceptance and verification: [[features/Debugging Workshop]].

Expanded with `/debugging`: error literacy, small reproductions, guided state comparisons and regression reasoning. A per-exercise notebook records evidence, hypothesis, experiment and outcome and exports to Obsidian. This is a beginner method, not a live interactive debugger or production incident console. Further curriculum can introduce actual breakpoints, stack-frame inspection and multi-service incidents only with runnable examples and verified tooling.

## September 29: reasoning beyond the lesson
Implemented [[features/Personal Regression Tests]] inside every Python workspace and [[features/Chrome Companion]] for LeetCode. Both use authored teaching and local persistence, with no model provider or new backend. The companion is an unpacked developer preview, not a store release. CI and deployment remain verification gates; see [[Session Log]]. Next: use learner feedback to improve misconception-specific prompts, then add practical implementation tasks and progressively remove scaffolding.
