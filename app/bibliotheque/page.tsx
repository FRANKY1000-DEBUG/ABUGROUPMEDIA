import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import Shelf from "@/components/Shelf";
import ResumeCard from "@/components/ResumeCard";
import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import { getFavoriteVideos, getFinishedVideos, getResumeItems } from "@/lib/library";
import { redirect } from "next/navigation";

export default async function BibliothequePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/bibliotheque");

  const [resume, favorites, finished] = await Promise.all([
    getResumeItems(supabase, user.id),
    getFavoriteVideos(supabase, user.id, 12),
    getFinishedVideos(supabase, user.id)
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="border-b border-line px-4 pb-8 pt-4 md:px-10">
          <div className="mb-5">
            <BackLink href="/" label="Accueil" />
          </div>
          <span className="mb-2.5 block text-xs font-bold text-accent2">BIBLIOTHÈQUE</span>
          <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight md:text-4xl">Ma bibliothèque</h1>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-muted">
            Ce que tu regardes, ce que tu as mis de côté et ce que tu as déjà vu, au même endroit.
          </p>
        </div>

        <div className="px-4 pb-16 pt-8 md:px-10">
          <Shelf title="Reprendre la lecture" emptyText="Rien en cours de lecture pour le moment.">
            {resume.map((item) => (
              <ResumeCard key={item.video.id} video={item.video} progress={item.progress} />
            ))}
          </Shelf>

          <Shelf title="Ma liste" href="/favoris" emptyText="Aucun favori pour le moment.">
            {favorites.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </Shelf>

          <Shelf title="Déjà vus" emptyText="Les vidéos regardées en entier apparaîtront ici.">
            {finished.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </Shelf>
        </div>
      </div>
    </div>
  );
}
