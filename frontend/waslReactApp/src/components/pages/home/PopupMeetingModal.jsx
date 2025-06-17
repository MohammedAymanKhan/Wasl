import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";


export const PopupMeetingModal = ({
  isOpen, onClose, title, className, children, handleClick, 
  buttonText, instantMeeting, image, buttonClassName, buttonIcon, description}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">

        <div className="flex flex-col gap-6">

          {image && (
            <div className="flex justify-center">
              <img src={image} alt="checked" width={72} height={72} />
            </div>
          )}

          <DialogHeader>
            <DialogTitle className={`text-3xl font-bold leading-[42px] ${className}`}>
              {title} 
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          {children}

          <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={handleClick}>

            {buttonIcon && (
              <img
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>

        </div>

      </DialogContent>
      
    </Dialog>
  )
}


export default PopupMeetingModal;