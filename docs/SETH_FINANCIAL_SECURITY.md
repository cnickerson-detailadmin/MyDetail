# Seth Financial Authorization Security — FAIL CLOSED

Status: architecture guardrail only. No bank credentials, provider tokens, PINs, or real-money transfer capability are implemented by this file.

## Non-negotiable boundary
The browser/frontend (including app.js, localStorage, sessionStorage, service workers, GitHub Pages, and Seth conversation memory) MUST NEVER receive:
- bank usernames/passwords
- bank/provider access or refresh tokens
- plaintext authorization PINs
- Supabase service-role/server secret keys
- reusable financial authorization credentials

All sensitive financial capability lives server-side only.

## Authorization state machine
LOCKED -> REQUESTED -> AUTHORIZED -> EXECUTING -> FULFILLED -> DESTROYED -> LOCKED

Any unexpected state, expired request, replay, mismatch, network ambiguity, or verification failure -> LOCKED/DENIED.

## Required controls before any future real-money implementation
1. Provider-issued revocable banking tokens only; never store online-banking passwords.
2. Secrets encrypted at rest using managed server-side secret storage/KMS.
3. 4-digit code stored only as a slow salted password hash; never plaintext and never logged.
4. PIN attempt throttling, escalating cooldown, and lockout/risk alert after repeated failures.
5. Trusted-device/passkey or equivalent strong confirmation in addition to the PIN for movement of real funds.
6. Every authorization is single-use, short-lived, amount-limited, destination-limited, action-limited, user-bound, and company-bound.
7. Cryptographically random request ID + nonce; reject replayed/duplicate requests.
8. Idempotency key on every money-moving provider request.
9. Seth may REQUEST an action but can never authorize itself, widen scope, change destination/amount, or bypass approval.
10. Server re-checks authenticated user, role, company isolation, request scope, limits, and authorization immediately before execution.
11. No arbitrary transfer endpoint. Server accepts only an allowlisted action schema.
12. Destination accounts/payees require separate enrollment and stronger approval before they can receive funds.
13. Tax reserve defaults to locked. Release requires a separately authorized release action.
14. Authorization credential/capability is invalidated immediately after success, denial, timeout, cancellation, or ambiguous provider response.
15. Never retry a money movement blindly after a timeout. Reconcile provider transaction status first.
16. Append-only audit record retains request/approval/result metadata but NEVER PINs, secrets, raw tokens, or bank credentials.
17. Redact secrets and financial credentials from application, AI, analytics, error, tracing, and support logs.
18. Rate limits and anomaly detection on request, authorization, and execution endpoints.
19. Kill switch disables all Seth financial execution without disabling read-only account information.
20. Separate production/test environments. Development uses sandbox/fake accounts only.
21. Least-privilege database policies/RLS; no customer can read another company's financial records.
22. Server financial functions deny browser-supplied role/company claims; derive identity from verified server auth.
23. CSRF/origin protections where applicable and strict CORS allowlist for authenticated financial endpoints.
24. Dependency/security scanning and secret scanning before production deployment.
25. Alert on authorization failures, replay attempts, destination changes, unusual amounts, and kill-switch activation.
26. Provider webhooks must be signature-verified and replay-protected.
27. Recovery/admin actions cannot reveal existing secrets or PINs; reset/re-enrollment only.
28. Backups must not create plaintext secret copies.
29. Production financial permissions remain disabled until provider integration, threat review, and end-to-end sandbox tests pass.
30. Default behavior is DENY. No AI output can override these controls.

## Seth rule
Seth can propose/request a financial operation. Only the backend authorization service can determine whether an approved operation is executable. Seth never sees the credential that grants execution.

## Frontend rule
The frontend may display status such as LOCKED, APPROVAL REQUIRED, AUTHORIZED FOR ONE REQUEST, FULFILLED, or DENIED. It must not contain the security decision itself.

## Deployment gate
Do not enable real-money execution merely because UI exists. Production stays disabled until server-side secrets, provider sandbox integration, authorization service, audit trail, replay protection, rate limiting, strong confirmation, and kill switch have been independently tested.
