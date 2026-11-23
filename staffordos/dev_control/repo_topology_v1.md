# Repo Topology v1

Purpose: prevent StaffordMedia, ShopiFixer, Abando, and StaffordOS topology confusion during operational patches.

## Canonical Ownership

The Mac owns the canonical StaffordMedia repo:

`/Users/rossstafford/projects/StaffordMediaConsulting/apps/website`

This repo owns the public StaffordMedia website, the approved homepage, the canonical ShopiFixer public surface, the StaffordMedia-hosted recovery demo, and the audit-result revenue path.

## Runtime Ownership

`homeserver2` owns cart-agent, StaffordOS runtime work, and Abando runtime surfaces.

The cart-agent tree is not the canonical StaffordMedia website source. It can contain runtime code, Abando app code, experiments, and generated drift evidence, but it must not override StaffordMedia public surface truth.

## Drift Page Origin

The drift ShopiFixer page originated in:

`/Users/rossstafford/projects/cart-agent/abando-frontend`

That page is quarantined because it was generated outside the canonical StaffordMedia website repo and confused ShopiFixer public surface ownership with Abando/cart-agent topology.

## Why Drift Happened

Drift happened because AI work crossed repo and machine boundaries without first confirming:

- the canonical repo
- the active route owner
- the approved visual surface
- the product boundary between ShopiFixer and Abando

The result was a plausible page in the wrong topology.

## Repo Ownership Rules

- StaffordMedia public website changes belong in the Mac canonical StaffordMedia repo.
- ShopiFixer public audit and result surfaces belong in the StaffordMedia website repo.
- Abando runtime/app changes belong in cart-agent or the verified Abando runtime repo.
- Quarantined drift surfaces are evidence, not source of truth.
- Do not copy drift UI into canonical surfaces without explicit approval and visual review.

## Machine Ownership Rules

- Mac: canonical StaffordMedia public web surface and local visual truth review.
- homeserver2: cart-agent, Abando runtime, and non-public operational runtime systems.
- Before editing, confirm both repo ownership and machine ownership.
- If ownership is unclear, stop and update the relevant truth artifact before patching.
