import { createReducer, createAction } from '@reduxjs/toolkit';
export const loginRequest = createAction('loginRequest');
export const loginSuccess = createAction('loginSuccess');
export const loginFail = createAction('loginFail');
export const logoutSuccess = createAction('logoutSuccess');
export const profileRequest = createAction('profileRequest');
export const profileSuccess = createAction('profileSuccess');
export const profileFail = createAction('profileFail');

export const userReducer = createReducer(
  {
    loading: false,
    isAuthenticated: false,
    user: null,
    message: null,
    error: null,
    tokenError: false,
  },
  (builder) => {
    builder
      .addCase(loginRequest, (state) => {
        state.loading = true;
      })
      .addCase(loginSuccess, (state: any, action: any) => {
        state.loading = false;
        state.tokenError = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(loginFail, (state: any, action: any) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logoutSuccess, (state: any, action: any) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.tokenError = action.payload || false;
      })
      .addCase(profileRequest, (state) => {
        state.loading = true;
      })
      .addCase(profileSuccess, (state: any, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(profileFail, (state: any, action: any) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  }
);
