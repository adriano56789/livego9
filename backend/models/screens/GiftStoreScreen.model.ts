import { User } from '../../types';

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  animationUrl?: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
  isLimited: boolean;
  remainingTime?: number; // in seconds, for limited-time gifts
  stock?: number; // for limited-quantity gifts
  effect?: {
    type: 'animation' | 'sticker' | 'badge' | 'effect';
    duration?: number;
    intensity?: number;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  giftCount: number;
}

export interface GiftPurchase {
  giftId: string;
  quantity: number;
  totalPrice: number;
  message?: string;
  isAnonymous: boolean;
  recipientId?: string; // If sending to someone else
}

export interface GiftInventoryItem {
  gift: Gift;
  quantity: number;
  lastUsed?: Date;
}

export interface GiftStoreScreenProps {
  userId: string;
  balance: number;
  onGiftPurchased?: (purchase: GiftPurchase) => void;
  onGiftSent?: (gift: Gift, recipientId?: string) => void;
  onBalanceCheck?: () => Promise<number>;
  onBack?: () => void;
}

export interface GiftStoreScreenState {
  categories: GiftCategory[];
  selectedCategory: string | null;
  gifts: Gift[];
  filteredGifts: Gift[];
  searchQuery: string;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'newest' | 'name';
  selectedGift: Gift | null;
  purchaseQuantity: number;
  giftMessage: string;
  isAnonymous: boolean;
  isPurchasing: boolean;
  isSending: boolean;
  error: string | null;
  userBalance: number;
  recentRecipients: Array<{
    user: User;
    lastGiftDate: Date;
    giftCount: number;
  }>;
  selectedRecipient: User | null;
  showRecipientSelector: boolean;
  inventory: GiftInventoryItem[];
  activeTab: 'store' | 'inventory' | 'sent' | 'received';
}

export interface GiftStoreScreenActions {
  selectCategory: (categoryId: string | null) => void;
  searchGifts: (query: string) => void;
  sortGifts: (sortBy: 'popular' | 'price-low' | 'price-high' | 'newest' | 'name') => void;
  selectGift: (gift: Gift | null) => void;
  updatePurchaseQuantity: (quantity: number) => void;
  updateGiftMessage: (message: string) => void;
  toggleAnonymous: () => void;
  purchaseGift: () => Promise<boolean>;
  sendGift: (gift: Gift, recipientId?: string, message?: string, isAnonymous?: boolean) => Promise<boolean>;
  selectRecipient: (user: User | null) => void;
  toggleRecipientSelector: () => void;
  changeTab: (tab: 'store' | 'inventory' | 'sent' | 'received') => void;
  refreshBalance: () => Promise<void>;
  filterByPrice: (min: number, max: number) => void;
  filterByTag: (tag: string) => void;
  previewGift: (gift: Gift) => void;
  addToFavorites: (giftId: string) => void;
  removeFromFavorites: (giftId: string) => void;
  shareGift: (gift: Gift) => void;
  reportGift: (giftId: string, reason: string) => Promise<boolean>;
}

export interface GiftAnalytics {
  totalGiftsSent: number;
  totalGiftsReceived: number;
  totalSpent: number;
  favoriteGift: {
    gift: Gift;
    sentCount: number;
  } | null;
  topRecipients: Array<{
    user: User;
    giftCount: number;
    lastGiftDate: Date;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
    giftCount: number;
  }>;
  giftCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: 'sent' | 'received';
    gift: Gift;
    fromUser?: User;
    toUser?: User;
    date: Date;
    message?: string;
  }>;
}
