import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';

const Redirect = () => {
  const { user } = useSelector((state: any) => state.user);
  const token = localStorage.getItem('token');

  return (
    <Navigate to={token ? webRoutes.dashboard : webRoutes.login} replace />
  );
};

export default Redirect;
