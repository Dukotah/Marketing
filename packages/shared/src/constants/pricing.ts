import { MarketingChannel, SubscriptionTier, SubscriptionLimitsMap } from "../types/index.js";

export const SUBSCRIPTION_LIMITS: SubscriptionLimitsMap = {
  [SubscriptionTier.FREE]: {
    max_campaigns: 1,
    max_ai_prompts_per_month: 10,
    available_channels: [MarketingChannel.EMAIL],
    white_label: false,
    priority_support: false,
    custom_domains: false,
    team_members: 1,
  },
  [SubscriptionTier.STARTER]: {
    max_campaigns: 5,
    max_ai_prompts_per_month: 100,
    available_channels: [
      MarketingChannel.EMAIL,
      MarketingChannel.SOCIAL_FACEBOOK,
      MarketingChannel.SOCIAL_INSTAGRAM,
    ],
    white_label: false,
    priority_support: false,
    custom_domains: false,
    team_members: 3,
  },
  [SubscriptionTier.GROWTH]: {
    max_campaigns: null, // unlimited
    max_ai_prompts_per_month: 500,
    available_channels: [
      MarketingChannel.EMAIL,
      MarketingChannel.SMS,
      MarketingChannel.SOCIAL_FACEBOOK,
      MarketingChannel.SOCIAL_INSTAGRAM,
      MarketingChannel.GOOGLE_ADS,
      MarketingChannel.SEO,
      MarketingChannel.LOCAL_LISTINGS,
    ],
    white_label: false,
    priority_support: true,
    custom_domains: true,
    team_members: 10,
  },
  [SubscriptionTier.PRO]: {
    max_campaigns: null, // unlimited
    max_ai_prompts_per_month: 99999, // effectively unlimited
    available_channels: [
      MarketingChannel.EMAIL,
      MarketingChannel.SMS,
      MarketingChannel.SOCIAL_FACEBOOK,
      MarketingChannel.SOCIAL_INSTAGRAM,
      MarketingChannel.GOOGLE_ADS,
      MarketingChannel.SEO,
      MarketingChannel.LOCAL_LISTINGS,
    ],
    white_label: true,
    priority_support: true,
    custom_domains: true,
    team_members: null, // unlimited
  },
};

export interface PricingTier {
  tier: SubscriptionTier;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number; // per month when billed yearly
  stripe_price_id_monthly: string;
  stripe_price_id_yearly: string;
  highlighted: boolean;
  badge: string | null;
  features: string[];
  limits: (typeof SUBSCRIPTION_LIMITS)[SubscriptionTier];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: SubscriptionTier.FREE,
    name: "Free",
    description: "Get started with AI-powered marketing",
    price_monthly: 0,
    price_yearly: 0,
    stripe_price_id_monthly: "",
    stripe_price_id_yearly: "",
    highlighted: false,
    badge: null,
    features: [
      "1 active campaign",
      "10 AI prompts per month",
      "Email channel",
      "Basic analytics",
      "Community support",
    ],
    limits: SUBSCRIPTION_LIMITS[SubscriptionTier.FREE],
  },
  {
    tier: SubscriptionTier.STARTER,
    name: "Starter",
    description: "Perfect for growing businesses",
    price_monthly: 49,
    price_yearly: 39,
    stripe_price_id_monthly: "price_starter_monthly",
    stripe_price_id_yearly: "price_starter_yearly",
    highlighted: false,
    badge: null,
    features: [
      "5 active campaigns",
      "100 AI prompts per month",
      "Email + Social channels",
      "Advanced analytics",
      "3 team members",
      "Email support",
    ],
    limits: SUBSCRIPTION_LIMITS[SubscriptionTier.STARTER],
  },
  {
    tier: SubscriptionTier.GROWTH,
    name: "Growth",
    description: "Scale your marketing with AI",
    price_monthly: 149,
    price_yearly: 119,
    stripe_price_id_monthly: "price_growth_monthly",
    stripe_price_id_yearly: "price_growth_yearly",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited campaigns",
      "500 AI prompts per month",
      "All channels (Email, SMS, Social, Google Ads, SEO, Local)",
      "Advanced analytics & reporting",
      "10 team members",
      "Custom domains",
      "Priority support",
    ],
    limits: SUBSCRIPTION_LIMITS[SubscriptionTier.GROWTH],
  },
  {
    tier: SubscriptionTier.PRO,
    name: "Pro",
    description: "The full power of AI marketing",
    price_monthly: 299,
    price_yearly: 239,
    stripe_price_id_monthly: "price_pro_monthly",
    stripe_price_id_yearly: "price_pro_yearly",
    highlighted: false,
    badge: "Best Value",
    features: [
      "Everything in Growth",
      "Unlimited AI prompts",
      "White-label solution",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    limits: SUBSCRIPTION_LIMITS[SubscriptionTier.PRO],
  },
];

export const CHANNEL_LABELS: Record<MarketingChannel, string> = {
  [MarketingChannel.EMAIL]: "Email",
  [MarketingChannel.SMS]: "SMS",
  [MarketingChannel.SOCIAL_FACEBOOK]: "Facebook",
  [MarketingChannel.SOCIAL_INSTAGRAM]: "Instagram",
  [MarketingChannel.GOOGLE_ADS]: "Google Ads",
  [MarketingChannel.SEO]: "SEO",
  [MarketingChannel.LOCAL_LISTINGS]: "Local Listings",
};

export const CHANNEL_ICONS: Record<MarketingChannel, string> = {
  [MarketingChannel.EMAIL]: "mail",
  [MarketingChannel.SMS]: "message-square",
  [MarketingChannel.SOCIAL_FACEBOOK]: "facebook",
  [MarketingChannel.SOCIAL_INSTAGRAM]: "instagram",
  [MarketingChannel.GOOGLE_ADS]: "search",
  [MarketingChannel.SEO]: "trending-up",
  [MarketingChannel.LOCAL_LISTINGS]: "map-pin",
};
