import React from 'react';
import { ConfigProvider } from 'antd';
import { PrefixTestPage } from './components/PrefixTestPage';

function App() {
  return (
    <ConfigProvider>
      <PrefixTestPage />
    </ConfigProvider>
  );
}

export default App;