import {
  shuffle,
  rollParticipants,
  isMinigameValue,
  secureRandom,
} from "@/backend/logic/random";

describe("shuffle", () => {
  it("devuelve los mismos elementos sin modificar el arreglo original", () => {
    const original = ["a", "b", "c", "d"];
    const result = shuffle(original, () => 0.5);

    expect([...result].sort()).toEqual(["a", "b", "c", "d"]);
    expect(original).toEqual(["a", "b", "c", "d"]);
  });

  it("produce un orden determinista con un generador fijo en 0", () => {
    expect(shuffle(["a", "b", "c", "d"], () => 0)).toEqual([
      "b",
      "c",
      "d",
      "a",
    ]);
  });

  it("deja el orden igual cuando el generador siempre elige la ultima posicion", () => {
    expect(shuffle(["a", "b", "c", "d"], () => 0.999999)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("maneja listas vacias y de un solo elemento", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["x"])).toEqual(["x"]);
  });

  it("con el generador por defecto conserva todos los elementos", () => {
    const result = shuffle([1, 2, 3, 4, 5, 6]);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("rollParticipants", () => {
  it("devuelve 1 cuando el generador entrega 0", () => {
    expect(rollParticipants(5, () => 0)).toBe(1);
  });

  it("devuelve el maximo cuando el generador entrega casi 1", () => {
    expect(rollParticipants(5, () => 0.999999)).toBe(5);
  });

  it("devuelve 0 si no hay jugadores", () => {
    expect(rollParticipants(0)).toBe(0);
  });

  it("siempre queda entre 1 y la cantidad de jugadores", () => {
    for (let i = 0; i < 500; i++) {
      const n = rollParticipants(4);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(4);
    }
  });
});

describe("isMinigameValue", () => {
  it("es falso por debajo de 1000", () => {
    expect(isMinigameValue(999)).toBe(false);
  });

  it("es verdadero desde 1000 incluido", () => {
    expect(isMinigameValue(1000)).toBe(true);
    expect(isMinigameValue(2000)).toBe(true);
  });
});

describe("secureRandom", () => {
  it("devuelve un numero en el rango [0, 1)", () => {
    for (let i = 0; i < 100; i++) {
      const n = secureRandom();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});