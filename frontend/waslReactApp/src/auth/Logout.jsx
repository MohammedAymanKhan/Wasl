import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import Loader from '@/components/Loader';

export default function Logout() {
  const { keycloak, initialized } = useContext(AuthContext);

  if(!initialized) return <Loader/>;

  keycloak.logout({redirectUri: window.location.origin + '/login'});
}