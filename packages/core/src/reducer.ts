import type {
  TaskEvent,
  TaskFeedItem,
  TaskSnapshot,
  TaskState,
  TaskStateMeta,
  TaskStep,
  TaskStepStatus
} from "./model";

const cancelableStates = new Set<TaskState>([
  "queued",
  "understanding",
  "planning",
  "executing",
  "synthesizing",
  "waiting_external",
  "waiting_user",
  "retrying"
]);

const backgroundableStates = new Set<TaskState>([
  "understanding",
  "planning",
  "executing",
  "synthesizing",
  "waiting_external",
  "retrying"
]);

const reviewableStates = new Set<TaskState>(["ready_for_review", "completed", "failed"]);

export const stateMeta: Record<TaskState, TaskStateMeta> = {
  queued: {
    label: "Queued",
    tone: "neutral",
    detail: "Waiting for a worker slot."
  },
  understanding: {
    label: "Understanding",
    tone: "accent",
    detail: "The agent is parsing scope and constraints."
  },
  planning: {
    label: "Planning",
    tone: "accent",
    detail: "Plan formation should be visible before deep work starts."
  },
  executing: {
    label: "Executing",
    tone: "accent",
    detail: "Live tools, sources, and task nodes are actively moving."
  },
  synthesizing: {
    label: "Synthesizing",
    tone: "accent",
    detail: "The system is converging into a reviewable draft."
  },
  waiting_external: {
    label: "Waiting External",
    tone: "warning",
    detail: "A dependency outside the app is blocking forward motion."
  },
  waiting_user: {
    label: "Waiting User",
    tone: "warning",
    detail: "User input is required before continuing."
  },
  retrying: {
    label: "Retrying",
    tone: "warning",
    detail: "The system is recovering from a failed tool or request."
  },
  backgrounded: {
    label: "Backgrounded",
    tone: "neutral",
    detail: "Work continues outside the current surface."
  },
  ready_for_review: {
    label: "Ready for Review",
    tone: "success",
    detail: "There is enough output to inspect before final completion."
  },
  completed: {
    label: "Completed",
    tone: "success",
    detail: "The task has fully finished."
  },
  failed: {
    label: "Failed",
    tone: "danger",
    detail: "Execution stopped and needs intervention."
  },
  cancelled: {
    label: "Cancelled",
    tone: "neutral",
    detail: "The task was intentionally stopped."
  }
};

function sortEvents(events: TaskEvent[]): TaskEvent[] {
  return [...events].sort((left, right) => {
    if (left.timestamp === right.timestamp) {
      return left.id.localeCompare(right.id);
    }

    return left.timestamp.localeCompare(right.timestamp);
  });
}

function defaultStep(stepId: string, label: string, order: number): TaskStep {
  return {
    id: stepId,
    label,
    description: "Implicitly discovered from task events.",
    order,
    status: "pending"
  };
}

function materializeStep(step: TaskStep, status: TaskStepStatus, timestamp: string): TaskStep {
  if (status === "active") {
    return { ...step, status, startedAt: step.startedAt ?? timestamp };
  }

  if (status === "completed") {
    return {
      ...step,
      status,
      startedAt: step.startedAt ?? timestamp,
      completedAt: timestamp
    };
  }

  if (status === "failed") {
    return {
      ...step,
      status,
      startedAt: step.startedAt ?? timestamp
    };
  }

  return { ...step, status };
}

export function reduceTaskEvents(events: TaskEvent[]): TaskSnapshot {
  const orderedEvents = sortEvents(events);
  const firstEvent = orderedEvents[0];

  if (!firstEvent) {
    return {
      taskId: "task_empty",
      state: "queued",
      title: "No task data",
      elapsedMs: 0,
      steps: [],
      feed: [],
      artifacts: [],
      canCancel: false,
      canBackground: false,
      canReview: false
    };
  }

  const steps = new Map<string, TaskStep>();
  const artifacts = new Map<string, NonNullable<TaskEvent["artifact"]>>();
  const feed: TaskFeedItem[] = [];
  let activeStepId: string | undefined;
  let title = firstEvent.title;
  let message = firstEvent.message;
  let state = firstEvent.state;
  let elapsedMs = firstEvent.elapsedMs ?? 0;

  orderedEvents.forEach((event) => {
    state = event.state;
    title = event.title;
    message = event.message ?? message;
    elapsedMs = event.elapsedMs ?? elapsedMs;

    if (event.steps?.length) {
      event.steps.forEach((step, index) => {
        steps.set(step.id, {
          ...step,
          order: index,
          status: steps.get(step.id)?.status ?? "pending",
          startedAt: steps.get(step.id)?.startedAt,
          completedAt: steps.get(step.id)?.completedAt
        });
      });
    }

    if (event.stepId && event.stepLabel && !steps.has(event.stepId)) {
      steps.set(event.stepId, defaultStep(event.stepId, event.stepLabel, steps.size));
    }

    if (event.type === "step_started" && event.stepId) {
      const current = steps.get(event.stepId);

      if (current) {
        steps.set(event.stepId, materializeStep(current, "active", event.timestamp));
      }

      activeStepId = event.stepId;
    }

    if (event.type === "step_completed" && event.stepId) {
      const current = steps.get(event.stepId);

      if (current) {
        steps.set(event.stepId, materializeStep(current, "completed", event.timestamp));
      }

      if (activeStepId === event.stepId) {
        activeStepId = undefined;
      }
    }

    if (event.type === "failed" && event.stepId) {
      const current = steps.get(event.stepId);

      if (current) {
        steps.set(event.stepId, materializeStep(current, "failed", event.timestamp));
      }
    }

    if (event.artifact) {
      artifacts.set(event.artifact.id, event.artifact);
    }

    feed.push({
      id: event.id,
      type: event.type,
      state: event.state,
      title: event.title,
      message: event.message,
      timestamp: event.timestamp,
      elapsedMs: event.elapsedMs
    });
  });

  if (activeStepId && reviewableStates.has(state)) {
    const current = steps.get(activeStepId);

    if (current && current.status === "active") {
      steps.set(activeStepId, materializeStep(current, "completed", orderedEvents.at(-1)?.timestamp ?? firstEvent.timestamp));
    }
  }

  return {
    taskId: firstEvent.taskId,
    state,
    title,
    message,
    elapsedMs,
    steps: [...steps.values()].sort((left, right) => left.order - right.order),
    activeStepId,
    feed,
    artifacts: [...artifacts.values()],
    canCancel: cancelableStates.has(state),
    canBackground: backgroundableStates.has(state),
    canReview: reviewableStates.has(state)
  };
}

export function getTaskSnapshot(events: TaskEvent[]): TaskSnapshot {
  return reduceTaskEvents(events);
}
