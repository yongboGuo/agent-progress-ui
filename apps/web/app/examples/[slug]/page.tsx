import { getAgentRunSnapshot, scenarioCatalog, type ScenarioKey } from "@agent-progress-ui/core";
import { AgentWorkbench } from "@agent-progress-ui/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "../../../components/app-header";
import { SiteFooter } from "../../../components/site-footer";

const validSlugs = Object.keys(scenarioCatalog) as ScenarioKey[];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!validSlugs.includes(slug as ScenarioKey)) {
    return {};
  }

  const scenario = scenarioCatalog[slug as ScenarioKey];

  return {
    title: `${scenario.name} · agent-progress-ui`,
    description: scenario.description
  };
}

export default async function ExamplePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!validSlugs.includes(slug as ScenarioKey)) {
    notFound();
  }

  const scenario = scenarioCatalog[slug as ScenarioKey];
  const snapshot = getAgentRunSnapshot(scenario.events);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="section-shell py-14 md:py-20">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/playground" className="transition hover:text-white">
            Playground
          </Link>
          <span>/</span>
          <span className="text-white">{scenario.name}</span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
          <div>
            <p className="section-label">Example route</p>
            <h1 className="section-title">{scenario.name}</h1>
            <p className="section-copy">{scenario.description}</p>

            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Why this profile matters</p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-white/70">
                <li>The run header explains the current phase without hiding the timeline.</li>
                <li>Evidence and artifacts stay visible while the run is still active.</li>
                <li>Approval and wait states are explicit operational states, not message copy.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">Full runtime transcript</p>
              <div className="mt-5 space-y-5">
                {scenario.events.map((event) => (
                  <div key={event.id} className="border-b border-white/6 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <strong className="text-base text-white">{event.title}</strong>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/55">
                        {event.type}
                      </span>
                    </div>
                    {event.message ? <p className="mt-2 text-sm leading-7 text-white/62">{event.message}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
            data-testid="example-preview"
          >
            <AgentWorkbench snapshot={snapshot} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
