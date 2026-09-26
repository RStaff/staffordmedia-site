# Operator Escalation Model v1

Status: ARCHITECTURE_ONLY_NOT_IMPLEMENTED

Purpose: define when future ShopiFixer Auto orchestration may route work automatically and when human approval is required.

## Auto-Route Eligible

StaffordOS may later auto-route artifacts between queues only when:

- The merchant, store domain, and artifact IDs are explicit.
- The current step is read-only or documentation-only.
- The next queue does not require live Shopify access.
- The mutation depth does not increase.
- Required input artifacts are present and valid.
- No approval state is UNKNOWN, NEEDS_REVIEW, or REJECTED for the required gate.

## Ross Approval Required

Ross approval is required when:

- A mutation packet moves toward sandbox execution.
- Theme classification confidence is low or Unknown/custom.
- The requested work exceeds QUICK_FIX scope.
- Visual diff risk is MEDIUM_RISK_DIFF or HIGH_RISK_DIFF.
- Proof is incomplete but a merchant-facing packet is requested.
- Resource budget or allowed files need to expand.
- Rollback evidence is ambiguous.

## Merchant Approval Required

Merchant approval is required when:

- A sandbox preview is ready for launch consideration.
- The change affects product page hierarchy, CTA prominence, cart path, checkout-adjacent behavior, navigation, pricing presentation, or brand presentation.
- A GUIDED_TRANSFORMATION or HIGH_RISK_REDESIGN is proposed.
- Any deployment or production promotion is considered.

## Rollback Escalation Triggers

Rollback escalation is triggered when:

- Visual QA fails.
- A high-risk diff appears.
- The merchant rejects the preview.
- A changed file falls outside allowed scope.
- Product form, cart, checkout, or app behavior changes unexpectedly.
- Rollback proof cannot be produced.

## Mutation Depth Escalation

Mutation depth must escalate when:

- A QUICK_FIX needs multiple surfaces or broad template changes.
- A GUIDED_TRANSFORMATION touches checkout-adjacent behavior or app integrations.
- Brand, navigation, PDP structure, or purchase behavior changes exceed the original packet.
- The business hypothesis changes during execution.

Escalation pauses work. It does not authorize execution.
