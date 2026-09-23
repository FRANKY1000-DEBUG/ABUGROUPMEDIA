import Link from "next/link";
import Thumbnail from "./Thumbnail";
import type { Show } from "@/lib/types";

export default function ShowCard({ show, episodeCount }: { show: Show; episodeCount?: number }) {
  return (
    <Link href={`/series/${show.slug}`} className="group">
      <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-inset ring-line transition-shadow group-hover:ring-accent2/40">
        <div className="absolute inset-0 scale-100 transition-transform duration-300 group-hover:scale-[1.04]">
          <Thumbnail src={show.cover_url} alt={show.name} iconSize={28} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      </div>
      <div className="mb-0.5 text-[15px] font-bold transition-colors group-hover:text-accent2">{show.name}</div>
      <div className="text-[12.5px] text-muted">
        {episodeCount ? `${episodeCount} épisodes` : "Émission"}
      </div>
    </Link>
  );
}
