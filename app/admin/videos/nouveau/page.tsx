import AdminSidebar from "@/components/AdminSidebar";
import BackLink from "@/components/BackLink";
import VideoForm from "@/components/admin/VideoForm";
import { createClient } from "@/lib/supabase/server";
import type { Category, Show } from "@/lib/types";

export default async function NewVideoPage() {
  const supabase = createClient();
  const [{ data: categories }, { data: shows }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("shows").select("*").order("name")
  ]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-4">
          <BackLink href="/admin/videos" label="Toutes les vidéos" />
        </div>
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Nouvelle vidéo</h1>
          <p className="mt-0.5 text-[13px] text-muted">Ajoute un nouveau contenu à la plateforme</p>
        </div>
        <div className="max-w-[720px] rounded-2xl border border-line bg-surface p-6">
          <VideoForm categories={(categories ?? []) as Category[]} shows={(shows ?? []) as Show[]} />
        </div>
      </div>
    </div>
  );
}
