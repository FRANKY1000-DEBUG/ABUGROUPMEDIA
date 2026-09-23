import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import Shelf from "@/components/Shelf";
import ResumeCard from "@/components/ResumeCard";
import VideoCard from "@/components/VideoCard";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { getFavoriteVideos, getResumeItems } from "@/lib/library";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/profil");

  const [continueWatching, myList] = await Promise.all([
    getResumeItems(supabase, user.id, 8),
    getFavoriteVideos(supabase, user.id, 8)
  ]);

  // Photo de profil Google si connexion via OAuth, sinon repli sur l'initiale de l'e-mail.
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;
  const initial = (user.user_metadata?.full_name ?? user.email ?? "?")[0]?.toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="px-4 pb-16 pt-2 md:px-10">
        <div className="mb-5">
          <BackLink href="/" label="Accueil" />
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={user.user_metadata?.full_name ?? "Photo de profil"}
              className="h-[78px] w-[78px] flex-shrink-0 rounded-full object-cover ring-1 ring-inset ring-line"
            />
          ) : (
            <div className="flex h-[78px] w-[78px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent1 text-2xl font-extrabold text-white">
              {initial}
            </div>
          )}
          <div>
            <h1 className="mb-1 text-2xl font-extrabold">{user.user_metadata?.full_name ?? "Mon compte"}</h1>
            <div className="text-[13.5px] text-muted">{user.email}</div>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button className="rounded-full border border-line bg-surface px-[18px] py-2.5 text-[13.5px] font-semibold">
              Modifier le profil
            </button>
            <LogoutButton className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-[18px] py-2.5 text-[13.5px] font-semibold text-accent2" />
          </div>
        </div>

        <Shelf
          title="Reprendre la lecture"
          href="/bibliotheque"
          hrefLabel="Ma bibliothèque"
          emptyText="Rien en cours de lecture pour le moment."
        >
          {continueWatching.map((item) => (
            <ResumeCard key={item.video.id} video={item.video} progress={item.progress} />
          ))}
        </Shelf>

        <Shelf title="Ma liste" href="/favoris" emptyText="Aucun favori pour le moment.">
          {myList.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </Shelf>
        </div>
      </div>
    </div>
  );
}
