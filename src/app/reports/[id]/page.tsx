export const dynamic = "force-dynamic";

import DashboardShell from "@/components/DashboardShell";
import CopyReportButton from "@/components/CopyReportButton";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectRelation =
  | {
      business_name: string;
      website_url: string | null;
      industry: string | null;
      target_location: string | null;
      status: string | null;
    }
  | {
      business_name: string;
      website_url: string | null;
      industry: string | null;
      target_location: string | null;
      status: string | null;
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

type ReportDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getProject(projects: Report["projects"]) {
  if (Array.isArray(projects)) {
    return projects[0] ?? null;
  }

  return projects;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ReportDetailsPage({
  params,
}: ReportDetailsPageProps) {
  const { id } = await params;

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      `
      id,
      report_title,
      report_body,
      status,
      created_at,
      projects (
        business_name,
        website_url,
        industry,
        target_location,
        status
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !report) {
    notFound();
  }

  const typedReport = report as Report;
  const project = getProject(typedReport.projects);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/reports"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to reports
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Report Details
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {typedReport.report_title}
          </h1>

          <p className="mt-2 text-slate-400">
            {project?.business_name ?? "No project"} •{" "}
            {formatDate(typedReport.created_at)}
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Client-Ready Update</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Use this report for client updates, internal notes, or
                  end-of-shift summaries.
                </p>
              </div>

              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {typedReport.status ?? "Ready"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                {typedReport.report_body}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <CopyReportButton reportBody={typedReport.report_body} />

              <Link
                href="/reports"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Back to Reports
              </Link>
            </div>
          </article>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Project Snapshot</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Business</p>
                <p className="mt-2 font-semibold">
                  {project?.business_name ?? "No project"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Website</p>
                <p className="mt-2 break-all font-semibold">
                  {project?.website_url ?? "No website"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Industry</p>
                <p className="mt-2 font-semibold">
                  {project?.industry ?? "No industry"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Target Location</p>
                <p className="mt-2 font-semibold">
                  {project?.target_location ?? "No location"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Project Status</p>
                <p className="mt-2 font-semibold">
                  {project?.status ?? "No status"}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </DashboardShell>
  );
}