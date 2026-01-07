export interface MembroClubeFas {
    id: string;
    nome: string;
    avatarUrl: string;
    nivel: number;
    dataEntrada: Date;
    totalDoacoes: number;
    estaOnline: boolean;
}

export interface TelaMembrosClubeFasProps {
    membros: MembroClubeFas[];
    totalMembros: number;
    carregandoMais: boolean;
    onCarregarMais: () => void;
    onMembroSelecionado: (membroId: string) => void;
}

export interface TelaMembrosClubeFasState {
    termoBusca: string;
    ordenacao: 'recente' | 'mais_antigo' | 'maiores_doadores';
    paginaAtual: number;
}
