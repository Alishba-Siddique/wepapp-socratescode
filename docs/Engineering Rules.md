# Engineering Rules
[[Home]] - [[Architecture]]

## Code
Use server components by default; place browser state in small client components. Read installed Next.js docs for routing and component boundaries. Keep domain calculations pure and typed.

Validate route slugs, stored JSON, numeric bounds, and every stage transition. Unknown lessons return not-found. Corrupted local data must not crash the page. Progress updates must notify other views and tabs.

Do not add dependencies for simple UI or deterministic calculations. Do not add a backend connection without a contract. Do not store credentials in a vault note, browser storage, or public environment variable.

## Testing
Verify correct and incorrect predictions, every trace frame, gated stage progression, modified inputs, completion, refresh persistence, and corruption recovery. Test desktop and phone layouts, keyboard navigation, and visible focus.

Use fixture-based tests for domain calculations and real browser interactions for the learning flow. Do not count a visual mockup as a working feature.

## Delivery
Run the available lint, type check, test, and build commands. Describe what is functional and what is deferred. Record evidence in [[Session Log]]. Do not mark root tracker tasks complete unless they are verified and committed.

## Notes
Use linked Markdown in this vault. Each decision records context, choice, consequence, and revisit trigger. Keep sensitive data out. Avoid community-plugin dependencies for essential planning.
