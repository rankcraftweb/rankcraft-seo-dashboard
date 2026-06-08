import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/dashboard").trim();

  if (!email || !password) {
    redirect("/login?error=missing_fields");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  redirect(redirectTo || "/dashboard");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const redirectTo = params.redirectTo || "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
            RankCraft
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            SEO Ops Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to access the internal SEO project dashboard.
          </p>
        </div>

        <form
          action={login}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {error ? (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error === "missing_fields"
                ? "Please enter your email and password."
                : "Invalid email or password. Please try again."}
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-bold text-slate-200">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-200">Password</span>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter password"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </label>

          <button
            type="submit"
            className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-6 text-slate-500">
          Protected portfolio MVP dashboard built with Next.js and Supabase.
        </p>
      </div>
    </main>
  );
}