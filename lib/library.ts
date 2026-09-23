import type { SupabaseClient } from "@supabase/supabase-js";
import type { Video } from "@/lib/types";

const VIDEO_SELECT = "video:videos(*, category:categories(*), show:shows(*))";
const FINISHED_THRESHOLD = 0.95;

export interface ResumeItem {
  video: Video;
  progress: number;
}

// La jointure renvoie `video: null` si la vidéo n'est plus publiée (RLS) ou a
// été supprimée : on écarte ces lignes pour ne jamais casser l'affichage.
function keepWithVideo<T extends { video: Video | null }>(rows: T[] | null): (T & { video: Video })[] {
  return (rows ?? []).filter((row): row is T & { video: Video } => !!row.video);
}

// "Reprendre la lecture" : vidéos commencées mais pas terminées.
export async function getResumeItems(supabase: SupabaseClient, userId: string, limit = 12): Promise<ResumeItem[]> {
  const { data } = await supabase
    .from("watch_progress")
    .select(`progress, ${VIDEO_SELECT}`)
    .eq("user_id", userId)
    .gt("progress", 0.01)
    .lt("progress", FINISHED_THRESHOLD)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return keepWithVideo(data as unknown as { progress: number; video: Video | null }[] | null).map((row) => ({
    video: row.video,
    progress: Number(row.progress)
  }));
}

// Vidéos déjà regardées jusqu'au bout.
export async function getFinishedVideos(supabase: SupabaseClient, userId: string, limit = 12): Promise<Video[]> {
  const { data } = await supabase
    .from("watch_progress")
    .select(VIDEO_SELECT)
    .eq("user_id", userId)
    .gte("progress", FINISHED_THRESHOLD)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return keepWithVideo(data as unknown as { video: Video | null }[] | null).map((row) => row.video);
}

// "Ma liste" / Favoris, du plus récent au plus ancien.
export async function getFavoriteVideos(supabase: SupabaseClient, userId: string, limit = 60): Promise<Video[]> {
  const { data } = await supabase
    .from("favorites")
    .select(VIDEO_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return keepWithVideo(data as unknown as { video: Video | null }[] | null).map((row) => row.video);
}
