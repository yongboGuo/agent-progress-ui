"use client";

import { scenarioCatalog, type ScenarioKey } from "@agent-progress-ui/core";
import { AgentWorkbench, createAgentThemeStyle } from "@agent-progress-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getScenarioSnapshot } from "../lib/scenarios";
import { runWithViewTransition } from "../lib/view-transition";

const featuredScenarios: ScenarioKey[] = ["research-agent", "code-agent", "approval-handoff"];

export function HeroShowcase() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("code-agent");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScenarioKey((current) => {
        const index = featuredScenarios.indexOf(current);
        return featuredScenarios[(index + 1) % featuredScenarios.length];
      });
    }, 5_200);

    return () => window.clearInterval(interval);
  }, []);

  const scenario = scenarioCatalog[scenarioKey];
  const snapshot = getScenarioSnapshot(scenarioKey, scenario.recommendedProgress);
  const latestSignals = snapshot.timeline.slice(-4).reverse();
  const pendingApproval = snapshot.approvals.find((approval) => approval.status === "pending");

  return (
    <section className="hero-shell relative overflow-hidden">
      <div className="hero-backdrop" />
      <div className="hero-grid-lines" />

      <div className="hero-inner">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent)]">agent-progress-ui</p>
            <p className="mt-5 max-w-md text-xs uppercase tracking-[0.32em] text-white/42">MCP-first runtime visibility kit</p>
            <h1 className="mt-4 max-w-4xl text-[clamp(3.2rem,10vw,7.4rem)] leading-[0.92] font-semibold tracking-[-0.08em] text-white">
              Build agent workbenches, not generic loading shells.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">
              A React runtime UI kit for long-running agents. Surface plan, wait states, approvals, tools, evidence,
              and artifacts in a single inspectable workbench.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#101410] transition hover:translate-y-[-1px]"
            >
              Open reference app
            </Link>
            <a
              href="https://github.com/yongboGuo/agent-progress-ui"
              className="inline-flex items-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white/84 transition hover:border-white/24 hover:text-white"
            >
              View repository
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
            className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Current run</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{scenario.name}</p>
              <p className="mt-2 text-sm leading-7 text-white/58">{scenario.strapline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Current phase</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{snapshot.header.currentPhase}</p>
              <p className="mt-2 text-sm leading-7 text-white/58">{snapshot.header.summary}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Control path</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
                {pendingApproval ? pendingApproval.label : `${snapshot.artifacts.length} artifacts ready`}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/58">
                {pendingApproval
                  ? "Approvals block the run in the main surface instead of hiding inside a feed."
                  : "Artifacts remain visible as first-class output, not as afterthoughts."}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: "easeOut" }}
          className="hero-stage"
        >
          <div className="rounded-[32px] border border-white/10 bg-[rgba(9,12,18,0.82)] p-4 shadow-[0_32px_110px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="grid gap-4 border-b border-white/10 pb-4 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Runtime profiles</p>
                    <strong className="mt-3 block text-2xl tracking-[-0.05em] text-white">{scenario.name}</strong>
                  </div>
                  <span className="rounded-full bg-[rgba(215,255,105,0.1)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                    {snapshot.header.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/60">{scenario.description}</p>

                <div className="mt-5 space-y-2">
                  {featuredScenarios.map((item) => {
                    const isActive = item === scenarioKey;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => runWithViewTransition(() => setScenarioKey(item))}
                        className={`relative flex w-full items-center justify-between overflow-hidden rounded-[18px] border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-[var(--accent)]/35 bg-[rgba(215,255,105,0.09)] text-white"
                            : "border-white/10 bg-white/[0.02] text-white/62 hover:text-white"
                        }`}
                      >
                        <span className="relative z-10">
                          <span className="block text-sm font-semibold">{scenarioCatalog[item].name}</span>
                          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-white/42">
                            {scenarioCatalog[item].events.length} runtime events
                          </span>
                        </span>
                        {isActive ? (
                          <motion.span
                            layoutId="scenario-pill"
                            className="absolute inset-0 rounded-[18px] border border-[var(--accent)]/30"
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Timeline tape</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">{snapshot.timeline.length} events</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={scenarioKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="mt-4 space-y-4"
                  >
                    {latestSignals.map((item, index) => (
                      <div key={item.id} className="border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/32">Signal {String(index + 1).padStart(2, "0")}</p>
                            <strong className="mt-2 block text-base text-white">{item.title}</strong>
                          </div>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-white/32">{item.kind}</span>
                        </div>
                        {item.detail ? <p className="mt-2 text-sm leading-7 text-white/58">{item.detail}</p> : null}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4" style={{ viewTransitionName: "hero-workbench" }} data-testid="hero-preview">
              <AgentWorkbench snapshot={snapshot} style={createAgentThemeStyle()} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
