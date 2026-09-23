import Link from "next/link";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AutoRefresh from "@/components/admin/AutoRefresh";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteUser } from "@/app/admin/actions";
import { formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const ONLINE_WINDOW = 5 * MIN; // le site envoie un signal toutes les minutes

const FILTERS = [
  { key: "tous", label: "Tous" },
  { key: "en-ligne", label: "En ligne", maxAge: ONLINE_WINDOW },
  { key: "24h", label: "Actifs 24 h", maxAge: DAY },
  { key: "7j", label: "Actifs 7 j", maxAge: 7 * DAY },
  { key: "30j", label: "Actifs 30 j", maxAge: 30 * DAY }
] as const;

export default async function AdminUsersPage({ searchParams }: { searchParams: { filtre?: string; q?: string } }) {
  const admin = createAdminClient();
  const now = Date.now();

  const [usersResult, activityResult] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("user_activity").select("user_id, last_seen_at")
  ]);

  const usersError = usersResult.error;
  const activityMissing = !!activityResult.error; // migration_user_activity.sql pas encore exécutée

  const seenById = new Map<string, string>();
  for (const row of activityResult.data ?? []) seenById.set(row.user_id, row.last_seen_at);

  // Dernière activité = la plus récente entre le signal du site et la dernière connexion.
  const rows = (usersResult.data?.users ?? [])
    .map((u) => {
      const candidates = [seenById.get(u.id), u.last_sign_in_at].filter(Boolean) as string[];
      const lastSeen = candidates.sort().at(-1) ?? null;
      const age = lastSeen ? now - new Date(lastSeen).getTime() : Infinity;
      return { user: u, lastSeen, age };
    })
    .sort((a, b) => a.age - b.age);

  const count = (maxAge: number) => rows.filter((r) => r.age <= maxAge).length;
  const stats = [
    { label: "En ligne maintenant", value: count(ONLINE_WINDOW), highlight: true },
    { label: "Actifs 24 h", value: count(DAY) },
    { label: "Actifs 7 jours", value: count(7 * DAY) },
    { label: "Actifs 30 jours", value: count(30 * DAY) },
    { label: "Inscrits au total", value: rows.length }
  ];

  const activeFilter = FILTERS.find((f) => f.key === searchParams.filtre) ?? FILTERS[0];
  const query = (searchParams.q ?? "").trim().toLowerCase();

  const visible = rows.filter((r) => {
    if ("maxAge" in activeFilter && r.age > activeFilter.maxAge) return false;
    if (!query) return true;
    const name = ((r.user.user_metadata?.full_name as string) ?? "").toLowerCase();
    return name.includes(query) || (r.user.email ?? "").toLowerCase().includes(query);
  });

  const filterHref = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "tous") params.set("filtre", key);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/admin/utilisateurs?${qs}` : "/admin/utilisateurs";
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <AutoRefresh />

        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Utilisateurs</h1>
          <p className="mt-0.5 text-[13px] text-muted">Qui est inscrit et qui est actif sur le site (mise à jour automatique)</p>
        </div>

        {usersError && (
          <div className="mb-5 rounded-xl border border-accent2/40 bg-accent2/10 p-4 text-[13px] text-accent2">
            Impossible de charger les utilisateurs : {usersError.message}. Vérifie SUPABASE_SERVICE_ROLE_KEY dans .env.local.
          </div>
        )}

        {activityMissing && !usersError && (
          <div className="mb-5 rounded-xl border border-line bg-surface p-4 text-[13px] text-muted">
            Le suivi « en ligne » n&apos;est pas encore activé : exécute <code className="text-ink">supabase/migration_user_activity.sql</code>{" "}
            dans le SQL editor Supabase. En attendant, l&apos;activité affichée se base sur la dernière connexion.
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-surface p-5">
              <div className="mb-2 flex items-center gap-2 text-[12.5px] text-muted">
                {stat.highlight && <span className="h-2 w-2 rounded-full bg-good" />}
                {stat.label}
              </div>
              <div className="text-2xl font-extrabold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={filterHref(f.key)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors",
                  f.key === activeFilter.key ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>
          <form method="get" className="flex items-center gap-2">
            {activeFilter.key !== "tous" && <input type="hidden" name="filtre" value={activeFilter.key} />}
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Rechercher un nom ou un e-mail"
              className="w-[240px] rounded-full border border-line bg-surface px-4 py-2 text-[13px] text-ink outline-none placeholder:text-muted"
            />
          </form>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Utilisateur</th>
                <th className="px-[18px] py-3.5">Statut</th>
                <th className="px-[18px] py-3.5">Fournisseur</th>
                <th className="px-[18px] py-3.5">Inscrit le</th>
                <th className="px-[18px] py-3.5">Dernière activité</th>
                <th className="px-[18px] py-3.5" />
              </tr>
            </thead>
            <tbody>
              {visible.map(({ user: u, lastSeen, age }) => {
                const online = age <= ONLINE_WINDOW;
                const name = (u.user_metadata?.full_name as string) || u.email || "Utilisateur";
                return (
                  <tr key={u.id} className="border-b border-line text-[13.5px] last:border-none">
                    <td className="px-[18px] py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent1 text-[12px] font-extrabold text-white">
                          {name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{name}</div>
                          <div className="truncate text-[12px] text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5">
                      {online ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-good/15 px-2.5 py-1 text-[12px] font-semibold text-good">
                          <span className="h-1.5 w-1.5 rounded-full bg-good" />
                          En ligne
                        </span>
                      ) : age <= DAY ? (
                        <span className="rounded-full bg-accent1/15 px-2.5 py-1 text-[12px] font-semibold text-accent1">Actif 24 h</span>
                      ) : age <= 7 * DAY ? (
                        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink">Actif 7 j</span>
                      ) : (
                        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-muted">Inactif</span>
                      )}
                    </td>
                    <td className="px-[18px] py-3.5 capitalize">{u.app_metadata?.provider ?? "email"}</td>
                    <td className="px-[18px] py-3.5">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-[18px] py-3.5" title={lastSeen ? new Date(lastSeen).toLocaleString("fr-FR") : undefined}>
                      {online ? "à l'instant" : formatRelativeTime(lastSeen, now)}
                    </td>
                    <td className="px-[18px] py-3.5">
                      <form action={deleteUser} className="flex justify-end">
                        <input type="hidden" name="id" defaultValue={u.id} />
                        <button
                          type="submit"
                          title="Supprimer ce compte"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent2/40 text-accent2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && !usersError && (
                <tr>
                  <td colSpan={6} className="px-[18px] py-6 text-center text-sm text-muted">
                    {rows.length === 0 ? "Aucun utilisateur pour le moment." : "Aucun utilisateur ne correspond à ce filtre."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
