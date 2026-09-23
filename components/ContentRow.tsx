import Link from "next/link";
import VideoCard from "./VideoCard";
import type { Video } from "@/lib/types";

export default function ContentRow({
  title,
  href,
  videos
}: {
  title: string;
  href?: string;
  videos: Video[];
}) {
  return (
    <section className="px-4 pt-7 md:px-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
        {href && (
          <Link href={href} className="text-[13px] text-muted hover:text-ink">
            Voir tout
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1.5">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
