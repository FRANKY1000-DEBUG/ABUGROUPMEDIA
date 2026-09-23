"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "./Logo";
import { discoverLinks, spaceLinks, isActivePath } from "@/lib/nav";

type NavLink = (typeof discoverLinks)[number];

function NavItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const { href, label, icon: Icon } = link;
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-200",
        active
          ? "bg-accent2/10 text-accent2"
          : "text-muted hover:translate-x-0.5 hover:bg-surface-2 hover:text-ink"
      )}
    >
      {/* Barre indicatrice de l'onglet actif */}
      <span
        className={clsx(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent2 transition-all duration-200",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <Icon
        size={18}
        strokeWidth={1.8}
        className={clsx(
          "flex-shrink-0 transition-transform duration-200",
          active ? "text-accent2" : "text-muted group-hover:text-ink group-hover:scale-110"
        )}
      />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-[220px] flex-shrink-0 flex-col gap-6 border-r border-line bg-surface/85 px-3.5 py-6">
      <Logo className="px-1.5" />
      <nav className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto">
        {discoverLinks.map((link) => (
          <NavItem key={link.href} link={link} pathname={pathname} />
        ))}
        <div className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Mon espace</div>
        {spaceLinks.map((link) => (
          <NavItem key={link.href} link={link} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}
