import { Clapperboard } from "lucide-react";

/**
 * Miniature générique utilisée par les cards (vidéos, émissions, épisodes...).
 * - Si `src` est défini (thumbnail_url / cover_url venant de Supabase), on affiche la vraie image.
 * - Sinon, on affiche un repli dégradé + icône plutôt qu'un bloc vide, pour que
 *   chaque card ait toujours un visuel.
 */
export default function Thumbnail({
  src,
  alt = "",
  iconSize = 20
}: {
  src?: string | null;
  alt?: string;
  iconSize?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 25% 15%, rgba(37,99,235,.18), transparent 55%), radial-gradient(circle at 85% 85%, rgba(225,29,42,.16), transparent 55%), #eef0f3"
      }}
    >
      <Clapperboard size={iconSize} className="text-ink/20" strokeWidth={1.5} />
    </div>
  );
}
