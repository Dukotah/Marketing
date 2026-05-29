-- Launchpad Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations (one per user for now, multi-member later)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  industry text,
  website text,
  logo_url text,
  subscription_tier text not null default 'FREE' check (subscription_tier in ('FREE','STARTER','GROWTH','PRO')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  ai_prompts_used_this_month integer not null default 0,
  prompts_reset_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campaigns
create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  description text,
  status text not null default 'DRAFT' check (status in ('DRAFT','ACTIVE','PAUSED','COMPLETED','ARCHIVED')),
  channels text[] not null default '{}',
  target_audience text,
  goals text,
  budget numeric(10,2),
  start_date date,
  end_date date,
  content jsonb,
  metrics jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI Conversations
create table ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  campaign_id uuid references campaigns(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI Messages
create table ai_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references ai_conversations(id) on delete cascade not null,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Channel Connections (OAuth tokens for connected platforms)
create table channel_connections (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  channel text not null check (channel in ('EMAIL','SMS','SOCIAL_FACEBOOK','SOCIAL_INSTAGRAM','GOOGLE_ADS','SEO','LOCAL_LISTINGS')),
  is_connected boolean not null default false,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  account_name text,
  account_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, channel)
);

-- Row Level Security
alter table organizations enable row level security;
alter table campaigns enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table channel_connections enable row level security;

-- RLS Policies: users can only see their own org's data
create policy "Users own their organization" on organizations
  for all using (owner_id = auth.uid());

create policy "Users access their campaigns" on campaigns
  for all using (
    organization_id in (select id from organizations where owner_id = auth.uid())
  );

create policy "Users access their conversations" on ai_conversations
  for all using (
    organization_id in (select id from organizations where owner_id = auth.uid())
  );

create policy "Users access their messages" on ai_messages
  for all using (
    conversation_id in (
      select id from ai_conversations where organization_id in (
        select id from organizations where owner_id = auth.uid()
      )
    )
  );

create policy "Users access their channel connections" on channel_connections
  for all using (
    organization_id in (select id from organizations where owner_id = auth.uid())
  );

-- Auto-create organization when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into organizations (owner_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'My Business')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Reset AI prompt counts monthly (call this via a Supabase cron job or Edge Function)
create or replace function reset_monthly_prompts()
returns void as $$
begin
  update organizations
  set ai_prompts_used_this_month = 0,
      prompts_reset_at = now()
  where prompts_reset_at < date_trunc('month', now());
end;
$$ language plpgsql security definer;

-- Channel Waitlist
create table if not exists channel_waitlist (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  channel text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique(organization_id, channel)
);
alter table channel_waitlist enable row level security;
create policy "Users access their waitlist entries" on channel_waitlist
  for all using (organization_id in (select id from organizations where owner_id = auth.uid()));

-- Notifications
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  body text,
  type text not null default 'info' check (type in ('info','success','warning','error')),
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table notifications enable row level security;
create policy "Users access their notifications" on notifications
  for all using (organization_id in (select id from organizations where owner_id = auth.uid()));
create index on notifications(organization_id, is_read);

-- Indexes
create index on campaigns(organization_id);
create index on ai_conversations(organization_id);
create index on ai_messages(conversation_id);
create index on channel_connections(organization_id);
