import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useContext, useRef, useState } from "react";
import { Search, Send, Check, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from "axios";
import { AuthContext } from "@/auth/AuthProvider";


const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={cn("size-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);


const MeetingInvitation = ({isOpen, onClose, call, isPersonal = false}) => {
  const {keycloak} = useContext(AuthContext);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [invitationMessage, setInvitationMessage] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const timeoutRef = useRef(null);

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

  const toggleParticipant = (participant) => {
    if (selectedParticipants.some(p => p.id === participant.id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p.id !== participant.id));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length <= 1) {
      setSearchResults([]);
      return;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulated search API call
    timeoutRef.current = setTimeout(async() => {
      clearTimeout(this);
      try {
        const response = await axios.get(`http://localhost:8080/api/users/search`, {
          params: { 
            query: searchQuery,
            invitationId: !isPersonal ? call?.id : '',
          },
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
        
        setSearchResults(response.data);
      } catch (err) {
        toast('Failed to search users');
        console.error('Search error:', err);
      }
    }, 300);
  };

  const sendInvitations = async() => {
    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }
    
    setIsSending(true);
    const selectedParticipantsIds = selectedParticipants.map(participant => participant.id);
   
    try{
     await axios.post(
      "http://localhost:8080/api/invite", 
      { 
        meetingId: call.id,
        participantsId: selectedParticipantsIds,
        message: invitationMessage,
        type: isPersonal ? 'PERSONAL_IMMEDIATE' : ''
      },
      { 
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );

      setIsSending(false);
      setSelectedParticipants([]);
      setInvitationMessage('');
      setSearchQuery('');
      setSearchResults([]);
      toast.success(`Invitations sent to ${selectedParticipants.length} participants!`);
    }catch(err){
      toast('Failed to invite users');
      console.error('send Invitations error:', err);
    } 
  };

  return (
    <Dialog className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" open={isOpen} onOpenChange={onClose}>

      <DialogContent className="bg-dark-2 rounded-xl !max-w-2xl !w-full !max-h-[94vh] overflow-hidden scrollbar-custom flex flex-col !border-none">

        <DialogHeader className="p-6 border-b border-dark-3 flex justify-between text-white items-start">
          <DialogTitle className="text-2xl font-bold">
            Invite to Meeting
          </DialogTitle>
          <DialogDescription>
            Invite users by seraching there name or by email
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex-1 overflow-y-auto scrollbar-custom text-white">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-dark-3 rounded-lg p-2">
                <CalendarIcon className="text-blue-1 size-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-gray-400 text-sm">
                  {date} • 
                  {time}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-dark-3 border border-dark-4 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-1"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3">Selected Participants</h4>
            {selectedParticipants.length === 0 ? (
              <div className="text-gray-500 text-sm italic py-4 text-center bg-dark-3 rounded-lg">
                No participants selected yet
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedParticipants.map(participant => (
                  <div 
                    key={participant.id}
                    className="bg-dark-3 px-3 py-1.5 rounded-full flex items-center gap-2"
                  >
                    <div className="bg-dark-4 size-6 rounded-full flex items-center justify-center text-xs">
                      {participant.name.charAt(0)}
                    </div>
                    <span>{participant.name}</span>
                    <button 
                      onClick={() => toggleParticipant(participant)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3">Add Personal Message (Optional)</h4>
            <textarea
              className="w-full bg-dark-3 border border-dark-4 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-1"
              rows={3}
              placeholder="Add a personal message to your invitation..."
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
            />
          </div>

          <div>
            <h4 className="font-medium mb-3">Search Results</h4>
            {searchResults.length === 0 && searchQuery.length > 1 ? 
            (
              <div className="text-gray-500 text-sm italic py-4 text-center bg-dark-3 rounded-lg">
                No users found for "{searchQuery}"
              </div>
            ) : 
            (
              <div className="space-y-2">
                {(searchResults || []).map(user => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-dark-3 ${
                      selectedParticipants.some(p => p.id === user.id) 
                        ? 'bg-blue-1/10 border border-blue-1/30' 
                        : 'bg-dark-4'
                    }`}
                    onClick={() => toggleParticipant(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-dark-3 size-10 rounded-full flex items-center justify-center">
                        <span className="font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                    {selectedParticipants.some(p => p.id === user.id) ? (
                      <div className="bg-blue-1 size-5 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="border border-gray-600 size-5 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="p-6 border-t border-dark-3 flex justify-end gap-3 text-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-dark-4 hover:bg-dark-3 transition"
          >
            Cancel
          </button>
          <button 
            onClick={sendInvitations}
            disabled={selectedParticipants.length === 0 || isSending}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedParticipants.length === 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-1 hover:bg-blue-600'
            } transition`}
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full size-4 border-b border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Invitations
              </>
            )}
          </button>
        </div>

      </DialogContent>

    </Dialog>
  );
};

export default MeetingInvitation;