// Modelo para a tela de Configurações de Transmissão ao Vivo Privada
export interface PrivateLiveSettingsScreenModel {
  status: 'carregando' | 'pronto' | 'salvando' | 'erro';
  
  // Configurações básicas da transmissão
  configuracao: {
    titulo: string;
    descricao: string;
    categoria: string;
    privacidade: 'publico' | 'seguidores' | 'privado';
    
    // Configurações de qualidade
    qualidadeVideo: 'baixa' | 'media' | 'alta' | 'hd';
    taxaQuadros: 30 | 60;
    resolucao: {
      largura: number;
      altura: number;
    };
    
    // Configurações de áudio
    microfoneAtivado: boolean;
    volumeMicrofone: number;
    cancelamentoRuido: boolean;
    
    // Configurações de interação
    chatAtivado: boolean;
    comentariosAtivados: boolean;
    presentesAtivados: boolean;
    
    // Configurações de moderação
    moderadores: string[]; // IDs dos usuários que são moderadores
    palavrasProibidas: string[];
    
    // Configurações de monetização
    doacoesAtivadas: boolean;
    valorMinimoDoacao: number;
    mensagensPagasAtivadas: boolean;
    
    // Configurações de notificação
    notificarSeguidores: boolean;
    
    // Configurações avançadas
    salvarGravacao: boolean;
    mostrarEstatisticas: boolean;
    
    // Configurações de localização
    compartilharLocalizacao: boolean;
    localizacaoAtual: {
      latitude: number | null;
      longitude: number | null;
      endereco: string | null;
    };
  };
  
  // Categorias disponíveis para seleção
  categoriasDisponiveis: Array<{
    id: string;
    nome: string;
    icone: string;
  }>;
  
  // Estado da prévia
  previsaoQualidade: {
    qualidade: 'otima' | 'boa' | 'ruim';
    mensagem: string;
  };
  
  // Estado de validação
  validacao: {
    tituloValido: boolean;
    categoriaValida: boolean;
    qualidadeSuficiente: boolean;
  };
  
  // Estado de salvamento
  ultimoSalvamento: string | null;
  alteracoesNaoSalvas: boolean;
  
  // Erros
  erro: string | null;
}

export const estadoInicialPrivateLiveSettingsScreen: PrivateLiveSettingsScreenModel = {
  status: 'carregando',
  configuracao: {
    titulo: '',
    descricao: '',
    categoria: '',
    privacidade: 'publico',
    qualidadeVideo: 'alta',
    taxaQuadros: 30,
    resolucao: {
      largura: 1280,
      altura: 720,
    },
    microfoneAtivado: true,
    volumeMicrofone: 80,
    cancelamentoRuido: true,
    chatAtivado: true,
    comentariosAtivados: true,
    presentesAtivados: true,
    moderadores: [],
    palavrasProibidas: [],
    doacoesAtivadas: true,
    valorMinimoDoacao: 5,
    mensagensPagasAtivadas: false,
    notificarSeguidores: true,
    salvarGravacao: false,
    mostrarEstatisticas: true,
    compartilharLocalizacao: false,
    localizacaoAtual: {
      latitude: null,
      longitude: null,
      endereco: null,
    },
  },
  categoriasDisponiveis: [],
  previsaoQualidade: {
    qualidade: 'boa',
    mensagem: 'Sua conexão está boa para transmissão',
  },
  validacao: {
    tituloValido: false,
    categoriaValida: false,
    qualidadeSuficiente: true,
  },
  ultimoSalvamento: null,
  alteracoesNaoSalvas: false,
  erro: null,
};

// Tipos de ações para atualizar o estado
export type PrivateLiveSettingsScreenAction =
  | { type: 'CARREGAR_CONFIGURACOES'; payload: Partial<PrivateLiveSettingsScreenModel['configuracao']> }
  | { type: 'ATUALIZAR_CAMPO'; campo: keyof PrivateLiveSettingsScreenModel['configuracao']; valor: any }
  | { type: 'ATUALIZAR_RESOLUCAO'; largura: number; altura: number }
  | { type: 'ATUALIZAR_LOCALIZACAO'; latitude: number; longitude: number; endereco: string }
  | { type: 'ADICIONAR_MODERADOR'; usuarioId: string }
  | { type: 'REMOVER_MODERADOR'; usuarioId: string }
  | { type: 'ADICIONAR_PALAVRA_PROIBIDA'; palavra: string }
  | { type: 'REMOVER_PALAVRA_PROIBIDA'; palavra: string }
  | { type: 'CARREGAR_CATEGORIAS'; categorias: PrivateLiveSettingsScreenModel['categoriasDisponiveis'] }
  | { type: 'ATUALIZAR_PREVISAO_QUALIDADE'; previsao: PrivateLiveSettingsScreenModel['previsaoQualidade'] }
  | { type: 'VALIDAR_FORMULARIO' }
  | { type: 'SALVAR_CONFIGURACOES' }
  | { type: 'SALVAMENTO_SUCESSO' }
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function privateLiveSettingsScreenReducer(
  estado: PrivateLiveSettingsScreenModel,
  acao: PrivateLiveSettingsScreenAction
): PrivateLiveSettingsScreenModel {
  switch (acao.type) {
    case 'CARREGAR_CONFIGURACOES':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          ...acao.payload,
        },
        status: 'pronto',
        alteracoesNaoSalvas: false,
      };
      
    case 'ATUALIZAR_CAMPO':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          [acao.campo]: acao.valor,
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'ATUALIZAR_RESOLUCAO':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          resolucao: {
            largura: acao.largura,
            altura: acao.altura,
          },
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'ATUALIZAR_LOCALIZACAO':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          localizacaoAtual: {
            latitude: acao.latitude,
            longitude: acao.longitude,
            endereco: acao.endereco,
          },
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'ADICIONAR_MODERADOR':
      if (estado.configuracao.moderadores.includes(acao.usuarioId)) {
        return estado;
      }
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          moderadores: [...estado.configuracao.moderadores, acao.usuarioId],
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'REMOVER_MODERADOR':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          moderadores: estado.configuracao.moderadores.filter(id => id !== acao.usuarioId),
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'ADICIONAR_PALAVRA_PROIBIDA':
      if (estado.configuracao.palavrasProibidas.includes(acao.palavra.toLowerCase())) {
        return estado;
      }
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          palavrasProibidas: [...estado.configuracao.palavrasProibidas, acao.palavra.toLowerCase()],
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'REMOVER_PALAVRA_PROIBIDA':
      return {
        ...estado,
        configuracao: {
          ...estado.configuracao,
          palavrasProibidas: estado.configuracao.palavrasProibidas.filter(
            palavra => palavra !== acao.palavra.toLowerCase()
          ),
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'CARREGAR_CATEGORIAS':
      return {
        ...estado,
        categoriasDisponiveis: acao.categorias,
      };
      
    case 'ATUALIZAR_PREVISAO_QUALIDADE':
      return {
        ...estado,
        previsaoQualidade: acao.previsao,
      };
      
    case 'VALIDAR_FORMULARIO':
      return {
        ...estado,
        validacao: {
          tituloValido: estado.configuracao.titulo.trim().length >= 5,
          categoriaValida: estado.configuracao.categoria.trim().length > 0,
          qualidadeSuficiente: estado.previsaoQualidade.qualidade !== 'ruim',
        },
      };
      
    case 'SALVAR_CONFIGURACOES':
      return {
        ...estado,
        status: 'salvando',
        erro: null,
      };
      
    case 'SALVAMENTO_SUCESSO':
      return {
        ...estado,
        status: 'pronto',
        alteracoesNaoSalvas: false,
        ultimoSalvamento: new Date().toISOString(),
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
