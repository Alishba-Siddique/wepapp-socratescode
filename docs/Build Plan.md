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
