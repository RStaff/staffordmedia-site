# Dawn Mutation Memory v1

Date: 2026-05-19

Status: RECOVERED_EVIDENCE_ONLY

Purpose: preserve the recoverable Dawn / No Kings mutation history as evidence for the first theme-aware ShopiFixer mutation playbook. This document does not authorize live Shopify edits.

## Recovered Source

| Field                | Evidence                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Local theme root     | `/Users/rossstafford/Documents/New project`                                                           |
| Theme archetype      | Dawn                                                                                                  |
| Theme evidence       | `config/settings_data.json` has `"current": "Dawn"`                                                   |
| Store context        | Shell history references `no-kings-athletics-dev.myshopify.com` and No Kings Shopify app/admin URLs   |
| Shopify CLI evidence | Shell history shows `cd "/Users/rossstafford/Documents/New project"` followed by `shopify theme push` |
| Git state            | Local theme root has no commits; files are untracked, so no reliable git diff exists                  |

## Shopify CLI Commands Recovered

| Command               | Evidence status              | Notes                                                                                                        |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `shopify app dev`     | recovered from shell history | Used in nearby No Kings app/dev-store work. Not a theme mutation command.                                    |
| `shopify theme push`  | recovered from shell history | Run from `/Users/rossstafford/Documents/New project`. This is the strongest evidence of a theme upload path. |
| `shopify theme pull`  | not recovered                | A full Dawn theme exists locally, but no matching shell-history command was recovered.                       |
| `shopify theme check` | not recovered                | No evidence found that theme-check was run.                                                                  |

## Theme Files Identified

| File                              | Role                                     | Evidence                                                                                                               |
| --------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `config/settings_data.json`       | Theme settings and Dawn identity         | Contains `"current": "Dawn"`                                                                                           |
| `templates/product.json`          | Product page block order and settings    | Uses `main-product`; includes vendor, title, price, variant picker, quantity selector, buy buttons, description, share |
| `sections/main-product.liquid`    | Product page section renderer            | Renders product title, price, variant picker, quantity selector, and buy buttons                                       |
| `snippets/buy-buttons.liquid`     | Add-to-cart and dynamic checkout buttons | Preserves product form and `form                                                                                       | payment_button` when dynamic checkout is enabled |
| `snippets/progress-bar.liquid`    | Recovered mutation artifact              | Defines a hidden progress bar container                                                                                |
| `assets/section-main-product.css` | Product-page styling surface             | Contains product info and form layout styles                                                                           |

## Visual Change Recovered

The clearest recovered mutation artifact is `snippets/progress-bar.liquid`, which adds a hidden progress bar container:

```liquid
<div class="progress-bar-container hidden">
  <div class="progress-bar">
    <div class="progress-bar-value"></div>
  </div>
</div>
```

This appears aligned with earlier ShopiFixer/Abando progress UI experiments in shell history. No reliable evidence was found that the snippet was rendered into `sections/main-product.liquid` or activated by theme JavaScript.

## Validation Recovered

| Validation             | Evidence status | Notes                                                                                                                                    |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Shopify CLI upload     | recovered       | `shopify theme push` was run from the local Dawn theme root.                                                                             |
| Theme static check     | not recovered   | No `shopify theme check` evidence found.                                                                                                 |
| Visual screenshot diff | not recovered   | No before/after screenshots tied to this theme mutation were found.                                                                      |
| Browser QA             | not recovered   | `test-results/.last-run.json` exists but records a failed run without failed test detail; it is not enough to treat visual QA as proven. |

## Friction / Failure Points

- The theme root has no git commits, so file-level mutation history cannot be reconstructed from git.
- Shell history proves a `shopify theme push`, but does not identify a theme ID, target role, or whether the push went to a duplicate theme.
- The recovered progress-bar snippet is not enough evidence that the visual change reached a live or preview surface.
- Nearby app work used broad Shopify scopes including `write_themes`; that increases mutation risk and reinforces the need for duplicate-theme workflow.
- No recovered rollback proof exists.

## Operational Lesson

The first safe Dawn playbook should treat product-page mutations as `LEVEL_1_QUICK_FIX` only when they are scoped to a duplicate theme, exact files are listed, screenshots are captured before and after, and rollback proof exists.

Do not promote this memory into live-store automation.
