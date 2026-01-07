export interface TestadorIntegridadeProps {
    // Propriedades do Testador de Integridade do Aplicativo
    versaoApp: string;
    statusVerificacao: 'pendente' | 'em_andamento' | 'concluido' | 'falha';
    resultadosVerificacao: Array<{
        componente: string;
        status: 'sucesso' | 'falha' | 'aviso';
        mensagem: string;
    }>;
}

export interface TestadorIntegridadeState {
    verificacaoEmAndamento: boolean;
    resultadoDetalhado: any;
}
