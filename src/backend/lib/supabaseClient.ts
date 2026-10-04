import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase. Vive en backend/ porque es el unico lugar del
// proyecto con permiso para tocar la base de datos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
