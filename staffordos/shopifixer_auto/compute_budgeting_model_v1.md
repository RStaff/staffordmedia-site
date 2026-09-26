# Compute Budgeting Model v1

Status: ARCHITECTURE_ONLY_NOT_IMPLEMENTED

Purpose: define resource budgeting expectations for future ShopiFixer Auto orchestration. This document does not create queues, workers, scaling infrastructure, or execution.

## Cost Bands

| Work type             | Expected resource usage                                                                                  | Budget posture                                   | Stop condition                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Lightweight audit     | Low. Storefront review, provided screenshots, static signals, and concise issue summary.                 | Keep cheap and fast. No mutation.                | Evidence is missing, store context is unclear, or issue cannot be bounded.         |
| Quick fix             | Low to medium. One focused mutation packet, exact files, desktop/mobile before and after proof, QA pass. | Time-boxed and file-limited.                     | More files, more surfaces, or unclear rollback moves the work out of QUICK_FIX.    |
| Guided transformation | Medium to high. Multi-file sandbox work, broader visual QA, approval packet, rollback proof.             | Human-reviewed and single-threaded per merchant. | Diff risk rises, mutation touches purchase behavior, or approval state is missing. |
| High-risk redesign    | High. Planning and review only unless separately authorized.                                             | Not autonomous. Treat as proposal work.          | Any request to execute without written approvals and rollback test.                |

## Screenshot Cost Considerations

- Desktop and mobile proof should use matching routes, states, and viewport definitions.
- Screenshot volume increases storage, review time, and diff noise.
- Proof targets should be limited to surfaces needed for merchant trust and safety.
- Re-capture is allowed only when the original proof set is invalid or incomplete.

## Codex Budget Considerations

- Codex budget must be attached to the mutation packet.
- Budget should include max files, max mutation depth, time box, and allowed operations.
- Exceeding budget blocks execution and requires packet revision or Ross approval.
- Codex must stop on missing context rather than spending budget guessing.

## Concurrency Constraints

- One active mutation packet per merchant unless Ross explicitly approves sequencing.
- No parallel writes to the same theme sandbox.
- Audit work may queue broadly, but mutation work is gated by approval and rollback proof.
- Visual QA and approval packet generation must wait for complete before/after artifacts.

## Future Scaling Considerations

- Kubernetes, managed queues, CI/CD, and distributed workers are NOT_IMPLEMENTED.
- Future scaling must preserve merchant isolation, approval gates, rollback proof, and deterministic artifacts.
- Scaling is not allowed to bypass resource gates.
