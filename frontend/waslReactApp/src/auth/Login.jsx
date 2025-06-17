import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import Loader from '@/components/Loader';

export default function Login() {
  const { keycloak, initialized } = useContext(AuthContext);

  if(!initialized) return <Loader/>;
 
  keycloak.login({redirectUri: window.location.origin + '/'});
}


