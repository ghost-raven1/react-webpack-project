// Utility for building class names using only `${prefix}-*` classes.
// Provides helpers for BEM-like patterns: block, block--modifier, block__element, block__element--modifier.
// Also exposes a safe dedupe+join helper for className strings.

export const getCssPrefix = (raw?: string): string => {
  const s = (raw ?? '').trim();
  return s.length ? s : 'dossier';
};

export const block = (blockName: string, prefix: string): string[] => [
  `${prefix}-${blockName}`,
];

export const mod = (blockName: string, modifier: string, prefix: string): string[] => [
  `${prefix}-${blockName}--${modifier}`,
];

export const elem = (blockName: string, element: string, prefix: string): string[] => [
  `${prefix}-${blockName}__${element}`,
];

export const elemMod = (
  blockName: string,
  element: string,
  modifier: string,
  prefix: string,
): string[] => [
  `${prefix}-${blockName}__${element}--${modifier}`,
];

// Note: Components use `bem-cn` directly for BEM classes.
// Helpers above remain for legacy static class builders when needed.
