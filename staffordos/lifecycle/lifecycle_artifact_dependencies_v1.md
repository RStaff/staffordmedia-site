# Lifecycle Artifact Dependencies v1

Status: DEPENDENCY_MAP_ONLY

Purpose: map the artifacts required before a merchant lifecycle state may advance.

## Required Artifacts

| Artifact          | Required before states                                                           | Source or template                                                                          | Blocks when missing                                      |
| ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Audit             | AUDIT_GENERATED, QUALIFIED, QUICK_FIX_CANDIDATE, GUIDED_TRANSFORMATION_CANDIDATE | ShopiFixer audit payload and `/audit-result` canonical readout                              | Qualification, pricing handoff, mutation packet creation |
| Snapshot          | SNAPSHOT_READY, MUTATION_PACKET_READY, QA_PENDING                                | `theme_snapshot_manifest_template_v1.json`, before screenshots, sandbox/duplicate reference | Sandbox mutation, visual proof, deployment readiness     |
| Mutation packet   | MUTATION_PACKET_READY, VALIDATION_PENDING                                        | `mutation_packet_schema_v1.json` and candidate packet                                       | Validator execution, Codex sandbox eligibility, QA       |
| Validation        | QA_PENDING                                                                       | `validate_mutation_packet_v1.mjs` output JSON                                               | Sandbox execution eligibility and QA transition          |
| QA proof          | PROOF_READY, ROSS_APPROVAL_PENDING                                               | `before_after_artifact_manifest_v1.json`, visual diff risk, changed files, QA status        | Ross approval, merchant proof, deployment readiness      |
| Merchant approval | DEPLOYMENT_READY, DEPLOYED, ABANDO_ACTIVE                                        | Merchant approval packet and explicit merchant decision                                     | Deployment, Abando onboarding                            |
| Rollback proof    | DEPLOYMENT_READY, ROLLBACK_AVAILABLE, MONITORING                                 | Rollback plan, original snapshot, patch diff, rollback proof                                | Deployment readiness, failure recovery, safe monitoring  |

## Advancement Rule

If the required artifact is missing, the merchant remains in the current state or moves to an approval/escalation state. Missing artifacts must not be inferred from adjacent artifacts.
