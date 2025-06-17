import React, { useState } from 'react';

const ParticipantHoverDetails = ({ participants, maxVisible = 3 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate color based on name
  const getColorClass = (name) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-orange-500', 'bg-green-500', 'bg-teal-500'
    ];
    const hash = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[hash];
  };

  return (
    <div className="relative inline-block">
      {/* Visible participants */}
      <div 
        className="flex -space-x-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {participants.slice(0, maxVisible).map((participant, index) => (
          <div 
            key={participant.id}
            className={`
              ${getColorClass(participant.name)} 
              w-8 h-8 rounded-full flex items-center justify-center 
              border-2 border-dark-1 text-white font-medium
              transition-all duration-200 cursor-pointer
              ${isHovered ? 'transform scale-110' : ''}
            `}
            style={{ 
              zIndex: maxVisible - index,
              transform: isHovered ? `translateX(${index * -4}px)` : 'none'
            }}
          >
            {participant.name.charAt(0).toUpperCase()}
          </div>
        ))}
        
        {participants.length > maxVisible && (
          <div 
            className={`
              bg-dark-3 w-8 h-8 rounded-full flex items-center justify-center 
              border-2 border-dark-1 text-xs text-white
              transition-all duration-200
              ${isHovered ? 'scale-110' : ''}
            `}
          >
            +{participants.length - maxVisible}
          </div>
        )}
      </div>
      
    
      {isHovered && (
        <div 
          className="absolute left-0 top-full mt-3 w-64 max-h-60 overflow-y-auto bg-dark-3 border border-dark-4 rounded-lg shadow-xl z-50 py-3 scrollbar-custom"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="px-4 py-2 font-semibold text-white border-b border-dark-4">
            All Participants ({participants.length})
          </div>
          
          <ul className="divide-y divide-dark-4">
            {participants.map(participant => (
              <li key={participant.id} className="py-3 px-4 hover:bg-dark-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`
                    ${getColorClass(participant.name)} 
                    w-10 h-10 rounded-full flex items-center justify-center 
                    text-white font-medium flex-shrink-0
                  `}>
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{participant.name}</p>
                    <p className="text-sky-200 text-sm truncate">{participant.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParticipantHoverDetails;