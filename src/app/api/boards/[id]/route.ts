import { NextResponse } from "next/server";
import { getBoardWithDetails } from "@/backend/services/boardsService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await getBoardWithDetails(id);

  if (error || !data) {
    return NextResponse.json(
      { error: error || "Tablero no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
