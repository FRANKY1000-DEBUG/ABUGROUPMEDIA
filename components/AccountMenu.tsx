"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AccountMenu({ user, checkingAuth }: { user: User | null; checkingAuth: boolean }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (checkingAuth) {
    return <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-surface-2" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-9 items-center rounded-full bg-gradient-to-br from-accent2 to-accent1 px-4 text-[12.5px] font-bold text-white transition-transform hover:scale-105"
      >
        Se connecter
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Mon compte"
        aria-expanded={open}
        title={user.email ?? "Mon compte"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent2 to-accent1 text-[12px] font-extrabold text-white transition-transform hover:scale-105"
      >
        {user.email ? user.email[0].toUpperCase() : "?"}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
          <div className="border-b border-line px-4 py-3">
            <div className="truncate text-[13px] font-semibold">{user.user_metadata?.full_name ?? "Mon compte"}</div>
            <div className="truncate text-[12px] text-muted">{user.email}</div>
          </div>
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-ink transition-colors hover:bg-surface-2"
          >
            Mon profil
          </Link>
          <Link
            href="/bibliotheque"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-ink transition-colors hover:bg-surface-2"
          >
            Ma bibliothèque
          </Link>
          <Link
            href="/favoris"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-ink transition-colors hover:bg-surface-2"
          >
            Ma liste
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-accent2 transition-colors hover:bg-surface-2 disabled:opacity-60"
          >
            {loggingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
