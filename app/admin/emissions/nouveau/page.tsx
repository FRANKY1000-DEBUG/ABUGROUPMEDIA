import AdminSidebar from "@/components/AdminSidebar";
import ShowForm from "@/components/admin/ShowForm";

export default function NewShowPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Nouvelle émission</h1>
          <p className="mt-0.5 text-[13px] text-muted">Crée une nouvelle émission / série</p>
        </div>
        <div className="max-w-[720px] rounded-2xl border border-line bg-surface p-6">
          <ShowForm />
        </div>
      </div>
    </div>
  );
}
