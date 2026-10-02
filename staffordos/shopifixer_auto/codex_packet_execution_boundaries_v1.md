# Codex Packet Execution Boundaries v1

Status: BOUNDARIES_ONLY_NOT_EXECUTABLE

Purpose: define how Codex must behave when a future mutation packet is explicitly approved for sandbox execution.

## Boundaries

- Codex executes only inside `allowed_files`.
- Codex must not expand scope.
- Codex must not deploy.
- Codex must not touch live themes.
- Codex must not run Shopify CLI unless a separate approved execution patch explicitly authorizes it.
- Codex must not connect to Shopify APIs unless a separate approved execution patch explicitly authorizes it.
- Codex must report changed files.
- Codex must produce verification evidence.
- Codex must stop on missing access or ambiguity.

## Required Execution Posture

Before editing, Codex must confirm:

- packet JSON parses
- packet `execution_status` permits sandbox execution
- approval gates are satisfied
- allowed files are exact
- rollback plan exists
- before snapshots exist
- target theme is a duplicate or sandbox

After editing, Codex must report:

- changed files
- operations performed
- validations run
- validations not run
- before/after proof locations
- rollback reference
- remaining risk

## Stop Conditions

Codex must stop when:

- requested file is outside `allowed_files`
- requested operation is in `prohibited_operations`
- live theme or production deployment is requested
- Shopify access is missing
- theme ID or duplicate theme ID is ambiguous
- before screenshots are missing
- rollback plan is missing
- Ross approval is required but not recorded

## Non-Execution Rule

This document does not authorize execution. It only constrains future execution after explicit approval.
