// middleware.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const NEED_AUTH_METHODS = ["POST", "PUT", "DELETE"];
const PUBLIC_APIS       = ["/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method       = req.method.toUpperCase();

  /* ---------- 1. Route classification ---------- */
  const isApi           = pathname.startsWith("/api/");
  const isPublicApi     = PUBLIC_APIS.includes(pathname);
  const isAdminLogin    = pathname === "/admin";        // public
  const isAdminPrivate  = pathname.startsWith("/admin/"); // protected
  const isDashboard     = pathname.startsWith("/dashboard");

  /* ---------- 2. Does this request need auth? ---------- */
  const needsAuth =
    isAdminPrivate ||
    isDashboard    ||
    (isApi && !isPublicApi && NEED_AUTH_METHODS.includes(method));

  if (!needsAuth) return NextResponse.next();

  /* ---------- 3. Read the token (header → cookie) ---------- */
  const rawHeader = req.headers.get("authorization");
  const token     = rawHeader?.startsWith("Bearer ")
                   ? rawHeader.slice(7)
                   : req.cookies.get("auth_token")?.value;

  /* ---------- 4. Verify ---------- */
  const user = token ? await verifyToken(token) : null;

  /* ---------- 5. Un‑auth → redirect / 401 ---------- */
  if (!user) {
    if (isApi) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // If the user tried to reach a protected admin page or the dashboard,
    // push them to the admin login screen
    if (isAdminPrivate || isDashboard) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Fallback for any other protected web page
    return NextResponse.redirect(new URL("/", req.url));
  }

  /* ---------- 6. Authenticated → forward ---------- */
  req.headers.set("x-user-id", user.uid);
  return NextResponse.next();
}

/* ---------- 7. Match everything except Next.js assets ---------- */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
