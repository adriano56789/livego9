import React from 'react';

type HexColor = `#${string}`;

export interface FrameIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Classes CSS adicionais para estilização
   */
  className?: string;
  
  /**
   * Largura e altura do SVG
   * @default '100%'
   */
  size?: number | string;
  
  /**
   * Cor de preenchimento dos elementos
   * @default 'none'
   */
  fill?: string;
  
  /**
   * Largura da borda
   * @default 2
   */
  strokeWidth?: number;
  
  /**
   * Cores usadas no gradiente
   */
  gradientColors?: {
    start: HexColor;
    end: HexColor;
  };
  
  /**
   * Cores dos elementos decorativos (círculos, etc)
   */
  decorationColors?: HexColor | HexColor[];
  
  /**
   * Elementos filhos adicionais
   */
  children?: React.ReactNode;
}

/**
 * Interface para os componentes de ícone de frame
 */
export interface FrameIconComponent extends React.FC<FrameIconProps> {
  displayName?: string;
}
