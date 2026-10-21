# Operator Surface Map v1

Status: OPERATOR_NAVIGATION_MAP

Purpose: document StaffordOS operator surfaces, ownership boundaries, planned surfaces, and mutation authority. This document does not create execution authority.

## Current Operator Surfaces

| Surface                  | Route                   | Owner                  | Read-only? | Purpose                                                                                       |
| ------------------------ | ----------------------- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| StaffordOS Operator Home | `/operator`             | StaffordOS Dev Control | Yes        | Operator orientation, architecture boundary, and navigation entry.                            |
| Dev Control              | `/operator/dev-control` | StaffordOS Dev Control | Yes        | Surface registry, patch queue, runtime binding, worktree classification, and safe actions.    |
| Runtime Ops              | `/operator/runtime-ops` | StaffordOS Dev Control | Yes        | Runtime state board, event feed, approval visibility, patch overview, and control boundaries. |

## Planned Operator Surfaces

| Surface                 | Status                  | Expected owner                                         | Mutation authority                                       |
| ----------------------- | ----------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Merchant Lifecycle      | PLANNED                 | StaffordOS Dev Control                                 | Read-only until separate approval.                       |
| Patch Queue             | INCLUDED in Dev Control | StaffordOS Dev Control                                 | Future mutation controls require explicit Ross approval. |
| Visual QA               | PLANNED                 | ShopiFixer Internal Dev Control governed by StaffordOS | No mutation authority by default.                        |
| ShopiFixer Fulfillment  | PLANNED                 | ShopiFixer Internal Dev Control governed by StaffordOS | Future sandbox controls require explicit approval.       |
| Abando Recovery Control | PLANNED                 | Abando Recovery Control governed by StaffordOS         | Future recovery controls require explicit approval.      |
| Runtime Registry        | INCLUDED in Runtime Ops | StaffordOS Dev Control                                 | Read-only.                                               |
| Event Ledger            | INCLUDED in Runtime Ops | StaffordOS Dev Control                                 | Read-only.                                               |

## Ownership Boundaries

- StaffordOS governs operator navigation, patch gates, runtime truth, lifecycle state, and control boundaries.
- ShopiFixer governs merchant transformation artifacts and fulfillment proof.
- Abando governs recovery proof and recovery product readiness.
- StaffordMedia.ai public pages remain outside operator mutation authority.

## Future Mutation Surfaces

Any future surface that mutates state must be created in a separate approved slice, must identify the owning control layer, and must record approval, rollback, and event causality before execution.

## Explicit Ross Approval Required

Ross approval is required before:

- adding mutation controls
- adding deployment controls
- allowing runtime state writes from UI
- launching workers or event consumers
- exposing merchant-facing proof controls
- changing public StaffordMedia, ShopiFixer, or Abando routes

Final rule: operator navigation improves cognition only. It does not create autonomous execution authority.
