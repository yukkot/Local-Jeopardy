import { applyScore } from "@/lib/scoring";

describe("applyScore", () => {
  it("suma el valor cuando la respuesta es correcta", () => {
    expect(applyScore(0, 200, true)).toBe(200);
  });

  it("resta el valor cuando la respuesta es incorrecta", () => {
    expect(applyScore(500, 200, false)).toBe(300);
  });

  it("permite que el puntaje quede en negativo", () => {
    expect(applyScore(100, 200, false)).toBe(-100);
  });
});
