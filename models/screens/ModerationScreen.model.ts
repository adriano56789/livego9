import { User } from '../../types';

export interface ModerationAction {
  id: string;
  type: 'ban' | 'timeout' | 'delete' | 'warn' | 'restrict' | 'approve' | 'escalate';
  target: User;
  moderator: User;
  reason: string;
  duration?: number; // in minutes, for timeouts
  timestamp: Date;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  evidence?: {
    type: 'message' | 'image' | 'video' | 'audio' | 'link';
    content: string;
    timestamp: Date;
  }[];
  notes?: string;
  appealable: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

export interface ModerationQueueItem {
  id: string;
  type: 'message' | 'comment' | 'profile' | 'stream' | 'image' | 'video' | 'user_report' | 'automated_flag';
  status: 'pending' | 'reviewed' | 'escalated' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy?: User;
  reportedAt: Date;
  lastReviewed?: {
    by: User;
    at: Date;
    action: string;
  };
  content: {
    text?: string;
    mediaUrl?: string;
    previewUrl?: string;
    streamId?: string;
    userId?: string;
    context?: Record<string, any>;
  };
  reason: string;
  category: 'spam' | 'harassment' | 'hate_speech' | 'nudity' | 'violence' | 'copyright' | 'impersonation' | 'other';
  customReason?: string;
  reporterNote?: string;
  history: Array<{
    action: string;
    by: User;
    at: Date;
    note?: string;
  }>;
  similarReports: number;
  firstReportedAt: Date;
  lastReportedAt: Date;
  autoModFlags: string[];
  confidenceScore: number; // 0-1
  isAppealed: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

export interface ModerationSettings {
  autoMod: {
    enabled: boolean;
    deleteMessageThreshold: number; // 0-1
    timeoutThreshold: number; // 0-1
    banThreshold: number; // 0-1
    filterBannedWords: boolean;
    bannedWords: string[];
    filterLinks: boolean;
    allowedDomains: string[];
    filterEmotes: boolean;
    maxWarnings: number;
    warningExpiry: number; // in hours
  };
  chatModeration: {
    slowMode: boolean;
    slowModeInterval: number; // seconds
    followerOnly: boolean;
    subscriberOnly: boolean;
    emoteOnly: boolean;
    uniqueMessageOnly: boolean;
    maxMessageLength: number;
    blockLinks: boolean;
    blockCaps: boolean;
    maxCapsPercentage: number; // 0-100
  };
  userRestrictions: {
    minAccountAge: number; // in days
    minFollowerCount: number;
    emailVerificationRequired: boolean;
    phoneVerificationRequired: boolean;
    restrictNewUsers: boolean;
    newUserRestrictions: {
      canChat: boolean;
      canGift: boolean;
      canDonate: boolean;
      canSubscribe: boolean;
      duration: number; // in hours
    };
  };
  notificationPreferences: {
    emailOnReport: boolean;
    emailOnAppeal: boolean;
    pushOnCritical: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  teamSettings: {
    assignAutomatically: boolean;
    assignTo: 'round_robin' | 'least_assigned' | 'specific_role';
    specificRole?: string;
    escalationThreshold: number; // number of reports before escalation
    escalationRole?: string;
  };
}

export interface ModerationScreenProps {
  currentUser: User;
  isSuperAdmin: boolean;
  onActionComplete?: (action: ModerationAction) => void;
  onSettingsUpdate?: (settings: ModerationSettings) => void;
  onError?: (error: string) => void;
}

export interface ModerationScreenState {
  activeTab: 'queue' | 'actions' | 'users' | 'reports' | 'settings' | 'appeals';
  queue: {
    items: ModerationQueueItem[];
    loading: boolean;
    error: string | null;
    filters: {
      status: ('pending' | 'reviewed' | 'escalated' | 'dismissed')[];
      type: string[];
      priority: string[];
      category: string[];
      assignedTo: string[];
      dateRange: { start: Date | null; end: Date | null };
    };
    sortBy: 'newest' | 'oldest' | 'priority' | 'reports';
    selectedItems: string[];
    bulkAction: string | null;
    page: number;
    pageSize: number;
    total: number;
  };
  actions: {
    items: ModerationAction[];
    loading: boolean;
    error: string | null;
    filters: {
      type: string[];
      moderator: string[];
      status: string[];
      dateRange: { start: Date | null; end: Date | null };
    };
    sortBy: 'newest' | 'oldest' | 'type';
    selectedAction: string | null;
  };
  settings: {
    data: ModerationSettings;
    loading: boolean;
    saving: boolean;
    error: string | null;
  };
  selectedItem: ModerationQueueItem | null;
  isReviewModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isBanModalOpen: boolean;
  isTimeoutModalOpen: boolean;
  isNoteModalOpen: boolean;
  currentNote: string;
  currentDuration: number;
  currentReason: string;
  currentCategory: string;
  searchQuery: string;
  modLog: Array<{
    id: string;
    action: string;
    moderator: User;
    target: User;
    timestamp: Date;
    details?: string;
  }>;
  stats: {
    pendingItems: number;
    actionsToday: number;
    activeModerators: number;
    avgResponseTime: number; // in minutes
    resolvedToday: number;
    appealRate: number; // percentage
    approvalRate: number; // percentage
  };
  teamMembers: Array<{
    user: User;
    role: 'admin' | 'moderator' | 'junior_moderator' | 'community_manager';
    status: 'active' | 'inactive' | 'suspended' | 'on_leave';
    lastActive: Date;
    actions: {
      total: number;
      last24h: number;
      last7d: number;
      accuracy: number; // 0-100
    };
  }>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface ModerationScreenActions {
  // Queue Actions
  loadQueue: (filters?: any, sortBy?: string, page?: number) => Promise<void>;
  refreshQueue: () => Promise<void>;
  applyFilters: (filters: any) => void;
  clearFilters: () => void;
  sortQueue: (sortBy: string) => void;
  selectItem: (item: ModerationQueueItem) => void;
  selectMultipleItems: (itemIds: string[]) => void;
  clearSelection: () => void;
  
  // Item Actions
  approveItem: (itemId: string, note?: string) => Promise<boolean>;
  removeItem: (itemId: string, reason: string, category: string, notifyUser: boolean, note?: string) => Promise<boolean>;
  escalateItem: (itemId: string, note: string, assignTo?: string) => Promise<boolean>;
  dismissItem: (itemId: string, note?: string) => Promise<boolean>;
  addNote: (itemId: string, note: string, isPrivate: boolean) => Promise<boolean>;
  
  // User Actions
  timeoutUser: (userId: string, duration: number, reason: string, note?: string) => Promise<boolean>;
  banUser: (userId: string, reason: string, duration?: number, note?: string) => Promise<boolean>;
  warnUser: (userId: string, reason: string, note?: string) => Promise<boolean>;
  restrictUser: (userId: string, restrictions: any, reason: string, duration: number, note?: string) => Promise<boolean>;
  
  // Bulk Actions
  applyBulkAction: (action: string, itemIds: string[], reason?: string, duration?: number) => Promise<boolean>;
  
  // Settings
  loadSettings: () => Promise<void>;
  saveSettings: (settings: ModerationSettings) => Promise<boolean>;
  resetSettings: () => Promise<void>;
  
  // Team Management
  addTeamMember: (userId: string, role: string) => Promise<boolean>;
  removeTeamMember: (userId: string) => Promise<boolean>;
  updateTeamMemberRole: (userId: string, role: string) => Promise<boolean>;
  
  // Appeals
  handleAppeal: (appealId: string, action: 'approve' | 'reject', note: string) => Promise<boolean>;
  
  // UI Actions
  openReviewModal: (item: ModerationQueueItem) => void;
  closeReviewModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openBanModal: () => void;
  closeBanModal: () => void;
  openTimeoutModal: () => void;
  closeTimeoutModal: () => void;
  openNoteModal: () => void;
  closeNoteModal: () => void;
  
  // Search
  search: (query: string) => void;
  clearSearch: () => void;
  
  // Navigation
  changeTab: (tab: 'queue' | 'actions' | 'users' | 'reports' | 'settings' | 'appeals') => void;
  
  // Error Handling
  clearError: () => void;
  clearSuccess: () => void;
}
