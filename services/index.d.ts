// Importação do React para suporte a tipos
import React from 'react';

// Declarações de tipos para os módulos que estão causando erros
declare module '*.tsx' {
    const content: any;
    export default content;
}

declare module '*.ts' {
    const content: any;
    export default content;
}

// Tipos para os ícones de frame
type FrameIconProps = {
    className?: string;
    width?: number | string;
    height?: number | string;
};

// Declaração de tipos para os ícones
declare module 'components/icons/frames' {
    import { FC } from 'react';
    
    export const FrameBlazingSunIcon: FC<FrameIconProps>;
    export const FrameBlueCrystalIcon: FC<FrameIconProps>;
    export const FrameBlueFireIcon: FC<FrameIconProps>;
    export const FrameDiamondIcon: FC<FrameIconProps>;
    export const FrameFloralWreathIcon: FC<FrameIconProps>;
    export const FrameGoldenFloralIcon: FC<FrameIconProps>;
    export const FrameIcyWingsIcon: FC<FrameIconProps>;
    export const FrameMagentaWingsIcon: FC<FrameIconProps>;
    export const FrameNeonDiamondIcon: FC<FrameIconProps>;
    export const FrameNeonPinkIcon: FC<FrameIconProps>;
    export const FrameOrnateBronzeIcon: FC<FrameIconProps>;
    export const FramePinkGemIcon: FC<FrameIconProps>;
    export const FramePinkLaceIcon: FC<FrameIconProps>;
    export const FramePurpleFloralIcon: FC<FrameIconProps>;
    export const FrameRegalPurpleIcon: FC<FrameIconProps>;
    export const FrameRoseHeartIcon: FC<FrameIconProps>;
    export const FrameSilverBeadedIcon: FC<FrameIconProps>;
    export const FrameSilverThornIcon: FC<FrameIconProps>;
}

// Exporta os tipos para uso em outros arquivos
export interface FrameComponents {
    [key: string]: React.FC<FrameIconProps>;
}
