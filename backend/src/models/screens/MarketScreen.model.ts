// Modelo para MarketScreen
export interface MarketScreenModel {
  // Defina aqui as propriedades do modelo
  status: 'loading' | 'success' | 'error';
  lastUpdated: string;
  items: {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl?: string;
    category: string;
    stock: number;
  }[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  // Adicione mais propriedades conforme necessário
}

export const initialMarketScreenState: MarketScreenModel = {
  status: 'loading',
  lastUpdated: new Date().toISOString(),
  items: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  sortBy: 'name-asc',
};

// Exportar um tipo de ação para atualizações de estado
export type MarketScreenAction =
  | { type: 'SET_ITEMS'; payload: MarketScreenModel['items'] }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SELECT_CATEGORY'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: MarketScreenModel['sortBy'] }
  | { type: 'UPDATE_ITEM'; id: string; payload: Partial<MarketScreenModel['items'][0]> };

// Reducer para gerenciar o estado
export function marketScreenReducer(
  state: MarketScreenModel,
  action: MarketScreenAction
): MarketScreenModel {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, status: 'success' };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SELECT_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.id ? { ...item, ...action.payload } : item
        ),
      };
    default:
      return state;
  }
}
