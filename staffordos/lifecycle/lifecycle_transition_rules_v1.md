# Lifecycle Transition Rules v1

Status: RULES_ONLY_NOT_IMPLEMENTED

Purpose: define how merchant lifecycle states may advance, block, roll back, or escalate. This document does not implement automation.

## Allowed Transition Path

Primary ShopiFixer path:

`LEAD_CAPTURED -> AUDIT_GENERATED -> QUALIFIED -> QUICK_FIX_CANDIDATE or GUIDED_TRANSFORMATION_CANDIDATE -> SNAPSHOT_PENDING -> SNAPSHOT_READY -> MUTATION_PACKET_READY -> VALIDATION_PENDING -> QA_PENDING -> PROOF_READY -> ROSS_APPROVAL_PENDING -> MERCHANT_APPROVAL_PENDING -> DEPLOYMENT_READY -> DEPLOYED -> ROLLBACK_AVAILABLE -> MONITORING`

Abando path:

`AUDIT_GENERATED or QUALIFIED or DEPLOYED or MONITORING -> ABANDO_CANDIDATE -> ABANDO_ACTIVE -> MONITORING`

## Blocked Transitions

- No state may move to `MUTATION_PACKET_READY` without audit context and allowed scope.
- No state may move to `VALIDATION_PENDING` without a candidate packet.
- No state may move to `QA_PENDING` without packet validation and changed-file evidence from a separately approved sandbox process.
- No state may move to `PROOF_READY` without before/after proof and rollback reference.
- No state may move to `MERCHANT_APPROVAL_PENDING` without Ross approval.
- No state may move to `DEPLOYMENT_READY` without merchant approval and rollback proof.
- No state may move to `DEPLOYED` through autonomous execution.
- No state may move to `ABANDO_ACTIVE` without merchant approval and recovery access.

## Rollback Transitions

- `QA_PENDING -> ROLLBACK_AVAILABLE` when QA fails after a sandbox mutation.
- `PROOF_READY -> ROLLBACK_AVAILABLE` when visual proof shows unacceptable drift.
- `ROSS_APPROVAL_PENDING -> ROLLBACK_AVAILABLE` when Ross rejects or requires restart.
- `MERCHANT_APPROVAL_PENDING -> ROLLBACK_AVAILABLE` when merchant rejects the preview.
- `DEPLOYED -> ROLLBACK_AVAILABLE` when a launched change must be reverted.
- `ROLLBACK_AVAILABLE -> MONITORING` only when rollback proof exists.

## Escalation Paths

- Quick fix scope expansion escalates to `GUIDED_TRANSFORMATION_CANDIDATE`.
- Unknown theme, missing screenshot proof, missing rollback, or medium/high visual diff escalates to `ROSS_APPROVAL_PENDING`.
- Merchant-facing proof requests without Ross approval remain blocked.
- Deployment requests without merchant approval remain blocked.
- Abando CTA ambiguity escalates to Ross before any destination change.

## Timeout And Escalation Concept

Timeouts are future operational policy only. They are NOT_IMPLEMENTED.

- Stale `LEAD_CAPTURED` may require merchant follow-up.
- Stale `SNAPSHOT_PENDING` may require access review.
- Stale `ROSS_APPROVAL_PENDING` remains blocked until Ross decides.
- Stale `MERCHANT_APPROVAL_PENDING` remains blocked until merchant decides.
- Stale `DEPLOYMENT_READY` must be rechecked before any launch process.

## Failure Recovery

- Preserve the last known valid lifecycle state.
- Record the missing artifact or failed gate.
- Prefer rollback or blocked state over guessing.
- Do not advance state by inference from successful validation, screenshots, or build output.
