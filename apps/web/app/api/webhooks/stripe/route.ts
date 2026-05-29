import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { SubscriptionTier } from "@launchpad/shared";
import Stripe from "stripe";

export const runtime = "nodejs";

const PRICE_TO_TIER: Record<string, SubscriptionTier> = {
  [process.env.STRIPE_PRICE_STARTER_MONTHLY || "price_starter_monthly"]:
    SubscriptionTier.STARTER,
  [process.env.STRIPE_PRICE_STARTER_YEARLY || "price_starter_yearly"]:
    SubscriptionTier.STARTER,
  [process.env.STRIPE_PRICE_GROWTH_MONTHLY || "price_growth_monthly"]:
    SubscriptionTier.GROWTH,
  [process.env.STRIPE_PRICE_GROWTH_YEARLY || "price_growth_yearly"]:
    SubscriptionTier.GROWTH,
  [process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly"]:
    SubscriptionTier.PRO,
  [process.env.STRIPE_PRICE_PRO_YEARLY || "price_pro_yearly"]:
    SubscriptionTier.PRO,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession;
        const organizationId = session.metadata?.organizationId;

        if (!organizationId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const priceId = subscription.items.data[0]?.price.id;
        const tier = PRICE_TO_TIER[priceId] || SubscriptionTier.FREE;

        await supabase
          .from("organizations")
          .update({
            subscription_tier: tier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("id", organizationId);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;

        if (!organizationId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const tier = PRICE_TO_TIER[priceId] || SubscriptionTier.FREE;

        await supabase
          .from("organizations")
          .update({
            subscription_tier: tier,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("id", organizationId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;

        if (!organizationId) break;

        await supabase
          .from("organizations")
          .update({
            subscription_tier: SubscriptionTier.FREE,
            stripe_subscription_id: null,
            subscription_current_period_end: null,
          })
          .eq("id", organizationId);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          `Payment failed for customer ${invoice.customer}. Invoice: ${invoice.id}`
        );
        // Could send email notification here via Resend
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
