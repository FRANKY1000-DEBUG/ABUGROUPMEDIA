"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/adminAuth";

function slugify(value: string) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- Vidéos ----------

export async function saveVideo(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = (formData.get("id") as string) || null;
  const title = (formData.get("title") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const showId = (formData.get("show_id") as string) || null;

  const payload = {
    title,
    slug: slugInput ? slugify(slugInput) : slugify(title),
    description: (formData.get("description") as string) || null,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    video_url: (formData.get("video_url") as string) || null,
    category_id: (formData.get("category_id") as string) || null,
    show_id: showId,
    duration_seconds: formData.get("duration_seconds")
      ? Number(formData.get("duration_seconds"))
      : null,
    status: (formData.get("status") as string) || "draft",
    featured: formData.get("featured") === "on",
    author_name: (formData.get("author_name") as string) || null,
    published_at:
      formData.get("status") === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  let videoId = id;

  if (id) {
    const { error } = await admin.from("videos").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await admin.from("videos").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    videoId = data.id;
  }

  // Synchronise la table `episodes` : c'est elle qui alimente la page
  // publique d'une émission (/emissions/[slug]). Sans cette liaison, une
  // vidéo rattachée à une émission via ce formulaire n'apparaîtrait jamais
  // dans ses épisodes.
  const { data: existingEpisode } = await admin
    .from("episodes")
    .select("*")
    .eq("video_id", videoId)
    .maybeSingle();

  if (showId) {
    if (!existingEpisode || existingEpisode.show_id !== showId) {
      if (existingEpisode) {
        await admin.from("episodes").delete().eq("video_id", videoId);
      }
      const { count } = await admin
        .from("episodes")
        .select("id", { count: "exact", head: true })
        .eq("show_id", showId)
        .eq("season", 1);
      await admin.from("episodes").insert({
        show_id: showId,
        video_id: videoId,
        season: 1,
        episode_number: (count ?? 0) + 1
      });
    }
  } else if (existingEpisode) {
    await admin.from("episodes").delete().eq("video_id", videoId);
  }

  revalidatePath("/admin/videos");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/emissions");
  revalidatePath("/reportages");
  revalidatePath("/podcasts");
  revalidatePath("/interviews");
  revalidatePath("/documentaires");
  revalidatePath("/tendances");
  redirect("/admin/videos");
}

export async function deleteVideo(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await admin.from("videos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/videos");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/emissions");
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const featured = formData.get("featured") === "true";
  const { error } = await admin.from("videos").update({ featured: !featured }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/accueil");
  revalidatePath("/");
}

// ---------- Séries (shows, regroupent des vidéos en épisodes) ----------

export async function saveShow(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = (formData.get("id") as string) || null;
  const name = (formData.get("name") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();

  const payload = {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    description: (formData.get("description") as string) || null,
    cover_url: (formData.get("cover_url") as string) || null,
    logo_url: (formData.get("logo_url") as string) || null,
    host: (formData.get("host") as string) || null
  };

  if (id) {
    const { error } = await admin.from("shows").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("shows").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/series");
  redirect("/admin/series");
}

export async function deleteShow(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await admin.from("shows").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/series");
}

// ---------- Catégories ----------

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const name = (formData.get("name") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const { error } = await admin
    .from("categories")
    .insert({ name, slug: slugInput ? slugify(slugInput) : slugify(name) });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

// ---------- Utilisateurs ----------

export async function deleteUser(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = formData.get("id") as string;

  // Empêche la suppression d'un compte admin depuis ce bouton (prévu pour les
  // comptes visiteurs) : un retrait d'admin doit être un geste volontaire fait
  // directement dans admin_users via le SQL editor, jamais un clic accidentel.
  const { data: targetIsAdmin } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", id)
    .maybeSingle();
  if (targetIsAdmin) {
    throw new Error("Impossible de supprimer un compte administrateur depuis cette page.");
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/utilisateurs");
}

// ---------- Paramètres du site ----------

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const payload = {
    site_name: (formData.get("site_name") as string)?.trim() || "AGM",
    tagline: (formData.get("tagline") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    support_phone: (formData.get("support_phone") as string) || null,
    maintenance_mode: formData.get("maintenance_mode") === "on",
    updated_at: new Date().toISOString()
  };

  const { error } = await admin.from("site_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/parametres");
  revalidatePath("/");
}
