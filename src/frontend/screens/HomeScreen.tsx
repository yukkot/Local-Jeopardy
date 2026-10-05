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
        className="fixed top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2 font-mono text-sm font-bold text-void shadow-lg shadow-marigold/25 ring-1 ring-marigold/60 transition hover:-translate-y-0.5 hover:bg-marigold/90 hover:shadow-marigold/40 active:translate-y-0"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        Administrar
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