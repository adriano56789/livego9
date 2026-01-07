export interface Conversa {
    id: string;
    participantes: Array<{
        id: string;
        nome: string;
        avatarUrl: string;
        estaOnline: boolean;
    }>;
    ultimaMensagem: {
        texto: string;
        data: Date;
        enviadaPor: string;
        lida: boolean;
    };
    naoLidas: number;
}

export interface TelaMensagensProps {
    conversas: Conversa[];
    carregando: boolean;
    onSelecionarConversa: (conversaId: string) => void;
    onNovaConversa: () => void;
}

export interface TelaMensagensState {
    termoBusca: string;
    filtro: 'todas' | 'nao_lidas' | 'favoritas';
    conversasFiltradas: Conversa[];
}
