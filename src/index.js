import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import 'antd/dist/antd.css';
import "./style.css";
import './styles/prefixAgnostic.less';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
