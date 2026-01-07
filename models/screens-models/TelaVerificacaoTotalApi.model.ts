export interface StatusEndpoint {
    nome: string;
    url: string;
    status: 'online' | 'offline' | 'instavel';
    tempoResposta: number;
    ultimaVerificacao: Date;
}

export interface TelaVerificacaoTotalApiProps {
    endpoints: StatusEndpoint[];
    onAtualizarStatus: () => Promise<void>;
}

export interface TelaVerificacaoTotalApiState {
    atualizando: boolean;
    ultimaAtualizacao: Date | null;
    filtroStatus: 'todos' | 'online' | 'offline' | 'instavel';
    termoBusca: string;
}
