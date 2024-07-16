import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorPage from '../components/errorPage';
import Layout from '../components/layout';
import Redirect from '../components/layout/Redirect';
import NotFoundPage from '../components/notfoundPage';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '../components/loader/progressBar';
import RequireAuth from './requireAuth';
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import ChangePasswordForm from '../components/auth/ChangePassword';
import Profile from '../components/auth/Profile';
import EditProfile from '../components/auth/EditProfile';
import PublicRouteWrapper from './publicRouteWrapper';
import Categories from '../components/categories';
import Products from '../components/product';
import AddProduct from '../components/product/addProduct';
import EditProduct from '../components/product/editProduct';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Dashboard = loadable(() => import('../components/dashboard'), {
  fallback: fallbackElement,
});
const Users = loadable(() => import('../components/customers'), {
  fallback: fallbackElement,
});

export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: (
      <PublicRouteWrapper>
        <AuthLayout />
      </PublicRouteWrapper>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
      {
        path: webRoutes.forgotPassword,
        element: <ForgotPassword />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.customers,
        element: <Users />,
      },
      {
        path: webRoutes.categories,
        element: <Categories />,
      },
      {
        path: webRoutes.changePassword,
        element: <ChangePasswordForm />,
      },
      {
        path: webRoutes.profile,
        element: <Profile />,
      },
      {
        path: webRoutes.editProfile,
        element: <EditProfile />,
      },
      {
        path: webRoutes.products,
        element: <Products />,
      },
      {
        path: webRoutes.addProduct,
        element: <AddProduct />,
      },
      {
        path: webRoutes.editProduct,
        element: <EditProduct />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
