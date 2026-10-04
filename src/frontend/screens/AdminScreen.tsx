"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBoards, createBoard, BoardSummary } from "@/frontend/lib/apiClient";
import { AdminHeader } from "@/frontend/components/AdminHeader";

export function AdminScreen() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadBoards() {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoards();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createBoard(name.trim());
      setName("");
      await loadBoards();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-void text-ink px-6 py-16 sm:py-20">
      <div className="max-w-lg mx-auto">
        <AdminHeader />
        <h1 className="font-display font-black text-3xl text-marigold mb-2">
          Panel de administración
        </h1>
        <p className="font-mono text-sm text-ink-muted mb-8">
          Creá un tablero y después entrá para agregarle categorías y preguntas.
        </p>

        <form onSubmit={handleCreate} className="flex gap-2 mb-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del tablero nuevo"
            className="flex-1 px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-marigold hover:bg-marigold/85 disabled:opacity-50 text-void font-mono font-bold rounded text-sm transition shrink-0"
          >
            {saving ? "creando..." : "Crear"}
          </button>
        </form>

        {error && <p className="font-mono text-sm text-rose mb-4">{error}</p>}

        {loading ? (
          <p className="font-mono text-sm text-ink-muted animate-pulse">
            cargando...
          </p>
        ) : boards.length === 0 ? (
          <p className="font-mono text-sm text-ink-muted">
            Todavía no creaste ningún tablero.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {boards.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/boards/${b.id}`}
                  className="flex items-center justify-between bg-panel hover:bg-panel/70 border border-ink-muted/15 hover:border-marigold/50 rounded-lg px-4 py-3 transition"
                >
                  <span className="font-display text-ink">{b.name}</span>
                  <span className="font-mono text-xs text-marigold">editar</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}