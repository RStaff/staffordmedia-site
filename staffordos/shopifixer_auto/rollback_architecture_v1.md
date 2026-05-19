# Rollback Architecture v1

Status: FOUNDATION_ONLY_NOT_IMPLEMENTED

Purpose: define rollback evidence and language for merchant-safe ShopiFixer theme mutation.

## Required Rollback Assets

| Asset                  | Requirement                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| theme backup           | Original theme or duplicate theme must remain available before patching.          |
| patch diff             | Every mutation must have an inspectable diff.                                     |
| original snapshot      | Before screenshots and source file copies must be captured.                       |
| rollback decision      | Clear condition for reverting or rejecting the patch.                             |
| rollback proof         | Screenshot or file proof that original state was restored.                        |
| merchant-safe language | Plain explanation of what changed, what was restored, and what remains untouched. |

## Rollback Decision

Rollback is required when:

- CTA clarity gets worse.
- Mobile layout breaks.
- Brand presentation drifts from approved direction.
- Product form, cart, checkout, or app behavior is altered outside scope.
- Merchant rejects the preview.
- Visual diff shows an unexplained regression.

## Merchant-Safe Language

Use calm, direct language:

"We tested this in a preview copy. The change did not meet the approval standard, so it was reverted in the preview. Your live store was not changed."

Do not overstate automation, certainty, or revenue impact.
