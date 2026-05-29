import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendCampaignEmail } from "@/lib/resend";
import { MarketingChannel, CampaignStatus } from "@launchpad/shared";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get org
    const { data: org } = await supabase
      .from("organizations")
      .select("id, subscription_tier, name")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Block free tier
    if (!org.subscription_tier || org.subscription_tier === "FREE") {
      return NextResponse.json(
        {
          error:
            "Email sending is not available on the Free plan. Please upgrade to Starter or above.",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    // Fetch the campaign and verify ownership
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .eq("organization_id", org.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Check EMAIL is in channels
    if (!campaign.channels?.includes(MarketingChannel.EMAIL)) {
      return NextResponse.json(
        { error: "This campaign does not have an EMAIL channel configured." },
        { status: 400 }
      );
    }

    // Fetch active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("email_subscribers")
      .select("email, name")
      .eq("organization_id", org.id)
      .eq("is_active", true);

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found. Add subscribers before sending." },
        { status: 400 }
      );
    }

    const subject =
      campaign.content?.subject || campaign.name;
    const html =
      `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">` +
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

    const toAddresses = subscribers.map((s: { email: string }) => s.email);

    await sendCampaignEmail(toAddresses, subject, html);

    // Update campaign status and record send timestamp
    const existingMetrics = campaign.metrics || {};
    const updatedMetrics = {
      ...existingMetrics,
      last_sent_at: new Date().toISOString(),
      last_sent_count: toAddresses.length,
    };

    await supabase
      .from("campaigns")
      .update({
        status: CampaignStatus.ACTIVE,
        metrics: updatedMetrics,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      sent: toAddresses.length,
      campaignId: id,
    });
  } catch (error) {
    console.error("Campaign send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
