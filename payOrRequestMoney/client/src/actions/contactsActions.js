import axios from 'axios';

export const getOrdersAction = () => axios.get('/api/v1/orders/');

export const addNewOrderAction = requestObject => axios.post('/api/v1/orders/', requestObject);

export const getContactsAction = () => axios.get('/api/v1/contacts/');