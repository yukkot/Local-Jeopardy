export type ScoreOutcome = "add" | "subtract" | "none";

export function applyScore(
  currentScore: number,
  value: number,
  outcome: ScoreOutcome
): number {
  if (outcome === "add") return currentScore + value;
  if (outcome === "subtract") return currentScore - value;
  return currentScore;
}