import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Project = {
  id: string;
  business_name: string;
  website_url: string | null;
  industry: string | null;
  target_location: string | null;
  status: string | null;
};

function StatusBadge({ status }: { status: string | null }) {
  const statusClass =
    status === "Completed"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "In Progress"
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

function ProjectMobileCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-lg font-bold leading-snug text-white">
            {project.business_name}
          </h2>

          <StatusBadge status={project.status} />
        </div>

        <p className="text-sm text-slate-400">
          {project.industry || "No industry added"}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Website
          </p>

          {project.website_url ? (
            <a
              href={project.website_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
            >
              {project.website_url}
            </a>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Not provided</p>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Location
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {project.target_location || "Not provided"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link href={`/projects/${project.id}`} className={buttonStyles.secondary}>
          View Project
        </Link>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("business_name", { ascending: true });

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Unable to load projects</h1>
          <p className="mt-2 text-sm">
            Please check your Supabase connection or table permissions.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const projectList = (projects as Project[] | null) || [];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              Projects
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              SEO Projects
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Manage client SEO projects, websites, industries, target locations,
              and campaign progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link href="/projects/new" className={buttonStyles.primary}>
              Add Project
            </Link>
          </div>
        </div>

        {projectList.length > 0 ? (
          <>
            <section className="grid gap-5 lg:hidden">
              {projectList.map((project) => (
                <ProjectMobileCard key={project.id} project={project} />
              ))}
            </section>

            <section className="hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:block">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Business</th>
                      <th className="px-4 py-3">Website</th>
                      <th className="px-4 py-3">Industry</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {projectList.map((project) => (
                      <tr
                        key={project.id}
                        className="transition hover:bg-slate-950/50"
                      >
                        <td className="px-4 py-4 font-medium text-white">
                          {project.business_name}
                        </td>

                        <td className="max-w-[260px] px-4 py-4 text-slate-300">
                          {project.website_url ? (
                            <a
                              href={project.website_url}
                              target="_blank"
                              rel="noreferrer"
                              className="block break-all transition hover:text-cyan-300"
                            >
                              {project.website_url}
                            </a>
                          ) : (
                            "Not provided"
                          )}
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

                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/projects/${project.id}`}
                            className={buttonStyles.small}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            No projects found yet. Add your first SEO project to start tracking
            progress.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}