// Devuelve el nuevo puntaje de un jugador tras responder una pregunta.
// Esta es la unica pieza de logica de negocio ya testeada en este hito;
// sirve como base para que el pipeline de CI tenga coverage desde el dia uno.
// TODO (hito 4): usar esta funcion desde la pantalla de juego real, y agregar
// mas funciones aca (ej: detectar Daily Double, calcular ranking final).
export function applyScore(
  currentScore: number,
  value: number,
  correct: boolean
): number {
  return correct ? currentScore + value : currentScore - value;
}
