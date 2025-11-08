export const devAttrs = (
  attrs: Record<string, string | number | boolean | undefined>
): Record<string, string | number | boolean> => {
  if (process.env.NODE_ENV === 'production') return {};
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined) out[k] = v as string | number | boolean;
  }
  return out;
};

