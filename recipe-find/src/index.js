import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './utils/Store';
import reportWebVitals from './reportWebVitals';
import SetupInterceptors from './services/SetupInterceptors';
import App from './App';
import './index.css';
import { ProSidebarProvider } from 'react-pro-sidebar';

const root = ReactDOM.createRoot(document.getElementById('root'));


SetupInterceptors(store);

root.render(
  <Provider store={store}>
    <ProSidebarProvider>
      <App />
    </ProSidebarProvider>
  </Provider>,
  document.getElementById('root')
);



reportWebVitals();