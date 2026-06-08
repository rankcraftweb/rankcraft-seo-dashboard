import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Project = {
  id: string;
  business_name: string;
  industry: string | null;
  target_location: string | null;
  status: string | null;
};

type ServicePage = {
  id: string;
  meta_status: string | null;
  alt_text_status: string | null;
  internal_link_status: string | null;
  schema_status: string | null;
  indexing_status: string | null;
};

type Report = {
  id: string;
};

function StatusBadge({ status }: { status: string | null }) {
  const statusClass =
    status === "Completed" || status === "Done" || status === "Ready"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "In Progress" || status === "Requested"
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-slate-700 text-slate-300";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
    >
      {status || "Planning"}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-5 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ProjectMobileCard({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug text-white">
            {project.business_name}
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            {project.industry || "No industry added"}
          </p>
        </div>

        <StatusBadge status={project.status} />
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Location
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-200">
          {project.target_location || "Not provided"}
        </p>
      </div>

      <div className="mt-5">
        <Link href={`/projects/${project.id}`} className={buttonStyles.small}>
          View
        </Link>
      </div>
    </article>
  );
}

function isServicePageComplete(page: ServicePage) {
  return (
    page.meta_status === "Done" &&
    page.alt_text_status === "Done" &&
    page.internal_link_status === "Done" &&
    page.schema_status === "Done"
  );
}

export default async function DashboardPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("id, business_name, industry, target_location, status")
    .order("business_name", { ascending: true });

  const { data: servicePages } = await supabase
    .from("service_pages")
    .select(
      "id, meta_status, alt_text_status, internal_link_status, schema_status, indexing_status",
    );

  const { data: reports } = await supabase.from("reports").select("id");

  const projectList = (projects as Project[] | null) || [];
  const servicePageList = (servicePages as ServicePage[] | null) || [];
  const reportList = (reports as Report[] | null) || [];

  const completedServicePages = servicePageList.filter(isServicePageComplete).length;

  const pendingSeoTasks = servicePageList.reduce((total, page) => {
    const statuses = [
      page.meta_status,
      page.alt_text_status,
      page.internal_link_status,
      page.schema_status,
      page.indexing_status,
    ];

    return total + statuses.filter((status) => status !== "Done").length;
  }, 0);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            Dashboard
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            SEO Operations Overview
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Track local SEO progress, service pages, audit tasks, and reports.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Projects" value={projectList.length} />
          <StatCard label="Completed Service Pages" value={completedServicePages} />
          <StatCard label="Pending SEO Tasks" value={pendingSeoTasks} />
          <StatCard label="Reports Generated" value={reportList.length} />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Recent SEO Projects</h2>
              <p className="mt-1 text-sm text-slate-400">
                Quick view of active client SEO projects.
              </p>
            </div>

            <Link href="/projects" className={buttonStyles.secondary}>
              View Projects
            </Link>
          </div>

          {projectList.length > 0 ? (
            <>
              <div className="mt-6 grid gap-4 lg:hidden">
                {projectList.map((project) => (
                  <ProjectMobileCard key={project.id} project={project} />
                ))}
              </div>

              <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-800 lg:block">
                <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Business</th>
                      <th className="px-4 py-3">Industry</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {projectList.map((project) => (
                      <tr key={project.id} className="transition hover:bg-slate-950/50">
                        <td className="px-4 py-4 font-medium text-white">
                          <Link
                            href={`/projects/${project.id}`}
                            className="transition hover:text-cyan-300"
                          >
                            {project.business_name}
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {project.industry || "Not provided"}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {project.target_location || "Not provided"}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={project.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
              No projects found yet. Add your first SEO project to start tracking
              progress.
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}