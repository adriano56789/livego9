export interface JoinFanClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export interface JoinFanClubModalState {
    isLoading: boolean;
    error: string | null;
}
