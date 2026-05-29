// ─── Enums ───────────────────────────────────────────────────────────────────

export enum MarketingChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  SOCIAL_FACEBOOK = "SOCIAL_FACEBOOK",
  SOCIAL_INSTAGRAM = "SOCIAL_INSTAGRAM",
  GOOGLE_ADS = "GOOGLE_ADS",
  SEO = "SEO",
  LOCAL_LISTINGS = "LOCAL_LISTINGS",
}

export enum CampaignStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum SubscriptionTier {
  FREE = "FREE",
  STARTER = "STARTER",
  GROWTH = "GROWTH",
  PRO = "PRO",
}

export enum AIMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

// ─── User & Organization ──────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  organization_id: string | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  owner_id: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_current_period_end: string | null;
  ai_prompts_used_this_month: number;
  created_at: string;
  updated_at: string;
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export type CampaignChannel = MarketingChannel;

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number; // click-through rate
  roas: number; // return on ad spend
}

export interface CampaignSchedule {
  start_date: string;
  end_date: string | null;
  timezone: string;
  send_times?: string[]; // ISO time strings for scheduled sends
}

export interface CampaignContent {
  subject?: string; // email subject
  headline?: string;
  body: string;
  cta_text?: string;
  cta_url?: string;
  image_urls?: string[];
  ad_copy_variations?: string[];
  keywords?: string[]; // SEO / Google Ads
}

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  channels: CampaignChannel[];
  target_audience: string | null;
  goals: string | null;
  budget: number | null;
  schedule: CampaignSchedule | null;
  content: CampaignContent | null;
  metrics: CampaignMetrics | null;
  ai_conversation_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  channels: CampaignChannel[];
  target_audience?: string;
  goals?: string;
  budget?: number;
  schedule?: CampaignSchedule;
  content?: CampaignContent;
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  status?: CampaignStatus;
}

// ─── AI / Conversations ───────────────────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface AIConversation {
  id: string;
  organization_id: string;
  user_id: string;
  title: string | null;
  messages: AIMessage[];
  campaign_id: string | null; // linked campaign if building one
  created_at: string;
  updated_at: string;
}

// ─── Subscription / Billing ───────────────────────────────────────────────────

export interface SubscriptionLimits {
  max_campaigns: number | null; // null = unlimited
  max_ai_prompts_per_month: number;
  available_channels: MarketingChannel[];
  white_label: boolean;
  priority_support: boolean;
  custom_domains: boolean;
  team_members: number | null; // null = unlimited
}

export type SubscriptionLimitsMap = Record<SubscriptionTier, SubscriptionLimits>;

// ─── Channel Connections ──────────────────────────────────────────────────────

export interface ChannelConnection {
  id: string;
  organization_id: string;
  channel: MarketingChannel;
  connected: boolean;
  account_name: string | null;
  account_id: string | null;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsDataPoint {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

export interface AnalyticsSummary {
  organization_id: string;
  period_start: string;
  period_end: string;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  total_revenue: number;
  avg_ctr: number;
  avg_roas: number;
  by_channel: Record<MarketingChannel, CampaignMetrics>;
  daily_data: AnalyticsDataPoint[];
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// ─── Webhooks ─────────────────────────────────────────────────────────────────

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}
