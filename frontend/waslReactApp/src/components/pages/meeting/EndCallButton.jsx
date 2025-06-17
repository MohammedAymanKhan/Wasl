import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EndCallButton = () => {
  const call = useCall();
  const navigate = useNavigate();

  if (!call) throw new Error('useStreamCall must be used within a StreamCall component.',);

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner){
    let unsubscribe;
    console.log('called end everyone called');

    // Function to handle call end
    const handleCallEnded = (unsubscribeFun) => {
      toast('The call has ended.', {
        position: 'top-right',
        autoClose: 3000,
        style: {
          border: "none",
          backgroundColor: "#1C1F2E",
          color: "#ffffff",
        },
      });
      navigate('/');
      console.log(unsubscribe);
      unsubscribeFun();
    };

    unsubscribe = call.on('call.ended', () => handleCallEnded(unsubscribe));

    return null;
  } 

  const endCall = async () => {
    await call.endCall();
    navigate('/');
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;