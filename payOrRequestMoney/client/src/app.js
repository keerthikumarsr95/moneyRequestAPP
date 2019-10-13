import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import WrappedComponents from './wrappedComponents';
import { AuthProvider } from './context/authContext';
import { ContactsProvider } from './context/contactsContext';
import ProtectedRoute from './ProtectedRoute';
import routes from './routes';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';

const supportsHistory = 'pushState' in window.history;

class App extends Component {
  render() {
    return (
      <BrowserRouter forceRefresh={!supportsHistory}>
        <AuthProvider>
          <ContactsProvider>
            <Layout>
              {/* <WrappedComponents.Header /> */}
              <Route exact path="/" render={() => {
                if (localStorage.actvytoken) {
                  return <Redirect to="/home/welcome" />
                } else {
                  return <WrappedComponents.Login />
                }
              }} />
              <Route exact path="/signup" component={WrappedComponents.Signup} />
              {routes.map((curr) => <ProtectedRoute key={curr.path} exact={curr.exact} path={curr.path} component={curr.component} />)}
            </Layout>
          </ContactsProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  }
}

export default App