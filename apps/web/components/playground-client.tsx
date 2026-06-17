"use client";

import { createAgentRunStore, scenarioCatalog, type ScenarioKey } from "@agent-progress-ui/core";
import { AgentWorkbench, createAgentThemeStyle } from "@agent-progress-ui/react";
import { createMcpRunAdapter, createMockMcpTranscript } from "@agent-progress-ui/mcp";
import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { getMcpTranscriptSlice, getRecommendedVisibleCount, getScenarioSnapshot, scenarioKeys, sliceScenarioEvents } from "../lib/scenarios";
import { runWithViewTransition } from "../lib/view-transition";

type PlaygroundMode = "mock" | "live" | "mcp";

const modeLabels: Record<PlaygroundMode, string> = {
  mock: "Mock transcript",
  live: "Live store inspector",
  mcp: "MCP adapter demo"
};

export function PlaygroundClient() {
  const [mode, setMode] = useState<PlaygroundMode>("mock");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("code-agent");
  const [visibleCount, setVisibleCount] = useState(getRecommendedVisibleCount("code-agent"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveIndex, setLiveIndex] = useState(1);
  const [liveStore, setLiveStore] = useState(() => createAgentRunStore(sliceScenarioEvents("code-agent", 1)));
  const [mcpProfile, setMcpProfile] = useState<"research-agent" | "code-agent">("code-agent");
  const [visibleEnvelopeCount, setVisibleEnvelopeCount] = useState(createMockMcpTranscript("code-agent").length);

  const scenario = scenarioCatalog[scenarioKey];
  const deferredVisibleCount = useDeferredValue(visibleCount);
  const mockSnapshot = getScenarioSnapshot(scenarioKey, deferredVisibleCount / scenario.events.length);
  const mockEvents = sliceScenarioEvents(scenarioKey, deferredVisibleCount);
  const latestEvent = mockEvents.at(-1);

  useEffect(() => {
    if (mode !== "live" || !isPlaying) {
      return;
    }

    const scenarioEvents = scenarioCatalog[scenarioKey].events;

    if (liveIndex >= scenarioEvents.length) {
      setIsPlaying(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        liveStore.append(scenarioEvents[liveIndex]);
        setLiveIndex((current) => current + 1);
      });
    }, 1_200);

    return () => window.clearTimeout(timeout);
  }, [isPlaying, liveIndex, liveStore, mode, scenarioKey]);

  const liveSnapshot = liveStore.getSnapshot();
  const transcript = createMockMcpTranscript(mcpProfile);
  const visibleTranscript = getMcpTranscriptSlice(transcript, visibleEnvelopeCount);
  const adapter = createMcpRunAdapter({
    initialEnvelopes: visibleTranscript
  });
  const mcpSnapshot = adapter.getSnapshot();
  const latestEnvelope = visibleTranscript.at(-1);

  const activeSnapshot = mode === "mock" ? mockSnapshot : mode === "live" ? liveSnapshot : mcpSnapshot;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
      <div className="space-y-6">
        <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Mode</p>
          <div className="mt-5 space-y-3">
            {(["mock", "live", "mcp"] as PlaygroundMode[]).map((item) => {
              const isActive = item === mode;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => runWithViewTransition(() => setMode(item))}
                  className={`relative flex w-full items-center justify-between overflow-hidden rounded-[22px] border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-[var(--accent)]/35 bg-[rgba(215,255,105,0.09)] text-white"
                      : "border-white/10 bg-white/[0.02] text-white/68 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">
                    <span className="block text-base font-semibold">{modeLabels[item]}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-white/40">
                      {item === "mock"
                        ? "Static transcript slices"
                        : item === "live"
                          ? "Incremental store updates"
                          : "Normalized MCP envelopes"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {mode !== "mcp" ? (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Runtime profile</p>
            <div className="mt-5 space-y-3">
              {scenarioKeys.map((item) => {
                const isActive = item === scenarioKey;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      runWithViewTransition(() => {
                        setScenarioKey(item);
                        setVisibleCount(getRecommendedVisibleCount(item));
                        setLiveIndex(1);
                        setIsPlaying(false);
                        setLiveStore(createAgentRunStore(sliceScenarioEvents(item, 1)));
                      })
                    }
                    className={`relative flex w-full items-center justify-between overflow-hidden rounded-[22px] border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-[var(--accent)]/35 bg-[rgba(215,255,105,0.09)] text-white"
                        : "border-white/10 bg-white/[0.02] text-white/68 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">
                      <span className="block text-base font-semibold">{scenarioCatalog[item].name}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-white/40">
                        {scenarioCatalog[item].strapline}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {mode === "mock" ? (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Transcript slice</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">Visible runtime events</h2>
              </div>
              <span className="text-sm text-white/52">
                {visibleCount} / {scenario.events.length}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={scenario.events.length}
              value={visibleCount}
              onChange={(event) => setVisibleCount(Number(event.target.value))}
              className="mt-6 w-full accent-[var(--accent)]"
            />
            <p className="mt-4 text-sm leading-7 text-white/62">{scenario.description}</p>
          </section>
        ) : null}

        {mode === "live" ? (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Live store</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">Incremental store replay</h2>
              </div>
              <span className="text-sm text-white/52">
                {liveIndex} / {scenario.events.length}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[#101410]"
              >
                {isPlaying ? "Pause replay" : "Play replay"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setLiveIndex(1);
                  setLiveStore(createAgentRunStore(sliceScenarioEvents(scenarioKey, 1)));
                }}
                className="rounded-full border border-white/12 px-5 py-2 text-sm text-white/80"
              >
                Reset
              </button>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/62">
              This mode replays the same transcript through a live store so you can inspect how the workbench responds
              to incremental events instead of full snapshots.
            </p>
          </section>
        ) : null}

        {mode === "mcp" ? (
          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">MCP adapter</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">Envelope-driven snapshot</h2>
              </div>
              <span className="text-sm text-white/52">
                {visibleEnvelopeCount} / {transcript.length}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {(["research-agent", "code-agent"] as const).map((profile) => (
                <button
                  key={profile}
                  type="button"
                  onClick={() => {
                    setMcpProfile(profile);
                    setVisibleEnvelopeCount(createMockMcpTranscript(profile).length);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    profile === mcpProfile
                      ? "border-[var(--accent)] bg-[rgba(215,255,105,0.1)] text-[var(--accent)]"
                      : "border-white/10 bg-white/[0.02] text-white/65"
                  }`}
                >
                  {profile}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={1}
              max={transcript.length}
              value={visibleEnvelopeCount}
              onChange={(event) => setVisibleEnvelopeCount(Number(event.target.value))}
              className="mt-6 w-full accent-[var(--accent)]"
            />
            <p className="mt-4 text-sm leading-7 text-white/62">
              The adapter mode normalizes MCP envelopes into the core runtime model without leaking transport details
              into the UI layer.
            </p>
          </section>
        ) : null}

        <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">
            {mode === "mcp" ? "Latest envelope" : "Latest event"}
          </p>
          <AnimatePresence mode="wait">
            <motion.pre
              key={`${mode}-${scenarioKey}-${mcpProfile}-${deferredVisibleCount}-${visibleEnvelopeCount}-${liveIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="mt-4 overflow-x-auto rounded-[22px] border border-white/10 bg-[#0c1118] p-4 text-xs leading-6 text-white/75"
            >
              {JSON.stringify(mode === "mcp" ? latestEnvelope : latestEvent, null, 2)}
            </motion.pre>
          </AnimatePresence>
        </section>
      </div>

      <motion.div
        key={`${mode}-${scenarioKey}-${mcpProfile}-${deferredVisibleCount}-${visibleEnvelopeCount}-${liveIndex}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-[34px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
        style={{ viewTransitionName: "playground-workbench" }}
        data-testid="playground-preview"
      >
        <AgentWorkbench snapshot={activeSnapshot} style={createAgentThemeStyle()} />
      </motion.div>
    </div>
  );
}
