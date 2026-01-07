// Modelo para DeleteAccountScreen
export interface DeleteAccountScreenModel {
  password: string;
  feedback: string;
  isDeleting: boolean;
  error: string | null;
  showConfirmation: boolean;
  countdown: number;
  canConfirm: boolean;
}

export const initialDeleteAccountScreenState: DeleteAccountScreenModel = {
  password: '',
  feedback: '',
  isDeleting: false,
  error: null,
  showConfirmation: false,
  countdown: 5, // segundos para confirmação
  canConfirm: false,
};

export type DeleteAccountScreenAction =
  | { type: 'UPDATE_PASSWORD'; payload: string }
  | { type: 'UPDATE_FEEDBACK'; payload: string }
  | { type: 'DELETE_ACCOUNT_REQUEST' }
  | { type: 'DELETE_ACCOUNT_SUCCESS' }
  | { type: 'DELETE_ACCOUNT_ERROR'; payload: string }
  | { type: 'SHOW_CONFIRMATION' }
  | { type: 'HIDE_CONFIRMATION' }
  | { type: 'UPDATE_COUNTDOWN' }
  | { type: 'RESET' };
