---
type: feature
status: live
updated: 2026-10-03
---
# Secure Checkout Practice

Route: `/solve/secure-checkout`. Discover through the practice bank (Solve here or Debugging) and the security lesson in `/foundations`. Related: [[features/Engineering Foundations]], [[Threat Model]], [[Learning Design]].

## Learning outcome

Translate a business contract into ordered guards. The learner predicts the deliberately unsafe starter's result, identifies the trust boundary, repairs real Python, examines failing cases and explains the repair. Distinguish verified identity, stored order facts and client-controlled fields. Reject before exposing order details; calculate from the trusted catalog; validate positive integer quantities and stock limits.

The input is a **fictional server snapshot**, not a proposed real API payload. A production handler must independently obtain identity and order data. Returned status numbers are exercise values, not actual HTTP responses. No purchases, users, inventory writes or payment requests occur.

## Contract and assessment

Check in order: missing identity (401), wrong owner (403), invalid quantity (400), insufficient stock (409), then catalog total (200). Exact objects are documented in the app. Other request fields are ignored. Python booleans must not count as integer quantities.

Eighteen public cases cover a valid order, client-price changes, varying catalog prices, a legitimate free item, forged ownership, check precedence, missing/negative/zero/boolean/string/fractional/null/object quantities, exact stock, excess stock and no stock. Cases are visible teaching material, not hidden certification tests. Personal regression cases and the existing debugging notebook remain available. Guidance and reflections are authored, not AI grading.

The review appears only after the current code passes platform checks; edits or reload invalidate that evidence. Local drafts survive reload when browser storage is available. The worker/opaque-iframe execution boundary is unchanged.

## Verification

Existing domain suite and browser script syntax pass locally. Extended three-browser tests cover incorrect prediction, correct diagnosis, unsafe starter failure, a correct Python repair across all 18 cases, review gating, persisted code and mobile overflow. CI supplies lint, types, build, audits and browser execution; release evidence belongs in [[Session Log]].

## Production reasoning to discuss next

A stock check alone cannot prevent concurrent overselling. A successful function return does not charge a card, reserve stock, authorize a real request or make retries idempotent. The reflection prompts explicitly separate this exercise from transactional production checkout.

Primary references: [OWASP business logic security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [OWASP object authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/), [Python boolean and integer types](https://docs.python.org/3/library/stdtypes.html#boolean-type-bool). Scenario, prompts and cases are authored for this platform.

## Verification evidence
PR #36 head `bc102c7` passed CI run `37104405195`: quality, build, dependency review, CodeQL, all three browsers and accounts/persistence. No open PR CodeQL findings. The WebKit mobile artifact was inspected. Merged as `bae9548`; production run `37104711842` passed all gates including candidate and promotion. The public page returned HTTP 200 with its title, guard contract and nosniff header.
