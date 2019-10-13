import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ButtonComponent } from './customComponents/buttonComponent';
import { withAuthContext } from '../context/authContext';
import { Layout } from 'antd';

class AppHeader extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    this.props.context.logout();
    // this.props.history.push('/')
  }

  render() {
    return (
      !this.props.context.isAuth ?
        null : (
          <Layout.Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
            {/* <div style={{ paddingRight: '10px' }}> */}
            <ButtonComponent
              // type="link"
              name="Logout"
              onClick={this.logout}
            />
            {/* </div> */}
          </Layout.Header>)
    )
  }
}

export default withRouter(withAuthContext(AppHeader));