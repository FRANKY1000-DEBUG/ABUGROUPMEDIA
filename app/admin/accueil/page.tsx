import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { toggleFeatured } from "@/app/admin/actions";
import type { Video } from "@/lib/types";
import { Star } from "lucide-react";

export default async function AdminHomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(40);

  const videos = (data ?? []) as Video[];
  const featured = videos.filter((v) => v.featured);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Page d&apos;accueil</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Choisis les vidéos mises en avant (hero et sections « à la une »). {featured.length} sélectionnée(s).
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Titre</th>
                <th className="px-[18px] py-3.5">Catégorie</th>
                <th className="px-[18px] py-3.5">Vues</th>
                <th className="px-[18px] py-3.5">À la une</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-line text-[13.5px] last:border-none">
                  <td className="px-[18px] py-3.5">{video.title}</td>
                  <td className="px-[18px] py-3.5">{video.category?.name ?? "—"}</td>
                  <td className="px-[18px] py-3.5">{video.views.toLocaleString("fr-FR")}</td>
                  <td className="px-[18px] py-3.5">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" defaultValue={video.id} />
                      <input type="hidden" name="featured" defaultValue={String(video.featured)} />
                      <button
                        type="submit"
                        className={
                          video.featured
                            ? "flex items-center gap-1.5 rounded-full bg-accent1/15 px-3 py-1.5 text-[12px] font-bold text-accent1"
                            : "flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-muted"
                        }
                      >
                        <Star size={13} fill={video.featured ? "currentColor" : "none"} />
                        {video.featured ? "En avant" : "Mettre en avant"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-[18px] py-6 text-center text-sm text-muted">
                    Aucune vidéo publiée pour le moment.
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
