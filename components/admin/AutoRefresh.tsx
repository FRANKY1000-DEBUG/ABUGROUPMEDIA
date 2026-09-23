"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Recharge les données de la page serveur à intervalle régulier (statut "en ligne" en direct).
export default function AutoRefresh({ everyMs = 30_000 }: { everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, everyMs);
    return () => clearInterval(id);
  }, [router, everyMs]);
  return null;
}
