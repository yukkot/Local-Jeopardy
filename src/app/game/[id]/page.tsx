"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayerBar, Player } from "@/components/PlayerBar";
import { QuestionModal } from "@/components/QuestionModal";
import { applyScore } from "@/lib/scoring";

interface AnswerOption {
  id: string;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  value: number;
  prompt: string;
  image_url: string | null;
  answer_options: AnswerOption[];
}

interface Category {
  id: string;
  name: string;
  position: number;
  questions: Question[];
}

interface BoardData {
  id: string;
  name: string;
  categories: Category[];
}

export default function GameRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const boardId = params.id;

  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBoard() {
      try {
        setLoading(true);
        const res = await fetch(`/api/boards/${boardId}`);
        if (!res.ok) throw new Error("No se pudo cargar el tablero");
        const data = await res.json();
        setBoard(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la partida");
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [boardId]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newPlayerName.trim(), score: 0 },
    ]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setSelectedWinners((prev) => prev.filter((wId) => wId !== id));
  };

  const toggleWinner = (playerId: string) => {
    setSelectedWinners((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const submitScores = () => {
    if (!activeQuestion) return;

    setPlayers((prev) =>
      prev.map((player) => {
        const isWinner = selectedWinners.includes(player.id);
        const nextScore = applyScore(player.score, activeQuestion.value, isWinner);
        return { ...player, score: nextScore };
      })
    );

    setUsedQuestions((prev) => [...prev, activeQuestion.id]);
    setActiveQuestion(null);
    setIsRevealed(false);
  };

  const openQuestion = (q: Question) => {
    if (usedQuestions.includes(q.id)) return;
    setActiveQuestion(q);
    setIsRevealed(false);
    setSelectedWinners([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-sm">
        Cargando partida...
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col items-center justify-center gap-3">
        <p className="text-zinc-400 text-sm">{error || "Tablero no encontrado"}</p>
        <Link href="/" className="text-amber-400 hover:underline text-xs">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10 font-sans selection:bg-amber-400 selection:text-black">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition block mb-1"
          >
            ← Volver a tableros
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {board.name}
          </h1>
        </div>
      </header>

      {/* participantes */}
      <PlayerBar
        players={players}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
      />

      {/* tablero */}
      <section
        className="grid gap-3 max-w-5xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${board.categories.length || 1}, minmax(0, 1fr))` }}
      >
        {board.categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-2">
            {/* categorías */}
            <div className="bg-[#0c2340] border border-[#1b4380] p-3 min-h-[70px] flex items-center justify-center text-center rounded shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {cat.name}
              </span>
            </div>

            {/* puntuaciones */}
            {cat.questions.map((q) => {
              const isUsed = usedQuestions.includes(q.id);
              return (
                <button
                  key={q.id}
                  disabled={isUsed}
                  onClick={() => openQuestion(q)}
                  className={`h-24 flex items-center justify-center rounded border font-mono text-2xl font-black transition ${
                    isUsed
                      ? "bg-zinc-950 text-zinc-800 border-zinc-900 cursor-not-allowed shadow-none"
                      : "bg-[#06142e] hover:bg-[#0c224a] text-[#ffcb05] border-[#1b4380] shadow-md active:scale-[0.98]"
                  }`}
                >
                  {isUsed ? "" : `$${q.value}`}
                </button>
              );
            })}
          </div>
        ))}
      </section>

      {/* modal de pregunts */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          isRevealed={isRevealed}
          setIsRevealed={setIsRevealed}
          players={players}
          selectedWinners={selectedWinners}
          toggleWinner={toggleWinner}
          submitScores={submitScores}
          close={() => {
            setActiveQuestion(null);
            setIsRevealed(false);
          }}
        />
      )}
    </main>
  );
}