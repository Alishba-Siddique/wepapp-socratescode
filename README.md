# socratescode

Learn to reason, write code independently, and explain engineering decisions. The target learner can start with no coding background. Socratic questions and PRIMM (Predict, Run, Investigate, Modify, Make) guide the practice; the app does not generate solutions or certify interview readiness.

## Implemented in this branch
- Nine guided logic labs with traces, incorrect-answer feedback and guest progress.
- Twenty Python problems in a Monaco editor, custom JSON inputs, public checks, console output, stop/timeout handling and browser drafts. Eight exercises are adapted from MIT-licensed Exercism specifications.
- Seventeen Socratic pattern lessons with predictions, decision walkthroughs, reflection and sourced real-product examples.
- Six system design, database design and architecture exercises with progressive prompts, self-review and Markdown export.
- Fifty-four external practice references, searchable by source and topic.
- Better Auth accounts and PostgreSQL progress through a NestJS GraphQL gateway, when configured. The guest experience works without a gateway.

## Quick start: guest learning
Use the Node version in `.node-version`.

```sh
cd frontend
npm ci
npm run dev -- --port 3001
```

Open http://localhost:3001. Python runs on the learner's device in an isolated browser worker. The first run downloads the self-hosted runtime. It is practice execution, not a trusted server judge; checks are public and browser memory is not hard-limited.

For accounts, database setup and verification, read [Local Development](docs/Local%20Development.md). Never put gateway or database secrets in public environment variables.

## Documentation
Open `docs/` as an Obsidian vault. Start at [Home](docs/Home.md).

- [Platform Guide](docs/Platform%20Guide.md): learner journeys and product boundaries.
- [Learning Design](docs/Learning%20Design.md): beginner-to-independent-engineer progression.
- [Architecture](docs/Architecture.md): implemented boundaries and future services.
- [API and Data](docs/API%20and%20Data.md): contracts, ownership and persistence.
- [Content and Licensing](docs/Content%20and%20Licensing.md): reproducible GitHub imports.
- [DSA in Products](docs/DSA%20in%20Products.md): source register and evidence policy.
- [Security Audit](docs/Security%20Audit.md), [Testing](docs/Testing.md), [Delivery](docs/Delivery.md).

## Deployment status
This branch adds functionality; it does not configure a production database, email service or Cloudflare account. The existing production deployment remains Vercel until a migration is separately verified. Run Next.js builds from `frontend` with access to sibling `contracts`. Keep the gateway on private ingress behind the same-origin frontend proxy. No paid service or live AI is enabled.
