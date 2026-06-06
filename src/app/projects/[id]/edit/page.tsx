import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buttonStyles, formStyles } from "@/lib/ui";
import DashboardShell from "@/components/DashboardShell";

type Project = {
  id: string;
  business_name: string;
  website_url: string | null;
  industry: string | null;
  target_location: string | null;
  status: string | null;
};

const statusOptions = ["Planning", "In Progress", "Completed"];

async function updateProject(projectId: string, formData: FormData) {
  "use server";

  const businessName = String(formData.get("business_name") || "").trim();
  const websiteUrl = String(formData.get("website_url") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const targetLocation = String(formData.get("target_location") || "").trim();
  const status = String(formData.get("status") || "Planning").trim();

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  const { error } = await supabase
    .from("projects")
    .update({
      business_name: businessName,
      website_url: websiteUrl || null,
      industry: industry || null,
      target_location: targetLocation || null,
      status: status || "Planning",
    })
    .eq("id", projectId);

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
        defaultValue={defaultValue || "Planning"}
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

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="mt-3">Requested ID: {id}</p>
          <p className="mt-3 text-sm">
            Please check if this project exists in Supabase.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currentProject = project as Project;
  const updateProjectWithId = updateProject.bind(null, currentProject.id);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href={`/projects/${currentProject.id}`}
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Back to Project
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            Edit Project
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Update SEO Project
          </h1>

          <p className="mt-3 text-slate-300">
            Update the project profile, website details, target location, and
            current progress status.
          </p>
        </div>

        <form
          action={updateProjectWithId}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="grid gap-6">
            <Field
              label="Business Name"
              name="business_name"
              defaultValue={currentProject.business_name}
              placeholder="Example: Practical Exterior Maintenance"
            />

            <Field
              label="Website URL"
              name="website_url"
              defaultValue={currentProject.website_url}
              placeholder="https://example.com"
              type="url"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Industry"
                name="industry"
                defaultValue={currentProject.industry}
                placeholder="Exterior Maintenance"
              />

              <Field
                label="Target Location"
                name="target_location"
                defaultValue={currentProject.target_location}
                placeholder="Long Island, NY"
              />
            </div>

            <StatusSelect
              label="Status"
              name="status"
              defaultValue={currentProject.status}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className={buttonStyles.primary}>
              Save Changes
            </button>

            <Link
              href={`/projects/${currentProject.id}`}
              className={buttonStyles.secondary}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}