import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

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
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
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

function ServicePageMobileCard({ page }: { page: ServicePage }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h2 className="text-lg font-bold leading-snug text-white">
          {page.service_name}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {getProjectName(page.projects)}
        </p>
      </div>

      {page.page_url ? (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Page URL
          </p>

          <a
            href={page.page_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block break-all text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
          >
            {page.page_url}
          </a>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Meta
          </p>
          <StatusBadge status={page.meta_status} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Alt Text
          </p>
          <StatusBadge status={page.alt_text_status} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Links
          </p>
          <StatusBadge status={page.internal_link_status} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Schema
          </p>
          <StatusBadge status={page.schema_status} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Indexing
          </p>
          <StatusBadge status={page.indexing_status} />
        </div>
      </div>

      <div className="mt-6">
        <Link href={`/service-pages/${page.id}/edit`} className={buttonStyles.secondary}>
          Edit Service
        </Link>
      </div>
    </article>
  );
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

  const servicePageList = (servicePages as ServicePage[] | null) || [];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              Service Pages
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Service Page Tracker
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Track SEO completion for service pages, metadata, image alt text,
              internal links, schema, and indexing status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link href="/service-pages/new" className={buttonStyles.primary}>
              Add Service Page
            </Link>
          </div>
        </div>

        {servicePageList.length > 0 ? (
          <>
            <section className="grid gap-5 lg:hidden">
              {servicePageList.map((page) => (
                <ServicePageMobileCard key={page.id} page={page} />
              ))}
            </section>

            <section className="hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:block">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Meta</th>
                      <th className="px-4 py-3">Alt Text</th>
                      <th className="px-4 py-3">Internal Links</th>
                      <th className="px-4 py-3">Schema</th>
                      <th className="px-4 py-3">Indexing</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {servicePageList.map((page) => (
                      <tr key={page.id} className="transition hover:bg-slate-950/50">
                        <td className="px-4 py-4 font-medium text-white">
                          {page.service_name}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
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
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            No service pages found yet. Add your first service page to start
            tracking SEO progress.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}