// import { server } from '../store';
// import axios from 'axios';
import {
  loginFail,
  loginRequest,
  loginSuccess,
  profileFail,
  profileRequest,
  profileSuccess,
} from '../reducers/userReducer';
import http, { defaultHttp } from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { message } from 'antd';

export const login = (email: any, password: any) => (dispatch: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(loginRequest());

      const { data } = await defaultHttp.post(apiRoutes.login, {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      dispatch(loginSuccess(data));
      // message.success('Logged in successfully');
      resolve(data);
    } catch (error: any) {
      dispatch(loginFail(error.response.data.msg));
      // message.error(error.response.data.msg);
      reject(error.response);
    }
  });
};

export const getProfile = () => (dispatch: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(profileRequest());
      const { data } = await http.get(apiRoutes.profile);
      dispatch(profileSuccess(data));
      resolve(data);
    } catch (error: any) {
      dispatch(profileFail(error.response.data.message));
      reject(error);
    }
  });
};

export const changePassword = (values: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await http.post(apiRoutes.changePassword, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      resolve(data);
    } catch (error: any) {
      reject(error);
    }
  });
};
