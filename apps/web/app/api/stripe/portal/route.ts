import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBillingPortalSession } from "@/lib/stripe";

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
      .select("stripe_customer_id")
      .eq("owner_id", user.id)
      .single();

    if (!org?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found. Please upgrade first." },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createBillingPortalSession({
      customerId: org.stripe_customer_id,
      returnUrl: `${origin}/settings?tab=billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
