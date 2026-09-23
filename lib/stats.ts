import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Incrémente le compteur `videos.views` et journalise l'événement dans
// `view_events` (utilisé par le dashboard admin pour la courbe "vues sur
// 12 semaines"). Appelé côté serveur depuis la page /watch/[slug].
export async function recordVideoView(videoId: string) {
  try {
    const admin = createAdminClient();
    const { data: video } = await admin.from("videos").select("views").eq("id", videoId).single();
    const current = video?.views ?? 0;
    await admin.from("videos").update({ views: current + 1 }).eq("id", videoId);
    // Si la table `view_events` n'existe pas encore (migration non exécutée),
    // on ignore silencieusement l'erreur : le compteur cumulé fonctionne déjà.
    await admin.from("view_events").insert({ video_id: videoId });
  } catch {
    // On ne bloque jamais l'affichage de la vidéo à cause d'un souci de stats.
  }
}

// Ajoute (ou retire) un like sur une vidéo. `delta` vaut +1 ou -1.
// Retourne le nouveau total (jamais négatif).
export async function adjustVideoLikes(videoId: string, delta: 1 | -1) {
  const admin = createAdminClient();
  const { data: video, error } = await admin.from("videos").select("likes").eq("id", videoId).single();
  if (error || !video) return null;
  const next = Math.max(0, (video.likes ?? 0) + delta);
  const { error: updateError } = await admin.from("videos").update({ likes: next }).eq("id", videoId);
  if (updateError) return null;
  return next;
}
