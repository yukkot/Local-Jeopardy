import { NextResponse } from "next/server";
import { uploadMediaFile } from "@/backend/services/uploadService";
import { isAuthorizedRequest } from "@/backend/services/authService";

export async function POST(request: Request) {
  if (!isAuthorizedRequest()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const { url, error } = await uploadMediaFile(file);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ url });
}
