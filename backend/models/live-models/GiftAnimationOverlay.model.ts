import { User, Gift } from '../../types';

export interface GiftPayload {
    id?: number;
    fromUser: User;
    toUser: { id: string; name: string };
    gift: Gift;
    quantity: number;
    roomId: string;
}

export interface GiftAnimationOverlayProps {
    giftPayload: GiftPayload;
    onAnimationEnd: (id: number) => void;
}

export interface GiftAnimationOverlayState {
    isVisible: boolean;
}
