import { getTaskSnapshot, scenarioCatalog, type ScenarioKey, taskStates } from "@agent-progress-ui/core";

export const scenarioKeys = Object.keys(scenarioCatalog) as ScenarioKey[];
export const allTaskStates = taskStates;

export function sliceScenarioEvents(scenarioKey: ScenarioKey, visibleCount: number) {
  const scenario = scenarioCatalog[scenarioKey];
  const count = Math.max(1, Math.min(visibleCount, scenario.events.length));

  return scenario.events.slice(0, count);
}

export function getScenarioSnapshot(scenarioKey: ScenarioKey, progress = 1) {
  const scenario = scenarioCatalog[scenarioKey];
  const count = Math.max(1, Math.ceil(scenario.events.length * progress));

  return getTaskSnapshot(sliceScenarioEvents(scenarioKey, count));
}

export function getRecommendedVisibleCount(scenarioKey: ScenarioKey) {
  const scenario = scenarioCatalog[scenarioKey];
  return Math.max(1, Math.ceil(scenario.events.length * scenario.recommendedProgress));
}

export const proofPoints = [
  {
    title: "Liveness Layer",
    body: "Every task proves the system is still alive without turning the interface into a spinner prison."
  },
  {
    title: "Stage Layer",
    body: "Progress is communicated as a stable sequence of stages instead of fake percentages."
  },
  {
    title: "Evidence Layer",
    body: "Users see sources, tools, drafts, and artifacts as they appear, which is how trust is actually built."
  }
];

export const antiPatterns = [
  "A single spinner that runs for 30 seconds with no evidence.",
  "A fake 64% progress bar for work that depends on external sources or tools.",
  "One visual treatment for executing, waiting on rate limits, and waiting on the user."
];
