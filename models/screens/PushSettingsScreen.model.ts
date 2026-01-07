// Modelo para a tela de Configurações de Notificações por Push
export interface PushSettingsScreenModel {
  status: 'carregando' | 'pronto' | 'salvando' | 'erro';
  
  // Configurações de notificações
  configuracoes: {
    // Notificações gerais
    ativarNotificacoes: boolean;
    som: boolean;
    vibracao: boolean;
    previewMensagem: boolean;
    
    // Tipos de notificações
    notificacoes: {
      novosSeguidores: boolean;
      solicitacoesSeguidor: boolean;
      aceitouSolicitacao: boolean;
      
      // Interações
      curtidas: boolean;
      comentarios: boolean;
      compartilhamentos: boolean;
      marcacoes: boolean;
      
      // Mensagens
      mensagensDiretas: boolean;
      solicitacoesMensagem: boolean;
      
      // Transmissões ao vivo
      inicioTransmissao: boolean;
      lembreteTransmissao: boolean;
      
      // Atualizações do aplicativo
      atualizacoesApp: boolean;
      noticiasPromocoes: boolean;
      
      // Personalização
      recomendacoesPersonalizadas: boolean;
    };
    
    // Configurações de privacidade
    privacidade: {
      mostrarConteudoNotificacao: boolean;
      mostrarNomeRemetente: boolean;
    };
    
    // Horário de não perturbar
    naoPerturbe: {
      ativado: boolean;
      horarioInicio: string; // Formato HH:MM
      horarioFim: string;    // Formato HH:MM
      ativarFimDeSemana: boolean;
    };
  };
  
  // Estado de permissão do sistema
  permissaoConcedida: boolean | null;
  
  // Última atualização
  ultimaAtualizacao: string | null;
  
  // Mensagens de erro
  erro: string | null;
}

export const estadoInicialPushSettingsScreen: PushSettingsScreenModel = {
  status: 'carregando',
  configuracoes: {
    ativarNotificacoes: true,
    som: true,
    vibracao: true,
    previewMensagem: true,
    notificacoes: {
      novosSeguidores: true,
      solicitacoesSeguidor: true,
      aceitouSolicitacao: true,
      curtidas: true,
      comentarios: true,
      compartilhamentos: true,
      marcacoes: true,
      mensagensDiretas: true,
      solicitacoesMensagem: true,
      inicioTransmissao: true,
      lembreteTransmissao: true,
      atualizacoesApp: true,
      noticiasPromocoes: false,
      recomendacoesPersonalizadas: true,
    },
    privacidade: {
      mostrarConteudoNotificacao: true,
      mostrarNomeRemetente: true,
    },
    naoPerturbe: {
      ativado: false,
      horarioInicio: '22:00',
      horarioFim: '08:00',
      ativarFimDeSemana: true,
    },
  },
  permissaoConcedida: null,
  ultimaAtualizacao: null,
  erro: null,
};

// Tipos de ações para atualizar o estado
export type PushSettingsScreenAction =
  // Ações de carregamento
  | { type: 'CARREGAR_CONFIGURACOES'; payload: PushSettingsScreenModel['configuracoes'] }
  
  // Ações de configuração geral
  | { type: 'ALTERAR_CONFIGURACAO_GERAL'; chave: keyof Omit<PushSettingsScreenModel['configuracoes'], 'notificacoes' | 'privacidade' | 'naoPerturbe'>; valor: boolean }
  
  // Ações de notificações
  | { type: 'ALTERAR_CONFIGURACAO_NOTIFICACAO'; chave: keyof PushSettingsScreenModel['configuracoes']['notificacoes']; valor: boolean }
  | { type: 'ATIVAR_TODAS_NOTIFICACOES' }
  | { type: 'DESATIVAR_TODAS_NOTIFICACOES' }
  
  // Ações de privacidade
  | { type: 'ALTERAR_CONFIGURACAO_PRIVACIDADE'; chave: keyof PushSettingsScreenModel['configuracoes']['privacidade']; valor: boolean }
  
  // Ações de não perturbe
  | { type: 'ALTERAR_NAO_PERTURBE'; chave: keyof PushSettingsScreenModel['configuracoes']['naoPerturbe']; valor: any }
  | { type: 'ALTERAR_HORARIO_NAO_PERTURBE'; inicio: string; fim: string }
  
  // Ações de permissão
  | { type: 'ATUALIZAR_PERMISSAO'; concedida: boolean }
  
  // Ações de estado
  | { type: 'SALVAR_CONFIGURACOES' }
  | { type: 'CONFIGURACOES_SALVAS' }
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function pushSettingsScreenReducer(
  estado: PushSettingsScreenModel,
  acao: PushSettingsScreenAction
): PushSettingsScreenModel {
  switch (acao.type) {
    case 'CARREGAR_CONFIGURACOES':
      return {
        ...estado,
        configuracoes: acao.payload,
        status: 'pronto',
        erro: null,
      };
      
    case 'ALTERAR_CONFIGURACAO_GERAL':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          [acao.chave]: acao.valor,
        },
      };
      
    case 'ALTERAR_CONFIGURACAO_NOTIFICACAO':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          notificacoes: {
            ...estado.configuracoes.notificacoes,
            [acao.chave]: acao.valor,
          },
        },
      };
      
    case 'ATIVAR_TODAS_NOTIFICACOES':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          notificacoes: {
            novosSeguidores: true,
            solicitacoesSeguidor: true,
            aceitouSolicitacao: true,
            curtidas: true,
            comentarios: true,
            compartilhamentos: true,
            marcacoes: true,
            mensagensDiretas: true,
            solicitacoesMensagem: true,
            inicioTransmissao: true,
            lembreteTransmissao: true,
            atualizacoesApp: true,
            noticiasPromocoes: true,
            recomendacoesPersonalizadas: true,
          },
        },
      };
      
    case 'DESATIVAR_TODAS_NOTIFICACOES':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          notificacoes: {
            novosSeguidores: false,
            solicitacoesSeguidor: false,
            aceitouSolicitacao: false,
            curtidas: false,
            comentarios: false,
            compartilhamentos: false,
            marcacoes: false,
            mensagensDiretas: false,
            solicitacoesMensagem: false,
            inicioTransmissao: false,
            lembreteTransmissao: false,
            atualizacoesApp: false,
            noticiasPromocoes: false,
            recomendacoesPersonalizadas: false,
          },
        },
      };
      
    case 'ALTERAR_CONFIGURACAO_PRIVACIDADE':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          privacidade: {
            ...estado.configuracoes.privacidade,
            [acao.chave]: acao.valor,
          },
        },
      };
      
    case 'ALTERAR_NAO_PERTURBE':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          naoPerturbe: {
            ...estado.configuracoes.naoPerturbe,
            [acao.chave]: acao.valor,
          },
        },
      };
      
    case 'ALTERAR_HORARIO_NAO_PERTURBE':
      return {
        ...estado,
        configuracoes: {
          ...estado.configuracoes,
          naoPerturbe: {
            ...estado.configuracoes.naoPerturbe,
            horarioInicio: acao.inicio,
            horarioFim: acao.fim,
          },
        },
      };
      
    case 'ATUALIZAR_PERMISSAO':
      return {
        ...estado,
        permissaoConcedida: acao.concedida,
      };
      
    case 'SALVAR_CONFIGURACOES':
      return {
        ...estado,
        status: 'salvando',
        erro: null,
      };
      
    case 'CONFIGURACOES_SALVAS':
      return {
        ...estado,
        status: 'pronto',
        ultimaAtualizacao: new Date().toISOString(),
      };
      
    case 'DEFINIR_ERRO':
      return {
        ...estado,
        status: 'erro',
        erro: acao.erro,
      };
      
    default:
      return estado;
  }
}
