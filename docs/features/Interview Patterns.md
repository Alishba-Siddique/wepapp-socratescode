---
type: feature
status: verified-locally
updated: 2026-09-14
---
# Interview patterns
[[Home]] | [[Feature Catalog]] | [[Security Audit]]

## Product behavior
The pattern library at /patterns extends the three guided PRIMM labs. It offers 17 pattern notes with recognition cues, original Socratic questions, assumption checks and external practice links. Search combines with four family filters. Empty results have a clear reset action. Expandable guidance works with a keyboard. No reading-completion score is invented.

The curriculum order is a suggested exploration sequence, not an empirically measured frequency ranking. Learners should justify a pattern using constraints and invariants before selecting it.

## Sources and adaptation
- [[reference/Interview Patterns Cheat Sheet]] preserves the user-supplied reference unchanged.
- [Pareto Problem Set](https://github.com/monarchmaisuriya/pareto-problem-set) is linked as a complementary reference. Its README credits Aman Manazir. No repository implementation, tests or problem statements are copied into the app.
- Practice titles and destinations come from the supplied sheet; problems and execution remain on LeetCode. External availability and account requirements belong to that service.
- Learner-facing questions and explanations are newly authored for socratescode. Full solution code and unsourced frequency ratings are not imported.

## Editorial corrections
The source is a planning reference, not executable curriculum. Fixed-window maximum sums need an all-negative-input case; zero initialization can return an impossible answer. Interval merging needs an empty-input guard. Index-placement algorithms need range and duplicate checks. Coin Change and Combination Sum IV are not 0/1 knapsack exercises; the first two relevant subset-sum links are used instead. Rotated binary search must state its duplicate assumption. Catalan output counts must be multiplied by output length when analyzing materialized strings.

## Acceptance
- All 17 notes are discoverable from workspace navigation.
- Search and family filters combine; clearing filters restores all notes.
- Guidance can be expanded with a keyboard; practice links identify new-tab behavior.
- Layout fits phone and desktop widths without horizontal overflow.
- Existing guest progress and PRIMM checks keep passing.
- No new network handler, paid call, untrusted execution or persistence is introduced.

## Next increment
Select one pattern for a full PRIMM lab, with bounded trace data, authored wrong-answer feedback, edge-case tests and a transfer task. Keep library notes distinct from implemented labs until those acceptance criteria pass.

## Verification
2026-09-14: ESLint, TypeScript, four domain tests and the production build passed. The production-server browser journey passed all PRIMM stages, wrong answers, persistence, pattern filtering and keyboard guidance, responsive widths, corrupted storage and unknown routes. Six route smoke checks passed. Remote CI and deployment remain separate gates.
