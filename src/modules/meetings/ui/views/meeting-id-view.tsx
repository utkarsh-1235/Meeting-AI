"use client"
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MeetingIdViewHeader } from "../Components/meeting-id-view-header";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { UpdateMeetingDialog } from "../Components/update-meeting-dialog";
import { useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";

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
         <div className="bg-white rounded-lg border">
                      <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                        <div className="flex items-center gap-x-3">
                            <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={data.name}
                            className="size-10"/>
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>
                        <Badge
                        variant="outline"
                        className="flex items-center gap-x-2 [&>svg]:size-4">
                           <VideoIcon className="text-blue"/>
                           {/* {data} {data.count === 1 ? "meeting" : "meetings"} */}
                        </Badge>
                        <div className="flex flex-col gap-y-4">
                            <p className="text-lg font-medium">{}</p>
                            <p className="text-neutral-800">{data.status}</p>
                        </div>
                      </div>
                    </div>
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