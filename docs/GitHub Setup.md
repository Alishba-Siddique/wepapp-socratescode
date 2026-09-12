# GitHub Setup
[[Home]] | [[System Design]] | [[Engineering Rules]]

Target repository: `wepapp-socratescode` (the spelling supplied by the owner).

## Repository layout
Use the CONTENTS of the local web-app folder as this repository's root. The root should contain frontend/, docs/, ai-tutor-service/, AGENTS.md and .github/. Keep the landing page in its existing repository. The owner explicitly authorized initializing this web-app folder as its own repository and publishing to https://github.com/Alishba-Siddique/wepapp-socratescode.git. Keep its remote separate from the parent landing-page checkout.

Do not upload node_modules, .next, Python venv, __pycache__, .env files, credentials, generated test reports or personal Obsidian workspace state. The root .gitignore covers these paths. Review the staged file list before the first commit.

## Settings to choose
1. Default branch: main. Use short feature branches and pull requests.
2. Settings -> Rules -> Rulesets: target main, require pull requests, block force pushes and branch deletion, require resolved conversations, and require the `frontend-checks` status check after its first run. Enable enforcement. Availability depends on repository visibility and GitHub plan.
3. As a solo maintainer, do not require another person's approval yet: you cannot approve your own pull request. Require one approving reviewer once a collaborator is available.
4. Settings -> Actions -> General: allow the official actions used by the workflow; use read-only default workflow token permissions. Keep pull-request approval by workflows disabled.
5. Enable Dependabot alerts and secret scanning/push protection where available. Review updates through pull requests. Never put runtime secrets into source files.
6. Use separate staging and production environments when deployment is added. Restrict production deployment branches and add an approval reviewer when a second maintainer exists.

The prepared workflow belongs at `.github/workflows/frontend.yml`, not `github/workflows/main.yml`. It installs locked dependencies and runs domain tests, lint, TypeScript, a production build and browser checks. The first GitHub Actions run passed on Ubuntu: https://github.com/Alishba-Siddique/wepapp-socratescode/actions/runs/34688468722.

## Vercel frontend preview
Import wepapp-socratescode. If web-app contents are at the repository root, set Root Directory to `frontend`. Framework Preset: Next.js. Build Command: `npm run build`. Install Command: `npm ci`. Leave Output Directory on the framework default; do not point Vercel at a .next directory in the repository root. No environment secrets are needed for the guest-only increment.

If you instead upload the whole parent project, the root becomes `web-app/frontend`; the prepared workflow assumes the recommended standalone web-app layout and must be adjusted in that case.

The backend services will need a separate runtime; a frontend deployment does not deploy an execution sandbox or tutor.

## References
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Available branch rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Vercel build settings](https://vercel.com/docs/builds/configure-a-build)

## Configuration applied 2026-09-12
Vercel root corrected to frontend, framework Next.js, npm ci and npm run build; framework output defaults retained. Staging and Production environments restrict deployments to main. Both contain an encrypted project-scoped Vercel CI token expiring 2026-12-11; Staging has an automation bypass secret. Repository deployment variables are configured and VERCEL_DEPLOY_ENABLED is true. Production uses automatic promotion after candidate verification while there is one maintainer; no mandatory human review is configured. Main protection and remote workflow verification are tracked in Session Log.
