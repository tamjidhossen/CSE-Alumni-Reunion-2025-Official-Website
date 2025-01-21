// src/lib/auth.js
import axios from 'axios';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  return false;
};