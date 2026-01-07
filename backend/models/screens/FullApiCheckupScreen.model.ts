// Modelo para FullApiCheckupScreen

// Tipos de status da API
type ApiStatus = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';

// Interface para um endpoint da API
interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: ApiStatus;
  responseTime: number; // em ms
  lastChecked: string;
  successRate: number; // porcentagem
  errorRate: number;   // porcentagem
  uptime: number;      // porcentagem
  history: {
    timestamp: string;
    status: 'success' | 'error' | 'timeout' | 'offline';
    responseTime: number;
    statusCode?: number;
    error?: string;
  }[];
}

// Interface para um serviço da API
interface ApiService {
  id: string;
  name: string;
  description: string;
  status: ApiStatus;
  endpoints: string[]; // IDs dos endpoints
  uptime: number;     // porcentagem
  lastIncident?: {
    id: string;
    title: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
    impact: 'none' | 'minor' | 'major' | 'critical';
    startedAt: string;
    resolvedAt?: string;
    updates: {
      id: string;
      status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
      message: string;
      timestamp: string;
    }[];
  };
}

// Interface para métricas de desempenho
interface PerformanceMetrics {
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  uptime: number;
  lastUpdated: string;
}

// Interface para estatísticas de uso
interface UsageStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  activeConnections: number;
  dataTransferred: number; // em bytes
  peakUsage: number;
  averageUsage: number;
  lastUpdated: string;
}

// Interface para configurações de monitoramento
interface MonitoringSettings {
  checkInterval: number; // em segundos
  timeout: number;       // em ms
  retryAttempts: number;
  alertThreshold: number; // porcentagem de falhas para alerta
  notifications: {
    email: boolean;
    push: boolean;
    webhook: boolean;
    webhookUrl?: string;
  };
}

// Interface principal do modelo
interface FullApiCheckupScreenModel {
  // Estado de carregamento e erros
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;
  
  // Dados da API
  apiName: string;
  baseUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  
  // Status geral
  overallStatus: ApiStatus;
  statusMessage: string;
  
  // Lista de serviços
  services: Record<string, ApiService>;
  
  // Lista de endpoints
  endpoints: Record<string, ApiEndpoint>;
  
  // Métricas de desempenho
  performance: PerformanceMetrics;
  
  // Estatísticas de uso
  usage: UsageStatistics;
  
  // Configurações de monitoramento
  settings: MonitoringSettings;
  
  // Filtros e estado da UI
  filter: {
    status: ApiStatus | 'all';
    searchQuery: string;
    timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
    showOnlyErrors: boolean;
  };
  
  // Estado da UI
  selectedEndpoint: string | null;
  selectedService: string | null;
  isRefreshing: boolean;
  showSettings: boolean;
  showEndpointDetails: boolean;
}

// Estado inicial
const initialFullApiCheckupScreenState: FullApiCheckupScreenModel = {
  isLoading: true,
  error: null,
  lastUpdated: new Date().toISOString(),
  
  apiName: 'LiveGo API',
  baseUrl: 'https://api.livego.com',
  environment: 'production',
  version: '1.0.0',
  
  overallStatus: 'unknown',
  statusMessage: 'Verificando status...',
  
  services: {},
  endpoints: {},
  
  performance: {
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: 0,
    requestsPerMinute: 0,
    errorRate: 0,
    uptime: 100,
    lastUpdated: new Date().toISOString(),
  },
  
  usage: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    activeConnections: 0,
    dataTransferred: 0,
    peakUsage: 0,
    averageUsage: 0,
    lastUpdated: new Date().toISOString(),
  },
  
  settings: {
    checkInterval: 60,
    timeout: 10000,
    retryAttempts: 3,
    alertThreshold: 5,
    notifications: {
      email: true,
      push: true,
      webhook: false,
    },
  },
  
  filter: {
    status: 'all',
    searchQuery: '',
    timeRange: '1h',
    showOnlyErrors: false,
  },
  
  selectedEndpoint: null,
  selectedService: null,
  isRefreshing: false,
  showSettings: false,
  showEndpointDetails: false,
};

// Ações disponíveis
type FullApiCheckupScreenAction =
  // Ações de carregamento
  | { type: 'LOAD_API_STATUS_REQUEST' }
  | { type: 'LOAD_API_STATUS_SUCCESS'; payload: Omit<FullApiCheckupScreenModel, 'isLoading' | 'error' | 'filter' | 'selectedEndpoint' | 'selectedService' | 'isRefreshing' | 'showSettings' | 'showEndpointDetails'> }
  | { type: 'LOAD_API_STATUS_ERROR'; payload: string }
  
  // Ações de atualização
  | { type: 'REFRESH_API_STATUS' }
  | { type: 'UPDATE_ENDPOINT_STATUS'; payload: { endpointId: string; status: ApiStatus; responseTime: number } }
  | { type: 'UPDATE_SERVICE_STATUS'; payload: { serviceId: string; status: ApiStatus } }
  
  // Ações de filtro
  | { type: 'SET_STATUS_FILTER'; payload: ApiStatus | 'all' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: '1h' | '24h' | '7d' | '30d' | 'all' }
  | { type: 'TOGGLE_SHOW_ONLY_ERRORS' }
  
  // Ações de UI
  | { type: 'SELECT_ENDPOINT'; payload: string | null }
  | { type: 'SELECT_SERVICE'; payload: string | null }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_ENDPOINT_DETAILS' }
  
  // Ações de configuração
  | { type: 'UPDATE_MONITORING_SETTINGS'; payload: Partial<MonitoringSettings> };

// Exportações
export type { 
  ApiStatus,
  ApiEndpoint,
  ApiService,
  PerformanceMetrics,
  UsageStatistics,
  MonitoringSettings,
  FullApiCheckupScreenModel,
  FullApiCheckupScreenAction,
};

export { initialFullApiCheckupScreenState };
