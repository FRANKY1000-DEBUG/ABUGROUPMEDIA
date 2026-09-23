import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import EpisodeRow from "@/components/EpisodeRow";
import Thumbnail from "@/components/Thumbnail";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import type { Episode, Video } from "@/lib/types";

export default async function ShowDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: show } = await supabase.from("shows").select("*").eq("slug", params.slug).single();
  if (!show) notFound();

  const { data: episodes } = await supabase
    .from("episodes")
    .select("*, video:videos(*)")
    .eq("show_id", show.id)
    .order("season", { ascending: false })
    .order("episode_number", { ascending: false });

  const list = (episodes ?? []) as (Episode & { video: Video })[];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="px-4 pb-3 md:px-10">
          <BackLink href="/series" label="Toutes les séries" />
        </div>
        <section
          className="relative mx-4 mt-2 overflow-hidden rounded-[20px] md:mx-10"
          style={{
            background:
              "radial-gradient(circle at 75% 25%, rgba(37,99,235,.18), transparent 45%), radial-gradient(circle at 90% 65%, rgba(225,29,42,.16), transparent 50%), linear-gradient(120deg, #f2f3f6, #e7e9ee 70%)"
          }}
        >
          <div className="relative z-10 flex flex-col gap-5 p-6 sm:flex-row sm:p-8 md:p-11">
            <div className="relative h-[220px] w-full flex-shrink-0 overflow-hidden rounded-xl bg-surface-2 shadow-2xl sm:h-[168px] sm:w-[120px]">
              <Thumbnail src={show.cover_url ?? show.logo_url} alt={show.name} iconSize={28} />
            </div>
            <div className="min-w-0">
              <h1 className="mb-2 break-words text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                {show.name}
              </h1>
              {show.host && <div className="mb-2.5 text-sm text-muted">Présenté par {show.host}</div>}
              {show.description && (
                <p className="mb-4 max-w-[520px] text-[14.5px] leading-relaxed text-muted">{show.description}</p>
              )}
              <div className="mb-4 flex gap-4 text-[13px] text-muted">
                <span>{list.length} épisodes</span>
              </div>
              {list[0] && (
                <a
                  href={`/watch/${list[0].video.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent2 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent2/90"
                >
                  <Play size={12} fill="currentColor" />
                  Regarder le dernier épisode
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-0.5 px-4 pb-16 pt-6 md:px-10">
          <h2 className="mb-3 text-lg font-bold">Épisodes</h2>
          {list.map((ep) => (
            <EpisodeRow key={ep.id} episode={ep} video={ep.video} />
          ))}
          {list.length === 0 && <p className="text-sm text-muted">Aucun épisode publié pour le moment.</p>}
        </div>
      </div>
    </div>
  );
}
