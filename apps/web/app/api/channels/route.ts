import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ data: [] });
    }

    const { data: connections, error } = await supabase
      .from("channel_connections")
      .select("channel, is_connected, account_name, metadata")
      .eq("organization_id", org.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: connections ?? [] });
  } catch (err) {
    console.error("GET /api/channels error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await req.json();
    const { channel, metadata } = body;

    if (!channel) {
      return NextResponse.json({ error: "channel is required" }, { status: 400 });
    }

    const accountName =
      metadata?.replyToEmail || metadata?.fromName || "Connected Account";

    const { error } = await supabase.from("channel_connections").upsert(
      {
        organization_id: org.id,
        channel,
        is_connected: true,
        account_name: accountName,
        metadata: metadata ?? {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id,channel" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/channels error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await req.json();
    const { channel } = body;

    if (!channel) {
      return NextResponse.json({ error: "channel is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("channel_connections")
      .update({ is_connected: false, updated_at: new Date().toISOString() })
      .eq("organization_id", org.id)
      .eq("channel", channel);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/channels error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
