export interface TelaVersaoAppProps {
    versaoAtual: string;
    ultimaAtualizacao: Date;
    notasAtualizacao: string[];
    atualizacaoDisponivel: boolean;
    versaoMaisRecente?: string;
}

export interface TelaVersaoAppState {
    baixandoAtualizacao: boolean;
    progressoDownload: number;
    erroAtualizacao: string | null;
}
