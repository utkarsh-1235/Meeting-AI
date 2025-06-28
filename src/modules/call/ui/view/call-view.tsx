"use client";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client"
import {useSuspenseQuery} from "@tanstack/react-query";
import { CallProvider } from "../components/call-rovider";

interface Props{
    meetingId: string
}

export const CallView = ({
    meetingId
}:Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id: meetingId}));

    if(data.status === "completed"){
        return(
            <div className="flex h-screen items-center justify-center">
                <ErrorState
                title="Meeting has ended"
                description="You can no longer join this meeting"/>
            </div>
        )
    }
    return(
        <CallProvider meetingId={meetingId} meetingName={data.name}/>
    )
}

export const LoadingCallView = ()=>{
    return(
        <div className="flex h-screen items-center justify-center">
       <LoadingState
                title="Loading your Meeting"
                description="This may take a few seconds"/>  
                </div>
    )
}

export const ErrorCallView = ()=>{
    return(
         <div className="flex h-screen items-center justify-center">
        <ErrorState
                    title="Error in Loading your Meeting"
                    description="Something went wrong"/>          
                    </div>
    )
}
