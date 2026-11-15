# Control Boundary Model v1

Status: BOUNDARY_CLARIFICATION_ONLY

Purpose: prevent StaffordOS, ShopiFixer, and Abando controls from blending together. This document does not create runtime systems, UI, routes, agents, automation, Shopify access, or deployments.

## Control Layers

| Control layer                   | What it controls                                                                                                                                                                                                       | What it must not control                                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| StaffordOS Dev Control          | Repo truth, surface registry, patch queue, runtime binding, worktree classification, lifecycle state rules, visual approval gates, and operating boundaries.                                                           | Merchant theme mutation details, Abando recovery runtime internals, merchant-facing dashboards, live Shopify execution, or autonomous deployment.                        |
| ShopiFixer Internal Dev Control | Merchant transformation fulfillment: audit-to-packet mapping, theme intelligence, mutation packets, local sandbox snapshots, before/after proof, validation runners, rollback evidence, and merchant approval packets. | StaffordMedia public route ownership, homepage approval, Abando recovery product behavior, live Shopify mutation, deployment approval, or bypassing StaffordOS gates.    |
| Abando Recovery Control         | Revenue recovery product behavior: recovery proof, recovery messages, return links, delivery/readiness proof, recovery attribution, and Abando onboarding state.                                                       | ShopiFixer theme mutation, StaffordMedia homepage or pricing changes, ShopiFixer audit diagnosis, local theme sandbox execution, or replacing StaffordOS approval gates. |

## Overlap Areas

| Overlap                                                            | Layers involved                                                                  | Resolution                                                                                                                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public StaffordMedia surfaces mention ShopiFixer or Abando.        | StaffordOS Dev Control, ShopiFixer Internal Dev Control, Abando Recovery Control | StaffordOS owns route/surface approval. Product-specific control layers may provide requirements, but may not patch public surfaces without StaffordOS approval. |
| ShopiFixer before/after proof becomes merchant-facing.             | StaffordOS Dev Control, ShopiFixer Internal Dev Control                          | ShopiFixer owns proof artifacts. StaffordOS owns approval gates and public-surface safety. Ross approval is required before merchant-facing proof.               |
| Abando CTA destination from a StaffordMedia surface.               | StaffordOS Dev Control, Abando Recovery Control                                  | StaffordOS owns CTA/surface patch permission. Abando owns recovery destination readiness. Unknown recovery approval blocks patching.                             |
| Merchant lifecycle reaches Abando candidacy after ShopiFixer work. | ShopiFixer Internal Dev Control, Abando Recovery Control, StaffordOS Dev Control | Lifecycle state records the handoff. Abando activation requires merchant approval and Abando control readiness; StaffordOS preserves operating boundaries.       |
| Local sandbox runner creates proof for fulfillment.                | ShopiFixer Internal Dev Control, StaffordOS Dev Control                          | Runner belongs to ShopiFixer Internal Dev Control. Execution permission and patch activation are governed by StaffordOS Dev Control.                             |

## Resolution Rules

- StaffordOS governs the operating system and the permission boundary.
- ShopiFixer governs merchant transformation artifacts and fulfillment proof.
- Abando governs recovery runtime/product behavior.
- If a change touches public StaffordMedia routes, StaffordOS Dev Control owns the approval gate.
- If a change touches local theme mutation artifacts, ShopiFixer Internal Dev Control owns the fulfillment rules.
- If a change touches recovery messages, return links, recovery proof, or recovery onboarding, Abando Recovery Control owns the product rules.
- When ownership is ambiguous, the change remains blocked until the owning layer and approval path are recorded.
