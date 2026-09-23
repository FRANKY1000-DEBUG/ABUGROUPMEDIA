import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Video } from "@/lib/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function formatDelta(current: number, previous: number, suffix = "vs semaine précédente") {
  if (previous <= 0) return current > 0 ? "Nouveau cette semaine" : "Pas encore de données";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% ${suffix}`;
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const admin = createAdminClient();
  const now = Date.now();

  const [{ data: recent }, { data: allVideosData }, viewEventsResult, usersResult] = await Promise.all([
    supabase.from("videos").select("*, category:categories(*)").order("created_at", { ascending: false }).limit(8),
    supabase.from("videos").select("id, views, likes, duration_seconds, status, created_at, category:categories(name)"),
    // `view_events` alimente la courbe "vues sur 12 semaines" ; si la migration
    // supabase/migration_view_events.sql n'a pas encore été exécutée, la
    // requête échoue silencieusement et on retombe sur un graphique vide.
    supabase
      .from("view_events")
      .select("viewed_at")
      .gte("viewed_at", new Date(now - 12 * WEEK_MS).toISOString()),
    admin.auth.admin.listUsers({ perPage: 1000 }).catch(() => null)
  ]);

  const list = (recent ?? []) as Video[];
  const allVideos = (allVideosData ?? []) as unknown as Array<{
    id: string;
    views: number;
    likes: number;
    duration_seconds: number | null;
    status: string;
    created_at: string;
    category: { name: string } | null;
  }>;
  const events = (viewEventsResult.data ?? []) as { viewed_at: string }[];
  const users = usersResult?.data?.users ?? [];

  // ---------- KPI ----------
  const totalViews = allVideos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalWatchHours = allVideos.reduce(
    (sum, v) => sum + ((v.duration_seconds || 0) * (v.views || 0)) / 3600,
    0
  );
  const publishedCount = allVideos.filter((v) => v.status === "published").length;
  const publishedLastWeek = allVideos.filter(
    (v) => v.status === "published" && new Date(v.created_at).getTime() >= now - WEEK_MS
  ).length;

  const viewsLast7 = events.filter((e) => new Date(e.viewed_at).getTime() >= now - WEEK_MS).length;
  const viewsPrev7 = events.filter((e) => {
    const t = new Date(e.viewed_at).getTime();
    return t < now - WEEK_MS && t >= now - 2 * WEEK_MS;
  }).length;

  const newUsersLastWeek = users.filter(
    (u) => u.created_at && new Date(u.created_at).getTime() >= now - WEEK_MS
  ).length;

  const kpis = [
    {
      label: "Vues totales",
      value: totalViews.toLocaleString("fr-FR"),
      delta: events.length > 0 ? formatDelta(viewsLast7, viewsPrev7) : "Compteur cumulé depuis toujours"
    },
    {
      label: "Temps de visionnage estimé",
      value: `${Math.round(totalWatchHours).toLocaleString("fr-FR")} h`,
      delta: "Estimation : durée × vues"
    },
    {
      label: "Utilisateurs inscrits",
      value: users.length.toLocaleString("fr-FR"),
      delta: newUsersLastWeek > 0 ? `+${newUsersLastWeek} cette semaine` : "Pas de nouvelle inscription"
    },
    {
      label: "Vidéos publiées",
      value: publishedCount.toLocaleString("fr-FR"),
      delta: publishedLastWeek > 0 ? `+${publishedLastWeek} cette semaine` : "Pas de nouvelle vidéo"
    }
  ];

  // ---------- Vues sur 12 semaines (à partir de view_events) ----------
  const weeks: { count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const end = now - i * WEEK_MS;
    const start = end - WEEK_MS;
    const count = events.filter((e) => {
      const t = new Date(e.viewed_at).getTime();
      return t >= start && t < end;
    }).length;
    weeks.push({ count });
  }
  const maxWeekly = Math.max(1, ...weeks.map((w) => w.count));

  // ---------- Catégories populaires (réel, par vues cumulées) ----------
  const byCategory = new Map<string, number>();
  for (const v of allVideos) {
    const name = v.category?.name ?? "Sans catégorie";
    byCategory.set(name, (byCategory.get(name) ?? 0) + (v.views || 0));
  }
  const categoryStats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCategoryViews = Math.max(1, ...categoryStats.map(([, v]) => v));
  const topCategories = categoryStats.map(([name, views]) => ({
    name,
    pct: Math.round((views / maxCategoryViews) * 100)
  }));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold">Tableau de bord</h1>
            <p className="mt-0.5 text-[13px] text-muted">Vue d&apos;ensemble de la plateforme AGM</p>
          </div>
          <a href="/admin/videos/nouveau" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
            + Nouvelle vidéo
          </a>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-line bg-surface p-5">
              <div className="mb-2 text-[12.5px] text-muted">{kpi.label}</div>
              <div className="text-2xl font-extrabold">{kpi.value}</div>
              <div className="mt-1.5 text-xs text-good">{kpi.delta}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-4 text-[14.5px] font-bold">Vues sur 12 semaines</h3>
            {events.length > 0 ? (
              <div className="flex h-[120px] items-end gap-2">
                {weeks.map((w, i) => (
                  <div
                    key={i}
                    title={`${w.count} vue(s)`}
                    className="flex-1 rounded-t bg-gradient-to-b from-accent1 to-accent2 opacity-85"
                    style={{ height: `${Math.max(2, (w.count / maxWeekly) * 100)}%` }}
                  />
                ))}
              </div>
            ) : (
              <p className="flex h-[120px] items-center justify-center text-center text-[13px] text-muted">
                Pas encore de vues enregistrées. Vérifie que la migration
                <br />
                supabase/migration_view_events.sql a été exécutée.
              </p>
            )}
          </div>
          <div className="flex-1 rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-4 text-[14.5px] font-bold">Catégories populaires</h3>
            <div className="flex flex-col gap-2.5">
              {topCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[13px]">
                  <span className="w-28 flex-shrink-0 truncate">{c.name}</span>
                  <div className="mx-3 h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent1" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span>{c.pct}%</span>
                </div>
              ))}
              {topCategories.length === 0 && <p className="text-[13px] text-muted">Pas encore de données.</p>}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Contenu</th>
                <th className="px-[18px] py-3.5">Catégorie</th>
                <th className="px-[18px] py-3.5">Publié</th>
                <th className="px-[18px] py-3.5">Vues</th>
                <th className="px-[18px] py-3.5">Likes</th>
                <th className="px-[18px] py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {list.map((video) => (
                <tr key={video.id} className="border-b border-line text-[13.5px] last:border-none">
                  <td className="flex items-center gap-3 px-[18px] py-3.5">
                    <span className="h-8 w-[52px] flex-shrink-0 rounded bg-surface-2" />
                    {video.title}
                  </td>
                  <td className="px-[18px] py-3.5">{video.category?.name ?? "—"}</td>
                  <td className="px-[18px] py-3.5">
                    {video.published_at ? new Date(video.published_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-[18px] py-3.5">{video.views.toLocaleString("fr-FR")}</td>
                  <td className="px-[18px] py-3.5">{video.likes.toLocaleString("fr-FR")}</td>
                  <td className="px-[18px] py-3.5">
                    <span
                      className={
                        video.status === "published"
                          ? "rounded-full bg-good/15 px-2.5 py-1 text-[11.5px] font-bold text-good"
                          : "rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-bold text-muted"
                      }
                    >
                      {video.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[18px] py-6 text-center text-sm text-muted">
                    Aucun contenu pour le moment.
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
