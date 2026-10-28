# Mutation Packet Standard v1

Status: FOUNDATION_ONLY_NOT_IMPLEMENTED

Purpose: define the minimum packet required before a theme-aware ShopiFixer mutation can be reviewed or executed in a sandbox.

## Standard Fields

| Field                   | Meaning                                                  |
| ----------------------- | -------------------------------------------------------- |
| merchant                | Merchant name, store domain, and approval contact.       |
| theme archetype         | Known theme family or `Unknown/custom` with evidence.    |
| issue                   | Conversion issue being addressed.                        |
| hypothesis              | Why this mutation should improve the issue.              |
| target files            | Exact files eligible for patching.                       |
| allowed mutation scope  | Specific edits permitted.                                |
| prohibited changes      | Explicit boundaries that must not be crossed.            |
| acceptance criteria     | Conditions required for the packet to pass.              |
| screenshot requirements | Before and after screenshot targets.                     |
| rollback instructions   | Exact restore path if the mutation fails or is rejected. |

## Packet Rules

- A packet is not permission to mutate a live store.
- Target files must be explicit.
- Prohibited changes must include cart, checkout, global script, and app dependency boundaries unless intentionally approved for higher-risk work.
- Acceptance criteria must include visual proof and rollback proof.
- Any missing critical field keeps the packet at audit-only status.

## Minimal Template

```text
merchant:
theme_archetype:
issue:
hypothesis:
target_files:
allowed_mutation_scope:
prohibited_changes:
acceptance_criteria:
screenshot_requirements:
rollback_instructions:
```
