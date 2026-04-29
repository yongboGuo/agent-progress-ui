# Event Schema

`packages/core` reduces task events into a `TaskSnapshot` that powers the UI.

## Required event fields

- `id`
- `taskId`
- `type`
- `state`
- `timestamp`
- `title`

## Optional event fields

- `message`
- `stepId`
- `stepLabel`
- `elapsedMs`
- `source`
- `tool`
- `artifact`
- `steps`

## Example

```json
{
  "id": "agent-15",
  "taskId": "task_agent_01",
  "type": "ready_for_review",
  "state": "ready_for_review",
  "timestamp": "2026-04-29T09:02:02.000Z",
  "title": "Ready for review",
  "message": "Diffs, artifacts, and next steps are bundled for inspection.",
  "elapsedMs": 122000,
  "artifact": {
    "type": "bundle",
    "id": "agent-review",
    "label": "Review bundle"
  }
}
```

The reducer uses `steps` to seed stage rails and consumes subsequent `step_started` / `step_completed` events to move status forward.
