import { User } from '../../types';

export interface ChatConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId?: string;
    currentUser?: User;
    onSettingsUpdate?: (settings: ChatSettings) => void;
}

export interface ChatSettings {
    slowMode: boolean;
    followersOnly: boolean;
    subscribersOnly: boolean;
    emoteOnly: boolean;
    chatDelay: number;
}

export interface ChatConfigModalState {
    isModerator: boolean;
    settings: ChatSettings;
}
