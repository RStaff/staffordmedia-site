# Runtime Ops Board Design Notes v1

Status: READ_ONLY_VISIBILITY_NOT_IMPLEMENTATION

Purpose: document why the Runtime Operations Board exists and what it must not become.

## Why Read-Only

The board is for Ross to inspect operational truth under pressure. It reads canonical artifacts and displays them without mutating runtime state, patch queues, merchant data, Shopify themes, or public routes.

## Why Runtime Truth Is Canonical

Runtime state joins lifecycle state, packet validation, sandbox proof, replayability, rollback readiness, approvals, and execution ledger references into one operational object. Future automation must read this state instead of guessing from scattered files.

## Why Orchestration Is Absent

Orchestration is intentionally absent because execution requires separate approval gates, rollback proof, merchant approval, and control-boundary checks. Visibility should not imply permission to act.

## Future Evolution Path

- Add more runtime registry entries as real merchant transformations become approved.
- Add read-only grouping and filtering when the artifact volume grows.
- Add controlled mutation actions only in a separate approved slice with explicit StaffordOS gates.
- Add event consumers only after runtime event legality, rollback, and approval behavior are proven.

## Never Automate Blindly

- Live Shopify mutation.
- Deployment.
- Approval decisions.
- Scope expansion.
- Recovery product activation.
- Rollback decisions without proof.
- Public StaffordMedia route changes.
- Cross-merchant artifact reuse.

The Operations Board is an observability layer over canonical truth, not an autonomous control center.
