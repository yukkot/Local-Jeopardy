"use client";

import Link from "next/link";
import { logout } from "@/frontend/lib/apiClient";

interface AdminHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function AdminHeader({ backHref, backLabel }: AdminHeaderProps) {
  async function handleLogout() {
    await logout();
    // Navegacion dura, por la misma razon que en LoginScreen: evita que el
    // cliente reuse una respuesta en cache de cuando SI habia sesion.
    window.location.href = "/";
  }

  return (
    <div className="flex items-center justify-between mb-2">
      {backHref ? (
        <Link
          href={backHref}
          className="font-mono text-xs text-ink-muted hover:text-ink transition"
        >
          {backLabel || "← volver"}
        </Link>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="font-mono text-xs text-ink-muted hover:text-rose transition"
      >
        cerrar sesión
      </button>
    </div>
  );
}