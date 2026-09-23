import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { BRAND_NAME, LEGAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Politique de confidentialité — ${BRAND_NAME}`,
  description: "Comment AGM collecte, utilise et protège vos données personnelles, y compris via la connexion Google."
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <section>
        <h2>1. Préambule</h2>
        <p>
          {LEGAL.companyName} (« <strong>{BRAND_NAME}</strong> », « nous ») édite la plateforme média disponible à
          l&apos;adresse {LEGAL.siteUrl} (le « Service »). Cette politique explique quelles données personnelles nous
          collectons lorsque vous utilisez le Service — y compris lorsque vous vous connectez avec votre compte
          Google — pourquoi nous les collectons, comment nous les utilisons et quels sont vos droits.
        </p>
        <p>
          En créant un compte ou en utilisant le Service, vous reconnaissez avoir pris connaissance de cette
          politique.
        </p>
      </section>

      <section>
        <h2>2. Données que nous collectons</h2>
        <h3>2.1 Données fournies à l&apos;inscription</h3>
        <ul>
          <li>Adresse e-mail et mot de passe (si vous créez un compte par e-mail) ;</li>
          <li>
            Nom, adresse e-mail et photo de profil transmis par Google si vous utilisez « Se connecter avec
            Google » — nous ne recevons jamais votre mot de passe Google ;
          </li>
        </ul>
        <h3>2.2 Données générées par l&apos;usage du Service</h3>
        <ul>
          <li>Historique de visionnage et progression de lecture (pour la fonctionnalité « Reprendre la lecture ») ;</li>
          <li>Vidéos et émissions ajoutées à vos favoris / votre bibliothèque ;</li>
          <li>Vidéos likées ;</li>
          <li>Statistiques d&apos;usage (pages consultées, actions effectuées, horodatage) à des fins d&apos;analyse d&apos;audience.</li>
        </ul>
        <h3>2.3 Données techniques</h3>
        <ul>
          <li>Adresse IP, type d&apos;appareil et de navigateur ;</li>
          <li>Cookies et identifiants de session nécessaires à l&apos;authentification (voir section 7).</li>
        </ul>
      </section>

      <section>
        <h2>3. Connexion avec Google</h2>
        <p>
          Si vous choisissez de vous connecter via Google, nous utilisons le protocole OAuth de Google pour
          vérifier votre identité. Nous ne demandons que les informations strictement nécessaires à la création et
          à la gestion de votre compte : votre <strong>nom</strong>, votre <strong>adresse e-mail</strong> et votre{" "}
          <strong>photo de profil publique</strong>. Nous n&apos;accédons à aucune autre donnée de votre compte
          Google (contacts, agenda, fichiers, etc.) et nous ne publions jamais en votre nom.
        </p>
      </section>

      <section>
        <h2>4. Pourquoi nous utilisons vos données</h2>
        <ul>
          <li>Créer, sécuriser et gérer votre compte utilisateur ;</li>
          <li>Vous permettre de reprendre la lecture d&apos;une vidéo, retrouver vos favoris et votre bibliothèque ;</li>
          <li>Personnaliser les recommandations de contenu ;</li>
          <li>Assurer la sécurité du Service et prévenir la fraude ou les usages abusifs ;</li>
          <li>Produire des statistiques d&apos;audience agrégées ;</li>
          <li>Vous contacter au sujet de votre compte (confirmation d&apos;e-mail, réinitialisation de mot de passe, informations de service).</li>
        </ul>
        <p>Nous ne vendons jamais vos données personnelles à des tiers et nous ne les utilisons pas à des fins publicitaires non sollicitées.</p>
      </section>

      <section>
        <h2>5. Partage des données</h2>
        <p>Vos données peuvent être traitées par les prestataires suivants, uniquement pour faire fonctionner le Service :</p>
        <ul>
          <li><strong>Supabase</strong> — hébergement de la base de données et de l&apos;authentification ;</li>
          <li><strong>Google</strong> — authentification via « Se connecter avec Google » ;</li>
          <li><strong>Cloudinary</strong> — hébergement et optimisation des images / médias.</li>
        </ul>
        <p>
          Ces prestataires n&apos;utilisent vos données que pour le compte d&apos;{BRAND_NAME} et dans le respect de
          leurs propres engagements de confidentialité. Nous pouvons également divulguer des données si la loi
          l&apos;exige.
        </p>
      </section>

      <section>
        <h2>6. Durée de conservation</h2>
        <p>
          Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, vos données
          personnelles (profil, favoris, historique) sont supprimées ou anonymisées dans un délai raisonnable, sauf
          obligation légale de conservation plus longue.
        </p>
      </section>

      <section>
        <h2>7. Cookies</h2>
        <p>
          Nous utilisons des cookies strictement nécessaires au fonctionnement du Service, notamment pour maintenir
          votre session de connexion. Ces cookies ne servent pas à vous suivre sur d&apos;autres sites et ne sont pas
          partagés à des fins publicitaires.
        </p>
      </section>

      <section>
        <h2>8. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables (chiffrement des mots de
          passe, connexions HTTPS, contrôle d&apos;accès) pour protéger vos données contre l&apos;accès non autorisé,
          la perte ou l&apos;altération.
        </p>
      </section>

      <section>
        <h2>9. Vos droits</h2>
        <p>Vous disposez à tout moment du droit de :</p>
        <ul>
          <li>Accéder aux données que nous détenons à votre sujet ;</li>
          <li>Demander la correction de données inexactes ;</li>
          <li>Demander la suppression de votre compte et de vos données ;</li>
          <li>Vous opposer à certains traitements ou retirer votre consentement (par exemple en déconnectant votre compte Google) ;</li>
          <li>Demander une copie de vos données dans un format portable.</li>
        </ul>
        <p>
          Vous pouvez exercer ces droits directement depuis votre page « Profil », ou en nous écrivant à{" "}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>. Nous répondons dans un délai raisonnable.
        </p>
      </section>

      <section>
        <h2>10. Mineurs</h2>
        <p>
          Le Service s&apos;adresse à un public général. Il n&apos;est pas destiné aux enfants de moins de 13 ans, et
          nous ne collectons pas sciemment de données concernant ce public sans le consentement d&apos;un parent ou
          tuteur légal.
        </p>
      </section>

      <section>
        <h2>11. Modifications de cette politique</h2>
        <p>
          Nous pouvons mettre à jour cette politique de confidentialité, par exemple pour refléter une évolution du
          Service ou de la réglementation. La date de dernière mise à jour figure en haut de cette page. En cas de
          changement important, nous vous en informerons via le Service ou par e-mail.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Pour toute question relative à cette politique ou à vos données personnelles, contactez-nous à l&apos;adresse{" "}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> — {LEGAL.address}.
        </p>
      </section>
    </LegalLayout>
  );
}
