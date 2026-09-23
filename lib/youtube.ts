/**
 * Extrait l'identifiant d'une vidéo YouTube depuis n'importe quel format
 * de lien courant : youtu.be/ID, youtube.com/watch?v=ID (avec ou sans
 * paramètres additionnels comme ?si=...), youtube.com/embed/ID, youtube.com/shorts/ID.
 * Retourne null si l'URL n'est pas reconnue comme un lien YouTube.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      const segments = parsed.pathname.split("/").filter(Boolean);
      // /embed/ID or /shorts/ID or /live/ID
      if (["embed", "shorts", "live"].includes(segments[0])) {
        return segments[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
