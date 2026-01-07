import { FrameModel } from './FrameModels';

export const AllFrameModels: Record<string, FrameModel> = {
  // FrameBlazingSunIcon
  BLAZING_SUN: {
    id: 'blazing_sun',
    name: 'Sol Flamejante',
    description: 'Um sol radiante com raios flamejantes',
    colors: { primary: '#F59E0B', secondary: '#EF4444', accent: '#FDB813' },
    hasGradient: true,
    hasPattern: true,
    category: 'nature',
    rarity: 'rare',
    unlockLevel: 5,
    price: 1500,
    available: true,
    component: 'FrameBlazingSunIcon'
  },

  // FrameBlueCrystalIcon
  BLUE_CRYSTAL: {
    id: 'blue_crystal',
    name: 'Cristal Azul',
    description: 'Bordas com aparência de cristal azul brilhante',
    colors: { primary: '#60A5FA', secondary: '#2563EB', accent: '#93C5FD' },
    hasGradient: true,
    hasPattern: true,
    category: 'geometric',
    rarity: 'uncommon',
    unlockLevel: 3,
    price: 800,
    available: true,
    component: 'FrameBlueCrystalIcon'
  },

  // FrameBlueFireIcon
  BLUE_FIRE: {
    id: 'blue_fire',
    name: 'Fogo Azul',
    description: 'Chamas azuis estilizadas ao redor da moldura',
    colors: { primary: '#3B82F6', secondary: '#1D4ED8', accent: '#93C5FD' },
    hasGradient: true,
    hasPattern: false,
    category: 'nature',
    rarity: 'rare',
    unlockLevel: 7,
    price: 1200,
    available: true,
    component: 'FrameBlueFireIcon'
  },

  // FrameDiamondIcon
  DIAMOND: {
    id: 'diamond',
    name: 'Diamante',
    description: 'Padrão de diamante elegante',
    colors: { primary: '#A5B4FC', secondary: '#6366F1', accent: '#C7D2FE' },
    hasGradient: true,
    hasPattern: true,
    category: 'geometric',
    rarity: 'uncommon',
    unlockLevel: 4,
    price: 950,
    available: true,
    component: 'FrameDiamondIcon'
  },

  // FrameFloralWreathIcon
  FLORAL_WREATH: {
    id: 'floral_wreath',
    name: 'Grinalda Floral',
    description: 'Uma grinalda de flores delicadas',
    colors: { primary: '#A78BFA', secondary: '#8B5CF6', accent: '#C4B5FD' },
    hasGradient: false,
    hasPattern: true,
    category: 'floral',
    rarity: 'uncommon',
    unlockLevel: 3,
    price: 850,
    available: true,
    component: 'FrameFloralWreathIcon'
  },

  // FrameGoldenFloralIcon
  GOLDEN_FLORAL: {
    id: 'golden_floral',
    name: 'Flores Douradas',
    description: 'Padrão floral com detalhes em dourado',
    colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' },
    hasGradient: true,
    hasPattern: true,
    category: 'floral',
    rarity: 'rare',
    unlockLevel: 6,
    price: 1400,
    available: true,
    component: 'FrameGoldenFloralIcon'
  },

  // FrameIcyWingsIcon
  ICY_WINGS: {
    id: 'icy_wings',
    name: 'Asas Gélidas',
    description: 'Asas congeladas com detalhes em azul claro',
    colors: { primary: '#BFDBFE', secondary: '#93C5FD', accent: '#EFF6FF' },
    hasGradient: true,
    hasPattern: false,
    category: 'nature',
    rarity: 'epic',
    unlockLevel: 8,
    price: 1800,
    available: true,
    component: 'FrameIcyWingsIcon'
  },

  // FrameMagentaWingsIcon
  MAGENTA_WINGS: {
    id: 'magenta_wings',
    name: 'Asas Magenta',
    description: 'Asas estilizadas em tons de rosa e roxo',
    colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F9A8D4' },
    hasGradient: true,
    hasPattern: false,
    category: 'nature',
    rarity: 'rare',
    unlockLevel: 7,
    price: 1600,
    available: true,
    component: 'FrameMagentaWingsIcon'
  },

  // FrameNeonDiamondIcon
  NEON_DIAMOND: {
    id: 'neon_diamond',
    name: 'Diamante Neon',
    description: 'Diamante com brilho neon',
    colors: { primary: '#A78BFA', secondary: '#8B5CF6', accent: '#C4B5FD' },
    hasGradient: true,
    hasPattern: true,
    category: 'geometric',
    rarity: 'epic',
    unlockLevel: 9,
    price: 2000,
    available: true,
    component: 'FrameNeonDiamondIcon'
  },

  // FrameNeonPinkIcon
  NEON_PINK: {
    id: 'neon_pink',
    name: 'Rosa Neon',
    description: 'Moldura com brilho rosa neon',
    colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F9A8D4' },
    hasGradient: true,
    hasPattern: false,
    category: 'abstract',
    rarity: 'rare',
    unlockLevel: 6,
    price: 1500,
    available: true,
    component: 'FrameNeonPinkIcon'
  },

  // FrameOrnateBronzeIcon
  ORNATE_BRONZE: {
    id: 'ornate_bronze',
    name: 'Bronze Ornamentado',
    description: 'Detalhes em bronze com padrões ornamentais',
    colors: { primary: '#B45309', secondary: '#92400E', accent: '#D97706' },
    hasGradient: false,
    hasPattern: true,
    category: 'elegant',
    rarity: 'uncommon',
    unlockLevel: 4,
    price: 1100,
    available: true,
    component: 'FrameOrnateBronzeIcon'
  },

  // FramePinkGemIcon
  PINK_GEM: {
    id: 'pink_gem',
    name: 'Gema Rosa',
    description: 'Gemas rosas incrustadas na moldura',
    colors: { primary: '#F472B6', secondary: '#EC4899', accent: '#F9A8D4' },
    hasGradient: false,
    hasPattern: true,
    category: 'elegant',
    rarity: 'uncommon',
    unlockLevel: 3,
    price: 900,
    available: true,
    component: 'FramePinkGemIcon'
  },

  // FramePinkLaceIcon
  PINK_LACE: {
    id: 'pink_lace',
    name: 'Renda Rosa',
    description: 'Padrão de renda delicado em rosa',
    colors: { primary: '#F9A8D4', secondary: '#F472B6', accent: '#FBCFE8' },
    hasGradient: false,
    hasPattern: true,
    category: 'elegant',
    rarity: 'rare',
    unlockLevel: 5,
    price: 1300,
    available: true,
    component: 'FramePinkLaceIcon'
  },

  // FramePurpleFloralIcon
  PURPLE_FLORAL: {
    id: 'purple_floral',
    name: 'Floral Roxo',
    description: 'Padrão floral em tons de roxo',
    colors: { primary: '#A78BFA', secondary: '#8B5CF6', accent: '#C4B5FD' },
    hasGradient: false,
    hasPattern: true,
    category: 'floral',
    rarity: 'uncommon',
    unlockLevel: 3,
    price: 850,
    available: true,
    component: 'FramePurpleFloralIcon'
  },

  // FrameRegalPurpleIcon
  REGAL_PURPLE: {
    id: 'regal_purple',
    name: 'Roxo Real',
    description: 'Design real em tons de roxo e dourado',
    colors: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#A78BFA' },
    hasGradient: true,
    hasPattern: true,
    category: 'elegant',
    rarity: 'epic',
    unlockLevel: 8,
    price: 1900,
    available: true,
    component: 'FrameRegalPurpleIcon'
  },

  // FrameRoseHeartIcon
  ROSE_HEART: {
    id: 'rose_heart',
    name: 'Coração de Rosas',
    description: 'Coração formado por rosas vermelhas',
    colors: { primary: '#F43F5E', secondary: '#E11D48', accent: '#FDA4AF' },
    hasGradient: false,
    hasPattern: true,
    category: 'floral',
    rarity: 'rare',
    unlockLevel: 6,
    price: 1500,
    available: true,
    component: 'FrameRoseHeartIcon'
  },

  // FrameSilverBeadedIcon
  SILVER_BEADED: {
    id: 'silver_beaded',
    name: 'Contas Prateadas',
    description: 'Contas prateadas elegantes ao redor da moldura',
    colors: { primary: '#94A3B8', secondary: '#CBD5E1' },
    hasGradient: false,
    hasPattern: true,
    category: 'elegant',
    rarity: 'common',
    unlockLevel: 1,
    price: 500,
    available: true,
    component: 'FrameSilverBeadedIcon'
  },

  // FrameSilverThornIcon
  SILVER_THORN: {
    id: 'silver_thorn',
    name: 'Espinhos Prateados',
    description: 'Espinhos prateados ao redor da moldura',
    colors: { primary: '#94A3B8', secondary: '#64748B' },
    hasGradient: false,
    hasPattern: true,
    category: 'nature',
    rarity: 'uncommon',
    unlockLevel: 3,
    price: 750,
    available: true,
    component: 'FrameSilverThornIcon'
  }
} as const;

export type FrameId = keyof typeof AllFrameModels;
