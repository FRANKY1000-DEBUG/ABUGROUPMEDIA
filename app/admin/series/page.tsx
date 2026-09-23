import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { deleteShow } from "@/app/admin/actions";
import type { Show } from "@/lib/types";
import { Pencil } from "lucide-react";

export default async function AdminEmissionsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("shows").select("*").order("created_at", { ascending: false });
  const shows = (data ?? []) as Show[];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold">Séries</h1>
            <p className="mt-0.5 text-[13px] text-muted">{shows.length} série(s)</p>
          </div>
          <a href="/admin/series/nouveau" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
            + Nouvelle série
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <div key={show.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="mb-3 h-28 w-full rounded-xl bg-surface-2" style={show.cover_url ? { backgroundImage: `url(${show.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
              <div className="mb-1 text-[15px] font-bold">{show.name}</div>
              <div className="mb-4 text-[12.5px] text-muted">{show.host ?? "Animateur non renseigné"}</div>
              <div className="flex items-center gap-2">
                <a href={`/admin/series/${show.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[12.5px] font-semibold text-muted hover:text-ink">
                  <Pencil size={13} /> Modifier
                </a>
                <form action={deleteShow}>
                  <input type="hidden" name="id" defaultValue={show.id} />
                  <button type="submit" className="rounded-lg border border-accent2/40 px-3 py-2 text-[12.5px] font-semibold text-accent2">
                    Suppr.
                  </button>
                </form>
              </div>
            </div>
          ))}
          {shows.length === 0 && (
            <div className="col-span-full rounded-2xl border border-line bg-surface p-8 text-center text-sm text-muted">
              Aucune série pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
