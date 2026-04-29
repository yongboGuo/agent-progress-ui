import { AppHeader } from "../../components/app-header";
import { PlaygroundClient } from "../../components/playground-client";
import { SiteFooter } from "../../components/site-footer";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="section-shell py-14 md:py-20">
        <p className="section-label">Interactive playground</p>
        <h1 className="section-title">Inspect state transitions and evidence in one surface.</h1>
        <p className="section-copy">
          Pick a scenario, scrub through the visible event count, and inspect how the reducer changes the rendered
          workbench. This is the same API surface shipped by the package.
        </p>
        <div className="mt-10">
          <PlaygroundClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
