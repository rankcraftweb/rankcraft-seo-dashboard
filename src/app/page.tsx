export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          RankCraft SEO Ops
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Local SEO operations dashboard for service-based businesses.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Track service pages, audit tasks, internal links, image alt text,
          indexing status, and client-ready reports in one modern dashboard.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            View Dashboard
          </a>

          <a
            href="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
          >
            Sign In
          </a>
        </div>
      </section>
    </main>
  );
}