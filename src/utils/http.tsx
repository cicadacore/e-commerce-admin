import axios from 'axios';
import { logoutSuccess } from '../redux/reducers/userReducer';
import { store } from '../redux/store';

export const defaultHttp = axios.create();
const http = axios.create();

http.interceptors.request.use(
  (config) => {
    // const state = store.getState();
    // const state: RootState = store.getState();
    // const apiToken = state.admin?.token;
    const apiToken = localStorage.getItem('token');
    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      const data: any = true;
      store.dispatch(logoutSuccess(data));
    }
    return Promise.reject(error);
  }
);

export default http;
