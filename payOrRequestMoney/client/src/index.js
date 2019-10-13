import React from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import socket from './sockets';

import { setAuthHeaders } from './actions/authActions';

import App from './app';

setAuthHeaders();

ReactDOM.render(<App />, document.getElementById('app'));