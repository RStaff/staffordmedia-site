# Visual QA Rules v1

Status: RULES_ONLY_NOT_IMPLEMENTED

Purpose: define visual proof rules for before/after ShopiFixer theme mutation review.

## Screenshot Consistency Rules

- Before and after screenshots must use the same URL or preview URL target.
- Before and after screenshots must use the same viewport size.
- Before and after screenshots must capture the same surface state.
- Dynamic content differences must be noted.
- Any missing matching screenshot blocks proof approval.

## Viewport Requirements

- Desktop product view is required for product-page mutations.
- Mobile product view is required for product-page mutations.
- Cart drawer or cart page is required only when the packet touches cart-adjacent surfaces.
- Collection view is required only when the packet touches collection surfaces.

## Mobile/Desktop Capture Requirements

- Mobile width must represent a real phone viewport.
- Desktop width must represent a common merchant review viewport.
- Header, CTA area, product form, and changed area must be visible when relevant.
- Screenshots must not crop out the changed area.

## Prohibited Screenshot Manipulation

- Do not edit screenshots to hide defects.
- Do not crop away layout regressions.
- Do not blur or obscure changed UI.
- Do not compare different products, themes, routes, or viewport states.
- Do not use mockups as proof unless clearly labeled as mockups.

## Diff Tolerance Guidance

- Minor spacing changes can be low risk when intentional and scoped.
- CTA hierarchy changes require manual review even when visually small.
- Navigation movement is medium or high risk depending on scope.
- Product form movement requires high scrutiny.
- Cart, checkout, payment, or dynamic checkout changes are high risk and normally prohibited.

## Required Proof Surfaces

At minimum, a proof set must include:

- target page before screenshot
- target page after screenshot
- desktop comparison
- mobile comparison
- changed-file list
- rollback reference

## Mutation Visibility Requirements

- The changed area must be visible in at least one before/after pair.
- If a mutation is not visible, the packet must explain why it matters.
- Invisible technical changes cannot be sold as visual proof.
- Visual proof must match the business hypothesis.
