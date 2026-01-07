// Modelo para CopyrightScreen
export interface CopyrightScreenModel {
  appName: string;
  version: string;
  companyName: string;
  year: number;
  website: string;
  contactEmail: string;
  license: string;
  additionalInfo?: string;
}

export const initialCopyrightScreenState: CopyrightScreenModel = {
  appName: 'LiveGo',
  version: '1.0.0',
  companyName: 'LiveGo Inc.',
  year: new Date().getFullYear(),
  website: 'https://livego.com',
  contactEmail: 'suporte@livego.com',
  license: 'Proprietary',
  additionalInfo: 'Todos os direitos reservados.',
};

// Não são necessárias ações para esta tela estática
