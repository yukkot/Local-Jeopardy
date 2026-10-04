import { supabase } from "@/backend/lib/supabaseClient";

export async function createCategory(
  boardId: string,
  name: string,
  position: number
) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ board_id: boardId, name, position })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}
