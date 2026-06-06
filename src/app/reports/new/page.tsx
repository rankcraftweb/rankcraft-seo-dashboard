import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buttonStyles, formStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Project = {
  id: string;
  business_name: string;
};

const statusOptions = ["Draft", "Ready", "Sent", "Archived"];

async function createReport(formData: FormData) {
  "use server";

  const projectId = String(formData.get("project_id") || "").trim();
  const reportTitle = String(formData.get("report_title") || "").trim();
  const reportBody = String(formData.get("report_body") || "").trim();
  const status = String(formData.get("status") || "Ready").trim();

  if (!projectId || !reportTitle || !reportBody) {
    throw new Error("Project, report title, and report body are required.");
  }

  const { error } = await supabase.from("reports").insert({
    project_id: projectId,
    report_title: reportTitle,
    report_body: reportBody,
    status: status || "Ready",
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/projects/${projectId}`);
}

function Field({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        className={formStyles.input}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={12}
        className={formStyles.textarea}
      />
    </label>
  );
}

function StatusSelect() {
  return (
    <label className="block">
      <span className={formStyles.label}>Status</span>
      <select name="status" defaultValue="Ready" className={formStyles.input}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function NewReportPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, business_name")
    .order("business_name", { ascending: true });

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Unable to load projects</h1>
          <p className="mt-3 text-sm">
            Please check your Supabase connection or table permissions.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const projectList = (projects as Project[] | null) || [];

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/reports"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Reports
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            New Report
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Generate Client Report
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Create a client-ready SEO progress update and connect it to an active
            project.
          </p>
        </div>

        <form
          action={createReport}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="grid gap-6">
            <label className="block">
              <span className={formStyles.label}>Project</span>
              <select
                name="project_id"
                required
                defaultValue=""
                className={formStyles.input}
              >
                <option value="" disabled>
                  Select project
                </option>

                {projectList.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.business_name}
                  </option>
                ))}
              </select>
            </label>

            <Field
              label="Report Title"
              name="report_title"
              placeholder="Example: Weekly SEO Progress Report"
              required
            />

            <StatusSelect />

            <TextArea
              label="Report Body"
              name="report_body"
              placeholder="Write the client-ready SEO progress update here..."
              required
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className={buttonStyles.primary}>
              Save Report
            </button>

            <Link href="/reports" className={buttonStyles.secondary}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}