import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import getUser from "@/customehooks/getUser";
import { Button } from "./ui/button";
import { Avatar } from "@stream-io/video-react-sdk";
import { useContext, useState } from "react";
import { AuthContext } from "@/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import Loader from "./Loader";


export const UserProfile = () => {
  const [user, isLoadingUser, setUser] = getUser();
  const { keycloak } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update profile handler
  const handleProfileUpdate = async () => {
    try {
      if(!user){
        toast.error("relaod!, your personl data is not loaded");
        return;
      }
      axios.post(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account`,
        {
          firstName: user.firstName,
          lastName: user.lastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );

      toast(
        'Profile updated successfully',{
        style: {
          border: "none",
          backgroundColor: "#1C1F2E",
          color: "#ffffff",
        },
      });

      await keycloak.updateToken(30);
    } catch (err) {
      setError('Error updating profile');
      toast.error(
        'Profile update failed',{
        style: {
          border: "none",
          backgroundColor: "#1C1F2E",
          color: "#ffffff",
        },
      });
    }
  };

  const handlePasswordChange = async () => {
    keycloak.login({ action: 'UPDATE_PASSWORD' });
  };

  const handleLogout = async () => {
    keycloak.logout({redirectUri: window.location.origin + '/login'});
  };
 
  if(isLoadingUser || !user) return (<Avatar name="unknow" className="!bg-sky-600 p-4.5 !rounded-[50%]"/>);

  return (
    <Dialog>

      <DialogTrigger asChild>
        <button className='focus:outline-none flex items-center gap-2 text-white w-fit'>
          <Avatar
            name={user.firstName +" "+ user.lastName}
            className="!bg-[#0E78F9] p-5 !rounded-[50%] cursor-pointer"
          />
          <span className=" text-nowrap font-[600]">{user.firstName +" "+ user.lastName}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[520px] border-none bg-dark-1 text-white text-[1.1rem]">

        <DialogHeader>
          <DialogTitle className=' !text-[1.6rem]'>Profile Details</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="firstName" className="text-right">
              FirstName:
            </label>
            <Input 
              id="firstName" 
              type="text"
              name="firstName"
              value={user.firstName}
              className="col-span-3 !text-[1rem]" 
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="lastName" className="text-right">
              LastName:
            </label>
            <Input id="lastName" 
              type="text"
              name="lastName"
              value={user.lastName}
              className="col-span-3 !text-[1rem]" 
              onChange={handleInputChange}
            />
          </div>

          <DialogFooter>
            <Button className='bg-blue-1 cursor-pointer' 
            onClick={handleProfileUpdate}>Save changes</Button>
          </DialogFooter>

          <hr className="border-t border-gray-300" />

          <div className="grid grid-cols-4 items-center gap-4">
            <span>Email: </span>
            {user.email}
          </div>

          <hr className="border-t border-gray-300" />
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span>Password: </span>
            *************
          </div>
          
          <DialogFooter>
            <Button className='bg-blue-1 cursor-pointer'
            onClick = {handlePasswordChange}>Change password</Button>
          </DialogFooter>

          <Button className='bg-blue-1 min-w-[200px] not-target:justify-self-center cursor-pointer'
          onClick = {handleLogout}>Logout</Button>
        </div>

      </DialogContent>

    </Dialog>
  )
}


export default UserProfile;