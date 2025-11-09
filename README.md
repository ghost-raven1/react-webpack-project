# Dossier UI (React + Webpack)

Минимальная демонстрация изолированных стилей для микрофронтендов (single-spa) и библиотечного использования.

## Оглавление

- Обзор и принципы
- Быстрый старт
- Интеграция в библиотеку
- Утилиты
- Хуки
- Контексты
- Компоненты (пример)
- Миграция и быстрый гайд
- Типичные ошибки
- Чеклист single‑spa
- Примечания

## Ключевое

- Скоуп‑селектор: стили замкнуты в контейнере `[data-dossier-scope]`.
- Контейнер: `DossierProvider` оборачивает детей в `<div data-dossier-scope={prefix}>`.
- Классы компонентов: формируются как `${prefix}-*` через `bem-cn` на основе префикса из контекста.
- Анти‑утечка: стили применяются только внутри контейнера с атрибутом `data-dossier-scope`, не пересекаются с соседними приложениями/микрофронтендами.

## Как это работает

- Контейнерный атрибут: в `src/contexts/DossierAntdContext.tsx` `DossierProvider` рендерит `<div data-dossier-scope={prefix}>`. Значение `prefix` помогает в дебаге (может отличаться между зонами), но селекторы завязаны лишь на наличие атрибута.
- Селекторы в LESS:
  - Кнопка: `src/components/CustomButton.less` — `[data-dossier-scope] .ant-btn.c-button { ... }` + модификаторы `.c-button--primary/secondary/danger/small/middle/large`.
  - Инпут: `src/components/CustomInput.less` — `[data-dossier-scope] .c-input { ... }` + модификаторы `.c-input__field--borderless/error/success/warning`, размеры `.c-input--small/large` и лейблы `.c-input__label(--required)`.
- Компоненты:
  - `CustomButton.tsx` — добавляет статические классы `c-button` и модификаторы по `variant/uiSize`. Для AntD корректно маппит размер: `'medium' -> 'middle'`.
  - `CustomInput.tsx` — добавляет классы `c-input*`, состояния и условный `--required` без прокидывания лишних пропов в DOM.
- Хук: `useDossierAntd` предоставляет `prefix` и вспомогательную `getClassName`, но классы компонентов статические — это повышает производительность и предсказуемость.

### Настраиваемый префикс классов
- Компоненты добавляют классы только с вашим префиксом из контекста (`prefix`).
- Пример: если `prefix="crm"`, то кнопка получит классы `crm-button crm-button--primary crm-button--medium`.
- Изоляция по контейнеру (`[data-dossier-scope]`) остаётся строгой и не зависит от значения префикса классов.

Пример
```tsx
<DossierProvider prefix="crm">
  <CustomButton variant="primary" />
</DossierProvider>
```

## Почему это надёжно для single-spa и библиотек

- Изоляция CSS: селекторы начинаются с `[data-dossier-scope]`, поэтому не матчатся за пределами контейнера.
- Нет динамических префиксов в `className`: поддержка проще, меньше уникальных селекторов, выше производительность.
- Совместимость: работает как внутри npm‑библиотеки, так и в host‑приложении. Достаточно обернуть содержимое в `DossierProvider`.

## Использование

1. Установите зависимости и запустите dev‑сервер:
   - `npm install`
   - `npm run dev`
   - Откройте `http://localhost:8080/`
2. Минимальная демо‑страница: `src/components/PrefixTestPage.tsx`
   - Введите префикс или выберите пресет.
   - Стили компонентов применяются только внутри контейнера выбранного префикса.

## Быстрый старт (минимум настроек)
- Импортируйте базовые стили Ant Design в точке входа: `import 'antd/dist/antd.css'`.
- Оберните ваш UI в `DossierProvider`:
  ```tsx
  <DossierProvider prefix="crm">
    <YourWidget />
  </DossierProvider>
  ```
- Используйте компоненты с готовыми `.less`: `CustomButton`, `CustomInput`.
- Больше ничего настраивать не нужно: изоляция обеспечивается атрибутом `[data-dossier-scope]`.

## Миграция с существующих решений
- Если у вас были динамические классы (например, `crm-button`), укажите `prefix="crm"` — компоненты добавят эти классы автоматически.
- Если вы опирались на глобальные селекторы, перенесите логику в область контейнера: используйте `[data-dossier-scope]` в ваших стилях или замкните стили внутри `DossierProvider`.
- Для AntD v4 удалите использование пропа `theme` у `ConfigProvider` — тема не прокидывается из провайдера.
- Проверка: классы элементов должны содержать `${prefix}-*`, а стили применяться только внутри контейнера провайдера.

### Наложение на чистые AntD компоненты (без наших классов)
- Кнопки: внутри `[data-dossier-scope]` добавлены селекторы, которые оверлеят стили на чистые AntD кнопки:
  - База — `[data-dossier-scope] .ant-btn`.
  - Варианты — `.ant-btn-primary` (как `primary`), `.ant-btn-dangerous` (как `danger`), `.ant-btn-dashed` (как `secondary`).
  - Размеры — `.ant-btn-sm`, `.ant-btn-lg`.
  Это позволяет использовать `<Button>` из AntD без добавления `className`, при этом изоляция сохраняется.
- Инпуты: внутри `[data-dossier-scope]` базовые стили применяются к `.ant-input` и `.ant-input-affix-wrapper` (hover/focus, рамка, фон). Состояния (`error/success/warning`) и режим `borderless` управляются префиксованными классами `${prefix}-*`.
- Рекомендуем миграцию поэтапно:
  1) Обернуть зону в `DossierProvider` и проверить чистые AntD компоненты.
  2) Для расширенных состояний добавить статические классы через утилиту `csl.ts` или наши компоненты‑обёртки.
3) Если ранее использовались `c-*`, обновите стили на `${prefix}-*`.

## Чеклист интеграции в single-spa
- Подключены базовые стили Ant Design в host‑приложении.
- Микрофронтенд монтируется внутри `DossierProvider` (префикс можно задавать уникальный для каждой зоны):
  ```tsx
  <DossierProvider prefix="crm" prefixCsl="crm">
    <MicrofrontendRoot />
  </DossierProvider>
  ```
- Стили не выходят за пределы контейнера: селекторы начинаются с `[data-dossier-scope]`.
- Тесты и аналитика могут использовать `${prefix}-*` классы.

### Мини‑пример single‑spa: mount/unmount

Встраивание микрофронтенда с изолированными стилями. Пример embed‑кода, который можно использовать в host‑приложении или как часть single‑spa lifecycles:

```tsx
// src/mfe-embed.tsx
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DossierProvider } from './src/contexts/DossierAntdContext';
import { MicrofrontendRoot } from './src/App';

let root: Root | null = null;

export function mount(el: HTMLElement, options?: { prefix?: string }) {
  const { prefix = 'crm' } = options || {};
  root = createRoot(el);
  root.render(
    <DossierProvider prefix={prefix}>
      <MicrofrontendRoot />
    </DossierProvider>
  );
}

export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

// host‑код:
// const container = document.getElementById('mfe-crm');
// mount(container!, { prefix: 'crm' });
// ... позже:
// unmount();
```

Стили остаются внутри контейнера, куда вы смонтировали компонент, благодаря атрибуту `data-dossier-scope` из провайдера.

## Интеграция в библиотеку

- Обёртка: экспортируйте/используйте `DossierProvider` вокруг вашего компонента/виджета.
- Стили: подключите ваши `.less` со скоупом `[data-dossier-scope]` и префиксованными классами `${prefix}-*`.
- AntD: укажите `antd` в `peerDependencies` вашей библиотеки, а подключение базовых стилей (`antd/dist/antd.css`) оставьте на host‑приложение.

## Утилиты

- `csl.ts`: вспомогательные функции для статических классов `${prefix}-*` и нормализации префикса.
  - `getCssPrefix(value)`: нормализует префикс, дефолт — `dossier`.
  - Для генерации BEM‑классов используем `bem-cn` непосредственно в компонентах.

- `antdMap.ts`: мапперы для интеграции с AntD
  - `mapVariantToAntd(variant, incoming?)`: переводит `Variant` в `ButtonProps['type']` и `danger`, учитывая входящие пропсы.
  - `mapSizeToAntd(uiSize, incoming?)`: переводит `UiSize` (`small|medium|large`) в `AntdSize` (`small|middle|large`).

- `devAttrs.ts`: DEV‑атрибуты для дебага
  - `devAttrs(attrs)`: возвращает `data-*` атрибуты только в DEV. В PROD — пустой объект.

### DEV‑атрибуты для дебага
- В компонентах добавляются `data-*` через `devAttrs` только в режиме разработки (`NODE_ENV !== 'production'`). В продакшене они не рендерятся, чтобы уменьшить шум в HTML.

## Хуки

- `useUiSize(uiSize?, antdSize?)`: унифицирует вывод размера.
  - Возвращает `{ uiSizeFinal, antdSizeFinal }`, где `medium` → `middle` для AntD.
- `useDossierAntd()`: предоставляет `{ prefix, prefixCsl, getClassName }`.

## Контексты

- `DossierProvider`: оборачивает ваш UI и рендерит `<div data-dossier-scope={prefix}>` для изоляции стилей.
  - Пропсы: `prefix`, `prefixCsl`, `antdConfig`, `strict` (см. раздел ниже).
- `useDossierPrefix()`: возвращает значения префиксов из контекста.

## Компоненты (пример)

- `CustomButton`, `CustomInput`, `CustomSelect`
  - Используют `bem-cn` для классов и `useUiSize` для размеров.
  - `CustomButton`: `variant` маппится в тип/danger AntD кнопки.
  - `CustomInput`/`CustomSelect`: поддерживают `label`, `help`, `required`; в DEV рендерят полезные `data-*` атрибуты.

## Примеры интеграции AntD компонентов

Ниже — практические примеры использования AntD внутри `DossierProvider`. Важно:
- Импортируйте базовые стили: `import 'antd/dist/antd.css'` в точке входа.
- Оборачивайте зону в `DossierProvider`. Для единых классов можно задать `antdConfig={{ prefixCls: prefix }}`.

Минимальная обёртка:
```tsx
import React from 'react';
import { DossierProvider } from './src/contexts/DossierAntdContext';

export function Demo() {
  return (
    <DossierProvider prefix="crm" antdConfig={{ prefixCls: 'crm' }}>
      {/* здесь рендерим AntD компоненты */}
    </DossierProvider>
  );
}
```

### Button
```tsx
import { Button, Space } from 'antd';

function Buttons() {
  return (
    <Space>
      <Button>Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="dashed">Dashed</Button>
      <Button danger>Danger</Button>
      <Button type="primary" size="large">Large</Button>
    </Space>
  );
}
```

Если используете `CustomButton`, маппинг вариантов делается автоматически:
```tsx
import { CustomButton } from './src/components/CustomButton';

<CustomButton variant="primary" uiSize="large">Сохранить</CustomButton>
```

### Input
```tsx
import { Input, Space } from 'antd';

function Inputs() {
  return (
    <Space direction="vertical" style={{ width: 280 }}>
      <Input placeholder="Name" size="middle" />
      <Input.Password placeholder="Password" size="middle" />
      <Input addonBefore="+1" placeholder="Phone" />
    </Space>
  );
}
```

### Select
```tsx
import { Select } from 'antd';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

function Selects() {
  return (
    <Select options={options} placeholder="Choose" style={{ width: 200 }} size="middle" />
  );
}
```

### Checkbox
```tsx
import { Checkbox } from 'antd';

function Checkboxes() {
  return (
    <>
      <Checkbox>Accept terms</Checkbox>
      <Checkbox defaultChecked>Newsletter</Checkbox>
    </>
  );
}
```

### Radio
```tsx
import { Radio } from 'antd';

function Radios() {
  return (
    <Radio.Group defaultValue="m">
      <Radio value="s">Small</Radio>
      <Radio value="m">Middle</Radio>
      <Radio value="l">Large</Radio>
    </Radio.Group>
  );
}
```

### Form (вертикальная валидация)
```tsx
import { Form, Input, Button } from 'antd';

function LoginForm() {
  const onFinishFailed = () => {/* демонстрация стилей ошибок */};
  return (
    <Form layout="vertical" onFinishFailed={onFinishFailed} style={{ width: 320 }}>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}> 
        <Input placeholder="mail@example.com" />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}> 
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Login</Button>
      </Form.Item>
    </Form>
  );
}
```

Примечания к стилям:
- Для `Checkbox`, `Radio` и ошибок `Form.Item` добавлены префикс‑агностичные оверлеи в `src/styles/prefixAgnostic.less`.
- Для других AntD компонентов используйте тот же принцип: 
  внутри `[data-dossier-scope]` добавляйте селекторы вида `[class*='-tabs']`, `[class*='-modal']` и т.п., чтобы сохранить изоляцию без жёсткой привязки к `prefixCls`.

## Примеры стилей (LESS) для AntD

Все селекторы примерные и префикс‑агностичные: работают с любым `prefixCls` (`ant-`, `crm-`, `admin-`). Ключевой контейнер — `[data-dossier-scope]`.

### Button
```less
[data-dossier-scope] {
  [class*='-btn'] {
    border-radius: 6px;
  }
  [class*='-btn-primary'] {
    background: #722ed1;
    border-color: #722ed1;
  }
  [class*='-btn-primary']:hover {
    background: #531dab;
    border-color: #531dab;
  }
  [class*='-btn-sm'] { padding: 0 12px; }
  [class*='-btn-lg'] { padding: 0 20px; }
}
```

### Input
```less
[data-dossier-scope] {
  [class*='-input'] { transition: all .2s ease; }
  [class*='-input-affix-wrapper'] { border-radius: 6px; }
  [class*='-input-focused'], [class*='-input-affix-wrapper']:hover {
    border-color: #722ed1;
    box-shadow: 0 0 0 2px rgba(114, 46, 209, .15);
  }
}
```

### Select
```less
[data-dossier-scope] {
  [class*='-select'] [class*='-select-selector'] {
    border-radius: 6px;
  }
  [class*='-select']:hover [class*='-select-selector'] {
    border-color: #722ed1;
  }
  [class*='-select-sm'] [class*='-select-selector'] { min-height: 24px; }
  [class*='-select-lg'] [class*='-select-selector'] { min-height: 40px; }
}
```

### Checkbox
```less
[data-dossier-scope] {
  [class*='-checkbox'] {
    [class*='-checkbox-inner'] {
      border: 1px solid #d3adf7; border-radius: 2px; transition: all .2s ease;
    }
    &:hover [class*='-checkbox-inner'] { border-color: #531dab; }
    &[class*='-checkbox-checked'] [class*='-checkbox-inner'] {
      background-color: #722ed1; border-color: #722ed1;
    }
  }
}
```

### Radio
```less
[data-dossier-scope] {
  [class*='-radio'] {
    [class*='-radio-inner'] { border: 1px solid #d3adf7; transition: all .2s ease; }
    &:hover [class*='-radio-inner'] { border-color: #531dab; }
    &[class*='-radio-checked'] [class*='-radio-inner'] { border-color: #722ed1; }
  }
}
```

### Form Item (ошибки)
```less
[data-dossier-scope] {
  [class*='-form-item'] { margin-bottom: 16px; }
  [class*='-form-item-has-error'] {
    [class*='-form-item-explain'] { color: #eb2f96; }
    [class*='-input'], [class*='-select'] [class*='-select-selector'] {
      border-color: #eb2f96; box-shadow: 0 0 0 2px rgba(235,47,150,.2);
    }
  }
}
```

### Tabs
```less
[data-dossier-scope] {
  [class*='-tabs'] {
    [class*='-tabs-tab'] { padding: 10px 16px; }
    [class*='-tabs-tab-active'] { color: #722ed1; }
    [class*='-tabs-ink-bar'] { background: #722ed1; }
  }
}
```

### Modal
```less
[data-dossier-scope] {
  [class*='-modal'] {
    [class*='-modal-header'] { border-bottom: 1px solid #f0f0f0; }
    [class*='-modal-footer'] { border-top: 1px solid #f0f0f0; }
    [class*='-modal-content'] { border-radius: 8px; }
  }
}
```

### Tooltip
```less
[data-dossier-scope] {
  [class*='-tooltip'] [class*='-tooltip-inner'] {
    border-radius: 6px; background: #1f1f1f; color: #fff;
  }
}
```

### DatePicker
```less
[data-dossier-scope] {
  [class*='-picker'] {
    [class*='-picker-input'] { border-radius: 6px; }
    [class*='-picker-panel'] [class*='-picker-cell-selected'] {
      background: rgba(114,46,209,.12);
    }
  }
}
```

### Switch
```less
[data-dossier-scope] {
  [class*='-switch'] { background: #bfbfbf; }
  [class*='-switch-checked'] { background: #722ed1; }
}
```

### Table
```less
[data-dossier-scope] {
  [class*='-table'] {
    [class*='-table-thead'] [class*='-table-cell'] { background: #fafafa; }
    [class*='-table-row']:hover { background: #f5f0ff; }
  }
}
```

## Дополнительные снипеты (AntD v4.18.9)

Ниже — краткие префикс‑агностичные примеры для остальных часто используемых компонентов. Кастомизируйте значения под вашу палитру.

### Alert
```less
[data-dossier-scope] {
  [class*='-alert'] { border-radius: 6px; }
  [class*='-alert-message'] { font-weight: 600; }
  [class*='-alert-description'] { color: #595959; }
}
```

### Badge
```less
[data-dossier-scope] {
  [class*='-badge'] [class*='-badge-count'] { background: #722ed1; }
}
```

### Breadcrumb
```less
[data-dossier-scope] {
  [class*='-breadcrumb'] { color: #8c8c8c; }
  [class*='-breadcrumb-link'] { color: #722ed1; }
}
```

### Card
```less
[data-dossier-scope] {
  [class*='-card'] { border-radius: 8px; }
  [class*='-card-head'] { border-bottom: 1px solid #f0f0f0; }
  [class*='-card-body'] { padding: 16px; }
}
```

### Carousel
```less
[data-dossier-scope] {
  [class*='-carousel'] { background: #ffffff; }
}
```

### Cascader
```less
[data-dossier-scope] {
  [class*='-cascader'] [class*='-cascader-menu'] { min-width: 160px; }
}
```

### Collapse
```less
[data-dossier-scope] {
  [class*='-collapse'] [class*='-collapse-header'] { font-weight: 600; }
  [class*='-collapse'] [class*='-collapse-content'] { background: #fafafa; }
}
```

### Descriptions
```less
[data-dossier-scope] {
  [class*='-descriptions'] [class*='-descriptions-item'] { padding: 8px 0; }
}
```

### Drawer
```less
[data-dossier-scope] {
  [class*='-drawer'] [class*='-drawer-content'] { border-radius: 8px; }
  [class*='-drawer'] [class*='-drawer-header'] { border-bottom: 1px solid #f0f0f0; }
}
```

### Dropdown
```less
[data-dossier-scope] {
  [class*='-dropdown'] [class*='-dropdown-menu'] { border-radius: 8px; }
}
```

### Empty
```less
[data-dossier-scope] {
  [class*='-empty'] { color: #8c8c8c; }
}
```

### Grid / Layout
```less
[data-dossier-scope] {
  [class*='-row'] { row-gap: 12px; }
  [class*='-layout'] [class*='-layout-header'] { background: #f5f5f5; }
  [class*='-layout'] [class*='-layout-content'] { padding: 16px; }
}
```

### List
```less
[data-dossier-scope] {
  [class*='-list'] [class*='-list-item'] { padding: 12px 16px; }
}
```

### Menu
```less
[data-dossier-scope] {
  [class*='-menu'] [class*='-menu-item-selected'] { background: #f5f0ff; }
}
```

### Pagination
```less
[data-dossier-scope] {
  [class*='-pagination'] [class*='-pagination-item'] { border-radius: 4px; }
  [class*='-pagination'] [class*='-pagination-item-active'] { border-color: #722ed1; }
}
```

### Popconfirm
```less
[data-dossier-scope] {
  [class*='-popconfirm'] { border-radius: 8px; }
  [class*='-popconfirm-message'] { color: #595959; }
}
```

### Popover
```less
[data-dossier-scope] {
  [class*='-popover'] [class*='-popover-inner'] { border-radius: 8px; }
}
```

### Progress
```less
[data-dossier-scope] {
  [class*='-progress'] [class*='-progress-bg'] { background: #722ed1; }
}
```

### Result
```less
[data-dossier-scope] {
  [class*='-result'] [class*='-result-title'] { font-weight: 600; }
}
```

### Skeleton
```less
[data-dossier-scope] {
  [class*='-skeleton'] [class*='-skeleton-title'] { width: 60%; }
}
```

### Slider
```less
[data-dossier-scope] {
  [class*='-slider'] [class*='-slider-handle'] { border-color: #722ed1; }
  [class*='-slider'] [class*='-slider-track'] { background: #722ed1; }
}
```

### Spin
```less
[data-dossier-scope] {
  [class*='-spin'] [class*='-spin-dot'] { color: #722ed1; }
}
```

### Statistic
```less
[data-dossier-scope] {
  [class*='-statistic'] [class*='-statistic-content'] { font-weight: 600; }
}
```

### Steps
```less
[data-dossier-scope] {
  [class*='-steps'] [class*='-steps-item-active'] { color: #722ed1; }
}
```

### Tag
```less
[data-dossier-scope] {
  [class*='-tag'] { border-radius: 4px; }
}
```

### Timeline
```less
[data-dossier-scope] {
  [class*='-timeline'] [class*='-timeline-item'] { padding: 8px 0; }
}
```

### Tree / TreeSelect
```less
[data-dossier-scope] {
  [class*='-tree'] [class*='-tree-node-selected'] { background: #f5f0ff; }
  [class*='-tree-select'] [class*='-select-selector'] { border-radius: 6px; }
}
```

### Upload
```less
[data-dossier-scope] {
  [class*='-upload'] [class*='-upload-list'] { row-gap: 8px; }
}
```

### Avatar
```less
[data-dossier-scope] {
  [class*='-avatar'] { border-radius: 50%; }
}
```

### AutoComplete
```less
[data-dossier-scope] {
  [class*='-auto-complete'] [class*='-select-selector'] { border-radius: 6px; }
}
```

### Affix / Anchor / BackTop / Divider
```less
[data-dossier-scope] {
  [class*='-affix'] { z-index: 10; }
  [class*='-anchor'] [class*='-anchor-link'] { color: #722ed1; }
  [class*='-back-top'] { border-radius: 50%; }
  [class*='-divider'] { border-color: #f0f0f0; }
}
```

## Миграция и быстрый гайд

- Оберните зону UI в `DossierProvider`:
  ```tsx
  <DossierProvider prefix="crm">
    <YourWidget />
  </DossierProvider>
  ```
- Перенесите стили под скоуп `[data-dossier-scope]` и используйте статические классы `${prefix}-${block}`:
  ```less
  [data-dossier-scope] .ant-input.crm-input__field { /* ... */ }
  [data-dossier-scope] .crm-input__field--error { /* ... */ }
  ```
- Формируйте `className` через `bem-cn`: `setup({ ns: prefix + '-' })` и `block('input')(mods)`.
- Унифицируйте размер через `useUiSize(uiSize, size)` и используйте `antdSizeFinal` для пропа `size`.
- Для кнопок применяйте `mapVariantToAntd(variant, { type, danger })`.
- Добавляйте `data-*` только через `devAttrs(...)`, чтобы они не попадали в продакшен.

## Типичные ошибки

- Забытый `DossierProvider`
  - Симптомы: хук `useDossierAntd` возвращает пустые значения или падает; классы без префикса; стили «не цепляются».
  - Причина: компоненты рендерятся вне контейнера `[data-dossier-scope]` и без контекстного значения `prefix`.
  - Решение:
    ```tsx
    <DossierProvider prefix="crm">
      <YourWidget />
    </DossierProvider>
    ```

- Конфликт префиксов `prefix` vs `prefixCsl`
  - Симптомы: классы формируются как `admin-*`, а стили/селекторы привязаны к контейнеру `crm` (или наоборот).
  - Причина: в провайдере заданы разные значения `prefix` и `prefixCsl`, а стили/компоненты ожидают одно и то же пространство имён.
  - Решение: выровнять значения и стили:
    ```tsx
    <DossierProvider prefix="crm"> ... </DossierProvider>
    // Либо осознанно различать: контейнер — crm, классы — admin, и скорректировать стили.
    ```

- Отсутствие скоупа в стилях
  - Симптомы: утечка стилей в другие микрофронтенды, неожиданные переопределения.
  - Причина: селекторы без контейнерного префикса `[data-dossier-scope]`.
  - Решение:
    ```less
    [data-dossier-scope] .ant-input.crm-input__field { /* ... */ }
    [data-dossier-scope] .crm-button--primary { /* ... */ }
    ```

- Несогласованный размер между UI и AntD
  - Симптомы: компонент визуально «не попадает» в целевой размер; AntD получает неподдерживаемый `size`.
  - Причина: прямое пробрасывание `uiSize` в проп `size` AntD или смешивание источников размера.
  - Решение: использовать `useUiSize` и `antdSizeFinal`:
    ```ts
    const { uiSizeFinal, antdSizeFinal } = useUiSize(uiSize, size);
    <Input size={antdSizeFinal} className={bem.m(uiSizeFinal)} />
    ```

- Дублирование/конфликт `variant` и ручных пропсов кнопки
  - Симптомы: `type` и `danger` на `Button` конфликтуют с `variant`.
  - Причина: одновременно задаются маппинг из `variant` и ручные значения.
  - Решение: один источник правды — `mapVariantToAntd` с учётом входящих пропсов:
    ```ts
    const mapped = mapVariantToAntd(variant, { type, danger });
    <Button {...mapped} />
    ```

- Несоответствие BEM‑блока и стилей
- Симптомы: классы формируются, но стили не применяются; блок `select`, а стили — для `input` или другого префикса/блока.
- Причина: разный BEM‑блок и/или несовпадающий префикс; убедитесь, что блоки и `${prefix}` совпадают между компонентом и стилями.
  - Решение: привести к одному варианту и синхронизировать блоки (`block = 'select'` → `.crm-select__...`).

- DEV‑атрибуты попадают в прод
  - Симптомы: заметные `data-*` в итоговой разметке продакшена.
  - Причина: некорректная сборка или окружение не задаёт `NODE_ENV=production`.
  - Решение: проверите конфиг сборки, убедитесь, что `process.env.NODE_ENV === 'production'`. Используйте `devAttrs(...)` для безопасного рендера атрибутов только в DEV.

- Неопределённые LESS‑переменные
  - Симптомы: ошибка сборки вида `variable @text-color-secondary is undefined`.
  - Причина: переменная не импортирована или отсутствует в палитрах.
  - Решение: определите нужные переменные в вашем проекте и импортируйте их в соответствующие `.less` файлы, либо используйте жёсткие значения как фолбэк:
    ```less
    .crm-input__help { color: #2f1b4d; /* пример фолбэка */ }
    ```

## Гварды контекста и Strict Mode

- Валидация `prefix`/`prefixCsl`: разрешён только kebab‑case (`a-z0-9` и `-`, без дефиса в начале/конце). При нарушении — предупреждение в консоли.
- Предупреждение о вложенных `DossierProvider`: если провайдеры вложены, логируется предупреждение, чтобы избежать двойного скопинга и лишней сложности.
- Strict Mode: у `DossierProvider` есть проп `strict?: boolean`. В режиме разработки (`NODE_ENV !== 'production'`), при `strict={true}` невалидные `prefix/prefixCsl` вызывают `throw Error` — удобно в CI/локальной отладке.

Пример:
```tsx
<DossierProvider prefix="crm-admin" strict>
  <App />
</DossierProvider>
```

### Кебаб‑гид
- Валидный префикс: только строчные буквы/цифры и одинарные дефисы между сегментами: `crm`, `crm-admin`, `mfe1-ui`.
- Невалидно: `CRM`, `crm_admin`, `-crm`, `crm-`, `crm--admin`.

## Демонстрация «анти‑утечки» и «смена префикса на лету»

- На странице `PrefixTestPage.tsx` есть две колонки: слева — вне `DossierProvider` (стили не применяются), справа — внутри (стили изолированы).
- В правой колонке можно менять `prefix` в реальном времени: изменится только `className` (`${prefix}-*`), при этом изоляция останется прежней.

## Примечания

### PrefixCls‑совместимость
- Стили ориентированы на префикс‑агностичные селекторы вида `[class*='-xxx']` внутри контейнера `[data-dossier-scope]`.
- Это позволяет использовать любой `prefixCls` в AntD (`ant-`, `dossier-ant-`, `admin-` и т.д.) без правок стилей.
- Примеры:
  - Кнопки: `[class*='-btn']`, `[class*='-btn-primary']`, `[class*='-btn-lg']`.
  - Инпуты: `[class*='-input']`, `[class*='-input-affix-wrapper']`, `[class*='-input-focused']`.
  - Селекты: `[class*='-select'] [class*='-select-selector']`, `[class*='-select-sm']`, `[class*='-select-lg']`.
  - Чекбоксы: `[class*='-checkbox']`, `[class*='-checkbox-checked']`, `[class*='-checkbox-inner']`.
  - Радио: `[class*='-radio']`, `[class*='-radio-checked']`, `[class*='-radio-inner']`.
  - Формы: `[class*='-form-item']`, `[class*='-form-item-has-error']`, `[class*='-form-item-explain']`.

- Для AntD v4 проп `theme` у `ConfigProvider` отсутствует — тема не прокидывается из провайдера.
- Если нужны разные зоны с разными префиксами — монтируйте несколько `DossierProvider`, стили останутся изолированными.
