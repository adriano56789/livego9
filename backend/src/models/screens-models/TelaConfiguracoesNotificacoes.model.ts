export interface ConfiguracaoNotificacao {
    id: string;
    tipo: 'mensagens' | 'novos_seguidores' | 'comentarios' | 'curtidas' | 'transmissoes_ao_vivo';
    titulo: string;
    descricao: string;
    notificacaoPush: boolean;
    email: boolean;
    sms: boolean;
    som: boolean;
    vibracao: boolean;
}

export interface TelaConfiguracoesNotificacoesProps {
    configuracoes: ConfiguracaoNotificacao[];
    onSalvarConfiguracoes: (configuracoes: ConfiguracaoNotificacao[]) => Promise<boolean>;
}

export interface TelaConfiguracoesNotificacoesState {
    configuracoesLocais: ConfiguracaoNotificacao[];
    salvando: boolean;
    mensagemSucesso: string | null;
    erro: string | null;
}
