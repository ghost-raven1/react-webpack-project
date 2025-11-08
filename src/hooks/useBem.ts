import { useDossierAntd } from './useDossierAntd';
import { getCssPrefix, createBem } from '../utils/csl';

export const useBem = (block: string) => {
  const { prefix } = useDossierAntd();
  const cssPrefix = getCssPrefix(prefix);
  return createBem(cssPrefix, block);
};
