// Modelo para NotificationSettingsScreen
export interface NotificationSettingsScreenModel {
  status: 'loading' | 'idle' | 'saving' | 'error';
  settings: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    previewMessage: boolean;
    showPreview: boolean;
    // Notificações específicas
    newFollower: boolean;
    newMessage: boolean;
    liveStreamStarted: boolean;
    streamComments: boolean;
    streamLikes: boolean;
    streamGifts: boolean;
    // Horário de não perturbe
    doNotDisturb: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  lastSaved: string | null;
  error: string | null;
}

export const initialNotificationSettingsScreenState: NotificationSettingsScreenModel = {
  status: 'loading',
  settings: {
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    previewMessage: true,
    showPreview: true,
    newFollower: true,
    newMessage: true,
    liveStreamStarted: true,
    streamComments: true,
    streamLikes: true,
    streamGifts: true,
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  },
  lastSaved: null,
  error: null,
};

// Exportar um tipo de ação para atualizações de estado
export type NotificationSettingsScreenAction =
  | { type: 'LOAD_SETTINGS'; payload: NotificationSettingsScreenModel['settings'] }
  | { type: 'TOGGLE_SETTING'; setting: keyof NotificationSettingsScreenModel['settings']; value?: any }
  | { type: 'UPDATE_DO_NOT_DISTURB'; payload: Partial<NotificationSettingsScreenModel['settings']['doNotDisturb']> }
  | { type: 'SAVE_SETTINGS_START' }
  | { type: 'SAVE_SETTINGS_SUCCESS'; timestamp: string }
  | { type: 'SAVE_SETTINGS_ERROR'; error: string };

// Reducer para gerenciar o estado
export function notificationSettingsScreenReducer(
  state: NotificationSettingsScreenModel,
  action: NotificationSettingsScreenAction
): NotificationSettingsScreenModel {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return { ...state, settings: action.payload, status: 'idle' };
      
    case 'TOGGLE_SETTING':
      if (action.value !== undefined) {
        // Atualização direta com valor específico
        return {
          ...state,
          settings: {
            ...state.settings,
            [action.setting]: action.value,
          },
        };
      } else {
        // Alternar valor booleano
        return {
          ...state,
          settings: {
            ...state.settings,
            [action.setting]: !(state.settings[action.setting] as boolean),
          },
        };
      }
      
    case 'UPDATE_DO_NOT_DISTURB':
      return {
        ...state,
        settings: {
          ...state.settings,
          doNotDisturb: {
            ...state.settings.doNotDisturb,
            ...action.payload,
          },
        },
      };
      
    case 'SAVE_SETTINGS_START':
      return { ...state, status: 'saving', error: null };
      
    case 'SAVE_SETTINGS_SUCCESS':
      return { ...state, status: 'idle', lastSaved: action.timestamp };
      
    case 'SAVE_SETTINGS_ERROR':
      return { ...state, status: 'error', error: action.error };
      
    default:
      return state;
  }
}
