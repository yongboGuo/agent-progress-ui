import {
  createAgentRunStore,
  getAgentRunSnapshot,
  scenarioCatalog,
  type AgentRunSnapshot,
  type ScenarioKey
} from "@agent-progress-ui/core";
import { createMcpRunAdapter, createMockMcpTranscript, type McpEnvelope } from "@agent-progress-ui/mcp";

export const scenarioKeys = Object.keys(scenarioCatalog) as ScenarioKey[];

export function sliceScenarioEvents(scenarioKey: ScenarioKey, visibleCount: number) {
  const scenario = scenarioCatalog[scenarioKey];
  const count = Math.max(1, Math.min(visibleCount, scenario.events.length));

  return scenario.events.slice(0, count);
}

export function getScenarioSnapshot(scenarioKey: ScenarioKey, progress = 1): AgentRunSnapshot {
  const scenario = scenarioCatalog[scenarioKey];
  const count = Math.max(1, Math.ceil(scenario.events.length * progress));

  return getAgentRunSnapshot(sliceScenarioEvents(scenarioKey, count));
}

export function getRecommendedVisibleCount(scenarioKey: ScenarioKey) {
  const scenario = scenarioCatalog[scenarioKey];
  return Math.max(1, Math.ceil(scenario.events.length * scenario.recommendedProgress));
}

export function createScenarioStore(scenarioKey: ScenarioKey) {
  return createAgentRunStore(sliceScenarioEvents(scenarioKey, 1));
}

export function getMcpDemo(profile: "research-agent" | "code-agent") {
  const transcript = createMockMcpTranscript(profile);
  const adapter = createMcpRunAdapter({
    initialEnvelopes: transcript
  });

  return {
    adapter,
    debugEntries: adapter.getDebugEntries(),
    snapshot: adapter.getSnapshot(),
    transcript
  };
}

export function getMcpTranscriptSlice(transcript: McpEnvelope[], visibleCount: number) {
  const count = Math.max(1, Math.min(visibleCount, transcript.length));
  return transcript.slice(0, count);
}

export const architecturePoints = [
  {
    title: "Normalized runtime model",
    body: "Every long-running agent run collapses into the same six visible regions: header, stage rail, timeline, evidence, artifacts, and approvals."
  },
  {
    title: "Thin MCP adapter",
    body: "MCP envelopes are mapped into run events without leaking transport details into the UI layer."
  },
  {
    title: "Live store first",
    body: "The demo now shows static transcripts, incremental store updates, and adapter-fed snapshots side by side."
  }
] as const;

export const comparisonRows = [
  {
    label: "Spinner shell",
    value: "One loading state for every execution mode.",
    result: "No durable context, no review path, no approvals."
  },
  {
    label: "Chat shell",
    value: "A linear message list with hidden tool state.",
    result: "Better than a spinner, but weak for wait states and audit trails."
  },
  {
    label: "Runtime workbench",
    value: "Stages, evidence, approvals, artifacts, and timeline are first-class.",
    result: "Operators can understand, leave, return, and review without losing trust."
  }
] as const;

export const implementationNotes = [
  {
    title: "Store-driven rendering",
    body: "The React package now renders from `snapshot` or `store`, not from ad hoc demo data."
  },
  {
    title: "Approval-first control surface",
    body: "Human checkpoints are visible in the main workbench instead of being hidden inside generic feed entries."
  },
  {
    title: "MCP-ready transcript flow",
    body: "The adapter demo proves the UI can be driven by normalized MCP envelopes rather than marketing-only mock state."
  }
] as const;
