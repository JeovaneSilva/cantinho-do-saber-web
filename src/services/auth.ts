import { api } from './api';

export const authService = {

  async login(credentials: { email: string; senha: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data.access_token;
  },
};