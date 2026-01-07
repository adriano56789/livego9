// backend/src/models/FrameModels.ts
import { AllFrameModels } from '../../../models/frame-models/AllFrameModels';

export interface FrameModel {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  category: string;
  rarity: string;
  unlockLevel: number;
  price: number;
  available: boolean;
  component: string;
  hasGradient: boolean;
  hasPattern: boolean;
}

export const FrameModels: Record<string, FrameModel> = AllFrameModels;

export type FrameId = keyof typeof FrameModels;

export function getFrameModel(id: FrameId): FrameModel {
  return FrameModels[id];
}
