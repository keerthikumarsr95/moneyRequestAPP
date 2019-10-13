import React from 'react';

import { AuthConsumer } from './context/authContext';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {context => (<Route render={props => context.isAuth ? <Component {...props} context={context} /> : <Redirect to="/" />}{...rest} />)}
  </AuthConsumer>)

export default ProtectedRoute;