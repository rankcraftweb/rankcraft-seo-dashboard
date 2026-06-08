import Link from "next/link";

export default function LogoutButton() {
  return (
    <Link
      href="/logout"
      className="inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-red-400 hover:text-red-300 lg:min-h-[48px] lg:w-full lg:justify-start lg:px-4 lg:py-3 lg:text-sm"
    >
      Logout
    </Link>
  );
}