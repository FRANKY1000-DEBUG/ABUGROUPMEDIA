import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import FilterPills from "@/components/FilterPills";
import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";

// Page "Tendances" : automatique, toutes catégories confondues, triée par
// nombre de likes (même logique que la section "Tendances" de la page
// d'accueil, mais sans limite de 8 vidéos).
export default async function TendancesPage() {
  const supabase = createClient();

  const { data: videos } = await supabase
    .from("videos")
    .select("*, category:categories(*), show:shows(*)")
    .eq("status", "published")
    .order("likes", { ascending: false });

  const list = (videos ?? []) as Video[];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="border-b border-line px-4 pb-8 pt-8 md:px-10">
          <div className="mb-5">
            <BackLink href="/" label="Accueil" />
          </div>
          <span className="mb-2.5 block text-xs font-bold text-accent2">CLASSEMENT</span>
          <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight md:text-4xl">Tendances</h1>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-muted">
            Les vidéos les plus aimées du moment sur AGM, toutes catégories confondues.
          </p>
        </div>
        <FilterPills options={["Tout", "Cette semaine", "Ce mois-ci", "Cameroun"]} />
        <div className="flex items-center justify-between px-4 pb-4 pt-6 md:px-10">
          <span className="text-[13px] text-muted">{list.length} vidéos</span>
        </div>
        <div className="grid grid-cols-2 gap-5 px-4 pb-16 sm:grid-cols-3 md:grid-cols-4 md:px-10">
          {list.map((video, index) => (
            <div key={video.id} className="relative">
              <span className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-extrabold text-bg">
                {index + 1}
              </span>
              <VideoCard video={video} />
            </div>
          ))}
          {list.length === 0 && (
            <p className="col-span-full text-sm text-muted">Aucune vidéo tendance pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
