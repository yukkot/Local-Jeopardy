export function nextTurnHolder(
  playerIds: string[],
  currentId: string | null,
  starId: string | null
): string | null {
  if (playerIds.length === 0) return null;
  if (starId && playerIds.includes(starId)) return starId;

  const currentIndex = currentId ? playerIds.indexOf(currentId) : 0;
  const from = currentIndex === -1 ? 0 : currentIndex;
  return playerIds[(from + 1) % playerIds.length];
}

export function holderAfterRemoval(
  playerIds: string[],
  removedId: string,
  currentId: string | null
): string | null {
  const remaining = playerIds.filter((id) => id !== removedId);
  if (remaining.length === 0) return null;
  if (currentId !== removedId) return currentId;

  const position = playerIds.indexOf(removedId);
  return remaining[position % remaining.length];
}