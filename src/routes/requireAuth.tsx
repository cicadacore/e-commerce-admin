import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { RootState } from '../store';
import { webRoutes } from './web';
import { getProfile } from '../redux/actions/user';
import { useEffect } from 'react';

export type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tokenError } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      dispatch<any>(getProfile())
        .then((profile: any) => {
          // console.log(profile, '.profile');
        })
        .catch((err: any) => {
          localStorage.removeItem('token');
          navigate(webRoutes.login, { replace: true });
        });
    }
    if (tokenError) {
      localStorage.removeItem('token');
      navigate(webRoutes.login, { replace: true });
    }
  }, [tokenError]);

  if (!token) {
    return <Navigate to={webRoutes.login} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
