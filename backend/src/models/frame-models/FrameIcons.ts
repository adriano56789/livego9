import { FrameIconProps } from './FrameIcon';

// Interface base para ícones com gradiente
export interface FrameWithGradientProps extends FrameIconProps {
  gradientColors: {
    start: `#${string}`;
    end: `#${string}`;
  };
  gradientId: string;
}

// Interface para ícones com elementos decorativos circulares
export interface FrameWithBeadsProps extends FrameIconProps {
  beadColor: `#${string}`;
  beadCount: number;
  beadSize: number;
  beadDistance: number;
}

// Interface para ícones com elementos pontiagudos
export interface FrameWithSpikesProps extends FrameIconProps {
  spikeColor: `#${string}`;
  spikeCount: number;
  spikeSize: number;
}

// Interface para ícones com elementos florais
export interface FrameWithFloralProps extends FrameIconProps {
  floralColor: `#${string}`;
  floralElements: number;
  floralSize: number;
}

// Interface para ícones com diamantes/cristais
export interface FrameWithCrystalProps extends FrameIconProps {
  crystalColor: `#${string}`;
  crystalCount: number;
  crystalSize: number;
}

// Interface para ícones com asas
export interface FrameWithWingsProps extends FrameIconProps {
  wingColor: `#${string}`;
  wingSize: number;
  wingPosition: 'top' | 'sides' | 'bottom' | 'all';
}

// Interface para ícones com corações
export interface FrameWithHeartsProps extends FrameIconProps {
  heartColor: `#${string}`;
  heartCount: number;
  heartSize: number;
}

// Interface para ícones com elementos de renda
export interface FrameWithLaceProps extends FrameIconProps {
  laceColor: `#${string}`;
  lacePattern: 'simple' | 'complex' | 'floral';
}

// Interface para ícones com elementos dourados/ornamentados
export interface FrameWithOrnamentsProps extends FrameIconProps {
  ornamentColor: `#${string}`;
  ornamentType: 'floral' | 'geometric' | 'classic';
}

// Interface para ícones com elementos de fogo/chamas
export interface FrameWithFlamesProps extends FrameIconProps {
  flameColor: `#${string}`;
  flameIntensity: 'low' | 'medium' | 'high';
}

// Interface para ícones com elementos de gelo/cristais de gelo
export interface FrameWithIceProps extends FrameIconProps {
  iceColor: `#${string}`;
  iceIntensity: 'low' | 'medium' | 'high';
}
