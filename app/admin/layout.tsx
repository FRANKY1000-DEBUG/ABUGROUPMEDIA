import { requireAdmin } from "@/lib/adminAuth";

// Deuxième couche de vérification : le middleware bloque déjà tout accès
// non-admin à /admin/*, mais ce layout revérifie indépendamment côté serveur
// avant de rendre la moindre page du dashboard. Si jamais le middleware était
// un jour mal configuré ou contourné, cette couche reste active.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
