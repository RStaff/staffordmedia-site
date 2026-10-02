# Operator Visibility Model v1

Status: VISIBILITY_MODEL_ONLY_NOT_IMPLEMENTED

Purpose: define what StaffordOS should eventually show about merchant lifecycle state. This does not create UI, dashboards, APIs, databases, or automation.

## Future Visibility Surfaces

| View                      | Purpose                                                                                | Required source truth                                                          | Current status  |
| ------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------- |
| Merchant state board      | Show each merchant's current lifecycle state and owner.                                | Merchant state manifests.                                                      | NOT_IMPLEMENTED |
| Blocked merchants         | Show merchants blocked by missing artifact, approval, access, rollback, or validation. | Lifecycle manifest escalation status and patch queue gates.                    | NOT_IMPLEMENTED |
| Approvals pending         | Show Ross and merchant decisions needed before advancement.                            | Approval fields in merchant state manifest and Ross visual approval artifacts. | NOT_IMPLEMENTED |
| Rollback-ready states     | Show which merchants have rollback proof available.                                    | Rollback reference and proof fields.                                           | NOT_IMPLEMENTED |
| Deployment readiness      | Show merchants that are ready for a separate deployment process.                       | Deployment status, merchant approval, Ross approval, rollback proof.           | NOT_IMPLEMENTED |
| High-risk transformations | Show guided/high-risk work requiring operator attention.                               | Mutation depth, visual diff risk, resource gate, escalation status.            | NOT_IMPLEMENTED |

## Visibility Boundaries

- Visibility is read-only until a separate mutation-control slice exists.
- Operator views must not execute patches, workers, Shopify commands, or deployments.
- Merchant state must come from lifecycle manifests and approved truth artifacts.
- A visual green state must not imply permission to deploy.
