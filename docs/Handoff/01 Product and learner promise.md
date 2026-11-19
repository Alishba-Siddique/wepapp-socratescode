---
type: product-handoff
updated: 2026-11-19
---
# Product and learner promise

## The problem

socratescode serves a learner who can ask AI to produce code but cannot yet explain the logic, debug a failure, use the terminal confidently, or reason about real product constraints. The product should make that learner progressively independent and interview-ready. It must not promise that a set of completed exercises makes someone senior or employable.

## The learning method

The core loop is **Predict → Run → Investigate → Modify → Make** (PRIMM). Lessons ask the learner to form a hypothesis, inspect a result, change one variable, and explain the result. Feedback is authored and deterministic today. The platform must guide thinking rather than hand over complete solutions.

The learner journey is deliberately broad:

| Area | Why it exists |
| --- | --- |
| Beginner logic labs | Build a first mental model for variables, loops, control flow, and state. |
| Python problems and custom cases | Practise turning a statement into a small testable program. |
| Debugging workshop and notebooks | Teach reproduction, evidence, hypotheses, experiments, and regression tests. |
| DSA patterns | Recognize a pattern and connect it to a real product use case. |
| Product projects | Translate requirements, delivery traces, edge cases, and business rules into code. |
| Foundations | Teach Bash, Git, SSH, and secure business-logic thinking without running commands on the user’s machine. |
| System and database design | Build the vocabulary for data ownership, constraints, API contracts, and tradeoffs. |

## Product honesty

- Learner progress, code drafts, notebooks, and reflections are browser-local unless the optional account gateway is configured.
- Browser Python runs locally in an isolated iframe/worker. It is practice, not a trusted hidden-test judge.
- No live AI tutor, remote code execution, leaderboard, organization workspace, certification, or automated submission is connected.
- The Chrome companion is an unpacked developer preview. It captures an explicitly requested title and canonical URL; it does not scrape code or submit answers.

## Design principle

Use the warm ivory and `#754934` brand system. Keep copy legible, controls keyboard reachable, and motion away from the learning workspace. Native scrolling is intentional in the app; Lenis belongs only on the marketing site.
