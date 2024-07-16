import { server } from '../store';
import axios from 'axios';
import {
  productFail,
  productRequest,
  productSuccess,
} from '../reducers/productReducer';
// import { getToken } from '../../config/token';

const token = localStorage.getItem('token');

export const fetchProducts =
  (limit = 10, skip = 10) =>
  async (dispatch: any) => {
    try {
      dispatch(productRequest());

      const { data } = await axios.get(
        `${server}/products?limit=${limit}&skip=${skip}&select=title,price`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(productSuccess(data));
      return data;
    } catch (error: any) {
      // console.log('error fetching products', error.message);

      dispatch(productFail(error.response.data.message));
    }
  };
