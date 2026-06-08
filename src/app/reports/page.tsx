import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";
import CopyReportButton from "@/components/CopyReportButton";

type ProjectRelation =
  | {
      business_name: string;
    }
  | {
      business_name: string;
    }[]
  | null;

type Report = {
  id: string;
  report_title: string;
  report_body: string;
  status: string | null;
  created_at: string;
  projects: ProjectRelation;
};

function StatusBadge({ status }: { status: string | null }) {
  const statusClass =
    status === "Ready" || status === "Sent"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "Draft"
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-slate-700 text-slate-300";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
    >
      {status ?? "Ready"}
    </span>
  );
}

function getProjectName(projects: Report["projects"]) {
  if (Array.isArray(projects)) {
    return projects[0]?.business_name ?? "No project";
  }

  return projects?.business_name ?? "No project";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function ReportCard({ report }: { report: Report }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-white lg:text-xl">
            {report.report_title}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {getProjectName(report.projects)}
          </p>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {formatDate(report.created_at)}
          </p>
        </div>

        <StatusBadge status={report.status} />
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <p className="line-clamp-5 text-sm leading-7 text-slate-300">
          {report.report_body}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <CopyReportButton reportBody={report.report_body} />

        <Link href={`/reports/${report.id}`} className={buttonStyles.secondary}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export default async function ReportsPage() {
  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `
      id,
      report_title,
      report_body,
      status,
      created_at,
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
            Error loading reports
          </h1>
          <p className="mt-2 text-sm text-red-200">{error.message}</p>
        </div>
      </DashboardShell>
    );
  }

  const reportList = (reports as Report[] | null) || [];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              Reports
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Client Reports
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Create, review, copy, and manage client-ready SEO progress reports
              connected to active projects.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link href="/reports/new" className={buttonStyles.primary}>
              Generate Report
            </Link>
          </div>
        </div>

        {reportList.length > 0 ? (
          <section className="grid gap-5 lg:grid-cols-2">
            {reportList.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            No reports found yet. Generate your first client-ready SEO report.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}