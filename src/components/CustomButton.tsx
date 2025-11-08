import React, { forwardRef } from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd/es/button';
import { useBem } from '../hooks/useBem';
import { mapVariantToAntd } from '../utils/antdMap';
import type { UiSize, Variant } from '../utils/types';
import { useUiSize } from '../hooks/useUiSize';
import { devAttrs } from '../utils/devAttrs';
import './CustomButton.less';

interface CustomButtonProps extends ButtonProps {
  variant?: Variant;
  // UI-ориентированный размер для классов; не переопределяет ButtonProps.size
  uiSize?: UiSize;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(({ 
  children, 
  variant = 'primary', 
  uiSize,
  className = '',
  type,
  danger,
  size: antdSizeProp,
  ...props 
}, ref) => {
  const { uiSizeFinal, antdSizeFinal } = useUiSize(uiSize, antdSizeProp);
  const bem = useBem('button');
  const buttonClassName = bem.join(
    bem.b(),
    bem.m(variant),
    bem.m(uiSizeFinal),
    className,
  );

  const { type: mappedType, danger: mappedDanger } = mapVariantToAntd(variant, { type, danger });
  const antdSizeMapped: ButtonProps['size'] = antdSizeFinal;

  return (
    <AntButton 
      {...props} 
      className={buttonClassName}
      type={mappedType}
    danger={mappedDanger}
    size={antdSizeMapped}
    ref={ref}
    {...devAttrs({ 'data-variant': variant, 'data-size': uiSizeFinal })}
  >
      {children}
    </AntButton>
  );
});

CustomButton.displayName = 'CustomButton';
