---
type: feature
status: live
updated: 2026-10-03
---
# Engineering Foundations

Route: `/foundations`. Navigation: **Engineering basics**. Related: [[Learning Design]], [[Security Audit]], [[features/Product Projects]].

Teach what tools do before asking learners to automate. Five lessons cover files and relative paths, Bash pipelines, Git snapshots, SSH host context, and secure business rules. Each requires a prediction, commands that demonstrate the objective, and a transfer question. Incorrect answers receive authored feedback; hints ask learners to inspect evidence. There is no AI grading or claim of professional certification.

## Implementation and boundaries

- `engineering-foundations.ts`: authored lessons and 27 searchable command references.
- `terminal-simulator.ts`: pure, bounded virtual filesystem and command state machine. No eval, processes, network calls, real filesystem access or credentials. Display all input/output as React text.
- Supported subset: pwd, ls, cd, cat, grep -F, wc -l, simple echo redirection, selected Git operations, fictional SSH/exit and fixed shop curl fixtures. Unsupported commands fail explicitly. This is not a Bash interpreter or terminal emulator; reference-only commands do not run.
- Git preserves separate working, staged and committed versions. A local commit does not upload anything. SSH assumes verified fictional host identity; the transfer question covers unexpected host-key changes.
- Shop fixtures demonstrate owner checks (403), positive bounded integer quantities (400), and totals calculated from a trusted catalog. They are educational fixtures, not a deployed commerce backend. Concurrent stock updates and idempotency require separate real-server implementation.
- Versioned, validated browser storage retains only completed lesson IDs. Commands and simulated files are tab-only. Storage failures allow practice to continue and warn that saving failed. A local completion badge is not trusted account evidence.

## Acceptance and verification

Domain coverage checks all five objectives, staged snapshot behavior, SSH return context, rejection of expansion/unknown paths/hosts, quoted literal text, price/quantity manipulation and corrupt browser data. Browser coverage exercises wrong/correct predictions and transfer answers, all command sequences, reset, reload, blocked storage, literal HTML, search and mobile overflow. No shop.test or practice.test request may leave the browser.

General response headers remove framework disclosure, prohibit MIME sniffing, restrict framing to the same origin, limit referrer leakage and disable unused camera/microphone/location/payment permissions. Production adds HSTS. Application pages receive base/object/frame/form CSP directives. This is **not a complete script-source CSP or a penetration-test certification**. The isolated Python runner keeps its separate nonce-based policy; existing cross-browser execution checks must pass before release.

## Primary references

- [GNU Bash pipelines](https://www.gnu.org/software/bash/manual/html_node/Pipelines.html)
- [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- [Git staging semantics](https://git-scm.com/docs/git-add)
- [OpenSSH manual](https://man.openbsd.org/ssh)
- [OWASP object-level authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP business logic security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html)

Next depth: multi-step product requirements, abuse-case reviews, real disposable terminal exercises, transactions/concurrency and operational incident practice. These are not yet implemented by this simulator.

## Release evidence
PR #35 head `d610083` passed run `37083884705`: quality, build, dependency review, both CodeQL languages, Chromium/Firefox/WebKit, and accounts/persistence. No open PR CodeQL findings were returned. WebKit mobile artifact inspected; no horizontal overflow. Merged as `fa2e5f7`; production run `37084250757` passed candidate validation and promotion. Public `/foundations` returned 200 with the expected content/security headers; `/runner` retained its sandbox CSP.
