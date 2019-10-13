import React, { Component } from 'react'
import { Card, Icon } from 'antd';
import { getContactsAction } from '../../actions/contactsActions';
import { ButtonComponent } from '../customComponents/buttonComponent';
import { withContactsContext } from '../../context/contactsContext';
import { withAuthContext } from '../../context/authContext';

class Home extends Component {
  constructor() {
    super();
    this.goToContacts = this.goToContacts.bind(this);
    this.logout = this.logout.bind(this);
  }

  goToContacts(e) {
    e.preventDefault();
    this.props.history.push('/home/contacts');
  }

  logout(e) {
    e.preventDefault();
    console.log('this.props: ', this.props);
    this.props.authContext.logout();
  }


  async getContacts() {
    try {
      const { data } = await getContactsAction();
      if (data.success) {
        this.props.context.setContacts(data.contacts);
      }
    } catch (error) {

    }
  }

  componentDidMount() {
    this.getContacts();
  }

  render() {
    return (
      <div>
        <div className="bottom-nav-container width-100">
          <ul className="bottom-nav width-100">
            <li className="width-50">
              <span>
                <ButtonComponent onClick={this.goToContacts} key="contacts" className="width-100">
                  <Icon type="contacts" theme="outlined" />
                </ButtonComponent>
              </span>
            </li>
            <li className="width-50">
              <span>
                <ButtonComponent onClick={this.logout} key="logout" className="width-100">
                  <Icon type="logout" theme="outlined" />
                </ButtonComponent>
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withAuthContext(withContactsContext(Home));