export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  subscription: SubscriptionTier;
  targetMonthlyGoal: number;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface SavedPlan {
  id: string;
  channelId: string;
  title: string;
  monthlyRevenueEst: number;
  parameters: Record<string, number>;
  createdAt: string;
}

export interface MonetizationChannel {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  primaryMetric: string;
  metricLabel: string;
  metricMin: number;
  metricMax: number;
  metricDefault: number;
  rpmMin: number; // Revenue Per Mille (or equivalent unit revenue)
  rpmMax: number;
  rpmDefault: number;
  secondaryMetrics?: {
    id: string;
    name: string;
    label: string;
    min: number;
    max: number;
    default: number;
  }[];
  requirements: string[];
  tips: string[];
  strategies: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeToFirstDollar: string;
  }[];
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}
