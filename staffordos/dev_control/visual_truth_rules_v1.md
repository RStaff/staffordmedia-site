# Visual Truth Rules v1

Purpose: prevent AI redesign drift and preserve approved StaffordMedia surfaces.

## Rules

- Approved visual surfaces override generated doctrine.
- Screenshots count as evidence.
- AI may extend approved surfaces, not replace them.
- Visual truth must be mapped before edits.
- Quarantine drift surfaces instead of deleting them immediately.
- Do not infer approval from a successful build.
- Do not treat a plausible generated page as canonical.
- Do not redesign during implementation patches.
- If visual evidence conflicts with generated suggestions, preserve the approved visual evidence.

## Evidence

Useful visual truth evidence includes:

- approved screenshots
- current production screenshots
- visual QA captures
- route owner files tied to approved screenshots
- explicit Ross approval notes

## Quarantine Rule

When a surface exists in the wrong repo, wrong machine, or wrong product boundary, mark it QUARANTINED in `surface_registry_v1.json`.

Quarantine preserves evidence while preventing accidental promotion.
