import React from 'react';
import { render, screen } from '@testing-library/react';
import { DossierProvider } from '../contexts/DossierAntdContext';
import { CustomButton } from '../components/CustomButton';

jest.mock('antd', () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
  ConfigProvider: ({ children }: any) => <>{children}</>,
}));

describe('CustomButton', () => {
  const renderWithProvider = (ui: React.ReactNode, prefix?: string) =>
    render(<DossierProvider prefix={prefix}>{ui}</DossierProvider>);

  test('renders with default classes (prefix dossier, primary, medium)', () => {
    renderWithProvider(<CustomButton>Click</CustomButton>);
    const btn = screen.getByRole('button', { name: /click/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('dossier-button');
    expect(btn).toHaveClass('dossier-button--primary');
    expect(btn).toHaveClass('dossier-button--medium');
  });

  test('applies variant and size modifiers', () => {
    renderWithProvider(
      <CustomButton variant="secondary" uiSize="large">Go</CustomButton>
    );
    const btn = screen.getByRole('button', { name: /go/i });
    expect(btn).toHaveClass('dossier-button');
    expect(btn).toHaveClass('dossier-button--secondary');
    expect(btn).toHaveClass('dossier-button--large');
  });

  test('uses custom prefix from provider', () => {
    renderWithProvider(<CustomButton>Prefixed</CustomButton>, 'crm');
    const btn = screen.getByRole('button', { name: /prefixed/i });
    expect(btn).toHaveClass('crm-button');
    expect(btn).toHaveClass('crm-button--primary');
    expect(btn).toHaveClass('crm-button--medium');
  });
});
