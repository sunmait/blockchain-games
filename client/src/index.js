import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './components/containers/Router';
import 'react-notifications/lib/notifications.css';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);