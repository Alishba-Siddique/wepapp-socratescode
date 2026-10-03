---
type: security
status: working-model
updated: 2026-10-03
---
# Threat model

Related: [[Security Audit]], [[System Design]], [[features/Engineering Foundations]], [[Production Configuration]]. This is a scoped engineering review, not a penetration-test report.

## What we protect

Learner identity and account progress when the optional gateway is connected; availability of practice; deployment credentials; integrity of shipped code. Guest notes and progress are browser-local convenience data, not secrets or authoritative assessment records.

## Trust boundaries and abuse cases

| Boundary | What can go wrong? | Implemented control | Remaining work or limit |
| --- | --- | --- | --- |
| Learner input to UI | A command, note or problem title contains executable markup | New terminal output renders as React text; bounded inputs and transcript; browser test uses literal HTML | Continue auditing any future rich-text renderer and imported content |
| Command exercise to host | A learner enters a destructive command or another hostname | Pure fixture interpreter; no process, filesystem or network integration; unknown commands/hosts fail | A future real shell requires a separate disposable sandbox, quotas and cleanup |
| Python practice to application | Learner code hangs or tries to access app state | Opaque sandboxed iframe, restrictive runner CSP, worker execution deadline and recovery tests | Browser execution is not a trusted remote assessment service |
| Browser to account proxy | Cross-site writes, excessive request data, arbitrary proxy targets | Same-origin POST checks, fixed route allowlist/upstream, 64 KiB streamed body bound, upstream timeout | Validate body-read deadlines and hosting-level request/connection limits before public gateway launch |
| Account API to stored progress | Caller reads/writes another account or forges completion | Session-derived owner; GraphQL limits; server validation; unauthenticated/cross-origin tests | Browser progress must never confer certification, role or billing entitlement |
| Authentication admission | Repeated requests exhaust service or abuse email | IP burst limit plus shared PostgreSQL admission; bounded auth requests; sanitized logs | Provision and verify production ingress, email policy and monitoring |
| Webpage embedding/browser capabilities | Clickjacking, MIME sniffing, unwanted permissions | Same-origin frame policy, nosniff, limited base/object/frame/form CSP, permissions and referrer policies, production HSTS | Page CSP does not yet restrict script sources; these headers do not replace authorization or output encoding |
| Dependencies and release | Vulnerable package or unverified code reaches production | Pinned dependencies/lockfiles, audits, CodeQL, protected PR checks and candidate validation before promotion | Four current dependency alerts are tracked in [[Security Audit]]; prepared patches still need regenerated locks and checks |

## Business invariants

For every new feature, state who may act, what must remain true, what data is trusted, and how duplicate/concurrent requests behave. Test at least one denied operation as well as the successful path. The simulated shop demonstrates ownership checks, bounded quantities and catalog-based prices; it does not implement real checkout or inventory transactions.

Account completion, tenant membership, administrative privileges and future purchases require server-authoritative checks. Hiding a button, using an opaque ID or trusting localStorage is not sufficient.

## Before accounts open publicly

Resolve gateway dependency alerts; provision separate secrets/database/hosting/email; verify shared admission behind the real proxy; test cross-account isolation; configure backups and prove a restore; define monitoring, retention/deletion and incident ownership. The present guest experience can remain available while these requirements are completed.
