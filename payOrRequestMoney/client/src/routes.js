import wrappedComponents from './wrappedComponents';

const routes = [
  { path: '/home', component: wrappedComponents.Home },
  { path: '/home/welcome', component: wrappedComponents.Welcome },
  { exact: true, path: '/home/contacts', component: wrappedComponents.Contacts },
  { exact: true, path: '/home/contacts/:contactId', component: wrappedComponents.Chats },
];

export default routes;