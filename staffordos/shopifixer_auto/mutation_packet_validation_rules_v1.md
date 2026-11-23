# Mutation Packet Validation Rules v1

Status: RULES_ONLY_NOT_EXECUTABLE

Purpose: define deterministic checks for mutation packets before any sandbox execution is considered.

## Required Fields

Every packet must include:

- `packet_id`
- `merchant_id`
- `store_domain`
- `theme_archetype`
- `mutation_depth`
- `issue_summary`
- `business_hypothesis`
- `target_surface`
- `allowed_files`
- `prohibited_files`
- `allowed_operations`
- `prohibited_operations`
- `required_snapshots`
- `acceptance_criteria`
- `visual_qa_requirements`
- `rollback_plan`
- `approval_gates`
- `resource_budget`
- `execution_status`

## Forbidden Fields

Packets must not include:

- live access tokens
- Shopify API secrets
- customer PII
- payment data
- checkout mutation instructions
- production deployment commands
- broad shell command strings
- agent launch instructions
- permissions that override approval gates

## Risk Checks

Reject or block the packet when:

- `allowed_files` contains broad directories instead of exact files.
- `live_theme_mutation_allowed` is true without separate explicit launch approval.
- `mutation_depth` exceeds `resource_budget.max_mutation_depth`.
- requested operations touch cart, checkout, product form logic, global JavaScript, app blocks, or theme-wide CSS outside scope.
- rollback is missing for any depth above `LEVEL_0_AUDIT_ONLY`.
- screenshots are missing for any depth above `LEVEL_0_AUDIT_ONLY`.
- approval status is `UNKNOWN`, `NEEDS_REVIEW`, or `REJECTED` for a required gate.

## Allowed Mutation Depth By Approval State

| Approval state              | Allowed depth                         |
| --------------------------- | ------------------------------------- |
| UNKNOWN                     | `LEVEL_0_AUDIT_ONLY` only             |
| NEEDS_REVIEW                | `LEVEL_0_AUDIT_ONLY` only             |
| REJECTED                    | none; quarantine or redesign required |
| APPROVED_WITH_MODIFICATIONS | only within stated bounds             |
| APPROVED                    | up to the packet's declared max depth |

## Rollback Requirement

- `LEVEL_0_AUDIT_ONLY`: preserve audit evidence.
- `LEVEL_1_QUICK_FIX`: require patch diff and original file snapshot.
- `LEVEL_2_GUIDED_TRANSFORMATION`: require full duplicate theme backup, patch diff, original screenshots, and rollback proof.
- `LEVEL_3_HIGH_RISK_REDESIGN`: require tested rollback path before any production consideration.

## Screenshot Requirement

Any mutation packet above `LEVEL_0_AUDIT_ONLY` requires:

- before screenshots
- after screenshots
- identical screenshot targets before and after
- desktop and mobile targets when the affected surface is visual
- visual comparison notes

## File Scope Requirement

- Codex may touch only files in `allowed_files`.
- Files in `prohibited_files` override `allowed_files`.
- Missing target files require stop and report.
- New files require explicit inclusion in `allowed_operations`.
- Scope expansion requires a new packet or explicit approval.

## Merchant Approval Requirement

Merchant approval is required before launch. Ross approval is required before merchant-facing proof. A valid packet can still be blocked when approval gates are incomplete.

## Final Rule

A mutation packet is not permission to execute. It is only a controlled instruction object awaiting explicit approval.
