import axios from 'axios';


export const requestPaymentAction = (requestData) => axios.post('/api/v1/transaction/request', requestData);

export const payPaymentAction = (requestData) => axios.post('/api/v1/transaction/pay', requestData);

export const getTransactionsAction = (requestData) => axios.get('/api/v1/transaction/?phoneNumber=' + requestData.phoneNumber);
