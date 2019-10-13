import React from 'react';

const ContactsContext = React.createContext('contactsContext');

class ContactsProvider extends React.Component {
  constructor() {
    super();
    this.state = { contacts: [] };
    this.setContacts = this.setContacts.bind(this);
  }

  setContacts(contacts) {
    this.setState({ contacts });
  }

  render() {
    return (
      <ContactsContext.Provider value={{ contacts: this.state.contacts, setContacts: this.setContacts }}>
        {this.props.children}
      </ContactsContext.Provider>)
  }
}
const ContactsConsumer = ContactsContext.Consumer;

const withContactsContext = function (ComposedComponent) {
  class ComposedClass extends React.Component {
    render() {
      return (
        <ContactsConsumer>
          {(context) => (<ComposedComponent {...this.props} context={context} />
          )}
        </ContactsConsumer>
      );
    }
  }
  return ComposedClass;
}


export { ContactsProvider, ContactsConsumer, withContactsContext };
