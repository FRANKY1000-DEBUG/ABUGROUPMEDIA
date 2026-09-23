"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { BRAND_NAME, optimizedLogoUrl } from "@/lib/brand";

// Logo AGM cliquable. Par défaut il ramène à l'accueil du site.
// Si l'image ne charge pas, on retombe sur la pastille "A" + texte AGM.
export default function Logo({
  href = "/",
  title = "Accueil",
  label,
  className,
  imgClassName
}: {
  href?: string;
  title?: string; // info-bulle / libellé d'accessibilité du lien
  label?: string; // texte affiché à côté (ex. "Admin")
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Si l'image a déjà échoué avant l'hydratation, onError ne se déclenche plus.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <Link href={href} aria-label={`${BRAND_NAME} — ${title}`} title={title} className={clsx("flex items-center gap-2.5", className)}>
      {failed ? (
        <>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent1 to-accent2 text-sm font-extrabold text-white">
            A
          </span>
          <span className="text-[15px] font-extrabold">AGM</span>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={optimizedLogoUrl()}
          alt={BRAND_NAME}
          onError={() => setFailed(true)}
          className={clsx("h-9 w-auto max-w-[150px] flex-shrink-0 rounded-[9px] object-contain", imgClassName)}
        />
      )}
      {label && <span className="text-[13px] font-bold text-muted">{label}</span>}
    </Link>
  );
}
