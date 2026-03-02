import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://primary-joline-jeovanesilva-083d962e.koyeb.app', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CantinhoDoSaber:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});