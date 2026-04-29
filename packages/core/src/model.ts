export const taskStates = [
  "queued",
  "understanding",
  "planning",
  "executing",
  "synthesizing",
  "waiting_external",
  "waiting_user",
  "retrying",
  "backgrounded",
  "ready_for_review",
  "completed",
  "failed",
  "cancelled"
] as const;

export type TaskState = (typeof taskStates)[number];

export const taskEventTypes = [
  "task_created",
  "plan_ready",
  "step_started",
  "step_completed",
  "source_found",
  "tool_started",
  "tool_finished",
  "artifact_created",
  "waiting_external",
  "waiting_user",
  "retrying",
  "backgrounded",
  "ready_for_review",
  "completed",
  "failed",
  "cancelled"
] as const;

export type TaskEventType = (typeof taskEventTypes)[number];

export type TaskTone = "neutral" | "accent" | "success" | "warning" | "danger";
export type TaskStepStatus = "pending" | "active" | "completed" | "failed";

export interface TaskSource {
  title: string;
  domain?: string;
  href?: string;
}

export interface TaskTool {
  name: string;
  detail?: string;
}

export interface TaskArtifact {
  type: string;
  id: string;
  label: string;
  description?: string;
  href?: string;
  preview?: string;
}

export interface TaskPlanStep {
  id: string;
  label: string;
  description: string;
}

export interface TaskStep extends TaskPlanStep {
  order: number;
  status: TaskStepStatus;
  startedAt?: string;
  completedAt?: string;
}

export interface TaskEvent {
  id: string;
  taskId: string;
  type: TaskEventType;
  state: TaskState;
  timestamp: string;
  title: string;
  message?: string;
  stepId?: string;
  stepLabel?: string;
  elapsedMs?: number;
  source?: TaskSource;
  tool?: TaskTool;
  artifact?: TaskArtifact;
  steps?: TaskPlanStep[];
}

export interface TaskFeedItem {
  id: string;
  type: TaskEventType;
  state: TaskState;
  title: string;
  message?: string;
  timestamp: string;
  elapsedMs?: number;
}

export interface TaskSnapshot {
  taskId: string;
  state: TaskState;
  title: string;
  message?: string;
  elapsedMs: number;
  steps: TaskStep[];
  activeStepId?: string;
  feed: TaskFeedItem[];
  artifacts: TaskArtifact[];
  canCancel: boolean;
  canBackground: boolean;
  canReview: boolean;
}

export interface TaskStateMeta {
  label: string;
  tone: TaskTone;
  detail: string;
}

export interface TaskScenario {
  id: string;
  name: string;
  strapline: string;
  description: string;
  recommendedProgress: number;
  events: TaskEvent[];
}
