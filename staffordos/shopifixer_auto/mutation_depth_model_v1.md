# Mutation Depth Model v1

Status: FOUNDATION_ONLY_NOT_IMPLEMENTED

Purpose: define bounded mutation levels for theme-aware ShopiFixer work. These levels do not authorize live-store mutation.

## Levels

| Level                         | Merchant-facing language                                                     | Internal execution meaning                                                                                       | Required approvals                                                                                                         | Estimated compute/resource usage                                    | Rollback requirement                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| LEVEL_0_AUDIT_ONLY            | "We will inspect and show the opportunity before changing anything."         | Analyze screenshots, theme signals, payloads, and likely issue areas. No code or theme mutation.                 | Merchant permission to inspect public storefront or provided artifacts. Ross approval for any StaffordOS-controlled patch. | Low: one audit pass, screenshot review, no sandbox execution.       | None beyond preserving audit evidence.                                                  |
| LEVEL_1_QUICK_FIX             | "We will make one small reversible improvement in a preview copy."           | Minimal scoped patch to copy, spacing, CTA clarity, or existing section settings inside a duplicated theme only. | Merchant approval of target issue, duplicate theme confirmation, before snapshot, rollback plan.                           | Low to medium: file diff, preview render, before/after screenshots. | Required patch diff and original file snapshot.                                         |
| LEVEL_2_GUIDED_TRANSFORMATION | "We will reshape a focused purchase path in preview, then ask for approval." | Multi-file but bounded transformation of an existing flow, such as product purchase panel or collection clarity. | Merchant approval of hypothesis, screenshot baseline, duplicate theme, visual diff, explicit go/no-go.                     | Medium to high: sandbox preview, visual QA, manual inspection.      | Required full theme duplicate backup, patch diff, original screenshots, rollback proof. |
| LEVEL_3_HIGH_RISK_REDESIGN    | "This is a redesign proposal, not an automatic fix."                         | Broad layout, template, app-block, or behavior change with material brand or revenue risk. Not autonomous.       | Merchant written approval, Ross approval, explicit scope, staged review, rollback test.                                    | High: multiple QA passes, visual review, stakeholder approval.      | Required tested rollback path before any production promotion.                          |

## Rules

- Default to `LEVEL_0_AUDIT_ONLY` when theme structure is unknown.
- `LEVEL_1_QUICK_FIX` is the first eligible mutation level, and only in a duplicate theme or sandbox preview.
- `LEVEL_2_GUIDED_TRANSFORMATION` requires human review before and after patching.
- `LEVEL_3_HIGH_RISK_REDESIGN` is not an autonomous mode.
- Successful build or preview render is not approval.
