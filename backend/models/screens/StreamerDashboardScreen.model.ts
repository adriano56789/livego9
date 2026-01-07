import { User, StreamAnalytics, StreamSession } from '../../types';

export interface StreamerDashboardScreenProps {
  streamerId: string;
  onGoLive?: () => void;
  onViewAnalytics?: (sessionId: string) => void;
  onEditProfile?: () => void;
  onViewEarnings?: () => void;
}

export interface StreamerDashboardState {
  isLoading: boolean;
  isLive: boolean;
  currentViewers: number;
  currentStream?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    startTime: Date;
    category: string;
    tags: string[];
  };
  recentSessions: Array<{
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    peakViewers: number;
    totalEarnings: number;
    giftCount: number;
    newFollowers: number;
  }>;
  quickStats: {
    totalEarnings: number;
    totalViewers: number;
    totalStreams: number;
    totalFollowers: number;
    avgViewers: number;
    avgStreamDuration: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'follower' | 'donation' | 'subscription' | 'host' | 'raid';
    user: User;
    amount?: number;
    message?: string;
    timestamp: Date;
  }>;
  topSupporters: Array<{
    user: User;
    totalDonated: number;
    lastDonation: Date;
    totalGifts: number;
  }>;
  scheduledStreams: Array<{
    id: string;
    title: string;
    scheduledTime: Date;
    category: string;
    isNotificationScheduled: boolean;
  }>;
  error?: string;
}

export interface StreamerDashboardActions {
  startStream: (streamData: {
    title: string;
    category: string;
    isPrivate: boolean;
    thumbnail?: File;
    scheduledStart?: Date;
  }) => Promise<void>;
  
  endStream: () => Promise<void>;
  
  updateStreamInfo: (data: {
    title?: string;
    category?: string;
    tags?: string[];
    isPrivate?: boolean;
  }) => Promise<void>;
  
  scheduleStream: (data: {
    title: string;
    scheduledTime: Date;
    category: string;
    isPrivate: boolean;
  }) => Promise<void>;
  
  cancelScheduledStream: (streamId: string) => Promise<void>;
  
  getStreamAnalytics: (sessionId: string) => Promise<StreamAnalytics>;
  
  getStreamHistory: (options: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<StreamSession[]>;
  
  updateStreamSettings: (settings: {
    chatDelay?: number;
    chatSlowMode?: boolean;
    subscriberOnlyChat?: boolean;
    followerOnlyChat?: boolean;
    allowGifts?: boolean;
    minGiftAmount?: number;
    welcomeMessage?: string;
    autoThankDonations?: boolean;
  }) => Promise<void>;
  
  banUser: (userId: string, reason?: string) => Promise<void>;
  
  timeoutUser: (userId: string, duration: number, reason?: string) => Promise<void>;
  
  sendShoutout: (userId: string, message?: string) => Promise<void>;
  
  pinMessage: (messageId: string) => Promise<void>;
  
  sendAnnouncement: (message: string, isPinned?: boolean) => Promise<void>;
  
  getStreamKey: () => Promise<string>;
  
  resetStreamKey: () => Promise<string>;
  
  exportAnalytics: (options: {
    format: 'csv' | 'json' | 'pdf';
    startDate?: Date;
    endDate?: Date;
  }) => Promise<string>; // Returns download URL
}

export interface StreamerDashboardAnalytics {
  viewerDemographics: {
    ageGroups: Array<{
      range: string;
      percentage: number;
    }>;
    gender: {
      male: number;
      female: number;
      other: number;
      preferNotToSay: number;
    };
    countries: Array<{
      code: string;
      name: string;
      viewers: number;
    }>;
    devices: Array<{
      type: 'mobile' | 'desktop' | 'tablet' | 'smart_tv' | 'other';
      percentage: number;
    }>;
  };
  engagementMetrics: {
    averageWatchTime: number;
    averageViewDuration: number;
    chatActivity: number;
    peakConcurrentViewers: number;
    uniqueViewers: number;
    returnViewers: number;
    newViewers: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    revenueBySource: {
      gifts: number;
      subscriptions: number;
      donations: number;
      sponsorships: number;
      ads: number;
      other: number;
    };
    dailyAverage: number;
    monthlyTotal: number;
    growthRate: number;
  };
  contentPerformance: Array<{
    streamId: string;
    title: string;
    date: Date;
    duration: number;
    peakViewers: number;
    averageViewers: number;
    totalViewers: number;
    revenue: number;
    giftsReceived: number;
    newFollowers: number;
    chatMessages: number;
    engagementRate: number;
  }>;
  bestPerformingContent: {
    byViewers: string;
    byEngagement: string;
    byRevenue: string;
    byNewFollowers: string;
  };
  followerGrowth: Array<{
    date: Date;
    followers: number;
    newFollowers: number;
    unfollows: number;
    netGrowth: number;
  }>;
  topClips: Array<{
    id: string;
    title: string;
    url: string;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    createdAt: Date;
  }>;
  viewerRetention: Array<{
    minute: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
    averageWatchTime: number;
  }>;
  chatAnalysis: {
    totalMessages: number;
    uniqueChatters: number;
    averageMessagesPerUser: number;
    mostActiveChatters: Array<{
      user: User;
      messageCount: number;
    }>;
    mostUsedEmotes: Array<{
      emote: string;
      count: number;
    }>;
    sentimentAnalysis: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  subscriptionAnalytics: {
    totalSubscribers: number;
    newSubscribers: number;
    churnRate: number;
    recurringRevenue: number;
    subscriberGrowth: Array<{
      date: Date;
      count: number;
    }>;
    subscriptionTiers: Array<{
      tier: string;
      count: number;
      revenue: number;
    }>;
  };
  giftAnalytics: {
    totalGifts: number;
    totalValue: number;
    averageGiftValue: number;
    mostPopularGift: {
      id: string;
      name: string;
      imageUrl: string;
      count: number;
      totalValue: number;
    };
    topGifters: Array<{
      user: User;
      giftCount: number;
      totalValue: number;
      lastGiftDate: Date;
    }>;
    giftsOverTime: Array<{
      date: Date;
      count: number;
      value: number;
    }>;
  };
  deviceAnalytics: {
    byDeviceType: Array<{
      type: string;
      percentage: number;
      averageWatchTime: number;
    }>;
    byOS: Array<{
      os: string;
      percentage: number;
    }>;
    byBrowser: Array<{
      browser: string;
      percentage: number;
    }>;
  };
  revenueProjections: {
    currentMonth: number;
    nextMonth: number;
    sixMonths: number;
    oneYear: number;
    growthRate: number;
  };
  benchmarkComparison: {
    averageViewers: {
      you: number;
      similarChannels: number;
      difference: number;
    };
    engagementRate: {
      you: number;
      similarChannels: number;
      difference: number;
    };
    subscriberGrowth: {
      you: number;
      similarChannels: number;
      difference: number;
    };
  };
}
