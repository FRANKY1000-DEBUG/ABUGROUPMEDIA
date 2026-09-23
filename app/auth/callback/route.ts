import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Après la redirection Google, Supabase renvoie ici avec un "code".
// On l'échange contre une session, puis on redirige vers /profil.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profil";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
