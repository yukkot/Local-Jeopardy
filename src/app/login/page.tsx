"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Contrasena incorrecta");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <h1 className="text-xl font-semibold">Acceso al panel</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasena"
          className="px-3 py-2 rounded bg-slate-800 border border-slate-600"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="px-3 py-2 rounded bg-yellow-500 text-slate-900 font-semibold"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
