import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client Supabase avec la clé service_role — À N'UTILISER QUE côté serveur
// (server actions, route handlers). Cette clé contourne le Row Level
// Security : elle ne doit jamais être exposée au navigateur ni importée
// depuis un composant "use client".
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
