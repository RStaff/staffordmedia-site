# Snapshot Sandbox Model v1

Status: FOUNDATION_ONLY_NOT_IMPLEMENTED

Purpose: define the required safety envelope before any ShopiFixer theme mutation can become executable.

## Sequence

1. Before snapshot
   Capture public storefront screenshots and relevant source files before any patch.

2. Theme duplicate
   Create or receive a duplicate theme. Never patch the live production theme directly.

3. Sandbox preview
   Apply candidate changes only to the duplicate theme or local sandbox preview.

4. Patch execution
   Execute a scoped patch from a mutation packet. Do not exceed the allowed mutation scope.

5. After snapshot
   Capture the same screenshot targets after the patch.

6. Visual diff
   Compare before and after screenshots. Flag layout breaks, CTA regressions, brand drift, and mobile issues.

7. Merchant approval
   Present the preview, diff, and plain-language change summary. Production promotion requires explicit merchant approval.

8. Rollback path
   Preserve the original duplicate, original files, patch diff, and rollback instructions before any promotion.

## Non-Negotiables

- No live-store mutation.
- No patch without before snapshot.
- No patch without rollback path.
- No production promotion from StaffordOS automation.
- Unknown/custom themes remain audit-only until inspected.
