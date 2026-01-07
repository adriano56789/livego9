import { ToastType } from '../../types';

export interface BeautyEffectsPanelProps {
    onClose: () => void;
    addToast: (type: ToastType, message: string) => void;
}

export interface BeautyEffect {
    id: string;
    name: string;
    icon: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    description?: string;
}

export interface BeautyTab {
    id: string;
    name: string;
    icon: string;
}

export interface BeautyEffectsConfig {
    tabs: BeautyTab[];
    effects: {
        [key: string]: BeautyEffect[];
    };
}

export interface BeautyEffectsPanelState {
    config: BeautyEffectsConfig | null;
    isLoading: boolean;
    isActionLoading: boolean;
    activeTab: string;
    selectedEffect: string | null;
    values: Record<string, number>;
}
