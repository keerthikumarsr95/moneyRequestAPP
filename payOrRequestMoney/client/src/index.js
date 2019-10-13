import React from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import socket from './sockets';

import App from './app';
import { setAuthHeaders } from './actions/authActions';
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
setAuthHeaders();





// const materialUiTheme = createMuiTheme(muiTheme);
ReactDOM.render(
  <App />
  , document.getElementById('app'));