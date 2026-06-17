import { comparisonRows } from "../lib/scenarios";

export function TrendRadar() {
  return (
    <section className="section-shell py-18 md:py-24">
      <div className="border-y border-white/10 py-8">
        <div className="max-w-3xl">
          <p className="section-label">Reference positioning</p>
          <h2 className="section-title">This repo now targets the runtime gap between chat UI and observability.</h2>
          <p className="section-copy">
            It is not a general chatbot shell and not a telemetry dashboard. It is a focused UI layer for the period
            when an agent is actively planning, waiting, asking for approval, calling tools, and packaging outputs.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {comparisonRows.map((row) => (
            <article key={row.label} className="border-t border-white/10 pt-5">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--accent)]">{row.label}</p>
              <p className="mt-4 text-xl font-semibold tracking-[-0.04em] text-white">{row.value}</p>
              <p className="mt-4 text-sm leading-7 text-white/60">{row.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
