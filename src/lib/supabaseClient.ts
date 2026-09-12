import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase compartido por toda la app.
// TODO (hito seguridad): evaluar si el panel de admin necesita un cliente
// aparte con una service_role key para operaciones que las policies de RLS
// no le permitan al usuario anonimo.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
