"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Video } from "@/lib/types";

const AUTO_SLIDE_MS = 7000;

export default function Hero({ videos }: { videos: Video[] }) {
  const [index, setIndex] = useState(0);
  const count = videos.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  // Slide automatique
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="relative mx-4 mb-2 h-[70vh] min-h-[480px] overflow-hidden rounded-[20px] md:mx-10 md:h-[78vh]">
      {videos.map((video, i) => {
        const minutes = video.duration_seconds ? Math.round(video.duration_seconds / 60) : null;
        return (
          <div
            key={video.id}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={
                video.thumbnail_url
                  ? { backgroundImage: `url(${video.thumbnail_url})` }
                  : {
                      background:
                        "radial-gradient(circle at 78% 22%, rgba(37,99,235,0.25), transparent 45%), radial-gradient(circle at 88% 60%, rgba(225,29,42,0.28), transparent 50%), linear-gradient(120deg, #14151a, #1c1d24 70%)"
                    }
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/15 to-transparent" />

            <div className="relative z-10 flex h-full max-w-[620px] flex-col justify-end p-8 md:p-12">
              {video.category?.name && (
                <span className="mb-3 text-xs font-bold tracking-wide text-accent2">
                  {video.category.name.toUpperCase()}
                </span>
              )}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                {video.title}
              </h1>
              {video.description && (
                <p className="mb-4 max-w-[480px] text-sm text-white/75 md:text-[15.5px] leading-relaxed line-clamp-3">
                  {video.description}
                </p>
              )}
              <div className="mb-6 flex gap-4 text-[13.5px] text-white/60">
                {video.published_at && <span>{new Date(video.published_at).toLocaleDateString("fr-FR")}</span>}
                {minutes && <span>{minutes} min</span>}
                <span>{video.views.toLocaleString("fr-FR")} vues</span>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/watch/${video.slug}`}
                  className="flex items-center gap-2 rounded-full bg-accent2 px-6 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-accent2/90"
                >
                  <Play size={13} fill="currentColor" />
                  Regarder
                </Link>
                <Link
                  href={`/watch/${video.slug}`}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[14.5px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <Info size={15} />
                  Plus d&apos;infos
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2 md:right-10">
          {videos.map((video, i) => (
            <button
              key={video.id}
              type="button"
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent2" : "w-1.5 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
