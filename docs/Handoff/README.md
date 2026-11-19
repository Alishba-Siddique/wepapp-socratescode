---
type: handoff
status: current-working-context
updated: 2026-11-19
---
# socratescode handoff

This folder is the shortest accurate way for a new engineer, product partner, or future agent to take over the web-app. It is written from repository evidence and separates what exists from the intended enterprise platform.

## Read in this order

1. [[01 Product and learner promise]] — the user, learning method, and product boundaries.
2. [[02 Current implementation]] — routes and features that actually exist.
3. [[03 Architecture and data]] — request paths, ownership, and what remains planned.
4. [[04 Security and SSRF]] — security posture, including the safe design for future URL features.
5. [[05 Build roadmap]] — the next work in the right sequence.
6. [[06 Development and testing]] — how to run, validate, and change the project safely.
7. [[07 Delivery and operations]] — CI, deployment, rollback, costs, and secrets.
8. [[08 Decisions, risks, and questions]] — non-negotiable decisions and unresolved choices.

## Handoff rule

Do not turn a planned component into an implementation claim. In particular, remote code judging, live AI, RabbitMQ, Valkey, organizations, Cloudflare hosting, SSO, and a production account service are **not** live today. The guest learning application is the working product.

## Source of truth

This folder is a guide, not a replacement for code. When it conflicts with the implementation, inspect the code and update the handoff in the same change. The broader Obsidian vault remains in `docs/`; its entry point is [[../Home|Home]].
