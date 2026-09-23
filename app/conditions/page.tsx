import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { BRAND_NAME, LEGAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Conditions d'utilisation — ${BRAND_NAME}`,
  description: "Conditions générales d'utilisation de la plateforme AGM."
};

export default function ConditionsPage() {
  return (
    <LegalLayout title="Conditions générales d'utilisation">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales d&apos;utilisation (« CGU ») régissent l&apos;accès et l&apos;usage de la
          plateforme {BRAND_NAME} accessible à l&apos;adresse {LEGAL.siteUrl} (le « Service »), éditée par{" "}
          {LEGAL.companyName}, {LEGAL.address}. En créant un compte ou en utilisant le Service, vous acceptez ces
          CGU sans réserve.
        </p>
      </section>

      <section>
        <h2>2. Description du Service</h2>
        <p>
          {BRAND_NAME} est une plateforme de streaming vidéo qui donne accès à des émissions, reportages,
          interviews, documentaires et podcasts. Certaines fonctionnalités (reprendre la lecture, favoris,
          bibliothèque personnelle) nécessitent la création d&apos;un compte utilisateur.
        </p>
      </section>

      <section>
        <h2>3. Création de compte</h2>
        <p>
          Vous pouvez créer un compte avec une adresse e-mail et un mot de passe, ou en utilisant « Se connecter avec
          Google ». Vous devez fournir des informations exactes et tenir votre mot de passe confidentiel. Vous êtes
          responsable de toute activité effectuée depuis votre compte. Contactez-nous immédiatement à{" "}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> si vous suspectez un accès non autorisé.
        </p>
      </section>

      <section>
        <h2>4. Utilisation autorisée</h2>
        <p>Le Service est destiné à un usage personnel et non commercial. En l&apos;utilisant, vous vous engagez à ne pas :</p>
        <ul>
          <li>Copier, redistribuer, revendre ou rediffuser publiquement les contenus sans autorisation ;</li>
          <li>Contourner des mesures techniques de protection ou d&apos;accès du Service ;</li>
          <li>Utiliser des robots, scripts ou outils automatisés pour extraire des données du Service ;</li>
          <li>Créer plusieurs comptes dans le but de contourner une restriction ou une suspension ;</li>
          <li>Utiliser le Service à des fins illégales, frauduleuses ou portant atteinte aux droits d&apos;autrui.</li>
        </ul>
      </section>

      <section>
        <h2>5. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus disponibles sur le Service (vidéos, textes, logos, marques, éléments
          graphiques) est protégé par le droit de la propriété intellectuelle et reste la propriété d&apos;{BRAND_NAME}
          {" "}ou de ses partenaires. Aucune disposition des présentes CGU ne vous confère de droit sur ces contenus
          en dehors d&apos;un usage personnel de visionnage au sein du Service.
        </p>
      </section>

      <section>
        <h2>6. Suspension et résiliation</h2>
        <p>
          Nous pouvons suspendre ou résilier votre compte en cas de non-respect des présentes CGU, d&apos;usage
          frauduleux ou abusif du Service. Vous pouvez à tout moment demander la suppression de votre compte depuis
          votre page « Profil » ou en nous contactant.
        </p>
      </section>

      <section>
        <h2>7. Disponibilité du Service</h2>
        <p>
          Nous nous efforçons d&apos;assurer un accès continu au Service, sans pouvoir le garantir. Le Service peut
          être interrompu temporairement pour maintenance, mise à jour ou en cas de force majeure, sans que notre
          responsabilité puisse être engagée à ce titre.
        </p>
      </section>

      <section>
        <h2>8. Limitation de responsabilité</h2>
        <p>
          Le Service est fourni « en l&apos;état ». Dans les limites permises par la loi, {BRAND_NAME} ne saurait être
          tenu responsable des dommages indirects résultant de l&apos;utilisation ou de l&apos;impossibilité
          d&apos;utiliser le Service.
        </p>
      </section>

      <section>
        <h2>9. Modification des CGU</h2>
        <p>
          Nous pouvons modifier les présentes CGU à tout moment, notamment pour refléter une évolution du Service ou
          de la réglementation applicable. La version en vigueur est toujours celle publiée sur cette page, avec sa
          date de mise à jour.
        </p>
      </section>

      <section>
        <h2>10. Droit applicable</h2>
        <p>
          Les présentes CGU sont soumises au droit camerounais. Tout litige relatif à leur interprétation ou leur
          exécution relève de la compétence des juridictions camerounaises, sauf disposition légale impérative
          contraire.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Pour toute question relative à ces CGU, écrivez-nous à{" "}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
