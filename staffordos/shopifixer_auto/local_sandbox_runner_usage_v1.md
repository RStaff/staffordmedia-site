# Local Sandbox Runner Usage v1

Status: LOCAL_RUNNER_DOCUMENTATION

Purpose: document the local snapshot/sandbox runner for ShopiFixer fulfillment. The runner copies local theme files into a sandbox and writes proof metadata. It does not mutate Shopify, deploy, execute packets, run Codex, or alter StaffordMedia.ai public surfaces.

## Command

```bash
node staffordos/shopifixer_auto/runners/create_local_snapshot_sandbox_v1.mjs \
  --source staffordos/shopifixer_auto/fixtures/dummy_dawn_theme \
  --output staffordos/shopifixer_auto/output/sandboxes \
  --merchant-id dummy-dawn \
  --store-domain dummy-dawn.local \
  --theme-id LOCAL_DUMMY_DAWN \
  --theme-name "Dummy Dawn Theme" \
  --theme-archetype Dawn \
  --validation-output staffordos/shopifixer_auto/output/snapshots/dummy_dawn_snapshot_validation_v1.json
```

Use `--allow-local-copy` only when intentionally copying a local checkout that contains risk markers such as `.git`, `package.json`, or Shopify config files. This flag does not authorize live Shopify mutation.

## What It Does

- Reads a local theme source path.
- Creates a timestamped sandbox copy under the requested output path.
- Writes a snapshot manifest using `theme_snapshot_manifest_template_v1.json`.
- Records the rollback reference as the original local source path.
- Writes optional validation output when `--validation-output` is provided.

## What It Does Not Do

- Does not modify source files.
- Does not execute mutation packets.
- Does not run Codex.
- Does not run Shopify CLI.
- Does not call Shopify APIs.
- Does not deploy.
- Does not create workers, queues, dashboards, or agents.
- Does not edit `/`, `/shopifixer`, `/audit-result`, `/pricing`, `/abando`, or `/recovery-demo`.

## StaffordMedia.ai Architecture Fit

- StaffordMedia.ai remains the parent business and trust layer.
- ShopiFixer owns audit, quick fix, guided transformation, before/after proof, and fulfillment evidence.
- Abando remains the Revenue Recovery Agent and recovery proof/product lane.
- StaffordOS owns internal dev control, lifecycle state, mutation safety, proof, and approvals.

This runner belongs to ShopiFixer fulfillment. It creates local evidence for a future before/after process, but it does not change the StaffordMedia sitemap or public conversion surfaces.

This runner belongs to ShopiFixer Internal Dev Control, while execution permission is governed by StaffordOS Dev Control.

## Abando Boundary

Abando is separate from ShopiFixer fulfillment. A local theme sandbox may support a ShopiFixer fix, but it must not change Abando product language, recovery demo behavior, CTA destinations, or recovery runtime proof.

## Before/After Proof Support

The sandbox copy creates the local source snapshot needed before any future approved mutation. Later, a separate approved process may produce after proof, visual diff proof, QA proof, and rollback proof.

## Merchant Approval

Merchant approval is required before any launch, production promotion, Abando activation, or merchant-facing claim that a sandbox change is ready to deploy. Ross approval is required before merchant-facing proof.
