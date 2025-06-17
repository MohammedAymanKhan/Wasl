import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

const RecordingPlay = ({ url, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[1020px] flex-col gap-6 border-none bg-dark-1 px-0 py-0 text-white rounded-xl">
        <DialogHeader className="bg-dark-3 px-6 py-4">
              <DialogTitle className='text-xl font-bold'>
                Meeting Recording
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Secure playback of your recording
              </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video bg-black">
          <video
            src={url}
            title="Meeting Recording"
            allowFullScreen
            className="w-full h-full"
            controls
          ></video>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingPlay;