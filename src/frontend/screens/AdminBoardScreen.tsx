"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBoardById, createCategory } from "@/frontend/lib/apiClient";
import { AdminHeader } from "@/frontend/components/AdminHeader";

interface CategorySummary {
  id: string;
  name: string;
  position: number;
  questions: { id: string }[];
}

interface BoardDetail {
  id: string;
  name: string;
  categories: CategorySummary[];
}

export function AdminBoardScreen({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadBoard() {
    try {
      const data = await getBoardById(boardId);
      setBoard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !position) return;
    setSaving(true);
    setError(null);
    try {
      const newCategory = await createCategory(
        boardId,
        name.trim(),
        Number(position)
      );
      // En vez de volver a pedir el tablero entero al backend, agregamos la
      // categoria nueva directo al estado local
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              categories: [
                ...prev.categories,
                { ...newCategory, questions: [] },
              ],
            }
          : prev
      );
      setName("");
      setPosition("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center text-ink-muted font-mono text-sm">
        cargando tablero...
      </main>
    );
  }

  if (!board) {
    return (
      <main className="min-h-screen bg-void flex flex-col items-center justify-center gap-3 text-ink">
        <p className="font-mono text-sm text-ink-muted">
          {error || "Tablero no encontrado"}
        </p>
        <Link
          href="/admin"
          className="font-mono text-xs text-marigold hover:underline"
        >
          volver al panel
        </Link>
        {/* AdminHeader no va aca: esta pantalla de error no tiene sesion
            confirmada para mostrar "cerrar sesion" con sentido */}
      </main>
    );
  }

  const sortedCategories = [...board.categories].sort(
    (a, b) => a.position - b.position
  );

  return (
    <main className="min-h-screen bg-void text-ink px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <AdminHeader backHref="/admin" backLabel="← volver al panel" />
        <h1 className="font-display font-black text-3xl text-ink mb-1">
          {board.name}
        </h1>
        <p className="font-mono text-sm text-ink-muted mb-8">
          {sortedCategories.length} categoría(s) cargada(s)
        </p>

        <form
          onSubmit={handleCreateCategory}
          className="bg-panel border border-ink-muted/15 rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
          />
          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Posición (1, 2, 3...)"
            className="w-full sm:w-40 px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-marigold hover:bg-marigold/85 disabled:opacity-50 text-void font-mono font-bold rounded text-sm transition shrink-0"
          >
            {saving ? "creando..." : "Agregar categoría"}
          </button>
        </form>

        {error && <p className="font-mono text-sm text-rose mb-4">{error}</p>}

        {sortedCategories.length === 0 ? (
          <p className="font-mono text-sm text-ink-muted">
            Todavía no agregaste ninguna categoría.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sortedCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/admin/boards/${boardId}/categories/${cat.id}`}
                  className="flex items-center justify-between bg-panel hover:bg-panel/70 border border-ink-muted/15 hover:border-marigold/50 rounded-lg px-4 py-3 transition"
                >
                  <span className="font-display text-ink">
                    {cat.position}. {cat.name}
                  </span>
                  <span className="font-mono text-xs text-marigold">
                    {cat.questions.length} pregunta(s)
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}