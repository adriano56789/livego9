export interface ContaConectada {
    provedor: 'google' | 'facebook' | 'apple' | 'twitter';
    email: string;
    dataConexao: Date;
    estaAtiva: boolean;
}

export interface TelaContasConectadasProps {
    contas: ContaConectada[];
    onAdicionarConta: (provedor: string) => void;
    onRemoverConta: (provedor: string) => void;
}

export interface TelaContasConectadasState {
    estaCarregando: boolean;
    erro: string | null;
    contaSelecionada: string | null;
}
