import { agentStatusMeta, scenarioCatalog } from "@agent-progress-ui/core";
import Link from "next/link";

import { AppHeader } from "../components/app-header";
import { HeroShowcase } from "../components/hero-showcase";
import { SignalStory } from "../components/signal-story";
import { SiteFooter } from "../components/site-footer";
import { TrendRadar } from "../components/trend-radar";
import { architecturePoints, implementationNotes } from "../lib/scenarios";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>
        <HeroShowcase />

        <section className="section-shell py-18 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div>
              <p className="section-label">Why this exists</p>
              <h2 className="section-title">Long-running agents need runtime visibility, not generic chat chrome.</h2>
            </div>
            <div className="space-y-6">
              <p className="section-copy mt-0 max-w-none">
                Once a run spans multiple tools, waits on people, or creates reviewable output, a single spinner or chat
                thread stops being enough. This repo now treats the run itself as the product surface.
              </p>
              <div className="grid gap-4">
                {implementationNotes.map((item) => (
                  <div key={item.title} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-lg leading-8 text-white/74">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/58">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SignalStory />

        <section className="section-shell py-18 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="section-label">Public surface</p>
              <h2 className="section-title">One runtime model across static, live, and MCP-fed runs.</h2>
              <p className="section-copy">
                The library now ships a normalized run model, a live store, a composable React workbench, and an MCP
                adapter that maps envelopes into the same operator surface.
              </p>
            </div>
            <div className="grid gap-4">
              {architecturePoints.map((point) => (
                <div key={point.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.26em] text-[var(--accent)]">{point.title}</p>
                  <p className="mt-4 text-lg leading-8 text-white/76">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TrendRadar />

        <section className="section-shell py-18 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="section-label">Run states</p>
              <h2 className="section-title">A visible run status should explain what the operator can do next.</h2>
              <p className="section-copy">
                The new core model keeps statuses compact and operational: queued, planning, running, waiting,
                approval, backgrounded, completed, and failed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {Object.entries(agentStatusMeta).map(([state, meta]) => (
                  <span
                    key={state}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      meta.tone === "accent"
                        ? "border-[var(--accent)]/28 bg-[rgba(215,255,105,0.08)] text-[var(--accent)]"
                        : meta.tone === "success"
                          ? "border-emerald-300/22 bg-emerald-400/6 text-emerald-200"
                          : meta.tone === "warning"
                            ? "border-amber-200/18 bg-amber-300/6 text-amber-100"
                            : meta.tone === "danger"
                              ? "border-rose-200/18 bg-rose-300/7 text-rose-100"
                              : "border-white/10 bg-white/3 text-white/65"
                    }`}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Normalized event sample</p>
              <pre className="mt-5 overflow-x-auto rounded-[22px] border border-white/10 bg-[#0c1118] p-5 text-xs leading-7 text-white/74">
                {JSON.stringify(scenarioCatalog["code-agent"].events.at(-1), null, 2)}
              </pre>
            </div>
          </div>
        </section>

        <section className="section-shell py-18 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Examples</p>
              <h2 className="section-title">Reference runs for research, code work, and approval handoff.</h2>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#101410]"
            >
              Open reference app
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(["research-agent", "code-agent", "approval-handoff"] as const).map((key) => (
              <Link
                key={key}
                href={`/examples/${key}`}
                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/18 hover:bg-white/6"
              >
                <p className="text-sm uppercase tracking-[0.26em] text-white/45">Example</p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white group-hover:text-[var(--accent)]">
                  {scenarioCatalog[key].name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{scenarioCatalog[key].strapline}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
