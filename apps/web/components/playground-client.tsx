"use client";

import { scenarioCatalog, type ScenarioKey } from "@agent-progress-ui/core";
import { TaskWorkbench, createTaskThemeStyle } from "@agent-progress-ui/react";
import { motion } from "framer-motion";
import { startTransition, useState } from "react";

import { getRecommendedVisibleCount, getScenarioSnapshot, scenarioKeys, sliceScenarioEvents } from "../lib/scenarios";

export function PlaygroundClient() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("agent");
  const [visibleCount, setVisibleCount] = useState(getRecommendedVisibleCount("agent"));

  const scenario = scenarioCatalog[scenarioKey];
  const snapshot = getScenarioSnapshot(scenarioKey, visibleCount / scenario.events.length);
  const events = sliceScenarioEvents(scenarioKey, visibleCount);
  const latestEvent = events.at(-1);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Scenario</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {scenarioKeys.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setScenarioKey(item);
                    setVisibleCount(getRecommendedVisibleCount(item));
                  });
                }}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  item === scenarioKey
                    ? "border-[var(--accent)] bg-[rgba(215,255,105,0.1)] text-[var(--accent)]"
                    : "border-white/12 bg-transparent text-white/65 hover:border-white/24 hover:text-white"
                }`}
              >
                {scenarioCatalog[item].name}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-white">Visible event count</p>
              <span className="text-sm text-white/55">
                {visibleCount} / {scenario.events.length}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={scenario.events.length}
              value={visibleCount}
              onChange={(event) => setVisibleCount(Number(event.target.value))}
              className="mt-4 w-full accent-[var(--accent)]"
            />
            <p className="mt-4 text-sm leading-7 text-white/64">{scenario.description}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Latest event</p>
          <pre className="mt-4 overflow-x-auto rounded-[20px] border border-white/10 bg-[#0c1118] p-4 text-xs leading-6 text-white/75">
            {JSON.stringify(latestEvent, null, 2)}
          </pre>
        </div>
      </div>

      <motion.div
        key={`${scenarioKey}-${visibleCount}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
        data-testid="playground-preview"
      >
        <TaskWorkbench
          snapshot={snapshot}
          headline={scenario.name}
          subhead={scenario.strapline}
          style={createTaskThemeStyle()}
        />
      </motion.div>
    </div>
  );
}
