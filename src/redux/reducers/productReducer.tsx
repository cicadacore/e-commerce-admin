import { createReducer, createAction } from '@reduxjs/toolkit';
export const productRequest = createAction('productRequest');
export const productSuccess = createAction('productSuccess');
export const productFail = createAction('productFail');

export const productReducer = createReducer(
  {
    loading: false,
    products: [],
    message: null,
    error: null,
  },
  (builder) => {
    builder
      .addCase(productRequest, (state: any) => {
        state.loading = true;
      })
      .addCase(productSuccess, (state: any, action: any) => {
        state.loading = false;
        state.products = action.payload.products;
        state.message = action.payload.message;
      })
      .addCase(productFail, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
);
