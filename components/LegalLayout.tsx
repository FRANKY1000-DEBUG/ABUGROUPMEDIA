import Link from "next/link";
import Logo from "./Logo";
import BackLink from "./BackLink";
import { LEGAL } from "@/lib/brand";

// Mise en page commune aux pages légales (confidentialité, CGU, mentions légales)
// afin de garder une présentation cohérente et professionnelle — utile aussi
// pour la revue manuelle de Google lors de la vérification OAuth.
export default function LegalLayout({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line px-4 py-5 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <BackLink href="/" label="Retour au site" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-10 md:py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink md:text-3xl">{title}</h1>
        <p className="mb-10 text-[13px] text-muted">Dernière mise à jour : {LEGAL.lastUpdated}</p>

        <div className="legal-content space-y-8 text-[14.5px] leading-relaxed text-ink/90">
          {children}
        </div>

        <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-[13px] text-muted">
          <Link href="/confidentialite" className="hover:text-accent2">
            Politique de confidentialité
          </Link>
          <Link href="/conditions" className="hover:text-accent2">
            Conditions d&apos;utilisation
          </Link>
          <Link href="/mentions-legales" className="hover:text-accent2">
            Mentions légales
          </Link>
        </div>
      </main>
    </div>
  );
}
