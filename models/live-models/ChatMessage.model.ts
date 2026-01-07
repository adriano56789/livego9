import { ReactNode } from 'react';

export interface ChatMessageProps {
    userObject: ChatUser;
    message: string | ReactNode;
    translatedText?: string;
    onAvatarClick: () => void;
    streamerId: string;
    timestamp?: number;
}

export interface ChatUser {
    id: string;
    name: string;
    avatarUrl?: string;
    level: number;
    isModerator?: boolean;
    isSubscriber?: boolean;
    isStreamer?: boolean;
    role?: 'user' | 'moderator' | 'admin' | 'streamer';
    color?: string;
}

export interface ChatMessageState {
    showTranslation: boolean;
    isHovered: boolean;
}
