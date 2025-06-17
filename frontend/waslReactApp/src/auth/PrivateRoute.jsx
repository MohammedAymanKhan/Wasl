import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import Loader from '@/components/Loader';

function PrivateRoute() {
  const { keycloak, initialized } = useContext(AuthContext);
  const location = useLocation();

  if (!initialized) return <Loader/>;
  
  return keycloak.authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;

