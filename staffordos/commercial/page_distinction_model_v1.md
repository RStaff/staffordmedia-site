# Page Distinction Model v1

Status: ALIGNMENT_ONLY

Purpose: clarify what each commercial surface is responsible for so future automation does not blur the funnel.

## Distinctions

| Surface              | Role                                                                                                            | Must not become                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Email summary        | Trust bridge. It should carry the same canonical audit payload into a concise merchant-facing summary.          | A separate diagnosis source or a replacement for the full audit result page.                    |
| Audit result         | Diagnosis. It explains score, top issue, recommended action, confidence, storefront proof, and the next step.   | Pricing checkout, redesign proof, or Abando product page.                                       |
| Pricing              | Decision/payment. It frames the paid focused fix tied to the store diagnosis.                                   | A broad service catalog or automation promise.                                                  |
| Before/after proof   | Transformation evidence. It proves what changed in sandbox, why it changed, visual impact, and rollback safety. | Approval by itself, a dashboard, or a live deployment signal.                                   |
| Abando page          | Recovery product. It explains the revenue recovery engine after the merchant understands leakage.               | ShopiFixer audit entry, pricing page, or before/after proof surface.                            |
| Recovery demo        | Proof surface only if runtime is connected and approved. It can show recovery loop evidence.                    | A general CTA destination, a ShopiFixer onboarding page, or proof when runtime is disconnected. |
| Operator dev-control | Internal read-only truth surface. It reduces operational drift.                                                 | Merchant-facing dashboard, task manager, or execution console.                                  |

## Guardrail

If a future slice cannot name which page role it supports, it should remain PLANNED until the commercial boundary is explicit.
