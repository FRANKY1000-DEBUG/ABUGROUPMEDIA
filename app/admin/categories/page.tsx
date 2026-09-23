import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import type { Category } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Catégories</h1>
          <p className="mt-0.5 text-[13px] text-muted">{categories.length} catégorie(s)</p>
        </div>

        <form action={saveCategory} className="mb-6 flex max-w-[520px] items-end gap-3 rounded-2xl border border-line bg-surface p-5">
          <label className="flex-1 block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Nom de la catégorie</span>
            <input
              required
              name="name"
              className="w-full rounded-[11px] border border-line bg-surface-2 px-3.5 py-3 text-sm text-ink outline-none"
              placeholder="ex. Culture"
            />
          </label>
          <button type="submit" className="rounded-[10px] bg-ink px-5 py-3 text-[13.5px] font-bold text-bg">
            Ajouter
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-[18px] py-3.5">Nom</th>
                <th className="px-[18px] py-3.5">Slug</th>
                <th className="px-[18px] py-3.5" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-line text-[13.5px] last:border-none">
                  <td className="px-[18px] py-3.5">{cat.name}</td>
                  <td className="px-[18px] py-3.5 text-muted">{cat.slug}</td>
                  <td className="px-[18px] py-3.5">
                    <form action={deleteCategory} className="flex justify-end">
                      <input type="hidden" name="id" defaultValue={cat.id} />
                      <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent2/40 text-accent2">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-[18px] py-6 text-center text-sm text-muted">
                    Aucune catégorie pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
