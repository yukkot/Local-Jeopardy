import { nextTurnHolder, holderAfterRemoval } from "@/backend/logic/turns";

describe("nextTurnHolder", () => {
  const ids = ["a", "b", "c", "d"];

  it("entrega el turno a quien tiene la estrella", () => {
    expect(nextTurnHolder(ids, "a", "c")).toBe("c");
  });

  it("permite que la estrella la tenga quien ya tenia el turno", () => {
    expect(nextTurnHolder(ids, "b", "b")).toBe("b");
  });

  it("sin estrella, pasa al jugador de la derecha del que tenia el turno", () => {
    expect(nextTurnHolder(ids, "b", null)).toBe("c");
  });

  it("sin estrella, vuelve al primero cuando el turno estaba en el ultimo", () => {
    expect(nextTurnHolder(ids, "d", null)).toBe("a");
  });

  it("sin turno previo, asume que eligio el primero y pasa al segundo", () => {
    expect(nextTurnHolder(ids, null, null)).toBe("b");
  });

  it("si el jugador con turno ya no existe, parte desde el primero", () => {
    expect(nextTurnHolder(ids, "zzz", null)).toBe("b");
  });

  it("ignora una estrella que no corresponde a ningun jugador", () => {
    expect(nextTurnHolder(ids, "a", "zzz")).toBe("b");
  });

  it("con un solo jugador el turno se queda en el", () => {
    expect(nextTurnHolder(["a"], "a", null)).toBe("a");
  });

  it("sin jugadores no hay turno", () => {
    expect(nextTurnHolder([], null, null)).toBeNull();
  });
});

describe("holderAfterRemoval", () => {
  const ids = ["a", "b", "c", "d"];

  it("mantiene el turno si se elimina a otro jugador", () => {
    expect(holderAfterRemoval(ids, "d", "b")).toBe("b");
  });

  it("mantiene la ausencia de turno si nadie lo tenia", () => {
    expect(holderAfterRemoval(ids, "a", null)).toBeNull();
  });

  it("si se elimina a quien tenia el turno, pasa al de su derecha", () => {
    expect(holderAfterRemoval(ids, "b", "b")).toBe("c");
  });

  it("si quien tenia el turno era el ultimo, pasa al primero", () => {
    expect(holderAfterRemoval(ids, "d", "d")).toBe("a");
  });

  it("si se elimina al unico jugador no queda turno", () => {
    expect(holderAfterRemoval(["a"], "a", "a")).toBeNull();
  });
});