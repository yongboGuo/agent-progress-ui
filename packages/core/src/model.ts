export const agentRunStatuses = [
  "queued",
  "planning",
  "running",
  "waiting",
  "approval",
  "backgrounded",
  "completed",
  "failed"
] as const;

export type AgentRunStatus = (typeof agentRunStatuses)[number];
export type AgentTone = "neutral" | "accent" | "success" | "warning" | "danger";
export type AgentStageStatus = "pending" | "active" | "completed" | "failed";
export type AgentApprovalStatus = "pending" | "approved" | "rejected";
export type AgentWaitKind = "external" | "user";
export type AgentTimelineKind =
  | "run"
  | "plan"
  | "step"
  | "tool"
  | "resource"
  | "artifact"
  | "approval"
  | "wait";

export interface AgentPlanStep {
  id: string;
  label: string;
  description: string;
}

export interface AgentStageStep extends AgentPlanStep {
  order: number;
  status: AgentStageStatus;
  startedAt?: string;
  completedAt?: string;
  detail?: string;
}

export interface AgentToolCallOutput {
  id: string;
  summary: string;
  detail?: string;
  timestamp: string;
  status: "streaming" | "completed" | "failed";
}

export interface AgentToolCall {
  id: string;
  name: string;
  summary: string;
  startedAt: string;
  completedAt?: string;
  status: "running" | "completed" | "failed";
  outputs: AgentToolCallOutput[];
}

export interface AgentResource {
  id: string;
  title: string;
  kind: "source" | "document" | "result" | "file";
  uri?: string;
  detail?: string;
  timestamp: string;
}

export interface AgentArtifact {
  id: string;
  type: string;
  label: string;
  description?: string;
  href?: string;
  preview?: string;
  timestamp: string;
}

export interface AgentApproval {
  id: string;
  label: string;
  description: string;
  status: AgentApprovalStatus;
  requestedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface AgentWaitState {
  id: string;
  kind: AgentWaitKind;
  label: string;
  description: string;
  enteredAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface AgentTimelineItem {
  id: string;
  kind: AgentTimelineKind;
  eventType: AgentRunEvent["type"];
  title: string;
  detail?: string;
  timestamp: string;
  sequence: number;
  status: AgentRunStatus;
}

export interface AgentEvidenceEntry {
  id: string;
  kind: "tool" | "resource" | "output" | "artifact" | "approval" | "wait";
  title: string;
  detail?: string;
  timestamp: string;
  meta?: string;
  status?: string;
}

export interface AgentRunHeader {
  runId: string;
  title: string;
  summary?: string;
  status: AgentRunStatus;
  tone: AgentTone;
  elapsedMs: number;
  currentPhase: string;
  activeStepId?: string;
  isBackgrounded: boolean;
  lastEventAt: string;
  wait?: AgentWaitState;
}

export interface AgentRunStageRail {
  steps: AgentStageStep[];
  activeStepId?: string;
}

export interface AgentRunEvidence {
  entries: AgentEvidenceEntry[];
  tools: AgentToolCall[];
  resources: AgentResource[];
}

export interface AgentRunSnapshot {
  runId: string;
  header: AgentRunHeader;
  stageRail: AgentRunStageRail;
  timeline: AgentTimelineItem[];
  evidence: AgentRunEvidence;
  artifacts: AgentArtifact[];
  approvals: AgentApproval[];
}

export interface AgentScenario {
  id: string;
  name: string;
  strapline: string;
  description: string;
  recommendedProgress: number;
  events: AgentRunEvent[];
}

export interface AgentRunStore {
  append: (events: AgentRunEvent | AgentRunEvent[]) => AgentRunSnapshot;
  getEvents: () => AgentRunEvent[];
  getSnapshot: () => AgentRunSnapshot;
  replace: (events: AgentRunEvent[]) => AgentRunSnapshot;
  subscribe: (listener: () => void) => () => void;
}

interface AgentRunEventBase {
  id: string;
  runId: string;
  type:
    | "run.created"
    | "plan.set"
    | "step.started"
    | "step.updated"
    | "step.completed"
    | "tool.called"
    | "tool.output"
    | "resource.attached"
    | "artifact.created"
    | "approval.requested"
    | "approval.resolved"
    | "wait.entered"
    | "wait.resolved"
    | "run.backgrounded"
    | "run.completed"
    | "run.failed";
  timestamp: string;
  sequence?: number;
  title: string;
  message?: string;
  elapsedMs?: number;
}

export interface RunCreatedEvent extends AgentRunEventBase {
  type: "run.created";
  phase?: string;
}

export interface PlanSetEvent extends AgentRunEventBase {
  type: "plan.set";
  steps: AgentPlanStep[];
}

export interface StepStartedEvent extends AgentRunEventBase {
  type: "step.started";
  step: AgentPlanStep;
}

export interface StepUpdatedEvent extends AgentRunEventBase {
  type: "step.updated";
  stepId: string;
  detail: string;
}

export interface StepCompletedEvent extends AgentRunEventBase {
  type: "step.completed";
  stepId: string;
  outcome?: "completed" | "failed";
}

export interface ToolCalledEvent extends AgentRunEventBase {
  type: "tool.called";
  toolCall: {
    id: string;
    name: string;
    summary: string;
  };
}

export interface ToolOutputEvent extends AgentRunEventBase {
  type: "tool.output";
  toolCallId: string;
  output: {
    id: string;
    summary: string;
    detail?: string;
    status: "streaming" | "completed" | "failed";
  };
}

export interface ResourceAttachedEvent extends AgentRunEventBase {
  type: "resource.attached";
  resource: Omit<AgentResource, "timestamp">;
}

export interface ArtifactCreatedEvent extends AgentRunEventBase {
  type: "artifact.created";
  artifact: Omit<AgentArtifact, "timestamp">;
}

export interface ApprovalRequestedEvent extends AgentRunEventBase {
  type: "approval.requested";
  approval: {
    id: string;
    label: string;
    description: string;
  };
}

export interface ApprovalResolvedEvent extends AgentRunEventBase {
  type: "approval.resolved";
  approvalId: string;
  resolution: Exclude<AgentApprovalStatus, "pending">;
  note?: string;
}

export interface WaitEnteredEvent extends AgentRunEventBase {
  type: "wait.entered";
  wait: {
    id: string;
    kind: AgentWaitKind;
    label: string;
    description: string;
  };
}

export interface WaitResolvedEvent extends AgentRunEventBase {
  type: "wait.resolved";
  waitId: string;
  note?: string;
}

export interface RunBackgroundedEvent extends AgentRunEventBase {
  type: "run.backgrounded";
  reason: string;
}

export interface RunCompletedEvent extends AgentRunEventBase {
  type: "run.completed";
  summary: string;
}

export interface RunFailedEvent extends AgentRunEventBase {
  type: "run.failed";
  error: string;
}

export type AgentRunEvent =
  | RunCreatedEvent
  | PlanSetEvent
  | StepStartedEvent
  | StepUpdatedEvent
  | StepCompletedEvent
  | ToolCalledEvent
  | ToolOutputEvent
  | ResourceAttachedEvent
  | ArtifactCreatedEvent
  | ApprovalRequestedEvent
  | ApprovalResolvedEvent
  | WaitEnteredEvent
  | WaitResolvedEvent
  | RunBackgroundedEvent
  | RunCompletedEvent
  | RunFailedEvent;

export interface AgentStatusMeta {
  label: string;
  tone: AgentTone;
  detail: string;
}
