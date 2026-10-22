import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

/**
 * 落地页（封面页）配置：
 *   - 打开站点时若 URL 没有 hash（如直接双击 index.html / 单文件版），
 *     会先用 history.replaceState 落到该路由，保证评委第一眼看到的是卷首封面。
 *   - 已有 hash（带 #/archive 之类的深链、刷新、收藏链接）一律不干预。
 *   - 想跳过封面直接进首页：把 LANDING_ROUTE 改成 '' 即可。
 */
const LANDING_ROUTE = '/cover';

if (!window.location.hash && LANDING_ROUTE) {
  window.history.replaceState(null, '', `#${LANDING_ROUTE}`);
}

// HashRouter：URL 带 #，构建后任意静态托管 / 本地服务均可直接运行，无需服务端重写规则
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
