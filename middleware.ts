import type { NextRequest } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/service-pages/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/login",
  ],
};