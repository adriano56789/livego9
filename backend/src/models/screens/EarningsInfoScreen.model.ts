// Modelo para EarningsInfoScreen
type EarningType = 'stream' | 'gift' | 'subscription' | 'withdrawal' | 'bonus' | 'other';

interface EarningItem {
  id: string;
  type: EarningType;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  source?: string;
  transactionId?: string;
}

export interface EarningsInfoScreenModel {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  lastUpdated: string;
  earningsHistory: EarningItem[];
  isLoading: boolean;
  error: string | null;
  selectedTimeRange: '7days' | '30days' | '90days' | 'all';
  selectedEarningType: EarningType | 'all';
}

export const initialEarningsInfoScreenState: EarningsInfoScreenModel = {
  totalEarnings: 0,
  availableBalance: 0,
  pendingBalance: 0,
  lastUpdated: new Date().toISOString(),
  earningsHistory: [],
  isLoading: false,
  error: null,
  selectedTimeRange: '30days',
  selectedEarningType: 'all',
};

export type EarningsInfoScreenAction =
  | { type: 'LOAD_EARNINGS_REQUEST' }
  | { type: 'LOAD_EARNINGS_SUCCESS'; payload: Omit<EarningsInfoScreenModel, 'isLoading' | 'error' | 'selectedTimeRange' | 'selectedEarningType'> }
  | { type: 'LOAD_EARNINGS_ERROR'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: EarningsInfoScreenModel['selectedTimeRange'] }
  | { type: 'SET_EARNING_TYPE'; payload: EarningsInfoScreenModel['selectedEarningType'] }
  | { type: 'WITHDRAW_REQUEST' }
  | { type: 'WITHDRAW_SUCCESS' }
  | { type: 'WITHDRAW_ERROR'; payload: string };
