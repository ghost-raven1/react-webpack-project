import { useDossierPrefix } from '../contexts/DossierAntdContext';

// Хук только предоставляет префикс;
export const useDossierAntd = () => {
  const { prefix, prefixCsl } = useDossierPrefix();

  const getClassName = (baseClass: string): string => `${prefix}-${baseClass}`;

  return { prefix, prefixCsl, getClassName };
};
