export interface MensagemPrivada {
  id: string;
  remetenteId: string;
  conteudo: string;
  dataEnvio: Date;
  lida: boolean;
  midias?: Array<{
    tipo: 'imagem' | 'video' | 'audio' | 'arquivo';
    url: string;
    nomeArquivo?: string;
    tamanho?: number;
  }>;
}

export interface TelaChatPrivadoProps {
  contato: {
    id: string;
    nome: string;
    avatarUrl: string;
    estaOnline: boolean;
    ultimaVezOnline?: Date;
  };
  mensagens: MensagemPrivada[];
  onEnviarMensagem: (conteudo: string, midias?: File[]) => Promise<void>;
  onVoltar: () => void;
  carregandoMensagens: boolean;
}

export interface TelaChatPrivadoState {
  novaMensagem: string;
  enviando: boolean;
  midiasSelecionadas: File[];
  visualizandoMidia: {
    url: string;
    tipo: string;
  } | null;
  rolagemParaFim: boolean;
}
