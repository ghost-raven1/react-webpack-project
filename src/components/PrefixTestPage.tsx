import React, { useEffect, useMemo, useState } from 'react';
import { Card, Space, Input, Button as AntButton, Typography, Row, Col, Divider, Tag, Select, Switch } from 'antd';
import { DossierProvider } from '../contexts/DossierAntdContext';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';
// Demo page uses bem-cn inside components; no local BEM helpers needed.

export const PrefixTestPage: React.FC = () => {
  const [prefix, setPrefix] = useState<string>('dossier');
  const presets = ['dossier', 'admin', 'crm'];
  const [btnVariant, setBtnVariant] = useState<'primary' | 'secondary' | 'danger'>('primary');
  const [uiSize, setUiSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [inputVariant, setInputVariant] = useState<'default' | 'error' | 'success' | 'warning'>('default');
  const [borderless, setBorderless] = useState<boolean>(false);

  const randomPrefix = () => {
    const parts = ['alpha', 'beta', 'crm', 'admin', 'ui', 'widget', 'panel'];
    const left = parts[Math.floor(Math.random() * parts.length)];
    const right = parts[Math.floor(Math.random() * parts.length)];
    const next = `${left}-${right}`.replace(/^(.*)-(\1)$/,'$1');
    setPrefix(next);
  };

  const [buttonClass, setButtonClass] = useState<string>('');
  const [inputClass, setInputClass] = useState<string>('');

  // Live inspector: read actual classes inside current scoped provider
  useEffect(() => {
    const scope = document.querySelector(`[data-dossier-scope="${prefix}"]`);
    if (!scope) {
      setButtonClass('');
      setInputClass('');
      return;
    }
    const btnEl = scope.querySelector('[class*="-button"]');
    const inpEl = scope.querySelector('[class*="-input"]');
    setButtonClass(btnEl ? (btnEl as HTMLElement).className : '');
    setInputClass(inpEl ? (inpEl as HTMLElement).className : '');
  }, [prefix, btnVariant, uiSize, inputVariant, borderless]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Демо префикса и изоляции стилей">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Card size="small" bodyStyle={{ padding: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text>Префикс классов</Typography.Text>
              <Space wrap>
                <Input
                  placeholder="Введите префикс (kebab-case)"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.trim())}
                  style={{ maxWidth: 280 }}
                />
                <AntButton onClick={randomPrefix} type="dashed">Случайный</AntButton>
                {presets.map((p) => (
                  <AntButton key={p} onClick={() => setPrefix(p)}>{p}</AntButton>
                ))}
                <Tag color="purple">current: {prefix}</Tag>
              </Space>
              <Divider style={{ margin: '12px 0' }} />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text strong>Кнопка</Typography.Text>
                    <Select
                      value={btnVariant}
                      onChange={(v) => setBtnVariant(v)}
                      options={[
                        { value: 'primary', label: 'primary' },
                        { value: 'secondary', label: 'secondary' },
                        { value: 'danger', label: 'danger' },
                      ]}
                      style={{ width: 160 }}
                    />
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text strong>Размер (UI)</Typography.Text>
                    <Select
                      value={uiSize}
                      onChange={(v) => setUiSize(v)}
                      options={[
                        { value: 'small', label: 'small' },
                        { value: 'medium', label: 'medium' },
                        { value: 'large', label: 'large' },
                      ]}
                      style={{ width: 160 }}
                    />
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text strong>Инпут</Typography.Text>
                    <Select
                      value={inputVariant}
                      onChange={(v) => setInputVariant(v)}
                      options={[
                        { value: 'default', label: 'default' },
                        { value: 'error', label: 'error' },
                        { value: 'success', label: 'success' },
                        { value: 'warning', label: 'warning' },
                      ]}
                      style={{ width: 160 }}
                    />
                    <Space>
                      <Switch checked={borderless} onChange={setBorderless} />
                      <Typography.Text>borderless</Typography.Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Card>
          <Row gutter={16}>
            <Col span={12}>
              {/* Левая колонка: вне провайдера — анти-утечка */}
              <Card size="small" title="Вне DossierProvider (стили не применяются)">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <AntButton type="primary">AntD Primary</AntButton>
                  <Input placeholder="AntD Input" />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              {/* Правая колонка: внутри провайдера — изоляция сохраняется при смене префикса */}
              <Card size="small" title="Внутри DossierProvider (стили изолированы)">
                <DossierProvider prefix={prefix} antdConfig={{ prefixCls: 'dossier-ant' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <CustomButton variant={btnVariant} uiSize={uiSize}>Кнопка</CustomButton>
                    <CustomInput 
                      label="Инпут" 
                      placeholder="Введите текст..." 
                      uiSize={uiSize}
                      variant={inputVariant}
                      borderless={borderless}
                    />
                    <Typography.Text type="secondary">
                      Текущий префикс классов: {prefix}
                    </Typography.Text>
                    {/* Классы формируются внутри компонентов через bem-cn с текущим префиксом */}
                    <Card size="small" title="Live classes" bodyStyle={{ padding: 12 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Typography.Text>
                          Button: <Tag color="geekblue">{buttonClass || '—'}</Tag>
                        </Typography.Text>
                        <Typography.Text>
                          Input: <Tag color="geekblue">{inputClass || '—'}</Tag>
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Space>
                </DossierProvider>
              </Card>
            </Col>
          </Row>
        </Space>
      </Card>
    </div>
  );
};
