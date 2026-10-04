import { NextResponse } from "next/server";
import {
  validateAdminPassword,
  sessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/backend/services/authService";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!validateAdminPassword(password)) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    SESSION_COOKIE_NAME,
    process.env.ADMIN_PASSWORD ?? "",
    sessionCookieOptions()
  );

  return response;
}
