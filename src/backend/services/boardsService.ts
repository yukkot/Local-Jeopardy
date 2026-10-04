import { supabase } from "@/backend/lib/supabaseClient";

// Toda lectura/escritura de tableros pasa por aca. Las API Routes bajo
// src/app/api/boards/** son solo el "cable" HTTP

export async function listBoards() {
  const { data, error } = await supabase.from("boards").select("*");
  return { data, error: error?.message ?? null };
}

export async function createBoard(name: string) {
  const { data, error } = await supabase
    .from("boards")
    .insert({ name })
    .select()
    .single();
  return { data, error: error?.message ?? null };
}


export async function getBoardWithDetails(id: string) {
  const { data, error } = await supabase
    .from("boards")
    .select(
      `
      id,
      name,
      categories (
        id,
        name,
        position,
        questions (
          id,
          value,
          prompt,
          correct_answer,
          media_url
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Tablero no encontrado" };
  }

  const sorted = {
    ...data,
    categories: ((data as any).categories || [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((cat: any) => ({
        ...cat,
        questions: (cat.questions || []).sort(
          (a: any, b: any) => a.value - b.value
        ),
      })),
  };

  return { data: sorted, error: null };
}