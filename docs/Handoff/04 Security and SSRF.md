---
type: security-handoff
updated: 2026-11-19
---
# Security and SSRF

## Present posture

The current public app has no feature that fetches a user-supplied URL. There is no image-from-URL import, webhook tester, link preview, PDF downloader, arbitrary callback, or server-side URL fetcher.

The existing server-side account proxy is not an SSRF primitive: it uses an allowlist of internal account routes and a trusted server environment variable for the sole gateway destination. The user controls neither the destination nor the protocol. Browser Python practice is isolated from app services; its CSP prevents access to private application paths.

This does not make future URL features safe by default. Any such feature must pass the design gate below before code is merged.

## Safe external-fetch gate

For a feature that must fetch a user-provided URL, create a dedicated server-side fetch service with all of these controls:

1. Accept only `https:` URLs. Reject userinfo, fragments, non-default ports unless specifically required, IP literals unless explicitly supported, and ambiguous URL forms.
2. Resolve the hostname with a controlled resolver before connecting. Reject loopback, unspecified, link-local, private RFC1918, carrier-grade NAT, multicast, documentation, unique-local IPv6, IPv4-mapped IPv6, and provider metadata ranges. Apply the rule to every resolved address.
3. Connect only to the validated resolved address or use a network egress policy that enforces the same rule. A hostname-only check is insufficient because of DNS rebinding.
4. Disable redirects by default. If redirects are required, validate every hop and its resolved address again; cap redirect count.
5. Prefer an explicit trusted-domain allowlist whenever the product can support one. Use a least-privilege egress policy so the service cannot reach private network ranges even if application validation fails.
6. Apply short connection, header, and total deadlines; a small response-size cap; limited concurrency; per-user/IP rate limits; and a content-type allowlist. Stream to bounded storage instead of buffering unknown files in memory.
7. Do not forward user cookies, authorization headers, cloud metadata credentials, or ambient service credentials. Use a separate fetch identity with no database or control-plane permissions.
8. Log only redacted URL metadata and a decision reason. Alert on repeated internal-address attempts. Do not log tokens, query values, or response bodies by default.
9. Test blocked `localhost`, IPv4/IPv6 loopback, private subnets, cloud metadata addresses, encoded forms, redirects, rebinding simulations, oversized responses, and slow responses. Include an allowed public fixture.

## Other active security rules

- Rate-limit paid, state-changing, and expensive routes according to their cost tier. Tier 1 work fails closed if budgets/limits are unavailable.
- Reject cross-origin writes, set body/query bounds, and return truthful `429` or `503` responses.
- Keep secrets in host secret managers only. Never expose a server URL with credentials or a secret using `NEXT_PUBLIC_*`.
- Validate ownership and business invariants server-side. Test denied operations, not just successful flows.
- Use dependency audits, CodeQL, commit-pinned actions, candidate validation, and rollback gates. A green scanner is not proof that no alert exists.
- Before enabling accounts: prove backup restore, private ingress, SMTP verification/reset, cross-account denial, headers, monitoring, and incident ownership.

## Security review trigger

Update [[../Security Audit|Security Audit]] and [[../Threat Model|Threat Model]] whenever adding an API route, server action, webhook, file upload, URL fetch, model call, code runner, outgoing email, or data export.
