# Funnel To Execution Bridge v1

Status: ALIGNMENT_ONLY

Purpose: map the existing StaffordMedia conversion flow to the ShopiFixer Auto execution foundation.

## Bridge

| Funnel step          | Existing surface or artifact                                                     | Execution bridge                                                                                                                     | Gate                                                           |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Free Audit           | `/shopifixer`                                                                    | Merchant submits store/email; audit engine returns canonical payload.                                                                | No mutation. Store context required.                           |
| Audit result         | `/audit-result?store=...`                                                        | Diagnosis, score, top issue, recommended action, and storefront evidence become the commercial readout.                              | Payload parity and audit-result surface approval.              |
| Pricing              | `/pricing?store=...`                                                             | Merchant sees paid focused fix offer tied to the live diagnosis.                                                                     | Pricing page slice required before expanding offer ladder.     |
| Mutation packet      | `mutation_packet_schema_v1.json` and packet files                                | Audit finding becomes bounded instruction with allowed files, prohibited files, snapshots, rollback, approvals, and resource budget. | Packet must pass validator before execution eligibility.       |
| Snapshot/sandbox     | `snapshot_sandbox_poc_plan_v1.md` and `theme_snapshot_manifest_template_v1.json` | Duplicate-theme concept, before proof, sandbox path, and after proof are defined before mutation.                                    | No live theme mutation. Duplicate/sandbox requirement.         |
| Before/after proof   | `before_after_proof_model_v1.md` and artifact manifest                           | Screenshots, visual diff, business hypothesis, changed files, and rollback proof become trust evidence.                              | Visual QA and Ross approval before merchant proof.             |
| Merchant approval    | `merchant_approval_packet_template_v1.md`                                        | Merchant reviews what changed, why, expected outcome, rollback safety, and approval request.                                         | Merchant approval required before launch.                      |
| Deploy               | Separate future deployment process                                               | Current foundation does not deploy. Deployment readiness may only be recorded after approvals and rollback proof.                    | No autonomous deploy. Separate approved slice required.        |
| Abando/recovery path | `/abando` and `/recovery-demo`                                                   | After diagnosis/fix path, recovery product can be positioned as ongoing revenue recovery.                                            | CTA destination decision and recovery proof approval required. |

## Operational Rule

Automation must serve the existing funnel. It may validate, package, and prove work, but it must not create a disconnected execution engine or bypass the merchant-facing decision points.
