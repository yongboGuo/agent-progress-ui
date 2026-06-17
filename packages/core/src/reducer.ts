import type {
  AgentApproval,
  AgentArtifact,
  AgentEvidenceEntry,
  AgentPlanStep,
  AgentResource,
  AgentRunEvent,
  AgentRunHeader,
  AgentRunSnapshot,
  AgentRunStageRail,
  AgentRunStatus,
  AgentStatusMeta,
  AgentStageStep,
  AgentTimelineItem,
  AgentToolCall,
  AgentWaitState
} from "./model";

export const agentStatusMeta: Record<AgentRunStatus, AgentStatusMeta> = {
  queued: {
    label: "Queued",
    tone: "neutral",
    detail: "The run has been accepted and is waiting to start."
  },
  planning: {
    label: "Planning",
    tone: "accent",
    detail: "The run is locking scope, stages, and the execution route."
  },
  running: {
    label: "Running",
    tone: "accent",
    detail: "The agent is actively executing steps, tools, or resource reads."
  },
  waiting: {
    label: "Waiting",
    tone: "warning",
    detail: "Forward progress is paused on a user or external dependency."
  },
  approval: {
    label: "Approval",
    tone: "warning",
    detail: "The run is blocked on an explicit approval checkpoint."
  },
  backgrounded: {
    label: "Backgrounded",
    tone: "neutral",
    detail: "The run continues outside the current foreground surface."
  },
  completed: {
    label: "Completed",
    tone: "success",
    detail: "The run has finished with a reviewable output."
  },
  failed: {
    label: "Failed",
    tone: "danger",
    detail: "The run stopped and needs intervention."
  }
};

function sortEvents(events: AgentRunEvent[]): AgentRunEvent[] {
  return [...events].sort((left, right) => {
    if (left.timestamp !== right.timestamp) {
      return left.timestamp.localeCompare(right.timestamp);
    }

    const leftSequence = left.sequence ?? 0;
    const rightSequence = right.sequence ?? 0;

    if (leftSequence !== rightSequence) {
      return leftSequence - rightSequence;
    }

    return left.id.localeCompare(right.id);
  });
}

function getEventStatus(
  event: AgentRunEvent,
  approvals: AgentApproval[],
  isBackgrounded: boolean,
  waitState?: AgentWaitState
): AgentRunStatus {
  if (event.type === "run.failed") {
    return "failed";
  }

  if (event.type === "run.completed") {
    return "completed";
  }

  if (event.type === "run.backgrounded") {
    return "backgrounded";
  }

  if (waitState && !waitState.resolvedAt) {
    return "waiting";
  }

  const pendingApproval = approvals.some((approval) => approval.status === "pending");

  if (pendingApproval) {
    return "approval";
  }

  if (isBackgrounded) {
    return "backgrounded";
  }

  if (event.type === "run.created") {
    return "queued";
  }

  if (event.type === "plan.set") {
    return "planning";
  }

  return "running";
}

function defaultStep(step: AgentPlanStep, order: number): AgentStageStep {
  return {
    ...step,
    order,
    status: "pending"
  };
}

function upsertStep(
  steps: Map<string, AgentStageStep>,
  step: AgentPlanStep,
  order: number
): AgentStageStep {
  const current = steps.get(step.id);
  const next: AgentStageStep = {
    ...step,
    order,
    status: current?.status ?? "pending",
    startedAt: current?.startedAt,
    completedAt: current?.completedAt,
    detail: current?.detail
  };

  steps.set(step.id, next);
  return next;
}

function pushEvidence(entries: AgentEvidenceEntry[], entry: AgentEvidenceEntry) {
  entries.push(entry);
}

function emptySnapshot(): AgentRunSnapshot {
  const header: AgentRunHeader = {
    runId: "run_empty",
    title: "No run loaded",
    status: "queued",
    tone: agentStatusMeta.queued.tone,
    elapsedMs: 0,
    currentPhase: "Awaiting input",
    isBackgrounded: false,
    lastEventAt: new Date(0).toISOString()
  };

  const stageRail: AgentRunStageRail = {
    steps: []
  };

  return {
    runId: header.runId,
    header,
    stageRail,
    timeline: [],
    evidence: {
      entries: [],
      tools: [],
      resources: []
    },
    artifacts: [],
    approvals: []
  };
}

export function reduceAgentRunEvents(events: AgentRunEvent[]): AgentRunSnapshot {
  const orderedEvents = sortEvents(events);
  const firstEvent = orderedEvents[0];

  if (!firstEvent) {
    return emptySnapshot();
  }

  const steps = new Map<string, AgentStageStep>();
  const toolCalls = new Map<string, AgentToolCall>();
  const resources = new Map<string, AgentResource>();
  const artifacts = new Map<string, AgentArtifact>();
  const approvals = new Map<string, AgentApproval>();
  const evidenceEntries: AgentEvidenceEntry[] = [];
  const timeline: AgentTimelineItem[] = [];
  let activeStepId: string | undefined;
  let status: AgentRunStatus = "queued";
  let elapsedMs = firstEvent.elapsedMs ?? 0;
  let title = firstEvent.title;
  let summary = firstEvent.message;
  let currentPhase = "Run accepted";
  let waitState: AgentWaitState | undefined;
  let isBackgrounded = false;

  // The stage rail reducer is easier to read as a second pass over the ordered events.
  for (const event of orderedEvents) {
    elapsedMs = event.elapsedMs ?? elapsedMs;
    title = event.title;
    summary = event.message ?? summary;

    if (event.type === "plan.set") {
      currentPhase = "Plan locked";
      event.steps.forEach((step, index) => {
        upsertStep(steps, step, index);
      });
    }

    if (event.type === "step.started") {
      const current = steps.get(event.step.id) ?? defaultStep(event.step, steps.size);
      steps.set(event.step.id, {
        ...current,
        ...event.step,
        order: current.order,
        status: "active",
        startedAt: current.startedAt ?? event.timestamp
      });
      activeStepId = event.step.id;
      currentPhase = event.step.label;
    }

    if (event.type === "step.updated") {
      const current = steps.get(event.stepId);

      if (current) {
        steps.set(event.stepId, {
          ...current,
          detail: event.detail
        });
      }
    }

    if (event.type === "step.completed") {
      const current = steps.get(event.stepId);

      if (current) {
        const failed = event.outcome === "failed";
        steps.set(event.stepId, {
          ...current,
          status: failed ? "failed" : "completed",
          completedAt: event.timestamp
        });
      }

      if (activeStepId === event.stepId) {
        activeStepId = undefined;
      }

      currentPhase = current?.label ?? currentPhase;
    }

    if (event.type === "tool.called") {
      toolCalls.set(event.toolCall.id, {
        id: event.toolCall.id,
        name: event.toolCall.name,
        summary: event.toolCall.summary,
        startedAt: event.timestamp,
        status: "running",
        outputs: []
      });
      pushEvidence(evidenceEntries, {
        id: event.id,
        kind: "tool",
        title: event.toolCall.name,
        detail: event.toolCall.summary,
        timestamp: event.timestamp,
        status: "running"
      });
    }

    if (event.type === "tool.output") {
      const current =
        toolCalls.get(event.toolCallId) ??
        {
          id: event.toolCallId,
          name: "Unknown tool",
          summary: "Tool output arrived before the tool call event.",
          startedAt: event.timestamp,
          status: "running" as const,
          outputs: []
        };

      const output = {
        id: event.output.id,
        summary: event.output.summary,
        detail: event.output.detail,
        timestamp: event.timestamp,
        status: event.output.status
      };

      toolCalls.set(event.toolCallId, {
        ...current,
        status: event.output.status === "failed" ? "failed" : event.output.status === "completed" ? "completed" : "running",
        completedAt: event.output.status === "streaming" ? current.completedAt : event.timestamp,
        outputs: [...current.outputs, output]
      });

      pushEvidence(evidenceEntries, {
        id: output.id,
        kind: "output",
        title: current.name,
        detail: output.summary,
        timestamp: event.timestamp,
        meta: output.detail,
        status: output.status
      });
    }

    if (event.type === "resource.attached") {
      resources.set(event.resource.id, {
        ...event.resource,
        timestamp: event.timestamp
      });

      pushEvidence(evidenceEntries, {
        id: event.resource.id,
        kind: "resource",
        title: event.resource.title,
        detail: event.resource.detail,
        timestamp: event.timestamp,
        meta: event.resource.kind,
        status: "attached"
      });
    }

    if (event.type === "artifact.created") {
      artifacts.set(event.artifact.id, {
        ...event.artifact,
        timestamp: event.timestamp
      });

      pushEvidence(evidenceEntries, {
        id: event.artifact.id,
        kind: "artifact",
        title: event.artifact.label,
        detail: event.artifact.description,
        timestamp: event.timestamp,
        meta: event.artifact.type,
        status: "created"
      });
    }

    if (event.type === "approval.requested") {
      currentPhase = "Approval requested";
      approvals.set(event.approval.id, {
        ...event.approval,
        status: "pending",
        requestedAt: event.timestamp
      });

      pushEvidence(evidenceEntries, {
        id: event.approval.id,
        kind: "approval",
        title: event.approval.label,
        detail: event.approval.description,
        timestamp: event.timestamp,
        status: "pending"
      });
    }

    if (event.type === "approval.resolved") {
      currentPhase = "Approval resolved";
      const current = approvals.get(event.approvalId);

      if (current) {
        approvals.set(event.approvalId, {
          ...current,
          status: event.resolution,
          resolvedAt: event.timestamp,
          resolutionNote: event.note
        });
      }

      pushEvidence(evidenceEntries, {
        id: event.id,
        kind: "approval",
        title: current?.label ?? "Approval resolved",
        detail: event.note,
        timestamp: event.timestamp,
        status: event.resolution
      });
    }

    if (event.type === "wait.entered") {
      currentPhase = event.wait.label;
      waitState = {
        ...event.wait,
        enteredAt: event.timestamp
      };

      pushEvidence(evidenceEntries, {
        id: event.wait.id,
        kind: "wait",
        title: event.wait.label,
        detail: event.wait.description,
        timestamp: event.timestamp,
        status: "entered"
      });
    }

    if (event.type === "wait.resolved" && waitState?.id === event.waitId) {
      currentPhase = "Run resumed";
      waitState = {
        ...waitState,
        resolvedAt: event.timestamp,
        resolutionNote: event.note
      };

      pushEvidence(evidenceEntries, {
        id: event.id,
        kind: "wait",
        title: waitState.label,
        detail: event.note,
        timestamp: event.timestamp,
        status: "resolved"
      });
    }

    if (event.type === "run.backgrounded") {
      isBackgrounded = true;
      currentPhase = "Background execution";
    }

    if (event.type === "run.completed") {
      currentPhase = "Completed";
      isBackgrounded = false;
    }

    if (event.type === "run.failed") {
      currentPhase = "Failed";
      isBackgrounded = false;
    }

    status = getEventStatus(
      event,
      [...approvals.values()],
      isBackgrounded,
      waitState && !waitState.resolvedAt ? waitState : undefined
    );
    const detail =
      event.type === "run.completed"
        ? event.summary
        : event.type === "run.failed"
          ? event.error
          : event.message;

    timeline.push({
      id: event.id,
      kind: event.type.startsWith("step")
        ? "step"
        : event.type.startsWith("tool")
          ? "tool"
          : event.type.startsWith("resource")
            ? "resource"
            : event.type.startsWith("artifact")
              ? "artifact"
              : event.type.startsWith("approval")
                ? "approval"
                : event.type.startsWith("wait")
                  ? "wait"
                  : event.type === "plan.set"
                    ? "plan"
                    : "run",
      eventType: event.type,
      title: event.title,
      detail,
      timestamp: event.timestamp,
      sequence: event.sequence ?? 0,
      status
    });
  }

  if (activeStepId && (status === "completed" || status === "failed")) {
    const current = steps.get(activeStepId);

    if (current && current.status === "active") {
      steps.set(activeStepId, {
        ...current,
        status: status === "failed" ? "failed" : "completed",
        completedAt: orderedEvents.at(-1)?.timestamp ?? current.startedAt
      });
    }
  }

  const header: AgentRunHeader = {
    runId: firstEvent.runId,
    title,
    summary,
    status,
    tone: agentStatusMeta[status].tone,
    elapsedMs,
    currentPhase,
    activeStepId,
    isBackgrounded,
    lastEventAt: orderedEvents.at(-1)?.timestamp ?? firstEvent.timestamp,
    wait: waitState && !waitState.resolvedAt ? waitState : undefined
  };

  return {
    runId: firstEvent.runId,
    header,
    stageRail: {
      steps: [...steps.values()].sort((left, right) => left.order - right.order),
      activeStepId
    },
    timeline,
    evidence: {
      entries: evidenceEntries.sort((left, right) => right.timestamp.localeCompare(left.timestamp)),
      tools: [...toolCalls.values()].sort((left, right) => right.startedAt.localeCompare(left.startedAt)),
      resources: [...resources.values()].sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    },
    artifacts: [...artifacts.values()].sort((left, right) => right.timestamp.localeCompare(left.timestamp)),
    approvals: [...approvals.values()].sort((left, right) => right.requestedAt.localeCompare(left.requestedAt))
  };
}
