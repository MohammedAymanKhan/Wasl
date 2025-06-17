import { AuthContext } from "@/auth/AuthProvider";
import { useContext, useEffect, useState } from "react";

const getUser = () => {
  
  const { keycloak, authenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const getUserDetails = async() => {
    setIsLoadingUser(true);
    try {
      const profile = await keycloak.loadUserProfile();
      const tempUser = {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      };
      
      setUser(tempUser);
    } catch (error) {
      console.error("Failed to load user profile", error);
    }finally{
      setIsLoadingUser(false);
    } 
  }

  useEffect(() => {
    if(authenticated && keycloak){
      getUserDetails();
    }
  }, [keycloak, authenticated]);

  return [user, isLoadingUser, setUser];
}


export default getUser;