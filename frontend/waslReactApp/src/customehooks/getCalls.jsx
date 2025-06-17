import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner";
import getUser from "./getUser";
import axios, { Axios } from "axios";
import { AuthContext } from "@/auth/AuthProvider";


export const getCalls = (query) => {
  const client = useStreamVideoClient();
  const [callsData, setCallsData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [user, isLoadingUser] = getUser();
  const {keycloak} = useContext(AuthContext);

  useEffect(() => {
    if(!client || !query || !user) return;

    setIsLoading(true);
    const fetchCalls = async() => {
      try{

        //1. get MeetingIds as Participants me
        const meetingIdsResponse  = await axios.get('http://localhost:8080/api/meeting', 
        { headers: {
          Authorization: `Bearer ${keycloak.token}`
        }});

        //2. get all calls as participant & owner
        if(meetingIdsResponse?.data){ 
          query.filter_conditions.$or = [
            { created_by_user_id: user.id },
            { id: { $in: meetingIdsResponse.data } },
          ];
        }else{
          query.filter_conditions.created_by_user_id = user.id;
        }
        const {calls, prev, next} = await client.queryCalls(query);

        //3. get Participants details
        const meetingIds = calls.map(call => call.id);
        if(meetingIds?.length > 0){ 
          const pariticpantsResponse = await axios.post('http://localhost:8080/api/meeting/participants', 
            meetingIds, 
            {
              headers: {
                Authorization: `Bearer ${keycloak.token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          calls.map(call => {
            if(pariticpantsResponse.data[call.id]){
              call.participantList = pariticpantsResponse.data[call.id];
            }
          }); 
        }

        setCallsData({calls, prev, next});
      }catch(error){
        console.error(error);
        toast('Try again faild to load data',{
          style: {
            border: "none",
            backgroundColor: "#1C1F2E",
            color: "#ffffff",
          },
        });
      }finally{
        setIsLoading(false);
      } 
    }

    fetchCalls();
  }, [client, query, isLoadingUser, user]);

  return [callsData, isLoading];
}
