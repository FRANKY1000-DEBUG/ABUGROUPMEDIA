import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import ShowCard from "@/components/ShowCard";
import { createClient } from "@/lib/supabase/server";
import type { Show } from "@/lib/types";

export default async function SeriesPage() {
  const supabase = createClient();

  const [{ data: showsData }, { data: episodeRows }] = await Promise.all([
    supabase.from("shows").select("*").order("name"),
    supabase.from("episodes").select("show_id")
  ]);

  const shows = (showsData ?? []) as Show[];

  const episodeCounts: Record<string, number> = {};
  for (const row of episodeRows ?? []) {
    episodeCounts[row.show_id] = (episodeCounts[row.show_id] ?? 0) + 1;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="border-b border-line px-4 pb-8 pt-8 md:px-10">
          <div className="mb-5">
            <BackLink href="/" label="Accueil" />
          </div>
          <span className="mb-2.5 block text-xs font-bold text-accent2">SÉRIES</span>
          <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight md:text-4xl">Toutes les séries</h1>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-muted">
            Retrouve les émissions d&apos;AGM regroupées par saisons et épisodes.
          </p>
        </div>
        <div className="flex items-center justify-between px-4 pb-4 pt-6 md:px-10">
          <span className="text-[13px] text-muted">{shows.length} série(s)</span>
        </div>
        <div className="grid grid-cols-2 gap-5 px-4 pb-16 sm:grid-cols-3 md:grid-cols-5 md:px-10">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} episodeCount={episodeCounts[show.id]} />
          ))}
          {shows.length === 0 && (
            <p className="col-span-full text-sm text-muted">Aucune série publiée pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
