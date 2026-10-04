jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";
import {
  validateAdminPassword,
  sessionCookieOptions,
  isAuthorizedRequest,
  SESSION_COOKIE_NAME,
} from "@/backend/services/authService";

describe("authService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_PASSWORD: "clave-secreta" };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("valida la contraseña correcta", () => {
    expect(validateAdminPassword("clave-secreta")).toBe(true);
  });

  it("rechaza una contraseña incorrecta", () => {
    expect(validateAdminPassword("otra-cosa")).toBe(false);
  });

  it("devuelve las opciones de cookie esperadas", () => {
    const options = sessionCookieOptions();
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.maxAge).toBe(60 * 60 * 8);
    expect(options.path).toBe("/");
  });

  it("expone un nombre de cookie constante", () => {
    expect(SESSION_COOKIE_NAME).toBe("admin_session");
  });

  it("isAuthorizedRequest autoriza cuando la cookie coincide", () => {
    (cookies as jest.Mock).mockReturnValue({
      get: (name: string) =>
        name === SESSION_COOKIE_NAME ? { value: "clave-secreta" } : undefined,
    });

    expect(isAuthorizedRequest()).toBe(true);
  });

  it("isAuthorizedRequest rechaza cuando no hay cookie", () => {
    (cookies as jest.Mock).mockReturnValue({ get: () => undefined });

    expect(isAuthorizedRequest()).toBe(false);
  });

  it("isAuthorizedRequest rechaza cuando la cookie no coincide", () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: "otra-cosa" }),
    });

    expect(isAuthorizedRequest()).toBe(false);
  });
});
