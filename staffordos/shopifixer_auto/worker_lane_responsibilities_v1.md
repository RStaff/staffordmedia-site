# Worker Lane Responsibilities v1

Status: ARCHITECTURE_ONLY_NOT_IMPLEMENTED

Purpose: define future worker responsibilities without launching workers, agents, automation, or orchestration runtime.

## Worker Types

| Worker type           | Future responsibility                                            | Required input                                                             | Required output                                                    | Current status  |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------- |
| audit worker          | Read storefront evidence and produce bounded findings.           | Store context and audit evidence.                                          | Audit findings with mutation depth recommendation.                 | NOT_IMPLEMENTED |
| classifier worker     | Identify theme archetype and confidence.                         | Theme evidence, file structure, settings, or recovered memory.             | Theme classification record.                                       | NOT_IMPLEMENTED |
| snapshot worker       | Create or verify before/after source and visual proof.           | Snapshot request, theme ID, screenshot targets, duplicate theme reference. | Snapshot manifest or blocked report.                               | NOT_IMPLEMENTED |
| Codex mutation worker | Apply an approved packet inside allowed files in a sandbox only. | Approved mutation packet and sandbox path.                                 | Changed files, verification evidence, or stopped execution report. | NOT_IMPLEMENTED |
| QA worker             | Check packet acceptance criteria and deterministic safety rules. | Mutation packet, changed files, proof artifacts.                           | QA pass/fail status with reasons.                                  | NOT_IMPLEMENTED |
| visual diff worker    | Compare matching before/after proof surfaces and classify risk.  | Before screenshots, after screenshots, diff images.                        | Visual diff risk report.                                           | NOT_IMPLEMENTED |
| approval worker       | Produce Ross or merchant approval packet from proof artifacts.   | QA result, mutation summary, rollback reference, visual proof.             | Approval packet draft.                                             | NOT_IMPLEMENTED |
| rollback worker       | Restore sandbox state or prove rollback readiness.               | Rollback trigger, original snapshot, patch diff, restore instructions.     | Rollback proof or blocked rollback report.                         | NOT_IMPLEMENTED |

## Responsibility Boundaries

- Workers may only handle the artifact assigned to their lane.
- Workers may not expand mutation scope.
- Workers may not infer approval from a successful check.
- Workers may not deploy or promote themes.
- Workers may not access another merchant context.
