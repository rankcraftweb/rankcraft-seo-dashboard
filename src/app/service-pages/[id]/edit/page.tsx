import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buttonStyles, formStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type ServicePage = {
  id: string;
  project_id: string;
  service_name: string;
  page_url: string | null;
  meta_status: string | null;
  alt_text_status: string | null;
  internal_link_status: string | null;
  schema_status: string | null;
  indexing_status: string | null;
};

type Project = {
  id: string;
  business_name: string;
};

const statusOptions = ["Pending", "In Progress", "Done", "Requested"];

async function updateServicePage(servicePageId: string, formData: FormData) {
  "use server";

  const serviceName = String(formData.get("service_name") || "").trim();
  const pageUrl = String(formData.get("page_url") || "").trim();
  const projectId = String(formData.get("project_id") || "").trim();

  const metaStatus = String(formData.get("meta_status") || "Pending");
  const altTextStatus = String(formData.get("alt_text_status") || "Pending");
  const internalLinkStatus = String(
    formData.get("internal_link_status") || "Pending",
  );
  const schemaStatus = String(formData.get("schema_status") || "Pending");
  const indexingStatus = String(formData.get("indexing_status") || "Pending");

  if (!serviceName) {
    throw new Error("Service name is required.");
  }

  const { error } = await supabase
    .from("service_pages")
    .update({
      service_name: serviceName,
      page_url: pageUrl || null,
      meta_status: metaStatus,
      alt_text_status: altTextStatus,
      internal_link_status: internalLinkStatus,
      schema_status: schemaStatus,
      indexing_status: indexingStatus,
    })
    .eq("id", servicePageId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/projects/${projectId}`);
}

async function deleteServicePage(servicePageId: string, formData: FormData) {
  "use server";

  const projectId = String(formData.get("project_id") || "").trim();

  const { error } = await supabase
    .from("service_pages")
    .delete()
    .eq("id", servicePageId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/projects/${projectId}`);
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={formStyles.label}>{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className={formStyles.input}
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
        defaultValue={defaultValue || "Pending"}
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

export default async function EditServicePagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: servicePage, error } = await supabase
    .from("service_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !servicePage) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Service page not found</h1>
          <p className="mt-3">Requested ID: {id}</p>
          <p className="mt-3 text-sm">
            Please check if this service page exists in Supabase.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currentServicePage = servicePage as ServicePage;

  const { data: project } = await supabase
    .from("projects")
    .select("id, business_name")
    .eq("id", currentServicePage.project_id)
    .single();

  const currentProject = project as Project | null;

  const updateServicePageWithId = updateServicePage.bind(
    null,
    currentServicePage.id,
  );

  const deleteServicePageWithId = deleteServicePage.bind(
    null,
    currentServicePage.id,
  );

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href={`/projects/${currentServicePage.project_id}`}
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Project
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            Edit Service Page
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Update Service Page
          </h1>

          <p className="mt-3 text-slate-300">
            Update the service page URL and SEO task status for{" "}
            <span className="font-semibold text-white">
              {currentProject?.business_name || "this project"}
            </span>
            .
          </p>
        </div>

        <form
          action={updateServicePageWithId}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <input
            type="hidden"
            name="project_id"
            value={currentServicePage.project_id}
          />

          <div className="grid gap-6">
            <Field
              label="Service Name"
              name="service_name"
              defaultValue={currentServicePage.service_name}
              placeholder="Example: Paver Sealing"
            />

            <Field
              label="Page URL"
              name="page_url"
              defaultValue={currentServicePage.page_url}
              placeholder="https://example.com/service-page/"
              type="url"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <StatusSelect
                label="Meta"
                name="meta_status"
                defaultValue={currentServicePage.meta_status}
              />

              <StatusSelect
                label="Alt Text"
                name="alt_text_status"
                defaultValue={currentServicePage.alt_text_status}
              />

              <StatusSelect
                label="Internal Links"
                name="internal_link_status"
                defaultValue={currentServicePage.internal_link_status}
              />

              <StatusSelect
                label="Schema"
                name="schema_status"
                defaultValue={currentServicePage.schema_status}
              />

              <StatusSelect
                label="Indexing"
                name="indexing_status"
                defaultValue={currentServicePage.indexing_status}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className={buttonStyles.primary}>
              Save Changes
            </button>

            <Link
              href={`/projects/${currentServicePage.project_id}`}
              className={buttonStyles.secondary}
            >
              Cancel
            </Link>
          </div>
        </form>

        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-red-200">Danger Zone</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100/80">
                Delete this service page only if it should no longer be tracked.
                This removes it from the project service-page tracker.
              </p>
            </div>

            <form action={deleteServicePageWithId}>
              <input
                type="hidden"
                name="project_id"
                value={currentServicePage.project_id}
              />

              <button type="submit" className={buttonStyles.danger}>
                Delete Service Page
              </button>
            </form>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}