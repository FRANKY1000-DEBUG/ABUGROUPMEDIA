"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Clapperboard, Tv, Tags, Users, TrendingUp, Home, ExternalLink } from "lucide-react";
import Logo from "./Logo";

const groups = [
  {
    label: "Général",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/videos", label: "Vidéos", icon: Clapperboard },
      { href: "/admin/series", label: "Séries", icon: Tv },
      { href: "/admin/categories", label: "Catégories", icon: Tags }
    ]
  },
  {
    label: "Communauté",
    links: [
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
      { href: "/admin/analytique", label: "Analytique", icon: TrendingUp }
    ]
  },
  {
    label: "Système",
    links: [
      { href: "/admin/accueil", label: "Page d'accueil", icon: Home }
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[230px] flex-shrink-0 flex-col gap-7 border-r border-line bg-surface p-4">
      <div className="flex flex-col gap-3">
        <Logo href="/admin" title="Tableau de bord" label="Admin" className="px-1.5" />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 text-[13px] font-bold text-ink transition-colors hover:border-ink/40"
        >
          <ExternalLink size={14} />
          Voir le site
        </a>
      </div>
      {groups.map((group) => (
        <nav key={group.label} className="flex flex-col gap-0.5">
          <div className="px-3 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {group.label}
          </div>
          {group.links.map(({ href, label, icon: Icon }) => {
            // Le dashboard (/admin) n'est actif que sur lui-même ; les autres le sont aussi sur leurs sous-pages.
            const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13.5px] font-semibold text-muted",
                  active ? "bg-surface-2 text-ink" : "hover:bg-surface-2 hover:text-ink"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      ))}
    </aside>
  );
}
