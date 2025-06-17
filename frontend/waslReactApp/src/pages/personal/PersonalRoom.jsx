import Loader from "@/components/Loader";
import MeetingInvitation from "@/components/pages/upcoming/MeetingInvitation";
import { Button } from "@/components/ui/button";
import getUser from "@/customehooks/getUser";
import useGetCallById from "@/customehooks/useGetCallById";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Table = ({title, description}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

export const PersonalRoom = () => {
  const navigate = useNavigate();
  const client = useStreamVideoClient();
  const [user] = getUser();
  const [invite, setInvite] = useState(false);
  const [call, setCall] = useState(null);

  const meetingId = user?.id;
  const meetingLink = `/meeting/${meetingId}`;

  const startRoom = async () => {
    if (!client || !user || !call) return;
    navigate(`/meeting/${meetingId}`);
  };

  useEffect(() => {
    if(user != null){
      const getPersonalCall = async() => {
        const newCall = client.call("default", meetingId);
        let response = await newCall.getOrCreate({
          data: {
            custom: {
              description: `${user.firstName} ${user.lastName}'s Meeting Room`
            },
            starts_at: new Date().toISOString(),
          },
        });
        response = await newCall.update({
          data: {
            starts_at: new Date().toISOString(),
          },
        });
        setCall(newCall);
      }

      getPersonalCall();
    }
  },[client, user]);
 
  if(call == null) return <Loader/>;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Name" description={`${user?.firstName} ${user?.lastName}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast("Link Copied",{
              style: {
                border: "none",
                backgroundColor: "#1C1F2E",
                color: "#ffffff",
              },
            });
          }}
        >
          Copy Invitation
        </Button>

        <Button
          className="bg-dark-3"
          onClick={() => setInvite(true)}
        >
          Invite
        </Button>
      </div>

      {(invite && <MeetingInvitation
        isOpen = {invite == true}
        onClose = {() => setInvite(false)}
        call = {call}
        isPersonal = {true}
      />)}
    </section>
  )
}

export default PersonalRoom;