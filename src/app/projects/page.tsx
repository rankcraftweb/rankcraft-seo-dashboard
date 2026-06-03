import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  business_name: string;
  website_url: string | null;
  industry: string | null;
  target_location: string | null;
  status: string | null;
};

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold text-red-300">
            Error loading projects
          </h1>
          <p className="mt-2 text-sm text-red-200">{error.message}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Projects
            </p>

            <h1 className="mt-3 text-3xl font-bold">SEO Projects</h1>

            <p className="mt-2 text-slate-400">
              Manage client SEO projects, websites, industries, and campaign
              progress.
            </p>
          </div>

          <a
            href="/projects/new"
            className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Add Project
          </a>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {(projects as Project[] | null)?.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-4 font-medium">
                      {project.business_name}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {project.website_url}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {project.industry}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {project.target_location}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}