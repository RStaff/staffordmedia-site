# Orchestration Boundary Rules v1

Status: ARCHITECTURE_ONLY_NOT_IMPLEMENTED

Purpose: define hard limits for future ShopiFixer Auto orchestration. This is a safety contract, not an implementation.

## Workers May Do

- Read approved input artifacts for their assigned queue.
- Produce the exact output artifact required by that queue.
- Stop when required evidence, access, approval, or budget is missing.
- Report changed files when a future sandbox mutation is separately approved.
- Attach verification evidence to the relevant manifest.
- Request escalation when risk, scope, approval, or rollback state is unclear.

## Workers May Never Do

- Mutate a live Shopify theme.
- Deploy or publish a theme.
- Connect to Shopify APIs without a separate approved implementation slice.
- Create new merchant access paths.
- Expand beyond allowed files, allowed operations, or mutation depth.
- Convert a visual QA pass into merchant approval.
- Reuse screenshots, files, or decisions across merchants.
- Continue after rollback evidence is missing.

## Approval Boundaries

- No autonomous deploy.
- No live mutation without explicit Ross approval, merchant approval, rollback proof, and a separate deployment process.
- No scope expansion after packet approval.
- No cross-merchant contamination of files, screenshots, manifests, decisions, or credentials.
- Rollback must exist before deployment eligibility.

## Stop Conditions

- Merchant identity is uncertain.
- Store domain or theme ID does not match the packet.
- Required screenshots are missing or mismatched.
- The target file is not listed in `allowed_files`.
- The requested operation is listed in `prohibited_operations`.
- Diff risk is HIGH_RISK_DIFF without explicit escalation approval.
- Compute budget is exceeded.
