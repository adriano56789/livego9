import { GiftPayload } from './GiftAnimationOverlay.model';

export interface FullScreenGiftAnimationProps {
    payload: GiftPayload | null;
    onEnd: () => void;
}

export type AnimationPhase = 'enter' | 'idle' | 'exit';

export interface FullScreenGiftAnimationState {
    phase: AnimationPhase;
}

export interface GiftAnimationStyle {
    container: React.CSSProperties;
    gift: React.CSSProperties;
    sender: React.CSSProperties;
    message: React.CSSProperties;
}
