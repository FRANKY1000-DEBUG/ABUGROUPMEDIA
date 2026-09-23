import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import Thumbnail from "@/components/Thumbnail";
import LikeButton from "@/components/LikeButton";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import WatchPlayer from "@/components/WatchPlayer";
import { createClient } from "@/lib/supabase/server";
import { recordVideoView } from "@/lib/stats";
import { formatFullNumber } from "@/lib/format";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";
import { LEGAL } from "@/lib/brand";
import type { Video } from "@/lib/types";
import type { Metadata } from "next";

// Métadonnées Open Graph / Twitter Card générées par vidéo : c'est ce qui
// permet à WhatsApp, Facebook, etc. d'afficher le titre, la description et
// la miniature de la vidéo quand le lien est partagé.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: video } = await supabase
    .from("videos")
    .select("title, description, thumbnail_url, slug")
    .eq("slug", params.slug)
    .single();

  if (!video) return {};

  const url = `${LEGAL.siteUrl}/watch/${video.slug}`;
  const description = video.description?.slice(0, 200) || "Regardez cette vidéo sur AGM.";
  const images = video.thumbnail_url ? [{ url: video.thumbnail_url, width: 1280, height: 720 }] : undefined;

  return {
    title: video.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "video.other",
      url,
      title: video.title,
      description,
      images
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description,
      images: video.thumbnail_url ? [video.thumbnail_url] : undefined
    }
  };
}

export default async function WatchPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: video } = await supabase
    .from("videos")
    .select("*, category:categories(*), show:shows(*)")
    .eq("slug", params.slug)
    .single();

  if (!video) notFound();

  // Utilisateur connecté (le cas échéant) : état "Ma liste" + point de reprise.
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const [{ data: favoriteRow }, { data: progressRow }] = user
    ? await Promise.all([
        supabase.from("favorites").select("id").eq("user_id", user.id).eq("video_id", video.id).maybeSingle(),
        supabase
          .from("watch_progress")
          .select("progress, position_seconds")
          .eq("user_id", user.id)
          .eq("video_id", video.id)
          .maybeSingle()
      ])
    : [{ data: null }, { data: null }];

  // On ne reprend pas une vidéo déjà terminée (>= 95 %).
  const resumeFrom =
    progressRow && progressRow.progress < 0.95 && progressRow.position_seconds > 5 ? progressRow.position_seconds : 0;

  // Chaque lecture de la page incrémente le compteur de vues (et journalise
  // l'événement pour la courbe du dashboard admin).
  await recordVideoView(video.id);

  const { data: next } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .neq("id", video.id)
    .order("published_at", { ascending: false })
    .limit(4);

  const minutes = video.duration_seconds ? Math.round(video.duration_seconds / 60) : null;
  const youtubeId = extractYouTubeId(video.video_url);
  const views = video.views + 1; // reflète la vue qui vient d'être enregistrée

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="px-4 pb-16 pt-1 md:px-10">
        <BackLink
          href={video.show?.slug ? `/series/${video.show.slug}` : "/"}
          label={video.show?.name ?? "Accueil"}
        />

        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <WatchPlayer
              videoId={video.id}
              title={video.title}
              thumbnailUrl={video.thumbnail_url}
              videoUrl={video.video_url}
              youtubeId={youtubeId}
              initialPosition={resumeFrom}
              canSave={!!user}
            />

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="mb-2 break-words text-xl font-extrabold tracking-tight sm:text-2xl">{video.title}</h1>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] text-muted">
                  {video.show?.name && <span>{video.show.name}</span>}
                  {video.show?.name && minutes && <span>·</span>}
                  {minutes && <span>{minutes} min</span>}
                  {(video.show?.name || minutes) && <span>·</span>}
                  <span className="inline-flex items-center gap-1">
                    <Eye size={13} />
                    {formatFullNumber(views)} vues
                  </span>
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center gap-2.5">
                <LikeButton videoId={video.id} initialLikes={video.likes} />
                <ShareButtons title={video.title} url={`${LEGAL.siteUrl}/watch/${video.slug}`} />
                <FavoriteButton
                  videoId={video.id}
                  initialFavorited={!!favoriteRow}
                  isLoggedIn={!!user}
                  redirectTo={`/watch/${video.slug}`}
                />
              </div>
            </div>

            {video.description && (
              <div className="mt-4 rounded-2xl bg-surface p-4 text-sm leading-relaxed text-muted">
                <strong className="text-ink">Résumé — </strong>
                {video.description}
              </div>
            )}
          </div>

          <aside className="w-full flex-shrink-0 lg:w-[340px]">
            <h3 className="mb-3.5 text-[15px] font-bold">À suivre</h3>
            <div className="flex flex-col gap-1">
              {(next as Video[] | null)?.map((v) => (
                <a key={v.id} href={`/watch/${v.slug}`} className="flex gap-3 rounded-lg p-1.5 hover:bg-surface">
                  <div className="relative h-[74px] w-[130px] flex-shrink-0 overflow-hidden rounded-md bg-surface-2">
                    <Thumbnail src={v.thumbnail_url} alt={v.title} iconSize={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-[13.5px] font-semibold leading-snug">{v.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
        </div>
      </div>
    </div>
  );
}
