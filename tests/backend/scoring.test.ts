import { applyScore } from "@/backend/logic/scoring";

describe("applyScore", () => {
  it("suma el valor cuando el resultado es add", () => {
    expect(applyScore(0, 200, "add")).toBe(200);
  });

  it("resta el valor cuando el resultado es subtract", () => {
    expect(applyScore(500, 200, "subtract")).toBe(300);
  });

  it("permite que el puntaje quede en negativo", () => {
    expect(applyScore(100, 200, "subtract")).toBe(-100);
  });

  it("deja el puntaje igual cuando el resultado es none", () => {
    expect(applyScore(350, 200, "none")).toBe(350);
  });
});