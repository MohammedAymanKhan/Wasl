import { createContext, useEffect, useState } from 'react';
import keycloak from './keycloak';


export const AuthContext = createContext({
  keycloak: null,
  initialized: false,
  authenticated: false,
});

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      
      const initializeAuth = async () => {
        try {
          await keycloak.init({
            onLoad: 'check-sso',
            pkceMethod: 'S256',
            promiseType: 'native',
          });
          setInitialized(true);
        } catch (error) {
          console.error('Authentication failed:', error);
          keycloak.login(); 
        }
      };

      initializeAuth();

      keycloak.onAuthSuccess = () => setAuthenticated(true);
      keycloak.onAuthLogout = () => setAuthenticated(false);
    }
  }, [keycloak, initialized]);

  return (
    <AuthContext.Provider value={{ keycloak, authenticated, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}