import type { AgentPlanStep, AgentRunEvent } from "./model";

export interface LegacyTaskEvent {
  id: string;
  taskId: string;
  type: string;
  timestamp: string;
  title: string;
  message?: string;
  elapsedMs?: number;
  stepId?: string;
  stepLabel?: string;
  steps?: AgentPlanStep[];
  source?: {
    title: string;
    domain?: string;
    href?: string;
  };
  tool?: {
    name: string;
    detail?: string;
  };
  artifact?: {
    id: string;
    type: string;
    label: string;
    description?: string;
    href?: string;
    preview?: string;
  };
}

function baseEvent(event: LegacyTaskEvent, sequence: number) {
  return {
    id: event.id,
    runId: event.taskId,
    timestamp: event.timestamp,
    sequence,
    title: event.title,
    message: event.message,
    elapsedMs: event.elapsedMs
  };
}

export function legacyTaskEventsToAgentRunEvents(events: LegacyTaskEvent[]): AgentRunEvent[] {
  return events.reduce<AgentRunEvent[]>((accumulator, event, index) => {
    const common = baseEvent(event, index);
    let next: AgentRunEvent[] = [];

    switch (event.type) {
      case "task_created":
        next = [{ ...common, type: "run.created" as const }];
        break;
      case "plan_ready":
        next = [{ ...common, type: "plan.set" as const, steps: event.steps ?? [] }];
        break;
      case "step_started":
        next = [
          {
            ...common,
            type: "step.started" as const,
            step: {
              id: event.stepId ?? `legacy-step-${index}`,
              label: event.stepLabel ?? event.title,
              description: event.message ?? "Migrated from legacy task events."
            }
          }
        ];
        break;
      case "step_completed":
        next = [
          {
            ...common,
            type: "step.completed" as const,
            stepId: event.stepId ?? `legacy-step-${index}`
          }
        ];
        break;
      case "source_found":
        next = event.source
          ? [
              {
                ...common,
                type: "resource.attached" as const,
                resource: {
                  id: `${event.id}-resource`,
                  title: event.source.title,
                  kind: "source" as const,
                  uri: event.source.href,
                  detail: event.source.domain
                }
              }
            ]
          : [];
        break;
      case "tool_started":
        next = event.tool
          ? [
              {
                ...common,
                type: "tool.called" as const,
                toolCall: {
                  id: `${event.id}-tool`,
                  name: event.tool.name,
                  summary: event.tool.detail ?? event.message ?? "Legacy tool call"
                }
              }
            ]
          : [];
        break;
      case "tool_finished":
        next = event.tool
          ? [
              {
                ...common,
                type: "tool.output" as const,
                toolCallId: `${event.id.replace(/finished/, "started")}-tool`,
                output: {
                  id: `${event.id}-output`,
                  summary: event.tool.detail ?? event.message ?? "Legacy tool output",
                  status: "completed" as const
                }
              }
            ]
          : [];
        break;
      case "artifact_created":
        next = event.artifact
          ? [
              {
                ...common,
                type: "artifact.created" as const,
                artifact: event.artifact
              }
            ]
          : [];
        break;
      case "waiting_external":
        next = [
          {
            ...common,
            type: "wait.entered" as const,
            wait: {
              id: `${event.id}-wait`,
              kind: "external",
              label: event.title,
              description: event.message ?? "Legacy external wait"
            }
          }
        ];
        break;
      case "waiting_user":
        next = [
          {
            ...common,
            type: "wait.entered" as const,
            wait: {
              id: `${event.id}-wait`,
              kind: "user",
              label: event.title,
              description: event.message ?? "Legacy user wait"
            }
          }
        ];
        break;
      case "backgrounded":
        next = [{ ...common, type: "run.backgrounded" as const, reason: event.message ?? "Legacy background state" }];
        break;
      case "completed":
        next = [{ ...common, type: "run.completed" as const, summary: event.message ?? event.title }];
        break;
      case "failed":
        next = [{ ...common, type: "run.failed" as const, error: event.message ?? event.title }];
        break;
      default:
        next = [];
    }

    accumulator.push(...next);
    return accumulator;
  }, []);
}
