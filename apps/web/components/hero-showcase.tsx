"use client";

import { scenarioCatalog, type ScenarioKey } from "@agent-progress-ui/core";
import { TaskWorkbench, createTaskThemeStyle } from "@agent-progress-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getScenarioSnapshot } from "../lib/scenarios";

const featuredScenarios: ScenarioKey[] = ["chat", "research", "agent"];

export function HeroShowcase() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("agent");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScenarioKey((current) => {
        const index = featuredScenarios.indexOf(current);
        return featuredScenarios[(index + 1) % featuredScenarios.length];
      });
    }, 4_800);

    return () => window.clearInterval(interval);
  }, []);

  const scenario = scenarioCatalog[scenarioKey];
  const snapshot = getScenarioSnapshot(scenarioKey, scenario.recommendedProgress);

  return (
    <section className="relative overflow-hidden px-6 pb-18 pt-14 md:px-10 md:pb-28 md:pt-18">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(215,255,105,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(83,140,255,0.18),transparent_34%),linear-gradient(180deg,#0b0e14_0%,#0f131a_48%,#121923_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] opacity-40" />

      <div className="mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent)]">Mission Control for Long-Running AI</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl">
            Replace vague loading with a real task workbench.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">
            `agent-progress-ui` is an open-source React UI system for deep research, code agents, and long-running
            AI tasks. Show liveness, stages, and proof instead of trapping users behind a spinner.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#101410] transition hover:translate-y-[-1px]"
            >
              Run playground
            </Link>
            <a
              href="https://github.com/yongboGuo/agent-progress-ui"
              className="inline-flex items-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white/84 transition hover:border-white/24 hover:text-white"
            >
              View repository
            </a>
          </div>
          <div className="mt-10 grid gap-5 text-sm text-white/62 md:grid-cols-3">
            <div>
              <p className="font-semibold text-white">Liveness</p>
              <p className="mt-2 leading-6">Always prove the task is still alive.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Stages</p>
              <p className="mt-2 leading-6">Stable checkpoints instead of fake progress bars.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Evidence</p>
              <p className="mt-2 leading-6">Sources, tools, drafts, and reviewable artifacts.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          key={scenarioKey}
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative"
          data-testid="hero-preview"
        >
          <div className="mb-4 flex flex-wrap gap-3">
            {featuredScenarios.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setScenarioKey(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  item === scenarioKey
                    ? "border-[var(--accent)] bg-[rgba(215,255,105,0.1)] text-[var(--accent)]"
                    : "border-white/10 bg-white/4 text-white/60 hover:text-white"
                }`}
              >
                {scenarioCatalog[item].name}
              </button>
            ))}
          </div>
          <div className="rounded-[34px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-black/18 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">Live Scenario</p>
                <strong className="mt-2 block text-xl text-white">{scenario.name}</strong>
                <p className="mt-2 text-sm text-white/62">{scenario.strapline}</p>
              </div>
              <div className="hidden h-16 w-16 rounded-full border border-[var(--accent)]/30 bg-[radial-gradient(circle,rgba(215,255,105,0.22),transparent_70%)] md:block" />
            </div>
            <TaskWorkbench snapshot={snapshot} style={createTaskThemeStyle()} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
