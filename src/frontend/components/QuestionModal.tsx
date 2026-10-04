"use client";

import { useState } from "react";
import { Player } from "./PlayerBar";

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
  players: Player[];
  selectedWinners: string[];
  toggleWinner: (id: string) => void;
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

export function QuestionModal({
  question,
  isRevealed,
  setIsRevealed,
  players,
  selectedWinners,
  toggleWinner,
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
          <span className="font-mono font-bold text-lg text-marigold">
            ${question.value}
          </span>
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
                <label className="font-mono text-xs text-ink-muted block mb-2">
                  ¿Quién acertó? (+${question.value})
                </label>
                {players.length === 0 ? (
                  <p className="font-mono text-xs text-ink-muted/70 italic py-2">
                    No hay participantes registrados. Puedes confirmar igual
                    para marcar la casilla como usada.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                    {players.map((p) => {
                      const isChecked = selectedWinners.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleWinner(p.id)}
                          className={`flex items-center justify-between px-3 py-2 rounded-md border font-mono text-xs font-semibold transition ${
                            isChecked
                              ? "bg-marigold/15 border-marigold text-marigold"
                              : "bg-panel-deep border-ink-muted/15 text-ink-muted hover:border-ink-muted/30"
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          <span>{isChecked ? "✓" : "○"}</span>
                        </button>
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