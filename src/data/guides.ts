import { MonetizationChannel } from '../types';

export const MONETIZATION_CHANNELS: MonetizationChannel[] = [
  {
    id: 'youtube',
    name: 'YouTube Partner Program',
    icon: 'Youtube',
    tagline: 'Earn from AdSense, Affiliate referrals, and Brand sponsorship.',
    primaryMetric: 'monthly_views',
    metricLabel: 'Monthly Views',
    metricMin: 5000,
    metricMax: 5000000,
    metricDefault: 100000,
    rpmMin: 1.5,
    rpmMax: 18.0,
    rpmDefault: 4.5,
    secondaryMetrics: [
      {
        id: 'sponsorships',
        name: 'Brand Deals/Month',
        label: 'Average Deal Value ($)',
        min: 0,
        max: 10000,
        default: 500,
      }
    ],
    requirements: [
      '1,000 subscribers with 4,000 valid public watch hours in the last 12 months, OR',
      '1,000 subscribers with 10 million valid public Shorts views in the last 90 days.',
      'Compliance with YouTube channel monetization policies.',
      'Active Google AdSense account linked to your channel.'
    ],
    tips: [
      'Optimize Thumbnails: A high-contrast CTR thumbnail can lift impressions by 200%.',
      'First 30 Seconds: Maximize audience retention by script-hooking the viewer immediately.',
      'End Screen CTA: Guide viewers to watch related playlists to double Session Duration.',
      'Niche Optimization: Finance, Tech, and Real Estate niches draw a 3x higher RPM than comedy or lifestyle.'
    ],
    strategies: [
      {
        title: 'Mid-roll Ad Insertion Mastery',
        description: 'Strategically place natural story pause points in videos 8 minutes or longer to display high-paying mid-roll ads.',
        difficulty: 'Easy',
        timeToFirstDollar: '1 - 3 months',
      },
      {
        title: 'Hybrid Affiliate Cataloging',
        description: 'Build a permanent resources section under descriptions with categorized affiliate Amazon or SaaS links.',
        difficulty: 'Medium',
        timeToFirstDollar: 'Immediate',
      },
      {
        title: 'Direct Client Sponsorships',
        description: 'Construct media kits outlining demographics and approach high-relevance direct sponsors rather than relying purely on YouTube AdSense.',
        difficulty: 'Hard',
        timeToFirstDollar: '2 - 4 months',
      }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Creator Rewards',
    icon: 'Music2',
    tagline: 'Monetize high-engagement short-form videos and LIVE gifts.',
    primaryMetric: 'monthly_views',
    metricLabel: 'Monthly Views',
    metricMin: 10000,
    metricMax: 10000000,
    metricDefault: 250000,
    rpmMin: 0.15,
    rpmMax: 1.8,
    rpmDefault: 0.65,
    secondaryMetrics: [
      {
        id: 'tiktok_shop',
        name: 'Affiliate Sales Generated',
        label: 'Avg Commison per Sale ($)',
        min: 0,
        max: 1000,
        default: 15,
      }
    ],
    requirements: [
      'Must have at least 10,000 authentic followers.',
      'Accumulate at least 100,000 video views in the last 30 days.',
      'Be at least 18 years old and create high-quality, original content longer than 1 minute.',
      'Fully tax-verified profile in eligible jurisdictions.'
    ],
    tips: [
      'Use 60s+ Original Videos: TikTok algorithms actively favor and distribute longer-form detailed videos.',
      'Dynamic Editing: Stave off scroll-away habits by putting a new hook/sound transition every 3 seconds.',
      'Leverage TikTok Shop Direct: Tag high-relevance affiliate products directly within your videos.',
      'Create Series/Playlists: Organically package tutorials into multi-part story sequences.'
    ],
    strategies: [
      {
        title: 'TikTok Affiliate Creator Shop Integration',
        description: 'Review trending, high-commission items from the Seller center and make dedicated video tests demonstrating benefits directly.',
        difficulty: 'Easy',
        timeToFirstDollar: '1 - 2 weeks',
      },
      {
        title: 'TikTok LIVE Monetization Play',
        description: 'Go live 3x a week during specialized hours hosting interactive Q&As, games, or work-with-me panels to extract high Creator Gifts.',
        difficulty: 'Medium',
        timeToFirstDollar: 'Immediate',
      },
      {
        title: 'Original Sound Sponsoring',
        description: 'Partner with independent labels and upcoming sound curators to use customized promo audio clips in viral challenges.',
        difficulty: 'Hard',
        timeToFirstDollar: '1 - 2 months',
      }
    ]
  },
  {
    id: 'google_play',
    name: 'Google Play & App Store',
    icon: 'Play',
    tagline: 'Scale software utility globally via freemium tiers and in-app upgrades.',
    primaryMetric: 'monthly_downloads',
    metricLabel: 'Monthly Active Downloads',
    metricMin: 500,
    metricMax: 200000,
    metricDefault: 5000,
    rpmMin: 50, // Per 1000 downloads, or $0.05 value
    rpmMax: 1200, // Per 1000 downloads
    rpmDefault: 350,
    secondaryMetrics: [
      {
        id: 'in_app_purchases',
        name: 'In-app upgrade purchases',
        label: 'Upgrade Tier Value ($)',
        min: 0,
        max: 200,
        default: 19,
      }
    ],
    requirements: [
      'Google Play Console account ($25 one-time registration fee).',
      'Meet target Android API compliance and safety policies.',
      'Completed IARC ratings questionnaire inside developer site.',
      'Set up a merchant payment profile for payout routing.'
    ],
    tips: [
      'App Store Optimization (ASO): Drive massive daily organic volume via prioritized keywords and sleek local screenshots.',
      'Frictionless Upgrades: Trigger upsells during moments of product success rather than restricting early features completely.',
      'Add AdSense/AdMob: Supplement passive revenue by serving interstitial and banner video units inside standard tiers.',
      'Implement Local Push: Retain users with highly personalized action notifications.'
    ],
    strategies: [
      {
        title: 'AdMob Hybrid Monetization',
        description: 'Incorporate banner ads at the footer of tools, and award users "Ad-Free Passes" if they watch a single 30s rewarded video.',
        difficulty: 'Easy',
        timeToFirstDollar: '1 month',
      },
      {
        title: 'Sleek Freemium Gating',
        description: 'Keep the utility tool free, but gate advanced export formats, batch features, or local data backups under a monthly micro-subscription.',
        difficulty: 'Medium',
        timeToFirstDollar: 'Immediate upon live',
      },
      {
        title: 'B2B white-labeling',
        description: 'Build your app modularly so you can easily white-label the software and license custom versions directly to local corporate clients.',
        difficulty: 'Hard',
        timeToFirstDollar: '3 - 6 months',
      }
    ]
  },
  {
    id: 'music',
    name: 'Music Royalty Services',
    icon: 'Volume2',
    tagline: 'Earn from stream royalties, digital audio syncing, and sound libraries.',
    primaryMetric: 'monthly_streams',
    metricLabel: 'Monthly Streams',
    metricMin: 1000,
    metricMax: 5000000,
    metricDefault: 50000,
    rpmMin: 3.0, // Spotify pays roughly $3.00 to $4.50 per 1,000 streams
    rpmMax: 5.5,
    rpmDefault: 4.0,
    secondaryMetrics: [
      {
        id: 'sync_licensing',
        name: 'Sync Licensing Deals/Year',
        label: 'Average License Payout ($)',
        min: 0,
        max: 5000,
        default: 750,
      }
    ],
    requirements: [
      'Independent distribution partner (e.g. DistroKid, TuneCore, LANDR).',
      '100% original composition or fully cleared third-party sample rights.',
      'Registration with PROs (BMI, ASCAP, PRS) to gather worldwide performance royalties.'
    ],
    tips: [
      'Spotify Playlist pitching: Pitch directly through Spotify for Artists editorial dashboard 4 weeks before release.',
      'Create Lo-Fi/Chill Beats: Minimal vocals and repetitive hooks make excellent background audio, driving very high repetition speeds.',
      'Release Frequently: Release one single every 3-4 weeks rather than a 10-track album once a year.',
      'Publish Stem Kits: Sell audio stem resources to other music producers to compound raw output.'
    ],
    strategies: [
      {
        title: 'Playlist Curator Outreaching',
        description: 'Utilize specialized tools to identify niche curator contact emails and pitch releases to gather organic boost streams.',
        difficulty: 'Easy',
        timeToFirstDollar: '2 - 4 weeks',
      },
      {
        title: 'Sound Design Sync Placement',
        description: 'Register royalty-free instrumentals with music libraries like Artlist, Epidemic Sound, and Pond5 to catch content creator syncs.',
        difficulty: 'Medium',
        timeToFirstDollar: '1 - 3 months',
      },
      {
        title: 'Exclusive Digital Bandcamp Bundles',
        description: 'Direct superfans to digital platforms supporting direct commerce, offering exclusive vinyl pressing pre-orders or limited-edition patches.',
        difficulty: 'Hard',
        timeToFirstDollar: 'Immediate',
      }
    ]
  },
  {
    id: 'film',
    name: 'Independent Film & Video On Demand',
    icon: 'Film',
    tagline: 'License documentary features, short film tutorials, or custom cinematic assets.',
    primaryMetric: 'rentals_sales',
    metricLabel: 'Monthly Rentals / Visual Sales',
    metricMin: 50,
    metricMax: 20000,
    metricDefault: 500,
    rpmMin: 2000, // Roughly $2 - $10 average price, or $2000 per 1000 rentals
    rpmMax: 10000,
    rpmDefault: 4500,
    secondaryMetrics: [
      {
        id: 'asset_pack_sales',
        name: 'Cinematic LUTS / Preset Packs sold',
        label: 'Average pack value ($)',
        min: 0,
        max: 150,
        default: 35,
      }
    ],
    requirements: [
      'Pro HD/4K masters in Apple ProRes or high-quality H264 formats.',
      'Clear release contracts for cast, background audio, and physical locations.',
      'Dedicated seller status on distribution aggregators (Filmhub, Vimeo On Demand, Gumroad).'
    ],
    tips: [
      'Target Niche Audience: Specific enthusiast hobbies, local history, and specialized tutorials are 10x easier to sell than general fiction.',
      'Create an Awesome Trailer: A gripping 60-second preview determines 85% of purchase intents.',
      'Build an Email List First: Leverage trailers on free platforms to harvest interested contacts before launch.',
      'SEO Optimize Title: Title films and videos matching high search intent (e.g. "Practical Lighting Masterclass").'
    ],
    strategies: [
      {
        title: 'Pre-sale crowdfunding campaign',
        description: 'Demonstrate early behind-the-scenes assets or key concepts to run a Kickstarter or Indiegogo to cover early post-production.',
        difficulty: 'Medium',
        timeToFirstDollar: '2 - 5 months',
      },
      {
        title: 'Distribution aggregator syndication',
        description: 'Partner with networks like Filmhub to automatically distribute features directly onto Amazon Prime, Tubi, and Apple TV.',
        difficulty: 'Hard',
        timeToFirstDollar: '3 - 6 months',
      }
    ]
  },
  {
    id: 'blogging',
    name: 'Niche Blogging & SEO Affiliates',
    icon: 'BookOpen',
    tagline: 'Attract search traffic to review catalogs, product tests, and advice columns.',
    primaryMetric: 'monthly_traffic',
    metricLabel: 'Monthly Pageviews',
    metricMin: 1000,
    metricMax: 500000,
    metricDefault: 20000,
    rpmMin: 8, // RPM Ad networks pay (e.g. Mediavine, Raptive, Ezoic)
    rpmMax: 65,
    rpmDefault: 22,
    secondaryMetrics: [
      {
        id: 'affiliate_conversions',
        name: 'Affiliate Referrals Generated',
        label: 'Avg Affiliate Commission ($)',
        min: 0,
        max: 500,
        default: 45,
      }
    ],
    requirements: [
      'Self-hosted platform (e.g. WordPress, Ghost, static Astro sites).',
      'Consistent, high-value visual copy targeting search terms.',
      'Ad network approval minimums (e.g., Google AdSense is instant, Raptive demands 100,000 pageviews).'
    ],
    tips: [
      'Topic Clustering: Build authoritative hubs with interconnected sub-posts to master specific Google search categories.',
      'Format for Skimmers: Utilize bold highlights, bullet points, headers, and quick tables to keep mobile bounce rates extremely low.',
      'Speed Optimization: Fast site speed directly improves Search Rankings. Avoid excessive plugins and compress all media.',
      'High-Intent Keywords: Target informational phrases like "best SaaS CRM under $50" over generic dictionary terms.'
    ],
    strategies: [
      {
        title: 'Affiliate product comparison reviews',
        description: 'Draft extremely thorough, unbiased testing logs of multiple products in your category, leading readers to direct affiliate links.',
        difficulty: 'Easy',
        timeToFirstDollar: '2 - 4 weeks',
      },
      {
        title: 'Premium display ad network setup',
        description: 'Optimize pageviews to cross the threshold for high-paying ad publishers like Mediavine, multiplying RPM 5-fold.',
        difficulty: 'Medium',
        timeToFirstDollar: '3 - 6 months',
      }
    ]
  },
  {
    id: 'freelancing',
    name: 'High-Ticket Freelancing',
    icon: 'Sparkles',
    tagline: 'Trade high-value digital skills directly with international corporate clients.',
    primaryMetric: 'billable_hours',
    metricLabel: 'Billable Hours per Month',
    metricMin: 5,
    metricMax: 160,
    metricDefault: 40,
    rpmMin: 25, // Represents hourly rate ($25/h - $200/h)
    rpmMax: 200,
    rpmDefault: 65,
    secondaryMetrics: [
      {
        id: 'retainers',
        name: 'Standard Client Retainers',
        label: 'Monthly Retainer Value ($)',
        min: 0,
        max: 10000,
        default: 1500,
      }
    ],
    requirements: [
      'Strong, highly visual digital portfolio outlining actual solved client problems.',
      'Active accounts on client hunting systems (Upwork, Fiverr, LinkedIn, Polywork).',
      'Sleek freelancer proposal layout and standard contract templates.'
    ],
    tips: [
      'Stop Charging hourly: Pivot to "Value-Based Pricing" where commissions scale with client growth or conversion gains.',
      'Niche Down: Be "The Shopify checkout optimization expert" instead of "a generic Web Developer".',
      'Follow-up sequence: 80% of contracts are closed between the 3rd and 5th communications. Follow up consistently!',
      'Under-promise, Over-deliver: Complete early sprints hours ahead of schedule to lock down long-term monthly clients.'
    ],
    strategies: [
      {
        title: 'SaaS cold-audit outreach campaign',
        description: 'Create individual 2-minute Loom videos highlighting actual friction points on target company landing pages, then pitch your service.',
        difficulty: 'Medium',
        timeToFirstDollar: '1 - 3 weeks',
      },
      {
        title: 'Monthly strategic advisory retainer',
        description: 'Up-sell project clients into a recurring strategic advisor contract to meet monthly, overseeing implementation guides indefinitely.',
        difficulty: 'Hard',
        timeToFirstDollar: 'Immediate upon delivery',
      }
    ]
  }
];
