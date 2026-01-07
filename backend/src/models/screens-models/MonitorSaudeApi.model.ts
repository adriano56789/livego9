export interface MonitorSaudeApiProps {
    // Adicione as propriedades específicas do Monitor de Saúde da API aqui
    statusServidor: 'online' | 'offline' | 'instavel';
    tempoResposta: number;
    ultimaVerificacao: Date;
    errosRecentes: Array<{
        codigo: number;
        mensagem: string;
        timestamp: Date;
    }>;
}

export interface MonitorSaudeApiState {
    estaCarregando: boolean;
    dadosServidor: any;
    erro: string | null;
}
