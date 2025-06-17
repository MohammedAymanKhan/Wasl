
import Loader from '@/components/Loader';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

export const fetchCalls = () => {
  const client = useStreamVideoClient();

  if(!client) <Loader/>;

  const [calls, setCalls] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchcalls = async () => {
      try {
        setLoading(true);

        const now = new Date(Date.now());

        const callQuery = {
          filter_conditions: {
            created_by_user_id: '3e1fb512-8e4a-4894-9666-16c887f8992b',
            // ended_at: {$lte: now.toISOString()},
            ongoing: false,  
          },
          sort: [{ field: "ended_at", direction: 1 }],
          // limit: 4,
        };
        
        const { calls, prev, next} = await client.queryCalls(callQuery);
       

        calls.forEach(call=>console.log('CallId: ',call.id,'endedAt: ',call?.state?.endedAt));
    

        await Promise.all(
        calls.map(async (call) => {
          try {
            
            const recordingList = await call.queryRecordings();
            console.log(recordingList);
            if (recordingList.recordings.length <= 0) return null;
            console.log('CreatedBy: ',call.state.createdBy?.id);
            console.log(recordingList);
          } catch (error) {
            console.error(`Error fetching recordings for call ${call.id || 'unknown'}:`, error);
          }
        }));

        setCalls(calls);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (client) {
      fetchcalls();
    }
  }, [client]); 

  return [calls, loading];
};