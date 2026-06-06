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
  created_at?: string | null;
};

type ServicePage = {
  id: string;
  service_name: string;
  page_url: string | null;
  meta_status: string | null;
  alt_text_status: string | null;
  internal_link_status: string | null;
  schema_status: string | null;
  indexing_status: string | null;
};

type Report = {
  id: string;
  report_title: string;
  report_body: string | null;
  status: string | null;
  created_at: string | null;
};

function StatusBadge({ status }: { status: string | null }) {
  const statusClass =
    status === "Completed" || status === "Done" || status === "Ready"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "In Progress" || status === "Requested"
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-slate-700 text-slate-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
      {status || "Pending"}
    </span>
  );
}

function InfoCard({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block max-w-full break-all text-base font-semibold text-white transition hover:text-cyan-300"
          >
            {value}
          </a>
        ) : (
          <p className="mt-3 break-words text-base font-semibold text-white">
            {value}
          </p>
        )
      ) : (
        <p className="mt-3 text-base font-semibold text-white">Not provided</p>
      )}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="mt-3">Requested ID: {id}</p>
          <p className="mt-3 text-sm">
            Please check if the project exists in Supabase.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const { data: servicePages } = await supabase
    .from("service_pages")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const currentProject = project as Project;
  const relatedServicePages = (servicePages as ServicePage[] | null) || [];
  const relatedReports = (reports as Report[] | null) || [];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div>
          <Link
            href="/projects"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Projects
          </Link>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
                Project Details
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white">
                {currentProject.business_name}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Review the project profile, service-page progress, and client-ready
                reports for this SEO workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 xl:justify-end">
              <Link
                href={`/projects/${currentProject.id}/edit`}
                className={buttonStyles.secondary}
              >
                Edit Project
              </Link>

              <Link
                href={`/service-pages/new?projectId=${currentProject.id}`}
                className={buttonStyles.primary}
              >
                Add Service Page
              </Link>

              <Link
                href={`/reports/new?projectId=${currentProject.id}`}
                className={buttonStyles.secondary}
              >
                Generate Report
              </Link>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Website" value={currentProject.website_url} isLink />
          <InfoCard label="Industry" value={currentProject.industry} />
          <InfoCard label="Target Location" value={currentProject.target_location} />

          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Status
            </p>

            <div className="mt-3">
              <StatusBadge status={currentProject.status} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Service Pages</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track service-page optimization progress for this project.
              </p>
            </div>

            <Link
              href={`/service-pages/new?projectId=${currentProject.id}`}
              className={buttonStyles.primary}
            >
              Add Service Page
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
            {relatedServicePages.length > 0 ? (
              <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Meta</th>
                    <th className="px-4 py-3">Alt Text</th>
                    <th className="px-4 py-3">Internal Links</th>
                    <th className="px-4 py-3">Schema</th>
                    <th className="px-4 py-3">Indexing</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {relatedServicePages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-4 py-4 font-medium text-white">
                        {page.service_name}
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

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/service-pages/${page.id}/edit`}
                          className={buttonStyles.small}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="bg-slate-950 p-6 text-sm text-slate-400">
                No service pages added for this project yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Reports</h2>
              <p className="mt-1 text-sm text-slate-400">
                Client-ready updates connected to this project.
              </p>
            </div>

            <Link
              href={`/reports/new?projectId=${currentProject.id}`}
              className={buttonStyles.primary}
            >
              Generate Report
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relatedReports.length > 0 ? (
              relatedReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">
                      {report.report_title}
                    </h3>

                    <StatusBadge status={report.status} />
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">
                    {report.report_body || "No report body added."}
                  </p>

                  <Link
                    href={`/reports/${report.id}`}
                    className={buttonStyles.secondary}
                  >
                    View Details
                  </Link>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400 md:col-span-2">
                No reports generated for this project yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}