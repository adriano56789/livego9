import { User } from '../../types';

export interface FanClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    streamer: User;
    isMember: boolean;
    currentUser: User;
    onConfirmJoin: () => void;
    onOpenMembers: (streamer: User) => void;
}

export interface FanClubTask {
    id: number;
    title: string;
    desc: string;
    current: number;
    max: number;
}

export interface FanClubBenefit {
    level: number;
    reward: string;
    description: string;
    unlocked: boolean;
}

export type FanClubTab = 'tasks' | 'benefits';

export interface FanClubModalState {
    activeTab: FanClubTab;
    tasks: FanClubTask[];
    levels: number[];
    isLoading: boolean;
}
