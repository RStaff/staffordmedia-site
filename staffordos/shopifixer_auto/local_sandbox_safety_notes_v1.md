# Local Sandbox Safety Notes v1

Status: SAFETY_NOTES

Purpose: state the safety boundaries for the local snapshot/sandbox runner.

## Safety Rules

- Execution is local-only.
- No Shopify CLI may run.
- No Shopify API may be called.
- No live Shopify theme may be mutated.
- No deployment or publication may occur.
- No Codex mutation packet may execute from this runner.
- No Abando product changes are allowed.
- No StaffordMedia public surface changes are allowed.
- The original local source path must be recorded as the rollback reference.
- Proof is required before any merchant presentation.
- Merchant approval is required before launch or production promotion.
- Ross approval is required before merchant-facing proof.

## Public Surface Boundary

The runner must not edit:

- `/`
- `/shopifixer`
- `/audit-result`
- `/pricing`
- `/abando`
- `/recovery-demo`
- `/operator/dev-control`

If a future slice needs a public conversion-surface change, it must use the StaffordOS patch queue and visual approval gates.
