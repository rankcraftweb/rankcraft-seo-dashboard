import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buttonStyles, formStyles } from "@/lib/ui";
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
};

const statusOptions = ["Draft", "Ready", "Sent", "Archived"];

async function updateReport(reportId: string, formData: FormData) {
  "use server";

  const reportTitle = String(formData.get("report_title") || "").trim();
  const reportBody = String(formData.get("report_body") || "").trim();
  const status = String(formData.get("status") || "Draft").trim();

  if (!reportTitle) {
    throw new Error("Report title is required.");
  }

  const { error } = await supabase
    .from("reports")
    .update({
      report_title: reportTitle,
      report_body: reportBody || null,
      status: status || "Draft",
    })
    .eq("id", reportId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/reports/${reportId}`);
}

async function deleteReport(reportId: string) {
  "use server";

  const { error } = await supabase.from("reports").delete().eq("id", reportId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/reports");
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className={formStyles.input}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        rows={12}
        className={formStyles.textarea}
      />
    </label>
  );
}

function StatusSelect({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue || "Draft"}
        className={formStyles.input}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !report) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Report not found</h1>
          <p className="mt-3">Requested ID: {id}</p>
          <p className="mt-3 text-sm">
            Please check if this report exists in Supabase.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currentReport = report as Report;

  const { data: project } = await supabase
    .from("projects")
    .select("id, business_name")
    .eq("id", currentReport.project_id)
    .single();

  const currentProject = project as Project | null;
  const updateReportWithId = updateReport.bind(null, currentReport.id);
  const deleteReportWithId = deleteReport.bind(null, currentReport.id);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href={`/reports/${currentReport.id}`}
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Report
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            Edit Report
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Update Client Report
          </h1>

          <p className="mt-3 text-slate-300">
            Edit the report title, body, and delivery status for{" "}
            <span className="font-semibold text-white">
              {currentProject?.business_name || "this project"}
            </span>
            .
          </p>
        </div>

        <form
          action={updateReportWithId}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="grid gap-6">
            <Field
              label="Report Title"
              name="report_title"
              defaultValue={currentReport.report_title}
              placeholder="Example: Weekly SEO Progress Report"
            />

            <StatusSelect
              label="Status"
              name="status"
              defaultValue={currentReport.status}
            />

            <TextArea
              label="Report Body"
              name="report_body"
              defaultValue={currentReport.report_body}
              placeholder="Write the client-ready SEO progress update here..."
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className={buttonStyles.primary}>
              Save Changes
            </button>

            <Link href={`/reports/${currentReport.id}`} className={buttonStyles.secondary}>
              Cancel
            </Link>

            <Link
              href={`/projects/${currentReport.project_id}`}
              className={buttonStyles.secondary}
            >
              Back to Project
            </Link>
          </div>
        </form>

        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-red-200">Danger Zone</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100/80">
                Delete this report only if it is no longer needed. This action
                removes the report from Supabase and redirects back to the reports
                list.
              </p>
            </div>

            <form action={deleteReportWithId}>
              <button type="submit" className={buttonStyles.danger}>
                Delete Report
              </button>
            </form>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}