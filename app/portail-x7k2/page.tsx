"use client";

// Page de connexion réservée aux administrateurs AGM.
// Volontairement séparée de /login (comptes visiteurs) : URL non devinable,
// jamais liée depuis le header, la homepage ou tout autre lien public.
// L'accès réel au dashboard reste toujours vérifié côté serveur (middleware
// + admin_users), cette page ne fait que fournir le formulaire de connexion.

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/authMessages";

function getNextPath(nextParam: string | null) {
  return nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/admin";
}

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setLoading(false);
      setError(translateAuthError(authError?.message));
      return;
    }

    // Compte valide, mais est-il admin ? La policy RLS "users can check own
    // admin status" n'autorise que cette lecture (sa propre ligne).
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Ce compte n'a pas accès au dashboard administrateur.");
      return;
    }

    router.push(getNextPath(searchParams.get("next")));
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "#ffffff" }}
    >
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted">
            <ShieldAlert size={20} />
          </span>
          <span className="text-[13px] font-semibold uppercase tracking-wide text-muted">Accès administrateur</span>
        </div>

        <div className="rounded-[20px] border border-line bg-surface p-8">
          <h1 className="mb-1.5 text-xl font-extrabold">Connexion sécurisée</h1>
          <p className="mb-6 text-[13.5px] text-muted">Réservé aux comptes administrateurs AGM.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Adresse e-mail</span>
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                placeholder="admin@exemple.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Mot de passe</span>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                placeholder="••••••••"
              />
            </label>

            {error && <p className="text-[13px] text-accent2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-[11px] bg-ink py-3.5 text-[14.5px] font-bold text-bg disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Vérification…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  // Suspense requis par Next.js pour useSearchParams dans un composant client.
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
