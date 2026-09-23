import Link from "next/link";
import ShowCard from "./ShowCard";
import type { Show } from "@/lib/types";

export default function ShowRow({
  title,
  href,
  shows,
  episodeCounts
}: {
  title: string;
  href?: string;
  shows: Show[];
  episodeCounts?: Record<string, number>;
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
        {shows.map((show) => (
          <div key={show.id} className="w-[150px] flex-shrink-0 md:w-[168px]">
            <ShowCard show={show} episodeCount={episodeCounts?.[show.id]} />
          </div>
        ))}
      </div>
    </section>
  );
}
