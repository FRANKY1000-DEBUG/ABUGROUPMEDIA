"use client";

import { useCallback, useEffect, useRef } from "react";
import { ExternalLink, Play } from "lucide-react";
import Thumbnail from "./Thumbnail";
import { saveProgressAction } from "@/app/actions";

const SAVE_EVERY_MS = 10_000;

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, string | number | undefined>;
      events: { onStateChange: (e: { data: number }) => void };
    }
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return youtubeApiPromise;
}

const FRAME = "relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-[#0d0e12]";

export default function WatchPlayer({
  videoId,
  title,
  thumbnailUrl,
  videoUrl,
  youtubeId,
  initialPosition,
  canSave
}: {
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  youtubeId: string | null;
  initialPosition: number; // secondes, 0 si pas de reprise
  canSave: boolean; // true seulement si l'utilisateur est connecté
}) {
  const ytHostRef = useRef<HTMLDivElement>(null);
  const lastSavedRef = useRef(0);

  const persist = useCallback(
    (position: number, duration: number) => {
      if (!canSave || !(duration > 0) || position < 1) return;
      saveProgressAction(videoId, position, duration).catch(() => {});
    },
    [canSave, videoId]
  );

  // ── Lecteur YouTube (IFrame API) : sauvegarde toutes les 10 s pendant la lecture
  useEffect(() => {
    if (!youtubeId || !ytHostRef.current) return;

    const host = ytHostRef.current;
    let player: YTPlayer | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const saveNow = () => {
      if (!player) return;
      try {
        persist(player.getCurrentTime(), player.getDuration());
      } catch {
        // le lecteur peut être déjà détruit
      }
    };
    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") saveNow();
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      // React ne gère que `host` ; l'API remplace le nœud qu'on lui donne par
      // l'iframe, donc on lui fournit un nœud créé à la main.
      const mount = document.createElement("div");
      host.appendChild(mount);
      player = new window.YT.Player(mount, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
          start: initialPosition > 0 ? Math.floor(initialPosition) : undefined
        },
        events: {
          onStateChange: (e) => {
            if (e.data === 1) {
              // PLAYING
              stopTimer();
              timer = setInterval(saveNow, SAVE_EVERY_MS);
            } else {
              stopTimer();
              if (e.data === 2 || e.data === 0) saveNow(); // PAUSED / ENDED
            }
          }
        }
      });
    });

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
      saveNow();
      try {
        player?.destroy();
      } catch {
        // ignoré
      }
      host.innerHTML = "";
    };
  }, [youtubeId, initialPosition, persist]);

  if (youtubeId) {
    return (
      <div className={FRAME}>
        <div ref={ytHostRef} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
      </div>
    );
  }

  const isYoutubeUrl = !!videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  const isDirectFile = !!videoUrl && videoUrl.startsWith("http") && (videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm"));

  // ── Fichier vidéo direct (.mp4 / .webm)
  if (videoUrl && !isYoutubeUrl && isDirectFile) {
    return (
      <div className={FRAME}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          controls
          poster={thumbnailUrl ?? undefined}
          className="h-full w-full"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (initialPosition > 0 && initialPosition < v.duration - 2) v.currentTime = initialPosition;
          }}
          onTimeUpdate={(e) => {
            const now = Date.now();
            if (now - lastSavedRef.current < SAVE_EVERY_MS) return;
            lastSavedRef.current = now;
            persist(e.currentTarget.currentTime, e.currentTarget.duration);
          }}
          onPause={(e) => persist(e.currentTarget.currentTime, e.currentTarget.duration)}
          onEnded={(e) => persist(e.currentTarget.duration, e.currentTarget.duration)}
        />
      </div>
    );
  }

  // ── Lien externe (pas de suivi de progression possible)
  if (videoUrl && !isYoutubeUrl) {
    return (
      <div className={FRAME}>
        <a href={videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0">
          <Thumbnail src={thumbnailUrl} alt={title} iconSize={28} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <ExternalLink size={22} />
            </div>
            <span className="text-sm font-semibold">Regarder sur le lien externe</span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={FRAME}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
        <Play size={22} className="ml-1" />
      </div>
    </div>
  );
}
