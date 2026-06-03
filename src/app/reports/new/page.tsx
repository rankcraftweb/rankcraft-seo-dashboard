import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Project = {
  id: string;
  business_name: string;
};

async function createReport(formData: FormData) {
  "use server";

  const projectId = formData.get("project_id") as string;
  const reportTitle = formData.get("report_title") as string;
  const reportBody = formData.get("report_body") as string;
  const status = formData.get("status") as string;

  if (!projectId || !reportTitle || !reportBody) {
    throw new Error("Project, report title, and report body are required.");
  }

  const { error } = await supabase.from("reports").insert({
    project_id: projectId,
    report_title: reportTitle,
    report_body: reportBody,
    status,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/reports");
}

export default async function NewReportPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, business_name")
    .order("business_name", { ascending: true });

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold text-red-300">
            Error loading projects
          </h1>
          <p className="mt-2 text-sm text-red-200">{error.message}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            New Report
          </p>

          <h1 className="mt-3 text-3xl font-bold">Generate Client Report</h1>

          <p className="mt-2 text-slate-400">
            Create a client-ready SEO progress update and save it to Supabase.
          </p>
        </div>

        <form
          action={createReport}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="project_id"
                className="block text-sm font-semibold text-slate-300"
              >
                Project
              </label>

              <select
                id="project_id"
                name="project_id"
                required
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option value="">Select project</option>
                {(projects as Project[] | null)?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.business_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report_title"
                className="block text-sm font-semibold text-slate-300"
              >
                Report Title
              </label>

              <input
                id="report_title"
                name="report_title"
                type="text"
                required
                placeholder="Example: SEO Batch Update"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="report_body"
                className="block text-sm font-semibold text-slate-300"
              >
                Report Body
              </label>

              <textarea
                id="report_body"
                name="report_body"
                required
                rows={8}
                placeholder="Example: Completed SEO updates for service pages. Updated metadata, image alt text, internal links, schema preparation, and indexing status."
                className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-slate-300"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="Ready"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option>Ready</option>
                <option>Sent</option>
                <option>Draft</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Save Report
              </button>

              <a
                href="/reports"
                className="rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}