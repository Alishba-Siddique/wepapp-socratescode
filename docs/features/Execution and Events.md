---
type: feature
status: planned
---
# Isolated execution and asynchronous events
[[Feature Catalog]] ? [[Engineering Standards]]
Learners submit actual code, see bounded trace output, and receive a useful timeout/failure state.
- [ ] Define protobuf run request/result and versioned RabbitMQ event envelopes.
- [ ] Gateway transaction creates a run and outbox event atomically.
- [ ] Publisher confirms + persistent messages + durable queues; deduplicate event IDs.
- [ ] RabbitMQ buffers work; cap queue length, prefetch, per-user outstanding jobs and retries.
- [ ] Disposable sandbox: no network/secrets, read-only base, CPU/memory/process/output/time limits.
- [ ] Acknowledge after committing the outcome through gateway; dead-letter poison events, bounded replay.
- [ ] Test crash between publish and confirmation, duplicate delivery, timeout, cancellation and worker loss.
- [ ] Separate durable progress from broker delivery state; PostgreSQL remains authoritative.

gRPC handles private request/response contracts. RabbitMQ handles background job/event delivery; the browser connects to neither broker nor workers. Broker hosting, migrations and the runner are not deployed yet.

Reference: [RabbitMQ reliability](https://www.rabbitmq.com/docs/reliability).
