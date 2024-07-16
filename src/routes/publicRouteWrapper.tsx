import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from './web';
import { getProfile } from '../redux/actions/user';
import { useEffect } from 'react';

export type PublicRouteWrapperProps = {
  children: JSX.Element;
};

const PublicRouteWrapper = ({ children }: PublicRouteWrapperProps) => {
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      dispatch<any>(getProfile())
        .then((profile: any) => {
          // console.log(profile, '.profile');
          navigate(webRoutes.dashboard, { replace: true });
        })
        .catch((err: any) => {
          localStorage.removeItem('token');
          navigate(webRoutes.login, { replace: true });
        });
    }
  }, [token]);
  if (!token) return children;
};

export default PublicRouteWrapper;
