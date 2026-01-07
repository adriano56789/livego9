export interface EstatisticasConexao {
    qualidadeVideo: 'baixa' | 'media' | 'alta' | 'hd';
    latencia: number; // em ms
    pacotesPerdidos: number; // porcentagem
    bitrate: number; // em kbps
    resolucao: {
        largura: number;
        altura: number;
    };
    codec: string;
}

export interface TelaMonitorLiveKitProps {
    salaId: string;
    usuarioId: string;
    onReconectar: () => void;
    onAjustarQualidade: (qualidade: 'baixa' | 'media' | 'alta' | 'hd') => void;
}

export interface TelaMonitorLiveKitState {
    estatisticas: EstatisticasConexao | null;
    estaConectado: boolean;
    erroConexao: string | null;
    mostrandoDetalhesTecnicos: boolean;
}
