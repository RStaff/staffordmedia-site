# ShopiFixer Offer Ladder v1

Status: ALIGNMENT_ONLY

Purpose: connect existing commercial pages to the ShopiFixer Auto execution depth model without inventing a new funnel.

## Offer Ladder

| Offer                           | Merchant-facing language                                                                               | Internal execution depth                           | Expected price range                                                                   | Required proof                                                                                              | Required approval                                                                                        | Resource level                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Free Audit                      | "We will inspect your store and show the clearest conversion issue before changing anything."          | `LEVEL_0_AUDIT_ONLY`                               | Free                                                                                   | Audit payload, issue summary, recommended next action, storefront evidence when available.                  | Merchant permission to submit store/email. Ross approval before any StaffordOS-controlled surface patch. | FREE_AUDIT                                       |
| Quick Fix                       | "We will make one focused, reversible improvement in a preview copy."                                  | `LEVEL_1_QUICK_FIX`                                | Current page shows $950 flat; future range should stay tied to focused implementation. | Mutation packet, before screenshots, after screenshots, changed files, rollback reference.                  | Ross approval before sandbox execution; merchant approval before launch.                                 | QUICK_FIX                                        |
| Guided Transformation           | "We will reshape a focused purchase path in preview, then ask for approval."                           | `LEVEL_2_GUIDED_TRANSFORMATION`                    | Higher than Quick Fix; price must be decided in a separate pricing slice.              | Snapshot manifest, mutation packet, visual diff proof, QA result, rollback proof, merchant approval packet. | Ross approval before execution and merchant-facing proof; merchant approval before launch.               | GUIDED_TRANSFORMATION                            |
| Abando / Revenue Recovery Agent | "Once the highest-priority leak is clear, Abando helps recover shoppers who leave with buying intent." | Recovery product lane, not a theme mutation depth. | Separate product pricing; not defined by this document.                                | Recovery proof, send status, return link proof, attribution evidence when connected.                        | Ross approval for CTA destination; merchant approval for recovery deployment.                            | Depends on recovery runtime and merchant access. |

## Rules

- Free Audit does not imply permission to mutate.
- Quick Fix must remain narrow, reversible, and proof-backed.
- Guided Transformation requires stronger proof and approval before merchant presentation.
- Abando is downstream recovery, not an audit-result replacement.
