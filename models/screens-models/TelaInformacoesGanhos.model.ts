export interface InformacoesGanhos {
    saldoAtual: number;
    totalRecebido: number;
    proximoPagamento: {
        data: Date;
        valor: number;
    };
    historico: Array<{
        id: string;
        data: Date;
        valor: number;
        tipo: 'doacao' | 'assinatura' | 'saque' | 'ajuste';
        status: 'pendente' | 'processando' | 'concluido' | 'falha';
    }>;
}

export interface TelaInformacoesGanhosProps {
    dadosGanhos: InformacoesGanhos;
    onSolicitarSaque: (valor: number) => Promise<boolean>;
}

export interface TelaInformacoesGanhosState {
    valorSaque: string;
    estaProcessando: boolean;
    erro: string | null;
    abaAtiva: 'resumo' | 'historico' | 'saque';
}
