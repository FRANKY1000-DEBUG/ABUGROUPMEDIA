import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";

export default async function AdminAnalyticsPage() {
  const supabase = createClient();

  const [{ data: videos }, { count: userCount }] = await Promise.all([
    supabase.from("videos").select("*, category:categories(*)"),
    supabase.from("watch_progress").select("user_id", { count: "exact", head: true })
  ]);

  const list = (videos ?? []) as Video[];
  const totalViews = list.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = list.reduce((sum, v) => sum + (v.likes || 0), 0);
  const published = list.filter((v) => v.status === "published").length;

  const byCategory = new Map<string, number>();
  for (const v of list) {
    const name = v.category?.name ?? "Sans catégorie";
    byCategory.set(name, (byCategory.get(name) ?? 0) + (v.views || 0));
  }
  const categoryStats = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCategoryViews = Math.max(1, ...categoryStats.map(([, v]) => v));

  const topVideos = [...list].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Analytique</h1>
          <p className="mt-0.5 text-[13px] text-muted">Statistiques calculées à partir des données réelles de Supabase</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {[
            { label: "Vues totales", value: totalViews.toLocaleString("fr-FR") },
            { label: "Likes totaux", value: totalLikes.toLocaleString("fr-FR") },
            { label: "Vidéos publiées", value: `${published} / ${list.length}` },
            { label: "Suivis de lecture", value: (userCount ?? 0).toLocaleString("fr-FR") }
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-line bg-surface p-5">
              <div className="mb-2 text-[12.5px] text-muted">{kpi.label}</div>
              <div className="text-2xl font-extrabold">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-4 text-[14.5px] font-bold">Vues par catégorie</h3>
            <div className="flex flex-col gap-2.5">
              {categoryStats.map(([name, views]) => (
                <div key={name} className="flex items-center justify-between text-[13px]">
                  <span className="w-28 flex-shrink-0 truncate">{name}</span>
                  <div className="mx-3 h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent1" style={{ width: `${(views / maxCategoryViews) * 100}%` }} />
                  </div>
                  <span>{views.toLocaleString("fr-FR")}</span>
                </div>
              ))}
              {categoryStats.length === 0 && <p className="text-[13px] text-muted">Pas encore de données.</p>}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="border-b border-line px-[18px] py-3.5 text-[14.5px] font-bold">Top vidéos par vues</div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Titre</th>
                <th className="px-[18px] py-3.5">Vues</th>
                <th className="px-[18px] py-3.5">Likes</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((v) => (
                <tr key={v.id} className="border-b border-line text-[13.5px] last:border-none">
                  <td className="px-[18px] py-3.5">{v.title}</td>
                  <td className="px-[18px] py-3.5">{v.views.toLocaleString("fr-FR")}</td>
                  <td className="px-[18px] py-3.5">{v.likes.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
              {topVideos.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-[18px] py-6 text-center text-sm text-muted">
                    Aucune vidéo pour le moment.
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
