import { describe, expect, it } from "vitest";

import { getTaskSnapshot, reduceTaskEvents, scenarioCatalog } from "../src";

describe("reduceTaskEvents", () => {
  it("returns a completed chat snapshot", () => {
    const snapshot = reduceTaskEvents(scenarioCatalog.chat.events);

    expect(snapshot.state).toBe("completed");
    expect(snapshot.steps).toHaveLength(3);
    expect(snapshot.steps.at(-1)?.status).toBe("pending");
    expect(snapshot.canCancel).toBe(false);
    expect(snapshot.artifacts).toHaveLength(1);
  });

  it("keeps research flows reviewable and backgroundable where appropriate", () => {
    const researchEvents = scenarioCatalog.research.events.slice(0, 12);
    const snapshot = getTaskSnapshot(researchEvents);

    expect(snapshot.state).toBe("synthesizing");
    expect(snapshot.canBackground).toBe(true);
    expect(snapshot.canReview).toBe(false);
    expect(snapshot.artifacts[0]?.type).toBe("outline");
  });

  it("exposes review mode and preserves artifacts on agent flows", () => {
    const snapshot = getTaskSnapshot(scenarioCatalog.agent.events);

    expect(snapshot.state).toBe("ready_for_review");
    expect(snapshot.canReview).toBe(true);
    expect(snapshot.artifacts.map((artifact) => artifact.type)).toEqual(["diff", "bundle"]);
    expect(snapshot.steps.find((step) => step.id === "agent-verify")?.status).toBe("completed");
  });

  it("marks failed steps when the failing event identifies a step", () => {
    const failedFlow = [
      ...scenarioCatalog.agent.events.slice(0, 10),
      {
        id: "agent-failed",
        taskId: "task_agent_01",
        type: "failed" as const,
        state: "failed" as const,
        timestamp: "2026-04-29T09:02:10.000Z",
        title: "Verification failed",
        message: "A smoke test timed out.",
        stepId: "agent-implement",
        stepLabel: "Apply changes",
        elapsedMs: 130_000
      }
    ];

    const snapshot = reduceTaskEvents(failedFlow);

    expect(snapshot.state).toBe("failed");
    expect(snapshot.steps.find((step) => step.id === "agent-implement")?.status).toBe("failed");
  });
});
