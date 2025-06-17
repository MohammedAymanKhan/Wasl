import Loader from "@/components/Loader";
import getToken from "@/customehooks/getToken";
import getUser from "@/customehooks/getUser";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const apiKey = 'fbvg5vddzjut';

const StreamVideoProvider = ({ children }) => {

  const [videoClient, setVideoClient] = useState();
  const [user, isLoadingUser] = getUser();
  const [streamToken, error] = getToken("/token");

  useEffect(() => {
    if(!isLoadingUser && streamToken && !videoClient){
      if (isLoadingUser && error) return;
      if (!apiKey) throw new Error('Stream API key is missing');

      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user.id,
          name: user.name
        },
        token: streamToken,
      });

      setVideoClient(client);
    }
  }, [isLoadingUser, streamToken]);

  if (!videoClient) return <Loader />;

  return (
  <StreamVideo client={videoClient}>
    {children}
  </StreamVideo>
  );

};

export default StreamVideoProvider;