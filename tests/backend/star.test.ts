import {
  INITIAL_STAR_STATE,
  starAfterOutcome,
  starAfterToggle,
} from "@/backend/logic/star";

describe("starAfterOutcome", () => {
  it("asigna la estrella al primer jugador al que se le suman puntos", () => {
    const state = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    expect(state).toEqual({ playerId: "a", auto: true, locked: false });
  });

  it("no cambia la estrella cuando se suman puntos a un segundo jugador", () => {
    const first = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    const second = starAfterOutcome(first, "b", "add");
    expect(second.playerId).toBe("a");
  });

  it("no asigna la estrella al restar puntos ni al dejar sin cambio", () => {
    expect(starAfterOutcome(INITIAL_STAR_STATE, "a", "subtract")).toBe(
      INITIAL_STAR_STATE
    );
    expect(starAfterOutcome(INITIAL_STAR_STATE, "a", "none")).toBe(
      INITIAL_STAR_STATE
    );
  });

  it("libera la estrella automatica si se deshace el puntaje de su dueno", () => {
    const auto = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    const undone = starAfterOutcome(auto, "a", "none");
    expect(undone).toEqual(INITIAL_STAR_STATE);

    const reassigned = starAfterOutcome(undone, "b", "add");
    expect(reassigned.playerId).toBe("b");
  });

  it("libera la estrella automatica tambien si el dueno pasa a restar", () => {
    const auto = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    expect(starAfterOutcome(auto, "a", "subtract").playerId).toBeNull();
  });

  it("no toca la estrella cuando cambia el puntaje de otro jugador", () => {
    const auto = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    expect(starAfterOutcome(auto, "b", "none")).toBe(auto);
  });
});

describe("starAfterToggle", () => {
  it("asigna la estrella a mano y bloquea la asignacion automatica", () => {
    const state = starAfterToggle(INITIAL_STAR_STATE, "a");
    expect(state).toEqual({ playerId: "a", auto: false, locked: true });
  });

  it("quita la estrella al volver a pulsarla y no se reasigna sola", () => {
    const auto = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    const removed = starAfterToggle(auto, "a");
    expect(removed).toEqual({ playerId: null, auto: false, locked: true });

    const afterAdd = starAfterOutcome(removed, "b", "add");
    expect(afterAdd.playerId).toBeNull();
  });

  it("mueve la estrella a otro jugador y esa ya no se libera sola", () => {
    const auto = starAfterOutcome(INITIAL_STAR_STATE, "a", "add");
    const moved = starAfterToggle(auto, "b");
    expect(moved.playerId).toBe("b");

    const afterUndo = starAfterOutcome(moved, "b", "none");
    expect(afterUndo.playerId).toBe("b");
  });
});