export interface TelaCriarPostProps {
    usuarioAtual: {
        id: string;
        nome: string;
        avatarUrl: string;
    };
    onPostCriado: (post: Post) => void;
}

export interface TelaCriarPostState {
    conteudo: string;
    midias: Array<{
        uri: string;
        tipo: 'imagem' | 'video';
    }>;
    estaEnviando: boolean;
    erro: string | null;
    localizacao: {
        latitude: number;
        longitude: number;
        nome: string;
    } | null;
}

type Post = {
    id: string;
    conteudo: string;
    midias?: Array<{
        uri: string;
        tipo: 'imagem' | 'video';
    }>;
    localizacao?: {
        latitude: number;
        longitude: number;
        nome: string;
    };
    dataCriacao: Date;
};
