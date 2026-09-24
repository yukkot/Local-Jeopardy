"use client";

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface PlayerBarProps {
  players: Player[];
  newPlayerName: string;
  setNewPlayerName: (val: string) => void;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
}

export function PlayerBar({
  players,
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  removePlayer,
}: PlayerBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  return (
    <section className="mb-8 border-b border-zinc-800 pb-6">
      {/* input de participantes */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Participantes ({players.length})
          </span>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            placeholder="Escribe un nombre..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-56 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />
          <button
            onClick={addPlayer}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded text-sm transition shrink-0"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* lista de participantes o estado vacío */}
      {players.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500">
            Aún no hay participantes en esta partida.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="group relative bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 text-center transition hover:border-zinc-700"
            >
              <button
                onClick={() => removePlayer(p.id)}
                className="absolute top-1.5 right-1.5 text-zinc-600 hover:text-red-400 text-xs px-1 rounded transition opacity-0 group-hover:opacity-100"
                title="Eliminar jugador"
              >
                ✕
              </button>
              <p className="text-xs font-medium text-zinc-400 truncate mb-1 pr-3">
                {p.name}
              </p>
              <p
                className={`text-2xl font-mono font-bold tracking-tight ${
                  p.score < 0
                    ? "text-red-400"
                    : p.score > 0
                    ? "text-amber-400"
                    : "text-zinc-200"
                }`}
              >
                ${p.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}