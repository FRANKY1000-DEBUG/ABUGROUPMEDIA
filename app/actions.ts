"use server";

import { revalidatePath } from "next/cache";
import { adjustVideoLikes } from "@/lib/stats";
import { createClient } from "@/lib/supabase/server";

// Appelé depuis le bouton "J'aime" (client component) sur /watch/[slug].
// `liked = true` ajoute un like, `liked = false` le retire (toggle côté
// utilisateur, mémorisé en localStorage puisqu'il n'y a pas encore de table
// de likes par utilisateur).
export async function toggleLikeAction(videoId: string, liked: boolean) {
  const next = await adjustVideoLikes(videoId, liked ? 1 : -1);
  revalidatePath("/admin/analytique");
  revalidatePath("/tendances");
  return next;
}

export type FavoriteResult = { ok: true; favorited: boolean } | { ok: false; error: "auth" | "server" };

// Ajoute / retire une vidéo de "Ma liste" (table `favorites`, protégée par RLS :
// chaque utilisateur ne voit et ne modifie que ses propres lignes).
export async function toggleFavoriteAction(videoId: string, favorite: boolean): Promise<FavoriteResult> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { error } = favorite
    ? await supabase.from("favorites").upsert({ user_id: user.id, video_id: videoId }, { onConflict: "user_id,video_id" })
    : await supabase.from("favorites").delete().eq("user_id", user.id).eq("video_id", videoId);

  if (error) return { ok: false, error: "server" };

  revalidatePath("/favoris");
  revalidatePath("/bibliotheque");
  revalidatePath("/profil");
  return { ok: true, favorited: favorite };
}

// Enregistre la position de lecture (appelé toutes les ~10 s par le lecteur).
// Alimente "Reprendre la lecture" sur /profil et /bibliotheque.
export async function saveProgressAction(videoId: string, positionSeconds: number, durationSeconds: number) {
  if (!Number.isFinite(positionSeconds) || !Number.isFinite(durationSeconds) || durationSeconds <= 0) return;

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const progress = Math.min(1, Math.max(0, positionSeconds / durationSeconds));

  await supabase.from("watch_progress").upsert(
    {
      user_id: user.id,
      video_id: videoId,
      progress: Number(progress.toFixed(4)),
      position_seconds: Math.max(0, Math.floor(positionSeconds)),
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id,video_id" }
  );
}

// "Battement de cœur" appelé toutes les minutes par <ActivityTracker /> pour les
// utilisateurs connectés dont l'onglet est visible. Alimente la page
// /admin/utilisateurs (en ligne maintenant, actifs 24 h / 7 j / 30 j).
export async function pingActivityAction() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("user_activity")
    .upsert({ user_id: user.id, last_seen_at: new Date().toISOString() }, { onConflict: "user_id" });
}
