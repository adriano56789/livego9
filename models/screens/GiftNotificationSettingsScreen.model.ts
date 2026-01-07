// Modelo para GiftNotificationScreen
export interface GiftNotificationSettingsScreenModel {
  isEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  ledEnabled: boolean;
  showPreview: boolean;
  customSound: string | null;
  minimumGiftAmount: number;
  notificationStyle: 'default' | 'minimal' | 'detailed';
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  isLoading: boolean;
  error: string | null;
}

export const initialGiftNotificationSettingsScreenState: GiftNotificationSettingsScreenModel = {
  isEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  ledEnabled: true,
  showPreview: true,
  customSound: null,
  minimumGiftAmount: 0,
  notificationStyle: 'detailed',
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  isLoading: false,
  error: null,
};

export type GiftNotificationSettingsScreenAction =
  | { type: 'TOGGLE_NOTIFICATIONS'; payload: boolean }
  | { type: 'TOGGLE_SOUND'; payload: boolean }
  | { type: 'TOGGLE_VIBRATION'; payload: boolean }
  | { type: 'TOGGLE_LED'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW'; payload: boolean }
  | { type: 'SET_CUSTOM_SOUND'; payload: string | null }
  | { type: 'SET_MINIMUM_GIFT_AMOUNT'; payload: number }
  | { type: 'SET_NOTIFICATION_STYLE'; payload: 'default' | 'minimal' | 'detailed' }
  | { 
      type: 'UPDATE_DO_NOT_DISTURB'; 
      payload: Partial<GiftNotificationSettingsScreenModel['doNotDisturb']> 
    }
  | { type: 'SAVE_SETTINGS_REQUEST' }
  | { type: 'SAVE_SETTINGS_SUCCESS' }
  | { type: 'SAVE_SETTINGS_ERROR'; payload: string }
  | { type: 'LOAD_SETTINGS_REQUEST' }
  | { type: 'LOAD_SETTINGS_SUCCESS'; payload: Partial<GiftNotificationSettingsScreenModel> }
  | { type: 'LOAD_SETTINGS_ERROR'; payload: string };
