export const dynamic = "force-dynamic";

import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";

type ProjectRelation =
  | {
      business_name: string;
    }
  | {
      business_name: string;
    }[]
  | null;

type ServicePage = {
  id: string;
  service_name: string;
  page_url: string | null;
  meta_status: string | null;
  alt_text_status: string | null;
  internal_link_status: string | null;
  schema_status: string | null;
  indexing_status: string | null;
  projects: ProjectRelation;
};

function StatusBadge({ status }: { status: string | null }) {
  const statusClass =
    status === "Done" || status === "Requested"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "In Progress"
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-slate-700 text-slate-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
    >
      {status ?? "Pending"}
    </span>
  );
}

function getProjectName(projects: ServicePage["projects"]) {
  if (Array.isArray(projects)) {
    return projects[0]?.business_name ?? "No project";
  }

  return projects?.business_name ?? "No project";
}

export default async function ServicePagesPage() {
  const { data: servicePages, error } = await supabase
    .from("service_pages")
    .select(
      `
      id,
      service_name,
      page_url,
      meta_status,
      alt_text_status,
      internal_link_status,
      schema_status,
      indexing_status,
      projects (
        business_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold text-red-300">
            Error loading service pages
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
              Service Pages
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Service Page Tracker
            </h1>

            <p className="mt-2 text-slate-400">
              Track SEO completion for service pages, metadata, image alt text,
              internal links, schema, and indexing status.
            </p>
          </div>

          <a
            href="/service-pages/new"
            className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Add Service Page
          </a>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Meta</th>
                  <th className="px-4 py-3">Alt Text</th>
                  <th className="px-4 py-3">Internal Links</th>
                  <th className="px-4 py-3">Schema</th>
                  <th className="px-4 py-3">Indexing</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {(servicePages as ServicePage[] | null)?.map((page) => (
                  <tr key={page.id}>
                    <td className="px-4 py-4 font-medium">
                      {page.service_name}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {getProjectName(page.projects)}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={page.meta_status} />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={page.alt_text_status} />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={page.internal_link_status} />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={page.schema_status} />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={page.indexing_status} />
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