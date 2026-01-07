import { User } from '../../types';

export interface EntryChatMessageProps {
    user: User;
    currentUser: User;
    onClick: (user: User) => void;
    onFollow: (user: User) => void;
    isFollowed: boolean;
    streamer: StreamerInfo;
}

export interface StreamerInfo {
    id: string;
    name: string;
    avatar: string;
}

export interface EntryChatMessageState {
    isFollowing: boolean;
    isHovered: boolean;
}
