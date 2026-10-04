import { NextResponse } from "next/server";
import { createCategory } from "@/backend/services/categoriesService";
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

  if (!body?.name || typeof body.position !== "number") {
    return NextResponse.json(
      { error: "La categoría necesita un nombre y una posición" },
      { status: 400 }
    );
  }

  const { data, error } = await createCategory(id, body.name, body.position);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
