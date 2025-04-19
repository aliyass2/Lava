// middleware.ts
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken }              from "@/lib/auth";

const NEED_AUTH_METHODS = ["POST", "PUT", "DELETE"];
const PUBLIC_APIS       = ["/api/admin/login"];

export async function middleware(req: NextRequest) {
  const method   = req.method.toUpperCase();
  const pathname = req.nextUrl.pathname;


  // 1) Identify route type
  const isDashboard = pathname.startsWith("/dashboard");
  const isApi       = pathname.startsWith("/api/");
  const isPublicApi = PUBLIC_APIS.includes(pathname);
  // 2) Decide if we need authentication
  const needsAuth =
    isDashboard ||
    (isApi && !isPublicApi && NEED_AUTH_METHODS.includes(method));

  if (!needsAuth) {
    return NextResponse.next();
  }

  // 3) Extract token (header first, fallback to cookie)
  const rawHeader = req.headers.get("authorization");
  const token = rawHeader?.startsWith("Bearer ")
    ? rawHeader.split(" ")[1]
    : req.cookies.get("auth_token")?.value;

  // 4) Verify token
  const user = token ? await verifyToken(token) : null;

  // 5) Handle unauthorized
  if (!user) {
    if (isApi) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 6) Authenticated: forward user and continue
  req.headers.set("x-user-id", user.uid);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // run on everything except Next.js static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
