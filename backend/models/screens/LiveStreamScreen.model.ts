import { User } from '../../types';

export interface LiveStreamScreenProps {
  streamId: string;
  userId: string;
  isStreamer: boolean;
  onClose: () => void;
  onGiftSent?: (giftId: string, amount: number) => void;
  onFollow?: (userId: string) => void;
  onShare?: () => void;
}

export interface LiveStreamState {
  isLive: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isChatOpen: boolean;
  isGiftPanelOpen: boolean;
  isModerator: boolean;
  viewersCount: number;
  likesCount: number;
  currentGift?: {
    id: string;
    name: string;
    icon: string;
    amount: number;
    fromUser: User;
  };
  streamQuality: 'auto' | 'low' | 'medium' | 'high';
  error?: string;
  isBuffering: boolean;
  isRecording: boolean;
  isPinnedMessageVisible: boolean;
  pinnedMessage?: {
    id: string;
    text: string;
    user: User;
    timestamp: Date;
  };
}

export interface LiveStreamControls {
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleChat: () => void;
  toggleGiftPanel: () => void;
  sendMessage: (message: string) => void;
  sendGift: (giftId: string, amount: number) => void;
  reportStream: (reason: string) => void;
  shareStream: () => void;
  toggleFullscreen: () => void;
  endStream: () => void;
  toggleRecording: () => void;
  pinMessage: (messageId: string) => void;
  removePinnedMessage: () => void;
  banUser: (userId: string) => void;
  timeoutUser: (userId: string, minutes: number) => void;
  setStreamQuality: (quality: 'auto' | 'low' | 'medium' | 'high') => void;
}

export interface LiveStreamAnalytics {
  totalViewers: number;
  maxViewers: number;
  averageWatchTime: number;
  totalGifts: number;
  giftRevenue: number;
  newFollowers: number;
  shares: number;
  peakViewerCount: number;
  startTime: Date;
  endTime?: Date;
  streamDuration: number;
  bufferingEvents: number;
  totalBufferingTime: number;
  chatMessages: number;
  uniqueChatters: number;
  topGifters: Array<{
    user: User;
    totalGifts: number;
    totalValue: number;
  }>;
  topChatters: Array<{
    user: User;
    messageCount: number;
  }>;
  errorRate: number;
  streamHealth: 'good' | 'fair' | 'poor';
}
