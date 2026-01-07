export interface ConfiguracaoNotificacaoPresente {
    id: string;
    tipo: 'novo_presente' | 'presente_especial' | 'meta_atingida' | 'novo_nivel';
    ativo: boolean;
    som: boolean;
    vibracao: boolean;
    notificacaoPush: boolean;
}

export interface TelaConfiguracoesNotificacoesPresentesProps {
    configuracoes: ConfiguracaoNotificacaoPresente[];
    onSalvarConfiguracoes: (configuracoes: ConfiguracaoNotificacaoPresente[]) => Promise<boolean>;
}

export interface TelaConfiguracoesNotificacoesPresentesState {
    configuracoesLocais: ConfiguracaoNotificacaoPresente[];
    salvando: boolean;
    mensagemSucesso: string | null;
    erro: string | null;
}
