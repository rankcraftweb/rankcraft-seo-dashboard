export const dynamic = "force-dynamic";

import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  business_name: string;
  industry: string | null;
  target_location: string | null;
  status: string | null;
};

export default async function DashboardPage() {
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, business_name, industry, target_location, status")
    .order("created_at", { ascending: false });

  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: completedServicePages } = await supabase
    .from("service_pages")
    .select("*", { count: "exact", head: true })
    .eq("meta_status", "Done")
    .eq("alt_text_status", "Done")
    .eq("internal_link_status", "Done");

  const { count: pendingServicePages } = await supabase
    .from("service_pages")
    .select("*", { count: "exact", head: true })
    .or(
      "meta_status.eq.Pending,alt_text_status.eq.Pending,internal_link_status.eq.Pending,schema_status.eq.Pending,indexing_status.eq.Pending",
    );

  const { count: reportsGenerated } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true });

  if (projectsError) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold text-red-300">
            Error loading dashboard
          </h1>
          <p className="mt-2 text-sm text-red-200">
            {projectsError.message}
          </p>
        </div>
      </DashboardShell>
    );
  }

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects ?? 0,
    },
    {
      label: "Completed Service Pages",
      value: completedServicePages ?? 0,
    },
    {
      label: "Pending SEO Tasks",
      value: pendingServicePages ?? 0,
    },
    {
      label: "Reports Generated",
      value: reportsGenerated ?? 0,
    },
  ];

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            SEO Operations Overview
          </h1>

          <p className="mt-2 text-slate-400">
            Track local SEO progress, service pages, audit tasks, and reports.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Recent SEO Projects</h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Business</th>
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