---
type: product-policy
status: accepted
updated: 2026-09-20
---
# Learning design
[[Home]] ? [[Platform Guide]] ? [[Build Plan]]

## Outcome
Build independent reasoning and coding, then progressively prepare learners to discuss engineering decisions at increasing interview levels. Never equate an exercise count, hint count or self-reported completion with senior engineering ability.

## Teaching rules
- Assume zero prior knowledge; define a variable, function, loop, condition, database key or queue before relying on the term.
- Ask one concrete question at a time. Start with tiny inputs a person can trace on paper.
- Ask for a prediction, expose state changes, ask what changed and why, then vary one assumption.
- Give misconception-specific feedback. A wrong answer should suggest the next observation rather than shame the learner.
- Offer progressively more specific prompts without supplying the full solution. Reduce scaffolding in later exercises.
- Require transfer: a new input, counterexample, constraint or failure mode. Correct output alone is weak evidence of understanding.
- Treat free-text reflections as self-review until a tested assessment rubric exists. Do not imply authored checklists understand the submitted prose.
- Keep examples connected to product decisions, distinguish documented implementations from illustrative designs, and include a tradeoff.

## Progression and current coverage
| Phase | Evidence a learner should develop | Current support |
| --- | --- | --- |
| Starting from zero | Explain state and trace a few instructions | Nine PRIMM labs; basic editor vocabulary |
| Independent coding | Write a small function; debug a counterexample | Twenty Python practice problems and public cases |
| Algorithmic reasoning | Choose a pattern, explain its assumptions and cost | Seventeen pattern lessons; external references |
| Data and design foundations | Model identities, constraints, queries and races | Two database exercises |
| System and architecture discussion | Clarify requirements, draw boundaries, reason about failures | Four system/architecture exercises |
| Engineering projects | Implement, test, observe and maintain a product | Planned guided project curriculum |
| Senior interview preparation | Defend alternatives, migration plans, incidents, leadership and operational tradeoffs | Planned deeper cases and evaluated mock interviews; not certified by this increment |

The supplied 50-pattern PDF and longer notes are a curriculum backlog, not a claim that all 50 patterns are taught today. Review broad claims before authoring: BFS shortest-path guarantees require unweighted/equal-cost edges; sliding windows need the right monotonicity or removable aggregate; a pattern title alone does not establish a production implementation.
