"use client";

import { useState } from "react";
import { login } from "@/frontend/lib/apiClient";

export function LoginScreen() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ok = await login(password);

    if (ok) {
      window.location.href = "/admin";
    } else {
      setError("Contraseña incorrecta");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-void flex flex-col items-center justify-center gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <h1 className="font-display font-semibold text-xl text-ink">
          Acceso al panel
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="px-3 py-2 rounded bg-panel-deep border border-ink-muted/20 font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
        />
        {error && <p className="font-mono text-rose text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded bg-marigold hover:bg-marigold/85 disabled:opacity-50 text-void font-mono font-bold transition"
        >
          {loading ? "entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}