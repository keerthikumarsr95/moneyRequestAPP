import React, { Component } from 'react';
import { Layout, Card, Row } from 'antd';
import { InputComponent } from '../customComponents/inputComponents';
import { ButtonComponent } from '../customComponents/buttonComponent';
import { signupAction, updateAuthContext } from '../../actions/authActions';
import { alertInfo } from '../common/notifications';
const { Content } = Layout;

const validationRequiredFields = ['userId', 'password', 'phoneNumber'];

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      values: {},
    };
    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
    this.submit = this.submit.bind(this);
    this.doSignup = this.doSignup.bind(this);

  }

  async doSignup(values) {
    const { data } = await signupAction(values);
    if (data.success) {
      alertInfo('Successfully signup up. lets login Now.');
      this.props.history.push('/');
    } else {
      alertInfo(data.message);
    }
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

  login(e) {
    e.preventDefault();
    this.props.history.push('/')
  }

  submit(e) {
    e.preventDefault();
    const { errors, values } = this.state;

    let validationErrors = {};
    validationRequiredFields.forEach((field) => {
      if (!values[field]) {
        validationErrors[field] = 'required';
      }
    })
    if (Object.keys(validationErrors).length) {
      this.setState({ errors: errors });
      return;
    }

    this.doSignup(values);
  }

  render() {
    const { errors = {}, values = {} } = this.state;
    return (
      <Content>
        <Card
          // title="Welcome"
          bordered={true}
          // style={{ width: 240 }}
          cover={<img alt="welcome" src="images/login_main_image.png.png" className="image" />}
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
              name='phoneNumber'
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChange={this.onChange}
              hasError={!!errors.phoneNumber}
            />
          </Row>
          <Row style={{ padding: '10px' }}>
            <InputComponent
              name='password'
              placeholder="Password"
              value={values.password}
              onChange={this.onChange}
              hasError={!!errors.password}
              type="password"
            />
          </Row>
          <Row style={{ padding: '10px' }}>
            <ButtonComponent
              onClick={this.submit}
              name="Signup"
              type="primary"
              className="width-100"
            />
          </Row>
          <ButtonComponent
            onClick={this.login}
            name="Login"
            type="link"
            className="width-100 textAlign-right-imp"
          />
          {/* <Button type="link">Signup</Button> */}
        </Card>
      </Content>
    )
  }
}

export default Signup;