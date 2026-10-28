# Runtime Surface Binding v1

Date: 2026-05-19

Purpose: bind the active localhost runtime to repo, route, route owner, and visual approval status before any StaffordOS patch.

## Runtime Owner

| Field                   | Value                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Hostname                | localhost                                                                                           |
| Active port             | 3000                                                                                                |
| Listening process       | PID 95695, `next-server (v15.5.18)`                                                                 |
| Parent process          | PID 95692                                                                                           |
| Runtime owner command   | `node /Users/rossstafford/projects/StaffordMediaConsulting/apps/website/node_modules/.bin/next dev` |
| Runtime cwd / repo path | `/Users/rossstafford/projects/StaffordMediaConsulting/apps/website`                                 |
| Repo owner              | Mac canonical StaffordMedia repo                                                                    |
| Runtime verified        | yes                                                                                                 |

## Evidence Commands

| Evidence        | Command                                       | Result                                                                           |
| --------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Port owner      | `lsof -nP -iTCP:3000 -sTCP:LISTEN`            | PID 95695 owns `*:3000`                                                          |
| Runtime cwd     | `lsof -a -p 95695 -d cwd -Fn`                 | `/Users/rossstafford/projects/StaffordMediaConsulting/apps/website`              |
| Runtime command | `ps -p 95695 -o pid,ppid,command`             | `next-server (v15.5.18)` with parent PID 95692                                   |
| Parent command  | `ps -p 95692 -o pid,ppid,command`             | `node .../node_modules/.bin/next dev`                                            |
| Homepage render | `curl -s http://localhost:3000/`              | rendered `Stafford Media Consulting™`; Next payload pagePath `page.tsx`          |
| Recovery render | `curl -s http://localhost:3000/recovery-demo` | rendered `Abando Recovery Proof`; Next payload pagePath `recovery-demo/page.tsx` |

## Bound Runtime Surfaces

| Hostname  | Repo path                                                           | Port | Route            | Route owner file                 | Surface classification                                                                                                         | Ross approval                                                         |
| --------- | ------------------------------------------------------------------- | ---: | ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| localhost | `/Users/rossstafford/projects/StaffordMediaConsulting/apps/website` | 3000 | `/`              | `src/app/page.tsx`               | `staffordmedia_homepage`; APPROVED canonical surface, but current uncommitted homepage changes require review before promotion | existing surface approval confirmed; current worktree changes unknown |
| localhost | `/Users/rossstafford/projects/StaffordMediaConsulting/apps/website` | 3000 | `/recovery-demo` | `src/app/recovery-demo/page.tsx` | `abando_recovery_demo`; PLANNED active surface                                                                                 | unknown; BLOCKED_PENDING_ROSS_VISUAL_CONFIRMATION                     |

## Abando CTA Authorization Answer

Which exact surface should the Abando / See Recovery System CTA point to?

`BLOCKED_PENDING_ROSS_VISUAL_CONFIRMATION`

Reason: `/recovery-demo` is runtime-bound to the StaffordMedia repo and route owner, but the registry marks the Abando recovery demo as not approved by Ross. The live render also reports `Proof runtime not connected`, so it cannot yet be treated as the approved Abando destination.
