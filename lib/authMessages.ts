// Supabase renvoie ses messages d'erreur en anglais : on les traduit pour
// une UX cohérente avec le reste du site. Le matching se fait par
// sous-chaîne car Supabase peut ajouter des détails variables au message.
const MESSAGES: Record<string, string> = {
  "Invalid login credentials": "E-mail ou mot de passe incorrect.",
  "Email not confirmed":
    "Votre adresse e-mail n'est pas encore confirmée. Vérifiez votre boîte mail (et vos spams).",
  "User already registered": "Un compte existe déjà avec cet e-mail. Connectez-vous plutôt.",
  "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address": "Adresse e-mail invalide.",
  "signup requires a valid password": "Merci de renseigner un mot de passe valide.",
  "For security purposes, you can only request this after":
    "Merci de patienter quelques secondes avant de réessayer.",
  "Email rate limit exceeded": "Trop de tentatives. Merci de réessayer dans quelques minutes.",
  "Email logins are disabled": "La connexion par e-mail est momentanément désactivée.",
  "provider is not enabled": "La connexion Google n'est pas encore activée sur ce site."
};

export function translateAuthError(message: string | null | undefined): string {
  if (!message) return "Une erreur est survenue. Merci de réessayer.";
  const match = Object.keys(MESSAGES).find((key) => message.includes(key));
  return match ? MESSAGES[match] : message;
}
