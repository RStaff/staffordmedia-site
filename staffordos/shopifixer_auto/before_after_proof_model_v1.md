# Before/After Proof Model v1

Status: PROOF_ARCHITECTURE_ONLY_NOT_IMPLEMENTED

Purpose: define the evidence required before a ShopiFixer theme mutation can be trusted, reviewed, or presented. This model does not capture screenshots or execute mutations.

## Proof Types

| Proof                     | Meaning                                                                  | Required evidence                                                                                    |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Before proof              | The original state before mutation.                                      | Screenshot set, source snapshot, theme ID, duplicate theme ID, timestamp, target surface.            |
| After proof               | The sandbox state after mutation.                                        | Screenshot set using the same targets, changed-file list, mutation packet ID, timestamp.             |
| Visual diff proof         | The visible difference between before and after.                         | Diff images or structured review notes for identical surfaces and viewports.                         |
| Business hypothesis proof | The reason the change should improve conversion or clarity.              | Audit issue, hypothesis, expected impact, and acceptance criteria from the mutation packet.          |
| Rollback proof            | Evidence that the original state can be restored.                        | Original files, patch diff, rollback instructions, rollback reference, optional restored screenshot. |
| Merchant approval proof   | Evidence the merchant understands and approves the change before launch. | Merchant-facing packet, approval status, approver, approval timestamp, launch status.                |

## Safe To Present Standard

A mutation is safe to present to Ross only when:

- before proof exists
- after proof exists
- visual diff proof exists
- changed files match the mutation packet
- rollback proof exists
- prohibited operations were not used
- live theme was not touched

A mutation is safe to present to a merchant only when Ross approval is recorded.

A mutation is safe to launch only when merchant approval is recorded and rollback remains available.

## Non-Approval Rule

Screenshots, diffs, and successful QA are proof inputs. They are not approval by themselves.
