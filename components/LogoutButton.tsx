"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className, label = "Se déconnecter" }: { className?: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} disabled={loading} className={clsx("disabled:opacity-60", className)}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
      {label}
    </button>
  );
}
