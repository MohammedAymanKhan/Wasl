import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";


const Refreshtoken = () => {

  const {keycloak, initialized, authenticated} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(authenticated && initialized){
      setInterval(() => {
        refreshTokenIfNeeded();
      }, 240_000); // 4min
    }
  },[authenticated, initialized]);

  const refreshTokenIfNeeded = useCallback(() =>{
    keycloak.updateToken(60) //60sec
      .catch(() => {
        console.error('Token refresh failed, redirecting to login');
        navigate("/login");
      });
  },[keycloak]);

  return null;
} 

export default Refreshtoken; 