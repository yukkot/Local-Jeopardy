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
    <section className="mb-8 pb-6 border-b border-ink-muted/15">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <span className="font-mono text-xs text-ink-muted">
          Participantes ({players.length})
        </span>

        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            placeholder="Nombre del jugador"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-56 px-3 py-1.5 bg-panel-deep border border-ink-muted/20 rounded text-sm font-mono text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
          />
          <button
            onClick={addPlayer}
            className="px-4 py-1.5 bg-marigold hover:bg-marigold/85 text-void font-mono font-bold rounded text-sm transition shrink-0"
          >
            Agregar
          </button>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-ink-muted/20 rounded-lg">
          <p className="font-mono text-xs text-ink-muted">
            Todavía no hay participantes en esta partida.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="group relative bg-panel border border-ink-muted/15 rounded-md p-3 text-center transition hover:border-ink-muted/30"
            >
              <button
                onClick={() => removePlayer(p.id)}
                className="absolute top-1.5 right-1.5 text-ink-muted/50 hover:text-rose text-xs px-1 rounded transition opacity-0 group-hover:opacity-100"
                title="Eliminar jugador"
              >
                ✕
              </button>
              <p className="font-display text-sm font-medium text-ink-muted truncate mb-1 pr-3">
                {p.name}
              </p>
              <p
                className={`font-mono text-2xl font-bold tracking-tight ${
                  p.score < 0
                    ? "text-rose"
                    : p.score > 0
                    ? "text-marigold"
                    : "text-ink"
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
