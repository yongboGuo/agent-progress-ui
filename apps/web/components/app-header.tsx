import Link from "next/link";

const navItems: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/playground", label: "Playground" },
  { href: "/examples/chat", label: "Examples" },
  { href: "https://github.com/yongboGuo/agent-progress-ui", label: "GitHub", external: true }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(11,14,20,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.28em] text-white uppercase">
          <span className="inline-flex h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)]" />
          agent-progress-ui
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/70">
          {navItems.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
