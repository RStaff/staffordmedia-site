# Visual Diff Risk Model v1

Status: RISK_MODEL_ONLY_NOT_IMPLEMENTED

Purpose: classify before/after visual differences by merchant risk before a mutation is presented or approved.

## LOW_RISK_DIFF

Low-risk diffs are small, scoped, and easy to roll back.

Examples:

- spacing around an existing product-page block
- CTA label clarity without form behavior change
- minor visual hierarchy improvement
- proof or trust copy added inside an existing approved zone
- scoped CSS for one product-page area

Required handling:

- before/after screenshots
- changed-file list
- rollback reference

## MEDIUM_RISK_DIFF

Medium-risk diffs affect page comprehension or purchasing flow but do not alter checkout, cart, or product form logic.

Examples:

- CTA hierarchy change
- product detail block order change
- navigation movement that affects orientation
- product page section visibility changes
- mobile layout shift near the buy area

Required handling:

- desktop and mobile before/after screenshots
- visual diff review
- Ross approval before merchant-facing proof
- explicit rollback instructions

## HIGH_RISK_DIFF

High-risk diffs can affect revenue-critical behavior, brand trust, or buyer completion.

Examples:

- PDP restructuring across multiple sections
- product form movement or behavior change
- cart drawer mutation
- checkout-affecting mutation
- navigation restructuring across the store
- global JavaScript injection
- theme-wide CSS replacement

Required handling:

- normally reject for autonomous execution
- require explicit redesign scope
- require merchant approval before any launch
- require tested rollback proof
- require manual review of product form, cart, and checkout boundaries

## Default Rule

When risk is unclear, classify the diff as the higher risk level.
