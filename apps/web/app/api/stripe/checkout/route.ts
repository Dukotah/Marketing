import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, STRIPE_PRICE_IDS } from "@/lib/stripe";

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
    const { tier, interval = "monthly" } = body as { tier: string; interval?: "monthly" | "yearly" };

    if (!tier) {
      return NextResponse.json({ error: "tier is required" }, { status: 400 });
    }

    const tierKey = tier.toLowerCase() as keyof typeof STRIPE_PRICE_IDS;
    const tierPrices = STRIPE_PRICE_IDS[tierKey];
    if (!tierPrices) {
      return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });
    }

    const priceId = interval === "yearly" ? tierPrices.yearly : tierPrices.monthly;

    const { data: org } = await supabase
      .from("organizations")
      .select("id, stripe_customer_id")
      .eq("owner_id", user.id)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      customerId: org.stripe_customer_id ?? undefined,
      priceId,
      successUrl: `${origin}/settings?tab=billing&success=1`,
      cancelUrl: `${origin}/settings?tab=billing`,
      organizationId: org.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
