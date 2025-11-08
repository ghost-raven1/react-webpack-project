import type { ButtonProps } from 'antd/es/button';
import type { UiSize, Variant, AntdSize } from './types';

export const mapVariantToAntd = (
  variant: Variant,
  incoming?: { type?: ButtonProps['type']; danger?: boolean }
): { type: ButtonProps['type']; danger: boolean } => {
  const baseType: ButtonProps['type'] = variant === 'secondary' ? 'default' : 'primary';
  const type = incoming?.type ?? baseType;
  const danger = variant === 'danger' || !!incoming?.danger;
  return { type, danger };
};

// Унифицированный маппинг UI-ориентированного размера в AntD размер
export const mapSizeToAntd = (
  uiSize: UiSize,
  incoming?: AntdSize
): AntdSize => {
  if (incoming) return incoming;
  return uiSize === 'medium' ? 'middle' : uiSize;
};
