import axios from 'axios';
import { apiUrl } from '@/env';
import { IUserProfile, IUserProfileUpdate, IUserProfileCreate, Order, Withdraw } from './interfaces';

function authHeaders(token: string,params?:Record<string, any>) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
}

export const api = {
  async logInGetToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return axios.post(`${apiUrl}/api/v1/login/access-token`, params);
  },
  async getMe(token: string) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/me`, authHeaders(token));
  },
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/me`, data, authHeaders(token));
  },
  async getUsers(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/`, authHeaders(token));
  },
  async updateUser(token: string, userId: number, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
  },
  async passwordRecovery(email: string) {
    return axios.post(`${apiUrl}/api/v1/password-recovery/${email}`);
  },
  async resetPassword(password: string, token: string) {
    return axios.post(`${apiUrl}/api/v1/reset-password/`, {
      new_password: password,
      token,
    });
  },
  // order
  async getOrders(token: string,params?:Record<string, any>){
    console.log(params)
    console.log(authHeaders(token,params))
    return axios.get<Order[]>(`${apiUrl}/api/v1/orders/`,authHeaders(token,params));
  },
  async getWithdraws(token: string,params?:Record<string, any>){
    console.log(params)
    console.log(authHeaders(token,params))
    return axios.get<Order[]>(`${apiUrl}/api/v1/withdrawals/`,authHeaders(token,params));
  },
  async updateWithdraw(token: string, id: number, data: Withdraw) {
    return axios.patch(`${apiUrl}/api/v1/withdrawals/${id}`, data, authHeaders(token));
  },
};
