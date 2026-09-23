import { saveShow, deleteShow } from "@/app/admin/actions";
import type { Show } from "@/lib/types";

export default function ShowForm({ show }: { show?: Show }) {
  return (
    <div className="flex flex-col gap-5">
      <form action={saveShow} className="flex flex-col gap-5">
        {show && <input type="hidden" name="id" defaultValue={show.id} />}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Nom de l&apos;émission</span>
            <input
              required
              name="name"
              defaultValue={show?.name}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Slug (optionnel)</span>
            <input
              name="slug"
              defaultValue={show?.slug}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Animateur / Présentateur</span>
            <input
              name="host"
              defaultValue={show?.host ?? ""}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">URL logo</span>
            <input
              name="logo_url"
              defaultValue={show?.logo_url ?? ""}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="col-span-2 block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">URL couverture</span>
            <input
              name="cover_url"
              defaultValue={show?.cover_url ?? ""}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="col-span-2 block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Description</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={show?.description ?? ""}
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
            {show ? "Enregistrer" : "Créer l'émission"}
          </button>
          <a href="/admin/series" className="rounded-[10px] border border-line px-5 py-2.5 text-[13.5px] font-semibold text-muted">
            Annuler
          </a>
        </div>
      </form>
      {show && (
        <form action={deleteShow}>
          <input type="hidden" name="id" defaultValue={show.id} />
          <button type="submit" className="rounded-[10px] border border-accent2/40 px-5 py-2.5 text-[13.5px] font-semibold text-accent2">
            Supprimer cette émission
          </button>
        </form>
      )}
    </div>
  );
}
