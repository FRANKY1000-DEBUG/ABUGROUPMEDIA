"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { toggleLikeAction } from "@/app/actions";

const STORAGE_KEY = "agm_liked_videos";

function readLikedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function LikeButton({ videoId, initialLikes }: { videoId: string; initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  // Lu uniquement côté client : on ne sait si CET utilisateur a déjà aimé la
  // vidéo qu'une fois le localStorage disponible (évite un flash au SSR).
  useEffect(() => {
    setLiked(readLikedIds().includes(videoId));
  }, [videoId]);

  function handleClick() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    const ids = readLikedIds();
    const updatedIds = nextLiked ? [...new Set([...ids, videoId])] : ids.filter((id) => id !== videoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));

    startTransition(async () => {
      const serverLikes = await toggleLikeAction(videoId, nextLiked);
      if (typeof serverLikes === "number") setLikes(serverLikes);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={liked ? "Retirer le like" : "J'aime"}
      aria-pressed={liked}
      className={clsx(
        "flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
        liked
          ? "border-accent2/50 bg-accent2/15 text-accent2"
          : "border-line bg-surface text-muted hover:text-ink"
      )}
    >
      <Heart size={14} fill={liked ? "currentColor" : "none"} />
      {likes.toLocaleString("fr-FR")}
    </button>
  );
}
