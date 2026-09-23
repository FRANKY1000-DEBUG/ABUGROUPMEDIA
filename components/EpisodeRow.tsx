import Link from "next/link";
import { Play } from "lucide-react";
import Thumbnail from "./Thumbnail";
import type { Video, Episode } from "@/lib/types";

export default function EpisodeRow({ episode, video }: { episode: Episode; video: Video }) {
  const minutes = video.duration_seconds ? Math.round(video.duration_seconds / 60) : null;

  return (
    <Link href={`/watch/${video.slug}`} className="group flex items-center gap-4 rounded-xl px-2.5 py-3 hover:bg-surface">
      <div className="w-6 flex-shrink-0 text-center text-sm font-semibold text-muted">
        {episode.episode_number}
      </div>
      <div className="relative h-[84px] w-[150px] flex-shrink-0 overflow-hidden rounded-lg bg-surface-2">
        <Thumbnail src={video.thumbnail_url} alt={video.title} iconSize={16} />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-8 w-8 scale-90 items-center justify-center rounded-full bg-accent2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            <Play size={11} className="ml-0.5" fill="#fff" color="#fff" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[15px] font-semibold transition-colors group-hover:text-accent2">{video.title}</div>
        {video.description && (
          <div className="max-w-[520px] truncate text-[13px] text-muted">{video.description}</div>
        )}
      </div>
      {minutes && <div className="flex-shrink-0 text-[13px] text-muted">{minutes} min</div>}
    </Link>
  );
}
