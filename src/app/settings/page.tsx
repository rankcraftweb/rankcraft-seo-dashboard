import Link from "next/link";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              Settings
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dashboard Settings
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Review the current MVP setup, workflow status, and next upgrade
              areas for the RankCraft SEO Ops dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link href="/dashboard" className={buttonStyles.secondary}>
              Back to Dashboard
            </Link>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              MVP Status
            </p>

            <h2 className="mt-4 text-xl font-bold text-white">
              Core Workflow Complete
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Projects, service pages, reports, edit pages, delete actions, and
              copy report workflows are now connected and ready for portfolio
              demonstration.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              UI System
            </p>

            <h2 className="mt-4 text-xl font-bold text-white">
              Standardized Layouts
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Buttons, forms, badges, mobile cards, desktop tables, and dashboard
              navigation have been standardized for a cleaner responsive MVP.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              Next Upgrade
            </p>

            <h2 className="mt-4 text-xl font-bold text-white">
              Auth Protection
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              The next production-level upgrade is adding Supabase authentication,
              protected dashboard routes, and a logout flow.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Completed MVP Features</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Project list and detail pages",
              "Add and edit project workflow",
              "Service page tracker",
              "Add, edit, and delete service pages",
              "Client report list and detail pages",
              "Add, edit, copy, and delete reports",
              "Responsive mobile card layouts",
              "Desktop table layouts",
              "Standardized global button styles",
              "Standardized form styles",
              "Mobile and desktop dashboard navigation",
              "Supabase-connected data workflow",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm font-semibold text-slate-200">✓ {item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Recommended Next Steps</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="font-bold text-white">1. Run Build Test</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Check for TypeScript, import, and route errors before pushing to
                GitHub and Vercel.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="font-bold text-white">2. Push to GitHub</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Commit the responsive UI updates and trigger a fresh Vercel
                deployment.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="font-bold text-white">3. Live QA</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Test dashboard, projects, service pages, reports, and edit pages
                on the Vercel live URL.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="font-bold text-white">4. Add Authentication</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Protect internal dashboard routes with Supabase Auth before
                treating the app as production-ready.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}