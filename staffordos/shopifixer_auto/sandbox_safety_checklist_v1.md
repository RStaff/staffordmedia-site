# Sandbox Safety Checklist v1

Status: CHECKLIST_ONLY_NOT_IMPLEMENTED

Purpose: minimum safety checklist before any Shopify theme mutation can move beyond planning.

## Checklist

- Never patch live theme first.
- Duplicate before mutate.
- Preserve original theme ID.
- Capture before proof.
- Constrain mutation scope.
- Capture after proof.
- Rollback path required.
- Ross approval required before merchant-facing proof.
- Merchant approval required before launch.

## Dawn / No Kings Application

- Use Dawn file targets from `dawn_mutation_playbook_v1.json`.
- Treat `snippets/progress-bar.liquid` as recovered evidence, not proof of a safe active mutation.
- Keep product form behavior, cart behavior, checkout behavior, and global JavaScript out of scope.
- Stop if no duplicate theme ID is available.

## Approval Rule

Passing screenshots or checks does not equal approval. Approval must be explicitly recorded.
