import AdminSidebar from "@/components/AdminSidebar";
import BackLink from "@/components/BackLink";
import ShowForm from "@/components/admin/ShowForm";

export default function NewShowPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-4">
          <BackLink href="/admin/series" label="Toutes les séries" />
        </div>
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Nouvelle série</h1>
          <p className="mt-0.5 text-[13px] text-muted">Crée une nouvelle série (regroupe des vidéos en épisodes numérotés)</p>
        </div>
        <div className="max-w-[720px] rounded-2xl border border-line bg-surface p-6">
          <ShowForm />
        </div>
      </div>
    </div>
  );
}
