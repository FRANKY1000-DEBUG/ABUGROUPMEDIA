import Link from "next/link";
import Thumbnail from "./Thumbnail";
import type { Video } from "@/lib/types";

// Carte "Reprendre la lecture" : miniature + barre de progression.
export default function ResumeCard({ video, progress }: { video: Video; progress: number }) {
  return (
    <Link href={`/watch/${video.slug}`} className="group w-[220px] flex-shrink-0 md:w-[238px]">
      <div className="relative mb-2 h-[124px] w-full overflow-hidden rounded-xl bg-surface-2 ring-1 ring-inset ring-line transition-shadow group-hover:ring-accent2/40 md:h-[134px]">
        <Thumbnail src={video.thumbnail_url} alt={video.title} />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
        <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-accent2" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
      <div className="text-[13.5px] font-semibold leading-snug transition-colors group-hover:text-accent2">{video.title}</div>
      <div className="mt-0.5 text-[11.5px] text-muted">{Math.round(progress * 100)} % regardé</div>
    </Link>
  );
}
