import DashboardShell from "@/components/DashboardShell";

const settings = [
  {
    label: "Workspace Name",
    value: "RankCraft SEO Ops",
  },
  {
    label: "Default Report Type",
    value: "End-of-Shift SEO Update",
  },
  {
    label: "Primary Workflow",
    value: "Local SEO Service Page Optimization",
  },
  {
    label: "Project Status Options",
    value: "Planning, In Progress, Completed, Needs Review",
  },
];

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Settings
          </p>

          <h1 className="mt-3 text-3xl font-bold">Workspace Settings</h1>

          <p className="mt-2 text-slate-400">
            Manage dashboard preferences, report defaults, and SEO workflow
            configuration.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">General Settings</h2>

            <div className="mt-6 space-y-5">
              {settings.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Portfolio Notes</h2>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm leading-7 text-slate-300">
                This dashboard is built as a full-stack SaaS-style portfolio
                project for local SEO operations. It demonstrates project
                management, service-page tracking, SEO task organization, report
                generation, and scalable dashboard UI design.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Frontend</p>
                <p className="mt-2 font-semibold">Next.js + Tailwind</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Backend</p>
                <p className="mt-2 font-semibold">Supabase</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Use Case</p>
                <p className="mt-2 font-semibold">Local SEO Ops</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Project Type</p>
                <p className="mt-2 font-semibold">SaaS Dashboard</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}