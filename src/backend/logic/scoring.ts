export function applyScore(
  currentScore: number,
  value: number,
  correct: boolean
): number {
  return correct ? currentScore + value : currentScore - value;
}
