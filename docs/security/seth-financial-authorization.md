# Seth Financial Authorization — Security Contract

Status: DESIGN CONTRACT ONLY — NO LIVE BANK ACCESS IS ENABLED BY THIS FILE.

## Non-negotiable boundary
Seth must never possess standing authority to move money. Financial credentials, provider tokens, PIN verification material, encryption keys, and authorization capabilities are backend-only. None may be exposed to browser JavaScript, GitHub Pages, localStorage/sessionStorage, client logs, prompts, chat memory, analytics, URLs, or frontend error messages.

## State machine
LOCKED -> REQUESTED -> AUTHENTICATED -> AUTHORIZED -> EXECUTING -> FULFILLED -> REVOKED

Every transition is deny-by-default. Invalid, expired, replayed, duplicated, modified, out-of-order, or unauthorized requests fail closed back to LOCKED.

## Request
A financial action must specify an immutable action type, exact amount, source, destination, currency, requesting user/company, nonce/idempotency key, creation time, and short expiry. Seth may request an action but may never approve its own request.

## Authorization
A 4-digit user PIN may be used as one factor in the MyService experience but is never stored in plaintext. Store only a modern salted password hash in the backend. Enforce aggressive rate limits, progressive cooldown/lockout, anti-automation controls, and trusted-session/device checks. Real-money movement must additionally be authorized through the regulated financial provider/trusted-device control before execution.

Authorization creates a short-lived, single-use, server-side capability scoped to exactly one immutable transaction. No wildcard account access.

## Execution tripwires
- Server-side authorization and company/owner checks on every request.
- Re-read authorization immediately before execution.
- Cryptographically bind authorization to transaction fields.
- One-time nonce + idempotency key; reject replay.
- Very short expiration; no refresh by Seth.
- Amount/destination cannot change after approval.
- Provider allowlist and destination allowlist where supported.
- Transaction and velocity limits.
- Reject concurrent duplicate executions.
- Fail closed on database/provider/network ambiguity; never retry a transfer blindly.
- No financial action from AI-generated tool arguments without server validation against the approved immutable request.
- Seth cannot create, extend, elevate, reactivate, or override authorization.
- Separate production/test environments and credentials.
- No real credentials or real money in development/test.
- Emergency server-side financial kill switch independent of Seth/frontend.

## Fulfillment and destruction
After provider-confirmed success OR terminal failure, immediately revoke/consume the capability. It can never be reused. Seth returns to LOCKED.

Delete ephemeral authorization secrets/capabilities according to backend lifecycle rules. Never retain them in conversational memory.

Retain only the minimum non-secret audit record required for security/accounting: request ID, actor, action, amount/currency, approved destination reference, timestamps, authorization method category, provider transaction reference, outcome, and security events. Audit records must be tamper-resistant and access-controlled.

## Secrets
Bank/provider tokens are encrypted at rest using a managed server-side secret/KMS mechanism and decryptable only by the minimum execution service. Never store online-banking passwords when a provider token/OAuth connection is available. Rotate/revoke credentials after suspected compromise.

## Alerts / anomaly tripwires
Block and alert on repeated PIN failures, new/untrusted device or session anomalies, changed destination, unusual amount/velocity, replay attempts, expired authorization, authorization/execution mismatch, privilege escalation, disabled kill switch, unexpected production credential access, or audit-integrity failure.

## Recovery
A financial incident must support immediate provider-token revocation, financial kill-switch activation, session revocation, credential rotation, immutable incident logging, and manual review before re-enabling transfers.

## Implementation gate
Do not enable live banking or transfers until:
1. server-side secret storage is configured;
2. production auth/role/company isolation is verified;
3. financial provider and its authorization model are selected;
4. database authorization/RLS is tested;
5. rate limiting, idempotency, audit logging, alerts, and kill switch are tested;
6. threat-model/security review is completed;
7. test environment passes failure/replay/concurrency tests.

This contract intentionally favors refusing a transaction over moving money under uncertainty.
