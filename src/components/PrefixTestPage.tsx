import React, { useState } from 'react';
import { Card, Space, Input, Button as AntButton, Typography, Row, Col } from 'antd';
import { DossierProvider } from '../contexts/DossierAntdContext';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';
import { createBem, getCssPrefix } from '../utils/csl';

export const PrefixTestPage: React.FC = () => {
  const [prefix, setPrefix] = useState<string>('dossier');
  const presets = ['dossier', 'admin', 'crm'];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Минимальная демонстрация префикса">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder="Введите префикс"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.trim())}
          />
          <Space>
            {presets.map((p) => (
              <AntButton key={p} onClick={() => setPrefix(p)}>
                {p}
              </AntButton>
            ))}
          </Space>
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
                    <CustomButton variant="primary">Кнопка</CustomButton>
                    <CustomInput label="Инпут" placeholder="Введите текст..." />
                    <Typography.Text type="secondary">
                      Текущий префикс классов: {prefix}
                    </Typography.Text>
                    <Typography.Text code>
                      {(() => {
                        const bemBtn = createBem(getCssPrefix(prefix), 'button');
                        return bemBtn.join(bemBtn.b(), bemBtn.m('primary'));
                      })()}
                    </Typography.Text>
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
