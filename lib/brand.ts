// Identité visuelle AGM (Abu Group Media). Le logo est hébergé sur Cloudinary :
// pour le changer, remplace uniquement cette URL.
export const LOGO_URL =
  "https://res.cloudinary.com/dkuciagop/image/upload/v1789990359/7b9cab00-af67-42c7-baed-be08088cad62_zbtsio.jpg";

export const BRAND_NAME = "Abu Group Media";

// Informations utilisées sur les pages légales (mentions, politique de
// confidentialité, CGU) et pour la vérification de l'écran de consentement
// Google OAuth. ⚠️ À compléter avec vos vraies coordonnées avant mise en ligne.
export const LEGAL = {
  siteUrl: "https://www.abugroupmedia.com", // TODO : ajuste l'extension (.com/.cm/...) selon le domaine réellement acheté
  companyName: "Abu Group Media (AGM)", // TODO : raison sociale exacte si différente
  address: "Bafoussam, Cameroun", // TODO : adresse complète si vous souhaitez la publier
  contactEmail: "abugroupmedia237@gmail.com", // ⚠️ corrigé : il manquait le "@" avant gmail.com
  lastUpdated: "23 septembre 2026"
};

// Version optimisée par Cloudinary (hauteur limitée, format et qualité auto)
// pour ne pas charger l'image d'origine à chaque page.
export function optimizedLogoUrl(height = 144) {
  return LOGO_URL.replace("/upload/", `/upload/c_limit,h_${height},q_auto,f_auto/`);
}
