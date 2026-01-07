import { MouseEventHandler } from 'react';

export interface FriendRequestNotificationProps {
    followerName: string;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export interface FriendRequestNotificationState {
    isVisible: boolean;
}
