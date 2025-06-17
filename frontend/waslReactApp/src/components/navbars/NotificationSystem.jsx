import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { AuthContext } from "@/auth/AuthProvider";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const query = {
  filter_conditions: {
    id: { $in: ''},
  },
  limit: '',
};

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const client = useStreamVideoClient();
  const {keycloak} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navgiate = useNavigate();

  const getNotifications = async() => {
    setIsLoading(true);
    const response  = await axios.get("http://localhost:8080/api/notification/unread",
    { headers: {
      Authorization: `Bearer ${keycloak.token}`
    }});

    const tempNotification = response.data;

    if(!tempNotification || tempNotification?.length == 0){
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const callIds = tempNotification.map(notification => notification.meetingId);
    query.filter_conditions.id.$in = callIds;
    query.limit = callIds.length;
    const {calls} = await client.queryCalls(query);
    const callByIdMap = new Map(calls.map((c) => [c.id, c]));

    const modifNotification = tempNotification.map(n => {
      const call = callByIdMap.get(n.meetingId);n.meetingTitle = call?.state?.custom?.description || call?.filename?.substring(0, 20) || 'Personal Meeting';
      n.meetingDate = call?.state?.startsAt;
      return n;
    });

    setNotifications(modifNotification);
    setIsLoading(false);
  };

  useEffect(() => {
   getNotifications();
  }, []);

  const handleMarkAsRead = async(id) => {
    try{
      await axios.patch(`http://localhost:8080/api/notification/${id}/mark-read`, null,
      { headers: {
        Authorization: `Bearer ${keycloak.token}`
      }});
      setNotifications(notifications.filter(n => n.Id != id));
      toast.success('Notification marked as read');
    }catch(err){
      toast.error('Notification failed to marked as read');
    }
  };

  const handleInvitationResponse = async(id, responseStatus, meetingId = null) => {
    try{
      await axios.patch(
        `http://localhost:8080/api/invite/${id}/respond?statusResponse=${responseStatus}`, null,                                      
        {headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },}
      );
      setNotifications(notifications.filter(n => n.Id !== id));
      toast.success(`Meeting invitation ${responseStatus}`);
      if(meetingId != null && responseStatus === 'JOINED')navgiate(`/meeting/${meetingId}`);
    }catch(err){
      toast.error(`Meeting invitation failed to ${responseStatus}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications?.length;

  return (
    <Popover className="text-white">

       <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative rounded-full hover:bg-dark-3 transition-colors"
          onClick = {getNotifications}
        >
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            <img
              src = '/icons/bellicon.svg'
              className="w-[30px] h-[30px] relative"
              width={30}
              height={30}
            />
          </div>
          
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 bg-dark-2 border border-dark-3 rounded-xl shadow-xl p-0 text-white"
        align="end"
        sideOffset={10}>

        <div className="p-4 border-b border-dark-3">
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
          
        <div className="max-h-[70vh] overflow-y-auto scrollbar-custom">
          {isLoading ?
          
          (<div className="p-6 text-center">
            <p className="text-gray-400">...Loading</p>
          </div>) 
          :
          notifications.length === 0 ? 

          (<div className="p-6 text-center">
            <div className="bg-dark-3 rounded-full p-3 inline-block mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-sky-1 mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-gray-400">No notifications yet</p>
          </div>) 
          : 
          
          (notifications.map(notification => (
              <div 
                key={notification.Id}
                className='p-4 border-b border-dark-3 bg-dark-1'
              >

              {notification?.type === 'INVITATION' || notification?.type === 'PERSONAL_IMMEDIATE'? (
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-dark-3 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">{notification?.type === 'INVITATION' ? 'Meeting Invitation' : 'Personal Immediate Join'}</h4>
                      <p className="text-sky-1 mt-1" key={notification.userDTO.id}>{notification.userDTO.name}</p>
                      <p className="text-sky-1 mt-1">{notification.message}</p>
                      <div className="mt-2">
                        <p className="font-medium">{notification.meetingTitle}</p>
                        {(notification?.type === 'INVITATION' && <p className="text-gray-400 text-sm mt-1">
                          {formatDate(notification.meetingDate)}
                        </p>)}
                        
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {notification?.type === 'INVITATION' ? 
                  (<button
                    onClick={() => handleInvitationResponse(notification.Id, 'ACCEPTED')}
                    className="flex-1 py-2 bg-blue-1 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                  >
                    Accept
                  </button>)
                  : 
                  (<button
                    onClick={() => handleInvitationResponse(notification.Id, 'JOINED', notification.meetingId)}
                    className="flex-1 py-2 bg-blue-1 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                  >
                    Join
                  </button>)}
                  
                  <button
                    onClick={() => handleInvitationResponse(notification.Id,'REJECTED')}
                    className="flex-1 py-2 bg-dark-4 hover:bg-dark-3 rounded-lg font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>) : 
              
              (<div>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-dark-3 rounded-full p-2">
                      {notification.answer === 'ACCEPTED' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-red-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold">Meeting Response</h4>
                      <p className="text-sky-1 mt-1" key={notification.userDTO.id}>{notification.userDTO.name}</p>
                      <p className={`mt-1 ${notification.answer === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
                        {notification.message}
                      </p>
                      <div className="mt-2">
                        <p className="font-medium">{notification.meetingTitle}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {formatDate(notification.meetingDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleMarkAsRead(notification.Id)}
                    className="px-4 py-1.5 bg-dark-4 hover:bg-dark-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              )}

              </div>
            ))
          )}
        </div>
        
      </PopoverContent>
    </Popover>
  )
}

