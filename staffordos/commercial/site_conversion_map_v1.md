# Site Conversion Map v1

Status: ALIGNMENT_ONLY

Purpose: map the existing StaffordMedia.ai routes to the current ShopiFixer and Abando commercial flow. This document does not authorize UI, route, CTA, pricing, or automation changes.

## Current Route Map

| Route                   | Purpose                                                    | Current role in funnel                                                                    | Product lane              | Current maturity                                                              | What should remain unchanged                                                                            | What needs review                                                                  |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                     | StaffordMedia decision layer and product boundary surface. | Directs merchants toward diagnosis/fix or recovery proof without blending products.       | StaffordMedia umbrella    | Approved in registry, Ross visual approval for this session remains UNKNOWN.  | Existing page hierarchy, product distinction, and approved visual direction.                            | Homepage visual approval lock before any new before/after conversion surface work. |
| `/shopifixer`           | ShopiFixer audit entry and store/email submission surface. | Starts free audit flow and redirects completed audit submissions to `/shopifixer/result`. | ShopiFixer                | Approved canonical surface, runtime verification currently false in registry. | Audit entry role, canonical StaffordMedia ownership, and separation from Abando install/recovery flows. | Ross visual approval and audit engine dependency behavior.                         |
| `/audit-result`         | Full ShopiFixer diagnosis from canonical payload.          | Converts audit evidence into issue clarity and moves merchant toward `/pricing`.          | ShopiFixer                | Active planned surface tied to live audit payload.                            | Canonical payload parity, diagnosis language, store-specific result path, and pricing handoff.          | Audit-result surface approval and payload fallback behavior.                       |
| `/pricing`              | Paid fix decision and checkout step.                       | Converts diagnosed merchant into focused implementation purchase.                         | ShopiFixer                | Active page with fixed $950 offer and Stripe checkout URL.                    | Store-specific diagnosis context, paid fix framing, and link back to full review.                       | Pricing page slice before expanding offer ladder or before/after proof claims.     |
| `/abando`               | Abando recovery product explanation.                       | Secondary product lane after diagnosis; frames recovery once leakage is understood.       | Abando / Revenue Recovery | Active product page.                                                          | Abando as distinct recovery engine, not a ShopiFixer audit replacement.                                 | CTA destination decision and boundary with recovery demo.                          |
| `/recovery-demo`        | Runtime proof surface for Abando recovery loop.            | Proof surface only when runtime is connected and approved.                                | Abando / Revenue Recovery | Planned surface, runtime verified, Ross visual approval UNKNOWN.              | Demo-only proof posture and runtime dependency disclosure.                                              | Recovery demo visual approval and active proof runtime status.                     |
| `/operator/dev-control` | Read-only StaffordOS operational visibility.               | Internal control surface for truth artifacts and patch safety.                            | StaffordOS operations     | Implemented as read-only visibility layer.                                    | No mutation controls, no dashboard theater, no workflow engine.                                         | Keep aligned as new commercial docs and queue entries are added.                   |

## Boundary

Future ShopiFixer Auto work must support this path:

`/shopifixer` diagnosis entry -> `/audit-result` full diagnosis -> `/pricing` paid fix decision -> mutation packet -> sandbox proof -> merchant approval.

Abando remains the revenue recovery lane after diagnosis, not a replacement for ShopiFixer audit or paid fix flow.
