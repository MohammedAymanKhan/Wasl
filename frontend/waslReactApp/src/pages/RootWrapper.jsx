import StreamVideoProvider from '@/streamshandle/StreamVideoProvider';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'

const RootWrapper = () => {
  return (<>
    <StreamVideoProvider>
      <Outlet />
    </StreamVideoProvider>
    <Toaster />
  </>);
}


export default RootWrapper;