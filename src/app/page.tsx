"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface BoardSummary {
  id: string;
  name: string;
}

export default function HomePage() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoards() {
      const { data, error } = await supabase
        .from("boards")
        .select("id, name");

      if (error) {
        console.error("Error al obtener tableros:", error.message);
      } else if (data) {
        setBoards(data);
      }
      setLoading(false);
    }

    loadBoards();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#070b19] text-white font-sans">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-[#ffcb05] mb-2 tracking-wide">
          Jeopardy Casero
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          Selecciona un tablero para comenzar la partida!!
        </p>

        {loading ? (
          <p className="text-slate-400 animate-pulse text-sm">Cargando tableros...</p>
        ) : boards.length === 0 ? (
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No hay tableros registrados aún :c </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/game/${board.id}`}
                className="group flex items-center justify-between p-4 bg-[#121b36] hover:bg-[#1b2952] border-2 border-slate-700 hover:border-yellow-400 rounded-xl transition shadow"
              >
                <span className="font-bold text-base group-hover:text-yellow-400 transition">
                  {board.name}
                </span>
                <span className="text-yellow-400 text-sm font-bold group-hover:translate-x-1 transition">
                  Jugar →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}