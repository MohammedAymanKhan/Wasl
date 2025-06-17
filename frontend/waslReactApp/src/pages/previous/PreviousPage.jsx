import Loader from "@/components/Loader";
import MeetingCard from "@/components/pages/MeetingCard";
import { getCalls } from "@/customehooks/getCalls";

const query = {
  filter_conditions: {
    starts_at: { $lt: '' },
    ongoing: false,
  },
  sort: [{ field: "ended_at", direction: 1 }],
};

const PreviousPage = () => {
  query.filter_conditions.starts_at.$lt = new Date(Date.now()).toISOString();
  let [callsData, isLoading] = getCalls(query);

  if(isLoading) return <Loader/>;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous Calls</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {callsData?.calls && callsData?.calls.length > 0 ?
          (callsData?.calls.map((call) => (
          <MeetingCard 
            call = {call} 
            type = {'ended'} 
            key={call?.id} 
          />
          ))) 
          :
          (<h1 className="text-2xl font-bold text-white">No Previous Calls</h1>)
        }
      </div>
    </section>
  );
};

export default PreviousPage;