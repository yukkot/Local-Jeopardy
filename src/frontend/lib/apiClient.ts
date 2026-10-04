// Cliente HTTP que el frontend usa para hablar con el backend por REST.
// Ninguna pantalla llama a fetch("/api/...") directamente: todas pasan por
// aca, asi las URLs y el parseo de errores viven en un solo lugar.

export interface BoardSummary {
  id: string;
  name: string;
}

async function parseErrorOr(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.error || fallback);
}

export async function getBoards(): Promise<BoardSummary[]> {
  const res = await fetch("/api/boards");
  if (!res.ok) return parseErrorOr(res, "No se pudieron cargar los tableros");
  return res.json();
}

export async function getBoardById(id: string) {
  const res = await fetch(`/api/boards/${id}`);
  if (!res.ok) return parseErrorOr(res, "No se pudo cargar el tablero");
  return res.json();
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function createBoard(name: string): Promise<BoardSummary> {
  const res = await fetch("/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return parseErrorOr(res, "No se pudo crear el tablero");
  return res.json();
}

export async function createCategory(
  boardId: string,
  name: string,
  position: number
) {
  const res = await fetch(`/api/boards/${boardId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, position }),
  });
  if (!res.ok) return parseErrorOr(res, "No se pudo crear la categoría");
  return res.json();
}

export interface CreateQuestionPayload {
  value: number;
  prompt: string;
  correct_answer: string;
  media_url?: string | null; // imagen, audio o video (uno solo)
  answer_media_url?: string | null;
}

export async function createQuestion(
  categoryId: string,
  payload: CreateQuestionPayload
) {
  const res = await fetch(`/api/categories/${categoryId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseErrorOr(res, "No se pudo crear la pregunta");
  return res.json();
}

export async function updateQuestion(
  questionId: string,
  payload: CreateQuestionPayload
) {
  const res = await fetch(`/api/questions/${questionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseErrorOr(res, "No se pudo actualizar la pregunta");
  return res.json();
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const res = await fetch(`/api/questions/${questionId}`, {
    method: "DELETE",
  });
  if (!res.ok) return parseErrorOr(res, "No se pudo eliminar la pregunta");
}

export async function uploadFile(file: globalThis.File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: formData });
  if (!res.ok) return parseErrorOr(res, "No se pudo subir el archivo");
  const data = await res.json();
  return data.url;
}