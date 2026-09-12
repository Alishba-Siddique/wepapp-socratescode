# Technical Requirements Document (TRD)

## 1. System Architecture (Microservices)
SocratesCode utilizes a highly decoupled, enterprise-grade distributed system to demonstrate scalability, clean architecture, and mastery of modern network protocols.

*   **Presentation Layer (Frontend):** Next.js 15 (App Router), React, Tailwind CSS.
*   **API Gateway / BFF Layer:** NestJS with GraphQL API.
*   **Compute Layer (Execution):** Go microservice (communicating via gRPC).
*   **Intelligence Layer (AI):** Python microservice (FastAPI/gRPC + LangChain).

## 2. Infrastructure & Communication Protocols
*   **Client-to-Gateway:** GraphQL over HTTP.
*   **Gateway-to-Microservices:** gRPC (Protocol Buffers) for low-latency, strictly typed internal communication.
*   **Database:** Neon (Serverless PostgreSQL).
*   **ORM:** Prisma (residing strictly within the NestJS Gateway).
*   **Code Sandbox:** Go-based ephemeral isolated execution environments (or WebAssembly/Pyodide fallback for zero-cost browser execution).

## 3. Tooling & DevOps
*   **Authentication:** Clerk (JWT session management middleware).
*   **Monorepo Management:** Turborepo or standard Git monorepo structure.
*   **CI/CD Pipeline:** GitHub Actions for automated linting, testing, and Docker image builds.
*   **Code Quality:** CodeRabbit AI integrated into GitHub for mandatory PR reviews enforcing clean architecture.
*   **Orchestration:** Kubernetes (K8s) manifests for declarative infrastructure management.