export type Rng = () => number;

export const MINIGAME_MIN_VALUE = 1000;

export const secureRandom: Rng = () => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 4294967296;
};

export function shuffle<T>(items: T[], rng: Rng = secureRandom): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function rollParticipants(
  maxPlayers: number,
  rng: Rng = secureRandom
): number {
  if (maxPlayers < 1) return 0;
  return Math.floor(rng() * maxPlayers) + 1;
}

export function isMinigameValue(value: number): boolean {
  return value >= MINIGAME_MIN_VALUE;
}