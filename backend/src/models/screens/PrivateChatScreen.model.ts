// Modelo para a tela de Chat Privado
export interface PrivateChatScreenModel {
  status: 'carregando' | 'pronto' | 'enviando' | 'erro';
  mensagens: Array<{
    id: string;
    remetenteId: string;
    destinatarioId: string;
    conteudo: string;
    dataEnvio: string;
    lida: boolean;
    tipo: 'texto' | 'imagem' | 'video' | 'audio' | 'arquivo';
    urlMidia?: string;
    nomeArquivo?: string;
    tamanhoArquivo?: number;
  }>;
  
  // Informações do destinatário
  destinatario: {
    id: string;
    nome: string;
    avatar?: string;
    estaOnline: boolean;
    ultimaVezOnline?: string;
  } | null;
  
  // Estado da mensagem atual
  mensagemAtual: string;
  
  // Configurações do chat
  configuracao: {
    notificacoesAtivadas: boolean;
    somAtivado: boolean;
    vibracaoAtivada: boolean;
    modoNoturno: boolean;
  };
  
  // Paginação
  paginaAtual: number;
  totalPaginas: number;
  carregandoMaisMensagens: boolean;
  
  // Estado de mídia
  anexo: {
    tipo: 'imagem' | 'video' | 'audio' | 'arquivo' | null;
    uri: string | null;
    nome: string | null;
    tamanho: number | null;
  };
  
  // Estado de gravação de áudio
  gravandoAudio: boolean;
  duracaoGravacao: number;
  
  // Erros
  erro: string | null;
}

export const estadoInicialPrivateChatScreen: PrivateChatScreenModel = {
  status: 'carregando',
  mensagens: [],
  destinatario: null,
  mensagemAtual: '',
  configuracao: {
    notificacoesAtivadas: true,
    somAtivado: true,
    vibracaoAtivada: true,
    modoNoturno: false,
  },
  paginaAtual: 1,
  totalPaginas: 1,
  carregandoMaisMensagens: false,
  anexo: {
    tipo: null,
    uri: null,
    nome: null,
    tamanho: null,
  },
  gravandoAudio: false,
  duracaoGravacao: 0,
  erro: null,
};

// Tipos de ações para atualizar o estado
export type PrivateChatScreenAction =
  | { type: 'DEFINIR_STATUS'; status: PrivateChatScreenModel['status'] }
  | { type: 'DEFINIR_DESTINATARIO'; destinatario: PrivateChatScreenModel['destinatario'] }
  | { type: 'ATUALIZAR_MENSAGEM_ATUAL'; mensagem: string }
  | { type: 'ADICIONAR_MENSAGEM'; mensagem: PrivateChatScreenModel['mensagens'][0] }
  | { type: 'ATUALIZAR_MENSAGEM'; mensagemId: string; atualizacoes: Partial<PrivateChatScreenModel['mensagens'][0]> }
  | { type: 'MARCAR_COMO_LIDA'; mensagemId: string }
  | { type: 'DEFINIR_ANEXO'; anexo: Partial<PrivateChatScreenModel['anexo']> | null }
  | { type: 'TOGGLE_GRAVACAO_AUDIO' }
  | { type: 'ATUALIZAR_DURACAO_GRAVACAO'; duracao: number }
  | { type: 'CARREGAR_MAIS_MENSAGENS' }
  | { type: 'DEFINIR_ERRO'; erro: string | null };

// Reducer para gerenciar o estado
export function privateChatScreenReducer(
  estado: PrivateChatScreenModel,
  acao: PrivateChatScreenAction
): PrivateChatScreenModel {
  switch (acao.type) {
    case 'DEFINIR_STATUS':
      return { ...estado, status: acao.status };
      
    case 'DEFINIR_DESTINATARIO':
      return { ...estado, destinatario: acao.destinatario };
      
    case 'ATUALIZAR_MENSAGEM_ATUAL':
      return { ...estado, mensagemAtual: acao.mensagem };
      
    case 'ADICIONAR_MENSAGEM':
      // Verifica se a mensagem já existe
      const mensagemExiste = estado.mensagens.some(msg => msg.id === acao.mensagem.id);
      if (mensagemExiste) {
        return estado;
      }
      return {
        ...estado,
        mensagens: [acao.mensagem, ...estado.mensagens],
        mensagemAtual: '',
        anexo: {
          tipo: null,
          uri: null,
          nome: null,
          tamanho: null,
        },
      };
      
    case 'ATUALIZAR_MENSAGEM':
      return {
        ...estado,
        mensagens: estado.mensagens.map(msg =>
          msg.id === acao.mensagemId ? { ...msg, ...acao.atualizacoes } : msg
        ),
      };
      
    case 'MARCAR_COMO_LIDA':
      return {
        ...estado,
        mensagens: estado.mensagens.map(msg =>
          msg.id === acao.mensagemId ? { ...msg, lida: true } : msg
        ),
      };
      
    case 'DEFINIR_ANEXO':
      return {
        ...estado,
        anexo: acao.anexo
          ? { ...estado.anexo, ...acao.anexo }
          : {
              tipo: null,
              uri: null,
              nome: null,
              tamanho: null,
            },
      };
      
    case 'TOGGLE_GRAVACAO_AUDIO':
      return {
        ...estado,
        gravandoAudio: !estado.gravandoAudio,
        duracaoGravacao: estado.gravandoAudio ? 0 : estado.duracaoGravacao,
      };
      
    case 'ATUALIZAR_DURACAO_GRAVACAO':
      return {
        ...estado,
        duracaoGravacao: acao.duracao,
      };
      
    case 'CARREGAR_MAIS_MENSAGENS':
      return {
        ...estado,
        carregandoMaisMensagens: true,
      };
      
    case 'DEFINIR_ERRO':
      return {
        ...estado,
        erro: acao.erro,
        status: acao.erro ? 'erro' : estado.status,
      };
      
    default:
      return estado;
  }
}
