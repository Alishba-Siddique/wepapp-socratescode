---
type: workflow
status: active
updated: 2026-09-14
---
# Development workflow
[[Home]] | [[Engineering Standards]] | [[Feature Catalog]] | [[Delivery]]

The vault is web-app/docs. Obsidian opens these ordinary Markdown files directly; Git versions the same notes beside the code. Local workspace layout and cache files stay ignored. No paid sync or community plugin is required for this workflow.

1. Read the current feature note and product rules. Check implemented versus planned status before coding.
2. Define the learner-facing outcome, acceptance criteria and failure states in features/. Record meaningful architecture choices using templates/Decision.
3. Implement a complete increment. Update System Design and Security Audit when service boundaries, routes, identity or costs change.
4. Run the relevant domain, lint, type, build and browser checks. Record actual results and unresolved limits; never mark a future service as deployed.
5. Commit code and its supporting notes together. The PR describes final behavior, verification and operational risks. CI is the authoritative record of remote check results.
6. After an approved release, create a releases/ note with the commit, immutable deployment, CI run and public verification. Update Delivery, feature status and Session Log.

Use Home as the entry point, Feature Catalog for scope and Session Log for chronological evidence. Preserve supplied references unchanged; document corrections in the feature note. Never store credentials, private learner data or authenticated browser traces in the vault.
