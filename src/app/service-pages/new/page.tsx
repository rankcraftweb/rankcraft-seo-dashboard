import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buttonStyles, formStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Project = {
  id: string;
  business_name: string;
};

const statusOptions = ["Pending", "In Progress", "Done", "Requested"];

async function createServicePage(formData: FormData) {
  "use server";

  const projectId = String(formData.get("project_id") || "").trim();
  const serviceName = String(formData.get("service_name") || "").trim();
  const pageUrl = String(formData.get("page_url") || "").trim();

  const metaStatus = String(formData.get("meta_status") || "Pending");
  const altTextStatus = String(formData.get("alt_text_status") || "Pending");
  const internalLinkStatus = String(
    formData.get("internal_link_status") || "Pending",
  );
  const schemaStatus = String(formData.get("schema_status") || "Pending");
  const indexingStatus = String(formData.get("indexing_status") || "Pending");

  if (!projectId || !serviceName) {
    throw new Error("Project and service name are required.");
  }

  const { error } = await supabase.from("service_pages").insert({
    project_id: projectId,
    service_name: serviceName,
    page_url: pageUrl || null,
    meta_status: metaStatus,
    alt_text_status: altTextStatus,
    internal_link_status: internalLinkStatus,
    schema_status: schemaStatus,
    indexing_status: indexingStatus,
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
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={formStyles.input}
      />
    </label>
  );
}

function StatusSelect({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <select name={name} defaultValue="Pending" className={formStyles.input}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function NewServicePagePage() {
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
            href="/service-pages"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Service Pages
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            New Service Page
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Add Service Page
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Add a service page to a project and track its metadata, alt text,
            internal links, schema, and indexing progress.
          </p>
        </div>

        <form
          action={createServicePage}
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
              label="Service Name"
              name="service_name"
              placeholder="Example: Paver Sealing"
              required
            />

            <Field
              label="Page URL"
              name="page_url"
              placeholder="https://example.com/service-page/"
              type="url"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <StatusSelect label="Meta" name="meta_status" />
              <StatusSelect label="Alt Text" name="alt_text_status" />
              <StatusSelect label="Internal Links" name="internal_link_status" />
              <StatusSelect label="Schema" name="schema_status" />
              <StatusSelect label="Indexing" name="indexing_status" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className={buttonStyles.primary}>
              Save Service Page
            </button>

            <Link href="/service-pages" className={buttonStyles.secondary}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}