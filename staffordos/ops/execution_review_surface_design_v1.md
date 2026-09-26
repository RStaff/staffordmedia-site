# Execution Review Surface Design v1

Status: READ_ONLY_PRE_EXECUTION_VISIBILITY

Purpose: document why the StaffordOS Fulfillment Execution Review surface exists before any execution authority exists.

## Why Execution Review Exists Before Automation

StaffordOS now has runtime state, execution tasks, mutation packets, proof references, approval state, rollback gates, and fulfillment attachments. The operator needs to see that chain before any future executor can be trusted.

This surface makes the chain visible. It does not run the chain.

## Why Operator Cognition Matters

Ross must be able to quickly answer:

- which merchant/runtime is involved
- which task governs future work
- which packet describes the work
- which files are allowed and prohibited
- what proof exists
- what approval is missing
- whether rollback and replayability are present

Clear review prevents pressure from turning partial artifacts into execution authority.

## Rollback And Replayability Visibility

Rollback and replayability must be visible before any future manual or automated execution.

- Rollback shows whether a future mutation path is reversible.
- Replayability shows whether the chain can be traced back to source artifacts.
- Missing rollback or replayability must block execution readiness.

## Approval Must Remain Explicit

Validation success does not equal approval.

Attachment existence does not equal approval.

Operator approval and merchant approval must stay visible as separate gates. The review surface may display approval state, but it must not change approval state.

## Future Evolution Path

Future slices may add:

- deeper artifact drill-downs
- comparison views for proof artifacts
- explicit approval review requests
- manual execution readiness checks
- executor handoff packets

Any future mutation or execution control must be separately approved and must write through StaffordOS source-of-truth transition rules.

## Must Never Become Implicit Automation

The review surface must never silently:

- invoke Codex
- call OpenAI APIs
- launch agents or workers
- mutate Shopify
- deploy
- mutate runtime, lifecycle, approval, or execution state
- infer approval from validation
- treat a visible attachment as permission to execute
- create background polling, queues, or websocket control loops
