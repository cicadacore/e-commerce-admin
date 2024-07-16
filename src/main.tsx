import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { antdConfig } from './constants';
import Loader from './components/loader';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider {...antdConfig}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ConfigProvider>
  </React.StrictMode>
);
