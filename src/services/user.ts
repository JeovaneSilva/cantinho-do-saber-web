import { api } from './api';

export const userService = {

  async getUserById(id: number) {
    const response = await api.get(`/user/${id}`);
    return response.data; 
  },

};