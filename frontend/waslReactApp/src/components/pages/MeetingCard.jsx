import { Avatar } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {UserPlus, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import ParticipantHoverDetails from "./ParticipantHoverDetails";
import { useState } from "react";
import RecordingPlay from "./recording/RecordingPlay";

const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={cn("size-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={cn("size-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const MeetingCard = ({ call, type, isOwner, onInviteClick,   participants }) => {
  const naviagte = useNavigate();
  const [playRecording, setPlayRecording] = useState(false);
  const title = call?.state?.custom?.description || call?.filename?.substring(0, 20) || 'Personal Meeting';
  const date = call?.state?.startsAt?.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }) || call?.start_time?.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const time = call?.state?.startsAt?.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) || call?.start_time?.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const createdBy = {
    userId: call.state.createdBy?.id || null,
    name: call.state.createdBy?.name || call.state.createdBy?.id || null,
    avatar: call.state.createdBy?.image || null,
  };
  const link = type === 'recordings' ? call?.myRecordingData?.url : `localhost:5173//meeting/${call?.id}`;
  const buttonIcon1 = type === 'recordings' || type === 'upcoming' ? '/icons/play.svg' : null;
  const buttonText= type === 'recordings' ? 'Play' : 'Start';
  const handleClick = type === 'recordings' ? () => setPlayRecording(true) : () => naviagte(`/meeting/${call?.id}`);    

  return (
    <section 
      className="bg-dark-1 rounded-xl border border-dark-3 hover:border-dark-4 transition-all shadow-lg"    
      key={call?.id}>

      <article className="p-5 border-b border-dark-3">

        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
            <div className="flex items-center gap-2 mt-2 text-gray-400 text-nowrap">
              <CalendarIcon className="size-4" />
              <span>{date}</span>
              <span>•</span>
              <ClockIcon className="size-4" />
              <span>{time}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1">
            <Avatar 
              className={cn(`!bg-dark-3 !size-10 !rounded-full`, {})}
              name={createdBy?.name}>
              {createdBy?.name}
            </Avatar>
            {createdBy?.name}
          </div>
        </div>

      </article>

      <article className="p-5">

      <div className="flex justify-between items-center">
        
        <div className="flex -space-x-2 relative">

          {type !== 'recordings' && (!call.participantList || call.participantList.length === 0 ? 
          (<div className="text-gray-500 text-sm">No participants</div>)
          : 
      
          (<ParticipantHoverDetails participants = {call.participantList
          } maxVisible = {5}/>)

          )}

        </div>

        {type !== 'ended' && (
          <div className="flex gap-2">

            {isOwner &&
            // start or play button
            <button 
              onClick={handleClick} 
              className="px-4 py-2 rounded-lg bg-blue-1 hover:bg-blue-600 transition flex items-center gap-2"
            >
              {buttonIcon1 && (<img src={buttonIcon1} alt="feature" width={20} height={20} />)}
              {buttonText}
            </button>
            }

            {isOwner && type === 'upcoming' ? 
            // Invite button
            (<button 
              onClick={onInviteClick}
              className="px-4 py-2 rounded-lg bg-dark-4 hover:bg-dark-3 transition flex items-center gap-2"
            >
             <UserPlus className="size-4" />
              Invite   
            </button>) 
            : (// copy
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast("Link Copied");
              }}
              className="px-4 py-2 rounded-lg bg-blue-1 hover:bg-blue-600 transition flex items-center gap-2">

              <img
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />

              &nbsp; Copy Link
            </button>
            )}
          </div>
        )}

      </div>

      </article>

        {(playRecording && <RecordingPlay url = {call?.myRecordingData.url} isOpen={playRecording} onClose={() => setPlayRecording(false)}/>)}

    </section>
  );
}


export default MeetingCard;

