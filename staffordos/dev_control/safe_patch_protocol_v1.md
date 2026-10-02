# Safe Patch Protocol v1

Purpose: keep StaffordOS iteration calm, scoped, and revenue-focused.

## Rules

- One patch at a time.
- One surface at a time.
- Confirm the canonical repo before changing files.
- Read `surface_registry_v1.json` before editing a surface.
- Read `patch_queue_v1.json` before choosing work.
- Inspect the route owner file before editing.
- Validate after editing.
- Perform visual review before approval.
- Do not redesign during implementation patches.
- Do not touch quarantined surfaces.
- Do not blend ShopiFixer diagnosis/fix flow with Abando recovery/runtime flow.
- Do not create new surfaces unless the active patch explicitly requires it.
- Do not continue if repo or machine ownership is unclear.

## Patch Lifecycle

Use only these statuses:

- PLANNED
- ACTIVE
- BLOCKED
- APPROVED
- QUARANTINED
- DONE

Move only one patch to ACTIVE at a time.

## Minimum Completion Standard

A patch is not DONE until:

- the target surface was inspected before edit
- the implementation stayed inside the target surface
- required validation passed or the failure is documented
- visual review is complete when required
- no quarantined surface was touched
- canonical topology remains clear
