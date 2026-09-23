"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AccountMenu from "./AccountMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/recherche?q=${encodeURIComponent(trimmed)}` : "/recherche");
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 bg-gradient-to-b from-bg/95 to-transparent px-6 py-5 md:px-10">
      <div className="flex items-center gap-3 md:hidden">
        <MobileMenu />
        <Logo />
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="hidden max-w-[420px] flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-muted transition-colors focus-within:border-ink/40 md:flex"
      >
        <button type="submit" aria-label="Rechercher" className="flex shrink-0 items-center text-muted hover:text-ink">
          <Search size={15} />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher vidéos, émissions, reportages..."
          className="w-full bg-transparent text-ink placeholder:text-muted focus:outline-none"
        />
      </form>

      <div className="flex items-center gap-3">
        <Link
          href="/recherche"
          aria-label="Rechercher"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink md:hidden"
        >
          <Search size={16} />
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
        >
          <Bell size={16} />
        </button>
        <AccountMenu user={user} checkingAuth={checkingAuth} />
      </div>
    </header>
  );
}
