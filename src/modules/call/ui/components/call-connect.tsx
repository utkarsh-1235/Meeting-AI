"use client";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { CallUI } from "./call-ui";

interface Props{
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage

}: Props) => {
    const trpc = useTRPC();
    const{mutateAsync: generateToken} = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    )

    const [client, setClient] = useState<StreamVideoClient>();
    useEffect(()=>{
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage
            },
            tokenProvider: async () => {
                               const res = await generateToken();
                              if (!res?.token) throw new Error("Token is empty");
                            return res.token;
                               }
        });
         setClient(_client);
         return () => {
            _client.disconnectUser();
            setClient(undefined);
         }

    },[userId, userName, userImage, generateToken])

    const [call, setCall] = useState<Call>();
useEffect(() => {
    if (!client) return;

    let _call: Call;

    const setupCall = async () => {
        _call = client.call("default", meetingId);
         await _call.camera.enable();
        // _call.microphone.enable();
        if (!_call.microphone.enabled) {
            await _call.microphone.enable();
        }

        // Listen to AI and transcription
        _call.on("ai_message", (msg) => {
          console.log("🧠 AI responded:", msg.text);
        });

        _call.on("transcription", (event) => {
          console.log("🎤 You said:", event.text);
        });
        setCall(_call);
    };

    setupCall();

    return () => {
        if (_call && _call.state.callingState !== CallingState.LEFT) {
            _call.leave();
            _call.endCall();
            setCall(undefined);
        }
    };
}, [client, meetingId])

    if(!client || !call){
      return (
        <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
          <LoaderIcon className="size-6 animate-spin text-white"/>
        </div>
      );
    }
    return (
      <StreamVideo client={client}>
          <StreamCall call={call}>
               <CallUI meetingName={meetingName}/>
          </StreamCall>
      </StreamVideo>
    );
}