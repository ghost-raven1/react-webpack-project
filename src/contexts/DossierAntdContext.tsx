// src/DossierAntdContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';

interface DossierContext {
  prefix: string;        // например: "dossier", "crm", "admin"
  prefixCsl?: string;    // для --prefix-csl (по умолчанию = prefix)
}

const DossierContext = createContext<DossierContext | undefined>(undefined);

interface DossierProviderProps {
  children: ReactNode;
  prefix?: string;
  prefixCsl?: string;
  antdConfig?: ConfigProviderProps;
  strict?: boolean; // DEV-only: throw on invalid kebab-case
}

export const DossierProvider: React.FC<DossierProviderProps> = ({
  children,
  prefix = 'dossier',
  prefixCsl,
  antdConfig = {},
  strict = false,
}) => {
  const parent = useContext(DossierContext);

  // kebab-case validation: lowercase letters, numbers, single hyphens; no start/end hyphen
  const kebabRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const effectivePrefix = prefix || 'dossier';
  const effectivePrefixCsl = (prefixCsl ?? effectivePrefix) || 'dossier';

  const isDev = process.env.NODE_ENV !== 'production';
  if (parent) {
    // nested provider warning to help avoid accidental double scoping
    // eslint-disable-next-line no-console
    console.warn('[DossierProvider] Nested provider detected. Styles are already scoped by the outer provider.');
  }
  if (!kebabRe.test(effectivePrefix)) {
    if (strict && isDev) {
      throw new Error(`[DossierProvider] Invalid prefix: "${effectivePrefix}". Use kebab-case, e.g., "dossier" or "crm-admin".`);
    } else {
      // eslint-disable-next-line no-console
      console.warn('[DossierProvider] Invalid `prefix` value. Use kebab-case (e.g., "dossier", "crm-admin"). Received:', effectivePrefix);
    }
  }
  if (!kebabRe.test(effectivePrefixCsl)) {
    if (strict && isDev) {
      throw new Error(`[DossierProvider] Invalid prefixCsl: "${effectivePrefixCsl}". Use kebab-case.`);
    } else {
      // eslint-disable-next-line no-console
      console.warn('[DossierProvider] Invalid `prefixCsl` value. Use kebab-case. Received:', effectivePrefixCsl);
    }
  }

  const contextValue: DossierContext = useMemo(() => ({
    prefix: effectivePrefix,
    prefixCsl: effectivePrefixCsl,
  }), [effectivePrefix, effectivePrefixCsl]);

  return (
    <DossierContext.Provider value={contextValue}>
      <ConfigProvider {...antdConfig}>
        <div data-dossier-scope={effectivePrefix}>
          {children}
        </div>
      </ConfigProvider>
    </DossierContext.Provider>
  );
};

export const useDossierPrefix = (): DossierContext => {
  const ctx = useContext(DossierContext);
  if (!ctx) {
    throw new Error('useDossierPrefix must be used within DossierProvider');
  }
  return ctx;
};
