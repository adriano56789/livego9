import { FrameType, FrameTypes } from '.';

// Modelo base para todos os frames
export interface FrameModel {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  category: 'floral' | 'geometric' | 'nature' | 'abstract' | 'elegant';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockLevel: number;
  price: number;
  available: boolean;
  component: string; // Nome do componente React
  hasGradient: boolean;
  hasPattern: boolean;
}

// Modelos específicos para cada frame
export const FrameModels: Record<string, FrameModel> = {
  BLAZING_SUN: {
    ...FrameTypes.BLAZING_SUN,
    component: 'FrameBlazingSunIcon',
  },
  SILVER_BEADED: {
    ...FrameTypes.SILVER_BEADED,
    component: 'FrameSilverBeadedIcon',
  },
  BLUE_CRYSTAL: {
    ...FrameTypes.BLUE_CRYSTAL,
    component: 'FrameBlueCrystalIcon',
  },
  BLUE_FIRE: {
    id: 'blue_fire',
    name: 'Fogo Azul',
    description: 'Chamas azuis estilizadas ao redor da moldura',
    colors: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      accent: '#93C5FD'
    },
    hasGradient: true,
    hasPattern: false,
    category: 'nature',
    rarity: 'rare',
    unlockLevel: 7,
    price: 1200,
    available: true,
    component: 'FrameBlueFireIcon'
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamante',
    description: 'Padrão de diamante elegante',
    colors: {
      primary: '#A5B4FC',
      secondary: '#6366F1',
      accent: '#C7D2FE'
    },
    hasGradient: true,
    hasPattern: true,
    category: 'geometric',
    rarity: 'uncommon',
    unlockLevel: 4,
    price: 950,
    available: true,
    component: 'FrameDiamondIcon'
  },
  // Adicionar os demais 13 modelos seguindo o mesmo padrão
  // ...
} as const;

// Tipo para os IDs dos modelos
export type FrameModelId = keyof typeof FrameModels;

// Função auxiliar para obter um modelo de frame pelo ID
export function getFrameModel(id: FrameModelId): FrameModel {
  return FrameModels[id] || FrameModels.SILVER_BEADED; // Retorna um padrão se não encontrar
}

// Interface para o estado do frame do usuário
export interface UserFrameState {
  equippedFrame: FrameModelId | null;
  unlockedFrames: FrameModelId[];
  frames: Record<FrameModelId, boolean>; // Mapeia frame IDs para estado de desbloqueio
}

// Estado inicial para o frame do usuário
export const initialUserFrameState: UserFrameState = {
  equippedFrame: 'SILVER_BEADED',
  unlockedFrames: ['SILVER_BEADED'], // Inicia com o frame básico desbloqueado
  frames: {
    SILVER_BEADED: true,
    BLAZING_SUN: false,
    BLUE_CRYSTAL: false,
    BLUE_FIRE: false,
    DIAMOND: false,
    // Inicializar outros frames como false
  } as Record<FrameModelId, boolean>
};
