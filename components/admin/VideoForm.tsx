import { saveVideo, deleteVideo } from "@/app/admin/actions";
import type { Category, Show, Video } from "@/lib/types";

export default function VideoForm({
  video,
  categories,
  shows
}: {
  video?: Video;
  categories: Category[];
  shows: Show[];
}) {
  return (
    <div className="flex flex-col gap-5">
    <form action={saveVideo} className="flex flex-col gap-5">
      {video && <input type="hidden" name="id" defaultValue={video.id} />}

      <div className="grid grid-cols-2 gap-4">
        <label className="col-span-2 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Titre</span>
          <input
            required
            name="title"
            defaultValue={video?.title}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            placeholder="Titre de la vidéo"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Slug (optionnel)</span>
          <input
            name="slug"
            defaultValue={video?.slug}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            placeholder="genere-automatiquement"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Auteur</span>
          <input
            name="author_name"
            defaultValue={video?.author_name ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          />
        </label>

        <label className="col-span-2 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Description</span>
          <textarea
            name="description"
            defaultValue={video?.description ?? ""}
            rows={3}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">URL miniature</span>
          <input
            name="thumbnail_url"
            defaultValue={video?.thumbnail_url ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">URL vidéo</span>
          <input
            name="video_url"
            defaultValue={video?.video_url ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
            placeholder="https://... (YouTube, Mux, Bunny...)"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Catégorie</span>
          <select
            name="category_id"
            defaultValue={video?.category_id ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            Série (optionnel — regroupe en épisodes, différent de la catégorie)
          </span>
          <select
            name="show_id"
            defaultValue={video?.show_id ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          >
            <option value="">—</option>
            {shows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Durée (secondes)</span>
          <input
            type="number"
            name="duration_seconds"
            defaultValue={video?.duration_seconds ?? ""}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Statut</span>
          <select
            name="status"
            defaultValue={video?.status ?? "draft"}
            className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="scheduled">Programmé</option>
          </select>
        </label>

        <label className="flex items-center gap-2.5 pt-6">
          <input type="checkbox" name="featured" defaultChecked={video?.featured} className="h-4 w-4" />
          <span className="text-[13.5px] text-ink">Mettre en avant (hero / à la une)</span>
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button type="submit" className="rounded-[10px] bg-ink px-5 py-2.5 text-[13.5px] font-bold text-bg">
          {video ? "Enregistrer les modifications" : "Publier la vidéo"}
        </button>
        <a href="/admin/videos" className="rounded-[10px] border border-line px-5 py-2.5 text-[13.5px] font-semibold text-muted">
          Annuler
        </a>
      </div>
    </form>
    {video && (
      <form action={deleteVideo}>
        <input type="hidden" name="id" defaultValue={video.id} />
        <button
          type="submit"
          className="rounded-[10px] border border-accent2/40 px-5 py-2.5 text-[13.5px] font-semibold text-accent2"
        >
          Supprimer cette vidéo
        </button>
      </form>
    )}
    </div>
  );
}
