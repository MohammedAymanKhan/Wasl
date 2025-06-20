import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
import Loader from '../../Loader';
import { Users, LayoutList } from 'lucide-react';
import EndCallButton from './EndCallButton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const layoutTypes = ['Grid', 'Speaker-Left', 'Speaker-Right'];

export const MeetingRoom = () => {
  const [layout, setLayout] = useState('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const navigate = useNavigate();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };


  return (
    <section className="relative h-screen w-full overflow-hidden text-white">

      <div className="relative flex size-full items-center justify-center">

        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        
        <div
          className={cn(
            'ml-2 p-6 absolute right-0 top-0 bottom-0 bg-dark-1 rounded-md',
            {
              'hidden': !showParticipants,
              'block': showParticipants
            }
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)}/>
        </div>

      </div>

      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">

        <CallControls onLeave={() => navigate(`/`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {layoutTypes.map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase())
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {<EndCallButton/>}

      </div>
    </section>
  );
}

export default MeetingRoom;