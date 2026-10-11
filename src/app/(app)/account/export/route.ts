import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Export RGPD des données du compte (F-06), au format JSON.
 * Lecture avec la session de l'utilisateur : les RLS limitent l'export à ses propres données.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const [profile, pro, host, documents, bookings, reviews, messages] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("pro_profiles").select("*").eq("profile_id", user.id).maybeSingle(),
    supabase.from("host_profiles").select("*").eq("profile_id", user.id).maybeSingle(),
    supabase.from("documents").select("type, status, expires_at, created_at, reviewed_at").eq("owner_id", user.id),
    supabase.from("bookings").select("*").or(`pro_id.eq.${user.id},host_id.eq.${user.id}`),
    supabase.from("reviews").select("*").eq("author_id", user.id),
    supabase.from("messages").select("conversation_id, body, created_at").eq("sender_id", user.id),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email, phone: user.phone, created_at: user.created_at },
    profile: profile.data,
    pro_profile: pro.data,
    host_profile: host.data,
    documents: documents.data,
    bookings: bookings.data,
    reviews: reviews.data,
    messages: messages.data,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="fauteo-mes-donnees-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
