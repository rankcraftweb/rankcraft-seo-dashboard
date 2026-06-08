import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "../lib/supabase/server";

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

function BrandBlock() {
  return (
    <Link href="/dashboard" className="block">
      <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400">
        RankCraft
      </p>

      <h1 className="mt-2 text-2xl font-bold leading-tight text-white">
        SEO Ops
      </h1>
    </Link>
  );
}

function MobileNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <BrandBlock />

        <div className="flex shrink-0 flex-col gap-2">
          <Link
            href="/projects/new"
            className="inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Add Project
          </Link>

          <LogoutButton />
        </div>
      </div>

      <nav className="mt-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function DesktopSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 p-6 lg:flex lg:flex-col">
      <BrandBlock />

      <nav className="mt-16 grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-cyan-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-4">
        <LogoutButton />
      </div>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-bold text-white">Portfolio Project</p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Full-stack local SEO dashboard built with Next.js and Supabase.
        </p>
      </div>
    </aside>
  );
}

export default async function DashboardShell({
  children,
}: DashboardShellProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MobileNav />
      <DesktopSidebar />

      <main className="px-4 py-8 sm:px-6 lg:ml-72 lg:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}