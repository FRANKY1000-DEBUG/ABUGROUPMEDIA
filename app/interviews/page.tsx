import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import FilterPills from "@/components/FilterPills";
import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";

const CATEGORY_SLUG = "interviews";
const CATEGORY_LABEL = "Interviews";

export default async function InterviewsPage() {
  const supabase = createClient();

  const { data: category } = await supabase.from("categories").select("*").eq("slug", CATEGORY_SLUG).single();

  const { data: videos } = await supabase
    .from("videos")
    .select("*, category:categories(*), show:shows(*)")
    .eq("status", "published")
    .eq("category_id", category?.id ?? "")
    .order("published_at", { ascending: false });

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
          <span className="mb-2.5 block text-xs font-bold text-accent2">CATÉGORIE</span>
          <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight md:text-4xl">{CATEGORY_LABEL}</h1>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-muted">
            Entretiens et échanges avec des personnalités, experts et acteurs du quotidien.
          </p>
        </div>
        <FilterPills options={["Tout", "Récents", "Les plus aimés", "Cameroun", "Courts formats"]} />
        <div className="flex items-center justify-between px-4 pb-4 pt-6 md:px-10">
          <span className="text-[13px] text-muted">{list.length} interviews</span>
        </div>
        <div className="grid grid-cols-2 gap-5 px-4 pb-16 sm:grid-cols-3 md:grid-cols-4 md:px-10">
          {list.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {list.length === 0 && (
            <p className="col-span-full text-sm text-muted">Aucune interview publiée pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
