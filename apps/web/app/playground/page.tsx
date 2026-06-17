import { AppHeader } from "../../components/app-header";
import { PlaygroundClient } from "../../components/playground-client";
import { SiteFooter } from "../../components/site-footer";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="section-shell py-14 md:py-20">
        <p className="section-label">Reference app</p>
        <h1 className="section-title">Inspect static transcripts, live store updates, and MCP-fed snapshots.</h1>
        <p className="section-copy">
          The reference app is organized around the three input modes this repo now supports: transcript slices,
          incremental store replay, and a thin MCP adapter that normalizes envelopes into the same runtime workbench.
        </p>
        <div className="mt-10">
          <PlaygroundClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
