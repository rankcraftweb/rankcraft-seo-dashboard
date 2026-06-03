import DashboardShell from "@/components/DashboardShell";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createProject(formData: FormData) {
  "use server";

  const businessName = formData.get("business_name") as string;
  const websiteUrl = formData.get("website_url") as string;
  const industry = formData.get("industry") as string;
  const targetLocation = formData.get("target_location") as string;
  const status = formData.get("status") as string;

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  const { error } = await supabase.from("projects").insert({
    business_name: businessName,
    website_url: websiteUrl,
    industry,
    target_location: targetLocation,
    status,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}

export default function NewProjectPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            New Project
          </p>

          <h1 className="mt-3 text-3xl font-bold">Add SEO Project</h1>

          <p className="mt-2 text-slate-400">
            Create a new local SEO project and save it directly to Supabase.
          </p>
        </div>

        <form
          action={createProject}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="business_name"
                className="block text-sm font-semibold text-slate-300"
              >
                Business Name
              </label>

              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                placeholder="Example: Practical Exterior Maintenance"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="website_url"
                className="block text-sm font-semibold text-slate-300"
              >
                Website URL
              </label>

              <input
                id="website_url"
                name="website_url"
                type="url"
                placeholder="https://example.com"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-semibold text-slate-300"
                >
                  Industry
                </label>

                <input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder="Exterior Maintenance"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="target_location"
                  className="block text-sm font-semibold text-slate-300"
                >
                  Target Location
                </label>

                <input
                  id="target_location"
                  name="target_location"
                  type="text"
                  placeholder="Long Island, NY"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </div>
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
                defaultValue="In Progress"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Needs Review</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Save Project
              </button>

              <a
                href="/projects"
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