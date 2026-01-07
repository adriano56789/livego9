import { User } from '../../types';

export interface StreamAnalyticsScreenProps {
  streamId?: string; // If null, shows aggregated analytics
  userId: string;
  isStreamer: boolean;
  timeRange: '24h' | '7d' | '30d' | '90d' | 'all' | 'custom';
  customRange?: { start: Date; end: Date };
  onTimeRangeChange: (range: '24h' | '7d' | '30d' | '90d' | 'all' | 'custom', customRange?: { start: Date; end: Date }) => void;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
  onCompare: (streamIds: string[]) => void;
}

export interface StreamAnalytics {
  streamId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  status: 'live' | 'ended' | 'scheduled' | 'cancelled';
  
  // Viewership Metrics
  peakViewers: number;
  averageViewers: number;
  uniqueViewers: number;
  viewerRetention: Array<{ minute: number; percentage: number }>;
  viewerDemographics: {
    ageGroups: Array<{ range: string; percentage: number }>;
    genders: { [key: string]: number };
    countries: Array<{ code: string; name: string; percentage: number }>;
    devices: Array<{ type: string; percentage: number }>;
  };
  
  // Engagement Metrics
  totalChatMessages: number;
  uniqueChatters: number;
  averageMessagesPerUser: number;
  chatActivity: Array<{ time: Date; messageCount: number }>;
  chatSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  mostActiveChatters: Array<{ user: User; messageCount: number }>;
  mostUsedEmotes: Array<{ emote: string; count: number }>;
  
  // Revenue Metrics
  totalRevenue: number;
  revenueBySource: {
    gifts: number;
    subscriptions: number;
    donations: number;
    sponsorships: number;
    ads: number;
    other: number;
  };
  topDonors: Array<{ user: User; amount: number; giftCount: number }>;
  revenueOverTime: Array<{ time: Date; amount: number }>;
  
  // Technical Metrics
  averageBitrate: number;
  resolution: string;
  bufferingEvents: number;
  averageLatency: number;
  playbackErrors: number;
  
  // Growth Metrics
  newFollowers: number;
  newSubscribers: number;
  shares: number;
  clipsCreated: number;
  
  // Stream Health
  healthScore: number; // 0-100
  issuesDetected: Array<{ type: string; severity: 'low' | 'medium' | 'high'; message: string; time: Date }>;
  
  // Comparison Data
  comparisonToAverage: {
    viewership: number; // percentage difference
    engagement: number;
    revenue: number;
    duration: number;
  };
  
  // Additional Metadata
  tags: string[];
  category: string;
  thumbnailUrl?: string;
  vodUrl?: string;
  
  // Raw Data Access
  rawDataUrl?: string;
  lastUpdated: Date;
}

export interface AggregatedAnalytics {
  totalStreams: number;
  totalDuration: number; // in seconds
  totalViewTime: number; // in seconds (sum of all viewer minutes)
  averageViewers: number;
  peakViewers: number;
  totalRevenue: number;
  totalGifts: number;
  totalChatMessages: number;
  totalNewFollowers: number;
  totalNewSubscribers: number;
  averageStreamDuration: number;
  averageViewerRetention: number;
  
  // Time-based metrics
  streamsByDay: Array<{ date: Date; count: number }>;
  viewersByDay: Array<{ date: Date; average: number; peak: number }>;
  revenueByDay: Array<{ date: Date; amount: number }>;
  
  // Category performance
  performanceByCategory: Array<{
    category: string;
    streamCount: number;
    averageViewers: number;
    totalViewTime: number;
    revenue: number;
  }>;
  
  // Device distribution
  deviceDistribution: Array<{ device: string; percentage: number }>;
  
  // Best performing streams
  topStreams: Array<{
    streamId: string;
    title: string;
    date: Date;
    peakViewers: number;
    averageViewers: number;
    revenue: number;
    duration: number;
  }>;
  
  // Growth metrics
  followerGrowth: Array<{ date: Date; count: number }>;
  subscriberGrowth: Array<{ date: Date; count: number }>;
  
  // Comparison to previous period
  comparison: {
    viewershipChange: number; // percentage
    revenueChange: number;
    engagementChange: number;
    streamCountChange: number;
  };
}

export interface StreamAnalyticsScreenState {
  isLoading: boolean;
  error: string | null;
  analytics: StreamAnalytics | AggregatedAnalytics | null;
  selectedStreams: string[];
  comparisonMode: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: {
    category?: string;
    minDuration?: number;
    minViewers?: number;
    tags?: string[];
  };
  viewMode: 'overview' | 'viewership' | 'engagement' | 'revenue' | 'technical';
  timeGranularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
  exportLoading: boolean;
  exportError: string | null;
}

export interface StreamAnalyticsActions {
  loadAnalytics: () => Promise<void>;
  setDateRange: (start: Date, end: Date) => void;
  setFilters: (filters: {
    category?: string;
    minDuration?: number;
    minViewers?: number;
    tags?: string[];
  }) => void;
  setViewMode: (mode: 'overview' | 'viewership' | 'engagement' | 'revenue' | 'technical') => void;
  setTimeGranularity: (granularity: 'minute' | 'hour' | 'day' | 'week' | 'month') => void;
  toggleStreamSelection: (streamId: string) => void;
  toggleComparisonMode: () => void;
  exportData: (format: 'csv' | 'pdf' | 'json') => Promise<boolean>;
  refresh: () => Promise<void>;
  resetFilters: () => void;
  compareWithPreviousPeriod: () => void;
  getStreamRecommendations: () => Promise<Array<{ id: string; title: string; score: number; reason: string }>>;
  setCustomMetric: (metric: string, value: any) => void;
  createCustomReport: (name: string, metrics: string[]) => Promise<boolean>;
  shareAnalytics: (email: string, message?: string) => Promise<boolean>;
  setAlertThreshold: (metric: string, condition: 'gt' | 'lt' | 'eq', value: number) => Promise<boolean>;
}
