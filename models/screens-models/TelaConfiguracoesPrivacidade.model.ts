export interface ConfiguracaoPrivacidade {
  id: string;
  tipo: 'perfil_publico' | 'busca_perfil' | 'atividades' | 'localizacao' | 'mensagens_diretas';
  titulo: string;
  descricao: string;
  nivel: 'publico' | 'amigos' | 'seguidores' | 'apenas_eu';
  ativo: boolean;
}

export interface TelaConfiguracoesPrivacidadeProps {
  configuracoes: ConfiguracaoPrivacidade[];
  onSalvarConfiguracoes: (configuracoes: ConfiguracaoPrivacidade[]) => Promise<boolean>;
}

export interface TelaConfiguracoesPrivacidadeState {
  configuracoesLocais: ConfiguracaoPrivacidade[];
  salvando: boolean;
  mensagemSucesso: string | null;
  erro: string | null;
}
