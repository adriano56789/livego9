import { User, PurchaseRecord, ToastType } from '../../types';

/**
 * Tipos de transações disponíveis na carteira administrativa
 */
export type TransactionType = 'all' | 'fee' | 'withdrawal' | 'deposit' | 'refund' | 'adjustment';

/**
 * Status de uma transação
 */
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'processing' | 'cancelled';

/**
 * Interface para os dados de estatísticas da carteira
 */
export interface WalletStats {
  /** Saldo disponível para saque */
  available: number;
  /** Total de taxas recebidas */
  totalFees: number;
  /** Total de saques realizados */
  totalWithdrawn: number;
  /** Total de depósitos */
  totalDeposits?: number;
  /** Total de reembolsos */
  totalRefunds?: number;
  /** Saldo total (disponível + bloqueado) */
  totalBalance?: number;
  /** Saldo bloqueado (em disputa, em análise, etc) */
  lockedBalance?: number;
  /** Previsão de liberação (em análise) */
  pendingBalance?: number;
  /** Próxima data de liberação */
  nextPayoutDate?: Date;
  /** Moeda (BRL, USD, etc) */
  currency?: string;
}

/**
 * Filtros para a listagem de transações
 */
export interface TransactionFilters {
  /** Tipo de transação */
  type?: TransactionType;
  /** Status da transação */
  status?: TransactionStatus;
  /** Data de início para o filtro */
  startDate?: Date | null;
  /** Data de término para o filtro */
  endDate?: Date | null;
  /** Termo de busca */
  searchQuery?: string;
  /** Ordenação (campo e direção) */
  sortBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  /** Número da página */
  page?: number;
  /** Itens por página */
  pageSize?: number;
}

/**
 * Dados de paginação
 */
export interface PaginationData {
  /** Página atual */
  currentPage: number;
  /** Total de itens por página */
  pageSize: number;
  /** Total de itens */
  totalItems: number;
  /** Total de páginas */
  totalPages: number;
}

/**
 * Resultado da busca de transações com paginação
 */
export interface TransactionResult {
  /** Lista de transações */
  items: PurchaseRecord[];
  /** Dados de paginação */
  pagination: PaginationData;
  /** Estatísticas totais */
  stats: {
    total: number;
    totalAmount: number;
    countByType: Record<string, number>;
    amountByType: Record<string, number>;
  };
}

/**
 * Dados para solicitação de saque
 */
export interface WithdrawalRequest {
  /** Valor do saque */
  amount: number;
  /** Método de saque (pix, bank_transfer, etc) */
  method: string;
  /** Detalhes do método de saque */
  details: {
    /** Chave PIX, e-mail ou conta bancária */
    key: string;
    /** Nome do titular */
    name: string;
    /** CPF/CNPJ do titular */
    taxId?: string;
    /** Banco (para transferência) */
    bank?: string;
    /** Agência (para transferência) */
    agency?: string;
    /** Conta (para transferência) */
    account?: string;
    /** Tipo de conta (conta_corrente, conta_poupanca) */
    accountType?: string;
  };
  /** Notas internas */
  notes?: string;
}

/**
 * Estado da tela de carteira administrativa
 */
export interface AdminWalletState {
  /** Dados do usuário */
  user: User;
  /** Estatísticas da carteira */
  stats: WalletStats;
  /** Histórico de transações */
  history: PurchaseRecord[];
  /** Filtros ativos */
  filters: TransactionFilters;
  /** Dados de paginação */
  pagination: PaginationData;
  /** Carregando dados */
  loading: boolean;
  /** Erro, se houver */
  error: string | null;
  /** Mensagem de sucesso */
  successMessage: string | null;
  /** Modal aberto */
  activeModal: 'withdraw' | 'editMethod' | 'transactionDetails' | null;
  /** Transação selecionada */
  selectedTransaction: PurchaseRecord | null;
  /** Dados do formulário de saque */
  withdrawalData: Partial<WithdrawalRequest>;
  /** Validando saque */
  validatingWithdrawal: boolean;
  /** Processando saque */
  processingWithdrawal: boolean;
  /** E-mail para saque */
  withdrawalEmail: string;
  /** Editando e-mail */
  isEditingEmail: boolean;
}

/**
 * Ações disponíveis na tela de carteira administrativa
 */
export interface AdminWalletActions {
  /** Carrega os dados iniciais */
  loadData: () => Promise<void>;
  /** Atualiza os filtros */
  setFilters: (filters: Partial<TransactionFilters>) => void;
  /** Altera a página */
  changePage: (page: number) => void;
  /** Altera a ordenação */
  sortBy: (field: string) => void;
  /** Abre o modal de saque */
  openWithdrawModal: () => void;
  /** Fecha o modal ativo */
  closeModal: () => void;
  /** Atualiza os dados do formulário de saque */
  updateWithdrawalData: (data: Partial<WithdrawalRequest>) => void;
  /** Valida os dados do saque */
  validateWithdrawal: () => Promise<boolean>;
  /** Processa o saque */
  processWithdrawal: () => Promise<boolean>;
  /** Edita o e-mail de saque */
  editWithdrawalEmail: (email: string) => Promise<boolean>;
  /** Abre o modal de edição de e-mail */
  openEditEmailModal: () => void;
  /** Fecha o modal de edição de e-mail */
  closeEditEmailModal: () => void;
  /** Exporta o histórico para CSV */
  exportToCsv: () => void;
  /** Exporta o histórico para PDF */
  exportToPdf: () => void;
  /** Atualiza uma transação */
  updateTransaction: (id: string, updates: Partial<PurchaseRecord>) => Promise<boolean>;
  /** Cancela uma transação */
  cancelTransaction: (id: string) => Promise<boolean>;
  /** Reenvia notificação de transação */
  resendNotification: (id: string) => Promise<boolean>;
  /** Atualiza o status de leitura de notificações */
  markAsRead: (ids: string[]) => Promise<boolean>;
  /** Busca transações */
  searchTransactions: (query: string) => void;
  /** Limpa os filtros */
  clearFilters: () => void;
}

/**
 * Props do componente AdminWalletScreen
 */
export interface AdminWalletScreenProps {
  /** Função chamada ao fechar a tela */
  onClose: () => void;
  /** Dados do usuário */
  user: User;
  /** Função para exibir notificações */
  addToast?: (type: ToastType, message: string) => void;
  /** Estatísticas iniciais (opcional) */
  initialStats?: Partial<WalletStats>;
  /** Histórico inicial (opcional) */
  initialHistory?: PurchaseRecord[];
  /** Filtros iniciais (opcional) */
  initialFilters?: Partial<TransactionFilters>;
  /** Paginação inicial (opcional) */
  initialPagination?: Partial<PaginationData>;
}
