"use client"
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MeetingIdViewHeader } from "../Components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../Components/update-meeting-dialog";
import { useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { UpcomingState } from "../Components/upcoming";
import { ActiveState } from "../Components/active-state";
import { CancelledState } from "../Components/cancelled";
import { CompletedState } from "../Components/completed-state";
import { ProcessingState } from "../Components/processing-state";

interface Props {
    meetingId: string;
};

export const MeetingIdView = ({meetingId}: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId }),
    )
   const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const removeMeeting = useMutation(
            trpc.meetings.remove.mutationOptions({
                onSuccess: async () => {
                    await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                    // Todo: Invalidate free tier usage
                     await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
                    router.push("/meetings")
                },
                onError: (error) => {
                    toast.error(error.message)
                }
            })
         );
        
         const [RemoveConfirmation, confirmRemove] = useConfirm(
            "Are you sure?",
            `The following action will remove ${data.name} associated meetings`
         );
    
         const handleRemoveMeeting = async() => {
                   const ok = await confirmRemove();
                    if(!ok) return;
    
            await removeMeeting.mutateAsync({id: meetingId});
         }

        const isActive = data.status === "active";
        const isCompleted = data.status === "completed";
        const isCancelled = data.status === "cancelled";
        const isUpcoming = data.status === "upcoming";
        const isProcessing = data.status === "processing";
   return(
    <>
    <RemoveConfirmation/>
    <UpdateMeetingDialog
            open={updateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={data}/>
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
    <MeetingIdViewHeader
    meetingId={meetingId}
    meetingName={data.name}
    onEdit={()=>{setUpdateMeetingDialogOpen(true)}}
    onRemove={handleRemoveMeeting}/>
         {isCancelled && <CancelledState/>}
         {isProcessing && <ProcessingState/>}
         {isCompleted && <CompletedState data={data}/>}
         {isActive && <ActiveState meetingId={meetingId}/>}
         {isUpcoming && <UpcomingState
                         meetingId={meetingId}
                         />}

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