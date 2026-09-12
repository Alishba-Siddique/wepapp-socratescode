---
type: feature
status: planned
---
# Socratic tutor
[[Feature Catalog]] ? [[Engineering Standards]] ? [[Security Audit]]
A learner receives a relevant question about their reasoning, with a clearly labeled authored fallback when inference is unavailable.
- [ ] Define versioned structured question contract; prohibit complete solutions and executable answer blocks.
- [ ] Authenticate and authorize context before retrieval or inference.
- [ ] Atomically reserve global, organization and user spend/concurrency budgets.
- [ ] Shared-store rate limits; Tier 1 fails closed on outage; true quota rejection returns 429 headers.
- [ ] Client status countdown obeys Retry-After; no immediate retry loop or optimistic fake response.
- [ ] One overall deadline and retry budget across primary/small-model/cache/authored fallback.
- [ ] Evaluate prompt injection, code leakage, irrelevant hints, malformed output and deterministic fallback.
- [ ] Record versioned, redacted inference events and p95/p99 latency/cost measurements.

No live AI provider or paid API is enabled. Retrieval/vector indexing is deferred until the product has an authorized knowledge corpus and measurable retrieval requirements.
