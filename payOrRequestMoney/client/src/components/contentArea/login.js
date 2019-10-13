import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Card, Row } from 'antd';
import { InputComponent } from '../customComponents/inputComponents';
import { ButtonComponent } from '../customComponents/buttonComponent';
import { alertInfo, alertError, alertSuccess } from '../common/notifications';
import { loginAction, updateAuthContext } from '../../actions/authActions';
import { withAuthContext } from '../../context/authContext';

const { Content } = Layout;

class Login extends Component {

  constructor() {
    super();
    this.state = {
      errors: {
        userId: '',
        password: '',
      },
      values: {
        userId: '',
        password: '',
      }
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.signup = this.signup.bind(this);

  }

  async submit(e) {
    e.preventDefault();
    let message = '';
    let success = true;
    const { values, errors } = this.state;
    if (!values.userId) {
      message = 'User name';
      success = false;
    }
    if (!values.password) {
      message += !values.userId ? ` and` : '';
      message += ' Password';
      success = false;
    }
    message += ' Required';
    if (!success) {
      alertError('Login Failed', message);
    } else {
      const { data } = await loginAction(values);
      if (data && data.success) {
        updateAuthContext(data.token, this.props.authContext.login);
        this.props.history.push('/home/welcome');
        alertSuccess('Login Successful');
      } else {
        alertError('Login Failed', data.message)
      }
    }

  }

  signup(e) {
    e.preventDefault();
    this.props.history.push('/signup')
  }

  onChange(e) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => {
      if (!value) {
        prevState.errors[name] = 'Required';
      } else {
        prevState.errors[name] = '';
      }
      prevState.values[name] = value;
      return prevState;
    });
  }

  render() {
    const { errors = {}, values = {} } = this.state;
    // console.log('errors: ', errors);
    return (
      <Content>
        <Card
          // title="Welcome"
          bordered={true}
          // style={{ width: 240 }}
          cover={<img alt="welcome" src="images/login_main_image.png" className="image" />}
        >
          <Row style={{ padding: '10px' }}>
            <InputComponent
              name='userId'
              placeholder="User Name"
              value={values.userId}
              onChange={this.onChange}
              hasError={!!errors.userId}
            />
          </Row>
          <Row style={{ padding: '10px' }}>
            <InputComponent
              name='password'
              placeholder="Password"
              value={values.password}
              onChange={this.onChange}
              type="password"
              hasError={!!errors.password}
            />
          </Row>
          <Row style={{ padding: '10px' }}>
            <ButtonComponent
              onClick={this.submit}
              name="Login"
              type="primary"
              className="width-100"
            />
          </Row>
          <ButtonComponent
            onClick={this.signup}
            name="Signup"
            type="link"
            className="width-100 textAlign-right-imp"
          />
          {/* <Button type="link">Signup</Button> */}
        </Card>
      </Content>
    )
  }
}

export default withRouter(withAuthContext(Login));