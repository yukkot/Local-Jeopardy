"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  PlayerBar,
  Player,
  pickPlayerColor,
} from "@/frontend/components/PlayerBar";
import { QuestionModal } from "@/frontend/components/QuestionModal";
import { RouletteModal } from "@/frontend/components/RouletteModal";
import { applyScore, ScoreOutcome } from "@/backend/logic/scoring";
import { shuffle, isMinigameValue } from "@/backend/logic/random";
import { nextTurnHolder, holderAfterRemoval } from "@/backend/logic/turns";
import {
  INITIAL_STAR_STATE,
  StarState,
  starAfterOutcome,
  starAfterToggle,
} from "@/backend/logic/star";
import { getBoardById } from "@/frontend/lib/apiClient";

interface Question {
  id: string;
  value: number;
  prompt: string;
  correct_answer: string | null;
  media_url: string | null;
  answer_media_url: string | null;
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

const DRAW_TICKS = 14;
const DRAW_INTERVAL_MS = 100;

export function GameScreen({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [outcomes, setOutcomes] = useState<Record<string, ScoreOutcome>>({});
  const [roulettePending, setRoulettePending] = useState<Question | null>(null);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [turnPlayerId, setTurnPlayerId] = useState<string | null>(null);
  const [star, setStar] = useState<StarState>(INITIAL_STAR_STATE);
  const drawTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const playersRef = useRef<Player[]>([]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    return () => {
      if (drawTimer.current) clearInterval(drawTimer.current);
    };
  }, []);

  useEffect(() => {
    async function fetchBoard() {
      try {
        setLoading(true);
        const data = await getBoardById(boardId);
        setBoard(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la partida");
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [boardId]);

  const drawOrder = () => {
    if (players.length < 2 || drawing || gameStarted) return;
    setDrawing(true);
    let ticks = 0;
    drawTimer.current = setInterval(() => {
      const next = shuffle(playersRef.current);
      playersRef.current = next;
      setPlayers(next);
      ticks += 1;
      if (ticks >= DRAW_TICKS) {
        if (drawTimer.current) clearInterval(drawTimer.current);
        drawTimer.current = null;
        setTurnPlayerId(next[0]?.id ?? null);
        setDrawing(false);
      }
    }, DRAW_INTERVAL_MS);
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0,
        color: pickPlayerColor(prev),
      },
    ]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => {
    if (gameStarted) return;
    setTurnPlayerId(
      holderAfterRemoval(
        players.map((p) => p.id),
        id,
        turnPlayerId,
      ),
    );
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setOutcomes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleStar = (playerId: string) => {
    setStar((prev) => starAfterToggle(prev, playerId));
  };

  const setOutcome = (playerId: string, outcome: ScoreOutcome) => {
    setOutcomes((prev) => ({ ...prev, [playerId]: outcome }));
    setStar((prev) => starAfterOutcome(prev, playerId, outcome));
  };

  const submitScores = () => {
    if (!activeQuestion) return;

    setPlayers((prev) =>
      prev.map((player) => {
        const nextScore = applyScore(
          player.score,
          activeQuestion.value,
          outcomes[player.id] ?? "none",
        );
        return { ...player, score: nextScore };
      }),
    );

    setTurnPlayerId(
      nextTurnHolder(
        players.map((p) => p.id),
        turnPlayerId,
        star.playerId,
      ),
    );
    setUsedQuestions((prev) => [...prev, activeQuestion.id]);
    setActiveQuestion(null);
    setIsRevealed(false);
    setParticipantCount(null);
  };

  const startQuestion = (q: Question, participants: number | null) => {
    setActiveQuestion(q);
    setIsRevealed(false);
    setOutcomes({});
    setStar(INITIAL_STAR_STATE);
    setParticipantCount(participants);
  };

  const openQuestion = (q: Question) => {
    if (usedQuestions.includes(q.id)) return;
    setGameStarted(true);
    if (isMinigameValue(q.value) && players.length >= 2) {
      setRoulettePending(q);
      return;
    }
    startQuestion(q, null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-ink-muted font-mono text-sm">
        cargando partida...
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-void text-ink flex flex-col items-center justify-center gap-3">
        <p className="font-mono text-sm text-ink-muted">
          {error || "Tablero no encontrado"}
        </p>
        <Link
          href="/"
          className="font-mono text-xs text-marigold hover:underline"
        >
          ← volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-void text-ink p-6 sm:p-10">
      <header className="mb-8">
        <Link
          href="/"
          className="font-mono text-xs text-ink-muted hover:text-ink transition inline-block mb-2"
        >
          ← volver a tableros
        </Link>
        <h1 className="font-display font-black text-3xl text-ink tracking-tight">
          {board.name}
        </h1>
      </header>

      <PlayerBar
        players={players}
        newPlayerName={newPlayerName}
        setNewPlayerName={setNewPlayerName}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
        onDrawOrder={drawOrder}
        drawing={drawing}
        gameStarted={gameStarted}
        turnPlayerId={turnPlayerId}
      />

      <section
        className="grid gap-3 max-w-5xl mx-auto"
        style={{
          gridTemplateColumns: `repeat(${board.categories.length || 1}, minmax(0, 1fr))`,
        }}
      >
        {board.categories.map((cat) => (
          <div key={cat.id} className="flex flex-col">
            <div className="bg-panel border-t-2 border-marigold px-3 py-4 min-h-[76px] flex items-center justify-center text-center rounded-t-md">
              <span className="font-display font-semibold text-sm sm:text-base text-ink leading-snug">
                {cat.name}
              </span>
            </div>

            {cat.questions.map((q, qi) => {
              const isUsed = usedQuestions.includes(q.id);
              const isLast = qi === cat.questions.length - 1;
              return (
                <button
                  key={q.id}
                  disabled={isUsed}
                  onClick={() => openQuestion(q)}
                  className={`h-24 flex items-center justify-center font-mono text-2xl font-bold transition ${
                    isLast ? "rounded-b-md" : ""
                  } ${
                    isUsed
                      ? "bg-void border-x border-b border-void cursor-default"
                      : "bg-panel-deep hover:bg-panel text-marigold border-x border-b border-ink-muted/10 hover:border-marigold/50 active:scale-[0.98]"
                  }`}
                >
                  {isUsed ? "" : `$${q.value}`}
                </button>
              );
            })}
          </div>
        ))}
      </section>

      {roulettePending && (
        <RouletteModal
          maxPlayers={players.length}
          questionValue={roulettePending.value}
          onCancel={() => setRoulettePending(null)}
          onContinue={(participants) => {
            const question = roulettePending;
            setRoulettePending(null);
            startQuestion(question, participants);
          }}
        />
      )}

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          isRevealed={isRevealed}
          setIsRevealed={setIsRevealed}
          participantCount={participantCount}
          players={players}
          outcomes={outcomes}
          setOutcome={setOutcome}
          starPlayerId={star.playerId}
          onToggleStar={toggleStar}
          submitScores={submitScores}
          close={() => {
            setActiveQuestion(null);
            setIsRevealed(false);
            setParticipantCount(null);
          }}
        />
      )}
    </main>
  );
}