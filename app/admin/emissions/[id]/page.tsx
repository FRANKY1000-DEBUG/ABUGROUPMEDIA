import { notFound } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import ShowForm from "@/components/admin/ShowForm";
import { createClient } from "@/lib/supabase/server";
import type { Show } from "@/lib/types";

export default async function EditShowPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: show } = await supabase.from("shows").select("*").eq("id", params.id).single();

  if (!show) notFound();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-8">
        <div className="mb-7">
          <h1 className="text-xl font-extrabold">Modifier l&apos;émission</h1>
          <p className="mt-0.5 text-[13px] text-muted">{(show as Show).name}</p>
        </div>
        <div className="max-w-[720px] rounded-2xl border border-line bg-surface p-6">
          <ShowForm show={show as Show} />
        </div>
      </div>
    </div>
  );
}
