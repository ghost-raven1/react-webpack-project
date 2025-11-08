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

// Dedupe + join helper to produce a stable className string.
export const dedupeJoin = (
  classes: Array<string | string[] | false | null | undefined>
): string => {
  const set = new Set<string>();
  for (const c of classes) {
    if (Array.isArray(c)) {
      for (const s of c) {
        const v = typeof s === 'string' ? s.trim() : '';
        if (!v) continue;
        for (const token of v.split(/\s+/)) {
          if (token) set.add(token);
        }
      }
      continue;
    }
    const v = typeof c === 'string' ? c.trim() : '';
    if (!v) continue;
    // split by whitespace in case callers pass pre-joined strings
    for (const token of v.split(/\s+/)) {
      if (token) set.add(token);
    }
  }
  return Array.from(set).join(' ');
};

// BEM factory to simplify usage in components
export const createBem = (prefix: string, blockName: string) => {
  const base = `${prefix}-${blockName}`;
  return {
    b: (): string[] => [base],
    m: (modifier?: string | false | null): string[] =>
      modifier ? [`${base}--${modifier}`] : [],
    e: (element: string): string[] => [`${base}__${element}`],
    em: (element: string, modifier?: string | false | null): string[] =>
      modifier ? [`${base}__${element}--${modifier}`] : [],
    join: (...parts: Array<string | string[] | false | null | undefined>): string =>
      dedupeJoin(parts),
  };
};
