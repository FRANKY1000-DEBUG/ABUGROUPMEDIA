import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { deleteVideo } from "@/app/admin/actions";
import type { Video } from "@/lib/types";
import { Pencil } from "lucide-react";

export default async function AdminVideosPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("videos")
    .select("*, category:categories(*), show:shows(*)")
    .order("created_at", { ascending: false });

  const videos = (data ?? []) as Video[];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold">Vidéos</h1>
            <p className="mt-0.5 text-[13px] text-muted">{videos.length} vidéo(s) au total</p>
          </div>
          <a href="/admin/videos/nouveau" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
            + Nouvelle vidéo
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Titre</th>
                <th className="px-[18px] py-3.5">Catégorie</th>
                <th className="px-[18px] py-3.5">Émission</th>
                <th className="px-[18px] py-3.5">Vues</th>
                <th className="px-[18px] py-3.5">Statut</th>
                <th className="px-[18px] py-3.5" />
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-line text-[13.5px] last:border-none">
                  <td className="max-w-[280px] truncate px-[18px] py-3.5">{video.title}</td>
                  <td className="px-[18px] py-3.5">{video.category?.name ?? "—"}</td>
                  <td className="px-[18px] py-3.5">{video.show?.name ?? "—"}</td>
                  <td className="px-[18px] py-3.5">{video.views.toLocaleString("fr-FR")}</td>
                  <td className="px-[18px] py-3.5">
                    <span
                      className={
                        video.status === "published"
                          ? "rounded-full bg-good/15 px-2.5 py-1 text-[11.5px] font-bold text-good"
                          : "rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-bold text-muted"
                      }
                    >
                      {video.status === "published" ? "Publié" : video.status === "scheduled" ? "Programmé" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-[18px] py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/videos/${video.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:text-ink"
                      >
                        <Pencil size={14} />
                      </a>
                      <form action={deleteVideo}>
                        <input type="hidden" name="id" defaultValue={video.id} />
                        <button
                          type="submit"
                          className="h-8 rounded-lg border border-accent2/40 px-2.5 text-[12px] font-semibold text-accent2"
                        >
                          Suppr.
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[18px] py-6 text-center text-sm text-muted">
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
