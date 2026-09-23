"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Logo from "./Logo";
import { discoverLinks, spaceLinks, isActivePath } from "@/lib/nav";

// Menu "hamburger" affiché uniquement sur mobile (la sidebar est masquée < md).
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Se referme dès qu'on change de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
      >
        <Menu size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <nav className="absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col gap-1 overflow-y-auto border-r border-line bg-surface px-3.5 py-5">
            <div className="mb-4 flex items-center justify-between px-1.5">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            {discoverLinks.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold transition-colors",
                    active ? "bg-accent2/10 text-accent2" : "text-muted hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <span
                    className={clsx(
                      "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent2 transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon size={18} strokeWidth={1.8} className={active ? "text-accent2" : ""} />
                  {label}
                </Link>
              );
            })}

            <div className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Mon espace</div>
            {spaceLinks.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold transition-colors",
                    active ? "bg-accent2/10 text-accent2" : "text-muted hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <span
                    className={clsx(
                      "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent2 transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon size={18} strokeWidth={1.8} className={active ? "text-accent2" : ""} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
