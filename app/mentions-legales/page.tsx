import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { BRAND_NAME, LEGAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Mentions légales — ${BRAND_NAME}`,
  description: "Informations légales concernant l'éditeur et l'hébergeur de la plateforme AGM."
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <ul>
          <li><strong>Nom / raison sociale :</strong> {LEGAL.companyName}</li>
          <li><strong>Adresse :</strong> {LEGAL.address}</li>
          <li>
            <strong>Contact :</strong> <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
          </li>
          <li><strong>Site :</strong> {LEGAL.siteUrl}</li>
        </ul>
        <p className="text-[13px] text-muted">
          ⚠️ Complétez cette section avec votre numéro d&apos;immatabulation (RCCM / NIU), la forme juridique de la
          société et le nom du directeur de la publication avant la mise en ligne définitive.
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site et les données applicatives sont hébergés par des prestataires cloud (infrastructure de base de
          données et d&apos;authentification via Supabase ; hébergement des médias via Cloudinary). L&apos;hébergement
          du frontend dépend de la plateforme de déploiement choisie pour la mise en production.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site (textes, vidéos, logos, charte graphique) est protégé par le droit de
          la propriété intellectuelle. Toute reproduction non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2>Documents liés</h2>
        <p>
          Pour en savoir plus sur l&apos;utilisation de vos données personnelles et vos droits, consultez notre{" "}
          <a href="/confidentialite">politique de confidentialité</a>. Pour connaître les règles d&apos;utilisation du
          Service, consultez nos <a href="/conditions">conditions générales d&apos;utilisation</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
