import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CampaignStatus } from "@launchpad/shared";

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

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: campaigns, success: true });
  } catch (error) {
    console.error("Campaigns GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const body = await req.json();

    const { data: org } = await supabase
      .from("organizations")
      .select("id, subscription_tier, max_campaigns")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check campaign limits
    const { count } = await supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .neq("status", CampaignStatus.ARCHIVED);

    const tierLimits: Record<string, number | null> = {
      FREE: 1,
      STARTER: 5,
      GROWTH: null,
      PRO: null,
    };

    const limit = tierLimits[org.subscription_tier || "FREE"];
    if (limit !== null && (count || 0) >= limit) {
      return NextResponse.json(
        {
          error: `You've reached the campaign limit for your plan (${limit}). Please upgrade.`,
        },
        { status: 403 }
      );
    }

    const campaign = {
      organization_id: org.id,
      name: body.name,
      description: body.description || null,
      status: CampaignStatus.DRAFT,
      channels: body.channels || [],
      target_audience: body.target_audience || null,
      goals: body.goals || null,
      budget: body.budget || null,
      schedule: body.schedule || null,
      content: body.content || null,
      metrics: null,
      ai_conversation_id: body.ai_conversation_id || null,
      created_by: user.id,
    };

    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert(campaign)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: newCampaign, success: true }, { status: 201 });
  } catch (error) {
    console.error("Campaigns POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Campaign ID required" },
        { status: 400 }
      );
    }

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: campaign, success: true });
  } catch (error) {
    console.error("Campaigns PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
