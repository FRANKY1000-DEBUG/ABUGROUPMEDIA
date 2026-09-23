import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import VideoCard from "@/components/VideoCard";
import FavoriteButton from "@/components/FavoriteButton";
import { createClient } from "@/lib/supabase/server";
import { getFavoriteVideos } from "@/lib/library";
import { redirect } from "next/navigation";

export default async function FavorisPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/favoris");

  const favorites = await getFavoriteVideos(supabase, user.id);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="border-b border-line px-4 pb-8 pt-4 md:px-10">
          <div className="mb-5">
            <BackLink href="/" label="Accueil" />
          </div>
          <span className="mb-2.5 block text-xs font-bold text-accent2">FAVORIS</span>
          <h1 className="mb-2.5 text-3xl font-extrabold tracking-tight md:text-4xl">Ma liste</h1>
          <p className="max-w-[520px] text-[14.5px] leading-relaxed text-muted">
            Les vidéos que tu as ajoutées à ta liste, pour les retrouver quand tu veux.
          </p>
        </div>

        <div className="px-4 pb-4 pt-6 md:px-10">
          <span className="text-[13px] text-muted">{favorites.length} vidéo(s)</span>
        </div>

        {favorites.length === 0 ? (
          <div className="px-4 pb-16 md:px-10">
            <p className="mb-4 text-sm text-muted">
              Ta liste est vide. Sur la page d&apos;une vidéo, clique sur le bouton « + » pour l&apos;ajouter ici.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-full bg-gradient-to-br from-accent2 to-accent1 px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Explorer les contenus
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 px-4 pb-16 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-10">
            {favorites.map((video) => (
              <div key={video.id} className="relative">
                <VideoCard video={video} fluid />
                <FavoriteButton
                  videoId={video.id}
                  initialFavorited
                  isLoggedIn
                  redirectTo="/favoris"
                  variant="overlay"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
