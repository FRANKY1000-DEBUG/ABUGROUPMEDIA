import Link from "next/link";
import { Play } from "lucide-react";
import clsx from "clsx";
import Thumbnail from "./Thumbnail";
import { formatCompactNumber } from "@/lib/format";
import type { Video } from "@/lib/types";

// `fluid` : la carte prend la largeur de sa colonne (grilles) au lieu d'une largeur fixe (rangées).
export default function VideoCard({ video, fluid = false }: { video: Video; fluid?: boolean }) {
  const minutes = video.duration_seconds ? Math.round(video.duration_seconds / 60) : null;
  // Auteur choisi au moment de la publication (author_name), avec repli sur
  // le présentateur de l'émission si la vidéo appartient à un show, puis AGM.
  const author = video.author_name ?? video.show?.host ?? "AGM";

  return (
    <Link
      href={`/watch/${video.slug}`}
      className={clsx("group flex-shrink-0", fluid ? "w-full" : "w-[220px] md:w-[238px]")}
    >
      <div
        className={clsx(
          "relative mb-3 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-inset ring-line transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-ink/10 group-hover:ring-accent2/50",
          fluid ? "aspect-video" : "h-[124px] md:h-[134px]"
        )}
      >
        <div className="absolute inset-0 scale-100 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
          <Thumbnail src={video.thumbnail_url} alt={video.title} />
        </div>

        {/* Voile dégradé permanent pour la lisibilité, renforcé au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Bouton play central */}
        <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-accent2 opacity-0 scale-75 shadow-lg shadow-black/30 ring-4 ring-white/20 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
          <Play size={15} className="ml-0.5" fill="#fff" color="#fff" />
        </div>

        {/* Badge durée */}
        {minutes && (
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/70 px-1.5 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-sm">
            {minutes} min
          </div>
        )}
      </div>

      {video.category?.name && (
        <div className="mb-1.5 inline-flex items-center rounded-full bg-accent2/10 px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-accent2">
          {video.category.name.toUpperCase()}
        </div>
      )}
      <div className="mb-1 line-clamp-2 text-[14.5px] font-semibold leading-snug transition-colors group-hover:text-accent2">
        {video.title}
      </div>
      <div className="text-xs text-muted">
        {minutes ? `${minutes} min` : "Épisode"} · {author}
      </div>
      <div className="mt-0.5 text-[11.5px] text-muted">{formatCompactNumber(video.views)} vues</div>
    </Link>
  );
}
