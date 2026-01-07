export interface ProdutoMercado {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    moeda: string;
    imagemUrl: string;
    categoria: string;
    estoque: number;
    vendidoPor: string;
    avaliacao: number;
    totalAvaliacoes: number;
}

export interface TelaMercadoProps {
    produtos: ProdutoMercado[];
    carregando: boolean;
    onProdutoSelecionado: (produtoId: string) => void;
    onAdicionarAoCarrinho: (produtoId: string, quantidade: number) => void;
}

export interface TelaMercadoState {
    termoBusca: string;
    categoriaSelecionada: string | null;
    ordenacao: 'relevancia' | 'menor_preco' | 'maior_preco' | 'mais_vendidos' | 'melhor_avaliados';
    paginaAtual: number;
    itensPorPagina: number;
    filtrosAplicados: {
        precoMin?: number;
        precoMax?: number;
        apenasDisponiveis: boolean;
        apenasPromocoes: boolean;
    };
}
