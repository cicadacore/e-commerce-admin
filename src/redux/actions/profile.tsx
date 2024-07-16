import { server } from '../store';
import axios from 'axios';

export const updateProfile =
  (name: any, email: any) => async (dispatch: any) => {
    try {
      dispatch({ type: 'updateProfileRequest' });

      const { data } = await axios.put(
        `${server}/updateprofile`,
        {
          name,
          email,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },

          withCredentials: true,
        }
      );

      dispatch({ type: 'updateProfileSuccess', payload: data.message });
    } catch (error: any) {
      dispatch({
        type: 'updateProfileFail',
        payload: error.response.data.message,
      });
    }
  };

export const updateProfilePicture =
  (formdata: any) => async (dispatch: any) => {
    try {
      dispatch({ type: 'updateProfilePictureRequest' });

      const { data } = await axios.put(
        `${server}/updateprofilepicture`,
        formdata,
        {
          headers: {
            'Content-type': 'multipart/form-data',
          },

          withCredentials: true,
        }
      );

      dispatch({ type: 'updateProfilePictureSuccess', payload: data.message });
    } catch (error: any) {
      dispatch({
        type: 'updateProfilePictureFail',
        payload: error.response.data.message,
      });
    }
  };

export const changePassword =
  (oldPassword: any, newPassword: any) => async (dispatch: any) => {
    try {
      dispatch({ type: 'changePasswordRequest' });

      const { data } = await axios.put(
        `${server}/changepassword`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },

          withCredentials: true,
        }
      );

      dispatch({ type: 'changePasswordSuccess', payload: data.message });
    } catch (error: any) {
      dispatch({
        type: 'changePasswordFail',
        payload: error.response.data.message,
      });
    }
  };

export const forgetPassword = (email: any) => async (dispatch: any) => {
  try {
    dispatch({ type: 'forgetPasswordRequest' });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },

      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/forgetpassword`,
      {
        email,
      },
      config
    );

    dispatch({ type: 'forgetPasswordSuccess', payload: data.message });
  } catch (error: any) {
    dispatch({
      type: 'forgetPasswordFail',
      payload: error.response.data.message,
    });
  }
};

export const resetPassword =
  (token: any, password: any) => async (dispatch: any) => {
    try {
      dispatch({ type: 'resetPasswordRequest' });
      const config = {
        headers: {
          'Content-type': 'application/json',
        },

        withCredentials: true,
      };

      const { data } = await axios.put(
        `${server}/resetpassword/${token}`,
        {
          password,
        },
        config
      );

      dispatch({ type: 'resetPasswordSuccess', payload: data.message });
    } catch (error: any) {
      dispatch({
        type: 'resetPasswordFail',
        payload: error.response.data.message,
      });
    }
  };
