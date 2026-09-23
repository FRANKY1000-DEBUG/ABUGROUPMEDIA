"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

// Boutons "Partager" et "Copier le lien" de la page vidéo.
// - Partager : utilise l'API Web Share native (menu WhatsApp / Facebook /
//   Messages... proposé par le téléphone) quand elle est disponible, sinon
//   se rabat sur la copie du lien.
// - Copier le lien : copie l'URL complète dans le presse-papier avec un
//   petit retour visuel de confirmation.
export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // L'utilisateur a annulé le partage, ou l'API a échoué : pas d'action nécessaire.
        return;
      }
    }
    handleCopy();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papier indisponible (permissions navigateur) : on ignore silencieusement.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent2/50 hover:text-accent2"
        title="Partager"
        aria-label="Partager cette vidéo"
      >
        <Share2 size={14} />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent2/50 hover:text-accent2"
        title={copied ? "Lien copié !" : "Copier le lien"}
        aria-label="Copier le lien de cette vidéo"
      >
        {copied ? <Check size={14} className="text-good" /> : <LinkIcon size={14} />}
        {copied && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
            Lien copié !
          </span>
        )}
      </button>
    </>
  );
}
