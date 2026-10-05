"use client";

import { useState } from "react";
import { Player } from "./PlayerBar";
import type { ScoreOutcome } from "@/backend/logic/scoring";

interface QuestionModalProps {
  question: {
    value: number;
    prompt: string;
    correct_answer: string | null;
    media_url: string | null;
    answer_media_url: string | null;
  };
  isRevealed: boolean;
  setIsRevealed: (val: boolean) => void;
  participantCount?: number | null;
  players: Player[];
  outcomes: Record<string, ScoreOutcome>;
  setOutcome: (playerId: string, outcome: ScoreOutcome) => void;
  starPlayerId: string | null;
  onToggleStar: (playerId: string) => void;
  submitScores: () => void;
  close: () => void;
}

type MediaKind = "image" | "audio" | "video";

function getMediaKind(url: string): MediaKind {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(clean)) return "audio";
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(clean)) return "video";
  return "image";
}

function MediaView({ url }: { url: string }) {
  const kind = getMediaKind(url);
  const [imgLoading, setImgLoading] = useState(kind === "image");

  if (kind === "audio") {
    return (
      <div className="mb-4 shrink-0">
        <audio controls src={url} className="w-full" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="mb-4 flex justify-center shrink-0">
        <video
          controls
          src={url}
          className="w-full max-w-xl max-h-[420px] rounded-lg bg-panel-deep"
        />
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-center shrink-0">
      <div className="relative bg-panel-deep border border-ink-muted/15 rounded-lg p-3 w-full max-w-xl h-80 sm:h-[420px] flex items-center justify-center overflow-hidden">
        {imgLoading && (
          <span className="absolute font-mono text-xs text-ink-muted animate-pulse">
            cargando imagen...
          </span>
        )}
        <img
          src={url}
          alt="Archivo de la pregunta"
          ref={(node) => {
            if (node?.complete) setImgLoading(false);
          }}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
          className={`w-full h-full object-contain transition-opacity duration-200 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}

const OUTCOME_STYLES: Record<ScoreOutcome, string> = {
  add: "bg-teal/15 border-teal text-teal",
  subtract: "bg-rose/15 border-rose text-rose",
  none: "bg-ink-muted/15 border-ink-muted text-ink",
};

function OutcomeButton({
  tone,
  active,
  onClick,
  label,
}: {
  tone: ScoreOutcome;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded border font-mono text-xs font-semibold transition ${
        active
          ? OUTCOME_STYLES[tone]
          : "border-ink-muted/15 text-ink-muted hover:border-ink-muted/40"
      }`}
    >
      {label}
    </button>
  );
}

export function QuestionModal({
  question,
  isRevealed,
  setIsRevealed,
  participantCount,
  players,
  outcomes,
  setOutcome,
  starPlayerId,
  onToggleStar,
  submitScores,
  close,
}: QuestionModalProps) {
  const displayUrl =
    isRevealed && question.answer_media_url
      ? question.answer_media_url
      : question.media_url;

  return (
    <div className="fixed inset-0 bg-void/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-panel border border-ink-muted/20 rounded-xl max-w-2xl w-full p-6 text-ink shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink-muted/15 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg text-marigold">
              ${question.value}
            </span>
            {participantCount != null && (
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-marigold/40 text-marigold">
                Minijuego: {participantCount}{" "}
                {participantCount === 1 ? "jugador" : "jugadores"}
              </span>
            )}
          </div>
          <button
            onClick={close}
            className="font-mono text-xs text-ink-muted hover:text-ink px-2.5 py-1 rounded border border-ink-muted/20 hover:border-ink-muted/40 transition"
          >
            cerrar
          </button>
        </div>

        <h2 className="font-display font-semibold text-xl mb-4 text-center text-ink shrink-0">
          {question.prompt}
        </h2>

        {displayUrl && <MediaView key={displayUrl} url={displayUrl} />}

        {isRevealed && question.correct_answer && (
          <div className="bg-panel-deep border border-marigold/30 rounded-lg p-3.5 mb-6 mt-2 text-center shrink-0">
            <span className="font-mono text-[10px] text-ink-muted block mb-1">
              respuesta correcta
            </span>
            <p className="font-display text-2xl font-bold text-marigold">
              {question.correct_answer}
            </p>
          </div>
        )}

        <div className="mt-auto shrink-0 pt-2">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full py-3 bg-marigold hover:bg-marigold/85 text-void font-mono font-bold rounded-lg text-base transition active:scale-[0.99]"
            >
              Revelar respuesta
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs text-ink-muted block mb-1">
                  Puntaje de esta pregunta
                </label>
                {players.length === 0 ? (
                  <p className="font-mono text-xs text-ink-muted/70 italic py-2">
                    No hay participantes registrados.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                    {players.map((p) => {
                      const current = outcomes[p.id] ?? "none";
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 bg-panel-deep border border-ink-muted/15 rounded-md px-3 py-2"
                          style={{
                            borderLeftColor: p.color,
                            borderLeftWidth: 4,
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={() => onToggleStar(p.id)}
                              aria-pressed={starPlayerId === p.id}
                              title="Respondió correctamente"
                              className={`text-lg leading-none transition ${
                                starPlayerId === p.id
                                  ? "text-marigold"
                                  : "text-ink-muted/40 hover:text-marigold/70"
                              }`}
                            >
                              {starPlayerId === p.id ? "★" : "☆"}
                            </button>
                            <span
                              className="font-display text-sm font-semibold truncate"
                              style={{ color: p.color }}
                            >
                              {p.name}
                            </span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <OutcomeButton
                              tone="subtract"
                              active={current === "subtract"}
                              onClick={() => setOutcome(p.id, "subtract")}
                              label={`-$${question.value}`}
                            />
                            <OutcomeButton
                              tone="none"
                              active={current === "none"}
                              onClick={() => setOutcome(p.id, "none")}
                              label="Sin cambio"
                            />
                            <OutcomeButton
                              tone="add"
                              active={current === "add"}
                              onClick={() => setOutcome(p.id, "add")}
                              label={`+$${question.value}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={submitScores}
                className="w-full py-3 bg-teal hover:bg-teal/85 text-void font-mono font-bold rounded-lg text-sm transition active:scale-[0.99]"
              >
                Confirmar puntos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}