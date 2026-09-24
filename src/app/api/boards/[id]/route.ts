import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Traer el tablero con todas sus categorías, preguntas y tmbien opciones de respuesta anidadas
  const { data, error } = await supabase
    .from("boards")
    .select(`
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
          image_url,
          answer_options (
            id,
            text,
            is_correct
          )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Tablero no encontrado" },
      { status: 404 }
    );
  }

  const sortedBoard = {
    ...data,
    categories: (data.categories || [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((cat: any) => ({
        ...cat,
        questions: (cat.questions || []).sort((a: any, b: any) => a.value - b.value),
      })),
  };

  return NextResponse.json(sortedBoard);
}