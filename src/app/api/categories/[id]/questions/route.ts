import { NextResponse } from "next/server";
import { createQuestion } from "@/backend/services/questionsService";
import { isAuthorizedRequest } from "@/backend/services/authService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedRequest()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body?.prompt || !body?.value || !body?.correct_answer) {
    return NextResponse.json(
      { error: "Falta el texto, el valor, o la respuesta correcta" },
      { status: 400 }
    );
  }

  const { data, error } = await createQuestion({
    categoryId: id,
    value: body.value,
    prompt: body.prompt,
    correct_answer: body.correct_answer,
    media_url: body.media_url,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}