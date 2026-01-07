// Modelo para ConnectedAccountsScreen
export interface ConnectedAccount {
  id: string;
  provider: 'google' | 'facebook' | 'apple' | 'twitter' | 'instagram' | 'tiktok';
  displayName: string;
  email: string;
  profileImage?: string;
  isConnected: boolean;
  lastSynced?: string;
}

export interface ConnectedAccountsScreenModel {
  accounts: ConnectedAccount[];
  isLoading: boolean;
  error: string | null;
  isDisconnecting: boolean;
}

export const initialConnectedAccountsScreenState: ConnectedAccountsScreenModel = {
  accounts: [],
  isLoading: false,
  error: null,
  isDisconnecting: false,
};

export type ConnectedAccountsScreenAction = 
  | { type: 'LOAD_ACCOUNTS_REQUEST' }
  | { type: 'LOAD_ACCOUNTS_SUCCESS'; payload: ConnectedAccount[] }
  | { type: 'LOAD_ACCOUNTS_ERROR'; payload: string }
  | { type: 'DISCONNECT_ACCOUNT_REQUEST'; payload: string }
  | { type: 'DISCONNECT_ACCOUNT_SUCCESS'; payload: string }
  | { type: 'DISCONNECT_ACCOUNT_ERROR'; payload: string };
