import { FrameIconProps } from './frame-models/FrameIcon';

export interface FrameSilverBeadedIconProps extends FrameIconProps {
  /**
   * Cor do círculo externo
   * @default '#94A3B8'
   */
  circleColor?: string;
  
  /**
   * Cor das contas
   * @default '#CBD5E1'
   */
  beadColor?: string;
  
  /**
   * Número de contas ao redor do círculo
   * @default 12
   */
  beadCount?: number;
  
  /**
   * Tamanho das contas (raio)
   * @default 3
   */
  beadSize?: number;
  
  /**
   * Distância do centro para as contas
   * @default 48
   */
  beadDistance?: number;
}

export const defaultFrameSilverBeadedIconProps: Partial<FrameSilverBeadedIconProps> = {
  size: 100,
  circleColor: '#94A3B8',
  beadColor: '#CBD5E1',
  beadCount: 12,
  beadSize: 3,
  beadDistance: 48,
  strokeWidth: 1,
  fill: 'none'
};
