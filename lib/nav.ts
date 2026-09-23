import { Home, Tv, Mic, FileSearch, MessageCircle, Clapperboard, TrendingUp, Heart, Library, Layers, User } from "lucide-react";

// Liens de navigation partagés (sidebar desktop + menu mobile).
export const discoverLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/emissions", label: "Émissions", icon: Tv },
  { href: "/series", label: "Séries", icon: Layers },
  { href: "/reportages", label: "Reportages", icon: FileSearch },
  { href: "/interviews", label: "Interviews", icon: MessageCircle },
  { href: "/documentaires", label: "Documentaires", icon: Clapperboard },
  { href: "/podcasts", label: "Podcasts", icon: Mic },
  { href: "/tendances", label: "Tendances", icon: TrendingUp }
];

export const spaceLinks = [
  { href: "/favoris", label: "Favoris", icon: Heart },
  { href: "/bibliotheque", label: "Bibliothèque", icon: Library },
  { href: "/profil", label: "Mon profil", icon: User }
];

// "/" n'est actif que sur l'accueil ; les autres le sont aussi sur leurs sous-pages
// (ex. /series/mon-emission garde "Séries" allumé).
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
