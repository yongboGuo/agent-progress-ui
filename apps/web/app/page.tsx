import { scenarioCatalog, stateMeta } from "@agent-progress-ui/core";
import Link from "next/link";

import { AppHeader } from "../components/app-header";
import { HeroShowcase } from "../components/hero-showcase";
import { SiteFooter } from "../components/site-footer";
import { allTaskStates, antiPatterns, proofPoints } from "../lib/scenarios";

const exampleEvent = scenarioCatalog.agent.events[scenarioCatalog.agent.events.length - 1];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>
        <HeroShowcase />

        <section className="section-shell py-18 md:py-24">
          <p className="section-label">Why this exists</p>
          <h2 className="section-title">Long-running AI work needs observability, not decoration.</h2>
          <p className="section-copy">
            Once a task crosses the 10-second mark, users stop asking “is this pretty?” and start asking “is this
            alive?”, “what is it doing?”, and “can I safely leave?”. This project turns those questions into reusable
            UI primitives.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {antiPatterns.map((item) => (
              <div key={item} className="surface-panel rounded-[24px] p-6">
                <p className="text-sm uppercase tracking-[0.26em] text-white/45">Anti-pattern</p>
                <p className="mt-5 text-lg leading-8 text-white/78">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell py-18 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="section-label">Three layers</p>
              <h2 className="section-title">A system, not a spinner.</h2>
              <p className="section-copy">
                The package is organized around the three surfaces that matter in long-running AI experiences: keep the
                task alive, show the stage, and emit proof as the system learns or changes the world.
              </p>
            </div>
            <div className="grid gap-4">
              {proofPoints.map((point) => (
                <div key={point.title} className="surface-panel rounded-[28px] p-6">
                  <p className="text-sm uppercase tracking-[0.26em] text-[var(--accent)]">{point.title}</p>
                  <p className="mt-4 text-lg leading-8 text-white/76">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell py-18 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="section-label">State machine</p>
              <h2 className="section-title">Stable states are more trustworthy than fake percentages.</h2>
              <p className="section-copy">
                `agent-progress-ui` ships with a fixed state machine, reducer, and scenario catalog so teams can design
                around real execution phases instead of ambiguous “thinking” copy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {allTaskStates.map((state) => (
                  <span
                    key={state}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      stateMeta[state].tone === "accent"
                        ? "border-[var(--accent)]/28 bg-[rgba(215,255,105,0.08)] text-[var(--accent)]"
                        : stateMeta[state].tone === "success"
                          ? "border-emerald-300/22 bg-emerald-400/6 text-emerald-200"
                          : stateMeta[state].tone === "warning"
                            ? "border-amber-200/18 bg-amber-300/6 text-amber-100"
                            : stateMeta[state].tone === "danger"
                              ? "border-rose-200/18 bg-rose-300/7 text-rose-100"
                              : "border-white/10 bg-white/3 text-white/65"
                    }`}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Event schema sample</p>
              <pre className="mt-5 overflow-x-auto rounded-[22px] border border-white/10 bg-[#0c1118] p-5 text-xs leading-7 text-white/74">
                {JSON.stringify(exampleEvent, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        <section className="section-shell py-18 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Examples</p>
              <h2 className="section-title">Use the same system across chat, research, and agents.</h2>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#101410]"
            >
              Open playground
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(["chat", "research", "agent"] as const).map((key) => (
              <Link
                key={key}
                href={`/examples/${key}`}
                className="surface-panel group rounded-[28px] p-6 transition hover:border-white/18 hover:bg-white/6"
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
