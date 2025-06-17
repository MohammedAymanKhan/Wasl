import Loader from '@/components/Loader';
import { MeetingTypeList } from '@/components/pages/home/MeetingTypeList';
import { getCalls } from '@/customehooks/getCalls';
import getUser from '@/customehooks/getUser';

const query = {
  filter_conditions: {
    created_by_user_id: '',
    starts_at: {$gte: ''},
    ongoing: false
  },
  sort: [{ field: "starts_at", direction: 1 }],
  limit: 1 
};

const Home = () => {
  const [user, isLoadingUser] = getUser();
  if(isLoadingUser || !user) <Loader/>;

  const now = new Date(Date.now());

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  query.filter_conditions.starts_at.$gte = now.toISOString();
  query.filter_conditions.created_by_user_id = user?.id;

  let [callsData, isLoading] = getCalls(query);
  if(isLoading) <Loader/>;

  const upcomingcall = callsData?.calls[0]?.state?.startsAt;
  const upcomingcallTimming = upcomingcall?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const upcomingcallDate = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(upcomingcall);
 

  return (
    <section className="flex size-full flex-col gap-5 text-black">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-fit w-fit rounded p-2 text-center text-base font-[500] text-[1.1rem]">
            {upcomingcall 
            ? (`Upcoming Meeting On: ${upcomingcallDate} At: ${upcomingcallTimming}`)
            : (`No Upcoming Meeting is Scheduled`)}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;


