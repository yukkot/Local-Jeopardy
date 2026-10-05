"use client";

import { useEffect, useState } from "react";
import { rollParticipants, secureRandom } from "@/backend/logic/random";

interface RouletteModalProps {
  maxPlayers: number;
  questionValue: number;
  onContinue: (participants: number) => void;
  onCancel: () => void;
}

const SLICE_COLORS = ["#372952", "#2A1D40", "#46346A"];
const SPIN_MS = 4500;
const RADIUS = 96;

function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 100 + radius * Math.sin(rad), y: 100 - radius * Math.cos(rad) };
}

export function RouletteModal({
  maxPlayers,
  questionValue,
  onContinue,
  onCancel,
}: RouletteModalProps) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "spinning") return;
    const timer = setTimeout(() => setPhase("done"), SPIN_MS + 150);
    return () => clearTimeout(timer);
  }, [phase]);

  const slice = 360 / maxPlayers;
  const fontSize = maxPlayers > 12 ? 9 : 13;

  function spin() {
    if (phase !== "idle") return;
    const chosen = rollParticipants(maxPlayers);
    const center = (chosen - 1) * slice + slice / 2;
    const jitter = (secureRandom() - 0.5) * slice * 0.6;
    setResult(chosen);
    setRotation(360 * 6 + (360 - center) + jitter);
    setPhase("spinning");
  }

  return (
    <div className="fixed inset-0 bg-void/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-panel border border-ink-muted/20 rounded-xl max-w-md w-full p-6 text-ink shadow-2xl flex flex-col items-center gap-5">
        <div className="text-center">
          <p className="font-mono text-xs text-marigold mb-1">
            Minijuego de ${questionValue}
          </p>
          <h2 className="font-display font-semibold text-xl text-ink">
            ¿Cuántas personas participan?
          </h2>
        </div>

        <div className="relative w-64 h-64">
          <svg
            className="absolute left-1/2 -translate-x-1/2 -top-3 z-10"
            width="28"
            height="24"
            viewBox="0 0 28 24"
          >
            <polygon
              points="0,0 28,0 14,24"
              fill="#F2A93B"
              stroke="#17101F"
              strokeWidth="2"
            />
          </svg>

          <div
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition:
                phase === "spinning"
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.7, 0.15, 1)`
                  : "none",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {Array.from({ length: maxPlayers }, (_, i) => {
                const start = pointAt(i * slice, RADIUS);
                const end = pointAt((i + 1) * slice, RADIUS);
                const mid = i * slice + slice / 2;
                const label = pointAt(mid, 66);
                return (
                  <g key={i}>
                    <path
                      d={`M100 100 L${start.x} ${start.y} A${RADIUS} ${RADIUS} 0 ${
                        slice > 180 ? 1 : 0
                      } 1 ${end.x} ${end.y} Z`}
                      fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                      stroke="#F2A93B"
                      strokeWidth="1"
                    />
                    <text
                      x={label.x}
                      y={label.y}
                      transform={`rotate(${mid} ${label.x} ${label.y})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      fontWeight="700"
                      fill="#F5EFE6"
                      fontFamily="var(--font-space-mono), monospace"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="9" fill="#17101F" stroke="#F2A93B" />
            </svg>
          </div>
        </div>

        <div className="h-14 flex items-center justify-center">
          {phase === "done" && result !== null ? (
            <p className="font-display font-black text-2xl text-marigold text-center">
              Participan {result} {result === 1 ? "jugador" : "jugadores"}
            </p>
          ) : (
            <p className="font-mono text-xs text-ink-muted text-center">
              {phase === "spinning"
                ? "girando..."
                : `Salen números del 1 al ${maxPlayers}`}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          {phase === "done" && result !== null ? (
            <button
              type="button"
              onClick={() => onContinue(result)}
              className="w-full py-3 bg-teal hover:bg-teal/85 text-void font-mono font-bold rounded-lg text-sm transition active:scale-[0.99]"
            >
              Continuar a la pregunta
            </button>
          ) : (
            <button
              type="button"
              onClick={spin}
              disabled={phase !== "idle"}
              className="w-full py-3 bg-marigold hover:bg-marigold/85 disabled:opacity-50 text-void font-mono font-bold rounded-lg text-sm transition active:scale-[0.99]"
            >
              {phase === "spinning" ? "girando..." : "Girar ruleta"}
            </button>
          )}
          {phase !== "spinning" && (
            <button
              type="button"
              onClick={onCancel}
              className="font-mono text-xs text-ink-muted hover:text-ink transition py-1"
            >
              cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}