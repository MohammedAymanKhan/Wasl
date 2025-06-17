import { AuthContext } from '@/auth/AuthProvider';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react'

const getToken = (url) => {
  const { keycloak } = useContext(AuthContext);
  const [streamToken, setStreamToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(keycloak.authenticated){
      axios.get(`http://localhost:8080${url}`,{
        headers: {
          Authorization: `Bearer ${keycloak?.token}`,
        },
      })
      .then(response => {
        setStreamToken(response.data); 
      })
      .catch(error => {
        setError('Failed to fetch Stream token');
        console.error(error);
      });
    }
  }, 
  [keycloak?.token, keycloak.authenticated, url]);

  return [streamToken, error];
}

export default getToken;
