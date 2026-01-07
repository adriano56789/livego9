import { Gift, User } from '../../types';

export interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onUpdateUser?: (user: User) => void;
    onSendGift: (gift: Gift, quantity: number, targetId?: string) => Promise<User | null> | void;
    onRecharge: () => void;
    gifts?: Gift[];
    receivedGifts?: (Gift & { count: number })[];
    isBroadcaster?: boolean;
    isSendingGift?: boolean;
    onOpenVIPCenter: () => void;
    streamId?: string;
    hostId?: string;
    onlineUsers?: User[];
    hostUser?: User;
}

export interface GiftModalState {
    selectedGift: Gift | null;
    quantity: number;
    showRecipientSelector: boolean;
    selectedRecipient: User | null;
    giftOrder: string[];
    activeTab: 'gifts' | 'received' | 'history';
    searchQuery: string;
    isSending: boolean;
    error: string | null;
}

export interface GiftTabProps {
    gifts: Gift[];
    selectedGift: Gift | null;
    onSelectGift: (gift: Gift) => void;
    userDiamonds: number;
    isVIP: boolean;
    onRecharge: () => void;
    onOpenVIPCenter: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export interface ReceivedGiftsTabProps {
    receivedGifts: (Gift & { count: number })[];
    onSelectGift: (gift: Gift) => void;
}

export interface GiftHistoryTabProps {
    // Adicione as propriedades necessárias para o histórico de presentes
}

export interface GiftRecipientSelectorProps {
    onlineUsers: User[];
    onSelectRecipient: (user: User) => void;
    onClose: () => void;
}
