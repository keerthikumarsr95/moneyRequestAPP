import React from 'react';
import { getDecodedToken } from '../actions/authActions';

const AuthContext = React.createContext('authContext');

class AuthProvider extends React.Component {
  constructor() {
    super();
    this.state = { isAuth: false, userData: {} };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(userData) {
    this.setState({ isAuth: true, userData: userData });
  }

  logout() {
    this.setState({ isAuth: false, userData: {} });
    localStorage.removeItem('actvytoken');
  }
  componentDidMount() {
    if (localStorage.actvytoken) {
      const decodedToken = getDecodedToken(localStorage.actvytoken);
      if (decodedToken && decodedToken.userId) {
        this.login(decodedToken);
      }
    }
  }
  render() {
    return (
      <AuthContext.Provider value={{ isAuth: this.state.isAuth, logout: this.logout, login: this.login }}>
        {this.props.children}
      </AuthContext.Provider>)
  }
}
const AuthConsumer = AuthContext.Consumer;

const withAuthContext = function (ComposedComponent) {
  class ComposedClass extends React.Component {
    render() {
      return (
        <AuthConsumer>
          {(context) => (<ComposedComponent {...this.props} authContext={context} />
          )}
        </AuthConsumer>
      );
    }
  }
  return ComposedClass;
}


export { AuthProvider, AuthConsumer, withAuthContext };
