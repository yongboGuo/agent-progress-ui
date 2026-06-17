# Migration to v0.2

`v0.2` replaces the old task-centric API with an agent runtime model.

## Renames

- `TaskEvent` -> `AgentRunEvent`
- `TaskSnapshot` -> `AgentRunSnapshot`
- `TaskWorkbench` -> `AgentWorkbench`
- `createTaskThemeStyle` -> `createAgentThemeStyle`
- `getTaskSnapshot` / `reduceTaskEvents` -> `getAgentRunSnapshot` / `reduceAgentRunEvents`

## New concepts

- `createAgentRunStore` for incremental event replay
- `useAgentRun(store)` for live React rendering
- `@agent-progress-ui/mcp` for transcript and session mapping
- explicit `approvals` and `wait` sections in the snapshot model

## Legacy data

If you still have old task-shaped events, migrate them with:

```ts
import { legacyTaskEventsToAgentRunEvents } from "@agent-progress-ui/core";
```
