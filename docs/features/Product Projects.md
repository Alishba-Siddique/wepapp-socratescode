---
type: feature
status: implemented-awaiting-ci
updated: 2026-10-01
---
# Product projects
[[Home]] · [[Build Plan]] · [[features/Personal Regression Tests]] · [[features/Debugging Workshop]]

## First project: a notification inbox
`/projects` connects data-structure practice to a small product behavior. The learner identifies deliveries by ID, traces a retry, plans the state they need, writes actual Python, and reviews the design after its public checks pass. This is an original illustrative exercise, not a hosted notification service or an integration with a queue.

The contract retains the first event per ID in arrival order, marks read IDs, and counts unread items. Six checks distinguish repeats, equal text with different IDs, changed content for a repeated ID, unknown/repeated read markers, and an empty batch. The scenario is motivated by duplicate delivery described in [RabbitMQ's reliability guide](https://www.rabbitmq.com/docs/reliability); first-arrival-wins is this exercise's explicit policy.

## Acceptance
- Wrong identity answers provide feedback and do not unlock the trace.
- Visiting the last trace frame unlocks the editor; reviewing an earlier frame does not discard implementation work.
- The embedded editor uses the existing real Python worker, public checks, stop/deadline controls and personal regression tests.
- Review requires all public checks to pass for the current code. Edits, custom/personal runs and reloads require a new platform-check run. No persisted pass flag can unlock it.
- Review asks about state meaning, time/memory tradeoffs, durable state, concurrency and user isolation, without claiming those services are implemented.
- Plan and review notes are bounded, validated, browser-local and exportable. Failed storage retains in-tab work with a warning. They are self-review, not graded prose.
- Sidebar and practice bank link to the project; its standalone problem links back. No new dependency or API key is required.

## Boundaries and verification
See [[Security Audit]] and [[Testing]]. The record is versioned and capped; exports render learner text literally. Concurrent tabs use last-save-wins. Notes contain no credentials. Current implementation has domain checks and browser coverage for wrong answers, execution, stale results, reload, failure and mobile layout. CI and production evidence is maintained in [[Session Log]].
