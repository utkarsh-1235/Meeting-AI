import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {Channel as StreamChannel, StreamChat} from "stream-chat";
import {
    // useCreateChatClient,
    Chat,
    Channel,
    MessageList,
    Thread,
    Window,
    MessageInput
} from "stream-chat-react";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/ui/loading-state";

interface ChatUIProps{
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string | undefined;
}

export const ChatUi = ({
    meetingId,
    // meetingName,
    userId,
    userName,
    userImage
}:ChatUIProps) => {
    const trpc = useTRPC();
    const {mutateAsync: generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions(),
    )

    const [channel, setChannel] = useState<StreamChannel>();
    const [client, setClient] = useState<StreamChat>();

    useEffect(() => {
    const initChat = async () => {
      try {
       const res = await generateChatToken();
        if (!res?.token) {
              throw new Error("Failed to fetch chat token");
          }
          const { token } = res;
        const chatClient = StreamChat.getInstance(
            process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        );

        await chatClient.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        const _channel = chatClient.channel("messaging", meetingId, {
          members: [userId],
        });

        await _channel.watch();

        setClient(chatClient);
        setChannel(_channel);
      } catch (error) {
        console.error("Chat client init failed:", error);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [generateChatToken, userId, userName, userImage, meetingId]);

    // const tokenProvider = useMemo(() => {
    //     return async () => {
    //         const res = await generateChatToken();
    //         if (!res?.token) throw new Error("Failed to fetch chat token");
    //         return res.token;
    //     };
    // }, [generateChatToken]);

    // const client = useCreateChatClient({
    //     apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    //     tokenOrProvider: tokenProvider,
    //     userData: {
    //         id: userId,
    //         name: userName,
    //         image: userImage
    //     }
    // });
  
    // console.log("client", client);
    // useEffect(() => {
    //     if(!client) return;

    //     const channel = client.channel("messaging", meetingId, {
    //         members: [userId],
    //     })

    //     setChannel(channel);
    // },[client, meetingId, meetingName, userId])
    
    if(!client){
        return (
            <LoadingState
            title="Loading Chat"
            description="This may take a few second"/>
        );
    }
    return(
    <div className="bg-white rounded-lg border overflow-hidden">
        <Chat client={client}>
            <Channel channel={channel}>
                <Window>
                    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                       <MessageList/>
                    </div>
                    <MessageInput/>
                </Window>
                <Thread/>
            </Channel>
        </Chat>
    </div>
 )
}