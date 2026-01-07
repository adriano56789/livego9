export interface TelaExcluirContaProps {
    onConfirmarExclusao: (motivo: string, senha: string) => Promise<boolean>;
    onCancelar: () => void;
}

export interface TelaExcluirContaState {
    senha: string;
    motivo: string;
    confirmacaoTexto: string;
    estaExcluindo: boolean;
    erro: string | null;
    etapa: 'confirmacao' | 'motivo' | 'senha' | 'concluido';
}
