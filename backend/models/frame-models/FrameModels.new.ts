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

// Importando os modelos de frame
import { AllFrameModels } from './AllFrameModels';

// Exportando os modelos de frame
export const FrameModels: Record<string, FrameModel> = AllFrameModels;

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
  frames: Object.keys(FrameModels).reduce((acc, key) => ({
    ...acc,
    [key]: key === 'SILVER_BEADED' // Apenas o frame básico desbloqueado por padrão
  }), {} as Record<FrameModelId, boolean>)
};
