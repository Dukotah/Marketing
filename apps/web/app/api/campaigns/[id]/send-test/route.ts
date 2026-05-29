import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTestEmail } from "@/lib/resend";
import { MarketingChannel } from "@launchpad/shared";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { testEmail } = body;
    if (!testEmail) {
      return NextResponse.json({ error: "testEmail is required" }, { status: 400 });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .eq("organization_id", org.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { data: channelConnection } = await supabase
      .from("channel_connections")
      .select("metadata")
      .eq("organization_id", org.id)
      .eq("channel", MarketingChannel.EMAIL)
      .eq("is_active", true)
      .maybeSingle();

    const fromName: string =
      channelConnection?.metadata?.fromName || org.name || "Launchpad";
    const fromEmail: string =
      channelConnection?.metadata?.fromEmail ||
      process.env.RESEND_FROM_EMAIL ||
      "campaigns@launchpad.app";

    const subject = `[TEST] ${campaign.content?.subject || campaign.name}`;
    const html =
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">` +
      `<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:12px;color:#92400e">This is a test email preview.</div>` +
      (campaign.content?.headline
        ? `<h1 style="font-size:24px">${campaign.content.headline}</h1>`
        : "") +
      `<p style="font-size:16px;line-height:1.6">${(campaign.content?.body || "").replace(/\n/g, "<br/>")}</p>` +
      (campaign.content?.cta_text && campaign.content?.cta_url
        ? `<p><a href="${campaign.content.cta_url}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">${campaign.content.cta_text}</a></p>`
        : "") +
      `<hr style="margin-top:40px;border:none;border-top:1px solid #e5e7eb"/>` +
      `<p style="font-size:12px;color:#9ca3af">Sent by ${org.name} via Launchpad</p>` +
      `</div>`;

    await sendTestEmail(testEmail, subject, html, fromName, fromEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
