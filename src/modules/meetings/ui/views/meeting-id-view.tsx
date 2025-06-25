"use client"
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    meetingId: string;
};

export const MeetingIdView = ({meetingId}: Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId }),
    )
   return(
    <>
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        {JSON.stringify(data, null, 2)}
    </div>
    </>
   )
}

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
         title="Loading Meetings"
         description="This may take a few seconds"/>
    )
}

export const MeetingIdViewError = () => {
  return(
    <ErrorState
            title="Error Loading Meetings"
            description="Something went wrong"/>
  )
}