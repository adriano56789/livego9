// Modelo para MessagesScreen
export interface MessagesScreenModel {
  status: 'loading' | 'idle' | 'error';
  conversations: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
  }[];
  searchQuery: string;
  selectedConversationId: string | null;
  // Adicione mais propriedades conforme necessário
}

export const initialMessagesScreenState: MessagesScreenModel = {
  status: 'loading',
  conversations: [],
  searchQuery: '',
  selectedConversationId: null,
};

// Exportar um tipo de ação para atualizações de estado
export type MessagesScreenAction =
  | { type: 'SET_CONVERSATIONS'; payload: MessagesScreenModel['conversations'] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SELECT_CONVERSATION'; payload: string | null }
  | { type: 'MARK_AS_READ'; conversationId: string }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: string; timestamp: string };

// Reducer para gerenciar o estado
export function messagesScreenReducer(
  state: MessagesScreenModel,
  action: MessagesScreenAction
): MessagesScreenModel {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, status: 'idle' };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_CONVERSATION':
      return { ...state, selectedConversationId: action.payload };
    case 'MARK_AS_READ':
      return {
        ...state,
        conversations: state.conversations.map(conv => 
          conv.id === action.conversationId ? { ...conv, unreadCount: 0 } : conv
        ),
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv => {
          if (conv.id === action.conversationId) {
            return {
              ...conv,
              lastMessage: action.message,
              lastMessageTime: action.timestamp,
              unreadCount: state.selectedConversationId === action.conversationId ? 0 : conv.unreadCount + 1,
            };
          }
          return conv;
        }),
      };
    default:
      return state;
  }
}
