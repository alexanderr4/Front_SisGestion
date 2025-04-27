// axiosClients.js
import axios from 'axios';

export const publicClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

privateClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const handleResponseError = (error) => {

  return Promise.reject(error);
};

// Aplicar el interceptor a ambos clientes
publicClient.interceptors.response.use(
  response => response,
  handleResponseError
);

privateClient.interceptors.response.use(
  response => response,
  handleResponseError
);
