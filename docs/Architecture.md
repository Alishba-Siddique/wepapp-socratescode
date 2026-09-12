# Architecture
[[Home]] - [[Engineering Rules]] - [[Decisions]]

## Boundaries
| Layer | Responsibility | State |
| --- | --- | --- |
| Next.js frontend | Routes, accessible UI, local guided exercises | First increment |
| NestJS GraphQL gateway | Auth validation, application use cases, Prisma access | Planned |
| Go execution service | Isolated code execution and traces over gRPC | Planned |
| Python tutor service | Constrained Socratic hints over gRPC | Scaffold exists; not connected |
| Neon PostgreSQL | Durable users, puzzles, attempts | Planned |

Browser - GraphQL gateway - gRPC services. Only the gateway accesses the database. Protobuf contracts precede service integration.

## Frontend layout
- app/: route entry points and shared shell.
- components/: dashboard, catalog, learning workspace, reusable UI.
- lib/puzzles.ts: typed exercise definitions and pure trace calculation.
- lib/progress.ts: validated local progress and React subscription.
- public/: self-hosted fonts and approved assets.
- tests/: behavior-focused checks.

The installed frontend is Next.js 16.3.4; older root documentation names Next.js 15. Follow the installed framework's local documentation for APIs and preserve the intended architecture.

## Current execution model
Guided exercises use bounded numerical inputs and pure functions. Never evaluate arbitrary user code in this increment. Introduce Monaco and a real sandbox only with a defined execution contract and resource limits.

## Authentication
Guest-first browsing requires no keys. Add Clerk with the gateway identity contract as a separate increment. Never simulate successful sign-in.
