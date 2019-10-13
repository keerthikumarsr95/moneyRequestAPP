import React, { Component, Fragment } from 'react'
import { List, Layout, PageHeader, Icon, Table, Card, Avatar } from 'antd';
import { ButtonComponent } from '../customComponents/buttonComponent';
import { getOrdersAction, addNewOrderAction } from '../../actions/contactsActions';
// import AddOrEditOrder from './Chats';
import { alertInfo, alertError, alertSuccess, closeAlert } from '../common/notifications';
import { withContactsContext } from '../../context/contactsContext';

class Orders extends Component {

  constructor() {
    super();

    this.state = {
      orders: [],
      showAddDrawer: false,
    };

    this.getContactsList = this.getContactsList.bind(this);
    this.viewContact = this.viewContact.bind(this);
  }

  viewContact(e, contact) {
    this.props.history.push(`/home/contacts/${contact.phoneNumber}`, { contact });
  }

  getContactsList(contacts) {
    return (
      <List
        itemLayout="horizontal"
        dataSource={contacts}
        renderItem={(item) => {
          // console.log('item', item.name.chatAt(0))
          return (
            <div onClick={(e) => this.viewContact(e, item)}>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>
                    {item.name[0].toUpperCase()}
                  </Avatar>}
                  title={item.name}
                />
              </List.Item>
            </div>
          )
        }}
      />
    )
  }

  render() {
    const { context } = this.props;
    return (
      <Fragment>
        {/* <Layout.Content style={{ padding: '0 24px', minHeight: 280 }}> */}
        <PageHeader
          title="Contacts"
        />
        <Card bordered={true} style={{ width: '100%' }}>

          {this.getContactsList(context.contacts)}
        </Card>
      </Fragment>
    )
  }
}
{/* </Layout.Content> */ }

export default withContactsContext(Orders);