export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: 'seasonal' | 'promotional' | 'nurture' | 'announcement' | 'reengagement';
  channels: string[]; // MarketingChannel values
  estimatedReach: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: {
    subject?: string;
    headline: string;
    body: string;
    cta_text: string;
    keywords?: string[];
  };
  goals: string;
  target_audience: string;
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'summer-sale-blitz',
    name: 'Summer Sale Blitz',
    description: 'Drive revenue with a high-energy seasonal discount campaign across email and social media.',
    category: 'promotional',
    channels: ['EMAIL', 'SOCIAL_FACEBOOK', 'SOCIAL_INSTAGRAM'],
    estimatedReach: '500–2,000 contacts',
    difficulty: 'beginner',
    content: {
      subject: '☀️ Our Biggest Summer Sale Starts NOW — Up to 40% Off',
      headline: 'Hot Deals for a Hot Summer',
      body: `Summer is here, and so are our best prices of the year.\n\nFor a limited time, enjoy up to 40% off sitewide — no code needed. Whether you've been eyeing something for a while or looking for the perfect gift, now is the time to act.\n\nThis sale ends Sunday at midnight, so don't wait. Thousands of customers are shopping right now — your favorites could sell out fast.\n\nShop the full sale below and save big before it's gone.`,
      cta_text: 'Shop the Summer Sale',
      keywords: ['summer sale', 'seasonal discount', 'limited time offer'],
    },
    goals: 'Increase revenue during the summer season, clear seasonal inventory, and acquire new customers through promotional pricing.',
    target_audience: 'Existing customers and warm leads who have engaged with the brand in the past 90 days.',
  },
  {
    id: 'new-customer-welcome',
    name: 'New Customer Welcome',
    description: 'Roll out the red carpet for new customers with a warm, value-packed welcome email series.',
    category: 'nurture',
    channels: ['EMAIL'],
    estimatedReach: 'All new signups',
    difficulty: 'beginner',
    content: {
      subject: 'Welcome to [Business Name] — Here\'s what to expect',
      headline: 'So glad you\'re here.',
      body: `Welcome aboard! You've just made a great decision, and we're excited to have you with us.\n\nHere's what you can look forward to:\n\n✅ Exclusive members-only deals delivered straight to your inbox\n✅ Early access to new products and services before anyone else\n✅ Tips, guides, and resources to get the most out of what we offer\n\nTo get you started, here's 10% off your first order — our little thank-you for joining the family.\n\nIf you ever have questions, our team is always just a reply away. We read every email and usually respond within a few hours.\n\nWelcome again — we can't wait to show you what we've got.`,
      cta_text: 'Claim Your 10% Welcome Discount',
    },
    goals: 'Establish trust with new customers, drive a first purchase, and set expectations for an ongoing relationship.',
    target_audience: 'New subscribers and first-time customers who signed up or purchased in the last 7 days.',
  },
  {
    id: 'grand-opening',
    name: 'Grand Opening',
    description: 'Make a splash with your new business launch across email, social, and local listings.',
    category: 'announcement',
    channels: ['EMAIL', 'SOCIAL_FACEBOOK', 'SOCIAL_INSTAGRAM', 'LOCAL_LISTINGS'],
    estimatedReach: '1,000–5,000 local contacts',
    difficulty: 'intermediate',
    content: {
      subject: 'We\'re officially open — come celebrate with us!',
      headline: 'We\'re Open for Business!',
      body: `After months of hard work, the doors are finally open — and we couldn't be more excited to share this with you.\n\n[Business Name] is now officially open, and we want to celebrate with our community.\n\nJoin us for our Grand Opening event:\n📅 Date: [Event Date]\n📍 Location: [Your Address]\n🎁 Special offers all day long\n\nAs a grand opening special, we're offering [specific discount or offer] to every customer who visits us during opening week. No catch — just our way of saying thank you for your support.\n\nCome by, say hello, and let us show you what we've been building. We promise it'll be worth the trip.\n\nSee you soon!`,
      cta_text: 'Get Directions & Opening Details',
      keywords: ['grand opening', 'new business', 'local business', 'opening event'],
    },
    goals: 'Generate awareness and foot traffic for a new business location, build the local customer base, and establish a presence in local search.',
    target_audience: 'Local community members, people within a 10-mile radius, and anyone who has expressed interest in the business before opening.',
  },
  {
    id: 'holiday-special',
    name: 'Holiday Special',
    description: 'Capture the holiday shopping season with festive promotions and gift-focused messaging.',
    category: 'seasonal',
    channels: ['EMAIL', 'SOCIAL_FACEBOOK', 'SOCIAL_INSTAGRAM'],
    estimatedReach: '500–3,000 contacts',
    difficulty: 'beginner',
    content: {
      subject: '🎁 Holiday deals inside — perfect gifts for everyone on your list',
      headline: 'Give the Gift They Actually Want',
      body: `The holidays are here, and we've put together something special just for you.\n\nThis season, skip the guesswork and shop our curated holiday collection — thoughtful gifts for every budget, ready to delight.\n\n🎄 Holiday Highlights:\n• Free gift wrapping on all orders over $50\n• Free shipping on orders $75+\n• Gift cards available in any amount\n\nOur holiday sale runs through [End Date], but popular items are already flying off the shelves. Don't wait until the last minute.\n\nWe've made it easy to find the perfect gift — browse by price, category, or recipient. From stocking stuffers to statement gifts, we've got your whole list covered.\n\nHappy holidays from all of us at [Business Name].`,
      cta_text: 'Shop Holiday Gifts Now',
      keywords: ['holiday sale', 'christmas gifts', 'holiday shopping', 'gift ideas'],
    },
    goals: 'Maximize revenue during the holiday shopping season, increase average order value through gift bundling, and drive repeat purchases.',
    target_audience: 'Existing customers and holiday shoppers looking for gift ideas, typically aged 25–55.',
  },
  {
    id: 'reengagement-winback',
    name: 'Re-engage Lost Customers',
    description: 'Win back customers who haven\'t purchased in 90+ days with a compelling offer and personal message.',
    category: 'reengagement',
    channels: ['EMAIL', 'SMS'],
    estimatedReach: 'Lapsed customer segment',
    difficulty: 'intermediate',
    content: {
      subject: 'We miss you — here\'s something to bring you back',
      headline: 'It\'s Been a While. We\'d Love to See You Again.',
      body: `We noticed it's been a while since your last visit, and honestly? We miss having you around.\n\nA lot has changed since you were last here — new products, improved service, and a team that's more dedicated than ever to making your experience exceptional.\n\nWe know life gets busy. That's why we want to make it easy to come back.\n\nAs a thank-you for being a past customer, we're offering you an exclusive 20% discount — just for you, just this week.\n\nNo strings attached. Just our way of saying we value your business and would love to earn it back.\n\nIf there was anything that didn't meet your expectations last time, we'd love to hear about it. Hit reply and tell us — we're always listening.\n\nWe hope to see you soon.`,
      cta_text: 'Come Back — Claim 20% Off',
    },
    goals: 'Reactivate lapsed customers, recover lost revenue, and identify why customers churned to improve retention.',
    target_audience: 'Customers who have not made a purchase in 90–365 days and previously purchased at least once.',
  },
  {
    id: 'google-review-drive',
    name: 'Google Review Drive',
    description: 'Boost your local SEO and social proof by encouraging happy customers to leave Google reviews.',
    category: 'announcement',
    channels: ['LOCAL_LISTINGS', 'EMAIL'],
    estimatedReach: 'Recent customers (last 30 days)',
    difficulty: 'beginner',
    content: {
      subject: 'Quick favor — can you share your experience?',
      headline: 'Love What You Got? Let Others Know.',
      body: `We hope your recent experience with [Business Name] was everything you expected and more.\n\nIf you have 60 seconds, we'd be incredibly grateful if you could share your thoughts on Google. Reviews from customers like you help other people in our community find us — and they mean the world to our small team.\n\nLeaving a review is simple:\n1. Click the link below\n2. Give us a star rating\n3. Share a few words about your experience\n\nThat's it. No account needed, no forms to fill out.\n\nIf anything wasn't up to par, please reach out to us directly before leaving a review — we want the chance to make it right. Just reply to this email.\n\nThank you so much for your support. It genuinely makes a difference.`,
      cta_text: 'Leave Us a Google Review',
      keywords: ['google reviews', 'local business', 'customer reviews', 'reputation management'],
    },
    goals: 'Increase Google Business Profile rating and review count to improve local search rankings and build social proof.',
    target_audience: 'Customers who have made a recent purchase or visit in the last 7–30 days and are likely to have had a positive experience.',
  },
  {
    id: 'flash-sale-24h',
    name: 'Flash Sale 24H',
    description: 'Create urgency and drive immediate purchases with a time-limited 24-hour sale blasted across all channels.',
    category: 'promotional',
    channels: ['SMS', 'EMAIL', 'SOCIAL_FACEBOOK', 'SOCIAL_INSTAGRAM'],
    estimatedReach: '200–1,500 contacts',
    difficulty: 'intermediate',
    content: {
      subject: '⚡ FLASH SALE — 30% Off Everything. 24 Hours Only.',
      headline: '24 Hours. 30% Off. No Exceptions.',
      body: `This is not a drill.\n\nStarting RIGHT NOW, everything in our store is 30% off — for exactly 24 hours.\n\n⏰ Sale ends: [End Time] tomorrow\n🔥 Discount: 30% off sitewide\n🚫 No code needed — discount applied at checkout\n\nWe're clearing out inventory and passing the savings directly to you. Once the clock hits zero, prices go back to normal. There are no extensions, no second chances.\n\nTop picks going fast:\n• [Product/Service 1]\n• [Product/Service 2]\n• [Product/Service 3]\n\nDon't overthink it. If you've been waiting for the right moment — this is it.\n\nShop now before it's gone.`,
      cta_text: 'Shop Flash Sale — Ends in 24H',
      keywords: ['flash sale', '24 hour sale', 'limited time', 'clearance'],
    },
    goals: 'Generate a spike in sales revenue within a 24-hour window, create urgency to drive immediate action, and move inventory quickly.',
    target_audience: 'All active customers and subscribers who have engaged with the brand in the past 6 months.',
  },
  {
    id: 'monthly-newsletter',
    name: 'Monthly Newsletter',
    description: 'Stay top-of-mind with a polished monthly update covering news, tips, and exclusive offers.',
    category: 'nurture',
    channels: ['EMAIL'],
    estimatedReach: 'Full subscriber list',
    difficulty: 'beginner',
    content: {
      subject: '[Month] Update from [Business Name] — What\'s new this month',
      headline: 'Your Monthly Update Is Here',
      body: `Happy [Month]!\n\nHere's your monthly roundup of what's been happening at [Business Name] — plus a few things we think you'll find genuinely useful.\n\n📌 What's New\n[2-3 sentences about new products, services, or updates]\n\n💡 Tip of the Month\n[One practical tip related to your industry that helps your customers]\n\n🎉 Customer Spotlight\n[Brief mention of a customer success story or testimonial — with permission]\n\n📅 Upcoming\n[Any events, promotions, or important dates in the next 30 days]\n\n🎁 Members-Only Offer\nAs a thank-you for being a subscriber, here's [discount/perk] valid through [date]. Use code [CODE] at checkout.\n\nAs always, thank you for being part of our community. If you have questions, ideas, or just want to say hi — hit reply. We'd love to hear from you.\n\nUntil next month,\nThe [Business Name] Team`,
      cta_text: 'See What\'s New This Month',
    },
    goals: 'Maintain customer relationships, drive repeat visits and purchases, and position the brand as a trusted resource in the customer\'s inbox.',
    target_audience: 'Full email subscriber list — all customers and leads who have opted in to communications.',
  },
];
