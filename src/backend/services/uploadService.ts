import { supabase } from "@/backend/lib/supabaseClient";

const BUCKET = "media";

// Requiere que el bucket "media" y sus policies existan -- ver
// supabase/storage-setup.sql.
export async function uploadMediaFile(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const extension = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
