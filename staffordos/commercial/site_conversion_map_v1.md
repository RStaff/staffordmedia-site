# Site Conversion Map v1

Status: ALIGNMENT_ONLY

Purpose: map the existing StaffordMedia.ai routes to the current ShopiFixer and Abando commercial flow. This document does not authorize UI, route, CTA, pricing, or automation changes.

## Current Route Map

| Route                   | Purpose                                                    | Current role in funnel                                                                    | Product lane              | Current maturity                                                              | What should remain unchanged                                                                            | What needs review                                                                  |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                     | StaffordMedia decision layer and product boundary surface. | Directs merchants toward diagnosis/fix or recovery proof without blending products.       | StaffordMedia umbrella    | Approved in registry, Ross visual approval for this session remains UNKNOWN.  | Existing page hierarchy, product distinction, and approved visual direction.                            | Homepage visual approval lock before any new before/after conversion surface work. |
| `/shopifixer`           | ShopiFixer audit entry and store/email submission surface. | Starts free audit flow and redirects completed audit submissions to `/shopifixer/result`. | ShopiFixer                | Approved canonical surface, runtime verification currently false in registry. | Audit entry role, canonical StaffordMedia ownership, and separation from Abando install/recovery flows. | Ross visual approval and audit engine dependency behavior.                         |
| `/audit-result`         | Full ShopiFixer diagnosis from canonical payload.          | Converts audit evidence into issue clarity and moves merchant toward `/pricing`.          | ShopiFixer                | Active planned surface tied to live audit payload.                            | Canonical payload parity, diagnosis language, store-specific result path, and pricing handoff.          | Audit-result surface approval and payload fallback behavior.                       |
| `/pricing`              | Paid fix decision and checkout step.                       | Converts diagnosed merchant into focused implementation purchase.                         | ShopiFixer                | Active page with fixed $950 offer and Stripe checkout URL.                    | Store-specific diagnosis context, paid fix framing, and link back to full review.                       | Pricing page slice before expanding offer ladder or before/after proof claims.     |
| `/abando`               | Abando recovery product explanation.                       | Secondary product lane after diagnosis; frames recovery once leakage is understood.       | Abando / Revenue Recovery | Active product page.                                                          | Abando as distinct recovery engine, not a ShopiFixer audit replacement.                                 | CTA destination decision and boundary with recovery demo.                          |
| `/recovery-demo`        | Runtime proof surface for Abando recovery loop.            | Proof surface only when runtime is connected and approved.                                | Abando / Revenue Recovery | Planned surface, runtime verified, Ross visual approval UNKNOWN.              | Demo-only proof posture and runtime dependency disclosure.                                              | Recovery demo visual approval and active proof runtime status.                     |
| `/operator/dev-control` | Read-only StaffordOS operational visibility.               | Internal control surface for truth artifacts and patch safety.                            | StaffordOS operations     | Implemented as read-only visibility layer.                                    | No mutation controls, no dashboard theater, no workflow engine.                                         | Keep aligned as new commercial docs and queue entries are added.                   |

## Boundary

Future ShopiFixer Auto work must support this path:

`/shopifixer` diagnosis entry -> `/audit-result` full diagnosis -> `/pricing` paid fix decision -> mutation packet -> sandbox proof -> merchant approval.

Abando remains the revenue recovery lane after diagnosis, not a replacement for ShopiFixer audit or paid fix flow.

## Blueprint pre-purchase clarity acceptance — 2026-11-14

This evidence is additive and does not change the ShopiFixer or Abando route
contracts above. The Stafford Media `/automate` route is the pre-purchase entry
for the separate $750 Automation Opportunity Blueprint.

Status: **IMPLEMENTED AND VERIFIED LOCALLY; OWNER VISUAL REVIEW COMPLETE; RELEASE AUTHORIZATION PENDING**

- Baseline: Stafford Media launch revision
  `0a7d7c51228f7075f4bc404f0a3ab6c3c4c06e28` in isolated worktree
  `/Users/rossstafford/projects/staffordmedia-blueprint-prepurchase-20261114`.
- Scope: plain-language intake copy, compact spacing, fictional examples for
  current and optional desired workflow descriptions, one primary intake
  action, practical value for each of the existing six deliverables, and an
  explicit bridge from the illustrative free result to the paid assessment and
  plan.
- Final wording correction: the result is headed `A suggested starting point`.
  A workflow synthesized from category selections is labeled
  `Example current workflow based on your selections.`; only prospect-supplied
  current-workflow text receives `Current, as described`. Business-specific
  authority sentences use grammatical singular/plural agreement, including
  `The responsible professional retains authority`.
- Preserved contract: fixed $750 one-time offer, six deliverables, delivery
  within five business days after the interview and receipt of required
  information, full fee credit toward an approved Stafford Media
  implementation, stated exclusions, separately scoped optional
  implementation, fixed checkout authority, analytics consent, and existing
  recommendation behavior.
- Focused automated evidence on the isolated source worktree: 78
  intake/result/offer/analytics/checkout tests passed; TypeScript passed; and
  `git diff --check` passed.
- Release-target reconciliation: the isolated worktree remains detached at its
  accepted baseline `0a7d7c51228f7075f4bc404f0a3ab6c3c4c06e28`. Read-only
  remote evidence on 2026-11-14 identifies `launch/website` at
  `81fa400e2ce27f44974e5ff816e74b9fec7b9982`, seven commits newer. Those commits
  update GA4 bootstrap and the supported runtime/dependencies; they do not
  modify the Blueprint intake/result/offer files changed by this slice. The
  complete uncommitted slice applies cleanly to `81fa400`.
- Current-target verification: in a disposable worktree at `81fa400`, using its
  declared Node 24.22.1, locked Next.js 15.5.28 dependencies, and Production
  payment environment, all 78 focused tests passed, TypeScript passed, the
  production build passed, and `git diff --check` passed. The build retained the
  approved live Payment Link and excluded the Preview link from the prerendered
  `/automate` page. The two pre-existing build warnings remain the undetected
  Next ESLint plugin and the type-only `ReactNode` import in
  `ErrorBoundary.tsx`; this slice does not touch either file.
- Payment authority evidence: source validation continues to permit only the
  fixed owner-approved live Stripe Payment Link in Production and the fixed test
  link in Preview. A read-only request to the approved live link returned HTTP
  200. Read-only public `/automate` HTML contained the approved live authority
  and not the Preview authority. No checkout was activated and no payment or
  provider configuration was changed.
- Release/deployment evidence: repository authority names `launch/website` as
  the production branch and `staffordmedia-site-website` as the promotion
  target. GitHub CI for `81fa400` passed and its Vercel status reports a completed
  deployment. The public route returned HTTP 200 from Render on 2026-11-14, but
  the exact Render deploy ID/source SHA was not available from the authorized
  read-only evidence and remains unknown. GitHub's branch-protection endpoint
  reports `launch/website` is not protected, so the documented feature-branch,
  Website Build label, review, and CI procedure must be followed operationally;
  a direct push is not an acceptable substitute.
- Render evidence: a fictional lead-response intake completed at 1440×1000 and
  390×844 through the loopback application. Both widths had equal document and
  viewport widths (no horizontal overflow), showed all six deliverables and
  practical-value statements, and exposed both the approved Preview checkout
  action and contact action. Neither action was activated and no payment was
  attempted.
- Owner review: Ross reviewed the local result and offer screenshots. The final
  changes above are copy/label logic only; a new visual inspection was not
  claimed.
- Release procedure: create a scoped Website Build branch from exact target
  `81fa400`, apply this isolated diff, preserve the target's Node 24/security and
  GA4 commits, review the six-file diff, and run the normal pull-request CI gate.
  Before an authorized promotion, record the actual current Render deploy ID and
  source SHA as the rollback target. After promotion, perform a separately
  authorized non-payment `/automate` smoke check. Rollback is redeployment of
  that recorded pre-release Render deploy; this slice has no migration or
  payment-setting rollback. No conversion uplift is claimed.
