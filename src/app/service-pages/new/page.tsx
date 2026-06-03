import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Project = {
  id: string;
  business_name: string;
};

async function createServicePage(formData: FormData) {
  "use server";

  const projectId = formData.get("project_id") as string;
  const serviceName = formData.get("service_name") as string;
  const pageUrl = formData.get("page_url") as string;
  const metaStatus = formData.get("meta_status") as string;
  const altTextStatus = formData.get("alt_text_status") as string;
  const internalLinkStatus = formData.get("internal_link_status") as string;
  const schemaStatus = formData.get("schema_status") as string;
  const indexingStatus = formData.get("indexing_status") as string;

  if (!projectId || !serviceName) {
    throw new Error("Project and service name are required.");
  }

  const { error } = await supabase.from("service_pages").insert({
    project_id: projectId,
    service_name: serviceName,
    page_url: pageUrl,
    meta_status: metaStatus,
    alt_text_status: altTextStatus,
    internal_link_status: internalLinkStatus,
    schema_status: schemaStatus,
    indexing_status: indexingStatus,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/service-pages");
  revalidatePath("/dashboard");
  redirect("/service-pages");
}

const statusOptions = ["Pending", "In Progress", "Done", "Requested"];

export default async function NewServicePagePage() {
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
            New Service Page
          </p>

          <h1 className="mt-3 text-3xl font-bold">Add Service Page</h1>

          <p className="mt-2 text-slate-400">
            Add a service page and track its SEO optimization status.
          </p>
        </div>

        <form
          action={createServicePage}
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
                htmlFor="service_name"
                className="block text-sm font-semibold text-slate-300"
              >
                Service Name
              </label>

              <input
                id="service_name"
                name="service_name"
                type="text"
                required
                placeholder="Example: Commercial Window Cleaning"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="page_url"
                className="block text-sm font-semibold text-slate-300"
              >
                Page URL
              </label>

              <input
                id="page_url"
                name="page_url"
                type="url"
                placeholder="https://example.com/service-page/"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                ["meta_status", "Meta"],
                ["alt_text_status", "Alt Text"],
                ["internal_link_status", "Internal Links"],
                ["schema_status", "Schema"],
                ["indexing_status", "Indexing"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-slate-300"
                  >
                    {label}
                  </label>

                  <select
                    id={name}
                    name={name}
                    defaultValue="Pending"
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Save Service Page
              </button>

              <a
                href="/service-pages"
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