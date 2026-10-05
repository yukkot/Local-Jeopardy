"use client";

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

export const PLAYER_COLORS = [
  "#2DD4BF",
  "#F472B6",
  "#A78BFA",
  "#60A5FA",
  "#A3E635",
  "#FB923C",
  "#FACC15",
  "#F87171",
  "#E879F9",
  "#4ADE80",
];

export function pickPlayerColor(players: Player[]): string {
  const used = new Set(players.map((p) => p.color));
  const free = PLAYER_COLORS.find((c) => !used.has(c));
  return free ?? PLAYER_COLORS[players.length % PLAYER_COLORS.length];
}

export function formatScore(score: number): string {
  return score < 0 ? `-$${Math.abs(score)}` : `$${score}`;
}

interface PlayerBarProps {
  players: Player[];
  newPlayerName: string;
  setNewPlayerName: (val: string) => void;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  onDrawOrder: () => void;
  drawing: boolean;
  gameStarted: boolean;
  turnPlayerId: string | null;
}

export function PlayerBar({
  players,
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  removePlayer,
  onDrawOrder,
  drawing,
  gameStarted,
  turnPlayerId,
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
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-muted">
            Participantes ({players.length})
          </span>
          <button
            type="button"
            onClick={onDrawOrder}
            disabled={players.length < 2 || drawing || gameStarted}
            title={
              gameStarted
                ? "El orden solo se puede sortear antes de abrir la primera pregunta"
                : undefined
            }
            className="px-3 py-1 border border-marigold/50 text-marigold hover:bg-marigold/10 disabled:opacity-30 disabled:hover:bg-transparent font-mono text-xs rounded transition"
          >
            {drawing
              ? "sorteando..."
              : gameStarted
                ? "Orden fijado"
                : "Sortear orden"}
          </button>
        </div>

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
          {players.map((p) => {
            const isTurn = p.id === turnPlayerId;
            return (
              <div
                key={p.id}
                className="group relative bg-panel border border-ink-muted/15 rounded-md p-3 text-center transition-all duration-300 hover:border-ink-muted/30"
                style={{
                  borderTopColor: p.color,
                  borderTopWidth: 4,
                  ...(isTurn
                    ? {
                        borderLeftColor: `${p.color}66`,
                        borderRightColor: `${p.color}66`,
                        borderBottomColor: `${p.color}66`,
                        backgroundColor: `${p.color}1F`,
                        boxShadow: `0 0 18px 2px ${p.color}55`,
                      }
                    : {}),
                }}
              >
                {!gameStarted && (
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="absolute top-2 right-1.5 text-ink-muted/50 hover:text-rose text-xs px-1 rounded transition opacity-0 group-hover:opacity-100"
                    title="Eliminar jugador"
                  >
                    ✕
                  </button>
                )}
                <p
                  className="font-display text-sm font-semibold truncate mb-1 pr-3"
                  style={{ color: p.color }}
                >
                  {p.name}
                </p>
                <p
                  className={`font-mono text-2xl font-bold tracking-tight ${
                    p.score < 0 ? "text-rose" : "text-ink"
                  }`}
                >
                  {formatScore(p.score)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}