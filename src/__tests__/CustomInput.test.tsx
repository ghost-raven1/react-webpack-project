import React from 'react';
import { render, screen } from '@testing-library/react';
import { DossierProvider } from '../contexts/DossierAntdContext';
import { CustomInput } from '../components/CustomInput';

jest.mock('antd', () => ({
  __esModule: true,
  Input: (props: any) => <input {...props} />,
  ConfigProvider: ({ children }: any) => <>{children}</>,
}));

describe('CustomInput', () => {
  const renderWithProvider = (ui: React.ReactNode, prefix?: string) =>
    render(<DossierProvider prefix={prefix}>{ui}</DossierProvider>);

  test('renders with block and element classes (default prefix)', () => {
    const { container } = renderWithProvider(<CustomInput label="Name" name="name" />);

    const root = container.querySelector('.dossier-input') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass('dossier-input--medium');

    const label = screen.getByText('Name');
    expect(label).toHaveClass('dossier-input__label');

    const field = screen.getByRole('textbox');
    expect(field).toHaveClass('dossier-input__field');
  });

  test('applies element modifiers for borderless and error variant', () => {
    renderWithProvider(
      <CustomInput label="Email" name="email" borderless variant="error" />
    );

    const field = screen.getByRole('textbox');
    expect(field).toHaveClass('dossier-input__field');
    expect(field).toHaveClass('dossier-input__field--borderless');
    expect(field).toHaveClass('dossier-input__field--error');
  });

  test('renders error text and hides help when error present', () => {
    renderWithProvider(
      <CustomInput label="Age" name="age" error="Required" help="Help text" />
    );

    expect(screen.getByText('Required')).toHaveClass('dossier-input__error');
    expect(screen.queryByText('Help text')).toBeNull();
  });

  test('uses custom prefix for all classes', () => {
    const { container } = renderWithProvider(<CustomInput label="City" name="city" />, 'crm');

    const root = container.querySelector('.crm-input') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root).toHaveClass('crm-input--medium');

    const field = screen.getByRole('textbox');
    expect(field).toHaveClass('crm-input__field');
  });
});
