import Loader from "@/components/Loader";
import MeetingCard from "@/components/pages/MeetingCard";
import { getCalls } from "@/customehooks/getCalls";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const query = {
  filter_conditions: {
    starts_at: { $lt: new Date(Date.now()).toISOString() },
    ongoing: false
  },
  sort: [{ field: "ended_at", direction: 1 }],
};

export const RecordingPage = () => {
  const [recordings, setRecordings] = useState(null);

  let [callsData, isLoading] = getCalls(query);

  useEffect(() => {
  if (callsData?.calls) {
    const fetchRecordings = async () => {
      try {
        const recordingsData = await Promise.all(
          callsData.calls.map(async (call) => {
            try {
              // 1. Get recording response object
              const recordingResponse = await call.queryRecordings();
              
              // 2. Check if we have valid recordings
              if (!recordingResponse || 
                  !recordingResponse.recordings || 
                  recordingResponse.recordings.length === 0) {
                return null;
              }

              // 3. Directly use the recordings array
              call.myRecordingData = recordingResponse.recordings;

              console.log(recordingResponse.recordings);
              
              return call;
            } catch (error) {
              console.error(`Error fetching recordings for call ${call.id || 'unknown'}:`, error);
              return null;
            }
          })
        );

        // 4. Filter out null values
        const validRecordings = recordingsData.filter(recording => recording !== null);
        setRecordings(validRecordings);
        
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
        toast('Try again later', {
          style: {
            border: "none",
            backgroundColor: "#1C1F2E",
            color: "#ffffff",
          },
        });
      }
    };

    fetchRecordings();
  }
}, [callsData]);

  if(isLoading) return <Loader/>;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Recordings</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {recordings && recordings.length > 0 ?
          (recordings.map((call) => (
          <MeetingCard 
            call = {call} 
            type = {'recordings'} 
            key={call?.id} 
            isOwner = {true}
          />
          ))) 
          :
          (<h1 className="text-2xl font-bold text-white">No Recordings</h1>)
        }
      </div>
    </section>
  )
}

export default RecordingPage;

