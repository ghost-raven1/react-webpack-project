import React, { forwardRef } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd/es/input';
import './CustomInput.less';
import { useBem } from '../hooks/useBem';
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
  const bem = useBem('input');
  const { uiSizeFinal, antdSizeFinal } = useUiSize(uiSize, antdSizeProp as AntdSize);

  const containerClass = bem.join(
    bem.b(),
    bem.m(uiSizeFinal),
    className,
  );

  const fieldClass = bem.join(
    bem.e('field'),
    variant !== 'default' && bem.em('field', variant),
    borderless && bem.em('field', 'borderless'),
  );

  return (
    <div className={containerClass}>
      {label && (
        <label className={bem.join(
          bem.e('label'),
          required && bem.em('label', 'required'),
        )}>
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
        <span className={bem.join(bem.e('error'))}>
          {error}
        </span>
      )}
      {help && !error && (
        <span className={bem.join(bem.e('help'))}>
          {help}
        </span>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';
