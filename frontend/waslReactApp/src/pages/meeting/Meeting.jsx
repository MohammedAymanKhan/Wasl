import { AuthContext } from "@/auth/AuthProvider";
import Loader from "@/components/Loader";
import { MeetingRoom } from "@/components/pages/meeting/MeetingRoom";
import MeetingSetup from "@/components/pages/meeting/MeetingSetup";
import useGetCallById from "@/customehooks/useGetCallById";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useContext, useEffect, useState } from "react";
import { addYears } from "react-datepicker/dist/date_utils";
import { useParams } from "react-router-dom";


const Meeting = () => {
  const { meetingId } = useParams();
  const { keycloak } = useContext(AuthContext);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [ call, isCallLoading ] = useGetCallById(meetingId);

  if (!keycloak.authenticated || isCallLoading) return <Loader/>;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  useEffect(async() => {

    if(!call){
      const newStartTime = new Date().toISOString();
      
      await call.update({
        custom: {
          ...call.state.custom, 
          starts_at: newStartTime
        }
      });
    }

  },[call]);

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? 
        (<MeetingSetup setIsSetupComplete={setIsSetupComplete} />) 
        : 
        (<MeetingRoom />)
        }

        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting;