import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const settings = data as SiteSettings | null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Paramètres</h1>
          <p className="mt-0.5 text-[13px] text-muted">Informations générales de la plateforme AGM</p>
        </div>

        <form action={saveSettings} className="max-w-[560px] rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Nom du site</span>
              <input
                name="site_name"
                defaultValue={settings?.site_name ?? "AGM"}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Slogan</span>
              <input
                name="tagline"
                defaultValue={settings?.tagline ?? ""}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
                placeholder="Actualités, reportages, émissions..."
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">E-mail de contact</span>
              <input
                type="email"
                name="contact_email"
                defaultValue={settings?.contact_email ?? ""}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Téléphone support</span>
              <input
                name="support_phone"
                defaultValue={settings?.support_phone ?? ""}
                className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="flex items-center gap-2.5">
              <input type="checkbox" name="maintenance_mode" defaultChecked={settings?.maintenance_mode} className="h-4 w-4" />
              <span className="text-[13.5px] text-ink">Activer le mode maintenance</span>
            </label>
          </div>
          <button type="submit" className="mt-6 rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
            Enregistrer les paramètres
          </button>
        </form>
      </div>
    </div>
  );
}
