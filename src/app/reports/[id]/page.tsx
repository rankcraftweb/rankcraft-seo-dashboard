import Link from "next/link";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import { buttonStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Report = {
  id: string;
  project_id: string;
  report_title: string;
  report_body: string | null;
  status: string | null;
  created_at: string | null;
};

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
    status === "Ready" || status === "Sent" || status === "Completed"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "Draft"
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-slate-700 text-slate-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
      {status || "Draft"}
    </span>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 break-words text-base font-semibold text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (reportError || !report) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <p className="mt-3">Requested ID: {id}</p>
          <p className="mt-3 text-sm">
            Please check if the report exists in Supabase.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currentReport = report as Report;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", currentReport.project_id)
    .single();

  const currentProject = project as Project | null;

  const reportCopyText = [
    currentReport.report_title,
    "",
    `Project: ${currentProject?.business_name || "Not provided"}`,
    `Status: ${currentReport.status || "Draft"}`,
    `Date: ${formatDate(currentReport.created_at)}`,
    "",
    currentReport.report_body || "No report body added.",
  ].join("\n");

  return (
    <DashboardShell>
      <div className="space-y-10">
        <Script id="copy-report-script">
          {`
            document.addEventListener("click", async function(event) {
              const button = event.target.closest("[data-copy-report-button]");
              if (!button) return;

              const reportText = button.getAttribute("data-report-text") || "";

              try {
                await navigator.clipboard.writeText(reportText);
                const originalText = button.textContent;
                button.textContent = "Copied!";
                setTimeout(function() {
                  button.textContent = originalText || "Copy Report";
                }, 1500);
              } catch (error) {
                alert("Copy failed. Please select the report text manually.");
              }
            });
          `}
        </Script>

        <div>
          <Link
            href="/reports"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Reports
          </Link>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
                Report Details
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white">
                {currentReport.report_title}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Review, edit, and copy this client-ready SEO progress update.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 xl:justify-end">
              <Link
                href={`/reports/${currentReport.id}/edit`}
                className={buttonStyles.secondary}
              >
                Edit Report
              </Link>

              <button
                type="button"
                data-copy-report-button
                data-report-text={reportCopyText}
                className={buttonStyles.primary}
              >
                Copy Report
              </button>

              {currentProject?.id ? (
                <Link
                  href={`/projects/${currentProject.id}`}
                  className={buttonStyles.secondary}
                >
                  Back to Project
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard
            label="Project"
            value={currentProject?.business_name || "Not connected"}
          />

          <DetailCard
            label="Industry"
            value={currentProject?.industry || "Not provided"}
          />

          <DetailCard
            label="Created"
            value={formatDate(currentReport.created_at)}
          />

          <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Status
            </p>

            <div className="mt-3">
              <StatusBadge status={currentReport.status} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Client Update</h2>
              <p className="mt-1 text-sm text-slate-400">
                Use this section as the client-ready report body.
              </p>
            </div>

            <StatusBadge status={currentReport.status} />
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-200">
              {currentReport.report_body || "No report body added."}
            </pre>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Copy Preview</h2>

          <p className="mt-1 text-sm text-slate-400">
            This is the full text copied when you click the Copy Report button.
          </p>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300">
              {reportCopyText}
            </pre>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}