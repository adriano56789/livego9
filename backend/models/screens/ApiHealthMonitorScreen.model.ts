// Modelo para ApiHealthMonitorScreen
export interface ApiHealthMonitorScreenModel {
  // Defina aqui as propriedades do modelo
  status: 'online' | 'offline' | 'degraded';
  lastChecked: string;
  endpoints: {
    name: string;
    url: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastChecked: string;
  }[];
  // Adicione mais propriedades conforme necessário
}

export const initialApiHealthMonitorScreenState: ApiHealthMonitorScreenModel = {
  status: 'online',
  lastChecked: new Date().toISOString(),
  endpoints: [],
};

// Exportar um tipo de ação para atualizações de estado
export type ApiHealthMonitorScreenAction = 
  | { type: 'UPDATE_STATUS'; payload: 'online' | 'offline' | 'degraded' }
  | { type: 'ADD_ENDPOINT'; payload: ApiHealthMonitorScreenModel['endpoints'][0] }
  | { type: 'UPDATE_ENDPOINT'; index: number; payload: Partial<ApiHealthMonitorScreenModel['endpoints'][0]> };

// Reducer para gerenciar o estado
// Adicione a implementação do reducer conforme necessário
