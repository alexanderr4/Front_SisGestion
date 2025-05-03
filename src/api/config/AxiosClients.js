// axiosClients.js
import axios from 'axios';

// Función para agregar token si existe
const addAuthToken = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Manejador de errores común
const handleResponseError = (error) => Promise.reject(error);

// Función para crear un cliente Axios con interceptores
const createClient = (contentType = 'application/json', withAuth = false) => {
  const client = axios.create({
    headers: { 'Content-Type': contentType },
  });

  if (withAuth) {
    client.interceptors.request.use(addAuthToken);
  }

  client.interceptors.response.use(
    response => response,
    handleResponseError
  );

  return client;
};

// Clientes exportados
export const publicClient = createClient();                      // JSON sin token
export const privateClient = createClient('application/json', true); // JSON con token
export const xmlClient = createClient('application/xml', true);  // XML con token
