import type { ScoreOutcome } from "@/backend/logic/scoring";

export interface StarState {
  playerId: string | null;
  auto: boolean;
  locked: boolean;
}

export const INITIAL_STAR_STATE: StarState = {
  playerId: null,
  auto: false,
  locked: false,
};

export function starAfterOutcome(
  state: StarState,
  playerId: string,
  outcome: ScoreOutcome
): StarState {
  if (outcome === "add" && state.playerId === null && !state.locked) {
    return { playerId, auto: true, locked: false };
  }
  if (state.auto && state.playerId === playerId && outcome !== "add") {
    return { playerId: null, auto: false, locked: false };
  }
  return state;
}

export function starAfterToggle(
  state: StarState,
  playerId: string
): StarState {
  return {
    playerId: state.playerId === playerId ? null : playerId,
    auto: false,
    locked: true,
  };
}