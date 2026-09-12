# AI Coding Rules & Architectural Constraints

## 1. Architectural Boundaries (Clean Architecture)
*   **Domain Isolation:** Business logic inside the NestJS gateway MUST NOT depend on framework-specific code. Use Cases and Entities must be isolated in pure TypeScript files.
*   **Database Access:** Next.js, Go, and Python are STRICTLY FORBIDDEN from connecting directly to the PostgreSQL database. All database transactions must route through the NestJS API Gateway using Prisma.
*   **Strict Typing:** `any` types are banned. All code must pass strict TypeScript compilation (`"strict": true` in `tsconfig.json`).

## 2. Microservice Communication
*   **Contract First:** Inter-service communication must strictly adhere to the `.proto` files. If a data payload requires modification, the `.proto` file must be updated and recompiled first before touching business logic.
*   **Protocol Rules:** Next.js communicates with NestJS exclusively via GraphQL. NestJS communicates with backend services exclusively via gRPC.

## 3. Pedagogical Constraints (For Socratic AI Prompts)
*   **Zero Code Generation:** The Python microservice system prompts MUST explicitly ban the generation of markdown code blocks (```).
*   **Question Termination:** AI responses must evaluate the logical fallacy in the user's trace and return a pedagogical question designed to make the user trace their own state or identify the edge case.