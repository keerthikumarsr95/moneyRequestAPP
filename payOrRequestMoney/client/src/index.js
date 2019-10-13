import React from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import socket from './sockets';

import App from './app';
import { setAuthHeaders } from './actions/authActions';

setAuthHeaders();

ReactDOM.render(
  <App />
  , document.getElementById('app'));