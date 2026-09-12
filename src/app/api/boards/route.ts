import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/boards - lista todos los tableros creados.
export async function GET() {
  const { data, error } = await supabase.from("boards").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.name) {
    return NextResponse.json(
      { error: "El tablero necesita un nombre" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("boards")
    .insert({ name: body.name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
