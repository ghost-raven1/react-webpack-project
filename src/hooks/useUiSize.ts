import { UiSize, AntdSize } from '../utils/types';

// Унифицирует определение итогового UI размера и маппит его в AntD размер
export const useUiSize = (
  uiSize?: UiSize,
  antdSize?: AntdSize
): { uiSizeFinal: UiSize; antdSizeFinal: AntdSize } => {
  const uiSizeFinal: UiSize = uiSize ?? (
    antdSize === 'small' ? 'small' : antdSize === 'large' ? 'large' : 'medium'
  );
  const antdSizeFinal: AntdSize = antdSize ?? (uiSizeFinal === 'medium' ? 'middle' : uiSizeFinal);
  return { uiSizeFinal, antdSizeFinal };
};

