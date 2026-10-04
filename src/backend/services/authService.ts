import { cookies } from "next/headers";

// Logica de autenticacion del panel de admin.

export const SESSION_COOKIE_NAME = "admin_session";

export function validateAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  };
}

// Mismas opciones que la cookie de sesion, pero con maxAge 0: le dice al
// navegador que la borre de inmediato. Se usa en /api/auth/logout.
export function clearedSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}

export function isAuthorizedRequest(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return Boolean(session) && session === process.env.ADMIN_PASSWORD;
}