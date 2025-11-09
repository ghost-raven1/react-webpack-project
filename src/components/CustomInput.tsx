import React, { forwardRef } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd/es/input';
import './CustomInput.less';
import { setup } from 'bem-cn';
import { useDossierAntd } from '../hooks/useDossierAntd';
import { getCssPrefix } from '../utils/csl';
import { devAttrs } from '../utils/devAttrs';
import type { UiSize, AntdSize } from '../utils/types';
import { useUiSize } from '../hooks/useUiSize';

interface CustomInputProps extends InputProps {
  // Дополнительные UI-пропы компонента
  label?: string;
  error?: string;
  help?: string;
  required?: boolean;
  borderless?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  // Единый UI-ориентированный размер для классов и маппинга в AntD
  uiSize?: UiSize;
}

export const CustomInput = forwardRef<any, CustomInputProps>(({ 
  variant = 'default',
  uiSize,
  borderless = false,
  label,
  error,
  help,
  required,
  className = '',
  size: antdSizeProp,
  ...props
}, ref) => {
  const { prefix } = useDossierAntd();
  const cssPrefix = getCssPrefix(prefix);
  const block = setup({ ns: `${cssPrefix}-`, mod: '--', modValue: '-' });
  const b = block('input');
  const { uiSizeFinal, antdSizeFinal } = useUiSize(uiSize, antdSizeProp as AntdSize);

  const containerClass = [b({ [uiSizeFinal]: true }), className].filter(Boolean).join(' ');

  const fieldMods: Record<string, boolean> = {};
  if (variant !== 'default') fieldMods[variant] = true;
  if (borderless) fieldMods.borderless = true;
  const fieldClass = b('field', fieldMods);

  return (
    <div className={containerClass}>
      {label && (
        <label className={b('label', { required: !!required })}>
          {label}
        </label>
      )}
      <Input
        ref={ref}
        className={fieldClass}
        bordered={!borderless}
        size={antdSizeFinal}
        {...props}
        {...devAttrs({ 'data-variant': variant, 'data-size': uiSizeFinal, 'data-borderless': borderless })}
      />
      {error && (
        <span className={b('error')}>
          {error}
        </span>
      )}
      {help && !error && (
        <span className={b('help')}>
          {help}
        </span>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';
