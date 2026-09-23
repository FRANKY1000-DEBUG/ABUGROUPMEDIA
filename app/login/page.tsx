"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/authMessages";
import Logo from "@/components/Logo";
import BackLink from "@/components/BackLink";

// Page de retour après connexion : `?next=/watch/xyz` si l'utilisateur vient d'une
// action qui demande d'être connecté (ex. "Ajouter à ma liste"), sinon /profil.
function getNextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/profil";
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  function switchMode(next: "login" | "register") {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleGoogle() {
    setError(null);
    setInfo(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}` }
    });
    // En cas de succès, le navigateur est redirigé vers Google : pas besoin
    // de repasser googleLoading à false. On ne le fait qu'en cas d'échec.
    if (authError) {
      setGoogleLoading(false);
      setError(translateAuthError(authError.message));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authError) {
        setError(translateAuthError(authError.message));
        return;
      }
      router.push(getNextPath());
      router.refresh();
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return;
    }

    // Si la confirmation par e-mail est activée dans Supabase, `session` est
    // null tant que le lien reçu par mail n'a pas été cliqué : on ne peut
    // donc pas encore rediriger vers /profil.
    if (!data.session) {
      setInfo("Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.");
      setMode("login");
      setPassword("");
      return;
    }

    router.push(getNextPath());
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(37,99,235,.14), transparent 45%), radial-gradient(circle at 85% 80%, rgba(225,29,42,.12), transparent 50%), #ffffff"
      }}
    >
      <div className="w-full max-w-[404px]">
        <div className="mb-6">
          <BackLink href="/" label="Retour au site" />
        </div>
        <div className="mb-8 flex justify-center">
          <Logo imgClassName="h-12" />
        </div>

        <div className="rounded-[20px] border border-line bg-surface p-8">
          <div className="mb-6 flex rounded-xl bg-surface-2 p-1">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-[9px] py-2.5 text-[13.5px] font-bold ${mode === "login" ? "bg-ink text-bg" : "text-muted"}`}
            >
              Connexion
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex-1 rounded-[9px] py-2.5 text-[13.5px] font-bold ${mode === "register" ? "bg-ink text-bg" : "text-muted"}`}
            >
              Créer un compte
            </button>
          </div>

          <h1 className="mb-1.5 text-xl font-extrabold">
            {mode === "login" ? "Content de vous revoir" : "Rejoignez AGM"}
          </h1>
          <p className="mb-6 text-[13.5px] text-muted">
            {mode === "login" ? "Connectez-vous pour continuer à regarder AGM" : "Créez votre compte gratuit en quelques secondes"}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-[11px] border border-line bg-surface-2 py-3 text-[13.5px] font-semibold text-ink disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.4C39.9 37 44 31.4 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
            )}
            {googleLoading ? "Redirection vers Google…" : "Continuer avec Google"}
          </button>
          <div className="mb-5 flex items-center gap-3 text-[11.5px] text-muted">
            <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Nom complet</span>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                  placeholder="Votre nom"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Adresse e-mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                placeholder="vous@exemple.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Mot de passe</span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                placeholder="••••••••"
              />
            </label>

            {info && (
              <p className="rounded-[10px] border border-good/30 bg-good/10 px-3.5 py-2.5 text-[13px] text-good">
                {info}
              </p>
            )}
            {error && <p className="text-[13px] text-accent2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-[11px] bg-ink py-3.5 text-[14.5px] font-bold text-bg disabled:opacity-60"
            >
              {loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-5 text-center text-[12.5px] text-muted">
            {mode === "login" ? (
              <>Pas encore de compte ? <button onClick={() => switchMode("register")} className="font-semibold text-ink">Inscrivez-vous</button></>
            ) : (
              <>Déjà un compte ? <button onClick={() => switchMode("login")} className="font-semibold text-ink">Connectez-vous</button></>
            )}
          </p>

          <p className="mt-6 text-center text-[11.5px] leading-relaxed text-muted">
            En continuant, vous acceptez nos{" "}
            <a href="/conditions" className="font-semibold text-ink underline underline-offset-2">
              conditions d&apos;utilisation
            </a>{" "}
            et notre{" "}
            <a href="/confidentialite" className="font-semibold text-ink underline underline-offset-2">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
