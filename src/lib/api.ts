import axios from 'axios';
import { getGasUrl } from './utils';
import { Wedding, Guest, Wish, ApiResponse } from '@/types';

// GAS requires POST requests to be sent as payload string or plain text usually,
// but axios does it via JSON depending on Content-Type.
// Using followRedirects is also important for GAS DO_POST redirects. Wait, browser handles GAS redirects automatically for CORS.
// We'll use simple fetch equivalent or axios.

const api = axios.create({
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
});

export const weddingApi = {
  getWedding: async (id: string): Promise<ApiResponse<Wedding>> => {
    const url = getGasUrl() + `?action=getWedding&id=${id}`;
    const res = await axios.get(url);
    return res.data;
  },
  
  getAllWeddings: async (email: string): Promise<ApiResponse<Wedding[]>> => {
    const url = getGasUrl() + `?action=getAllWeddings&email=${email}`;
    const res = await axios.get(url);
    return res.data;
  },

  getAllWeddingsMaster: async (): Promise<ApiResponse<Wedding[]>> => {
    const url = getGasUrl() + `?action=getAllWeddingsMaster`;
    const res = await axios.get(url);
    return res.data;
  },

  createWedding: async (data: Partial<Wedding>): Promise<ApiResponse<{wedding_id: string}>> => {
    const payload = { action: 'createWedding', ...data };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  },

  updateWedding: async (data: Partial<Wedding>): Promise<ApiResponse<{wedding_id: string}>> => {
    const payload = { action: 'updateWedding', ...data };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  },

  deleteWedding: async (id: string): Promise<ApiResponse<any>> => {
    const payload = { action: 'deleteWedding', wedding_id: id };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  }
};

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{email: string}>> => {
    const payload = { action: 'loginUser', email, password };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  },
  register: async (email: string, password: string): Promise<ApiResponse<{email: string}>> => {
    const payload = { action: 'registerUser', email, password };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  }
};

export const guestApi = {
  getGuests: async (wedding_id: string): Promise<ApiResponse<Guest[]>> => {
    const url = getGasUrl() + `?action=getGuests&wedding_id=${wedding_id}`;
    const res = await axios.get(url);
    return res.data;
  },

  rsvp: async (data: Partial<Guest>): Promise<ApiResponse<{guest_id: string}>> => {
    const payload = { action: 'rsvp', ...data };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  }
};

export const wishApi = {
  getWishes: async (wedding_id: string): Promise<ApiResponse<Wish[]>> => {
    const url = getGasUrl() + `?action=getWishes&wedding_id=${wedding_id}`;
    const res = await axios.get(url);
    return res.data;
  },

  addWish: async (data: Partial<Wish>): Promise<ApiResponse<{wish_id: string}>> => {
    const payload = { action: 'addWish', ...data };
    const res = await api.post(getGasUrl(), JSON.stringify(payload));
    return res.data;
  }
};
