import React, { useContext } from "react";
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const setAuthHeaders = () => {
  if (localStorage.actvytoken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.actvytoken}`;
  }
}
export const getDecodedToken = token => jwtDecode(token);

export const updateAuthContext = (token, login) => {
  localStorage.setItem('actvytoken', token);
  const decodedData = getDecodedToken(token);
  login(decodedData);
  setAuthHeaders();
};

export const loginAction = requestObject => axios.post('/api/v1/users/login', requestObject);
export const signupAction = requestObject => axios.post('/api/v1/users/signup', requestObject);