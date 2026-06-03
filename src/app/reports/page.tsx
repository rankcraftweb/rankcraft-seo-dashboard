export const dynamic = "force-dynamic";

import DashboardShell from "@/components/DashboardShell";
import CopyReportButton from "@/components/CopyReportButton";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
    status === "Ready"
      ? "bg-cyan-400/10 text-cyan-300"
      : "bg-emerald-400/10 text-emerald-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
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

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Reports
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Client Report Generator
            </h1>

            <p className="mt-2 text-slate-400">
              Generate clean SEO progress updates for clients, managers, and
              end-of-shift reports.
            </p>
          </div>

          <Link
            href="/reports/new"
            className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Generate Report
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          {(reports as Report[] | null)?.map((report) => (
            <article
              key={report.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {report.report_title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {getProjectName(report.projects)} •{" "}
                    {formatDate(report.created_at)}
                  </p>
                </div>

                <StatusBadge status={report.status} />
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm leading-7 text-slate-300">
                  {report.report_body}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <CopyReportButton reportBody={report.report_body} />

                <Link
                  href={`/reports/${report.id}`}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}