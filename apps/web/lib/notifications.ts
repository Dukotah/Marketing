import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  orgId: string,
  title: string,
  body: string | null,
  type: "info" | "success" | "warning" | "error" = "info",
  link?: string
) {
  const { error } = await supabase.from("notifications").insert({
    organization_id: orgId,
    title,
    body: body ?? null,
    type,
    link: link ?? null,
  });

  if (error) {
    console.error("createNotification error:", error);
  }
}
