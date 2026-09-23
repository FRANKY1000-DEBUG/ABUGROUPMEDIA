import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Lien "← Retour" cohérent sur toutes les pages.
export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted transition-colors hover:text-ink"
    >
      <ArrowLeft size={15} />
      {label}
    </Link>
  );
}
