import { describe, expect, it } from "vitest";

import { createAgentRunStore, getAgentRunSnapshot, reduceAgentRunEvents, scenarioCatalog } from "../src";

describe("reduceAgentRunEvents", () => {
  it("returns a completed research snapshot with artifacts and evidence", () => {
    const snapshot = reduceAgentRunEvents(scenarioCatalog["research-agent"].events);

    expect(snapshot.header.status).toBe("completed");
    expect(snapshot.stageRail.steps).toHaveLength(4);
    expect(snapshot.artifacts.map((artifact) => artifact.type)).toEqual(["bundle", "memo"]);
    expect(snapshot.evidence.resources[0]?.kind).toBe("source");
  });

  it("aggregates tool outputs and preserves background execution state", () => {
    const snapshot = getAgentRunSnapshot(scenarioCatalog["code-agent"].events.slice(0, 16));

    expect(snapshot.header.status).toBe("backgrounded");
    expect(snapshot.evidence.tools).toHaveLength(3);
    expect(snapshot.evidence.tools.find((tool) => tool.id === "tool-test")?.outputs[0]?.summary).toMatch(/All targeted tests passed/i);
  });

  it("surfaces approvals as a first-class run section", () => {
    const snapshot = getAgentRunSnapshot(scenarioCatalog["approval-handoff"].events.slice(0, 6));

    expect(snapshot.header.status).toBe("approval");
    expect(snapshot.approvals[0]?.status).toBe("pending");
    expect(snapshot.timeline.some((item) => item.kind === "approval")).toBe(true);
  });

  it("keeps failed runs reviewable and marks the active step as failed", () => {
    const failedFlow = [
      ...scenarioCatalog["code-agent"].events.slice(0, 13),
      {
        id: "code-failed",
        runId: "run_code_01",
        type: "run.failed" as const,
        timestamp: "2026-06-14T09:00:28.000Z",
        title: "Verification failed",
        message: "A smoke test timed out.",
        elapsedMs: 28_000,
        error: "Smoke test timed out."
      }
    ];

    const snapshot = reduceAgentRunEvents(failedFlow);

    expect(snapshot.header.status).toBe("failed");
    expect(snapshot.stageRail.steps.find((step) => step.id === "verify")?.status).toBe("failed");
    expect(snapshot.artifacts.map((artifact) => artifact.type)).toContain("diff");
  });

  it("replays events through a live store", () => {
    const events = scenarioCatalog["approval-handoff"].events;
    const store = createAgentRunStore(events.slice(0, 2));

    store.append(events[2]);
    store.append(events.slice(3));

    expect(store.getSnapshot().header.status).toBe("completed");
    expect(store.getSnapshot().approvals[0]?.status).toBe("approved");
  });
});
