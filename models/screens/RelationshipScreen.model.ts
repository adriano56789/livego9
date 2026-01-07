// Modelo para a tela de Relacionamentos
export interface RelationshipScreenModel {
  status: 'carregando' | 'pronto' | 'atualizando' | 'erro';
  
  // Tipo de relacionamento sendo visualizado
  tipoRelacionamento: 'seguidores' | 'seguindo' | 'solicitacoes' | 'bloqueados';
  
  // Lista de usuários baseada no tipo de relacionamento
  usuarios: Array<{
    id: string;
    nome: string;
    nomeUsuario: string;
    avatar: string | null;
    estaSeguindo: boolean;
    segueVoce: boolean;
    dataRelacionamento: string;
    // Apenas para solicitacoes
    solicitacaoPendente?: boolean;
    // Apenas para bloqueados
    dataBloqueio?: string;
  }>;
  
  // Paginação
  paginaAtual: number;
  itensPorPagina: number;
  totalItens: number;
  carregandoMais: boolean;
  
  // Filtros e busca
  filtros: {
    termoBusca: string;
    ordenacao: 'recente' | 'antigo' | 'nome';
  };
  
  // Estado de operações em andamento
  operacoesEmAndamento: {
    [usuarioId: string]: 'seguindo' | 'deixarDeSeguir' | 'aceitar' | 'rejeitar' | 'bloquear' | 'desbloquear' | null;
  };
  
  // Mensagens de erro
  erro: string | null;
}

export const estadoInicialRelationshipScreen: RelationshipScreenModel = {
  status: 'carregando',
  tipoRelacionamento: 'seguidores',
  usuarios: [],
  paginaAtual: 1,
  itensPorPagina: 20,
  totalItens: 0,
  carregandoMais: false,
  filtros: {
    termoBusca: '',
    ordenacao: 'recente',
  },
  operacoesEmAndamento: {},
  erro: null,
};

// Tipos de ações para atualizar o estado
export type RelationshipScreenAction =
  // Ações de carregamento
  | { type: 'CARREGAR_RELACIONAMENTOS'; tipo: RelationshipScreenModel['tipoRelacionamento']; forcarRecarregamento?: boolean }
  | { 
      type: 'RELACIONAMENTOS_CARREGADOS'; 
      payload: {
        usuarios: RelationshipScreenModel['usuarios'];
        totalItens: number;
        paginaAtual: number;
        append: boolean;
      } 
    }
  
  // Ações de navegação
  | { type: 'MUDAR_TIPO_RELACIONAMENTO'; tipo: RelationshipScreenModel['tipoRelacionamento'] }
  
  // Ações de usuário
  | { type: 'SEGUIR_USUARIO'; usuarioId: string }
  | { type: 'DEIXAR_DE_SEGUIR'; usuarioId: string }
  | { type: 'ACEITAR_PEDIDO'; usuarioId: string }
  | { type: 'REJEITAR_PEDIDO'; usuarioId: string }
  | { type: 'BLOQUEAR_USUARIO'; usuarioId: string }
  | { type: 'DESBLOQUEAR_USUARIO'; usuarioId: string }
  | { type: 'REMOVER_SEGUIDOR'; usuarioId: string }
  
  // Ações de filtro e busca
  | { type: 'ATUALIZAR_TERMO_BUSCA'; termo: string }
  | { type: 'ALTERAR_ORDENACAO'; ordenacao: RelationshipScreenModel['filtros']['ordenacao'] }
  
  // Ações de paginação
  | { type: 'CARREGAR_MAIS' }
  
  // Ações de estado
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function relationshipScreenReducer(
  estado: RelationshipScreenModel,
  acao: RelationshipScreenAction
): RelationshipScreenModel {
  switch (acao.type) {
    case 'CARREGAR_RELACIONAMENTOS':
      return {
        ...estado,
        status: 'carregando',
        tipoRelacionamento: acao.tipo,
        paginaAtual: acao.forcarRecarregamento ? 1 : estado.paginaAtual,
        usuarios: acao.forcarRecarregamento ? [] : estado.usuarios,
        erro: null,
      };
      
    case 'RELACIONAMENTOS_CARREGADOS':
      return {
        ...estado,
        status: 'pronto',
        usuarios: acao.payload.append 
          ? [...estado.usuarios, ...acao.payload.usuarios]
          : acao.payload.usuarios,
        totalItens: acao.payload.totalItens,
        paginaAtual: acao.payload.paginaAtual,
        carregandoMais: false,
      };
      
    case 'MUDAR_TIPO_RELACIONAMENTO':
      return {
        ...estadoInicialRelationshipScreen,
        tipoRelacionamento: acao.tipo,
        filtros: {
          ...estadoInicialRelationshipScreen.filtros,
          ordenacao: estado.filtros.ordenacao,
        },
      };
      
    case 'SEGUIR_USUARIO':
    case 'DEIXAR_DE_SEGUIR':
    case 'ACEITAR_PEDIDO':
    case 'REJEITAR_PEDIDO':
    case 'BLOQUEAR_USUARIO':
    case 'DESBLOQUEAR_USUARIO':
    case 'REMOVER_SEGUIDOR':
      return {
        ...estado,
        operacoesEmAndamento: {
          ...estado.operacoesEmAndamento,
          [acao.usuarioId]: acao.type.split('_').join(' ').toLowerCase() as any,
        },
      };
      
    case 'ATUALIZAR_TERMO_BUSCA':
      return {
        ...estado,
        filtros: {
          ...estado.filtros,
          termoBusca: acao.termo,
        },
      };
      
    case 'ALTERAR_ORDENACAO':
      return {
        ...estado,
        filtros: {
          ...estado.filtros,
          ordenacao: acao.ordenacao,
        },
      };
      
    case 'CARREGAR_MAIS':
      return {
        ...estado,
        carregandoMais: true,
      };
      
    case 'DEFINIR_ERRO':
      return {
        ...estado,
        status: 'erro',
        erro: acao.erro,
        carregandoMais: false,
      };
      
    default:
      return estado;
  }
}
