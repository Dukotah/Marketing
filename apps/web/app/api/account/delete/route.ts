import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceClient = await createServiceClient();
    const { error } = await serviceClient.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Account delete error:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
