// Formate un nombre de vues de façon compacte (1,2 k / 3,4 M) pour les
// cartes vidéo, ou en entier complet pour les endroits plus détaillés.
export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

export function formatFullNumber(value: number) {
  return (value ?? 0).toLocaleString("fr-FR");
}

// "à l'instant", "il y a 5 min", "il y a 3 h", "il y a 2 j", puis la date complète.
export function formatRelativeTime(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return "—";
  const diff = now - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
