"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { pingActivityAction } from "@/app/actions";

const PING_EVERY_MS = 60_000;

// Composant invisible monté dans le layout racine : signale au serveur que
// l'utilisateur connecté est actif (une fois par minute, onglet visible).
export default function ActivityTracker() {
  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setInterval> | null = null;
    let loggedIn = false;

    const ping = () => {
      if (loggedIn && document.visibilityState === "visible") {
        pingActivityAction().catch(() => {});
      }
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const start = () => {
      if (timer) return;
      ping();
      timer = setInterval(ping, PING_EVERY_MS);
    };

    // Reçoit aussi l'état initial de la session au montage.
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loggedIn = !!session?.user;
      if (loggedIn) start();
      else stop();
    });

    const onVisible = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stop();
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
