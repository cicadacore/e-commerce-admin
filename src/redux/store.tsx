import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import { productReducer } from './reducers/productReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
  },
});

export const server = 'https://dummyjson.com';
