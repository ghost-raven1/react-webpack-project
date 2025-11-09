import React, { forwardRef } from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd/es/button';
import { setup } from 'bem-cn';
import { useDossierAntd } from '../hooks/useDossierAntd';
import { getCssPrefix } from '../utils/csl';
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
  const { prefix } = useDossierAntd();
  const cssPrefix = getCssPrefix(prefix);
  const block = setup({ ns: `${cssPrefix}-`, mod: '--', modValue: '-' });
  const b = block('button');

  const buttonClassName = [b({ [variant]: true, [uiSizeFinal]: true }), className].filter(Boolean).join(' ');

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
