# Snapshot Sandbox POC Plan v1

Status: DESIGN_ONLY_NOT_IMPLEMENTED

Purpose: define the first safe snapshot/sandbox path for Shopify theme mutation using the recovered Dawn / No Kings evidence. This plan does not execute Shopify CLI commands, connect to Shopify APIs, or mutate a store.

## Evidence Inputs

- `staffordos/shopifixer_auto/dawn_mutation_memory_v1.md`
- `staffordos/shopifixer_auto/dawn_mutation_playbook_v1.json`
- `staffordos/shopifixer_auto/theme_intelligence_registry_v1.json`
- `staffordos/shopifixer_auto/snapshot_sandbox_model_v1.md`
- `staffordos/shopifixer_auto/rollback_architecture_v1.md`

## POC Scope

Theme archetype: Dawn

Recovered source path: `/Users/rossstafford/Documents/New project`

Recovered store context: `no-kings-athletics-dev.myshopify.com`

Mutation level: `LEVEL_1_QUICK_FIX`

Allowed target zone: duplicate-theme product page only.

## Safe Workflow

1. Active theme identification
   Identify the active theme ID, name, role, and archetype. For the recovered Dawn memory, `config/settings_data.json` proves Dawn locally, but no active Shopify theme ID was recovered. This step is NOT_IMPLEMENTED.

2. Duplicate theme creation concept
   Create a duplicate of the active theme before any mutation. The duplicate theme ID and name must be recorded in `theme_snapshot_manifest_template_v1.json`. This step is NOT_IMPLEMENTED.

3. Theme pull concept
   Pull or receive the duplicate theme files into a local sandbox path. The recovered path proves a local Dawn theme existed, but no `shopify theme pull` command was recovered. This step is NOT_IMPLEMENTED.

4. Before screenshot capture
   Capture product desktop, product mobile, cart state, and any target section before mutation. Screenshots must be tied to the original theme ID and duplicate theme ID. This step is NOT_IMPLEMENTED.

5. Mutation sandbox execution
   Execute only a mutation packet against the duplicate theme sandbox. For Dawn, eligible files are limited to `templates/product.json`, `sections/main-product.liquid`, `snippets/buy-buttons.liquid`, `snippets/progress-bar.liquid`, and `assets/section-main-product.css` when explicitly listed. This step is NOT_IMPLEMENTED.

6. After screenshot capture
   Capture the same screenshot targets after the sandbox mutation. Do not accept different viewports or routes as proof. This step is NOT_IMPLEMENTED.

7. Comparison proof
   Compare before and after screenshots. Flag CTA regression, mobile layout breakage, product form drift, checkout/cart behavior changes, and brand drift. This step is NOT_IMPLEMENTED.

8. Rollback guarantee
   Preserve original theme ID, duplicate theme ID, original files, patch diff, and rollback instructions before any approval packet is created. This step is NOT_IMPLEMENTED.

9. Merchant approval gate
   Ross approval is required before merchant-facing proof. Merchant approval is required before any launch or production promotion. This step is NOT_IMPLEMENTED.

## Required Proof Packet

| Proof                       | Required |
| --------------------------- | -------- |
| Active theme ID and role    | yes      |
| Duplicate theme ID and name | yes      |
| Before screenshots          | yes      |
| Mutation packet             | yes      |
| Files changed               | yes      |
| After screenshots           | yes      |
| Visual comparison notes     | yes      |
| Rollback reference          | yes      |
| Ross approval status        | yes      |
| Merchant approval status    | yes      |

## Stop Conditions

- Theme ID is unknown.
- Duplicate theme is missing.
- Before screenshots are missing.
- Mutation packet target files are vague.
- Patch would touch cart, checkout, product form logic, global JavaScript, or production theme.
- After screenshots cannot be captured.
- Rollback reference is missing.
- Ross approval is missing before merchant-facing proof.
- Merchant approval is missing before launch.

## Outcome

This slice defines the safe sandbox path. It does not execute it.
