export interface TelaDireitosAutoraisProps {
    anoInicio: number;
    empresa: string;
    termosServicoUrl: string;
    politicaPrivacidadeUrl: string;
    versaoApp: string;
}

export interface TelaDireitosAutoraisState {
    carregandoTermos: boolean;
    carregandoPolitica: boolean;
    textoTermos: string | null;
    textoPolitica: string | null;
}
