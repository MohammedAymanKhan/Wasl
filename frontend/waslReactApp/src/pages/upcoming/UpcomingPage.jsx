import Loader from "@/components/Loader";
import MeetingCard from "@/components/pages/MeetingCard";
import MeetingInvitation from "@/components/pages/upcoming/MeetingInvitation";
import { getCalls } from "@/customehooks/getCalls";
import getUser from "@/customehooks/getUser";
import { useState } from "react";

const query = {
  filter_conditions: {
    starts_at: { $gte: '' },
  },
  sort: [{ field: "starts_at", direction: 1 }],
};

const UpcomingPage = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [user, isLoadingUser] = getUser();

  query.filter_conditions.starts_at.$gte = new Date(Date.now()).toISOString(); 
  const [callsData, isLoading] = getCalls(query);

  if(isLoading || isLoadingUser || !user) return <Loader/>;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Upcoming Meeting</h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {callsData?.calls && callsData?.calls.length > 0 ?
          (callsData?.calls.map((call) => (
          <MeetingCard 
            call = {call} 
            type = {'upcoming'} 
            key = {call?.id} 
            onInviteClick={() => setSelectedMeeting(call)}
            isOwner = {user.id === call.state.createdBy?.id}
          />
          ))) 
          :
          (isLoading ? <Loader/> : <h1 className="text-2xl font-bold text-white">No Upcoming Calls</h1>)
        }
      </div>

      {selectedMeeting != null && (
        <MeetingInvitation 
          isOpen = {selectedMeeting !==null}
          onClose = {() => setSelectedMeeting(null)}
          call = {selectedMeeting}
        />
      )}

    </section>
  )
}

export default UpcomingPage;