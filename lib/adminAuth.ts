import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Chemin de la page de connexion admin. Volontairement PAS "/admin/login"
// (trop devinable) et PAS lié depuis le header ou la homepage du site public.
// Pour changer ce chemin secret : renomme le dossier app/portail-x7k2/ ET
// mets à jour cette constante en même temps (les deux doivent rester
// synchronisés). Ne le communique qu'aux personnes qui doivent administrer
// le site.
export const ADMIN_LOGIN_PATH = "/portail-x7k2";

// Vérifie que l'utilisateur courant est connecté ET présent dans la table
// admin_users. Utilise le client "anon + cookies" (pas la clé service_role)
// donc s'appuie sur la policy RLS "users can check own admin status".
// Ne fait jamais confiance à un rôle stocké côté client : tout repose sur
// la session serveur + la base.
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return null;
  return user;
}

// À appeler en tout premier dans chaque server action du dashboard admin
// (app/admin/actions.ts) avant toute opération avec le client service_role.
// C'est la ligne de défense la plus importante : le middleware protège le
// rendu des pages, mais une server action peut en théorie être appelée
// directement — elle doit donc se protéger elle-même, indépendamment.
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect(ADMIN_LOGIN_PATH);
  }
  return user;
}
