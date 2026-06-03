type DashboardShellProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Service Pages",
    href: "/service-pages",
  },
  {
    label: "Reports",
    href: "/reports",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 px-6 py-8 lg:block">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
            RankCraft
          </p>
          <h1 className="mt-2 text-xl font-bold">SEO Ops</h1>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6 right-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">Portfolio Project</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Full-stack local SEO dashboard built with Next.js and Supabase.
          </p>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="min-h-screen px-6 py-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}