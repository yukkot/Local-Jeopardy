import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  clearedSessionCookieOptions,
} from "@/backend/services/authService";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", clearedSessionCookieOptions());
  return response;
}