import React, { Fragment } from 'react';
import { Drawer, PageHeader, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Avatar } from 'antd';
import { ButtonComponent } from '../customComponents/buttonComponent';
import { InputComponent } from '../customComponents/inputComponents';
import { alertInfo, alertSuccess } from '../common/notifications';
import { requestPaymentAction, payPaymentAction, getTransactionsAction } from '../../actions/transactionActions';
import { listenToSocket } from '../../sockets';

const { Option } = Select;

class DrawerForm extends React.Component {
  constructor() {
    super();

    this.state = {
      values: {
        amount: '',
      },
      transactions: [],
      contact: {},
      errors: {
        amount: ''
      }
    };
    this.goToContacts = this.goToContacts.bind(this);
    this.onChange = this.onChange.bind(this);
    this.request = this.request.bind(this);
    this.pay = this.pay.bind(this);
    this.listen = this.listen.bind(this);
  }

  goToContacts(e) {
    e.preventDefault();
    this.props.history.push('/home/contacts');
  }

  async requestPayment(requestData) {
    const { data } = await requestPaymentAction(requestData);
    if (data.success) {
      alertSuccess('Successfully requested');
      this.getTransactions();
    }
  }

  request(e) {
    e.preventDefault();
    const { contact, values } = this.state;
    if (!values || !values.amount) {
      this.setState({ errors: { amount: 'required' } })
      return alertInfo('Enter an Amount');
    }
    const requestData = {
      to: contact.id,
      amount: values.amount,
      phoneNumber: contact.phoneNumber,
    }
    this.requestPayment(requestData);
  }

  async payPayment(requestData) {
    const { data } = await payPaymentAction(requestData);
    if (data.success) {
      alertSuccess('Successfully payed');
      this.getTransactions();
    }
  }

  pay(e) {
    e.preventDefault();
    const { contact, values } = this.state;
    if (!values || !values.amount) {
      this.setState({ errors: { amount: 'required' } })
      return alertInfo('Enter an Amount');
    }
    const requestData = {
      to: contact.id,
      amount: values.amount,
      phoneNumber: contact.phoneNumber,
    }
    this.payPayment(requestData);
  }

  onChange(e) {
    e.preventDefault();
    const field = e.target.name;
    const value = e.target.value;
    this.setState((prevState) => {
      prevState.values[field] = value;
      return prevState;
    });
  }

  async getTransactions() {
    const { data } = await getTransactionsAction({ phoneNumber: this.props.location.state.contact.phoneNumber });
    if (data.success) {
      this.setState({ transactions: data.transactions });
    }
  }

  setContact() {
    this.setState({ contact: this.props.location.state.contact });
  }

  renderTransaction(transactions, contact) {
    let returnArray = [];
    // console.log('this.props.location.state: ', this.props.location.state);
    // const { contact } = this.props.location.state.contact;
    // console.log('contact: ', contact);
    for (let index = 0; index < transactions.length; index++) {
      const element = transactions[index];
      let amount = element.amount;
      let className = 'green'
      if (element.type === 'REQUEST') {
        className = 'red'
      }
      // console.log('contact.userUUID: ', contact.userUUID);
      // console.log('element.from: ', element.from);
      className = contact.phoneNumber !== element.from ? className + ' textAlign-right' : className + ' textAlign-left';


      returnArray.push(
        <div className="width-100" key={element.id} id={transactions.length === index ? 'isLast' : ''}>
          <p className={className}>{amount}</p>
        </div>
      )
    }
    // var elmnt = document.getElementById("isLast");
    // elmnt.scrollIntoView();
    return <div style={{ background: 'white' }} className="transaction">{returnArray}</div>;
  }

  getFooter() {
    const { values, errors } = this.state;
    return (
      <div className="bottom-nav-container width-100">
        <ul className="bottom-nav width-100">
          <li className="width-22 padding-2px">
            <span>
              <ButtonComponent onClick={this.request} key="contacts" className="width-100">
                Request
              </ButtonComponent>
            </span>
          </li>
          <li className="width-50">
            <span>
              <InputComponent
                name='amount'
                placeholder="Enter amount"
                value={values.amount}
                onChange={this.onChange}
                hasError={!!errors.amount}
              />
            </span>
          </li>
          <li className="width-22 padding-2px">
            <span>
              <ButtonComponent onClick={this.pay} key="logout" className="width-100">
                Pay
              </ButtonComponent>
            </span>
          </li>
        </ul>
      </div>
    )
  }

  listen(updates) {
    if (updates.phoneNumber === this.state.contact.phoneNumber) {
      this.getTransactions()

    }
  }

  componentDidMount() {
    listenToSocket(this.listen);
    this.setContact();
    this.getTransactions();
  }


  render() {
    const { history, location } = this.props;
    const { contact = {}, transactions } = this.state;
    // console.log('location: ', location);
    return (
      <Fragment>
        <PageHeader onBack={this.goToContacts} title={contact.name || '--'} />
        {this.renderTransaction(transactions, contact)}
        {this.getFooter()}
      </Fragment>
    );
  }
}

export default Form.create()(DrawerForm);