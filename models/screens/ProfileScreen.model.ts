// Modelo para a tela de Perfil
export interface ProfileScreenModel {
  status: 'carregando' | 'pronto' | 'atualizando' | 'erro';
  
  // Informações do perfil do usuário
  perfil: {
    id: string;
    nome: string;
    nomeUsuario: string;
    biografia: string;
    fotoPerfil: string | null;
    capaPerfil: string | null;
    
    // Estatísticas
    seguidores: number;
    seguindo: number;
    curtidas: number;
    visualizacoes: number;
    
    // Informações de contato
    email: string;
    telefone: string;
    
    // Redes sociais
    redesSociais: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
      tiktok?: string;
      facebook?: string;
    };
    
    // Configurações de privacidade
    perfilPrivado: boolean;
    mostrarEmailPublico: boolean;
    mostrarTelefonePublico: boolean;
    
    // Metadados
    dataCriacao: string;
    ultimaAtualizacao: string;
  } | null;
  
  // Conteúdo do perfil
  conteudo: {
    tipo: 'publicacoes' | 'salvos' | 'marcados' | 'aoVivo';
    itens: Array<{
      id: string;
      tipo: 'imagem' | 'video' | 'transmissao';
      url: string;
      miniatura?: string;
      visualizacoes: number;
      curtidas: number;
      comentarios: number;
      dataPublicacao: string;
    }>;
    carregandoMais: boolean;
    temMaisParaCarregar: boolean;
    paginaAtual: number;
  };
  
  // Estado de edição
  modoEdicao: boolean;
  alteracoesNaoSalvas: boolean;
  
  // Upload de mídia
  uploadEmAndamento: boolean;
  progressoUpload: number;
  
  // Estado de seguidores/seguindo
  listaVisivel: 'seguidores' | 'seguindo' | null;
  
  // Erros
  erro: string | null;
}

export const estadoInicialProfileScreen: ProfileScreenModel = {
  status: 'carregando',
  perfil: null,
  conteudo: {
    tipo: 'publicacoes',
    itens: [],
    carregandoMais: false,
    temMaisParaCarregar: true,
    paginaAtual: 1,
  },
  modoEdicao: false,
  alteracoesNaoSalvas: false,
  uploadEmAndamento: false,
  progressoUpload: 0,
  listaVisivel: null,
  erro: null,
};

// Tipos de ações para atualizar o estado
export type ProfileScreenAction =
  // Ações de carregamento
  | { type: 'CARREGAR_PERFIL'; payload: ProfileScreenModel['perfil'] }
  | { type: 'CARREGAR_CONTEUDO'; conteudo: ProfileScreenModel['conteudo'] }
  
  // Ações de edição
  | { type: 'ATIVAR_MODO_EDICAO' }
  | { type: 'CANCELAR_EDICAO' }
  | { type: 'ATUALIZAR_CAMPO'; campo: keyof NonNullable<ProfileScreenModel['perfil']>; valor: any }
  | { type: 'ATUALIZAR_REDE_SOCIAL'; rede: keyof NonNullable<ProfileScreenModel['perfil']>['redesSociais']; valor: string | undefined }
  
  // Ações de upload
  | { type: 'INICIAR_UPLOAD' }
  | { type: 'ATUALIZAR_PROGRESSO_UPLOAD'; progresso: number }
  | { type: 'FINALIZAR_UPLOAD' }
  
  // Ações de conteúdo
  | { type: 'ALTERAR_TIPO_CONTEUDO'; tipo: ProfileScreenModel['conteudo']['tipo'] }
  | { type: 'CARREGAR_MAIS_CONTEUDO' }
  | { type: 'ATUALIZAR_ESTATISTICAS'; estatisticas: Partial<NonNullable<ProfileScreenModel['perfil']>> }
  
  // Ações de seguidores/seguindo
  | { type: 'MOSTRAR_LISTA'; tipo: 'seguidores' | 'seguindo' }
  | { type: 'FECHAR_LISTA' }
  
  // Ações de estado
  | { type: 'SALVAR_ALTERACOES' }
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function profileScreenReducer(
  estado: ProfileScreenModel,
  acao: ProfileScreenAction
): ProfileScreenModel {
  switch (acao.type) {
    case 'CARREGAR_PERFIL':
      return {
        ...estado,
        perfil: acao.payload,
        status: 'pronto',
      };
      
    case 'CARREGAR_CONTEUDO':
      return {
        ...estado,
        conteudo: {
          ...acao.conteudo,
          itens: [...estado.conteudo.itens, ...acao.conteudo.itens],
          carregandoMais: false,
        },
      };
      
    case 'ATIVAR_MODO_EDICAO':
      return {
        ...estado,
        modoEdicao: true,
      };
      
    case 'CANCELAR_EDICAO':
      return {
        ...estado,
        modoEdicao: false,
        alteracoesNaoSalvas: false,
      };
      
    case 'ATUALIZAR_CAMPO':
      if (!estado.perfil) return estado;
      return {
        ...estado,
        perfil: {
          ...estado.perfil,
          [acao.campo]: acao.valor,
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'ATUALIZAR_REDE_SOCIAL':
      if (!estado.perfil) return estado;
      const novasRedesSociais = { ...estado.perfil.redesSociais };
      
      if (acao.valor === undefined) {
        delete novasRedesSociais[acao.rede];
      } else {
        novasRedesSociais[acao.rede] = acao.valor;
      }
      
      return {
        ...estado,
        perfil: {
          ...estado.perfil,
          redesSociais: novasRedesSociais,
        },
        alteracoesNaoSalvas: true,
      };
      
    case 'INICIAR_UPLOAD':
      return {
        ...estado,
        uploadEmAndamento: true,
        progressoUpload: 0,
      };
      
    case 'ATUALIZAR_PROGRESSO_UPLOAD':
      return {
        ...estado,
        progressoUpload: acao.progresso,
      };
      
    case 'FINALIZAR_UPLOAD':
      return {
        ...estado,
        uploadEmAndamento: false,
        progressoUpload: 0,
      };
      
    case 'ALTERAR_TIPO_CONTEUDO':
      return {
        ...estado,
        conteudo: {
          ...estado.conteudo,
          tipo: acao.tipo,
          itens: [],
          paginaAtual: 1,
          temMaisParaCarregar: true,
        },
      };
      
    case 'CARREGAR_MAIS_CONTEUDO':
      return {
        ...estado,
        conteudo: {
          ...estado.conteudo,
          carregandoMais: true,
        },
      };
      
    case 'ATUALIZAR_ESTATISTICAS':
      if (!estado.perfil) return estado;
      return {
        ...estado,
        perfil: {
          ...estado.perfil,
          ...acao.estatisticas,
        },
      };
      
    case 'MOSTRAR_LISTA':
      return {
        ...estado,
        listaVisivel: acao.tipo,
      };
      
    case 'FECHAR_LISTA':
      return {
        ...estado,
        listaVisivel: null,
      };
      
    case 'SALVAR_ALTERACOES':
      return {
        ...estado,
        status: 'atualizando',
        erro: null,
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
