import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider"
import Login from "./auth/Login"
import Logout from "./auth/Logout"
import Home from "./pages/home/Home"
import PrivateRoute from "./auth/PrivateRoute"
import Refreshtoken from "./auth/Refreshtoken"
import Rootlayout from "./pages/home/Rootlayout"
import Meeting from "./pages/meeting/Meeting"
import RootWrapper from "./pages/RootWrapper"
import UpcomingPage from "./pages/upcoming/UpcomingPage"
import PreviousPage from "./pages/previous/PreviousPage"
import { Test } from "./test/Test"
import RecordingPage from "./pages/recording/RecordingPage"
import PersonalRoom from "./pages/personal/PersonalRoom"
import MeetingInvitation from "./test/UpcomingTest"
import RecordingPlay from "./components/pages/recording/RecordingPlay"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      
        <Refreshtoken/>

        <Routes>  
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<RootWrapper/>}>

              <Route element={<Rootlayout/>}>
                <Route path="/" element={<Home/>} />
                <Route path="/upcoming" element = {<UpcomingPage/>} />
                <Route path="/pervious" element = {<PreviousPage/>} />
                <Route path="/recordings" element = {<RecordingPage/>} />
                <Route path="/personal-room" element = {<PersonalRoom/>} />
                <Route path="/recording-play/:recordingurl" element = {<RecordingPlay/>} />
              </Route>
              
              <Route path="/meeting/:meetingId" element={<Meeting/>} />
            </Route> 
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
