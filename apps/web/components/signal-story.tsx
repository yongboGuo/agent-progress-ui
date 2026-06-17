import { getAgentRunSnapshot, scenarioCatalog } from "@agent-progress-ui/core";

import { architecturePoints, implementationNotes } from "../lib/scenarios";

const codeScenario = scenarioCatalog["code-agent"];
const codeSnapshot = getAgentRunSnapshot(codeScenario.events);

export function SignalStory() {
  return (
    <section className="section-shell py-18 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-8">
          <div>
            <p className="section-label">Runtime model</p>
            <h2 className="section-title">Treat the agent run as a product surface.</h2>
            <p className="section-copy">
              The library is now organized around a concrete runtime model: one run header, one visible stage rail,
              one ordered timeline, and explicit evidence, approvals, and artifacts.
            </p>
          </div>

          <div className="space-y-6 border-y border-white/10 py-6">
            {architecturePoints.map((item) => (
              <div key={item.title} className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">{item.title}</p>
                <p className="max-w-xl text-base leading-8 text-white/70">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5">
            {implementationNotes.map((item) => (
              <div key={item.title} className="border-t border-white/10 pt-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/42">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/58">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Reference run</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{codeScenario.name}</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/62">{codeScenario.strapline}</p>
            </div>
            <div className="rounded-full border border-emerald-300/20 bg-emerald-300/7 px-4 py-2 text-xs uppercase tracking-[0.22em] text-emerald-200">
              {codeSnapshot.header.status}
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="space-y-4">
              {codeSnapshot.stageRail.steps.map((step) => {
                const isActive = step.id === codeSnapshot.stageRail.activeStepId || step.status === "active";

                return (
                  <div
                    key={step.id}
                    className={`rounded-[24px] border px-5 py-4 transition ${
                      isActive
                        ? "border-[var(--accent)]/35 bg-[rgba(215,255,105,0.09)]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <strong className="text-base text-white">{step.label}</strong>
                      <span className="text-xs uppercase tracking-[0.22em] text-white/42">{step.status}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/62">{step.detail ?? step.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              {codeSnapshot.evidence.entries.slice(0, 5).map((entry, index) => (
                <div key={entry.id} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-white/38">Evidence {String(index + 1).padStart(2, "0")}</p>
                      <strong className="mt-2 block text-lg text-white">{entry.title}</strong>
                    </div>
                    <span className="text-xs uppercase tracking-[0.22em] text-white/38">{entry.kind}</span>
                  </div>
                  {entry.detail ? <p className="mt-3 text-sm leading-7 text-white/62">{entry.detail}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
