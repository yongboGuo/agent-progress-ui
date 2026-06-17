export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-4 text-sm text-white/55 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <p className="text-white">agent-progress-ui</p>
          <p className="mt-2">Open-source React runtime UI kit for long-running agents, MCP flows, and approval-aware workbenches.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-white/62">
          <a href="https://github.com/yongboGuo/agent-progress-ui" className="transition hover:text-white">
            GitHub
          </a>
          <a href="https://yongboGuo.github.io/agent-progress-ui/" className="transition hover:text-white">
            Live demo
          </a>
        </div>
      </div>
    </footer>
  );
}
