"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BackLink from "@/components/BackLink";
import VideoCard from "@/components/VideoCard";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Video } from "@/lib/types";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const supabase = createClient();
    const timeout = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("videos")
        .select("*, category:categories(*)")
        .eq("status", "published")
        .ilike("title", `%${query}%`)
        .limit(24);
      setResults((data ?? []) as Video[]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="px-4 pb-16 pt-2 md:px-10">
        <div className="mb-4">
          <BackLink href="/" label="Accueil" />
        </div>
        <div className="mb-5 flex max-w-[640px] items-center gap-3.5 rounded-2xl border border-line bg-surface px-5 py-4">
          <Search size={18} className="flex-shrink-0 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher vidéos, émissions, reportages..."
            className="w-full bg-transparent text-[17px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        {query.trim().length >= 2 && (
          <p className="mb-5 text-xs text-muted">
            {loading ? "Recherche en cours…" : `${results.length} résultat${results.length > 1 ? "s" : ""} pour "${query}"`}
          </p>
        )}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
