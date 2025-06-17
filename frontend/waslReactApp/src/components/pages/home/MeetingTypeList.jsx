import { useContext, useState } from "react";
import { cards } from "../../../constands/CardMeeting"
import PopupMeetingModal from "./PopupMeetingModal";
import { AuthContext } from "@/auth/AuthProvider";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactDatePicker from 'react-datepicker';
import { Input } from "@/components/ui/input";

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

export const MeetingTypeList = () => {

  const [meetingState, setMeetingState] = useState(null);
  const { keycloak } = useContext(AuthContext);
  const client = useStreamVideoClient();
  const [callDetails, setCallDetail] = useState(null);
  const [values, setValues] = useState(initialValues);
  const navgaite = useNavigate();

  const createMeeting = async () => {
    if(!keycloak.authenticated || !client) return;

    try{
      if (!values.dateTime) {
        toast('Please select a date and time',{
          style: {
            border: "none",
            backgroundColor: "#1C1F2E",
            color: "#ffffff",
          },
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create meeting');

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetail(call);

      if(!values.description){
        navgaite(`/meeting/${call.id}`);
      }

      toast('Meeting Created',{
        style: {
          border: "none",
          backgroundColor: "#1C1F2E",
          color: "#ffffff",
        },
      });

    }catch(error){
      console.log("Error in creating meeting", error);
      toast("Failed to create meeting", {
        style: {
          border: "none",
          backgroundColor: "#1C1F2E",
          color: "#ffffff",
        },
      });
    }

  };

   const meetingLink = `localhost:5713/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

    {/* To Display Four types of Cards which are InstantMeeting, JoiningMeeting, ScheduleMeeting & meetingRecordings */}
    {cards.map(card => (
      <div className={`px-4 py-6 flex flex-col justify-between w-full xl:max-w-[300px] min-h-[260px] rounded-[14px] cursor-pointer ${card.bgColor}`}
      key  = {card.key}
      onClick={ card.key === 'meetingRecordings' ?
        () => navgaite('/recordings'):
        () => setMeetingState(card.key)}>
        <div className="flex-center glassmorphism size-12 rounded-[10px]">
          <img
            src= {card.img}
            alt = {card.title}
            width={27}
            height={27}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{card.title}</h1>
          <p className="text-lg font-normal text-light-black">{card.description}</p>
        </div>
      </div>
    ))}

    {/* These are pop-ups when clicked on card display */}

    {/*This one for ScheduleMeeting where one pop-up for creating ScheduleMeeting & another after ScheduleMeeting is created which gives meeting link*/}
    {!callDetails ? (
      <PopupMeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(null)}
        title="Create Meeting"
        handleClick={createMeeting}
      >

        <div className="flex flex-col gap-2.5">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Add a description
          </label>

          <textarea
            className="bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 p-2 rounded"
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Select Date and Time
          </label>

          <ReactDatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({ ...values, dateTime: date})}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full rounded bg-dark-3 focus:outline-none p-2"
          />
        </div>
      </PopupMeetingModal>
    ) : (
    <PopupMeetingModal
      isOpen={meetingState === 'isScheduleMeeting'}
      onClose={() => {
        setMeetingState(null);
        setCallDetail(null);
      }}
      title="Meeting Created"
      handleClick={() => {
        navigator.clipboard.writeText(meetingLink);
        toast('Link Copied',{
          style: {
            border: "none",
            backgroundColor: "#1C1F2E",
            color: "#ffffff",
          },
        });
      }}
      image={'/icons/checked.svg'}
      buttonIcon="/icons/copy.svg"
      className="text-center"
      buttonText="Copy Meeting Link"
    />
    )}

    {/* this one for create InstantMeeting & join immediately*/}
    <PopupMeetingModal
      isOpen={meetingState === 'isInstantMeeting'}
      onClose={() => setMeetingState(null)}
      title="Create Meeting"
      description = "meeting start instantly know" 
      handleClick={createMeeting}
    />

    {/* this one to join meeting by pasteing link & join immediately*/}
    <PopupMeetingModal
      isOpen={meetingState === 'isJoiningMeeting'}
      onClose={() => setMeetingState(null)}
      title="Type the link here"
      className="text-center"
      buttonText="Join Meeting"
      description = "Enter the link to join the meeting room" 
      handleClick={() => navgaite(values.link)}
    >
      <Input
        type="text"
        placeholder="Meeting link"
        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setValues({ ...values, link: e.target.value })}
      />
    </PopupMeetingModal>  

  </section>);
}


export default MeetingTypeList;