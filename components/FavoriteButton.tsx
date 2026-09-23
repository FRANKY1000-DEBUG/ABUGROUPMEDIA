"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Plus } from "lucide-react";
import clsx from "clsx";
import { toggleFavoriteAction } from "@/app/actions";

// Bouton "Ajouter à ma liste".
// - variant "pill"    : rond, sur la page /watch
// - variant "overlay" : petit cœur posé sur une carte (page /favoris)
export default function FavoriteButton({
  videoId,
  initialFavorited,
  isLoggedIn,
  redirectTo = "/",
  variant = "pill"
}: {
  videoId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  redirectTo?: string;
  variant?: "pill" | "overlay";
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const loginUrl = `/login?next=${encodeURIComponent(redirectTo)}`;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(loginUrl);
      return;
    }

    const next = !favorited;
    setFavorited(next); // optimiste

    startTransition(async () => {
      const result = await toggleFavoriteAction(videoId, next);
      if (!result.ok) {
        setFavorited(!next);
        if (result.error === "auth") router.push(loginUrl);
        return;
      }
      setFavorited(result.favorited);
      if (variant === "overlay") router.refresh();
    });
  }

  const title = favorited ? "Retirer de ma liste" : "Ajouter à ma liste";

  if (variant === "overlay") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        title={title}
        aria-label={title}
        aria-pressed={favorited}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-accent2 backdrop-blur transition-transform hover:scale-110 disabled:opacity-60"
      >
        <Heart size={14} fill={favorited ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={title}
      aria-label={title}
      aria-pressed={favorited}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-60",
        favorited ? "border-accent2/50 bg-accent2/15 text-accent2" : "border-line bg-surface text-muted hover:text-ink"
      )}
    >
      {favorited ? <Check size={15} /> : <Plus size={14} />}
    </button>
  );
}
