# Ross Visual Approval Session v1

Date: 2026-05-19

Purpose: bind Ross manual visual approval state into StaffordOS dev_control before any operational patch proceeds.

## How To Use This Session

1. Review each runtime URL manually.
2. Set each surface status to one allowed value.
3. Record any concern or approved direction in plain language.
4. Only move a dependent patch forward when every required approval is `APPROVED` or `APPROVED_WITH_MODIFICATIONS`.

## Current Operational State

Status: `BLOCKED`

Reason: all reviewed surfaces are currently `UNKNOWN`.

Next safe action: Ross reviews `/`, `/shopifixer`, and `/recovery-demo`, then records approval status and any bounds.

No operational patch is safe to activate from the current state.

## Decision Rules

- `UNKNOWN` = no patching.
- `APPROVED` = patching allowed for dependent patches.
- `APPROVED_WITH_MODIFICATIONS` = patching allowed only within the stated bounds.
- `NEEDS_REVIEW` = no patching until Ross makes a final approval decision.
- `REJECTED` = quarantine or redesign required.

Allowed approval statuses:

- APPROVED
- APPROVED_WITH_MODIFICATIONS
- NEEDS_REVIEW
- REJECTED
- UNKNOWN

Activation rule: no patch may move to `ACTIVE` unless every required visual approval dependency is `APPROVED` or `APPROVED_WITH_MODIFICATIONS` in `surface_registry_v1.json` and this session record.

## Which Control Layer Owns This Approval?

| Approval type                  | Owning control layer                                      | Notes                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage approval              | StaffordOS Dev Control                                    | Applies to `/`, public route hierarchy, and StaffordMedia visual truth.                                                                                       |
| ShopiFixer surface approval    | StaffordOS Dev Control                                    | Applies to `/shopifixer` as a public StaffordMedia route.                                                                                                     |
| ShopiFixer mutation approval   | ShopiFixer Internal Dev Control                           | Applies to merchant transformation packets, local sandbox proof, rollback evidence, and merchant approval packets; StaffordOS still governs activation gates. |
| Abando recovery proof approval | Abando Recovery Control                                   | Applies to recovery proof readiness, recovery message proof, and recovery product behavior. StaffordOS governs public route or CTA changes.                   |
| Recovery demo visual approval  | StaffordOS Dev Control with Abando Recovery Control input | Applies to `/recovery-demo` as a StaffordMedia-hosted proof surface that depends on Abando recovery readiness.                                                |

## Approval Matrix

| Surface          | Status  | Safe? | Runtime URL                           | Route owner                      |
| ---------------- | ------- | ----- | ------------------------------------- | -------------------------------- |
| `/`              | UNKNOWN | No    | `http://localhost:3000/`              | `src/app/page.tsx`               |
| `/shopifixer`    | UNKNOWN | No    | `http://localhost:3000/shopifixer`    | `src/app/shopifixer/page.tsx`    |
| `/recovery-demo` | UNKNOWN | No    | `http://localhost:3000/recovery-demo` | `src/app/recovery-demo/page.tsx` |

## Approval Notes

| Surface          | Ross concerns | Approved direction | Blocked patches                                                              |
| ---------------- | ------------- | ------------------ | ---------------------------------------------------------------------------- |
| `/`              | UNKNOWN       | UNKNOWN            | `PATCH-BEFORE-AFTER-EMBODIMENT`, `PATCH-HOMEPAGE-UNCOMMITTED-CHANGES-REVIEW` |
| `/shopifixer`    | UNKNOWN       | UNKNOWN            | `PATCH-BEFORE-AFTER-EMBODIMENT`                                              |
| `/recovery-demo` | UNKNOWN       | UNKNOWN            | `PATCH-ABANDO-CTA-ALIGNMENT`, `PATCH-RECOVERY-DEMO-POLISH`                   |

## Dependency Mapping

| Approval key                  | Surface          | Current status | Gates patches                                                                |
| ----------------------------- | ---------------- | -------------- | ---------------------------------------------------------------------------- |
| HOMEPAGE-HIERARCHY-LOCK       | `/`              | UNKNOWN        | `PATCH-BEFORE-AFTER-EMBODIMENT`, `PATCH-HOMEPAGE-UNCOMMITTED-CHANGES-REVIEW` |
| SHOPIFIXER-SURFACE-APPROVAL   | `/shopifixer`    | UNKNOWN        | `PATCH-BEFORE-AFTER-EMBODIMENT`                                              |
| RECOVERY-DEMO-VISUAL-APPROVAL | `/recovery-demo` | UNKNOWN        | `PATCH-ABANDO-CTA-ALIGNMENT`, `PATCH-RECOVERY-DEMO-POLISH`                   |

## Patch Gate

| Patch                                     | Depends on                                           | ACTIVE allowed?              |
| ----------------------------------------- | ---------------------------------------------------- | ---------------------------- |
| PATCH-ABANDO-CTA-ALIGNMENT                | RECOVERY-DEMO-VISUAL-APPROVAL                        | No; dependency is UNKNOWN    |
| PATCH-BEFORE-AFTER-EMBODIMENT             | SHOPIFIXER-SURFACE-APPROVAL, HOMEPAGE-HIERARCHY-LOCK | No; dependencies are UNKNOWN |
| PATCH-RECOVERY-DEMO-POLISH                | RECOVERY-DEMO-VISUAL-APPROVAL                        | No; dependency is UNKNOWN    |
| PATCH-HOMEPAGE-UNCOMMITTED-CHANGES-REVIEW | HOMEPAGE-HIERARCHY-LOCK                              | No; dependency is UNKNOWN    |

## Next Safe Action

Do not patch.

Ross should review the three runtime URLs and update only the status, concerns, and approved direction fields. If any status becomes `APPROVED_WITH_MODIFICATIONS`, write the bounds before any dependent patch moves forward.

## Final Approval Matrix

| Surface          | Status  | Safe To Patch? | Notes                                                                    |
| ---------------- | ------- | -------------- | ------------------------------------------------------------------------ |
| `/`              | UNKNOWN | No             | Awaiting Ross manual visual approval. Unknown approvals remain blocking. |
| `/shopifixer`    | UNKNOWN | No             | Awaiting Ross manual visual approval. Unknown approvals remain blocking. |
| `/recovery-demo` | UNKNOWN | No             | Awaiting Ross manual visual approval. Unknown approvals remain blocking. |

Ross visual approval is now a first-class operational dependency in StaffordOS.
