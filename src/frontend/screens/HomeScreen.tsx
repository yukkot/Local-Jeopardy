"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBoards, BoardSummary } from "@/frontend/lib/apiClient";

export function HomeScreen() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los tableros");
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 sm:py-24">
      <Link
        href="/admin"
        className="fixed top-4 right-4 font-mono text-xs text-ink-muted/60 hover:text-marigold transition"
      >
        admin
      </Link>

      <div className="max-w-lg w-full">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-5xl sm:text-6xl text-marigold leading-none">
            Jeopardy Casero
          </h1>
          <p className="font-mono text-sm text-ink-muted mt-4">
            Elegí un tablero para arrancar la partida.
          </p>
        </div>

        {loading ? (
          <p className="font-mono text-sm text-ink-muted text-center animate-pulse">
            cargando tableros...
          </p>
        ) : error ? (
          <div className="border border-dashed border-rose/40 rounded-lg p-8 text-center">
            <p className="font-mono text-sm text-rose">{error}</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="border border-dashed border-ink-muted/25 rounded-lg p-8 text-center">
            <p className="font-mono text-sm text-ink-muted">
              Todavía no hay tableros creados.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {boards.map((board) => (
              <li key={board.id}>
                <Link
                  href={`/game/${board.id}`}
                  className="group flex items-center justify-between gap-4 bg-panel hover:bg-panel/70 border border-ink-muted/15 hover:border-marigold/60 rounded-lg px-5 py-4 transition"
                >
                  <span className="font-display font-semibold text-lg text-ink truncate">
                    {board.name}
                  </span>
                  <span className="font-mono text-xs text-marigold opacity-0 group-hover:opacity-100 transition">
                    jugar
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