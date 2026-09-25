"use client";

import { Player } from "./PlayerBar";

interface QuestionModalProps {
  question: any;
  isRevealed: boolean;
  setIsRevealed: (val: boolean) => void;
  players: Player[];
  selectedWinners: string[];
  toggleWinner: (id: string) => void;
  submitScores: () => void;
  close: () => void;
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
  const parts = (question.image_url || "").split("|");
  const clueUrl = parts[0];
  const solutionUrl = parts[1] || parts[0];
  const correctAnswer = question.answer_options?.find((opt: any) => opt.is_correct)?.text;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 text-zinc-100 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* cabecera */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800 shrink-0">
          <span className="text-[#ffcb05] font-mono font-black text-lg tracking-wider">
            ${question.value}
          </span>
          <button
            onClick={close}
            className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-600 transition"
          >
            ✕ Cerrar
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center text-zinc-100 shrink-0">
          {question.prompt}
        </h2>

        {/* imagen / pista /solución ampliada */}
        {clueUrl && (
          <div className="mb-6 flex justify-center shrink-0">
            <div className="bg-[#06142e] border border-[#1b4380] rounded-xl p-3 w-full max-w-xl h-80 sm:h-[420px] flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={isRevealed ? solutionUrl : clueUrl}
                alt="Pista o Solución Pokémon"
                className="w-full h-full object-contain drop-shadow-lg transition-transform duration-200"
              />
            </div>
          </div>
        )}

        {/*respuesta */}
        {isRevealed && correctAnswer && (
          <div className="bg-zinc-950 border border-[#ffcb05]/40 rounded-xl p-3.5 mb-6 text-center shrink-0">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block mb-1">
              Respuesta Correcta
            </span>
            <p className="text-2xl font-black text-[#ffcb05] tracking-wide">
              {correctAnswer}
            </p>
          </div>
        )}

        {/* acciones de nuestro admii */}
        <div className="mt-auto shrink-0">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full py-3 bg-[#ffcb05] hover:bg-[#e5b700] text-zinc-950 font-black rounded-lg text-base transition shadow-md active:scale-[0.99]"
            >
              Revelar Solución
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-2 font-medium">
                  Selecciona a los participantes que acertaron (+${question.value}):
                </label>
                {players.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-2">
                    No hay participantes registrados. Puedes confirmar para marcar la casilla como usada.
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
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                            isChecked
                              ? "bg-[#ffcb05]/15 border-[#ffcb05] text-[#ffcb05]"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          <span className="text-xs font-mono">{isChecked ? "✓" : "○"}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={submitScores}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition shadow-md active:scale-[0.99]"
              >
                Confirmar y Aplicar Puntos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}