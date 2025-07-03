"use client";

import { authClient } from "@/lib/auth-client";
import { LoadingState } from "@/components/ui/loading-state";
import { ChatUi } from "./chatui";

interface Props {
    meetingId: string;
    meetingName: string;
}

export const ChatProvider = ({ meetingId, meetingName}: Props) => {
    const {data, isPending} = authClient.useSession();

    console.log("Data: ", data?.user);
    console.log("isPending: ", isPending);

    if(isPending || !data?.user){
        return(
            <LoadingState
            title="Loading..."
            description="Please wait while we load the chat"
            />
        )
    }
    return(
        <ChatUi
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name}
        userImage={data.user.image ?? ""}
        />
  )
}