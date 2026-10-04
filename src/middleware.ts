import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/backend/services/authService";

// Protege todo lo que este bajo /admin. Vive en la raiz de src/ porque asi
// lo exige la convencion de Next.js (no se puede mover a backend/ ni a
// frontend/), pero delega el nombre de la cookie a backend/services/authService
// para no repetirlo en dos lugares.
export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (session !== process.env.ADMIN_PASSWORD) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
