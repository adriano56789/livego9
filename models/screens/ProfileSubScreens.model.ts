// Modelo para as Sub-Telas de Perfil
export interface ProfileSubScreensModel {
  status: 'carregando' | 'pronto' | 'atualizando' | 'erro';
  
  // Aba ativa
  abaAtiva: 'publicacoes' | 'videos' | 'fotos' | 'aoVivo' | 'salvos' | 'marcados';
  
  // Conteúdo das abas
  conteudo: {
    // Publicações
    publicacoes: {
      itens: Array<{
        id: string;
        tipo: 'imagem' | 'video' | 'texto';
        conteudo: string;
        curtidas: number;
        comentarios: number;
        compartilhamentos: number;
        dataPublicacao: string;
        usuario: {
          id: string;
          nome: string;
          avatar: string | null;
        };
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
    
    // Vídeos
    videos: {
      itens: Array<{
        id: string;
        titulo: string;
        miniatura: string;
        visualizacoes: number;
        duracao: string;
        dataPublicacao: string;
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
    
    // Fotos
    fotos: {
      itens: Array<{
        id: string;
        url: string;
        largura: number;
        altura: number;
        curtidas: number;
        dataPublicacao: string;
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
    
    // Transmissões ao vivo
    aoVivo: {
      itens: Array<{
        id: string;
        titulo: string;
        miniatura: string;
        visualizadores: number;
        duracao: string;
        dataInicio: string;
        usuario: {
          id: string;
          nome: string;
          avatar: string | null;
        };
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
    
    // Itens salvos
    salvos: {
      itens: Array<{
        id: string;
        tipo: 'publicacao' | 'video' | 'transmissao';
        titulo: string;
        miniatura: string;
        dataSalvo: string;
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
    
    // Itens em que o usuário foi marcado
    marcados: {
      itens: Array<{
        id: string;
        tipo: 'publicacao' | 'video' | 'transmissao' | 'comentario';
        titulo: string;
        miniatura: string;
        dataMarcacao: string;
        marcadoPor: {
          id: string;
          nome: string;
          avatar: string | null;
        };
      }>;
      carregando: boolean;
      paginaAtual: number;
      temMais: boolean;
    };
  };
  
  // Filtros ativos
  filtros: {
    ordenacao: 'recentes' | 'populares';
    periodo: 'todos' | 'estaSemana' | 'esteMes' | 'esteAno';
    tipoMidia: 'todos' | 'imagens' | 'videos' | 'textos';
  };
  
  // Estado de seleção de itens
  selecao: {
    modoAtivo: boolean;
    itensSelecionados: string[];
  };
  
  // Mensagens de erro
  erro: string | null;
}

export const estadoInicialProfileSubScreens: ProfileSubScreensModel = {
  status: 'carregando',
  abaAtiva: 'publicacoes',
  conteudo: {
    publicacoes: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
    videos: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
    fotos: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
    aoVivo: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
    salvos: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
    marcados: {
      itens: [],
      carregando: false,
      paginaAtual: 1,
      temMais: true,
    },
  },
  filtros: {
    ordenacao: 'recentes',
    periodo: 'todos',
    tipoMidia: 'todos',
  },
  selecao: {
    modoAtivo: false,
    itensSelecionados: [],
  },
  erro: null,
};

// Tipos de ações para atualizar o estado
export type ProfileSubScreensAction =
  // Ações de navegação
  | { type: 'MUDAR_ABA'; aba: ProfileSubScreensModel['abaAtiva'] }
  
  // Ações de carregamento
  | { type: 'CARREGAR_ITENS_INICIAIS' }
  | { type: 'CARREGAR_MAIS_ITENS' }
  | { 
      type: 'ITENS_CARREGADOS'; 
      payload: {
        aba: keyof Omit<ProfileSubScreensModel['conteudo'], 'carregando' | 'paginaAtual' | 'temMais'>;
        itens: any[];
        temMais: boolean;
      } 
    }
  
  // Ações de filtro
  | { type: 'ATUALIZAR_FILTRO_ORDENACAO'; valor: ProfileSubScreensModel['filtros']['ordenacao'] }
  | { type: 'ATUALIZAR_FILTRO_PERIODO'; valor: ProfileSubScreensModel['filtros']['periodo'] }
  | { type: 'ATUALIZAR_FILTRO_TIPO_MIDIA'; valor: ProfileSubScreensModel['filtros']['tipoMidia'] }
  
  // Ações de seleção
  | { type: 'ATIVAR_MODO_SELECAO' }
  | { type: 'DESATIVAR_MODO_SELECAO' }
  | { type: 'SELECIONAR_ITEM'; itemId: string }
  | { type: 'DESSELECIONAR_ITEM'; itemId: string }
  | { type: 'SELECIONAR_TODOS' }
  | { type: 'LIMPAR_SELECAO' }
  
  // Ações de estado
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function profileSubScreensReducer(
  estado: ProfileSubScreensModel,
  acao: ProfileSubScreensAction
): ProfileSubScreensModel {
  switch (acao.type) {
    case 'MUDAR_ABA':
      return {
        ...estado,
        abaAtiva: acao.aba,
        selecao: {
          modoAtivo: false,
          itensSelecionados: [],
        },
      };
      
    case 'CARREGAR_ITENS_INICIAIS':
      return {
        ...estado,
        status: 'carregando',
        conteudo: {
          ...estado.conteudo,
          [estado.abaAtiva]: {
            ...estado.conteudo[estado.abaAtiva],
            carregando: true,
            paginaAtual: 1,
          },
        },
      };
      
    case 'CARREGAR_MAIS_ITENS':
      return {
        ...estado,
        conteudo: {
          ...estado.conteudo,
          [estado.abaAtiva]: {
            ...estado.conteudo[estado.abaAtiva],
            carregando: true,
          },
        },
      };
      
    case 'ITENS_CARREGADOS':
      return {
        ...estado,
        status: 'pronto',
        conteudo: {
          ...estado.conteudo,
          [acao.payload.aba]: {
            ...estado.conteudo[acao.payload.aba],
            itens: acao.payload.itens,
            carregando: false,
            temMais: acao.payload.temMais,
            paginaAtual: estado.conteudo[acao.payload.aba].paginaAtual + 1,
          },
        },
      };
      
    case 'ATUALIZAR_FILTRO_ORDENACAO':
      return {
        ...estado,
        filtros: {
          ...estado.filtros,
          ordenacao: acao.valor,
        },
      };
      
    case 'ATUALIZAR_FILTRO_PERIODO':
      return {
        ...estado,
        filtros: {
          ...estado.filtros,
          periodo: acao.valor,
        },
      };
      
    case 'ATUALIZAR_FILTRO_TIPO_MIDIA':
      return {
        ...estado,
        filtros: {
          ...estado.filtros,
          tipoMidia: acao.valor,
        },
      };
      
    case 'ATIVAR_MODO_SELECAO':
      return {
        ...estado,
        selecao: {
          ...estado.selecao,
          modoAtivo: true,
        },
      };
      
    case 'DESATIVAR_MODO_SELECAO':
      return {
        ...estado,
        selecao: {
          modoAtivo: false,
          itensSelecionados: [],
        },
      };
      
    case 'SELECIONAR_ITEM':
      return {
        ...estado,
        selecao: {
          ...estado.selecao,
          itensSelecionados: [...estado.selecao.itensSelecionados, acao.itemId],
        },
      };
      
    case 'DESSELECIONAR_ITEM':
      return {
        ...estado,
        selecao: {
          ...estado.selecao,
          itensSelecionados: estado.selecao.itensSelecionados.filter(id => id !== acao.itemId),
        },
      };
      
    case 'SELECIONAR_TODOS':
      // Lógica para selecionar todos os itens da aba atual
      const itensAtuais = estado.conteudo[estado.abaAtiva].itens.map((item: any) => item.id);
      return {
        ...estado,
        selecao: {
          ...estado.selecao,
          itensSelecionados: [...new Set([...estado.selecao.itensSelecionados, ...itensAtuais])],
        },
      };
      
    case 'LIMPAR_SELECAO':
      return {
        ...estado,
        selecao: {
          ...estado.selecao,
          itensSelecionados: [],
        },
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
