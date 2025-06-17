import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, UserPlus, Send, Check, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import getUser from '@/customehooks/getUser';

const MeetingInvitation = () => {
  const [user, isUserReady] = getUser();
  const [callsData, setCallsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [invitationMessage, setInvitationMessage] = useState('You\'re invited to join my meeting!');
  const [isSending, setIsSending] = useState(false);

  const now = new Date(Date.now());

  useEffect(() => {
    if (!isUserReady || !user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        setTimeout(() => {
          setCallsData([
            {
              id: '1',
              title: 'Project Kickoff Meeting',
              startsAt: new Date(Date.now() + 86400000),
              createdBy: { id: user.id, name: user.name, image: null },
              participants: []
            },
            {
              id: '2',
              title: 'Design Review Session',
              startsAt: new Date(Date.now() + 172800000),
              createdBy: { id: user.id, name: user.name, image: null },
              participants: []
            },
            {
              id: '3',
              title: 'Quarterly Planning',
              startsAt: new Date(Date.now() + 259200000),
              createdBy: { id: user.id, name: user.name, image: null },
              participants: []
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isUserReady, user]);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Simulated search API call
    setTimeout(() => {
      setSearchResults([
        { id: '101', name: 'Alex Johnson', email: 'alex@example.com', image: null },
        { id: '102', name: 'Taylor Smith', email: 'taylor@company.com', image: null },
        { id: '103', name: 'Jordan Lee', email: 'jordan.lee@work.com', image: null },
        { id: '104', name: 'Morgan Brown', email: 'morgan@brown.com', image: null },
        { id: '105', name: 'Casey Wilson', email: 'casey@wilson.org', image: null }
      ]);
    }, 300);
  };

  const toggleParticipant = (participant) => {
    if (selectedParticipants.some(p => p.id === participant.id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p.id !== participant.id));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const sendInvitations = () => {
    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }
    
    setIsSending(true);
    // Simulate API call to send invitations
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Invitations sent to ${selectedParticipants.length} participants!`);
      setSelectedMeeting(null);
      setSelectedParticipants([]);
    }, 1500);
  };

  if (!isUserReady || !user) return <Loader />;
  if (isLoading) return <Loader />;

  return (
    <section className="flex size-full flex-col gap-8 text-white">
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Upcoming Meetings</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {callsData.length > 0 ? (
          callsData.map((call) => (
            <MeetingCard 
              key={call.id}
              call={call} 
              onInviteClick={() => {
                setSelectedMeeting(call);
                setSearchQuery('');
                setSearchResults([]);
                setSelectedParticipants([]);
              }}
              isOwner={call.createdBy.id === user.id}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="bg-dark-3 rounded-full p-6 mb-6">
              <div className="bg-dark-4 rounded-full p-4">
                <CalendarIcon className="text-blue-1 size-10" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">No Upcoming Meetings</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              You don't have any scheduled meetings. Create a new meeting to get started.
            </p>
            <button className="bg-blue-1 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition">
              Schedule Meeting
            </button>
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-dark-2 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

            <div className="p-6 border-b border-dark-3 flex justify-between items-center">
              <h2 className="text-xl font-bold">Invite to Meeting</h2>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-dark-3"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-dark-3 rounded-lg p-2">
                    <CalendarIcon className="text-blue-1 size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedMeeting.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedMeeting.startsAt.toLocaleDateString()} • 
                      {selectedMeeting.startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                {searchResults.length === 0 && searchQuery.length > 1 ? (
                  <div className="text-gray-500 text-sm italic py-4 text-center bg-dark-3 rounded-lg">
                    No users found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map(user => (
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
            
            <div className="p-6 border-t border-dark-3 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedMeeting(null)}
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

          </div>

        </div>
      )}
    </section>
  );
};

const MeetingCard = ({ call, onInviteClick, isOwner }) => {
  const navigate = useNavigate();
  const formattedDate = call.startsAt.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const formattedTime = call.startsAt.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <section className="bg-dark-1 rounded-xl overflow-hidden border border-dark-3 hover:border-dark-4 transition-all shadow-lg">

      <div className="p-5 border-b border-dark-3">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-xl font-bold line-clamp-1">{call.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <CalendarIcon className="size-4" />
              <span>{formattedDate}</span>
              <span>•</span>
              <ClockIcon className="size-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
          
          <div className="bg-dark-3 size-10 rounded-full flex items-center justify-center">
            <span className="font-medium">ak</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">

        <div className="flex justify-between items-center">

          <div className="flex -space-x-2">
            {call.participants.slice(0, 3).map((p, idx) => (
              <div 
                key={p.id}
                className={`bg-dark-3 size-8 rounded-full flex items-center justify-center border-2 border-dark-1`}
                style={{ zIndex: 3 - idx }}
              >
                <span className="text-xs font-medium">{p.name.charAt(0)}</span>
              </div>
            ))}
            {call.participants.length > 3 && (
              <div className="bg-dark-3 size-8 rounded-full flex items-center justify-center border-2 border-dark-1 text-xs">
                +{call.participants.length - 3}
              </div>
            )}
            {call.participants.length === 0 && (
              <div className="text-gray-500 text-sm">No participants yet</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/meeting/${call.id}`)}
              className="px-4 py-2 rounded-lg bg-blue-1 hover:bg-blue-600 transition flex items-center gap-2"
            >
              <PlayIcon className="size-4" />
              Start
            </button>
            
            {isOwner && (
              <button 
                onClick={onInviteClick}
                className="px-4 py-2 rounded-lg bg-dark-4 hover:bg-dark-3 transition flex items-center gap-2"
              >
                <UserPlus className="size-4" />
                Invite
              </button>
            )}
          </div>

        </div>

      </div>
      
    </section>
  );
};

// Icon components
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

const PlayIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={cn("size-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Loader = () => (
  <div className="flex justify-center items-center h-[50vh]">
    <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-blue-1"></div>
  </div>
);

export default MeetingInvitation;