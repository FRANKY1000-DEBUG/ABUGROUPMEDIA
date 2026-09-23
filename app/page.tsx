import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import ContentRow from "@/components/ContentRow";
import ShowRow from "@/components/ShowRow";
import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import type { Video, Category, Show } from "@/lib/types";

async function getHomeData(categorieSlug?: string) {
  const supabase = createClient();

  const [{ data: allCategories }, { data: usedCategoryRows }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("videos").select("category_id").eq("status", "published").not("category_id", "is", null)
  ]);

  // On n'affiche dans les pastilles que les catégories réellement utilisées par au moins une vidéo publiée.
  const usedIds = new Set((usedCategoryRows ?? []).map((row) => row.category_id));
  const categories = ((allCategories ?? []) as Category[]).filter((c) => usedIds.has(c.id));

  // "À la une" : décidé manuellement au moment de la publication (colonne
  // `featured`, cochée dans le dashboard) — on affiche simplement les plus
  // récentes parmi celles marquées "à la une".
  // "Dernières publications" : automatique, triée par date de publication.
  // "Tendances" : automatique, triée par nombre de likes.
  // "Meilleurs reportages" : automatique, catégorie "reportages" triée par likes.
  const reportagesCategoryId = categories.find((c) => c.slug === "reportages")?.id;

  const [{ data: heroVideos }, { data: featured }, { data: latest }, { data: trending }, { data: bestReportages }, { data: showsData }, { data: episodeRows }] =
    await Promise.all([
      supabase
        .from("videos")
        .select("*, category:categories(*), show:shows(*)")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("videos")
        .select("*, category:categories(*), show:shows(*)")
        .eq("status", "published")
        .eq("featured", true)
        .order("published_at", { ascending: false })
        .limit(8),
      supabase
        .from("videos")
        .select("*, category:categories(*), show:shows(*)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(8),
      supabase
        .from("videos")
        .select("*, category:categories(*), show:shows(*)")
        .eq("status", "published")
        .order("likes", { ascending: false })
        .limit(8),
      reportagesCategoryId
        ? supabase
            .from("videos")
            .select("*, category:categories(*), show:shows(*)")
            .eq("status", "published")
            .eq("category_id", reportagesCategoryId)
            .order("likes", { ascending: false })
            .limit(8)
        : Promise.resolve({ data: [] as Video[] }),
      // Onglet "Séries" de la page d'accueil : les émissions regroupées en
      // saisons/épisodes (table `shows`), pas une catégorie de vidéos.
      supabase.from("shows").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("episodes").select("show_id")
    ]);

  const episodeCounts: Record<string, number> = {};
  for (const row of episodeRows ?? []) {
    episodeCounts[row.show_id] = (episodeCounts[row.show_id] ?? 0) + 1;
  }
  const shows = (showsData ?? []) as Show[];

  let filtered: Video[] = [];
  if (categorieSlug) {
    const categoryId = categories.find((c) => c.slug === categorieSlug)?.id;
    const { data } = await supabase
      .from("videos")
      .select("*, category:categories(*), show:shows(*)")
      .eq("status", "published")
      .eq("category_id", categoryId ?? "")
      .order("published_at", { ascending: false })
      .limit(48);
    filtered = (data ?? []) as Video[];
  }

  return {
    categories,
    heroVideos: (heroVideos ?? []) as Video[],
    featured: (featured ?? []) as Video[],
    latest: (latest ?? []) as Video[],
    trending: (trending ?? []) as Video[],
    bestReportages: (bestReportages ?? []) as Video[],
    shows,
    episodeCounts,
    filtered
  };
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: { categorie?: string };
}) {
  const activeSlug = searchParams?.categorie;
  const { categories, heroVideos, featured, latest, trending, bestReportages, shows, episodeCounts, filtered } =
    await getHomeData(activeSlug);
  const activeCategory = categories.find((c) => c.slug === activeSlug);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <Hero videos={heroVideos} />
        {categories.length > 0 && <CategoryFilterBar categories={categories} activeSlug={activeSlug} />}

        {activeSlug ? (
          <section className="px-4 pt-7 md:px-10">
            <h2 className="mb-4 text-[19px] font-bold tracking-tight">
              {activeCategory ? activeCategory.name : "Résultats"}
            </h2>
            <div className="grid grid-cols-2 gap-5 pb-16 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-sm text-muted">
                  Aucune vidéo dans cette catégorie pour le moment.
                </p>
              )}
            </div>
          </section>
        ) : (
          <>
            {featured.length > 0 && <ContentRow title="À la une" href="/reportages" videos={featured} />}
            {latest.length > 0 && <ContentRow title="Dernières publications" href="/reportages" videos={latest} />}
            {trending.length > 0 && <ContentRow title="Tendances" href="/tendances" videos={trending} />}
            {shows.length > 0 && (
              <ShowRow title="Séries" href="/series" shows={shows} episodeCounts={episodeCounts} />
            )}
            {bestReportages.length > 0 && (
              <ContentRow title="Meilleurs reportages" href="/reportages" videos={bestReportages} />
            )}
          </>
        )}

        <footer className="flex flex-col gap-3 border-t border-line px-4 py-10 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <span>AGM — Plateforme média · Bafoussam, Cameroun</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
            <a href="/confidentialite" className="transition-colors hover:text-ink">
              Politique de confidentialité
            </a>
            <a href="/conditions" className="transition-colors hover:text-ink">
              Conditions d&apos;utilisation
            </a>
            <a href="/mentions-legales" className="transition-colors hover:text-ink">
              Mentions légales
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
