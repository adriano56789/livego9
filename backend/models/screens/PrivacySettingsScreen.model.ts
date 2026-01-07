// Modelo para PrivacySettingsScreen
export interface PrivacySettingsScreenModel {
  status: 'loading' | 'idle' | 'saving' | 'error';
  settings: {
    // Conta
    accountPrivacy: 'public' | 'private' | 'friends';
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    showActivityStatus: boolean;
    
    // Interações
    allowMessagesFrom: 'everyone' | 'friends' | 'nobody';
    allowComments: 'everyone' | 'friends' | 'nobody';
    allowTags: 'everyone' | 'friends' | 'nobody';
    
    // Dados pessoais
    showEmail: boolean;
    showPhoneNumber: boolean;
    showBirthday: boolean;
    
    // Bloqueio de usuários
    blockedUsers: Array<{
      id: string;
      name: string;
      avatar?: string;
      blockedAt: string;
    }>;
    
    // Histórico de atividades
    saveSearchHistory: boolean;
    clearSearchHistory: boolean;
    
    // Localização
    shareLocation: 'precise' | 'approximate' | 'never';
    
    // Sincronização de contatos
    syncContacts: boolean;
    
    // Compartilhamento de dados
    dataSharing: {
      analytics: boolean;
      personalizedAds: boolean;
      thirdPartySharing: boolean;
    };
  };
  lastSaved: string | null;
  error: string | null;
}

export const initialPrivacySettingsScreenState: PrivacySettingsScreenModel = {
  status: 'loading',
  settings: {
    accountPrivacy: 'public',
    showOnlineStatus: true,
    showLastSeen: true,
    showActivityStatus: true,
    allowMessagesFrom: 'everyone',
    allowComments: 'everyone',
    allowTags: 'everyone',
    showEmail: false,
    showPhoneNumber: false,
    showBirthday: false,
    blockedUsers: [],
    saveSearchHistory: true,
    clearSearchHistory: false,
    shareLocation: 'approximate',
    syncContacts: false,
    dataSharing: {
      analytics: true,
      personalizedAds: true,
      thirdPartySharing: false,
    },
  },
  lastSaved: null,
  error: null,
};

// Exportar um tipo de ação para atualizações de estado
export type PrivacySettingsScreenAction =
  | { type: 'LOAD_SETTINGS'; payload: PrivacySettingsScreenModel['settings'] }
  | { type: 'UPDATE_SETTING'; setting: keyof PrivacySettingsScreenModel['settings']; value: any }
  | { type: 'UPDATE_DATA_SHARING'; setting: keyof PrivacySettingsScreenModel['settings']['dataSharing']; value: boolean }
  | { type: 'BLOCK_USER'; userId: string; userName: string; avatar?: string }
  | { type: 'UNBLOCK_USER'; userId: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'SAVE_SETTINGS_START' }
  | { type: 'SAVE_SETTINGS_SUCCESS'; timestamp: string }
  | { type: 'SAVE_SETTINGS_ERROR'; error: string };

// Reducer para gerenciar o estado
export function privacySettingsScreenReducer(
  state: PrivacySettingsScreenModel,
  action: PrivacySettingsScreenAction
): PrivacySettingsScreenModel {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return { ...state, settings: action.payload, status: 'idle' };
      
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.setting]: action.value,
        },
      };
      
    case 'UPDATE_DATA_SHARING':
      return {
        ...state,
        settings: {
          ...state.settings,
          dataSharing: {
            ...state.settings.dataSharing,
            [action.setting]: action.value,
          },
        },
      };
      
    case 'BLOCK_USER':
      // Verifica se o usuário já está bloqueado
      if (state.settings.blockedUsers.some(user => user.id === action.userId)) {
        return state;
      }
      return {
        ...state,
        settings: {
          ...state.settings,
          blockedUsers: [
            ...state.settings.blockedUsers,
            {
              id: action.userId,
              name: action.userName,
              avatar: action.avatar,
              blockedAt: new Date().toISOString(),
            },
          ],
        },
      };
      
    case 'UNBLOCK_USER':
      return {
        ...state,
        settings: {
          ...state.settings,
          blockedUsers: state.settings.blockedUsers.filter(user => user.id !== action.userId),
        },
      };
      
    case 'CLEAR_SEARCH_HISTORY':
      // Aqui você pode adicionar lógica adicional para limpar o histórico de buscas
      return {
        ...state,
        settings: {
          ...state.settings,
          clearSearchHistory: false, // Reseta o flag após a limpeza
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
